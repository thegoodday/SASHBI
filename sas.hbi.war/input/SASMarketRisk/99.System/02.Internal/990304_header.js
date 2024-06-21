$(document).ready(function () {
   $("#dvToolBar").append("<input type=button value=Delete id=btnDelete class=condBtn onclick='fnDeleteRowConfirm();'>");
   $("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSave();'>");
   $("#dvToolBar").show();
   //alert("");
   fnHierList();
   fnScnList();
   fnPortfolioList();
   fnAnlsList();
});
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-100));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
});	
var arrAnlsList;
function fnAnlsList(){
   tParams=eval('[{}]');
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990304_get_anls_list(StoredProcess)",'makeAnlsList');
}
function makeAnlsList(data){
	console.log("makeAnlsList");
	console.log(data);
	arrAnlsList=data;
}	
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
function fnHierList(){
   tParams=eval('[{}]');
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990304_get_hier_list(StoredProcess)",'makeHierList');
	//$('#dvBG').hide();
}
function fnScnList(){
   tParams=eval('[{}]');
	$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990304_get_scn_list(StoredProcess)",'makeScnList');
}
var arrScnList;
function makeScnList(data){
	console.log("makeScnList");
	console.log(data);
	arrScnList=data;
}
var arrHierList;
function makeHierList(data){
	console.log("makeHierList");
	console.log(data);
	arrHierList=data;
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
	columns[2].formatter=eval("AnlsFommater");
	columns[2].editor=eval("AnlsEditor");
	columns[4].formatter=eval("HierFommater");
	columns[4].editor=eval("HierEditor");
	columns[5].formatter=eval("YesNoSelectFommater");
	columns[5].editor=eval("YesNoSelectEditor");
	columns[6].formatter=eval("JobTermFommater");
	columns[6].editor=eval("JobTermEditor");
	columns[7].formatter=eval("YesNoSelectFommater");			//YesNoSelectFommater : 입력가능 셀 색깔 표기
	//columns[7].editor=eval("YesNoSelectEditor");
	columns[8].formatter=eval("YesNoSelectFommater");
	columns[9].formatter=eval("YesNoSelectFommater");
	columns[10].formatter=eval("YesNoSelectFommater");
	columns[10].editor=eval("YesNoSelectEditor");
	columns[11].formatter=eval("YesNoSelectFommater");
	columns[11].editor=eval("YesNoSelectEditor");
	columns[12].formatter=eval("HistoryFommater");
	columns[12].editor=eval("AvailableEditor");
	columns[13].formatter=eval("ScnFommater");
	columns[13].editor=eval("ScnEditor");
	//columns[14].formatter=eval("PortfolioFommater");
	//columns[14].editor=eval("PortfolioEditor");
	//columns[15].formatter=eval("PortTypeFommater");
	//columns[15].editor=eval("PortTypeEditor");
	
	//columns[3].editor=eval("PTypeEditor");	

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
		var objTemp = $.extend(sgData[ii],eval({"id":sgData[ii].prjt_id}));
	}
	console.log("sgData");
	console.log(sgData);
	//dataView.setItems(sgData);	
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		console.log("onRowCountChanged");
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		console.log("onRowsChanged");
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
		console.log("onSort");
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		console.log("onAddNewRow");
		var newID=execSTPS("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990304_get_new_project_id(StoredProcess)");
		var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({"prjt_id":newID,"anls_cd":""},item);
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
	//console.log("YesNoSelectEditor");
	//console.log(args);
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
function AnlsFommater(row, cell, value, columnDef, dataContext) {
	//console.log("foreFommater : " + row );
	//console.log( cell );
	var text="";
	var isErr=0;

	if( value==null) value="";
	text = "<span class='colorYELLOW'>" + value + "</span>";

	return text;
}
function chgAnlsCD(obj){
	defaultValue=$(obj).val();
	console.log("selected Value : " + defaultValue);
	curCell=sgGrid.getActiveCell();
	console.log(curCell);
	sgData=sgGrid.getData().getItems();
	console.log(sgData);

	for(ii=0;ii<arrAnlsList.length;ii++){
		if (arrAnlsList[ii].anls_nm == defaultValue){
			sgData[curCell.row].anls_cd=arrAnlsList[ii].anls_cd;
			sgGrid.updateCell(curCell.row,3);
		}
	}		
}
function AnlsEditor(args){
	//console.log("PTypeEditor");
	//console.log(args);
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		var optItem="";
		//console.log(arrAnlsList)
		optItem+="<option value=''></option>";
		for (var ii in arrAnlsList){
			optItem+="<option value='" + arrAnlsList[ii].anls_nm + "'>" + arrAnlsList[ii].anls_nm + "(" + arrAnlsList[ii].anls_cd + ")</option>";
		}
		$select = $("<SELECT tabIndex='0' class='editor-yesno' onChange='chgAnlsCD(this)'>"+ optItem +"</SELECT>");			
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
		console.log(item)
		defaultValue = item["anls_nm"];
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
function HierFommater(row, cell, value, columnDef, dataContext) {
	//console.log("foreFommater : " + row );
	//console.log( cell );
	var text="";
	var ccvar_id=dataContext.ccvar_id;
	//console.log( "ccvar_id : " + ccvar_id );
	var isErr=0;
	for(var ii in arrHierList){
		if(arrHierList[ii].ccvar_id == ccvar_id) {
			isErr++;
			ccvar_name=arrHierList[ii].ccvar_name;
			//console.log("isErr : " + ccvar_id + ":" + arrHierList[ii].ccvar_id +":"+isErr);
		}
	}
	if( value==null) value="";
	if (isErr != 0){
		//console.log("Exist!!!");
		text = "<span class='colorYELLOW'>" + ccvar_name + "(" + value + ")</span>";
	} else {
		//console.log("ERROR!!!");
		text = "<span class='colorYELLOW' style='color:#f00;'>" + value + "</span>";
	}
	return text;
}
function HierEditor(args){
	//console.log("PTypeEditor");
	//console.log(args);
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		var optItem="";
		for (var ii in arrHierList){
			optItem+="<option value='" + arrHierList[ii].ccvar_id + "'>" + arrHierList[ii].ccvar_name + "(" + arrHierList[ii].ccvar_id + ")</option>";
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
		defaultValue = item["ccvar_id"];
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
function JobTermFommater(row, cell, value, columnDef, dataContext) {
	var text="";
	var ccvar_id=dataContext.CCVAR_ID;
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
function JobTermEditor(args){
	//console.log("PTypeEditor");
	//console.log(args);
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		var optItem="";
		jobTermList=[{val:"D",text:"일배치"},{val:"W",text:"주배치"},{val:"M",text:"월배치"}]
		for (var ii in jobTermList){
			optItem+="<option value='" + jobTermList[ii].val + "'>" + jobTermList[ii].text + "</option>";
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
		defaultValue = item["JOB_TYPE"];
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
function HistoryFommater(row, cell, value, columnDef, dataContext) {
	//console.log("foreFommater : " + row );
	//console.log( cell );
	var text="";
	var ANLS_CD=dataContext.ANLS_CD;
	//console.log( "ANLS_CD : " + ANLS_CD );

	if( value==null) value="";
	if (ANLS_CD != "42"){
		//console.log("HistoryFommater Exist!!!");
		text = "<span class='colorWHITE'>" + value + "</span>";
	} else {
		//console.log("HistoryFommater ERROR!!!");
		text = "<span class='colorYELLOW'>" + value + "</span>";
	}
	return text;
}
function AvailableEditor(args){
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
    	var isYellow=$(args.container).hasClass("colorYELLOWP");
    	console.log("isYellow : " + isYellow);
    	if (isYellow) {
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
	      $input = $("<span style='color:#f00'>Not Available!</span>")
	          .appendTo(args.container)
	          .focus();
      	;
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
function ScnFommater(row, cell, value, columnDef, dataContext) {
	//console.log("foreFommater : " + row );
	//console.log( cell );
	var text="";
	var ANLS_CD=dataContext.ANLS_CD;
	//console.log( "ANLS_CD : " + ANLS_CD );

	if( value==null) value="";
	if (ANLS_CD != "41"){
		//console.log("HistoryFommater Exist!!!");
		text = "<span class='colorWHITE'>" + value + "</span>";
	} else {
		//console.log("HistoryFommater ERROR!!!");
		text = "<span class='colorYELLOW'>" + value + "</span>";
	}
	return text;
}
function ScnEditor(args){
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
    	var isYellow=$(args.container).hasClass("colorYELLOWP");
    	//console.log("isYellow : " + isYellow);
    	if (isYellow) {
			var optItem="";
			optItem+="<option value=''></option>";
			optItem+="<option value='_ALL_'>전체</option>";
			//jobTermList=[{val:"D",text:"일배치"},{val:"W",text:"주배치"},{val:"M",text:"월배치"}]
			for (var ii in arrScnList){
				optItem+="<option value='" + arrScnList[ii].snr_name + "'>" + arrScnList[ii].snr_name + "</option>";
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
		defaultValue = item["SCENARIO_ID"];
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
function PortfolioFommater(row, cell, value, columnDef, dataContext) {
	//console.log("foreFommater : " + row );
	//console.log( cell );
	var text="";
	var ANLS_CD=dataContext.ANLS_CD;
	//console.log( "ANLS_CD : " + ANLS_CD );

	if( value==null) value="";
	if (ANLS_CD == "9999"){
		//console.log("HistoryFommater Exist!!!");
		text = "<span class='colorWHITE'>" + value + "</span>";
	} else {
		//console.log("HistoryFommater ERROR!!!");
		text = "<span class='colorYELLOW'>" + value + "</span>";
	}
	return text;
}
function PortfolioEditor(args){
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
    	var isYellow=$(args.container).hasClass("colorYELLOWP");
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
		defaultValue = item["PORTFOLIO_ID"];
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
function PortTypeFommater(row, cell, value, columnDef, dataContext) {
	//console.log("foreFommater : " + row );
	//console.log( cell );
	var text="";
	var ANLS_CD=dataContext.ANLS_CD;
	//console.log( "ANLS_CD : " + ANLS_CD );

	if( value==null) value="";
	if (ANLS_CD == "9999"){
		//console.log("HistoryFommater Exist!!!");
		text = "<span class='colorWHITE'>" + value + "</span>";
	} else {
		//console.log("HistoryFommater ERROR!!!");
		text = "<span class='colorYELLOW'>" + value + "</span>";
	}
	return text;
}
function PortTypeEditor(args){
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
    	var isYellow=$(args.container).hasClass("colorYELLOWP");
    	//console.log("isYellow : " + isYellow);
    	if (isYellow) {
			var optItem="";
			arrPortTypeList=[{val:"추가",text:"추가"},{val:"변경",text:"변경"},{val:"신규",text:"신규"}]
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
		defaultValue = item["PORTFOLIO_TYPE"];
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
		var isYellow=$(args.container).hasClass("colorYELLOWP");
    	//console.log("isYellow : " + isYellow);
    	if (isYellow) {
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
		} else {
	      $input = $("<span style='color:#f00'>Not Available!</span>")
	          .appendTo(args.container)
	          .focus();
      	;
      }
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
   //console.log(gridData);
   tParams['gridData']=gridData;
   tParams['_library']="mr_temp";
   tParams['_tablename']="project_master";
   tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990304_save(StoredProcess)";
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
	console.log("selectedIndexes")
	console.log(selectedIndexes)
	sgData=sgGrid.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgGrid.getData().getItem(value); 
		if (item)
			sgGrid.getData().deleteItem(item.id); 
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