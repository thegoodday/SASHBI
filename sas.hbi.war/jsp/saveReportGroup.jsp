<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java"
    import="
    	java.awt.Color,
			java.awt.Font,
			java.io.BufferedInputStream,
			java.io.BufferedOutputStream,
			java.io.BufferedReader,
			java.io.FileInputStream,
			java.io.FileReader,
			java.io.IOException,
			java.io.InputStream,
			java.io.InputStreamReader,
			java.io.PrintWriter,
			java.io.StringWriter,
			java.io.UnsupportedEncodingException,
			java.net.*,
			java.net.URI,
			java.net.URLDecoder,
			java.net.URLEncoder,
			java.rmi.RemoteException,
			java.sql.*,
			java.sql.Connection,
			java.sql.DriverManager,
			java.sql.PreparedStatement,
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
			javax.swing.tree.DefaultTreeModel,
			javax.swing.tree.TreeModel,
			org.apache.log4j.*,
			org.json.JSONArray,
			org.json.JSONException,
			org.json.JSONObject,
			com.sas.datatypes.DataTypeInterface,
			com.sas.framework.config.ConfigurationServiceInterface,
			com.sas.hbi.dao.Format,
			com.sas.hbi.listeners.STPSessionBindingListener,
			com.sas.hbi.listeners.STPSessionBindingListener.DestroyableObjectInterface,
			com.sas.hbi.omr.MetadataObjectIf,
			com.sas.hbi.omr.MetadataSearchUtil,
			com.sas.hbi.storedprocess.StoredProcessConnection,
			com.sas.hbi.storedprocess.StoredProcessFacade,
			com.sas.hbi.tools.*,
			com.sas.hbi.tools.MetadataUtil,
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
			com.sas.services.information.RepositoryInterface,
			com.sas.services.information.ServerInterface,
			com.sas.services.information.metadata.MetadataInterface,
			com.sas.services.information.metadata.PathUrl,
			com.sas.services.information.metadata.PhysicalTableInterface,
			com.sas.services.information.metadata.SASLibraryInterface,
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
			com.sas.servlet.tbeans.StyleInfo,
			com.sas.servlet.tbeans.html.TreeView,
			com.sas.servlet.tbeans.models.TreeNode,
			com.sas.servlet.tbeans.models.TreeNodeInterface,
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
			com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8" %>
      
<% 
	Logger logger = Logger.getLogger("saveFormat");
	logger.setLevel(Level.DEBUG);
	String contextName = application.getInitParameter("application-name");

	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif   = sci.getUserContext();
	RepositoryInterface rif 	= ucif.getRepository("Foundation");
	UserIdentityInterface id  	= ucif.getIdentityByDomain("DefaultAuth");
	String userID = ucif.getName();
	String USERID = ucif.getPerson().getDisplayName() + "(" + userID + ")";


	Properties conf = new HBIConfig().getConfig();
	String hostName = conf.getProperty("app.host");
	String logicalServerName = conf.getProperty("app.logicalServerName"); 
	int port = Integer.parseInt(conf.getProperty("app.port"));
	LinkedHashMap<String, String[]> SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
	
	String principal=(String) id.getPrincipal();
	String credential=(String) id.getCredential();
	
	
	logger.debug("user ID : " + userID);
	DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");
	
	String gridData 	= request.getParameter("gridData");
	String savepath 	= request.getParameter("_savepath");
	String _sessionid 	= request.getParameter("_SESSIONID");
	logger.debug("_sessionid : " + _sessionid);
	
	Format Format=new Format();
		
	Format.updateFormat(gridData,USERID,"ALMConf", "RPT_GRP_LST", savepath,dataProvider);
	
	
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
		//StoredProcess2Interface storedProcess = (StoredProcess2Interface) storedProcessService.newStoredProcess(StoredProcess2Interface.SERVER_TYPE_STOREDPROCESS, options);
		final ServerInterface authServer = ucif.getAuthServer();
		PathUrl path = new PathUrl("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/06.Tree Rollup/01/trc001_saveRptGrpList(StoredProcess)");
		final MetadataInterface metadataObject = authServer.getObjectByPath(path);
		//String metaID=metadataObject.getReposId();	
		StoredProcess2Interface storedProcess = null;
		if (metadataObject instanceof StoredProcessInterface)
		{
			final StoredProcessInterface stp = (StoredProcessInterface) metadataObject;
			storedProcess = (StoredProcess2Interface) stp.newServiceObject(options);			
		}

		Enumeration paramNames = request.getSession().getAttributeNames();
		paramNames = request.getParameterNames();
		while(paramNames.hasMoreElements()){
		    String name = paramNames.nextElement().toString();
		    String value = new String(request.getParameter(name).getBytes("EUC-KR"),"EUC-KR");
		    if(value.equalsIgnoreCase("")||value==null){
		        value = "";
		    }
		    logger.info("Parameter : " + name + " : " + value);
				if (name.toUpperCase().indexOf("_DRILL_") > -1){
		    	name=name.substring(7);
		    }
		    if (name.toUpperCase().equalsIgnoreCase("_SESSIONID")||name.toUpperCase().equalsIgnoreCase("GRIDDATA")) {
		    } else {
		    	storedProcess.setParameterValue(name,value);
		    }
		}		
		storedProcess.setParameterValue("_RESULT", "STREAM");
		storedProcess.setParameterValue("_savepath", savepath);		
		storedProcess.setParameterValue("_sessionid", _sessionid);		

		Execution2Interface stpEI = storedProcess.execute(true, null, false, cx);
		
		String log = stpEI.readSASLog(Execution2Interface.LOG_FORMAT_HTML,Execution2Interface.LOG_ALL_LINES);
		logger.debug("SASLog : " + log);
		String [] logs = {log};
		SASLogs.put("SAVE_FORMAT",logs);
		session.setAttribute("SASLogs",SASLogs);			
			
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
