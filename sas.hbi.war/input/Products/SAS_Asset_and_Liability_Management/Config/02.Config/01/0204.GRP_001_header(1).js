$(document).ready(function () {
	$("#dvMain").height(eval($(window).height()-178));
	$(".buttonArea").append("<input type='button' id='btnRun' class=condBtnSearch value='Modify' onclick='manageGRPSetList();'>");
	//$("#dvModalGRPSetList").hide();
	//$("#dvMain").height(eval($(window).height()-58));
	//$("#dvGRPSetList").height(eval($(window).height()-508));
	//$("#dvGRPSet").height(eval($(window).height()-568));
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_getSegSetList(StoredProcess)","initSegListContextMenu","","");
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_getGroupSetList(StoredProcess)","initGridGRPSetList");
	isDisplayProgress = 1;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_getColumnAttr(StoredProcess)","initAttrSetListSelect");
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_getAttrSetList(StoredProcess)","initGridAttrSetList");
});
$(window).resize(function () {
	$("#dvMain").height(eval($(window).height()-158));
	//$("#dvColumnAttr").height(eval($(window).height()-358));
});
var contextMenuList;
var curSegSetID;

var curSegID;
var curSegName;
var gridGR2;
var dataGR2 = [];
var optionsGR2;
var columnsGR2;
var curRowSegList;

var columnAttrObj;

var curGRPSetID;
var gridGR4;
var dataGR4 = [];
var optionsGR4;
var columnsGR4;
var curRowGRPSet;

var curGRPSetListID;
var gridGR1;
var dataGR1 = [];
var optionsGR1;
var columnsGR1;
var curRowGRPSetList;

var curAttrSetListID;
var gridGR3;
var dataGR3 = [];
var optionsGR3;
var columnsGR3;
var curRowAttrSetList;

function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
}
function initGridSegList(data){
	var sasJsonRes=eval(data)[0];
	dataGR2		=[];
	columnsGR2 =[];
	columnsGR2=sasJsonRes["ColumInfo"];
	var  optionsGR2=sasJsonRes["Options"][0];
	dataGR2 = sasJsonRes["SASResult"];
	gridGR2 = new Slick.Grid("#dvSegList",  dataGR2, columnsGR2,  optionsGR2);
	gridGR2.onMouseLeave.subscribe(function(e, args) {
		$("#dvTooltip").html("");
		$("#dvTooltip").hide();
	});
	gridGR2.onMouseEnter.subscribe(function(e, args) {
    var cell = args.grid.getCellFromEvent(e);
		var SEG_DESC 	= dataGR2[cell.row].SEG_DESC;
		tooltip(e,SEG_DESC);
	});
	gridGR2.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataGR2.sort(function (dataRow1, dataRow2) {
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
	  gridGR2.invalidate();
	  gridGR2.render();
	});
  gridGR2.onClick.subscribe(function (e) {
    var cell = gridGR2.getCellFromEvent(e);
    curRowSegList = cell.row;
    if ( dataGR2.length > curRowSegList){
    	curSegID = dataGR2[cell.row].SEG_ID;
    	curSegName = dataGR2[cell.row].SEG_NAME;
    	console.log("onClick curSegID : " + curSegID);
    	console.log("onClick curSegName : " + curSegName);
  	}
  });
}
function initAttrSetListSelect(data){
	columnAttrObj = eval("("+JSON.stringify(data)+")");
	var htmlText="";
	for ( var colname in columnAttrObj) {
		console.log("ColName: " + colname);
		var colAttrs = eval("columnAttrObj." + colname);
		for ( var ii=0; ii < colAttrs.length ; ii++){
			if ( ii == 0) {
				var colLabel=eval("colAttrs[" + ii + "].LABEL");
				console.log("ColLabel: " + colLabel);

				htmlText+="";
				htmlText+="<span class='titleimg condItem' style='border:0px solid #ffddff;'>";
				htmlText+="	<table style='border:0px solid #dddddd;width:210px;'>";
				htmlText+="		<tr>";
				htmlText+="			<td >" + colLabel + "</td>";
				htmlText+="		</tr>";
				htmlText+="		<tr>";
				htmlText+="			<td class=condData>";
				htmlText+="			<select id=slt" + colname + " name=" + colname + " size=7 multiple style='border:1px solid #FFE6DD;width:210px;overflow-y:auto;border-radius:0.7em;' onChange='fnAttrSetFilter()'>";
				htmlText+="				<option value=''>ÀüÃ¼</option>";
			}
			var itemValue = eval("colAttrs[" + ii + "].VALUE");
			var itemDisplay = eval("colAttrs[" + ii + "].DISPLAY");
			console.log("\titem: " + itemValue + ":" + itemDisplay);

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

function initGridAttrSetList(data){
	console.log("initGridAttrSetList");
	var sasJsonRes=eval(data)[0];
	dataGR3		=[];
	columnsGR3 =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	columnsGR3.push(checkboxSelector.getColumnDefinition());
	console.log("JSON.stringify(columnsGR3) 1 :" + JSON.stringify(columnsGR3));
	columnsGR3=$.extend(sasJsonRes["ColumInfo"],columnsGR3);;
	console.log("JSON.stringify(columnsGR3) 2 :" + JSON.stringify(columnsGR3));
	columnsGR3=sasJsonRes["ColumInfo"];
	var  optionsGR3=sasJsonRes["Options"][0];
	dataGR3 = sasJsonRes["SASResult"];
	gridGR3 = new Slick.Grid("#dvAttrSet",  dataGR3, columnsGR3,  optionsGR3);
	console.log("columnsGR3");
	console.log(columnsGR3);
	console.log("optionsGR3");
	console.log(optionsGR3);
	gridGR3.setSelectionModel(new Slick.RowSelectionModel());
  gridGR3.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

  gridGR3.registerPlugin(checkboxSelector);
	var columnpicker = new Slick.Controls.ColumnPicker(columnsGR3, gridGR3, optionsGR3);

	gridGR3.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGR3.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataGR3.sort(function (dataRow1, dataRow2) {
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
	  gridGR3.invalidate();
	  gridGR3.render();
	});
  gridGR3.onClick.subscribe(function (e) {
    var cell = gridGR3.getCellFromEvent(e);
    curRowAttrSetList = cell.row;
    if ( dataGR3.length > curRowAttrSetList){
    	curAttrSetListID = dataGR3[cell.row].ATTR_SET_ID;
    	console.log("onClick curAttrSetListID : " + curAttrSetListID);
  	}
  });
}
function fnAttrSetFilter(){
	isDisplayProgress=0;
	sp_URI="SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_getAttrSetListFilter(StoredProcess)";
	fn="initGridAttrSetList";
	var param={
			_program	: sp_URI,
			_result   : "STREAMFRAGMENT",
			ATTR_SET_ID	: "CS_1",
			winW			: winW
	}
	for ( var colname in columnAttrObj) {
		console.log("ColName: " + colname);
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
function saveSegAttrList(){
	var selectedRows = gridGR3.getSelectedRows();
  console.log("curGRPSetListID: " + curGRPSetListID);
  if (typeof curGRPSetListID == "undefined" ) {
  	alertMsg("Select the Group Set ID.");
  	return;
  }
  console.log("curSegID: " + curSegID);
  if (typeof curSegID == "undefined" ) {
  	alertMsg("Select the Segment ID.");
  	return;
  }
  console.log("JSON.stringify(selectedRows): " + JSON.stringify(selectedRows));
  if (selectedRows.length < 1) {
  	alertMsg("Select the Attribute Set ID.");
  	return;
  }
	d = new Date();
  //GRP_SET_ID SEG_SET_ID SEG_ID SEG_NAME ATTR_SET_ID ATTR_SET_NAME USE_YN UPDATE_DT
  var SEG_DESC=dataGR2[curRowSegList].SEG_DESC;

  for(var ii=0; ii<selectedRows.length; ii++){
  	var attrRow=selectedRows[ii];
		dataGR4.push({
			SEG_SET_ID : curSegSetID,
		  SEG_ID: curSegID,
		  SEG_NAME: curSegName,
		  ATTR_SET_ID : dataGR3[attrRow].ATTR_SET_ID,
		  ATTR_SET_NAME: dataGR3[attrRow].ATTR_SET_NAME,
		  ATTR_SET_DESC: SEG_DESC + " / " + dataGR3[attrRow].ATTR_SET_DESC,
		  USE_YN: "1",
		  UPDATE_DT: d.yyyymmdd()
		});
  }
  console.log("JSON.stringify(dataGR4): " + JSON.stringify(dataGR4));
  gridGR4.updateRowCount();
  gridGR4.render();
}
function initGridGRPSetList(data){
	var sasJsonRes=eval(data)[0];
	dataGR1		=[];
	columnsGR1 =[];
/*
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	columnsGR1.push(checkboxSelector.getColumnDefinition());
	console.log("JSON.stringify(columnsGR1) 1 :" + JSON.stringify(columnsGR1));
	columnsGR1=$.extend(sasJsonRes["ColumInfo"],columnsGR1);;
	console.log("JSON.stringify(columnsGR1) 2 :" + JSON.stringify(columnsGR1));
*/
	columnsGR1=sasJsonRes["ColumInfo"];
	var  optionsGR1=sasJsonRes["Options"][0];
	dataGR1 = sasJsonRes["SASResult"];
	console.log("JSON.stringify(dataGR1)============================================== :" + JSON.stringify(dataGR1));
	console.log("JSON.stringify(columnsGR1)============================================== :" + JSON.stringify(columnsGR1));
	console.log("JSON.stringify(optionsGR1)============================================== :" + JSON.stringify(optionsGR1));
	gridGR1 = new Slick.Grid("#dvGRPSetList",  dataGR1, columnsGR1,  optionsGR1);
	gridGR1.setSelectionModel(new Slick.RowSelectionModel());
  gridGR1.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

/*
  gridGR1.registerPlugin(checkboxSelector);
	var columnpicker = new Slick.Controls.ColumnPicker(columnsGR1, gridGR1, optionsGR1);
	gridGR1.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
*/
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
	console.log("gridGR1.onSort ");
	gridGR1.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR1.getCellFromEvent(e);
		if (gridGR1.getColumns()[cell.cell].id == "SEG_SET_NAME") {
			$("#contextMenu")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();

			$("body").one("click", function () {
				$("#contextMenu").hide();
			});
		}
	});
	$("#contextMenu").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR1.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		console.log("Selected Value VAL: " + $(e.target).html());
		dataGR1[row].SEG_SET_ID = $(e.target).attr("data");
		dataGR1[row].SEG_SET_NAME = $(e.target).html();
		gridGR1.updateRow(row);
	});
  gridGR1.onClick.subscribe(function (e) {
  	console.log("onClick JSON.stringify(dataGR1): " + JSON.stringify(dataGR1));
    var cell = gridGR1.getCellFromEvent(e);
    curRowGRPSetList = cell.row;
    if ( dataGR1.length > curRowGRPSetList){
  	}
  });
  gridGR1.onDblClick.subscribe(function (e) {
		console.log("onDblClick curGRPSetListID : " + curGRPSetListID);
    var cell = gridGR1.getCellFromEvent(e);
    curRowGRPSetList = cell.row;
    console.log("gridGR1 onDblClick curRowSegSet : " + curRowGRPSetList + " dataGR1 length: " + dataGR1.length );
    if ( dataGR1.length > curRowGRPSetList){
    	//saveGR1Row();
  	}
  });
  gridGR1.onCellChange.subscribe(function (e) {
  	console.log("onCellChange JSON.stringify(e): " + JSON.stringify(e));
  	console.log("onCellChange JSON.stringify(dataGR1): " + JSON.stringify(dataGR1));
  	console.log("onCellChange curRowGRPSetList: " + curRowGRPSetList);
    var grpSetID = dataGR1[curRowGRPSetList].GRP_SET_ID;
    var grpSetName = dataGR1[curRowGRPSetList].GRP_SET_NAME;
    var segSetID = dataGR1[curRowGRPSetList].SEG_SET_ID;
    var useYN = gridGR1.getDataItem(curRowGRPSetList).USE_YN;
    console.log("gridGR1 onClick curRowGRPSetList : " + curRowGRPSetList + ":" + grpSetID+":" + grpSetName+ ":" +useYN);
    isDisplayProgress=0;
		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_saveGroupSetRow(StoredProcess)","alertResMsg",grpSetID,grpSetName,useYN,segSetID);
		d = new Date();
	  console.log("updateDT:" + d.yyyymmdd());
    dataGR1[curRowGRPSetList].UPDATE_DT=d.yyyymmdd();
	  gridGR1.invalidate();
	  gridGR1.render();
  	console.log("onCellChange JSON.stringify(dataGR1): " + JSON.stringify(dataGR1));

  });
	gridGR1.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridGR1.invalidateRow(dataGR1.length);
	  if (typeof curRowGRPSetList == "undefined") curRowGRPSetList=0;
    isDisplayProgress=0;
		var resData=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNextID(StoredProcess)","ALMConf.GROUP_SET_LIST","GRP_SET_ID",curSegSetID);
	  var grp_Set_ID=eval("("+'{"GRP_SET_ID":"GRPS_' + resData.toString().trim() + '"}'+")");
	  //var grp_Set_ID=eval("("+'{"GRP_SET_ID":"GRP_' + eval(resData.toString()) + '"' + '}'+")");
	  //var grp_Set_ID=eval("("+'{"GRP_SET_ID":"GRP_' + eval(curRowGRPSetList+1) + '"' + '}'+")");


		console.log("grp_Set_ID: " + grp_Set_ID);
	  var use_YN=eval("("+'{"USE_YN":"true"' + '}'+")");
		d = new Date();
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");

    item = $.extend({}, grp_Set_ID, item,use_YN,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  gridGR1.render();
    var grpSetID = dataGR1[curRowGRPSetList].GRP_SET_ID;
    var grpSetName = dataGR1[curRowGRPSetList].GRP_SET_NAME;
    var useYN = gridGR1.getDataItem(curRowGRPSetList).USE_YN;
	  //execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_saveGroupSetRow(StoredProcess)","alertResMsg",grpSetID,grpSetName,useYN,curSegSetID);
	});
    $("#dvModalGRPSetList").hide();
}
function saveGRPSet(){
	isDisplayProgress=1;
	var cntDataGRPSetList=dataGR4.length;
	var newParam=[];
	for ( var ii=0; ii<cntDataGRPSetList;ii++) {
		newParam.push({
		  SEG	: dataGR4[ii].SEG_ID,
		  ATTC: dataGR4[ii].ATTR_SET_ID,
		  ATTN: dataGR4[ii].ATTR_SET_NAME,
		  YN	: dataGR4[ii].USE_YN
		});
	}
	var nParam = JSON.stringify(newParam);
	console.log("newParam: " + nParam);
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_saveGroupSet(StoredProcess)","alertResMsg",nParam,curSegSetID,curGRPSetListID);

}
function initGridGRPSetOnDblClick(data){
	$("#dvGRPSet").show();
	$("#progressIndicatorWIP").hide();

	var sasJsonRes=eval(data)[0];
	console.log("JSON.stringify(sasJsonRes) :" + JSON.stringify(sasJsonRes));

	columnsGR4=sasJsonRes["ColumInfo"];
	optionsGR4=sasJsonRes["Options"][0];
	dataGR4 = [];
	dataGR4 = sasJsonRes["SASResult"];
	console.log("JSON.stringify(dataGR4) :" + JSON.stringify(dataGR4));

	gridGR4 = new Slick.Grid("#dvGRPSet", dataGR4, columnsGR4, optionsGR4);
	gridGR4.setSelectionModel(new Slick.CellSelectionModel());
	gridGR4.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );

	gridGR4.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataGR4.sort(function (dataRow1, dataRow2) {
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
	  gridGR4.invalidate();
	  gridGR4.render();
	});
  gridGR4.onClick.subscribe(function (e) {
    var cell = gridGR4.getCellFromEvent(e);
		curRowGRPSet = cell.row;
  });
  gridGR4.onCellChange.subscribe(function (e) {
    var COLUMN_NAME = gridGR4.getDataItem(curRowGRPSet).COLUMN_NAME;
    var COLUMN_LABEL = gridGR4.getDataItem(curRowGRPSet).COLUMN_LABEL;
    var USE_YN = gridGR4.getDataItem(curRowGRPSet).USE_YN;
    console.log("gridGR4 onClick curSegSetID : " + curRowGRPSet + ":" + COLUMN_NAME+":" + COLUMN_LABEL+ ":" +USE_YN);
    isDisplayProgress=0;
		execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_saveAttrColumnRow(StoredProcess)","alertResMsg",COLUMN_NAME,COLUMN_LABEL,USE_YN);
		Date.prototype.yyyymmdd = function() {
			var yyyy = this.getFullYear().toString();
			var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
			var dd  = this.getDate().toString();
			return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
		};
		d = new Date();
	  console.log("updateDT:" + d.yyyymmdd());
    dataGR4[curRowGRPSet].UPDATE_DT=d.yyyymmdd();
	  gridGR4.invalidate();
	  gridGR4.render();

  });
	gridGR4.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridGR4.invalidateRow(dataGR4.length);
	  var id=eval("("+'{"ATTR_SET_ID":"GRP_' + eval(curRowGRPSet+1) + '"' + '}'+")");
	  var useYN=eval("("+'{"USE_YN":"1"' + '}'+")");
		Date.prototype.yyyymmdd = function() {
			var yyyy = this.getFullYear().toString();
			var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
			var dd  = this.getDate().toString();
			return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
		};
		d = new Date();
	  var updateDT=eval("("+'{"UPDATE_DT":"' + d.yyyymmdd() + '"' + '}'+")");

    item = $.extend({}, id, item,useYN,updateDT);
	  console.log("JSON.stringify(item) : " + JSON.stringify(item));
	  dataGR4.push(item);
	  gridGR4.updateRowCount();
	  gridGR4.render();
	});
}
function initSegListContextMenu(data){
	console.log("JSON.stringify(data): " +JSON.stringify(data));
	var sasJsonRes=eval(data)[0];
	var SegList = sasJsonRes["SASResult"];
	console.log("SegList: " +SegList);
	var ctxMenuStr="";
	for(var ii=0;ii<SegList.length;ii++){
		var SEG_SET_ID=SegList[ii].SEG_SET_ID;
		var SEG_SET_NAME=SegList[ii].SEG_SET_NAME;
		ctxMenuStr+="<li data='" + SEG_SET_ID + "'>" + SEG_SET_NAME +"</li>";
	}
	$("#contextMenu").html(ctxMenuStr);
}
function deleteGRPSet(){
  if ( gridGR4.getActiveCell() == null) {
		alertMsg("Select the Group Set ID.");
		return;
  }
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteGRPSetCF");
}
function deleteGRPSetCF(){

  var dataGR4 = gridGR4.getData();
  var current_row = gridGR4.getActiveCell().row;
  dataGR4.splice(current_row,1);
  var r = current_row;
  while (r<dataGR4.length){
    gridGR4.invalidateRow(r);
    r++;
  }
  gridGR4.updateRowCount();
  gridGR4.render();
  gridGR4.scrollRowIntoView(current_row-1);
}
function manageGRPSetList(){
	$("#dvModalGRPSetList").css("left",eval(eval($(window).width()-$("#dvModalGRPSetList").width()-40)/2));
	$("#dvModalGRPSetList").css("top",eval(eval($(window).height()-$("#dvModalGRPSetList").height()-60)/2));
	$("#dvModalGRPSetList").show();
}
function deleteGRPSetList(){
  if ( gridGR1.getActiveCell() == null) {
		alertMsg("Select the Group Set ID.");
		return;
  }
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteGRPSetListCF");
}
function deleteGRPSetListCF(){
  var dataGR1 = gridGR1.getData();
  var current_row = gridGR1.getActiveCell().row;
  console.log("gridGR1[current_row].GRP_SET_ID: " + dataGR1[current_row].GRP_SET_ID);
  var curGRPSetID=dataGR1[current_row].GRP_SET_ID;
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
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_deleteGroupSetRow(StoredProcess)","alertResMsg",curGRPSetID);
}
function copyGRPSetList(){
	//gridGR1
  if (typeof curRowGRPSetList == "undefined" ) {
  	alertMsg("Selecte the Based Group Set ID.");
  	return;
  }
	console.log("" + dataGR1[curRowGRPSetList].GRP_SET_ID);
	var GRP_SET_ID=dataGR1[curRowGRPSetList].GRP_SET_ID;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_copyGroupSet(StoredProcess)","initGridGRPSetList",GRP_SET_ID);

}
function saveGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Group Set ID.");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}
	gridGR1.invalidateRow(dataGR1.length);
  var curRow = gridGR1.getActiveCell().row;

	curGRPSetListID = dataGR1[curRow].GRP_SET_ID;
	curSegSetID = dataGR1[curRow].SEG_SET_ID;
	console.log("onClick curGRPSetListID : " + curGRPSetListID);
	console.log("onClick curRowGRPSetList : " + curRowGRPSetList);
  var grpSetID = dataGR1[curRowGRPSetList].GRP_SET_ID;
  var grpSetName = dataGR1[curRowGRPSetList].GRP_SET_NAME;
  var segSetID = dataGR1[curRowGRPSetList].SEG_SET_ID;
  var useYN = gridGR1.getDataItem(curRowGRPSetList).USE_YN;
  console.log("gridGR1 onClick curRowGRPSetList : " + curRowGRPSetList + ":" + grpSetID+":" + grpSetName+ ":" +useYN);
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_saveGroupSetRow(StoredProcess)","alertResMsg",grpSetID,grpSetName,useYN,segSetID);
}