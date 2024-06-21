$(document).ready(function () {
	$(".buttonArea").append("<input type=button value=Add id=btnSave class=condBtn onclick='addResults();'>");
	fnTenorList();
	//$(".buttonArea").append("<button type=button id=btnRun class=condBtnSearch onclick='submitSTP();'>Add</button>");
	
/*
	<input type=button value=Open id=btnOpen class=condBtn onClick='fnOpenGR2();' />
	<input type=button value=Save id=btnSave class=condBtn onClick='fnSaveGR2();' />
	<input type=button value='Save As' id=btnSaveAs class=condBtn onClick='fnSaveAsGR2();' />
	<input type=button value=Delete id=btnDelete class=condBtn onClick='fnDeleteGR2();' />

*/
});
var snr_name="";
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
});	
function fnTenorList(){
   tParams=eval('[{}]');
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990204_get_tenor_list(StoredProcess)",'makeTenorList');
}
var arrTenorList;
function makeTenorList(data){
	console.log("makeTenorList");
	console.log(data);
	arrTenorList=data;
}
	
function setCellColor(){
	//console.log("setCellColor : ");
	$(".slick-group-totals").css("background-color","#FFFF9F");
	$(".colorBLUE").parent().css("background-color","#0080FF");
	$(".colorGREEN").parent().css("background-color","#00FF00");
	$(".colorYELLOW").parent().css("background-color","#ecf7ff");
	$(".colorWHITE").parent().css("background-color","#ffffff");
	$(".foreY").parent().css("background-color","#FFFF80");
	$(".foreN").parent().css("background-color","#ffffff");
}

function ColorFommater(row, cell, value, columnDef, dataContext) {
	//var color=dataContext.signal;
	console.log("colorFommater : " );
	console.log(cell);
	console.log(columnDef);
	console.log(dataContext);
	if (value == "") {
		return "<span class='colorBLUE'>" + value + "</span>";
	}
	else if (value == "GREEN") {
		return "<span class='colorGREEN'>" + value + "</span>";
	}
	else if (value == "YELLOW") {
		return "<span class='colorYELLOW'>" + value + "</span>";
	}
	else if (value == "WHITE") {
		return "<span class='colorWHITE'>" + value + "</span>";
	}
	else {
		return "<span >" + value + "</span>";
	}
}
function EditerbleFommater(row, cell, value, columnDef, dataContext) {
	return "<span class='colorYELLOW'>" + value + "</span>";
}
function TenorFommater(row, cell, value, columnDef, dataContext) {
	//var color=dataContext.signal;
	//console.log("foreFommater : " + row );
	//console.log( dataContext );
	isAvail1=false;
	isAvail2=false;
	if (dataContext.group1_n=="IR" && dataContext.riskfactor_key!="ALL" ) isAvail1=true;
	if (dataContext.group1_n=="IR" && dataContext.riskfactor_key!="" ) isAvail2=true;
	//console.log("isAvail : " + dataContext.riskfactor_key + ":" + isAvail1+ ":" + isAvail2)
	//if(dataContext.group1_n=="IR" && isAvail ){
	if(isAvail1 && isAvail2 ){
		return "<span class='colorYELLOW'>" + value + "</span>";
	}
	else if (value == "") {
		return "<span>" + "N/A" + "</span>";
	}
	else {
		return "<span >" + value + "</span>";
	}
}
function TenorEditor(args) {
	var $select;
	var defaultValue;
	var scope = this;

	this.init = function () {
		console.log("init");
		console.log(args);
		group1=args.item["group1_n"];
		console.log(group1);
		var optItem="";
		if (group1=="IR" && args.item["riskfactor_key"]!="ALL"){
			//$select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='1M'>1M</OPTION><OPTION value='3M'>3M</OPTION><OPTION value='6M'>6M</OPTION><OPTION value='1Y'>1Y</OPTION><OPTION value='3Y'>3Y</OPTION><OPTION value='5Y'>5Y</OPTION><OPTION value='10Y'>10Y</OPTION><OPTION value='30Y'>30Y</OPTION></SELECT>");	
			rf_name=args.item["riskfactor_key"]
			optItem+="<option value=''></option>";
			for (var ii in arrTenorList){
				//console.log(rf_name + " : " + arrTenorList[ii].riskfactor_key)
				if (arrTenorList[ii].riskfactor_key==rf_name){
					optItem+="<option value='" + arrTenorList[ii].tenor + "'>" + arrTenorList[ii].tenor + "</option>";
				}
			}
			$select = $("<SELECT tabIndex='0' class='editor-yesno'>"+ optItem +"</SELECT>");			
					
		} else {
			$select = $("<span>N/A</span>");
		}
		$select.appendTo(args.container);
		$select.focus();
	};

	this.destroy = function () {
		$select.remove();
	};

	this.focus = function () {
		$select.focus();
	};

	this.loadValue = function (item) {
		console.log("item : ");
		console.log(item);
		defaultValue = item["tenor"];
		console.log("defaultValue : " + defaultValue);
		$select.val(defaultValue);
		//$select.val((defaultValue = item[args.column.field]) ? "GREY" : "no");
		//$select.select();
	};

	this.serializeValue = function () {
		return ($select.val() == "yes");
	};

	this.applyValue = function (item, state) {
		console.log("applyValue:::::::::::::::::::::::::::");
		var txt=$select.find("option:selected").text();
		console.log(item);
		console.log(txt);
		item[args.column.field] = txt;
	};

	this.isValueChanged = function () {
		return ($select.val() != defaultValue);
	};

	this.validate = function () {
	return {
		valid: true,
		msg: null
	};
	};

	this.init();
}  
function AbsEditor(args) {
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		$select = $("<select tabindex='0' class='editor-yesno'><option value=''></option><option value='절대'>절대</option><option value='상대'>상대</option><option value='값'>값</option></select>");			
		$select.appendTo(args.container);
		$select.focus();
	};
	this.destroy = function () {
		$select.remove();
	};
	this.focus = function () {
		$select.focus();
	};
	this.loadValue = function (item) {
		defaultValue = item["abs_yn"];
		console.log("defaultValue : " + defaultValue);
		$select.val(defaultValue);
	};
	this.serializeValue = function () {
		return ($select.val() == "yes");
	};
	this.applyValue = function (item, state) {
		var txt=$select.find("option:selected").text();
		item[args.column.field] = txt;
	};
	this.isValueChanged = function () {
		return ($select.val() != defaultValue);
	};
	this.validate = function () {
		return {
			valid: true,
			msg: null
		};
	};
	this.init();
}  
var sgGrid;
var sgData;
function comparer(a, b) {
	var x = a[sortcol], y = b[sortcol];
	return (x == y ? 0 : (x > y ? 1 : -1));
}
function setSlickGrid(data){
	console.log("setSlickGrid :\n" );

	var dataView = new Slick.Data.DataView();
	$("#sasGrid").show();
	
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
	columns[5].editor=eval("TenorEditor");
	columns[5].formatter=eval("TenorFommater");
	columns[6].formatter=eval("EditerbleFommater");
	columns[7].formatter=eval("EditerbleFommater");
	columns[7].editor=eval("AbsEditor");
	
	console.log(Slick.Editors.Tenor);
	console.log("columns");
	console.log(columns);
	console.log("options \n" + JSON.stringify(options));
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML=data;
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path);

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log(sgData);
	
	dataView.setItems(sgData);	
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  	sgGrid.registerPlugin(checkboxSelector);
	}
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onSort.subscribe(function (e, args) {
		sortdir = args.sortAsc ? 1 : -1;
		sortcol = args.sortCol.field;
		console.log("sortcol : " + sortcol);
		// using native sort with comparer
		// preferred method but can be very slow in IE with huge datasets
		dataView.sort(comparer, args.sortAsc);
	});
	dataView.onRowsChanged.subscribe(function(e,args) {
	    sgGrid.invalidateRows(args.rows);
	    sgGrid.render();
	});	
	sgGrid.onCellChange.subscribe(function (e, args) {
		var cell = args.grid.getCellFromEvent(e);
	});	
	sgGrid.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid.onMouseEnter.subscribe(function(e, args) {
		setCellColor();
	});	
	sgGrid.onMouseLeave.subscribe(function(e, args) {
		setCellColor();
	});		
	sgGrid.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);	
	})		
	setTimeout("setCellColor();",1*100);	
	$("#progressIndicatorWIP").hide();
}

function fnOpenGR2(){
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$("#dvModalOpen").show();
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990204_open_scenario_list(StoredProcess)",'setScenarioList');
}


var scenarioName="";
function fnSaveAsGR2(){
	fnShowSaveDialog();
}
function fnSaveGR2(){
	if (scenarioName == "") {
		fnShowSaveDialog();
	}	else {
		fnSaveGR2Confirm();
	}
}
function fnShowSaveDialog(){	
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-100)/2));
	$('#dvModalWin').show();
}
function fnSaveGR2Confirm(){
	if (!sgGrid.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid.getData().getItems();
	console.log('data');
	console.log(data);
	var gridData=JSON.stringify(data);	
	console.log(gridData);
	scenarioName=$("#txtScenarioName").val();
	tParams['_savepath']=save_path;
	tParams['name']=scenarioName;
	tParams['desc']=$("#txtScenarioDesc").val();
	tParams['rf']=$("#txtRF").val();
	tParams['interpol']=$("#txtInterpol").val();
	tParams['gridData']=gridData;
	tParams['_library']="mr_temp";
	tParams['_tablename']="rf_menu";
	tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990204_save_scenario(StoredProcess)";
	console.log("gridData : ");
	console.log(gridData);
	console.log(tParams);
	$('#dvModalWin').hide();
	execAjax("saveGrid2SASData","",true,"fnSavedOrgData","json"); 
	$('#dvModalWin').hide();
	//$('#dvBG').hide();
}
function fnSavedOrgData(data){
	//alertMsg(data.MSG);
   if (data.MSG == "Successfully saved...") {
   	alertMsg("성공적으로 저장되었습니다.");
   }
	//save_path=data._savepath;
	console.log("save_path : " + save_path);
}

function fnDeleteGR2(){
  //var isDelete = confirmMsg("Are you sure you want to delete?","fnDeleteGR2_OK");	
  fnDeleteGR2_OK();
}
function fnDeleteGR2_OK(){
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
function addResults(){
	$("#dvSASLog").html("");
	$("#dvOutput").show();
	//$("#dvOutput").hide();
	$("#dvGraph1").hide();	
	$("#dvBox").hide();
	$("#dvColumnHeader").hide();
	$("#dvRowHeader").hide();
	$("#dvData").hide();
	$("#dvTitle").html("");
	$("#dvBox").html("");
	$("#dvColumnHeader").html("");
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
	var _STPREPORT_HEADER_JS=$("#slt_STPREPORT_HEADER_JS").val();
	var _STPREPORT_ON_LOAD_SUBMIT=$("#slt_STPREPORT_ON_LOAD_SUBMIT").val();
	var _STPREPORT_TYPE=$("#slt_STPREPORT_TYPE").val();
	var _STPREPORT_NOEXCEL_BTN=$("#slt_STPREPORT_NOEXCEL_BTN").val();
	var _STPREPORT_ON_LOAD_COLLAPSE=$("#slt_STPREPORT_ON_LOAD_COLLAPSE").val();
	var _STPREPORT_OUT_LAYOUT=$("#slt_STPREPORT_OUT_LAYOUT").val();
	var level1=$("#sltlevel1 option:selected").val();
	var level1_txt=$("#sltlevel1 option:selected").text();
	var level2=$("#sltlevel2 option:selected").val();
	var level2_txt=$("#sltlevel2 option:selected").text();
	var level3=$("#sltlevel3 option:selected").val();
	var level3_txt=$("#sltlevel3 option:selected").text();
	var _STPREPORT_LF=$("#slt_STPREPORT_LF").val();
	var rsk_factor=$("#sltrsk_factor option:selected").val();
	var rsk_factor_txt=$("#sltrsk_factor option:selected").text();
	$("#sasGrid").hide();
	$sasResHTML="";
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/99.System/02.Internal/990204.internal_adm(StoredProcess)",'addResultsGrid');
}
function addResultsGrid(data){
	var dataView = new Slick.Data.DataView();
	$("#sasGrid").show();
	
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
	columns[5].editor=eval("TenorEditor");
	columns[5].formatter=eval("TenorFommater");
	columns[7].editor=eval("AbsEditor");
	console.log(Slick.Editors.Tenor);
	console.log("columns");
	console.log(columns);
	console.log("options \n" + JSON.stringify(options));
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML=data;
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path);

	var sgData2 = [];
	sgData2 = sasJsonRes["SASResult"];
	var sgData = sgGrid.getData().getItems();
	console.log(sgData);
	$.merge(sgData, sgData2 );	
	
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log(sgData);
	
	
	dataView.setItems(sgData);	
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  	sgGrid.registerPlugin(checkboxSelector);
	}
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  sgData.sort(function (dataRow1, dataRow2) {
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
	  sgGrid.invalidate();
	  sgGrid.render();
	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
	  	var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);	
	})		
	$("#progressIndicatorWIP").hide();
}
var sgScenarioList;
function setScenarioList(data){
	console.log("setSlickGrid :\n" );

	var dataView = new Slick.Data.DataView();
	$("#gridScenarioList").show();
	
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
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML=data;
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path);

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log(sgData);
	
	dataView.setItems(sgData);	
	
	sgScenarioList = new Slick.Grid("#gridScenarioList", dataView, columns, options);
	sgScenarioList.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  	sgScenarioList.registerPlugin(checkboxSelector);
	}
	sgScenarioList.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgScenarioList.updateRowCount();
		sgScenarioList.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgScenarioList.invalidateRows(args.rows);
		sgScenarioList.render();
	});
	sgScenarioList.onClick.subscribe(function(e, args) {
		var item = args.item;
	});	
	sgScenarioList.onDblClick.subscribe(function (e, args){
		var cell = sgScenarioList.getCellFromEvent(e)
		var row = cell.row;
		console.log(e)
		console.log(args)
		if (args.cell==1) fnOpenScenario();
	});		
	sgScenarioList.onSort.subscribe(function (e, args) {
		var comparer5 = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer5, args.sortAsc);
	});
	sgScenarioList.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgScenarioList.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgScenarioList.getData().getItems().length;
		dataView.addItem(item);	
	})		
	$("#progressIndicatorWIP").hide();
}
function fnDeleteScenario(){
	var selectedIndexes = sgScenarioList.getSelectedRows().sort().reverse();
	sgScenarioList.setSelectedRows([]);
	sgData=sgScenarioList.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgScenarioList.getData().getItem(value); 
		if (item) sgScenarioList.getData().deleteItem(item.id); 
	});
	sgScenarioList.invalidate();
	sgScenarioList.render();
}
function fnSaveScenario(){
	if (!sgScenarioList.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgScenarioList.getData().getItems();
	console.log('data');
	console.log(data);
	var gridData=JSON.stringify(data);	
	console.log(gridData);

	tParams['_savepath']=save_path;
	tParams['gridData']=gridData;
	tParams['_library']="mr_temp";
	tParams['_tablename']="ud_scenarios";
	tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990204_save_scenario_list(StoredProcess)";
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSavedOrgData","json"); 	
}
function fnOpenScenario(){
	var selected = sgScenarioList.getSelectedRows();
	var sgData=sgScenarioList.getData().getItems();
	var current_row = sgScenarioList.getActiveCell().row;
	snr_name=sgData[current_row].snr_name;
	console.log(sgData);
	console.log(selected);
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$('#dvModalOpen').show();
	tParams['snr_name']=snr_name;
	scenarioName=snr_name;
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990204_open_scenario(StoredProcess)",'setSlickGrid');
	$('#dvBG').hide();
	$('#dvModalOpen').hide();	
}