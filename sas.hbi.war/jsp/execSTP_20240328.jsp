 
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType= "text/html; charset=EUC-KR" %>
<%@ page language="java"
    import="java.io.*,
			java.util.*,
			org.apache.log4j.*,
			com.sas.hbi.storedprocess.StoredProcessConnection,
			com.sas.hbi.storedprocess.StoredProcessFacade,
			com.sas.prompts.valueprovider.dynamic.DataProvider,		
			com.sas.services.session.SessionContextInterface,
			com.sas.services.storedprocess.Execution2Interface,
			com.sas.services.storedprocess.ExecutionBaseInterface,
			com.sas.services.storedprocess.StoredProcess2Interface,
			com.sas.services.user.UserContextInterface,
			com.sas.web.keys.CommonKeys"
%>
      
<% 
	response.setCharacterEncoding("EUC-KR");
	Logger logger = Logger.getLogger("execSTP");
	logger.setLevel(Level.DEBUG); 
	
	StoredProcessFacade facade=(StoredProcessFacade)session.getAttribute("sas_StoredProcessFacade_HBI");
	Map params = facade.getStoredProcessParametersFromRequest(request);
	
	Set paramKey = params.keySet();
	Iterator itr = params.keySet().iterator();
	while (itr.hasNext()) {
		String key = (String)itr.next();
		String[] value = (String[])params.get(key);
		logger.debug(key + " : " + value[0]);
	}
	facade.setParameterValues(params);

	StoredProcess2Interface stp2 = facade.getStoredProcess();
	List seid = (List)stp2.getParameterValue("_sessionid");
	List re = (List)stp2.getParameterValue("_replay");
	List th = (List)stp2.getParameterValue("_thissession");
	//logger.debug("_sessionid : " + seid.toString());
	//logger.debug("_replay : " + re.toString());
	//logger.debug("_thissession : " + th.toString());

	Execution2Interface executionObject = facade.executeStoredProcess(session,response,null);
	facade.writeStreamingResults(response.getOutputStream(), executionObject);
	
%>
