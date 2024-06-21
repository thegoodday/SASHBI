
$(window).resize(function () {
	resizeFrame();
})
function resizeFrame(){
	$("#dvMain").height(eval($(window).height()-$("#dvCondi").height()-33));
	$("#dvCol1").width(350);
		$("#dvDftFmtList").width($("#dvCol1").width());
		$("#dvUserFmtList").width($("#dvCol1").width());
	$("#dvCol2").width(eval($(window).width()-$("#dvCol1").width()-12));

	$("#dvDftFmtList").height(eval($(window).height()*0.55));
	$("#dvUserFmtList").height(eval($(window).height()-$("#dvCondi").height()-$("#dvDftFmtList").height()-$("#dvBTN").height()-59));														

	$("#dvCol2").height(eval($(window).height()-$("#dvCondi").height()-40));
	$("#dvFormatGR").height(eval($(window).height()-$("#dvCondi").height()-110));

}
$(document).ready(function () { 
	$("#sltACCT_GROUP").width(150);
	$("#sltTREE_TYPE").width(150);
	$("#sltSUB_TYPE").width(150);
	$("#sltLIBRARY").width(150);
	$("#sltDATA_NAME").width(150);
	setTimeout("$('#dvMain').show();",1000*2);
	$( "#sltCOL_NAME2" ).bind( "change", function() {
	  console.debug("sltCOL_NAME2 items changed!!!");;
	});
});
var griddvDftFmtList;
var datadvDftFmtList;
var dataVwdvDftFmtList;

var pluginOptionsdvDftFmtList = {
  clipboardCommandHandler: function(editCommand){ undoRedoBuffer.queueAndExecuteCommand.call(undoRedoBuffer,editCommand); },
  includeHeaderWhenCopying : false
};

function grFilterdvDftFmtList(item) {
	return true;
}
function renderdvDftFmtList(data){
	console.log("renderdvDftFmtList started!!!!=======================");
	$("#dvFormatGR").html("");
	var sasJsonRes=eval(data)[0];
	console.log("sasJsonRes");
	console.log(sasJsonRes);
	
	if (sasJsonRes.SASLog != undefined) {
		var sasLogdvDftFmtList	= sasJsonRes.SASLog;
		console.log("SAS Logs\n");
		console.log(sasLogdvDftFmtList);
		$("#dvSASLog").html("<pre>" +$("#dvSASLog").html() + sasLogdvDftFmtList+"</pre>");
		//$("#dvSASLogWin").show();
		$("#dvSASLogWin").css("top","40px");
	}
	
	
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	//nstp_sessionid=sessionInfo["nstp_sessionid"];
	//stp_sessionid=nstp_sessionid;
	//save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path); 
	
	datadvDftFmtList =[];
	columnsdvDftFmtList =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	
	optionsdvDftFmtList	=sasJsonRes["Options"][0];
	
	var isChk=optionsdvDftFmtList.chkBox;
	if (isChk){
		columnsdvDftFmtList.push(checkboxSelector.getColumnDefinition());
		columnsdvDftFmtList=$.extend(sasJsonRes["ColumInfo"],columnsdvDftFmtList);;
	}
	columnsdvDftFmtList	=sasJsonRes["ColumInfo"];
	
	
	datadvDftFmtList	= sasJsonRes["SASResult"];
		
	dataVwdvDftFmtList = new Slick.Data.DataView({ inlineFilters: true });
	
	/*
	dataVwdvDftFmtList.beginUpdate();
	dataVwdvDftFmtList.setItems(datadvDftFmtList);
	dataVwdvDftFmtList.setFilterArgs({
		percentCompleteThreshold: percentCompleteThreshold,
		searchString: searchString
	});
	dataVwdvDftFmtList.setFilter(grFilterdvDftFmtList);
	dataVwdvDftFmtList.endUpdate();
	*/
	
	griddvDftFmtList	= new Slick.Grid("#dvDftFmtList",  datadvDftFmtList, columnsdvDftFmtList,  optionsdvDftFmtList);
	if (isChk){
  	griddvDftFmtList.registerPlugin(checkboxSelector);
	}
	griddvDftFmtList.setSelectionModel(new Slick.RowSelectionModel());
	griddvDftFmtList.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: true}));
	griddvDftFmtList.setSelectionModel(new Slick.CellSelectionModel());
	var columnpicker = new Slick.Controls.ColumnPicker(columnsdvDftFmtList, griddvDftFmtList, optionsdvDftFmtList); 
	griddvDftFmtList.getCanvasNode().focus();
	griddvDftFmtList.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
	griddvDftFmtList.registerPlugin(new Slick.CellExternalCopyManager(pluginOptionsdvDftFmtList));
	griddvDftFmtList.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  datadvDftFmtList.sort(function (dataRow1, dataRow2) {
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
	  griddvDftFmtList.invalidate();
	  griddvDftFmtList.render();
	});		
	

	griddvDftFmtList.onClick.subscribe(function (e) {
		$("#trColumnName").hide();
		$("#btnSave").show();
		tParams=eval('[{}]');
		var cell = griddvDftFmtList.getCellFromEvent(e);
		curRowdvDftFmtList = cell.row;
		console.log("griddvDftFmtList Clicked!!!");
		var formatName= datadvDftFmtList[curRowdvDftFmtList].FMT_NAME;
		curColumnName = datadvDftFmtList[curRowdvDftFmtList].COL_NAME;
		console.log("curColumnName : " + curColumnName);
		tParams['COL_NAME']=curColumnName;

		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/06.Tree Rollup/01/fmt001_getFormatAttr(StoredProcess)","renderdvFormatGR",formatName);					

	});

	griddvDftFmtList.onDblClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = griddvDftFmtList.getCellFromEvent(e);
		curRowdvDftFmtList = cell.row;
		console.log("griddvDftFmtList Double Clicked!!!");
	});

}

	
var griddvFormatGR;
var datadvFormatGR;
var dataVwdvFormatGR;
var undoRedoBuffer = {
    commandQueue : [],
    commandCtr : 0,

    queueAndExecuteCommand : function(editCommand) {
      	console.log("editCommand : " + editCommand);
      this.commandQueue[this.commandCtr] = editCommand;
      this.commandCtr++;
      editCommand.execute();
    },

    undo : function() {
      if (this.commandCtr == 0)
        return;

      this.commandCtr--;
      var command = this.commandQueue[this.commandCtr];

      if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
        command.undo();
      }
    },
    redo : function() {
      if (this.commandCtr >= this.commandQueue.length)
        return;
      var command = this.commandQueue[this.commandCtr];
      this.commandCtr++;
      if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
        command.execute();
      }
    }
}

$(document).keydown(function(e){
	if (e.which == 90 && (e.ctrlKey || e.metaKey)) {    // CTRL + (shift) + Z
		if (e.shiftKey){
			undoRedoBuffer.redo();
		} else {
			undoRedoBuffer.undo();
		}
	}
});

var pluginOptionsdvFormatGR = {
  clipboardCommandHandler: function(editCommand){ undoRedoBuffer.queueAndExecuteCommand.call(undoRedoBuffer,editCommand); },
  includeHeaderWhenCopying : false
};

function grFilterdvFormatGR(item) {
	return true;
}
function renderdvFormatGR(data){
	console.log("renderdvFormatGR started!!!!=======================");
	var sasJsonRes=eval(data)[0];
	console.log("sasJsonRes");
	console.log(sasJsonRes);
	
	if (sasJsonRes.SASLog != undefined) {
		var sasLogdvFormatGR	= sasJsonRes.SASLog;
		console.log("SAS Logs\n");
		console.log(sasLogdvFormatGR);
		$("#dvSASLog").html("<pre>" +$("#dvSASLog").html() + sasLogdvFormatGR+"</pre>");
		//$("#dvSASLogWin").show();
		$("#dvSASLogWin").css("top","40px");
	}
	
	
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	save_path=sessionInfo["save_path"];
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path); 

	$sasExcelHTML=data;
	
	datadvFormatGR =[];
	columnsdvFormatGR =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	
	optionsdvFormatGR	=sasJsonRes["Options"][0];
	
	var isChk=optionsdvFormatGR.chkBox;
	if (isChk){
		columnsdvFormatGR.push(checkboxSelector.getColumnDefinition());
		columnsdvFormatGR=$.extend(sasJsonRes["ColumInfo"],columnsdvFormatGR);;
	}
	columnsdvFormatGR	=sasJsonRes["ColumInfo"];
	
	for(ii in columnsdvFormatGR){
		console.log(ii);
		var objTemp = columnsdvFormatGR[ii].editor;
		columnsdvFormatGR[ii].editor=eval(objTemp);
	}
	
	
	datadvFormatGR	= sasJsonRes["SASResult"];

	dataVwdvFormatGR = new Slick.Data.DataView({ inlineFilters: true });
	console.log("datadvFormatGR: " + JSON.stringify(datadvFormatGR));						
	console.log("columnsdvFormatGR: " + JSON.stringify(columnsdvFormatGR));						
	console.log("optionsdvFormatGR: " + JSON.stringify(optionsdvFormatGR));						

	griddvFormatGR	= new Slick.Grid("#dvFormatGR",  datadvFormatGR, columnsdvFormatGR,  optionsdvFormatGR);
	if (isChk){
  	griddvFormatGR.registerPlugin(checkboxSelector);
	}
	griddvFormatGR.setSelectionModel(new Slick.RowSelectionModel());
	griddvFormatGR.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: true}));
	griddvFormatGR.setSelectionModel(new Slick.CellSelectionModel());
	var columnpicker = new Slick.Controls.ColumnPicker(columnsdvFormatGR, griddvFormatGR, optionsdvFormatGR); 
	griddvFormatGR.getCanvasNode().focus();
	griddvFormatGR.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
	griddvFormatGR.registerPlugin(new Slick.CellExternalCopyManager(pluginOptionsdvFormatGR));
	griddvFormatGR.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  datadvFormatGR.sort(function (dataRow1, dataRow2) {
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
	  griddvFormatGR.invalidate();
	  griddvFormatGR.render();
	});		
	

	griddvFormatGR.onClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = griddvFormatGR.getCellFromEvent(e);
		curRowdvFormatGR = cell.row;
		console.log("griddvFormatGR Clicked!!!");
	});

	griddvFormatGR.onDblClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = griddvFormatGR.getCellFromEvent(e);
		curRowdvFormatGR = cell.row;
		console.log("griddvFormatGR Double Clicked!!!");
	});
}

	
var griddvUserFmtList;
var datadvUserFmtList;
var dataVwdvUserFmtList;

var pluginOptionsdvUserFmtList = {
  clipboardCommandHandler: function(editCommand){ undoRedoBuffer.queueAndExecuteCommand.call(undoRedoBuffer,editCommand); },
  includeHeaderWhenCopying : false
};

function grFilterdvUserFmtList(item) {
	return true;
}
function renderdvUserFmtList(data){
	console.log("renderdvUserFmtList started!!!!=======================");
	var sasJsonRes=eval(data)[0];
	console.log("sasJsonRes");
	console.log(sasJsonRes);
	
	if (sasJsonRes.SASLog != undefined) {
		var sasLogdvUserFmtList	= sasJsonRes.SASLog;
		console.log("SAS Logs\n");
		console.log(sasLogdvUserFmtList);
		$("#dvSASLog").html("<pre>" +$("#dvSASLog").html() + sasLogdvUserFmtList+"</pre>");
		//$("#dvSASLogWin").show();
		$("#dvSASLogWin").css("top","40px");
	}
	
	
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	//nstp_sessionid=sessionInfo["nstp_sessionid"];
	//stp_sessionid=nstp_sessionid;
	//save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path); 
	
	datadvUserFmtList =[];
	columnsdvUserFmtList =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	
	optionsdvUserFmtList	=sasJsonRes["Options"][0];
	
	var isChk=optionsdvUserFmtList.chkBox;
	if (isChk){
		columnsdvUserFmtList.push(checkboxSelector.getColumnDefinition());
		columnsdvUserFmtList=$.extend(sasJsonRes["ColumInfo"],columnsdvUserFmtList);;
	}
	columnsdvUserFmtList	=sasJsonRes["ColumInfo"];
	
	
	datadvUserFmtList	= sasJsonRes["SASResult"];
		
	dataVwdvUserFmtList = new Slick.Data.DataView({ inlineFilters: true });
	
	/*
	dataVwdvUserFmtList.beginUpdate();
	dataVwdvUserFmtList.setItems(datadvUserFmtList);
	dataVwdvUserFmtList.setFilterArgs({
		percentCompleteThreshold: percentCompleteThreshold,
		searchString: searchString
	});
	dataVwdvUserFmtList.setFilter(grFilterdvUserFmtList);
	dataVwdvUserFmtList.endUpdate();
	*/
	
	griddvUserFmtList	= new Slick.Grid("#dvUserFmtList",  datadvUserFmtList, columnsdvUserFmtList,  optionsdvUserFmtList);
	if (isChk){
  	griddvUserFmtList.registerPlugin(checkboxSelector);
	}
	griddvUserFmtList.setSelectionModel(new Slick.RowSelectionModel());
	griddvUserFmtList.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: true}));
	griddvUserFmtList.setSelectionModel(new Slick.CellSelectionModel());
	var columnpicker = new Slick.Controls.ColumnPicker(columnsdvUserFmtList, griddvUserFmtList, optionsdvUserFmtList); 
	griddvUserFmtList.getCanvasNode().focus();
	griddvUserFmtList.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
	griddvUserFmtList.registerPlugin(new Slick.CellExternalCopyManager(pluginOptionsdvUserFmtList));
	griddvUserFmtList.getCanvasNode().focus();														
	griddvUserFmtList.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  datadvUserFmtList.sort(function (dataRow1, dataRow2) {
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
	  griddvUserFmtList.invalidate();
	  griddvUserFmtList.render();
	});		
	

	griddvUserFmtList.onClick.subscribe(function (e) {
		$("#trColumnName").hide();
		$("#btnSave").show();
		tParams=eval('[{}]');
		var cell = griddvUserFmtList.getCellFromEvent(e);
		curRowdvUserFmtList = cell.row;
		console.log("griddvUserFmtList Clicked!!!");
		var formatName= datadvUserFmtList[curRowdvUserFmtList].FMT_NAME;
		curColumnName = datadvDftFmtList[curRowdvUserFmtList].COL_NAME;
		console.log("formatName : " + formatName);
		tParams['COL_NAME']=curColumnName;
		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/06.Tree Rollup/01/fmt001_getFormatAttr(StoredProcess)","renderdvFormatGR",formatName);					
	});

	griddvUserFmtList.onDblClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = griddvUserFmtList.getCellFromEvent(e);
		curRowdvUserFmtList = cell.row;
		console.log("griddvUserFmtList Double Clicked!!!");
	});

}
function deleteUserFmt(){
  if ( griddvUserFmtList.getActiveCell() == null) {
		alertMsg("Select the User Format.");
		return;
  }
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteUserFmt2");
}
function deleteUserFmt2(){
  var data = griddvUserFmtList.getData();
  var current_row = griddvUserFmtList.getActiveCell().row;
	var FMT_NAME= data[current_row].FMT_NAME;
	console.log("FMT_NAME for Delete : " + FMT_NAME);
  data.splice(current_row,1);
  var r = current_row;
  while (r<data.length){
    griddvUserFmtList.invalidateRow(r);
    r++;
  }
  griddvUserFmtList.updateRowCount();
  griddvUserFmtList.render();
  griddvUserFmtList.scrollRowIntoView(current_row-1);
	execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/06.Tree Rollup/01/fmt001_deleteUserFMT(StoredProcess)",true,"deleteUserFmt3","html",FMT_NAME);
	

}
function deleteUserFmt3(res){
	console.log("delete res : " + res);
	alertMsg("Successfully deleted User Format.("+res+")");
}
function closeFmtDescWindow(){
	$('#dvFmtDesc').hide();
	$('#dvBG').hide();
}
function getFmt_desc(){
	$("#dvBG").show();
	$("#dvFmtDesc").css("left",eval(eval($(window).width()-$("#dvFmtDesc").width()-0)/2));
	$("#dvFmtDesc").css("top",eval(eval($(window).height()-$("#dvFmtDesc").height()-100)/2));
	$("#dvFmtDesc").show();
}
function saveAsFmt(fmt_desc){
	if (!griddvFormatGR.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	$('#dvFmtDesc').hide();
	console.log("fmt_desc : " + fmt_desc);
	tParams=eval('[{}]');
	var data=griddvFormatGR.getData();
	var gridData=JSON.stringify(data);
	tParams['gridData']=gridData;
	tParams['isNew']="Y";
	tParams['FMT_LABEL']=fmt_desc;
	// col_name 이 주석처리 되어있던 이유가 뭘까???
	tParams['COL_NAME']=curColumnName;

	execAjax("saveFormat","",true,"savedAsFmt","html"); 
	$("#btnSave").show();
}
function savedAsFmt(res){
	console.log(res);
	alertMsg("Sucessfully Saved...");
}
function saveFmt(){
	if (!griddvFormatGR.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	var isDelete = confirmMsg("기본 Label을 수정합니다. 계속 하시겠습니까?","saveFmt2");
}	
function saveFmt2(){
	tParams=eval('[{}]');
	var data=griddvFormatGR.getData();
	var gridData=JSON.stringify(data);
	tParams['gridData']=gridData;
	var formatName= datadvFormatGR[0].FMT_NAME;
	console.log("formatName : " + formatName);
	tParams['FMT_NAME']=formatName;
	tParams['COL_NAME']=curColumnName;

	execAjax("saveFormat","",true,"savedFmt","html"); 
}
function savedFmt(res){
	console.log(res);
	alertMsg("Sucessfully Saved...");
}
function addRow(){								
    var d = griddvFormatGR.getData();								
    var currentRow=d.length;								
    if(griddvFormatGR.getActiveCell()!=null) {								
        currentRow=griddvFormatGR.getActiveCell().row;								
    }								
								
    d.splice(currentRow+1, 0, {"TYPE":"C"});	
    griddvFormatGR.setData(d);								
    griddvFormatGR.render();								
    griddvFormatGR.scrollRowIntoView(currentRow+1);								
}								
function newNumericFMT(){
	$("#btnSave").hide();
	$("#trColumnName").show();
	datadvFormatGR =[{"FMT_NAME":"","FMT_LABEL":"","START":"","END":"","LABEL":"","LABELM":"","HLO":"","TYPE":"N"}];
	columnsdvFormatGR =[
								{"id":"START","name":"Start","field":"START","width":333,"cssClass":"l","resizable":true,"sortable":true,"editor":Slick.Editors.Text,"formatter":Slick.Formatters.text},
								{"id":"END","name":"End","field":"END","width":333,"cssClass":"l","resizable":true,"sortable":true,"editor":Slick.Editors.Text,"formatter":Slick.Formatters.text},
								{"id":"LABEL","name":"Label","field":"LABEL","width":1111,"cssClass":"l","resizable":true,"sortable":true,"editor":Slick.Editors.Text,"formatter":Slick.Formatters.text},
								{"id":"LABELM","name":"New Label","field":"LABELM","width":1111,"cssClass":"l","resizable":true,"sortable":true,"editor":Slick.Editors.Text,"formatter":Slick.Formatters.text},
								{"id":"HLO","name":"HLO","field":"HLO","width":111,"cssClass":"c","resizable":true,"sortable":true,"editor":Slick.Editors.Text,"formatter":Slick.Formatters.text},
								{"id":"TYPE","name":"Type","field":"TYPE","width":55,"cssClass":"l","resizable":true,"sortable":true,"formatter":""}
							];
	
	optionsdvFormatGR	={"editable":true,"enableAddRow":false,"enableCellNavigation":true,"asyncEditorLoading":false,"autoEdit":false,"enableColumnReorder":false,"multiColumnSort":true,"forceFitColumns":true};
	
	
	griddvFormatGR	= new Slick.Grid("#dvFormatGR",  datadvFormatGR, columnsdvFormatGR,  optionsdvFormatGR);
	griddvFormatGR.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: true}));
	griddvFormatGR.getCanvasNode().focus();
	griddvFormatGR.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
	griddvFormatGR.registerPlugin(new Slick.CellExternalCopyManager(pluginOptionsdvFormatGR));
}
function addAllToColName2(){
	$("#sltCOL_NAME2").prepend("<option value=''>...Select Column...</option>");
	$("#sltCOL_NAME2 option:eq(0)").attr("selected", "selected");	
}