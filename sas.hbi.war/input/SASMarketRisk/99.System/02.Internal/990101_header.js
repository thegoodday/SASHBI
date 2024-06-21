$(document).ready(function () {
   $("#dvToolBar").append("<input type=button value=Delete id=btnDelete class=condBtn onclick='fnDeleteRowConfirm();'>");
   $("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveOrg();'>");
   $("#dvToolBar").show();
   execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990102_getSubCategoryInfo(StoredProcess)",'getSubCategoryInfo');
});
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-80));													
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
});
function getSubCategoryInfo(res){
	console.log("getSubCategoryInfo::::::::::::");
	console.log(res);
	subCategoryInfo=res;
}		
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
	//columns[4].formatter=eval("HierFommater");
	columns[1].editor=eval("CategoryEditor");
	//columns[2].editor=eval("SubCategoryEditor");

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
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);		
		/*
		sgData.push(item);
		for(var ii in sgData){sgData[ii].id=ii;}
		dataView.beginUpdate();
		dataView.setItems(sgData);
		dataView.endUpdate();	
		sgGrid.updateRowCount();
		sgGrid.render();	
		*/
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
function SubCategoryEditor(args){
	var $select;
	var defaultValue;
	var scope = this;

	this.init = function () {
		//console.log("init");
		//console.log(args);
		category=args.item["category"];
		//console.log("category : " + category);
		//console.log(subCategoryInfo);
		var objStr="<select tabIndex='0' class='editor-yesno'>";
		for(ii=0;ii<subCategoryInfo.length;ii++){
			if (subCategoryInfo[ii].CATEGORY == category){
				sub_category=subCategoryInfo[ii].sub_category;
				objStr += "<option value='" + sub_category + "'>" + sub_category + "</option>";
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
		//console.log("defaultValue : " + defaultValue);
		$select.val(defaultValue);
		for(ii=0;ii<subCategoryInfo.length;ii++){
			if (subCategoryInfo[ii].sub_category == defaultValue){
				item["desc"]=subCategoryInfo[ii].desc;
			}
		}		
	};

	this.serializeValue = function () {
		return ($select.val() == "yes");
	};

	this.applyValue = function (item, state) {
		//console.log("applyValue:::::::::::::::::::::::::::");
		var txt=$select.find("option:selected").text();
		//console.log(item);
		//console.log(txt);
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
function fnSaveOrg(){
   if (!sgGrid.getEditorLock().commitCurrentEdit()) {
      return;
   }
   tParams=eval('[{}]');
	var data=sgGrid.getData().getItems();
   var gridData=JSON.stringify(data);
   console.log(gridData);
   tParams['gridData']=gridData;
   tParams['_library']="mr_temp";
   tParams['_tablename']="rf_liq_hrzn";
   tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990101_save_data(StoredProcess)";
   execAjax("saveGrid2SASData","",true,"fnSavedOrgData","json");
}
function fnSavedOrgData(data){
   //alertMsg(data.MSG);
   if (data.MSG == "Successfully saved...") {
   	alertMsg("성공적으로 저장되었습니다.");
   }
   //save_path=data._savepath;
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
