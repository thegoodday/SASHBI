<%@ page language="java" 
    import="
			org.apache.log4j.*,
			java.util.*"
%>
<%
	String contextName = application.getInitParameter("application-name");

%>
<div align=center style='padding:0px 0px 0px 0px;'>
	<table border=0 width=100% style='padding:0px 0px 0px 0px;' cellspacing="0" cellpadding="0">
		<tr style='padding:0px 0px 0px 0px;'>
			<td colspan=1 style='padding:0px 0px 0px 0px;'><img id=logo1 src="/<%=contextName%>/images/sasAnalPlat.jpg" ></td>
		</tr>
	</table>
	<p style="height:40px;"/>
	<table border=0 cellspacing=0 width="90%">
		<tr>
			<td style="padding-left:10px;padding-right:10px;background-color:#dddddd;vertical-align:middle;width:5px;">
				<img src='/<%=contextName%>/images/ico_titleType2.png' border="0"  style="padding-top:5px;">
			</td>
			<td style="font-weight:bold;padding-left:0px;background-color:#dddddd;height:30px;vertical-align:middle">
				국가별 매출현황
			</td>
			<td width=130></td>
			<td style="padding-left:10px;padding-right:10px;background-color:#dddddd;vertical-align:middle;width:5px;">
				<img src='/<%=contextName%>/images/ico_titleType2.png' border="0"  style="padding-top:5px;">
			</td>
			<td style="font-weight:bold;padding-left:0px;background-color:#dddddd;height:30px;vertical-align:middle">
				상품별 매출현황
				
			</td>
		</tr>
		<tr>
			<td style="padding-left:20px;" colspan=2><div id=dvGraph1></div></td>
			<td></td>
			<td style="padding-left:20px;" colspan=2><div id=dvGraph2></div></td>
		</tr>
	</table>
</div>
<div id=dvRes style="display:none;"></div>
<script>
if(window.console==undefined) { console={log:function(){}};}
$(document).ready(function () {
	$("#logo1").width(eval($(window).width()-0));
	$sasResHTML=execSTP("/STPRV_Demo/WebApplication/1.TEST/main2Graph","","","","");
})
function execSTP(sp_URI,tableName,colName,target,libStmt,param1,param2,param3,param4,param5){
	var param={
		_report  : sp_URI,
		_result             : "STREAMFRAGMENT",
		_action             : "form,properties,execute,nobanner,newwindow"
	}
	$.ajax({
		url: "/SASStoredProcess/do?",
		data: param,
		cache:false,
		dataType: 'html',
		async: true,
		beforeSend: function() {
			$("#progressIndicatorWIP").show();
		},
		success : function(data){           
			console.log("data load complete.....");
			$("#dvRes").html(data);
			$("#dvGraph1").html($("#dvRes .branch:eq(0)").html())
			$("#dvGraph2").html($("#dvRes .branch:eq(1)").html())
			$("#dvGraph2 p").remove();
			$("#dvGraph2 hr").remove();
			$("#progressIndicatorWIP").hide();
			console.log("graph init complete.....");
		},
		complete : function(data){  
			console.log("graph call complete...");  
		}         
	});
}      	
</script>