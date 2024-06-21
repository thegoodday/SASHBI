<%@ page language="java" contentType= "text/json; charset=UTF-8" %>
<%@ page import="
		java.awt.Color,
		java.awt.Font,
		java.net.*,
		java.sql.*,
		java.sql.Connection,
		java.sql.SQLException,
		java.util.*,
		java.util.Properties,
		com.sas.hbi.storedprocess.StoredProcessFacade,			
		com.sas.hbi.tools.POI,
		com.sas.hbi.tools.Stub,
		com.sas.hbi.tools.STPNote,
		com.sas.iom.SAS.*,
		com.sas.iom.SAS.IDataService,
		com.sas.iom.SAS.IDataService, 
		com.sas.iom.SAS.ILanguageService,
		com.sas.iom.SAS.ILanguageServicePackage.*,
		com.sas.iom.SAS.IWorkspace,
		com.sas.iom.SAS.IWorkspace, 
		com.sas.iom.SAS.IWorkspaceHelper, 
		com.sas.iom.SASIOMDefs.*,
		com.sas.prompts.valueprovider.dynamic.DataProvider,
		com.sas.prompts.valueprovider.dynamic.DataProviderUtil,
		com.sas.rio.MVAConnection,
		com.sas.services.connection.*,
		com.sas.services.session.SessionContextInterface,
		com.sas.servlet.util.SocketListener,
		com.sas.storage.*,
		com.sas.storage.jdbc.JDBCToTableModelAdapter,
		com.sas.web.keys.CommonKeys,
		org.apache.log4j.*,
		org.json.JSONArray,
		org.json.JSONException,
		org.json.JSONObject
" %>
<%
	request.setCharacterEncoding("utf-8");
	response.setContentType("text/json");
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");

	Logger logger = Logger.getLogger("submitUD");
	
	int uid = (int)(Math.random() * 100000);
	logger.info("uid : " + uid);

	String classID = Server.CLSID_SAS;
	String host = "localhost";									// Edit 
	int port = 8591;																	// SAS Workspace Server
		
	DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");
	String logicalServerName = "SASApp - Logical Workspace Server"; 
	logger.debug("dataProvider : " + dataProvider);
	logger.debug("logicalServerName : " + logicalServerName);
		
	IWorkspace iWorkspace = dataProvider.getIWorkspace(logicalServerName);
	ILanguageService  sas=iWorkspace.LanguageService();
	

	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	STPNote stpNote = new com.sas.hbi.tools.STPNote();
	stpNote.setStpObjId(request.getParameter("_program"));
	//String layoutStr="";
	//layoutStr=stpNote.getSTPNote(sci,"Layout");
	//logger.debug("layoutStr:"+layoutStr);
	String DRInfo=null;//"";
	//DRInfo=stpNote.getSTPNote(sci,"DataRole");
	logger.debug("DRInfo:"+DRInfo);

	String targetID = (String)request.getParameter("param1");
	
	JSONObject rowObj = null;
	JSONArray colinfoObj = null;
	if (DRInfo != null){
		rowObj = new JSONObject(DRInfo);
		logger.debug("JSONObject Row Num : " + rowObj.length());	
		for (int rii=0; rii<rowObj.length(); rii++){
			JSONObject row=(JSONObject)rowObj.getJSONObject("R"+rii);
			for(int cjj=0;cjj<row.length();cjj++){
				JSONObject colObj=(JSONObject)row.getJSONObject("C"+cjj);
				JSONObject drObj=(JSONObject)colObj.getJSONObject("drInfo");
				String objID=(String)drObj.get("id");
				if (objID.equalsIgnoreCase(targetID)){
					String library=(String)drObj.get("library");
					String dataName=(String)drObj.get("data");
					logger.debug("objID:"+objID);
					logger.debug("dataName:"+ library + "." + dataName);
					colinfoObj=(JSONArray)drObj.getJSONArray("columns");
				}
			}	
		}
		
		Iterator keys = rowObj.keys();
		while(keys.hasNext()) {
			String rowName = (String)keys.next();
			logger.debug("rowName:"+rowName);
			JSONObject objName = rowObj.getJSONObject(rowName);
		}	
	}	
	
	for(int colii=0;colii<colinfoObj.length();colii++){
		JSONObject rowInfo = (JSONObject)colinfoObj.get(colii);
		String colName 	= (String)rowInfo.get("name");
		String id 		= (String)rowInfo.get("name");
		//String rank 	= (String)rowInfo.get("rank");
		String isShow 	= (String)rowInfo.get("v");
		String desc 	= (String)rowInfo.get("desc");
		String colType 	= (String)rowInfo.get("type");
		String colAlign = (String)rowInfo.get("a");
		int colWidth 	= (int)rowInfo.getInt("w");
		boolean isSort 	= (boolean)rowInfo.getBoolean("s");
		boolean isResize = (boolean)rowInfo.getBoolean("r");
		String colFormat = (String)rowInfo.get("fmt");
		logger.debug("column Name:"+colName);
	}
	
	Enumeration paramNames = request.getSession().getAttributeNames();
	paramNames = request.getParameterNames();
	while(paramNames.hasMoreElements()){
	    String name = paramNames.nextElement().toString();
	    String value = new String(request.getParameter(name).getBytes("EUC-KR"),"EUC-KR");
	    if("".equals(value)||value==null){
	        value = "";
	    }
	    logger.info(name + " : " + value);
	}	

	String client = (java.net.InetAddress.getLocalHost()).getHostAddress();
	logger.info("client : " + client);
	SocketListener socket = new SocketListener();
	int wPort = socket.setup();
	socket.start();
	

	String pgmStmt =null;
	pgmStmt="\n";
	pgmStmt+="filename webout socket '" + client + ":" + wPort + "' ;\n";
	//pgmStmt+="filename webout 'c:\\temp\\new2.json' ;\n";
	pgmStmt+="%inc 'C:\\SASHBI\\Macro\\hbi_init.sas';\n";
	pgmStmt+="data _null_;\n path=pathname('work'); call symput('path',path);\n";
	pgmStmt+="run;\n";
	pgmStmt+="%let _sessionid=fromPS;\n";
	pgmStmt+="libname save \"&path\";\n";
	//pgmStmt+="ods html file=webout(no_top_matter no_bottom_matter) style=HTMLBlue;\n";
	pgmStmt+="options obs=max spool noerrorabend nosyntaxcheck ;\n";
	pgmStmt+="data work.test" + uid + ";\n";
	pgmStmt+="	set sashelp.class;\n";
	pgmStmt+="run;\n";
	//pgmStmt+="%json4SlickPS(tableName=sashelp.class);\n";
	//pgmStmt+="proc json out=webout; export sashelp.class (keep= Age Height Name Sex Weight ) / nosastags fmtnumeric;run;;\n";
	pgmStmt+="%inc 'c:\\temp\\test.sas';\n";
	//pgmStmt+="ods html close;\n";

	sas.Submit(pgmStmt);
	CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
	LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
	StringSeqHolder logHldr = new StringSeqHolder();
	sas.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr,logLineTypeHldr, logHldr);
	String[] logLines = logHldr.value;
	String logStr="";
	for (int logii=0;logii<logLines.length;logii++){
		logStr=logLines[logii];
		//logger.info("SAS Log : " + logStr);
	}	

	socket.write(out);

%>

