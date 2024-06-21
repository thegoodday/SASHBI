<%
String displayName = request.getParameter("displayName");
%>
	<div id="banner"><!-- 수정 -->
		<div id="topMenu"><!-- 수정 -->
			<a href="javascript:linkHelp();" class="help"><i></i>도움말</a>
			<a href="javascript:confirmLogout();" class="log_off"><i></i><%=displayName%></a>
		</div>
		<div>
			<table width="100%">
				<tr>
					<td>
						<span>
							KB Global AML Management System 
						</span>
					</td>
				</tr>
			</table>		
		</div>
	</div> 
	<div id=dvLogoutPannel onClick="logoutHBI();">
		로그아웃 
	</div>
<script>
function linkHelp(){
	window.open("http://support.sas.com/software/products/rmb/index.html#s1=1");
}
function confirmLogout(){
	$("#dvLogoutPannel").show();
}	
function logoutHBI(){
	window.location.href="/SASHBI/Logoff";
}
$(document).ready(function () {
	$(window.document).bind( "click", function() {
		$("#dvLogoutPannel").hide();
	});
});
</script>
