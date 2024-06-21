<%@ page language="java"
    import="java.net.URLEncoder,
			java.net.URLDecoder,
			java.io.StringWriter,
			java.io.PrintWriter,
			java.io.IOException,
			java.sql.DriverManager,
			java.sql.Connection,
			java.sql.DriverManager,
			java.sql.PreparedStatement,
			java.sql.ResultSet,
			java.sql.SQLException,
			java.text.DateFormat,
			java.text.SimpleDateFormat,
			java.util.*,
			javax.swing.tree.DefaultTreeModel,
			javax.swing.tree.TreeModel,
			org.apache.log4j.*,
			org.json.JSONArray,
			org.json.JSONException,
			org.json.JSONObject,    
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
	Logger logger = Logger.getLogger("saveTreeRollup");
	logger.setLevel(Level.DEBUG);
	String contextName = application.getInitParameter("application-name");

	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	String userID = ucif.getName();
	List groupList = ucif.getGroups();
	List<String> almGroup = new Vector<String>();
	for(int ii=0;ii<groupList.size();ii++){
		String gName=(String)groupList.get(ii);
		if (gName.substring(0,4).equalsIgnoreCase("ALM_")){
			almGroup.add(gName);
		}
	}

	String objTreeLayout = request.getParameter("objTreeLayout");
	String objFlatLayout = request.getParameter("objFlatLayout");
	String objTreeFilter = request.getParameter("objTreeFilter");
	//logger.debug("objTreeLayout : " + objTreeLayout);
	/*
		CREATE TABLE "CUST_TREE_ROLLUP_MST"
		(
		  "ACCT_GROUP" character varying(4),
		  "TREE_TYPE" character varying(50),
		  "SUB_TYPE" character varying(3),
		  "LIBNAME" character varying(8),
		  "DATA_NAME" character varying(32),
		  "RPT_GRP_ID" character varying(9),
		  "TREE_ID" character varying(10),
		  "TREE_NAME" character varying(100),
		  "TREE_DESC" character varying(500),
		  "USERID" character varying(20),
		  "ORG_GROUP" character varying(50),
		  "LASTUPDATE" timestamp without time zone
		)
	*/
	String ACCT_GROUP = request.getParameter("ACCT_GROUP");
	String TREE_TYPE = request.getParameter("TREE_TYPE");
	String SUB_TYPE = request.getParameter("SUB_TYPE");
	String LIBNAME = "_SYS_";				//request.getParameter("LIBRARY");
	String DATA_NAME = "_SYS_";		 	//request.getParameter("DATA_NAME");
	String RPT_GRP_ID = "";					//request.getParameter("RPT_GRP_ID");
	String TREE_ID = request.getParameter("TREE_ID");
	String TREE_NAME = request.getParameter("TREE_NAME");
	String TREE_DESC = request.getParameter("TREE_DESC");
	int MAX_LEVEL = Integer.parseInt(request.getParameter("MAX_LEVEL"));
	String USERID = userID;		//ucif.getPerson().getDisplayName() + "(" + userID + ")";
	String AUTH_GROUP = almGroup.toString();
	
	logger.debug("ACCT_GROUP \t: " + ACCT_GROUP);
	logger.debug("TREE_TYPE \t: " + TREE_TYPE);
	logger.debug("SUB_TYPE \t: " + SUB_TYPE);
	logger.debug("LIBNAME \t\t: " + LIBNAME);
	logger.debug("DATA_NAME \t: " + DATA_NAME);
	logger.debug("RPT_GRP_ID \t: " + RPT_GRP_ID);
	logger.debug("TREE_ID \t\t: " + TREE_ID);
	logger.debug("TREE_NAME \t: " + TREE_NAME);
	logger.debug("TREE_DESC \t: " + TREE_DESC);
	logger.debug("USERID \t\t: " + USERID);
	logger.debug("AUTH_GROUP \t: " + AUTH_GROUP);

	UDReport UDReport=new UDReport();
	
	if (objTreeLayout == "") { 
		logger.error("objTreeLayout not passed... ");
		return;
	}
	if (TREE_ID != "" ) {
		//UDReport.updateReportInfo(TREE_ID,RPT_TYPE,ORG_GROUP,LIBRARY,DATA_NAME,treeGroup,treeName,treeDesc,userID);
		UDReport.updateReportInfo(TREE_ID,ACCT_GROUP,TREE_TYPE,SUB_TYPE,LIBNAME,DATA_NAME,RPT_GRP_ID,TREE_NAME,TREE_DESC,USERID,AUTH_GROUP,MAX_LEVEL);
		UDReport.updateReportLayout(objTreeLayout,objFlatLayout,objTreeFilter,TREE_ID);
	} else {
		TREE_ID = UDReport.insertReportLayout(objTreeLayout,objFlatLayout,objTreeFilter); 
		//UDReport.insertReportInfo(TREE_ID,RPT_TYPE,ORG_GROUP,LIBRARY,DATA_NAME,treeGroup,treeName,treeDesc,userID);
		UDReport.insertReportInfo(TREE_ID,ACCT_GROUP,TREE_TYPE,SUB_TYPE,LIBNAME,DATA_NAME,RPT_GRP_ID,TREE_NAME,TREE_DESC,USERID,AUTH_GROUP,MAX_LEVEL);
	}
/*
*/
%>
<%=TREE_ID%>
