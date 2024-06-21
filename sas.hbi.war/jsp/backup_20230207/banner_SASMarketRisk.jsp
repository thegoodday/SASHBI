<%
String displayName = request.getParameter("displayName");
%>
	<div id="banner"><!-- 수정 -->
		<div id="topMenu"><!-- 수정 -->
			<!-- 글림 수정
			1. span 내 텍스트 a태그 안으로 이동 및 span 삭제
			2. 기타 기능 버튼 추가
			<span class="search_wrap">
				<input type="text" placeholder="검색">
				<button type="button" class="btn_search"></button>
			</span>
			<a href="javascript:;" class="alarm"><i></i>알림</a>
			-->
			<a href="javascript:linkHelp();" class="help"><i></i>도움말</a>
			<a href="javascript:confirmLogout();" class="log_off"><i></i><%=displayName %></a>
		</div>
		<div>
			<table width="100%">
				<tr>
					<td>
						<!-- 글림 수정 : span style 삭제 -->
						<span>
							SAS<sup>®</sup> Market Risk Management for Banking
							<!--img src="images/top_logo2.png" alt="KB국민은행 Analytics Platform" /-->
						</span>
					</td>
					<!-- 글림 수정 : td 삭제 -->
					<!--
					<td align=right valign=bottom>
						<span></span>
					</td>
					-->
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
<style>
#dvLogoutPannel {
	position : absolute;
	top : 51px;
	right : 0px;
	padding : 10px 30px 10px 30px;
	z-index: 9999;
	background-color:#fff;
	border: 1px solid #C3C3C3;
	box-shadow: 5px 5px 5px #DADADA;
	cursor: pointer;
	display: none;
}
</style>

