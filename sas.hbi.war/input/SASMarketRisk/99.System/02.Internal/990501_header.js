$(document).ready(function () {
   $("#dvToolBar").append("<input type=button value=Load id=btnSave class=condBtn onclick='fnLoadTables();'>");
   $("#dvToolBar").append("<input type=button value=Unload id=btnSave class=condBtn onclick='fnUnoadTables();'>");
   $("#dvToolBar").show();
});
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
});		

var sgGrid;
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
	columns[2].formatter=eval("StatusFommater");
	//columns[4].editor=eval("HierEditor");

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
function StatusFommater(row, cell, value, columnDef, dataContext) {
	var text="";
	var isErr=0;
	if( value==null) value="";
	if (value == "L"){
		text = "<img src='/SASHBI/images/vimg/circle_green.png' style='padding-top:10px;width:20px;height:20px' border=0 title='Success'>";
	} else if (value == "U"){
		text = "<img src='/SASHBI/images/vimg/circle_red.png' style='padding-top:10px;width:20px;height:20px' border=0 title='Fail'>";
	}
	return text;
}
function fnLoadTables(){
	var selected = sgGrid.getSelectedRows();
	sgData=sgGrid.getData().getItems();
	console.log("selected")	
	console.log(selected);
	var tables="";
	$.each(selected, function (index, value) {
		var item = sgGrid.getData().getItem(value); 
		tables += "|" + item.Name;
	});
	console.log("tables : " + tables);
	tParams=eval('[{}]');
	tParams['tables']=tables;
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990501_load_tables(StoredProcess)",'fnShowMsg');
}
function fnShowMsg(data){
   //alertMsg(data.MSG);
   if (data.MSG == "Successfully saved...") {
   	alertMsg("성공적으로 Lasr 서버에 저장되었습니다.");
   }
   //save_path=data._savepath;
}
function fnUnoadTables(){
	var selected = sgGrid.getSelectedRows();
	sgData=sgGrid.getData().getItems();
	console.log("selected")	
	console.log(selected);
	var tables="";
	$.each(selected, function (index, value) {
		var item = sgGrid.getData().getItem(value); 
		tables += "|" + item.Name;
	});
	console.log("tables : " + tables);
	tParams=eval('[{}]');
	tParams['tables']=tables;
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990501_unload_tables(StoredProcess)",'fnShowMsg');
}