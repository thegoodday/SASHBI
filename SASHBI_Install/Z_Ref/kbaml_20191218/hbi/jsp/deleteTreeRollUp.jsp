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
	Logger logger = Logger.getLogger("deleteTreeRollup");
	logger.setLevel(Level.DEBUG);
	String contextName = application.getInitParameter("application-name");

	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	String userID = ucif.getName();
	logger.debug("user ID : " + userID);

	String treeID = request.getParameter("treeID");
	logger.debug("treeID : " + treeID);
	UDReport UDReport=new UDReport();
	
	if (treeID != "" ) {
		UDReport.deleteTreeReport(treeID);
	} 
%>
Successfully deleted Tree Rollup Layout(<%=treeID%>).

