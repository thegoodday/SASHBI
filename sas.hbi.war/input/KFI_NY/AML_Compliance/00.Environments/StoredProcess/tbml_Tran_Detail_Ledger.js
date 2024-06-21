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
			//alert("조회조건을 확인하시고 실행하여 주시기 바랍니다.");
			isSltNull++;
		}
	});
	if (isSltNull > 0) {
		alertMsg("조회조건이 초기화 중입니다. <br> 다시 실행하여 주시기 바랍니다.");	
		$("#btnRun").prop("disabled",false);	
		return;
	}


	$("#dvSASLog").html("");
	$("#dvOutput").show();
	//$("#dvOutput").hide();
	$("#dvGraph1").hide();	
	$("#dvBox").hide();
	$("#dvColumnHeader").hide();
	$("#dvRowHeader").hide();
	$("#dvData").hide();
	$("#dvTitle").html("");
	$("#dvBox").html("");
	$("#dvColumnHeader").html("");
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
	
//	$('.table thead').hide();

	$('br').remove();
	
	$('.table thead th').each(function() {
		console.log($(this).text());
		if(
			$(this).text() == 'COLUM1' ||
			$(this).text() == 'COLUM2' ||
			$(this).text() == 'COLUM3' ||
			$(this).text() == 'VALUE1' ||
			$(this).text() == 'VALUE2' ||
			$(this).text() == 'VALUE3' ||
			$(this).text() == 'LABEL OF FORMER VARIABLE' ||
			$(this).text() == 'VALUE' ){
				$(this).parents('thead').remove();
			}
	});
	
}	// End of submitSTP();

