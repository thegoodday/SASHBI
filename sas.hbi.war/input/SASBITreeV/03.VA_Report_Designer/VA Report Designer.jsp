<%@ page language="java" 
    import="com.sas.hbi.tools.Stub,
			org.apache.log4j.*,
			java.util.*"
%>
	<iframe id=frmVA src="http://koryhh5.apac.sas.com/SASVisualAnalyticsDesigner/VisualAnalyticsDesigner_noApp.jsp" border=0 width="100%" height="100%">
	</iframe>
	<script>
$("#frmVA").height($(window).height());		
$(window).resize(function () {
	$("#frmVA").height($(window).height());		
})
	</script>
