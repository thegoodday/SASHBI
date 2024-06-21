$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-58));
})
var grTable1;
var grTable2;
var	curCUST_BEHAVIOR;
var	curModel_ID;
var	curGRP_SET_ID;

$(document).ready(function () {
	$("#dvMain").height(eval($(window).height()-58));
	$("#dvGRPList").height(eval($(window).height()-558));
	
	$(".buttonArea").append("<input type='button' id='btnRun' class=condBtnSearch value='Modify' onclick='manageID();'>");
	//$("#dvINRTGraph").height(eval($(window).height()-322));
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_getGroupSetListContext(StoredProcess)","initGRPListContextMenu","","");				
	
	dataNewCurve		=[];
	columnsNewCurve =[];
	columnsNewCurve=[
    {id: "fn", name: "ABS/Relative", field: "fn", width: 120, editor: Slick.Editors.Dumm,cssClass: "c"},
    {id: "sig", name: "+/-", field: "sig", width: 120, editor: Slick.Editors.Dummy,cssClass: "c"},
    {id: "value", name: "Value", field: "value", width: 120,editor: Slick.Editors.Text,cssClass: "c"}
	];
	optionsNewCurve={
    editable: true,
    enableAddRow: false,
    enableCellNavigation: true,
    asyncEditorLoading: false,
    autoEdit: true
  };
	dataNewCurve = [{"fn": "ABS", "sig": "+", "value": "0"}];
	gridNewCurve = new Slick.Grid("#dvNewCurve",  dataNewCurve, columnsNewCurve,  optionsNewCurve);
  gridNewCurve.onClick.subscribe(function (e) {
    var cell = gridNewCurve.getCellFromEvent(e);
    var curRow = cell.row;
		if (gridNewCurve.getColumns()[cell.cell].id == "fn") {
			if (!gridNewCurve.getEditorLock().commitCurrentEdit()) {
				return;
			}
			var opt1L = { "ABS": "Relative", "Relative": "ABS"};
			dataNewCurve[cell.row].fn = opt1L[dataNewCurve[cell.row].fn];
			gridNewCurve.updateRow(cell.row);
			e.stopPropagation();
		}
		if (gridNewCurve.getColumns()[cell.cell].id == "sig") {
			if (!gridNewCurve.getEditorLock().commitCurrentEdit()) {
				return;
			}
			var opt2L = { "+": "-", "-": "+"};
			dataNewCurve[cell.row].sig = opt2L[dataNewCurve[cell.row].sig];
			gridNewCurve.updateRow(cell.row);
			e.stopPropagation();
		}
  });			
  
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-20)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-60)/2));	
  
});
var curCustGR1ID;
var gridCustGR1;
var dataCustGR1 = [];
var optionsCustGR1;
var columnsCustGR1;
var curRowCustGR1;

var curCustGR2ID;
var gridCustGR2;
var dataCustGR2 = [];
var optionsCustGR2;
var columnsCustGR2;
var curRowCustGR2;

var curCustGR3ID;
var gridCustGR3;
var dataCustGR3 = [];
var optionsCustGR3;
var columnsCustGR3;
var curRowCustGR3;

function alertResMsg(data){
	isDisplayProgress=0;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
}
function renderCustGR1(data){
	var sasJsonRes=eval(data)[0];
	dataCustGR1		=[];
	columnsCustGR1 =[];
	/*
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	columnsCustGR1.push(checkboxSelector.getColumnDefinition());
	console.log("JSON.stringify(columnsCustGR1) 1 :" + JSON.stringify(columnsCustGR1));
	columnsCustGR1=$.extend(sasJsonRes["ColumInfo"],columnsCustGR1);;
	console.log("JSON.stringify(columnsCustGR1) 2 :" + JSON.stringify(columnsCustGR1));
	*/
	columnsCustGR1=sasJsonRes["ColumInfo"];
	optionsCustGR1=sasJsonRes["Options"][0];
	dataCustGR1 = sasJsonRes["SASResult"];
	gridCustGR1 = new Slick.Grid("#dvPYMTList",  dataCustGR1, columnsCustGR1,  optionsCustGR1);
	gridCustGR1.setSelectionModel(new Slick.RowSelectionModel());
  gridCustGR1.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

  //gridCustGR1.registerPlugin(checkboxSelector);
	var columnpicker = new Slick.Controls.ColumnPicker(columnsCustGR1, gridCustGR1, optionsCustGR1); 

	gridCustGR1.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridCustGR1.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataCustGR1.sort(function (dataRow1, dataRow2) {
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
	  gridCustGR1.invalidate();
	  gridCustGR1.render();
	});	
	gridCustGR1.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridCustGR1.getCellFromEvent(e);
		if (gridCustGR1.getColumns()[cell.cell].id == "GRP_SET_NAME") {
			$("#contextMenu")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextMenu").hide();
			});
		}
		if (gridCustGR1.getColumns()[cell.cell].id == "CALC_TYPE_NAME") {
			$("#contextCalcType")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextCalcType").hide();
			});
		}
	});  		
	$("#contextMenu").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridCustGR1.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataCustGR1[row].GRP_SET_ID = $(e.target).attr("data");
		dataCustGR1[row].GRP_SET_NAME = $(e.target).html();
		gridCustGR1.updateRow(row);
		//saveGR1Save(row);
	});	
	$("#contextCalcType").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridCustGR1.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataCustGR1[row].TYPE = $(e.target).attr("data");
		dataCustGR1[row].CALC_TYPE_NAME = $(e.target).html();
		gridCustGR1.updateRow(row);
		//saveGR1Save(row);
	});	
  gridCustGR1.onClick.subscribe(function (e) {
  	console.log("gridCustGR1.onClick");
    var cell = gridCustGR1.getCellFromEvent(e);
    var curRow = cell.row;
    if ( dataCustGR1.length > curRow){
    	curCustGR1 = dataCustGR1[cell.row].ID;
    	console.log("onClick curRow : " + curRow);
			if (gridCustGR1.getColumns()[cell.cell].id == "GRP_ID") {
				if (!gridCustGR1.getEditorLock().commitCurrentEdit()) {
					return;
				}
				var unitMeasures = { "D": "M", "M": "Y", "Y": "D" };
				dataCustGR1[cell.row].UNIT_MEASURE = unitMeasures[dataCustGR1[cell.row].UNIT_MEASURE];
				gridCustGR1.updateRow(cell.row);
				e.stopPropagation();
			}
	    var ID 					= dataCustGR1[curRow].ID;
	    var NAME 				= dataCustGR1[curRow].NAME;
	    var BASE_DATE		= dataCustGR1[curRow].BASE_DATE;
	    var GRP_SET_ID	= dataCustGR1[curRow].GRP_SET_ID;
	    var USE_YN 			= dataCustGR1[curRow].USE_YN;
	    console.log("gridCustGR1 onClick curRow : " + curRow + ":" + ID+":" + NAME+ ":" +BASE_DATE+ ":" +GRP_SET_ID+ ":" +USE_YN);
	    isDisplayProgress=0;
	    isDisplayProgress=0;
	    isDisplayProgress=0;
	    //$("#dvCustGraph svg").html("");
	    //console.log("dvCustGraph svg html:" + $("#dvCustGraph svg").html());
  	}
  });			
  gridCustGR1.onDblClick.subscribe(function (e) {
  	console.log("gridCustGR1.onDblClick");
    var cell = gridCustGR1.getCellFromEvent(e);
    var curRow = cell.row;
    var GRP_SET_ID = dataCustGR1[curRow].GRP_SET_ID;
    //var INRT_ID = dataCustGR1[curRow].INRT_ID;
    console.log("gridCustGR1 onDblClick GRP_SET_ID : " + GRP_SET_ID);
    if ( dataCustGR1.length > curRow){
			//saveGR1Row();
  	}
  });	  
  gridCustGR1.onCellChange.subscribe(function (e) {
  	console.log("gridCustGR1.onCellChange");  	
		//var curRow=saveGR1Save();
		var curRow = gridGR1.getActiveCell().row;

		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataCustGR1[curRow].UPDATE_DT=d.yyyymmdd();
	  gridCustGR1.invalidate();
	  gridCustGR1.render();
  });	  
	gridCustGR1.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridCustGR1.invalidateRow(dataCustGR1.length);
		curCUST_BEHAVIOR=$("#sltCUST_BEHAVIOR option:selected").val();
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_getNextIDCB(StoredProcess)",curCUST_BEHAVIOR,"CUST_BHVR_ID");
		d = new Date();		  
	  var CUST_BHVR_ID=eval("("+'{"CUST_BHVR_ID":"' + resData.toString().trim() + '"' + '}'+")");
	  var BASE_DATE=eval("("+'{"BASE_DATE":"' + d.yyyymmdd() + '"' + '}'+")");
	  var GRP_SET_ID=eval("("+'{"GRP_SET_ID":"' + "" + '"' + '}'+")");
	  var USE_YN=eval("("+'{"USE_YN":"1"' + '}'+")");
	  var UPDATE_DT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({},item,CUST_BHVR_ID,BASE_DATE,GRP_SET_ID,USE_YN,UPDATE_DT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataCustGR1.push(item);
	  gridCustGR1.updateRowCount();
	  gridCustGR1.render();	
		//saveGR1Save();
	})	
	//get_Cust_ID();	
}
function renderCustGR2(data){
	var sasJsonRes=eval(data)[0];
	dataCustGR2		=[];
	columnsCustGR2 =[];
	/*
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	columnsCustGR2.push(checkboxSelector.getColumnDefinition());
	console.log("JSON.stringify(columnsCustGR2) 1 :" + JSON.stringify(columnsCustGR2));
	columnsCustGR2=$.extend(sasJsonRes["ColumInfo"],columnsCustGR2);;
	console.log("JSON.stringify(columnsCustGR2) 2 :" + JSON.stringify(columnsCustGR2));
	*/
	columnsCustGR2=sasJsonRes["ColumInfo"];
	optionsCustGR2=sasJsonRes["Options"][0];
	dataCustGR2 = sasJsonRes["SASResult"];
	gridCustGR2 = new Slick.Grid("#dvGRPList",  dataCustGR2, columnsCustGR2,  optionsCustGR2);
	gridCustGR2.setSelectionModel(new Slick.RowSelectionModel());
  gridCustGR2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

  //gridCustGR2.registerPlugin(checkboxSelector);
	var columnpicker = new Slick.Controls.ColumnPicker(columnsCustGR2, gridCustGR2, optionsCustGR2); 

	gridCustGR2.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridCustGR2.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataCustGR2.sort(function (dataRow1, dataRow2) {
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
	  gridCustGR2.invalidate();
	  gridCustGR2.render();
	});	
  gridCustGR2.onClick.subscribe(function (e) {
    var cell = gridCustGR2.getCellFromEvent(e);
    var curRow = cell.row;
    if ( dataCustGR2.length > curRow){
    	var ID 					= curModel_ID;
    	console.log("gridCustGR2.onClick ID : " + ID);
    	var GRP_SET_ID 	= dataCustGR2[curRow].GRP_SET_ID;
	    var GRP_ID			= dataCustGR2[curRow].GRP_ID;
	    isDisplayProgress=0;
			execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_getCustBehaviorGR3(StoredProcess)","renderCustGR3",curCUST_BEHAVIOR,ID,GRP_SET_ID,GRP_ID);
			execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_getCustBehaviorGraph(StoredProcess)","renderCustGraph",curCUST_BEHAVIOR,ID,GRP_SET_ID,GRP_ID);

  	}
  });			
  gridCustGR2.onDblClick.subscribe(function (e) {
    var cell = gridCustGR2.getCellFromEvent(e);
    var curRow = cell.row;
    console.log("gridCustGR2 onDblClick curRow : " + curRow + " dataCustGR2 length: " + dataCustGR2.length );
    if ( dataCustGR2.length > curRow){
  	}
  });	  
  gridCustGR2.onCellChange.subscribe(function (e) {
    var INRT_ID 		= dataCustGR2[curRow].INRT_ID;
    var BASE_DATE 	= dataCustGR2[curRow].BASE_DATE;
    var TERM 				= dataCustGR2[curRow].TERM;
    var UNIT_MEASURE= dataCustGR2[curRow].UNIT_MEASURE;
    var RATE 				= dataCustGR2[curRow].RATE;
    var USE_YN 			= dataCustGR2[curRow].USE_YN;
    console.log("gridCustGR2 onCellChange curRow : " + curRow + ":" + INRT_ID+":" + BASE_DATE+ ":" +TERM+ ":" +UNIT_MEASURE+ ":" +RATE+ "USE_YN:" +USE_YN);
    isDisplayProgress=0;
		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_saveIntrstSetRow(StoredProcess)","alertResMsg",INRT_ID,BASE_DATE,TERM,UNIT_MEASURE,RATE,USE_YN);
		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataCustGR2[curRow].UPDATE_DT=d.yyyymmdd();
	  gridCustGR2.invalidate();
	  gridCustGR2.render();

  });	  
	gridCustGR2.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridCustGR2.invalidateRow(dataCustGR2.length);
		d = new Date();		  
	  var inrtID=eval("("+'{"INRT_ID":"INRT_' + dataCustGR3[curRowINRTList].INRT_ID + '"' + '}'+")");
	  var baseDT=eval("("+'{"BASE_DATE":"' + dataCustGR3[curRowINRTList].BASE_DATE + '"' + '}'+")");
	  var unitM=eval("("+'{"UNIT_MEASURE":"' + "D" + '"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"false"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({},item,inrtID,baseDT,unitM,useYN,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataCustGR2.push(item);
	  gridCustGR2.updateRowCount();
	  gridCustGR2.render();	
	})
}
function initCalcTypeContextMenu(data){
	var sasJsonRes=eval(data)[0];
	var GRPList = sasJsonRes["SASResult"];
	console.log("GRPList: " +GRPList);
	var ctxMenuStr="";
	for(var ii=0;ii<GRPList.length;ii++){
		var CALC_TYPE_ID=GRPList[ii].CALC_TYPE_ID;
		var CALC_TYPE_NAME=GRPList[ii].CALC_TYPE_NAME;
		ctxMenuStr+="<li data='" + CALC_TYPE_ID + "'>" + CALC_TYPE_NAME +"</li>";
	}
	$("#contextCalcType").html(ctxMenuStr);
}
function initGRPListContextMenu(data){
	var sasJsonRes=eval(data)[0];
	var GRPList = sasJsonRes["SASResult"];
	console.log("GRPList: " +GRPList);
	var ctxMenuStr="";
	for(var ii=0;ii<GRPList.length;ii++){
		var GRP_SET_ID=GRPList[ii].GRP_SET_ID;
		var GRP_SET_NAME=GRPList[ii].GRP_SET_NAME;
		ctxMenuStr+="<li data='" + GRP_SET_ID + "'>" + GRP_SET_NAME +"</li>";
	}
	$("#contextMenu").html(ctxMenuStr);

    $("#dvModalID").hide();
}
function saveGR1Save(curRow){
}
function deleteGR1(){
	if (gridCustGR1.getActiveCell() == null){
		alertMsg("Select the Customer Behavior ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteGR1CF");
}
function deleteGR1CF(){
  var dataCustGR1 = gridCustGR1.getData();
  var current_row = gridCustGR1.getActiveCell().row;
  var CUST_BHVR_ID=dataCustGR1[current_row].CUST_BHVR_ID;
  console.log("deleteGR1 CUST_BHVR_ID: " + CUST_BHVR_ID);
  dataCustGR1.splice(current_row,1);
  var r = current_row;
  while (r<dataCustGR1.length){
    gridCustGR1.invalidateRow(r);
    r++;
  }
  gridCustGR1.updateRowCount();
  gridCustGR1.render();
  gridCustGR1.scrollRowIntoView(current_row-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_deleteCustBehaviorRow(StoredProcess)","alertResMsg",CUST_BHVR_ID);
}
function renderCustGR3(data){
	console.log("renderCustGR3");
	var sasJsonRes=eval(data)[0];
	dataCustGR3		=[];
	columnsCustGR3 =[];
	/*
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	columnsCustGR3.push(checkboxSelector.getColumnDefinition());
	console.log("JSON.stringify(columnsCustGR3) 1 :" + JSON.stringify(columnsCustGR3));
	columnsCustGR3=$.extend(sasJsonRes["ColumInfo"],columnsCustGR3);;
	console.log("JSON.stringify(columnsCustGR3) 2 :" + JSON.stringify(columnsCustGR3));
	*/
	columnsCustGR3=sasJsonRes["ColumInfo"];
	optionsCustGR3=sasJsonRes["Options"][0];
	dataCustGR3 = sasJsonRes["SASResult"];
	gridCustGR3 = new Slick.Grid("#dvCustRate",  dataCustGR3, columnsCustGR3,  optionsCustGR3);
	gridCustGR3.setSelectionModel(new Slick.RowSelectionModel());
  gridCustGR3.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

  //gridCustGR3.registerPlugin(checkboxSelector);
	var columnpicker = new Slick.Controls.ColumnPicker(columnsCustGR3, gridCustGR3, optionsCustGR3); 

	gridCustGR3.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridCustGR3.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataCustGR3.sort(function (dataRow1, dataRow2) {
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
	  gridCustGR3.invalidate();
	  gridCustGR3.render();
	});	
  gridCustGR3.onClick.subscribe(function (e) {
    var cell = gridCustGR3.getCellFromEvent(e);
    curRowCustGR3 = cell.row;
    if ( dataCustGR3.length > curRowCustGR3){
  	}
  });			
  gridCustGR3.onDblClick.subscribe(function (e) {
    var cell = gridCustGR3.getCellFromEvent(e);
    curRowCustGR3 = cell.row;
    console.log("gridCustGR3 onDblClick curRowCustGR3 : " + curRowCustGR3 + " dataCustGR3 length: " + dataCustGR3.length );
    if ( dataCustGR3.length > curRowCustGR3){
  	}
  });	  
  gridCustGR3.onCellChange.subscribe(function (e) {
  	//saveGR3Row();
		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataCustGR3[curRowCustGR3].UPDATE_DT=d.yyyymmdd();
	  gridCustGR3.invalidate();
	  gridCustGR3.render();
  });	  
	gridCustGR3.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		gridCustGR3.invalidateRow(dataCustGR3.length);
		/*
		var dataCustGR1 = gridCustGR1.getData();
		console.log("gridCustGR1.getActiveCell():" + gridCustGR1.getActiveCell());
		var curRowCustGR1 = gridCustGR1.getActiveCell().row;
		var ID=dataCustGR1[curRowCustGR1].ID;  
		var GRP_SET_ID=dataCustGR1[curRowCustGR1].GRP_SET_ID;  
		*/
		var ID=curModel_ID;  
		
		if (gridCustGR2.getActiveCell() == null){
			alertMsg("Select the Classification.");
			return;
		}
		var dataCustGR2 = gridCustGR2.getData();
		var curRowCustGR2 = gridCustGR2.getActiveCell().row;
		var GRP_SET_ID=dataCustGR2[curRowCustGR2].GRP_SET_ID;  
		var GRP_ID=dataCustGR2[curRowCustGR2].GRP_ID;  
		console.log("gridCustGR3.onAddNewRow: " + ":"+GRP_SET_ID+":"+GRP_ID);
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_getNextIDCB(StoredProcess)","ALMConf.CUST_BEHAVIOR_SET","SEQ_ID",curCUST_BEHAVIOR,ID,GRP_SET_ID,GRP_ID);
		d = new Date();		  
		// ID 		GRP_SET_ID 		GRP_ID 		SEQ_ID 		TERM 		RATE 		USE_YN 		UPDATE_DT
		var cid=eval("("+'{"ID":"' + ID + '"' + '}'+")");
		var CUST_BHVR_ID=eval("("+'{"CUST_BHVR_ID":"' + curModel_ID + '"' + '}'+")");
		var GRPSetID=eval("("+'{"GRP_SET_ID":"' + GRP_SET_ID + '"' + '}'+")");
		var GRPID=eval("("+'{"GRP_ID":"' + GRP_ID + '"' + '}'+")");
		var seqID=eval("("+'{"SEQ_ID":"' + resData.toString().trim() + '"' + '}'+")");
		var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
		var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
		
		item = $.extend({},item,cid,CUST_BHVR_ID,GRPSetID,GRPID,seqID,useYN,updateDT);
		console.log("JSON.stringify(item) : " + JSON.stringify(item));
		dataCustGR3.push(item);
		gridCustGR3.updateRowCount();
		gridCustGR3.render();	
	})
}
function deleteRate(){
	if (gridCustGR3.getActiveCell() == null){
		alertMsg("Select the Sequence ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteRateCF");
}
function deleteRateCF(){
  var dataCustGR3 = gridCustGR3.getData();
  var current_row = gridCustGR3.getActiveCell().row;
  var MODEL_TYPE=dataCustGR3[current_row].MODEL_TYPE;
  var CUST_BHVR_ID=dataCustGR3[current_row].CUST_BHVR_ID;
  var GRP_SET_ID=dataCustGR3[current_row].GRP_SET_ID;
  var GRP_ID		=dataCustGR3[current_row].GRP_ID;
  var SEQ_ID		=dataCustGR3[current_row].SEQ_ID;
  dataCustGR3.splice(current_row,1);
  var r = current_row;
  while (r<dataCustGR3.length){
    gridCustGR3.invalidateRow(r);
    r++;
  }
  gridCustGR3.updateRowCount();
  gridCustGR3.render();
  gridCustGR3.scrollRowIntoView(current_row-1);  

  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_deleteCustBehaviorGR3(StoredProcess)","alertResMsg",MODEL_TYPE,CUST_BHVR_ID,GRP_SET_ID,GRP_ID,SEQ_ID);
}
function genCustCurve(){
	if (gridCustGR1.getActiveCell() == null){
		alertMsg("Select the Based Customer Behavior ID.");
		return;
	}
	var curGR1Cell=gridCustGR1.getActiveCell();
	//var curGR2Cell=gridCustGR2.getActiveCell();
	if (curGR1Cell==null){
		alertMsg("Select the Customer Behavior Model ID.");
		return;
	}
	/*
	if (curGR2Cell==null){
		alertMsg("Select Prepayment...");
		return;
	}
	*/
	var dataCustGR1 = gridCustGR1.getData();
	var curRowCustGR1 = gridCustGR1.getActiveCell().row;
	var baseCurve="["+dataCustGR1[curRowCustGR1].ID+"] "+dataCustGR1[curRowCustGR1].NAME;
	$("#spBaseCurveInfo").html(baseCurve);
	$("#dvModalWin").show();
}
function genCustNewCurve(){
	if (!gridNewCurve.getEditorLock().commitCurrentEdit()) {
		return;
	}	

	var dataCustGR1 = gridCustGR1.getData();
	var curRowCustGR1 = gridCustGR1.getActiveCell().row;
	var CUST_BHVR_ID=dataCustGR1[curRowCustGR1].CUST_BHVR_ID;  
	var GRP_SET_ID=dataCustGR1[curRowCustGR1].GRP_SET_ID;  
	/*
	var dataCustGR2 = gridCustGR2.getData();
	var curRowCustGR2 = gridCustGR2.getActiveCell().row;
	var GRP_ID=dataCustGR2[curRowCustGR2].GRP_ID;  
	*/
	var fn=dataNewCurve[0].fn;
	var sig=dataNewCurve[0].sig;
	var val=dataNewCurve[0].value;

	console.log("curCUST_BEHAVIOR :" + curCUST_BEHAVIOR);
	if(curCUST_BEHAVIOR == undefined) curCUST_BEHAVIOR=$("#sltCUST_BEHAVIOR option:selected").val();
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_getCustBehaviorNewCurve(StoredProcess)","renderCustGR1",curCUST_BEHAVIOR,CUST_BHVR_ID,GRP_SET_ID,fn,sig,val);	
	$("#dvModalWin").hide();
}
function renderCustGraph(data){
	$("#dvCustGraph svg").html("");
	var chart;
	nv.addGraph(function() {
	  chart = nv.models.lineChart()
	  .useInteractiveGuideline(true)
	  .color(d3.scale.category10().range())
		.interpolate("basis")
	  .options({
	    margin: {left: 60, bottom: 45},
	    x: function(d,i) {return d[0]},
	    y: function(d) {return d[1]},
	    showXAxis: true,
	    showYAxis: true,
	    transitionDuration: 250
	  })
	  ;
	
	  // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
	  chart.xAxis
	    .axisLabel("Term")
	    .tickFormat(d3.format(',.0f'));
	    ;
	  chart.yAxis
	    .axisLabel("Rate")
	    .tickFormat(d3.format(',.4f'));
	
	  d3.select("#dvCustGraph svg")
	    .datum(data)
	    .call(chart);
	
	  //TODO: Figure out a good way to do this automatically
	  nv.utils.windowResize(chart.update);
	  //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });
	
	  //chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
	
	  return chart;
	});
}
function manageID(){
	//$("#dvModalID").css("width","800px");
	MODEL_TYPE=$("#sltCUST_BEHAVIOR option:selected").val();
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_getCalcTypeContext(StoredProcess)","initCalcTypeContextMenu",MODEL_TYPE);				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_getCustBehaviorGR1(StoredProcess)","renderCustGR1",MODEL_TYPE);				

	$("#dvModalID").css("left",eval(eval($(window).width()-$("#dvModalID").width()-40)/2));
	$("#dvModalID").css("top",eval(eval($(window).height()-$("#dvModalID").height()-60)/2));	
	$("#dvModalID").show();	

}
function closeGRPMngModal(){
	$('#dvModalID').hide();
}
function saveGR1Row(){
	if (gridCustGR1.getActiveCell() == null){
		alertMsg("Select the Customer Behavior ID.");
		return;
	}
	if (!gridCustGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridCustGR1.invalidateRow(dataCustGR1.length);
  var curRow = gridCustGR1.getActiveCell().row;

	var MODEL_TYPE=$("#sltCUST_BEHAVIOR option:selected").val();
  var CUST_BHVR_ID	= dataCustGR1[curRow].CUST_BHVR_ID;
  var CUST_BHVR_NAME= dataCustGR1[curRow].CUST_BHVR_NAME;
  var BASE_DATE 	= dataCustGR1[curRow].BASE_DATE;
  var GRP_SET_ID 	= dataCustGR1[curRow].GRP_SET_ID;
  var TYPE 				= dataCustGR1[curRow].TYPE;
  var USE_YN 			= dataCustGR1[curRow].USE_YN;
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_saveCustBehaviorGR1Row(StoredProcess)","alertResMsg",MODEL_TYPE,CUST_BHVR_ID,CUST_BHVR_NAME,BASE_DATE,GRP_SET_ID,USE_YN,TYPE);
	console.log("After execSTPA saveGR1Save");
	//get_Cust_ID();
}
function saveGR3Row(){
	if (gridCustGR3.getActiveCell() == null){
		alertMsg("Select the Sequence ID...");
		return;
	}
	if (!gridCustGR3.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridCustGR3.invalidateRow();

  isDisplayProgress=0;
	var dataCustGR3 = gridCustGR3.getData();
  var curRowCustGR3 = gridCustGR3.getActiveCell().row;
	var ID=dataCustGR3[curRowCustGR3].CUST_BHVR_ID;  
	var GRP_SET_ID=dataCustGR3[curRowCustGR3].GRP_SET_ID;  
	var GRP_ID=dataCustGR3[curRowCustGR3].GRP_ID;  
	var SEQ_ID=dataCustGR3[curRowCustGR3].SEQ_ID;  
	var TERM=dataCustGR3[curRowCustGR3].TERM; 
	if (typeof TERM == "undefined") TERM=".";
	var USE_YN=dataCustGR3[curRowCustGR3].USE_YN;  
	var RATE=dataCustGR3[curRowCustGR3].RATE;  
	if (typeof RATE == "undefined") RATE=".";
	console.log("saveCustGR3Row TERM: "+TERM); 
	console.log("saveCustGR3Row RATE: "+RATE); 
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_saveCustBehaviorGR3(StoredProcess)","alertResMsg",curCUST_BEHAVIOR,ID,GRP_SET_ID,GRP_ID,SEQ_ID,TERM,RATE,USE_YN);
}