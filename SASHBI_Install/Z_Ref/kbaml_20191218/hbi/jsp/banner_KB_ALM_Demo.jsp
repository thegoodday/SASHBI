<%
String displayName = request.getParameter("displayName");
%>
<div id="banner"><!-- 수정 -->
	<div id="topMenu"><!-- 수정 -->
		<span><%=displayName %></span>
		<a href="/SASHBI/Logoff">Log Off</a>
	</div>
	<div>
		<table width="100%">
			<tr>
				<td>
					<span><img src="images/top_logo.png" alt="KB국민은행 Analytics Platform" /></span>
				</td>
				<td align=right valign=bottom>
					<!--img src="images/logo.gif" width="62" height="24" border="0" alt=""-->
					<span></span>
				</td>
			</tr>
		</table>		
	</div>
</div> 
