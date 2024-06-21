<%@ page language="java" contentType= "text/json; charset=utf-8" %>
<%@ page import="
	com.sas.hbi.property.HBIConfig,			
	com.sas.datatypes.DataTypeInterface,
	com.sas.framework.config.ConfigurationServiceInterface,
	com.sas.hbi.listeners.STPSessionBindingListener,
	com.sas.hbi.listeners.STPSessionBindingListener.DestroyableObjectInterface,
	com.sas.hbi.storedprocess.StoredProcessConnection,
	com.sas.hbi.storedprocess.StoredProcessFacade,
	com.sas.hbi.tools.POI,
	com.sas.hbi.tools.STPNote,
	com.sas.hbi.tools.Stub,
	com.sas.iom.SAS.*,
	com.sas.iom.SAS.IDataService,
	com.sas.iom.SAS.ILanguageService,
	com.sas.iom.SAS.ILanguageServicePackage.*,
	com.sas.iom.SAS.IWorkspace,
	com.sas.iom.SAS.IWorkspaceHelper,
	com.sas.iom.SASIOMDefs.*,
	com.sas.metadata.remote.MdException,
	com.sas.prompts.PromptValuesInterface,
	com.sas.prompts.definitions.DateDefinition,
	com.sas.prompts.definitions.DateRangeDefinition,
	com.sas.prompts.definitions.DoubleDefinition,
	com.sas.prompts.definitions.IntegerDefinition,
	com.sas.prompts.definitions.PromptDefinitionInterface,
	com.sas.prompts.definitions.TextDefinition,
	com.sas.prompts.definitions.shared.SharedDateDefinition,
	com.sas.prompts.definitions.shared.SharedDateRangeDefinition,
	com.sas.prompts.definitions.shared.SharedTextDefinition,
	com.sas.prompts.groups.ModalGroup,
	com.sas.prompts.groups.PromptGroup,
	com.sas.prompts.groups.PromptGroupInterface,
	com.sas.prompts.groups.TransparentGroup,
	com.sas.prompts.groups.shared.SharedTransparentGroup,
	com.sas.prompts.simplesqlmodel.PromptValueOperand,
	com.sas.prompts.valueprovider.dynamic.DataProvider,
	com.sas.prompts.valueprovider.dynamic.DataProviderUtil,
	com.sas.prompts.valueprovider.dynamic.workspace.PromptColumnValueProvider,
	com.sas.rio.MVAConnection,
	com.sas.services.ServiceAttributeInterface,
	com.sas.services.ServiceException,
	com.sas.services.connection.*,
	com.sas.services.deployment.MetadataSourceFactory,
	com.sas.services.deployment.MetadataSourceInterface,
	com.sas.services.deployment.ServiceLoader,
	com.sas.services.discovery.DiscoveryService,
	com.sas.services.discovery.DiscoveryServiceInterface,
	com.sas.services.discovery.ServiceTemplate,
	com.sas.services.information.InformationServiceInterface,
	com.sas.services.information.ServerInterface,
	com.sas.services.information.metadata.MetadataInterface,
	com.sas.services.information.metadata.PathUrl,
	com.sas.services.information.metadata.PhysicalTableInterface,
	com.sas.services.information.metadata.SASLibraryInterface,
	com.sas.services.session.SessionContextInterface,
	com.sas.services.session.SessionServiceInterface,
	com.sas.services.storedprocess.*,
	com.sas.services.storedprocess.metadata.StoredProcessInterface,
	com.sas.services.storedprocess.metadata.StoredProcessOptions,
	com.sas.services.user.UserContextInterface,
	com.sas.services.user.UserServiceInterface,
	com.sas.services.webapp.ServicesFacade,
	com.sas.servlet.util.SocketListener,
	com.sas.storage.*,
	com.sas.storage.exception.ServerConnectionException,
	com.sas.storage.jdbc.JDBCToTableModelAdapter,
	com.sas.storage.simplesqlmodel.ColumnInfo,
	com.sas.storage.simplesqlmodel.ColumnOperand,
	com.sas.storage.simplesqlmodel.Expression,
	com.sas.storage.simplesqlmodel.OperandInterface,
	com.sas.storage.simplesqlmodel.OperatorInterface,
	com.sas.storage.simplesqlmodel.WhereClause,
	com.sas.storage.valueprovider.StaticValueProvider,
	com.sas.storage.valueprovider.ValueProviderException,
	com.sas.storage.valueprovider.ValueProviderInterface,
	com.sas.svcs.authentication.client.AuthenticationException,
	com.sas.svcs.authentication.client.AuthenticationServiceInterface,
	com.sas.svcs.authentication.client.SecurityContext,
	com.sas.util.Strings,
	com.sas.web.keys.CommonKeys,
	java.awt.Color,
	java.awt.Font,
	java.io.BufferedReader,
	java.io.FileInputStream,
	java.io.FileReader,
	java.io.IOException,
	java.io.InputStream,
	java.io.InputStreamReader,
	java.io.UnsupportedEncodingException,
	java.net.*,
	java.net.URLEncoder,
	java.rmi.RemoteException,
	java.sql.*,
	java.sql.Connection,
	java.sql.DriverManager,
	java.sql.ResultSet,
	java.sql.SQLException,
	java.sql.Statement,
	java.text.DateFormat,
	java.text.ParseException,
	java.text.SimpleDateFormat,
	java.util.*,
	java.util.ArrayList,
	java.util.Calendar,
	java.util.Date,
	java.util.Properties,
	org.apache.log4j.*,
	org.json.JSONArray,
	org.json.JSONException,
	org.json.JSONObject
" %>
<%
		//request.setCharacterEncoding("utf-8");
		response.setContentType("text/json;");
		response.setCharacterEncoding("utf-8");
	/*
		response.setContentType("text/json; charset=EUC-KR");
		response.setCharacterEncoding("EUC-KR");
	*/
		
		response.setHeader("Pragma", "No-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Expires", "0");
		
		Logger logger = Logger.getLogger("submitUD");
	
		int uid = (int)(Math.random() * 100000);
		logger.info("uid : " + uid);
		
		LinkedHashMap<String, String[]> SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
		logger.info("SASLogs keySet():" + SASLogs.keySet());				

		String pgmStmt =null;
		pgmStmt=";*\';*\";*/;quit;run;\n";
		pgmStmt+="options obs=max spool noerrorabend nosyntaxcheck ls=256 ;\n";
			
		StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
		StoredProcess2Interface stp2 = (StoredProcess2Interface)facade.getStoredProcess();
		String metaID=facade.getMetaID();
		logger.info("metaID : " + metaID);
		logger.info("request.getParameter(_program) : " + request.getParameter("_program"));
			
		DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");
		UserContextInterface userContext = (UserContextInterface)request.getSession().getAttribute(CommonKeys.USER_CONTEXT);
		List groupList = userContext.getGroups();
		logger.debug("Groups: " + groupList.toString());
		logger.debug("isReportAdmin: " + userContext.isInGroup("Report Admin"));

		HBIConfig hbiconf = HBIConfig.getInstance();
		Properties conf = hbiconf.getConf();
		
		String logicalServerName = conf.getProperty("app.logicalServerName"); 
		logger.info("dataProvider : " + dataProvider);
		logger.debug("logicalServerName : " + logicalServerName);
			
		IWorkspace iWorkspace = null;
		try {
			iWorkspace = dataProvider.getIWorkspace(logicalServerName);
		} catch (ServerConnectionException e) {
			//e.printStackTrace();
		}
		ILanguageService  sas=iWorkspace.LanguageService();

		String client = (java.net.InetAddress.getLocalHost()).getHostAddress();
		logger.info("client : " + client);
		SocketListener socket = new SocketListener();
		int wPort = socket.setup();
		socket.start();
		
		Enumeration paramNames = request.getSession().getAttributeNames();
		paramNames = request.getParameterNames();
		while(paramNames.hasMoreElements()){
		    String name = paramNames.nextElement().toString();
		    String value = new String(request.getParameter(name).getBytes("EUC-KR"),"EUC-KR");
		    if("".equals(value)||value==null){
		        value = "";
		    }
		    logger.info(name + " : " + value);
		    pgmStmt+="%let " + name + "=" + value +";\n";
		}			

		pgmStmt+="%let uid=" + uid +";\n";
		pgmStmt+="filename we" + uid + " socket '" + client + ":" + wPort + "' ;\n";
		pgmStmt+="%inc 'C:\\SASHBI\\Macro\\hbi_init.sas';\n";
		pgmStmt+="data _null_;\n path=pathname('work'); call symput('path',path);\n";
		pgmStmt+="run;\n";
		pgmStmt+="%let _sessionid=fromPS;\n";
		pgmStmt+="libname save \"&path\";\n";
		pgmStmt+="%let columnInfo=work.ColumnInfo" + uid + ";\n";
		pgmStmt+="%let dataInfo=work.dataInfo" + uid + ";\n";
		pgmStmt+="%let saslog=work.sasLog" + uid + ";\n";
		pgmStmt+="%put _global_;\n";

		SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
		STPNote stpNote = new com.sas.hbi.tools.STPNote();
		stpNote.setStpObjId(request.getParameter("_program"));
		String DRInfo="";
		try {
			DRInfo=stpNote.getSTPNote(sci,"DataRole");
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (ServiceException e) {
			e.printStackTrace();
		} catch (MdException e) {
			e.printStackTrace();
		}
		logger.info("DRInfo:"+DRInfo);
		/*
		*/

		String targetID = (String)request.getParameter("param1");
		JSONObject rowObj = null;
		JSONArray colinfoObj = null;
		JSONArray curObj = null;
		String objID="";
		String library=null;
		String dataName=null;
		String precodeYN	= "N";	
		String precode		= "";	
		try {
			if (!DRInfo.equalsIgnoreCase("")){
				rowObj = new JSONObject(DRInfo);
				logger.info("JSONObject Row Num : " + rowObj.length());	
				for (int rii=0; rii<rowObj.length(); rii++){
					JSONObject row=(JSONObject)rowObj.getJSONObject("R"+rii);
					for(int cjj=0;cjj<row.length();cjj++){
						JSONObject colObj=(JSONObject)row.getJSONObject("C"+cjj);
						JSONObject drObj=(JSONObject)colObj.getJSONObject("drInfo");
						if ( drObj.has("id")) objID=(String)drObj.get("id");
						if (objID.equalsIgnoreCase(targetID)){
							if ( drObj.has("library")) library=(String)drObj.get("library");
							if (drObj.has("data")) dataName=(String)drObj.get("data");
							logger.info("objID:"+objID);
							logger.info("dataName:"+ library + "." + dataName);
							if (drObj.has("columns") ) colinfoObj=(JSONArray)drObj.getJSONArray("columns");
							if (drObj.has("precode") ) precodeYN=(String)drObj.get("precode");
							if (drObj.has("pcode") ) precode=(String)drObj.get("pcode");
							curObj=colinfoObj;
							logger.info("curObj.toString() : " + curObj.toString());
						}
					}	
				}
				/*
				Iterator keys = rowObj.keys();
				while(keys.hasNext()) {
					String rowName = (String)keys.next();
					logger.debug("rowName:"+rowName);
					JSONObject objName = rowObj.getJSONObject(rowName);
				}	
				*/
			if (curObj == null) {
				logger.error("Object ID did not match in Layout Object ID : " + targetID);
				return;
			}

			String isShow 		= null;	
			String colName 	= null;	
			String desc 		= null;	
			String colFormat	= null;	
			String colAlign 	= null;	
			String colType		= null;
			int 	  colWidth 	;	  
			boolean isSort 	;	
			boolean isResize   	;
			pgmStmt+="data work.ColumnInfo" + uid + ";\n";
			pgmStmt+="\tlength id $40 label $100 width align format isSort isResize $20;\n";
			logger.info("LineInfo: 261" + curObj);
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				isShow 		= (String)rowInfo.get("v");
				colName 	= (String)rowInfo.get("name");
				desc 		= (String)rowInfo.get("desc");
				colFormat	= (String)rowInfo.get("fmt");
				colWidth	= (int)rowInfo.getInt("w");
				colAlign 	= (String)rowInfo.get("a");
				if (colAlign.equalsIgnoreCase("Right")) colAlign ="r";
				if (colAlign.equalsIgnoreCase("Left")) colAlign ="l";
				if (colAlign.equalsIgnoreCase("Center")) colAlign ="c";
				isSort 	= (boolean)rowInfo.getBoolean("s");
				isResize = (boolean)rowInfo.getBoolean("r");
				if (isShow.equalsIgnoreCase("S")) {
					pgmStmt+="\tid=\'"+colName+"\';";
					pgmStmt+="label=\'"+desc+"\';";
					pgmStmt+="width=\'"+colWidth+"\';";
					pgmStmt+="align=\'"+colAlign+"\';";
					pgmStmt+="format=\'"+colFormat+"\';";
					pgmStmt+="isSort=\'"+isSort+"\';";
					pgmStmt+="isResize=\'"+isResize+"\';";
					pgmStmt+="output;\n";
				}
			}
			pgmStmt+="run;\n";
			try {
				sas.Submit(pgmStmt);
				sas.Reset();
				//logger.info("sas.Reset()");
				pgmStmt="";
			} catch (GenericError e) {
				e.printStackTrace();
			}
						
			if (precodeYN.equalsIgnoreCase("Y")){			// User Defined Code
				pgmStmt+=precode;
			}
			
			pgmStmt+="data work.dataInfo" + uid + ";\n";
			pgmStmt+="\tlength json $32767;\n";

			if (precodeYN.equalsIgnoreCase("Y")){
				pgmStmt+="\tset _last_(obs=max) end=eof;\n";
			} else {
				pgmStmt+="\tset " + library + "." + dataName + "(obs=max) end=eof;\n";
			}

			
			//for Where with Prompt value 
			PromptValuesInterface pvi  = stp2.getPromptValues();
			PromptGroupInterface pgi = pvi.getPromptGroup();
			List<PromptDefinitionInterface> promptDefinitions = pgi.getPromptDefinitions(true);
	
			int hasWhere=0;
			for (int i = 0; i < promptDefinitions.size(); i++) {
				PromptDefinitionInterface pdi = promptDefinitions.get(i);
				String pName = pdi.getPromptName();
				if (pName.toUpperCase().indexOf("_STPREPORT")<0){
					logger.info("Prompt Name : " + pName.toUpperCase());
					if (!request.getParameter(pName).equalsIgnoreCase("")) hasWhere++;
				}
			}
			logger.info("hasWhere : " + hasWhere);
			
			if (hasWhere > 0) {
				pgmStmt+="\twhere 1=1\n";
				for (int i = 0; i < promptDefinitions.size(); i++) {
					PromptDefinitionInterface pdi = promptDefinitions.get(i);
					String pName = pdi.getPromptName();
					if (pName.toUpperCase().indexOf("_STPREPORT")<0) {
						String pVal = request.getParameter(pName);
						if (!pVal.equalsIgnoreCase("")) {
							

							if (pdi instanceof TextDefinition){
								TextDefinition td = (TextDefinition)pdi;
								int selectionType=td.getSelectionType();
								if (selectionType > 300) { //multiple
								} else {
									pgmStmt+="\tand "+pName+"=\"" + pVal + "\"\n";
								}
							} else if (pdi instanceof IntegerDefinition) {
								IntegerDefinition id = (IntegerDefinition)pdi;
							} else if (pdi instanceof DoubleDefinition) {
								DoubleDefinition dd = (DoubleDefinition)pdi;
							} else if (pdi instanceof SharedTextDefinition){
								SharedTextDefinition sd = (SharedTextDefinition)pdi;
							} else if (pdi instanceof DateDefinition){
								//	_DD
							} else if (pdi instanceof DateRangeDefinition){
								// _start _end
							} else if (pdi instanceof SharedDateDefinition){
								//	_DD
							} else if (pdi instanceof SharedDateRangeDefinition){
								// _start _end
							}							
							
							
							
						}
					}
				}				
			}
			pgmStmt+="\t;\n";
					
			/* Not Need ============================================================
			// for Label & Format
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				colName 	= (String)rowInfo.get("name");
				desc 	= (String)rowInfo.get("desc");
				colFormat = (String)rowInfo.get("fmt");
				colType 	= (String)rowInfo.get("type");
				if (colFormat.equalsIgnoreCase("")) {
					if (colType.equalsIgnoreCase("C")) colFormat="$char.";
					if (colType.equalsIgnoreCase("N")) colFormat="8.";
				}
				pgmStmt+="\tLabel " + colName + " = \'" + desc + "\';\n";
				pgmStmt+="\tFormat " + colName + " " + colFormat + " ;\n";
			}	
			*************************************************************************/				
						
			
			pgmStmt+="\tkeep json;\n";
			pgmStmt+="\tif _n_ = 1 then do;\n";
			pgmStmt+="\t\tjson=\'\"SASResult\":[\';\n";
			pgmStmt+="\t\toutput;\n";
			pgmStmt+="\tend;\n";
			pgmStmt+="\tif eof then do;\n";

			pgmStmt+="\t\tjson=\'{";
			int isFirst=0;
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				isShow 		= (String)rowInfo.get("v");
				colName 	= (String)rowInfo.get("name");
				colFormat	= (String)rowInfo.get("fmt");
				colType 	= (String)rowInfo.get("type");
				if (colFormat.equalsIgnoreCase("")) {
					if (colType.equalsIgnoreCase("C")) colFormat="$char.";
					if (colType.equalsIgnoreCase("N")) colFormat="8.";
				}
				if (!isShow.equalsIgnoreCase("X")) {
					if (isFirst == 0) {
						pgmStmt+="\"" + colName + "\":\"\'||trim(put(" + colName + ","+colFormat+"))||\'\"\'";
					} else {
						pgmStmt+="||\',\"" + colName + "\":\"\'||trim(put(" + colName + ","+colFormat+"))||\'\"\'";
					}
					isFirst++;
				}
			}
			pgmStmt+="||\"}]}]\";";
			pgmStmt+="\n\t\toutput;\n";
			pgmStmt+="\tend;\n";
			pgmStmt+="\telse do;\n";
			pgmStmt+="\t\tjson=\'{";
			isFirst=0;
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				isShow 		= (String)rowInfo.get("v");
				colName 	= (String)rowInfo.get("name");
				colFormat	= (String)rowInfo.get("fmt");
				colType 	= (String)rowInfo.get("type");
				if (colFormat.equalsIgnoreCase("")) {
					if (colType.equalsIgnoreCase("C")) colFormat="$char.";
					if (colType.equalsIgnoreCase("N")) colFormat="8.";
				}
				if (!isShow.equalsIgnoreCase("X")) {
					if (isFirst == 0) {
						pgmStmt+="\"" + colName + "\":\"\'||trim(put(" + colName + ","+colFormat+"))||\'\"\'";
					} else {
						pgmStmt+="||\',\"" + colName + "\":\"\'||trim(put(" + colName + ","+colFormat+"))||\'\"\'";
					}
					isFirst++;
				}
			}
			pgmStmt+="||\"},\";";
			pgmStmt+="\n\t\toutput;\n";
			pgmStmt+="\tend;\n";
			pgmStmt+="run;\n";



			pgmStmt+="%macro chk_obs;\n";
			pgmStmt+="	%let dsid=%sysfunc(open(_last_));\n";
			pgmStmt+="	%put &dsid;\n";
			pgmStmt+="	%let obscnt=%sysfunc(attrn(&dsid,nobs));\n";
			pgmStmt+="	%put &obscnt;\n";
			pgmStmt+="	%let rc=%sysfunc(close(&dsid));\n";
			pgmStmt+="	%if &obscnt = 0 %then %do;\n";
			pgmStmt+="	data work.dataInfo" + uid + ";\n";
			pgmStmt+="		length json $32767;\n";
			pgmStmt+="		json=\'\"SASResult\":[]}]\';output;\n";
			pgmStmt+="	run;\n";
			pgmStmt+="	%end;\n";
			pgmStmt+="%mend;\n";
			pgmStmt+="%chk_obs;\n";


			/*
			try {
				sas.Submit(pgmStmt);
				CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
				LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
				StringSeqHolder logHldr = new StringSeqHolder();
				sas.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr,logLineTypeHldr, logHldr);
				String[] logLines = logHldr.value;
				String logStr="";
				for (int logii=0;logii<logLines.length;logii++){
					logStr=logLines[logii].trim().replaceAll("\"","&quote;").replaceAll("\'","&apos;").replaceAll(":","&colon;").replaceAll("\\\\","&bsol;")+"\\n";
					logger.debug("SAS Log : " + logStr);
				}	
			} catch (GenericError e) {
				e.printStackTrace();
			}
			*/

			pgmStmt+="%json4SlickPS(\n";
			pgmStmt+="\ttableName=" + "WORK" + "." + dataName + uid + ",\n";
			pgmStmt+="\tcolumns	=%str(";

			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				isShow 	= (String)rowInfo.get("v");
				colName 	= (String)rowInfo.get("name");
				if (isShow.equalsIgnoreCase("S")) pgmStmt+=colName + "\t";
			}
			pgmStmt+="\t),\n";
			
			pgmStmt+="\tdataCols=%str(";
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				isShow 	= (String)rowInfo.get("v");
				colName 	= (String)rowInfo.get("name");
				if (!isShow.equalsIgnoreCase("X")) pgmStmt+=colName + "\t";
			}
			pgmStmt+="\t),\n";
			pgmStmt+="\tcss=%str(";
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				isShow 	= (String)rowInfo.get("v");
				colAlign = (String)rowInfo.get("a");
				if (colAlign.equalsIgnoreCase("Right")) colAlign ="r";
				if (colAlign.equalsIgnoreCase("Left")) colAlign ="l";
				if (colAlign.equalsIgnoreCase("Center")) colAlign ="c";
				if (isShow.equalsIgnoreCase("S")) pgmStmt+=colAlign + "\t";
			}
			pgmStmt+="\t),\n";
			pgmStmt+="\twidth=%str(";
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				isShow 	= (String)rowInfo.get("v");
				colWidth 	= (int)rowInfo.getInt("w");
				if (isShow.equalsIgnoreCase("S")) pgmStmt+=colWidth + "\t";
			}
			pgmStmt+="\t),\n";
			String isSortT="1";
			pgmStmt+="\tsort=%str(";
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				isShow 	= (String)rowInfo.get("v");
				isSort 	= (boolean)rowInfo.getBoolean("s");
				if (isSort) { isSortT="1"; }
				else { isSortT="0"; }
				if (isShow.equalsIgnoreCase("S")) pgmStmt+=isSortT + "\t";
			}
			pgmStmt+="\t),\n";
			String isResizeT="1";
			pgmStmt+="\tresize=%str(";
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				isShow 	= (String)rowInfo.get("v");
				isResize = (boolean)rowInfo.getBoolean("r");
				if (isResize) { isResizeT="1"; }
				else { isResizeT="0"; }
				if (isShow.equalsIgnoreCase("S")) pgmStmt+=isResizeT + "\t";
			}
			pgmStmt+="\t),\n";
			/*
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				String colName 	= (String)rowInfo.get("name");
				String id 		= (String)rowInfo.get("name");
				String desc 	= (String)rowInfo.get("desc");
				String colFormat = (String)rowInfo.get("fmt");
				//pgmStmt+=colName + "\t";
			}
			*/
			}	  
		} catch (JSONException e) {
			e.printStackTrace();
		}

		pgmStmt+="\tenableCellNavigation=true,\n";
		pgmStmt+="\tenableColumnReorder=false,\n";
		pgmStmt+="\tmultiColumnSort=true,\n";
		pgmStmt+="\teditable=false,\n";
		pgmStmt+="\tenableAddRow=false,\n";
		pgmStmt+="\tautoEdit=false\n";
		pgmStmt+=");";
		
		logger.info("pgmStmt : " + pgmStmt);
		
		try {
			sas.Submit(pgmStmt);
			CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
			LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
			StringSeqHolder logHldr = new StringSeqHolder();
			sas.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr,logLineTypeHldr, logHldr);
			String[] logLines = logHldr.value;
			String logStr="";
			for (int logii=0;logii<logLines.length;logii++){
				logStr=logLines[logii];
				logger.debug("SAS Log : " + logStr);
			}	
			SASLogs.put(targetID,logLines);
		} catch (GenericError e) {
			e.printStackTrace();
		}
		session.setAttribute("SASLogs",SASLogs);

		socket.write(out);
		socket.close();
%>

