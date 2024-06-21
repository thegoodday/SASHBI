<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java"
    import="java.io.*,
			java.net.*,
			java.sql.*,
			java.text.*,
			java.util.*,
			org.apache.log4j.*,
			org.json.*,
			com.sas.hbi.dao.Grid2SASData,
			com.sas.hbi.tools.*,
			com.sas.prompts.valueprovider.dynamic.DataProvider,
			com.sas.services.session.SessionContextInterface,
			com.sas.services.user.UserContextInterface,
			com.sas.services.information.RepositoryInterface,
			com.sas.services.user.UserIdentityInterface,
			com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8" %>
      
<% 
	Logger logger = Logger.getLogger("saveGrid2SASData");
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
	logger.debug("dataProvider : " + dataProvider);
	if (dataProvider == null){
		out.println("{'msg':'Session Expired... Please, Relogon on system...'}");
		return;
	/*
		String username		=(String) id.getPrincipal(); 
		String password		=(String) id.getCredential(); 	
		String hostname		= rif.getHost();
		int port 				= rif.getPort(); 		
		dataProvider = new com.sas.prompts.valueprovider.dynamic.DataProvider(hostname, port, username, password);
	*/
	}
	logger.debug("dataProvider : " + dataProvider);
	
	String gridData 	= request.getParameter("gridData");
	String _program 	= request.getParameter("_program");
	String savepath 	= request.getParameter("_savepath");
	String library 		= request.getParameter("_library");
	String tablename 	= request.getParameter("_tablename");
	
	//logger.debug("gridData : " + gridData);
	logger.debug("_program : " + _program);
	logger.debug("savepath : " + savepath);
	
	Grid2SASData gr2sas=new Grid2SASData();
		
	gr2sas.makeSASTable(gridData,USERID,library, tablename, savepath,dataProvider);
		   
	
	List<String> exceptParam = new ArrayList<String>();
	exceptParam.add("GRIDDATA");
	Viewer viewer = new Viewer(); 
	viewer.execSTP(ucif,_program,exceptParam,request,response,out);
	//Viewer.execSTP(ucif,str_pathUrl,exceptParam,request,response,out);
	//execSTP(UserContextInterface ucif,List<String> exceptParam, HttpServletRequest request,HttpServletResponse response,JspWriter out)
	
%>
