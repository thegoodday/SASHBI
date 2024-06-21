var sgGrid;
var dataView;
var columns;
var arrRiskScore;
$(document).ready(function () {
	//alert('한글');
	//$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid1();'>");
	//$("#dvToolBar").show();
});
function resizeGrid(){
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
}
setTimeout('resizeGrid();',500*1);
$(window).resize(function() {
	resizeGrid();
});
function setCellColor(){
	//$(".colorVH").parent().addClass("colorYELLOWP");
	//$(".colorVH").parent().css("background-color","#FF0000");
	//$(".colorH").parent().css("background-color","#FF8080");
	$(".colorVH").parent().css("color","#FF0000");
	$(".colorH").parent().css("color","#FF8080");
	$(".colorM").parent().css("color","#000000");
	$(".colorL").parent().css("color","#000000");
}
function setArr(base,keep_var){
	var new_data = new Array();
	for (var ii in base){
		var row = new Object();
		new_data.push(row);
		//console.log( base[ii].CRR_SCORE_KEY);
		for (var col in keep_var){
			new_data[ii][keep_var[col]] = base[ii][keep_var[col]] ;
		}
	}
	return new_data;
}
function CreateAddlHeaderRow() {
	var $preHeaderPanel = $(sgGrid.getPreHeaderPanel())
		.empty()
		.addClass("slick-header-columns")
		.css('left','-1000px')
		.width(sgGrid.getHeadersWidth());
	$preHeaderPanel.parent().addClass("slick-header");
	
	var headerColumnWidthDiff = sgGrid.getHeaderColumnWidthDiff();
	var m, header, lastColumnGroup = '', widthTotal = 0;
	
	for (var i = 0; i < columns.length; i++) {
		m = columns[i];
		if (lastColumnGroup === m.columnGroup && i>0) {
			widthTotal += m.width;
			header.width(widthTotal - headerColumnWidthDiff)
		} else {
			widthTotal = m.width;
			header = $("<div class='ui-state-default slick-header-column' />")
				.html("<span class='slick-column-name'>" + (m.columnGroup || '') + "</span>")
				.width(m.width - headerColumnWidthDiff)
				.appendTo($preHeaderPanel);
		}
		lastColumnGroup = m.columnGroup;
	}
}
function setSlickGrid(data){	
	console.log("setSlickGrid :\n" );

	$("#sasGrid").show();
	dataView = new Slick.Data.DataView();
	
	//var sasJsonRes=eval (data)[0];
	var sasJsonRes=data[0];
	
	columns =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	var options=sasJsonRes["Options"][0];
	options.createPreHeaderPanel= true;
	options.showPreHeaderPanel= true;
	options.preHeaderPanelHeight= 23;
	options.explicitInitialization= true;
	console.log("options");
	console.log(options);


	var isChk=options.chkBox;
	if (isChk){
		columns.push(checkboxSelector.getColumnDefinition());
		columns=$.extend(sasJsonRes["ColumInfo"],columns);;
	}
	columns=sasJsonRes["ColumInfo"];
	for(var ii in columns){
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	//columns[5].formatter=eval("RiskFommater");
	//columns[5].editor=eval("RiskEditor");	
	columns[1].columnGroup = "금월";
	columns[2].columnGroup = "금월";
	columns[3].columnGroup = "금월";
	columns[4].columnGroup = "금월";
	columns[5].columnGroup = "금년누계";
	columns[6].columnGroup = "금년누계";
	columns[7].columnGroup = "금년누계";
	columns[8].columnGroup = "금년누계";

	console.log("columns");
	console.log(columns);
	//console.log("columns");
	//console.log("columns \n" + JSON.stringify(columns));  
	//console.log("options \n" + JSON.stringify(options));
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
	
	selectDataLen=sgData.length;
	
	console.log("sgData");
	console.log(sgData);
	//dataView.setItems(sgData);	
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		//console.log("onRowCountChanged : " + args.rows);
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		//console.log("onRowsChanged : " + args.rows);
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});
	sgGrid.onDblClick.subscribe(function(e, args) {
		var cell = sgGrid.getCellFromEvent(e);
		var row = cell.row;
		var cur_col = cell.cell;
		var cur_target = sgData[0].mon_Inspection;
		console.log("cell");
		console.log(cell);
		console.log("cur_target : " + cur_target);
		if (cur_target > 0) {
			fnShowDetail();
		}
	});	
	
	sgGrid.init();
	
	sgGrid.onColumnsResized.subscribe(function (e, args) {
		CreateAddlHeaderRow();
	});
	
	CreateAddlHeaderRow();	
	
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}
function fnShowDetail(){
	tParams=eval('[{}]');
	tParams['save_path']=save_path;
	tParams['_p_base_date']=$("#sltp_base_date").val();
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0401_showDetail(StoredProcess)",'setSlickGridDetail');
	
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#sasGridDetailW").height(eval($(window).height()-600));
	$("#sasGridDetailW").width(eval($(window).width()-700));
	$("#sasGridDetail").height(eval($(window).height()-600));
	$("#dvModalWinDetail").css("left",eval(eval($(window).width()-$("#dvModalWinDetail").width()-40)/2));
	$("#dvModalWinDetail").css("top",eval(eval($(window).height()-$("#dvModalWinDetail").height()-0)/2));
	$('#dvModalWinDetail').show();	
}

function setSlickGridDetail(data){
	console.log("setSlickGrid :\n" );

	$("#sasGridDetail").show();
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
	for(var ii in columns){
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	//console.log("columns");
	//console.log(columns);
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log("sgData");
	console.log(sgData);
	
	sgGrid2 = new Slick.Grid("#sasGridDetail", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid2.updateRowCount();
		sgGrid2.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid2.invalidateRows(args.rows);
		sgGrid2.render();
	});
	sgGrid2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid2.registerPlugin(checkboxSelector);
	};
	sgGrid2.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid2.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
		setCellColor();
	});
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}