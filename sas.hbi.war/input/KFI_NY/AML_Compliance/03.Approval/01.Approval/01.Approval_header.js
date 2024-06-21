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
//	console.log(data);
	arrRiskScore=data;
}
function YesNoSelectEditor(args){
	console.log("YesNoSelectEditor");
	console.log(args);
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		var optItem="";
		YesNoList=[{val:"Y",text:"True Hit"},{val:"N",text:"False Hit"}]
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
		console.log("args.column.id : " + args.column.id);
		defaultValue = item[args.column.id];		//item["JOB_TYPE"];
		console.log("defaultValue : " + defaultValue);
		if (defaultValue == "True Hit"){
			defaultValueN = "Y";
		} else {
			defaultValueN = "N";
		}
		$select.val(defaultValueN);
		
		var data=mrGrid.getData().getItems();
		console.log("lvl2ChkEditor data");
		console.log(data);
		var isLvl2=0;
		
		var tempApprovalKey = data[0].approval_key;
		for (var ii in data){
			if (data[ii].lvl2CHK) isLvl2++;
			console.log("isLvl2 : " + isLvl2);
		}
    if (parseInt(tempApprovalKey) >= 20 && isLvl2 == 0) {
    	console.log("0000001");
    	$("#dvCompliance").hide();
    } else if(parseInt(tempApprovalKey) >= 20 && isLvl2 > 0){
    	console.log("0000002");
    	$("#dvCompliance").show();
    	$("#lev2Tr").show();
    }

	};
	this.serializeValue = function () {
		return ($select.val() == "O");
	};
	this.applyValue = function (item, state) {
		var txt=$select.find("option:selected").text();
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
			//console.log("arrRiskScore : " + arrRiskScore[ii].RISK	+ " : " + data[args.item.id].RISK);
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
function frontChkEditor(args){
    var $select;
    var defaultValue;
    var scope = this;
    
	 var data=mrGrid.getData().getItems();
	 var grp_level=data[0].grp_level;
		approvalKey=data[0].approval_key;
//console.log("args : " + JSON.stringify(args));
//console.log("data : " + JSON.stringify(data));

    this.init = function () {
		if (grp_level > 0 || grp_level < 0) return;
		
			var disStr = "";
			if(approvalKey != "0" && approvalKey != "1") {
				disStr = "disabled";	/* Business SAVE 완료이후 재접근시 수정불가 처리 */
			}
    	
      $select = $("<INPUT type=checkbox value='Y' class='editor-checkbox' hideFocus "+disStr+">");
      $select.appendTo(args.container);
      $select.focus();
    };
    this.destroy = function () {
    	if (grp_level > 0 || grp_level < 0) return;
      $select.remove();
    };
    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
    	if (grp_level > 0 || grp_level < 0) return;
			//console.log("loadvalue - item[args.column.field] : " + item[args.column.field]);
      defaultValue = !!item[args.column.field];

      if (defaultValue) {
        $select.prop('checked', true);
      } else {
        $select.prop('checked', false);
      }
    };
    this.serializeValue = function () {
    	if (grp_level > 0 || grp_level < 0) return;
      return $select.prop('checked');
    };
    this.applyValue = function (item, state) {
     	item[args.column.field] = state;
    };
    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
    };
    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };
    this.init();
}
function lvl1ChkEditor(args){
    var $select;
    var defaultValue;
    var scope = this;
		var data=mrGrid.getData().getItems();
		var grp_level=data[0].grp_level;
		approvalKey=data[0].approval_key;

//console.log("args : " + JSON.stringify(args));
//console.log("data : " + JSON.stringify(data));

    this.init = function () {
    	if (grp_level > 1 || grp_level < 0) return;
    	
			var disStr = "";
			if(approvalKey != "10" && approvalKey != "11") {
				disStr = "disabled";	/* Business SAVE 완료이후 재접근시 수정불가 처리 */
			}
    	
      $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus "+disStr+">");
      $select.appendTo(args.container);
      $select.focus();
    };
    this.destroy = function () {
    	if (grp_level > 1 || grp_level < 0) return;
      $select.remove();
    };
    this.focus = function () {
      $select.focus();
    };
    this.loadValue = function (item) {
    	if (grp_level > 1 || grp_level < 0) return;
      defaultValue = !!item[args.column.field];
      if (defaultValue) {
        $select.prop('checked', true);
      } else {
        $select.prop('checked', false);
      }
    };
    this.serializeValue = function () {
    	if (grp_level > 1 || grp_level < 0) return;
      return $select.prop('checked');
    };
    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };
    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
    };
    this.validate = function () {
      return {
        valid: true,
        msg: null
      };
    };
    this.init();
}
function lvl2ChkEditor(args){
    var $select;
    var defaultValue;
    var scope = this;
		var data=mrGrid.getData().getItems();
		var grp_level=data[0].grp_level;
		approvalKey=data[0].approval_key;
	 
    this.init = function () {
    	if (grp_level > 2 || grp_level < 1) return;
    	
			var disStr = "";
			if(approvalKey != "20" && approvalKey != "21") {
				disStr = "disabled";	/* Business SAVE 완료이후 재접근시 수정불가 처리 */
			}

    	$select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus "+disStr+">");
      $select.appendTo(args.container);
      $select.focus();
    };
    this.destroy = function () {
    	if (grp_level > 2 || grp_level < 1) return;
      $select.remove();
    };
    this.focus = function () {
      $select.focus();
    };
    this.loadValue = function (item) {
    	if (grp_level > 2 || grp_level < 1) return;
      defaultValue = !!item[args.column.field];
      if (defaultValue) {
        $select.prop('checked', true);
      } else {
        $select.prop('checked', false);
      }
		var data=mrGrid.getData().getItems();
		console.log("lvl2ChkEditor data");
		//console.log(data);
		var isLvl2=0;
		for (var ii in data){
			if (data[ii].lvl2CHK) isLvl2++;
			//console.log("isLvl2 : " + isLvl2);
		}
      if (isLvl2 == 0) {
      	console.log("0000003");
      	$("#dvCompliance").hide();
      } else if(isLvl2 > 0){
      	console.log("0000004");
      	$("#dvCompliance").show();
      	$("#lev2Tr").show();
      }
    };
    this.serializeValue = function () {
    	if (grp_level > 2 || grp_level < 1) return;
      return $select.prop('checked');
    };
    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };
    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
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
	//console.log("row : " + row);
	var data=sgGrid.getData().getItems();
	//console.log("row risk : " + data[row].RISK);
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
	//console.log("sgData");
	//console.log(JSON.stringify(sgData));
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
		var customerno=data[row].CUSTOMERNO;
		var sngno=data[row].SNG_NO;
		gsngno=sngno;
		
		tParams=eval('[{}]');
		tParams['customerno']=customerno;
		tParams['sngno']=sngno;
		console.log("sngno : " + sngno);
		$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0301_getCustomerInformation(StoredProcess)",'dispCustomerInformation');
		$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0301_getMacthResult(StoredProcess)",'setMacthResultGrid');
		$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0301_getCompliance(StoredProcess)",'dispCompliance');
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
		//console.log(item)
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
function fnSave(){
	checkEditorLock();
	var mrdata=mrGrid.getData().getItems();
	var grp_level=mrdata[0].grp_level;
	
	if(grp_level == 3 && $("#sltLvl3Trst option:selected").val() == ""){
			alertMsg("Plase Select Transaction!");
			$("#sltLvl3Trst").focus();

			return false;
	}else if(grp_level == 4 && $("#sltLvl4Trst option:selected").val() == ""){
			alertMsg("Plase Select Transaction!");
			$("#sltLvl4Trst").focus();

			return false;
	}
	
	var isSave = confirmMsg("Are you sure you want to save?","fnConfirmSave");	
}

function checkEditorLock(){
		if (!mrGrid.getEditorLock().commitCurrentEdit()) {
		return;
	}		
}

function fnConfirmSave(){
	console.log("fnUploadFile start.........");
	//event.preventDefault();
	$("#progressIndicatorWIP").show();
	
	var mrdata=mrGrid.getData().getItems();
	var grp_level=mrdata[0].grp_level;
	console.log("====############# mrdata #############====");
	//console.log(mrdata);
	//console.log(grp_level);

	var form = $("#fomUpload")[0];
	var updata = new FormData(form);
	updata.append("gsngno",gsngno);
	updata.append("customerID",$("#customerID").html());
	updata.append("grp_level",grp_level);
	updata.append("prssType","save");	// 체크박스 선택인지 save 버튼 클릭인지여부
	
//	var keep_var = ['CRR_SCORE_KEY','FATF','OFAC','BASEL','RISK','RISK_SCORE','CHANGE_CURRENT_IND']
//	updata.append("mrdata",mrdata.serializeValue());
	
	if (grp_level > 1) {
		updata.append("lvl2Detail",$("#txtLvl2Detail").val());
		updata.append("lvl3Result",$("#sltLvl3Result option:selected").val());
		updata.append("lvl3Detail",$("#txtLvl3Detail").val());
		updata.append("lvl3Trst",$("#sltLvl3Trst option:selected").val());
		updata.append("lvl4Result",$("#sltLvl4Result option:selected").val());
		updata.append("lvl4Detail",$("#txtLvl4Detail").val());
		updata.append("lvl4Trst",$("#sltLvl4Trst option:selected").val());
	}

	$("#btnSave").prop("disabled",true);
	$.ajax({
		enctype: 'multipart/form-data',
		type: "post",
		url: "/SASStoredProcess/do",
		_program : 'SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0301_save(StoredProcess)',
		dataType: 'json',
		data: updata,
		processData: false,
		contentType: false,
		cache: false,
		timeout: 600000,
		success : function(data){
			$("#btnSave").prop("disabled",false);
			console.log("execSTPA success" );
			//console.log(data);
			fnSaveResult(data);
		},
		complete: function(data){
			//data.responseText;	
			isRun=0;
			tParams=eval('[{}]');
			submitSTP();
			$("#progressIndicatorWIP").hide();
			$('#dvModalWin').hide();
			$('#dvBG').hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alert(error);
		}			
	});

	//$('#dvModalWin').hide();
}
function fnSaveResult(data){
	//alertMsg(data.MSG);
	//setTimeout('submitSTP();',500*1);
	if (data.MSG == "Successfully saved...") {
		//alertMsg("성공적으로 저장되었습니다.");
		alertMsg("Sucessfully Saved.");
	}else{
		alertMsg("Sucessfully Saved.");
	}
			
	console.log("save_path : " + save_path);
}
function showPopup(){
	
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/6));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-200)/4));
	$("#dvModalWin").css("width","1500px");
	$('#dvModalWin').show();
	//$("#matGridWrap").width($("#tbInfo").width());
}
function dispCustomerInformation(data){
	console.log("dispCustomerInformation");
	console.log(data);
	if(data.length > 0){
		$("#customerName").html(data[0].PARTY_NAME);
		$("#accountDate").html(data[0].CUSTOMER_SINCE_DATE);
		$("#FCA").html(data[0].CUST_SEGMENT);
		$("#customerID").html(data[0].PARTY_NUMBER);
		$("#principalName").html(data[0].PRINCIPAL_NAME);
		$("#country").html(data[0].ORG_COUNTRY_OF_BUSINESS_CODE);
		$("#authSignor").html(data[0].SIGNOR_NAME);
		$("#countryOP").html(data[0].MAILING_COUNTRY_CODE);
	}
}

/* Compliance Lev3, Lev4 Info */
function dispCompliance(data){
	console.log("dispCompliance");
	//console.log(data);

	if(parseInt(data[0].approvalkey) >= 30){
		$("#lev3Tr").show();
		$("#sltLvl3Result").val(data[0].L3_RESULT);
		$("#txtLvl3Detail").val(data[0].L3_RESULT_DETAIL);
		$("#sltLvl3Trst").val(data[0].L3_TRANSACTION);
		$("#txtLvl2Detail").attr("readonly", true);
		$("#evidencse_file").prop("disabled", true);
	}
  if(parseInt(data[0].approvalkey) >= 40){
		$("#lev4Tr").show();
		$("#sltLvl4Result").val(data[0].L4_RESULT);
		$("#txtLvl4Detail").val(data[0].L4_RESULT_DETAIL);
		$("#sltLvl4Trst").val(data[0].L4_TRANSACTION);
		$("#txtLvl2Detail").attr("readonly", true);
		$("#evidencse_file").prop("disabled", true);
		
		$("#sltLvl3Result").prop("disabled", true);
		$("#txtLvl3Detail").attr("readonly", true);
		$("#sltLvl3Trst").prop("disabled", true);
	}

}

var mrGrid;	
function setMacthResultGrid(data){
	console.log("setMacthResultGrid :\n" );

	$("#matGrid").show();
	var dataView = new Slick.Data.DataView();
console.log("dataView===");
console.log("data : " + JSON.stringify(data));
	//var sasJsonRes=eval (data)[0];
	var sasJsonRes=data[0];
	//console.log(sasJsonRes );
	
	var columns =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	
	var options=sasJsonRes["Options"][0];
	//console.log("Options : " + JSON.stringify(options));

//	sasJsonRes["ColumInfo"][0].cssClass="grid_cell_hidden";
//	sasJsonRes["ColumInfo"][0].headerCssClass="grid_cell_hidden";
	
	columns=sasJsonRes["ColumInfo"];
	for(var ii in columns){
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	//console.log("colums : " + JSON.stringify(columns));
	console.log("colums.length : " + columns.length);

/*
	if (columns.length > 8) columns[8].editor=eval("frontChkEditor");	
	if (columns.length > 9) columns[9].editor=eval("lvl1ChkEditor");	
	if (columns.length > 10) columns[10].editor=eval("lvl2ChkEditor");	
*/

	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}

	console.log("sgData");
	console.log(sgData);
	console.log("sgData.length : " + sgData.length);
	
	if(sgData.length > 0){
		approvalKey = sgData[0].approval_key;
	}else{
		approvalKey = 0;
	}

	if ((approvalKey == "1" || approvalKey == "0" || approvalKey == "") && columns.length > 11) columns[11].editor=eval("YesNoSelectEditor");	
	if ((approvalKey == "10" || approvalKey == "11") && columns.length > 12) columns[12].editor=eval("YesNoSelectEditor");	
	if ((approvalKey == "20" || approvalKey == "21") && columns.length > 13) columns[13].editor=eval("YesNoSelectEditor");	

	if(parseInt(approvalKey) >= 20){
		
		var lvl2Data = sgData;
		console.log(lvl2Data);
		var isLvl2=0;
		for (var ii in lvl2Data){
			if (lvl2Data[ii].lvl2CHK) isLvl2++;
		}
		console.log("isLvl2 : " + isLvl2);

    if (isLvl2 == 0) {
    	console.log("0000005");
    	$("#dvCompliance").hide();
    } else if(isLvl2 > 0){
    	console.log("0000006");
    	$("#dvCompliance").show();
    	$("#lev2Tr").show();
    }
    
	}

	
	mrGrid = new Slick.Grid("#matGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		console.log("onRowCountChanged");
		mrGrid.updateRowCount();
		mrGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		console.log("onRowsChanged");
		mrGrid.invalidateRows(args.rows);
		mrGrid.render();
	});
	mrGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	mrGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	mrGrid.onCellChange.subscribe(function(e, args) {

		//Front Check, Level1 Check, Level2 Check 변경 시점에 저장???
		//console.log("mrGrid.onCellChange!! : " + JSON.stringify(args));
		//console.log("args[item].SEQ_NO : " + args["item"].SEQ_NO);
		//console.log("args[item].frontCHK : " + args["item"].frontCHK);
		//console.log("args[item].grp_level : " + args["item"].grp_level);
		//console.log("args[item].lvl1CHK : " + args["item"].lvl1CHK);
		//console.log("args[item].lvl2CHK : " + args["item"].lvl2CHK);
		//console.log("gsngno : " + gsngno);
		
		var form = $("#fomUpload")[0];
		var updata = new FormData(form);
		
		console.log("updata : " + JSON.stringify(updata));
		console.log("args['item'] : " + JSON.stringify(args["item"]));

		updata.append("customerID",$("#customerID").html());
		
		updata.append("grp_level",args["item"].grp_level);
		updata.append("seqno",args["item"].SEQ_NO);
		updata.append("gsngno",gsngno);
		
		
	if ((approvalKey == "1" || approvalKey == "0" || approvalKey == "") && columns.length > 11) columns[11].editor=eval("YesNoSelectEditor");	
	if ((approvalKey == "10" || approvalKey == "11") && columns.length > 12) columns[12].editor=eval("YesNoSelectEditor");	
	if ((approvalKey == "20" || approvalKey == "21") && columns.length > 13) columns[13].editor=eval("YesNoSelectEditor");	
	
	
		var frntChkStr = "N";
		if(args["item"].frontCHK != "" && args["item"].frontCHK == "True Hit"){frntChkStr = "Y";
		}else if(args["item"].frontCHK != "" && args["item"].frontCHK == "False Hit"){frntChkStr = "N";}
		updata.append("frontchk",frntChkStr);
		
		var lvl1ChkStr = "N";
		if(parseInt(approvalKey) >= 10 && args["item"].lvl1CHK != "" && args["item"].lvl1CHK == "True Hit"){lvl1ChkStr = "Y";
		}else if(parseInt(approvalKey) >= 10 && args["item"].lvl1CHK != "" && args["item"].lvl1CHK == "False Hit"){lvl1ChkStr = "N";}
		updata.append("lvl1chk",lvl1ChkStr);
		
		var lvl2ChkStr = "N";
		if(parseInt(approvalKey) >= 20 && args["item"].lvl2CHK != "" && args["item"].lvl2CHK == "True Hit"){
			lvl2ChkStr = "Y";
			console.log("0000007");
			$("#dvCompliance").show();
			$("#lev2Tr").show();
		}else if(parseInt(approvalKey) >= 20 && args["item"].lvl2CHK != "" && args["item"].lvl2CHK == "False Hit"){
			lvl2ChkStr = "N";
			console.log("0000008");
			$("#dvCompliance").show();
			$("#lev2Tr").hide();
		}
		updata.append("lvl2chk",lvl2ChkStr);
		
		console.log("args['item'].frontCHK : " + args["item"].frontCHK);
		console.log("args['item'].lvl1CHK : " + args["item"].lvl1CHK);
		console.log("args['item'].lvl2CHK : " + args["item"].lvl2CHK);
		
		updata.append("prssType","check");	// 체크박스 선택인지 save 버튼 클릭인지여부
		
		//console.log("updata Result : " + updata.get("frontchk"));

		
		$.ajax({
			enctype: 'multipart/form-data',
			type: "post",
			url: "/SASStoredProcess/do",
			_program : 'SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0301_save(StoredProcess)',
			dataType: 'json',
			data: updata,
			processData: false,
			contentType: false,
			cache: false,
			timeout: 600000,
			success : function(data){
				$("#btnSave").prop("disabled",false);
				console.log("execSTPA success" );
				//console.log(data);
				//fnSaveResult(data);
			},
			complete: function(data){
				//data.responseText;	
				isRun=0;
				tParams=eval('[{}]');
				//$("#progressIndicatorWIP").hide();
			},
			error : function(xhr, status, error) {
				console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
				alert(error);
			}			
		});
		
	});	
	mrGrid.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
		setCellColor();
	});
	dataView.beginUpdate();
	dataView.setItems(sgData);
	dataView.endUpdate();	

	//$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();

	var isLvl2=0;
	for (var ii in sgData){
		console.log("sgData[ii].lvl2CHK : " + sgData[ii].lvl2CHK);
		if (sgData[ii].lvl2CHK) isLvl2++;
	}

	console.log("approvalkey $$$$$ : " + approvalKey);
	console.log("isLvl2 $$$$$ : " + isLvl2);

   if (isLvl2 == 0) {
   	console.log("0000009");
		$("#dvCompliance").hide();
   } else if(isLvl2 > 0){
   	console.log("0000010");
			$("#dvCompliance").show();
			$("#lev2Tr").show();
			console.log("sgData[0].l2_result_detail : " + sgData[0].l2_result_detail);
			console.log("sgData[0].att_file_name : " + sgData[0].att_file_name);
			
			var attFileName = "";
			
			if(sgData[0].att_file_name != ""){
			 	var tmpArr = sgData[0].att_file_name.split("_");
			 	for (var i in tmpArr) {
					if(i > 2){
						if(i == 2){
							attFileName = tmpArr[i];
						}else{
							if(attFileName == ""){
								attFileName = tmpArr[i];
						}else{
								attFileName = attFileName + "_" + tmpArr[i];
							}
						}
					}
			 	}
			
				var downBtn = '<input type="button" id="attDownBtn" class="condBtn" value="Download" onclick="fnAttDown(\''+sgData[0].att_file_name+'\');">';
				$("#downFileSpan").html(attFileName + downBtn);
			}
			
			$("#txtLvl2Detail").val(sgData[0].l2_result_detail);
   }
   
   console.log("approvalKey : " + approvalKey);

   if(parseInt(approvalKey) >= 20){
   	console.log("0000011");
		$("#dvCompliance").show();
		if(isLvl2 > 0){
			$("#lev2Tr").show();
		}
	}else{
		console.log("0000012");
		$("#dvCompliance").hide();
	}

}	

function fnAttDown(fileNameStr){
	console.log("File Download !!!");
	
		//$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0301_downLoadFile(StoredProcess)",'fnDownload');
		location.href='/SASStoredProcess/do?_program=%2FKFI_NY%2FAML+Compliance%2F00.Environments%2FStoredProcess%2FFileDownload&fname='+fileNameStr+'&downType=approval';
		
}

function fnDownload(data){
	//console.log(data);
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