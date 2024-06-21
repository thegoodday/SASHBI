<%@ page language="java" 
    import="
			org.apache.log4j.*,
			java.util.*"
%>
<%
	Logger logger = Logger.getLogger("SASBITreeViewer");
	logger.info("TEST");
%>
<div >
	<table>
		<tr>
			<td colspan=2><img id=logo1 src="/SASBITreeViewer/images/portlet_welcome.png" ></td>
		</tr>
		<tr>
			<td><div id=dvGraph1></div></td>
			<td><div id=dvGraph2></div></td>
		</tr>
	</table>
</div>
<div id=dvRes style="display:none;"></div>
<script>
if(window.console==undefined) { console={log:function(){}};}
$(document).ready(function () {
	$("#logo1").width(eval($(window).width()-25));
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
		}                    
	});
}      	
</script>