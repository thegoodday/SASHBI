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
	columns[1].columnGroup = "Month";
	columns[2].columnGroup = "Month";
	columns[3].columnGroup = "Month";
	columns[4].columnGroup = "Month";
	columns[5].columnGroup = "Month";
	columns[6].columnGroup = "Total";
	columns[7].columnGroup = "Total";
	columns[8].columnGroup = "Total";
	columns[9].columnGroup = "Total";
	columns[10].columnGroup = "Total";

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
