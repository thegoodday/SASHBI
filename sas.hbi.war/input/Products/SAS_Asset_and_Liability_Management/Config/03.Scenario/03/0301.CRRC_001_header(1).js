$(document).ready(function () {
	$("#dvMain").height(eval($(window).height()-58));
	//$("#dvCRRCList").height(eval($(window).height()-478));
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_getCurrencyCurveList(StoredProcess)","renderCRRCList");				
});
$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-58));
	//$("#dvCRRCList").height(eval($(window).height()-440));
	//$("#dvCRRCSet").height(eval($(window).height()-440));
})
var gridNewCurve;
var dataNewCurve = [];
var optionsNewCurve;
var columnsNewCurve;


/*
*/
//var curCRRCSetID;
var gridGR1;
var dataGR1 = [];
var optionsGR1;
var columnsGR1;
var curRowGR1;

var curCRRCSetID;
var gridGR2;
var dataGR2 = [];
var optionsGR2;
var columnsGR2;
var curRowGR2;

$(document).ready(function () {
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

function renderCRRCList(data){
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
	gridGR1 = new Slick.Grid("#dvCRRCList",  dataGR1, columnsGR1,  optionsGR1);
	gridGR1.setSelectionModel(new Slick.RowSelectionModel());
  gridGR1.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

  //gridGR1.registerPlugin(checkboxSelector);
	var columnpicker = new Slick.Controls.ColumnPicker(columnsGR1, gridGR1, optionsGR1); 

	gridGR1.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR1.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR1.getCellFromEvent(e);
		console.log("gridGR1.onContextMenu cell : " + JSON.stringify(cell) );
		console.log("gridGR1.getColumns()[cell.cell].id : " + gridGR1.getColumns()[cell.cell].id );
		if (gridGR1.getColumns()[cell.cell].id == "CURRENCY_FROM") {
			$("#contextCurrencyF")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextCurrencyF").hide();
			});
		}
		if (gridGR1.getColumns()[cell.cell].id == "CURRENCY_TO") {
			$("#contextCurrencyT")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextCurrencyT").hide();
			});
		}
	}); 
	$("#contextCurrencyF").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR1.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR1[row].CURRENCY_FROM = $(e.target).attr("data");
		gridGR1.updateRow(row);
	});		 		
	$("#contextCurrencyT").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR1.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR1[row].CURRENCY_TO = $(e.target).attr("data");
		gridGR1.updateRow(row);
	});		 		
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
    	curCRRCSetID = dataGR1[cell.row].CRRC_ID;
    	console.log("onClick curCRRCSetID : " + curCRRCSetID);
	    var BASE_DATE = dataGR1[curRowGR1].BASE_DATE;
	    var CRRC_ID = dataGR1[curRowGR1].CRRC_ID;
    	isDisplayProgress=0;
			execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_getCurrencyCurveSet(StoredProcess)","renderCRRCSet",BASE_DATE,CRRC_ID);			
			execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_getCurrencyCurveGraph(StoredProcess)","renderCRRCGraphD3",CRRC_ID);			
  	}
  });			
  gridGR1.onDblClick.subscribe(function (e) {
  });	  
  gridGR1.onCellChange.subscribe(function (e) {
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
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.CURRENCY_CURVE_LIST","CRRC_ID");
    isDisplayProgress=1;
		console.log("gridGR1 resData: " + resData);
		d = new Date();		  
	  var CRRCID=eval("("+'{"CRRC_ID":"CRRC_' + resData.toString().trim() + '"' + '}'+")");
	  var baseDT=eval("("+'{"BASE_DATE":"' + d.yyyymmdd() + '"' + '}'+")");
	  var CURRENCY_F=eval("("+'{"CURRENCY_FROM":"USD"' + '}'+")");
	  var CURRENCY_T=eval("("+'{"CURRENCY_TO":"KRW"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({},item,CRRCID,baseDT,CURRENCY_F,CURRENCY_T,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  gridGR1.render();	
	})
}
function renderCRRCSet(data){

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
	gridGR2 = new Slick.Grid("#dvCRRCSet",  dataGR2, columnsGR2,  optionsGR2);
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
  gridGR2.onClick.subscribe(function (e) {
		console.log("gridGR2.onClick");
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
    if ( dataGR2.length > curRowGR2){
  	}
  });			
  gridGR2.onDblClick.subscribe(function (e) {
		console.log("gridGR2.onDblClick");
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
    //var BASE_DATE = dataBKTSet[dataGR2].BASE_DATE;
    //var CRRC_ID = dataBKTSet[dataGR2].CRRC_ID;
    console.log("gridGR2 onDblClick curRowGR2 : " + curRowGR2 + " dataGR2 length: " + dataGR2.length );
    if ( dataGR2.length > curRowGR2){
			//saveGR2Row();
  	}
  });	  
  gridGR2.onCellChange.subscribe(function (e) {
		console.log("gridGR2.onCellChange");
    var CRRC_ID 		= dataGR2[curRowGR2].CRRC_ID;
    var SEQ_ID 			= dataGR2[curRowGR2].SEQ_ID;
    var MONTH 			= dataGR2[curRowGR2].MONTH;
    var CRRC_RATE		= dataGR2[curRowGR2].CRRC_RATE;
	  console.log("CRRC_RATE: " + CRRC_RATE);
	  if (typeof CRRC_RATE == "undefined") return;
    isDisplayProgress=0;
		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_saveCurrencyCurveSetRow(StoredProcess)","alertResMsg",CRRC_ID,SEQ_ID,MONTH,CRRC_RATE);
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
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.CURRENCY_CURVE_SET","SEQ_ID",curCRRCSetID);
		d = new Date();		  
	  var CRRCID=eval("("+'{"CRRC_ID":"' + dataGR1[curRowGR1].CRRC_ID + '"' + '}'+")");
	  var seqID=eval("("+'{"SEQ_ID":"SEQ_' + resData.toString().trim() + '"' + '}'+")");
	  var baseDT=eval("("+'{"BASE_DATE":"' + dataGR1[curRowGR1].BASE_DATE + '"' + '}'+")");
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({},item,CRRCID,seqID,baseDT,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR2.push(item);
	  gridGR2.updateRowCount();
	  gridGR2.render();	
	})
}
function renderCRRCGraph(){
	$("#progressIndicatorWIP").show(); 	
	$resGraph=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_renderIntrstGraph(StoredProcess)","alertResMsg",curCRRCSetID);
	$("#dvCRRCGraph").html($resGraph);
	$("#progressIndicatorWIP").hide(); 	
}
function renderCRRCGraph2(data){
	$("#dvCRRCGraph").html(data);
	$("#progressIndicatorWIP").hide(); 	
}
function generateCurve(){
	if (typeof curRowGR1 == "undefined"){
		alertMsg("Select Based Currency Curve ID.");
	}
	var baseCurve="["+dataGR1[curRowGR1].CRRC_ID+"] "+dataGR1[curRowGR1].CRRC_NAME;
	$("#spBaseCurveInfo").html(baseCurve);
	$("#dvModalWin").show();
}
function generateCurve2(){
	console.log("generateCurve2");
	if (!gridNewCurve.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	dataGR1	=gridGR1.getData();
	curRow	=gridGR1.getActiveCell().row;
	var CRRC_ID=dataGR1[curRow].CRRC_ID;
	var fn=dataNewCurve[0].fn;
	var sig=dataNewCurve[0].sig;
	var val=dataNewCurve[0].value;
	console.log("generateCurve2: fn: "+fn+":"+" sig:"+sig+" val:"+val);
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_copyCurrencyCurve(StoredProcess)","refreshCRRCList",CRRC_ID,fn,sig,val);
	$("#dvModalWin").hide();
}
function refreshCRRCList(data){
	renderCRRCList(data);
	gridGR1.setActiveCell(eval(dataGR1.length-1), 1);	
}
function deleteCurve(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Currency Curve ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteCurveCF");
}
function deleteCurveCF(){
  var dataGR1 = gridGR1.getData();
  var current_row = gridGR1.getActiveCell().row;
  var CRRC_ID=dataGR1[current_row].CRRC_ID;
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
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_deleteCurrencyCurveRow(StoredProcess)","alertResMsg",CRRC_ID);
}
function deleteRate(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Currency Rate Row.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteRateCF");
}
function deleteRateCF(){
  var dataGR2 = gridGR2.getData();
  var current_row = gridGR2.getActiveCell().row;
  var CRRC_ID=dataGR2[current_row].CRRC_ID;
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
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_deleteCurrencyCurveSeqRow(StoredProcess)","alertResMsg",CRRC_ID,SEQ_ID);
}
function renderCRRCGraphD3(data){
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
	    .tickFormat(d3.format(',4.2f'));
	
	  var svg=d3.select("#dvCRRCGraph svg")
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
		alertMsg("Select the Currency Curve ID.");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow(dataGR1.length);
  var curRow = gridGR1.getActiveCell().row;

  var CRRC_ID = dataGR1[curRow].CRRC_ID;
  var CRRC_NAME = dataGR1[curRow].CRRC_NAME;
  var BASE_DATE = dataGR1[curRow].BASE_DATE;
  var CURRENCY_FROM = dataGR1[curRow].CURRENCY_FROM;
  var CURRENCY_TO = dataGR1[curRow].CURRENCY_TO;
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_saveCurrencyCurveListRow(StoredProcess)","alertResMsg",CRRC_ID,CRRC_NAME,BASE_DATE,CURRENCY_FROM,CURRENCY_TO);
}
function saveGR2Row(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Currency Rate Row.");
		return;
	}
	if (!gridGR2.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR2.invalidateRow(dataGR2.length);
  var curRow = gridGR2.getActiveCell().row;

	curCRRCSetID = dataGR2[curRow].CRRC_ID;
	console.log("onClick curCRRCSetID : " + curCRRCSetID);
  var CRRC_ID 		= dataGR2[curRow].CRRC_ID;
  var SEQ_ID 			= dataGR2[curRow].SEQ_ID;
  var MONTH 			= dataGR2[curRow].MONTH;
	var CRRC_RATE		= dataGR2[curRow].CRRC_RATE;
  isDisplayProgress=0;
  console.log("MONTH: " + MONTH);
  console.log("CRRC_RATE: " + CRRC_RATE);
	if (typeof CRRC_RATE == "undefined") return;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/03/crrc001_saveCurrencyCurveSetRow(StoredProcess)","alertResMsg",CRRC_ID,SEQ_ID,MONTH,CRRC_RATE);

}