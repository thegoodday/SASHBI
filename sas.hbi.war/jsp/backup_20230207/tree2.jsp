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
	<title>SASHBI Designer</title>
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
.srcColumn {
	width:320px;
	padding:5px; 
	margin: 1px;
	display:inline-block; 
	font-size:9pt;
}
	</style>
  <script>
var curParent ;
var curColumnName ;
var curColumnLabel;
var savedTree;
$(document).ready(function () { 
	$('#treeLayout').jstree({
		"core" : {
			"animation" : 3,
			"check_callback" : true, 
			"themes" : { "stripes" : true },
			'data' : [
				{ "text" : "Report"}
			]
		},
		contextmenu : {
			"items" : function (data) {
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
		'plugins': ["contextmenu", "dnd", "search","state", "types", "wholerow"]
	});
	$('#treeLayout').bind("copy_node.jstree", function (e, data) {
		console.log(data);
		var ref = $('#treeLayout').jstree(true);
		curParent = data.node.parent;
		var nodeText=data.node.text;
		curColumnLabel=nodeText.substring(0,eval(nodeText.indexOf("(")+0));
		curColumnName=nodeText.substring(eval(nodeText.indexOf("(")+1),eval(nodeText.length-1));
		console.log("curColumnLabel : " +curColumnLabel );
		console.log("curColumnName : " +curColumnName );
		execAjax("","/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout",true,"getAttrs","json",curColumnName);

		sel = [data.node.id];
		console.log(data.node.id);
		console.log("curParent : " + curParent);
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	});
	$('#treeLayout2').jstree({
		"core" : {
			"animation" : 3,
			"check_callback" : true,
			"themes" : { "stripes" : true },
			//'data' : savedTree
			"data" : [{"text":"Measures","type":"root"},{"text":"Statistics","type":"root"}]				
		},
		contextmenu : {
			"items" : function (data) {
				return { 
					"remove" : {
						label: "Delete", 
						action: function() {
							var ref=$('#treeLayout2').jstree(true);
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
	$('#treeLayout2').bind("copy_node.jstree", function (e, data) {
		$("#treeLayout2").jstree('open_all');
	});
	
	execAjax("","/Products/SAS Asset and Liability Management/STPs/01.Common/getColumnsLayout",true,"getColumns","json");
});
$(window).resize(function () {
});
function getColumns(data){
	columnsInfo=eval(data);
	console.log("columnsInfo:" );
	console.log(columnsInfo);
	for(ii=0;ii<columnsInfo.length;ii++){
		var ColumnLabel=columnsInfo[ii].COLUMN_LABEL.trim();
		var ColumnNAME=columnsInfo[ii].COLUMN_NAME.trim();
		if (ColumnLabel=="") ColumnLabel=ColumnNAME;
		$("#dvColumns").append("<div class='srcColumn ui-widget-header ui-corner-all' data='" + ColumnNAME + "'>" + ColumnLabel + "(" + ColumnNAME + ")</div>");
	}		
	$('.srcColumn')
		.on('mousedown', function (e) {
			console.log(".srcColumn on mousedown");
			return $.vakata.dnd.start(e, { 'jstree' : true, 'obj' : $(this), 'nodes' : [{ id : true, text: $(this).text() }] }, '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + $(this).text() + '</div>');
	});
		
}
function getAttrs(data){
	console.log("curParent : " + curParent);

	var ref = $('#treeLayout').jstree(true);
	sel = curParent;
	
	attrInfo=eval(data);
	console.log("attrInfo:" );
	console.log(attrInfo);
	for(ii=0;ii<attrInfo.length;ii++){
		var attrCode=attrInfo[ii].CODE.trim();
		var attrLabel=attrInfo[ii].LABEL.trim();
		if (attrLabel=="") attrLabel=attrCode;
		rc = ref.create_node(sel, {"text":curColumnLabel+":"+attrLabel,"type":"default","data":[{"columnsName":curColumnName,"attrCode":attrCode}]});
	}	
	;
	//$("#treeLayout").jstree('open_all');
}
function execAjax(url,sp_URI,isAsync,fn,dataType,param1,param2,param3){
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
			param3		: param3
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
			window[fn](data,dataType);
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
function saveTree(){
	//var v =$("#treeLayout").jstree(true).get_json('#', { 'flat': false });	
	var v =$("#treeLayout").jstree(true).get_json();	
	console.log("TEST");
	console.log(v);
	savedTree=v;
	alertMsg("Saved...");
}
function copyTree(){
	console.log("savedTree");
	console.log(savedTree);
	var mytext = JSON.stringify(savedTree);
	console.log(mytext);
	$('#treeLayout2').jstree({
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

}

	</script>
</head>
<body style="margin:0px 0px 0px 0px;overflow-y: hidden;" scroll=hidden>
	<style>
#dvRow1 {
	border:0px solid silver;
}
#dvRow2 {
	border:0px solid silver;
	float:left;
	width:355px;
}
#dvRow3 {
	border:0px solid silver;
	width:410px;
	float:left;
}
#dvColumns {
	border:1px solid silver;
	width:355px;
	height:700px;
	float:top;
	overflow-y:auto;
	/*
	border:0px solid silver;padding:5px;
	*/
}
#dvStats {
	border:1px solid silver;
	width:355px;
	height:200px;
	overflow-y:auto;
	/*
	border:0px solid red;padding:5px;
	*/
}
#treeLayout {
	border:1px solid silver;
	width:410px;
	height:700px;
	/*
	float:left;
	*/
}
#treeLayout2 {
	border:1px solid silver;
	width:410px;
	height:200px;
	/*
	float:left;
	*/
}
	</style>
	<div id=dvRow1>
		<input type="button" class="condBtn" value="Save Layout" onclick="saveTree();">
		<input type="button" class="condBtn" value="Copy Layout" onclick="copyTree();">
	</div>
	<div id=dvRow2>
		<div id="dvColumns">	</div>    
		<div id="dvStats">	
			<div class='srcColumn ui-widget-header ui-corner-all' data='Sum'>N</div>
			<div class='srcColumn ui-widget-header ui-corner-all' data='Sum'>Sum</div>
			<div class='srcColumn ui-widget-header ui-corner-all' data='Mean'>Mean</div>
			<div class='srcColumn ui-widget-header ui-corner-all' data='StdDev'>StdDev</div>
			<div class='srcColumn ui-widget-header ui-corner-all' data='Min'>Min</div>
			<div class='srcColumn ui-widget-header ui-corner-all' data='Max'>Max</div>
			<div class='srcColumn ui-widget-header ui-corner-all' data='SumWgt'>SumWgt</div>
		</div>    
	</div>
	<div id=dvRow3>
    <div id="treeLayout" class="jstree jstree-default" ></div>
    <div id="treeLayout2" class="jstree jstree-default" ></div>
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

</body>
</html>