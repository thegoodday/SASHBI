$(document).ready(function () {
   $("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSave();'>");
   //$("#dvToolBar").append("<input type=button value=Delete id=btnDelete class=condBtn onclick='fnDeleteRowConfirm();'>");
   $("#dvToolBar").show();
   //alert("");
});
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-80));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
});		
var sgGrid;
var sgData;
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
	for(var ii in columns){
		console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	columns[3].formatter=eval("YellowFommater");
	columns[3].editor=eval("PTypeEditor");	
	columns[4].formatter=eval("YellowFommater");
	columns[4].editor=eval("AvailableEditor");	
	columns[5].formatter=eval("YellowFommater");
	columns[5].editor=eval("DateEditor");	
	columns[6].formatter=eval("YellowFommater");
	columns[6].editor=eval("AvailableEditor");	
	columns[7].formatter=eval("YellowFommater");
	columns[8].formatter=eval("YellowFommater");
	columns[8].editor=eval("PTypeEditor");	
	columns[9].formatter=eval("YellowFommater");
	columns[10].formatter=eval("YellowFommater");
	columns[10].editor=eval("PTypeEditor");
	columns[11].formatter=eval("YellowFommater");
	columns[11].editor=eval("PTypeEditor");
	columns[12].formatter=eval("YellowFommater");
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
function YellowFommater(row, cell, value, columnDef, dataContext) {
	//console.log("foreFommater : " + row );
	//console.log( cell );
	var text="";
	var anls_cd_type=dataContext.anls_cd.substring(0,1);
	//console.log( "anls_cd_type : " + anls_cd_type );
	if( value==null) value="";
	switch(anls_cd_type) {
		case "0":
			if (cell > 6) {text = "<span class='colorYELLOW'>" + value + "</span>";}
			else {text = "<span >" + value + "</span>";}
			break;
		case "1":
			if (cell > 6) {text = "<span class='colorYELLOW'>" + value + "</span>";}
			else {text = "<span >" + value + "</span>";}
			break;
		case "2":
			if (cell > 2) {text = "<span class='colorYELLOW'>" + value + "</span>";}
			else {text = "<span >" + value + "</span>";}
			break;
		case "3":
			if (cell > 6) {text = "<span class='colorYELLOW'>" + value + "</span>";}
			else {text = "<span >" + value + "</span>";}
			break;
		case "4":
			if (cell > 6) {text = "<span class='colorYELLOW'>" + value + "</span>";}
			else {text = "<span >" + value + "</span>";}
			break;
		case "5":
			if (cell > 6) {text = "<span class='colorYELLOW'>" + value + "</span>";}
			else {text = "<span >" + value + "</span>";}
			break;
		case "6":
			if (cell > 5) {text = "<span class='colorYELLOW'>" + value + "</span>";}
			else {text = "<span >" + value + "</span>";}
			break;
		case "7":
			if (cell > 6) {text = "<span class='colorYELLOW'>" + value + "</span>";}
			else {text = "<span >" + value + "</span>";}
			break;
		default:
			text = "<span >" + value + "</span>";
	}	
	return text;
}
function PTypeEditor(args){
	console.log("PTypeEditor");
	//console.log(args);
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
    	var isYellow=$(args.container).hasClass("colorYELLOWP");
    	console.log("isYellow : " + isYellow);
    	if (isYellow) {		
			if (args.column.id=="var_lh_yn"){
	      	$select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='Y'>Yes</OPTION><OPTION value='N'>No</OPTION></SELECT>");
			} else if (args.column.id=="pricing_type"){
				$select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='SP'>SP(Single-Process)</OPTION><OPTION value='MP'>MP(Multi-Process)</OPTION><OPTION value='GRID'>Grid(분산처리)</OPTION></SELECT>");			
			} else if (args.column.id=="pricing_splitby"){
				$select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='STATES'>STATES(시나리오분산)</OPTION><OPTION value='INSTRUMENTS'>INSTRUMENTS(포지션분산)</OPTION></SELECT>");			
			} else if (args.column.id=="post_type"){
				$select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value=''></OPTION><OPTION value='SP'>SP(Single-Process)</OPTION><OPTION value='MP'>MP(Multi-Process)</OPTION><OPTION value='GRID'>Grid(분산처리)</OPTION></SELECT>");			
			}
		} else {
			$select = $("<span style='color:#f00'>Not Available!</span>")
	          .appendTo(args.container)
	          .focus();
		}
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
		if (args.column.id=="pricing_type"){
			defaultValue = item["pricing_type"];
		} else if (args.column.id=="pricing_splitby"){
			defaultValue = item["pricing_splitby"];
		} else if (args.column.id=="post_type"){
			defaultValue = item["post_type"];
		}
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
function DateEditor(args) {
	var $input;
	var defaultValue;
	var scope = this;
	var calendarOpen = false;

	this.init = function () {
		var isYellow=$(args.container).hasClass("colorYELLOWP");
    	console.log("isYellow : " + isYellow);
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
   var gridData=JSON.stringify(data);
   console.log(gridData);
   tParams['gridData']=gridData;
   tParams['_library']="mr_temp";
   tParams['_tablename']="anls_master";
   tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990301_save(StoredProcess)";
   execAjax("saveGrid2SASData","",true,"fnSavedOrgData","json");
}
function fnSavedOrgData(data){
   //alertMsg(data.MSG);
   if (data.MSG == "Successfully saved...") {
   	alertMsg("성공적으로 저장되었습니다.");
   }
   //save_path=data._savepath;
}
