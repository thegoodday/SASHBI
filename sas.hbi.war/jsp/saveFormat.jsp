<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java"
    import="java.io.*,
			java.net.*,
			java.sql.*,
			java.text.*,
			java.util.*,
			org.apache.log4j.*,
			org.json.*,
			com.sas.hbi.dao.Format,
			com.sas.hbi.tools.*,
			com.sas.prompts.valueprovider.dynamic.DataProvider,
			com.sas.services.session.SessionContextInterface,
			com.sas.services.user.UserContextInterface,
			com.sas.services.information.RepositoryInterface,
			com.sas.services.user.UserIdentityInterface,
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


	
	logger.debug("user ID : " + userID);
	DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");
	
	String gridData 	= request.getParameter("gridData");
	String savepath 	= request.getParameter("_savepath");
	String _sessionid 	= request.getParameter("_SESSIONID");
	logger.debug("_sessionid : " + _sessionid);
	String isNew 			= request.getParameter("isNew");
	String FMT_LABEL 	= request.getParameter("FMT_LABEL");
	String FMT_NAME 	= "";
	logger.debug("isNew : " + isNew);
	
	Format Format=new Format();
		
	if (isNew == null || isNew.equalsIgnoreCase("N")) {
		logger.debug("isNew : update" + isNew);
		Format.updateFormat(gridData,USERID,"ALMConf", "CUST_FMT_LST", savepath,dataProvider);
	} else {
		// New!!! : Save As...
		logger.debug("isNew : is New!!!" + isNew);
		FMT_NAME = Format.insertFormat(FMT_LABEL, gridData, USERID, "ALMConf", "CUST_FMT_LST", savepath,dataProvider); 
	}
	
	List<String> exceptParam = new ArrayList<String>();
	//exceptParam.add("GRIDDATA");
	
	String str_pathUrl="SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/06.Tree Rollup/01/fmt001_saveFormatAttr(StoredProcess)";
	Viewer.execSTP(ucif,str_pathUrl,exceptParam,request,response,out);
	
%>
