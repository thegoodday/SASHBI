<%@ page language="java" 
    import="com.sas.hbi.tools.Stub,
			org.apache.log4j.*,
			java.util.*"
%>
<div >
	Hello!!!!!!
</div>
<script>
	$("#logo1").width($(window).width()-3);
</script>
<%
	Logger logger = Logger.getLogger("SASBITreeViewer");
	logger.info("TEST");
%>