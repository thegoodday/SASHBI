$(document).ready(function () {
	$("#dvMain").height(eval($(window).height()-58));
	$("#dvColumnAttr").height(eval($(window).height()-449));
	$("#dvMain").height(eval($(window).height()-58));
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/attr002_getAttrSetList(StoredProcess)","initGridAttrSetList");			
});
$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-58));
	$("#dvColumnAttr").height(eval($(window).height()-449));
});

var curAttrSetListID;
var gridGR1;
var dataGR1 = [];
var optionsGR1;
var columnsGR1;
var curRowAttrSetList;
	
var columnAttrObj;
	
function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
}
function deleteAttrList(){
  var dataGR1 = gridGR1.getData();
  console.log("current_row : " +  gridGR1.getActiveCell());
  if ( gridGR1.getActiveCell() == null) {
  	alertMsg("Select Attribute Set ID you want to delete.");
  	return;
  }
  var isDelete = false;
  isDelete = confirmMsg("Are you sure you want to delete?","deleteAttrListCF");
}  
function deleteAttrListCF(){
  var current_row = gridGR1.getActiveCell().row;
  console.log("gridGR1[current_row].ATTR_SET_ID: " + dataGR1[current_row].ATTR_SET_ID);
  var curAttrSetListID=dataGR1[current_row].ATTR_SET_ID;
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
  
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/attr002_deleteAttrSetRow(StoredProcess)","alertResMsg",curAttrSetListID);
}
function setColumnAttr(data){
	sltdcolumnAttr = eval("("+JSON.stringify(data)+")");
	isTest = JSON.stringify(data);
	console.log("sltdcolumnAttr: " + isTest.length);
	if (isTest.length < 21) sltdcolumnAttr=columnAttrObj;
	console.log("sltdcolumnAttr: " + JSON.stringify(sltdcolumnAttr));
	for ( var colname in columnAttrObj) {
		var colAttrs = eval("columnAttrObj." + colname);
		for ( var ii=0; ii < colAttrs.length ; ii++){
			var itemValue = eval("colAttrs[" + ii + "].VALUE");
			$("#slt" + colname + " option[value='" + itemValue + "']").prop("selected", false);
		}
	}	
	for ( var colname in sltdcolumnAttr) {
		//console.log("ColName: " + colname);
		var colAttrs = eval("sltdcolumnAttr." + colname);
		for ( var ii=0; ii < colAttrs.length ; ii++){
			var itemValue = eval("colAttrs[" + ii + "].VALUE");
			//console.log("\titem: " + itemValue );
			if (isTest.length > 20) {
				$("#slt" + colname + " option[value='']").prop("selected", false);
				$("#slt" + colname + " option[value='" + itemValue + "']").prop("selected", true);
			} else {
				$("#slt" + colname + " option[value='" + itemValue + "']").prop("selected", false);
				$("#slt" + colname + " option[value='']").prop("selected", true);
			}
		}
	}	
}
function initGridAttrSetList(data){
	$("#progressIndicatorWIP").hide();
	var sasJsonRes=eval(data)[0];
	dataGR1		=[];
	columnsGR1 =[];
	columnsGR1=sasJsonRes["ColumInfo"];
	var  optionsGR1=sasJsonRes["Options"][0];
	dataGR1 = sasJsonRes["SASResult"];
	gridGR1 = new Slick.Grid("#dvColumnAttrSet",  dataGR1, columnsGR1,  optionsGR1);
	gridGR1.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	
  gridGR1.onClick.subscribe(function (e) {
    var cell = gridGR1.getCellFromEvent(e);
    curRowAttrSetList = cell.row;
    if ( dataGR1.length > curRowAttrSetList){
    	curAttrSetListID = dataGR1[cell.row].ATTR_SET_ID;
    	console.log("onClick curAttrSetListID : " + curAttrSetListID);
			execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/attr002_getSavedAttrSetList(StoredProcess)","setColumnAttr",curAttrSetListID);			
  	}
  });	
  gridGR1.onDblClick.subscribe(function (e) {
  	/*
    var cell = gridGR1.getCellFromEvent(e);
    curRowAttrSetList = cell.row;
    console.log("gridGR1 onDblClick curRowAttrSetList : " + curRowAttrSetList + " dataGR1 length: " + dataGR1.length );
    if ( dataGR1.length > curRowAttrSetList){
			//saveGR1Row();
  	}
  	*/
  });	  
  gridGR1.onCellChange.subscribe(function (e) {

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
	  isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.ATTR_SET_LIST","ATTR_SET_ID");
		isDisplayProgress=1;
		console.log("ATTR_SET_ID resData: " + resData);
	  var id=eval("("+'{"ATTR_SET_ID":"ATTR_' + resData.toString().trim() + '"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":0' + '}'+")");
		d = new Date();		  
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");
	  
    item = $.extend({}, id, item,useYN,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  gridGR1.render();    	
	  console.log("JSON.stringify(dataGR1) : " + JSON.stringify(dataGR1));
	});
}
function saveAttrList(){
	console.log("curAttrSetListID : " + curAttrSetListID);
	if (curAttrSetListID == undefined ){
		alertMsg("Select the Attribute Set ID...");
		return;
	}
	sp_URI="SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/attr002_saveAttrList(StoredProcess)";
	fn="initGridAttrSetList";
	var param={
			_program	: sp_URI,
			_result   : "STREAMFRAGMENT",
			ATTR_SET_ID	: curAttrSetListID,
			winW			: winW
	}
	for ( var colname in columnAttrObj) {
		//console.log("ColName: " + colname);
		var colAttrs = eval("columnAttrObj." + colname);

		var mVarNM=colname;
		var multi=$("#slt" + colname).val() || [];
		var mCount=multi.length;
		param[mVarNM+0]=mCount;
		for (var i = 0; i < multi.length; i++){
			pName=mVarNM+eval(i+1);
			param[pName]=multi[i];
		}
	}	
	
	if (nstp_sessionid.length > 10) {
		param["_sessionid"] = nstp_sessionid;
	}

	$.ajax({
		url: "/SASStoredProcess/do?",
		type: "post",
		data: param,
		dataType: 'json',
		async: true,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show();
		},
		success : function(data){
			console.log("execSTPA success \n" + JSON.stringify(data));
			window[fn](data);
		},
		complete: function(data){
			//data.responseText;	
			isRun=0;
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alertMsg(error);
		}
	});	
}
/*
*/
function renderGR2(data){
	$("#progressIndicatorWIP").hide();
	//console.log("data.length:" + Object.keys(data).length);
	//console.log("data :" + data);
	//columnAttrObj = eval("("+JSON.stringify(data)+")");
	columnAttrObj = eval("("+data+")");
	console.log("columnAttrObj");
	console.log(columnAttrObj);
	var htmlText="";
	for ( var colname in columnAttrObj) {
		//console.log("ColName: " + colname);
		var colAttrs = eval("columnAttrObj." + colname);
		for ( var ii=0; ii < colAttrs.length ; ii++){
			if ( ii == 0) {
				var colLabel=eval("colAttrs[" + ii + "].LABEL");
				//console.log("ColLabel: " + colLabel);
				
				htmlText+="";
				htmlText+="<span class='titleimg condItem' style='border:0px solid #ffddff;'>";
				htmlText+="	<table style='border:1px solid #dddddd;width:210px;' cellspacing=0 cellpadding=0>";
				htmlText+="		<tr>";
				htmlText+="			<td style='padding:0px 0px 0px 9px;width:18px;' valign='top'>";
				htmlText+="				<img src='/SASHBI/images/down_arrow_gray.png' width='18px' border=0></td>";
				htmlText+="     <td valign='bottom'>" + colLabel + "</td>";
				htmlText+="		</tr>";
				htmlText+="		<tr>";
				htmlText+="			<td class=condData colspan=2>";
				htmlText+="			<select id=slt" + colname + " name=" + colname + " size=5 multiple style='border:1px solid #FFE6DD;width:210px;overflow-y:auto;border-radius:0.7em;' onChange=''>";
				htmlText+="				<option value=''>선택 안함</option>";
				htmlText+="				<option value='_ALL_'>전체</option>";
			}
			var itemValue = eval("colAttrs[" + ii + "].VALUE");
			var itemDisplay = eval("colAttrs[" + ii + "].DISPLAY");
			//console.log("\titem: " + itemValue + ":" + itemDisplay);

			htmlText+="				<option value='" + itemValue + "'>" + itemDisplay + " </option>";
			
		}
		htmlText+="			</select>";
		htmlText+="			</td>";
		htmlText+="		</tr>";
		htmlText+="	</table>";
		htmlText+="</span>";
	}
	$("#dvColumnAttr").html(htmlText);
}
function resetSelect(obj){
	//var value=$("#"+obj).val();
	$("#"+obj + " > option").attr("selected",0);
}
function saveGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Attribute Set...");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
  var curRow = gridGR1.getActiveCell().row;
  
  var ATTR_SET_ID = gridGR1.getDataItem(curRow).ATTR_SET_ID;
  var ATTR_SET_NAME = gridGR1.getDataItem(curRow).ATTR_SET_NAME;
  var ATTR_SET_DESC = gridGR1.getDataItem(curRow).ATTR_SET_DESC;
  var USE_YN = gridGR1.getDataItem(curRow).USE_YN;
  console.log("ATTR_SET_DESC : " + ATTR_SET_DESC);
  if (ATTR_SET_NAME == undefined) ATTR_SET_NAME="";
  if (ATTR_SET_DESC == undefined) ATTR_SET_DESC="";
  console.log("gridAttrColumns onClick curAttrSetListID : " + curRow + ":"+ATTR_SET_ID+":"+ATTR_SET_NAME+":"+ATTR_SET_DESC+":"+USE_YN);
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/attr002_saveAttrSetRow(StoredProcess)","alertResMsg",ATTR_SET_ID,ATTR_SET_NAME,ATTR_SET_DESC,USE_YN);
	Date.prototype.yyyymmdd = function() {
		var yyyy = this.getFullYear().toString();
		var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
		var dd  = this.getDate().toString();
		return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
	};
	d = new Date();		  
  console.log("updateDT:" + d.yyyymmdd());
  dataGR1[curRow].UPDATE_DT=d.yyyymmdd();
  gridGR1.invalidate();
  gridGR1.render();
}