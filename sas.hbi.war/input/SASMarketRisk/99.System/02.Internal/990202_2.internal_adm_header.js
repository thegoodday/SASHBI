//stp_fn : 990202_2.internal_adm_header.js
$(document).ready(function () {
	//$(".buttonArea").append("<input type=button value=Add id=btnSave class=condBtnSearch onclick='addResults();'>");
	$("#sasGrid").height($(window).height()-290);
	$("#sasGrid2").height($(window).height()-290);
});
$(window).resize(function() {
	$("#sasGrid").width(eval($(window).width()-570));
	$("#sasGrid").height($(window).height()-$("#dvCondi").height()-90);
	$("#sasGrid2").height($(window).height()-$("#dvCondi").height()-90);
	//$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	//$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
	//$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-$("#dvToolBar").height()-50));
	console.log("resize");
	//$(".slick-viewport").height(eval($("#sasGrid").height()-23));
});	
//alert("");
var sgGrid ;
var sgData ;
function setSlickGrid(data){
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
	
	sgGrid = new Slick.Grid("#sasGrid", sgData, columns, options);
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  	sgGrid.registerPlugin(checkboxSelector);
	}
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onSort.subscribe(function (e, args) {

	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);		
	})		
	$("#dvTools").show();
	$("#progressIndicatorWIP").hide();
}

function addResults(){
	var _STPREPORT_HEADER_JS=$("#slt_STPREPORT_HEADER_JS").val();
	var _STPREPORT_OUT_LAYOUT=$("#slt_STPREPORT_OUT_LAYOUT").val();
	var _STPREPORT_ON_LOAD_SUBMIT=$("#slt_STPREPORT_ON_LOAD_SUBMIT").val();
	var _STPREPORT_TYPE=$("#slt_STPREPORT_TYPE").val();
	var _STPREPORT_NOEXCEL_BTN=$("#slt_STPREPORT_NOEXCEL_BTN").val();
	var _STPREPORT_ON_LOAD_COLLAPSE=$("#slt_STPREPORT_ON_LOAD_COLLAPSE").val();
	var rmorg07=$("#sltrmorg07").val();
	var rmcls01=$("#sltrmcls01").val();
	var rmcls02=$("#sltrmcls02").val();
	var rmcls03=$("#sltrmcls03").val();
	var kr_code=$("#sltkr_code").val();


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
	var _STPREPORT_OUT_LAYOUT=$("#slt_STPREPORT_OUT_LAYOUT").val();
	var _STPREPORT_ON_LOAD_SUBMIT=$("#slt_STPREPORT_ON_LOAD_SUBMIT").val();
	var _STPREPORT_TYPE=$("#slt_STPREPORT_TYPE").val();
	var _STPREPORT_NOEXCEL_BTN=$("#slt_STPREPORT_NOEXCEL_BTN").val();
	var _STPREPORT_ON_LOAD_COLLAPSE=$("#slt_STPREPORT_ON_LOAD_COLLAPSE").val();
	var rmorg07=$("#sltrmorg07 option:selected").val();
	var rmorg07_txt=$("#sltrmorg07 option:selected").text();
	var rmcls01=$("#sltrmcls01 option:selected").val();
	var rmcls01_txt=$("#sltrmcls01 option:selected").text();
	var rmcls02=$("#sltrmcls02 option:selected").val();
	var rmcls02_txt=$("#sltrmcls02 option:selected").text();
	var rmcls03=$("#sltrmcls03 option:selected").val();
	var rmcls03_txt=$("#sltrmcls03 option:selected").text();
	var kr_code=$("#sltkr_code option:selected").val();
	var kr_code_txt=$("#sltkr_code option:selected").text();
	$("#sasGrid").hide();
	$sasResHTML="";
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/99.System/02.Internal/990202.internal_adm(StoredProcess)",'addResultsGrid');
	
}	// End of submitSTP();
function addResultsGrid(data){
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
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML=data;

	var sgData2 = [];
	sgData2 = sasJsonRes["SASResult"];
	var sgData = sgGrid.getData();
	console.log(sgData);
	$.merge(sgData, sgData2 );
	console.log("sgData : ");
	console.log(sgData);
	
	sgGrid = new Slick.Grid("#sasGrid", sgData, columns, options);
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
	$("#dvTools").show();
	$("#progressIndicatorWIP").hide();
}
function fnSearch1(){
	var sgData = sgGrid.getData();
	var selectedRows = sgGrid.getSelectedRows();
	if (selectedRows.length < 1) {
		alertMsg("왼쪽 테이블 상에서 추가하고자 하는 포트폴리오를 체크하세요.");
		return;
	}
	var selectedItems=[];
	for(var ii=0; ii<selectedRows.length; ii++){
		var rowid=selectedRows[ii];
		//selectedItems.push(sgData[rowid].kr_code);
		selectedItems.push(sgData[rowid].instid);
	}	
	console.log(selectedItems);
	fnStep="add";
	tParams['instid']=JSON.stringify( selectedItems );
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_2_get_portfolio(StoredProcess)",'setSlickGrid2');

}
var sgGrid3;
var fnStep="";
function setSlickGrid2(data){
	$("#sasGrid2").show();
	var dataView = new Slick.Data.DataView();
	
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
	$sasExcelHTML=data;

	var sgData3 = [];
	sgData3 = sasJsonRes["SASResult"];
	console.log(sgGrid3);
	if (fnStep=="open"){
		var sgData = sgData3;
	} else if (sgGrid3 == undefined){
		console.log("undefined");
		var sgData = sgData3;
	} else {
		var sgData = sgGrid3.getData().getItems();
		console.log(sgData.length);
		for (var ii = 0; ii < sgData.length; ii++) {
			instid=sgData[ii].instid;		
			isBe=-1;
			for (var jj = 0; jj < sgData3.length; jj++) {
				if (instid==sgData3[jj].instid) {
					isBe=jj;
					console.log(isBe + ":" +instid+":"+sgData3[jj].instid);
				}
			}
			if (isBe > -1){
				sgData3.splice(isBe, 1);
			}
		}
		console.log("sgData3");
		console.log(sgData3);
		$.merge(sgData, sgData3 );
	}
	
	//dataView.setItems(sgData3)
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log(sgData);
	
	dataView.setItems(sgData);	

	sgGrid3 = new Slick.Grid("#sasGrid2", dataView, columns, options);
	sgGrid3.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid3.registerPlugin(checkboxSelector);
	}
	sgGrid3.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid3.onSort.subscribe(function (e, args) {
		var comparer3 = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer3, args.sortAsc);
	});
	sgGrid3.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid3.invalidateRow(sgData3.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid3.getData().getItems().length;
		dataView.addItem(item);		
	})	
	$("#dvTools2").show();
	$("#progressIndicatorWIP").hide();
}
function fnOpenGR2(){
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$('#dvModalOpen').show();
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_2_get_portfolio_list(StoredProcess)",'setSlickGrid5');
}
function setSlickGrid5(data){
	$("#dvModalOpen").show();
	var dataView = new Slick.Data.DataView();
	
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
	$sasExcelHTML=data;

	var sgData5 = [];
	sgData5 = sasJsonRes["SASResult"];
	//dataView.setItems(sgData5)
	for(ii in sgData5){
		var objTemp = $.extend(sgData5[ii],eval({"id":ii}));
	}
	console.log(sgData5);
	
	dataView.setItems(sgData5);	

	sgGrid5 = new Slick.Grid("#sasGrid5", dataView, columns, options);
	sgGrid5.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid5.updateRowCount();
		sgGrid5.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid5.invalidateRows(args.rows);
		sgGrid5.render();
	});
	if (isChk){
  		sgGrid5.registerPlugin(checkboxSelector);
	}
	sgGrid5.onClick.subscribe(function(e, args) {
		var item = args.item;
	});	
	sgGrid5.onDblClick.subscribe(function (e, args){
		var cell = sgGrid5.getCellFromEvent(e)
		var row = cell.row;
		console.log(e)
		console.log(args)
		if (args.cell==1) fnOpenPortfolio();
	});		
	sgGrid5.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid5.onSort.subscribe(function (e, args) {
		var comparer5 = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer5, args.sortAsc);
	});	

	$("#progressIndicatorWIP").hide();	
}
function fnDeletePortfolio(){
	var selectedIndexes = sgGrid5.getSelectedRows().sort().reverse();
	sgGrid5.setSelectedRows([]);
	sgData=sgGrid5.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgGrid5.getData().getItem(value); 
		console.log(item.id)
		if (item) sgGrid5.getData().deleteItem(item.id); 
	});
	sgGrid5.invalidate();
	sgGrid5.render();    
}
function fnSavePortfolio(){
	if (!sgGrid5.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid5.getData().getItems();
	console.log('data');
	console.log(data);
	var gridData=JSON.stringify(data);	
	console.log(gridData);
	tParams['gridData']=gridData;
	tParams['_library']="mr_temp";
	tParams['_tablename']="scenarios_list";
	tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_2_update_scenario_list(StoredProcess)";
	console.log("gridData : ");
	console.log(gridData);
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSavedOrgData","json"); 
	$('#dvModalWin').hide();
	//$('#dvBG').hide();
	
}
function fnOpenPortfolio(){
	var selected = sgGrid5.getSelectedRows();
	var sgData=sgGrid5.getData().getItems();
	console.log("current_row : " + sgGrid5.getActiveCell());
	if ( sgGrid5.getActiveCell()== null){
		//alertMsg("Click the Scenario Name you want to open...");
		alertMsg("열려고 하는 시나리오명을 더블 클릭하세요.");
		return;
	}
	var current_row = sgGrid5.getActiveCell().row;
	
	scenarioName=sgData[current_row].scnr_name;
	scenarioDesc=sgData[current_row].scnr_desc;
	console.log(sgData);
	console.log(selected);
	console.log(scenarioName);
	$("#txtScenarioName").val(scenarioName);
	$("#txtScenarioDesc").val(scenarioDesc);
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$('#dvModalOpen').show();
	tParams['scnr_name']=scenarioName;
	fnStep="open";
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_2_open_scenario(StoredProcess)",'setSlickGrid2');
	$('#dvBG').hide();
	$('#dvModalOpen').hide();
}
var scenarioName="";
var scenarioDesc="";
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
	if (!sgGrid3.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid3.getData().getItems();
	console.log('data');
	console.log(data);
	var gridData=JSON.stringify(data);	
	console.log(gridData);
	scenarioName=$("#txtScenarioName").val();
	tParams['_savepath']=save_path;
	tParams['name']=scenarioName;
	tParams['desc']=$("#txtScenarioDesc").val();
	tParams['gridData']=gridData;
	tParams['_library']="mr_temp";
	tParams['_tablename']="portfolio_scenarios";
	tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_2_save_scenario(StoredProcess)";
	console.log("gridData : ");
	console.log(gridData);
	console.log(tParams);
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
function fnSaveAsGR2(){
	fnShowSaveDialog();
}
function fnDeleteGR2(){
	var isDelete = confirmMsg("Are you sure you want to delete?","fnDeleteGR2_OK");	
}
function fnDeleteGR2_OK(){
	var selectedIndexes = sgGrid3.getSelectedRows().sort().reverse();
	sgGrid3.setSelectedRows([]);
	sgData=sgGrid3.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgGrid3.getData().getItem(value); 
		console.log(item.id)
		if (item) sgGrid3.getData().deleteItem(item.id); 
	});
	sgGrid3.invalidate();
	sgGrid3.render();
	
}