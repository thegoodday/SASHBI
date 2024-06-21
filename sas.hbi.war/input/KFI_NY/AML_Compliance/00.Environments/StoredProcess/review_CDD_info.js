$(document).ready(function () {
	$("#progressIndicatorWIP").hide();
	
	$("#condShowHide").attr('class','ui-accordion-header-icon ui-icon ui-icon-circle-arrow-s');
	$("#dvCondTable").hide();
	$("#condBottomMargin").height("0");
	$("#dvCondi").css('padding-bottom','0');
	$("#progressIndicatorWIP").hide();
	
/* 탭처리 */
	$.urlParam = function(name){
		var results = new RegExp('[\?&]'+name+'=([^&#]*)').exec(window.location.href);
		if(results==null){
			return null;
		}else{
			return results[1] || 0;
		}
	}

  var hrefStr = $(location).attr('href').toUpperCase();
  console.log("hrefStr : " + hrefStr);

	var tab1Class = "";
	var tab2Class = "";
	var tab3Class = "";
	var tab4Class = "";
	
  if(hrefStr.indexOf('REVIEW_CIP_INFO') != -1){
  	tab1Class = " ui-tabs-active ui-state-active";
  }else if(hrefStr.indexOf('REVIEW_CRRM_INFO') != -1){
  	tab2Class = " ui-tabs-active ui-state-active";
  }else if(hrefStr.indexOf('REVIEW_CDD_INFO') != -1){
  	tab3Class = " ui-tabs-active ui-state-active";
  }else if(hrefStr.indexOf('REVIEW_EDD_INFO') != -1){
  	tab4Class = " ui-tabs-active ui-state-active";
  }
  
  console.log("CDD_KEY : " + $.urlParam('CDD_KEY'));
  console.log("INIT_RR : " + $.urlParam('INIT_RR'));
  
	var strTag = '<div id="tabs" class="ui-tabs ui-widget ui-widget-content ui-corner-all">';
	strTag += '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">';
	strTag += '<li class="ui-state-default ui-corner-top '+tab1Class+'" role="tab" tabindex="-1" aria-controls="AA00008Y" aria-labelledby="ui-id-1" aria-selected="false"><a href="/SASHBI/HBIServlet?sp_pathUrl=SBIP%3A%2F%2FMETASERVER%2FKFI_NY%2FAML+Compliance%2F00.Environments%2FStoredProcess%2Freview_CIP_info%28StoredProcess%29&sas_forwardLocation=reportViewer&reportURI=fromExpK&CDD_KEY='+$.urlParam('CDD_KEY')+'&INIT_RR='+$.urlParam('INIT_RR')+'" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-1"><b>CIP Info</b></a></li>';
	strTag += '<li class="ui-state-default ui-corner-top '+tab2Class+'" role="tab" tabindex="-1" aria-controls="AA00008T" aria-labelledby="ui-id-2" aria-selected="false"><a href="/SASHBI/HBIServlet?sp_pathUrl=SBIP%3A%2F%2FMETASERVER%2FKFI_NY%2FAML+Compliance%2F00.Environments%2FStoredProcess%2Freview_CRRM_info%28StoredProcess%29&sas_forwardLocation=reportViewer&reportURI=fromExpK&CDD_KEY='+$.urlParam('CDD_KEY')+'&INIT_RR='+$.urlParam('INIT_RR')+'" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-2"><b>CRRM Info</b></a></li>';
	strTag += '<li class="ui-state-default ui-corner-top '+tab3Class+'" role="tab" tabindex="-1" aria-controls="AA00008T" aria-labelledby="ui-id-3" aria-selected="false"><a href="/SASHBI/HBIServlet?sp_pathUrl=SBIP%3A%2F%2FMETASERVER%2FKFI_NY%2FAML+Compliance%2F00.Environments%2FStoredProcess%2Freview_CDD_info%28StoredProcess%29&sas_forwardLocation=reportViewer&reportURI=fromExpK&CDD_KEY='+$.urlParam('CDD_KEY')+'&INIT_RR='+$.urlParam('INIT_RR')+'" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-3"><b>CDD Info</b></a></li>';
	if($.urlParam('INIT_RR') == "H") {
		strTag += '<li class="ui-state-default ui-corner-top '+tab4Class+'" role="tab" tabindex="-1" aria-controls="AA0000A2" aria-labelledby="ui-id-4" aria-selected="false"><a href="/SASHBI/HBIServlet?sp_pathUrl=SBIP%3A%2F%2FMETASERVER%2FKFI_NY%2FAML+Compliance%2F00.Environments%2FStoredProcess%2Freview_EDD_info%28StoredProcess%29&sas_forwardLocation=reportViewer&reportURI=fromExpK&CDD_KEY='+$.urlParam('CDD_KEY')+'&INIT_RR='+$.urlParam('INIT_RR')+'" class="ui-tabs-anchor" role="presentation" tabindex="-1" id="ui-id-4"><b>EDD Info</b></a></li>';
	}
	strTag += '</ul>';
	strTag += '</div>';
		
	$("#dvCondi").before(strTag);
/* 탭처리 ///// */
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
	//$('#dvColumnHeader').hide();

	$("#dvData").css("overflow","auto");

	$("hr").remove();
	$("p").remove();
	
	$('#btnExcel').show();
	$("#btnRun").prop("disabled",false);	
	
	$('#btnExcel').show();
	$("#btnRun").prop("disabled",false);	
	
	$("#dvRes td").removeClass("c");
	$("#dvRes td").addClass("l");
	$("#dvRes div").removeAttr("align");
	
	$("br").remove();
}	// End of submitSTP();

