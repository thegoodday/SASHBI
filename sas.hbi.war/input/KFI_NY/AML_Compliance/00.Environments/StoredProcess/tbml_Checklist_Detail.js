$(document).ready(function () {
	$("#progressIndicatorWIP").hide();
	
	$("#condShowHide").attr('class','ui-accordion-header-icon ui-icon ui-icon-circle-arrow-s');
	$("#dvCondTable").hide();
	$("#condBottomMargin").height("0");
	$("#dvCondi").css('padding-bottom','0');
	$("#progressIndicatorWIP").hide();
});

function submitSTP(){
	$("#btnRun").prop("disabled",true);	
	console.log("Start submitSTP");
	var isSltNull =0;
	$("#dvCondi select").each(function(){
		var cur_val=$(this).val();
		console.log("select cur_val : " + cur_val);
		if (cur_val == null){
			//alert("��ȸ������ Ȯ���Ͻð� �����Ͽ� �ֽñ� �ٶ��ϴ�.");
			isSltNull++;
		}
	});
	if (isSltNull > 0) {
		alertMsg("��ȸ������ �ʱ�ȭ ���Դϴ�. <br> �ٽ� �����Ͽ� �ֽñ� �ٶ��ϴ�.");	
		$("#btnRun").prop("disabled",false);	
		return;
	}


	$("#dvSASLog").html("");
	$("#dvOutput").show();
	//$("#dvOutput").hide();
	$("#dvGraph1").hide();	
	$("#dvBox").hide();
	$("#dvRowHeader").hide();
	$("#dvData").hide();
	$("#dvTitle").html("");
	$("#dvBox").html("");
	$("#dvRowHeader").html("");
	$("#dvData").html("");
	$("#dvRes").html("");
	$("#dvPagePanel").html("");
	$("#dvDummy").html("");
	$("#dvRes").hide();
	$("#dvDummy").hide();
	$("#dvPagePanel").hide();
	$("#progressIndicatorWIP").show();
	isDisplayProgress=1;
	//setTimeout("getMain()",1000*1);
	console.log("getMain tbml_checklist_detail.js");
	getMain();
	$('#dvColumnHeader').hide();

	$("#dvData").css("overflow","auto");

	$("hr").remove();
	$("p").remove();
	
	$('#btnExcel').show();
	$("#btnRun").prop("disabled",false);	
}	// End of submitSTP();

