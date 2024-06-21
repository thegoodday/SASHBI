$(document).ready(function () {
   $("#dvToolBar").append("<input type=button value=Add id=btnSave class=condBtn onclick='fnAdd();'>");
   $("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteRowConfirm();'>");
   $("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSave();'>");
   $("#dvToolBar").append("<input type=button value=Run id=btnDelete class=condBtn onclick='fnRun();'>");
   $("#dvToolBar").show();
   fnPortfolioList();
   //alert("");
});
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-80));													
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
});		
function fnPortfolioList(){
   tParams=eval('[{}]');
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990304_get_portfolio_list(StoredProcess)",'makePortfolioList');
}
var arrPortfolioList;
function makePortfolioList(data){
	console.log("makePortfolioList");
	console.log(data);
	arrPortfolioList=data;
}
function PortfolioEditor(args){
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
    	var isYellow=true;//$(args.container).hasClass("colorYELLOWP");
    	//console.log("isYellow : " + isYellow);
    	if (isYellow) {
			var optItem="";
			//jobTermList=[{val:"D",text:"일배치"},{val:"W",text:"주배치"},{val:"M",text:"월배치"}]
			optItem+="<option value=''></option>";
			for (var ii in arrPortfolioList){
				optItem+="<option value='" + arrPortfolioList[ii].scnr_name + "'>" + arrPortfolioList[ii].scnr_name + "</option>";
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
		defaultValue = item["portfolio_id"];
		//console.log("defaultValue : " + defaultValue);
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
function PortTypeEditor(args){
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
    	var isYellow=true;//$(args.container).hasClass("colorYELLOWP");
    	//console.log("isYellow : " + isYellow);
    	if (isYellow) {
			var optItem="";
			arrPortTypeList=[{val:"추가",text:"추가"},{val:"변경",text:"변경"},{val:"삭제",text:"삭제"},{val:"신규만",text:"신규만"}]
			optItem+="<option value=''></option>";
			for (var ii in arrPortTypeList){
				optItem+="<option value='" + arrPortTypeList[ii].val + "'>" + arrPortTypeList[ii].text + "</option>";
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
		defaultValue = item["portfolio_type"];
		//console.log("defaultValue : " + defaultValue);
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
function DateEditor(args) {
	var $input;
	var defaultValue;
	var scope = this;
	var calendarOpen = false;

	this.init = function () {
		$input = $("<INPUT type=text class='editor-text' />");
		$input.appendTo(args.container);
		$input.focus().select();
		$input.datepicker({
		  showOn: "button",
		  buttonImageOnly: true,
		  buttonImage: "/SASHBI/scripts/SlickGrid/images/calendar.gif",
		  beforeShow: function () {
		    calendarOpen = true
		  },
		  onClose: function () {
		    calendarOpen = false
		  }
		});
		$input.datepicker("option","dateFormat","yy-mm-dd");
		$input.width($input.width() - 18);
	};

	this.destroy = function () {
		$.datepicker.dpDiv.stop(true, true);
		$input.datepicker("hide");
		$input.datepicker("destroy");
		$input.remove();
	};

	this.show = function () {
		if (calendarOpen) {
		  $.datepicker.dpDiv.stop(true, true).show();
		}
	};

	this.hide = function () {
		if (calendarOpen) {
		  $.datepicker.dpDiv.stop(true, true).hide();
		}
	};

	this.position = function (position) {
		console.log("position")
		console.log(position)
		if (!calendarOpen) {
		  return;
		}
		$.datepicker.dpDiv
		    .css("top", position.top + 30)
		    .css("left", position.left);
	};

	this.focus = function () {
		$input.focus();
	};

	this.loadValue = function (item) {
		defaultValue = item[args.column.field];
		$input.val(defaultValue);
		$input[0].defaultValue = defaultValue;
		$input.select();
	};

	this.serializeValue = function () {
		return $input.val();
	};

	this.applyValue = function (item, state) {
		item[args.column.field] = state;
	};

	this.isValueChanged = function () {
		return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
	};

	this.validate = function () {
		return {
		  valid: true,
		  msg: null
		};
	};

	this.init();
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
	//columns[1].editor=eval("DateEditor");
	columns[2].editor=eval("PortfolioEditor");
	columns[3].editor=eval("PortTypeEditor");
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
		item.id = sgGrid.getData().getItems().length;
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
   tParams['_tablename']="job_master";
   tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990306_save_job_master(StoredProcess)";
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
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990306_open_project_list(StoredProcess)",'setSlickGrid2');
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("width","1200px");
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$('#dvModalOpen').show();
}
function fnRunDial(){
	$("#txtDftDate").datepicker({
		defaultDate: "0m",
		changeMonth: true,
		changeYear: true,
		firstDay: 1,
		showButtonPanel: true
	});
	$("#txtDftDate").datepicker("option","dateFormat","yy-mm-dd");
	
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalRun").css("width","400px");
	$("#dvModalRun").css("left",eval(eval($(window).width()-$("#dvModalRun").width()-0)/2));
	$("#dvModalRun").css("top",eval(eval($(window).height()-$("#dvModalRun").height()-100)/2));
	$('#dvModalRun').show();
}
function fnRun(){
   if (!sgGrid.getEditorLock().commitCurrentEdit()) {
      return;
   }
   tParams=eval('[{}]');
	//var data=sgGrid.getData().getItems();
   //var gridData=JSON.stringify(data);
   //console.log(gridData);
   //tParams['gridData']=gridData;
   //tParams['_library']="mr_temp";
   //tParams['_tablename']="batch_job_run";
   //tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990306_batch_job_run(StoredProcess)";
   //execAjax("saveGrid2SASData","",true,"executedJob","json");
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990306_batch_job_run(StoredProcess)",'executedJob');
	$("#progressIndicatorWIP").hide();	
}
function executedJob(res){
	console.log("Job Executed!!!");
	alertMsg("작업을 실행하였습니다.\n작업결과는 [작업결과 조회]에서 확인하시기 바랍니다.");
/*
	if (res.MSG != "1") {
		alertMsg("작업이 이미 실행중입니다. \n[작업결과 조회]에서 확인하시기 바랍니다.");
	}
*/	
}
var sgGrid2;
function setSlickGrid2(data){
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
	
	sgGrid2 = new Slick.Grid("#sasGrid2", dataView, columns, options);
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
	sgGrid2.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid2.onMouseEnter.subscribe(function(e, args) {
		setCellColor();
	});	
	sgGrid2.onMouseLeave.subscribe(function(e, args) {
		setCellColor();
	});		
	sgGrid2.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		/*
		*/
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid2.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid2.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid2.getData().getItems().length;
		dataView.addItem(item);	
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#progressIndicatorWIP").hide();
}
function fnConfirm(){
	var selected = sgGrid2.getSelectedRows();
	sgData2=sgGrid2.getData().getItems();
	console.log("selected")	
	console.log(selected);
	console.log(sgData2);
	var prjt_id="";
	var jj=0;
	for(var ii in selected){
		console.log("ii : " + selected[ii]);
		if (jj==0) {prjt_id += "'" + sgData2[selected[ii]].prjt_id.trim()+"'";}
		else {prjt_id += ",'" + sgData2[selected[ii]].prjt_id.trim() + "'";}
		jj++;
	}
	prjt_id=prjt_id.trim();
	console.log("prjt_id : " + prjt_id);
   tParams=eval('[{}]');
   tParams['prjt_id']=prjt_id;
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990306_add_job_list(StoredProcess)",'setSlickGrid');
	$('#dvBG').hide();
	$('#dvModalOpen').hide();
	
}