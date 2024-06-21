<script>
var $output1="";
function showDetail(product){
	$sasResHTML=execSTP("SBIP://METASERVER/STPRV_Demo/STPs/detailShow(StoredProcess)","","","","",product);
	$("#dvOutput2").html($sasResHTML);
	$("#dvOutput").show();
	$("#dvOutput1").show();
	$("#dvOutput2").show();
	console.log("$output1 : " + $output1);
}
</script>