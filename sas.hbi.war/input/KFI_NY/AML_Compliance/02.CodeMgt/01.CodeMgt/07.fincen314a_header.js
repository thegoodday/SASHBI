$(document).ready(function () {
	//$("#dvToolBar").append("<input type='submit' value='FinCEN File Upload' id=btnUpload class=condBtn onclick='showPopupFinCEN();' />");
	//$("#dvToolBar").append("<input type='submit' value='Screen File' id=btnUpload class=condBtn onclick='showPopupScreen();' />");
	//$("#btnRun").val("Search");
	$(".buttonArea").append("<input type='submit' value='Screen File' id=btnUpload class=condBtn onclick='showPopupScreen();' />");
		
	$("#dvToolBar").show();
	setTimeout('fnGetFileList();',1000*2);
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
	columns[8].formatter=eval("DetailViewFommater");
	
	
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
function fnUploadFile(){
	console.log("fnUploadFile start.........");
	//event.preventDefault();
	$("#progressIndicatorWIP").show();
	var form = $("#fomUpload")[0];
	var updata = new FormData(form);
	updata.append("_savepath",save_path);
	$("#btnUpload2").prop("disabled",true);
	$.ajax({
		enctype: 'multipart/form-data',
		type: "post",
		url: "/SASStoredProcess/do",
		_program : 'SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0207_saveUploadFile(StoredProcess)',
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
			fnCBUploadFile(data);
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
function fnCBUploadFile(data){
	console.log("fnCBUploadFileN*****************************************************************************");
	//console.log(data);
	setSlickGridFileList(data);
	alertMsg("Successfully File Uploaded...");
	$("#btnUpload2").prop("disabled",false);
}
function fnGetFileList(){
	tParams=eval('[{}]');
	tParams['save_path']=save_path;
	console.log('getFileList save_path : ' + save_path);
	tParams['category']="Country";
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0207_getFileList(StoredProcess)",'setSlickGridFileList');
}
function showPopupFinCEN(){
	fnGetFileList();
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-200)/2));
	$('#dvModalWin').show();
}

function showPopupScreen(){
	console.log(FinCENFileList);
	console.log(FinCENFileList[0]["SASResult"].length);
	if (curFinCENFile == "" || curFinCENFile == undefined){
		if (FinCENFileList[0]["SASResult"].length > 0){
			curFinCENFile=FinCENFileList[0]["SASResult"][0].filename;
			$("#finCENFile").html(curFinCENFile);
		}
	}
	console.log("curFinCENFile : " + curFinCENFile);
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalWinScreen").css("left",eval(eval($(window).width()-$("#dvModalWinScreen").width()-0)/2));
	$("#dvModalWinScreen").css("top",eval(eval($(window).height()-$("#dvModalWinScreen").height()-200)/2));
	$('#dvModalWinScreen').show();
}

function setSlickGridFileList(data){
	console.log("setSlickGridFileList :\n" );
	FinCENFileList=data;
	
	//$("#container").find(".slick-header").css("height","0px");
	$("#sasGridFileList").show();
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
	//columns[6].formatter=eval("RiskFommater");
	
	
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
	
	sgGrid2 = new Slick.Grid("#sasGridFileList", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		//console.log("onRowCountChanged : " + args.rows);
		sgGrid2.updateRowCount();
		sgGrid2.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		//console.log("onRowsChanged : " + args.rows);
		sgGrid2.invalidateRows(args.rows);
		sgGrid2.render();
	});
	sgGrid2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: true}));
	if (isChk){
  		sgGrid2.registerPlugin(checkboxSelector);
	};
	sgGrid2.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid2.onClick.subscribe(function(e, args) {
		var cell = sgGrid2.getCellFromEvent(e);
		var row = cell.row;
		var data=sgGrid2.getData().getItems();
		//curFinCENFile=data[row].filename;
		//console.log("curFinCENFile : " + curFinCENFile);
		$("#finCENFile").html(curFinCENFile);
	});	
	sgGrid2.onScroll.subscribe(function (e) {
		//setCellColor();
	});
	sgGrid2.onMouseEnter.subscribe(function(e, args) {
		//setCellColor();
	});	
	sgGrid2.onMouseLeave.subscribe(function(e, args) {
		//setCellColor();
	});		
	sgGrid2.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid2.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		item = $.extend({},item);
		item.id = sgGrid2.getData().getItems().length;
		console.log("item : ")
		console.log(item)
		$.extend(item, args.item);
		dataView.addItem(item);		
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}
function fnSelectFinCEN(){
	var selected = sgGrid2.getSelectedRows();
	sgData2=sgGrid2.getData().getItems();
	console.log("selected")	
	console.log(selected);
	console.log(sgData2);
	for(var ii in selected){
		curFinCENFile=sgData2[selected[ii]].filename;
		console.log("ii : " + sgData2[selected[ii]].filename);
	}
	console.log("curFinCENFile : " + curFinCENFile);
	$("#finCENFile").html(curFinCENFile);

	$('#dvModalWin').hide();
	//$('#dvBG').hide();
}	

function fnScan(){
	tParams=eval('[{}]');
	tParams['fincenfile']=$("#finCENFile").html();
	tParams['start_date']=$("#txtFinStartDate").val();
	tParams['end_date']=$("#txtFinEndDate").val();
	tParams['threshold']=$("#sltThreshold option:selected").val();
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0207_scan(StoredProcess)",'cbScan');

	$('#dvModalWinScreen').hide();	
}
function cbScan(data){
	alertMsg("Successfully Scan...");	
	setSlickGrid(data);
}
function fnShowDetailView(row){
	row_for_detail=row;
	sgData=sgGrid.getData().getItems();
	//console.log(sgData);
	search_date = sgData[row].search_date_d;
	file_repid = sgData[row].FILE_REPID;
	filename = sgData[row].FILE_NAME;
	entity_type_cd = sgData[row].ENTITY_TYPE_CD;
	sensitivity_rate = sgData[row].SENSITIVITY_RATE;
	
	tParams=eval('[{}]');
	tParams['search_date']=search_date;
	tParams['file_repid']=file_repid;
	tParams['filename']=filename;
	tParams['entity_type_cd']=entity_type_cd;
	tParams['sensitivity_rate']=sensitivity_rate;
	console.log(tParams);
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0207_showDetailData(StoredProcess)",'setSlickGridDetailData');
	
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#sasGridDetailW").height(eval($(window).height()-200));
	$("#sasGridDetailW").width(eval($(window).width()-100));
	$("#sasGridDetail").height(eval($(window).height()-200));
	$("#dvModalWinDetail").css("left",eval(eval($(window).width()-$("#dvModalWinDetail").width()-40)/2));
	$("#dvModalWinDetail").css("top",eval(eval($(window).height()-$("#dvModalWinDetail").height()-0)/2));
	$('#dvModalWinDetail').show();
}
function setSlickGridDetailData(data){
	console.log("setSlickGridDetailData :\n" );
	
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
	columns[11].formatter=Slick.Formatters.Checkmark;
	columns[12].formatter=Slick.Formatters.Text;
	columns[11].editor=Slick.Editors.Checkbox;
	columns[12].editor=Slick.Editors.Text;
		
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
	
	sgGrid3 = new Slick.Grid("#sasGridDetail", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		//console.log("onRowCountChanged : " + args.rows);
		sgGrid3.updateRowCount();
		sgGrid3.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		//console.log("onRowsChanged : " + args.rows);
		sgGrid3.invalidateRows(args.rows);
		sgGrid3.render();
	});
	sgGrid3.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: true}));
	if (isChk){
  		sgGrid3.registerPlugin(checkboxSelector);
	};
	sgGrid3.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid3.onClick.subscribe(function(e, args) {
	});	
	sgGrid3.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = sgGrid3.getCellFromEvent(e);
		console.log("onContextMenu");
		console.log(cell);
		if (cell.cell == 21 || cell.cell == 22) {
			detail_curcell=cell.cell;
			detail_currow=cell.row;
			$("#contextMenu")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
		}
		$("body").one("click", function () {
			$("#contextMenu").hide();
		});
	});	
	sgGrid3.onScroll.subscribe(function (e) {
		//setCellColor();
	});
	sgGrid3.onMouseEnter.subscribe(function(e, args) {
		//setCellColor();
	});	
	sgGrid3.onMouseLeave.subscribe(function(e, args) {
		//setCellColor();
	});		
	sgGrid3.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid3.onAddNewRow.subscribe(function (e, args) {
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}
function fnSaveDetail(){
	if (!sgGrid3.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid3.getData().getItems();
	console.log('data');
	console.log(data);
	
	var keep_var=['FILE_NAME','FILE_REPID','SEQ_NO','TRUE_CUSTOMER','USER_COMMENTS'];
	var send_data = setArr(data,keep_var);
	for (var ii in send_data){
		console.log("send data : " + send_data[ii].TRUE_CUSTOMER);
		if (send_data[ii].TRUE_CUSTOMER) {
			send_data[ii].TRUE_CUSTOMER="O";
		} else {
			send_data[ii].TRUE_CUSTOMER="";
		}
	}
	console.log('send_data');
	console.log(send_data);
	
	var gridData=JSON.stringify(send_data);	
	console.log(gridData);
	tParams['_savepath']=save_path;
	tParams['gridData']=gridData;
	tParams['_library']="stp_temp";
	tParams['_tablename']="fsb_314a_search_result";
	tParams['_program']="SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0207_saveDetailData(StoredProcess)";
	console.log("gridData : ");
	console.log(gridData);
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"cbSaveDetailData","json"); 
	$('#dvModalWinDetail').hide();		
}
function cbSaveDetailData(data){
	alertMsg("Successfully Scan...");	
	//setSlickGrid(data);
}
function fnCopytoAllRows(){
	console.log("detail_currow : " + detail_currow);
	var data=sgGrid3.getData().getItems();
	if (detail_curcell == 21){
		copy_val=data[detail_currow].TRUE_CUSTOMER;
		for (var ii in data){
			data[ii].TRUE_CUSTOMER = copy_val;
		}	
	} else if (detail_curcell == 22){
		copy_val=data[detail_currow].USER_COMMENTS;
		for (var ii in data){
			data[ii].USER_COMMENTS = copy_val;
		}	
	}
	sgGrid3.invalidate();
	sgGrid3.render();
}

function fnExcelDetail(){
	var myForm = fomExcel2;
	myForm.action = "/SASStoredProcess/do";
	myForm.target = 'fileDown';
	myForm._program.value = "/KFI_NY/AML Compliance/00.Environments/StoredProcess/0207_showDetailData";
	myForm._savepath.value = save_path;
	myForm._debug.value = "0";
	myForm.submit();	
}