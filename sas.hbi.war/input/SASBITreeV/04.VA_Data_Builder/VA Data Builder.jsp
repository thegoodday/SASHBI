<%@ page language="java" 
    import="com.sas.hbi.tools.Stub,
			org.apache.log4j.*,
			java.util.*"
%>
	<iframe id=frmVADataBulider src="/SASVisualDataBuilder/VisualDataBuilder_swf/VisualDataBuilder_noApp.jsp" border=0 width="100%" height="100%">
	</iframe>
	<script>
$("#frmVADataBulider").height($(window).height());		
$(window).resize(function () {
	$("#frmVADataBulider").height($(window).height());		
})
	</script>
