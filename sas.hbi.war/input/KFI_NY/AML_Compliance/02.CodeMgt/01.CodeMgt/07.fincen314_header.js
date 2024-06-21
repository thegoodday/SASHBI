$(document).ready(function () {
	//alert('한글');
	//$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid1();'>");
	//$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid1();'>");
	
	var hmtlStr="";
	hmtlStr +="<form method='post' id='fomUpload' action='/SASStoredProcess/do' method='post' enctype='multipart/form-data'>";
	//hmtlStr +="<input type='hidden' name='_program' value='SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/fileUpload(StoredProcess)' />";
	hmtlStr +="<input type='hidden' name='_program' value='SBIP://METASERVER/KFI_NY/AML Compliance/02.CodeMgt/01.CodeMgt/07.FinCEN314(a)(StoredProcess)' />";	
	hmtlStr +="<input type='hidden' name='task' value='upload_file' />";
	hmtlStr +="<input name='upfile' type='file' />";
	hmtlStr +="<input type='submit' value='Screen file' id=btnUpload class=condBtn onclick='fnUploadFile();' />";
	//hmtlStr +="<input type='button' value='Excel' id=btnExcelDL class=condBtn onclick='exportEXCEL_FIN();' />";
	//hmtlStr +="<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid1();'>";
	hmtlStr +="</form>";	
	console.log("hmtlStr :" + hmtlStr);
	$("#dvToolBar").html(hmtlStr);
	
	$("#dvToolBar").show();
	//fnGetScore();
});
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
var sgGrid;	
function fnGetScore(){
	tParams=eval('[{}]');
	tParams['category']="Country";
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0204_getRiskScore(StoredProcess)",'makeRiskScoreArr');
}
var arrRiskScore;
function makeRiskScoreArr(data){
	console.log("arrRiskScore");
	//console.log(data);
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
function ExcelEditor(args) {
    var $input;
    var defaultValue;
    var scope = this;

    this.init = function () {
      //$input = $("<INPUT type=text class='editor-text' />")
      $input = $("<input type='image' img src='/SASHBI/images/ExcelFile.gif' id=btnExcelDL class=condBtn onclick='exportEXCEL_FIN();' />")
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
            if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
              e.stopImmediatePropagation();
            }
          })
          .focus()
          .select();
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
      
			var data=sgGrid.getData().getItems();
			if (data[args.item.id].FATF != 'O' & data[args.item.id].OFAC != 'O'){
				if (data[args.item.id].BASEL	>= 7 ) {
					data[args.item.id].RISK_SCORE = '101';
				}else if(data[args.item.id].BASEL	== '' ) {
					data[args.item.id].RISK_SCORE = '100';
				}else if (data[args.item.id].BASEL < 5 ) {
					data[args.item.id].RISK_SCORE = '33';
				}else{
					data[args.item.id].RISK_SCORE = '66';
				}	
				for (var ii in arrRiskScore){
					console.log("arrRiskScore : " + arrRiskScore[ii].RISK_SCORE	+ " : " + data[args.item.id].RISK_SCORE);
					if (arrRiskScore[ii].RISK_SCORE	== data[args.item.id].RISK_SCORE ) {
						data[args.item.id].RISK = arrRiskScore[ii].RISK; 	
					}
				};
			}	
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
function ExcelButtonEditor(args){
	//console.log("YesNoSelectEditor");
	//console.log(args);
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		var optItem="";
		//YesNoList=[{val:"O",text:"O"},{val:"X",text:"X"}]
		YesNoList=[{val:"O",text:"EXCEL"}]
		for (var ii in YesNoList){
			optItem+="<option value='" + YesNoList[ii].val + "'>" + YesNoList[ii].text + "</option>";
			//optItem+="<option value='" + YesNoList[0].val + "'>" + YesNoList[0].text + "</option>";
		}
		$select = $("<SELECT tabIndex='0' class='editor-yesno'>"+ optItem +"</SELECT>");			
		//$select = $("<input type='button' value='Excel' id=btnExcelDL class=condBtn onclick='exportEXCEL_FIN();' />")
		$select.appendTo(args.container);
		$select.focus();
	};
	this.destroy = function () {
		//$select = $("<input type='button' value='Excel' id=btnExcelDL class=condBtn onclick='exportEXCEL_FIN();' />")
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
function ExcelDownEditor(args) {
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
      //buttonImage: "/SASHBI/scripts/SlickGrid/images/calendar.gif",
      buttonImage: "/SASHBI/images/ExcelFile.gif",
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
	
	$("#header").show();
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
	//columns[3].formatter=eval("YellowFommater");
	//columns[6].editor=eval("YesNoSelectEditor");	
	//columns[7].editor=eval("YesNoSelectEditor");	
	//columns[7].editor=eval("RiskEditor");	
	//columns[6].editor=eval("ExcelEditor");
	//columns[6].editor=eval("ExcelButtonEditor	");
	//columns[6].editor=eval("DateEditor");
	//columns[6].editor=eval("ExcelDownEditor");
	//columns[6].formatter=eval("RiskCodeFommater");
	columns[6].formatter=eval("RiskFommater");
	
	
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
	sgData2=sgGrid.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgGrid.getData().getItem(value); 
		if (item) sgGrid.getData().deleteItem(item.id); 
	});
	sgGrid.invalidate();
	sgGrid.render();
}
function fnSaveGrid1(){
	var isSave = confirmMsg("Are you sure you want to save?","fnConfirmSaveGrid1");	
}
function fnConfirmSaveGrid1(){
	if (!sgGrid.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	tParams=eval('[{}]');
	var data=sgGrid.getData().getItems();
	//console.log('data');
	//console.log(data);
	
	var keep_var=['CRR_SCORE_KEY','FATF','OFAC','BASEL','RISK','RISK_SCORE','CHANGE_CURRENT_IND'];
	var send_data = setArr(data,keep_var);
	console.log('send_data');
	console.log(send_data);
	
	var gridData=JSON.stringify(send_data);	
	console.log(gridData);
	tParams['_savepath']=save_path;
	tParams['gridData']=gridData;
	tParams['_library']="stp_temp";
	tParams['_tablename']="fsb_crr_country_score";
	tParams['_program']="SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0201_Country_saveRiskScore(StoredProcess)";
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
		alertMsg(data.MSG);
	}
	console.log("save_path : " + save_path);
}
	///SASHBI/STPRVServlet?sas_forwardLocation=execSTPN

function fnUploadFile(){
	console.log("fnUploadFile start.........");
	//event.preventDefault();
	$("#progressIndicatorWIP").show();
	var form = $("#fomUpload")[0];
	var updata = new FormData(form);
	updata.append("CustomField","extra data test");
	$("#btnUpload").prop("disabled",true);
	$.ajax({
		enctype: 'multipart/form-data',
		type: "post",
		url: "/SASStoredProcess/do",
		//_program : 'SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/fileUpload(StoredProcess)',
		_program : 'SBIP://METASERVER/KFI_NY/AML Compliance/02.CodeMgt/01.CodeMgt/07.FinCEN314(a)(StoredProcess)',
		dataType: 'json',
		data: updata,
		processData: false,
		contentType: false,
		cache: false,
		timeout: 600000,
		success : function(data){
			$("#btnUpload").prop("disabled",false);
			console.log("execSTPA success" );
			//console.log(data);
			fnCBUploadFile(data);
		},
		complete: function(data){
			//data.responseText;	
			isRun=0;
			tParams=eval('[{}]');
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alert(error);
		}			
	});
}
function fnCBUploadFile(data){
	console.log("fnCBUploadFileN*****************************************************************************");
	//console.log(data);
	alertMsg(data.MSG);
	setSlickGrid(data);
}
function exportEXCEL_FIN(){
	console.log("exportEXCEL_FIN");
	//$("#btnExcel").prop("disabled",true);
	//$("#btnExcel").hide();
	//console.log("sasExcelHTML: " + $sasExcelHTML);
	var userDefHeader=$("#dvUserHeader").html();
	var myForm = fomExcel;
	console.log("orgRptType: " + orgRptType);
	
	console.log("++++++++++++++++++++++++++++++++++++++"+save_path);

	fomPagerDataExcel._sessionid.value=nstp_sessionid;
	fomPagerDataExcel._savepath.value=save_path;
	fomPagerDataExcel._data.value="WEBDATA";
	
	if(fomPagerDataExcel._savepath.value=="") {
	  console.log("저장위치가 없습니다.");
	}
	fomPagerDataExcel.action = "/SASHBI/HBIServlet";
	fomPagerDataExcel.target = 'fileDown';
	fomPagerDataExcel.submit();

}
