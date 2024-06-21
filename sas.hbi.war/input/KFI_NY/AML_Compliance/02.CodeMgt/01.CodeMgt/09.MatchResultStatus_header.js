$(document).ready(function () {
	//alert('');
	//$("#dvToolBar").append("<input type='submit' value='FinCEN File Upload' id=btnUpload class=condBtn onclick='showPopupFinCEN();' />");
	//$("#dvToolBar").append("<input type='submit' value='Screen File' id=btnUpload class=condBtn onclick='showPopupScreen();' />");
	//$("#btnRun").val("Search");
	$(".buttonArea").append("<input type='submit' value='Screen File' id=btnUpload class=condBtn onclick='showPopup();' />");
		
	$("#dvToolBar").show();
	$("#txtFinStartDate").datepicker({
		defaultDate: "0m",
		numberOfMonths: 1,
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true
	});
	$("#txtFinStartDate").datepicker("option","dateFormat","yy-mm-dd");	
	$("#txtFinEndDate").datepicker({
		defaultDate: "0m",
		numberOfMonths: 1,
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true
	});
	$("#txtFinEndDate").datepicker("option","dateFormat","yy-mm-dd");	
	$(document).keyup(function(e){
		if (e.keyCode == 27) {
			if($('#dvModalWin').is(':visible')){
				$('#dvModalWin').hide();
			} else {
				$('#dvModalWinScreen').hide();
			}
			$('#dvModalWinDetail').hide();
			$('#dvBG').hide();
		}
	});

});
var curFinCENFile;
var sgGrid, sgGrid2;	
var arrRiskScore;
var FinCENFileList;
var detail_currow;
var detail_curcell;
var row_for_detail;
function resizeGrid(){
	//$("#header").height(eval($(window).height()-$("#dvCondi").height()-75));
	//$("#header").width(eval($(window).width()-30));
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
function fnGetScore(){
	tParams=eval('[{}]');
	tParams['category']="Country";
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0204_getRiskScore(StoredProcess)",'makeRiskScoreArr');
}
function makeRiskScoreArr(data){
	console.log("arrRiskScore");
	//console.log(data);
	arrRiskScore=data;
}
function DetailViewFommater(row, cell, value, columnDef, dataContext) {
	var data=sgGrid.getData().getItems();
	console.log("row risk : " + data[row].detail);
	var detail=data[row].detail;
	var text="";
	if (detail == "1") {
		text="<img src='/SASHBI/images/DataSetExplore.gif' id=btnExcelDL style='cursor: pointer;width:18px;padding-top:2px;' onclick='fnShowDetailView(" + row+");' />";
	}
	return text;
}
function RiskFommater(row, cell, value, columnDef, dataContext) {
	var text="";
	if( value==null) value="";
	if (value == "Excel"){
		//text = "<span style='font-weight:normal;' class='colorVH'>" + value + "</span>";
		//text = "<input type='image' img src='/SASHBI/images/ExcelFile.gif' id=btnExcelDL class=condBtn onclick='exportEXCEL_FIN();' />";
		text = "<img src='/SASHBI/images/ExcelFile.gif' id=btnExcelDL class=condBtn onclick='exportEXCEL_FIN();' />";
		//$input = $("<input type='image' img src='/SASHBI/images/ExcelFile.gif' id=btnExcelDL class=condBtn onclick='exportEXCEL_FIN();' />")
	}
	return text;
}
function RiskCodeFommater(row, cell, value, columnDef, dataContext) {
	console.log("row : " + row);
	var data=sgGrid.getData().getItems();
	console.log("row risk : " + data[row].RISK);
	var risk=data[row].RISK;
	var text="";
	if( value==null) value="";
	if (risk == "VH"){
		text = "<span style='font-weight:normal;' class='colorVH'>" + value + "</span>";
	} else if (risk == "H"){
		text = "<span style='font-weight:normal;' class='colorH'>" + value + "</span>";
	} else if (risk == "M"){
		text = "<span style='font-weight:normal;' class='colorM'>" + value + "</span>";
	} else if (risk == "L"){
		text = "<span style='font-weight:normal;' class='colorL'>" + value + "</span>";
	}
	return text;
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
function setSlickGrid(data){
	console.log("setSlickGrid :\n" );
	
	//$("#container").find(".slick-header").css("height","0px");
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
	for(var ii in columns){
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	//columns[8].formatter=eval("DetailViewFommater");
	
	
	//console.log("columns");
	//console.log(columns);
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
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onScroll.subscribe(function (e) {
		//setCellColor();
	});
	sgGrid.onMouseEnter.subscribe(function(e, args) {
		//setCellColor();
	});	
	sgGrid.onMouseLeave.subscribe(function(e, args) {
		//setCellColor();
	});		
	sgGrid.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
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
	//setTimeout("setCellColor();",1*100);	
	$("#dvToolBar").show();
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
function fnScan(){
	console.log("fnUploadFile start.........");
	//event.preventDefault();
	$('#dvModalWin').hide();
	$('#dvBG').hide();
	$("#progressIndicatorWIP").show();
	var form = $("#fomUpload")[0];
	var updata = new FormData(form);
	
	var Hit_Status=$("#sltHit_Status option:selected").val();
	var Test_Date_start=$("#sltTest_Date_start").val();
	var Test_Date_end=$("#sltTest_Date_end").val();	
	updata.append("Hit_Status",Hit_Status);
	updata.append("Test_Date_start",Test_Date_start);
	updata.append("Test_Date_end",Test_Date_end);
	updata.append("_savepath",save_path);
	$("#btnUpload2").prop("disabled",true);
	$.ajax({
		enctype: 'multipart/form-data',
		type: "post",
		url: "/SASStoredProcess/do",
		_program : 'SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0209_saveUploadFile(StoredProcess)',
		dataType: 'json',
		data: updata,
		processData: false,
		contentType: false,
		cache: false,
		timeout: 600000,
		success : function(data){
			$("#btnUpload2").prop("disabled",false);
			console.log("execSTPA success" );
			//console.log(data);
			cbScan(data);
		},
		complete: function(data){
			//data.responseText;	
			isRun=0;
			tParams=eval('[{}]');
			$("#btnUpload2").prop("disabled",false);
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			//alert(error);
		}			
	});
}

function cbScan(data){
	alertMsg("Successfully Scan...");	
	setSlickGrid(data);
}
function showPopup(){
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-200)/2));
	$('#dvModalWin').show();
}