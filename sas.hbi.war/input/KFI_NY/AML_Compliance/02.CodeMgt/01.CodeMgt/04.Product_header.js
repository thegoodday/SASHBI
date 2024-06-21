var sgGrid;
var arrRiskScore;
var dataView;
var maxSeq=0;
var selectDataLen=0;

$(document).ready(function () {
	//alert('한글');
	//$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid1();'>");
    $("#dvToolBar").append("<input type=button value=Add id=btnSave class=condBtn onclick='fnAddRow();'>");
	$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid1();'>");
	//$("#dvToolBar").show();
	fnGetScore();
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
function fnGetScore(){
	tParams=eval('[{}]');
	tParams['category']="Product";
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0204_getRiskScore(StoredProcess)",'makeRiskScoreArr');
}
function makeRiskScoreArr(data){
	console.log("arrRiskScore");
	console.log(data);
	arrRiskScore=data;
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
				item.RISK_SCORE = arrRiskScore[ii].RISK_SCORE; 	
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
function PercentCompleteFormatter(row, cell, value, columnDef, dataContext) {
  if (value == null || value === "") {
    return "-";
  } else if (value < 50) {
    return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
  } else {
    return "<span style='color:green'>" + value + "%</span>";
  }
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
    
	//Get Max Sequence
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0204_Product_getMaxSeq(StoredProcess)",'fnSetMaxSeq');
	
	console.log("setSlickGrid :\n" );

	$("#sasGrid").show();
	dataView = new Slick.Data.DataView();
	
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
	columns[3].formatter=eval("RiskCodeFommater");
	columns[4].formatter=eval("RiskCodeFommater");
	columns[5].formatter=eval("RiskFommater");
	columns[5].editor=eval("RiskEditor");	

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
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid.onCellChange.subscribe(function(e, args) {
		setTimeout("setCellColor();",100*1);
    	sgGrid.invalidate();
    	sgGrid.render();
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
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}

function fnSetMaxSeq(data){
	//console.log("fnSetMaxSeq");
	//console.log(data);
    maxSeq = data.MAX_SEQ;
}

function fnIsNull(p_value) {    
    if (p_value == "" || p_value == null || p_value == undefined) {
        return true;
    } else {
        return false;
    }
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
    
    //~ Validate ---------------------------------------------------------------
    var invalidIdx = -1;
    var isValid = true;
    var invalidColumn="CODE";
    var data=sgGrid.getData().getItems();
    
    for (var idx=0;idx < data.length; idx++) {
        if(fnIsNull(data[idx].CODE)) {
            //console.log("idx "+idx+" CODE is null");
            isValid=false;
            invalidColumn="CODE";
            invalidIdx=idx;
            break;
        }
        if(fnIsNull(data[idx].CODE_NAME_EN)) {
            //console.log("idx "+idx+" CODE_NAME is null");
            isValid=false;
            invalidColumn="CODE_NAME_EN";
            invalidIdx=idx;
            break;
        }        
    }    
    
    if(!isValid) {
        sgGrid.scrollRowIntoView(invalidIdx);
        sgGrid.flashCell(invalidIdx, sgGrid.getColumnIndex(invalidColumn), 100);
        setTimeout("alertMsg('This is a required field.')",1*500);
        return;
    }    
    
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
	
	var keep_var=['CRR_SCORE_KEY', 'CODE', 'CODE_NAME_EN', 'CODE_NAME_KO', 'RISK', 'RISK_SCORE', 'CHANGE_CURRENT_IND'];
	var send_data = setArr(data,keep_var);
	console.log('send_data');
	console.log(send_data);
	
	var gridData=JSON.stringify(send_data);	
	console.log(gridData);
	tParams['_savepath']=save_path;
	tParams['gridData']=gridData;
	tParams['_library']="stp_temp";
	tParams['_tablename']="fsb_crr_product_score";
	tParams['_program']="SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0204_Product_saveRiskScore(StoredProcess)";
	console.log("gridData : ");
	console.log(gridData);
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSaveResult","json"); 
	$('#dvModalWin').hide();
}
function fnSaveResult(data){
	//alertMsg(data.MSG);
	setTimeout('submitSTP();',500*1);
	if (data.MSG == "Successfully saved...") {
		//alertMsg("성공적으로 저장되었습니다.");
		alertMsg("Sucessfully Saved.");
	}
	console.log("save_path : " + save_path);
}

function fnAddRow(){
    var newRow={};
    newId = sgGrid.getData().getLength();
    
    var addIdx=(newId-selectDataLen)+1;
    var addSeq=maxSeq+addIdx;    
    
    newRow.id = ""+eval(newId);
    newRow.chk=1;    
    newRow.CRR_SCORE_KEY=addSeq;
    newRow.CODE_NAME_EN="";
    newRow.CODE_NAME_KO="";
	newRow.RISK="H";
	newRow.RISK_SCORE=100;
	newRow.CHANGE_USERID=userID;
	newRow.CHANGE_BEGIN_DATE="";
	newRow.CHANGE_END_DATE="";
	newRow.CHANGE_CURRENT_IND="Y";	
	
	dataView.beginUpdate();
    dataView.addItem(newRow);
    dataView.endUpdate();

    sgGrid.updateRowCount();
    sgGrid.render();
    setCellColor();    
	
    var dataLen=selectDataLen;
	dataView.getItemMetadata=function(row){
	    if (row >= dataLen) {
	        return {
	            "columns":{
	                "CRR_SCORE_KEY":{editor:eval("Slick.Editors.Dummy"), formatter:eval("Slick.Formatters.text")}
	               ,"CODE":{editor:eval("Slick.Editors.Text"), formatter:eval("Slick.Formatters.text")}
	               ,"CODE_NAME_EN":{editor:eval("Slick.Editors.Text"), formatter:eval("RiskCodeFommater")}
	               ,"CODE_NAME_KO":{editor:eval("Slick.Editors.Text"), formatter:eval("RiskCodeFommater")}
	               ,"RISK":{editor:eval("RiskEditor"), formatter:eval("RiskFommater")}
	            }
            };
        }
    };    
    
    sgGrid.scrollRowIntoView(newId);
}

