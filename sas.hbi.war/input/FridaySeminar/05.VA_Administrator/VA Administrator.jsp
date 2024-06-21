<%@ page language="java" 
    import="com.sas.hbi.tools.Stub,
			org.apache.log4j.*,
			java.util.*"
%>
	<iframe id=frmVAAdmin src="/SASVisualAnalyticsAdministrator/\SAS_AdminClient_swf/SAS_VisualAnalytics_Administrator_noApp.jsp" border=0 width="100%" height="100%">
	</iframe>
	<script>
$("#frmVAAdmin").height($(window).height());		
$(window).resize(function () {
	$("#frmVAAdmin").height($(window).height());		
})
	</script>
