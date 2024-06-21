<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java"
    import="java.io.IOException,
			java.io.PrintWriter,
			java.io.StringWriter,
			java.net.URLDecoder,
			java.net.URLEncoder,
			java.sql.Connection,
			java.sql.DriverManager,
			java.sql.PreparedStatement,
			java.sql.ResultSet,
			java.sql.SQLException,
			java.text.DateFormat,
			java.text.SimpleDateFormat,
			java.util.*,
			java.util.Properties,
			javax.swing.tree.DefaultTreeModel,
			javax.swing.tree.TreeModel,
			org.apache.log4j.*,
			org.json.JSONArray,
			org.json.JSONException,
			org.json.JSONObject,    
			com.sas.hbi.dao.UDReport,
			com.sas.hbi.omr.MetadataObjectIf,
			com.sas.hbi.omr.MetadataSearchUtil,
			com.sas.hbi.storedprocess.StoredProcessFacade,
			com.sas.hbi.tools.MetadataUtil,
			com.sas.hbi.tools.Stub,
			com.sas.services.information.RepositoryInterface,
			com.sas.services.information.metadata.PathUrl,
			com.sas.services.session.SessionContextInterface,
			com.sas.services.user.UserContextInterface,
			com.sas.services.user.UserIdentityInterface,
			com.sas.servlet.tbeans.StyleInfo,
			com.sas.servlet.tbeans.html.TreeView,
			com.sas.servlet.tbeans.models.TreeNode,
			com.sas.servlet.tbeans.models.TreeNodeInterface,
			com.sas.util.Strings,
			com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8" %>
 
<% 
	Logger logger = Logger.getLogger("openTreeRollup");
	logger.setLevel(Level.DEBUG);
	String contextName = application.getInitParameter("application-name");

	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	String userID = ucif.getName();
	logger.debug("user ID : " + userID);
	
	String TREE_ID = request.getParameter("TREE_ID"); 
	String DATA_NAME = request.getParameter("DATA_NAME"); 

	UDReport UDReport=new UDReport();
	String layoutStr=UDReport.getJsonText(TREE_ID,"LT");
	String filterStr=UDReport.getJsonText(TREE_ID,"FT");
	String mstatStr="\"\"";	
	logger.debug("DATA_NAME : " + DATA_NAME);
	if ( DATA_NAME != null){
		mstatStr=UDReport.getJsonText(TREE_ID,"MT");
	} 

%>
[{"layout":<%=layoutStr%>,"filter":<%=filterStr%>,"mstat":<%=mstatStr%>}]

