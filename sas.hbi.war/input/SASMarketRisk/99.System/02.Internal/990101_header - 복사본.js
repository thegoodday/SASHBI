$(document).ready(function () {
   $("#dvToolBar").append("<input type=button value=Add id=btnSave class=condBtn onclick='fnAdd();'>");
   $("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteRowConfirm();'>");
   $("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSave();'>");
   $("#dvToolBar").append("<input type=button value=Run id=btnDelete class=condBtn onclick='fnRun();'>");
   $("#dvToolBar").show();
   //alert("");
});
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-80));													
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
	//columns[4].formatter=eval("HierFommater");
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
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		sgData.push(item);
		sgGrid.updateRowCount();
		sgGrid.render();	
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
function YesNoSelectFommater(row, cell, value, columnDef, dataContext) {
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
function YesNoSelectEditor(args){
	console.log("YesNoSelectEditor");
	console.log(args);
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		var optItem="";
		YesNoList=[{val:"",text:""},{val:"Y",text:"Yes"},{val:"N",text:"No"}]
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
function fnSave(){
   if (!sgGrid.getEditorLock().commitCurrentEdit()) {
      return;
   }
   tParams=eval('[{}]');
	var data=sgGrid.getData().getItems();
	for(var ii in data){
		data[ii].chkbox="0";
	}
   var gridData=JSON.stringify(data);
   console.log(gridData);
   tParams['gridData']=gridData;
   tParams['_library']="mr_temp";
   tParams['_tablename']="project_master";
   tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990304_save(StoredProcess)";
   execAjax("saveGrid2SASData","",true,"fnSavedOrgData","json");
}
function fnSavedOrgData(data){
   alertMsg(data.MSG);
   //save_path=data._savepath;
}
function fnDeleteRowConfirm(){
	var selected = sgGrid.getSelectedRows();
	sgGrid.setSelectedRows([]);
	$.each(selected, function (index, value) {
	  sgGrid.getData().deleteItem(value)
	})
	sgGrid.invalidate();
	/*
	if ( sgGrid.getActiveCell() == null) {
		alertMsg("Select the Group Set ID.");
		return;
	}
	var isDelete = confirmMsg("Are you sure you want to delete?","fnDeleteRow");
	*/
}
function fnDeleteRow(){
    var selected = sgGrid.getSelectedRows();
    sgGrid.setSelectedRows([]);
    $.each(selected, function (index, value) {
        sgGrid.getData().deleteItem(value)
    })
    sgGrid.invalidate();
}
function fnAdd(){
	tParams=eval('[{}]');
	tParams['ccvar_id']='';
	//fnStep="open";
	//$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990302_open_ccar_list(StoredProcess)",'setSlickGrid3');
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$('#dvModalOpen').show();
}
function fnRun(){
}