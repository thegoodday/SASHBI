$(document).ready(function () {
	//alert('한글');
	//$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid1();'>");
	//$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid1();'>");
	//$("#dvToolBar").show();
});
function resizeGrid(){
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
}
setTimeout('resizeGrid();',500*1);
$(window).resize(function() {
	resizeGrid();
});
var sgGrid;	

function setCellColor(){
	//$(".colorVH").parent().addClass("colorYELLOWP");
	//$(".colorVH").parent().css("background-color","#FF0000");
	//$(".colorH").parent().css("background-color","#FF8080");
	$(".colorVH").parent().css("color","#FF0000");
	$(".colorH").parent().css("color","#FF8080");
	$(".colorM").parent().css("color","#000000");
	$(".colorL").parent().css("color","#000000");
}

function setArr(base,keep_var){
	var new_data = new Array();
	for (var ii in base){
		var row = new Object();
		new_data.push(row);
		//console.log( base[ii].CRR_SCORE_KEY);
		for (var col in keep_var){
			new_data[ii][keep_var[col]] = base[ii][keep_var[col]] ;
		}
	}
	return new_data;
}

function setSlickGrid(data){
	
	var str='<input type="button" id="btnRun1" class="condBtn" value=" ADD List" onclick="showPopup(\'ADD\');">';
	str += '<input type="button" id="btnRun2" class="condBtn" value=" DELETE List" onclick="showPopup(\'DEL\');">';
	str += '<input type="button" id="btnRun3" class="condBtn" value=" CHANGE List" onclick="showPopup(\'CHG\');">';
	
	$("#dvToolBar").html(str);	
	
	console.log("setSlickGrid :\n" );

	$("#sasGrid").show();
	var dataView = new Slick.Data.DataView();
	
	//var sasJsonRes=eval (data)[0];
	var sasJsonRes=data[0];
	
	var columns =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	var options=sasJsonRes["Options"][0];

	var isChk=options.chkBox;
	if (isChk){
		columns.push(checkboxSelector.getColumnDefinition());
		columns=$.extend(sasJsonRes["ColumInfo"],columns);;
	}
	columns=sasJsonRes["ColumInfo"];
	for(var ii in columns){
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	//columns[5].formatter=eval("RiskFommater");
	//columns[5].editor=eval("RiskEditor");	

	//console.log("columns");
	//console.log(columns);
	//console.log("columns");
	//console.log("columns \n" + JSON.stringify(columns));  
	//console.log("options \n" + JSON.stringify(options));
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML=data;

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log("sgData");
	console.log(sgData);
	//dataView.setItems(sgData);	
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		//console.log("onRowCountChanged : " + args.rows);
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		//console.log("onRowsChanged : " + args.rows);
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid.onDblClick.subscribe(function(e, args) {

		//showPopup();
/*
		AML_URL="http://kboamldev.kbstar.com:7980/SASComplianceSolutionsMid/#/cases/"+case_id;
		window.open(AML_URL,'AML');//,'scrollbars=yes,menubar=no,toolbar=no,resizable=yes,width=1150,height=800,left=0,top=0');
*/
	});		
	sgGrid.onCellChange.subscribe(function(e, args) {
		setTimeout("setCellColor();",100*1);
	});	
	sgGrid.onMouseEnter.subscribe(function(e, args) {
		//setCellColor();
	});	
	sgGrid.onMouseLeave.subscribe(function(e, args) {
		//setCellColor();
	});		
	sgGrid.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
		setCellColor();
	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		console.log("item : ")
		console.log(item)
		$.extend(item, args.item);
		dataView.addItem(item);		
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}
function fnDeleteGrid1(){
	var selectedIndexes = sgGrid.getSelectedRows().sort().reverse();
	sgGrid.setSelectedRows([]);
	sgData=sgGrid.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgGrid.getData().getItem(value); 
		if (item) sgGrid.getData().deleteItem(item.id); 
	});
	sgGrid.invalidate();
	sgGrid.render();
}
function fnSaveGrid1(){
	var isSave = confirmMsg("Are you sure you want to save?","fnConfirmSaveGrid1");	
}
function fnConfirmSaveGrid1(){
	if (!sgGrid.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid.getData().getItems();
	console.log('data');
	console.log(data);
	
	var keep_var=['CRR_SCORE_KEY','RISK','RISK_SCORE','CHANGE_CURRENT_IND'];
	var send_data = setArr(data,keep_var);
	console.log('send_data');
	console.log(send_data);
	
	var gridData=JSON.stringify(send_data);	
	console.log(gridData);
	tParams['_savepath']=save_path;
	tParams['gridData']=gridData;
	tParams['_library']="stp_temp";
	tParams['_tablename']="fsb_crr_institution_score";
	tParams['_program']="SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0206_Institution_saveRiskScore(StoredProcess)";
	console.log("gridData : ");
	console.log(gridData);
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSaveResult","json"); 
	$('#dvModalWin').hide();
}
function fnSaveResult(data){
	//alertMsg(data.MSG);
	setTimeout('submitSTP();',500*1);
	if (data.MSG == "Successfully saved...") {
		//alertMsg("성공적으로 저장되었습니다.");
		alertMsg("Sucessfully Saved.");
	}
	console.log("save_path : " + save_path);
}

function showPopup(str){
	
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalWin").css("width","1500px");

	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/3));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-200)/4));
	$('#dvModalWin').show();
	//$("#matGridWrap").width($("#tbInfo").width());
	console.log("-----------------");
	console.log($("#sltp_base_date_start").val());
	console.log($("#sltp_base_date_end").val());
	
	if(str == "ADD"){
		$("#popupTitleStr").text("ADD List");
	}else if(str == "DEL"){
		$("#popupTitleStr").text("DELETE List");
	}else if(str == "CHG"){
		$("#popupTitleStr").text("CHANGE List");
	}
		
	tParams=eval('[{}]');
	tParams['ACTION']=str;
	tParams['FROM_DATE']=$("#sltp_base_date_start").val();
	tParams['TO_DATE']=$("#sltp_base_date_end").val();
		
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/Watch_List_Result(StoredProcess)",'setResultGrid');
}

function setResultGrid(data){
	console.log(data);
	
	$("#matGrid").show();
	var dataView = new Slick.Data.DataView();
console.log("dataView===");
console.log("data : " + JSON.stringify(data));
	//var sasJsonRes=eval (data)[0];
	var sasJsonRes=data[0];
	//console.log(sasJsonRes );
	
	var columns =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	
	var options=sasJsonRes["Options"][0];
	//console.log("Options : " + JSON.stringify(options));

//	sasJsonRes["ColumInfo"][0].cssClass="grid_cell_hidden";
//	sasJsonRes["ColumInfo"][0].headerCssClass="grid_cell_hidden";
	
	columns=sasJsonRes["ColumInfo"];
	for(var ii in columns){
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	//console.log("colums : " + JSON.stringify(columns));
	console.log("colums.length : " + columns.length);

/*
	if (columns.length > 8) columns[8].editor=eval("frontChkEditor");	
	if (columns.length > 9) columns[9].editor=eval("lvl1ChkEditor");	
	if (columns.length > 10) columns[10].editor=eval("lvl2ChkEditor");	
*/

	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	
/*
	console.log("sgData");
	console.log(sgData);
	console.log("sgData.length : " + sgData.length);
	
	if(sgData.length > 0){
		approvalKey = sgData[0].approval_key;
	}else{
		approvalKey = 0;
	}

	if ((approvalKey == "1" || approvalKey == "0" || approvalKey == "") && columns.length > 11) columns[11].editor=eval("YesNoSelectEditor");	
	if ((approvalKey == "10" || approvalKey == "11") && columns.length > 12) columns[12].editor=eval("YesNoSelectEditor");	
	if ((approvalKey == "20" || approvalKey == "21") && columns.length > 13) columns[13].editor=eval("YesNoSelectEditor");	

	if(parseInt(approvalKey) >= 20){
		
		var lvl2Data = sgData;
		console.log(lvl2Data);
		var isLvl2=0;
		for (var ii in lvl2Data){
			if (lvl2Data[ii].lvl2CHK) isLvl2++;
		}
		console.log("isLvl2 : " + isLvl2);

    if (isLvl2 == 0) {
    	console.log("0000005");
    	$("#dvCompliance").hide();
    } else if(isLvl2 > 0){
    	console.log("0000006");
    	$("#dvCompliance").show();
    	$("#lev2Tr").show();
    }
    
	}
*/
	
	mrGrid = new Slick.Grid("#matGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {

		console.log("onRowCountChanged");
		mrGrid.updateRowCount();
		mrGrid.render();

	});
	dataView.onRowsChanged.subscribe(function (e, args) {
/*
		console.log("onRowsChanged");
		mrGrid.invalidateRows(args.rows);
		mrGrid.render();
*/
	});
	mrGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	mrGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	mrGrid.onCellChange.subscribe(function(e, args) {

		//Front Check, Level1 Check, Level2 Check 변경 시점에 저장???
		//console.log("mrGrid.onCellChange!! : " + JSON.stringify(args));
		//console.log("args[item].SEQ_NO : " + args["item"].SEQ_NO);
		//console.log("args[item].frontCHK : " + args["item"].frontCHK);
		//console.log("args[item].grp_level : " + args["item"].grp_level);
		//console.log("args[item].lvl1CHK : " + args["item"].lvl1CHK);
		//console.log("args[item].lvl2CHK : " + args["item"].lvl2CHK);
		//console.log("gsngno : " + gsngno);
/*
		var form = $("#fomUpload")[0];
		var updata = new FormData(form);
		
		console.log("updata : " + JSON.stringify(updata));
		console.log("args['item'] : " + JSON.stringify(args["item"]));

		updata.append("customerID",$("#customerID").html());
		
		updata.append("grp_level",args["item"].grp_level);
		updata.append("seqno",args["item"].SEQ_NO);
		updata.append("gsngno",gsngno);
		
		
	if ((approvalKey == "1" || approvalKey == "0" || approvalKey == "") && columns.length > 11) columns[11].editor=eval("YesNoSelectEditor");	
	if ((approvalKey == "10" || approvalKey == "11") && columns.length > 12) columns[12].editor=eval("YesNoSelectEditor");	
	if ((approvalKey == "20" || approvalKey == "21") && columns.length > 13) columns[13].editor=eval("YesNoSelectEditor");	
	
	
		var frntChkStr = "N";
		if(args["item"].frontCHK != "" && args["item"].frontCHK == "True Hit"){frntChkStr = "Y";
		}else if(args["item"].frontCHK != "" && args["item"].frontCHK == "False Hit"){frntChkStr = "N";}
		updata.append("frontchk",frntChkStr);
		
		var lvl1ChkStr = "N";
		if(parseInt(approvalKey) >= 10 && args["item"].lvl1CHK != "" && args["item"].lvl1CHK == "True Hit"){lvl1ChkStr = "Y";
		}else if(parseInt(approvalKey) >= 10 && args["item"].lvl1CHK != "" && args["item"].lvl1CHK == "False Hit"){lvl1ChkStr = "N";}
		updata.append("lvl1chk",lvl1ChkStr);
		
		var lvl2ChkStr = "N";
		if(parseInt(approvalKey) >= 20 && args["item"].lvl2CHK != "" && args["item"].lvl2CHK == "True Hit"){
			lvl2ChkStr = "Y";
			console.log("0000007");
			$("#dvCompliance").show();
			$("#lev2Tr").show();
		}else if(parseInt(approvalKey) >= 20 && args["item"].lvl2CHK != "" && args["item"].lvl2CHK == "False Hit"){
			lvl2ChkStr = "N";
			console.log("0000008");
			$("#dvCompliance").show();
			$("#lev2Tr").hide();
		}
		updata.append("lvl2chk",lvl2ChkStr);
		
		console.log("args['item'].frontCHK : " + args["item"].frontCHK);
		console.log("args['item'].lvl1CHK : " + args["item"].lvl1CHK);
		console.log("args['item'].lvl2CHK : " + args["item"].lvl2CHK);
		
		updata.append("prssType","check");	// 체크박스 선택인지 save 버튼 클릭인지여부
		
		//console.log("updata Result : " + updata.get("frontchk"));

		
		$.ajax({
			enctype: 'multipart/form-data',
			type: "post",
			url: "/SASStoredProcess/do",
			_program : 'SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0301_save(StoredProcess)',
			dataType: 'json',
			data: updata,
			processData: false,
			contentType: false,
			cache: false,
			timeout: 600000,
			success : function(data){
				$("#btnSave").prop("disabled",false);
				console.log("execSTPA success" );
				//console.log(data);
				//fnSaveResult(data);
			},
			complete: function(data){
				//data.responseText;	
				isRun=0;
				tParams=eval('[{}]');
				//$("#progressIndicatorWIP").hide();
			},
			error : function(xhr, status, error) {
				console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
				alert(error);
			}			
		});
*/
	});	
	mrGrid.onSort.subscribe(function (e, args) {
/*
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
		setCellColor();
*/
	});
	dataView.beginUpdate();
	dataView.setItems(sgData);
	dataView.endUpdate();	
/*
	//$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();

	var isLvl2=0;
	for (var ii in sgData){
		console.log("sgData[ii].lvl2CHK : " + sgData[ii].lvl2CHK);
		if (sgData[ii].lvl2CHK) isLvl2++;
	}

	console.log("approvalkey $$$$$ : " + approvalKey);
	console.log("isLvl2 $$$$$ : " + isLvl2);

   if (isLvl2 == 0) {
   	console.log("0000009");
		$("#dvCompliance").hide();
   } else if(isLvl2 > 0){
   	console.log("0000010");
			$("#dvCompliance").show();
			$("#lev2Tr").show();
			console.log("sgData[0].l2_result_detail : " + sgData[0].l2_result_detail);
			console.log("sgData[0].att_file_name : " + sgData[0].att_file_name);
			
			var attFileName = "";
			
			if(sgData[0].att_file_name != ""){
			 	var tmpArr = sgData[0].att_file_name.split("_");
			 	for (var i in tmpArr) {
					if(i > 2){
						if(i == 2){
							attFileName = tmpArr[i];
						}else{
							if(attFileName == ""){
								attFileName = tmpArr[i];
						}else{
								attFileName = attFileName + "_" + tmpArr[i];
							}
						}
					}
			 	}
			
				var downBtn = '<input type="button" id="attDownBtn" class="condBtn" value="Download" onclick="fnAttDown(\''+sgData[0].att_file_name+'\');">';
				$("#downFileSpan").html(attFileName + downBtn);
			}
			
			$("#txtLvl2Detail").val(sgData[0].l2_result_detail);
   }
   
   console.log("approvalKey : " + approvalKey);

   if(parseInt(approvalKey) >= 20){
   	console.log("0000011");
		$("#dvCompliance").show();
		if(isLvl2 > 0){
			$("#lev2Tr").show();
		}
	}else{
		console.log("0000012");
		$("#dvCompliance").hide();
	}
*/
}