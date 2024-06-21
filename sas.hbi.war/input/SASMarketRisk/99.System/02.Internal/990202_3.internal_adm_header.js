// stp_nm : 990202_3.internal_adm_header.js
$(document).ready(function () {
	//$(".buttonArea").append("<input type=button value=Add id=btnSave class=condBtnSearch onclick='addResults();'>");
	$("#sasGrid2").width(eval($(window).width()-550));
	$("input[name='category']").bind("click",function(){
		console.log($(this));
		console.log("id : " + $(this)[0].id);
		var category=$(this)[0].id;
		fnStep="open";
		tParams['instid']=instid;
		tParams['category']=category;
		$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_3_get_scnario(StoredProcess)",'setSlickGrid2');
	});
	$("input[name='category']").prop("disabled",true);
});
$(window).resize(function() {
	//$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-$("#dvToolBar").height()-50));
	$("#sasGrid2").width(eval($(window).width()-550));
	//$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	//$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid3!=undefined) {
		sgGrid3.resizeCanvas();
	}
});	
//alert("");
var sgGrid ;
var sgData ;
var sasGrid2;
function setSlickGrid(data){
	console.log("setSlickGrid :\n" );

	$("#sasGrid").show();
	
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
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path);

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	
	sgGrid = new Slick.Grid("#sasGrid", sgData, columns, options);
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  	sgGrid.registerPlugin(checkboxSelector);
	}
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  sgData.sort(function (dataRow1, dataRow2) {
		for (var i = 0, l = cols.length; i < l; i++) {
		  var field = cols[i].sortCol.field;
		  var sign = cols[i].sortAsc ? 1 : -1;
		  var value1 = dataRow1[field], value2 = dataRow2[field];
		  var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
		  if (result != 0) {
			return result;
		  }
		}
		return 0;
	  });
	  sgGrid.invalidate();
	  sgGrid.render();
	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);	
	})		
	$("#dvTools").show();
	$("#progressIndicatorWIP").hide();
}

function addResults(){
	var _STPREPORT_HEADER_JS=$("#slt_STPREPORT_HEADER_JS").val();
	var _STPREPORT_OUT_LAYOUT=$("#slt_STPREPORT_OUT_LAYOUT").val();
	var _STPREPORT_ON_LOAD_SUBMIT=$("#slt_STPREPORT_ON_LOAD_SUBMIT").val();
	var _STPREPORT_TYPE=$("#slt_STPREPORT_TYPE").val();
	var _STPREPORT_NOEXCEL_BTN=$("#slt_STPREPORT_NOEXCEL_BTN").val();
	var _STPREPORT_ON_LOAD_COLLAPSE=$("#slt_STPREPORT_ON_LOAD_COLLAPSE").val();
	var rmorg07=$("#sltrmorg07").val();
	var rmcls01=$("#sltrmcls01").val();
	var rmcls02=$("#sltrmcls02").val();
	var rmcls03=$("#sltrmcls03").val();
	var kr_code=$("#sltkr_code").val();


	$("#dvSASLog").html("");
	$("#dvOutput").show();
	//$("#dvOutput").hide();
	$("#dvGraph1").hide();	
	$("#dvBox").hide();
	$("#dvColumnHeader").hide();
	$("#dvRowHeader").hide();
	$("#dvData").hide();
	$("#dvTitle").html("");
	$("#dvBox").html("");
	$("#dvColumnHeader").html("");
	$("#dvRowHeader").html("");
	$("#dvData").html("");
	$("#dvRes").html("");
	$("#dvPagePanel").html("");
	$("#dvDummy").html("");
	$("#dvRes").hide();
	$("#dvDummy").hide();
	$("#dvPagePanel").hide();
	$("#progressIndicatorWIP").show();
	isDisplayProgress=1;
	var _STPREPORT_HEADER_JS=$("#slt_STPREPORT_HEADER_JS").val();
	var _STPREPORT_OUT_LAYOUT=$("#slt_STPREPORT_OUT_LAYOUT").val();
	var _STPREPORT_ON_LOAD_SUBMIT=$("#slt_STPREPORT_ON_LOAD_SUBMIT").val();
	var _STPREPORT_TYPE=$("#slt_STPREPORT_TYPE").val();
	var _STPREPORT_NOEXCEL_BTN=$("#slt_STPREPORT_NOEXCEL_BTN").val();
	var _STPREPORT_ON_LOAD_COLLAPSE=$("#slt_STPREPORT_ON_LOAD_COLLAPSE").val();
	var rmorg07=$("#sltrmorg07 option:selected").val();
	var rmorg07_txt=$("#sltrmorg07 option:selected").text();
	var rmcls01=$("#sltrmcls01 option:selected").val();
	var rmcls01_txt=$("#sltrmcls01 option:selected").text();
	var rmcls02=$("#sltrmcls02 option:selected").val();
	var rmcls02_txt=$("#sltrmcls02 option:selected").text();
	var rmcls03=$("#sltrmcls03 option:selected").val();
	var rmcls03_txt=$("#sltrmcls03 option:selected").text();
	var kr_code=$("#sltkr_code option:selected").val();
	var kr_code_txt=$("#sltkr_code option:selected").text();
	$("#sasGrid").hide();
	$sasResHTML="";
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/99.System/02.Internal/990202.internal_adm(StoredProcess)",'addResultsGrid');
	
}	// End of submitSTP();
function addResultsGrid(data){
	$("#sasGrid").show();
	
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
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML=data;

	var sgData2 = [];
	sgData2 = sasJsonRes["SASResult"];
	var sgData = sgGrid.getData();
	console.log(sgData);
	$.merge(sgData, sgData2 );
	console.log("sgData : ");
	console.log(sgData);
	
	sgGrid = new Slick.Grid("#sasGrid", sgData, columns, options);
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  	sgGrid.registerPlugin(checkboxSelector);
	}
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  sgData.sort(function (dataRow1, dataRow2) {
		for (var i = 0, l = cols.length; i < l; i++) {
		  var field = cols[i].sortCol.field;
		  var sign = cols[i].sortAsc ? 1 : -1;
		  var value1 = dataRow1[field], value2 = dataRow2[field];
		  var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
		  if (result != 0) {
			return result;
		  }
		}
		return 0;
	  });
	  sgGrid.invalidate();
	  sgGrid.render();
	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);	
	})		
	$("#dvTools").show();
	$("#progressIndicatorWIP").hide();
}
var instid="";
function fnSearch1(){
	if (sgGrid.getActiveCell() == null){
		alertMsg("왼쪽 테이블 상에서 시나리오명을 선택하세요.");
		return;
	}	
	var cell = sgGrid.getActiveCell();
	var curRow = cell.row;
	console.log("curRow : " + curRow);
	var sgData = sgGrid.getData();
	instid			= sgData[curRow].instid;
	console.log("instid : " + instid);
/*	
	var sgData = sgGrid.getData();
	var selectedRows = sgGrid.getSelectedRows();
	if (selectedRows.length < 1) {
		alertMsg("Select Rows...");
		return;
	}
	var selectedItems=[];
	for(var ii=0; ii<selectedRows.length; ii++){
		var rowid=selectedRows[ii];
		//selectedItems.push(sgData[rowid].kr_code);
		selectedItems.push(sgData[rowid].instid);
	}	
	tParams['instid']=JSON.stringify( selectedItems );
	console.log(selectedItems);
*/	
	$('input[name="category"]').prop('checked', false);

	fnStep="open";
	tParams['instid']=instid;
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_3_get_scnario(StoredProcess)",'setSlickGrid2');

}
function comparer(a, b) {
	//console.log(a);
	var x = a[sortcol], y = b[sortcol];
	return (x == y ? 0 : (x > y ? 1 : -1));
}

var sgGrid3;
var fnStep="";
function NumEditor(args){
    var $input;
    var defaultValue;
    var scope = this;
    var calendarOpen = false;
	 //console.log(args)
	type1=args.item.col.substring(0,2);
	type2=args.item.col.substring(0,3);
	isDate=false;
	if (type1=='D_' || type2=='DA_') isDate=true;	 
	//console.log(isDate + " : " + type1 +":"+type2);
	
    this.init = function () {
    	if (isDate){
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
	      $input.datepicker("option","dateFormat","yymmdd");
	      $input.width($input.width() - 18);    		
   	} else {
			col_type=args.item["col_type"];
			//console.log("col_type : " + col_type);
			//console.log(args);
			if (col_type == "NUM"){
	      	$input = $("<INPUT type=text class='editor-text' />");
			} else {
	      	$input = $("<span style='color:#f00'>Not Available!</span>");
			}
	      $input.bind("keydown.nav", function (e) {
	        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
	          e.stopImmediatePropagation();
	        }
	      });

	      $input.appendTo(args.container);
	      $input.focus().select();
	   }
    };

    this.destroy = function () {
    	if (isDate){
	      $.datepicker.dpDiv.stop(true, true);
	      $input.datepicker("hide");
	      $input.datepicker("destroy");
	      $input.remove();
    	} else {
	      $input.remove();
	   }
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
    	//console.log(item)
		type1=item.col.substring(0,2);
		type2=item.col.substring(0,3);
		isDate=false;
		if (type1=='D_' || type2=='DA_') isDate=true;
    	//console.log(isDate + " : " + type1 +":"+type2);
    	if (isDate){
    		defaultValue = item["value_char"];
    	} else {
      	defaultValue = item[args.column.field];
   	}
      $input.val(defaultValue);
      $input[0].defaultValue = defaultValue;
      $input.select();
    };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
		type1=item.col.substring(0,2);
		type2=item.col.substring(0,3);
		isDate=false;
		if (type1=='D_' || type2=='DA_') isDate=true;
    	if (isDate){
      	item["value_char"] = state;
    	} else {
      	item[args.column.field] = state;
      }	
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
      if (isNaN($input.val())) {
        return {
          valid: false,
          msg: "Please enter a valid integer"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();	
}
function CharEditor(args){
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
		col_type=args.item["col_type"];
		console.log("col_type : " + col_type);
		if (col_type == "CHAR"){
    	
	      $input = $("<INPUT type=text class='editor-text' />")
	          .appendTo(args.container)
	          .bind("keydown.nav", function (e) {
	            if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
	              e.stopImmediatePropagation();
	            }
	          })
	          .focus()
	          .select();
	   } else {
      	$input = $("<span style='color:#f00'>Not Available!</span>").appendTo(args.container);
	   }     
    };

    this.destroy = function () {
      $input.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.getValue = function () {
      return $input.val();
    };

    this.setValue = function (val) {
      $input.val(val);
    };

    this.loadValue = function (item) {
      defaultValue = item[args.column.field] || "";
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
      if (args.column.validator) {
        var validationResults = args.column.validator($input.val());
        if (!validationResults.valid) {
          return validationResults;
        }
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();	
}
function setCellColor(){
	//console.log("setCellColor : ");
	$(".slick-group-totals").css("background-color","#FFFF9F");
	$(".colorBLUE").parent().css("background-color","#0080FF");
	$(".colorGREEN").parent().css("background-color","#00FF00");
	$(".colorYELLOW").parent().css("background-color","#ecf7ff");
	$(".colorWHITE").parent().css("background-color","#ffffff");
	$(".foreY").parent().css("background-color","#FFFF80");
	$(".foreN").parent().css("background-color","#ffffff");
}

function NAFommater(row, cell, value, columnDef, dataContext) {
	//var color=dataContext.signal;
	//console.log("NAFommater : " + row );
	//console.log( cell );
	//console.log( value );
	//console.log( columnDef );
	//console.log( dataContext );
	//console.log(dataContext.col.substring(0,2));
	//format("#,###.", parseInt(q_summ["q3"].amount));
	type1=dataContext.col.substring(0,2);
	type2=dataContext.col.substring(0,3);
	isDate=false;
	if (type1=='D_' || type2=='DA_') isDate=true;
	//console.log(isDate + " : " + type1 +":"+type2);
	
	isAmt=false;
	suffix=dataContext.col.substring(dataContext.col.length-4);
	if (suffix=="_AMT") isAmt=true;
	//console.log(dataContext.col + " suffix : " + suffix + " : " + isAmt)
	if(dataContext.col_type=="NUM" && columnDef.id=="value_char"){
		return "<span class='colorYELLOW'>" + "N/A" + "</span>";
	}
	else if (dataContext.col_type=="CHAR" && columnDef.id=="value_num") {
		return "<span class='colorYELLOW'>" + "N/A" + "</span>";
	} 
	else if (dataContext.col_type=="NUM" && columnDef.id=="value_num" && isDate) {
		return "<span >" + dataContext.value_char + "</span>";
	} 
	else if (dataContext.col_type=="NUM" && columnDef.id=="value_num" && isAmt ) {
		return "<span >" + format("#,###.", parseInt(value)) + "</span>";
	}
/*
*/	 
	else {
		//console.log("dataContext");
		//console.log(dataContext);
		//console.log("columnDef");
		//console.log(columnDef);
		//console.log(dataContext.col_type + ":" + columnDef.id);
		return "<span >" + value + "</span>";
	}
}

function setSlickGrid2(data){
	$("#sasGrid2").show();
	var dataView = new Slick.Data.DataView();
	
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
	columns[2].editor=eval("NumEditor");
	columns[3].editor=eval("CharEditor");
	columns[2].formatter=eval("NAFommater");
	columns[3].formatter=eval("NAFommater");
	
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;

	var sgData3 = [];
	sgData3 = sasJsonRes["SASResult"];
	console.log(sgGrid3);
	if (fnStep=="open"){
		var sgData = sgData3;
	} else if (sgGrid3 == undefined){
		//console.log("undefined");
		var sgData = sgData3;
	} else {
		var sgData = sgGrid3.getData().getItems();
		//console.log(sgData.length);
		for (var ii = 0; ii < sgData.length; ii++) {
			instid=sgData[ii].instid;		
			isBe=-1;
			for (var jj = 0; jj < sgData3.length; jj++) {
				if (instid==sgData3[jj].instid) {
					isBe=jj;
					//console.log(isBe + ":" +instid+":"+sgData3[jj].instid);
				}
			}
			if (isBe > -1){
				sgData3.splice(isBe, 1);
			}
		}
		console.log("sgData3");
		console.log(sgData3);
		$.merge(sgData, sgData3 );
	}
	
	//dataView.setItems(sgData3)
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log(sgData);
	
	dataView.setItems(sgData);	

	sgGrid3 = new Slick.Grid("#sasGrid2", dataView, columns, options);
	sgGrid3.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid3.registerPlugin(checkboxSelector);
	}
	sgGrid3.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid3.onSort.subscribe(function (e, args) {
		sortdir = args.sortAsc ? 1 : -1;
		sortcol = args.sortCol.field;
		console.log("sortcol : " + sortcol);
		// using native sort with comparer
		// preferred method but can be very slow in IE with huge datasets
		dataView.sort(comparer, args.sortAsc);
	});
	dataView.onRowsChanged.subscribe(function(e,args) {
	    sgGrid3.invalidateRows(args.rows);
	    sgGrid3.render();
	});	
	sgGrid3.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid3.invalidateRow(sgData3.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid3.getData().getItems().length;
		dataView.addItem(item);	
	})		
	sgGrid3.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid3.onMouseEnter.subscribe(function(e, args) {
		setCellColor();
	});	
	sgGrid3.onMouseLeave.subscribe(function(e, args) {
		setCellColor();
	});		
	setTimeout("setCellColor();",1*100);	

	
	$("#dvTools2").show();
	$("#progressIndicatorWIP").hide();
	$("input[name='category']").prop("disabled",false);
}
function fnOpenGR2(){
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$('#dvModalOpen').show();
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_2_get_portfolio_list(StoredProcess)",'setSlickGrid5');
}
function setSlickGrid5(data){
	$("#dvModalOpen").show();
	var dataView = new Slick.Data.DataView();
	
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
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;

	var sgData5 = [];
	sgData5 = sasJsonRes["SASResult"];
	//dataView.setItems(sgData5)
	for(ii in sgData5){
		var objTemp = $.extend(sgData5[ii],eval({"id":ii}));
	}
	console.log(sgData5);
	
	dataView.setItems(sgData5);	

	sgGrid5 = new Slick.Grid("#sasGrid5", dataView, columns, options);
	sgGrid5.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid5.registerPlugin(checkboxSelector);
	}
	sgGrid5.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid5.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  sgData5.sort(function (dataRow1, dataRow2) {
		for (var i = 0, l = cols.length; i < l; i++) {
		  var field = cols[i].sortCol.field;
		  var sign = cols[i].sortAsc ? 1 : -1;
		  var value1 = dataRow1[field], value2 = dataRow2[field];
		  var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
		  if (result != 0) {
			return result;
		  }
		}
		return 0;
	  });
	  sgGrid5.invalidate();
	  sgGrid5.render();
	});	

	$("#progressIndicatorWIP").hide();	
}
function fnDeletePortfolio(){
/*	
    var selected = sgGrid5.getSelectedRows();
    sgGrid5.setSelectedRows([]);
    $.each(selected, function (index, value) {
        sgGrid5.getData().deleteItem(value)
    })
    sgGrid5.invalidate();
*/
	var selectedIndexes = sgGrid5.getSelectedRows().sort().reverse();
	sgGrid5.setSelectedRows([]);
	sgData=sgGrid5.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgGrid5.getData().getItem(value); 
		console.log(item.id)
		if (item) sgGrid5.getData().deleteItem(item.id); 
	});
	sgGrid5.invalidate();
	sgGrid5.render();
}
function fnSavePortfolio(){
	if (!sgGrid5.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid5.getData().getItems();
	console.log('data');
	console.log(data);
	var gridData=JSON.stringify(data);	
	console.log(gridData);
	tParams['gridData']=gridData;
	tParams['_library']="mr_temp";
	tParams['_tablename']="scenarios_list";
	tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_2_update_scenario_list(StoredProcess)";
	console.log("gridData : ");
	console.log(gridData);
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSavedOrgData","json"); 
	$('#dvModalWin').hide();
	//$('#dvBG').hide();
	
}
function fnOpenPortfolio(){
	var selected = sgGrid5.getSelectedRows();
	var sgData=sgGrid5.getData().getItems();
	var current_row = sgGrid5.getActiveCell().row;
	scenarioName=sgData[current_row].scnr_name;
	scenarioDesc=sgData[current_row].scnr_desc;
	console.log(sgData);
	console.log(selected);
	console.log(scenarioName);
	$("#txtScenarioName").val(scenarioName);
	$("#txtScenarioDesc").val(scenarioDesc);
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalOpen").css("left",eval(eval($(window).width()-$("#dvModalOpen").width()-0)/2));
	$("#dvModalOpen").css("top",eval(eval($(window).height()-$("#dvModalOpen").height()-100)/2));
	$('#dvModalOpen').show();
	tParams['scnr_name']=scenarioName;
	fnStep="open";
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_2_open_scenario(StoredProcess)",'setSlickGrid2');
	$('#dvBG').hide();
	$('#dvModalOpen').hide();
}
var scenarioName="";
var scenarioDesc="";
function fnSaveGR2(){
	fnSaveGR2Confirm();
	/*
	if (scenarioName == "") {
		fnShowSaveDialog();
	}	else {
		fnSaveGR2Confirm();
	}
	*/
}
function fnShowSaveDialog(){	
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-100)/2));
	$('#dvModalWin').show();
}
function fnSaveGR2Confirm(){
	if (!sgGrid3.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid3.getData().getItems();
	console.log('data');
	console.log(data);
	for(ii=0;ii<data.length;ii++){
		console.log(data[ii].value_num);
		if (data[ii].value_num == null) data[ii].value_num="";
		console.log("after : " + data[ii].value_num);
	}
	var gridData=JSON.stringify(data);	
	console.log(gridData);
	var $cur_category = $('input:radio[name="category"]:checked');
	console.log($cur_category);
	console.log($cur_category[0]);
	if ($cur_category[0] == undefined) {
		category="";
	} else {
		category=$cur_category[0].id;
	}
	console.log("category : " + category);

	tParams['_savepath']=save_path;
	tParams['desc']=$("#txtScenarioDesc").val();
	tParams['gridData']=gridData;
	tParams['_library']="mr_temp";
	tParams['_tablename']="scnario_value";
	tParams['category']=category;
	tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990202_2_save_scenario_value(StoredProcess)";
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSavedOrgData","json"); 
	//$('#dvModalWin').hide();
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
function fnSaveAsGR2(){
	fnShowSaveDialog();
}
function fnDeleteGR2(){
  var isDelete = confirmMsg("Are you sure you want to delete?","fnDeleteGR2_OK");	
}
function fnDeleteGR2_OK(){
    var selected = sgGrid3.getSelectedRows();
    sgGrid3.setSelectedRows([]);
    $.each(selected, function (index, value) {
        sgGrid3.getData().deleteItem(value)
    })
    sgGrid3.invalidate();
	
}