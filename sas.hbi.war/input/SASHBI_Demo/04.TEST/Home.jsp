<%@ page language="java" 
    import="
			org.apache.log4j.*,
			java.util.*"
%>
<%
	Logger logger = Logger.getLogger("Home.jsp");
	logger.info("TEST");
%>
<div id=dvFrame align=center style='padding:0px 0px 0px 0px;background-color:blue;'>
test
</div>
<script>
$("#dvFrame").height($(window).height()-100);
</script>
