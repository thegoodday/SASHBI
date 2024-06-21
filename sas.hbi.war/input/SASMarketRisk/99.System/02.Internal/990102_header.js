$(document).ready(function () {
   //$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveOrg();'>");
   //$("#dvToolBar").append("<input type=button value=Delete id=btnDelete class=condBtn onclick='fnDeleteRowConfirm();'>");
   //$("#dvToolBar").show();
   console.log("990102_header.js");
   execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990102_getSubCategoryInfo(StoredProcess)",'getSubCategoryInfo');
   //alert("");
});
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-80));													
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
});		
var sgGrid;
var dataView;
var subCategoryInfo;
function comparer(a, b) {
	//console.log(a);
	var x = a[sortcol], y = b[sortcol];
	return (x == y ? 0 : (x > y ? 1 : -1));
}
function setSlickGrid(data){
	$("#sasGrid").show();
	dataView = new Slick.Data.DataView();
	
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
	columns[1].editor=eval("CategoryEditor");
	columns[4].editor=eval("SubCategoryEditor");
	columns[4].editor=eval("SubCategoryEditor");
	//columns[4].formatter=eval("NAFommater");	
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	
	//dataView.setItems(sgData)
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	
	dataView.setItems(sgData);	
	//console.log(columns);
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid.registerPlugin(checkboxSelector);
	}
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onSort.subscribe(function (e, args) {
		sortdir = args.sortAsc ? 1 : -1;
		sortcol = args.sortCol.field;
		dataView.sort(comparer, args.sortAsc);
	});
	dataView.onRowsChanged.subscribe(function(e,args) {
		console.log("RowsChanged:::::::::::");
		console.log(args);
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});	
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		console.log(sgData);
		var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		console.log(item);
		last_id =sgData[sgData.length-1].id; 
		new_id=eval(parseInt(last_id)+1);
		console.log("new_id : " + new_id);
		item = $.extend({},{id:new_id},item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);		

	})		
	sgGrid.onScroll.subscribe(function (e) {
		//setCellColor();
	});
	sgGrid.onMouseEnter.subscribe(function(e, args) {
		//setCellColor();
	});	
	sgGrid.onMouseLeave.subscribe(function(e, args) {
		//setCellColor();
	});		
	//setTimeout("setCellColor();",1*100);	

	
	$("#dvTools2").show();
	$("#progressIndicatorWIP").hide();
}
function chgDesc(obj){
	
	defaultValue=$(obj).val();
	console.log("selected Value : " + defaultValue);
	curCell=sgGrid.getActiveCell();
	console.log(curCell);
	sgData=sgGrid.getData().getItems();
	for(ii=0;ii<subCategoryInfo.length;ii++){
		if (subCategoryInfo[ii].sub_category == defaultValue){
			console.log("sub_category Mach!!!" + subCategoryInfo[ii].desc);
			sgData[curCell.row].desc=subCategoryInfo[ii].desc;
			sgData[curCell.row].lh=subCategoryInfo[ii].lh;
			sgGrid.updateCell(curCell.row,5);
			sgGrid.updateCell(curCell.row,6);
		}
	}		
	
}
function SubCategoryEditor(args){
	var $select;
	var defaultValue;
	var scope = this;

	this.init = function () {
		//console.log("init");
		//console.log(args);
		category=args.item["category"];
		console.log("category : " + category);
		console.log(subCategoryInfo);
		var objStr="<select tabIndex='0' class='editor-yesno' onChange='chgDesc(this)'>";
		objStr += "<option value=''></option>";
		for(ii=0;ii<subCategoryInfo.length;ii++){
			if (subCategoryInfo[ii].category == category){
				sub_category=subCategoryInfo[ii].sub_category;
				objStr += "<option value='" + sub_category + "'>" + sub_category +":(" +subCategoryInfo[ii].desc + ")"  + "</option>";
			}
		}
		objStr += "</select>";

		$select = $(objStr);
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
		//console.log("item : ");
		//console.log(item);
		defaultValue = item["sub_category"];
		console.log("defaultValue : " + defaultValue);
		$select.val(defaultValue);
	};

	this.serializeValue = function () {
		return ($select.val() == "yes");
	};

	this.applyValue = function (item, state) {
		console.log("applyValue:::::::::::::::::::::::::::");
		var txt=$select.find("option:selected").val();
		//console.log(item);
		//console.log(txt);
		item[args.column.field] = txt;
	};

	this.isValueChanged = function () {
		console.log("isValueChanged:::::::::::::::::::::::::::");
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
function getSubCategoryInfo(res){
	console.log("getSubCategoryInfo::::::::::::");
	console.log(res);
	subCategoryInfo=res;
}
function fnDeleteGR1(){
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
function CategoryFommater(row, cell, value, columnDef, dataContext) {
	var text="";
	var isErr=0;
	if( value==null) value="";
	if (isErr != 0){
		//console.log("Exist!!!");
		text = "<span class='colorWHITE'>" + value + "</span>";
	} else {
		//console.log("ERROR!!!");
		text = "<span class='colorYELLOW'>" + value + "</span>";
	}
	return text;
}
function CategoryEditor(args){
	console.log("YesNoSelectEditor");
	console.log(args);
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		var optItem="";
		YesNoList=[{val:"ALL",text:"전체"},{val:"EQUITY",text:"주식(EQUITY)"},{val:"IR",text:"금리(IR)"},{val:"CRD_SPRD",text:"신용스프레드(CRD_SPRD)"},{val:"FX",text:"환율(FX)"},{val:"COMMODITY",text:"상품(COMMODITY)"}]
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
		console.log("defaultValue : " + defaultValue);
		$select.val(defaultValue);
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
function fnSaveGR1(){
	if (!sgGrid.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid.getData().getItems();
	console.log('data');
	console.log(data);
	var gridData=JSON.stringify(data);	
	console.log(gridData);
	tParams['gridData']=gridData;
	tParams['_library']="mr_temp";
	tParams['_tablename']="rf_current";
	tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990102_save(StoredProcess)";
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