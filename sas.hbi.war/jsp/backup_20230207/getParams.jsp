<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java"
    import="java.io.*,
			java.util.*,
			org.apache.log4j.*,
			com.sas.hbi.storedprocess.StoredProcessFacade2,
			com.sas.prompts.valueprovider.dynamic.DataProvider,
			com.sas.services.session.SessionContextInterface,
			com.sas.services.user.UserContextInterface,
			com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8" %>
      
<% 
	response.setCharacterEncoding("EUC-KR");
	Logger logger = Logger.getLogger("getParams");
	logger.setLevel(Level.DEBUG);
	String contextName = application.getInitParameter("application-name");

	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif   = sci.getUserContext();

	String str_pathUrl="SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)";
	
	DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");

	List<String> exceptParam = new ArrayList<String>();
	exceptParam.add("GRIDDATA");
	//Viewer.execSTP(ucif,str_pathUrl,exceptParam,request,response,out);
	StoredProcessFacade2 facade2 = new StoredProcessFacade2(request);
	facade2.execStoredProcess(request, response, str_pathUrl, exceptParam);
	
%>
