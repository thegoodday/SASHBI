<%@ page language="java"
    import="java.net.URLEncoder,
				java.net.URLDecoder,
				java.io.StringWriter,
				java.io.PrintWriter,
				java.io.IOException,
				java.util.*,
				javax.swing.tree.DefaultTreeModel,
				javax.swing.tree.TreeModel,
				org.apache.log4j.*,
				com.sas.hbi.omr.MetadataObjectIf,
				com.sas.hbi.omr.MetadataSearchUtil,
				com.sas.hbi.storedprocess.StoredProcessFacade,
				com.sas.hbi.tools.MetadataUtil,
				com.sas.hbi.tools.Stub,
				com.sas.services.information.metadata.PathUrl,
				com.sas.services.information.RepositoryInterface,
				com.sas.services.session.SessionContextInterface,
				com.sas.services.user.UserContextInterface,
				com.sas.services.user.UserIdentityInterface,
				com.sas.servlet.tbeans.models.TreeNode,
				com.sas.servlet.tbeans.html.TreeView,
				com.sas.servlet.tbeans.models.TreeNode,
				com.sas.servlet.tbeans.models.TreeNodeInterface,
				com.sas.servlet.tbeans.StyleInfo,
				com.sas.util.Strings,
				com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8" %>
<%
	Logger logger = Logger.getLogger("EditLayout");
	logger.setLevel(Level.INFO);
	String contextName = application.getInitParameter("application-name");
%>

<!doctype html>
<html lang="en">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>User Defined Tree Rollup Designer</title>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/ui/jquery-ui.custom.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/bitreeviewer.js"></script>
	<script src="/<%=contextName%>/scripts/jstree/dist/jstree.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/lib/firebugx.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/lib/jquery.event.drag-2.2.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.autotooltips.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.cellcopymanager.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.cellrangedecorator.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.cellrangeselector.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.cellselectionmodel.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.checkboxselectcolumn.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.rowmovemanager.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/plugins/slick.rowselectionmodel.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/controls/slick.columnpicker.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.core.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.formatters.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.editors.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.grid.js"></script>
	<script src="/<%=contextName%>/scripts/SlickGrid/slick.dataview.js"></script>	
	<link rel="stylesheet" href="/<%=contextName%>/styles/HtmlBlue.css">
	<link rel="stylesheet" href="/<%=contextName%>/styles/custom.css" type="text/css" />
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/css/demos.css" type="text/css" >
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/themes/start/jquery.ui.all.css" type="text/css" >
	<link rel="stylesheet" href="/<%=contextName%>/scripts/SlickGrid/slick.grid.css" type="text/css" >
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jstree/dist/themes/default/style.min.css" type="text/css" />
	<style>
.condLabel{
	width:80px;
}
.condData{
	width:120px;
}
#dvRow1 {
	border:0px solid silver;
	width:1200px;
}
#dvRow2 {
	border:0px solid silver;
	float:left;
	width:355px;
	position:absolute;
	top:110px;
}
#dvRow3 {
	border:0px solid silver;
	width:510px;
	position:absolute;
	top:110px;
	left: 460px;
}
#dvRow4 {
	border:0px solid silver;
	width:410px;
	float:left;
	position:absolute;
	top:110px;
	left: 1075px;
}
#dvColumns {
	border:1px solid silver;
	width:455px;
	height:550px;
	float:top;
	overflow-y:auto;
	/*
	border:0px solid silver;padding:5px;
	*/
}
.srcStat {
	width:70px;
	padding:5px; 
	margin: 1px;
	display:inline-block; 
	font-size:9pt;
}
.srcColumn {
	width:420px;
	padding:5px; 
	margin: 1px;
	display:inline-block; 
	font-size:9pt;
}

#dvStats {
	border:1px solid silver;
	width:455px;
	height:60px;
	overflow-y:auto;
	/*
	border:0px solid red;padding:5px;
	*/
}
#treeLayout {
	border:1px solid silver;
	width:610px;
	height:550px;
	overflow-y:auto;
	/*
	float:left;
	*/
}
#treeMStats {
	border:1px solid silver;
	width:610px;
	height:190px;
	overflow-y:auto;
	/*
	float:left;
	*/
}
#treeFilter {
	border:1px solid silver;
	width:510px;
	height:714px;
	overflow-y:auto;
	/*
	float:left;
	*/
}
#dvFilterHeader{
	width:510px;
	padding-top: 5px;
	padding-bottom: 5px;
}
	</style>

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
$(document).ready(function () { 
	initTree();
	get_RPT_TYPE();
	resizeFrame();	
});	// ready
$(window).resize(function () {
	resizeFrame();
});
function resizeFrame(){
	console.log("window.width : " + $(window).width());
	$("#treeLayout").height(eval($(window).height()-$("#dvCondi").height()-223));
	$("#dvColumns").height(eval($(window).height()-$("#dvCondi").height()-93));
	$("#treeFilter").height(eval($(window).height()-$("#dvCondi").height()-60));
	$("#dvRow2").css("top",eval($("#dvCondi").height()+25)+"px");
	$("#dvRow3").css("top",eval($("#dvCondi").height()+25)+"px");
	$("#dvRow4").css("top",eval($("#dvCondi").height()+25)+"px");
	if ($(window).width() < 1280){
		$("#treeLayout").width(410);
		$("#treeMStats").width(410);
		$("#treeFilter").width(310);
		$("#dvFilterHeader").width(310);
		$("#dvRow4").css("left","875px");
	} else {
		$("#treeLayout").width(610);
		$("#treeMStats").width(610);
		$("#treeFilter").width(600);
		$("#dvFilterHeader").width(600);
		$("#dvRow4").css("left","1075px");
	}
}
function initTree(){
	$('#treeLayout').jstree({
		"core" : {
			"animation" : 3,
			"check_callback" : true, 
			"themes" : { "stripes" : true },
			//'data' : [{"text" : "Report"}]
			'data' : [
				{
					'id' : 'Report',
					'text' : 'Report',
					'state' : { 'undetermined' : true, 'selected':true ,'opened':true,'disabled':false }
				}
			]
		},		
		"contextmenu" : {
			"items" : function (data) {
				console.log(data);
				console.log(JSON.stringify(data));
				if ( data.text == "Report") return;
				return { 
					/*
					"view" : {
						label: "View Record",
						action: function(obj) {
							window.open("/" + obj.attr("id"));
						}
					},
					"create" : {
						label: "Add New", 
						action: function() {
						}
					},
					*/					
					"remove" : {
						label: "Delete", 
						action: function() {
							console.log("data");
							console.log(data); 
							var ref=$('#treeLayout').jstree(true);
							sel = ref.get_selected();
							console.log(sel);
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
		console.log(data);
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
		console.log("nodeText : " + nodeText);
		sltdTreeNode = ref.get_selected();
		console.log("Selected Nodes : ");
		console.log(sltdTreeNode);
		console.log("sltdTreeNode Count : " + sltdTreeNode.length);

		curColumnLabel=data.node.data[0].columnLabel;
		curColumnName=data.node.data[0].columnName;
		curColumnFormat=data.node.data[0].columnFormat;
		console.log("curColumnLabel : " +curColumnLabel );
		console.log("curColumnName : " +curColumnName );
		for (sii=0;sii<sltdTreeNode.length;sii++){
			sltdTreeNodeText=sltdTreeNode[sii];
			console.log("sltdTreeNodeText : " + sltdTreeNodeText);
			node=$('#treeLayout').jstree(true).get_parent(sltdTreeNodeText);
			nodeText=$('#treeLayout').jstree(true).get_text(sltdTreeNodeText);
			console.log("node at Root : " + node);
			console.log(node);
			console.log("nodeText at Root : " + nodeText);
			if (node !="#") {
				prtLevel=trPrt(sltdTreeNodeText,"");
			} else {
				prtLevel="";
			}
			console.log("prtLevel : " + prtLevel);
			execAjax("","/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout",true,"getAttrs","json",curColumnName,sltdTreeNodeText,prtLevel,curColumnFormat);
		}
		sel = [data.node.id];
		console.log("curParent : " + curParent);
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	});
	$('#treeMStats').jstree({
		"core" : {
			"animation" : 3,
			"check_callback" : true,
			"themes" : { "stripes" : true },
			//'data' : savedTree
			//"data" : [{"text":"Measures","type":"root"},{"text":"Statistics","type":"root"}]				
			"data" : [{"text":"Measures","type":"root"}]				
		},
		contextmenu : {
			"items" : function (data) {
				if ( data.text == "Measures" || data.text == "Statistics") return;
				return { 
					"remove" : {
						label: "Delete", 
						action: function() {
							var ref=$('#treeMStats').jstree(true);
							sel = ref.get_selected();
							for(ii=0; ii<sel.length; ii++){
								ref.delete_node(sel[ii]);
							}
						}
					}
				}
			}
		},  
		'plugins': ["contextmenu", "dnd", "search","state", "types", "wholerow"]
	});
	$('#treeMStats').bind("copy_node.jstree", function (e, data) {
		$("#treeMStats").jstree('open_all');
	});
	$('#treeFilter').jstree({
		"core" : {
			"animation" : 3,
			"check_callback" : true,
			"themes" : { "stripes" : true }
			//"data" : [{"text":"Fiter","type":"root"}]				
		},
		"types" : {
			"default" : {
				"icon" : ""
			},
			"column" : {
				"icon" : "/SASHBI/images/Filters.gif",
				"max_depth" : 1
			},
			"attribute" : {
				"icon" : "/SASHBI/images/Filters.gif",
				"max_depth" : -1
			}
		},	
		"contextmenu" : {
			"items" : function (data) {
				if ( data.text == "Fiter") return;
				if ( data.type == "attribute") return;
				return { 
					"remove" : {
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
		console.log(data);
		var dropFolder = data.parent;
		var columnName=data.node.data[0].columnName;
		
		var ref = $('#treeFilter').jstree(true);
		var nodeText=data.node.text;
		sltdTreeNode = ref.get_selected();
		console.log("sltdTreeNode : " + sltdTreeNode.length);
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
		console.log("curColumnLabel : " +curColumnLabel );
		console.log("curColumnName : " +curColumnName );
		curFilterNodeID=data.node.id;

		execAjax("","/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout",true,"getAttrsFiter","json",curColumnName,"","",curColumnFormat);
	});
	
	$("#dvColumns, #dvFilterVars").sortable({
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
	console.log("columnName : " + columnName);
	if (columnName.indexOf("레벨계정구분ID") > -1) {
		console.log("Found Parent Column...==========================");
		text=columnName+"_CD='"+node.data[0].attrCode.trim()+"'";
		return text;
	}
	text=trPrt(node.parent,text);
	return text;
}
function closeSaveWindow(){
	$('#dvSave').hide();
	$('#dvBG').hide();
}
function newLayout(){
	$('#treeLayout').jstree('destroy');
	$('#treeFilter').jstree('destroy');
	$('#treeMStats').jstree('destroy');
	treeID="";
	treeGroup="";
	treeName="";
	treeDesc="";  	
	initTree();
}
function openLayout(){
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvOpen").css("left",eval(eval($(window).width()-$("#dvOpen").width()-0)/2));
	$("#dvOpen").css("top",eval(eval($(window).height()-$("#dvOpen").height()-100)/2));
	$('#dvOpen').show();
	tParams=eval('[{}]');
	tParams['TREE_GROUP']="";
	execAjax("","/Products/SAS Asset and Liability Management/STPs/01.Common/getReportList",true,"renderReportList","json");
}
var gridRptList;
var dataRptList;
var dataVwRptList;
function renderReportList(data){
	console.log("renderRptList started!!!!=======================");
	var sasJsonRes=eval(data)[0];
	console.log("sasJsonRes");
	console.log(sasJsonRes);
	
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	$sasExcelHTML=data;
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path); 
	
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
		console.log("gridRptList Clicked!!!");
	});
	gridRptList.onDblClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = gridRptList.getCellFromEvent(e);
		curRowRptList = cell.row;
		console.log("gridRptList Double Clicked!!!");
	});
}
function openTreeLayout(){
	if (!gridRptList.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	console.log("openTreeLayout called!");
	closeOpenWindow();
	$("#progressIndicatorWIP").show();	
  var current_row = gridRptList.getActiveCell().row;
  treeID=dataRptList[current_row].TREE_ID;
  treeGroup=dataRptList[current_row].TREE_GROUP;
  treeName=dataRptList[current_row].TREE_NAME;
  treeDesc=dataRptList[current_row].TREE_DESC;
	console.log("TREE_ID : " + treeID);
	tParams=eval('[{}]');
	tParams['TREE_ID']=treeID;
	execAjax("openTreeRollUp","",true,"openTreeLayout2","json");
}
var filterObj;
function openTreeLayout2(data){
	layoutObj=data["0"].layout;
	filterObj=data["0"].filter;
	mstatObj=data["0"].mstat;
	console.log(layoutObj);
	console.log("filterObj");
	console.log(filterObj);
	
	var treeObj =filterObj;	
	for(ii=0; ii<treeObj.length;ii++){
		columnObj=treeObj[ii].children;
		columnName=treeObj[ii].text;
		console.log("columnObj");
		console.log(columnObj);
		for(jj=0;jj<columnObj.length;jj++){
			attr=columnObj[jj].text;
			isSelected=columnObj[jj].state.selected;
			console.log(columnName + " : " + attr + " : " + "isSelected : " + isSelected);
		}
	}
	
	$('#treeLayout').jstree('destroy');
	$('#treeFilter').jstree('destroy');
	$('#treeMStats').jstree('destroy');

	$('#treeLayout').jstree({
		"core" : {
			"animation" : 3,
			"check_callback" : true, 
			"themes" : { "stripes" : true },
			"data" : layoutObj
		},		
		"contextmenu" : {
			"items" : function (data) {
				console.log(data);
				console.log(JSON.stringify(data));
				if ( data.text == "Report") return;
				return { 
					"remove" : {
						label: "Delete", 
						action: function() {
							console.log("data");
							console.log(data); 
							var ref=$('#treeLayout').jstree(true);
							sel = ref.get_selected();
							console.log(sel);
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
		console.log(data);
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
		console.log("nodeText : " + nodeText);
		sltdTreeNode = ref.get_selected();
		console.log("Selected Nodes : ");
		console.log(sltdTreeNode);
		console.log("sltdTreeNode Count : " + sltdTreeNode.length);

		curColumnLabel=data.node.data[0].columnLabel;
		curColumnName=data.node.data[0].columnName;
		curColumnFormat=data.node.data[0].columnFormat;
		console.log("curColumnLabel : " +curColumnLabel );
		console.log("curColumnName : " +curColumnName );
		for (sii=0;sii<sltdTreeNode.length;sii++){
			sltdTreeNodeText=sltdTreeNode[sii];
			console.log("sltdTreeNodeText : " + sltdTreeNodeText);
			node=$('#treeLayout').jstree(true).get_parent(sltdTreeNodeText);
			nodeText=$('#treeLayout').jstree(true).get_text(sltdTreeNodeText);
			console.log("node at Root : " + node);
			console.log(node);
			console.log("nodeText at Root : " + nodeText);
			if (node !="#") {
				prtLevel=trPrt(sltdTreeNodeText,"");
			} else {
				prtLevel="";
			}
			console.log("prtLevel : " + prtLevel);
			execAjax("","/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout",true,"getAttrs","json",curColumnName,sltdTreeNodeText,prtLevel,curColumnFormat);
		}
		sel = [data.node.id];
		console.log("curParent : " + curParent);
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	});
	//$("#treeLayout").jstree("refresh");
	$('#treeMStats').jstree({
		"core" : {
			"animation" : 3,
			"check_callback" : true,
			"themes" : { "stripes" : true },
			"data" : mstatObj
		},
		contextmenu : {
			"items" : function (data) {
				if ( data.text == "Measures" || data.text == "Statistics") return;
				return { 
					"remove" : {
						label: "Delete", 
						action: function() {
							var ref=$('#treeMStats').jstree(true);
							sel = ref.get_selected();
							for(ii=0; ii<sel.length; ii++){
								ref.delete_node(sel[ii]);
							}
						}
					}
				}
			}
		},  
		'plugins': ["contextmenu", "dnd", "search","state", "types", "wholerow"]
	});
	$('#treeMStats').bind("copy_node.jstree", function (e, data) {
		$("#treeMStats").jstree('open_all');
	});
	$('#treeFilter').jstree({
		"core" : {
			"animation" : 3,
			"check_callback" : true,
			"themes" : { "stripes" : true },
			"data" : filterObj		
		},
		"types" : {
			"default" : {
			},
			"column" : {
				"icon" : "",
				"max_depth" : 1
			},
			"attribute" : {
				"icon" : "/SASHBI/images/Filters.gif",
				"max_depth" : -1
			}
		},	
		"contextmenu" : {
			"items" : function (data) {
				if ( data.text == "Fiter") return;
				if ( data.type == "attribute") return;
				return { 
					"remove" : {
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
		console.log(data);
		var dropFolder = data.parent;
		var columnName=data.node.data[0].columnName;
		
		var ref = $('#treeFilter').jstree(true);
		var nodeText=data.node.text;
		sltdTreeNode = ref.get_selected();
		console.log("sltdTreeNode : " + sltdTreeNode.length);
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
		console.log("curColumnLabel : " +curColumnLabel );
		console.log("curColumnName : " +curColumnName );
		curFilterNodeID=data.node.id;

		execAjax("","/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout",true,"getAttrsFiter","json",curColumnName,"","",curColumnFormat);
	});
	setTimeout("redrawFilter();",500*1);
}
function redrawFilter(){
	var treeObj =filterObj;	
	for(ii=0; ii<treeObj.length;ii++){
		columnObj=treeObj[ii].children;
		columnName=treeObj[ii].text;
		console.log("columnObj");
		console.log(columnObj);
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
		console.log("columnObj");
		console.log(columnObj);
		for(jj=0;jj<columnObj.length;jj++){
			id=columnObj[jj].id;
			attr=columnObj[jj].text;
			isSelected=columnObj[jj].state.selected;
			console.log(columnName + " : " + attr + " : " + "isSelected : " + isSelected);
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
	/*
	var treeObj =filterObj;	
	for(ii=0; ii<treeObj.length;ii++){
		columnObj=treeObj[ii].children;
		columnName=treeObj[ii].text;
		console.log("columnObj");
		console.log(columnObj);
		for(jj=0;jj<columnObj.length;jj++){
			id=columnObj[jj].id;
			attr=columnObj[jj].text;
			isSelected=columnObj[jj].state.selected;
			console.log(columnName + " : " + attr + " : " + "isSelected : " + isSelected);
			if (isSelected == true){
				attrObj=$("#treeFilter").jstree(true).get_node(id);
				$("#treeFilter").jstree(true).select_node(attrObj);
			}
		}
	}
	console.log("treeObj");
	console.log(treeObj);
	*/
	treeID="";
	$("#txtTreeGroup").val(treeGroup);
	$("#txtTreeName").val(treeName);
	$("#txtTreeDesc").val(treeDesc);
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	$("#dvSave").css("left",eval(eval($(window).width()-$("#dvOpen").width()-0)/2));
	$("#dvSave").css("top",eval(eval($(window).height()-$("#dvOpen").height()-100)/2));
	$('#dvSave').show();
}
function saveLayout(){
	if (treeID == undefined || treeID == "" ){
		$("#dvBG").css("height",$(window).height()+"px");
		$("#dvBG").width($(window).width());
		$('#dvBG').show();
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
	var objTreeMStats =$("#treeMStats").jstree(true).get_json();	
	var objFlatMStats =$("#treeMStats").jstree(true).get_json('#', { 'flat': true });	
	console.log("Saved treeLayout");
	console.log(objTreeLayout);
	console.log(objFlatLayout);
	console.log(objTreeFilter);
	console.log(objFlatFilter);
	console.log("Saved objFlatMStats");
	console.log(objFlatMStats);
	
	/*
	var treeObj =objTreeFilter;	
	for(ii=0; ii<treeObj.length;ii++){
		columnObj=treeObj[ii].children;
		columnName=treeObj[ii].text;
		console.log("columnObj");
		console.log(columnObj);
		for(jj=0;jj<columnObj.length;jj++){
			attr=columnObj[jj].text;
			isSelected=columnObj[jj].state.selected;
			console.log(columnName + " : " + attr + " : " + "isSelected : " + isSelected);
		}
	}
	
     RPT_TYPE			char(50)		label = "보고서형태"
    ,ORG_GROUP    char(30)		label = "사용부서"
    ,TREE_GROUP   char(100)		label = "트리그룹"
    ,LIBNAME			char(8)			label = "Libname"
    ,DATA_NAME    char(32)		label = "데이터명"
    ,TREE_ID			char(10)		label = "트리ID"
    ,TREE_NAME		char(10)		label = "트리명"
    ,TREE_DESC		char(100)		label = "트리설명"
    ,USERID				char(10)		label = "작성자ID"
    ,LASTUPDATE   num					label = "마지막저장일자" 	
	*/
	var RPT_TYPE=$("#sltRPT_TYPE option:selected").val();
	var ORG_GROUP="";
	var DATA_GROUP=$("#sltDATA_GROUP option:selected").val();
	var LIBRARY=$("#sltLIBRARY option:selected").val();
	//var DATA_DESC=$("#sltDATA_DESC option:selected").val();
	var DATA_NAME=$("#sltDATA_NAME option:selected").val();
	treeGroup=$("#txtTreeGroup").val();
	treeName=$("#txtTreeName").val();
	treeDesc=$("#txtTreeDesc").val();
	$("#txtTreeName").val("");
	$("#txtTreeDesc").val("");
	tParams=eval('[{}]');
	tParams['RPT_TYPE']=RPT_TYPE;
	tParams['ORG_GROUP']=ORG_GROUP;
	tParams['DATA_GROUP']=DATA_GROUP;
	tParams['LIBRARY']=LIBRARY;
	tParams['DATA_NAME']=DATA_NAME;
	if (treeID == null || treeID == undefined) treeID="";
	tParams['treeID']=treeID;
	tParams['treeGroup']=treeGroup;
	tParams['treeName']=treeName;
	tParams['treeDesc']=treeDesc;
	
	tParams['objTreeLayout']=JSON.stringify(objTreeLayout);
	tParams['objFlatLayout']=JSON.stringify(objFlatLayout);
	tParams['objTreeFilter']=JSON.stringify(objTreeFilter);
	//tParams['objFlatFilter']=JSON.stringify(objFlatFilter);
	tParams['objTreeMStats']=JSON.stringify(objTreeMStats);
	tParams['objFlatMStats']=JSON.stringify(objFlatMStats);
	
	execAjax("saveTreeRollUp","",true,"savedTreeLayout","html"); 
}
function deleteTreeLayout(){
	if (!gridRptList.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	$("#progressIndicatorWIP").show();	
  console.log("gridRptList.getActiveCell() : " + gridRptList.getActiveCell());
  if (gridRptList.getActiveCell() == null) {
  	alertMsg("Select Tree Rollup Layout for delete.");
  	return;
  }
  var current_row = gridRptList.getActiveCell().row;
	var dataRptList = gridRptList.getData();
	console.log(dataRptList);
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
  console.log("gridRptList.getActiveCell() : " + gridRptList.getActiveCell());
  if (gridRptList.getActiveCell() == null) {
  	alertMsg("Select Tree Rollup Layout for update.");
  	return;
  }
  var current_row = gridRptList.getActiveCell().row;
  treeID=dataRptList[current_row].TREE_ID;
  treeName=dataRptList[current_row].TREE_NAME;
  treeDesc=dataRptList[current_row].TREE_DESC;

	treeGroup=dataRptList[current_row].TREE_GROUP;

  console.log("treeID : " + treeID);

	var RPT_TYPE=$("#sltRPT_TYPE option:selected").val();
	var ORG_GROUP="";
	var DATA_GROUP=$("#sltDATA_GROUP option:selected").val();
	var LIBRARY=$("#sltLIBRARY option:selected").val();
	var DATA_NAME=$("#sltDATA_NAME option:selected").val();
	$("#txtTreeName").val("");
	$("#txtTreeDesc").val("");
	tParams=eval('[{}]');
	tParams['RPT_TYPE']=RPT_TYPE;
	tParams['ORG_GROUP']=ORG_GROUP;
	tParams['DATA_GROUP']=DATA_GROUP;
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
	console.log($("#"+obj).html());
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
function getColumns(data){
	$("#dvColumns").html("");
	columnsInfo=eval(data);
	console.log("columnsInfo:" );
	console.log(columnsInfo);
	for(ii=0;ii<columnsInfo.length;ii++){
		var ColumnLabel=columnsInfo[ii].COLUMN_LABEL.trim();
		var ColumnNAME=columnsInfo[ii].COLUMN_NAME.trim();
		var ColumnFORMAT=columnsInfo[ii].FORMAT.trim();
		if (ColumnLabel=="") ColumnLabel=ColumnNAME;
		$("#dvColumns").append("<div id='col"+ColumnNAME+"' class='srcColumn ui-widget-header ui-corner-all' name='" + ColumnNAME + "' label='"+ColumnLabel+"' fmt='"+ ColumnFORMAT +"' style='cursor:pointer;'>" + ColumnLabel + "(" + ColumnNAME + " : <span onclick=selectFMT('col"+ColumnNAME+"')>" + ColumnFORMAT + "</span>)</div>");
	}		
	$('.srcColumn')
		.on('mousedown', function (e) {
			console.log(".srcColumn on mousedown");
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
			console.log(".srcColumn on mousedown");
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
	console.log("curParent : " + curParent);

	var ref = $('#treeLayout').jstree(true);
	if (pid != ""){
		sel=pid;
	} else {
		sel = curParent;
	}

	
	attrInfo=eval(data);
	for(ii=0;ii<attrInfo.length;ii++){
		var attrCode=attrInfo[ii].CODE.trim();
		var attrLabel=attrInfo[ii].LABEL.trim();
		if (attrLabel=="") attrLabel=attrCode;
		rc = ref.create_node(sel, {"text":curColumnLabel+":"+attrLabel,"type":"default","data":[{"columnsName":curColumnName,"columnsFormat":curColumnFormat,"attrCode":attrCode}]});
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
	}	
	;
	//$("#treeFilter").jstree('open_all');
	$("#treeFilter").jstree("open_node", curFilterNodeID);
}

function execAjax(url,sp_URI,isAsync,fn,dataType,param1,param2,param3,param4,param5){
	var orgURL = url;
	if (url=="") { url="/SASStoredProcess/do?"; }
	else { 
		url="/SASHBI/HBIServlet?sas_forwardLocation=" + url; 
	}	
	if (dataType=="" || dataType=="undefined") dataType="json";
	var param={
			_program	: "SBIP://METASERVER"+sp_URI+"(StoredProcess)",
			_result     : "STREAMFRAGMENT",
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
			console.log("execAjax success" );
			if (dataType=='json') console.log(data);
			if ( param1 == "ExcelDown") dataType="XML";
			window[fn](data,param2);//,dataType);
		},
		complete: function(data){
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" +  xhr + "error: " + error);
			console.log(xhr);
			console.log(status);
			alert(error);
		}
	});
}
function savedTreeLayout(msg){
	treeID=msg.trim();
	alertMsg("Successfully saved Tree Layout : " + treeID);
}
function copyTree(){
	console.log("savedTree");
	id=$("#treeLayout").jstree(true).get_selected();
	console.log("id : " + id);
	level=trPrt(id,"");
	console.log("level : " + level);
	/*
	console.log(savedTree);
	var mytext = JSON.stringify(savedTree);
	console.log(mytext);
	$('#treeMStats').jstree({
		"core" : {
			"animation" : 3,
			"check_callback" : true, 
			"themes" : { "stripes" : true },
			//'data' : savedTree
	    'data' : [
					{ "text" : "Analysis Vars"}
				]
		},
		'plugins': ["dnd", "search","state", "types", "wholerow"]
	});
	*/
}
function getParamVal(sp_URI,tableName,colName,target,libStmt,param1,param2,param3,param4,param5,param6,param7){
	submitCondCount++;
	if (isDisplayProgress==1) $("#progressIndicatorWIP").show(); 
	var RPT_TYPE=$("#sltRPT_TYPE option:selected").val();
	var DATA_GROUP=$("#sltDATA_GROUP option:selected").val();
	var LIBRARY=$("#sltLIBRARY option:selected").val();
	var DATA_DESC=$("#sltDATA_DESC option:selected").val();
	var DATA_NAME=$("#sltDATA_NAME option:selected").val();
	var param={
			_program	: sp_URI,
			_result     : "STREAMFRAGMENT",
			libStmt		: libStmt,
			tableName	: tableName,
			colName		: colName,
			target		: target,
			RPT_TYPE	:  RPT_TYPE,
			DATA_GROUP	:  DATA_GROUP,
			LIBRARY	:  LIBRARY,
			DATA_DESC	:  DATA_DESC,
			DATA_NAME	:  DATA_NAME,
			param1		: param1,
			param2		: param2,
			param3		: param3,
			param4		: param4,
			param5		: param5
	}
	$.ajax({
		url: "/SASStoredProcess/do?",
		data: param,
		dataType: 'html',
		cache:false,
		async: true,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show(); 
		},
		complete : function(data){
			$("#dvDummy").hide();
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
			$("#progressIndicatorWIP").hide();
			isRun=0;
      },
	});
}

function get_RPT_TYPE(){
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.COL_INFO_MST","RPT_TYPE","RPT_TYPE","libname+ALMConf+list%3B","","","","","false","","true");
}
function get_DATA_GROUP(){
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.COL_INFO_MST","DATA_GROUP","DATA_GROUP","libname+ALMConf+list%3B","RPT_TYPE=RPT_TYPE:","","","","false","","true");
}
function get_LIBRARY(){
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.COL_INFO_MST","LIBNAME","LIBRARY","libname+ALMConf+list%3B","RPT_TYPE=RPT_TYPE:DATA_GROUP=DATA_GROUP:","","","","false","","true");
}
function get_DATA_DESC(){
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.COL_INFO_MST","DATA_DESC","DATA_DESC","libname+ALMConf+list%3B","LIBNAME=LIBRARY:","","","","false","","true");
}
function get_DATA_NAME(){
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.COL_INFO_MST","DATA_NAME","DATA_NAME","libname+ALMConf+list%3B","LIBNAME=LIBRARY:","","","","false","MASTER01                        ","true");
}
function onChange_RPT_TYPE(){
	get_DATA_GROUP();
	get_LIBRARY();
}
function onChange_DATA_GROUP(){
	get_LIBRARY();
}
function onChange_LIBRARY(){
	get_DATA_DESC();
	get_DATA_NAME();
}
function onChange_DATA_DESC(){
	var LIBRARY=$("#sltLIBRARY option:selected").val();
	var DATA_NAME=$("#sltDATA_NAME option:selected").val();
	execAjax("","/Products/SAS Asset and Liability Management/STPs/01.Common/getColumnsLayout",true,"getColumns","json",LIBRARY,DATA_NAME);
	setTimeout("$('#treeLayout').jstree('select_node','#Report')",500*1);
}


	</script>
</head>
<body style="margin:0px 0px 0px 0px;overflow-y: hidden;" scroll=hidden>
	<div id=dvCondi>
		<table width="100%">
		    <tr>
		        <td width=10 style=b><img src="/SASHBI/images/ico_titleType2.png" border="0"  style="padding-top:5px;"></td>
		        <th class="t ReportTitle">Tree Rollup Management</th>
	           <td align="right" v-align="bottom">
	           </td>
		    </tr>
		    <tr id="condBottomMargin" style="height:10px;">
		    </tr>
		</table>
		<div id="dvCondTable">
		<table class="condTable" cellspacing="0" cellpadding="0" >
			<tr>
				<td style="border:0px solid #ff0000;">

		<span class='titleimg condItem' >
			<table id=cdTblRPT_TYPE class=itemTable>
				<tr><td id=cdLabelRPT_TYPE class='condLabel'>보고서형태</td><td id=cdDataRPT_TYPE class=condData>
					<select id=sltRPT_TYPE name=sltRPT_TYPE size=1 alt='null' onChange="onChange_RPT_TYPE();" ></select></td>
						</tr></table></span>
		<span class='titleimg condItem' >
			<table id=cdTblDATA_GROUP class=itemTable><tr><td id=cdLabelDATA_GROUP class='condLabel'>데이터그룹</td><td id=cdDataDATA_GROUP class=condData>
				<select id=sltDATA_GROUP name=sltDATA_GROUP size=1 alt='null' onChange="onChange_DATA_GROUP();" ></select>
				</td></tr></table></span>
		<span class='titleimg condItem' >
			<table id=cdTblLIBRARY class=itemTable><tr><td id=cdLabelLIBRARY class='condLabel'>Library</td><td id=cdDataLIBRARY class=condData>
				<select id=sltLIBRARY name=sltLIBRARY size=1 alt='null' onChange="onChange_LIBRARY();" ></select>
				</td></tr></table></span>
		<span class='titleimg condItem' >
			<table id=cdTblDATA_DESC class=itemTable><tr><td id=cdLabelDATA_DESC class='condLabel'>데이터</td><td id=cdDataDATA_DESC class=condData>
				<select id=sltDATA_DESC name=sltDATA_DESC size=1 alt='null' onChange="onChange_DATA_DESC();"></select></td></tr></table></span>
		<span class='titleimg condItem' style='display:none;'>
			<table id=cdTblDATA_NAME class=itemTable><tr><td id=cdLabelDATA_NAME class='condLabel'>DATA_NAME</td><td id=cdDataDATA_NAME class=condData>
				<select id=sltDATA_NAME name=sltDATA_NAME size=1 alt='null' ></select></td></tr></table></span>
		<!--
		<span class='titleimg condItem' >
			<table id=cdTblTreeGroup class=itemTable><tr><td id=cdLabelTreeGroup class='condLabel'>구분</td><td id=cdDataTreeGroup class=condData>
				<select id=sltTreeGroup name=sltTreeGroup size=1 alt='null' onChange="onChange_TreeGroup();" ></select>
				</td></tr></table></span>
		-->
		
		<input type="button" class="condBtn" value="Save as..." onclick="saveAsLayout();" style="position:relative;float:right;padding-right:10px;margin-right:13px;">
		<input type="button" class="condBtn" value="Save" onclick="saveLayout();" style="position:relative;float:right;padding-right:10px;margin-right:10px;">
		<input type="button" class="condBtn" value="Open" onclick="openLayout();" style="position:relative;float:right;padding-right:10px;margin-right:10px;">
		<input type="button" class="condBtn" value="New" onclick="newLayout();" style="position:relative;float:right;padding-right:10px;margin-right:10px;">
		<!--input type="button" class="condBtn" value="Copy Layout" onclick="copyTree();"-->
	
	
				</td>
			</tr>
		</table>
		</div>
	</div>	
	<div id=dvRow1>
	</div>
	<div id=dvRow2>
		<div id="dvColumns">	</div>    
		<div id="dvStats">	
			<div class='srcStat ui-widget-header ui-corner-all' name='Sum'>N</div>
			<div class='srcStat ui-widget-header ui-corner-all' name='Sum'>Sum</div>
			<div class='srcStat ui-widget-header ui-corner-all' name='Mean'>Mean</div>
			<div class='srcStat ui-widget-header ui-corner-all' name='StdDev'>StdDev</div>
			<div class='srcStat ui-widget-header ui-corner-all' name='Min'>Min</div>
			<div class='srcStat ui-widget-header ui-corner-all' name='Max'>Max</div>
			<div class='srcStat ui-widget-header ui-corner-all' name='SumWgt'>SumWgt</div>
		</div>    
	</div>
	<div id=dvRow3>
    <div id="treeLayout" class="jstree jstree-default" ></div>
    <div id="treeMStats" class="jstree jstree-default" ></div>
	</div>
	<div id=dvRow4>
    <div id="dvFilterHeader" class="ui-widget-header" align=center>Filter</div>
    <div id="treeFilter" class="jstree jstree-default"></div>
	</div>

	
	<div id=dvSave style="position: absolute;width:490px;display:none;padding: 15px;z-index: 100001;
		background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
		<div id=dvSaveEdit style="font-size:11pt;padding:15px 0px 15px 0px;">
			<table>
			<tr>
				<td style="font-size:9pt;font-weight:bold;">Type</td>
				<td>: <input id=txtTreeGroup type=text width=200 value="" style="width:400px" /></td>
			</tr>
			<tr>
				<td style="font-size:9pt;font-weight:bold;">Name</td>
				<td>: <input id=txtTreeName type=text width=200 value="" style="width:400px" /></td>
			</tr>
			<tr>
				<td style="font-size:9pt;font-weight:bold;">Description</td>
				<td>: <input id=txtTreeDesc type=text width=200 value="" style="width:400px" /></td>
			</tr>
			</table>
		</div>
		<div align=center>
			<input type=button id="" class="condBtn" value="Save" onclick="saveTreeLayout();">
			<input type=button id="" class="condBtn" value="Cancel" onclick="closeSaveWindow();">
		</div>
	</div>
	<div id=dvOpen style="position: absolute;width:542px;display:none;padding: 15px;z-index: 100001;
		background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
		<div id=dvRptList style="font-size:11pt;padding:15px 0px 15px 0px;height:200px;">
		</div>
		<div align=center>
			<input type=button id="" class="condBtn" value="Open" onclick="openTreeLayout();">
			<input type=button id="" class="condBtn" value="Update" onclick="updateTreeLayout();">
			<input type=button id="" class="condBtn" value="Delete" onclick="deleteTreeLayout();">
			<input type=button id="" class="condBtn" value="Cancel" onclick="closeOpenWindow();">
		</div>
	</div>
	<div id=dvFormat style="position: absolute;width:300px;display:none;padding: 15px;z-index: 100001;
		background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
		<div id=dvFormatEdit style="font-size:11pt;padding:15px 0px 15px 0px;">
			<table>
			<tr><td style="font-size:9pt;font-weight:bold;">Column Name 	</td><td>: <span id=columnName style="font-weight:normal;font-size:9pt;"></span></td></tr>
			<tr><td style="font-size:9pt;font-weight:bold;">Column Label 	</td><td>: <span id=columnLabel style="font-weight:normal;font-size:9pt;"></span></td></tr>
			<tr><td style="font-size:9pt;font-weight:bold;">Format 				</td><td>: <input id=columnFormat type=text width=40 value="" style="width:180px" /></td></tr>
			</table>
		</div>
		<div align=center>
			<input type=button id="" class="condBtn" value="Save" onclick="saveFormat();">
			<input type=button id="" class="condBtn" value="Cancel" onclick="closeFormatWindow();">
		</div>
	</div>
	<div id=dvAlert style="position: absolute;width:300px;display:none;padding: 15px;z-index: 100001;
		background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
		<div id=dvMsgBox style="font-size:11pt;padding:15px 0px 15px 0px;"></div>
		<div align=center> 
			<input type=button id="btnAlertMsgOK" class="condBtn" value="OK" onclick="hideMsgBox();">
		</div>
	</div>
	<div id=dvConfirm style="position: absolute;width:300px;display:none;padding: 15px;z-index: 100001;
		background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
		<div id=dvConfirmMsgBox style="font-size:11pt;padding:15px 0px 15px 0px;"></div>
		<div align=center>
			<input type=button id="btnConfirmMsgOK"     class="condBtn" value="OK"     onclick="hideConfirmMsgBox(true,confirmFN);">
			<input type=button id="btnConfirmMsgCancel" class="condBtn" value="Cancel" onclick="hideConfirmMsgBox(false);">
		</div>
	</div>
	<div id=dvBG style="position: absolute;top:0px;left:0px;display:none;z-index: 100000;background: #efefef;opacity: 0.8;"></div>
	<div id=dvDummy style="display:none;width:1000000"></div>
<script>
</script>
</body>
</html>