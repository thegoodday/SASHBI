$(document).ready(function () {
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/04.Job Management/01/job001_getBJobList(StoredProcess)","renderGR1");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/04.Job Management/01/job001_getJobContext(StoredProcess)","initContextMenu","","");				
	$("#dvMain").height(eval($(window).height()-148));
	//$("#dvList").height(eval($(window).height()-178));
	$(".buttonArea").append("<input type='button' id='btnRun' class=condBtnSearch value='Modify' onclick='manageSetList();'>");
	/*
	$("#dvGR2").width(eval($(window).width()/2-7));
	$("#dvGR3").width(eval($(window).width()/2-7));
	$("#dvGR4").width(eval($(window).width()-7));
	$("#dvGR5").width(eval($(window).width()/2-7));
	$("#dvGR6").width(eval($(window).width()/2-7));

	$("#dvGR2").height(eval($(window).height()/3-88));
	$("#dvGR3").height(eval($(window).height()/3-88));
	$("#dvGR4").height(eval($(window).height()/3-88));
	$("#dvGR5").height(eval($(window).height()/3-88));
	$("#dvGR6").height(eval($(window).height()/3-88));
	*/
	//$('#dvModalSetList').hide();

});
$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-148));
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

var curJOB_ID;

function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
}
function initContextMenu(data){
	var sasJsonRes=eval(data)[0];
	var cxtList = sasJsonRes["SASResult"];
	console.log("cxtList: ");
	console.log(cxtList);
	var ctxMenuStr="";
	var preCXT_ID=""
	for(var ii=0;ii<cxtList.length;ii++){
		var CXT_ID=cxtList[ii].CXT_ID;
		var ID=cxtList[ii].ID;
		var NAME=cxtList[ii].NAME;
		var ISLAST=cxtList[ii].ISLAST;
		if (CXT_ID!="GRP_SET_ID" && ctxMenuStr=="" ) ctxMenuStr+="<li data='" + "" + "'>" + "N/A" +"</li>";
		ctxMenuStr+="<li data='" + ID + "'>" + NAME +"</li>";
		if (ISLAST == "1"){
			console.log("CXT_ID : " + CXT_ID);
			$("#context"+CXT_ID).html(ctxMenuStr);
			ctxMenuStr="";
		}
	}
}
function manageSetList(){
	$("#dvModalSetList").css("width","610px");
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
			//saveGR1Save(curRowGR1);
  	}
  });			
  gridGR1.onDblClick.subscribe(function (e) {
    var cell = gridGR1.getCellFromEvent(e);
    curRowGR1 = cell.row;
    if ( dataGR1.length > curRowGR1){
			//saveGR1Save(curRowGR1);
  	}
  });	  
  gridGR1.onCellChange.subscribe(function (e) {
    var cell = gridGR1.getCellFromEvent(e);
    console.log("gridGR1.onCellChange cell : " + JSON.stringify(cell));
    curRowGR1 = curRowGR1;//cell.row;
    console.log("gridGR1.onCellChange curRowGR1: " + curRowGR1);
		saveGR1Save(curRowGR1);
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
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.JOB_BATCH_LIST","JOB_ID");
		d = new Date();		  
	  var ID=eval("("+'{"JOB_ID":"JOB_' + resData.toString().trim() + '"' + '}'+")");
	  var baseDT=eval("("+'{"BASE_DATE":"' + d.yyyymmdd() + '"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
	  
    item = $.extend({},item,ID,baseDT,updateDT,useYN);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  gridGR1.render();	
	})
	$('#dvModalSetList').hide();
}
function saveGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Job ID.");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow();
	
	var curRow = gridGR1.getActiveCell().row;
	saveGR1Save(curRow);
}
function saveGR1Save(curRow){
	console.log("saveGR1Save curRow : " + curRow + ":" + JSON.stringify(curRow));
	console.log("gridGR1.getActiveCell(): " + gridGR1.getActiveCell());
	if (!curRow) {
  	var curRow = gridGR1.getActiveCell().row;
	}
  var JOB_ID		= dataGR1[curRow].JOB_ID;
  var JOB_NAME	= dataGR1[curRow].JOB_NAME;
  //var BASE_DATE	= dataGR1[curRow].BASE_DATE;
  var USE_YN		= dataGR1[curRow].USE_YN;
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/04.Job Management/01/job001_saveBJobListRow(StoredProcess)","alertResMsg",JOB_ID,JOB_NAME,USE_YN);
	return curRow;
}
function saveJob(){
	var JobList = $.extend({},gridGR2.getData()[0],gridGR3.getData()[0],gridGR4.getData()[0],gridGR5.getData()[0],gridGR6.getData()[0]);
	var JobListStr=JSON.stringify(JobList);
	console.log("JobListStr : \n" + JobListStr);
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/04.Job Management/01/job001_saveBJobRow(StoredProcess)","alertResMsg",curJOB_ID,JobListStr);	
}
//	get_INRT_CRV_ID();
var curCxtID;
function renderGR2(data){
	var sasJsonRes=eval(data)[0];
	dataGR2		=[];
	columnsGR2 =[];
	columnsGR2=sasJsonRes["ColumInfo"];
	optionsGR2=sasJsonRes["Options"][0];
	dataGR2 = sasJsonRes["SASResult"];
	gridGR2 = new Slick.Grid("#dvGR2",  dataGR2, columnsGR2,  optionsGR2);
	gridGR2.setSelectionModel(new Slick.RowSelectionModel());
  gridGR2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

	gridGR2.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR2.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR2.getCellFromEvent(e);
		curCxtID=gridGR2.getColumns()[cell.cell].id;
		if (gridGR2.getColumns()[cell.cell].id == "GRP_SET_NAME") {
			$("#contextGRP_SET_ID")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextGRP_SET_ID").hide();
			});
		}
		if (gridGR2.getColumns()[cell.cell].id == "BKT_NAME"||gridGR2.getColumns()[cell.cell].id == "REP_BKT_NAME") {
			$("#contextBKT_ID")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextBKT_ID").hide();
			});
		}
		if (gridGR2.getColumns()[cell.cell].id == "MTRT_NAME") {
			$("#contextMTRT_ID")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextMTRT_ID").hide();
			});
		}
	});  		
	$("#contextGRP_SET_ID").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR2.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR2[row].GRP_SET_ID = $(e.target).attr("data");
		dataGR2[row].GRP_SET_NAME = $(e.target).html();
		gridGR2.updateRow(row);
		//saveCurrencyCurveMapSetRow(row);
	});	
	$("#contextBKT_ID").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR2.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		if (curCxtID =="BKT_NAME") {
			dataGR2[row].BKT_ID = $(e.target).attr("data");
			dataGR2[row].BKT_NAME = $(e.target).html();
		} 
		else if (curCxtID =="REP_BKT_NAME") {
			dataGR2[row].REP_BKT_ID = $(e.target).attr("data");
			dataGR2[row].REP_BKT_NAME = $(e.target).html();
		} 
		gridGR2.updateRow(row);
		//saveCurrencyCurveMapSetRow(row);
	});	
	$("#contextMTRT_ID").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR2.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR2[row].MTRT_ID = $(e.target).attr("data");
		dataGR2[row].MTRT_NAME = $(e.target).html();
		gridGR2.updateRow(row);
		//saveCurrencyCurveMapSetRow(row);
	});	
}
var curScName;
function renderGR3(data){
	var sasJsonRes=eval(data)[0];
	dataGR3		=[];
	columnsGR3 =[];
	columnsGR3=sasJsonRes["ColumInfo"];
	optionsGR3=sasJsonRes["Options"][0];
	dataGR3 = sasJsonRes["SASResult"];
	gridGR3 = new Slick.Grid("#dvGR3",  dataGR3, columnsGR3,  optionsGR3);
	gridGR3.setSelectionModel(new Slick.RowSelectionModel());
  gridGR3.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

	gridGR3.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR3.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR3.getCellFromEvent(e);
		curScName=gridGR3.getColumns()[cell.cell].id;
		//if (gridGR3.getColumns()[cell.cell].id == "SCENARIO01_NAME") {
			$("#contextCUST_BHVR_ID")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();			
			$("body").one("click", function () {
				$("#contextCUST_BHVR_ID").hide();
			});
		//}
	});  		
	$("#contextCUST_BHVR_ID").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR3.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		if (curScName == "SCENARIO01_NAME") {
			dataGR3[row].SCENARIO01 = $(e.target).attr("data");
			dataGR3[row].SCENARIO01_NAME = $(e.target).html();
		}
		else if (curScName == "SCENARIO02_NAME") {
			dataGR3[row].SCENARIO02 = $(e.target).attr("data");
			dataGR3[row].SCENARIO02_NAME = $(e.target).html();
		}
		else if (curScName == "SCENARIO03_NAME") {
			dataGR3[row].SCENARIO03 = $(e.target).attr("data");
			dataGR3[row].SCENARIO03_NAME = $(e.target).html();
		}
		else if (curScName == "SCENARIO04_NAME") {
			dataGR3[row].SCENARIO04 = $(e.target).attr("data");
			dataGR3[row].SCENARIO04_NAME = $(e.target).html();
		}
		else if (curScName == "SCENARIO05_NAME") {
			dataGR3[row].SCENARIO05 = $(e.target).attr("data");
			dataGR3[row].SCENARIO05_NAME = $(e.target).html();
		}
		else if (curScName == "SCENARIO06_NAME") {
			dataGR3[row].SCENARIO06 = $(e.target).attr("data");
			dataGR3[row].SCENARIO06_NAME = $(e.target).html();
		}
		else if (curScName == "SCENARIO07_NAME") {
			dataGR3[row].SCENARIO07 = $(e.target).attr("data");
			dataGR3[row].SCENARIO07_NAME = $(e.target).html();
		}
		else if (curScName == "SCENARIO08_NAME") {
			dataGR3[row].SCENARIO08 = $(e.target).attr("data");
			dataGR3[row].SCENARIO08_NAME = $(e.target).html();
		}
		else if (curScName == "SCENARIO09_NAME") {
			dataGR3[row].SCENARIO09 = $(e.target).attr("data");
			dataGR3[row].SCENARIO09_NAME = $(e.target).html();
		}
		else if (curScName == "SCENARIO10_NAME") {
			dataGR3[row].SCENARIO10 = $(e.target).attr("data");
			dataGR3[row].SCENARIO10_NAME = $(e.target).html();
		}
		gridGR3.updateRow(row);
	});	
}
function renderGR4(data){
	var sasJsonRes=eval(data)[0];
	dataGR4		=[];
	columnsGR4 =[];
	columnsGR4=sasJsonRes["ColumInfo"];
	optionsGR4=sasJsonRes["Options"][0];
	dataGR4 = sasJsonRes["SASResult"];
	gridGR4 = new Slick.Grid("#dvGR4",  dataGR4, columnsGR4,  optionsGR4);
	gridGR4.setSelectionModel(new Slick.RowSelectionModel());
  gridGR4.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

	gridGR4.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR4.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR4.getCellFromEvent(e);
		if (gridGR4.getColumns()[cell.cell].id == "FLT_CRV_NAME") {
			$("#contextFLTCrv")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextFLTCrv").hide();
			});
		}
		if (gridGR4.getColumns()[cell.cell].id == "DCT_CRV_NAME") {
			$("#contextDSCCrv")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextDSCCrv").hide();
			});
		}
		if (gridGR4.getColumns()[cell.cell].id == "FTP_CRV_NAME") {
			$("#contextFTPCrv")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextFTPCrv").hide();
			});
		}
		if (gridGR4.getColumns()[cell.cell].id == "TRM_STRT_NAME") {
			$("#contextTRM_STRT_MDL_ID")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextTRM_STRT_MDL_ID").hide();
			});
		}
	});  		
	$("#contextFLTCrv").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR4.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR4[row].FLT_CRV_ID = $(e.target).attr("data");
		dataGR4[row].FLT_CRV_NAME = $(e.target).html();
		gridGR4.updateRow(row);
		//saveCurrencyCurveMapSetRow(row);
	});	
	$("#contextDSCCrv").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR4.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR4[row].DCT_CRV_ID = $(e.target).attr("data");
		dataGR4[row].DCT_CRV_NAME = $(e.target).html();
		gridGR4.updateRow(row);
		//saveCurrencyCurveMapSetRow(row);
	});	
	$("#contextFTPCrv").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR4.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR4[row].FTP_CRV_ID = $(e.target).attr("data");
		dataGR4[row].FTP_CRV_NAME = $(e.target).html();
		gridGR4.updateRow(row);
		//saveCurrencyCurveMapSetRow(row);
	});	
	$("#contextTRM_STRT_MDL_ID").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR4.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR4[row].TRM_STRT_ID = $(e.target).attr("data");
		dataGR4[row].TRM_STRT_NAME = $(e.target).html();
		gridGR4.updateRow(row);
		//saveCurrencyCurveMapSetRow(row);
	});	
}
function renderGR5(data){
	var sasJsonRes=eval(data)[0];
	dataGR2		=[];
	columnsGR5 =[];
	columnsGR5=sasJsonRes["ColumInfo"];
	optionsGR5=sasJsonRes["Options"][0];
	dataGR5 = sasJsonRes["SASResult"];
	gridGR5 = new Slick.Grid("#dvGR5",  dataGR5, columnsGR5,  optionsGR5);
	gridGR5.setSelectionModel(new Slick.RowSelectionModel());
  gridGR5.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

	gridGR5.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR5.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR5.getCellFromEvent(e);
		if (gridGR5.getColumns()[cell.cell].id == "CRRC_SET_NAME") {
			$("#contextCRRC_SET_ID")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextCRRC_SET_ID").hide();
			});
		}
	});	
	$("#contextCRRC_SET_ID").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR5.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR5[row].CRRC_SET_ID = $(e.target).attr("data");
		dataGR5[row].CRRC_SET_NAME = $(e.target).html();
		gridGR5.updateRow(row);
		//saveCurrencyCurveMapSetRow(row);
	});	
}
function renderGR6(data){
	var sasJsonRes=eval(data)[0];
	dataGR6		=[];
	columnsGR6 =[];
	columnsGR6=sasJsonRes["ColumInfo"];
	optionsGR6=sasJsonRes["Options"][0];
	dataGR6 = sasJsonRes["SASResult"];
	gridGR6 = new Slick.Grid("#dvGR6",  dataGR6, columnsGR6,  optionsGR6);
	gridGR6.setSelectionModel(new Slick.RowSelectionModel());
  gridGR6.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

	gridGR6.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR6.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR6.getCellFromEvent(e);
		if (gridGR6.getColumns()[cell.cell].id == "NBIZ_NAME") {
			$("#contextNBIZ_ID")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextNBIZ_ID").hide();
			});
		}
	});  		
	$("#contextNBIZ_ID").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR6.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR6[row].NBIZ_ID = $(e.target).attr("data");
		dataGR6[row].NBIZ_NAME = $(e.target).html();
		gridGR6.updateRow(row);
		//saveCurrencyCurveMapSetRow(row);
	});	
}