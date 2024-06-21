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

<jsp:useBean id="stpNote" class="com.sas.hbi.tools.STPNote"/>
<jsp:useBean id="Stub" class="com.sas.hbi.tools.Stub"/>

<%

	Logger logger = Logger.getLogger("STPRV");
	logger.setLevel(Level.ERROR);
	String contextName = application.getInitParameter("application-name");
	String stpObjID =null;
	StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_STPRV");
	stpObjID=facade.getMetaID();
	logger.info("stpObjID:"+stpObjID);
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth");
	String principal=(String) id.getPrincipal();
	String credential=(String) id.getCredential();

	stpNote.setStpObjId(stpObjID);
	String layoutStr="";
	layoutStr=stpNote.getSTPNote(sci,"Layout");
	logger.debug("layoutStr:"+layoutStr);


	MetadataSearchUtil msu = new MetadataSearchUtil(null);
	msu.init(principal,credential, "localhost", "8561");
	msu.setLoadStoredProcesses(true);
	msu.setSortEntriesByName(true);
	msu.setDispEntriesByDesc(true);
	msu.setHideUserNodes(true);
	List rootList = msu.getRootFolders();
	String[] fLists = new String[rootList.size()];
	for (int i=0;  i<rootList.size(); i++){
		String nn=rootList.get(i).toString();
		fLists[i] = nn;
		logger.info("fLists:"+nn);
	}
	//MetadataObjectIf moif = msu.buildTreeHierarchy(new String[] { portalName });
	MetadataObjectIf moif = msu.buildTreeHierarchy2(fLists);


	TreeView treeView = new TreeView();
	DefaultTreeModel treeModel = new DefaultTreeModel(moif.getTreeNode());
	treeView.setModel(treeModel);
	treeView.setExpansionLevel(TreeView.FULLYEXPANDED);				// initially expand all levels
	treeView.setTarget("_self");															// opens the report in place
	treeView.getFormObject().setAction(request.getContextPath() + "/main.do");
	treeView.setNodeLoading(TreeView.FULL);
	treeView.setAutoChildrenVerify(true);
	treeView.setRootNodeVisible(false);
%>

<!doctype html>
<html lang="en">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<script type="text/javascript" src="/<%=contextName%>/scripts/sas_Bootstrap.js"></script>
	<script type="text/javascript">
	/*<![CDATA[*/
	sas.setJavaScriptLocation("/<%=contextName%>/scripts/");
	sas.requires("sas_Common");
	/*]]>*/
	</script>
	<script src="/<%=contextName%>/scripts/sas_Common.js" type="text/javascript"></script>
	<script type="text/javascript">/*<![CDATA[*/sas_includeDojo('/<%=contextName%>/scripts/dojo/');/*]]>*/</script>
	<script src="/<%=contextName%>/scripts/dojo/dojo.js" type="text/javascript" ></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/ui/jquery-ui.custom.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/bitreeviewer.js"></script>
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
	<link rel=stylesheet href="/<%=contextName%>/styles/HtmlBlue.css">
	<link rel=stylesheet href="/<%=contextName%>/styles/Portal.css" type="text/css" />
	<link rel=stylesheet href="/<%=contextName%>/styles/custom.css" type="text/css" />
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/css/demos.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/themes/start/jquery.ui.all.css">
	<link rel="stylesheet" type="text/css" href="/<%=contextName%>/scripts/SlickGrid/slick.grid.css">

<style>
  body {
  	/*
    min-width: 520px;
    */
  }
  input {border: 0px solid #ffffff; }
  select {border: 0px solid #ffffff;width:267px; }
  .data {padding: 0px 7px 0px 7px;}
  .column {
    width: 500px;
    float: left;
    padding-top: 15px;
    padding-right: 15px;
    padding-left: 15px;
    padding-bottom: 15px;
    border: 1px solid #000077;
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .portlet {
    width: 141px;
    float: left;
    margin: 0 1em 1em 0;
    padding: 0.3em;
  }
  .portlet-header {
    padding: 0.2em 0.3em;
    margin-bottom: 0.5em;
    position: relative;
  }
  .portlet-toggle {
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -8px;
  }
  .portlet-content {
    padding: 0.4em;
  }
  .portlet-placeholder {
    border: 1px dotted black;
    margin: 0 1em 1em 0;
    height: 50px;
  }
  </style>
  <script>
<%
	if (layoutStr != null && layoutStr.length() > 10 ) {
%>
var savedLayObj=<%=layoutStr%>;
console.log("savedLayObj");
console.log(savedLayObj);
var layoutObj={};
<%
	} else {
%>
var layoutObj={
			Object1 : {
				"id":"","stp":"","width":"","height":"","float":"","style":"","type":"",
				"tag":"",
				"graph_type":"BarChart","grp_opt":" ","grp_stmt":" ","x_slider":"","pie_height":"","pie_width":"",
				"sort":"","cl_stp":"","cl_fn":"","cl_param":"","dbl_stp":"","dbl_fn":"","dbl_param":""}
		};
<%
}
%>
var curObj;
var curPObj;
var curPName;
$(window).resize(function () {
	//$(".inputAttr").css("width",eval($(window).width()-780)+"px");
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-0)/2));
}); 
$(function() {
	$(".column").sortable({
		connectWith: ".column",
		handle: ".portlet-header",
		cancel: ".portlet-toggle",
		placeholder: "portlet-placeholder ui-corner-all"
	});
	$(".portlet")
		.addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
		.find( ".portlet-header" )
		.addClass( "ui-widget-header ui-corner-all" )
		.prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

	$(".portlet-toggle" ).click(function() {
		var icon = $( this );
		icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
		icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
	});
	//$("#dvAttr").width($(window).width()-600);
	//$(".inputAttr").css("width",eval($(window).width()-780)+"px");
	$(".inputAttr").css("border","1px solid #white");

	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-0)/2));
});
var gridClickSTP;
var dataClickSTP = [];
var gridDblClickSTP;
var dataDblClickSTP = [];
var columns = [
	{id: "columnName", name: "Column", field: "columnName", width: 100, cssClass: "l", editor: Slick.Editors.Text},
	{id: "stp", name: "STP", field: "stp", width: 120, editor: Slick.Editors.Text},
	{id: "funcName", name: "Function", field: "funcName", width: 100, editor: Slick.Editors.Text},
	{id: "params", name: "Parameters", field: "params", width: 160, editor: Slick.Editors.Text}
];
var options = {
	editable: true,
	enableAddRow: true,
	enableCellNavigation: true,
	asyncEditorLoading: false,
	autoEdit: false
};

function delDblSTP(){
	if (gridDblClickSTP.getActiveCell() == null){
		return;
	}

  var dataDblClickSTP = gridDblClickSTP.getData();
  var current_row = gridDblClickSTP.getActiveCell().row;
  dataDblClickSTP.splice(current_row,1);
  var r = current_row;
  while (r<dataDblClickSTP.length){
    gridDblClickSTP.invalidateRow(r);
    r++;
  }
  gridDblClickSTP.updateRowCount();
  gridDblClickSTP.render();
  gridDblClickSTP.scrollRowIntoView(current_row-1);  
}
function renderDBL_STP(data){
	console.log("data : " + data);
	if (data == undefined){
		console.log("dataDblClickSTP: +" + JSON.stringify(dataDblClickSTP));	
		var d = (dataDblClickSTP[dataDblClickSTP.length] = {});
		var stpid=$("#txDBL_STP").val();
		console.log("DBL STP : " + stpid);
		d["columnName"] = "";
		d["funcName"] = "";
		d["stp"] = stpid;
		d["params"] = "";
	} else {
		if (data == "" ) data = [];
		dataDblClickSTP=data;
	}
	
	dataVwClickSTP = new Slick.Data.DataView({ inlineFilters: true });
	console.log("dataDblClickSTP:");
	console.log(dataDblClickSTP);
	gridDblClickSTP = new Slick.Grid("#grDblSTP", dataDblClickSTP, columns, options);
	gridDblClickSTP.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridDblClickSTP.setSelectionModel(new Slick.CellSelectionModel());
	
	gridDblClickSTP.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		gridDblClickSTP.invalidateRow(data.length);
		gridDblClickSTP.push(item);
		gridDblClickSTP.updateRowCount();
		gridDblClickSTP.render();
	});
	gridDblClickSTP.onClick.subscribe(function (e, args) {
		console.log("dataDblClickSTP: +"  );
		console.log(dataDblClickSTP);
		curObj.cl_stp=dataDblClickSTP;
		console.log("curObj: +" + JSON.stringify(curObj));	
		console.log(curObj);
	})
}
function delClickSTP(){
	if (gridClickSTP.getActiveCell() == null){
		return;
	}

  var dataClickSTP = gridClickSTP.getData();
  var current_row = gridClickSTP.getActiveCell().row;
  dataClickSTP.splice(current_row,1);
  var r = current_row;
  while (r<dataClickSTP.length){
    gridClickSTP.invalidateRow(r);
    r++;
  }
  gridClickSTP.updateRowCount();
  gridClickSTP.render();
  gridClickSTP.scrollRowIntoView(current_row-1);  
}
/*
function addClickSTP(){	
	console.log("dataClickSTP.length : " + dataClickSTP.length);
	var d = (dataClickSTP[dataClickSTP.length] = {});
	var stpid=$("#txCL_STP").val();
	console.log("STP : " + stpid);
	d["columnName"] = "";
	d["funcName"] = "";
	d["stp"] = stpid;
	d["params"] = "";
	
	dataVwClickSTP = new Slick.Data.DataView({ inlineFilters: true });

	gridClickSTP = new Slick.Grid("#grClickSTP", dataClickSTP, columns, options);
	gridClickSTP.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridClickSTP.setSelectionModel(new Slick.CellSelectionModel());
	
	gridClickSTP.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		gridClickSTP.invalidateRow(data.length);
		gridClickSTP.push(item);
		gridClickSTP.updateRowCount();
		gridClickSTP.render();
	});
	gridClickSTP.onClick.subscribe(function (e, args) {
		console.log("dataClickSTP: +"  );
		console.log(dataClickSTP);
		curObj.cl_stp=dataClickSTP;
		console.log("curObj: +" + JSON.stringify(curObj));	
		console.log(curObj);
	})
}
*/
function renderCL_STP(data){
	console.log("data : " + data);
	if (data == undefined){
		console.log("dataClickSTP: +" + JSON.stringify(dataClickSTP));	
		var d = (dataClickSTP[dataClickSTP.length] = {});
		var stpid=$("#txCL_STP").val();
		console.log("STP : " + stpid);
		d["columnName"] = "";
		d["funcName"] = "";
		d["stp"] = stpid;
		d["params"] = "";
	} else {
		if (data == "" ) data = [];
		dataClickSTP=data;
	}
	dataVwClickSTP = new Slick.Data.DataView({ inlineFilters: true });
	console.log("dataClickSTP:");
	console.log(dataClickSTP);

	gridClickSTP = new Slick.Grid("#grClickSTP", dataClickSTP, columns, options);
	gridClickSTP.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridClickSTP.setSelectionModel(new Slick.CellSelectionModel());
	
	gridClickSTP.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		gridClickSTP.invalidateRow(data.length);
		gridClickSTP.push(item);
		gridClickSTP.updateRowCount();
		gridClickSTP.render();
	});
	gridClickSTP.onClick.subscribe(function (e, args) {
		console.log("dataClickSTP: +"  );
		console.log(dataClickSTP);
		curObj.cl_stp=dataClickSTP;
		console.log("curObj: +" + JSON.stringify(curObj));	
		console.log(curObj);
	})	
}
function addColSection(){
	$("#dvLay").append('<div class="column"/>');
	$( ".column" ).sortable({
		connectWith: ".column",
		handle: ".portlet-header",
		cancel: ".portlet-toggle",
		placeholder: "portlet-placeholder ui-corner-all"
	});
	//$(".column").width(eval($("#dvLay").width()-40));
}
function selectSTP(sbipUrl,objID){
    $("#txtSTP_ID").val(objID);
    $("#txtSTP_URI").val(sbipUrl);
}
function addObj(){
	var html=$(".column:first").html();
	var objNum=$(".portlet").length+1;
	html+='<div class="portlet"><div class="portlet-header" name=Object' + objNum +'>New Object</div><div class="portlet-content"></div></div>';
	//console.log(html);
	$(".column:first").html(html);
	$( ".portlet" )
		.addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
		.find( ".portlet-header" )
		.addClass( "ui-widget-header ui-corner-all" )
		.prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

	$( ".portlet-toggle" ).click(function() {
		var icon = $( this );
		icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
		icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
	});
	$(".portlet-header").click(function() {
		clickPortletHeader(this);
		/*
		console.log("portlet-header click");
		$(".portlet-header").removeClass('ui-widget-header');
		$(".portlet-header").css("background-color","#efefef");
		$(".portlet-header").css("border","1px solid #4297d7");
		$( this ).addClass('ui-widget-header');
		curPObj=this;
		curPName=$(this).attr("name");
		console.log("curPName : " + curPName);
		getAttr(this);
		*/
	});
}
function getAttr(obj){
	$("#txID").val("");
	$("#txSTP").val("");
	$("#txWidth").val("");
	$("#txHeight").val("");
	$("#sltFloat").val("");
	$("#txrStyle").val("");
	$("#sltType").val("");
	$("#txrTag").val("");
	$("#sltSort").val("");
	$("#sltGraphType").val("");
	$("#txrGraphOptions").val("");
	$("#txrGraphStmt").val("");
	$("#txCL_STP").val("");
	$("#txCL_FN").val("");
	$("#txCL_Param").val("");
	$("#txDBL_STP").val("");
	$("#txDBL_FN").val("");
	$("#txDBL_Param").val("");
	dataClickSTP = [];
	dataDblClickSTP = [];
	/*
	gridClickSTP.invalidate();
	gridClickSTP.render();
	gridDblClickSTP.invalidate();
	gridDblClickSTP.render();
	*/
	console.log("getAttr obj: " + $(obj).attr('name'));
	var objName=$(obj).attr('name');
	curObj=eval('layoutObj.' + $(obj).attr('name'));
	//var name=layoutObj[$(obj).attr('name')];

	console.log("curObj: " + JSON.stringify(curObj));
	console.log(curObj);
	if (typeof curObj == "undefined") {
		layoutObj[objName]={"id":"","stp":"","width":"","height":"","float":"","style":"","type":"","tag":"","sort":"","graph_type":"BarChart","grp_opt":"","grp_stmt":"","x_slider":"","pie_height":"","pie_width":"","cl_stp":"","cl_fn":"","cl_param":"","dbl_stp":"","dbl_fn":"","dbl_param":""};
		console.log(layoutObj);
		//console.log("JSON.stringify(layoutObj) : " + JSON.stringify(layoutObj));
		//console.log(layoutObj);
		curObj=layoutObj[objName];
	}
	console.log("Object Attr: ");
	console.log(curObj);
	
	$("#txID").val(curObj.id);
	$("#txSTP").val(curObj.stp);
	$("#txWidth").val(curObj.width);
	$("#txHeight").val(curObj.height);
	console.log("curObj.float : " + curObj.float);
	val=curObj.float? curObj.float : "";
	console.log("curObj.val : " + val);
	
	$("#sltFloat").val(curObj.float ? curObj.float : "");
	$("#txrStyle").val(curObj.style);
	$("#sltType").val(curObj.type);
	$("#txrTag").val(curObj.tag ? curObj.tag : "");
	$("#sltSort").val(curObj.sort);
	$("#sltGraphType").val(curObj.graph_type);
	$("#txrGraphOptions").val(curObj.grp_opt ? curObj.grp_opt : "");
	$("#txrGraphStmt").val(curObj.grp_stmt ? curObj.grp_stmt : "");
	$("#sltXSlider").val(curObj.x_slider ? curObj.x_slider : "");
	$("#txPHeight").val(curObj.pie_height ? curObj.pie_height : "");
	$("#txPWidth").val(curObj.pie_width ? curObj.pie_width : "");
	//$("#txCL_STP").val(curObj.cl_stp);
	renderCL_STP(curObj.cl_stp);
	$("#txCL_FN").val(curObj.cl_fn);
	$("#txCL_Param").val(curObj.cl_param);
	//$("#txDBL_STP").val(curObj.dbl_stp);
	renderDBL_STP(curObj.dbl_stp);
	$("#txDBL_FN").val(curObj.dbl_fn);
	$("#txDBL_Param").val(curObj.dbl_param);
	setType();
}
$(document).ready(function () {
	//$(".column").width(eval($("#dvLay").width()-40));
	$(".portlet-header").click(function() {
		clickPortletHeader(this);
		/*
		console.log("portlet-header click");
		$(".portlet-header").removeClass('ui-widget-header');
		$(".portlet-header").css("background-color","#efefef");
		$(".portlet-header").css("border","1px solid #4297d7");
		$( this ).addClass('ui-widget-header');
		curPObj=this;
		curPName=$(this).attr("name");
		console.log("curPName : " + curPName);
		getAttr(this);
		*/
	});

	var rowCount = Object.keys(savedLayObj).length;
	for(var ii=0;ii<rowCount;ii++){
		var row=savedLayObj["R"+ii];
		var colNum = Object.keys(row).length;
		for (var jj=0; jj<colNum; jj++){
			var obj=row["C" + jj];
			var id				=obj.id				  ;
			var stp			  =obj.stp				;
			var width		  =obj.width			;
			var height		=obj.height		  ;
			var float			=obj.float		  ;
			var style			=obj.style		  ;
			var type			=obj.type			  ;
			var tag				=obj.tag			  ;
			var graph_type=obj.graph_type	;
			var grp_opt		=obj.grp_opt	;
			var grp_stmt	=obj.grp_stmt	;
			var x_slider	=obj.x_slider	;
			var pie_height=obj.pie_height	;
			var pie_width	=obj.pie_width	;
			var sort			=obj.sort			  ;
			var cl_stp		=obj.cl_stp		  ;
			var cl_fn		  =obj.cl_fn			;
			var cl_param	=obj.cl_param	  ;
			var dbl_stp	  =obj.dbl_stp		;
			var dbl_fn		=obj.dbl_fn		  ;
			var dbl_param =obj.dbl_param  ;
			var obj=row["C" + jj];
			var objName="Object"+ii+jj;
			layoutObj[objName]={"id":id,"stp":stp,"width":width,"height":height,"float":float,"style":style,"type":type,"tag":tag,"sort":sort,"graph_type":graph_type,"grp_opt":grp_opt,"grp_stmt":grp_stmt,"x_slider":x_slider,"pie_height":pie_height,"pie_width":pie_width,"cl_stp":cl_stp,"cl_fn":cl_fn,"cl_param":"","dbl_stp":dbl_stp,"dbl_fn":dbl_fn,"dbl_param":""};
		}
	}
	var rowCount = Object.keys(savedLayObj).length;
	console.log("savedLayObj rowCount : " + rowCount);
	for(var ii=0;ii<rowCount;ii++){
		var row=savedLayObj["R"+ii];
		var colNum = Object.keys(row).length;
		addColSection();
		for (var jj=0; jj<colNum; jj++){
			var obj=row["C" + jj];
			var id				=obj.id				  ;
			var stp			  	=obj.stp				;
			var width		  	=obj.width			;
			var height			=obj.height		  ;
			var float			=obj.float		  ;
			var style			=obj.style		  ;
			var type			=obj.type			  ;
			var tag				=obj.tag			  ;
			var graph_type=obj.graph_type ;
			var grp_opt		=obj.grp_opt		;
			var grp_stmt	=obj.grp_stmt		;
			var x_slider	=obj.x_slider		;
			var pie_height=obj.pie_height	;
			var pie_width	=obj.pie_width	;
			var sort			=obj.sort			  ;
			var cl_stp		=obj.cl_stp		  ;
			var cl_fn		  =obj.cl_fn			;
			var cl_param	=obj.cl_param	  ;
			var dbl_stp	  =obj.dbl_stp		;
			var dbl_fn		=obj.dbl_fn		  ;
			var dbl_param =obj.dbl_param  ;

			var html=$(".column:eq("+ii+")").html();

			var objNum=$(".portlet").length+1;
			html+='<div class="portlet"><div class="portlet-header" name=Object' + ii+jj +'>' + id +'</div><div class="portlet-content"><li> Width : ' + width + "<li> Height : " + height + '</div></div>';
			//console.log(html);
			$(".column:eq("+ii+")").html(html);
			$( ".portlet" )
				.addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
				.find( ".portlet-header" )
				.addClass( "ui-widget-header ui-corner-all" )
				.prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

			$( ".portlet-toggle" ).click(function() {
				var icon = $( this );
				icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
				icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
			});
			$(".portlet-header").click(function() {
				clickPortletHeader(this);
				/*
				console.log("portlet-header click");
				$(".portlet-header").removeClass('ui-widget-header');
				$(".portlet-header").css("background-color","#efefef");
				$(".portlet-header").css("border","1px solid #4297d7");
				$( this ).addClass('ui-widget-header');
				curPObj=this;
				curPName=$(this).attr("name");
				console.log("curPName : " + curPName);
				getAttr(this);
				*/
			});
		}
	}
});
function clickPortletHeader(obj){
	console.log("portlet-header click");
	$(".portlet-header").removeClass('ui-widget-header');
	$(".portlet-header").css("background-color","#efefef");
	$(".portlet-header").css("border","1px solid #4297d7");
	$( obj ).addClass('ui-widget-header');
	curPObj=obj;
	curPName=$(obj).attr("name");
	console.log("curPName : " + curPName);
	getAttr(obj);
}
function delColSection(){
	$(".column:last").remove();
}
function setID(){
	var id=$("#txID").val();
	curObj.id=id;
	console.log(layoutObj);
	console.log("curPObj : " + $(curPObj).html());
	$(curPObj).html(id + " : " + curObj.type);
	setupPortlet();
}
function setSTP(){
	var stp=$("#txSTP").val();
	curObj.stp=stp;
	console.log(layoutObj);
	console.log("setSTP curPObj : " + $(curPObj).html());
	setupPortlet();
}
function setWidth(){
	var width=$("#txWidth").val();
	curObj.width=width;
	console.log(layoutObj);
	setupPortlet();
}
function setHeight(){
	var height=$("#txHeight").val();
	curObj.height=height;
	console.log(layoutObj);
	setupPortlet();
}
function setFloat(){
	var float=$("#sltFloat").val();
	curObj.float=float;
	setupPortlet();
}
function setStyle(){
	var style=$("#txrStyle").val();
	curObj.style=style;
	setupPortlet();
}
function setType(){
	var type=$("#sltType option:selected").val();
	if ( type=="Grid" ) {
		$(".trSTP").show();
		$(".trGrid").show();
		$(".trGraph").hide();
		$(".trTag").hide();
	} else if ( type=="Graph" ){
		$(".trSTP").show();
		$(".trGrid").hide();
		$(".trGraph").show();
		$(".trTag").hide();
	} else if ( type=="Tag" ){
		$(".trSTP").hide();
		$(".trGrid").hide();
		$(".trGraph").hide();
		$(".trTag").show();
	} else {
		$(".trSTP").show();
		$(".trGrid").hide();
		$(".trGraph").hide();
		$(".trTag").hide();
	}
	curObj.type=type;
	$(curPObj).html(curObj.id + " : " + type);
	setupPortlet();

}
function setTag(){
	var tag=$("#txrTag").val();
	curObj.tag=tag;
	setupPortlet();
}
function setGraphType(){
	var graph_type=$("#sltGraphType option:selected").val();
	curObj.graph_type=graph_type;
	setupPortlet();
}
function setGraphOptions(){
	var grp_opt=$("#txrGraphOptions").val();
	curObj.grp_opt=grp_opt;
	setupPortlet();
}
function setGraphStmt(){
	var grp_stmt=$("#txrGraphStmt").val();
	curObj.grp_stmt=grp_stmt;
	setupPortlet();
}
function setXSlider(){
	var x_slider=$("#sltXSlider").val();
	curObj.x_slider=x_slider;
	setupPortlet();
}
function setPHeight(){
	var pie_height=$("#txPHeight").val();
	curObj.pie_height=pie_height;
	setupPortlet();
}
function setPWidth(){
	var pie_width=$("#txPWidth").val();
	curObj.pie_width=pie_width;
	setupPortlet();
}
function setSort(){
	var sort=$("#sltSort option:selected").val();
	curObj.sort=sort;
	setupPortlet();
}
function setCL_STP(){
	/*
	var cl_stp=$("#txCL_STP").val();
	curObj.cl_stp=cl_stp;
	setupPortlet();
	*/
}
function setCL_FN(){
	var cl_fn=$("#txCL_FN").val();
	curObj.cl_fn=cl_fn;
	setupPortlet();
}
function setCL_Param(){
	var cl_param=$("#txCL_Param").val();
	curObj.cl_param=cl_param;
	setupPortlet();
}
function setDBL_STP(){
	var dbl_stp=$("#txDBL_STP").val();
	curObj.dbl_stp=dbl_stp;
	setupPortlet();
}
function setDBL_FN(){
	var dbl_fn=$("#txDBL_FN").val();
	curObj.dbl_fn=dbl_fn;
	setupPortlet();
}
function setDBL_Param(){
	var dbl_param=$("#txDBL_Param").val();
	curObj.dbl_param=dbl_param;
	setupPortlet();
}
function setupPortlet(){
	$curObj=$("div[name='" + curPName + "']").parent().find(".portlet-content");
	$curObj.html("<li> Width : " + curObj.width + "<li> Height : " + curObj.height);
	console.log("curObj.html : " + $curObj.html());
}
function deleteLayout(){
	var fn='alertResMsg';
	var param={
	}
	$.ajax({
		url: "/<%=contextName%>/STPWRVUDHeader?sas_forwardLocation=deleteLayout",
		type: "post",
		data: param,
		dataType: 'text',
		async: true,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show();
		},
		success : function(data){
			console.log("layout Delete success \n" );
			window[fn](data);
		},
		complete: function(data){
			//data.responseText;
			console.log(data);
			isRun=0;
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alert(error);
		}
	});	
}
function saveLayout(){
	var layoutRes={};
	var colNum=$(".column").length;
	console.log("colNum: " + colNum);
	for (var ii=0;ii<colNum ; ii++){
		var poNum=$(".column:eq("+ii+") > .portlet").length;
		console.log("poNum: " + ii+":"+poNum);
		layoutRes["R"+ii]={};
		curRowSection=layoutRes["R"+ii];
		console.log("layoutRes");
		console.log(layoutRes);
		for(var jj=0; jj<poNum; jj++){
			var cPortletName=$(".column:eq("+ii+") > .portlet:eq("+jj+") > .portlet-header").attr("name");
			console.log("cPortletName: " + cPortletName);
			console.log("cPortletName: " + layoutObj[cPortletName].id);
			curRowSection["C"+jj]={"id":"","stp":"","width":"","height":"","float":"","style":"","type":"","tag":"","sort":"","graph_type":"BarChart","grp_opt":"","grp_stmt":"","x_slider":"","pie_height":"","pie_width":"","cl_stp":"","cl_fn":"","cl_param":"","dbl_stp":"","dbl_fn":"","dbl_param":""};
			var curCell=curRowSection["C"+jj];
			curCell.id			=layoutObj[cPortletName].id;
			curCell.stp			=layoutObj[cPortletName].stp;
			curCell.width		=layoutObj[cPortletName].width;
			curCell.height		=layoutObj[cPortletName].height;
			curCell.float		=layoutObj[cPortletName].float?layoutObj[cPortletName].float:"";
			curCell.style		=layoutObj[cPortletName].style;
			curCell.type		=layoutObj[cPortletName].type;
			curCell.tag			=layoutObj[cPortletName].tag?layoutObj[cPortletName].tag:"";
			curCell.graph_type	=layoutObj[cPortletName].graph_type;
			curCell.grp_opt		=layoutObj[cPortletName].grp_opt?layoutObj[cPortletName].grp_opt:"";
			curCell.grp_stmt	=layoutObj[cPortletName].grp_stmt?layoutObj[cPortletName].grp_stmt:"";
			curCell.x_slider	=layoutObj[cPortletName].x_slider?layoutObj[cPortletName].x_slider:"";
			curCell.pie_height	=layoutObj[cPortletName].pie_height?layoutObj[cPortletName].pie_height:"";
			curCell.pie_width	=layoutObj[cPortletName].pie_width?layoutObj[cPortletName].pie_width:"";
			curCell.sort		=layoutObj[cPortletName].sort;
			curCell.cl_stp		=dataClickSTP;			//layoutObj[cPortletName].cl_stp;
			curCell.cl_fn		=layoutObj[cPortletName].cl_fn;
			curCell.cl_param	=layoutObj[cPortletName].cl_param;
			curCell.dbl_stp		=dataDblClickSTP;		//layoutObj[cPortletName].dbl_stp;
			curCell.dbl_fn		=layoutObj[cPortletName].dbl_fn;
			curCell.dbl_param	=layoutObj[cPortletName].dbl_param;
		}
	}
	console.log("layoutRes");
	console.log(layoutRes);

	isDisplayProgress=0;
	var layout=JSON.stringify(layoutRes);
	var fn='alertResMsg';
	var param={
			layout	: layout
	}
	$.ajax({
		url: "/<%=contextName%>/STPWRVUDHeader?sas_forwardLocation=saveLayout",
		type: "post",
		data: param,
		dataType: 'text',
		async: true,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show();
		},
		success : function(data){
			console.log("layout Save success \n" );
			window[fn](data);
		},
		complete: function(data){
			//data.responseText;
			console.log(data);
			isRun=0;
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alert(error);
		}
	});
}
function alertResMsg(data){
	isDisplayProgress=1;
	//var msg=eval(data);
	console.log("alertResMsg");
	console.log(data);
	var res=data.replace(/\r\n/g, "");
	console.log("res: " + res);
	alert(res);
}
var curSTPName;
function findSTP(objName){
	$("#dvModalID").show();
	curSTPName=objName;
}
function setSTPURI(){
	$("#"+curSTPName).val(decodeURI($("#txtSTP_URI").val().substring(17)).replace(/\+/g, " "));
	$("#txtSTP_URI").val("");
	$("#dvModalID").hide();
	fn="set"+curSTPName.substring(2);
	console.log("fn: " + fn);
	window[fn]();
}
  </script>
</head>
<body>
	<div style="border:1px solid #dfdfdf;" align=right>
		<input type=button class="condBtn" value="Add Row Section" onclick="addColSection();">
		<input type=button class="condBtn" value="Deete Row Section" onclick="delColSection();">
		<input type=button class="condBtn" value="Add Object" onclick="addObj();">
		<input type=button class="condBtn" value="Delete Layout" onclick="deleteLayout();">
		<input type=button class="condBtn" value="Save Layout" onclick="saveLayout();">
	</div>
	<p>
	<div id="dvLay" style="border:0px solid #dfdfdf;width:542px;height:510px;float:left;">
		<!--
		<div class="column">
		  <div class="portlet">
		    <div class="portlet-header" name=Object1>Object1</div>
		    <div class="portlet-content"></div>
		  </div>
		</div>
		-->
	</div>
	<div id=dvAttr style="border:0px solid #dfdfdf;float:left;padding:5px 0px 0px 2px;width:570px;">
		<table id=tbAttr class="table" cellspacing="0" cellpadding="5" style="width:100%;border:1px solid #efefef;">
			<tr>
				<th class="header" style="width:80px;">ID</th>
				<td class="data" colspan=3 style="width:180px;"><input type=text id=txID value=""  class="inputAttr" onBlur="setID();" style="width:180px;"/></td>
			</tr>
			<tr>
				<th class="header">Type</th>
				<td class="data" colspan=3>
					<select id=sltType onChange="setType();">
						<option value="HTML" >HTML STP</option>
						<option value="Tag">HTML Tag</option>
						<option value="Grid" selected>Grid</option>
						<option value="GridTree" >GridTree</option>
						<option value="Graph">Graph</option>
					</select>
				</td>
			</tr>
			<tr class="trSTP" style="display:none;">
				<th class="header">STP</th>
				<td class="data" colspan=2><input type=text id=txSTP value=""  class="inputAttr" onBlur="setSTP();" style="width:230px;" /></td>
				<td class="data" style="margin:0px 0px;padding:0px 5px;width:20px;text-align:center;padding-top:3px;">
					<img src="/<%=contextName%>/images/StoredProcess.gif" style="cursor:pointer;" onclick="findSTP('txSTP');">
				</td>
			</tr>
			<tr>
				<th class="header">Width</th>
				<td class="data" colspan=3><input type=text id=txWidth value=""  class="inputAttr" onBlur="setWidth();" style="width:180px;" /></td>
			</tr>
			<tr>
				<th class="header">Height</th>
				<td class="data" colspan=3><input type=text id=txHeight value=""  class="inputAttr" onBlur="setHeight();" style="width:180px;" /></td>
			</tr>
			<tr>
				<th class="header">Float</th>
				<td class="data" colspan=3>
					<select id=sltFloat onChange="setFloat();" >
						<option value="" selected></option>
						<option value="clear">Clear</option>
						<option value="none">None</option>
						<option value="left">Left</option>
						<option value="right">Right</option>
					</select>
				</td>
			</tr>
			<tr>
				<th class="header">Style</th>
				<td class="data" colspan=3>
					<textarea id=txrStyle  style="width:460px;height:60px;border:0px solid #fefefe;" onBlur="setStyle();" >border:1px solid #fefefe;</textarea>
				</td>
			</tr>
			<tr class="trTag" style="display:none;">
				<th class="header">HTML Tag</th>
				<td class="data" colspan=3>
					<textarea id=txrTag  style="width:460px;height:150px;border:0px solid #fefefe;" onBlur="setTag();"></textarea>
				</td>
			</tr>
			<tr class="trGraph" style="display:none;">
				<th class="header">Graph Type</th>
				<td class="data" colspan=3>
					<select id=sltGraphType  onChange="setGraphType();">
						<option value="dBarChart" selected>Discrete Bar Chart</option>
						<option value="BarChart" selected>Multi Bar Chart</option>
						<option value="LineChart" >Line Chart</option>
						<option value="Pie" >Pie Chart</option>
					</select>
				</td>
			</tr>
			<tr class="trGraph" style="display:none;">
				<th class="header">X Axis Slider</th>
				<td class="data" colspan=3>
					<select id=sltXSlider  onChange="setXSlider();">
						<option value="No" selected>No</option>
						<option value="Yes" >Yes</option>
					</select>
				</td>
			</tr>
			<tr class="trGraph" style="display:none;">
				<th class="header">Pie Height</th>
				<td class="data" colspan=3>
					<input type=text id=txPHeight value=""  class="inputAttr" onBlur="setPHeight();" style="width:170px;text-align:right;" /> px
				</td>
			</tr>
			<tr class="trGraph" style="display:none;">
				<th class="header">Pie Width</th>
				<td class="data" colspan=3>
					<input type=text id=txPWidth value=""  class="inputAttr" onBlur="setPWidth();" style="width:170px;text-align:right;" /> px
				</td>
			</tr>
			<tr class="trGraph" style="display:none;">
				<th class="header">Options</th>
				<td class="data" colspan=3>
					<textarea id=txrGraphOptions  style="width:460px;height:150px;border:0px solid #fefefe;" onBlur="setGraphOptions();"></textarea>
				</td>
			</tr>
			<tr class="trGraph" style="display:none;">
				<th class="header">Graph Statement</th>
				<td class="data" colspan=3>
					<textarea id=txrGraphStmt  style="width:460px;height:150px;border:0px solid #fefefe;" onBlur="setGraphStmt();"></textarea>
				</td>
			</tr>
			<tr class="trGrid">
				<th class="header">Sortable</th>
				<td class="data" colspan=3>
					<select id=sltSort  onChange="setSort();">
						<option value="1" selected>Yes</option>
						<option value="0">No</option>
					</select>
				</td>
			</tr>
			<tr class="trSTP">
				<th class="header" rowspan=2>onClick</th>
				<td class="header" style="width:20px;">STP</td>
				<td class="data" colspan=2>
					<input type=text id=txCL_STP value="" onBlur="setCL_STP();"  class="inputAttr" style="width:375px;" />
					<img src="/<%=contextName%>/images/StoredProcess.gif" style="cursor:pointer;" onclick="findSTP('txCL_STP');">
					<img src="/<%=contextName%>/images/AddBlue.gif" style="cursor:pointer;" onclick="renderCL_STP();">
					<img src="/<%=contextName%>/images/DataViewerClose.gif" style="cursor:pointer;" onclick="delClickSTP();">
				</td>
			</tr>
			<tr class="trSTP">
				<td colspan=3 style="padding:0px 0px 0px 0px;">
					<div id="grClickSTP" style="border:1px solid #dddddd;width:480px;height:150px;overflow-y:hidden;overflow-x:hidden;"></div>
				</td>
			</tr>
			<tr class="trSTP">
				<th class="header" rowspan=2>onDBLClick</th>
				<td class="header" style="width:20px;">STP</td>
				<td class="data" colspan=2>
					<input type=text id=txDBL_STP value="" onBlur="setDBL_STP();"  class="inputAttr" style="width:375px;" />
					<img src="/<%=contextName%>/images/StoredProcess.gif" style="cursor:pointer;" onclick="findSTP('txDBL_STP');">
					<img src="/<%=contextName%>/images/AddBlue.gif" style="cursor:pointer;" onclick="renderDBL_STP();">
					<img src="/<%=contextName%>/images/DataViewerClose.gif" style="cursor:pointer;" onclick="delDblSTP();">
				</td>
			</tr>
			<tr class="trSTP">
				<td colspan=3 style="padding:0px 0px 0px 0px;">
					<div id="grDblSTP" style="border:1px solid #dddddd;width:480px;height:150px;overflow-y:hidden;overflow-x:hidden;"></div>
				</td>
			</tr>
		</table>
	</div>


	<div id=dvModalID style="left:200px;position: absolute;display:none;padding: 15px;z-index: 10000;
		background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
		<div id="dvTreeView" style="border:1px solid #dddddd;height:520px;width:500px;overflow-y: auto;">
<%
	try {
		if (treeView != null) {
				treeView.setNodeLoading(treeView.FULL);
				treeView.setInitialExpansionLevel(5);
				treeView.setRequest(request);
				treeView.setResponse(response);
				treeView.write(out);
		}
	} catch (Exception e) {
	    e.printStackTrace();
	}
%>
		</div>
	  <div align=left style="width:400px;">
  		<p>
	    <input type="hidden" id=txtSTP_ID name="SINGLESTP_PORTLET_OBJID" value="" size=16></input>
	    <input type="text" id=txtSTP_URI name="SINGLESTP_PORTLET_SBIPURI" value="" size=82 style="border:1px solid #dfdfdf;"></input>
		</div>
	  <div align=center style="">
			<input type=button class="condBtn" value="Close" onclick="setSTPURI();">
		</div>
	</div>

</body>
</html>