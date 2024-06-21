<%
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");
%>
<%@ page contentType="text/html;charset=EUC-KR" %>
<%@ page import="java.util.*,
	java.lang.*,
	java.sql.*,
	com.sas.iom.SAS.IWorkspace, 
	com.sas.iom.SAS.*,
	com.sas.iom.SAS.IWorkspaceHelper, 
	com.sas.iom.SASIOMDefs.*,
	com.sas.iom.SAS.ILanguageServicePackage.*,
	com.sas.rio.MVAConnection,
	com.sas.iom.SAS.IDataService,
	com.sas.services.connection.*,
	com.sas.storage.jdbc.JDBCToTableModelAdapter,
	com.sas.storage.*,
	java.awt.Font,
	java.awt.Color,
	java.net.*,
	java.sql.Connection,
	java.sql.SQLException,
	java.util.Properties,
	com.sas.servlet.util.SocketListener,
	java.io.File, 
	java.io.IOException,
	java.io.UnsupportedEncodingException,
	java.net.URLEncoder,
	java.rmi.RemoteException,
	java.util.ArrayList,
	java.util.Calendar,
	java.util.Collections,
	java.util.HashMap,
	java.util.List,
	java.util.Locale,
	java.util.Map,
	java.util.Properties,
	javax.servlet.RequestDispatcher,
	javax.servlet.ServletContext,
	javax.servlet.ServletException,
	javax.servlet.http.HttpServlet,
	javax.servlet.http.HttpServletRequest,
	javax.servlet.http.HttpServletResponse,
	javax.servlet.http.HttpSession,
	org.apache.log4j.Logger,
	com.sas.hbi.listeners.STPSessionBindingListener,
	com.sas.hbi.listeners.STPSessionBindingListener.DestroyableObjectInterface,
	com.sas.hbi.property.HBIConfig,			
	com.sas.hbi.storedprocess.StoredProcessConnection,
	com.sas.hbi.storedprocess.StoredProcessFacade,
	com.sas.prompts.definitions.PromptDefinitionInterface,
	com.sas.prompts.InvalidPromptValueException,
	com.sas.prompts.valueprovider.dynamic.DataProvider,
	com.sas.prompts.PromptValuesInterface,
	com.sas.prompts.groups.PromptGroupInterface,
	com.sas.services.ServiceException,
	com.sas.services.TransportException,
	com.sas.services.connection.ConnectionFactoryException,
	com.sas.services.deployment.ServiceDeploymentException,
	com.sas.services.information.InformationServiceInterface,
	com.sas.services.information.RepositoryInterface,
	com.sas.services.information.metadata.PathUrl,
	com.sas.services.session.SessionContextInterface,
	com.sas.services.storedprocess.Execution2Interface,
	com.sas.services.storedprocess.ExecutionException,
	com.sas.services.storedprocess.StoredProcess2Interface,
	com.sas.services.storedprocess.StoredProcessServiceInterface,
	com.sas.services.storedprocess.metadata.StoredProcessOptions,
	com.sas.services.user.UserContextInterface,
	com.sas.services.user.UserIdentityInterface,
	com.sas.servlet.util.BaseUtil,
	com.sas.util.Strings,
	com.sas.web.keys.CommonKeys,
	com.sas.web.keys.ComponentKeys
" %>
<%@ page import="org.apache.log4j.*"%>
<%@ page import="com.sas.storage.jdbc.JDBCToTableModelAdapter"%>
<%@ page import="com.sas.prompts.valueprovider.dynamic.DataProvider"%>
<%@ page import="com.sas.prompts.valueprovider.dynamic.DataProviderUtil"%>
<%@ page import="com.sas.rio.MVAConnection"%>
<%@ page import="com.sas.iom.SAS.IDataService"%> 
<%@ page import="com.sas.iom.SAS.ILanguageService"%>
<%@ page import="com.sas.iom.SAS.IWorkspace"%>
<%@ page import="com.sas.services.session.SessionContextInterface"%>			
<%@ page import="com.sas.hbi.storedprocess.StoredProcessFacade"%>			
<%@ page import="com.sas.hbi.tools.Stub"%>
<%@ page import="com.sas.hbi.tools.POI"%>
<%@ page import="com.sas.web.keys.CommonKeys"%>

<%
Logger logger = Logger.getLogger("STPRV");
StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
String metaID=facade.getMetaID();


%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title></title>
<meta http-equiv="Content-Style-Type" content="text/css">
<meta http-equiv="Content-Script-Type" content="text/javascript">
</head>
<body>
<%=stpInfo.getDescription()%>
test
<%
StoredProcess2Interface stpInfo = (StoredProcess2Interface)facade.getStoredProcess();
PromptValuesInterface pvi  = stpInfo.getPromptValues();
PromptGroupInterface pgi = pvi.getPromptGroup();
List<PromptDefinitionInterface> promptDefinitions = pgi.getPromptDefinitions(true);
for (int i = 0; i < promptDefinitions.size(); i++) {
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	if (!pdi.isHidden()){
	}
}
%>
</body>
</html>
