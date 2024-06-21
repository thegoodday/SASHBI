<%@ page language="java"
    import="com.sas.services.session.SessionContextInterface,
            com.sas.hbi.storedprocess.StoredProcessFacade,
    		com.sas.web.keys.CommonKeys,
    		org.apache.log4j.*,
			java.util.*"
%>			
		

<jsp:useBean id="userDefinedHeader" class="com.sas.hbi.tools.UserDefinedHeader"/>
<jsp:useBean id="Stub" class="com.sas.hbi.tools.Stub"/>
<%
	Logger logger = Logger.getLogger("STPRV");
	String contextName = application.getInitParameter("application-name");
	String stpObjID =null;
	StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
	stpObjID=facade.getMetaID();
	logger.debug("stpObjID:"+stpObjID);
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);

	//String headerHtmlCode = new String(request.getParameter("headerHtmlCode").getBytes("8859_1"),"KSC5601");
	String headerHtmlCode = request.getParameter("headerHtmlCode");
	System.out.println("headerHtmlCode : "+headerHtmlCode);
	//headerHtmlCode="<table><?table>";
	
	headerHtmlCode=Stub.compBlank(headerHtmlCode);
	userDefinedHeader.setStpObjId(stpObjID);
	userDefinedHeader.setUserDefinedHeader(headerHtmlCode);
	
%>

<!DOCTYPE HTML>
<html>
<head>
<title>Insert title here</title>
</head>
<body>
<pre>
<%=headerHtmlCode%>
</pre>
<%
	try{
		userDefinedHeader.save(sci);
%>
	<script language="JavaScript">
        alert('Header is Saved.');
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