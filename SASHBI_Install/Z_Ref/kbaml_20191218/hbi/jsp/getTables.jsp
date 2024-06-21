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
	logger.setLevel(Level.DEBUG);

	int uid = (int)(Math.random() * 100000);
	String libraryID = request.getParameter("libraryID");
	String libraryName = request.getParameter("libraryName");
	
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	RepositoryInterface rif = ucif.getRepository("Foundation");
	UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth");
	String principal=(String) id.getPrincipal();
	String credential=(String) id.getCredential();
	String hostName = rif.getHost();
	int port = rif.getPort();
		
	DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");
	HBIConfig hbiconf = HBIConfig.getInstance();
	Properties conf = hbiconf.getConf();
	
	String logicalServerName = conf.getProperty("app.logicalServerName"); 
	logger.debug("dataProvider : " + dataProvider);
	logger.debug("logicalServerName : " + logicalServerName);
		
	IWorkspace iWorkspace = dataProvider.getIWorkspace(logicalServerName);
	
	ILanguageService  sas=iWorkspace.LanguageService();
	String pgmStmt =null;
	pgmStmt="";
	pgmStmt+="options obs=max spool nosyntaxcheck;\n";
	pgmStmt+="LIBNAME " + libraryID + " META LIBRARY='" + libraryName + "'\n";
	pgmStmt+="  REPNAME='Foundation' METASERVER='" + hostName + "' PORT=" + port + "\n";
	pgmStmt+="  USER='" + principal + "' PW='" + credential + "';\n";
	pgmStmt+="PROC SQL;\n";
	pgmStmt+="	CREATE TABLE WORK.TABLES_" + uid + " AS\n";
	pgmStmt+="	SELECT\n";
	//pgmStmt+="		CASE MEMLABEL\n";
	//pgmStmt+="			WHEN \"\" THEN MEMNAME\n";
	//pgmStmt+="			ELSE MEMLABEL||\"(\"||MEMNAME||\")\"\n";
	//pgmStmt+="		END AS DISPLAY FORMAT=$110.,\n";
	//pgmStmt+="		MEMNAME, MEMTYPE, MEMLABEL FORMAT=$50.\n";
	//pgmStmt+="	FROM SASHELP.VTABLE\n";
	pgmStmt+="		memname as DISPLAY, memname, memtype, memname as MEMLABEL\n";
	pgmStmt+="	FROM DICTIONARY.MEMBERS\n";
	pgmStmt+="	WHERE UPCASE(LIBNAME) = '" + libraryID.toUpperCase() + "'\n";
	pgmStmt+="	ORDER BY DISPLAY\n";
	pgmStmt+="	;\n";
	pgmStmt+="QUIT;\n";


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
	logger.debug("pgmStmt :");	
	//logger.debug(pgmStmt);	

	IDataService dService = iWorkspace.DataService();
	java.util.Properties  Properties1 = new java.util.Properties();	
	Connection sqlConnection = new MVAConnection(dService,Properties1);
	
	String jdbcQuery = "";
	Statement stmt = null;
	ResultSet rs = null;

	try {
		jdbcQuery = "select * from work.tables_" + uid;
		stmt = sqlConnection.createStatement();
		rs = stmt.executeQuery(jdbcQuery);
		
		out.write ( "[");
		int ii=0;
		while (rs.next()) {
			if (ii==0){
				out.write ( "{");
			} else {
				out.write ( ",{");
			}	
			out.write ( "\"DISPLAY\":\""+rs.getObject(1).toString().trim() + "\"," );
			out.write ( "\"TableName\":\""+rs.getObject(2).toString().trim() + "\"," );
			out.write ( "\"MEMTYPE\":\""+rs.getObject(3).toString().trim() + "\"," );
			out.write ( "\"TableDesc\":\""+rs.getObject(4).toString().trim() + "\"}" );
			ii++;
		}
		out.write ( "]");
		stmt.close();
		sqlConnection.close();
	} catch (SQLException e) {
		e.printStackTrace();
	}
%>

