function resize(){
	var reportBodyHeight=$("body").height();
	var winHeight = $(window).height();
	var dvCondiHeight = 112;//$("#dvCondi").height();
	console.log("$(window).height() : " + winHeight);
	console.log("$(dvCondi).height() : " + dvCondiHeight);

	console.log("report body : " + reportBodyHeight);
	var dvMainHeight=eval(winHeight-dvCondiHeight-31);
	console.log("dvHeight : " + dvMainHeight);
	$("#dvMain").height(dvMainHeight);
	console.log("dvMain height : " + $("#dvMain").height());
	//$("#grSEGAccList").height(eval($(window).height()-643));
}
$(window).resize(function () {
	resize();
});

$(window).ready(function () {
	console.log("$(window).ready:::::::::::::::::::");
	resize();	
	$(".buttonArea").append("<input type='button' id='btnRun' class=condBtnSearch value='Modify' onclick='manageSegSetList();'>");
	isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_getSegSetList(StoredProcess)","renderSegSetList");
});
var curSegSetID;
var gridGR1;
var dataGR1 = [];
var optionsGR1;
var columnsGR1;
var curRowGR1;
	
var curSegID;
var	curSegName;
var gridGR2;
var dataGR2 = [];
var optionsGR2;
var columnsGR2;
var curRowGR2;
	
var dataSegAcc = [];
var gridSegAcc;
var optionsSegAcc;
var columnsSegAcc;
var curRowSegAcc;

var curAccLevel="";		// select box에서 클릭한 level 위치

function deleteSeg(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Segment...");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete selected Segment?","deleteSegCF");
}
function deleteSegCF(){
  var dataGR2 = gridGR2.getData();
  var current_row = gridGR2.getActiveCell().row;
  console.log("gridGR2[current_row].SEG_SET_ID: " + dataGR2[current_row].SEG_SET_ID);
  var curSegSetID=dataGR2[current_row].SEG_SET_ID;
  var curSegID=dataGR2[current_row].SEG_ID;
  dataGR2.splice(current_row,1);
  var r = current_row;
  while (r<dataGR2.length){
    gridGR2.invalidateRow(r);
    r++;
  }
  gridGR2.updateRowCount();
  gridGR2.render();
  gridGR2.scrollRowIntoView(current_row-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_deleteSegRow(StoredProcess)","alertResMsg",curSegSetID,curSegID);
	
}
function deleteSegSetList(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Segment Set ID.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteSegSetListCF");
}
function deleteSegSetListCF(){
  var dataGR1 = gridGR1.getData();
  var current_row = gridGR1.getActiveCell().row;
  console.log("dataGR1[current_row].SEG_SET_ID: " + dataGR1[current_row].SEG_SET_ID);
  var curSegSetID=dataGR1[current_row].SEG_SET_ID;
  dataGR1.splice(current_row,1);
  var r = current_row;
  while (r<dataGR1.length){
    gridGR1.invalidateRow(r);
    r++;
  }
  gridGR1.updateRowCount();
  gridGR1.render();
  gridGR1.scrollRowIntoView(current_row-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_deleteSegSetRow(StoredProcess)","alertResMsg",curSegSetID);
	/*
  var isDelete = confirm("Are you sure you want to delete selected Segment?");
	if (isDelete == true) {
	} else {
	  return;
	}
	*/
}
function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
}
function saveSEGList2SAS(){
	var SegListParam = JSON.stringify(gridGR2.getData());
	console.log("SegSetListParam : " + SegListParam);
	isDisplayProgress=0;
	$sasResHTML=execSTP("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_saveSegList(StoredProcess)","","","","",SegListParam);	
	$("#dvDummy").html($sasResHTML);	

}
function saveSegSetList2SAS(){
	var SegSetListParam = JSON.stringify(gridGR1.getData());
	console.log("SegSetListParam : " + SegSetListParam);
	isDisplayProgress=0;
	$sasResHTML=execSTP("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_saveSegSetList(StoredProcess)","","","","",SegSetListParam);	
	$("#dvDummy").html($sasResHTML);	
}
function displayMsg(data){
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	$("#progressIndicatorWIP").hide(); 
	alertMsg(msg.msg);	
	//$("#dvSegName").hide();
	//closeModalWin();	
}
function saveSEGAcc2SAS(){
	$("#progressIndicatorWIP").show(); 
	var SegAccParam = JSON.stringify(gridSegAcc.getData());
	console.log("SegAccParam : " + SegAccParam);
	//$sasResHTML=execSTP("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_saveSegAcc(StoredProcess)","","","","",SegAccParam,curSegSetID,curSegID);
	isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_saveSegAcc(StoredProcess)","displayMsg",SegAccParam,curSegSetID,curSegID);
	setTimeout("submitSTP()",1000*1);

}
function cancelSEG2SAS(){
	$("#dvSegName").hide();
}
function saveSEG(){
	$("#dvSegName").css("left",eval(eval($(window).width()-$("#dvSegName").width())/2));
	$("#dvSegName").css("top",eval(eval($(window).height()-$("#dvSegName").height())/2));
	$("#dvSegName").show();
}
function deleteSegTemp(){
	console.log("curRowSegAcc: " + curRowSegAcc);
	if (curRowSegAcc == undefined){
		alertMsg("Select the Row...");
		return;
	}
	var isDelete = confirmMsg("Are you sure you want to delete?","deleteSegTempCF");
}
function deleteSegTempCF(){
  eData=[];
  var mm=0;
  for(var ii=0;ii< dataSegAcc.length; ii++){
  	console.log("mm: " + mm);
  	console.log("eData.length: " + eData.length);
  	if (ii != curRowSegAcc){
  		eData[mm]={
		  	SEG_ID: curSegID,
		  	SEG_NAME: curSegName,
		    LEVEL1:  dataSegAcc[ii].LEVEL1,
		    LEVEL2:  dataSegAcc[ii].LEVEL2,
		    LEVEL3:  dataSegAcc[ii].LEVEL3,
		    LEVEL4:  dataSegAcc[ii].LEVEL4,
		    LEVEL5:  dataSegAcc[ii].LEVEL5,
		    LEVEL6:  dataSegAcc[ii].LEVEL6,
		    LEVEL1_CD:  dataSegAcc[ii].LEVEL1_CD,
		    LEVEL2_CD:  dataSegAcc[ii].LEVEL2_CD,
		    LEVEL3_CD:  dataSegAcc[ii].LEVEL3_CD,
		    LEVEL4_CD:  dataSegAcc[ii].LEVEL4_CD,
		    LEVEL5_CD:  dataSegAcc[ii].LEVEL5_CD,
		    LEVEL6_CD:  dataSegAcc[ii].LEVEL6_CD
		  }		 
			mm++; 	
  	}
  }
   dataSegAcc=eData;
  console.log("eData.length: " + eData.length);
  console.log(" dataSegAcc.length: " +  dataSegAcc.length);
  console.log(" dataSegAcc view: " + JSON.stringify( dataSegAcc));
  gridSegAcc = new Slick.Grid("#grSEGAccList",  dataSegAcc, columnsSegAcc, optionsSegAcc);
  addEvent();
}
function addEvent(){
   gridSegAcc.onClick.subscribe(function (e) {
    var cell =  gridSegAcc.getCellFromEvent(e);
    curRowSegAcc = cell.row;
    console.log("curRowSegAcc: " + curRowSegAcc);
  });	
}
function getParamValU(sp_URI,tableName,colName,target,libStmt,param1,param2,param3,param4,param5,param6,param7){
	console.log("getParamVal Started:"+displayTime());
	//$("#progressIndicatorWIP").show(); 
	var param={
			_program	: sp_URI,
			_result     : "STREAMFRAGMENT",
			libStmt		: libStmt,
			tableName	: tableName,
			colName		: colName,
			target		: target,
			param1		: param1,
			param2		: param2,
			param3		: param3,
			param4		: param4,
			param5		: param5,
			winW			: winW,
			level1		: $("#sltLevel1 option:selected").val(),
			level2		: $("#sltLevel2 option:selected").val(),
			level3		: $("#sltLevel3 option:selected").val(),
			level4		: $("#sltLevel4 option:selected").val(),
			level5		: $("#sltLevel5 option:selected").val()
	}

	$.ajax({
		url: "/SASStoredProcess/do?",
		data: param,
		dataType: 'html',
		cache:false,
		async: true,
		beforeSend: function() {
			isRun=1;
			//$("#progressIndicatorWIP").show();
		},
		complete : function(data){		
			$("#dvDummy").html(data.responseText);
			tObjName='slt'+target;
			if (param7 == "false" ){
				$("#"+tObjName).prepend("<option value=''>전체</option>");
			} else {
				try {
					chgFn="onChange_"+target+"()";
					chgFnName="onChange_"+target;
					console.log("chgFnName : " + chgFnName);
					eval(chgFn);
				} catch(err) {
				}
			}
			console.log("param6 : " + param6);
			if (param6 != ""){
				tObjName='slt'+target;
				$("#"+tObjName).val(param6.trim()).prop("selected", true);
				try {
					chgFn="onChange_"+target+"()";
					chgFnName="onChange_"+target;
					console.log("chgFnName2 : " + chgFnName);
					eval(chgFn);
				} catch(err) {
				}
			} else {
				$("#" + tObjName + " option:eq(0)").prop("selected", true);
			}
			//$("#progressIndicatorWIP").hide();
			isRun=0;
			console.log("getParamVal \n" + JSON.stringify(data));
      },
	});
}
var rowid=0;
function addAcc2Seg(){
	console.log("curAccLevel: " + curAccLevel);	
	console.log(" dataSegAcc.length: " +  dataSegAcc.length);
	//var rowid= dataSegAcc.length;
	var maxSelectSize=$("#sltLevel" + curAccLevel + " option:selected").size();
	console.log("maxSize: " + maxSelectSize);
	var lvl1=$("#sltLevel1 option:selected").text();
	var lvl2=$("#sltLevel2 option:selected").text();
	var lvl3=$("#sltLevel3 option:selected").text();
	var lvl4=$("#sltLevel4 option:selected").text();
	var lvl5=$("#sltLevel5 option:selected").text();
	var lvl6=$("#sltLevel6 option:selected").text();
	var lvl1_cd=$("#sltLevel1 option:selected").val();
	var lvl2_cd=$("#sltLevel2 option:selected").val();
	var lvl3_cd=$("#sltLevel3 option:selected").val();
	var lvl4_cd=$("#sltLevel4 option:selected").val();
	var lvl5_cd=$("#sltLevel5 option:selected").val();
	var lvl6_cd=$("#sltLevel6 option:selected").val();

	var SltdText = [];
	var SltdVal = [];
	rowid= dataSegAcc.length;
	$("#sltLevel" + curAccLevel + " :selected").each(function(i, selected){ 
	  SltdText[i] = $(selected).text(); 
	  SltdVal[i] = $(selected).val(); 
	  console.log("rowid: " + rowid);
	  var segid = curSegID;	//"SEGID_" + eval(rowid+1);
	  if (curAccLevel==1){
		   dataSegAcc[rowid] = {
		  	SEG_ID: segid,
		  	SEG_NAME: curSegName,
		    LEVEL1: $(selected).text(),
		    LEVEL2: lvl2,
		    LEVEL3: lvl3,
		    LEVEL4: lvl4,
		    LEVEL5: lvl5,
		    LEVEL6: lvl6,
		    LEVEL1_CD: $(selected).val(),
		    LEVEL2_CD: lvl2_cd,
		    LEVEL3_CD: lvl3_cd,
		    LEVEL4_CD: lvl4_cd,
		    LEVEL5_CD: lvl5_cd,
		    LEVEL6_CD: lvl6_cd
		  }		  	
	  } 
	  if (curAccLevel==2){
		   dataSegAcc[rowid] = {
		  	SEG_ID: segid,
		  	SEG_NAME: curSegName,
		    LEVEL1: lvl1,
		    LEVEL2: $(selected).text(),
		    LEVEL3: lvl3,
		    LEVEL4: lvl4,
		    LEVEL5: lvl5,
		    LEVEL6: lvl6,
		    LEVEL1_CD: lvl1_cd,
		    LEVEL2_CD: $(selected).val(),
		    LEVEL3_CD: lvl3_cd,
		    LEVEL4_CD: lvl4_cd,
		    LEVEL5_CD: lvl5_cd,
		    LEVEL6_CD: lvl6_cd
		  }		  	
	  } 
	  if (curAccLevel==3){
		   dataSegAcc[rowid] = {
		  	SEG_ID: segid,
		  	SEG_NAME: curSegName,
		    LEVEL1: lvl1,
		    LEVEL2: lvl2,
		    LEVEL3: $(selected).text(),
		    LEVEL4: lvl4,
		    LEVEL5: lvl5,
		    LEVEL6: lvl6,
		    LEVEL1_CD: lvl1_cd,
		    LEVEL2_CD: lvl2_cd,
		    LEVEL3_CD: $(selected).val(),
		    LEVEL4_CD: lvl4_cd,
		    LEVEL5_CD: lvl5_cd,
		    LEVEL6_CD: lvl6_cd
		  }		  	
	  } 
	  if (curAccLevel==4){
		   dataSegAcc[rowid] = {
		  	SEG_ID: segid,
		  	SEG_NAME: curSegName,
		    LEVEL1: lvl1,
		    LEVEL2: lvl2,
		    LEVEL3: lvl3,
		    LEVEL4: $(selected).text(),
		    LEVEL5: lvl5,
		    LEVEL6: lvl6,
		    LEVEL1_CD: lvl1_cd,
		    LEVEL2_CD: lvl2_cd,
		    LEVEL3_CD: lvl3_cd,
		    LEVEL4_CD: $(selected).val(),
		    LEVEL5_CD: lvl5_cd,
		    LEVEL6_CD: lvl6_cd
		  }		  	
	  } 
	  if (curAccLevel==5){
		   dataSegAcc[rowid] = {
		  	SEG_ID: segid,
		  	SEG_NAME: curSegName,
		    LEVEL1: lvl1,
		    LEVEL2: lvl2,
		    LEVEL3: lvl3,
		    LEVEL4: lvl4,
		    LEVEL5: $(selected).text(),
		    LEVEL6: lvl6,
		    LEVEL1_CD: lvl1_cd,
		    LEVEL2_CD: lvl2_cd,
		    LEVEL3_CD: lvl3_cd,
		    LEVEL4_CD: lvl4_cd,
		    LEVEL5_CD: $(selected).val(),
		    LEVEL6_CD: lvl6_cd
		  }		  	
	  } 
	  if (curAccLevel==6){
		   dataSegAcc[rowid] = {
		  	SEG_ID: segid,
		  	SEG_NAME: curSegName,
		    LEVEL1: lvl1,
		    LEVEL2: lvl2,
		    LEVEL3: lvl3,
		    LEVEL4: lvl4,
		    LEVEL5: lvl5,
		    LEVEL6: $(selected).text(),
		    LEVEL1_CD: lvl1_cd,
		    LEVEL2_CD: lvl2_cd,
		    LEVEL3_CD: lvl3_cd,
		    LEVEL4_CD: lvl4_cd,
		    LEVEL5_CD: lvl5_cd,
		    LEVEL6_CD: $(selected).val()
		  }		  	
	  } 
		rowid++;
	})
	gridSegAcc = new Slick.Grid("#grSEGAccList",  dataSegAcc, columnsSegAcc,  optionsSegAcc);
	addEvent();
	// gridSegAcc.setSelectionModel(new Slick.CellSelectionModel());
	console.log("getParamVal \n" + JSON.stringify( dataSegAcc));
}
function initSEGListGrid(){
	//#grSEGList
	rowid=0;
  columnsSegAcc = [
    {id: "Level1", name: "Level 1", field: "Level1",width:160},
    {id: "Level2", name: "Level 2", field: "Level2",width:160},
    {id: "Level3", name: "Level 3", field: "Level3",width:160},
    {id: "Level4", name: "Level 4", field: "Level4",width:160},
    {id: "Level5", name: "Level 5", field: "Level5",width:160},
    {id: "Level6", name: "Level 6", field: "Level6",width:160}
  ];

	optionsSegAcc = {
		enableCellNavigation: true,
		enableColumnReorder: false
	};
	dataSegAcc=[];
	gridSegAcc = new Slick.Grid("#grSEGAccList",  dataSegAcc, columnsSegAcc,  optionsSegAcc);
	addEvent();
	console.log(" dataSegAcc: " +  dataSegAcc.toString());
}	
function displaySegList(data){
	var sasJsonRes=eval(data)[0];
	
	columnsGR2 =[];
	columnsGR2=sasJsonRes["ColumInfo"];
	var  optionsGR2=sasJsonRes["Options"][0];
	dataGR2 = sasJsonRes["SASResult"];
	gridGR2 = new Slick.Grid("#grSEGList", dataGR2, columnsGR2,  optionsGR2);
	gridGR2.setSelectionModel(new Slick.RowSelectionModel());
  gridGR2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	var columnpicker = new Slick.Controls.ColumnPicker(columnsGR2, gridGR2, optionsGR2); 
	gridGR2.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	
  gridGR2.onClick.subscribe(function (e) {
	  console.log("gridGR2.onClick:");
    var cell = gridGR2.getCellFromEvent(e);
    curRowGR2 = cell.row;
    console.log("curRowGR2: " + curRowGR2);
    console.log("JSON.stringify(dataGR2): " + JSON.stringify(dataGR2));
    console.log("dataGR2.length: " + dataGR2.length);
    if ( dataGR2.length > curRowGR2){			//curRowGR1
	  	curSegSetID = dataGR2[cell.row].SEG_SET_ID;
	  	curSegID = dataGR2[cell.row].SEG_ID;
	  	curSegName = dataGR2[cell.row].SEG_NAME;
	  	var SEG_DESC = dataGR2[cell.row].SEG_DESC;
	  	var RPRC_ACC_YN = dataGR2[cell.row].RPRC_ACC_YN;
	  	var CORE_AMT_YN = dataGR2[cell.row].CORE_AMT_YN;
	  	var RGRD_MTRT_YN = dataGR2[cell.row].RGRD_MTRT_YN;
	  	var USE_YN = dataGR2[cell.row].USE_YN;
	    isDisplayProgress=0;
    	editSEGList();
  		console.log("gridGR2.onClick : " + curSegSetID+":"+curSegID+":"+curSegName+":"+SEG_DESC+":"+USE_YN); 
	    isDisplayProgress=0;
  	}
  });	  
  gridGR2.onDblClick.subscribe(function (e) {
  	console.log("gridGR2.onDblClick");
    var cell = gridGR2.getCellFromEvent(e);
    var curRow = cell.row;
    console.log("gridGR2.onDblClick curRow : " + curRow);
	  //saveGR2Row();
  });	    
  gridGR2.onCellChange.subscribe(function (e) {
	  console.log("gridGR2.onCellChange:");
    var cell = gridGR2.getCellFromEvent(e);
  	console.log("onCellChange JSON.stringify(cell): " + JSON.stringify(cell)); 
		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataGR2[curRowGR1].UPDATE_DT=d.yyyymmdd();
	  gridGR2.invalidate();
	  gridGR2.render();
  });	  
	gridGR2.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridGR2.invalidateRow(dataGR2.length);
	  var segSetID=eval("("+'{"SEG_SET_ID":"' + curSegSetID + '"' + '}'+")");
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.SEG_LIST","SEG_ID",curSegSetID);
	  var segID=eval("("+'{"SEG_ID":"SEG_' + resData.toString().trim() + '"' + '}'+")");
	  var RPRC_ACC_YN=eval("("+'{"RPRC_ACC_YN":"1"' + '}'+")");
	  var CORE_AMT_YN=eval("("+'{"CORE_AMT_YN":"1"' + '}'+")");
	  var RGRD_MTRT=eval("("+'{"RGRD_MTRT_YN":"1"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
		d = new Date();		  
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({}, segSetID,segID, item,RPRC_ACC_YN,CORE_AMT_YN,RGRD_MTRT,useYN,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR2.push(item);
	  gridGR2.updateRowCount();
	  gridGR2.render();	
	})	  
}
function displaySegAccList(data){
	var sasJsonRes=eval(data)[0];
	dataSegAcc		=[];
	columnsSegAcc =[];
	columnsSegAcc=sasJsonRes["ColumInfo"];
	var  optionsSegAcc=sasJsonRes["Options"][0];
	dataSegAcc = sasJsonRes["SASResult"];
	gridSegAcc = new Slick.Grid("#grSEGAccList",  dataSegAcc, columnsSegAcc,  optionsSegAcc);
	addEvent();
}
function getSegAccList(){
	console.log("curSegSetID : " + curSegSetID);
	console.log("curSegID : " + curSegID);
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_getSegAccList(StoredProcess)","displaySegAccList",curSegSetID,curSegID);
	$("#progressIndicatorWIP").hide();
}
function editSEGList(){
	/*
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-20)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height())/2));	
	*/
	$("#dvModalWin").show();
	getSegAccList();
	initSEGListGrid();
}
function closeModalWin(){
	$("#dvModalWin").hide();
}

function requiredFieldValidator(value) {
	if (value == null || value == undefined || !value.length) {
	  return {valid: false, msg: "This is a required field"};
	} else {
	  return {valid: true, msg: null};
	}
}
function onClick_Level1(){curAccLevel=1;}
function onClick_Level2(){curAccLevel=2;}
function onClick_Level3(){curAccLevel=3;}
function onClick_Level4(){curAccLevel=4;}
function onClick_Level5(){curAccLevel=5;}
function onClick_Level6(){curAccLevel=6;}
function get_Level1(){
	getParamValU("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.ACCOUNT","LV1_CD","Level1","libname+ALMConf+list%3B","","","LV1","","false","","false");
}
function get_Level2(){
	getParamValU("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.ACCOUNT","LV2_CD","Level2","libname+ALMConf+list%3B","LV1_CD=Level1:","","LV2","","false","","false");
}
function get_Level3(){
	getParamValU("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.ACCOUNT","LV3_CD","Level3","libname+ALMConf+list%3B","LV2_CD=Level2:","","LV3","","false","","false");
}
function get_Level4(){
	getParamValU("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.ACCOUNT","LV4_CD","Level4","libname+ALMConf+list%3B","LV1_CD=Level1:LV2_CD=Level2:LV3_CD=Level3:","","LV4","","false","","false");
}
function get_Level5(){
	getParamValU("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.ACCOUNT","LV5_CD","Level5","libname+ALMConf+list%3B","LV1_CD=Level1:LV2_CD=Level2:LV3_CD=Level3:LV4_CD=Level4:","","LV5","","false","","false");
}
function get_Level6(){
	getParamValU("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.ACCOUNT","LV6_CD","Level6","libname+ALMConf+list%3B","LV1_CD=Level1:LV2_CD=Level2:LV3_CD=Level3:LV4_CD=Level4:LV5_CD=Level5:","","LV6","","false","","false");
}
function onChange_Level1(){
	get_Level2();
	get_Level3();
	get_Level4();
	get_Level5();
	get_Level6();
}
function onChange_Level2(){
	get_Level3();
	get_Level4();
	get_Level5();
	get_Level6();
}
function onChange_Level3(){
	get_Level4();
	get_Level5();
	get_Level6();
}
function onChange_Level4(){
	get_Level5();
	get_Level6();
}
function onChange_Level5(){
	get_Level6();
}
	get_Level1();

$("body").css("margin","0px 0px 0px 0px");
function renderSegSetList(data){
	$("#grSEGSetList").show();
	$("#progressIndicatorWIP").hide();
	
	var sasJsonRes=eval(data)[0];
	
	columnsGR1=sasJsonRes["ColumInfo"];
	var optionsGR1=sasJsonRes["Options"][0];

	dataGR1 = sasJsonRes["SASResult"];
	console.log("options \n" + JSON.stringify(optionsGR1));
	gridGR1 = new Slick.Grid("#grSEGSetList", dataGR1, columnsGR1, optionsGR1);
	gridGR1.setSelectionModel(new Slick.CellSelectionModel());
	
	gridGR1.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataGR1.sort(function (dataRow1, dataRow2) {
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
	  gridGR1.invalidate();
	  gridGR1.render();
	});
  gridGR1.onClick.subscribe(function (e) {
    var cell = gridGR1.getCellFromEvent(e);
    curRowGR1 = cell.row;
    console.log("gridGR1 onClick curRowGR1 : " + curRowGR1);
    if ( dataGR1.length > curRowGR1){
  	}
  });	
  gridGR1.onDblClick.subscribe(function (e) {
    var cell = gridGR1.getCellFromEvent(e);
    curRowGR1 = cell.row;
    console.log("gridGR1 onDblClick curRowGR1 : " + curRowGR1 + " dataGR1 length: " + dataGR1.length );
    if ( dataGR1.length > curRowGR1){
    	//saveGR1Row();
  	}
  });	
  gridGR1.onCellChange.subscribe(function (e) {
  	curSegSetID = dataGR1[curRowGR1].SEG_SET_ID;
  	var SEG_SET_NAME = dataGR1[curRowGR1].SEG_SET_NAME;
  	var SEG_SET_DESC = dataGR1[curRowGR1].SEG_SET_DESC;
  	var USE_YN = dataGR1[curRowGR1].USE_YN;
    isDisplayProgress=0;
  	//execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_saveSegSetRow(StoredProcess)","alertResMsg",curSegSetID,SEG_SET_NAME,SEG_SET_DESC,USE_YN);
		d = new Date();		  
	  console.log("updateDT:" + d.yyyymmdd());
    dataGR1[curRowGR1].UPDATE_DT=d.yyyymmdd();
	  gridGR1.invalidate();
	  gridGR1.render();
  });	  
	gridGR1.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  console.log("item : " + item);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  console.log("JSON.stringify(dataGR1) : " + JSON.stringify(dataGR1));
	  console.log("Before  invalidateRow: " + dataGR1.length);
	  gridGR1.invalidateRow(dataGR1.length);
	  console.log("After  invalidateRow : " + dataGR1.length);
	  console.log("JSON.stringify(dataGR1) : " + JSON.stringify(dataGR1));
	  //console.log("dataGR1[curRowGR1].SEG_SET_ID : " + dataGR1[curRowGR1].SEG_SET_ID);		// 공백에서 시작했으므로 id 칼럼 자체가 존재하지 않음.
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.SEG_SETLIST","SEG_SET_ID");
	  var id=eval("("+'{"SEG_SET_ID":"CS_' + resData.toString().trim() + '"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
	  var segDesc=eval("("+'{"SEG_SET_DESC":""' + '}'+")");
		d = new Date();		  
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({}, id, item,segDesc,useYN,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  /*
	  if ( dataGR1[curRowGR1].SEG_SET_ID == "undefined") {
	  	console.log("undefined");
	  	dataGR1[curRowGR1].SEG_SET_ID = "CS001";
	  }
	  */
	  gridGR1.render();
	});

    $("#dvMngSegSetList").hide();
}
function manageSegSetList(){
	$("#dvMngSegSetList").css("left",eval(eval($(window).width()-$("#dvMngSegSetList").width()-40)/2));
	$("#dvMngSegSetList").css("top",eval(eval($(window).height()-$("#dvMngSegSetList").height()-60)/2));	
	$("#dvMngSegSetList").show();
}
function saveGR2Row(){
	if (gridGR2.getActiveCell() == null){
		alertMsg("Select the Segment...");
		return;
	}
	if (!gridGR2.getEditorLock().commitCurrentEdit()) {
		return;
	}	
  var curRow = gridGR2.getActiveCell().row;
  
	curSegID = dataGR2[curRow].SEG_ID;
	curSegName = dataGR2[curRow].SEG_NAME;
	var SEG_DESC = dataGR2[curRow].SEG_DESC;
	var RPRC_ACC_YN = dataGR2[curRow].RPRC_ACC_YN;
	var CORE_AMT_YN = dataGR2[curRow].CORE_AMT_YN;
	var RGRD_MTRT_YN = dataGR2[curRow].RGRD_MTRT_YN;
	var USE_YN = dataGR2[curRow].USE_YN;
  isDisplayProgress=0;
	console.log("gridGR2.onDblClick : " + curSegSetID+":"+curSegID+":"+curSegName+":"+SEG_DESC+":"+USE_YN); 
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_saveSegRow(StoredProcess)","alertResMsg",curSegSetID,curSegID,curSegName,SEG_DESC,USE_YN,CORE_AMT_YN,RGRD_MTRT_YN,RPRC_ACC_YN);

}
function saveGR1Row(){
	console.log("saveGR1Row start");
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Segment Set...");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow(dataGR1.length);
  var curRow = gridGR1.getActiveCell().row;

	curSegSetID = dataGR1[curRow].SEG_SET_ID;
	var SEG_SET_NAME = dataGR1[curRow].SEG_SET_NAME;
	var SEG_SET_DESC = dataGR1[curRow].SEG_SET_DESC;
	var USE_YN = dataGR1[curRow].USE_YN;
	console.log("gridGR1.onClick: " + curSegSetID +":"+ SEG_SET_NAME +":"+ SEG_SET_DESC +":"+ USE_YN);
	dataSegAcc = [];
	if (typeof columnsSegAcc != "undefined") {
		gridSegAcc = new Slick.Grid("#grSEGAccList",  dataSegAcc, columnsSegAcc,  optionsSegAcc);
	}	
  curSegSetID = dataGR1[curRow].SEG_SET_ID;
	isDisplayProgress=0;
	get_seg_set_id();
	isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_saveSegSetRow(StoredProcess)","alertResMsg",curSegSetID,SEG_SET_NAME,SEG_SET_DESC,USE_YN);
}
function copySegSetList(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Segment Set ID.");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow(dataGR1.length);
  var curRow = gridGR1.getActiveCell().row;
  
	console.log("" + dataGR1[curRow].SEG_SET_ID);
	var SEG_SET_ID=dataGR1[curRow].SEG_SET_ID;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/seg003_copySegSet(StoredProcess)","renderSegSetList",SEG_SET_ID);		
	alertMsg("Successfully Copied.");		
	
}