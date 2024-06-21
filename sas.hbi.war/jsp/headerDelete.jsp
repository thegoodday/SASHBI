<%@ page language="java"
    import="
            com.sas.hbi.storedprocess.StoredProcessFacade,
			com.sas.services.session.SessionContextInterface,
    		com.sas.web.keys.CommonKeys,
    		org.apache.log4j.*,
			java.util.*"
%>			
<jsp:useBean id="userDefinedHeader" class="com.sas.hbi.tools.UserDefinedHeader"/>
<%
	Logger logger = Logger.getLogger("STPRV");
	String contextName = application.getInitParameter("application-name");
	String stpObjID =null;
	StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
	stpObjID=facade.getMetaID();
	logger.debug("stpObjID:"+stpObjID);
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);

	userDefinedHeader.setStpObjId(stpObjID);
	
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Insert title here</title>
</head>
<body>
<%
	try{
		userDefinedHeader.delete(sci);
%>
	<script language="JavaScript">
		alert('Table Header is deleted.');
		location.href="/<%=contextName%>/HBIServlet?sas_forwardLocation=EDIT";
	</script>
<%
	} catch(Exception e) {
		e.printStackTrace();
%>
	<script language="JavaScript">
		alert('Fail...');
		location.href="/<%=contextName%>/HBIServlet?sas_forwardLocation=EDIT";
	</script>
<%
	}
%>
</body>
</html>