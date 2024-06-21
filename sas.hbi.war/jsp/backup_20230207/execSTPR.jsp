<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java"
    import="java.io.*,
			java.util.*,
			org.apache.log4j.*,
			com.sas.hbi.storedprocess.StoredProcessFacade,
			com.sas.prompts.valueprovider.dynamic.DataProvider,
			com.sas.services.session.SessionContextInterface,
			com.sas.services.user.UserContextInterface,
			com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8" %>
      
<% 
	response.setCharacterEncoding("utf-8");
	Logger logger = Logger.getLogger("execSTP2");
	logger.setLevel(Level.DEBUG);

	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif   = sci.getUserContext();

	String str_pathUrl =(String)request.getParameter("_program");

	DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");

	List<String> exceptParam = new ArrayList<String>();
	exceptParam.add("GRIDDATA");

	StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
%>
