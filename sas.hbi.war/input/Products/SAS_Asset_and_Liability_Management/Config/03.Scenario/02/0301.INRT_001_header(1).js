$(document).ready(function () {
	$("#dvMain").height(eval($(window).height()-52));
	//$("#dvINRTList").height(eval($(window).height()-438));
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_getIntrstList(StoredProcess)","renderINRTList");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_getIntrstSet(StoredProcess)","renderINRTSet","","");				
});
$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-52));
	//$("#dvMain").height(eval($(window).height()-58));
	//$("#dvINRTList").height(eval($(window).height()-538));
	//$("#dvINRTSet").height(eval($(window).height()-470));
	//$("#dvINRTGraph").height(eval($(window).height()-470));
})
var gridNewCurve;
var dataNewCurve = [];
var optionsNewCurve;
var columnsNewCurve;


/*
*/
//var curINRTSetID;
var gridGR1;
var dataGR1 = [];
var optionsGR1;
var columnsGR1;
var curRowGR1;

var curINRTSetID;
var gridGR2;
var dataGR2 = [];
var optionsGR2;
var columnsGR2;
var curRowGR2;

$(document).ready(function () {
	dataNewCurve		=[];
	columnsNewCurve =[];
	columnsNewCurve=[
    {id: "fn", name: "Absolute/Relative(%)", field: "fn", width: 120, editor: Slick.Editors.Dumm,cssClass: "c"},
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
    curRowGR2 = cell.row;
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

function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
}

function renderINRTList(data){
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
	gridGR1 = new Slick.Grid("#dvINRTList",  dataGR1, columnsGR1,  optionsGR1);
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
    	curINRTSetID = dataGR1[cell.row].INRT_ID;
    	console.log("onClick curINRTSetID : " + curINRTSetID);
	    var BASE_DATE = dataGR1[curRowGR1].BASE_DATE;
	    var INRT_ID = dataGR1[curRowGR1].INRT_ID;
    	isDisplayProgress=0;
			execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_getIntrstSet(StoredProcess)","renderINRTSet",BASE_DATE,INRT_ID);			
			execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_getIntrstGraph(StoredProcess)","renderINRTGraphD3",INRT_ID);			
  	}
  });			
  gridGR1.onDblClick.subscribe(function (e) {
    var cell = gridGR1.getCellFromEvent(e);
    curRowGR1 = cell.row;
    if ( dataGR1.length > curRowGR1){
	    var BASE_DATE = dataGR1[curRowGR1].BASE_DATE;
	    var INRT_ID = dataGR1[curRowGR1].INRT_ID;
			//execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_getIntrstSet(StoredProcess)","renderINRTSet",BASE_DATE,INRT_ID);			
  	}
  });	  
  gridGR1.onCellChange.subscribe(function (e) {
  });	  
	gridGR1.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridGR1.invalidateRow(dataGR1.length);
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.INTEREST_RATE_LIST","INRT_ID");
    isDisplayProgress=1;
		console.log("gridGR1 resData: " + resData);
		d = new Date();		  
	  var inrtID=eval("("+'{"INRT_ID":"INRT_' + resData.toString().trim() + '"' + '}'+")");
	  var baseDT=eval("("+'{"BASE_DATE":"' + d.yyyymmdd() + '"' + '}'+")");
	  var INRT_RATE_YN=eval("("+'{"INRT_RATE_YN":"1"' + '}'+")");
	  var DSCT_RATE_YN=eval("("+'{"DSCT_RATE_YN":"1"' + '}'+")");
	  var FTP_RATE_YN=eval("("+'{"FTP_RATE_YN":"1"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({},item,inrtID,baseDT,INRT_RATE_YN,DSCT_RATE_YN,FTP_RATE_YN,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  gridGR1.render();	
	})
}
function renderINRTSet(data){

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
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path);
	
	columnsGR2=sasJsonRes["ColumInfo"];
	var  optionsGR2=sasJsonRes["Options"][0];
	dataGR2 = sasJsonRes["SASResult"];
	gridGR2 = new Slick.Grid("#dvINRTSet",  dataGR2, columnsGR2,  optionsGR2);
	gridGR2.setSelectionModel(new Slick.RowSelectionModel());
  gridGR2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

  //gridGR2.registerPlugin(checkboxSelector);
	var columnpicker = new Slick.Controls.ColumnPicker(columnsGR2, gridGR2, optionsGR2); 

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
		if (gridGR2.getColumns()[cell.cell].id == "UNIT_MEASURE") {
			console.log("gridGR2.getColumns()[cell.cell].id : " + gridGR2.getColumns()[cell.cell].id);
			$("#contextUnit")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextUnit").hide();
			});
		}		
	});  				
	$("#contextUnit").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR2.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		dataGR2[row].UNIT_MEASURE = $(e.target).attr("data");
		gridGR2.updateRow(row);
		//saveGR2Row();
	});			
  gridGR2.onClick.subscribe(function (e) {
		console.log("gridGR2.onClick");
		/*
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
    if ( dataGR2.length > curRowGR2){
    	curINRTSetID = dataGR2[cell.row].INRT_ID;
    	console.log("onClick curINRTSetID : " + curINRTSetID);
			if (gridGR2.getColumns()[cell.cell].id == "UNIT_MEASURE") {
				if (!gridGR2.getEditorLock().commitCurrentEdit()) {
					return;
				}
				var unitMeasures = { "D": "M", "M": "Y", "Y": "D" };
				dataGR2[cell.row].UNIT_MEASURE = unitMeasures[dataGR2[cell.row].UNIT_MEASURE];
				gridGR2.updateRow(cell.row);
				e.stopPropagation();
			}
  	}
  	*/
  });			
  gridGR2.onDblClick.subscribe(function (e) {
		console.log("gridGR2.onDblClick");
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
    //var BASE_DATE = dataBKTSet[dataGR2].BASE_DATE;
    //var INRT_ID = dataBKTSet[dataGR2].INRT_ID;
    console.log("gridGR2 onDblClick curRowGR2 : " + curRowGR2 + " dataGR2 length: " + dataGR2.length );
    if ( dataGR2.length > curRowGR2){
			//execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_getIntrstSet(StoredProcess)","renderINRTSet",BASE_DATE,INRT_ID);			
  	}
  });	  
  gridGR2.onCellChange.subscribe(function (e) {
		console.log("gridGR2.onCellChange");
    var INRT_ID 		= dataGR2[curRowGR2].INRT_ID;
    var SEQ_ID 			= dataGR2[curRowGR2].SEQ_ID;
    var BASE_DATE 	= dataGR2[curRowGR2].BASE_DATE;
    var TERM 				= dataGR2[curRowGR2].TERM;
    var UNIT_MEASURE= dataGR2[curRowGR2].UNIT_MEASURE;
    var RATE 				= dataGR2[curRowGR2].RATE;
    var USE_YN 			= dataGR2[curRowGR2].USE_YN;
    console.log("gridGR2 onCellChange curRowGR2 : " + curRowGR2 + ":" + INRT_ID+":" + BASE_DATE+ ":" +TERM+ ":" +UNIT_MEASURE+ ":" +RATE+ "USE_YN:" +USE_YN+":"+SEQ_ID);
    isDisplayProgress=0;
		//execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_saveIntrstSetRow(StoredProcess)","alertResMsg",INRT_ID,BASE_DATE,TERM,UNIT_MEASURE,RATE,USE_YN,SEQ_ID);
		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataGR2[curRowGR2].UPDATE_DT=d.yyyymmdd();
	  gridGR2.invalidate();
	  gridGR2.render();

  });	  
	gridGR2.onAddNewRow.subscribe(function (e, args) {
		console.log("gridGR2.onAddNewRow");
	  var item = args.item;
	  gridGR2.invalidateRow(dataGR2.length);
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.INTEREST_RATE_SET","SEQ_ID",curINRTSetID);
		d = new Date();		  
	  var inrtID=eval("("+'{"INRT_ID":"' + dataGR1[curRowGR1].INRT_ID + '"' + '}'+")");
	  var seqID=eval("("+'{"SEQ_ID":"SEQ_' + resData.toString().trim() + '"' + '}'+")");
	  var baseDT=eval("("+'{"BASE_DATE":"' + dataGR1[curRowGR1].BASE_DATE + '"' + '}'+")");
	  //var rate=eval("("+'{"RATE":"' + "0" + '"' + '}'+")");
	  var unitM=eval("("+'{"UNIT_MEASURE":"' + "D" + '"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({},item,inrtID,seqID,baseDT,unitM,useYN,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR2.push(item);
	  gridGR2.updateRowCount();
	  gridGR2.render();	
	})
}
function renderINRTGraph(){
	$("#progressIndicatorWIP").show(); 	
	$resGraph=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_renderIntrstGraph(StoredProcess)","alertResMsg",curINRTSetID);
	$("#dvINRTGraph").html($resGraph);
	$("#progressIndicatorWIP").hide(); 	
}
function renderINRTGraph2(data){
	$("#dvINRTGraph").html(data);
	$("#progressIndicatorWIP").hide(); 	
}
function generateCurve(){
	if (typeof curRowGR1 == "undefined"){
		alertMsg("Select the Based Curve ID.");
	}
	var baseCurve="["+dataGR1[curRowGR1].INRT_ID+"] "+dataGR1[curRowGR1].INRT_NAME;
	$("#spBaseCurveInfo").html(baseCurve);
	$("#dvModalWin").show();
}
function generateCurve2(){
	if (!gridNewCurve.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	console.log("generateCurve2");
	var fn=dataNewCurve[0].fn;
	var sig=dataNewCurve[0].sig;
	var val=dataNewCurve[0].value;
	console.log("generateCurve2: fn: "+fn+":"+" sig:"+sig+" val:"+val);
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_copyNewCurve(StoredProcess)","refreshINRTList",curINRTSetID,fn,sig,val);
	$("#dvModalWin").hide();
}
function refreshINRTList(data){
	renderINRTList(data);
	gridGR1.setActiveCell(eval(dataGR1.length-1), 1);	
}
function deleteCurve(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Curve ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteCurveCF");
}
function deleteCurveCF(){
  var dataGR1 = gridGR1.getData();
  var current_row = gridGR1.getActiveCell().row;
  var INRT_ID=dataGR1[current_row].INRT_ID;
  dataGR1.splice(current_row,1);
  var r = current_row;
  while (r<dataGR1.length){
    gridGR1.invalidateRow(r);
    r++;
  }
  gridGR1.updateRowCount();
  gridGR1.render();
  gridGR1.scrollRowIntoView(curRowGR1-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_deleteIntrstRow(StoredProcess)","alertResMsg",INRT_ID);
}
function deleteRate(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Term.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteRateCF");
}
function deleteRateCF(){
  var dataGR2 = gridGR2.getData();
  var current_row = gridGR2.getActiveCell().row;
  var INRT_ID=dataGR2[current_row].INRT_ID;
  var SEQ_ID=dataGR2[current_row].SEQ_ID;
  dataGR2.splice(current_row,1);
  var r = current_row;
  while (r<dataGR2.length){
    gridGR2.invalidateRow(r);
    r++;
  }
  gridGR2.updateRowCount();
  gridGR2.render();
  gridGR2.scrollRowIntoView(curRowGR1-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_deleteIntrstSeqRow(StoredProcess)","alertResMsg",INRT_ID,SEQ_ID);
}
function renderINRTGraphD3(data){
	var chart;
	nv.addGraph(function() {
	  chart = nv.models.lineChart()
	  .useInteractiveGuideline(true)
	  .color(d3.scale.category10().range())
		.interpolate("basis")
	  .options({
	    margin: {left: 60, bottom: 45},
	    x: function(d,i) {console.log(i); return d[0]},
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
	
	  var svg=d3.select("#dvINRTGraph svg")
				    .datum(data)
				    .call(chart);
		svg.transition().duration(500).call(chart);	
		
	  //TODO: Figure out a good way to do this automatically
	  nv.utils.windowResize(chart.update);
	  //nv.utils.windowResize(function() { d3.select('#chart1 svg').call(chart) });
	
	  //chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
	
	  return chart;
	});

}
function saveGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Curve ID.");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow(dataGR1.length);
  var curRow = gridGR1.getActiveCell().row;

  var INRT_ID = dataGR1[curRow].INRT_ID;
  var BASE_DATE = dataGR1[curRow].BASE_DATE;
  var INRT_NAME = dataGR1[curRow].INRT_NAME;
  var INRT_RATE_YN = dataGR1[curRow].INRT_RATE_YN;
  var DSCT_RATE_YN = dataGR1[curRow].DSCT_RATE_YN;
  var FTP_RATE_YN = dataGR1[curRow].FTP_RATE_YN;
  console.log("gridGR1 onCellChange curRowGR1 : " + curRowGR1 + ":" + INRT_ID+":" + BASE_DATE+ ":" +INRT_NAME+ ":" );
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_saveIntrstListRow(StoredProcess)","alertResMsg",INRT_ID,INRT_NAME,BASE_DATE,INRT_RATE_YN,DSCT_RATE_YN,FTP_RATE_YN);
	d = new Date();		  
  console.log("updateDT:" + d.yyyymmdd());
  dataGR1[curRow].UPDATE_DT=d.yyyymmdd();
  gridGR1.invalidate();
  gridGR1.render();
}
function saveGR2Row(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Term.");
		return;
	}
	if (!gridGR2.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	//gridGR2.invalidateRow(dataGR2.length);
  var curRow = gridGR2.getActiveCell().row;

  var INRT_ID 		= dataGR2[curRow].INRT_ID;
  var BASE_DATE 	= dataGR2[curRow].BASE_DATE;
  var SEQ_ID			= dataGR2[curRow].SEQ_ID;
  var TERM 				= dataGR2[curRow].TERM;
  var UNIT_MEASURE= dataGR2[curRow].UNIT_MEASURE;
  var RATE 				= dataGR2[curRow].RATE;
  var USE_YN 			= dataGR2[curRow].USE_YN;
  console.log("gridGR2 onCellChange curRowGR2 : " + curRow + ":" + INRT_ID+":" + BASE_DATE+ ":" +TERM+ ":" +UNIT_MEASURE+ ":" +RATE+ "USE_YN:" +USE_YN+":"+SEQ_ID);
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt001_saveIntrstSetRow(StoredProcess)","alertResMsg",INRT_ID,BASE_DATE,TERM,UNIT_MEASURE,RATE,USE_YN,SEQ_ID);
}
function exportGR2Row(){
	console.log("exportGR2Row stp_sessionid : " + stp_sessionid);
	console.log("exportGR2Row save_path : " + save_path);
	fomPagerDataExcel._data.value="INTEREST_RATE_SET";
	fomPagerDataExcel._sessionid.value=stp_sessionid;
	fomPagerDataExcel._savepath.value=save_path;
	if(fomPagerDataExcel._savepath.value=="") {
	  console.log("저장위치가 없습니다.");
	}
	fomPagerDataExcel.action = "/SASHBI/STPWRVUDHeader";
	fomPagerDataExcel.target = 'fileDown';
	fomPagerDataExcel.submit();

}