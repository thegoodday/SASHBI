<!DOCTYPE HTML>
<%@ page language="java" contentType= "text/html; charset=UTF-8" %>
<%@ page language="java" 
    import="com.sas.datatypes.DataTypeInterface,
			com.sas.prompts.PromptValuesInterface,
			com.sas.prompts.definitions.*,
			com.sas.prompts.definitions.shared.*,
			com.sas.prompts.groups.*,
			com.sas.prompts.groups.shared.SharedTransparentGroup,
			com.sas.prompts.groups.PromptGroupInterface,
			com.sas.prompts.valueprovider.dynamic.DataProvider,
com.sas.prompts.valueprovider.dynamic.workspace.PromptColumnValueProvider,
com.sas.services.ServiceException,
com.sas.storage.exception.ServerConnectionException,
java.rmi.RemoteException,
com.sas.services.information.metadata.PhysicalTableInterface,
com.sas.services.information.metadata.SASLibraryInterface,
com.sas.storage.simplesqlmodel.ColumnInfo,
com.sas.storage.simplesqlmodel.ColumnOperand,
com.sas.storage.simplesqlmodel.Expression,
com.sas.storage.simplesqlmodel.OperandInterface,
com.sas.storage.simplesqlmodel.OperatorInterface,
com.sas.prompts.simplesqlmodel.PromptValueOperand,
com.sas.storage.simplesqlmodel.WhereClause,
com.sas.storage.valueprovider.StaticValueProvider,
com.sas.storage.valueprovider.ValueProviderException,
com.sas.storage.valueprovider.ValueProviderInterface,
com.sas.prompts.valueprovider.dynamic.DataProviderUtil,

			com.sas.services.session.SessionContextInterface,
			com.sas.services.storedprocess.*,
			com.sas.services.user.UserContextInterface,
			com.sas.storage.valueprovider.*,
			com.sas.web.keys.CommonKeys,
			com.sas.hbi.storedprocess.StoredProcessFacade,
			com.sas.hbi.tools.*,
			com.sas.hbi.property.*,
			org.apache.log4j.*,
			org.json.*,
			java.text.DateFormat,
			java.text.ParseException,
			java.text.SimpleDateFormat,
			java.io.*,
			java.net.*,
			java.util.*"
%>
<jsp:useBean id="userDefinedHeader" class="com.sas.hbi.tools.UserDefinedHeader"/>
<jsp:useBean id="stpNote" class="com.sas.hbi.tools.STPNote"/>
<%!
	private static String hStr="";																			//for JSP
	Logger logger = Logger.getLogger("prtPromptCondi");												//for JSP
	//logger.setLevel(Level.DEBUG); 																			//for JSP
	public void prtPromptCondi(List<PromptDefinitionInterface> promptDefinitions,HashMap<String, List<String>> map,HttpServletRequest request,JspWriter out) throws IOException{
		Locale locale=request.getLocale();
		for (int i = 0; i < promptDefinitions.size(); i++) {
			PromptDefinitionInterface pdi = promptDefinitions.get(i);
			logger.debug("getPromptName : "+pdi.getPromptName() + ":" + pdi.toString());
			String multiple="";
			String isPromptHidden="";

			if(pdi.isHidden()){			//==> [런타임시 숨기기]여도 출력하고 hidden시켜야 함
				isPromptHidden="style='display:none;'";
			}
			if (pdi instanceof TextDefinition){
				TextDefinition td = (TextDefinition)pdi;
				ValueProviderInterface vs=td.getValueProvider();
				String dftValue="";
				if(td.isDefaultValueSet()){
					Object oDV=td.getDefaultValue();
					String otype=oDV.getClass().getName();
					logger.debug(pdi.getPromptName() + " Object oDV type : " 		+ otype);
					dftValue=oDV.toString();
				}
				logger.debug(pdi.getPromptName() + " dftValue : " 		+ dftValue);
								
				if (vs == null){				// text Input
					String onChg="";
					if(map.containsKey(pdi.getPromptName())) {
						onChg="onKeyPress=\"onChange_"+pdi.getPromptName()+"();\" ";
					}

					int size=td.getMaximumLength();
					if (pdi.getPromptName().toUpperCase().startsWith("_STPREPORT_LF")){											
						hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " style='width:1px;'><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabelLF'>&nbsp;"										
								+"</td><td id=cdData" + pdi.getPromptName() + " class=condLabelLF>&nbsp;</td></tr></table></span>";								
						out.println(hStr);										
					} else if (pdi.getPromptName().toUpperCase().startsWith("_STPREPORT_DUMMY")){
						hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabelDummy'>&nbsp;"
								+"</td><td id=cdData" + pdi.getPromptName() + " class=condData>&nbsp;</td></tr></table></span>";
						out.println(hStr);
					} else {
						hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
								+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><input id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName()
								+" alt='" + pdi.getPromptDescription(locale) + "' value=\"" + dftValue + "\"" + " size=" + size
								+ " " + onChg + " /></td></tr></table></span>";
						out.println(hStr);
					}
				} else if(vs instanceof StaticValueProvider){
					String onChg="";
					int maxLength=((TextDefinition) pdi).getMaximumLength();
					int maxVal=((TextDefinition) pdi).getMaximumValueCount();
					logger.debug(pdi.getPromptName() + " getMaximumLength : " + maxLength);
					logger.debug(pdi.getPromptName() + " getMaximumValueCount : " + maxVal);
					if (maxVal > 10) maxVal=10;
					int selectionType=td.getSelectionType();
					if (selectionType > 300) multiple=" multiple ";
					
					if(map.containsKey(pdi.getPromptName())) {
						onChg="onChange=\"onChange_"+pdi.getPromptName()+"();\" ";
					}
					int orgMaxLength = ((TextDefinition) pdi).getMaximumLength();
					logger.debug(pdi.getPromptName() + " orgMaxLength : " + orgMaxLength);
					if (orgMaxLength == 100000){
						hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
								+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><div id=slt" + pdi.getPromptName() ;
						hStr+= " alt='" + pdi.getPromptDescription(locale) + "' " + onChg
								+ "></div></td></tr></table></span>";
					} else {
						hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
								+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><select id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName() + multiple
								+" size=" + maxVal;
						if (maxLength > 0) {
							hStr += " style='width:" + maxLength + "px;'" ;
						}
						/*
						hStr+= " alt='" + pdi.getPromptDescription(locale)
								+ "'></select></td></tr></table></span>";
						*/
						hStr+= " alt='" + pdi.getPromptDescription(locale) + "' " + onChg
								+ "></select></td></tr></table></span>";
					}
					out.println(hStr);
				} else 	if (vs instanceof PromptColumnValueProvider){
					String onChg="";
					logger.debug("default Value: " + dftValue);
					int maxLength=((TextDefinition) pdi).getMaximumLength();
					logger.debug("maxLength:"+maxLength);
					int maxVal=((TextDefinition) pdi).getMaximumValueCount();
					if (maxVal > 10) maxVal=10;
					int selectionType=td.getSelectionType();
					if (selectionType > 300) multiple=" multiple ";

					if(map.containsKey(pdi.getPromptName())) {
						onChg="onChange=\"onChange_"+pdi.getPromptName()+"();\" ";
					}
					int orgMaxLength = ((TextDefinition) pdi).getMaximumLength();
					if (orgMaxLength == 100000){
						hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
								+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><div id=slt" + pdi.getPromptName() ;
						hStr+= " alt='" + pdi.getPromptDescription(locale) + "' " + onChg
								+ "></div></td></tr></table></span>";
					} else {
						hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
								+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><select id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName() + multiple
								+" size=" + maxVal;
						if (maxLength > 0) {
							hStr += " style='width:" + maxLength + "px;'" ;
						}
						hStr+= " alt='" + pdi.getPromptDescription(locale) + "' " + onChg
								+ "></select></td></tr></table></span>";
					}
					out.println(hStr);
				}

			} else if (pdi instanceof IntegerDefinition) {
				IntegerDefinition id = (IntegerDefinition)pdi;
				ValueProviderInterface idvs=id.getValueProvider(); 
				String dftValue="";
				if(id.isDefaultValueSet()){
					Object oDV=id.getDefaultValue();          
					dftValue=oDV.toString();
					logger.debug("id.getDefaultValue():" + id.getDefaultValue());
				}
				if (idvs instanceof PromptColumnValueProvider){
					String onChg="";
					/*
					*/
					logger.debug("default Value: " + dftValue);

					int maxLength=((IntegerDefinition) pdi).getMaximum();
					int maxVal=((IntegerDefinition) pdi).getMaximumValueCount();
					logger.debug("maxLength:"+maxLength);
					logger.debug("maxVal:"+maxVal);
					if (maxVal > 10) maxVal=10;
					int selectionType=id.getSelectionType();
					if (selectionType > 300) multiple=" multiple ";

					if(map.containsKey(pdi.getPromptName())) {
						onChg="onChange=\"onChange_"+pdi.getPromptName()+"();\" ";
					}

					hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
							+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><select id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName() + multiple
							+" size=" + maxVal;
					if (maxLength > 0) {
						hStr += " style='width:" + maxLength + "px;'" ;
					}
					hStr+= " alt='" + pdi.getPromptDescription(locale) + "' " + onChg
							+ "></select></td></tr></table></span>";
					out.println(hStr);

				} else {
					hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
							+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><input type=text id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName()
							+" alt='" + pdi.getPromptDescription(locale) + "' size=8 value='" + id.getDefaultValue()
							+ "' /></td></tr></table></span>";
					out.println(hStr);
				}
			} else if (pdi instanceof DoubleDefinition) {
				DoubleDefinition dd = (DoubleDefinition)pdi;
				logger.debug("dd.getDefaultValue():" + dd.getDefaultValue());

				hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
						+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><input type=text id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName()
						+" alt='" + pdi.getPromptDescription(locale) + "' size=8 value='" + dd.getDefaultValue()
						+ "' /></td></tr></table></span>";
				out.println(hStr);

			} else if (pdi instanceof SharedTextDefinition){
				SharedTextDefinition sd = (SharedTextDefinition)pdi;
				ValueProviderInterface vs=sd.getValueProvider();
				if (vs == null){				// text Input
				} else if(vs instanceof StaticValueProvider){
					int maxLength=((SharedTextDefinition) pdi).getMaximumLength();
					logger.debug("maxLength:"+maxLength);
					int maxVal=((SharedTextDefinition) pdi).getMaximumValueCount();
					if (maxVal > 10) maxVal=10;
					int selectionType=sd.getSelectionType();
					if (selectionType > 300) multiple=" multiple ";
					hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
							+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><select id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName() + multiple
							+"size=" + maxVal;
					if (maxLength > 0) {
						hStr += " style='width:" + maxLength + "px;'" ;
						logger.debug("maxLength:"+maxLength);
					}
					hStr+= " alt='" + pdi.getPromptDescription(locale)
							+ "'></select></td></tr></table></span>";
					out.println(hStr);
				} else 	if (vs instanceof PromptColumnValueProvider){
					String onChg="";
					if(map.containsKey(pdi.getPromptName())) {
						onChg="onChange=\"onChange_"+pdi.getPromptName()+"();\" ";
					}
					int selectionType=sd.getSelectionType();
					logger.debug(sd.getPromptName()+" selectionType: " + selectionType);
					if (selectionType > 300) multiple=" multiple ";
					hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
							+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><select id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName() + multiple
							+" alt='" + pdi.getPromptDescription(locale) + "' " + onChg
							+ "></select></td></tr></table></span>";
					out.println(hStr);
				}
			} else if (pdi instanceof DateDefinition){
				if(pdi.isDefaultValueSet()){
					Object kk=pdi.getDefaultValue();
					logger.debug("Default Value:"+kk.toString());
				}
				hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
						+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><input id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName()
						+" alt='" + pdi.getPromptDescription(locale)
						+ "' style='width:72px;text-align:center;' size=8 value='' ><img src='./images/Calendar.gif' border=0 onClick='slt"+pdi.getPromptName()+".focus();' style='cursor:pointer'></td></tr></table></span>";
				out.println(hStr);
			} else if (pdi instanceof DateRangeDefinition){
				hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
						+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><input id=slt" + pdi.getPromptName() + "_start name=slt" + pdi.getPromptName()
						+"_start alt='" + pdi.getPromptDescription(locale)
						+ "' size=8 style='width:72px;text-align:center;' /><img src='./images/Calendar.gif' border=0 onClick='slt"+pdi.getPromptName()+"_start.focus();' style='cursor:pointer'>~<input id=slt" + pdi.getPromptName() + "_end name=slt" + pdi.getPromptName()
						+ "_end alt='" + pdi.getPromptDescription(locale)
						+ "' size=8 style='width:72px;text-align:center;' /><img src='./images/Calendar.gif' border=0 onClick='slt"+pdi.getPromptName()+"_end.focus();' style='cursor:pointer'></td></tr></table></span>";
				out.println(hStr);
			} else if (pdi instanceof SharedDateDefinition){
				hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
						+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><input id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName()
						+" alt='" + pdi.getPromptDescription(locale)
						+ "' style='width:72px;text-align:center;' size=8><img src='./images/Calendar.gif' border=0 onClick='slt"+pdi.getPromptName()+".focus();' style='cursor:pointer'></td></tr></table></span>";
				out.println(hStr);
			} else if (pdi instanceof SharedDateRangeDefinition){
				hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
						+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><input id=slt" + pdi.getPromptName() + "_start name=slt" + pdi.getPromptName()
						+"_start alt='" + pdi.getPromptDescription(locale)
						+ "' size=8 style='width:72px;text-align:center;' /><img src='./images/Calendar.gif' border=0 onClick='slt"+pdi.getPromptName()+"_start.focus();' style='cursor:pointer'>~<input id=slt" + pdi.getPromptName() + "_end name=slt" + pdi.getPromptName()
						+ "_end alt='" + pdi.getPromptDescription(locale)
						+ "' size=8 style='width:72px;text-align:center;' /><img src='./images/Calendar.gif' border=0 onClick='slt"+pdi.getPromptName()+"_end.focus();' style='cursor:pointer'></td></tr></table></span>";
				out.println(hStr);
			} else if (pdi instanceof InputFileDefinition){
				InputFileDefinition ifd = (InputFileDefinition)pdi;

				hStr="<span class='titleimg condItem' " + isPromptHidden + "><table id=cdTbl" + pdi.getPromptName() + " class=itemTable><tr><form name=fomUpload method=post enctype='multipart/form-data'><td id=cdLabel" + pdi.getPromptName() + " class='condLabel'>"+pdi.getPromptLabel(locale)
						+"</td><td id=cdData" + pdi.getPromptName() + " class=condData><input type='file' id=slt" + pdi.getPromptName() + " name=slt" + pdi.getPromptName()
						+" alt='" + pdi.getPromptDescription(locale) + "' value=''" + " size=''" + ""
						+ " multiple /></td></form></tr></table></span>";
				out.println(hStr);
				
			}
		}

	}
	public void prtGenFunction(List<PromptDefinitionInterface> promptDefinitions,HashMap<String, List<String>> map, List<String> defInfo, HttpServletRequest request, JspWriter out) throws IOException, ValueProviderException, ServerConnectionException, ServiceException{
		//Logger logger = Logger.getLogger("prtGenFunction");
		int prmptNum=0;
		DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");

		for (int i = 0; i < promptDefinitions.size(); i++) {
			Locale locale=request.getLocale();
			PromptDefinitionInterface pdi = promptDefinitions.get(i);
			if (pdi instanceof TextDefinition){
				TextDefinition td = (TextDefinition)pdi;
				ValueProviderInterface vs=td.getValueProvider();
				if (vs == null){				// text Input
					out.println("function get_" + pdi.getPromptName() + "(){");
					//out.println("alert(\"" + pdi.getPromptName() + "\");");
					//Object oDV=td.getDefaultValue();
					//logger.debug("TextDefinition: " + oDV.toString());
					out.println("}");

				} else if(vs instanceof StaticValueProvider){
					out.println("function get_" + pdi.getPromptName() + "(){");
					String dftOption="";
					if(td.isDefaultValueSet()){
						Object oDV=td.getDefaultValue();
						dftOption=oDV.toString();
						logger.debug("dftOption : " + dftOption);
					}
					List items=(List)vs.getValues(locale);
					Iterator it=items.iterator();
					int orgMaxLength = ((TextDefinition) pdi).getMaximumLength();
					logger.debug(pdi.getPromptName() + " orgMaxLength2 : " + orgMaxLength);
					while(it.hasNext()){
						Object oy = it.next();
						String label=oy.toString();
						Object oLabel=((StaticValueProvider) vs).getValueForLabel(label, locale);
						String value=oLabel.toString();
						String selected="";
						if (dftOption.equals(value)) selected=" selected";
						if (orgMaxLength == 100000 ){
							if(td.isDefaultValueSet()){
								Object objDftVal=td.getDefaultValue();
								String otype=objDftVal.getClass().getName();
								if (otype.equalsIgnoreCase("java.util.ArrayList")){
									ArrayList dft_values = (ArrayList)td.getDefaultValue();
									int idx_dft_val = dft_values.indexOf(value);
									logger.debug("idx_dft_val : " + idx_dft_val);
									if (idx_dft_val >= 0) selected=" checked";
								} else {
									logger.debug("idx_dft_val : not ArrayList!!!!!");
								}
							} else {
								if (selected.equalsIgnoreCase(" selected")) selected=" checked";
							}
							out.println("\t$(\"#slt" +pdi.getPromptName()+  "\").append(\"<input type=checkbox id=slt" + pdi.getPromptName() + " value='" + value +"'" + selected + " >" + label + "</input>&nbsp;\");");
						} else {
							if(td.isDefaultValueSet()){
								Object objDftVal=td.getDefaultValue();
								String otype=objDftVal.getClass().getName();
								if (otype.equalsIgnoreCase("java.util.ArrayList")){
									ArrayList dft_values = (ArrayList)td.getDefaultValue();
									int idx_dft_val = dft_values.indexOf(value);
									logger.debug("idx_dft_val : " + idx_dft_val);
									if (idx_dft_val >= 0) selected=" selected";
								} else {
									logger.debug("idx_dft_val : not ArrayList!!!!!");
								}
							}
							out.println("\t$(\"#slt" +pdi.getPromptName()+  "\").append(\"<option value=" + value + selected + " >" + label + "</option>\");");
							logger.debug("\tparameter value :  " + label + " / " + value + dftOption);
						}
					}
					out.println("}");

				} else if (vs instanceof PromptColumnValueProvider){
					prmptNum++;
					genPCVScript (pdi,vs, dataProvider, map, defInfo, locale, out);
				}
			} else if (pdi instanceof IntegerDefinition) {
				IntegerDefinition id = (IntegerDefinition)pdi;
				ValueProviderInterface vs=id.getValueProvider();
				if (vs instanceof PromptColumnValueProvider){
					prmptNum++;
					genPCVScript (pdi,vs, dataProvider, map, defInfo, locale, out);
				}
			} else if (pdi instanceof DoubleDefinition) {
				DoubleDefinition dd = (DoubleDefinition)pdi;
				ValueProviderInterface vs=dd.getValueProvider();
				if (vs instanceof PromptColumnValueProvider){
					prmptNum++;
					genPCVScript (pdi,vs, dataProvider, map, defInfo, locale, out);
				}
			} else if (pdi instanceof DateDefinition) {
				String dftDateString="";
				if(pdi.isDefaultValueSet()){
					Object dftDate=pdi.getDefaultValue();
					logger.debug("Here dftDateString:"+dftDate.toString());
					String dateType=dftDate.toString().substring(0,1);
					if (dateType.equals("D")) {
						dftDateString=Stub.getDefaultDate(dftDate.toString());
					} else if (dateType.equals("M")) {
						dftDateString=Stub.getDefaultDate(dftDate.toString()).substring(0,7);
					} else if (dateType.equals("Y")) {
						dftDateString=Stub.getDefaultDate(dftDate.toString()).substring(0,4);
					} else {
						dftDateString=Stub.getDefaultDate(dftDate.toString());
					}
					logger.debug("dftDateString:"+dftDateString);
				}
				out.println("function get_" + pdi.getPromptName() + "(){");
				out.println("\t$(\"#slt" + pdi.getPromptName() + "\").val(\"" + dftDateString + "\");");
				out.println("}");
			} else if (pdi instanceof DateRangeDefinition) {
				//DateRangeDefinition dr = (DateRangeDefinition)pdi;
				String minDateString="";
				String maxDateString="";
				String minDateType="";
				String maxDateType="";
				if(pdi.isDefaultValueSet()){
					/*
					Date minDate=dr.getMinimum();
					minDateString=Stub.getDefaultDate(minDate.toString());
					Date maxDate=dr.getMaximum();
					maxDateString=Stub.getDefaultDate(maxDate.toString());
					*/
					Object dftDateR=pdi.getDefaultValue();
					Date dftRange[]=(Date[])dftDateR;
					minDateString=Stub.getDefaultDate(dftRange[0].toString());
					maxDateString=Stub.getDefaultDate(dftRange[1].toString());
					minDateType=dftRange[0].toString().substring(0,1);
					maxDateType=dftRange[1].toString().substring(0,1);
					logger.debug("minDateType : "+minDateType);
					logger.debug("maxDateType : "+maxDateType);
					logger.debug("Length:"+dftRange[0].toString().length());
					if (dftRange[0].toString().length()==12 && dftRange[0].toString().length()==12) {
						minDateType="D";
						maxDateType="D";
					}
					logger.debug("dftRange[0].toString():"+dftRange[0].toString());
					logger.debug("dftRange[1].toString():"+dftRange[1].toString());
					logger.debug("minDateString:"+minDateString);
					logger.debug("maxDateString:"+maxDateString);
					logger.debug("minDateType:"+minDateType);
					logger.debug("minDateType:"+minDateType);
				}
				out.println("function get_" + pdi.getPromptName() + "(){");
				if (minDateType.equals("D")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_start\").val(\"" + minDateString + "\");");
				} else if (minDateType.equals("M")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_start\").val(\"" + minDateString.substring(0,7) + "\");");
				} else if (minDateType.equals("Y")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_start\").val(\"" + minDateString.substring(0,4) + "\");");
				}
				if (maxDateType.equals("D")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_end\").val(\"" + maxDateString + "\");");
				} else if (maxDateType.equals("M")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_end\").val(\"" + maxDateString.substring(0,7) + "\");");
				} else if (maxDateType.equals("Y")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_end\").val(\"" + maxDateString.substring(0,4) + "\");");
				}

				//out.println("console.log(\"TEST=================>\");");
				out.println("}");
			} else if (pdi instanceof SharedDateDefinition) {
				String dftDateString="";
				if(pdi.isDefaultValueSet()){
					Object dftDate=pdi.getDefaultValue();
					logger.debug("Here dftDateString:"+dftDate.toString());
					String dateType=dftDate.toString().substring(0,1);
					logger.debug("dftDate.toString() : "+dftDate.toString());
					if (dftDate.toString().length()>6) {
						dateType="D";
					}
					if (dateType.equals("D")) {
						dftDateString=Stub.getDefaultDate(dftDate.toString());
					} else if (dateType.equals("M")) {
						dftDateString=Stub.getDefaultDate(dftDate.toString()).substring(0,7);
					} else if (dateType.equals("Y")) {
						dftDateString=Stub.getDefaultDate(dftDate.toString()).substring(0,4);
					}
					logger.debug("dftDateString:"+dftDateString);
				}
				out.println("function get_" + pdi.getPromptName() + "(){");
				out.println("\t$(\"#slt" + pdi.getPromptName() + "\").val(\"" + dftDateString + "\");");
				out.println("}");


			} else if (pdi instanceof SharedDateRangeDefinition) {
				String minDateString="";
				String maxDateString="";
				String minDateType="";
				String maxDateType="";
				if(pdi.isDefaultValueSet()){
					Object dftDateR=pdi.getDefaultValue();
					Date dftRange[]=(Date[])dftDateR;
					minDateString=Stub.getDefaultDate(dftRange[0].toString());
					maxDateString=Stub.getDefaultDate(dftRange[1].toString());
					minDateType=dftRange[0].toString().substring(0,1);
					maxDateType=dftRange[1].toString().substring(0,1);
					logger.debug("minDateType : "+minDateType);
					logger.debug("maxDateType : "+maxDateType);
					logger.debug("minDateString : "+minDateString);
					//if (dftRange[0].toString().length()==12 && dftRange[0].toString().length()==12) {
					if (dftRange[0].toString().length()>6) {
						minDateType="D";
						maxDateType="D";
					}
				}
				out.println("function get_" + pdi.getPromptName() + "(){");
				if (minDateType.equals("D")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_start\").val(\"" + minDateString + "\");");
				} else if (minDateType.equals("M")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_start\").val(\"" + minDateString.substring(0,7) + "\");");
				} else if (minDateType.equals("Y")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_start\").val(\"" + minDateString.substring(0,4) + "\");");
				}
				if (maxDateType.equals("D")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_end\").val(\"" + maxDateString + "\");");
				} else if (maxDateType.equals("M")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_end\").val(\"" + maxDateString.substring(0,7) + "\");");
				} else if (maxDateType.equals("Y")) {
					out.println("\t$(\"#slt" + pdi.getPromptName() + "_end\").val(\"" + maxDateString.substring(0,4) + "\");");
				}

				//out.println("console.log(\"TEST=================>\");");
				out.println("}");

			} else if (pdi instanceof SharedTextDefinition){
				SharedTextDefinition sd = (SharedTextDefinition)pdi;
				ValueProviderInterface vs=sd.getValueProvider();
				if (vs == null){				// text Input
					out.println("function get_" + pdi.getPromptName() + "(){");

					//Object oDV=sd.getDefaultValue();
					//logger.debug("SharedTextDefinition: " + oDV.toString());
					out.println("}");

				} else if(vs instanceof StaticValueProvider){
					out.println("function get_" + pdi.getPromptName() + "(){");

					List items=(List)vs.getValues(locale);
					Iterator it=items.iterator();
					while(it.hasNext()){
						Object oy = it.next();
						String label=oy.toString();
						Object oLabel=((StaticValueProvider) vs).getValueForLabel(label, locale);
						String value=oLabel.toString();
						out.println("\t$(\"#slt" +pdi.getPromptName()+  "\").append(\"<option value=" + value + " >" + label + "</option>\");");
						logger.debug("\tparameter value :  " + label + " / " + value);
					}
					out.println("}");

				} else 	if (vs instanceof PromptColumnValueProvider){
					prmptNum++;
					genPCVScript (pdi,vs, dataProvider, map, defInfo, locale, out);
				}
			}
		}
		for (int mm=0;mm<defInfo.size();mm++){
			List lstT=map.get(defInfo.get(mm));
			logger.debug("\tColname:"+defInfo.get(mm));
			out.println("function onChange_"+defInfo.get(mm)+"(){");
			for(int jj=0; jj<lstT.size();jj++){
				logger.debug("\t\tDefinfo:" +lstT.get(jj));
				//out.println("\t"+"console.log(\"TEST Here\");");
				out.println("\tget_" + lstT.get(jj)+"();");
			}
			out.println("}");
		}
	}
	private void genPCVScript (PromptDefinitionInterface pdi,ValueProviderInterface vs, DataProvider dataProvider,
			HashMap<String, List<String>> map,List<String> defInfo,
			Locale locale, JspWriter out) 
					throws UnsupportedEncodingException, ServerConnectionException, RemoteException, ServiceException, IOException{
		//Logger logger = Logger.getLogger("genPCVScript");
		//logger.addAppender(new ConsoleAppender(new PatternLayout("%d %t %-5p %m \n")));
		logger.debug("Parameter Name: " + pdi.getPromptName());
		String dftValue="";
		String oType="";
		int orgMaxLength = 0;
		if (pdi instanceof TextDefinition){
			TextDefinition td = (TextDefinition)pdi;
			orgMaxLength = ((TextDefinition) pdi).getMaximumLength();
			if (orgMaxLength == 100000) oType="chk";
			if(td.isDefaultValueSet()){
				Object oDV=td.getDefaultValue();
				dftValue=oDV.toString();
			}
		} else if (pdi instanceof IntegerDefinition){
			IntegerDefinition td = (IntegerDefinition)pdi;
			if(td.isDefaultValueSet()){
				Object oDV=td.getDefaultValue(); 
				dftValue=oDV.toString();
			}
		} else if (pdi instanceof DoubleDefinition){
			DoubleDefinition td = (DoubleDefinition)pdi;
			if(td.isDefaultValueSet()){
				Object oDV=td.getDefaultValue();
				dftValue=oDV.toString();
			}
		} else if (pdi instanceof SharedTextDefinition){
			SharedTextDefinition td = (SharedTextDefinition)pdi;
			orgMaxLength = ((SharedTextDefinition) pdi).getMaximumLength();
			if (orgMaxLength == 100000) oType="chk";
			if(td.isDefaultValueSet()){
				Object oDV=td.getDefaultValue();
				dftValue=oDV.toString();
			}
		}
		logger.debug("genPCVScript orgMaxLength : " + orgMaxLength);		
		String lib=((PromptColumnValueProvider) vs).getLibref();
		String tablename=((PromptColumnValueProvider) vs).getTableName();
		String tabURL=((PromptColumnValueProvider) vs).getTableUrl();
		PhysicalTableInterface physicalTable = (dataProvider).getPhysicalTable(tabURL);
		tablename=physicalTable.getName();
		SASLibraryInterface library = DataProviderUtil.getLibrary(physicalTable, locale);
		//SASLibraryInterface library = DataProviderUtil.getLibrary(physicalTable);
		String libref = library.getLibref();
		String libEng = library.getEngine();
		String libStmt = library.generateLibref();
		ColumnInfo colinfo=((PromptColumnValueProvider) vs).getValueColumn();
		String colName=colinfo.getName();
		String colSortOrder=colinfo.getSortOrder();
		ColumnInfo labelInfo=((PromptColumnValueProvider) vs).getLabelColumn();

		String labelName="";
		String labelSortOrder="";
		if(labelInfo != null){
			labelName=labelInfo.getName();
			labelSortOrder=labelInfo.getSortOrder();
		}
		String memname=libref+"."+tablename ;

		boolean isRequired=pdi.isRequired();
		boolean isDisplayValue=((PromptColumnValueProvider) vs).isValueDisplayed();
		boolean isDistinct=((PromptColumnValueProvider) vs).isDistinct();
		boolean isFormatLabels=((PromptColumnValueProvider) vs).isFormatLabels();
		boolean isFormatValues=((PromptColumnValueProvider) vs).isFormatValues();
		boolean isTrimLabels=((PromptColumnValueProvider) vs).isTrimLabels();
		boolean isTrimValues=((PromptColumnValueProvider) vs).isTrimValues();
		boolean getUseValueAsLabel=((PromptColumnValueProvider) vs).getUseValueAsLabel();
		boolean needQuoting=((PromptColumnValueProvider) vs).needQuoting();
		logger.debug("Parameter isDisplayValue\t: " + isDisplayValue);
		logger.debug("Parameter isDistinct\t: " + isDistinct);
		logger.debug("Parameter isFormatLabels\t: " + isFormatLabels);
		logger.debug("Parameter isFormatValues\t: " + isFormatValues);
		logger.debug("Parameter isTrimLabels\t: " + isTrimLabels);
		logger.debug("Parameter isTrimValues\t: " + isTrimValues);
		logger.debug("Parameter getUseValueAsLabel\t: " + getUseValueAsLabel);
		logger.debug("Parameter needQuoting\t: " + needQuoting);
		
		out.println("function get_" + pdi.getPromptName() + "(){");
		String opName=""; String opValue="";
		List<String> wStr = new ArrayList<String>();
		WhereClause whClause=((PromptColumnValueProvider) vs).getWhereClause();
		if (whClause!=null) {
			OperandInterface whCond = whClause.getCondition();
			if (whCond instanceof Expression) {					
				traverseExpression(pdi, whCond, wStr, map, defInfo, logger);
			}
		}
		libStmt.replaceAll("\"","'");
		String spPgm="SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)";
		String param1="";
		for(int ii=0;ii<wStr.size();ii++){
			param1+=wStr.get(ii)+":";
		} 
		libStmt=libStmt.replaceAll("\"","\'");
		libStmt=libStmt.replaceAll("\n","");
		libStmt=URLEncoder.encode(libStmt,"UTF8");
		out.println("\tgetParamVal(\""+spPgm+"\",\""+memname+"\",\""+colName+"\",\""+pdi.getPromptName()+"\",\""+libStmt+"\",\""+param1+ "\",\""+colSortOrder+"\",\""+labelName+"\",\""+labelSortOrder+"\",\""+isDisplayValue+"\",\""+ dftValue +"\",\""+ isRequired+"\",\""+oType+"\");");
		//out.println("\t$(\"#dvDummy\").html(sasRes);");
		String jscript="";
		//logger.debug("isRequired: "+ pdi.isRequired());
		/*
		if (!pdi.isRequired()){
			//jscript="$(\"#slt" + pdi.getPromptName() + "\").prepend(\"<option value=''>전체</option>\");";
			//out.println("\t"+jscript);			
		}
		if (!dftValue.equalsIgnoreCase("")){
			jscript="$(\"#slt" + pdi.getPromptName() + "\").val(\"" + dftValue.trim() + "\").prop(\"selected\", true);";
			out.println("\t"+jscript);
		} else {
			jscript="$(\"#slt" + pdi.getPromptName() + " option:eq(0)\").prop(\"selected\", true)";
			out.println("\t"+jscript);			
		}
		//out.println("\t$(\"#progressIndicatorWIP\").hide();");
		*/		
		out.println("}");			
	}	
	private void traverseExpression(PromptDefinitionInterface pdi, OperandInterface whCond, List<String> wStr, 
			HashMap<String, List<String>> map,List<String> defInfo, Logger logger){
		String opName=""; String opValue="";
		List opL=((Expression) whCond).getOperands();
		OperatorInterface op=((Expression) whCond).getOperator();
		Iterator it = opL.iterator();
		while(it.hasNext()){
			Object oy = it.next(); 
			if (oy instanceof ColumnOperand) {
				opName=oy.toString();
			} else if (oy instanceof PromptValueOperand) {
				PromptDefinitionInterface pdf=((PromptValueOperand) oy).getPromptDefinition();
				opValue=pdf.getPromptName();
				wStr.add(opName+"="+opValue);
				logger.debug("\t\tOperand value :  " + opName+"\t "+opValue);
				if(!map.containsKey(opValue)) {
					map.put(opValue, new ArrayList<String>());
					defInfo.add(opValue);
				}
				List defList1=map.get(opValue);
				defList1.add(pdi.getPromptName());
			} else if (oy instanceof Expression) {
				traverseExpression(pdi, (OperandInterface)oy, wStr, map, defInfo, logger);
			} 
			else {
				logger.debug("oy is new instance" + oy.toString());
			}
		}		
	}		
%>	

<%
response.setHeader("Pragma", "No-cache");
response.setHeader("Cache-Control", "no-cache");
response.setHeader("Expires", "0");
String contextName = application.getInitParameter("application-name");
//Logger logger = Logger.getLogger("STPRV");
//logger.setLevel(Level.DEBUG); 



int maxTime = session.getMaxInactiveInterval();
long lastAccTime = session.getLastAccessedTime();
String desc="";
String dftVal="";
String rptType="";
String custOutJS="";
String hStr="";
String opName="";
String opValue="";
int prmptNum=0;
Locale locale=request.getLocale();

SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);

ServletContext context = getServletContext();
String sp_pathUrl =(String)request.getSession().getAttribute("sp_pathUrl");
StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
StoredProcess2Interface stp2 = (StoredProcess2Interface)facade.getStoredProcess();
String metaID=facade.getMetaID();
userDefinedHeader.setStpObjId(facade.getMetaID());

stpNote.setStpObjId(facade.getMetaID());
String layoutStr=stpNote.getSTPNote(sci,"Layout");
String DRInfo	=stpNote.getSTPNote(sci,"DataRole");
	
logger.debug("layoutStr : "+layoutStr);
logger.debug("DRInfo : "+DRInfo);
logger.debug("sp_pathUrl : "+sp_pathUrl);

DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");
UserContextInterface userContext = (UserContextInterface)request.getSession().getAttribute(CommonKeys.USER_CONTEXT);
List groupList = userContext.getGroups();
logger.debug("Groups: " + groupList.toString());
logger.debug("isReportAdmin: " + userContext.isInGroup("Report Admin"));

if (stp2.getDescription().equalsIgnoreCase("")) {desc=stp2.getName();}
else {desc=stp2.getDescription();}
int isDLM=desc.indexOf("|");
if(isDLM > 0) {
	desc=desc.substring(0,isDLM); 
} 
logger.debug("sp_desc::::::::::::::::::::"+desc);

PromptValuesInterface pvi  = stp2.getPromptValues();
PromptGroupInterface pgi = pvi.getPromptGroup();
List<PromptDefinitionInterface> promptDefinitions = pgi.getPromptDefinitions(true);
logger.debug("promptDefinitions Size:"+promptDefinitions.size());

Viewer Viewer = new Viewer();

List subLT=pgi.getPromptDefinitions(true); //getPromptDefinitionsAndSubgroups();
Iterator subIter=subLT.iterator();
while(subIter.hasNext()){
	Object infoObj=subIter.next();
	if (infoObj instanceof TextDefinition){
		PromptDefinitionInterface pdi=(PromptDefinitionInterface)infoObj;
		logger.debug("TextDefinition::::::"+infoObj.toString());													
	} else if (infoObj instanceof SharedTextDefinition){
		logger.debug("SharedTextDefinition:"+infoObj.toString());
	} else if (infoObj instanceof DateDefinition){
		logger.debug("DateDefinition:"+infoObj.toString());
	} else if (infoObj instanceof ModalGroup){
		logger.debug("ModalGroup:"+infoObj.toString());
	} else if (infoObj instanceof TransparentGroup){
		logger.debug("TransparentGroup:"+infoObj.toString());
	} else if (infoObj instanceof PromptGroup){
		logger.debug("PromptGroup:"+infoObj.toString());
	} else if (infoObj instanceof SharedTransparentGroup){
		logger.debug("SharedTransparentGroup:"+infoObj.toString());
		List pdL=((SharedTransparentGroup) infoObj).getPromptSubgroups(true);
		Iterator pdIter=pdL.iterator();
		while(pdIter.hasNext()){
			Object pdf=pdIter.next();
			logger.debug("SharedTransparentGroup: "+pdf.toString());
		}
	} else {
		logger.debug("ETC==============:"+infoObj.toString());
		//com.sas.prompts.definitions.InputFileDefinition
		//InputFileDefinition ifd = (InputFileDefinition)infoObj;		
		//String eleName=ifd.getDefinitionElementName();
		
		//logger.info("eleName : " + ifd.getScripts());
	}
}



HashMap<String, String> hiddenInfo = new HashMap<String, String>();

LinkedHashMap<String, String[]> SASLogs = new LinkedHashMap<String, String[]>();
session.setAttribute("SASLogs",SASLogs);

List subL=pgi.getPromptDefinitions(true); //getPromptDefinitionsAndSubgroups();

HashMap<String, List<String>> map = new HashMap<String, List<String>>();			// Prompt dependancy info {promptName,(dependantPromptName1,...)};
HashMap<String, String> paramInfo = new HashMap<String, String>();
HashMap<String, String> datePInfo = new HashMap<String, String>();
HashMap<String, String> sharedDatePInfo = new HashMap<String, String>();
List defList=null;
List<String> defInfo = new ArrayList<String>();
List<String> multiInfo = new ArrayList<String>();
boolean isDebug=true;
boolean isOSW=false;

for (int i = 0; i < promptDefinitions.size(); i++) {
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	if(pdi.getPromptName().toUpperCase().equalsIgnoreCase("_DEBUG")){
		isDebug=true;
	}
	int selectionType=0;
	paramInfo.put(pdi.getPromptName().toUpperCase(), pdi.getPromptName());
	dftVal="";
	if (pdi.isHidden()){
		if(pdi.isDefaultValueSet()){
			dftVal=pdi.getDefaultValue().toString();
		}
		hiddenInfo.put(pdi.getPromptName().toUpperCase(), dftVal);
		logger.debug("Hidden TextDefinition:" + pdi.getPromptName().toUpperCase() + " : "+dftVal);
	}
	if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)){
		datePInfo.put(pdi.getPromptName(), "");
				if(pdi.isDefaultValueSet()){
					Object kk=pdi.getDefaultValue();
					logger.debug("Default Value:"+kk.toString());
				}
		
	} else if ((pdi instanceof DateRangeDefinition) || (pdi instanceof SharedDateRangeDefinition)){
		sharedDatePInfo.put(pdi.getPromptName(), "");
	}
	if (pdi instanceof TextDefinition){
		TextDefinition td = (TextDefinition)pdi;
		selectionType=td.getSelectionType();
	} else if (pdi instanceof SharedTextDefinition){
		SharedTextDefinition sd = (SharedTextDefinition)pdi;
		selectionType=sd.getSelectionType();
	}
	if (selectionType > 300) {
		logger.debug("selectionType:" +pdi.getPromptName()+ selectionType);
		multiInfo.add(pdi.getPromptName());
	}
}
logger.debug("multiInfo isDebug: "+multiInfo.toString());
logger.debug("hiddenInfo: "+ hiddenInfo.toString());
String excelPGM="";
if(hiddenInfo.containsKey("_STPREPORT_EXCEL_PGM")){
	excelPGM=hiddenInfo.get("_STPREPORT_EXCEL_PGM");
}
if(hiddenInfo.containsKey("_STPREPORT_TYPE")){
	rptType=hiddenInfo.get("_STPREPORT_TYPE");
	logger.debug("rptType in Metadata: "+rptType);
	if (rptType.length() > 5) {
		if ( rptType.substring(0,5).equalsIgnoreCase("opnSW") ) isOSW=true;
	}
}
logger.debug("isOSW : " + isOSW);
if(hiddenInfo.containsKey("_STPREPORT_CUST_OUTPUT")){
	custOutJS=hiddenInfo.get("_STPREPORT_CUST_OUTPUT");
	logger.debug("_STPREPORT_CUST_OUTPUT: "+custOutJS);
}
int rowsPerPage=0;
if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
	rowsPerPage=Integer.parseInt(hiddenInfo.get("_STPREPORT_PAGE"));
}
logger.debug("rowsPerPage: "+ rowsPerPage);

String ON_LOAD_COLLAPSE="";
if(hiddenInfo.containsKey("_STPREPORT_ON_LOAD_COLLAPSE")){
	ON_LOAD_COLLAPSE=hiddenInfo.get("_STPREPORT_ON_LOAD_COLLAPSE"); 
}
String ON_LOAD_SUBMIT="";
if(hiddenInfo.containsKey("_STPREPORT_ON_LOAD_SUBMIT")){
	ON_LOAD_SUBMIT=hiddenInfo.get("_STPREPORT_ON_LOAD_SUBMIT");
}
int isNoSubmitBtn=0;															
if (hiddenInfo.containsKey("_STPREPORT_NOSUBMIT_BTN")){															
	try{														
		isNoSubmitBtn=Integer.parseInt(hiddenInfo.get("_STPREPORT_NOSUBMIT_BTN"));													
	} catch (Exception e) {														
		isNoSubmitBtn=1;													
	} finally {														
	}														
}															
logger.debug("isNoSubmitBtn : " + isNoSubmitBtn);															
%>
<html lang=ko>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=IE9" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel=stylesheet href="/<%=contextName%>/styles/HtmlBlue.css">
	<link rel=stylesheet href="/<%=contextName%>/styles/Portal.css" type="text/css" />
	<link rel=stylesheet href="/<%=contextName%>/styles/custom.css" type="text/css" />

	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/css/demos.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/themes/start/jquery.ui.all.css">
	<link rel=stylesheet href="/<%=contextName%>/styles/kbStyle.css" type="text/css" />
	<!-- 
	-->


<%
if (rptType.toUpperCase().equalsIgnoreCase("OPNSWAX5GRID")){
%>
	<link rel="stylesheet" href="/<%=contextName%>/scripts/ax5/combobox/dist/ax5combobox.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/ax5/formatter/dist/ax5formatter.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/ax5/picker/dist/ax5picker.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/ax5/select/dist/ax5select.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/ax5/grid/dist/ax5grid.css">
<%	
}
else if(hiddenInfo.containsKey("_STPREPORT_OUT_LAYOUT") || isOSW){
%>
	<link rel="stylesheet" type="text/css" href="/<%=contextName%>/scripts/SlickGrid/slick.grid.css">
	<!--link rel="stylesheet" type="text/css" href="/<%=contextName%>/scripts/SlickGrid/slick-default-theme.css"-->
	<link rel="stylesheet" type="text/css" href="/<%=contextName%>/scripts/pvt/dist/pivot.css">
	<link rel="stylesheet" type="text/css" href="/<%=contextName%>/scripts/nvd3/build/nv.d3.css">
	<!--link rel="stylesheet" type="text/css" href="/<%=contextName%>/scripts/nvd3/src/nv.d3.css"-->
<%
}
%>
	<style>
<%
Viewer.prtGenStyleFromMeta(hiddenInfo,out);
Stub.incFile(hiddenInfo,"_STPREPORT_CSS", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
%>
	</style>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/ui/jquery-ui.custom.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/bitreeviewer.js"></script>
<%
logger.debug("rptType: "+rptType.toUpperCase());

if (rptType.toUpperCase().equalsIgnoreCase("OPNSWAX5GRID")){
%>
	<script src="/<%=contextName%>/scripts/ax5/core/dist/ax5core.min.js"></script>
	<script src="/<%=contextName%>/scripts/ax5/combobox/dist/ax5combobox.js"></script>
	<script src="/<%=contextName%>/scripts/ax5/formatter/dist/ax5formatter.js"></script>
	<script src="/<%=contextName%>/scripts/ax5/picker/dist/ax5picker.js"></script>
	<script src="/<%=contextName%>/scripts/ax5/select/dist/ax5select.js"></script>
	<script src="/<%=contextName%>/scripts/ax5/grid/dist/ax5grid.js	"></script>
<%	
}
else if(hiddenInfo.containsKey("_STPREPORT_OUT_LAYOUT") || isOSW){
%>
	<script src="/<%=contextName%>/scripts/jquery/format.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/lib/firebugx.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/lib/jquery.event.drag-2.2.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.core.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.formatters.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.editors.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.grid.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.groupitemmetadataprovider.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.dataview.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.autotooltips.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.cellcopymanager.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.cellrangedecorator.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.cellrangeselector.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.cellselectionmodel.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.cellexternalcopymanager.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.checkboxselectcolumn.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.rowmovemanager.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.rowselectionmodel.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/controls/slick.columnpicker.js"></script>
	<script src="/<%=contextName%>/scripts/pvt/dist/pivot.js"></script>
	
	<script src="/<%=contextName%>/scripts/d3/d3.min.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/build/nv.d3.js"></script>
	<script src="/<%=contextName%>/scripts/saveSvgAsPng/saveSvgAsPng.js"></script>
	
	
<!--	
	<script src="/<%=contextName%>/scripts/canvg-master/rgbcolor.js"></script>
	<script src="/<%=contextName%>/scripts/canvg-master/StackBlur.js"></script>
	<script src="/<%=contextName%>/scripts/canvg-master/canvg.js"></script>
	<script src="/<%=contextName%>/scripts/canvg-master/StackBlur.js"></script>

	<script src="/<%=contextName%>/scripts/nvd3/lib/d3.v3.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/nv.d3.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/tooltip.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/utils.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/interactiveLayer.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/models/legend.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/models/axis.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/models/scatter.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/models/line.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/models/lineChart.js"></script>	
	<script src="/<%=contextName%>/scripts/nvd3/src/models/pie.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/models/pieChart.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/models/discreteBar.js"></script>
	<script src="/<%=contextName%>/scripts/nvd3/src/models/discreteBarChart.js"></script>
-->	
	<script>												
$(window).resize(function () {															
	resizeFrame();														
});															
	</script>														
<%
} else {
%>
	<script>
$(window).resize(function () {
	resizeFrame();
});	
	</script>
<%	
}
%>
	<!--script src="/<%=contextName%>/jquery/js/protectCode.js"></script-->

	<script>
<%
Viewer.prtInitPromptValue(promptDefinitions, locale, out);
%>		
var isDebug="<%=isDebug%>";
var orgRptType="<%=rptType%>";
<%
JSONObject rowObj = null;
String stpInit = "[{\"funcName\":\"\",\"columnName\":\"\",\"params\":\"\",\"stp\":\"\"}]";
if (layoutStr != null){
	try{
	rowObj = new JSONObject(layoutStr);
	logger.debug("JSONObject Row Num : " + rowObj.length());	
	for (int rii=0; rii<rowObj.length(); rii++){
		logger.debug("JSONObject rowObj ii: " + rii);
		JSONObject row=(JSONObject)rowObj.getJSONObject("R"+rii);
		logger.debug("JSONObject Col Num : " + row.length());	
		for(int cjj=0;cjj<row.length();cjj++){
			JSONObject colObj=(JSONObject)row.getJSONObject("C"+cjj);
			logger.debug("JSONObject colObj jj: " + cjj);
			logger.debug("JSONObject colObj : " + colObj);
			String objID=(String)colObj.get("id");
			String objType=(String)colObj.get("type");
			String width	=(String)colObj.get("width");//+"px";
			String height	=(String)colObj.get("height");//+"px";
			logger.debug("objType ::::::::::::::::::::::::::::::::::::::::::::::: " + objType);
			if ( objType.equalsIgnoreCase("Grid") ) {
%>
	<%@include file="objGrid.jsp"%>
<%			
			} else if ( objType.equalsIgnoreCase("HTML")) {
%>
	<%@include file="objSTP.jsp"%>
<%				
			} else if ( objType.equalsIgnoreCase("GridTree")) {
%>
	<%@include file="objGridTree.jsp"%>
<%				
			} else if (objType.equalsIgnoreCase("Graph")) {
				String graph_type	="";
				String grp_opt		="";
				String grp_stmt		="";
				String pie_width	="";
				String pie_height	="";
				String x_slider 	="";
				if( colObj.has("graph_type")) graph_type=(String)colObj.get("graph_type");
				if( colObj.has("grp_opt")) 		grp_opt		=(String)colObj.get("grp_opt");
				if( colObj.has("grp_stmt")) 	grp_stmt	=(String)colObj.get("grp_stmt");
				if( colObj.has("pie_width")) 	pie_width	=(String)colObj.get("pie_width");
				if( colObj.has("pie_height")) pie_height=(String)colObj.get("pie_height");
				if( colObj.has("x_slider")) 	x_slider = (String)colObj.get("x_slider");
				if (pie_width.equalsIgnoreCase("")) pie_width="300";
				if (pie_height.equalsIgnoreCase("")) pie_height="300";

				logger.debug("graph_type: " +graph_type);
				if (graph_type.equalsIgnoreCase("Pie")) {
%>
					<%@include file="objPie.jsp"%>
<%				
				} else if (graph_type.equalsIgnoreCase("LineChart")) {
%>
					<%@include file="objLine.jsp"%>
<%				
				} else if (graph_type.equalsIgnoreCase("dBarChart")){				
%>
					<%@include file="objDiscreteBar.jsp"%>
<%				
				} else if (graph_type.equalsIgnoreCase("BarChart")){
%>
					<%@include file="objBar.jsp"%>
<%				
				} else if (graph_type.equalsIgnoreCase("mLineChart")){
%>
					<%@include file="objLine.jsp"%>
<%				
				} else if (graph_type.equalsIgnoreCase("barLineChart")){
%>
					<%@include file="objBarLine.jsp"%>
<%				
				} else if (graph_type.equalsIgnoreCase("boxPlot")){
%>
					<%@include file="objBPlot.jsp"%>
<%				
				} else if (graph_type.equalsIgnoreCase("Scatter")){
%>
					<%@include file="objScatter.jsp"%>
<%				
				} 
				
				logger.debug("1graph type :" + graph_type);
			}
			logger.debug("2graph type :" );
		}	
		logger.debug("3graph type :::::::::::::::::::::::::::::::::::::::::::::::::" );
	}
	
	Iterator keys = rowObj.keys();
	while(keys.hasNext()) {
		String rowName = (String)keys.next();
		JSONObject objName = rowObj.getJSONObject(rowName);
	}	
	} catch(Exception e){
		logger.error("layoutobj : JSON Parsing Error!!!");
	}
}
%>
<%
if(hiddenInfo.containsKey("_STPREPORT_OUT_LAYOUT") || isOSW){
%>
function resizeFrame(){
	console.log("dvCondi.height : " + $("#dvCondi").height());
	$("#dvOutput").height(eval($(window).height()-$("#dvCondi").height()-28));
	$("#dvOutput").width($(window).width()); 

	var cs=1;														
	cdItmWidth=$(".condItem").width();														
	//console.log("cdItmWidth : " + cdItmWidth);														
	$(".condItem").each(function(){														
		if($(this).find("td").hasClass("condLabelLF")){													
			//console.log("LF found... ");												
			//$(this).find("td").width(eval(($(window).width()-(cdItmWidth*cs)-$(".buttonArea").width()-190)/2));												
			$(this).width(1);												
			//$(this).css("clear","both");												
			cs=0;												
		} else {													
			console.log("CS : " +cs);												
			if(cs == 0){												
				//console.log("clear float... ");											
				$(this).css("clear","both");											
				$(this).css("float","left");											
			}												
			cs++;												
		}													
															
	})														
}
<%
} else {
%>
function resizeFrame(){
	console.log("resizeFrame Started:"+displayTime());
	winW=$(window).width();
	var dvCondiHeight=$("#dvCondi").height();		//css("height").substring(0,$("#dvCondi").css("height").length-2);
	if($.browser.msie ==true) {
		rMargin=10;
		bMargin=45;
		if ($("#dvPagePanel").height() < 10 ) bMargin=35;
	}
	console.log("bMargin : "+bMargin);
	var scrollWid=16;
	$("#dvRes").height(eval($(window).height()-dvCondiHeight-rMargin-bMargin));   // returns height of browser viewport
	//$("#dvRes").width(eval($(window).width()-rMargin));
	dvTitleHeight= $("#dvTitle").height();

	//행 스크롤만 하기로 했으므로 하단 주석
	//$("#dvRowHeader").height(eval($(window).height()-$("#dvColumnHeader").height()-dvCondiHeight-dvTitleHeight-bMargin));
	//$("#dvColumnHeader").width(eval($(window).width()-$("#dvRowHeader").width()-rMargin-scrollWid));

	$("#dvData").width(eval($(window).width()-$("#dvRowHeader").width()-rMargin));
	//if (orgRptType =="GraphTable") bMargin=300;
	$("#dvData").height(eval($(window).height()-$("#dvTitle").height()
											-$("#dvGraph1").height()
											-$("#dvColumnHeader").height()
											-$("#dvPagePanel").height()
											-dvCondiHeight-bMargin));
	console.log("window\t\t : "+$(window).height());
	console.log("dvTitle\t : "+$("#dvTitle").height());
	console.log("dvColumnHeader\t: "+$("#dvColumnHeader").height());
	console.log("dvPagePanel\t: "+$("#dvPagePanel").height());
	console.log("dvCondiHeight\t: "+dvCondiHeight);
	console.log("dvData TD Height : " + $("#dvData").parent().height());
	console.log("dvData TD Height : " + $("#dvData").height());
	//$("#dvData").parent().siblings().height($("#dvData").height());
	$("#dvColumnHeader").width(eval($("#dvData").width()-scrollWid));

	var isOBS=$("#dvRowHeader tbody tr:eq(0)").find("th").length;

	$("#dvData").scroll(function() {
		if($(this).scrollTop() < $("#dvData thead").height() ) {
			$(this).scrollTop(eval($("#dvData thead").height()-0));
		}
    	$("#dvColumnHeader").scrollLeft($(this).scrollLeft());
    	$("#dvRowHeader").scrollTop($(this).scrollTop());
			<%
			if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
			%>
			$("#dvData .dvPagePanel").css("left",eval($(this).scrollLeft()+$(window).width()/2-180)+"px");
			<%
			}
			%>
			if(isOBS > 0){
	    	if($(this).scrollTop() > $("#dvRowHeader").scrollTop() ) {
	    		$(this).scrollTop($("#dvRowHeader").scrollTop());
	    	}
    	}
    	if($(this).scrollLeft() > $("#dvColumnHeader").scrollLeft() ) {
    		$(this).scrollLeft($("#dvColumnHeader").scrollLeft());
    	}
	});
	console.log("resizeFrame End:"+displayTime());
	/* 2015-10-21 오전 11:38:06 KB 수정분 반영 */
	adjHeight=eval($("#dvColumnHeader table thead").height() + eval(colHeaderRowCnt)+0);
	$("#dvColumnHeader").height(adjHeight);
	/* End of 6 KB 수정분 반영 : 2015-10-21 오전 11:38:0 */
	var cs=1;														
	cdItmWidth=$(".condItem").width();														
	console.log("cdItmWidth : " + cdItmWidth);														
	$(".condItem").each(function(){														
		if($(this).find("td").hasClass("condLabelLF")){													
			//console.log("LF found... ");												
			//$(this).find("td").width(eval(($(window).width()-(cdItmWidth*cs)-$(".buttonArea").width()-190)/2));												
			$(this).width(1);												
			//$(this).css("clear","both");												
			cs=0;												
		} else {													
			//console.log("CS : " +cs);												
			if(cs == 0){												
				//console.log("clear float... ");											
				$(this).css("clear","both");											
				$(this).css("float","left");											
			}												
			cs++;												
		}													
															
	})														
}
<%
}
%>
function getPromptValue(){
<%
	Viewer.prtGetPromptValue(promptDefinitions, locale, out);
%>
	//console.debug("_STPReport_Page : " + _STPReport_Page);	// kk
}
<%
	if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
		//out.println("var pagenum=$(\"#pagenum\").val();");
	}
	logger.debug("===============isDebug:"+isDebug);
%>
function execSTP(sp_URI,tableName,colName,target,libStmt,param1,param2,param3,param4,param5){
	console.log("execSTP Started:"+displayTime());
	/*
		param1 : whereStatements
		param2 : column sortOrder
		param3 : label column ID
		param4 : label column sortOrder
	*/
	updateTimeoutHBI();
	if (isDisplayProgress==1) $("#progressIndicatorWIP").show(); 
	
	getPromptValue();
<%
			if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
				out.println("\t\t\tif (pagenum == undefined) pagenum = '';");
				out.println("\t\t\tpagenum = $('#pagenum').val();");
			}
%>
	
	var param={
			_program	: sp_URI,
			_result     : "STREAMFRAGMENT",
			libStmt		: libStmt,
			tableName	: tableName,
			colName		: colName,
			target		: target,
			charset		: "EUC-KR",
			isAsync		: "N",
<%
			Viewer.prtPromptInParam(promptDefinitions, locale, out);
			if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
				out.println("\t\t\tpagenum\t:  pagenum,");
				//out.println("\t\t\tpagenum\t:  _STPReport_Page,");  // kk
			}
%>
			param1		: param1,
			param2		: param2,
			param3		: param3,
			param4		: param4,
			param5		: param5,
			winW			: winW
	}
	if (nstp_sessionid.length > 10) {
		param["_sessionid"] = nstp_sessionid;
	}

	var paramCount = Object.keys(tParams).length;
	for(ii=1;ii<paramCount;ii++){
		var varName = tParams["param"+ii];
		param[varName] = eval('param'+ii);		
		console.log("tparam : " + varName);
	}	
	for (ii=0;ii<paramCount;ii++){
		param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
	}
<%
	Viewer.prtGetMultiSelectValue(multiInfo,out);
%>
	$sasResHTML = $.ajax({
		//url: "/SASHBI/HBIServlet?sas_forwardLocation=execSTP",
		url: "/SASHBI/STPRVServlet?sas_forwardLocation=execSTP",
		data: param,
		dataType: 'json',
		async: false,
		beforeSend: function() {
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show(); 
		}
	}).responseText;
	$sasResHTML = $sasResHTML.replace(/<style[^>]*>(.|\n)*<\/style>/g, "");
	$("#progressIndicatorWIP").hide();
	$("#dvRes").html($sasResHTML);

	/******************************************************************************************************************/
	/* For Prompt Debug ***********************************************************************************************/
	/*                                                                                                                */
	console.log("STP Executed : "+displayTime());
	//console.log("execSTP=================>\n"+$sasResHTML);
	/*                                                                                                                */
	/******************************************************************************************************************/

	var hasError=$("#dvRes .solutionsErrorTitle").html();
	var isSASLog=$sasResHTML.substring(0,80).split("\n").reverse();
	var isErr2=isSASLog[0];
	resSize= $sasResHTML.length;
	/*
	console.log("hasError:"+hasError);
	console.log("isSASLog: " + isSASLog);
	console.log("isErr2: " + isErr2);
	console.log("resSize: " + resSize);
	*/
	if (resSize > threshold) {
		console.log("esSize > threshold : " + resSize);

		$("#dvRes").show();

		// $sasResHTML 리턴함으로 getMain에서 처리
		//$sasExcelHTML=$sasResHTML;

		return $sasResHTML;
	}

	if (resSize < 1) {
		msg="<html><body><img src='/SASTheme_default/themes/default/images/MessageError24.gif' border=0>";
		msg+="Stored Process Error<br>";
		if(isDebug=="true") msg+="<xmp>"+$sasResHTML+"</xmp>";
		$("#dvRes").html(msg);
		$("#dvRes").show();
		console.log("Here==>"+ $("#dvRes").html());

		return;
	} else if(typeof hasError == "undefined" && isErr2 != "<h1>Stored Process Error</h1>"){
		//$("#dvRes").html("");
		return $sasResHTML;
	} else if (isErr2 == "<h1>Stored Process Error</h1>") {
		if(isDebug=="true") $("#dvRes").html("<xmp>"+$sasResHTML+"</xmp>");
		$("#dvRes").show();
		console.log("dvRes:"+$("#dvRes").html()+":" + $sasResHTML.length);
		return;
	} else if (hasError.length > 10 ) {
		$("#dvRes").show();
		$ErrorTitle=$("#dvRes .solutionsErrorTitle").clone();
		$LogLines=$("#dvRes .solutionsSmallItem").clone();
		console.log("LogLines:"+$LogLines.html());
		$SASLog=$("#SASLog").clone();
		console.log("SASLog:"+$SASLog);
		console.log("SASLog:"+$SASLog.html());
		var beSASLog=$SASLog.html();
		if ( beSASLog == undefined) {
			$SASLog= $("#dvRes div:last").clone();
		}
		if(isDebug=="true") {
			$("#dvRes").html($ErrorTitle.html()+$LogLines.html()+$SASLog.html());
		} else {
			$("#dvRes").html($ErrorTitle.html()+ "\n 관리자에게 문의하시기 바랍니다.");
		}
		var dvCondiHeight=$("#dvCondi").height();		//css("height").substring(0,$("#dvCondi").css("height").length-2);
		// 아래 두줄 20140522 주석 다시 해제 dvRes Height 가 최대로 늘어남.... 20140610
		$("#dvRes").width(eval($(window).width()-rMargin));
		$("#dvRes").height(eval($(window).height()-dvCondiHeight-bMargin));
		$("#dvRes").css("overlay","scroll");
		console.log("dvRes width:" + $("#dvRes").width());
		console.log("dvRes height:" + $("#dvRes").height());

		//resizeFrame();
		return;
	} else {
		//$("#dvRes").html("");
		return $sasResHTML;
	}
	console.log("execSTP End:"+displayTime());
}
function execSTPA(sp_URI,fn,param1,param2,param3,param4,param5,param6,param7,param8,param9){
	console.log("execSTPA Started:"+displayTime());
	updateTimeoutHBI();
	
	if (isDisplayProgress==1) {
		console.log("isDisplayProgress: " + isDisplayProgress);
		$("#progressIndicatorWIP").show(); 
	}
	getPromptValue();
	var param={
			_program	: sp_URI,
			_result     : "STREAMFRAGMENT",
<%
			//Viewer.prtPromptInParam(promptDefinitions, locale, out);
			if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
				out.println("\t\t\tpagenum\t:  pagenum,");
			}
%>
			param1		: param1,
			param2		: param2,
			param3		: param3,
			param4		: param4,
			param5		: param5,
			param6		: param6,
			param7		: param7,
			param8		: param8,
			param9		: param9,
			winW		: winW
	}
	if (nstp_sessionid.length > 10) {
		param["_sessionid"] = nstp_sessionid;
	}
	param["_savepath"] = save_path;
	console.log("nstp_sessionid : " + nstp_sessionid);
	console.log("save_path : " + save_path);

	var paramCount = Object.keys(tParams).length;
	for(ii=1;ii<paramCount;ii++){
		var varName = tParams["param"+ii];
		param[varName] = eval('param'+ii);		
		console.log("tparam : " + varName);
	}	
	for (ii=0;ii<paramCount;ii++){
		param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
	}

	
<%
	//Viewer.prtGetMultiSelectValue(multiInfo,out); 
%>
	var idx=0;var pre_p_name="";
	$("#dvCondi input").each(function(){	
		if ($(this)[0].type == "checkbox"){
			//console.log($(this));
			if ($(this)[0].checked){
				//val=$("#"+$(this)[0].id).val();
				val=$(this)[0].value;
				p_name=$(this)[0].id;	//.substring(3);
				if (p_name != pre_p_name) idx=0;
				pre_p_name=p_name;
				console.log("***p_name : " + p_name + " : " + val);
				
				idx++;
				if (idx == 1) param[p_name] = val;
				param[p_name+idx] = val;
				param[p_name+"0"] = idx;
				//param[p_name+"_count"] = idx;
			}
		} 
	});
	console.log(param);
	$.ajax({
		//url: "/SASHBI/HBIServlet?sas_forwardLocation=execSTPN",
		url: "/SASHBI/STPRVServlet?sas_forwardLocation=execSTPN",
		type: "post",
		data: param,
		dataType: 'json',
		async: true,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) {
				console.log("isDisplayProgress: " + isDisplayProgress);
				$("#progressIndicatorWIP").show();
			}
		},
		success : function(data){
			console.log("execSTPA success" );
			console.log(data);
			window[fn](data);
		},
		complete: function(data){
			//data.responseText;	
			isRun=0;
			tParams=eval('[{}]');
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alert(error);
		}
	});
}

function execSTPS(sp_URI,param1,param2,param3,param4,param5,param6,param7,param8,param9){
	console.log("execSTPS Started:"+displayTime());
	updateTimeoutHBI();
	if (isDisplayProgress==1) $("#progressIndicatorWIP").show(); 
	getPromptValue();
	var param={
			_program	: sp_URI,
			_result     : "STREAMFRAGMENT",
<%
			Viewer.prtPromptInParam(promptDefinitions, locale, out);
			if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
				out.println("\t\t\tpagenum\t:  pagenum,");
			}
%>
			param1		: param1,
			param2		: param2,
			param3		: param3,
			param4		: param4,
			param5		: param5,
			param6		: param6,
			param7		: param7,
			param8		: param8,
			param9		: param9,
			winW			: winW
	}
	if (nstp_sessionid.length > 10) {
		param["_sessionid"] = nstp_sessionid;
	}
	var paramCount = Object.keys(tParams).length;
	for(ii=1;ii<paramCount;ii++){
		var varName = tParams["param"+ii];
		param[varName] = eval('param'+ii);		
		console.log("tparam : " + varName);
	}	
	for (ii=0;ii<paramCount;ii++){
		param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
	}
	
<%
	Viewer.prtGetMultiSelectValue(multiInfo,out);
%>
	var resData=$.ajax({
		url: "/SASHBI/HBIServlet?sas_forwardLocation=getParams",
		type: "post",
		data: param,
		dataType: 'json',
		async: false
	}).responseText;
	return resData;
}
function execAjax(url,sp_URI,isAsync,fn,dataType,param1,param2,param3,param4,param5,param6,param7,param8,param9,param10,param11,param12,param13,param14,param15){
	console.log("execAjax Started : "+displayTime());
	updateTimeoutHBI();
	var orgURL = url;
	//if (url=="") { url="/SASStoredProcess/do?"; }
	if (url=="") {
		url="/SASHBI/STPRVServlet?sas_forwardLocation=execSTPN"; 
		if (isAsync) { url="/SASStoredProcess/do?"; }
	}
	else { 
		url="/SASHBI/HBIServlet?sas_forwardLocation=" + url; 
	}	
	if (dataType=="" || dataType=="undefined") dataType="json";
	console.log("execAjax dataType : " + dataType);
	
	if (dataType == "json") {
		charset="utf-8";
	} else {
		charset="euc-kr";
	}

	if (isDisplayProgress==1) {
		console.log("isDisplayProgress: " + isDisplayProgress);
		$("#progressIndicatorWIP").show(); 
	}
	getPromptValue();
<%
			if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
				out.println("\t\t\tif (pagenum == undefined) pagenum = '';");
				out.println("\t\t\tpagenum = $('#pagenum').val();");
			}
%>
	var param={
			_program	: sp_URI,
			_result     : "STREAMFRAGMENT",
			charset		: charset,
			isAsync		: isAsync,
<%
			Viewer.prtPromptInParam(promptDefinitions, locale, out);
			if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
				out.println("\t\t\tpagenum\t:  pagenum,");
			}
%>
			param1		: param1,
			param2		: param2,
			param3		: param3,
			param4		: param4,
			param5		: param5,
			param6		: param6,
			param7		: param7,
			param8		: param8,
			param9		: param9,
			param10		: param10,
			param11		: param11, 
			param12		: param12,
			param13		: param13,
			param14		: param14,
			param15		: param15
	}
	if (nstp_sessionid.length > 10) {
		if (!isAsync) param["_sessionid"] = nstp_sessionid;
		console.log("save path : " + save_path);
		param["_savepath"] = save_path;
	}
	console.log("tParams");
	console.log(tParams);
	if (colHeaderRowCnt != "") {
		param["_colHeaderRowCnt"] = colHeaderRowCnt;
	}
	var paramCount = Object.keys(tParams).length;
	for(ii=1;ii<paramCount;ii++){
		var varName = tParams["param"+ii];
		param[varName] = eval('param'+ii);		
		console.log("tparam : " + varName);
	}	
	for (ii=0;ii<paramCount;ii++){
		param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
	}

	try {
		for (ii=0;ii<paramCount;ii++){
			console.log("Object.keys(tParams)[ii]" + Object.keys(tParams)[ii]);
			if (orgURL =="" && tParams[Object.keys(tParams)[ii]].length > 50) {
				console.log("Value size of " + param[Object.keys(tParams)[ii]] + " too big... STP cannot proccessed.");
			} else {
				param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
			}
		}
	} catch(err) {
		console.error("[ERROR] tParams length property can not read... ");
	}
	console.log("param");
	console.log(param);
<%
	Viewer.prtGetMultiSelectValue(multiInfo,out);
%>
	$.ajax({
		url: url,
		type: "post",
		data: param,
		dataType: dataType,
		cache:false,
		async: isAsync,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) {
				$("#progressIndicatorWIP").show();
			}		
		},
		success : function(data){	
			console.log("execAjax success" );
			if (dataType=='json') console.log(data);
			if ( param1 == "ExcelDown") dataType="XML";
			window[fn](data,dataType);
		},
		complete: function(data){
			//data.responseText;	
			isRun=0;
			tParams=eval('[{}]');
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" +  xhr + "error: " + error);
			console.log(xhr);
			console.log(status);
			alert(error);
		}
	});
}
/*
			1	sp_URI		"SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)"
			2	tableName	"hbidemo.PRDSALE"
			3	colName		"PRODUCT"
			4	target		"product"
			5	libStmt		"LIBNAME+hbidemo+BASE+%27C%3A%5CSASHBI%5CData%27%3B"
			6	param1		""
			7	param2		""
			8	param3		""
			9	param4		""
			10	param5		"false"
			11	param6		""
			12	param7		"false"
			13	param8		"chk"

*/
function getParamVal(sp_URI,tableName,colName,target,libStmt,param1,param2,param3,param4,param5,param6,param7,param8){
	submitCondCount++;
	isAsync=true;
	if (param8=="false") isAsync=false;
	//console.log("getParamVal Started:"+displayTime());
	/*
		param1 : whereStatements
		param2 : column sortOrder
		param3 : label column ID
		param4 : label column sortOrder
		param5 : formated value(isValueDisplayed)
		param6 : default Value
		param7 : isRequired (전체)
	*/
	if (isDisplayProgress==1) $("#progressIndicatorWIP").show(); 
<%
			if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
				out.println("\t\t\tif (pagenum == undefined) pagenum = '';");
				out.println("\t\t\tpagenum = $('#pagenum').val();");
			}
%>

<%
	Viewer.prtGetPromptValue(promptDefinitions, locale, out, false);
	if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
		//out.println("var pagenum=$(\"#pagenum\").val();");
		out.println("var pagenum=pagenum;");// kk
	}
	logger.debug("===============isDebug:"+isDebug);
%>
	var param={
			_program	: sp_URI,
			_result     : "STREAMFRAGMENT",
			libStmt		: libStmt,
			tableName	: tableName,
			colName		: colName,
			target		: target,
			charset		: "EUC-KR",
<%
			Viewer.prtPromptInParam(promptDefinitions, locale, out);
%>
			param1		: param1,
			param2		: param2,
			param3		: param3,
			param4		: param4,
			param5		: param5,
			param6		: param8,
			winW			: winW
	}
	if (nstp_sessionid.length > 10) {
		//param["_sessionid"] = nstp_sessionid;
	}

	var paramCount = Object.keys(tParams).length;
	for(ii=1;ii<paramCount;ii++){
		var varName = tParams["param"+ii];
		param[varName] = eval('param'+ii);		
		console.log("tparam : " + varName);
	}	
	for (ii=0;ii<paramCount;ii++){
		param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
	}
	
	var chkParam=0;
	var whT=param1.split(":");
	if (param1 != "") {
		for(wVar in whT){
			var wh_var = whT[wVar].split("=")[0];
			var wh_val = whT[wVar].split("=")[1];
			console.log("wVar : " + wh_var+":"+wh_val);
			if ( param[wh_val] == undefined && wh_var != "") {
				chkParam++;
				console.log("wh_val : " + wh_val);				
			}
		}
		console.log("chkParam : " + chkParam);
	}
	if (chkParam > 0) {
		console.log(param);
		return;
	}
	
<%
	Viewer.prtGetMultiSelectValue(multiInfo,out);
%>
	$.ajax({
		//url: "/SASHBI/HBIServlet?sas_forwardLocation=getParams",
		//url: "/SASHBI/STPRVServlet?sas_forwardLocation=getParams",
		url: "/SASStoredProcess/do?",
		data: param,
		dataType: 'html',
		cache:false,
		async: isAsync,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show(); 
		},
		complete : function(data){
			$("#dvDummy").hide();
			$("#dvDummy").html(data.responseText);
			tObjName='slt'+target;
			if (param7 == "false" && param8 != "chk"){
				$("#"+tObjName).prepend("<option value=''>전체</option>");
			} else {
				try {
					chgFn="onChange_"+target+"()";
					chgFnName="onChange_"+target;
					//console.log("chgFnName : " + chgFnName);
					eval(chgFn);
				} catch(err) {
				}
			}
			//console.log("param6 : " + param6);
			if (param6 != ""){
				tObjName='slt'+target;
				$("#"+tObjName).val(param6.trim()).prop("selected", true);
				try {
					chgFn="onChange_"+target+"()";
					chgFnName="onChange_"+target;
					//console.log("chgFnName2 : " + chgFnName);
					eval(chgFn);
				} catch(err) {
				}
			} else {
				$("#" + tObjName + " option:eq(0)").prop("selected", true);
			}
			tParams=eval('[{}]');
			$("#progressIndicatorWIP").hide();
			isRun=0;
			//console.log("getParamVal \n" + JSON.stringify(data));
			//console.log("save path : \n" + save_path);
      },
      error : function(data){
      	console.error("ERROR:");
      }
	});
}

$(document).ready(function () {
	console.log("Browser.version: "+$.browser.version);
	console.log("Browser.version: "+msieversion());
	console.log(""+ navigator.userAgent);
	console.log("documentMode: "+document.documentMode);
	execAjax("","SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/createSession(StoredProcess)",false,"checkSession","html");

	
	$("#dvOutput").width($(window).width());
	$("#dvOutput").height(eval($(window).height()-$("#dvCondi").height()-28));
	
	$("#dvBox").hide();
	$("#dvColumnHeader").hide();
	$("#dvRowHeader").hide();
	$("#dvData").hide();
<%
	/*
	Stub.incFile(hiddenInfo,"_STPREPORT_ONREADY_JS", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
	*/
%>
	$("#progressIndicatorWIP").hide();
<%
for (int i = 0; i < promptDefinitions.size(); i++) {
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	String pName=pdi.getPromptName();
	if((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)){
		String dateType="";
		if (pdi instanceof DateDefinition) {
			dateType=((DateDefinition) pdi).getDateType().toString();
		} else if (pdi instanceof SharedDateDefinition) {
			dateType=((SharedDateDefinition) pdi).getDateType().toString();
		}
		logger.debug("dateType:" + dateType);
		out.println("\t$(\"#slt" + pName +"\").datepicker({");
		out.println("\t\tdefaultDate: \"0m\",");
		//out.println("\t\tnumberOfMonths: 1,");
		out.println("\t\tchangeMonth: true,");
		out.println("\t\tchangeYear: true,");
		//out.println("\t\tminDate: new Date(1980, 1 - 1, 1),");
		out.println("\t\tfirstDay: 1,");
		if (!dateType.equals("DATE")) {
			out.println("\t\tonClose: function(dateText, inst) {");
			out.println("\t\t\tvar month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();");
			out.println("\t\t\tvar year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();");
			out.println("\t\t\t$(this).datepicker('setDate', new Date(year, month, 1));");
			out.println("\t\t},");
		}
		out.println("\t\tshowButtonPanel: true");
		out.println("\t});");
		if (dateType.equals("DATE")) {
			out.println("\t$(\"#slt" + pName + "\").datepicker(\"option\",\"dateFormat\",\"yy-mm-dd\");");
		} else if (dateType.equals("MONTH")) {
			out.println("\t$(\"#slt" + pName + "\").datepicker(\"option\",\"dateFormat\",\"yy-mm\");");
		} else if (dateType.equals("YEAR")) {
			out.println("\t$(\"#slt" + pName + "\").datepicker(\"option\",\"dateFormat\",\"yy\");");
		}
	}
	if((pdi instanceof DateRangeDefinition) || (pdi instanceof SharedDateRangeDefinition)){
		String minDateString="";
		String maxDateString="";
		String dateType="";
		//String maxDateType="";
		if(pdi.isDefaultValueSet()){
			/*
			Date minDate=dr.getMinimum();
			minDateString=Stub.getDefaultDate(minDate.toString());
			Date maxDate=dr.getMaximum();
			maxDateString=Stub.getDefaultDate(maxDate.toString());
			*/
			Object dftDateR=pdi.getDefaultValue();
			Date dftRange[]=(Date[])dftDateR;
			minDateString=Stub.getDefaultDate(dftRange[0].toString());
			maxDateString=Stub.getDefaultDate(dftRange[1].toString());
			if (pdi instanceof DateRangeDefinition) {
				dateType=((DateRangeDefinition) pdi).getDateType().toString();
			} else if (pdi instanceof SharedDateRangeDefinition) {
				dateType=((SharedDateRangeDefinition) pdi).getDateType().toString();
			}
			//minDateType=dftRange[0].toString().substring(0,1);
			//maxDateType=dftRange[1].toString().substring(0,1);
			logger.debug("minDateString:"+dftRange[0].toString());
			logger.debug("maxDateString:"+maxDateString);
		}

		out.println("\t$(\"#slt" + pName +"_start\").datepicker({");
		out.println("\t\tdefaultDate: \"0m\",");
		out.println("\t\tnumberOfMonths: 1,");
		out.println("\t\tchangeMonth: true,");
		out.println("\t\tchangeYear: true,");
		if (!dateType.equals("DATE")) {
			out.println("\t\tonClose: function(dateText, inst) {");
			out.println("\t\t\tvar month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();");
			out.println("\t\t\tvar year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();");
			out.println("\t\t\t$(this).datepicker('setDate', new Date(year, month, 1));");
			out.println("\t\t},");
		}
		out.println("\t\tshowButtonPanel: true");
		out.println("\t});");
		if (dateType.equals("DATE")) {
			out.println("\t$(\"#slt" + pName + "_start\").datepicker(\"option\",\"dateFormat\",\"yy-mm-dd\");");
		} else if (dateType.equals("MONTH")) {
			out.println("\t$(\"#slt" + pName + "_start\").datepicker(\"option\",\"dateFormat\",\"yy-mm\");");
		} else if (dateType.equals("YEAR")) {
			out.println("\t$(\"#slt" + pName + "_start\").datepicker(\"option\",\"dateFormat\",\"yy\");");
		}

		out.println("\t$(\"#slt" + pName +"_end\").datepicker({");
		out.println("\t\tdefaultDate: \"0m\",");
		out.println("\t\tnumberOfMonths: 1,");
		out.println("\t\tchangeMonth: true,");
		out.println("\t\tchangeYear: true,");
		if (!dateType.equals("DATE")) {
			out.println("\t\tonClose: function(dateText, inst) {");
			out.println("\t\t\tvar month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();");
			out.println("\t\t\tvar year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();");
			out.println("\t\t\t$(this).datepicker('setDate', new Date(year, month, 1));");
			out.println("\t\t},");
		}
		out.println("\t\tshowButtonPanel: true");
		out.println("\t});");
		if (dateType.equals("DATE")) {
			out.println("\t$(\"#slt" + pName + "_end\").datepicker(\"option\",\"dateFormat\",\"yy-mm-dd\");");
		} else if (dateType.equals("MONTH")) {
			out.println("\t$(\"#slt" + pName + "_end\").datepicker(\"option\",\"dateFormat\",\"yy-mm\");");
		} else if (dateType.equals("YEAR")) {
			out.println("\t$(\"#slt" + pName + "_end\").datepicker(\"option\",\"dateFormat\",\"yy\");");
		}
	}
}
for (int i = 0; i < promptDefinitions.size(); i++) {
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	if (!pdi.getPromptName().toUpperCase().equalsIgnoreCase("_DEBUG") && !pdi.getPromptName().startsWith("_STPREPORT")) {
		logger.debug(pdi.getPromptName() + " is hidden??? : " + pdi.isHidden());
		out.println("\t"+"get_" + pdi.getPromptName() + "();");
		//setTimeout("getMain()",1*1);
	}
}

%>
	$("#condShowHide").click(function(){
		if ($(this).hasClass("ui-icon-circle-arrow-n")){
			condCollapseStyle();
			$("#dvCondTable").slideUp();
			setTimeout("resizeFrame()",500*1);
		} else {
			$(this).removeClass("ui-icon-circle-arrow-s");
			$(this).addClass("ui-icon-circle-arrow-n");
			$("#dvCondi").css("padding-bottom","9px");
			$("#condBottomMargin").css("height","10px");
			$("#dvCondTable").slideDown();
			setTimeout("resizeFrame()",500*1);
		}
	});	
	$(".condLabelDummy").width(eval($(".condLabel").width()+1));
<%
logger.debug("ON_LOAD_COLLAPSE : " + ON_LOAD_COLLAPSE);
logger.debug("hiddenInfo: "+ hiddenInfo.toString());
if(ON_LOAD_COLLAPSE.equalsIgnoreCase("1")){
%>
	condCollapseStyle();
	$("#dvCondTable").hide();
<%
}
%>	
	$("#dvSASLog").resizable();
	$("#progressIndicatorWIP").hide();

});
function showSASLog(saslog){
	console.log("SASLog : \n");
	//console.log(saslog);
	$('#dvSASLogWin').css("top","40px");
	//$('#dvSASLogWin').html("<h3 class='ui-widget-header dvSASLogHeader' onClick=$('#dvSASLogWin').hide();>SAS Log</h3><pre style='padding:0px 20px;'>" + saslog + "</pre>");
	$('#dvSASLog').html("<pre style='padding:0px 20px;'>" + saslog + "</pre>");
	$("#dvSASLogWin").width($(window).width()-40);
	$("#dvSASLogWin").css("left",eval(eval($(window).width()-$("#dvSASLogWin").width()-0)/2));
	$("#dvSASLogWin").height(eval($(window).height()-100));
		$("#dvSASLog").height($("#dvSASLogWin").height());
		$("#dvSASLog").width($("#dvSASLogWin").width());
	$('#dvSASLogWin').show();
	$('#dvSASLog').show();
	
}
function checkSession(res){
	var sInfo=eval(res)[0];
	console.log(res);
	nstp_sessionid=sInfo.nstp_sessionid;
	save_path=sInfo.save_path;
	console.log("_sessionid : " + nstp_sessionid);
	console.log("save_path : " + save_path);
}
function getSASLog(){
	var url="getSASLog"; 
	var sp_URI="";
	var isAsync=true;
	var fn="showSASLog";
	var dataType="html";
	execAjax(url,sp_URI,isAsync,fn,dataType);		//,param1,param2);
}
function downExcel(data){
	/* ie에서 오류 Chrome 정상 작동
	data=data.replace(/ss:StyleID="data__l1" ss:Index="4"><Data ss:Type="String">/gi, 'ss:MergeAcross="2" ss:StyleID="data__l1" ss:Index="4"><Data ss:Type="String">');
	window.open('data:application/vnd.ms-excel,' + encodeURIComponent('<?xml version="1.0" encoding="utf-8"?>') + encodeURIComponent(data.substring(39)));
	*/
	window.open('data:application/vnd.ms-excel,' + encodeURIComponent('<?xml version="1.0" encoding="utf-8"?>') + encodeURIComponent(data.substring(39)));
	console.log("downExcel called!");
}
function downExcel2(data,dataType){
	console.log("downExcel2 called!");

	if (dataType.toUpperCase()=="HTML"){
		data=data.replace(/euc-kr/gi, 'utf-8');
		window.open('data:application/vnd.ms-excel,' + encodeURIComponent(data));
	} else if (dataType.toUpperCase()=="XML"){
		window.open('data:application/vnd.ms-excel,' + encodeURIComponent('<?xml version="1.0" encoding="utf-8"?>') + encodeURIComponent(data.substring(39)));
	}
}
function downExcelIE(){
	var myForm = fomExcel;
	//myForm.action = "/SASStoredProcess/do";
	//myForm.action = "/SASHBI/HBIServlet";
	myForm.action = "/SASHBI/STPRVServlet";
	myForm.target = 'fileDown';
	myForm._program.value = "<%=sp_pathUrl%>";
	if (nstp_sessionid == "" ){
		alertMsg("Session Expired...1");
		return;
	}
	myForm._sessionid.value = nstp_sessionid;
	myForm._savepath.value = save_path;
	myForm.param1.value = "ExcelDown";
	myForm.sas_forwardLocation.value = "downFile";
<%	
	for (int i = 0; i < promptDefinitions.size(); i++) {
		PromptDefinitionInterface pdi = promptDefinitions.get(i);
		if (pdi instanceof DateRangeDefinition || pdi instanceof SharedDateRangeDefinition) {
			hStr="\tmyForm." + pdi.getPromptName() + "_start.value" + "=$(\"#slt" + pdi.getPromptName()+ "_start\").val();";
			out.println(hStr);
			hStr="\tmyForm." + pdi.getPromptName() + "_end.value" + "=$(\"#slt" + pdi.getPromptName()+ "_end\").val();";
			out.println(hStr);
		} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
			hStr="\tmyForm." + pdi.getPromptName() + ".value" + "=$(\"#slt" + pdi.getPromptName()+ "\").val();";
			out.println(hStr);
		} else {
			hStr="\tmyForm." + pdi.getPromptName() + ".value" + "=$(\"#slt" + pdi.getPromptName()+ "\").val();";
			out.println(hStr);
		}
	}
%>
	console.log("sbip:" + myForm._program.value);
	myForm.submit();
}
function exportEXCEL(){
	console.log("exportEXCEL");
	console.log("sasExcelHTML: " + $sasExcelHTML);
	var userDefHeader=$("#dvUserHeader").html();
	var myForm = fomExcel;
	console.log("orgRptType: " + orgRptType);
	<%															
	if(isNoSubmitBtn==0) {															
	%>															
	if($sasExcelHTML.length < 10 && orgRptType.indexOf("opnSWSlickGrid") < 0 ){
		alert("조회된 결과가 없습니다.");
		return;
	} 
	<%															
	}
	if(hiddenInfo.containsKey("_STPREPORT_EXCEL_PGM") && excelPGM.equalsIgnoreCase("POI")){
	%>
		console.log("exportEXCEL Type : POI");
	<%
	} 
	else if (hiddenInfo.containsKey("_STPREPORT_EXCEL_PGM") && excelPGM.equalsIgnoreCase("SAS")){
	%>
		console.log("exportEXCEL Type : SAS");
		execAjax("exportExcel","<%=metaID%>",true,"downExcel","html");
		return;		
	<%
	}
	else if (hiddenInfo.containsKey("_STPREPORT_EXCEL_PGM") && excelPGM.equalsIgnoreCase("HTML")){
	%>
		var ieversion=msieversion();
		console.log("ieversion : " + ieversion);
		console.log("exportEXCEL Type : _self : " + "<%=sp_pathUrl%>");
		if ( ieversion > 0){
			downExcelIE();
		} else { 
			downExcelIE();
			//execAjax("","<%=sp_pathUrl%>",true,"downExcel2","<%=excelPGM%>","ExcelDown");
		}
		return;
	<%
	}		
	else if (hiddenInfo.containsKey("_STPREPORT_EXCEL_PGM") && !excelPGM.equalsIgnoreCase("")){
	%>
		console.log("exportEXCEL Type : User Defined");
		myForm.action = "/SASStoredProcess/do";
		myForm.target = 'fileDown';
		myForm._program.value = 'SBIP://METASERVER' + "<%=excelPGM%>" + '(StoredProcess)';
		if (nstp_sessionid == "" ){
			alertMsg("Session Expired...2");
			return;
		}
		myForm._sessionid.value = nstp_sessionid;
		myForm._savepath.value = save_path;
		myForm.submit();
		return;
		
	<%
	}
		
	if(hiddenInfo.containsKey("_STPREPORT_PAGE") || isOSW){
	%>
	console.log("++++++++++++++++++++++++++++++++++++++"+save_path);

	fomPagerDataExcel._sessionid.value=nstp_sessionid;
	fomPagerDataExcel._savepath.value=save_path;
	fomPagerDataExcel._data.value="WEBDATA";
	if(fomPagerDataExcel._savepath.value=="") {
	  console.log("저장위치가 없습니다.");
	}
	fomPagerDataExcel.action = "/<%=contextName%>/HBIServlet";
	fomPagerDataExcel.target = 'fileDown';
	fomPagerDataExcel.submit();

	return;
	<%
	}
	%>

	$("#dvRes table").attr("border","1px");
	$sasExcelHTML=$("#dvRes").html();

	myForm.action = "/<%=contextName%>/HBIServlet";
	myForm.target = 'fileDown';
	myForm.sasExcel.value = $sasExcelHTML;
	myForm.submit();
	$sasResHTML="";

}
function submitSTP(){
<%
	String varNameBaseDate=null;
	for (int i = 0; i < promptDefinitions.size(); i++) {
		PromptDefinitionInterface pdi = promptDefinitions.get(i);
		if ((pdi instanceof DateRangeDefinition) || (pdi instanceof SharedDateRangeDefinition)){
			varNameBaseDate = pdi.getPromptName();
			hStr="\tvar " + pdi.getPromptName() +"_start" + "=$(\"#slt" + pdi.getPromptName()+ "_start\").val();";
			out.println(hStr);
			hStr="\tvar " + pdi.getPromptName() +"_end" + "=$(\"#slt" + pdi.getPromptName()+ "_end\").val();";
			out.println(hStr);
%>
	var <%=pdi.getPromptName()%>_start=$("#slt<%=pdi.getPromptName()%>_start").val();
	var <%=pdi.getPromptName()%>_end=$("#slt<%=pdi.getPromptName()%>_end").val();
	setCookie("<%=pdi.getPromptName()%>_start", <%=pdi.getPromptName()%>_start,30);
	setCookie("<%=pdi.getPromptName()%>_end", <%=pdi.getPromptName()%>_end,30);
<%
		} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
%>
	var <%=pdi.getPromptName()%>=$("#slt<%=pdi.getPromptName()%>").val();
	setCookie("<%=pdi.getPromptName()%>", <%=pdi.getPromptName()%>,30);
<%
		} else {
			hStr="\tvar " + pdi.getPromptName() + "=$(\"#slt" + pdi.getPromptName()+ "\").val();";
			//out.println(hStr);
		}
	}
	if(hiddenInfo.containsKey("_STPREPORT_RETRIEVE_TERM") && varNameBaseDate!=null){
		out.println("    var _term_num=Number(_STPREPORT_RETRIEVE_TERM); \n");
		out.println("    var _diffDay=getDiffDay("+varNameBaseDate+"_start, "+varNameBaseDate+"_end); \n");
		out.println("    if(_term_num < _diffDay){ \n");
		out.println("        alert('조회가능 기간은 '+_STPREPORT_RETRIEVE_TERM+'일입니다.'); \n");
		out.println("        return; \n");
		out.println("    } \n");
	}
%>

	$("#dvSASLog").html("");
	$("#dvOutput").show();
	//$("#dvOutput").hide();
	$("#dvGraph1").hide();	
	$("#dvBox").hide();
	$("#dvColumnHeader").hide();
	$("#dvRowHeader").hide();
	$("#dvData").hide();
	$("#dvTitle").html("");
	$("#dvBox").html("");
	$("#dvColumnHeader").html("");
	$("#dvRowHeader").html("");
	$("#dvData").html("");
	$("#dvRes").html("");
	$("#dvPagePanel").html("");
	$("#dvDummy").html("");
	$("#dvRes").hide();
	$("#dvDummy").hide();
	$("#dvPagePanel").hide();
	$("#progressIndicatorWIP").show();
	isDisplayProgress=1;
<%
	if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
		out.println("\t$(\"#pagenum\").val(\"\");");	
	}
	String stpCustomFile = (String)session.getAttribute("sas_StoredProcessCustomFile_HBI");
	Viewer.prtGenExecScript(promptDefinitions,metaID,rptType,sp_pathUrl,hiddenInfo,stpCustomFile,layoutStr,custOutJS,isOSW,locale,out);
%>	
}	// End of submitSTP();

<%
if(layoutStr != null){
} else if(hiddenInfo.containsKey("_STPREPORT_OUT_LAYOUT") || isOSW){
} else {
%>
function getMain(){
	console.log("getMain Started:"+displayTime());

	$("#dvPagePanel").show();
	var userDefHeader=$("#dvUserHeader").html();
	$sasResHTML="";
	getPromptValue(); 
<%
	out.println("\t $sasResHTML=execSTP(\""+sp_pathUrl+"\",\"\",\"\",\"\",\"\");");
%>
	console.log("getMain STP Excecuted:"+displayTime());

	if (typeof $sasResHTML != "undefined"){
		rptType=orgRptType;
	} else {
		return;
	}
	console.log("getMain rptType:"+rptType);

	if (resSize < 10) {
		alert("실행 결과가 출력되지 않았습니다.\n 관리자에게 문의하시기 바랍니다.");
		return;
	} else if ( resSize < 200) {
		$("#dvOutput").hide();
		return;
	}

/*****************************************************************************************************************/
	console.log("getMain isDebug: "+ isDebug);
	if(isDebug=="true"){
		rptType="";
		var debugVal=$("#slt_debug option:selected").val();
		if (typeof debugVal == "undefined") debugVal="";
		if (debugVal.toUpperCase()=="LOG"){
			$("#dvRes").html($sasResHTML+debugMSG+"<xmp>"+$sasResHTML+"</xmp>")
		}
	}
/****************************************************************************************************************/

<%
if(hiddenInfo.containsKey("_STPREPORT_AFTER_MAIN_JS")){
	Stub.incFile(hiddenInfo,"_STPREPORT_AFTER_MAIN_JS", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
} else {
%>
				<%@include file="afterExecSTPinGetMain.jsp"%>			
<%
}
%>
}
<%
	} // End of getMain()
%>

<%
//Viewer.prtGenFunction(promptDefinitions,map,defInfo,request,out);				//for condi debug
prtGenFunction(promptDefinitions,map,defInfo,request,out);
if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
%>
function goPage(pagenum){
	$("#dvOutput").hide();
	$("#pagenum").val(pagenum);
	getMain();
}
<%
}
if(ON_LOAD_SUBMIT.equalsIgnoreCase("1")){
	int submitCondCount=prmptNum+map.size()-1;
%>
function onLoadStart(){
	console.log("submitCondCount : " + submitCondCount);
	if ( submitCondCount >= <%=submitCondCount%> ) {
	setTimeout("submitSTP()",500*1);
	}
}
setTimeout("onLoadStart()",1000*1);
<%
}
	Stub.incFile(hiddenInfo,"_STPREPORT_HEADER_JS", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
%>
</script>
</head>
<body style="overflow-y: hidden;border:0px solid #ff0000;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;" scroll=no onresize="//resizeFrame();">
<div id=dvCondi>
	<table width="100%">
		<tr style="padding:0px;">
	        <td width=10 style=b><!--img src="/<%=contextName%>/images/ico_titleType2.png" border="0"  style="padding-top:5px;"--></td>
	        <th class="t ReportTitle"><%=desc%></th>
           <td align="right" v-align="bottom">
           <span id="condShowHide" class="ui-accordion-header-icon ui-icon ui-icon-circle-arrow-n"  style="cursor:pointer;"></span>
           </td>
	    </tr>
	    <tr id="condBottomMargin" style="height:10px;">
	    </tr>
	</table>
	<div id="dvCondTable">
	<table class="condTable" cellspacing="0" cellpadding="0" >
		<tr>
			<td style="border:0px solid #ff0000;">
<%
//Viewer.prtPromptCondi(promptDefinitions,map,request,out);
//logger.debug("map : " + map);

logger.debug("=============== map:"+map);
//Viewer.prtPromptCondi(promptDefinitions,map,request,out);
prtPromptCondi(promptDefinitions,map,request,out);
logger.debug("=============== map:"+map);

%>
			</td>
			<td class="buttonArea" >			
<%
	if (isNoSubmitBtn == 0){
%>			
				<input type=button id="btnRun" class="condBtnSearch" value="Submit" onclick="submitSTP();">
<%
	}
int isNoExcelBtn=0;
if(hiddenInfo.containsKey("_STPREPORT_NOEXCEL_BTN")){ 
	try{
		isNoExcelBtn=Integer.parseInt(hiddenInfo.get("_STPREPORT_NOEXCEL_BTN"));
	} catch ( Exception e) {
		isNoExcelBtn=1;
	} finally {
		
	}
}
logger.debug("isNoExcelBtn : " + isNoExcelBtn);
if ( isNoExcelBtn == 0){
%>				
				<input type=button id="btnExcel" class="condBtnExcel" value="엑셀" onclick="exportEXCEL();">
<%
}
if (userContext.isInGroup("Report Admin")){
%>
		<img id="btnHeaderEdit"  src="/<%=contextName%>/images/icon_log.png" border=0 onclick="editHeader();" >
		<a href="/SASHBI/HBIServlet?sas_forwardLocation=editLayout" target="editLayout">
		<img id="btnEditLayout"  src="/<%=contextName%>/images/editLayout.gif" border=0 onclick="//editLayout();" >
		</a>
		<img id="btnSASLog"  src="/<%=contextName%>/images/icon_log.png" border=0 onclick="getSASLog();" >
<%
}
%>
			</td>
		</tr>
<%
if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
	out.println("<input type=hidden id=pagenum name=pagenum value='' />");
}
%>
	</table>
	</div>
</div>
<div id=dvToolBar style="display:none;padding:10px 10px 0px 0px;" align=right></div>
<%
if (layoutStr != null) {
%>
	<%@include file="layoutMakeFromMeta.jsp"%>	
<%
} else if(hiddenInfo.containsKey("_STPREPORT_OUT_LAYOUT")){
	Stub.incFile(hiddenInfo,"_STPREPORT_OUT_LAYOUT", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
} else if (rptType.equalsIgnoreCase("opnSWSlickGrid")) {
%>
	<%@include file="layoutSlickGrid.jsp"%>	
<%
} else if (rptType.equalsIgnoreCase("opnSWSlickGridTree")) {
%>
	<%@include file="layoutSlickGridTree.jsp"%>	
<%
} else if (rptType.equalsIgnoreCase("opnSWPVT")) {
%>
	<%@include file="layoutPVT.jsp"%>	
<%
} else if (rptType.equalsIgnoreCase("opnSWPVTUI")) {
%>
	<%@include file="layoutPVTUI.jsp"%>	
<%
} else {
%>
	<%@include file="layoutDefault.jsp"%>	
<%
}
%>
<div id=dvDummy style="display:none;width:1000000"></div>
<div id=dvUserHeader style="display:none;">
<%=userDefinedHeader.view(sci)%>
<%
Stub.incFile(hiddenInfo,"_STPREPORT_HEADER_HTML", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
%>
</div>
<div id="progressIndicatorWIP"
      style="display:none; position:absolute;top:200px;left:0px;  padding:50px 100px 50px 100px;  z-index:50000; border: 2px solid #dfdfdf; background-color: #FFFFFF">
    <table border="0" cellspacing="0" cellpadding="0" style="height:100%;width:100%;" summary="">
        <tr>
            <td style="text-align:center;vertical-align:top;">
                <table border="0" cellspacing="0" cellpadding="0" style="width:100%;" summary="">

                    <tr>
                        <td style="text-align:center;vertical-align:bottom;">
                            <img id="progressIndicatorImage" src='/<%=contextName%>/images/progress.gif'
                                style="width:120px; height:120px" alt="잠시 기다리십시오." />
                        </td>
                    </tr>
                    <tr><td class="lineSpacer">&nbsp;</td></tr>
                    <tr>
                        <td style="text-align:center;vertical-align:top;" class="progress">
                            <span id="pleaseWaitMessage">
                                잠시 기다리십시오.
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align:center;vertical-align:top;" class="progress">
                            <span id="progressMessage">
                                시스템이 정보를 탐색 중입니다...
                            </span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
<div id=dvTooltip style=""></div>
<div id=dvHelp class="dvHelp"></div>
<div id=dvSASLogWin class="dvSASLogWin">
	<div onClick="$('#dvSASLogWin').hide();" class="ui-widget-header dvSASLogHeader">
	SAS Log
	</div>
	<div id=dvSASLog  class="dvSASLog"></div>
</div>
<script>
$(document).ready(function () {
	$("#dvSASLogWin").on( "resize", function() {
		console.log("dvSASLogWin resize occured...");
		$("#dvSASLog").height($("#dvSASLogWin").height());
		$("#dvSASLog").width($("#dvSASLogWin").width());
	});
	$( "#dvSASLogWin" ).trigger( "resize" );
<%
	for (int i = 0; i < promptDefinitions.size(); i++) {
		PromptDefinitionInterface pdi = promptDefinitions.get(i);
		if (pdi instanceof DateRangeDefinition || pdi instanceof SharedDateRangeDefinition) {
%>
	var <%=pdi.getPromptName()%>_start = getCookie('<%=pdi.getPromptName()%>_start');
	if (<%=pdi.getPromptName()%>_start != undefined && <%=pdi.getPromptName()%>_start != ""){ 
		$("#slt<%=pdi.getPromptName()%>_start").val(<%=pdi.getPromptName()%>_start);
	}
	var <%=pdi.getPromptName()%>_end = getCookie('<%=pdi.getPromptName()%>_end');
	if (<%=pdi.getPromptName()%>_end != undefined && <%=pdi.getPromptName()%>_end != ""){ 
		$("#slt<%=pdi.getPromptName()%>_end").val(<%=pdi.getPromptName()%>_end);
		console.log("<%=pdi.getPromptName()%>_start : " + <%=pdi.getPromptName()%>_start);
		console.log("<%=pdi.getPromptName()%>_end : " + <%=pdi.getPromptName()%>_end);
	} 
<%			
		} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
%>
	var <%=pdi.getPromptName()%> = getCookie('<%=pdi.getPromptName()%>');
	if (<%=pdi.getPromptName()%> != undefined && <%=pdi.getPromptName()%> != ""){ 
		$("#slt<%=pdi.getPromptName()%>").val(<%=pdi.getPromptName()%>);
		console.log("<%=pdi.getPromptName()%> : " + <%=pdi.getPromptName()%>);
	} 
<%			
		} 
	}
%>
});
</script> 
<div id=dvAlert style="position: absolute;width:300px;display:none;padding: 15px;z-index: 100001;
	background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
	<div id=dvMsgBox style="font-size:11pt;padding:15px 0px 15px 0px;"></div>
	<div align=center>
		<input type=button id="btnAlertMsgOK" class="condBtn" value="OK" onclick="hideMsgBox();">
	</div>
</div>
<div id=dvConfirm style="position: absolute;width:300px;display:none;padding: 15px;z-index: 100001;
	background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
	<div id=dvConfirmMsgBox style="font-size:11pt;padding:15px 0px 15px 0px;"></div>
	<div align=center>
		<input type=button id="btnConfirmMsgOK"     class="condBtn" value="OK"     onclick="hideConfirmMsgBox(true,confirmFN);">
		<input type=button id="btnConfirmMsgCancel" class="condBtn" value="Cancel" onclick="hideConfirmMsgBox(false);">
	</div>
</div>
<div id=dvBG style="position: absolute;top:0px;left:0px;display:none;z-index: 100000;background: #efefef;opacity: 0.8;"></div>
<div id="canvas" style="dislplay:none;"></div>
<div id="previewGraph"></div>
<div id=grPop style="position:absolute;display:none;cursor:pointer;padding: 15px;z-index: 100001;background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
<span onClick="saveGraph();">Save Graph as PNG</span>
</div>

<script>
	$("#progressIndicatorWIP").css("left",eval(eval($(window).width()-$("#progressIndicatorWIP").width()-300)/2));
	$("#progressIndicatorWIP").css("top",eval(eval($(window).height()-$("#progressIndicatorWIP").height()-300)/2));
<%
	Viewer.prtGenLayoutScript(layoutStr,metaID,out);
%>
var nvcss=".nvd3 .nv-axis line,.nvd3 .nv-axis path{fill:none;shape-rendering:crispEdges}.nv-brush .extent,.nvd3 .background path,.nvd3 .nv-axis line,.nvd3 .nv-axis path{shape-rendering:crispEdges}.nv-distx,.nv-disty,.nv-noninteractive,.nvd3 .nv-axis,.nvd3.nv-pie .nv-label,.nvd3.nv-sparklineplus g.nv-hoverValue{pointer-events:none}.nvtooltip,svg.nvd3-svg{display:block;-webkit-touch-callout:none;-khtml-user-select:none}.nvd3 .nv-axis{opacity:1}.nvd3 .nv-axis.nv-disabled,.nvd3 .nv-controlsWrap .nv-legend .nv-check-box .nv-check{opacity:0}.nvd3 .nv-axis path{stroke:#000;stroke-opacity:.75}.nvd3 .nv-axis path.domain{stroke-opacity:.75}.nvd3 .nv-axis.nv-x path.domain{stroke-opacity:0}.nvd3 .nv-axis line{stroke:#e5e5e5}.nvd3 .nv-axis .zero line, .nvd3 .nv-axis line.zero{stroke-opacity:.75}.nvd3 .nv-axis .nv-axisMaxMin text{font-weight:700}.nvd3 .x .nv-axis .nv-axisMaxMin text,.nvd3 .x2 .nv-axis .nv-axisMaxMin text,.nvd3 .x3 .nv-axis .nv-axisMaxMin text{text-anchor:middle}.nvd3 .nv-bars rect{fill-opacity:.75;transition:fill-opacity 250ms linear;-moz-transition:fill-opacity 250ms linear;-webkit-transition:fill-opacity 250ms linear}.nvd3 .nv-bars rect.hover{fill-opacity:1}.nvd3 .nv-bars .hover rect{fill:#add8e6}.nvd3 .nv-bars text{fill:transparent}.nvd3 .nv-bars .hover text{fill:rgba(0,0,0,1)}.nvd3 .nv-discretebar .nv-groups rect,.nvd3 .nv-multibar .nv-groups rect,.nvd3 .nv-multibarHorizontal .nv-groups rect{stroke-opacity:0;transition:fill-opacity 250ms linear;-moz-transition:fill-opacity 250ms linear;-webkit-transition:fill-opacity 250ms linear}.nvd3 .nv-candlestickBar .nv-ticks rect:hover,.nvd3 .nv-discretebar .nv-groups rect:hover,.nvd3 .nv-multibar .nv-groups rect:hover,.nvd3 .nv-multibarHorizontal .nv-groups rect:hover{fill-opacity:1}.nvd3 .nv-discretebar .nv-groups text,.nvd3 .nv-multibarHorizontal .nv-groups text{font-weight:700;fill:rgba(0,0,0,1);stroke:transparent}.nvd3 .nv-boxplot circle{fill-opacity:.5}.nvd3 .nv-boxplot circle:hover,.nvd3 .nv-boxplot rect:hover{fill-opacity:1}.nvd3 line.nv-boxplot-median{stroke:#000}.nv-boxplot-tick:hover{stroke-width:2.5px}.nvd3.nv-bullet{font:10px sans-serif}.nvd3.nv-bullet .nv-measure{fill-opacity:.8}.nvd3.nv-bullet .nv-measure:hover{fill-opacity:1}.nvd3.nv-bullet .nv-marker{stroke:#000;stroke-width:2px}.nvd3.nv-bullet .nv-markerTriangle{stroke:#000;fill:#fff;stroke-width:1.5px}.nvd3.nv-bullet .nv-tick line{stroke:#666;stroke-width:.5px}.nvd3.nv-bullet .nv-range.nv-s0{fill:#eee}.nvd3.nv-bullet .nv-range.nv-s1{fill:#ddd}.nvd3.nv-bullet .nv-range.nv-s2{fill:#ccc}.nvd3.nv-bullet .nv-title{font-size:14px;font-weight:700}.nvd3.nv-bullet .nv-subtitle{fill:#999}.nvd3.nv-bullet .nv-range{fill:#bababa;fill-opacity:.4}.nvd3.nv-bullet .nv-range:hover{fill-opacity:.7}.nvd3.nv-candlestickBar .nv-ticks .nv-tick{stroke-width:1px}.nvd3.nv-candlestickBar .nv-ticks .nv-tick.hover{stroke-width:2px}.nvd3.nv-candlestickBar .nv-ticks .nv-tick.positive rect{stroke:#2ca02c;fill:#2ca02c}.nvd3.nv-candlestickBar .nv-ticks .nv-tick.negative rect{stroke:#d62728;fill:#d62728}.with-transitions .nv-candlestickBar .nv-ticks .nv-tick{transition:stroke-width 250ms linear,stroke-opacity 250ms linear;-moz-transition:stroke-width 250ms linear,stroke-opacity 250ms linear;-webkit-transition:stroke-width 250ms linear,stroke-opacity 250ms linear}.nvd3.nv-candlestickBar .nv-ticks line{stroke:#333}.nvd3 .nv-check-box .nv-box{fill-opacity:0;stroke-width:2}.nvd3 .nv-check-box .nv-check{fill-opacity:0;stroke-width:4}.nvd3 .nv-series.nv-disabled .nv-check-box .nv-check{fill-opacity:0;stroke-opacity:0}.nvd3.nv-linePlusBar .nv-bar rect{fill-opacity:.75}.nvd3.nv-linePlusBar .nv-bar rect:hover{fill-opacity:1}.nvd3 .nv-groups path.nv-line{fill:none}.nvd3 .nv-groups path.nv-area{stroke:none}.nvd3.nv-line .nvd3.nv-scatter .nv-groups .nv-point{fill-opacity:0;stroke-opacity:0}.nvd3.nv-scatter.nv-single-point .nv-groups .nv-point{fill-opacity:.5!important;stroke-opacity:.5!important}.with-transitions .nvd3 .nv-groups .nv-point{transition:stroke-width 250ms linear,stroke-opacity 250ms linear;-moz-transition:stroke-width 250ms linear,stroke-opacity 250ms linear;-webkit-transition:stroke-width 250ms linear,stroke-opacity 250ms linear}.nvd3 .nv-groups .nv-point.hover,.nvd3.nv-scatter .nv-groups .nv-point.hover{stroke-width:7px;fill-opacity:.95!important;stroke-opacity:.95!important}.nvd3 .nv-point-paths path{stroke:#aaa;stroke-opacity:0;fill:#eee;fill-opacity:0}.nvd3 .nv-indexLine{cursor:ew-resize}svg.nvd3-svg{-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;user-select:none;width:100%;height:100%}.nvtooltip.with-3d-shadow,.with-3d-shadow .nvtooltip{-moz-box-shadow:0 5px 10px rgba(0,0,0,.2);-webkit-box-shadow:0 5px 10px rgba(0,0,0,.2);box-shadow:0 5px 10px rgba(0,0,0,.2);-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px}.nvd3 text{font:400 12px Arial}.nvd3 .title{font:700 14px Arial}.nvd3 .nv-background{fill:#fff;fill-opacity:0}.nvd3.nv-noData{font-size:18px;font-weight:700}.nv-brush .extent{fill-opacity:.125}.nv-brush .resize path{fill:#eee;stroke:#666}.nvd3 .nv-legend .nv-series{cursor:pointer}.nvd3 .nv-legend .nv-disabled circle{fill-opacity:0}.nvd3 .nv-brush .extent{fill-opacity:0!important}.nvd3 .nv-brushBackground rect{stroke:#000;stroke-width:.4;fill:#fff;fill-opacity:.7}.nvd3.nv-ohlcBar .nv-ticks .nv-tick{stroke-width:1px}.nvd3.nv-ohlcBar .nv-ticks .nv-tick.hover{stroke-width:2px}.nvd3.nv-ohlcBar .nv-ticks .nv-tick.positive{stroke:#2ca02c}.nvd3.nv-ohlcBar .nv-ticks .nv-tick.negative{stroke:#d62728}.nvd3 .background path{fill:none;stroke:#EEE;stroke-opacity:.4}.nvd3 .foreground path{fill:none;stroke-opacity:.7}.nvd3 .nv-parallelCoordinates-brush .extent{fill:#fff;fill-opacity:.6;stroke:gray;shape-rendering:crispEdges}.nvd3 .nv-parallelCoordinates .hover{fill-opacity:1;stroke-width:3px}.nvd3 .missingValuesline line{fill:none;stroke:#000;stroke-width:1;stroke-opacity:1;stroke-dasharray:5,5}.nvd3.nv-pie .nv-pie-title{font-size:24px;fill:rgba(19,196,249,.59)}.nvd3.nv-pie .nv-slice text{stroke:#000;stroke-width:0}.nvd3.nv-pie path{transition:fill-opacity 250ms linear,stroke-width 250ms linear,stroke-opacity 250ms linear;-moz-transition:fill-opacity 250ms linear,stroke-width 250ms linear,stroke-opacity 250ms linear;-webkit-transition:fill-opacity 250ms linear,stroke-width 250ms linear,stroke-opacity 250ms linear;stroke:#fff;stroke-width:1px;stroke-opacity:1}.nvd3.nv-pie .hover path{fill-opacity:.7}.nvd3.nv-pie .nv-label rect{fill-opacity:0;stroke-opacity:0}.nvd3 .nv-groups .nv-point.hover{stroke-width:20px;stroke-opacity:.5}.nvd3 .nv-scatter .nv-point.hover{fill-opacity:1}.nvd3.nv-sparkline path{fill:none}.nvd3.nv-sparklineplus .nv-hoverValue line{stroke:#333;stroke-width:1.5px}.nvd3.nv-sparklineplus,.nvd3.nv-sparklineplus g{pointer-events:all}.nvd3 .nv-interactiveGuideLine,.nvtooltip{pointer-events:none}.nvd3 .nv-hoverArea{fill-opacity:0;stroke-opacity:0}.nvd3.nv-sparklineplus .nv-xValue,.nvd3.nv-sparklineplus .nv-yValue{stroke-width:0;font-size:.9em;font-weight:400}.nvd3.nv-sparklineplus .nv-yValue{stroke:#f66}.nvd3.nv-sparklineplus .nv-maxValue{stroke:#2ca02c;fill:#2ca02c}.nvd3.nv-sparklineplus .nv-minValue{stroke:#d62728;fill:#d62728}.nvd3.nv-sparklineplus .nv-currentValue{font-weight:700;font-size:1.1em}.nvtooltip h3,.nvtooltip table td.key{font-weight:400}.nvd3.nv-stackedarea path.nv-area{fill-opacity:.7;stroke-opacity:0;transition:fill-opacity 250ms linear,stroke-opacity 250ms linear;-moz-transition:fill-opacity 250ms linear,stroke-opacity 250ms linear;-webkit-transition:fill-opacity 250ms linear,stroke-opacity 250ms linear}.nvd3.nv-stackedarea path.nv-area.hover{fill-opacity:.9}.nvd3.nv-stackedarea .nv-groups .nv-point{stroke-opacity:0;fill-opacity:0}.nvtooltip{position:absolute;color:rgba(0,0,0,1);padding:1px;z-index:10000;font-family:Arial;font-size:13px;text-align:left;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background:rgba(255,255,255,.8);border:1px solid rgba(0,0,0,.5);border-radius:4px}.nvtooltip h3,.nvtooltip p{margin:0;text-align:center}.nvtooltip.with-transitions,.with-transitions .nvtooltip{transition:opacity 50ms linear;-moz-transition:opacity 50ms linear;-webkit-transition:opacity 50ms linear;transition-delay:200ms;-moz-transition-delay:200ms;-webkit-transition-delay:200ms}.nvtooltip.x-nvtooltip,.nvtooltip.y-nvtooltip{padding:8px}.nvtooltip h3{padding:4px 14px;line-height:18px;background-color:rgba(247,247,247,.75);color:rgba(0,0,0,1);border-bottom:1px solid #ebebeb;-webkit-border-radius:5px 5px 0 0;-moz-border-radius:5px 5px 0 0;border-radius:5px 5px 0 0}.nvtooltip p{padding:5px 14px}.nvtooltip span{display:inline-block;margin:2px 0}.nvtooltip table{margin:6px;border-spacing:0}.nvtooltip table td{padding:2px 9px 2px 0;vertical-align:middle}.nvtooltip table td.key.total{font-weight:700}.nvtooltip table td.value{text-align:right;font-weight:700}.nvtooltip table tr.highlight td{padding:1px 9px 1px 0;border-bottom-style:solid;border-bottom-width:1px;border-top-style:solid;border-top-width:1px}.nvtooltip table td.legend-color-guide div{vertical-align:middle;width:12px;height:12px;border:1px solid #999}.nvtooltip .footer{padding:3px;text-align:center}.nvtooltip-pending-removal{pointer-events:none;display:none}.nvd3 line.nv-guideline{stroke:#ccc}";
</script>
<%
logger.debug("stpCustPath: "+(String)session.getAttribute("sas_StoredProcessCustomPath_HBI"));
Stub.incFile(hiddenInfo,"_STPREPORT_END_JS", (String)session.getAttribute("sas_StoredProcessCustomFile_HBI"),out); 
%>
<div style="display:none;">
	<form name=fomExcel method=post>
	<input type=hidden name=sas_forwardLocation value=EXCEL>
	<input type=hidden name=sasExcel value=EXCEL>
	<input type=hidden name=_program value="">
	<input type=hidden name=_debug value="0">
	<input type=hidden name=_savepath value="">
	<input type=hidden name=_sessionid value="">
	<input type=hidden name=param1 value="">
<%
	for (int i = 0; i < promptDefinitions.size(); i++) {
		PromptDefinitionInterface pdi = promptDefinitions.get(i);
		if (pdi instanceof DateRangeDefinition || pdi instanceof SharedDateRangeDefinition) {
			hStr="\t<input type=hidden name=" + pdi.getPromptName() + "_start" + " value=''>";
			out.println(hStr);
			hStr="\t<input type=hidden name=" + pdi.getPromptName() + "_end" + " value=''>";
			out.println(hStr);
		} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
			hStr="\t<input type=hidden name=" + pdi.getPromptName() + "" + " value=''>";
			out.println(hStr);
		} else {
			hStr="\t<input type=hidden name=" + pdi.getPromptName() + " value=''>";
			out.println(hStr);
		}
	}
%>
	</form>
	<form name=fomPagerDataExcel method=post>
	<input type=hidden name=sas_forwardLocation value=EXCEL_POI>
	<input type=hidden name=sasExcel value=EXCEL>
	<input type=hidden name=_sessionid value="">
	<input type=hidden name=_savepath value="">
	<input type=hidden name=_debug value="">
	<input type=hidden name=_data value="webdata">
	</form>
	<iframe id="fileDown" name="fileDown" style='display:none;' src="" width="0" height="0" frameborder="0"></iframe>
</div>
</body>
</html>