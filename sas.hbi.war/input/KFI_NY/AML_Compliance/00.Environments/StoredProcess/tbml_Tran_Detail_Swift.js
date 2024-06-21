$(document).ready(function () {
	//alert('한글');
	//$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid1();'>");
	//$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid1();'>");
	//$("#dvToolBar").show();
	//fnGetScore();
	$(document).keyup(function(e){
		if (e.keyCode == 27) {
			$('#dvModalWin').hide();
			$('#dvBG').hide();
		}
	});
	for(ii in uGroup){
		console.log("Group : " + uGroup[ii]);
	}
	var gsngno='';
	var approvalKey='';
	
	$("#condShowHide").attr('class','ui-accordion-header-icon ui-icon ui-icon-circle-arrow-s');
	$("#dvCondTable").hide();
	$("#condBottomMargin").height("0");
	$("#dvCondi").css('padding-bottom','0');
	$("#progressIndicatorWIP").hide();
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
var sgGrid;	
function fnGetScore(){
	tParams=eval('[{}]');
	tParams['category']="Country";
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0204_getRiskScore(StoredProcess)",'makeRiskScoreArr');
}
var arrRiskScore;
function makeRiskScoreArr(data){
	console.log("arrRiskScore");
	console.log(data);
	arrRiskScore=data;
}
function YesNoSelectEditor(args){
	//console.log("YesNoSelectEditor");
	//console.log(args);
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		var optItem="";
		YesNoList=[{val:"O",text:"O"},{val:"X",text:"X"}]
		for (var ii in YesNoList){
			optItem+="<option value='" + YesNoList[ii].val + "'>" + YesNoList[ii].text + "</option>";
		}
		$select = $("<SELECT tabIndex='0' class='editor-yesno'>"+ optItem +"</SELECT>");			
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
		defaultValue = item[args.column.id];		//item["JOB_TYPE"];
		//console.log("defaultValue : " + defaultValue);
		$select.val(defaultValue);
	};
	this.serializeValue = function () {
		return ($select.val() == "O");
	};
	this.applyValue = function (item, state) {
		var txt=$select.find("option:selected").val();
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
function RiskEditor(args) {
	//console.log("RiskEditor");
	//console.log(args);
	var $select;
	var defaultValue;
	var scope = this; 
	this.init = function () {
		var data=sgGrid.getData().getItems();
		var isActive=data[args.item.id].CHANGE_CURRENT_IND;
		console.log("isActive : " + isActive);
   	if (isActive == 'Y') {
			var optItem="";
			YesNoList=[{val:"VH",text:"VH"},{val:"H",text:"H"},{val:"M",text:"M"},{val:"L",text:"L"}]
			for (var ii in YesNoList){
				optItem+="<option value='" + YesNoList[ii].val + "'>" + YesNoList[ii].text + "</option>";
			}
			$select = $("<SELECT tabIndex='0' class='editor-yesno'>"+ optItem +"</SELECT>");			
			$select.appendTo(args.container);
			$select.focus();
		} else {
	      $select = $("<span style='color:#f00'>Not Available!</span>")
	          .appendTo(args.container)
	          .focus();
		}
	};
	this.destroy = function () {
		$select.remove();
		console.log("destroy=======================");
	};
	this.focus = function () {
		$select.focus();
	};
	this.loadValue = function (item) {
		defaultValue = item[args.column.id];		//item["JOB_TYPE"];
		//console.log("defaultValue : " + defaultValue);
		$select.val(defaultValue);
		
		var data=sgGrid.getData().getItems();
		//console.log("data::" + args.item.id);
		//console.log(data[args.item.id].RISK);
		for (var ii in arrRiskScore){
			console.log("arrRiskScore : " + arrRiskScore[ii].RISK	+ " : " + data[args.item.id].RISK);
			if (arrRiskScore[ii].RISK	== data[args.item.id].RISK ) {
				data[args.item.id].RISK_SCORE = arrRiskScore[ii].RISK_SCORE; 	
			}
		}		
	};
	this.serializeValue = function () {
		return ($select.val() == "yes");
	};
	this.applyValue = function (item, state) {
		var txt=$select.find("option:selected").val();
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

function setCellColor(){
	//$(".colorVH").parent().addClass("colorYELLOWP");
	//$(".colorVH").parent().css("background-color","#FF0000");
	//$(".colorH").parent().css("background-color","#FF8080");
	$(".colorVH").parent().css("color","#FF0000");
	$(".colorH").parent().css("color","#FF8080");
	$(".colorM").parent().css("color","#000000");
	$(".colorL").parent().css("color","#000000");
}
function RiskFommater(row, cell, value, columnDef, dataContext) {
	var text="";
	if( value==null) value="";
	if (value == "VH"){
		text = "<span style='font-weight:normal;' class='colorVH'>" + value + "</span>";
	} else if (value == "H"){
		text = "<span style='font-weight:normal;' class='colorH'>" + value + "</span>";
	} else if (value == "M"){
		text = "<span style='font-weight:normal;' class='colorM'>" + value + "</span>";
	} else if (value == "L"){
		text = "<span style='font-weight:normal;' class='colorL'>" + value + "</span>";
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
	
	console.log("data : " + JSON.stringify(data));

	$("#sasGrid").show();
	var dataView = new Slick.Data.DataView();
	
	//var sasJsonRes=eval (data)[0];
	/* 10/21 수정 */
	if(data == null){
			
		$('#sasGrid').html('<div>No Data</div>');
		setTimeout("setCellColor();",1*100);	
		$("#dvToolBar").hide();
		$("#progressIndicatorWIP").hide();
		
		return;
	}
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
	//columns[3].formatter=eval("RiskCodeFommater");
	//columns[4].editor=eval("YesNoSelectEditor");	

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
	console.log(JSON.stringify(sgData));
	//dataView.setItems(sgData);	
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		console.log("onRowCountChanged");
		//console.log("onRowCountChanged : " + args.rows);
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		console.log("onRowsChanged");
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
		setCellColor();
	});
	sgGrid.onDblClick.subscribe(function(e, args) {
		var cell = sgGrid.getCellFromEvent(e);
		var row = cell.row;
		var data=sgGrid.getData().getItems();
		var swiftmsgno=data[row].SWIFTMSGNO;
		var dpmsgbnkmgtno=data[row].DPMSGBNKMGTNO;
		
		tParams=eval('[{}]');
		tParams['swiftmsgno']=swiftmsgno;
		tParams['dpmsgbnkmgtno']=dpmsgbnkmgtno;
		console.log("swiftmsgno : " + swiftmsgno);
		console.log("dpmsgbnkmgtno : " + dpmsgbnkmgtno);
		$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/tbml_Tran_Detail_Swift_Info(StoredProcess)",'tbmlTransDetSwift');
		showPopup();
	});	
	sgGrid.onCellChange.subscribe(function(e, args) {
		setTimeout("setCellColor();",100*1);
	});	
	sgGrid.onMouseEnter.subscribe(function(e, args) {
		console.log("onMouseEnter");
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
		setCellColor();
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
	$("#dvToolBar").hide();
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

function checkEditorLock(){
		if (!mrGrid.getEditorLock().commitCurrentEdit()) {
		return;
	}		
}

function showPopup(){
	
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-200)/2));
	$('#dvModalWin').show();
	//$("#matGridWrap").width($("#tbInfo").width());
}
function tbmlTransDetSwift(data){
	console.log("dispCustomerInformation");
	console.log(data);
	
	$("#SWIFTMSGNO").html(data[0].SWIFTMSGNO);
	$("#MTNO").html(data[0].MTNO);
	$("#DPMSGBNKBIC").html(data[0].DPMSGBNKBIC);
	$("#DPMSGBNKMGTNO").html(data[0].DPMSGBNKMGTNO);
	$("#SWIFTMSGCTNT").html(data[0].SWIFTMSGCTNT.replace(/(?:\r\n|\r\n)/g, '<br/>'));
}

/* Compliance Lev3, Lev4 Info */


var mrGrid;	

function fnAttDown(){
	console.log("File Download !!!");
	
		$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0301_downLoadFile(StoredProcess)",'fnDownload');
		
		
}

function fnDownload(data){
	console.log(data);
}

function checkState(state){
	var str = "N";
	if(state){
		str = "Y";
	}
	return str;
}

function checkDefaultValue(columnField){
	console.log("columnField : " + columnField);
	if(columnField == 'undefined'){
		return false;
	}else if(columnField == 'Y'){
		return true;
	}else{
		return false;
	}
		
}