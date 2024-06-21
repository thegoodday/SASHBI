<script>
<%
	String displayName = userContext.getPerson().getDisplayName();
	if(userContext.isInGroup("SalesAdmin")){
%>	
		var isSalesAdmin=<%=userContext.isInGroup("SalesAdmin")%>;
<%	
	};
%>	
		var userid = "<%=userid%>" ;
		var userEName = "<%=displayName%>" ;
</script>