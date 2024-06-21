	</script>
	<script src="/SASHBI/scripts/jstree/dist/jstree.js"></script>
	<link rel="stylesheet" href="/SASHBI/scripts/jstree/dist/themes/default/style.min.css" type="text/css" />
	<script>	
var treeID;
var treeGroup;
var treeName;
var treeDesc;  	
var curParent ;
var curColumnName ;
var curColumnLabel;
var curColumnFormat;
var savedTree;
var curFilterNodeID;
var orgTREE_TYPE;
var orgSUB_TYPE;
var isOpened;															

$(window).resize(function () {
	resizeFrame();
})
function resizeFrame(){
	$("#dvMain").height(eval($(window).height()-$("#dvCondi").height()-33));
	$("#dvCol1").width(350);
		$("#dvColDFT").width($("#dvCol1").width());
		$("#dvColUser").width($("#dvCol1").width());
	$("#dvCol2").width(eval(($(window).width()-$("#dvCol1").width())*0.55));
	$("#dvCol3").width(eval($(window).width()-$("#dvCol1").width()-$("#dvCol2").width()-32));

	$("#dvColDFT").height(eval($(window).height()*0.5));
	$("#dvColUser").height(eval($(window).height()-$("#dvCondi").height()-$("#dvColDFT").height()-83));

	$("#treeLayout").height(eval($(window).height()-$("#dvCondi").height()-72));

	$("#treeFilter").height(eval($(window).height()-$("#dvCondi").height()-$("#dvFilterHeader").height()-73));

}
var	curColumnName;

$(document).ready(function () { 
	initTree();
	//get_RPT_TYPE();
	resizeFrame();	
	$btn = $("#dvBtn").children().clone();
	//console.log("$btn : " + $btn);
	$btn.appendTo(".buttonArea");
	$(".buttonArea").width(400);
	$(".buttonArea").css("padding-top","5px");
	$("#sltLIBRARY").css("width","100px");
	$("#sltDATA_NAME").css("width","556px");

	$("#sltDATA_NAME").bind("change", function() {
		// sometimes, binding is not working...
	  console.log("$sltDATA_NAME : " +$("#sltDATA_NAME").val());
	  destroyTree();
	});
	// 보고서 그룹 목록 가져오기
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.RPT_GRP_LST","RPT_GRP_ID","RPT_GRP_LST","libname+ALMConf+list%3B","","","RPT_GRP_NAME","","false","","true");
	setTimeout("$('#dvMain').show();",1000*2);

});

function addRptGroup(){
	//alertMsg("This Function is being developed...");
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').hide();
	$("#dvEditRptGrp").width($("#dvSave").width());
	$("#dvEditRptGrp").height($("#dvSave").height());
	$("#dvEditRptGrp").css("left",eval(eval($(window).width()-$("#dvOpen").width()-0)/2));
	$("#dvEditRptGrp").css("top",eval(eval($(window).height()-$("#dvOpen").height()-100)/2));
	$('#dvEditRptGrp').show();
	execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/06.Tree Rollup/01/trc001_getRptGrpList(StoredProcess)",true,"renderRptGrpList","json");

}
var gridRptGrpList;
var dataRptGrpList;
function renderRptGrpList(data){
	var sasJsonRes=eval(data)[0];
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	$sasExcelHTML=data;
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	save_path=sessionInfo["save_path"];
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path); 
	
	dataRptGrpList =[];
	columnsRptGrpList =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	
	optionsRptGrpList	=sasJsonRes["Options"][0];
	
	var isChk=optionsRptGrpList.chkBox;
	if (isChk){
		columnsRptGrpList.push(checkboxSelector.getColumnDefinition());
		columnsRptGrpList=$.extend(sasJsonRes["ColumInfo"],columnsRptGrpList);;
	}
	columnsRptGrpList	=sasJsonRes["ColumInfo"];
	dataRptGrpList	= sasJsonRes["SASResult"];
	dataVwRptGrpList = new Slick.Data.DataView({ inlineFilters: true });	
	gridRptGrpList	= new Slick.Grid("#dvRptGrpList",  dataRptGrpList, columnsRptGrpList,  optionsRptGrpList);
	if (isChk){
  	gridRptGrpList.registerPlugin(checkboxSelector);
	}
	gridRptGrpList.setSelectionModel(new Slick.RowSelectionModel());
	gridRptGrpList.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	var columnpicker = new Slick.Controls.ColumnPicker(columnsRptGrpList, gridRptGrpList, optionsRptGrpList); 
	gridRptGrpList.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridRptGrpList.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataRptGrpList.sort(function (dataRow1, dataRow2) {
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
	  gridRptGrpList.invalidate();
	  gridRptGrpList.render();
	});		
	gridRptGrpList.onClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = gridRptGrpList.getCellFromEvent(e);
		curRowRptGrpList = cell.row;
		//console.log("gridRptGrpList Clicked!!!");
	});
	gridRptGrpList.onDblClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = gridRptGrpList.getCellFromEvent(e);
		curRowRptGrpList = cell.row;
		//console.log("gridRptGrpList Double Clicked!!!");
	});
	
}
function updateRptGrp(){
	tParams=eval('[{}]');
	var data=gridRptGrpList.getData();
	var gridData=JSON.stringify(data);
	tParams['gridData']=gridData;

	execAjax("saveReportGroup","",true,"savedReportGroup","html"); 
}
function savedReportGroup(res){
	console.log(res);
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.RPT_GRP_LST","RPT_GRP_ID","RPT_GRP_LST","libname+ALMConf+list%3B","","","RPT_GRP_NAME","","false","","true");
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.RPT_GRP_LST","RPT_GRP_ID","RPT_GRP","libname+ALMConf+list%3B","","","RPT_GRP_NAME","","false","","true","false");
	alertMsg("Sucessfully Saved...");
}
function addRptGrp(){
  var data = gridRptGrpList.getData();
	var newID=execSTPS("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getNewRptGrpID(StoredProcess)");
	newID="RPT_"+newID;
  data.splice(data.length,0,{"RPT_GRP_ID":newID,"LASTUPDATE":""});
  gridRptGrpList.invalidateRow(data.length);
  gridRptGrpList.updateRowCount();
  gridRptGrpList.render();
  gridRptGrpList.scrollRowIntoView(data.length-1);
}
function deleteRptGrp(){
  if ( gridRptGrpList.getActiveCell() == null) {
		alertMsg("Select the Report Group.");
		return;
  }
  var isDelete = confirmMsg("Are you sure you want to delete?","deleteRptGrp2");
}
function deleteRptGrp2(){
  var data = gridRptGrpList.getData();
  var current_row = gridRptGrpList.getActiveCell().row;
  data.splice(current_row,1);
  var r = current_row;
  while (r<data.length){
    gridRptGrpList.invalidateRow(r);
    r++;
  }
  gridRptGrpList.updateRowCount();
  gridRptGrpList.render();
  gridRptGrpList.scrollRowIntoView(current_row-1);
}
function closeEditRptGrpWindow(){
	$('#dvEditRptGrp').hide();
}
function get_Columns(){
	//if ($("#sltDATA_NAME").val() == null) return;
	
	//console.log("sltDATA_NAME in get_Columns : " + $("#sltDATA_NAME").val());
	var LIBRARY="_SYS_";			//$("#sltLIBRARY option:selected").val();
	var DATA_NAME="_SYS_";					//$("#sltDATA_NAME option:selected").val();
	tParams['LIBRARY']=LIBRARY;
	tParams['DATA_NAME']=DATA_NAME;
	execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getColumnsLayout(StoredProcess)",true,"getColDFT","json",LIBRARY,DATA_NAME);
	execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getColumnsUser(StoredProcess)",true,"getColUser","json",LIBRARY,DATA_NAME);
	execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getMeasures(StoredProcess)",true,"getMeasures","json",LIBRARY,DATA_NAME);

}







function initTree(){
	$('#treeLayout').jstree({
		core : {													
			animation : 3,												
			check_callback : true, 												
			themes : { "stripes" : true },												
			//'data' : [{"text" : "Report"}]												
			'data' : [												
				{											
					'id' : 'Report',										
					'text' : 'Report',										
					'state' : { 'undetermined' : true, 'selected':true ,'opened':true,'disabled':false }										
				}											
			]												
		},													
		contextmenu : {													
			items : function (data) {												
				//console.log(data);											
				//console.log(JSON.stringify(data));											
				if ( data.text == "Report") return;											
				return { 											
					/*										
					view : {										
						label: "View Record",									
						action: function(obj) {									
							window.open("/" + obj.attr("id"));								
						}									
					},										
					create : {										
						label: "Add New", 									
						action: function() {									
						}									
					},										
					*/										
					remove : {										
						label: "Delete", 									
						action: function() {									
							//console.log("data");								
							//console.log(data); 								
							var ref=$('#treeLayout').jstree(true);								
							sel = ref.get_selected();								
							//console.log(sel);								
							for(ii=0; ii<sel.length; ii++){								
								ref.delete_node(sel[ii]);							
							}								
							//ref.delete_node(data.id);								
						}									
					}										
				}											
			}												
		},  													
		'plugins': ["contextmenu", "dnd", "search", "crrm", "state", "types", "wholerow"]													
	});
	$('#treeLayout').bind("copy_node.jstree", function (e, data) {
		//console.log(data);
		var dropFolder = data.parent;
		if (dropFolder=="Measures"){
			return;
		} else if (dropFolder=="Statistics"){
			return;
		} else if (dropFolder=="Filter"){
			return;
		}
		var columnName=data.node.data[0].columnName;
		var columnFormat=data.node.data[0].columnFormat;
		console.log("drop column info in copy node : " + columnName + " : " + columnFormat);
		
		var ref = $('#treeLayout').jstree(true);
		curParent = data.node.parent;
		var nodeText=data.node.text;
		//console.log("nodeText : " + nodeText);
		sltdTreeNode = ref.get_selected();
		//console.log("Selected Nodes : ");
		//console.log(sltdTreeNode);
		//console.log("sltdTreeNode Count : " + sltdTreeNode.length);

		curColumnLabel=data.node.data[0].columnLabel;
		curColumnName=data.node.data[0].columnName;
		curColumnFormat=data.node.data[0].columnFormat;
		//console.log("curColumnLabel : " +curColumnLabel );
		//console.log("curColumnName : " +curColumnName );
		for (sii=0;sii<sltdTreeNode.length;sii++){
			sltdTreeNodeText=sltdTreeNode[sii];
			//console.log("sltdTreeNodeText : " + sltdTreeNodeText);
			node=$('#treeLayout').jstree(true).get_parent(sltdTreeNodeText);
			nodeText=$('#treeLayout').jstree(true).get_text(sltdTreeNodeText);
			//console.log("node at Root : " + node);
			//console.log(node);
			//console.log("nodeText at Root : " + nodeText);
			if (node !="#") {
				prtLevel=trPrt(sltdTreeNodeText,"");
			} else {
				prtLevel="";
			}
			//console.log("prtLevel : " + prtLevel);
			tParams=eval('[{}]');												
			tParams['ACCT_GROUP']=$("#sltACCT_GROUP").val();												
			tParams['TREE_TYPE']=$("#sltTREE_TYPE").val();												
			tParams['SUB_TYPE']=$("#sltSUB_TYPE").val();												
															
			execAjax2("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout(StoredProcess)",true,"getAttrs","json",curColumnName,sltdTreeNodeText,prtLevel,curColumnFormat);												
		}
		sel = [data.node.id];
		//console.log("curParent : " + curParent);
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	});
	$('#treeFilter').jstree({
		core : {													
			animation : 3,												
			check_callback : true,												
			themes : { "stripes" : true }												
			//"data" : [{"text":"Fiter","type":"root"}]												
		},													
		types : {													
			default : {												
				icon : ""											
			},												
			column : {												
				icon : "/SASHBI/images/Filters.gif",											
				max_depth : 1											
			},												
			attribute : {												
				icon : "/SASHBI/images/Filters.gif",											
				max_depth : -1											
			}												
		},													
		contextmenu : {													
			items : function (data) {												
				if ( data.text == "Fiter") return;											
				if ( data.type == "attribute") return;											
				return { 											
					remove : {										
						label: "Delete", 									
						action: function() {									
							var ref=$('#treeFilter').jstree(true);								
							sel = ref.get_selected();								
							for(ii=0; ii<sel.length; ii++){								
								ref.delete_node(sel[ii]);							
							}								
						}									
					}										
				}											
			}												
		},  													
		'plugins': ["contextmenu", "dnd", "search","state", "types", "wholerow", "ui", "checkbox"]													
	});
	$('#treeFilter').bind("copy_node.jstree", function (e, data) {
		//console.log(data);
		var dropFolder = data.parent;
		var columnName=data.node.data[0].columnName;
		
		var ref = $('#treeFilter').jstree(true);
		var nodeText=data.node.text;
		sltdTreeNode = ref.get_selected();
		//console.log("sltdTreeNode : " + sltdTreeNode.length);
		data.node.type="column";

		if (data.parent!="#"){
			sel = [data.node.id];
			if(!sel.length) { return false; }
			ref.delete_node(sel);
			return;
		}

		curColumnLabel=data.node.data[0].columnLabel;
		curColumnName=data.node.data[0].columnName;
		curColumnFormat=data.node.data[0].columnFormat;
		//console.log("curColumnLabel : " +curColumnLabel );
		//console.log("curColumnName : " +curColumnName );
		curFilterNodeID=data.node.id;

		execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout(StoredProcess)",true,"getAttrsFiter","json",curColumnName,"","",curColumnFormat);
	});
	
	$("#dvColDFT, #dvFilterVars").sortable({
		connectWith: ".rollInfo"
	}).disableSelection();
	$( "#dvFilterVars" ).droppable({
		drop: function( event, ui ) {
			console.log("dvFilterVars drop");
		}
	});	
}
function trPrt(id,text){
	node=$('#treeLayout').jstree(true).get_node(id);
	if (node == false) return text;
	console.log("node : " + node);
	console.log(node);
	nodeText=$('#treeLayout').jstree(true).get_text(node);
	if ( node.id=="#" ){
		columnName="";
	} else if (node.text=="Report"){
		columnName="";
	} else {
		columnName=node.data[0].columnsName;
	}
	//console.log("columnName : " + columnName);
	if (columnName.indexOf("레벨계정구분ID") > -1) {
		//console.log("Found Parent Column...==========================");
		text=columnName.substring(0,columnName.length-2)+"CD='"+node.data[0].attrCode.trim()+"'";
		return text;
	}
	text=trPrt(node.parent,text);
	return text;
}
function closeSaveWindow(){
	console.log("orgSUB_TYPE " + orgSUB_TYPE);
	$("#sltTREE_TYPE").val(orgTREE_TYPE).attr("selected", "selected");	
	onChange_TREE_TYPE();
	setTimeout("setSUB_TYPE_VAL()",1000*1);
	$('#dvSave').hide();
	$('#dvBG').hide();
}
function setSUB_TYPE_VAL(){
	$("#sltSUB_TYPE").val(orgSUB_TYPE).attr("selected", "selected");	
}
function newLayout(){
  $("#dvTreeName").html("&nbsp;");	
	$("#dvColDFT").html("");
	$("#dvColUser").html("");
	tParams=eval('[{}]');
	treeID="";
	treeGroup="";
	treeName="";
	treeDesc="";  	
  destroyTree();
}
function destroyTree(){
	$('#treeLayout').jstree('destroy');
	$('#treeFilter').jstree('destroy');
	//$('#treeMStats').jstree('destroy');
	initTree();
}
var isFirst=0;
function openLayout(){
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').hide();
	$("#dvOpen").css("left",eval(eval($(window).width()-$("#dvOpen").width()-0)/2));
	$("#dvOpen").css("top",eval(eval($(window).height()-$("#dvOpen").height()-100)/2));
	$('#dvOpen').show();
	/*
	if (isFirst == 0) {
		tParams=eval('[{}]');
		tParams['TREE_GROUP']="";
		getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.RPT_GRP_LST","RPT_GRP_ID","RPT_GRP","libname+ALMConf+list%3B","","","RPT_GRP_NAME","","false","","true","false");
		$("#sltRPT_GRP").prepend("<option value=''>...Select Report Group...</option>");
		$("#sltRPT_GRP option:eq(0)").attr("selected", "selected");	
	
		isFirst=1;
	}
	*/
	getReportList();
}
function getReportList(){
	tParams=eval('[{}]');
	//tParams['RPT_GRP_ID']=$("#sltRPT_GRP option:selected").val();	
	execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getReportList(StoredProcess)",true,"renderReportList","json");
}
var gridRptList;
var dataRptList;
var dataVwRptList;
function renderReportList(data){
	//console.log("renderRptList started!!!!=======================");
	var sasJsonRes=eval(data)[0];
	//console.log("sasJsonRes");
	//console.log(sasJsonRes);
	
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	$sasExcelHTML=data;
	//console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	//console.log("nstp_sessionid: \n" + nstp_sessionid);
	//console.log("save_path: \n" + save_path); 
	
	dataRptList =[];
	columnsRptList =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	
	optionsRptList	=sasJsonRes["Options"][0];
	
	var isChk=optionsRptList.chkBox;
	if (isChk){
		columnsRptList.push(checkboxSelector.getColumnDefinition());
		columnsRptList=$.extend(sasJsonRes["ColumInfo"],columnsRptList);;
	}
	columnsRptList	=sasJsonRes["ColumInfo"];
	dataRptList	= sasJsonRes["SASResult"];
	dataVwRptList = new Slick.Data.DataView({ inlineFilters: true });	
	gridRptList	= new Slick.Grid("#dvRptList",  dataRptList, columnsRptList,  optionsRptList);
	if (isChk){
  	gridRptList.registerPlugin(checkboxSelector);
	}
	gridRptList.setSelectionModel(new Slick.RowSelectionModel());
	gridRptList.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	var columnpicker = new Slick.Controls.ColumnPicker(columnsRptList, gridRptList, optionsRptList); 
	gridRptList.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridRptList.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  dataRptList.sort(function (dataRow1, dataRow2) {
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
	  gridRptList.invalidate();
	  gridRptList.render();
	});		
	gridRptList.onClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = gridRptList.getCellFromEvent(e);
		curRowRptList = cell.row;
		//console.log("gridRptList Clicked!!!");
	});
	gridRptList.onDblClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = gridRptList.getCellFromEvent(e);
		curRowRptList = cell.row;
		//console.log("gridRptList Double Clicked!!!");
	});
}
function openTreeLayout(){
	if (!gridRptList.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	if (gridRptList.getActiveCell() == null){
		alertMsg("Select the Report...");
		return;
	}
	//console.log("openTreeLayout called!");
	closeOpenWindow();
	isOpened=0;														
	$("#progressIndicatorWIP").show();	
  var current_row = gridRptList.getActiveCell().row;
  //console.log("current_row : " + current_row);
  ACCT_GROUP=dataRptList[current_row].ACCT_GROUP;
  TREE_TYPE=dataRptList[current_row].TREE_TYPE;
  SUB_TYPE=dataRptList[current_row].SUB_TYPE;
	console.log("ACCT_GROUP : " + ACCT_GROUP);
	console.log("TREE_TYPE : " + TREE_TYPE);
	console.log("SUB_TYPE : " + SUB_TYPE);
  
  treeID=dataRptList[current_row].TREE_ID;
  treeGroup=dataRptList[current_row].TREE_GROUP;
  treeName=dataRptList[current_row].TREE_NAME;
  treeDesc=dataRptList[current_row].TREE_DESC;
	console.log("TREE_ID : " + treeID);
	tParams=eval('[{}]');
	tParams['TREE_ID']=treeID;
	$("#sltACCT_GROUP").val(ACCT_GROUP).attr("selected", "selected");	
	onChange_ACCT_GROUP();
	setTimeout("setTREE_TYPE('"+treeID+"','"+treeName+"','"+TREE_TYPE+"','"+SUB_TYPE+"');",1000*1);
	//execAjax("openTreeRollUp","",true,"openTreeLayout2","json");
}
function setTREE_TYPE(treeID,treeName,TREE_TYPE,SUB_TYPE){
	//console.log("setDATA_GROUP called...");
	$("#sltTREE_TYPE").val(TREE_TYPE).attr("selected", "selected");	
	console.log("TREE_TYPE : " + TREE_TYPE);
	onChange_TREE_TYPE();
	setTimeout("setSUB_TYPE('"+treeID+"','"+treeName+"','"+SUB_TYPE+"');",1000*1);
}
function setSUB_TYPE(treeID,treeName,SUB_TYPE){
	console.log("SUB_TYPE : " + SUB_TYPE);
	$("#sltSUB_TYPE").val(SUB_TYPE).attr("selected", "selected");	
	get_Columns();
	tParams=eval('[{}]');
	tParams['TREE_ID']=treeID;
	execAjax("openTreeRollUp","",true,"openTreeLayout2","json");
  $("#dvTreeName").html("["+treeID+"] "+treeName);
}
var filterObj;
function openTreeLayout2(data){
	layoutObj=data["0"].layout;
	filterObj=data["0"].filter;
	//mstatObj=data["0"].mstat;
	//console.log(layoutObj);
	//console.log("filterObj");
	//console.log(filterObj);
	
	var treeObj =filterObj;	
	for(ii=0; ii<treeObj.length;ii++){
		columnObj=treeObj[ii].children;
		columnName=treeObj[ii].text;
		//console.log("columnObj");
		//console.log(columnObj);
		for(jj=0;jj<columnObj.length;jj++){
			attr=columnObj[jj].text;
			isSelected=columnObj[jj].state.selected;
			//console.log(columnName + " : " + attr + " : " + "isSelected : " + isSelected);
		}
	}
	
	$('#treeLayout').jstree('destroy');
	$('#treeFilter').jstree('destroy');
	//$('#treeMStats').jstree('destroy');

	$('#treeLayout').jstree({
		core : {													
			animation : 3,												
			check_callback : true, 												
			themes : { "stripes" : true },												
			data : layoutObj												
		},													
		contextmenu : {													
			items : function (data) {												
				//console.log(data);											
				//console.log(JSON.stringify(data));											
				if ( data.text == "Report") return;											
				return { 											
					remove : {										
						label: "Delete", 									
						action: function() {									
							//console.log("data");								
							//console.log(data); 								
							var ref=$('#treeLayout').jstree(true);								
							sel = ref.get_selected();								
							//console.log(sel);								
							for(ii=0; ii<sel.length; ii++){								
								ref.delete_node(sel[ii]);							
							}								
						}									
					}										
				}											
			}												
		},  													
		'plugins': ["contextmenu", "dnd", "search", "crrm", "state", "types", "wholerow"]													
	});
	$('#treeLayout').bind("copy_node.jstree", function (e, data) {
		//console.log(data);
		var dropFolder = data.parent;
		if (dropFolder=="Measures"){
			return;
		} else if (dropFolder=="Statistics"){
			return;
		} else if (dropFolder=="Filter"){
			return;
		}
		var columnName=data.node.data[0].columnName;
		var columnFormat=data.node.data[0].columnFormat;
		//console.log("drop column info in copy node : " + columnName + " : " + columnFormat);
		
		var ref = $('#treeLayout').jstree(true);
		curParent = data.node.parent;
		var nodeText=data.node.text;
		//console.log("nodeText : " + nodeText);
		sltdTreeNode = ref.get_selected();
		//console.log("Selected Nodes : ");
		//console.log(sltdTreeNode);
		//console.log("sltdTreeNode Count : " + sltdTreeNode.length);

		curColumnLabel=data.node.data[0].columnLabel;
		curColumnName=data.node.data[0].columnName;
		curColumnFormat=data.node.data[0].columnFormat;
		//console.log("curColumnLabel : " +curColumnLabel );
		//console.log("curColumnName : " +curColumnName );
		for (sii=0;sii<sltdTreeNode.length;sii++){
			sltdTreeNodeText=sltdTreeNode[sii];
			//console.log("sltdTreeNodeText : " + sltdTreeNodeText);
			node=$('#treeLayout').jstree(true).get_parent(sltdTreeNodeText);
			nodeText=$('#treeLayout').jstree(true).get_text(sltdTreeNodeText);
			//console.log("node at Root : " + node);
			//console.log(node);
			//console.log("nodeText at Root : " + nodeText);
			if (node !="#") {
				prtLevel=trPrt(sltdTreeNodeText,"");
			} else {
				prtLevel="";
			}
			//console.log("prtLevel : " + prtLevel);
			tParams=eval('[{}]');												
			tParams['ACCT_GROUP']=$("#sltACCT_GROUP").val();												
			tParams['TREE_TYPE']=$("#sltTREE_TYPE").val();												
			tParams['SUB_TYPE']=$("#sltSUB_TYPE").val();												
															
			execAjax2("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout(StoredProcess)",true,"getAttrs","json",curColumnName,sltdTreeNodeText,prtLevel,curColumnFormat);
		}
		sel = [data.node.id];
		//console.log("curParent : " + curParent);
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	});
	//$("#treeLayout").jstree("refresh");
	$('#treeFilter').jstree({
		core : {													
			animation : 3,												
			check_callback : true,												
			themes : { "stripes" : true },												
			data : filterObj												
		},													
		types : {													
			default : {												
			},												
			column : {												
				icon : "",											
				max_depth : 1											
			},												
			attribute : {												
				icon : "/SASHBI/images/Filters.gif",											
				max_depth : -1											
			}												
		},													
		contextmenu : {													
			items : function (data) {												
				if ( data.text == "Fiter") return;											
				if ( data.type == "attribute") return;											
				return { 											
					remove : {										
						label: "Delete", 									
						action: function() {									
							var ref=$('#treeFilter').jstree(true);								
							sel = ref.get_selected();								
							for(ii=0; ii<sel.length; ii++){								
								ref.delete_node(sel[ii]);							
							}								
						}									
					}										
				}											
			}												
		},  													
		'plugins': ["contextmenu", "dnd", "search","state", "types", "wholerow", "ui", "checkbox"]													
	});
	$('#treeFilter').bind("copy_node.jstree", function (e, data) {
		//console.log(data);
		var dropFolder = data.parent;
		var columnName=data.node.data[0].columnName;
		
		var ref = $('#treeFilter').jstree(true);
		var nodeText=data.node.text;
		sltdTreeNode = ref.get_selected();
		//console.log("sltdTreeNode : " + sltdTreeNode.length);
		data.node.type="column";

		if (data.parent!="#"){
			sel = [data.node.id];
			if(!sel.length) { return false; }
			ref.delete_node(sel);
			return;
		}

		curColumnLabel=data.node.data[0].columnLabel;
		curColumnName=data.node.data[0].columnName;
		curColumnFormat=data.node.data[0].columnFormat;
		//console.log("curColumnLabel : " +curColumnLabel );
		//console.log("curColumnName : " +curColumnName );
		curFilterNodeID=data.node.id;

		execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout(StoredProcess)",true,"getAttrsFiter","json",curColumnName,"","",curColumnFormat);
	});
	setTimeout("redrawFilter();",500*1);
	isOpened=1;														
}
function redrawFilter(){
	var treeObj =filterObj;	
	for(ii=0; ii<treeObj.length;ii++){
		columnObj=treeObj[ii].children;
		columnName=treeObj[ii].text;
		//console.log("columnObj");
		//console.log(columnObj);
		for(jj=0;jj<columnObj.length;jj++){
			id=columnObj[jj].id;
			attr=columnObj[jj].text;
			isSelected=columnObj[jj].state.selected;
			attrObj=$("#treeFilter").jstree(true).get_node(id);
			$("#treeFilter").jstree(true).deselect_node(attrObj);
		}
	}
	for(ii=0; ii<treeObj.length;ii++){
		columnObj=treeObj[ii].children;
		columnName=treeObj[ii].text;
		//console.log("columnObj");
		//console.log(columnObj);
		for(jj=0;jj<columnObj.length;jj++){
			id=columnObj[jj].id;
			attr=columnObj[jj].text;
			isSelected=columnObj[jj].state.selected;
			//console.log(columnName + " : " + attr + " : " + "isSelected : " + isSelected);
			if (isSelected == true){
				attrObj=$("#treeFilter").jstree(true).get_node(id);
				$("#treeFilter").jstree(true).select_node(attrObj);
			}
		}
	}
}
function closeOpenWindow(){
	$('#dvOpen').hide();
	$('#dvBG').hide();
}
function saveAsLayout(){
	treeID="";
	orgTREE_TYPE=$("#sltTREE_TYPE").val();
	orgSUB_TYPE=$("#sltSUB_TYPE").val();
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.VIEW_TREE_PRMT_MST","TREE_TYPE","TREE_TYPE2","libname+ALMConf+list%3B","ACCT_GROUP=ACCT_GROUP:","","TREE_TYPE_LABEL","","false","","true");
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.VIEW_TREE_PRMT_MST","SUB_TYPE","SUB_TYPE2","libname+ALMConf+list%3B","ACCT_GROUP=ACCT_GROUP:TREE_TYPE=TREE_TYPE:","","SUB_TYPE_LABEL","","false","","true");
	$("#sltSUB_TYPE2").val($("#sltSUB_TYPE").val()).attr("selected", "selected");	

	$("#txtTreeGroup").val(treeGroup);
	$("#txtTreeName").val(treeName);
	$("#txtTreeDesc").val(treeDesc);
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').hide();
	$("#dvSave").css("left",eval(eval($(window).width()-$("#dvOpen").width()-0)/2));
	$("#dvSave").css("top",eval(eval($(window).height()-$("#dvOpen").height()-100)/2));
	$('#dvSave').show();
}
function onChange_TYPE2(){
	$("#sltSUB_TYPE").val($("#sltSUB_TYPE2").val()).attr("selected", "selected");	
}
function getSUB_TYPE2(){
	$("#sltTREE_TYPE").val($("#sltTREE_TYPE2").val()).attr("selected", "selected");	
	onChange_TREE_TYPE();
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.VIEW_TREE_PRMT_MST","SUB_TYPE","SUB_TYPE2","libname+ALMConf+list%3B","ACCT_GROUP=ACCT_GROUP:TREE_TYPE=TREE_TYPE:","","SUB_TYPE_LABEL","","false","","true");
}
function saveLayout(){
	orgTREE_TYPE=$("#sltTREE_TYPE").val();
	orgSUB_TYPE=$("#sltSUB_TYPE").val();
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.VIEW_TREE_PRMT_MST","TREE_TYPE","TREE_TYPE2","libname+ALMConf+list%3B","ACCT_GROUP=ACCT_GROUP:","","TREE_TYPE_LABEL","","false","","true");
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.VIEW_TREE_PRMT_MST","SUB_TYPE","SUB_TYPE2","libname+ALMConf+list%3B","ACCT_GROUP=ACCT_GROUP:TREE_TYPE=TREE_TYPE:","","SUB_TYPE_LABEL","","false","","true");
	$("#sltSUB_TYPE2").val($("#sltSUB_TYPE").val()).attr("selected", "selected");	
	
	if (treeID == undefined || treeID == "" ){
		$("#dvBG").css("height",$(window).height()+"px");
		$("#dvBG").width($(window).width());
		$('#dvBG').hide();
		$("#dvSave").css("left",eval(eval($(window).width()-$("#dvOpen").width()-0)/2));
		$("#dvSave").css("top",eval(eval($(window).height()-$("#dvOpen").height()-100)/2));
		$('#dvSave').show();
	} else {
		$("#txtTreeGroup").val(treeGroup);
		$("#txtTreeName").val(treeName);
		$("#txtTreeDesc").val(treeDesc);
		saveTreeLayout();
	}
}
function saveTreeLayout(){
	$('#dvSave').hide();
	$('#dvBG').hide();
	var objTreeLayout =$("#treeLayout").jstree(true).get_json();	
	var objFlatLayout =$("#treeLayout").jstree(true).get_json('#', { 'flat': true });	
	var objTreeFilter =$("#treeFilter").jstree(true).get_json();	
	var objFlatFilter =$("#treeFilter").jstree(true).get_json('#', { 'flat': true });	
	//var objTreeMStats =[{"id":"","data":{},"parent":"#"}];	//$("#treeMStats").jstree(true).get_json();	
	//var objFlatMStats =[{"id":"","data":{},"parent":"#"}];	//$("#treeMStats").jstree(true).get_json('#', { 'flat': true });	
	console.log("Saved treeLayout");
	console.log(objTreeLayout);
	console.log(objFlatLayout);
	console.log(objTreeFilter);
	console.log(objFlatFilter);
	console.log("Saved objFlatMStats");
	//console.log(objFlatMStats);
	
	var RPT_TYPE=$("#sltRPT_TYPE option:selected").val();
	var AUTH_GROUP="";
	//var DATA_GROUP=$("#sltDATA_GROUP option:selected").val();
	var LIBRARY=$("#sltLIBRARY option:selected").val();
	//var DATA_DESC=$("#sltDATA_DESC option:selected").val();
	var DATA_NAME=$("#sltDATA_NAME option:selected").val();
	treeGroup=$("#sltRPT_GRP_LST option:selected").val();
	treeName=$("#txtTreeName").val();
	treeDesc=$("#txtTreeDesc").val();
	$("#txtTreeName").val("");
	$("#txtTreeDesc").val("");
	tParams=eval('[{}]');
	tParams['RPT_TYPE']=RPT_TYPE;
	tParams['AUTH_GROUP']=AUTH_GROUP;
	//tParams['DATA_GROUP']=DATA_GROUP;
	tParams['LIBRARY']=LIBRARY;
	tParams['DATA_NAME']=DATA_NAME;
	if (treeID == null || treeID == undefined) treeID="";
	tParams['TREE_ID']=treeID;
	tParams['RPT_GRP_ID']=treeGroup;
	tParams['TREE_NAME']=treeName;
	tParams['TREE_DESC']=treeDesc;
	
	tParams['objTreeLayout']=JSON.stringify(objTreeLayout);
	tParams['objFlatLayout']=JSON.stringify(objFlatLayout);
	tParams['objTreeFilter']=JSON.stringify(objTreeFilter);
	//tParams['objFlatFilter']=JSON.stringify(objFlatFilter);
	//tParams['objTreeMStats']=JSON.stringify(objTreeMStats);
	//tParams['objFlatMStats']=JSON.stringify(objFlatMStats);
	
	execAjax("saveTreeRollUpG","",true,"savedTreeLayout","html"); 
}
function deleteTreeLayout(){
	if (!gridRptList.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	$("#progressIndicatorWIP").show();	
  //console.log("gridRptList.getActiveCell() : " + gridRptList.getActiveCell());
  if (gridRptList.getActiveCell() == null) {
  	alertMsg("Select Tree Rollup Layout for delete.");
  	return;
  }
  var current_row = gridRptList.getActiveCell().row;
	var dataRptList = gridRptList.getData();
	//console.log(dataRptList);
  treeID=dataRptList[current_row].TREE_ID;
	tParams=eval('[{}]');
	tParams['treeID']=treeID;
	
	dataRptList.splice(current_row,1);
	var crow = current_row;
  while (crow<dataRptList.length){
    gridRptList.invalidateRow(crow);
    crow++;
  }
  gridRptList.updateRowCount();
  gridRptList.render();
  gridRptList.scrollRowIntoView(current_row-1);  
  isDisplayProgress=0;
	
	execAjax("deleteTreeRollUp","",true,"resultShowMsg","html"); 
	
}
function updateTreeLayout(){
	if (!gridRptList.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	$("#progressIndicatorWIP").show();	
  //console.log("gridRptList.getActiveCell() : " + gridRptList.getActiveCell());
  if (gridRptList.getActiveCell() == null) {
  	alertMsg("Select Tree Rollup Layout for update.");
  	return;
  }
  var current_row = gridRptList.getActiveCell().row;
  treeID=dataRptList[current_row].TREE_ID;
  treeName=dataRptList[current_row].TREE_NAME;
  treeDesc=dataRptList[current_row].TREE_DESC;

	treeGroup=dataRptList[current_row].TREE_GROUP;

  //console.log("treeID : " + treeID);

	var RPT_TYPE=$("#sltRPT_TYPE option:selected").val();
	var AUTH_GROUP="";
	//var DATA_GROUP=$("#sltDATA_GROUP option:selected").val();
	var LIBRARY=$("#sltLIBRARY option:selected").val();
	var DATA_NAME=$("#sltDATA_NAME option:selected").val();
	$("#txtTreeName").val("");
	$("#txtTreeDesc").val("");
	tParams=eval('[{}]');
	tParams['RPT_TYPE']=RPT_TYPE;
	tParams['AUTH_GROUP']=AUTH_GROUP;
	//tParams['DATA_GROUP']=DATA_GROUP;
	tParams['LIBRARY']=LIBRARY;
	tParams['DATA_NAME']=DATA_NAME;
	tParams['treeID']=treeID;
	tParams['treeGroup']=treeGroup;
	tParams['treeName']=treeName;
	tParams['treeDesc']=treeDesc;
	execAjax("updateTreeRollUp","",true,"resultShowMsg","html"); 
	
	$('#dvOpen').hide();
	$('#dvBG').hide();
}
function resultShowMsg(data){
	msg=data.trim();
	alertMsg(msg);
}
function closeFormatWindow(){
	$('#dvFormat').hide();
	$('#dvBG').hide();
}
function saveFormat(){
	var ColumnLabel=$("#columnLabel").html();
	var ColumnNAME=$("#columnName").html();
	var ColumnFORMAT=$("#columnFormat").val();
	
	$("#col"+ColumnNAME).attr("fmt",ColumnFORMAT);
	$("#col"+ColumnNAME).html(ColumnLabel + "(" + ColumnNAME + " : <span onclick=selectFMT('col"+ColumnNAME+"')>" + ColumnFORMAT + "</span>)</div>");
	$('#dvFormat').hide();
	$('#dvBG').hide();
}
function selectFMT(obj){
	//console.log($("#"+obj).html());
	var columnName=$("#"+obj).attr("name");
	var columnLabel=$("#"+obj).attr("label");
	var columnFMT=$("#"+obj).attr("FMT");
	$("#columnName").html(columnName);
	$("#columnLabel").html(columnLabel);
	$("#columnFormat").val(columnFMT);

	$("#dvBG").show();
	$("#dvFormat").css("left",eval(eval($(window).width()-$("#dvFormat").width()-0)/2));
	$("#dvFormat").css("top",eval(eval($(window).height()-$("#dvFormat").height()-100)/2));
	$("#dvFormat").show();

	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
}
function getColDFT(data){
	if ( isOpened==0) destroyTree();														
	$("#dvColDFT").html("");
	columnsInfo=eval(data);
	for(ii=0;ii<columnsInfo.length;ii++){
		var ColumnLabel=columnsInfo[ii].COLUMN_LABEL.trim();
		var ColumnNAME=columnsInfo[ii].COLUMN_NAME.trim();
		var ColumnFORMAT=columnsInfo[ii].FORMAT.trim();
		if (ColumnLabel=="") ColumnLabel=ColumnNAME;
		//$("#dvColDFT").append("<div id='col"+ColumnNAME+"' class='srcColumn ui-widget-header ui-corner-all' name='" + ColumnNAME + "' label='"+ColumnLabel+"' fmt='"+ ColumnFORMAT +"' style='cursor:pointer;'>" + ColumnLabel + "(" + ColumnNAME + " : <span onclick=selectFMT('col"+ColumnNAME+"')>" + ColumnFORMAT + "</span>)</div>");
		$("#dvColDFT").append("<div id='col"+ColumnNAME+"' class='srcColumn ui-widget-header ui-corner-all' name='" + ColumnNAME + "' label='"+ColumnLabel+"' fmt='"+ ColumnFORMAT +"' style='cursor:pointer;'>" + ColumnLabel + "(" + ColumnNAME + " : <span>" + ColumnFORMAT + "</span>)</div>");													
	}		
	$('.srcColumn')
		.on('mousedown', function (e) {
			//console.log(".srcColumn on mousedown");
			return $.vakata.dnd.start(e, { 
				'jstree' : true, 
				'obj' : $(this), 
				'nodes' : [{ 
					id : true, 
					text: $(this).text(),
					data : [{
						'columnName' : $(this).attr("name"),
						'columnLabel' : $(this).attr("label"),
						'columnFormat' : $(this).attr("fmt")
					}]
				}] 
			}, '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + $(this).attr("name") + '</div>');
	});
	$('.srcStat')
		.on('mousedown', function (e) {
			//console.log(".srcColumn on mousedown");
			return $.vakata.dnd.start(e, { 
				'jstree' : true, 
				'obj' : $(this), 
				'nodes' : [{ 
					id : true, 
					text: $(this).text(),
					data : [{
						'columnName' : $(this).attr("name"),
						'columnLabel' : $(this).attr("label"),
						'columnFormat' : $(this).attr("fmt")
					}]
				}] 
			}, '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + $(this).attr("name") + '</div>');
	});
}
function getColUser(data){
	$("#dvColUser").html("");
	columnsInfo=eval(data);
	//console.log("columnsInfo:" );
	//console.log(columnsInfo);
	for(ii=0;ii<columnsInfo.length;ii++){
		var ColumnLabel=columnsInfo[ii].COLUMN_LABEL.trim();
		var ColumnNAME=columnsInfo[ii].COLUMN_NAME.trim();
		var ColumnFORMAT=columnsInfo[ii].FORMAT.trim();
		if (ColumnLabel=="") ColumnLabel=ColumnNAME;
		$("#dvColUser").append("<div id='col"+ColumnNAME+"' class='srcColumn ui-widget-header ui-corner-all' name='" + ColumnNAME + "' label='"+ColumnLabel+"' fmt='"+ ColumnFORMAT +"' style='cursor:pointer;'>" + ColumnLabel + "(" + ColumnNAME + " : <span onclick=selectFMT('col"+ColumnNAME+"')>" + ColumnFORMAT + "</span>)</div>");
	}		
	$('.srcColumn')
		.on('mousedown', function (e) {
			//console.log(".srcColumn on mousedown");
			return $.vakata.dnd.start(e, { 
				'jstree' : true, 
				'obj' : $(this), 
				'nodes' : [{ 
					id : true, 
					text: $(this).text(),
					data : [{
						'columnName' : $(this).attr("name"),
						'columnLabel' : $(this).attr("label"),
						'columnFormat' : $(this).attr("fmt")
					}]
				}] 
			}, '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + $(this).attr("name") + '</div>');
	});
}
function getMeasures(data){
	$("#dvMeasure").html("");
	columnsInfo=eval(data);
	//console.log("columnsInfo:" );
	//console.log(columnsInfo);
	for(ii=0;ii<columnsInfo.length;ii++){
		var ColumnLabel=columnsInfo[ii].COLUMN_LABEL.trim();
		var ColumnNAME=columnsInfo[ii].COLUMN_NAME.trim();
		var ColumnFORMAT=columnsInfo[ii].FORMAT.trim();
		if (ColumnLabel=="") ColumnLabel=ColumnNAME;
		$("#dvMeasure").append("<div id='col"+ColumnNAME+"' class='srcColumn ui-widget-header ui-corner-all' name='" + ColumnNAME + "' label='"+ColumnLabel+"' fmt='"+ ColumnFORMAT +"' style='cursor:pointer;'>" + ColumnLabel + "(" + ColumnNAME + " : <span onclick=selectFMT('col"+ColumnNAME+"')>" + ColumnFORMAT + "</span>)</div>");
	}		
	$('.srcColumn')
		.on('mousedown', function (e) {
			//console.log(".srcColumn on mousedown");
			return $.vakata.dnd.start(e, { 
				'jstree' : true, 
				'obj' : $(this), 
				'nodes' : [{ 
					id : true, 
					text: $(this).text(),
					data : [{
						'columnName' : $(this).attr("name"),
						'columnLabel' : $(this).attr("label"),
						'columnFormat' : $(this).attr("fmt")
					}]
				}] 
			}, '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + $(this).attr("name") + '</div>');
	});
}

function getAttrs(data,pid){
	//console.log("curParent : " + curParent);
	//console.log("pid : " + pid);

	var ref = $('#treeLayout').jstree(true);
	//console.log("ref");
	//console.log(ref);
	
	if (pid != "json"){
		sel=pid;
	} else {
		sel = curParent;
	}

	//console.log("sel");
	//console.log(sel);

	attrInfo=eval(data);
	for(ii=0;ii<attrInfo.length;ii++){
		var attrCode=attrInfo[ii].CODE.trim();
		var attrLabel=attrInfo[ii].LABEL.trim();
		if (attrLabel=="") attrLabel=attrCode;
		//console.log("attrLabel : " + curColumnLabel + ":" + attrLabel + ":" + curColumnName + ":" + curColumnFormat + ":" + attrCode);
		rc = ref.create_node(sel, {"text":curColumnLabel+":"+attrLabel,"type":"default","data":[{"columnsName":curColumnName,"columnsFormat":curColumnFormat,"attrCode":attrCode}]});
		//console.log("rc : " + rc);
	}	
	;
	//$("#treeLayout").jstree('open_all');
}
function getAttrsFiter(data){
	var ref = $('#treeFilter').jstree(true);
	attrInfo=eval(data);
	for(ii=0;ii<attrInfo.length;ii++){
		var attrCode=attrInfo[ii].CODE.trim();
		var attrLabel=attrInfo[ii].LABEL.trim();
		if (attrLabel=="") attrLabel=attrCode;
		rc = ref.create_node(curFilterNodeID, {"text":attrLabel,"type":"attribute","data":[{"columnsName":curColumnName,"attrCode":attrCode}]});
		//console.log("rc : " + curFilterNodeID);
	}	
	;
	//$("#treeFilter").jstree('open_all');
	$("#treeFilter").jstree("open_node", curFilterNodeID);
}


function savedTreeLayout(msg){
	treeID=msg.trim();
  $("#dvTreeName").html("["+treeID+"] "+treeName);
	alertMsg("Successfully saved Tree Layout : " + treeID);
}
function copyTree(){
	//console.log("savedTree");
	id=$("#treeLayout").jstree(true).get_selected();
	//console.log("id : " + id);
	level=trPrt(id,"");
	//console.log("level : " + level);
}
function execAjax2(url,sp_URI,isAsync,fn,dataType,param1,param2,param3,param4,param5){															
	var orgURL = url;														
	url="/SASHBI/HBIServlet?sas_forwardLocation=execSTP2";														
	if (dataType=="" || dataType=="undefined") dataType="json";														
	var param={														
			_program	: sp_URI,											
			_result		: "STREAMFRAGMENT",										
			param1		: param1,										
			param2		: param2,										
			param3		: param3,										
			param4		: param4,										
			param5		: param5 										
	}														
															
	var paramCount = Object.keys(tParams).length;														
	for (ii=0;ii<paramCount;ii++){														
		if (orgURL =="" && tParams[Object.keys(tParams)[ii]].length > 50) {													
			console.log("Value size of " + param[Object.keys(tParams)[ii]] + " too big... STP cannot proccessed.");												
		} else {													
			param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];												
		}													
	}														
	console.log("tParams");														
	console.log(tParams);														
															
	$.ajax({														
		url: url,													
		type: "post",													
		data: param,													
		dataType: dataType,													
		cache:false,													
		async: isAsync,													
		beforeSend: function() {													
			isRun=1;												
			if (isDisplayProgress==1) {												
				$("#progressIndicatorWIP").show();											
			}												
		},													
		success : function(data){													
			console.log("execAjax2 success" );												
			if (dataType=='json') console.log(data);												
			if ( param1 == "ExcelDown") dataType="XML";												
			window[fn](data,param2);//,dataType);												
		},													
		complete: function(data){													
			isRun=0;												
			$("#progressIndicatorWIP").hide();												
		},													
		error : function(xhr, status, error) {													
			console.log("ERROR: Status:" +  xhr + "error: " + error);												
			console.log(xhr);												
			console.log(status);												
			alert(error);												
		}													
	});														
}															
