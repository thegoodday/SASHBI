<div id="sasGrid" style="display:none;overflow-x: auto;overflow-y: auto;"></div>

<script>
$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-50));
$("#sasGrid").width(eval($(window).width()-11));
$(window).resize(function() {
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-50));
	$("#sasGrid").width(eval($(window).width()-11));
	$(".slick-viewport").height(eval($("#sasGrid").height()-23));
});	
var data = [];
var columns =[];
var options =[];
function setPVT(data){
	$("#sasGrid").show();
	var sasJsonRes=data[0];
	TableInfo=sasJsonRes["TableInfo"];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	data = sasJsonRes["SASResult"];
	console.log("SASResult: \n" + JSON.stringify(data));
	console.log("TableInfo: \n" + JSON.stringify(TableInfo));
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	$("#sasGrid").show();
	$("#sasGrid").pivot(data,TableInfo);
}
</script>  
 