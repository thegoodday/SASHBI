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
$(document).ready(function () { 
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
		rc = ref.create_node(sel, {"text":attrLabel,"type":"default","data":[{"columnsName":curColumnName,"attrCode":attrCode}]});
	}	
	;
	console.log(ref);
	var v =$("#treeLayout").jstree(true).get_json('#', { 'flat': true });	
	console.log("TEST");
	console.log(v);
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
	</script>
</head>
<body style="border:0px solid #ff0000;margin:0px 0px 0px 0px;overflow-y: hidden;" scroll=hidden>
	<div id="dvColumns" style="width:330px;height:800px;float:left;border:1px solid silver;padding:5px;">
		<!--
    <div class="srcColumn">Column 1</div>
    <div class="srcColumn">Column 2</div>
    <div class="srcColumn">Column 3</div>
    <div class="srcColumn">Column 4</div>
    -->
	</div>    
	<div style="width:400px;height:800px;float:left;border:1px solid silver;;padding:5px;">
    <div id="treeLayout" class="jstree jstree-default" style="width:400px;height:400px;"></div>
	</div> 
	<div class="someWrapperClassInSource"> </div>
	<script>
$(function () {
	$('#treeLayout').jstree({
	  "core" : {
	    "animation" : 3,
	    "check_callback" : true, 
	    /*
	    function(data){
	    	drag 시 move_node, drop : copy_node
	    	console.log("check_callback");
	    	console.log(data);
	    	return true;
	    },
			*/
	    "themes" : { "stripes" : true },
	    'data' : [
					{ "text" : "Root node"}
				]
	  },
		"crrm" : {
			input_width_limit : 200,
			move : {
				always_copy     : "multitree", // false, true or "multitree"
				open_onmove     : false,
				default_position: "last",
				check_move      : function (m) { 
					console.log("m");
					console.log(m);
					if(!m.np.hasClass("someClassInTarget")) return false;
					if(!m.o.hasClass("someClassInSource")) return false;
					return true;
				}
			}
		},	  
		"dnd" : {
			"drop_finish" : function () { 
				alert("DROP"); 
			},
			"drag_check" : function (data) {
				console.log("drag");
				if(data.r.attr("id") == "phtml_1") {
					return false;
				}
				return { 
					after : false, 
					before : false, 
					inside : true 
				};
			},
			"drag_finish" : function (data) { 
				console.log("drag");
				alert("DRAG OK"); 
			}
		},
/*	  
		"dnd" : {
			copy_modifier   : $.noop,
			drop_target     : ".someWrapperClassInSource",
			drop_check      : function (data) { return true; },
			drop_finish     : function (data) {
				$.jstree._reference(this.get_container()).remove($(data.o));
			},
			drag_target     : ".someClassInSource",
			drag_finish     : function (data) {;},
			drag_check      : function (data) { return { after : false, before : false, inside : true }; }
		},
*/		
/*	  
		"dnd" : {
    	is_draggable : function () {
				console.log("is_drag");			// Drag 할 수 있는 오브젝트인지 확인하는... 
      	return false;//is_dragging_allowed;
      }
    },
*/	
		//'plugins': ["themes", "html_data", "crrm", "dnd"]
		'plugins': ["contextmenu", "dnd", "search","state", "types", "wholerow"]
	});
	/*
	$(document)
		.on('dnd_move.vakata', function (e, data) {
			//console.log("on dnd_move.vakata");
			//console.log(data);
			var t = $(data.event.target);
			if(!t.closest('.jstree').length) {
				if(t.closest('.drop').length) {
					//data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
				}
				else {
					//data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
				}
			}
		})
		.on('dnd_stop.vakata', function (e, data) {
			var t = $(data.event.target);
			console.log("t");
			console.log(t);
			console.log("data.element");
			console.log(data.element);
			console.log("closest");
			console.log(t.closest('.drop'));
			if(!t.closest('.jstree').length) {
				if(t.closest('.drop').length) {
					//$(data.element).clone().appendTo(t.closest('.drop'));
					// node data: 
					// if(data.data.jstree && data.data.origin) { console.log(data.data.origin.get_node(data.element); }
				}
			}
		});
	*/
	$('#treeLayout').bind("copy_node.jstree", function (e, data) {
		console.log(data);
		var ref = $('#treeLayout').jstree(true);
		curParent = data.node.parent;
		var nodeText=data.node.text;
		curColumnName=nodeText.substring(eval(nodeText.indexOf("(")+1),eval(nodeText.length-1));
		console.log("curColumnName : " +curColumnName );
		execAjax("","/Products/SAS Asset and Liability Management/STPs/01.Common/getAttrsLayout",true,"getAttrs","json",curColumnName);

		sel = [data.node.id];
		console.log(data.node.id);
		console.log("curParent : " + curParent);
		if(!sel.length) { return false; }
		ref.delete_node(sel);
	});
});
function testit(){
		var ref = $('#treeLayout').jstree(true),
		sel = ref.get_selected();
		console.log(sel);
		if(!sel.length) { return false; }
		ref.delete_node(sel);
}
	</script>
<input type=button onclick=testit()>delete</input>
</body>
</html>