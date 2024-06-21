package com.sas.hbi.tools;


import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map.Entry;
import java.util.Properties;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.jsp.JspWriter;

import org.apache.log4j.ConsoleAppender;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import org.apache.log4j.PatternLayout;
import org.json.JSONObject;

import com.sas.hbi.property.HBIConfig;
import com.sas.hbi.storedprocess.StoredProcessFacade;
import com.sas.prompts.InvalidPromptValueException;
import com.sas.prompts.definitions.DateDefinition;
import com.sas.prompts.definitions.DateRangeDefinition;
import com.sas.prompts.definitions.DoubleDefinition;
import com.sas.prompts.definitions.InputFileDefinition;
import com.sas.prompts.definitions.IntegerDefinition;
import com.sas.prompts.definitions.PromptDefinitionInterface;
import com.sas.prompts.definitions.TextDefinition;
import com.sas.prompts.definitions.shared.SharedDateDefinition;
import com.sas.prompts.definitions.shared.SharedDateRangeDefinition;
import com.sas.prompts.definitions.shared.SharedTextDefinition;
import com.sas.prompts.simplesqlmodel.PromptValueOperand;
import com.sas.prompts.valueprovider.dynamic.DataProvider;
import com.sas.prompts.valueprovider.dynamic.DataProviderUtil;
import com.sas.prompts.valueprovider.dynamic.workspace.PromptColumnValueProvider;
import com.sas.services.connection.BridgeServer;
import com.sas.services.connection.ConnectionFactoryAdminInterface;
import com.sas.services.connection.ConnectionFactoryConfiguration;
import com.sas.services.connection.ConnectionFactoryException;
import com.sas.services.connection.ConnectionFactoryInterface;
import com.sas.services.connection.ConnectionFactoryManager;
import com.sas.services.connection.ConnectionInterface;
import com.sas.services.connection.ManualConnectionFactoryConfiguration;
import com.sas.services.InitializationException;
import com.sas.services.ServiceException;
import com.sas.services.TransportException;
import com.sas.services.connection.Server;
import com.sas.services.information.metadata.LogicalServerInterface;
import com.sas.services.information.metadata.MetadataInterface;
import com.sas.services.information.metadata.PathUrl;
import com.sas.services.information.metadata.PhysicalTableInterface;
import com.sas.services.information.metadata.SASLibraryInterface;
import com.sas.services.information.ServerInterface;
import com.sas.services.information.RepositoryInterface;
import com.sas.services.session.SessionContextInterface;
import com.sas.services.storedprocess.Execution2Interface;
import com.sas.services.storedprocess.ExecutionBaseInterface;
import com.sas.services.storedprocess.ExecutionException;
import com.sas.services.storedprocess.MetadataConstants;
import com.sas.services.storedprocess.StoredProcess2Interface;
import com.sas.services.storedprocess.StoredProcessBaseInterface;
import com.sas.services.storedprocess.StoredProcessServiceFactory;
import com.sas.services.storedprocess.StoredProcessServiceInterface;
import com.sas.services.storedprocess.metadata.StoredProcessInterface;
import com.sas.services.storedprocess.metadata.StoredProcessOptions;
import com.sas.services.user.UserContextInterface;
import com.sas.services.user.UserIdentityInterface;
import com.sas.storage.exception.ServerConnectionException;
import com.sas.storage.simplesqlmodel.ColumnInfo;
import com.sas.storage.simplesqlmodel.ColumnOperand;
import com.sas.storage.simplesqlmodel.Expression;
import com.sas.storage.simplesqlmodel.OperandInterface;
import com.sas.storage.simplesqlmodel.OperatorInterface;
import com.sas.storage.simplesqlmodel.WhereClause;
import com.sas.storage.valueprovider.StaticValueProvider;
import com.sas.storage.valueprovider.ValueProviderException;
import com.sas.storage.valueprovider.ValueProviderInterface;
import com.sas.web.keys.CommonKeys;


public class Viewer {
	private static String hStr="";
	private Logger logger ;
	
	public Viewer() {
		logger = Logger.getLogger("Viewer");
		//logger.setLevel(Level.DEBUG);
	}
	public void prtPromptInParam(List<PromptDefinitionInterface> promptDefinitions,Locale locale,JspWriter out) throws IOException{
		for (int i = 0; i < promptDefinitions.size(); i++) {
			PromptDefinitionInterface pdi = promptDefinitions.get(i);
			if (pdi instanceof DateRangeDefinition || pdi instanceof SharedDateRangeDefinition) {
				hStr="\t\t\t" + pdi.getPromptName() + "_start" + "\t:  " + pdi.getPromptName() + "_start" + ",";
				out.println(hStr);
				hStr="\t\t\t" + pdi.getPromptName() + "_end" + "\t:  " + pdi.getPromptName() + "_end" + ",";
				out.println(hStr);
			} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
				hStr="\t\t\t" + pdi.getPromptName() + "\t:  " + pdi.getPromptName() + ",";
				out.println(hStr);
			} else {
				String isTextBox="";
				if (pdi instanceof TextDefinition){
					TextDefinition td = (TextDefinition)pdi;
					ValueProviderInterface vs=td.getValueProvider();
					if (vs == null) isTextBox="Y";
				}
				hStr="\t\t\t" + pdi.getPromptName() + "\t:  " + pdi.getPromptName() + ",";
				out.println(hStr);
				boolean t1=pdi.isHidden();
				String prmtLabel=pdi.getPromptLabel(locale);
				String prmtName=pdi.getPromptName();
				if (prmtLabel==null) prmtLabel=prmtName;
				String uLabel=prmtLabel.toUpperCase();
				boolean t2=uLabel.equalsIgnoreCase("_STPREPORT_DUMMY");
				boolean t3=uLabel.equalsIgnoreCase("_STPREPORT_LF");
				boolean t4=isTextBox.equalsIgnoreCase("Y");
				logger.debug("prmtLabel : " + prmtLabel);
				logger.debug("prmtName : " + prmtName);
				if(!pdi.isHidden()&&										
					!uLabel.equalsIgnoreCase("_STPREPORT_DUMMY")&&									
					!uLabel.equalsIgnoreCase("_STPREPORT_LF")&&
					!isTextBox.equalsIgnoreCase("Y")
				){									
					hStr="\t\t\t" + pdi.getPromptName() + "_txt\t:  " + pdi.getPromptName() + "_txt,";
					out.println(hStr);
				}
			}
		}
	}
	public void prtInitPromptValue(List<PromptDefinitionInterface> promptDefinitions,Locale locale,JspWriter out) throws IOException {
		for (int i = 0; i < promptDefinitions.size(); i++) {
			PromptDefinitionInterface pdi = promptDefinitions.get(i);
			if (pdi instanceof DateRangeDefinition || pdi instanceof SharedDateRangeDefinition) {
				hStr="var " + pdi.getPromptName() + "_start" + "=\"\";";
				out.println(hStr);
				hStr="var " + pdi.getPromptName() + "_end" + "=\"\";";
				out.println(hStr);
			} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
				hStr="var " + pdi.getPromptName() + "=\"\";";
				out.println(hStr);
			} else {
				hStr="var " + pdi.getPromptName() + "=\"\";";
				out.println(hStr);
			}
		}
	}

	public void prtGetPromptValue(List<PromptDefinitionInterface> promptDefinitions,Locale locale,JspWriter out) throws IOException {
		//Logger logger = Logger.getLogger("prtGetPromptValue");
		for (int i = 0; i < promptDefinitions.size(); i++) {
			PromptDefinitionInterface pdi = promptDefinitions.get(i);
			String isTextBox="";
			if (pdi instanceof TextDefinition){
				TextDefinition td = (TextDefinition)pdi;
				ValueProviderInterface vs=td.getValueProvider();
				if (vs == null) isTextBox="Y";
			} else if (pdi instanceof IntegerDefinition) {
				IntegerDefinition id = (IntegerDefinition)pdi;
				ValueProviderInterface vs=id.getValueProvider();
				if (vs == null) isTextBox="Y";
			} else if (pdi instanceof DoubleDefinition) {
				DoubleDefinition dd = (DoubleDefinition)pdi;
				ValueProviderInterface vs=dd.getValueProvider();
				if (vs == null) isTextBox="Y";
			} else if (pdi instanceof SharedTextDefinition){
				SharedTextDefinition sd = (SharedTextDefinition)pdi;
				ValueProviderInterface vs=sd.getValueProvider();
				if (vs == null) isTextBox="Y";
			} else if (pdi instanceof DateDefinition || pdi instanceof DateRangeDefinition ||
				pdi instanceof SharedDateDefinition || pdi instanceof SharedDateRangeDefinition) {
				isTextBox="Y";
			}
			logger.debug("isTextBox:" + pdi.getPromptName() + ":" + isTextBox);
			if (isTextBox=="Y") {
				logger.debug("isTextBox:" +pdi.getPromptName()+ " : " + pdi.toString());
				if (pdi instanceof DateRangeDefinition || pdi instanceof SharedDateRangeDefinition) {
					hStr="\t" + pdi.getPromptName() + "_start" + "=$(\"#slt" + pdi.getPromptName()+ "_start\").val();";
					out.println(hStr);
					hStr="\t" + pdi.getPromptName() + "_end" + "=$(\"#slt" + pdi.getPromptName()+ "_end\").val();";
					out.println(hStr);
					hStr="\tif (" + pdi.getPromptName() + "_start != \"\") setCookie(\"" + pdi.getPromptName() + "_start\"," + pdi.getPromptName() + "_start,30);";
					out.println(hStr);
					hStr="\tif (" + pdi.getPromptName() + "_end != \"\") setCookie(\"" + pdi.getPromptName() + "_end\"," + pdi.getPromptName() + "_end,30);\n";
					out.println(hStr);
				} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
					hStr="\t" + pdi.getPromptName() + "=$(\"#slt" + pdi.getPromptName()+ "\").val();";
					out.println(hStr);
					hStr="\tif (" + pdi.getPromptName() + " != \"\") setCookie(\"" + pdi.getPromptName() + "\"," + pdi.getPromptName() + ",30);\n";
					out.println(hStr);
				} else {
					hStr="\t" + pdi.getPromptName() + "=$(\"#slt" + pdi.getPromptName()+ "\").val();";
					out.println(hStr);
				}
			} else {
				hStr="\t" + pdi.getPromptName() + "=$(\"#slt" + pdi.getPromptName()+ " option:selected\").val();";
				out.println(hStr);
				boolean t1=pdi.isHidden();
				String prmtLabel=pdi.getPromptLabel(locale);
				String prmtName=pdi.getPromptName();
				if (prmtLabel==null) prmtLabel=prmtName;
				String uLabel=prmtLabel.toUpperCase();
				logger.debug("prmtLabel : " + prmtLabel);
				logger.debug("prmtName : " + prmtName);
				logger.debug("isTextBox : " + isTextBox.equalsIgnoreCase("Y"));
		
				if(!pdi.isHidden()&&												
						!uLabel.equalsIgnoreCase("_STPREPORT_DUMMY")&&											
						!uLabel.equalsIgnoreCase("_STPREPORT_LF")&&
						!isTextBox.equalsIgnoreCase("Y")
				){											
					hStr="\t" + pdi.getPromptName() + "_txt=$(\"#slt" + pdi.getPromptName()+ " option:selected\").text();";
					out.println(hStr);
				}
			}
		}
	}
	public void prtGetPromptValue(List<PromptDefinitionInterface> promptDefinitions,Locale locale,JspWriter out, Boolean isParam) throws IOException {
		//Logger logger = Logger.getLogger("prtGetPromptValue");
		String hStr="";
		for (int i = 0; i < promptDefinitions.size(); i++) {
			PromptDefinitionInterface pdi = promptDefinitions.get(i);
			String isTextBox="";
			if (pdi instanceof TextDefinition){
				TextDefinition td = (TextDefinition)pdi;
				ValueProviderInterface vs=td.getValueProvider();
				if (vs == null) isTextBox="Y";
			} else if (pdi instanceof IntegerDefinition) {
				IntegerDefinition id = (IntegerDefinition)pdi;
				ValueProviderInterface vs=id.getValueProvider();
				if (vs == null) isTextBox="Y";
			} else if (pdi instanceof DoubleDefinition) {
				DoubleDefinition dd = (DoubleDefinition)pdi;
				ValueProviderInterface vs=dd.getValueProvider();
				if (vs == null) isTextBox="Y";
			} else if (pdi instanceof SharedTextDefinition){
				SharedTextDefinition sd = (SharedTextDefinition)pdi;
				ValueProviderInterface vs=sd.getValueProvider();
				if (vs == null) isTextBox="Y";
			} else if (pdi instanceof DateDefinition || pdi instanceof DateRangeDefinition ||
				pdi instanceof SharedDateDefinition || pdi instanceof SharedDateRangeDefinition) {
				isTextBox="Y";
			}
			logger.debug("isTextBox:" + pdi.getPromptName() + ":" + isTextBox);
			if (isTextBox=="Y") {
				logger.debug("isTextBox:" +pdi.getPromptName()+ " : " + pdi.toString());
				if (pdi instanceof DateRangeDefinition || pdi instanceof SharedDateRangeDefinition) {
					hStr="\tvar " + pdi.getPromptName() + "_start" + "=$(\"#slt" + pdi.getPromptName()+ "_start\").val();";
					out.println(hStr);
					hStr="\tvar " + pdi.getPromptName() + "_end" + "=$(\"#slt" + pdi.getPromptName()+ "_end\").val();";
					out.println(hStr);
					if (isParam){
						hStr="\tif (" + pdi.getPromptName() + "_start != \"\") setCookie(\"" + pdi.getPromptName() + "_start\"," + pdi.getPromptName() + "_start,30);";
						out.println(hStr);
						hStr="\tif (" + pdi.getPromptName() + "_end != \"\") setCookie(\"" + pdi.getPromptName() + "_end\"," + pdi.getPromptName() + "_end,30);\n";
						out.println(hStr);
					}
				} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
					hStr="\tvar " + pdi.getPromptName() + "=$(\"#slt" + pdi.getPromptName()+ "\").val();";
					out.println(hStr);
					if (isParam){
						hStr="\tif (" + pdi.getPromptName() + " != \"\") setCookie(\"" + pdi.getPromptName() + "\"," + pdi.getPromptName() + ",30);\n";
						out.println(hStr);
					}
				} else {
					hStr="\tvar " + pdi.getPromptName() + "=$(\"#slt" + pdi.getPromptName()+ "\").val();";
					out.println(hStr);
				}
			} else {
				hStr="\tvar " + pdi.getPromptName() + "=$(\"#slt" + pdi.getPromptName()+ " option:selected\").val();";
				out.println(hStr);
				if(!pdi.isHidden()&&												
						 !pdi.getPromptLabel(locale).toUpperCase().equalsIgnoreCase("_STPREPORT_DUMMY")&&											
						 !pdi.getPromptLabel(locale).toUpperCase().equalsIgnoreCase("_STPREPORT_LF")){											
					hStr="\tvar " + pdi.getPromptName() + "_txt=$(\"#slt" + pdi.getPromptName()+ " option:selected\").text();";
					out.println(hStr);
				}
			}
		}
	}
	
	
	public void prtGetMultiSelectValue(List<String> multiInfo, JspWriter out) throws IOException{
		for(int i=0; i<multiInfo.size();i++){
			String multiVar=multiInfo.get(i);
			out.println("\tvar mVarNM=\""+multiVar+"\";");
			out.println("\tvar multi=$(\"#slt" + multiVar + "\").val() || [];");
			out.println("\tvar mCount=multi.length;");
			out.println("\tparam[mVarNM+0]=mCount;");
			out.println("\tfor (var i = 0; i < multi.length; i++){");
			out.println("\t\tpName=mVarNM+eval(i+1);");
			out.println("\t\tparam[pName]=multi[i];");
			out.println("\t}");
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
					String initValue="";
					String onChg="";
					logger.debug("default Value: " + dftValue);
					int maxLength=((TextDefinition) pdi).getMaximumLength();
					logger.debug("maxLength:"+maxLength);
					int maxVal=((TextDefinition) pdi).getMaximumValueCount();
					if (maxVal > 10) maxVal=10;
					int selectionType=td.getSelectionType();
					if (selectionType > 300) multiple=" multiple ";
					if (!pdi.isRequired()) initValue="<option value=''>전체</option>";

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
								+ ">" + initValue + "</select></td></tr></table></span>";
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
	public void prtGenExecScript(List<PromptDefinitionInterface> promptDefinitions,String metaID,String rptType,String sp_pathUrl,
			HashMap<String, String> hiddenInfo,String stpCustomFile,
			String layoutStr,String custOutJS,boolean isOSW,Locale locale, JspWriter out) throws IOException {
		Logger logger = Logger.getLogger("prtGenExecScript");
		JSONObject rowObj = null;
		if (custOutJS.equalsIgnoreCase("") && !isOSW) {
			out.println("\tsetTimeout(\"getMain()\",1000*1);");	
		} else {
			prtGetPromptValue(promptDefinitions, locale, out, false);
			if(layoutStr != null){
				int udInterval=0;
				try{
				rowObj = new JSONObject(layoutStr);
				for (int ii=0; ii<rowObj.length(); ii++){
					JSONObject row=rowObj.getJSONObject("R"+ii);
					logger.debug("JSONObject row: " + row);
					for(int jj=0;jj<row.length();jj++){
						JSONObject colObj=row.getJSONObject("C"+jj);
						logger.debug("JSONObject colObj : " + colObj);
						String objID=(String)colObj.get("id");
						String stp=(String)colObj.get("stp");
						String type=(String)colObj.get("type");
						String outType="json";
						String graph_type=(String)colObj.get("graph_type");
						String execType="";
						if (colObj.has("exec")) execType=(String)colObj.get("exec");
						logger.debug("objID : " + objID + " execType : " + execType);
						out.println("\t$('#"+objID+"').show();");	
						
						logger.debug("obj.type : " + type);
						
						if (type.equalsIgnoreCase("HTML")) outType="html";
						boolean isAsync = true;	//"STP_ASYNC"
						if (!type.equalsIgnoreCase("Tag")) {
							if ( execType.equalsIgnoreCase("UD") ){
								String fURL="";
								//String objType=(String)colObj.get("type");
								if (type.equalsIgnoreCase("Graph")) fURL="submit"+graph_type;
								else fURL="submit" + type;
								//else fURL="submit" + objType;
								//if (type.equalsIgnoreCase("HTML")) outType="html";
								out.println("\texecAjax(\"" + fURL +"\",\""+metaID+"\",true,\"render" + objID + "\",\""+outType+"\",\""+objID+"\");");	
								udInterval++;
							} else if ( !stp.equalsIgnoreCase("") ){
								//if (type.equalsIgnoreCase("HTML")) outType="html";
								if (execType.equalsIgnoreCase("STP_ASYNC")) { isAsync = true; }
								else if (execType.equalsIgnoreCase("STP")) { isAsync = false; }
								out.println("\texecAjax(\"\",\"SBIP://METASERVER"+stp+"\"," + isAsync + ",\"render" + objID + "\",'"+outType+"');");	
							}
						}		
					}
				}	
				} catch(Exception e){
					logger.error("layoutObj : JSON Parsing Error!!!");
				}
			} else if (rptType.equalsIgnoreCase("opnSWAX5Grid")) {
				out.println("\t$(\"#sasGrid\").hide();");
				out.println("\t$sasResHTML=\"\";");
				out.println("\t$sasResHTML=execSTPA(\""+sp_pathUrl+"\",'setAX5Grid');");
			} else if (rptType.equalsIgnoreCase("opnSWSlickGrid")) {
				out.println("\t$(\"#sasGrid\").hide();");
				out.println("\t$sasResHTML=\"\";");
				out.println("\t$sasResHTML=execSTPA(\""+sp_pathUrl+"\",'setSlickGrid');");
			} else if (rptType.equalsIgnoreCase("opnSWSlickGridTree")) {
				out.println("\t$(\"#sasGrid\").hide();");
				out.println("\t$sasResHTML=\"\";");
				out.println("\t$sasResHTML=execSTPA(\""+sp_pathUrl+"\",'setSlickGridTree');");
			} else if (rptType.equalsIgnoreCase("opnSWPVT")) {
				out.println("\t$(\"#sasGrid\").hide();");
				out.println("\t$sasResHTML=\"\";");
				out.println("\t$sasResHTML=execSTPA(\""+sp_pathUrl+"\",'setPVT');");
			} else if (rptType.equalsIgnoreCase("opnSWPVTUI")) {
				out.println("\t$(\"#sasGrid\").hide();");
				out.println("\t$sasResHTML=\"\";");
				out.println("\t$sasResHTML=execSTPA(\""+sp_pathUrl+"\",'setPVTUI');");
			} else {	
				out.println("\t$sasResHTML=\"\";");
				out.println("\t$sasResHTML=execSTP(\""+sp_pathUrl+"\",\"\",\"\",\"\",\"\");");
		
				Stub.incFile(hiddenInfo,"_STPREPORT_CUST_OUTPUT", stpCustomFile,out);
			}
		}
	}
	public void prtGenLayoutScript(String layoutStr,String metaID,JspWriter out){
		Logger logger = Logger.getLogger("prtGenExecScript");
		JSONObject rowObj = null;
		if(layoutStr != null){
			try{
			rowObj = new JSONObject(layoutStr);
			for (int ii=0; ii<rowObj.length(); ii++){
				JSONObject row=rowObj.getJSONObject("R"+ii);
				for(int jj=0;jj<row.length();jj++){
					JSONObject colObj=row.getJSONObject("C"+jj);
					String objID=(String)colObj.get("id");
					String stp=(String)colObj.get("stp");
					String type=(String)colObj.get("type");
					String jsCode="";
					if (colObj.has("jsCode")) jsCode=(String)colObj.get("jsCode");
					out.println(jsCode);
					String graph_type=(String)colObj.get("graph_type");
					logger.debug("graph_type - refresh: " +graph_type);
					int refresh=0;
					String refreshStr ="";
					if (colObj.has("refresh")) refreshStr = (String)colObj.get("refresh");
					if ( !refreshStr.equalsIgnoreCase("")){
						refresh=Integer.parseInt((String)colObj.get("refresh"));
					}
					logger.debug("Object Refresh Time : " + refresh);
					String execType="";
					if (colObj.has("exec")) execType=(String)colObj.get("exec");
					boolean isAsync = true;	//"STP_ASYNC"

					if (!type.equalsIgnoreCase("Tag")) {
						if (type.equalsIgnoreCase("Grid")) { type="json"; }
						else if (type.equalsIgnoreCase("GridTree")) { type="json"; }
						else if (type.equalsIgnoreCase("Graph")) { type="json"; }
						if ( !stp.equalsIgnoreCase("") && refresh > 0 ){
							if (execType.equalsIgnoreCase("STP_ASYNC")) { isAsync = true; }
							else if (execType.equalsIgnoreCase("STP")) { isAsync = false; }

							out.println("var refreshCnt" + objID + "=0;");
							out.println("setInterval(function(){");
							out.println("isDisplayProgress=0;");
							out.println("refreshCnt" +objID+ "++;");
							out.println("console.log('refreshCnt" + objID + " : ' +refreshCnt" + objID + ");");
							out.println("console.log('Date Time : ' + displayTime());");  						
							out.println("\t\texecAjax(\"\",\"SBIP://METASERVER"+stp+"\"," + isAsync + ",\"render" + objID + "\",'"+type+"');");	
							out.println("}, " + refresh * 1000 +");");
						} else if (execType.equalsIgnoreCase("UD") && refresh > 0 ) {
							String fURL="";
							String outType="";
							String objType=(String)colObj.get("type");
							if (objType.equalsIgnoreCase("Graph")) fURL="submit"+graph_type;
							else fURL="submit" + objType;
							if (objType.equalsIgnoreCase("HTML")) { outType="html"; }
							else { outType="json";}
							out.println("var refreshCnt" + objID + "=0;");
							out.println("setInterval(function(){");
							out.println("isDisplayProgress=0;");
							out.println("refreshCnt" +objID+ "++;");
							out.println("\texecAjax(\"" + fURL +"\",\""+metaID+"\",true,\"render" + objID + "\",\""+outType+"\",\""+objID+"\");");	
							out.println("}, " + refresh * 1000 +");");
						}
					}
				}		
			}	
			} catch (Exception e){
				logger.error("layoutStr JSON parsing Error!!!");
			}
		}

	}
	public void prtGenStyleFromMeta(HashMap<String, String> hiddenInfo,JspWriter out) throws IOException{
		if(hiddenInfo.containsKey("_STPREPORT_LABEL_WIDTH")){
			String labelWidth=hiddenInfo.get("_STPREPORT_LABEL_WIDTH");
			out.println(".condLabel{width : " + labelWidth + ";}");
		}
		if(hiddenInfo.containsKey("_STPREPORT_LABEL_HEIGHT")){
			String labelHeight=hiddenInfo.get("_STPREPORT_LABEL_HEIGHT");
			out.println(".condLabel{height : " + labelHeight + ";}");
		}
		if(hiddenInfo.containsKey("_STPREPORT_ITEM_WIDTH")){
			String itemWidth=hiddenInfo.get("_STPREPORT_ITEM_WIDTH");
			out.println(".condData{width : " + itemWidth + ";}");
		}
	}
	public void execSTP(UserContextInterface ucif,String str_pathUrl,List<String> exceptParam,HttpServletRequest request,HttpServletResponse response,JspWriter out) throws ServiceException, RemoteException, ServerConnectionException{
		Logger logger = Logger.getLogger("execSTP_PathUrl");
		logger.setLevel(Level.DEBUG);
		logger.debug("execSTP_PathUrl called...");
		
		StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
		StoredProcess2Interface stp2 = facade.getStoredProcess();
		LogicalServerInterface logicalServer = stp2.getServer();
		String stpSrvName = logicalServer.getName();		//Bingo!!!  "SASPmo2 - Logical Stored Process Server"
		String srvHostname = logicalServer.getHost();
		String appSrvName = stpSrvName.split(" ")[0];
		logger.debug("stpSrvName : " + stpSrvName);
		logger.debug("srvHostname : " + srvHostname);
		logger.debug("appSrvName : " + appSrvName);
		
		UserIdentityInterface id  	= ucif.getIdentityByDomain("DefaultAuth"); 
		
		HttpSession session = request.getSession();
		LinkedHashMap<String, String[]> SASLogs = null;
		SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
		if (SASLogs == null) SASLogs = new LinkedHashMap<String, String[]>();
		try {
			//Properties conf = new HBIConfig().getConfig();
			HBIConfig hbiconf = HBIConfig.getInstance();
			Properties conf = hbiconf.getConf();


			String hostName = conf.getProperty(appSrvName.trim()+".hostname");
			logger.debug("hostName : " + hostName);
			logger.debug("port : " + conf.getProperty(appSrvName.trim()+".port"));
			int port = Integer.parseInt(conf.getProperty(appSrvName.trim()+".port"));
			
			logger.debug("int port : " + port);
			
			String classID = Server.CLSID_SASSTP;
			Server server = new BridgeServer(classID,hostName,port);

			String principal=(String) id.getPrincipal();
			String credential=(String) id.getCredential();

			ConnectionFactoryConfiguration cxfConfig = new ManualConnectionFactoryConfiguration(server);
			ConnectionFactoryManager cxfManager = new ConnectionFactoryManager();
			ConnectionFactoryInterface cxf;
			cxf = cxfManager.getFactory(cxfConfig);
			ConnectionFactoryAdminInterface admin = cxf.getAdminInterface();
			ConnectionInterface cx = cxf.getConnection(principal,credential);
			
			//StoredProcessServiceFactory spsf = new StoredProcessServiceFactory();
			//StoredProcessServiceInterface storedProcessService = (StoredProcessServiceInterface)spsf.getStoredProcessService();
			StoredProcessOptions options = new StoredProcessOptions();
			options.setSessionContextInterface((SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT));
			//StoredProcess2Interface storedProcess = (StoredProcess2Interface) storedProcessService.newStoredProcess(StoredProcess2Interface.SERVER_TYPE_STOREDPROCESS, options);
			final ServerInterface authServer = ucif.getAuthServer();
			PathUrl path = new PathUrl(str_pathUrl);
			final MetadataInterface metadataObject = authServer.getObjectByPath(path);
			//String metaID=metadataObject.getReposId();	
			StoredProcess2Interface storedProcess = null;
			if (metadataObject instanceof StoredProcessInterface)
			{
				final StoredProcessInterface stp = (StoredProcessInterface) metadataObject;
				//ServerContextInterface sci2 = stp.getServerContext();
				//String mName = sci2.getMachine();
				
				storedProcess = (StoredProcess2Interface) stp.newServiceObject(options);
				//storedProcess = stp2;
			}
			if (storedProcess == null) {
				logger.error("can not find Stroed Process : " + str_pathUrl);
			}
			Enumeration paramNames = request.getSession().getAttributeNames();
			paramNames = request.getParameterNames();
			while(paramNames.hasMoreElements()){
				String name = paramNames.nextElement().toString();
				String value = new String(request.getParameter(name).getBytes("UTF-8"),"UTF-8");
				if(value.equalsIgnoreCase("")||value==null){
					value = "";
				}
				if (name.toUpperCase().indexOf("_DRILL_") > -1){
					name=name.substring(7);
				}
				if (exceptParam.contains(name.toUpperCase())) {
					logger.debug(name.toUpperCase() + " Exclued!");
				} else {
					logger.debug("Passed Parameter : " + name + " : " + value);
					storedProcess.setParameterValue(name,value);
				}
			}		
			storedProcess.setParameterValue("_RESULT", "STREAMFRAGMENT");
			storedProcess.setParameterValue("_URL", "/SASStoredProcess/do");

			Execution2Interface stpEI = storedProcess.execute(true, null, false, cx);
			
			//if (!str_pathUrl.substring(str_pathUrl.lastIndexOf("/")+1).equalsIgnoreCase("createSession(StoredProcess)"))
			stpEI = getSASLog(stpEI,SASLogs, session,response);
			
			stpEI.destroy();
			//storedProcess.destroy();   // 20160310 
			cx.close();
			admin.shutdown();	
		
		} catch (ConnectionFactoryException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: ConnectionFactoryException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (SecurityException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: SecurityException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (IOException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: IOException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: IllegalArgumentException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (IllegalStateException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: IllegalStateException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (ExecutionException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: ExecutionException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			
			e.printStackTrace();
		} catch (InitializationException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: InitializationException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (ServiceException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: ServiceException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (InvalidPromptValueException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: InvalidPromptValueException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		}
	}
	public void execSTPold(UserContextInterface ucif,List<String> exceptParam, String tempSTPFile, HttpServletRequest request,HttpServletResponse response,JspWriter out) throws ServiceException, RemoteException{
		//Logger logger = Logger.getLogger("execSTP_GenSRC");
		
		RepositoryInterface rif 	= ucif.getRepository("Foundation");
		UserIdentityInterface id  	= ucif.getIdentityByDomain("DefaultAuth");
				
		HttpSession session = request.getSession();
		LinkedHashMap<String, String[]> SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
		//
		try {
			//Properties conf = new HBIConfig().getConfig();
			HBIConfig hbiconf = HBIConfig.getInstance();
			Properties conf = hbiconf.getConf();

			String hostName = conf.getProperty("app.host");
			String logicalServerName = conf.getProperty("app.logicalServerName"); 
			int port = Integer.parseInt(conf.getProperty("app.port"));
			String workFolder = conf.getProperty("stp.tempdir").trim();	
			logger.debug("workFolder : " + workFolder);
			logger.debug("tempSTPFile : " + tempSTPFile);
			logger.info("tempSTPFile : " + workFolder+tempSTPFile);
			
			String classID = Server.CLSID_SASSTP;
			Server server = new BridgeServer(classID,hostName,port);

			String principal=(String) id.getPrincipal();
			String credential=(String) id.getCredential();

			ConnectionFactoryConfiguration cxfConfig = new ManualConnectionFactoryConfiguration(server);
			ConnectionFactoryManager cxfManager = new ConnectionFactoryManager();
			ConnectionFactoryInterface cxf;
			cxf = cxfManager.getFactory(cxfConfig);
			ConnectionFactoryAdminInterface admin = cxf.getAdminInterface();
			ConnectionInterface cx = cxf.getConnection(principal,credential);
			
			StoredProcessServiceFactory spsf = new StoredProcessServiceFactory();
			StoredProcessServiceInterface storedProcessService = spsf.getStoredProcessService();
			StoredProcessOptions options = new StoredProcessOptions();
			options.setSessionContextInterface((SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT));
			
			StoredProcess2Interface storedProcess = (StoredProcess2Interface) storedProcessService.newStoredProcess(StoredProcessBaseInterface.SERVER_TYPE_STOREDPROCESS, options);
			storedProcess.setSourceFromFile(workFolder, tempSTPFile);

			Enumeration paramNames = request.getSession().getAttributeNames();
			paramNames = request.getParameterNames();
			while(paramNames.hasMoreElements()){
				String name = paramNames.nextElement().toString();
				String value = new String(request.getParameter(name).getBytes("UTF-8"),"UTF-8");
				if(value.equalsIgnoreCase("")||value==null){
					value = "";
				}
				if (name.toUpperCase().indexOf("_DRILL_") > -1){
					name=name.substring(7);
				}
				if (exceptParam.contains(name.toUpperCase())) {
					logger.debug(name.toUpperCase() + " Exclued!");
				} else {
					storedProcess.setParameterValue(name,value);
					logger.debug("Passed Parameter : " + name + " : " + value);
				}
			}		
			storedProcess.setParameterValue("_RESULT", "STREAMFRAGMENT");
			storedProcess.setParameterValue("_URL", "/SASStoredProcess/do");

			Execution2Interface stpEI = storedProcess.execute(true, null, false, cx);
			
			stpEI = getSASLog(stpEI,SASLogs, session,response);

			stpEI.destroy();
			storedProcess.destroy();
			cx.close();
			admin.shutdown();	
		
		} catch (ConnectionFactoryException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: ConnectionFactoryException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (SecurityException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: SecurityException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (IOException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: IOException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: IllegalArgumentException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (IllegalStateException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: IllegalStateException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (ExecutionException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: ExecutionException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			
			e.printStackTrace();
		} catch (InitializationException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: InitializationException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (ServiceException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: ServiceException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		} catch (InvalidPromptValueException e) {
			String errMsg = e.getLocalizedMessage();
			logger.info("Error Msg : " + errMsg);
			String [] logs = {"<span style='color:red;'>ERROR: InvalidPromptValueException occured.</span><pre>"+errMsg+"</pre>"};
			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			logger.debug("logID : " + logID);
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			
			e.printStackTrace();
		}
	}
	public Execution2Interface getSASLog(Execution2Interface stpEI,LinkedHashMap<String, String[]> SASLogs,HttpSession session,HttpServletResponse response) 
			throws TransportException, IllegalStateException, IOException{
		//Logger logger = Logger.getLogger("getSASLog");
		//logger.setLevel(Level.DEBUG);
		
		String log = stpEI.readSASLog(ExecutionBaseInterface.LOG_FORMAT_HTML,ExecutionBaseInterface.LOG_ALL_LINES);
		logger.debug("SASLog : " + log);
		String [] logs = {log};

		Long curDT = new Date().getTime();
		int ran = (int)(Math.random() * 1000);
		
		String logID = curDT.toString() + ran;
		logger.debug("logID : " + logID);
		SASLogs.put(logID,logs);
		session.setAttribute("SASLogs",SASLogs);			
			
		final BufferedInputStream inData = new BufferedInputStream(stpEI.getInputStream(MetadataConstants.WEBOUT));
		final BufferedOutputStream outData = new BufferedOutputStream(response.getOutputStream());
		final byte[] buffer = new byte[4096];
		for (int n = 0; (n = inData.read(buffer, 0, buffer.length)) > 0; ) {
			outData.write(buffer, 0, n);
		}
		outData.flush();
		outData.close();
		return stpEI;

	}
}
