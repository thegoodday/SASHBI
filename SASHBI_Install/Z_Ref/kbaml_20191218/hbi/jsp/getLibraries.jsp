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
	logger.debug("uid : " + uid);
	
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	RepositoryInterface rif = ucif.getRepository("Foundation");
	UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth");
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
	pgmStmt="\n";
	//pgmStmt+="filename kk 'c:\\temp\\test.log';proc printto log=kk;proc options GROUP=ERRORHANDLING;run;options obs=max;data kk; set sashelp.prdsale; run;\n";
	pgmStmt+="options obs=max spool nosyntaxcheck;\n";
	pgmStmt+="data work.library_" + uid + ";\n";
	pgmStmt+="	length uri $40 ID $20 Name Libref Engine $40 isDBMSLibname $2;\n";
	pgmStmt+="	nobj=1;\n";
	pgmStmt+="	n=1;\n";
	pgmStmt+="	do while(nobj >= 0);\n";
	pgmStmt+="		nobj=metadata_getnobj(\"omsobj:SASLibrary?@Id contains '.'\",n,uri);\n";
	pgmStmt+="		if nobj > 0 then do;\n";
	pgmStmt+="			rc = metadata_getattr(uri, 'ID', 	ID);\n";
	pgmStmt+="			rc = metadata_getattr(uri, 'Name', 	Name);\n";
	pgmStmt+="			rc = metadata_getattr(uri, 'Libref', 	Libref);\n";
	pgmStmt+="			rc = metadata_getattr(uri, 'Engine', 	Engine);\n";
	pgmStmt+="			rc = metadata_getattr(uri, 'isDBMSLibname', 	isDBMSLibname);\n";
	pgmStmt+="			keep ID Name Libref Engine isDBMSLibname;\n";
	pgmStmt+="			put name @40 id=;\n";
	pgmStmt+="			output;\n";
	pgmStmt+="		end;\n";
	pgmStmt+="		n=n+1;\n";
	pgmStmt+="	end;\n";
	pgmStmt+="run;\n";
	pgmStmt+="data _null_;\n path=pathname('work'); put path=;\n";
	pgmStmt+="run;\n";
	//pgmStmt+="proc printto; run;\n";

	sas.Submit(pgmStmt);
	CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
	LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
	StringSeqHolder logHldr = new StringSeqHolder();
	sas.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr,logLineTypeHldr, logHldr);
	String[] logLines = logHldr.value;
	logger.debug("SAS Log : ");
	String logStr="";
	for (int logii=0;logii<logLines.length;logii++){
		logStr=logLines[logii];
		//logger.debug("SAS Log : " + logStr);
	}	
	
	IDataService dService = iWorkspace.DataService();
	java.util.Properties  Properties1 = new java.util.Properties();	
	Connection sqlConnection = new MVAConnection(dService,Properties1);
	
	String jdbcQuery = "";
	Statement stmt = null;
	ResultSet rs = null;

	try {
		jdbcQuery = "select * from work.library_" + uid;
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
			out.write ( "\"id\":\""+rs.getObject(1).toString().trim() + "\"," );
			out.write ( "\"label\":\""+rs.getObject(2).toString().trim() + "\"," );
			out.write ( "\"libref\":\""+rs.getObject(3).toString().trim() + "\"," );
			out.write ( "\"engine\":\""+rs.getObject(4).toString().trim() + "\"," );
			out.write ( "\"isDB\":\""+rs.getObject(5).toString().trim() + "\"}" );
			ii++;
		}
		out.write ( "]");
		stmt.close();
		sqlConnection.close();
	} catch (SQLException e) {
		e.printStackTrace();
	}

%>

