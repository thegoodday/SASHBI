$(document).ready(function () {
   $("#dvToolBar").append("<input type=button value=Open id=btnOpen class=condBtn onclick='fnOpenDial();'>");
   $("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSave();'>");
   $("#dvToolBar").append("<input type=button value='Save As' id=btnSaveAs class=condBtn onclick='fnSaveAs();'>");
   $("#dvToolBar").show();
});
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-80));													
	$("#sasGrid2").height(eval($(window).height()-$("#dvCondi").height()-80));													
});
var hier_id="";		
var hier_name="";		
function fnDeleteHier(){
/*	
	var selected = sgGrid3.getSelectedRows();
	sgGrid3.setSelectedRows([]);
	$.each(selected, function (index, value) {
		sgGrid3.getData().deleteItem(value)
	})
	sgGrid3.invalidate();
	sgGrid3.updateRowCount();
	sgGrid3.render();
*/	
	var selectedIndexes = sgGrid3.getSelectedRows().sort().reverse();
	sgGrid3.setSelectedRows([]);
	sgData=sgGrid3.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgGrid3.getData().getItem(value); 
		if (item) sgGrid3.getData().deleteItem(item.id); 
	});
	sgGrid3.invalidate();
	sgGrid3.render();
}
function fnSaveHierList(){
   tParams=eval('[{}]');
	var data=sgGrid3.getData().getItems();
   var gridData=JSON.stringify(data);
   console.log(gridData);
   tParams['gridData']=gridData;
   tParams['_library']="mr_temp";
   tParams['_tablename']="ccvar_scenario";
   tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990302_save_ccvar_scenario(StoredProcess)";
   execAjax("saveGrid2SASData","",true,"fnSavedData","json");
   $('#dvModalOpen').hide();$('#dvBG').hide();
}
function fnOpenHier(){
	var selected = sgGrid3.getSelectedRows();
	var sgData=sgGrid3.getData().getItems();
	console.log("current_row : " + sgGrid3.getActiveCell());
	if ( sgGrid3.getActiveCell()== null){
		//alertMsg("Click the Scenario Name you want to open...");
		alertMsg("열려고 하는 시나리오명을 더블 클릭하세요.");
		return;
	}
	var current_row = sgGrid3.getActiveCell().row;
	
	ccvar_id=sgData[current_row].ccvar_id;
	ccvar_name=sgData[current_row].ccvar_name;
	ccvar_desc=sgData[current_row].ccvar_desc;
	console.log(ccvar_id);
	console.log(ccvar_name);
	$("#txtHierName").val(ccvar_name);
	$("#txtHierDesc").val(ccvar_desc);
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$('#dvModalOpen').show();
   tParams=eval('[{}]');
	tParams['ccvar_id']=ccvar_id;
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990302_open_hier(StoredProcess)",'setSlickGrid2');
	$('#dvBG').hide();
	$('#dvModalOpen').hide();
}
function fnOpenDial(){
	tParams=eval('[{}]');
	tParams['ccvar_id']='';
	//fnStep="open";
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990302_open_ccar_list(StoredProcess)",'setSlickGrid3');
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$('#dvModalOpen').show();
}
var save_type="";
function fnSaveAs(){
	save_type="saveas";
	fnSaveDial();
}
function fnSave(){
	save_type="save";
	if (hier_id == "") {
		fnSaveDial();
	}	else {
		fnSave2();
	}}
function fnSaveDial(){	
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-100)/2));
	$('#dvModalWin').show();
}
function fnSave2(){	
   if ($('#txtHierName').val()=="") {
   	alertMsg("분석계층명을 입력하세요.");
      return;
   }	
   if (sgGrid2 == undefined) {
   	alertMsg("분석계층을 설정하세요.");
   	$('#dvModalWin').hide();$('#dvBG').hide();
      return;
   }	
   if (!sgGrid2.getEditorLock().commitCurrentEdit()) {
      return;
   }
   tParams=eval('[{}]');
	var data=sgGrid2.getData().getItems();
   var gridData=JSON.stringify(data);
   console.log(gridData);
   tParams['gridData']=gridData;
   tParams['_library']="mr_temp";
   tParams['_tablename']="ccvar_list_dtl";
   if (save_type == "saveas") hier_id="";
   tParams['hier_id']=hier_id;
   console.log("hier_id : " + hier_id);
   hier_name=$('#txtHierName').val();
   console.log("hier_name : " + hier_name);
   tParams['hier_name']=hier_name;
   tParams['hier_desc']=$('#txtHierDesc').val();
   tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990302_save_hier(StoredProcess)";
   execAjax("saveGrid2SASData","",true,"fnSavedData","json");
   $('#dvModalWin').hide();$('#dvBG').hide();
}
function fnSavedData(data){
   //alertMsg(data.MSG);
   if (data.MSG == "Successfully saved...") {
   	alertMsg("성공적으로 저장되었습니다.");
   }
   hier_id=data.ccvar_id;
}
function fnDeleteRowConfirm(){
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
function fnDeleteRow(){
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
var sgGrid1;
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
	//columns[3].formatter=eval("YellowFommater");
	//columns[3].editor=eval("PTypeEditor");	

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

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log("sgData");
	console.log(sgData);
	//dataView.setItems(sgData);	
	
	sgGrid1 = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid1.updateRowCount();
		sgGrid1.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid1.invalidateRows(args.rows);
		sgGrid1.render();
	});
	sgGrid1.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid1.registerPlugin(checkboxSelector);
	};
	sgGrid1.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid1.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid1.onMouseEnter.subscribe(function(e, args) {
		setCellColor();
	});	
	sgGrid1.onMouseLeave.subscribe(function(e, args) {
		setCellColor();
	});		
	sgGrid1.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		/*
		*/
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid1.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid1.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid1.getData().getItems().length;
		dataView.addItem(item);	
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#progressIndicatorWIP").hide();
}

var sgGrid2;
function setSlickGrid2(data){
	console.log("setSlickGrid :\n" );
	$("#sasGridComment").show();
	$("#sasGrid2").show();
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
	//behavior: "selectAndMove",
	columns[1].behavior="selectAndMove";
	columns[2].behavior="selectAndMove";
	//columns[3].editor=eval("PTypeEditor");	

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

	var sgData = [];
	sgData2 = sasJsonRes["SASResult"];
	console.log(sgData2[0])
	hier_id=sgData2[0].ccvar_id.substring(1);
   console.log("hier_id : " + hier_id);
	for(ii in sgData2){
		var objTemp = $.extend(sgData2[ii],eval({"id":ii}));
	}
	console.log("sgData2");
	console.log(sgData2);
	//dataView.setItems(sgData);	
	
	sgGrid2 = new Slick.Grid("#sasGrid2", dataView, columns, options);
	sgGrid2.setSelectionModel(new Slick.RowSelectionModel());
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid2.updateRowCount();
		sgGrid2.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid2.invalidateRows(args.rows);
		sgGrid2.render();
	});

	var moveRowsPlugin = new Slick.RowMoveManager({
		cancelEditOnDrag: true
	});

	moveRowsPlugin.onBeforeMoveRows.subscribe(function (e, data) {
		for (var i = 0; i < data.rows.length; i++) {
			// no point in moving before or after itself
			if (data.rows[i] == data.insertBefore || data.rows[i] == data.insertBefore - 1) {
				e.stopPropagation();
				return false;
			}
		}
		return true;
	});

	moveRowsPlugin.onMoveRows.subscribe(function (e, args) {
		var extractedRows = [], left, right;
		var rows = args.rows;
		var insertBefore = args.insertBefore;
		left = sgData2.slice(0, insertBefore);
		right = sgData2.slice(insertBefore, sgData2.length);

		rows.sort(function(a,b) { return a-b; });

		for (var i = 0; i < rows.length; i++) {
			extractedRows.push(sgData2[rows[i]]);
		}

		rows.reverse();

		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			if (row < insertBefore) {
				left.splice(row, 1);
			} else {
				right.splice(row - insertBefore, 1);
			}
		}

		sgData2 = left.concat(extractedRows.concat(right));

		var selectedRows = [];
		for (var i = 0; i < rows.length; i++)
		selectedRows.push(left.length + i);

		sgGrid2.resetActiveCell();
		//sgGrid2.setData(sgData2);
		for(ii in sgData2){
			var objTemp = $.extend(sgData2[ii],eval({"id":ii}));
		}
		
		dataView.setItems(sgData2);
		sgGrid2.setSelectedRows(selectedRows);
		sgGrid2.getSelectionModel().setSelectedRanges([]);
		sgGrid2.updateRowCount();
		sgGrid2.render();

	});


	sgGrid2.registerPlugin(moveRowsPlugin);
	sgGrid2.registerPlugin(checkboxSelector);
	dataView.beginUpdate();
	dataView.setItems(sgData2);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();
}
var sgGrid3;
function setSlickGrid3(data){
	console.log("setSlickGrid :\n" );
	$("#sasGridComment").show();
	$("#sasGrid2").show();
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
	//columns[3].formatter=eval("YellowFommater");
	//columns[3].editor=eval("PTypeEditor");	

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

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log("sgData");
	console.log(sgData);
	//dataView.setItems(sgData);	
	
	sgGrid3 = new Slick.Grid("#sasGrid3", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid3.updateRowCount();
		sgGrid3.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid3.invalidateRows(args.rows);
		sgGrid3.render();
	});
	sgGrid3.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid3.registerPlugin(checkboxSelector);
	};
	sgGrid3.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid3.onClick.subscribe(function(e, args) {
		var item = args.item;
	});	
	sgGrid3.onDblClick.subscribe(function (e, args){
		console.log(e)
		console.log(args)
		var cell = sgGrid3.getCellFromEvent(e)
		var row = cell.row;
		if (args.cell<3) fnOpenHier();
	});	
	sgGrid3.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid3.onMouseEnter.subscribe(function(e, args) {
		setCellColor();
	});	
	sgGrid3.onMouseLeave.subscribe(function(e, args) {
		setCellColor();
	});		
	sgGrid3.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid3.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid3.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid3.getData().getItems().length;
		dataView.addItem(item);	
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#progressIndicatorWIP").hide();
}
function setCellColor(){
	//console.log("setCellColor : ");
	$(".slick-group-totals").css("background-color","#FFFF9F");
	$(".colorBLUE").parent().css("background-color","#0080FF");
	$(".colorGREEN").parent().css("background-color","#00FF00");
	//$(".colorYELLOW").parent().css("background-color","#FFFF80");
	$(".colorYELLOW").parent().addClass("colorYELLOWP");
	$(".colorWHITE").parent().css("background-color","#ffffff");
	$(".foreY").parent().css("background-color","#FFFF80");
	$(".foreN").parent().css("background-color","#ffffff");
}

function fnAddHira(){
	var columns = [
	  {
	    id: "chkbox",
	    name: "chkbox",
	    width: 60,
	    field: "chkbox"
	  },
/*	  
	  {
		id: "#",
		name: "",
		width: 40,
		behavior: "selectAndMove",
		selectable: false,
		resizable: false,
		cssClass: "cell-reorder dnd"
	  },
*/	  
	  {
		id: "ccvar",
		name: "계층컬럼",
		field: "ccvar",
		behavior: "selectAndMove",
		width: 180,
		cssClass: "dnd c",
		editor: Slick.Formatters.Text
	  },
	  {
		id: "desc",
		name: "계층컬럼설명",
		field: "desc",
		width: 180,
		behavior: "selectAndMove",
		cssClass: "dnd c",
		editor: Slick.Editors.Text
	  },
	];

	var options = {
		editable: false,
		enableAddRow: false,
		enableCellNavigation: true,
		enableColumnReorder: false,
		rowHeight: 38,
		autoEdit: false
	};
	/*
	*/
	var dataView = new Slick.Data.DataView();
	var checkboxSelector = new Slick.CheckboxSelectColumn({
		cssClass: "slick-cell-checkboxsel"
	});
	chk_col=[];
	chk_col.push(checkboxSelector.getColumnDefinition());
	columns=$.extend(columns,chk_col);
	console.log(columns);
	var sgData2_tmp = [];
	var sgData1=sgGrid1.getData().getItems();
	var selected = sgGrid1.getSelectedRows();
	if (sgGrid2==undefined){
		var sgData2 = [];
	} else {
		var sgData2 = sgGrid2.getData().getItems();
	}
	var ii=0;
	$.each(selected, function (index, value) {
		console.log("idnex : " + index);
      var d = (sgData2_tmp[index] = {});
		ii++;
      d["chkbox"] = 0;
      d["ccvar_seq"] = ii;
      d["ccvar"] = sgData1[value].ccvar;
      d["desc"] = sgData1[value].desc;
   });
	var index2=eval(sgData2.length+0);
   for(ii in sgData2_tmp){
   	var isBe=0;
   	var ccvar=sgData2_tmp[ii].ccvar;
   	for(jj in sgData2){
   		if(sgData2[jj].ccvar == ccvar) isBe++;
		}   	
		if (isBe == 0) {
			console.log("Merged!!!");
      	var d = (sgData2[index2] = {});
      	index2++;
	      d["chkbox"] = 0;
	      d["ccvar"] = sgData2_tmp[ii].ccvar;
	      d["desc"] = sgData2_tmp[ii].desc;
		}
		//if (isBe == 0) sgData2 = $.merge(sgData2, "["+sgData2_tmp[ii]+"]");
   }
	
	for(var ii in sgData2){
		var objTemp = $.extend(sgData2[ii],eval({"id":ii}));
	}

	sgGrid2 = new Slick.Grid("#sasGrid2", dataView, columns, options);
	sgGrid2.setSelectionModel(new Slick.RowSelectionModel());
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid2.updateRowCount();
		sgGrid2.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid2.invalidateRows(args.rows);
		sgGrid2.render();
	});

	var moveRowsPlugin = new Slick.RowMoveManager({
		cancelEditOnDrag: true
	});

	moveRowsPlugin.onBeforeMoveRows.subscribe(function (e, data) {
		for (var i = 0; i < data.rows.length; i++) {
			// no point in moving before or after itself
			if (data.rows[i] == data.insertBefore || data.rows[i] == data.insertBefore - 1) {
				e.stopPropagation();
				return false;
			}
		}
		return true;
	});

	moveRowsPlugin.onMoveRows.subscribe(function (e, args) {
		var extractedRows = [], left, right;
		var rows = args.rows;
		var insertBefore = args.insertBefore;
		left = sgData2.slice(0, insertBefore);
		right = sgData2.slice(insertBefore, sgData2.length);

		rows.sort(function(a,b) { return a-b; });

		for (var i = 0; i < rows.length; i++) {
			extractedRows.push(sgData2[rows[i]]);
		}

		rows.reverse();

		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			if (row < insertBefore) {
				left.splice(row, 1);
			} else {
				right.splice(row - insertBefore, 1);
			}
		}

		sgData2 = left.concat(extractedRows.concat(right));

		var selectedRows = [];
		for (var i = 0; i < rows.length; i++)
		selectedRows.push(left.length + i);

		sgGrid2.resetActiveCell();
		//sgGrid2.setData(sgData2);
		for(ii in sgData2){
			var objTemp = $.extend(sgData2[ii],eval({"id":ii}));
		}
		
		dataView.setItems(sgData2);
		sgGrid2.setSelectedRows(selectedRows);
		sgGrid2.getSelectionModel().setSelectedRanges([]);
		sgGrid2.updateRowCount();
		sgGrid2.render();

	});

	sgGrid2.registerPlugin(moveRowsPlugin);
	sgGrid2.registerPlugin(checkboxSelector);
	dataView.beginUpdate();
	dataView.setItems(sgData2);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	$("#sasGridComment").show();
}

function fnDelHira(){
	var selectedIndexes = sgGrid2.getSelectedRows().sort().reverse();
	sgGrid2.setSelectedRows([]);
	sgData=sgGrid2.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgGrid2.getData().getItem(value); 
		if (item) sgGrid2.getData().deleteItem(item.id); 
	});
	sgGrid2.invalidate();
	sgGrid2.render();
}
