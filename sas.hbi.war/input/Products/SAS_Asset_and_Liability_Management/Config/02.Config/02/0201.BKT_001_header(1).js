$(document).ready(function () {
	$("#dvBKTSet").height(eval($(window).height()-403));
	$("#dvMain").height(eval($(window).height()-58));
	//execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/bkt001_getBucketList(StoredProcess)","renderBKTList");			
})
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-58));
	$("#dvBKTSet").height(eval($(window).height()-403));
});
var curBKTListID;
var gridGR1;
var dataGR1 = [];
var optionsGR1;
var columnsGR1;
var curRowGR1;
	
var curBKTSetID;
var gridGR2;
var dataGR2 = [];
var optionsGR2;
var columnsGR2;
var curRowGR2;

function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
}

function renderBKTList(data){
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
	var  optionsGR1=sasJsonRes["Options"][0];
	dataGR1 = sasJsonRes["SASResult"];
	gridGR1 = new Slick.Grid("#dvBKTList",  dataGR1, columnsGR1,  optionsGR1);
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
    var cell = gridGR1.getCellFromEvent(e);
    curRowGR1 = cell.row;
    if ( dataGR1.length > curRowGR1){
    	curBKTListID = dataGR1[cell.row].BKT_ID;
    	console.log("onClick curBKTListID : " + curBKTListID);
    	isDisplayProgress=0;
		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/bkt001_getBucketSet(StoredProcess)","renderBKTSet",curBKTListID);			
  	}
  });			
  gridGR1.onDblClick.subscribe(function (e) {
    var cell = gridGR1.getCellFromEvent(e);
    curRowGR1 = cell.row;
    if ( dataGR1.length > curRowGR1){
    	//saveGR1Row();
  	}
  });	  
  gridGR1.onCellChange.subscribe(function (e) {
		console.log("JSON.stringify(dataGR1) :" + JSON.stringify(dataGR1));
		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataGR1[curRowGR1].BASE_YYMM=baseYM.substring(0,7);
    dataGR1[curRowGR1].UPDATE_DT=d.yyyymmdd();
	  gridGR1.invalidate();
	  gridGR1.render();

  });	  
	gridGR1.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridGR1.invalidateRow(dataGR1.length);
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.BUCKET_LIST","BKT_ID");
    isDisplayProgress=1;
	  var bktID=eval("("+'{"BKT_ID":"BKT_' + resData.toString().trim() + '"' + '}'+")");
	  console.log("JSON.stringify(bktID)" + JSON.stringify(bktID));
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
		d = new Date();		  
		var baseYM=eval("("+'{"BASE_YYMM":"' + d.yyyymmdd() + '"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({}, item, bktID, baseYM, useYN, updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  gridGR1.render();	
	})	    
}
function renderBKTSet(data){
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
	var  optionsGR2=sasJsonRes["Options"][0];
	dataGR2 = sasJsonRes["SASResult"];
	gridGR2 = new Slick.Grid("#dvBKTSet",  dataGR2, columnsGR2,  optionsGR2);
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
	gridGR2.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR2.getCellFromEvent(e);
		if (gridGR2.getColumns()[cell.cell].id == "BKT_MAT_TYPE") {
			$("#contextBKTMat")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextBKTMat").hide();
			});
		}		
	});  				
	$("#contextBKTMat").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR2.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		dataGR2[row].BKT_MAT_TYPE = $(e.target).attr("data");
		gridGR2.updateRow(row);
		//saveGR2Row();
	});		
  gridGR2.onClick.subscribe(function (e) {
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
    if ( dataGR2.length > curRowGR2){
    	curBKTSetID = dataGR2[cell.row].ATTR_SET_ID;
    	console.log("onClick curBKTSetID : " + curBKTSetID);
  	}
  	/*
		if (gridGR2.getColumns()[cell.cell].id == "BKT_MAT_TYPE") {
			if (!gridGR2.getEditorLock().commitCurrentEdit()) {
				return;
			}
			var matType = { "D": "M", "M": "Y", "Y": "D" };
			dataGR2[cell.row].BKT_MAT_TYPE = matType[dataGR2[cell.row].BKT_MAT_TYPE];
	    dataGR2[curRowGR2].SEQ_NAME=dataGR2[curRowGR2].BKT_MAT + dataGR2[curRowGR2].BKT_MAT_TYPE;
			gridGR2.updateRow(cell.row);
			e.stopPropagation();
		}
		*/
  });			
  gridGR2.onDblClick.subscribe(function (e) {
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
    if ( dataGR2.length > curRowGR2){
    	//saveGR2Row();
  	}
  });	  
  gridGR2.onCellChange.subscribe(function (e) {
		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataGR2[curRowGR2].SEQ_NAME=SEQ_NAME;
    dataGR2[curRowGR2].UPDATE_DT=d.yyyymmdd();
	  gridGR2.invalidate();
	  gridGR2.render();

  });	  
	gridGR2.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridGR2.invalidateRow(dataGR2.length);
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.BUCKET_SET","SEQ_ID",curBKTListID);
    isDisplayProgress=1;
	  var bktID=eval("("+'{"BKT_ID":"' + curBKTListID.trim() + '"' + '}'+")");
	  var bkSeqID=eval("("+'{"SEQ_ID":"SEQ_' + resData.toString().trim() + '"' + '}'+")");
	  //var seqName=eval("("+'{"SEQ_NAME":"input the Seq Name..."' + '}'+")");
	  //var bkMat=eval("("+'{"BKT_MAT":"1' + "" + '"' + '}'+")");
	  var bkMatType=eval("("+'{"BKT_MAT_TYPE":"D' + "" + '"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
		d = new Date();		  
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({}, item,bktID, bkSeqID, bkMatType,useYN,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR2.push(item);
	  gridGR2.updateRowCount();
	  gridGR2.render();	
	})	    	
}
function deleteBucket(){
  var dataGR1 = gridGR1.getData();
  console.log("gridGR1.getActiveCell() : " + gridGR1.getActiveCell());
  if ( gridGR1.getActiveCell() == null) {
		alertMsg("Select the Bucket...");
		return;  	
  }
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteBucketCF");
}
function deleteBucketCF(){
  var current_row = gridGR1.getActiveCell().row;
  var BKT_ID				=dataGR1[current_row].BKT_ID;
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
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/bkt001_deleteBucketRow(StoredProcess)","alertResMsg",BKT_ID);
}
function saveGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Bucket...");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow(dataGR1.length);
  var curRow = gridGR1.getActiveCell().row;

  var bktID = dataGR1[curRow].BKT_ID;
  var bktName = dataGR1[curRow].BKT_NAME;
  var baseYM = dataGR1[curRow].BASE_YYMM;
  var USE_YN = dataGR1[curRow].USE_YN;
  if (baseYM.length == 7) baseYM=baseYM+"-01";
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/bkt001_saveBucketListRow(StoredProcess)","alertResMsg",bktID,bktName,baseYM,USE_YN);
}
function saveGR2Row(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Bucket...");
		return;
	}
	if (!gridGR2.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	//gridGR2.invalidateRow(dataGR2.length);
  var curRow = gridGR2.getActiveCell().row;

  var BKT_ID = dataGR2[curRow].BKT_ID;
  var SEQ_ID = dataGR2[curRow].SEQ_ID;
  var SEQ_NAME = dataGR2[curRow].SEQ_NAME;
  var BKT_MAT = dataGR2[curRow].BKT_MAT;
  var BKT_MAT_TYPE = dataGR2[curRow].BKT_MAT_TYPE;
  var SEQ_NAME = BKT_MAT + BKT_MAT_TYPE;
  var USE_YN = dataGR2[curRow].USE_YN;

	dataGR2[curRow].SEQ_NAME = SEQ_NAME;
  gridGR2.updateRowCount();
  gridGR2.invalidate();
  console.log("dataGR2[curRow].SEQ_NAME : " + dataGR2[curRow].SEQ_NAME);

  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/bkt001_saveBucketSetRow(StoredProcess)","alertResMsg",BKT_ID,SEQ_ID,BKT_MAT,BKT_MAT_TYPE,USE_YN);
	/*
	var SEQ_NAME=eval("("+'{"SEQ_NAME":"' + SEQ_NAME + '"' + '}'+")");
  item = $.extend({}, SEQ_NAME);
  console.log("JSON.stringify(item) : " + JSON.stringify(item));
  dataGR2.push(item);
  gridGR2.updateRowCount();
  gridGR2.render();	
  */
	
}
function delBKTSet(){
  if ( gridGR2.getActiveCell() == null) {
		alertMsg("Select the Sequence ID...");
		return;  	
  }

	var isDelete = confirmMsg("Are you sure you want to delete selected Sequence ID?","delBKTSetCF");
}
function delBKTSetCF(){
  var dataGR2 = gridGR2.getData();
  var current_row = gridGR2.getActiveCell().row;
  var BKT_ID = dataGR2[current_row].BKT_ID;
  var SEQ_ID = dataGR2[current_row].SEQ_ID;
  console.log("BKT_ID : SEQ_ID = " + BKT_ID + ":" + SEQ_ID );
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/02/bkt001_deleteBucketSeqRow(StoredProcess)","alertResMsg",BKT_ID,SEQ_ID);

  dataGR2.splice(current_row,1);
  var r = current_row;
  while (r<dataGR2.length){
    gridGR2.invalidateRow(r);
    r++;
  }
  gridGR2.updateRowCount();
  gridGR2.render();
  gridGR2.scrollRowIntoView(current_row-1);  

}