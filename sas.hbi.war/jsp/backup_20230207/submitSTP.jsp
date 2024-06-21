<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType= "text/json; charset=utf-8" %>
<%@ page import="
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
	com.sas.prompts.InvalidPromptValueException,
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
	com.sas.services.InitializationException,
	com.sas.services.ServiceAttributeInterface,
	com.sas.services.ServiceException,
	com.sas.services.connection.*,
	com.sas.services.connection.BridgeServer,
	com.sas.services.connection.ConnectionFactoryAdminInterface,
	com.sas.services.connection.ConnectionFactoryConfiguration,
	com.sas.services.connection.ConnectionFactoryException,
	com.sas.services.connection.ConnectionFactoryInterface,
	com.sas.services.connection.ConnectionFactoryManager,
	com.sas.services.connection.ConnectionInterface,
	com.sas.services.connection.ManualConnectionFactoryConfiguration,
	com.sas.services.connection.Server,
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
	com.sas.services.information.RepositoryInterface,
	com.sas.services.session.SessionContextInterface,
	com.sas.services.session.SessionServiceInterface,
	com.sas.services.storedprocess.*,
	com.sas.services.storedprocess.Execution2Interface,
	com.sas.services.storedprocess.ExecutionException,
	com.sas.services.storedprocess.StoredProcess2Interface,
	com.sas.services.storedprocess.StoredProcessServiceFactory,
	com.sas.services.storedprocess.StoredProcessServiceInterface,
	com.sas.services.storedprocess.metadata.StoredProcessInterface,
	com.sas.services.storedprocess.metadata.StoredProcessOptions,
	com.sas.services.user.UserContextInterface,
	com.sas.services.user.UserIdentityInterface,
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
	java.io.BufferedOutputStream,
	java.io.BufferedInputStream,
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
	response.setContentType("text/json;");
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");
	
	Logger logger = Logger.getLogger("submitSTP");

	String targetID = (String)request.getParameter("param1");
	
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	RepositoryInterface rif = ucif.getRepository("Foundation");
	UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth");

	Properties conf = new HBIConfig().getConfig();
	String hostName = conf.getProperty("app.host");
	String logicalServerName = conf.getProperty("app.logicalServerName"); 
	int port = Integer.parseInt(conf.getProperty("app.port"));
	//String hostName = rif.getHost();
	//int port = 8601; //STP Brige Port not rif.getPort();
	
	String principal=(String) id.getPrincipal();
	String credential=(String) id.getCredential();
	logger.debug("hostName : "+hostName);
	logger.debug("port : "+ port);
	logger.debug("principal : "+principal);
	logger.debug("credential : "+credential);
	
	
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
	if (DRInfo.equalsIgnoreCase("")){
		logger.error("DRInfo did not passed...");
		return;
	}
	
	
	LinkedHashMap<String, String[]> SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
	logger.info("SASLogs keySet():" + SASLogs.keySet());				
	
	String pgmStmt =null;
	String workFolder = null;
	String tempSTPFile = "_" + (int)(Math.random() * 100000000) + ".sas";
	String uid = "_" + (int)(Math.random() * 100000);
		
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
	
	IWorkspace iWorkspace = null;
	try {
		iWorkspace = dataProvider.getIWorkspace(logicalServerName);
	} catch (ServerConnectionException e) {
		e.printStackTrace();
	}
	ILanguageService  sas=iWorkspace.LanguageService();

	pgmStmt="\n";
	pgmStmt+="data work.path" + uid + ";\n";
	pgmStmt+="	length path $200;\n";
	pgmStmt+="	path=pathname(\'work\');\n";
	pgmStmt+="run;\n";

	sas.Submit(pgmStmt);
	
	IDataService dService = iWorkspace.DataService();
	Properties  Properties1 = new java.util.Properties();
	Connection sqlConnection = new MVAConnection(dService,Properties1);
	
	String jdbcQuery = "select * from work.path" + uid;
	
	Statement stmt = sqlConnection.createStatement();
	ResultSet rs = stmt.executeQuery(jdbcQuery);
	
	while (rs.next()) {
		workFolder = rs.getObject(1).toString();
	}
	//if (workFolder != null) workFolder = workFolder.replace("\\","\\\\");
	logger.info("workFolder :" + workFolder);
	stmt.close();
	sqlConnection.close();






	pgmStmt=";*\';*\";*/;quit;run;\n";
	pgmStmt+="options obs=max spool noerrorabend nosyntaxcheck ls=256 NOQUOTELENMAX;\n";

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
	pgmStmt+="%inc 'C:\\SASHBI\\Macro\\hbi_init.sas';\n";
	pgmStmt+="data _null_;\n path=pathname('work'); call symput('path',path);\n";
	pgmStmt+="run;\n";
	pgmStmt+="%let _sessionid=fromPS;\n";
	pgmStmt+="libname save \"&path\";\n";
	pgmStmt+="%let target=work.target" + uid + ";\n";
	pgmStmt+="%put _global_;\n";




	JSONObject rowObj = null;
	JSONArray colinfoObj = null;
	JSONArray curObj = null;
	String objID="";
	String library=null;
	String dataName=null;
	String precodeYN	= "N";	
	String precode		= "";	
	String grp_x		= "";	
	String grp_y		= "";	
	String grp_g		= "";	
	try {
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
					if (drObj.has("grp_x") ) grp_x=(String)drObj.get("grp_x");
					if (drObj.has("grp_y") ) grp_y=(String)drObj.get("grp_y");
					if (drObj.has("grp_g") ) grp_g=(String)drObj.get("grp_g");
					grp_g=grp_g.trim();
					curObj=colinfoObj;
					logger.info("curObj.toString() : " + curObj.toString());
					break;
				}
			}	
		}
		if (curObj == null) {
			logger.error("Object ID did not match in Layout Object ID : " + targetID);
			return;
		}
		
		pgmStmt+="%let _grpX=" + grp_x + ";\n";
		pgmStmt+="%let _grpY=" + grp_y + ";\n";
		pgmStmt+="%let _grpG=" + grp_g + ";\n";
		if (!grp_g.equalsIgnoreCase("")){
			for(int colii=0;colii<curObj.length();colii++){
				JSONObject rowInfo = (JSONObject)curObj.get(colii);
				String colName 	= (String)rowInfo.get("ColumnName");
				colName=colName.trim();
				logger.info("colName : " + colName + " : " + grp_g);
				if (colName.equalsIgnoreCase(grp_g)){
					String desc 		= (String)rowInfo.get("ColumnDesc");
					pgmStmt+="%let cls_label=" + desc + ";\n";
					break;
				}
			}	
		}
					
		if (precodeYN.equalsIgnoreCase("Y")){			// User Defined Code
			pgmStmt+=precode;
		}
		
		pgmStmt+="data work.target" + uid + ";\n";

		if (precodeYN.equalsIgnoreCase("Y")){
			pgmStmt+="\tset _last_(obs=max) end=eof;\n";
		} else {
			pgmStmt+="\tset " + library + "." + dataName + "(obs=max) end=eof;\n";
		}

		
		//for Where statement using Prompt value 
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
							IntegerDefinition idf = (IntegerDefinition)pdi;
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
		pgmStmt+="run;\n";
	} catch (JSONException e) {
		e.printStackTrace();
	}


	pgmStmt+="%MACRO JSON4SCATTER;\n";
	pgmStmt+="	DATA WORK.TARGET_&UID;\n";
	pgmStmt+="		SET _LAST_;\n";
	pgmStmt+="		%if &_grpG ne %then %do;\n";
	pgmStmt+="		group= &_grpG;\n";
	pgmStmt+="		%end;\n";
	pgmStmt+="		%else %do;\n";
	pgmStmt+="		group='.';\n";
	pgmStmt+="		%end;\n";
	pgmStmt+="		shape='circle';\n";
	pgmStmt+="		size=1;\n";
	pgmStmt+="		x=&_grpX;\n";
	pgmStmt+="		y=&_grpY;\n";
	pgmStmt+="		KEEP shape size group x y;\n";
	pgmStmt+="	RUN;\n";
	pgmStmt+="	PROC SORT DATA=WORK.TARGET_&UID NODUPKEY OUT=WORK.UNIQ_CLASS_&UID ;\n";
	pgmStmt+="		BY GROUP;\n";
	pgmStmt+="	RUN;\n";
	pgmStmt+="	PROC JSON OUT=_temp PRETTY;\n";
	pgmStmt+="		WRITE OPEN ARRAY;\n";
	pgmStmt+="			%let ii=0;\n";
	pgmStmt+="			%let dsid=%sysfunc(open(WORK.UNIQ_CLASS_&UID ));\n";
	pgmStmt+="			%if &dsid %then %do;\n";
	pgmStmt+="				%do %while(%sysfunc(fetch(&dsid)) eq 0);\n";
	pgmStmt+="					%let GROUP 	= %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,GROUP))));\n";
	pgmStmt+="					%let CLS_LABEL 	= %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,GROUP))));\n";
	pgmStmt+="			WRITE OPEN OBJECT;\n";
	pgmStmt+="				WRITE VALUES key \"&CLS_LABEL\";\n";
	pgmStmt+="				WRITE VALUES \"values\";\n";
	pgmStmt+="				WRITE OPEN ARRAY;\n";
	pgmStmt+="					EXPORT WORK.TARGET_&UID (WHERE=(GROUP =\"&GROUP\") ) /  NOSASTAGS;\n";
	pgmStmt+="				WRITE CLOSE;\n";
	pgmStmt+="			WRITE CLOSE;\n";
	pgmStmt+="				%end;\n";
	pgmStmt+="				%let rc=%sysfunc(close(&dsid));\n";
	pgmStmt+="			%end;\n";
	pgmStmt+="		WRITE CLOSE;\n";
	pgmStmt+="	RUN;\n";
	pgmStmt+="%MEND;\n";
	pgmStmt+="%JSON4SCATTER;\n";












	String saveStmt="";
	saveStmt="filename temppgm \'" + workFolder.trim() + "\\" + tempSTPFile.trim() + "';\n";
	saveStmt+="data _null_;\n";
	saveStmt+="	file temppgm;\n";
	saveStmt+="	infile datalines4 length=len;\n";
	saveStmt+="	input pgmStr $varying200. len;   \n";
	saveStmt+="	put pgmStr;\n";
	saveStmt+="datalines4;\n";
	saveStmt+=pgmStmt;	
	saveStmt+="\n";
	saveStmt+="\n";
	saveStmt+="\n";
	saveStmt+=";;;;;;;;\n";
	saveStmt+="run;\n";


	try {
		sas.Submit(saveStmt);
		CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
		LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
		StringSeqHolder logHldr = new StringSeqHolder();
		sas.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr,logLineTypeHldr, logHldr);
		String[] logLines = logHldr.value;
		String logStr="";
		for (int logii=0;logii<logLines.length;logii++){
			logStr=logLines[logii];
			logger.info("SAS Log : " + logStr);
		}	
		SASLogs.put(targetID,logLines);
	} catch (GenericError e) {
		e.printStackTrace();
	}
	session.setAttribute("SASLogs",SASLogs);
	




	
	String strSTPFolder ="c:\\temp\\";
	String strSTPFile = "test2.sas";
	
	
	
	try {
		
		String classID = Server.CLSID_SASSTP;
		Server server = new BridgeServer(classID,hostName,port);
		
		ConnectionFactoryConfiguration cxfConfig = new ManualConnectionFactoryConfiguration(server);
		ConnectionFactoryManager cxfManager = new ConnectionFactoryManager();
		ConnectionFactoryInterface cxf;
		cxf = cxfManager.getFactory(cxfConfig);
		ConnectionFactoryAdminInterface admin = cxf.getAdminInterface();
		ConnectionInterface cx = cxf.getConnection(principal,credential);
		
		StoredProcessServiceFactory spsf = new StoredProcessServiceFactory();
		StoredProcessServiceInterface storedProcessService = (StoredProcessServiceInterface)spsf.getStoredProcessService();
		StoredProcessOptions options = new StoredProcessOptions();
		StoredProcess2Interface storedProcess = (StoredProcess2Interface) storedProcessService.newStoredProcess(StoredProcess2Interface.SERVER_TYPE_STOREDPROCESS, options);
		//storedProcess.setSourceFromFile(workFolder, tempSTPFile);
		storedProcess.setSourceFromFile(strSTPFolder, strSTPFile);
		storedProcess.setParameterValue("_RESULT", "STREAM");
		
		Execution2Interface stpEI = storedProcess.execute(true, null, false, cx);
		
		String log = stpEI.readSASLog(Execution2Interface.LOG_FORMAT_TEXT,Execution2Interface.LOG_ALL_LINES);
		logger.debug("SASLog : " + log);
			
		final BufferedInputStream inData = new BufferedInputStream(stpEI.getInputStream(MetadataConstants.WEBOUT));
		final BufferedOutputStream outData = new BufferedOutputStream(response.getOutputStream());
		
		final byte[] buffer = new byte[4096];
		for (int n = 0; (n = inData.read(buffer, 0, buffer.length)) > 0; ) {
			outData.write(buffer, 0, n);
		}
		outData.flush();
		outData.close();
		
		stpEI.destroy();
		storedProcess.destroy();
		cx.close();
		admin.shutdown();
	} catch (ConnectionFactoryException e) {
	   e.printStackTrace();
	} catch (SecurityException e) {
	   e.printStackTrace();
	} catch (IOException e) {
	   e.printStackTrace();
	} catch (IllegalArgumentException e) {
	   e.printStackTrace();
	} catch (IllegalStateException e) {
	   e.printStackTrace();
	} catch (ExecutionException e) {
	   e.printStackTrace();
	} catch (InitializationException e) {
	   e.printStackTrace();
	} catch (ServiceException e) {
	   e.printStackTrace();
	} catch (InvalidPromptValueException e) {
	   e.printStackTrace();
	}
	

%>

