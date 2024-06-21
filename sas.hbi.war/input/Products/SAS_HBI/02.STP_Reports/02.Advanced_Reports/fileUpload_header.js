$(document).ready(function () {
	//alert("");
	//$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid1();'>");
	//$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid1();'>");
	$("#dvToolBar").show();
	$("#dvToolBar2").show();
});
$(window).resize(function() {
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
	//$("#sasGrid").width(eval($(window).width()-570));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-23));
});
var sgGrid;	
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
function SelectEditor(args) {
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function() {
		console.log(args);
		if(args.column.options){
			opt_values = args.column.options.split(',');
		}else{
			opt_values ="yes,no".split(',');
		}
		option_str = "";
		for( i in opt_values ){
			v = opt_values[i];
			option_str += "<OPTION value='"+v+"'>"+v+"</OPTION>";
		}
		$select = $("<SELECT tabIndex='0' class='editor-yesno'>"+ option_str +"</SELECT>");
		$select.appendTo(args.container);
		$select.focus();
	};
	this.destroy = function() {
		$select.remove();
	};
	this.focus = function() {
		$select.focus();
	};
	this.loadValue = function(item) {
		defaultValue = item[args.column.field];
		$select.val(defaultValue);
	};
	this.serializeValue = function() {
	if(args.column.options){
	  return $select.val();
	}else{
	  return ($select.val() == "yes");
	}
	};
	this.applyValue = function(item,state) {
		item[args.column.field] = state;
	};
	this.isValueChanged = function() {
		return ($select.val() != defaultValue);
	};
	this.validate = function() {
		return {
		    valid: true,
		    msg: null
		};
	};
	this.init();
}
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
	columns[2].options="BASE,INST_BOND,INST_SWAP";	
	columns[2].editor=eval("SelectEditor");	

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
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid.onMouseEnter.subscribe(function(e, args) {
		setCellColor();
	});	
	sgGrid.onMouseLeave.subscribe(function(e, args) {
		setCellColor();
	});		
	sgGrid.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		/*
		*/
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		console.log("item : ")
		console.log(item)
		$.extend(item, args.item);
		dataView.addItem(item);		
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#progressIndicatorWIP").hide();
}
function fnDeleteGrid1(){
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
function fnSaveGrid1(){
	var isSave = confirmMsg("Are you sure you want to save?","fnConfirmSaveGrid1");	
}
function fnConfirmSaveGrid1(){
	if (!sgGrid.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid.getData().getItems();
	console.log('data');
	console.log(data);
	var gridData=JSON.stringify(data);	
	console.log(gridData);
	tParams['_savepath']=save_path;
	tParams['gridData']=gridData;
	tParams['_library']="mr_temp";
	tParams['_tablename']="check_invalid";
	tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990205_save_check_invalid(StoredProcess)";
	console.log("gridData : ");
	console.log(gridData);
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSaveResult","json"); 
	$('#dvModalWin').hide();
}
function fnSaveResult(data){
	alertMsg(data.MSG);
	console.log("save_path : " + save_path);
}