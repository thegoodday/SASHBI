<%@ page contentType="text/html;charset=EUC-KR" %>
<%@ page import="
	com.sas.hbi.property.HBIConfig,			
	com.sas.hbi.storedprocess.StoredProcessFacade,			
	com.sas.hbi.tools.POI,
	com.sas.hbi.tools.Stub,
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
	com.sas.services.information.RepositoryInterface,
	com.sas.services.session.SessionContextInterface,			
	com.sas.services.user.UserContextInterface,
	com.sas.services.user.UserIdentityInterface,
	com.sas.servlet.util.SocketListener,
	com.sas.storage.*,
	com.sas.storage.jdbc.JDBCToTableModelAdapter,
	com.sas.web.keys.CommonKeys,
	java.awt.Color,
	java.awt.Font,
	java.net.*,
	java.sql.*,
	java.sql.Connection,
	java.sql.SQLException,
	java.util.*,
	java.util.Properties,
	org.apache.log4j.*
"%>
<%
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");

	Logger logger = Logger.getLogger("getLibraries");

	int uid = (int)(Math.random() * 100000);
	String libraryID = request.getParameter("libraryID");
	String libraryName = request.getParameter("libraryName");
	String tableID = request.getParameter("tableID");
	
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	RepositoryInterface rif = ucif.getRepository("Foundation");
	UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth");
	String principal=(String) id.getPrincipal();
	String credential=(String) id.getCredential();
	String hostName = rif.getHost();
	int port = rif.getPort();
		
	DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");
	//String logicalServerName = "SASApp - Logical Workspace Server";
	HBIConfig hbiconf = HBIConfig.getInstance();
	Properties conf = hbiconf.getConf();
	
	String logicalServerName = conf.getProperty("app.logicalServerName"); 

	logger.debug("dataProvider : " + dataProvider);
	logger.debug("logicalServerName : " + logicalServerName);
		
	IWorkspace iWorkspace = dataProvider.getIWorkspace(logicalServerName);
	
	ILanguageService  sas=iWorkspace.LanguageService();
	String pgmStmt =null;
	pgmStmt=";*\';*\";*/;quit;run;";
	pgmStmt+="options obs=max spool nosyntaxcheck;\n";
	pgmStmt+="LIBNAME " + libraryID + " META LIBRARY='" + libraryName + "'\n";
	pgmStmt+="  REPNAME='Foundation' METASERVER='" + hostName + "' PORT=" + port + "\n";
	pgmStmt+="  USER='" + principal + "' PW='" + credential + "';\n";
	pgmStmt+="PROC SQL;\n";
	pgmStmt+="	CREATE TABLE WORK.COLUMNS_" + uid + " AS\n";
	pgmStmt+="	SELECT\n";
	pgmStmt+="		MEMNAME, NAME, LABEL, LENGTH, TYPE, FORMAT, INFORMAT, VARNUM\n";
	pgmStmt+="	FROM SASHELP.VCOLUMN\n";
	pgmStmt+="	WHERE UPCASE(LIBNAME) = '" + libraryName.toUpperCase() + "'\n";
	pgmStmt+="		AND UPCASE(MEMNAME) = '" + tableID.toUpperCase() + "'\n";
	pgmStmt+="	ORDER BY VARNUM\n";
	pgmStmt+="	;\n";
	pgmStmt+="QUIT;\n";

	sas.Submit(pgmStmt);
	CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
	LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
	StringSeqHolder logHldr = new StringSeqHolder();
	sas.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr,logLineTypeHldr, logHldr);
	String[] logLines = logHldr.value;
	logger.debug("logLines: ");
	String logStr="";
	for (int logii=0;logii<logLines.length;logii++){
		logStr=logLines[logii];
		logger.debug("logLines: " + logStr);
	}
	logger.debug(pgmStmt);	
	IDataService dService = iWorkspace.DataService();
	java.util.Properties Properties1 = new java.util.Properties();
	Connection sqlConnection = new MVAConnection(dService, Properties1);

	
	String jdbcQuery = "";
	Statement stmt = null;
	ResultSet rs = null;

	try {
		jdbcQuery = "select * from work.columns_" + uid;
		stmt = sqlConnection.createStatement();
		rs = stmt.executeQuery(jdbcQuery);
		out.write("[");
		int ii = 0;
		while (rs.next()) {
			if (ii == 0) {
				out.write("{");
			} else {
				out.write(",{");
			}
			out.write("\"id\":\"" + rs.getObject(1).toString().trim() +"." + rs.getObject(2).toString().trim() + "\",");
			out.write("\"name\":\"" + rs.getObject(2).toString().trim() + "\",");
			out.write("\"desc\":\"" + rs.getObject(3).toString().trim() + "\",");
			out.write("\"length\":\"" + rs.getObject(4).toString().trim() + "\",");
			out.write("\"type\":\"" + rs.getObject(5).toString().trim() + "\",");
			out.write("\"fmt\":\"" + rs.getObject(6).toString().trim() + "\",");
			out.write("\"ifmt\":\"" + rs.getObject(7).toString().trim() + "\",");
			out.write("\"rank\":\"" + rs.getObject(8).toString().trim() + "\"}");
			ii++;
		}
		out.write("]");
		stmt.close();
		sqlConnection.close();
	} catch (SQLException e) {
		e.printStackTrace();
	}
%>

