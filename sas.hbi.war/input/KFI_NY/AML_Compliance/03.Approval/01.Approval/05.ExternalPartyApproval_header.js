var dataView;
var grid;
var data = [];
var percentCompleteThreshold = 0;
var searchString = "";
var v_check_yn='A';

function requiredFieldValidator(value) {
  if (value == null || value == undefined || !value.length) {
    return {valid: false, msg: "This is a required field"};
  } else {
    return {valid: true, msg: null};
  }
}

var TaskNameFormatter = function (row, cell, value, columnDef, dataContext) {
  value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>";
  var idx = dataView.getIdxById(dataContext.id);


  if (data[idx + 1] && data[idx + 1].indent > data[idx].indent) {
    if (dataContext._collapsed) {
      return spacer + " <span class='toggle expand'></span>&nbsp;" + value;
    } else {
      return spacer + " <span class='toggle collapse'></span>&nbsp;" + value;
    }
  } else {
    return spacer + " <span class='toggle'></span>&nbsp;" + value;
  }
};


var CustomSelectFommater = function (row, cell, value, columnDef, dataContext) {
	var result="";
	if (dataContext.indent==0 && dataContext.parent == null) {
	    ////console.log("parent row.....");
	    if (dataContext.CHECK_YN=="U") {
	        result = "<span style='font-weight:bold;' class='colorM'>UnChecked</span>";
        } else if (dataContext.CHECK_YN=="T") {
	        result = "<span style='font-weight:bold;' class='colorVH'>Same Person</span>";
        }else {
            result = "<span style='font-weight:normal;' class='colorL'>Not Same Person</span>";
        }
    } else{
        if (dataContext.CHECK_YN=="R") {
            result = "<span style='font-weight:bold;' class='colorH'>REP. Person</span>";
        } else if (dataContext.CHECK_YN=="X") {				//// koryhh
            result = "<span style='font-weight:normal;' class='colorL'>Not Same Person</span>";
        }else {
            result = "";
        }
    }
    return result;
};

function CustomSelectEditor(args){
	var $select;
	var defaultValue;
	var scope = this;
	this.init = function () {
		var optItem="";
		YesNoList=[{val:"U",text:"UnChecked"},{val:"T",text:"Same Person"},{val:"F",text:"Not Same Person"}]
		for (var ii in YesNoList){
			optItem+="<option value='" + YesNoList[ii].val + "'>" + YesNoList[ii].text + "</option>";
		}
		$select = $("<SELECT tabIndex='0' class='editor-yesno'>"+ optItem +"</SELECT>");			
		$select.appendTo(args.container);
		$select.focus();
	};
	this.init_rep = function () {
		var optItem="";
		YesNoList=[{val:"R",text:"REP. Person"},{val:"N",text:"Not REP. Person"},{val:"X",text:"Not Same Person"}]
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
		defaultValue = item[args.column.id];
		$select.val(defaultValue);
	};
	this.serializeValue = function () {
		return ($select.val() == "Y");
	};
	this.applyValue = function (item, state) {
		var txt=$select.find("option:selected").val();
		console.log("applyValue : " + txt);
		item[args.column.field] = txt;
	};
	this.isValueChanged = function () {	    
	    var dbDefaultVal=data[args.item.id].DEFAULT_CHECK_YN;
	    console.log("dbDefaultVal in isValueChanged : " + dbDefaultVal);
        if ((dbDefaultVal == 'T' || dbDefaultVal == 'F') && $select.val() == 'U') {
            alertMsg("Can't change to unchecked state.");
            $select.val(dbDefaultVal);
            return false;
        }
	    
		return ($select.val() != defaultValue);
	};
	this.validate = function () {
		return {
			valid: true,
			msg: null
		};
	};
	if (args.item.indent==0 && args.item.parent == null) {
	    this.init();
	} else {
	    this.init_rep();
    }
}

function myFilter(item) {
  if (item.parent != null) {
    var parent = data[item.parent];
	ii=0;
    while (parent) {
      if (parent._collapsed || (parent["percentComplete"] < percentCompleteThreshold) || (searchString != "" && parent["title"].indexOf(searchString) == -1)) {
        return false;
      }
	  ii++;	
      parent = data[parent.parent];
	  if (ii>220)  parent=0;
    }
  }
  return true;
}

function percentCompleteSort(a, b) {
  return a["percentComplete"] - b["percentComplete"];
}

function setSlickGridTree(sasResData) {
    
    v_check_yn=$("#sltp_check_yn").val();
	
	$("#sasGrid").show();
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
	
	var sasJsonRes=sasResData[0];	
	var columns =[];	
	columns=sasJsonRes["ColumInfo"];	
	for(var ii in columns){
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	columns[5].editor=eval("CustomSelectEditor");	
	columns[5].formatter=eval("CustomSelectFommater");
	
	
	var options=sasJsonRes["Options"][0];
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=sasResData;
    data = sasJsonRes["SASResult"];
  
    console.log("data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log(data);

    // initialize the model
    dataView = new Slick.Data.DataView({ inlineFilters: true });    
    dataView.beginUpdate();
    dataView.setItems(data);  
    dataView.setFilter(myFilter);
    dataView.endUpdate();

    // initialize the grid
    grid = new Slick.Grid("#sasGrid", dataView, columns, options);
  
    var columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options); 

    grid.onClick.subscribe(function (e, args) {
        if ($(e.target).hasClass("toggle")) {
            var item = dataView.getItem(args.row);
            if (item) {
                if (!item._collapsed) {
                    item._collapsed = true;
                } else {
                    item._collapsed = false;
                }
                dataView.updateItem(item.id, item);
                $(e.target).parent().css('background-color', 'blue');
            }
            e.stopImmediatePropagation();
        }
    });


  // wire up model events to drive the grid
    dataView.onRowCountChanged.subscribe(function (e, args) {
        grid.updateRowCount();
        grid.render();
        setCellColor();
    });

    dataView.onRowsChanged.subscribe(function (e, args) {
        grid.invalidateRows(args.rows);
        grid.render();
        setCellColor();
    });
  
    grid.onCellChange.subscribe(function (e, args) {
        var cluster=args.item.cluster;
        var indent =args.item.indent;
        var currid =args.item.id;        
                
        if (indent == 0) {
            for (var idx=0;idx < data.length; idx++) {
                if (data[idx].cluster == cluster && data[idx].indent == 1) {
                    data[idx].CHECK_YN = 'N';
                    dataView.updateItem(idx, data[idx]);
                }
            }
        }else{
            var parent_check_tf  = data[args.item.parent].CHECK_YN;
            var current_check_yn = args.item.CHECK_YN;
            if (current_check_yn == 'Y') {
                if(parent_check_tf == 'T') {
                    for (var idx=0;idx < data.length; idx++) {
                        if (data[idx].cluster == cluster && data[idx].indent == 1) {
                        	console.log("data[idx].CHECK_YN : " + data[idx].CHECK_YN);		//// koryhh
                            if(data[idx].id == currid) {
                                data[idx].CHECK_YN = 'Y';
                            } else if (data[idx].CHECK_YN == "F") {								//// koryhh
                                data[idx].CHECK_YN = 'F';
                            }else{
                                data[idx].CHECK_YN = 'N';
                            }
                            dataView.updateItem(idx, data[idx]);
                        }
                    }
                } else{
                    for (var idx=0;idx < data.length; idx++) {
                        if (data[idx].cluster == cluster && data[idx].indent == 1) {
                            if(parent_check_tf == 'U') data[idx].CHECK_YN = 'U';
                            else if(parent_check_tf == 'F') data[idx].CHECK_YN = 'N';
                            dataView.updateItem(idx, data[idx]);
                        }
                    }
                }
            }
        }

        grid.invalidateRows(args.rows);
        grid.render();
        
        setTimeout("setCellColor();",1*100);
    });
  
  	grid.onScroll.subscribe(function (e) {
		setTimeout("setCellColor();",1*100);
	});

    setTimeout("setCellColor();",1*100);

}

function setCellColor(){
	$(".colorVH").parent().css("color","#FF0000");
	$(".colorH").parent().css("color","#FF8080");
	$(".colorM").parent().css("color","#000000");
	$(".colorL").parent().css("color","#000000");
}

function setArr(base,keep_var){
	var new_data = new Array();
	for (var ii in base){
        var row = new Object();
        new_data.push(row);
        for (var col in keep_var){
    	    new_data[ii][keep_var[col]] = base[ii][keep_var[col]] ;
    	}
	}
	return new_data;
}

var saveGridData;

function fnSaveGrid1() {
    
	//~ Validate ---------------------------------------------------------------
    var parent_id      = -1;
    var parent_cluster = -1;
    var hasPEP         = -1;
    var isValid        = true;
    
    saveGridData = new Array();    
    for (var idx=0;idx < data.length; idx++) {
        if(idx > 0){
            if (parent_cluster != data[idx].cluster) {                
                if(parent_cluster > -1 && hasPEP == -1) {
                    console.log('logic 1 print.');
                    isValid=false;
                    break;
                }                
            }
        }
        
        if(data[idx].indent == 0) {
            parent_id      = -1;
            parent_cluster = -1;
            if(data[idx].CHECK_YN=='T') {
                parent_id      = data[idx].id;
                parent_cluster = data[idx].cluster;
                hasPEP         = -1;
            }
        }
        
        if(parent_cluster > -1 && data[idx].indent == 1 && data[idx].cluster == parent_cluster) {
            if(data[idx].CHECK_YN=='R') hasPEP = 1;
        }
        
        if(eval(data.length-1) == idx){            
            if(parent_cluster > -1 && hasPEP==-1){
                console.log('logic 2 print.');
                isValid=false;
                break;
            }            
        }
        
        if(data[idx].indent == 1 && data[idx].CHECK_YN!='U'){
	        console.log("data[idx].CHECK_YN : " + data[idx].CHECK_YN);
	     }
        
        if(data[idx].indent == 0 && (data[idx].CHECK_YN=='T' || data[idx].CHECK_YN=='F')) {
            saveGridData.push(data[idx]);
        }
        if(data[idx].indent == 1 && (data[idx].CHECK_YN=='R'||data[idx].CHECK_YN=='X')) {
            saveGridData.push(data[idx]);
        }
    }
    
    if (!isValid) {
        grid.scrollRowIntoView(parent_id);
        grid.flashCell(parent_id, grid.getColumnIndex("title"), 100);
        setTimeout("alertMsg('Select Representative External Customer.')",1*1000);
        return;
    }
    
	var isSave = confirmMsg("Are you sure you want to save?","fnConfirmSaveGrid1");	
}

function fnConfirmSaveGrid1(){
	if (!grid.getEditorLock().commitCurrentEdit()) {
		return;
	}
	
	//console.log("saveGridData ######");
	//console.log("saveGridData length is "+saveGridData.length);
	//console.log(saveGridData);
	if (saveGridData.length==0) {
	    alertMsg('There is no data to save.');
	    return;
    }
	
	tParams=eval('[{}]');
	var keep_var=['title', 'cluster', 'CHECK_YN', 'indent'];	
	var send_data = setArr(saveGridData, keep_var);
	
	console.log('send_data');
	console.log(send_data);
	var gridData=JSON.stringify(send_data);	
	////console.log(gridData);
	tParams['_savepath']=save_path;
	tParams['gridData']=gridData;
	tParams['_library']="stp_temp";
	tParams['p_check_yn']=v_check_yn;
	tParams['_tablename']="FSC_EXT_PARTY_SAME_CHECK";
	tParams['_program']="SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0301_ExternalPartyApproval_65(StoredProcess)";
	//console.log("gridData : ");
	//console.log(gridData);
	//console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSaveResult","json"); 
	$('#dvModalWin').hide();
}

function fnSaveResult(data){
	alertMsg(data.MSG);
	setTimeout('submitSTP();',500*1);
}


function execTestSTP(sp_URI){
	var param={
	    _program    : sp_URI,
		_result     : "STREAMFRAGMENT",
		_action     : "background",
	}
	$.ajax({
		url: "/SASStoredProcess/do?",
		data: param,
		cache:false,
		dataType: 'html',
		async: true,
		beforeSend: function() {
			$("#progressIndicatorWIP").show();
		},
		success : function(data){           
			console.log("data load complete.....");
			console.log(data.MSG);
			//$("#dvRes").html(data);
			//$("#dvGraph1").html($("#dvRes .branch:eq(0)").html())
			//$("#dvGraph2").html($("#dvRes .branch:eq(1)").html())
			//$("#dvGraph2 p").remove();
			//$("#dvGraph2 hr").remove();
			$("#progressIndicatorWIP").hide();
			console.log("graph init complete.....");
		}                    
	});
} 

function testStp() {
    
    execTestSTP("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/Compliance_CDD_Accept(StoredProcess)");
}


$(document).ready(function () {
	//alert('한글');
    //$("#dvToolBar").append("<input type=button value=Add id=btnSave class=condBtn onclick='fnAddRow();'>");
	//$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid1();'>");
    //$("#dvToolBar").append("<input type=button value=Test id=btnSave class=condBtn onclick='testStp();'>");
	$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid1();'>");
	//$("#dvToolBar").show();
});
function resizeGrid(){
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (grid!=undefined) {
		grid.resizeCanvas();
	}
}
setTimeout('resizeGrid();',500*1);
$(window).resize(function() {
	resizeGrid();
});


