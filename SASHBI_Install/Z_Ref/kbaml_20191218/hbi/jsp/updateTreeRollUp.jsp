<%@ page language="java"
    import="java.net.URLEncoder,
			java.net.URLDecoder,
			java.io.StringWriter,
			java.io.PrintWriter,
			java.io.IOException,
			java.sql.DriverManager,
			java.sql.Connection,
			java.sql.PreparedStatement,
			java.sql.SQLException,
			java.text.DateFormat,
			java.text.SimpleDateFormat,
			java.util.*,
			javax.swing.tree.DefaultTreeModel,
			javax.swing.tree.TreeModel,
			org.apache.log4j.*,
			com.sas.hbi.omr.MetadataObjectIf,
			com.sas.hbi.omr.MetadataSearchUtil,
			com.sas.hbi.storedprocess.StoredProcessFacade,
			com.sas.hbi.tools.MetadataUtil,
			com.sas.hbi.tools.Stub,
			com.sas.hbi.dao.UDReport,
			com.sas.services.information.metadata.PathUrl,
			com.sas.services.information.RepositoryInterface,
			com.sas.services.session.SessionContextInterface,
			com.sas.services.user.UserContextInterface,
			com.sas.services.user.UserIdentityInterface,
			com.sas.servlet.tbeans.models.TreeNode,
			com.sas.servlet.tbeans.html.TreeView,
			com.sas.servlet.tbeans.models.TreeNode,
			com.sas.servlet.tbeans.models.TreeNodeInterface,
			com.sas.servlet.tbeans.StyleInfo,
			com.sas.util.Strings,
			com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8" %>
<% 
	Logger logger = Logger.getLogger("updateTreeRollup");
	logger.setLevel(Level.DEBUG);
	String contextName = application.getInitParameter("application-name");

	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	String userID = ucif.getName();
	logger.debug("user ID : " + userID);

	String RPT_TYPE = request.getParameter("RPT_TYPE");
	String ORG_GROUP = request.getParameter("ORG_GROUP");
	String TREE_GROUP = request.getParameter("TREE_GROUP");
	String DATA_GROUP = request.getParameter("DATA_GROUP");
	String LIBRARY = request.getParameter("LIBRARY");
	String DATA_NAME = request.getParameter("DATA_NAME");
	String treeID = request.getParameter("treeID");
	String treeGroup = request.getParameter("treeGroup");
	String treeName = request.getParameter("treeName");
	String treeDesc = request.getParameter("treeDesc");
	
	logger.debug("treeID : " + treeID);
	logger.debug("RPT_TYPE : " + RPT_TYPE);
	logger.debug("ORG_GROUP : " + ORG_GROUP);
	logger.debug("TREE_GROUP : " + TREE_GROUP);
	logger.debug("DATA_GROUP : " + DATA_GROUP);
	logger.debug("LIBRARY : " + LIBRARY);
	logger.debug("DATA_NAME : " + DATA_NAME); 
	logger.debug("treeName : " + treeName);
	logger.debug("treeDesc : " + treeDesc);
	UDReport UDReport=new UDReport();
	
	if (treeID != "" ) {
		UDReport.updateReportInfo(treeID,RPT_TYPE,ORG_GROUP,LIBRARY,DATA_NAME,treeGroup,treeName,treeDesc,userID);
	} 
%>
Successfully update Tree Rollup Layout(<%=treeID%>).

