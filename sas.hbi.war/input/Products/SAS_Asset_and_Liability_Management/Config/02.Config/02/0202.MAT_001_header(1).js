$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-158));
})
$(document).ready(function () {
	$("#dvMain").height(eval($(window).height()-140));
	$("#dvGR2").height(eval($(window).height()-232));
	$("#dvGR3").height(eval($(window).height()-262));
	$(".buttonArea").append("<input type='button' id='btnRun' class=condBtnSearch value='Modify' onclick='manageID();'>");
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_getMaturityList(StoredProcess)","renderGR1");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_getGroupSetList(StoredProcess)","initGrpListContextMenu","","");				  
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

var curGR3ID;
var gridGR3;
var dataGR3 = [];
var optionsGR3;
var columnsGR3;
var curRowGR3;

var curMTRT_ID;

function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
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
	gridGR1 = new Slick.Grid("#dvGR1",  dataGR1, columnsGR1,  optionsGR1);
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
	gridGR1.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR1.getCellFromEvent(e);
		if (gridGR1.getColumns()[cell.cell].id == "GRP_SET_NAME") {
			$("#contextGrpSetList")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextGrpSetList").hide();
			});
		}
	});  		
	$("#contextGrpSetList").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR1.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR1[row].GRP_SET_ID = $(e.target).attr("data");
		dataGR1[row].GRP_SET_NAME = $(e.target).html();
		gridGR1.updateRow(row);
	});	
  gridGR1.onClick.subscribe(function (e) {
  	console.log("gridGR1.onClick");
    var cell = gridGR1.getCellFromEvent(e);
    var curRow = cell.row;
    if ( dataGR1.length > curRow){
  	}
  });			
  gridGR1.onDblClick.subscribe(function (e) {
  	console.log("gridGR1.onDblClick");
    var cell = gridGR1.getCellFromEvent(e);
    var curRow = cell.row;
    if ( dataGR1.length > curRow){
			//saveGR1Row();
  	}
  });	  
  gridGR1.onCellChange.subscribe(function (e) {
  	console.log("gridGR1.onCellChange");  	
		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataGR1[curRow].UPDATE_DT=d.yyyymmdd();
	  gridGR1.invalidate();
	  gridGR1.render();
  });	  
	gridGR1.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridGR1.invalidateRow(dataGR1.length);
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.SEG_MATURITY_LIST","MTRT_ID");
		d = new Date();		  
	  var VAR_ID		=eval("("+'{"MTRT_ID":"' + 'MTRT_' + resData.toString().trim() + '"' + '}'+")");
	  var SEG_SET_ID=eval("("+'{"SEG_SET_ID":"' + "CS_00001" + '"' + '}'+")");
	  var USE_YN		=eval("("+'{"USE_YN":"1"' + '}'+")");
	  var UPDATE_DT	=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({},item,VAR_ID,SEG_SET_ID,USE_YN,UPDATE_DT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  gridGR1.render();	
	});

    $("#dvModalID").hide();	
}
function renderGR2(data){
	var sasJsonRes=eval(data)[0];
	dataGR2		=[];
	columnsGR2 =[];
	/*
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	columnsGR2.push(checkboxSelector.getColumnDefinition());
	console.log("JSON.stringify(columnsGR2) 1 :" + JSON.stringify(columnsGR2));
	columnsGR2=$.extend(sasJsonRes["ColumInfo"],columnsGR2);;
	console.log("JSON.stringify(columnsGR2) 2 :" + JSON.stringify(columnsGR2));
	*/
	columnsGR2=sasJsonRes["ColumInfo"];
	optionsGR2=sasJsonRes["Options"][0];
	dataGR2 = sasJsonRes["SASResult"];
	gridGR2 = new Slick.Grid("#dvGR2",  dataGR2, columnsGR2,  optionsGR2);
	gridGR2.setSelectionModel(new Slick.RowSelectionModel());
  gridGR2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

  //gridGR2.registerPlugin(checkboxSelector);
	//var columnpicker = new Slick.Controls.ColumnPicker(columnsGR2, gridGR2, optionsGR2); 

	gridGR2.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
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
    var curRow = cell.row;
    if ( dataGR2.length > curRow){
			var MTRT_ID=curMTRT_ID;
			var GRP_SET_ID	= dataGR2[curRow].GRP_SET_ID;
			var SEG_SET_ID	= dataGR2[curRow].SEG_SET_ID;
			var GRP_ID			= dataGR2[curRow].GRP_ID;
			execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_getMaturitySet(StoredProcess)","renderGR3",MTRT_ID,GRP_SET_ID,SEG_SET_ID,GRP_ID);
  	}
  });			
  gridGR2.onDblClick.subscribe(function (e) {
  	console.log("gridGR2.onDblClick");
  	/*
    var cell = gridGR2.getCellFromEvent(e);
    var curRow = cell.row;
    if ( dataGR2.length > curRow){
			if (!gridGR2.getEditorLock().commitCurrentEdit()) {
				return;
			}    	
			var NBIZ_ID			= dataGR2[curRow].NBIZ_ID;
			console.log("NBIZ_ID : " + NBIZ_ID);
			if (NBIZ_ID == "") NBIZ_ID=curNBIZ_ID;
			var SEG_SET_ID	= dataGR2[curRow].SEG_SET_ID;
			var SEG_ID			= dataGR2[curRow].SEG_ID;
			var NBIZ_TYPE		= dataGR2[curRow].NBIZ_TYPE;
			var AMT_TYPE		= dataGR2[curRow].AMT_TYPE;
			execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_getNBizTranRate(StoredProcess)","renderGR4",NBIZ_ID,SEG_SET_ID,SEG_ID);
			//execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_saveNBizSetRow(StoredProcess)","alertResMsg",NBIZ_ID,SEG_SET_ID,SEG_ID,NBIZ_TYPE,AMT_TYPE);
  	}
  	*/
  });	  
  gridGR2.onCellChange.subscribe(function (e) {
  });	 
}
function deleteGR3ID(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Group ID.");
		return;
	}
	if (gridGR3.getActiveCell() == null){
		alertMsg("Select the Sequence ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteGR3IDCF");
}
function deleteGR3IDCF(){
  var curRowGR2 = gridGR2.getActiveCell().row;
	var MTRT_ID			= curMTRT_ID;
	var SEG_SET_ID	= dataGR2[curRowGR2].SEG_SET_ID;
	var GRP_ID			= dataGR2[curRowGR2].GRP_ID;

  var dataGR3 = gridGR3.getData();
  var current_row = gridGR3.getActiveCell().row;
	var SEQ_ID			= dataGR3[current_row].SEQ_ID;
  dataGR3.splice(current_row,1);
  var r = current_row;
  while (r<dataGR3.length){
    gridGR3.invalidateRow(r);
    r++;
  }
  gridGR3.updateRowCount();
  gridGR3.render();
  gridGR3.scrollRowIntoView(current_row-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_deleteMaturityGR3Row(StoredProcess)","alertResMsg",MTRT_ID,SEG_SET_ID,GRP_ID,SEQ_ID);
}
function deleteGR4ID(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Group ID.");
		return;
	}
	if (gridGR4.getActiveCell() == null){
		alertMsg("Select the Group ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteGR4IDCF");
}
function deleteGR4IDCF(){
  var curRowGR2 = gridGR2.getActiveCell().row;
	var NBIZ_ID			= curNBIZ_ID;
	console.log("NBIZ_ID : " + NBIZ_ID);
	var SEG_SET_ID	= dataGR2[curRowGR2].SEG_SET_ID;
	var SEG_ID			= dataGR2[curRowGR2].SEG_ID;

  var dataGR4 = gridGR4.getData();
  var current_row = gridGR4.getActiveCell().row;
	var SEQ_ID			= dataGR4[current_row].SEQ_ID;
  dataGR4.splice(current_row,1);
  var r = current_row;
  while (r<dataGR4.length){
    gridGR4.invalidateRow(r);
    r++;
  }
  gridGR4.updateRowCount();
  gridGR4.render();
  gridGR4.scrollRowIntoView(current_row-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_deleteNBizGR4Row(StoredProcess)","alertResMsg",NBIZ_ID,SEG_SET_ID,SEG_ID,SEQ_ID);
}
function renderGR3(data){
	console.log("renderGR3");
	var sasJsonRes=eval(data)[0];
	dataGR3		=[];
	columnsGR3 =[];
	/*
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	columnsGR3.push(checkboxSelector.getColumnDefinition());
	console.log("JSON.stringify(columnsGR3) 1 :" + JSON.stringify(columnsGR3));
	columnsGR3=$.extend(sasJsonRes["ColumInfo"],columnsGR3);;
	console.log("JSON.stringify(columnsGR3) 2 :" + JSON.stringify(columnsGR3));
	*/
	columnsGR3=sasJsonRes["ColumInfo"];
	optionsGR3=sasJsonRes["Options"][0];
	dataGR3 = sasJsonRes["SASResult"];
	gridGR3 = new Slick.Grid("#dvGR3",  dataGR3, columnsGR3,  optionsGR3);
	gridGR3.setSelectionModel(new Slick.RowSelectionModel());
  gridGR3.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

  //gridGR3.registerPlugin(checkboxSelector);
	var columnpicker = new Slick.Controls.ColumnPicker(columnsGR3, gridGR3, optionsGR3); 

	gridGR3.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR3.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataGR3.sort(function (dataRow1, dataRow2) {
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
	  gridGR3.invalidate();
	  gridGR3.render();
	});	
	gridGR3.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR3.getCellFromEvent(e);
		if (gridGR3.getColumns()[cell.cell].id == "BKT_MAT_TYPE") {
			$("#contextMatType")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextMatType").hide();
			});
		}
	});  		
	$("#contextMatType").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR3.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR3[row].BKT_MAT_TYPE = $(e.target).attr("data");
		gridGR3.updateRow(row);
	});		
  gridGR3.onClick.subscribe(function (e) {
    var cell = gridGR3.getCellFromEvent(e);
    curRowGR3 = cell.row;
    if ( dataGR3.length > curRowGR3){
  	}
  });			
  gridGR3.onDblClick.subscribe(function (e) {
    var cell = gridGR3.getCellFromEvent(e);
    curRowGR3 = cell.row;
    if ( dataGR3.length > curRowGR3){	
	  	//saveGR3Row();
  	}
  });	  
  gridGR3.onCellChange.subscribe(function (e) {
		console.log("gridGR3.onCellChange");
    var cell = gridGR3.getCellFromEvent(e);
    console.log("gridGR3.onCellChange cell : " + JSON.stringify(cell));
  });	  
	gridGR3.onAddNewRow.subscribe(function (e, args) {
		console.log("gridGR3.onAddNewRow");
	  var item = args.item;
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  
		var curRowGR2 = gridGR2.getActiveCell().row;
		var MTRT_ID=curMTRT_ID;
		var SEG_SET_ID	= dataGR2[curRowGR2].SEG_SET_ID;
		var GRP_ID			= dataGR2[curRowGR2].GRP_ID;
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.SEG_MATURITY_SET","SEQ_ID",MTRT_ID,SEG_SET_ID,GRP_ID);
		d = new Date();		  
	  var SEQ_ID		=eval("("+'{"SEQ_ID":"' + 'SEQ_' + resData.toString().trim() + '"' + '}'+")");
	  var nextMonth ="";//eval(dataGR3[dataGR3.length].MONTH+1);
	  var MONTH			=eval("("+'{"MONTH":"' + nextMonth + '"' + '}'+")");
	  var NEW_BIZ		=eval("("+'{"NEW_BIZ":""' + '}'+")");

	  gridGR3.invalidateRow(dataGR3.length);
	  
    item = $.extend({},item,SEQ_ID);//,updateDT,useYN);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR3.push(item);
	  gridGR3.updateRowCount();
	  gridGR3.render();	
	  //saveGR3Row();
	})
}
function genCustCurve(){
	var curGR1Cell=gridGR1.getActiveCell();
	var curGR2Cell=gridGR2.getActiveCell();
	if (curGR1Cell==null){
		alertMsg("Select Prepayment.");
		return;
	}
	if (curGR2Cell==null){
		alertMsg("Select Prepayment.");
		return;
	}
	var dataGR1 = gridGR1.getData();
	var curRowGR1 = gridGR1.getActiveCell().row;
	var baseCurve="["+dataGR1[curRowGR1].ID+"] "+dataGR1[curRowGR1].NAME;
	$("#spBaseCurveInfo").html(baseCurve);
	$("#dvModalWin").show();
}
function genCustNewCurve(){
	var dataGR1 = gridGR1.getData();
	var curRowGR1 = gridGR1.getActiveCell().row;
	var ID=dataGR1[curRowGR1].ID;  
	var NAME=dataGR1[curRowGR1].NAME;  
	var GRP_SET_ID=dataGR1[curRowGR1].GRP_SET_ID;  
	
	var dataGR2 = gridGR2.getData();
	var curRowGR2 = gridGR2.getActiveCell().row;
	var GRP_ID=dataGR2[curRowGR2].GRP_ID;  

	var fn=dataNewCurve[0].fn;
	var sig=dataNewCurve[0].sig;
	var val=dataNewCurve[0].value;

  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_copyCustNewCurve(StoredProcess)","renderGR1",ID,GRP_SET_ID,NAME,fn,sig,val);	
	$("#dvModalWin").hide();
}
function manageID(){
	$("#dvModalID").css("left",eval(eval($(window).width()-$("#dvModalID").width()-40)/2));
	$("#dvModalID").css("top",eval(eval($(window).height()-$("#dvModalID").height()-60)/2));	
	$("#dvModalID").show();	
}
function initGrpListContextMenu(data){
	console.log("JSON.stringify(data): " +JSON.stringify(data));
	var sasJsonRes=eval(data)[0];
	var GrpList = sasJsonRes["SASResult"];
	console.log("grouList: " +GrpList);
	var ctxMenuStr="";
	for(var ii=0;ii<GrpList.length;ii++){
		var GRP_SET_ID=GrpList[ii].GRP_SET_ID;
		var GRP_SET_NAME=GrpList[ii].GRP_SET_NAME;
		ctxMenuStr+="<li data='" + GRP_SET_ID + "'>" + GRP_SET_NAME +"</li>";
	}
	$("#contextGrpSetList").html(ctxMenuStr);
}
function saveGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the User Definced Maturity Id.");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow(dataGR1.length);
  var curRow = gridGR1.getActiveCell().row;

	console.log("gridGR1.getActiveCell(): " + gridGR1.getActiveCell());
	if (!curRow) {
  	var curRow = gridGR1.getActiveCell().row;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}
  var MTRT_ID			= dataGR1[curRow].MTRT_ID;
  var MTRT_NAME		= dataGR1[curRow].MTRT_NAME;
  var GRP_SET_ID 	= dataGR1[curRow].GRP_SET_ID;
  var USE_YN 			= dataGR1[curRow].USE_YN;
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_saveMaturityListRow(StoredProcess)","alertResMsg",MTRT_ID,MTRT_NAME,GRP_SET_ID,USE_YN);
  
}
function saveGR3Row(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Group ID.");
		return;
	}
	if (gridGR3.getActiveCell() == null){
		alertMsg("Select the Sequence ID.");
		return;
	}
	if (!gridGR3.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR3.invalidateRow();

	console.log("saveGR3 started... ");
	//MTRT_ID GRP_SET_ID SEG_SET_ID GRP_ID SEQ_ID BKT_MAT BKT_MAT_TYPE WEIGHT
  isDisplayProgress=0;
  var cell = gridGR2.getActiveCell();
  console.log("saveGR3 JSON.stringify(cell) : " + JSON.stringify(cell));
	var curRowGR2 = gridGR2.getActiveCell().row;
  console.log("saveGR3 curRowGR2 : " + curRowGR2);
	var MTRT_ID=curMTRT_ID;
	var GRP_SET_ID	= dataGR2[curRowGR2].GRP_SET_ID;
	var SEG_SET_ID	= dataGR2[curRowGR2].SEG_SET_ID;
	var GRP_ID			= dataGR2[curRowGR2].GRP_ID;
			
	var dataGR3 = gridGR3.getData();
  console.log("saveGR3 JSON.stringify(dataGR3[curRowGR3]) : " + JSON.stringify(dataGR3[curRowGR3]));
	var curRowGR3 = gridGR3.getActiveCell().row;
	var SEQ_ID			=dataGR3[curRowGR3].SEQ_ID;  
	var BKT_MAT			=dataGR3[curRowGR3].BKT_MAT;  
	var BKT_MAT_TYPE=dataGR3[curRowGR3].BKT_MAT_TYPE;  
	var WEIGHT			=dataGR3[curRowGR3].WEIGHT;  
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_saveMaturitySetRow(StoredProcess)","alertResMsg",MTRT_ID,GRP_SET_ID,SEG_SET_ID,GRP_ID,SEQ_ID,BKT_MAT,BKT_MAT_TYPE,WEIGHT);

}
function deleteID(){
  if ( gridGR1.getActiveCell() == null) {
		alertMsg("Select the User Defined Maturity Set ID.");
		return;  	
  }
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteIDCF");
}
function deleteIDCF(){
  var dataGR1 = gridGR1.getData();
  var curRow = gridGR1.getActiveCell().row;
  var MTRT_ID = dataGR1[curRow].MTRT_ID;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_deleteMaturity(StoredProcess)","alertResMsg",MTRT_ID);
  dataGR1.splice(curRow,1);
  var row = curRow;
  while (row<dataGR1.length){
    gridGR1.invalidateRow(row);
    row++;
  }
  gridGR1.updateRowCount();
  gridGR1.render();
  gridGR1.scrollRowIntoView(curRow-1);  

}
function copyID(){
  if ( gridGR1.getActiveCell() == null) {
		alertMsg("Select the Based User Defined Maturity Set ID.");
		return;  	
  }
  curRow=gridGR1.getActiveCell().row;
	console.log("" + dataGR1[curRow].MTRT_ID);
	var MTRT_ID=dataGR1[curRow].MTRT_ID;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/mat001_copyMaturitySet(StoredProcess)","renderGR1",MTRT_ID);				
}