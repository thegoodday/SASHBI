$(document).ready(function () {
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/trm001_getTrmList(StoredProcess)","renderGR1");				
	$("#dvMain").height(eval($(window).height()-58));
	$("#dvList").height(eval($(window).height()-268));
	$(".buttonArea").append("<input type='button' id='btnRun' class=condBtnSearch value='Modify' onclick='manageSetList();'>");
});
$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-58));
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


function manageSetList(){
	$("#dvModalSetList").css("left",eval(eval($(window).width()-$("#dvModalSetList").width()-40)/2));
	$("#dvModalSetList").css("top",eval(eval($(window).height()-$("#dvModalSetList").height()-60)/2));	
	$("#dvModalSetList").show();
}
function renderGR1(data){
	var sasJsonRes=eval(data)[0];
	dataGR1		=[];
	columnsGR1 =[];
	columnsGR1=sasJsonRes["ColumInfo"];
	optionsGR1=sasJsonRes["Options"][0];
	dataGR1 = sasJsonRes["SASResult"];
	gridGR1 = new Slick.Grid("#dvSetList",  dataGR1, columnsGR1,  optionsGR1);
	gridGR1.setSelectionModel(new Slick.RowSelectionModel());
  gridGR1.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

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
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.TERM_STRUCTURE_MODEL_LIST","TRM_STRT_MDL_ID");
		d = new Date();		  
	  var ID=eval("("+'{"TRM_STRT_MDL_ID":"TRST_' + resData.toString().trim() + '"' + '}'+")");
	  var baseDT=eval("("+'{"BASE_DATE":"' + d.yyyymmdd() + '"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({},item,ID,baseDT,updateDT);
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
	gridGR2.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR2.getCellFromEvent(e);
		if (gridGR2.getColumns()[cell.cell].id == "INRT_CRV_NAME") {
			$("#contextINRTCurveName")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextINRTCurveName").hide();
			});
		}
	});  		
	$("#contextINRTCurveName").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR2.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR2[row].INRT_CRV_NAME = $(e.target).attr("data");
		gridGR2.updateRow(row);
		//saveINRTCurveMapSetRow(row);
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
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
    if ( dataGR2.length > curRowGR2){
			//saveGR2Row(curRowGR2);
  	}
  });			
  gridGR2.onDblClick.subscribe(function (e) {
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
  });	  
  gridGR2.onCellChange.subscribe(function (e) {
  });	  
	gridGR2.onAddNewRow.subscribe(function (e, args) {
	})	
}
function setStrtModel(data){
	$("#dvTRSTModel").show();
	var res=eval(data)[0];
	var model=res.MODEL_TYPE;
	console.log("model: " + JSON.stringify(res));
	console.log("model: " + model);
	console.log("model.length: " + model.length);
	if (model != "null") {
		$("#sltTRSTModel").val(model);
	} else {
		$("#sltTRSTModel option:eq(0)").attr("selected", "selected");
	}
	getModelParameter();
}
function getModelParameter(){
	var model=$("#sltTRSTModel option:selected").val();
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/trm001_saveTrmGR2Row(StoredProcess)","renderGR2",model);
}
function deleteTRSTList(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Term Structure ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteTRSTListCF");
}  
function deleteTRSTListCF(){
  var dataGR1 = gridGR1.getData();
  var current_row = gridGR1.getActiveCell().row;
  console.log("gridGR1[current_row].TRM_STRT_MDL_ID: " + dataGR1[current_row].TRM_STRT_MDL_ID);
  var curTRM_STRT_MDL_ID=dataGR1[current_row].TRM_STRT_MDL_ID;
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
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/trm001_deleteTrmListRow(StoredProcess)","alertResMsg",curTRM_STRT_MDL_ID);
}
function saveGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Term Structure ID.");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow(dataGR1.length);
  var curRow = gridGR1.getActiveCell().row;

  var TRM_STRT_MDL_ID	= dataGR1[curRow].TRM_STRT_MDL_ID;
  var TRM_STRT_MDL_NAME	= dataGR1[curRow].TRM_STRT_MDL_NAME;
  var BASE_DATE 	= dataGR1[curRow].BASE_DATE;
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/trm001_saveTrmRow(StoredProcess)","alertResMsg",TRM_STRT_MDL_ID,TRM_STRT_MDL_NAME,BASE_DATE);
}
function saveGR2Row(){
	/*
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Term Structure...");
		return;
	}
	*/
	if (!gridGR2.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR2.invalidateRow(dataGR2.length);
  var curRow = 0;//gridGR2.getActiveCell().row;

	var model=$("#sltTRSTModel option:selected").val();
	console.log("model : " + model);
	console.log("model.length : " + model.length);
	if (model.length == 7) {
	  var VOLATILITY		= dataGR2[curRow].VOLATILITY;
	  var MEAN_RVS_SPD	= dataGR2[curRow].MEAN_RVS_SPD;
	  var LONG_RUN_RATE	= dataGR2[curRow].LONG_RUN_RATE;
	  var NO_ITER				= dataGR2[curRow].NO_ITER;
	  isDisplayProgress=0;
		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/trm001_saveGR2Row(StoredProcess)","alertResMsg",model,VOLATILITY,MEAN_RVS_SPD,LONG_RUN_RATE,NO_ITER);
	} else if (model.length == 8) {
	  var VOLATILITY		= dataGR2[curRow].VOLATILITY;
	  var MEAN_RVS_SPD	= dataGR2[curRow].MEAN_RVS_SPD;
	  var NO_ITER				= dataGR2[curRow].NO_ITER;
	  isDisplayProgress=0;
		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/trm001_saveGR2Row(StoredProcess)","alertResMsg",model,VOLATILITY,MEAN_RVS_SPD,NO_ITER);
	} else if (model.length == 12) {
	  var VOLATILITY		= dataGR2[curRow].VOLATILITY;
	  var MEAN_RVS_SPD	= dataGR2[curRow].MEAN_RVS_SPD;
	  var NO_ITER				= dataGR2[curRow].NO_ITER;
	  isDisplayProgress=0;
		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/trm001_saveGR2Row(StoredProcess)","alertResMsg",model,VOLATILITY,NO_ITER);
	}
}
function copyID(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Term Structure ID.");
		return;
	}

}