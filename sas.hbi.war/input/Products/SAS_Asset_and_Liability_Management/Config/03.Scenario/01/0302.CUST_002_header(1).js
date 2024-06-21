$(document).ready(function () {
	//$("#sasGrid").height(eval($(window).height()-178));
	$("#dvMain").height(eval($(window).height()-78));
	$("#dvSetList").height(eval($(window).height()-118));
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust002_getCalcNameContext(StoredProcess)","initCalcNameContextMenu","","");				
});
$(window).resize(function () {
});


/*
		

*/
function addLayout(){
	var layout="";
	$("#dvFooter").before(layout);
}
function addButton(){
	var footer="";
	footer+=' ';
	footer+='	';
	footer+="";
	footer+="";
	footer+="";  
	$("#dvFooter").html(footer); 
	$("#dvFooter").show(); 
	$("#dvFooter").css("text-align","right");
	$("#dvFooter").css("padding-right","5px");
	
}
function initCalcNameContextMenu(data){
	var sasJsonRes=eval(data)[0];
	var cxtList = sasJsonRes["SASResult"];
	console.log("cxtList: " +cxtList);
	var ctxMenuStr="";
	var preCXT_ID=""
	for(var ii=0;ii<cxtList.length;ii++){
		var CALC_ID=cxtList[ii].CALC_ID;
		var CALC_TYPE_NAME	=cxtList[ii].CALC_TYPE_NAME;
		var NAME=cxtList[ii].NAME;
		var ISFIRST=cxtList[ii].ISFIRST;
		if (ISFIRST == "1"){
			ctxMenuStr+="<li data='" + CALC_ID + "'>" + CALC_ID +"</li>";
		}
		ctxMenuStr+="<div style='padding-left:15px;background-color:#efefef;'>" + CALC_TYPE_NAME + "</div>"
	}
	$("#contextCalcName").html(ctxMenuStr);
}
function saveGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Model.");
		return;
	}
	if (!gridGR1.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	gridGR1.invalidateRow();

	//MODEL_TYPE  MODEL_NAME PRX_BHVR_ID CALC_ID USE_YN
  isDisplayProgress=0;
	var dataGr = gridGR1.getData();
	console.log(dataGr);
  var curRow = gridGR1.getActiveCell().row;
	var MODEL_TYPE	=dataGr[curRow].MODEL_TYPE;  
	console.log("MODEL_TYPE : " + MODEL_TYPE + ":");
	if (MODEL_TYPE == undefined) {
		alertMsg("Input MODEL_TYPE.");
		return;
	}
	var MODEL_NAME	=dataGr[curRow].MODEL_NAME;  
	var PRX_BHVR_ID	=dataGr[curRow].PRX_BHVR_ID;  
	var CALC_ID			=dataGr[curRow].CALC_ID;  
	var USE_YN			=dataGr[curRow].USE_YN;  
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust002_saveModelRow(StoredProcess)","alertResMsg",MODEL_TYPE,MODEL_NAME,PRX_BHVR_ID,CALC_ID,USE_YN);
}
function deleteGR1Row(){
	if (gridGR1.getActiveCell() == null){
		alertMsg("Select the Model Type.");
		return;
	}
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteGR1RowCF");
}
function deleteGR1RowCF(){
  var dataGr = gridGR1.getData();
  var current_row = gridGR1.getActiveCell().row;
  var MODEL_TYPE=dataGr[current_row].MODEL_TYPE;
  dataGr.splice(current_row,1);
  var crow = current_row;
  while (crow<dataGr.length){
    gridGR1.invalidateRow(crow);
    crow++;
  }
  gridGR1.updateRowCount();
  gridGR1.render();
  gridGR1.scrollRowIntoView(current_row-1);  
  isDisplayProgress=0;
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust002_deleteModelMgtRow(StoredProcess)","alertResMsg",MODEL_TYPE);
}
function alertResMsg(data){
	isDisplayProgress=0;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
	alertMsg(msg.msg);
}

/*
$("#dvSetList").height(eval($(window).height()-$("#dvCondi").height()-50));
$("#dvSetList").width(eval($(window).width()-11));
$(window).resize(function() {
	$("#dvSetList").height(eval($(window).height()-$("#dvCondi").height()-50));
	$("#dvSetList").width(eval($(window).width()-11));
	$(".slick-viewport").height(eval($("#dvSetList").height()-23));
});	
*/
var gridGR1;
var dataGR1;
function renderGR1(data){
	console.log("setSlickGrid :\n" );

	$("#dvSetList").show();
	
	var sasJsonRes=eval(data)[0];
	dataGR1		=[];
	columnsGR1 =[];
	columnsGR1=sasJsonRes["ColumInfo"];
	optionsGR1=sasJsonRes["Options"][0];
	dataGR1 = sasJsonRes["SASResult"];
	gridGR1 = new Slick.Grid("#dvSetList",  dataGR1, columnsGR1,  optionsGR1);
	gridGR1.setSelectionModel(new Slick.RowSelectionModel());
  gridGR1.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));

	gridGR1.onClick.subscribe(function (e) {
	});
	gridGR1.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridGR1.getCellFromEvent(e);
		console.log("gridGR1.getColumns()[cell.cell].id : " + gridGR1.getColumns()[cell.cell].id);
		if (gridGR1.getColumns()[cell.cell].id == "CALC_ID") {
			$("#contextCalcName")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextCalcName").hide();
			});
		}
	});  		
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
	$("#contextCalcName").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridGR1.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		console.log("Selected Value : " + $(e.target).attr("data"));
		dataGR1[row].CALC_ID = $(e.target).attr("data");
		gridGR1.updateRow(row);
		//saveGR1Save(row);
	});	
	
	gridGR1.onAddNewRow.subscribe(function (e, args) {
	  var item = args.item;
	  gridGR1.invalidateRow(dataGR1.length);
    isDisplayProgress=0; 
    item = $.extend({},item);
	  dataGR1.push(item);
	  gridGR1.updateRowCount();
	  gridGR1.render();	
	})		
	$("#progressIndicatorWIP").hide();
}

