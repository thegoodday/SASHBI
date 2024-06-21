<%
String displayName = request.getParameter("displayName");
%>
	<div id="banner"><!-- 수정 -->
		<div id="topMenu"><!-- 수정 --> 
			Go <input type=text id=txtFQID value="BC00003G" size=10 />
			<a href="javascript:linkHelp();" class="help"><i></i>도움말</a>
			<a href="javascript:confirmLogout();" class="log_off"><i></i><%=displayName%></a>
		</div>
		<div>
			<table width="100%">
				<tr>
					<td>
						<span>
							SAS<sup>®</sup> Report Hub
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
$("#txtFQID").on("keyup", function(e){
	//console.log(e);
	if (e.key == "Enter") {
		var fqID = $("#txtFQID").val().toUpperCase();
		console.log("fqID", fqID);
		goSTPSubmit(fqID);
	}
});
function goSTPSubmit(fqID){
	var target = $("#rpt"+fqID).attr("target");
	var url = $("#rpt"+fqID).attr("href");
	console.log("target", target);
	console.log("url", url);
	if (url == undefined && target == undefined) {
		alertMsg("존재하지 않는 리포트 ID 입니다.");
	} else {
		$("#"+target).attr("src",url);
	}
}
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
