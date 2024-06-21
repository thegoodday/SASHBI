$(document).ready(function () {
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc002_getCurrencyCurveMapList(StoredProcess)","renderGR1");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc002_getCurrencyCurveListContext(StoredProcess)","initCurrencyContextMenu","","");				
	$("#dvMain").height(eval($(window).height()-58));
	$("#dvList").height(eval($(window).height()-222));
	$(".buttonArea").append("<input type='button' id='btnRun' class=condBtnSearch value='Modify' onclick='manageSetList();'>");
});
$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-158));
	$("#dvList").height(eval($(window).height()-258));
	//$("#dvColumnAttr").height(eval($(window).height()-358));
});
var curGR1ID;
var gridGR1;
var dataGR1 = [];
var optionsGR1;
var columnsGR1;
var curRowGR1;

var curGR2ID;
var gridGR2;
var dataGR2 = [];
var optionsGR2;
var columnsGR2;
var curRowGR2;

var curCRRC_SET_ID;

function initCurrencyContextMenu(data){
	var sasJsonRes=eval(data)[0];
	var cxtList = sasJsonRes["SASResult"];
	console.log("cxtList: " +cxtList);
	var ctxMenuStr="";
	for(var ii=0;ii<cxtList.length;ii++){
		var CRRC_ID=cxtList[ii].CRRC_ID;
		var CRRC_NAME=cxtList[ii].CRRC_NAME;
		ctxMenuStr+="<li data='" + CRRC_ID + "'>" + CRRC_NAME +"</li>";
	}
	$("#contextMenu").html(ctxMenuStr);
}
function manageSetList(){
	$("#dvModalSetList").css("left",eval(eval($(window).width()-$("#dvModalSetList").width()-40)/2));
	$("#dvModalSetList").css("top",eval(eval($(window).height()-$("#dvModalSetList").height()-60)/2));	
	$("#dvModalSetList").show();
}
function renderGR1(data){
	var sasJsonRes=eval(data)[0];
	dataGR1		=[];
	columnsGR1 =[];
	/*
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	columnsGR1.push(checkboxSelector.getColumnDefinition());
	console.log("JSON.stringify(columnsGR1) 1 :" + JSON.stringify(columnsGR1));
	columnsGR1=$.extend(sasJsonRes["ColumInfo"],columnsGR1);;
	console.log("JSON.stringify(columnsGR1) 2 :" + JSON.stringify(columnsGR1));
	*/
	columnsGR1=sasJsonRes["ColumInfo"];
	optionsGR1=sasJsonRes["Options"][0];
	dataGR1 = sasJsonRes["SASResult"];
	gridGR1 = new Slick.Grid("#dvSetList",  dataGR1, columnsGR1,  optionsGR1);
	gridGR1.setSelectionModel(new Slick.RowSelectionModel());
  gridGR1.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

  //gridGR1.registerPlugin(checkboxSelector);
	var columnpicker = new Slick.Controls.ColumnPicker(columnsGR1, gridGR1, optionsGR1); 

	gridGR1.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR1.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataGR1.sort(function (dataRow1, dataRow2) {
		for (var i = 0, l = cols.length; i < l; i++) {
		  var field = cols[i].sortCol.field;
		  var sign = cols[i].sortAsc ? 1 : -1;
		  var value1 = dataRow1[field], value2 = dataRow2[field];
		  var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
		  if (result != 0) {
			return result;
		  }
		}
		return 0;
	  });
	  gridGR1.invalidate();
	  gridGR1.render();
	});	
  gridGR1.onClick.subscribe(function (e) {
  	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
			return;
		}
    var cell = gridGR1.getCellFromEvent(e);
    console.log("gridGR1.onClick cell : " + JSON.stringify(cell));
    if (cell != null) curRowGR1 = cell.row;
    if ( dataGR1.length > curRowGR1){
			//saveGR1Row(curRowGR1);
  	}
  });			
  gridGR1.onDblClick.subscribe(function (e) {
    var cell = gridGR1.getCellFromEvent(e);
    curRowGR1 = cell.row;
    if ( dataGR1.length > curRowGR1){
			//saveGR1Row(curRowGR1);
  	}
  });	  
  gridGR1.onCellChange.subscribe(function (e) {
    var cell = gridGR1.getCellFromEvent(e);
    console.log("gridGR1.onCellChange cell : " + JSON.stringify(cell));
    curRowGR1 = curRowGR1;//cell.row;
    console.log("gridGR1.onCellChange curRowGR1: " + curRowGR1);
		//saveGR1Row(curRowGR1);
		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataGR1[curRowGR1].UPDATE_DT=d.yyyymmdd();
	  gridGR1.invalidate();
	  gridGR1.render();
  });	  
	gridGR1.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridGR1.invalidateRow(dataGR1.length);
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.CURRENCY_MAP_CURVE_LIST","CRRC_SET_ID");
		d = new Date();		  
	  var ID=eval("("+'{"CRRC_SET_ID":"CRRS_' + resData.toString().trim() + '"' + '}'+")");
	  var baseDT=eval("("+'{"BASE_DATE":"' + d.yyyymmdd() + '"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
	  
    item = $.extend({},item,ID,baseDT,updateDT,useYN);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  gridGR1.render();	
	});
    $("#dvModalSetList").hide();
}
function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
}
//	get_INRT_CRV_ID();
var curCurrency="";
function renderGR2(data){
	var sasJsonRes=eval(data)[0];
	dataGR2		=[];
	columnsGR2 =[];
	columnsGR2=sasJsonRes["ColumInfo"];
	optionsGR2=sasJsonRes["Options"][0];
	dataGR2 = sasJsonRes["SASResult"];
	gridGR2 = new Slick.Grid("#dvList",  dataGR2, columnsGR2,  optionsGR2);
	gridGR2.setSelectionModel(new Slick.RowSelectionModel());
  gridGR2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

	gridGR2.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR2.onMouseLeave.subscribe(function(e, args) {
		$("#dvTooltip").html("");
		$("#dvTooltip").hide();
	});
	gridGR2.onMouseEnter.subscribe(function(e, args) {
    var cell = args.grid.getCellFromEvent(e);
		if (gridGR2.getColumns()[cell.cell].id == "F_CURRENCY"
				||gridGR2.getColumns()[cell.cell].id == "T_CURRENCY"
				||gridGR2.getColumns()[cell.cell].id == "CURR_CURVE_ID") {
			tooltip(e,"To change value, Click the Right Mouse Button and Select the Item.");
		} else if (gridGR2.getColumns()[cell.cell].id == "USE_YN") {
			tooltip(e,"To change value, Double Click the Cell");
		}
	});
	
	gridGR2.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR2.getCellFromEvent(e);
		if (gridGR2.getColumns()[cell.cell].id == "F_CURRENCY"||gridGR2.getColumns()[cell.cell].id == "T_CURRENCY") {
			curCurrency=gridGR2.getColumns()[cell.cell].id;
			$("#contextCurrency")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextCurrency").hide();
			});
		}
		if (gridGR2.getColumns()[cell.cell].id == "DISAPLAY_CRRC") {
			$("#contextMenu")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextMenu").hide();
			});
		}
	});  		
	$("#contextCurrency").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR2.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		if ( curCurrency == "F_CURRENCY") {
			dataGR2[row].F_CURRENCY = $(e.target).attr("data");
		} else if (curCurrency == "T_CURRENCY") {
			dataGR2[row].T_CURRENCY = $(e.target).attr("data");
		}
		gridGR2.updateRow(row);
		//saveGR1Row(row);
	});	
	$("#contextMenu").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR2.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR2[row].CURR_CURVE_ID = $(e.target).attr("data");
		dataGR2[row].DISAPLAY_CRRC = $(e.target).html();
		gridGR2.updateRow(row);
		//saveGR1Row(row);
	});	
	gridGR2.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataGR2.sort(function (dataRow1, dataRow2) {
		for (var i = 0, l = cols.length; i < l; i++) {
		  var field = cols[i].sortCol.field;
		  var sign = cols[i].sortAsc ? 1 : -1;
		  var value1 = dataRow1[field], value2 = dataRow2[field];
		  var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
		  if (result != 0) {
			return result;
		  }
		}
		return 0;
	  });
	  gridGR2.invalidate();
	  gridGR2.render();
	});	
  gridGR2.onClick.subscribe(function (e) {
		console.log("gridGR2.onClick");
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
  });			
  gridGR2.onDblClick.subscribe(function (e) {
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
    if ( dataGR2.length > curRowGR2){
			//saveGR1Row(curRowGR2);
  	}
  });	  
  gridGR2.onCellChange.subscribe(function (e) {
  });	  
	gridGR2.onAddNewRow.subscribe(function (e, args) {
		console.log("gridGR2.onAddNewRow");
	  var item = args.item;
	  gridGR2.invalidateRow(dataGR2.length);
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.CURRENCY_MAP_CURVE_SET","SEQ_ID",curCRRC_SET_ID);
		d = new Date();		  
	  var ID=eval("("+'{"SEQ_ID":"SEQ_' + resData.toString().trim() + '"' + '}'+")");
	  //var F_CURRENCY=eval("("+'{"F_CURRENCY":"USD"' + '}'+")");
	  //var T_CURRENCY=eval("("+'{"T_CURRENCY":"USD"' + '}'+")");
	  var CURR_CURVE_ID=eval("("+'{"CURR_CURVE_ID":""' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
	  var baseDT=eval("("+'{"BASE_DATE":"' + d.yyyymmdd() + '"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
	  
    item = $.extend({},item,CURR_CURVE_ID,ID,baseDT,updateDT,useYN);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR2.push(item);
	  gridGR2.updateRowCount();
	  gridGR2.render();	
	})	
}
function deleteCurr(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Sequence ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteCurrCF");
}
function deleteCurrCF(){
  var dataGR2 = gridGR2.getData();
  var current_row = gridGR2.getActiveCell().row;
  CRRC_SET_ID=curCRRC_SET_ID;//dataGR2[current_row].CRRC_SET_ID;
  var SEQ_ID=dataGR2[current_row].SEQ_ID;
  dataGR2.splice(current_row,1);
  var r = current_row;
  while (r<dataGR2.length){
    gridGR2.invalidateRow(r);
    r++;
  }
  gridGR2.updateRowCount();
  gridGR2.render();
  gridGR2.scrollRowIntoView(current_row-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc002_deleteCurrencyCurveMapSetRow(StoredProcess)","alertResMsg",CRRC_SET_ID,SEQ_ID);
}
function deleteCurrencySet(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Currency Set ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteCurrencySetCF");
}
function deleteCurrencySetCF(){
  var dataGR1 = gridGR1.getData();
  var current_row = gridGR1.getActiveCell().row;
  console.log("gridGR1[current_row].TRM_STRT_MDL_ID: " + dataGR1[current_row].CRRC_SET_ID);
  var curCRRC_SET_ID=dataGR1[current_row].CRRC_SET_ID;
  dataGR1.splice(current_row,1);
  var r = current_row;
  while (r<dataGR1.length){
    gridGR1.invalidateRow(r);
    r++;
  }
  gridGR1.updateRowCount();
  gridGR1.render();
  gridGR1.scrollRowIntoView(current_row-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc002_deleteCurrencyCurveMapSet(StoredProcess)","alertResMsg",curCRRC_SET_ID);
}
function saveGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Currency Set ID.");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow(dataGR1.length);
  var curRow = gridGR1.getActiveCell().row;

	console.log("saveGR1Row curRow : " + curRow + ":" + JSON.stringify(curRow));
	console.log("gridGR1.getActiveCell(): " + gridGR1.getActiveCell());
  var CRRC_SET_ID	= dataGR1[curRow].CRRC_SET_ID;
  var CRRC_SET_NAME	= dataGR1[curRow].CRRC_SET_NAME;
  var BASE_DATE 	= dataGR1[curRow].BASE_DATE;
  var USE_YN 	= dataGR1[curRow].USE_YN;
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc002_saveCurrencyCurveSet(StoredProcess)","alertResMsg",CRRC_SET_ID,CRRC_SET_NAME,BASE_DATE,USE_YN);
}
function saveGR2Row(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Sequence ID.");
		return;
	}
	/*
	저장 후 row 가 삭제되는 현상이 발생해서 주석처리
	*/
	if (!gridGR2.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	//gridGR2.invalidateRow(dataGR2.length);
  var curRow = gridGR2.getActiveCell().row;

  var CRRC_SET_ID= curCRRC_SET_ID;
  var SEQ_ID 		= dataGR2[curRow].SEQ_ID;
  var CURR_CURVE_ID	= dataGR2[curRow].CURR_CURVE_ID;
  var USE_YN		= dataGR2[curRow].USE_YN;
  var F_CURRENCY="";
  var T_CURRENCY="";
  
  isDisplayProgress=0;
  console.log("saveGR1Row USE_YN :" + USE_YN);
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc002_saveCurrencyCurveMapSetRow(StoredProcess)","alertResMsg",CRRC_SET_ID,SEQ_ID,F_CURRENCY,CURR_CURVE_ID,USE_YN,T_CURRENCY);
  console.log("saveGR1Row End...");
}
function copyID(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Currency Set ID.");
		return;
	}
  curRow=gridGR1.getActiveCell().row;
	var CRRC_SET_ID=dataGR1[curRow].CRRC_SET_ID;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc002_copyCurrencyCurveMapSet(StoredProcess)","renderGR1",CRRC_SET_ID);				
}