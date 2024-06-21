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

	Logger logger = Logger.getLogger("EditLayout");
	logger.setLevel(Level.INFO);
	String contextName = application.getInitParameter("application-name");
	String stpObjID =null;
	StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
	stpObjID=facade.getMetaID();
	logger.debug("stpObjID:"+stpObjID);
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	RepositoryInterface rif = ucif.getRepository("Foundation");
	UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth");
	String hostName = rif.getHost();
	int port = rif.getPort();
	
	String principal=(String) id.getPrincipal();
	String credential=(String) id.getCredential();
	String displayName = ucif.getPerson().getDisplayName();
	List groupList = ucif.getGroups();
	logger.debug("Groups: " + groupList.toString());
	logger.debug("isReportAdmin: " + ucif.isInGroup("Report Admin"));

	stpNote.setStpObjId(stpObjID);
	String layoutStr="";
	layoutStr=stpNote.getSTPNote(sci,"Layout");
	logger.debug("layoutStr:"+layoutStr);
	String DRInfo="";
	DRInfo=stpNote.getSTPNote(sci,"DataRole");
	logger.debug("DataRole:"+DRInfo);


	MetadataSearchUtil msu = new MetadataSearchUtil(null);
	msu.init(principal,credential, hostName, String.valueOf(port));
	msu.setLoadStoredProcesses(true);
	msu.setSortEntriesByName(true);
	msu.setDispEntriesByDesc(true);
	msu.setHideUserNodes(true);
	List rootList = msu.getRootFolders();
	String[] fLists = new String[rootList.size()];
	for (int i=0;  i<rootList.size(); i++){
		String nn=rootList.get(i).toString();
		fLists[i] = nn;
		logger.debug("fLists:"+nn);
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
	<title>SASHBI Designer</title>
	<script type="text/javascript" src="/<%=contextName%>/scripts/sas_Bootstrap.js"></script>
	<script type="text/javascript">
	/*<![CDATA[*/
	sas.setJavaScriptLocation("/<%=contextName%>/scripts/");
	sas.requires("sas_Common");
	/*]]>*/
	</script>
<!--
-->	
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
	#banner{
		font-family: 'Malgun Gothic',Tahoma, Gulim, Helvetica, Helv;
		font-size:14pt;
		vertical-align:middle;
		font-weight:bold;
		color:#343434;
		padding: 20px 0px 20px 20px;
	}
	#topMenu{
		position: absolute;
		top : 0px;
		right: 10px;
	}	
	#dvAttr_old {
		border:0px solid #dfdfdf;
		float:left;
		padding:5px 0px 0px 2px;
		width: 610px;
		height:600px;
		overflow-y:auto;
		resize:both;
	}
	.marquee {
		border: 1px dashed green;
		position: absolute;
		left: 550px; 
		top: 125px;
		width: 610px; 
		height: 600px;
		display: block;
		overflow-y:auto;		
    z-index: 2500;    
	}
	#dvAttr {
		border: 0px solid red;
		position: absolute;
		left: 550px; 
		top: 125px;
		width: 610px; 
		height: 600px;
		display: block;
		/*
		overflow-y:auto;		
		*/
		z-index: 2501;
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
	input#iptTab1:checked + label.default {
		color:white;
		background-color:#3d95c0;
		background: -webkit-gradient(linear, left top, left bottom, from(#A0CCE0), to(#3d95c0), color-stop(0.6, #3d95c0));
		background: -moz-linear-gradient(top, #72B3D1; #3d95c0, #3d95c0);
	}
	input#iptTab2:checked + label.events {
		color:white;
		background-color:#3d95c0;
		background: -webkit-gradient(linear, left top, left bottom, from(#A0CCE0), to(#3d95c0), color-stop(0.6, #3d95c0));
		background: -moz-linear-gradient(top, #72B3D1; #3d95c0, #3d95c0);
	}
	input#iptTab3:checked + label.source {
		color:white;
		background-color:#3d95c0;
		background: -webkit-gradient(linear, left top, left bottom, from(#A0CCE0), to(#3d95c0), color-stop(0.6, #3d95c0));
		background: -moz-linear-gradient(top, #72B3D1; #3d95c0, #3d95c0);
	}
	input#iptTab1,input#iptTab2,input#iptTab3{
	  display:none;
	}
	label{
		/*
		display:inline-block;
		height:30px;
		background:gray;
		text-align:center;
		line-height:30px;
		*/
		width:80px;
	  float:left;
	  font-family:arial;
	  font-size:14px;
	  font-weight:normal;
	  color:#DFDFDF;
		padding: 4px  20px  1px  20px ;
		margin: 0px  0px  0px  0px ;
	  list-style-type:none;
		display:inline-block;
	  text-align:center;
	  border-right:1px #818181 solid;
	  -webkit-box-shadow:1px 1px 1px #bbb;
	  -moz-box-shadow:1px 1px 1px #bbb;
	  box-shadow:1px 1px 1px #bbb;
	  background-color:#c9c9c9;
	  background: -webkit-gradient(linear, left top, left bottom, from(#c9c9c9), to(#848484), color-stop(0.6, #a1a1a1));
	  background: -moz-linear-gradient(top, #c9c9c9; #a1a1a1, #848484);
	  -webkit-border-top-left-radius:.5em;
	  -webkit-border-top-right-radius:.5em;
	
	}
	input#iptTab1:checked ~ .tab1{
	  display:block;
	}
	input#iptTab2:checked ~ .tab2{
	  display:block;
	}
	input#iptTab3:checked ~ .tab3{
	  display:block;
	}
	.tab1,.tab2,.tab3{
	  display:none;
	  font-family:arial;
	  padding-top:20px;
	  width: 577px;
	  border: 0px solid blue;
	  
	}
	.objColnum {
		width:200px;
	  float:center;
	  font-family:arial;
	  font-size:12px;
	  font-weight:normal;
	  color:#DFDFDF;
		padding: 4px ;
		margin: 5px  0px  5px  0px ;
	  list-style-type:none;
		display:inline-block;
	  text-align:center;
	  -webkit-box-shadow:1px 1px 1px #bbb;
	  -moz-box-shadow:1px 1px 1px #bbb;
	  box-shadow:1px 1px 1px #bbb;
	  background-color:#3d95c0;
	  background: -webkit-gradient(linear, left top, left bottom, from(#3d95c0), to(#3d95c0), color-stop(0.6, #3d95c0));
	  background: -moz-linear-gradient(top, #3d95c0; #3d95c0, #3d95c0);
	  -webkit-border-top-left-radius:.5em;
	  -webkit-border-top-right-radius:.5em;
	  -webkit-border-bottom-right-radius:.5em;
	  -webkit-border-bottom-left-radius:.5em;
	}
  #dvColumns, #dvSeledtedX, #dvSeledtedY, 
  #dvBarColumns, #dvBarSeledtedX, #dvBarSeledtedY, 
  #dvLineColumns, #dvLineSeledtedX, #dvLineSeledtedY, 
  #dvPieColumns, #dvPieSeledtedX, #dvPieSeledtedY, 
  #dvMLineColumns, #dvMLineSeledtedX, #dvMLineSeledtedY, #dvMLineSeledtedG, 
  #dvBLineColumns, #dvBLineSeledtedX, #dvBLineSeledtedY, #dvBLineSeledtedG, 
  #dvBPlotColumns, #dvBPlotSeledtedX, #dvBPlotSeledtedY, #dvBPlotSeledtedG, 
  #dvScColumns, #dvScSeledtedX, #dvScSeledtedY, #dvScSeledtedG {
    border: 0px solid #eee;
    background-color:#ddd;
    width: 290px;
    list-style-type: none;
    margin: 0px;
    padding: 0px;
    float: left;
    overflow-y : auto;
    
  }
  #dvColumns li, #dvSeledtedX li, #dvSeledtedY li,
  #dvBarColumns li, #dvBarSeledtedX li, #dvBarSeledtedY li, 
  #dvLineColumns li, #dvLineSeledtedX li, #dvLineSeledtedY li, 
  #dvPieColumns li, #dvPieSeledtedX li, #dvPieSeledtedY li, 
  #dvMLineColumns li, #dvMLineSeledtedX li, #dvMLineSeledtedY li, #dvMLineSeledtedG li, 
  #dvBLineColumns li, #dvBLineSeledtedX li, #dvBLineSeledtedY li, #dvBLineSeledtedG li, 
  #dvBPlotColumns li, #dvBPlotSeledtedX li, #dvBPlotSeledtedY li, #dvBPlotSeledtedG li, 
  #dvScColumns li, #dvScSeledtedX li, #dvScSeledtedY li, #dvScSeledtedG li {
    margin: 3px;
    padding: 2px;
    font-size: 12px;
    font-weight: normal;
    width: 280px;
  }	
  .rollInfo{
  	align:center;
	}
  </style>
  <script>
$(document).ready(function () {
	var objHeight=eval($(window).height()-$("#banner").height()-85);
	//console.log("dvMain Height : " + objHeight);
	$("#dvMain").height(objHeight);

  $("#dvAttr").resizable({
		//alsoResize: '.marquee',
		resize: function(event, ui) {
			//console.log("ui : "+ui.size.width);
			$("#tbAttr3").css({
				width : eval(ui.size.width-25) + "px",
			});
			$('.attrInfo').css({
				width : eval(ui.size.width-85) + "px",
			});
			$('#dvSltdCols').css({
				width : eval(ui.size.width-30) + "px",
				height : eval(ui.size.height-165) + "px",
			});
			$('.marquee').css({
				width : ui.size.width + "px",
				height : ui.size.height + "px",				//eval($("#tab3").height()-40) + "px",		//
				left : ui.position.left + "px",
				top : ui.position.top + "px",
			});
		},
		handles: 'all',
		/*
		aspectRatio: true,
		*/
  });	
});
$(window).resize(function () {
	var objHeight=eval($(window).height()-$("#banner").height()-85);
	console.log("dvMain Height : " + objHeight);
	$("#dvMain").height(objHeight);
});
<%
	if (layoutStr != null && layoutStr.length() > 10 ) {
%>
var savedLayObj=<%=layoutStr%>;
//console.log("savedLayObj");
//console.log(savedLayObj);
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
var savedLayObj=<%=layoutStr%>;
		
<%
}
	if (DRInfo != null && DRInfo.length() > 10 ) {
%>
var savedDR=<%=DRInfo%>;
<%		
	} else {
%>
var savedDR={};
<%
	}
%>

  </script>
	<script src="/<%=contextName%>/scripts/jquery/editLayout.js"></script>
  
</head>
<body style="border:0px solid #ff0000;margin:0px 0px 0px 0px;overflow-y: hidden;" scroll=hidden>
<%@include file="designerBanner.jsp"%>		
	<div style="border:1px solid #dfdfdf;margin:5px;" align=left>
		<input type=button class="condBtn" value="Add Row Section" onclick="addColSection();">
		<input type=button class="condBtn" value="Deete Row Section" onclick="delColSection();">
		<input type=button class="condBtn" value="Add Object" onclick="addObj();">
		<input type=button class="condBtn" value="Delete Layout" onclick="deleteLayout();">
		<input type=button class="condBtn" value="Save Layout" onclick="saveLayout();">
	</div>
<div id=dvMain style="border:0px solid #ff0000;margin:0px 0px 0px 0px;overflow: auto;" scroll=auto>
	<p>
	<div id="dvLay" style="border:0px solid #dfdfdf;width:542px;height:510px;float:left;">
	</div>
	<div id=dvAttr>
		<input id="iptTab1" name="objSet" type="radio" checked>
		<label for="iptTab1" class="default">Default</label>
		<input id="iptTab2" name="objSet" type="radio">
		<label id="lbTab2" for="iptTab2" class="events">Events</label>
		<input id="iptTab3" name="objSet" type="radio" >
		<label id="lbTab3" for="iptTab3" class="source" style="display:none;">Data & Role</label>
		
		
		<div class="tab1">
			<table id=tbAttr1 cellspacing="0" cellpadding="5" style="border:1px solid #3d95c0; width:100%;">
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
							<option value="dBarChart" selected>Discrete Bar Chart</option>
							<option value="BarChart" selected>Multi Bar Chart</option>
							<option value="LineChart" >Line Chart</option>
							<option value="mLineChart" >Multi Line Chart</option>
							<option value="barLineChart" >Bar Line Chart</option>
							<option value="boxPlot" >Box Plot</option>
							<option value="Pie" >Pie Chart</option>
							<option value="Scatter" >Scatter Chart</option>
						</select>
					</td>
				</tr>
				<tr>
					<th class="header">Execution</th>
					<td class="data" colspan=3>
						<select id=sltExec onChange="setExecution();">
							<option value="STP" >STP:Using Session</option>
							<option value="STP_ASYNC" >STP:ASync</option>
							<option value="UD">User Define</option>
						</select>
					</td>
				</tr>
				<tr class="trSTP stpInfo" style="display:none;">
					<th class="header" rowspan=2>STP</th>
					<td class="data" rowspan=1 colspan=2><input type=text id=txSTP value=""  class="inputAttr" onBlur="setSTP();" onChange="getReqParam(this.value);" style="width:440px;" /></td>
					<td class="data" style="margin:0px 0px;padding:0px 5px;width:20px;text-align:center;padding-top:3px;">
						<img src="/<%=contextName%>/images/StoredProcess.gif" style="cursor:pointer;" onclick="findSTP('txSTP');">
					</td>
				</tr>
				<tr class="trSTP stpInfo" style="display:none;">
					<td class="data" colspan=3 style="margin:0px 0px;padding:5px 5px;">
						<b>Required Parameters</b> : <span id="spnSTPReqParam"> </span>
					</td>
				</tr>
				<tr>
					<th class="header">Width</th>
					<td class="data" colspan=3><input type=text id=txWidth value=""  class="inputAttr" onBlur="setWidth();" style="width:180px;text-align:right;" /> px</td>
				</tr>
				<tr>
					<th class="header">Height</th>
					<td class="data" colspan=3><input type=text id=txHeight value=""  class="inputAttr" onBlur="setHeight();" style="width:180px;text-align:right;" /> px</td>
				</tr>
				<tr>
					<th class="header">Float</th>
					<td class="data" colspan=3>
						<select id=sltFloat onChange="setFloat();" >
							<option value=""></option>
							<option value="clear">Clear</option>
							<option value="none">None</option>
							<option value="left" selected>Left</option>
							<option value="right">Right</option>
						</select>
					</td>
				</tr>
				<tr>
					<th class="header">Refresh</th>
					<td class="data" colspan=3><input type=text id=txRefresh value=""  class="inputAttr" onBlur="setRefresh();" style="width:180px;text-align:right;" /> Second</td>
				</tr>
				<tr>
					<th class="header">Style</th>
					<td class="data" colspan=3>
						<textarea id=txrStyle  style="width:460px;height:60px;border:0px solid #fefefe;" onBlur="setStyle();" >border:1px solid #fefefe;</textarea>
					</td>
				</tr>
				<tr>
					<th class="header">Script</th>
					<td class="data" colspan=3>
						<textarea id=txrJS  style="width:460px;height:60px;border:0px solid #fefefe;" onBlur="setJS();" ></textarea>
					</td>
				</tr>
				<tr class="trTag" style="display:none;">
					<th class="header">HTML Tag</th>
					<td class="data" colspan=3>
						<textarea id=txrTag  style="width:460px;height:150px;border:0px solid #fefefe;" onBlur="setTag();"></textarea>
					</td>
				</tr>
				<tr class="trGraphHide" style="display:none;">
					<th class="header">Graph Type</th>
					<td class="data" colspan=3>
						<select id=sltGraphType  onChange="setGraphType();">
							<option value="dBarChart" selected>Discrete Bar Chart</option>
							<option value="BarChart" selected>Multi Bar Chart</option>
							<option value="LineChart" >Line Chart</option>
							<option value="Pie" >Pie Chart</option>
							<option value="mLineChart" >Multi Line Chart</option>
							<option value="barLineChart" >Bar Line Chart</option>
							<option value="boxPlot" >Box Plot</option>
							<option value="Scatter" >Scatter Chart</option>
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
				<tr class="trGraphHide" style="display:none;">
					<th class="header">Pie Height</th>
					<td class="data" colspan=3>
						<input type=text id=txPHeight value=""  class="inputAttr" onBlur="setPHeight();" style="width:170px;text-align:right;" /> px
					</td>
				</tr>
				<tr class="trGraphHide" style="display:none;">
					<th class="header">Pie Width</th>
					<td class="data" colspan=3>
						<input type=text id=txPWidth value=""  class="inputAttr" onBlur="setPWidth();" style="width:170px;text-align:right;" /> px
					</td>
				</tr>
				<tr class="trGraph" style="display:none;">
					<th class="header">Options</th>
					<td class="data" colspan=3  style="padding:0px 0px 0px 0px;">
						<div id="dvGraphOpt1" style="border:1px solid #dddddd;width:484px;height:48px;overflow-y:hidden;overflow-x:hidden;"></div>
						<div id="dvGraphOpt2" style="border:1px solid #dddddd;width:484px;height:48px;overflow-y:hidden;overflow-x:hidden;"></div>
						<div id="dvGraphOpt3" style="border:1px solid #dddddd;width:484px;height:48px;overflow-y:hidden;overflow-x:hidden;"></div>
						<textarea id=txrGraphOptions  style="width:480px;height:40px;border:0px solid #fefefe;" onBlur="setGraphOptions();"></textarea>
					</td>
				</tr>
				<tr class="trGraph" style="display:none;">
					<th class="header">Graph Statement</th>
					<td class="data" colspan=3 style="padding:0px 0px 0px 0px;">
						<textarea id=txrGraphStmt  style="width:480px;height:50px;border:0px solid #fefefe;" onBlur="setGraphStmt();"></textarea>
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
				<tr class="trGrid">
					<th class="header">Editable</th>
					<td class="data" colspan=3>
						<select id=sltEditable  onChange="setEditable();">
							<option value="1" >Yes</option>
							<option value="0" selected>No</option>
						</select>
					</td>
				</tr>
				<tr class="trGrid">
					<th class="header">Auto Edit</th>
					<td class="data" colspan=3>
						<select id=sltAutoEdit  onChange="setAutoEdit();">
							<option value="1" >Yes</option>
							<option value="0" selected>No</option>
						</select>
					</td>
				</tr>
				<tr class="trGrid">
					<th class="header">Enable Add Row</th>
					<td class="data" colspan=3>
						<select id=sltAddRow  onChange="setAddRow();">
							<option value="1" >Yes</option>
							<option value="0" selected>No</option>
						</select>
					</td>
				</tr>
				<tr class="trGrid">
					<th class="header">Fit Columns</th>
					<td class="data" colspan=3>
						<select id=sltFitColumns  onChange="setFitColumns();">
							<option value="1" >Yes</option>
							<option value="0" selected>No</option>
						</select>
					</td>
				</tr>
			</table>
		</div>
		

		
		<div class="tab2">
			<table id=tbAttr2 cellspacing="0" cellpadding="5" style="border:1px solid #3d95c0;width:100%;">
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
					<td colspan=2 style="padding:0px 0px 0px 0px;">
						<div id="grClickSTP" style="border:1px solid #dddddd;width:500px;height:100px;overflow-y:hidden;overflow-x:hidden;"></div>
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
					<td colspan=2 style="padding:0px 0px 0px 0px;">
						<div id="grDblSTP" style="border:1px solid #dddddd;width:500px;height:100px;overflow-y:hidden;overflow-x:hidden;"></div>
					</td>
				</tr>
			</table>
		</div>
		
		
		
		<div class="tab3">
			<table id=tbAttr3 cellspacing="0" cellpadding="5" style="border:1px solid #3d95c0;width:100%;">
				<tr>
					<th class="header" style="width:80px;">Library</th>
					<td class="data attrInfo" colspan=1 >
						<select id="sltLibrary" onChange="getTables();" style="width:470px;"></select>
					</td>
				</tr>
				<tr>
					<th class="header" style="width:80px;">Data</th>
					<td class="data attrInfo" colspan=1 >
						<select id="sltTables" onChange="getColumns();" style="width:470px;"></select>
					</td>
				</tr>
				<tr>
					<th class="header" style="width:80px;">Pre-Execution Code</th>
					<td class="data attrInfo" colspan=1 >
						<select id="sltPreCodeYN" onChange="setPreCodeYN();" style="width:470px;">
							<option value="N">Not Used</option>
							<option value="Y">User Input</option>
						</select>
					</td>
				</tr>
				<tr class="clsPreCode" style="display:none;">
					<td class="data" colspan=2 style="padding:0px 0px 0px 0px;height:200px;width:100%;">
						<textarea id=txrPreCode  style="height:200px;border:0px solid #fefefe;width:520px;" onBlur="setPreCode();"></textarea>
					</td>
				</tr>
				<tr id="udGrid" class="clsUD">
					<td class="data" colspan=2 style="padding:0px 0px 0px 0px;height:200px;width:220px;">
						<div id="dvButton" align=center style="padding:3px 3px;">
							<div style="float:left">Visibility - S:Show / H:Hidden / X:eXcept
							</div>
							<div style="float:center">
							<img src="/SASHBI/images/arrow-up-default.gif" border=0 onClick="moveUp();">
							<img src="/SASHBI/images/arrow-down-default.gif" border=0 onClick="moveDown()">
							</div>
						</div>					
						<div id="dvSltdCols" style="border:1px solid #dddddd;width:575px;height:555px;"></div>
					</td>
				</tr>
				<tr id="udGridTree" class="clsUD">
					<td class="data" colspan=2 style="padding:0px 0px 0px 0px;height:200px;width:220px;">
						<div id="dvButton" align=center style="padding:3px 3px;">
							<div style="float:left">Visibility - S:Show / H:Hidden / X:eXcept
							</div>
							<div style="float:center">
							<img src="/SASHBI/images/arrow-up-default.gif" border=0 onClick="moveUp();">
							<img src="/SASHBI/images/arrow-down-default.gif" border=0 onClick="moveDown()">
							</div>
						</div>					
						<div id="dvGTSltdCols" style="border:1px solid #dddddd;width:575px;height:555px;"></div>
					</td>
				</tr>
				<tr id="udDbar" class="clsUD"> 
					<td colspan=2 style="padding:0px;">
						<table cellspacing="0" cellpadding="5"  style="border:0px solid red;margin:0px;width:100%;" border=1>
							<tr style="width:100%;">
								<th class="header" style="">Dbar</th>
								<th class="header attrInfo" style="">Role</th>
							</tr>
							<tr>
								<td class="data" style="height:400px;width:50%;padding:0px;">
									<!--div id=dvColumns ondrop="drop(event)" ondragover="allowDrop(event)" style="width:250px;height:400px;border:0px solid blue;overflow-y:auto;padding-bottom:25px;padding-left:15px;;"-->
									<div id=dvColumns class="rollInfo" style="height: 400px;min-height: 40px;">
									</div>
								</td>
								<td class="data attrInfo" style="height:400px;width:50%;padding:0px;">
									<div id=dvSeledtedXTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>X Axis</div>
									<div id=dvSeledtedX  			class="rollInfo" style="height:182px;border:0px solid blue;"></div>
									<div id=dvSeledtedYTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Y Axis</div>
									<div id=dvSeledtedY  			class="rollInfo" style="height:182px;border:0px solid blue"></div>
								</td>
							</tr>
						</table>
					</td>
				</tr>				


				<tr id="udLine" class="clsUD"> 
					<td colspan=2 style="padding:0px;">
						<table cellspacing="0" cellpadding="5"  style="border:0px solid red;margin:0px;width:100%;" border=1>
							<tr style="width:100%;">
								<th class="header" style="">Line</th>
								<th class="header attrInfo" style="">Role</th>
							</tr>
							<tr>
								<td class="data" style="height:400px;width:50%;padding:0px;">
									<div id=dvLineColumns class="rollInfo" style="height: 400px;min-height: 40px;">
									</div>
								</td>
								<td class="data attrInfo" style="height:400px;width:50%;padding:0px;">
									<div id=dvLineSeledtedXTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Category</div>
									<div id=dvLineSeledtedX  			class="rollInfo" style="height:182px;border:0px solid blue;"></div>
									<div id=dvLineSeledtedYTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Analysis</div>
									<div id=dvLineSeledtedY  			class="rollInfo" style="height:182px;border:0px solid blue"></div>
								</td>
							</tr>
						</table>
					</td>
				</tr>				

				<tr id="udPie" class="clsUD"> 
					<td colspan=2 style="padding:0px;">
						<table cellspacing="0" cellpadding="5"  style="border:0px solid red;margin:0px;width:100%;" border=1>
							<tr style="width:100%;">
								<th class="header" style="">Pie</th>
								<th class="header attrInfo" style="">Role</th>
							</tr>
							<tr>
								<td class="data" style="height:400px;width:50%;padding:0px;">
									<div id=dvPieColumns class="rollInfo" style="height: 400px;min-height: 40px;">
									</div>
								</td>
								<td class="data attrInfo" style="height:400px;width:50%;padding:0px;">
									<div id=dvPieSeledtedXTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Category</div>
									<div id=dvPieSeledtedX  			class="rollInfo" style="height:182px;border:0px solid blue;"></div>
									<div id=dvPieSeledtedYTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Analysis</div>
									<div id=dvPieSeledtedY  			class="rollInfo" style="height:182px;border:0px solid blue"></div>
								</td>
							</tr>
						</table>
					</td>
				</tr>		
				<tr id="udBar" class="clsUD"> 
					<td colspan=2 style="padding:0px;">
						<table cellspacing="0" cellpadding="5"  style="border:0px solid red;margin:0px;width:100%;" border=1>
							<tr style="width:100%;">
								<th class="header" style="">Multi-Bar</th>
								<th class="header attrInfo" style="">Role</th>
							</tr>
							<tr>
								<td class="data" style="height:400px;width:50%;padding:0px;">
									<div id=dvBarColumns class="rollInfo" style="height: 400px;min-height: 40px;">
									</div>
								</td>
								<td class="data attrInfo" style="height:400px;width:50%;padding:0px;">
									<div id=dvBarSeledtedXTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Category</div>
									<div id=dvBarSeledtedX  			class="rollInfo" style="height:182px;border:0px solid blue;"></div>
									<div id=dvBarSeledtedYTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Analysis</div>
									<div id=dvBarSeledtedY  			class="rollInfo" style="height:182px;border:0px solid blue"></div>
								</td>
							</tr>
						</table>
					</td>
				</tr>				



				
				<tr id="udMLine" class="clsUD"> 
					<td colspan=2 style="padding:0px;">
						<table cellspacing="0" cellpadding="5"  style="border:0px solid red;margin:0px;width:100%;" border=1>
							<tr style="width:100%;">
								<th class="header" style="">Multi Line</th>
								<th class="header attrInfo" style="">Role</th>
							</tr>
							<tr>
								<td class="data" style="height:400px;width:50%;padding:0px;">
									<div id=dvMLineColumns class="rollInfo" style="height: 400px;min-height: 40px;">
									</div>
								</td>
								<td class="data attrInfo" style="height:400px;width:50%;padding:0px;">
									<div id=dvMLineSeledtedXTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>X Axis</div>
									<div id=dvMLineSeledtedX  			class="rollInfo" style="height:115px;border:0px solid blue;"></div>
									<div id=dvMLineSeledtedYTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Y Axis</div>
									<div id=dvMLineSeledtedY  			class="rollInfo" style="height:116px;border:0px solid blue"></div>
									<div id=dvMLineSeledtedGTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Group</div>
									<div id=dvMLineSeledtedG  			class="rollInfo" style="height:115px;border:0px solid blue"></div>
								</td>
							</tr>
						</table>
					</td>
				</tr>				
				<tr id="udBarLine" class="clsUD"> 
					<td colspan=2 style="padding:0px;">
						<table cellspacing="0" cellpadding="5"  style="border:0px solid red;margin:0px;width:100%;" border=1>
							<tr style="width:100%;">
								<th class="header" style="">Bar Line</th>
								<th class="header attrInfo" style="">Role</th>
							</tr>
							<tr>
								<td class="data" style="height:400px;width:50%;padding:0px;">
									<div id=dvBLineColumns class="rollInfo" style="height: 400px;min-height: 40px;">
									</div>
								</td>
								<td class="data attrInfo" style="height:400px;width:50%;padding:0px;">
									<div id=dvBLineSeledtedXTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>X Axis</div>
									<div id=dvBLineSeledtedX  			class="rollInfo" style="height:115px;border:0px solid blue;"></div>
									<div id=dvBLineSeledtedYTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Bar Variable</div>
									<div id=dvBLineSeledtedY  			class="rollInfo" style="height:116px;border:0px solid blue"></div>
									<div id=dvBLineSeledtedGTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Line Variable</div>
									<div id=dvBLineSeledtedG  			class="rollInfo" style="height:115px;border:0px solid blue"></div>
								</td>
							</tr>
						</table>
					</td>
				</tr>				
				<tr id="udBoxPlot" class="clsUD"> 
					<td colspan=2 style="padding:0px;">
						<table cellspacing="0" cellpadding="5"  style="border:0px solid red;margin:0px;width:100%;" border=1>
							<tr style="width:100%;">
								<th class="header" style="">Box Plot</th>
								<th class="header attrInfo" style="">Role</th>
							</tr>
							<tr>
								<td class="data" style="height:400px;width:50%;padding:0px;">
									<div id=dvBPlotColumns class="rollInfo" style="height: 400px;min-height: 40px;">
									</div>
								</td>
								<td class="data attrInfo" style="height:400px;width:50%;padding:0px;">
									<div id=dvBPlotSeledtedXTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>X Axis</div>
									<div id=dvBPlotSeledtedX  			class="rollInfo" style="height:115px;border:0px solid blue;"></div>
									<div id=dvBPlotSeledtedYTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Y Axis</div>
									<div id=dvBPlotSeledtedY  			class="rollInfo" style="height:116px;border:0px solid blue"></div>
									<div id=dvBPlotSeledtedGTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Group</div>
									<div id=dvBPlotSeledtedG  			class="rollInfo" style="height:115px;border:0px solid blue"></div>
								</td>
							</tr>
						</table>
					</td>
				</tr>				
				
						
				<tr id="udScatter" class="clsUD"> 
					<td colspan=2 style="padding:0px;">
						<table cellspacing="0" cellpadding="5"  style="border:0px solid red;margin:0px;width:100%;" border=1>
							<tr style="width:100%;">
								<th class="header" style="">Scatter</th>
								<th class="header attrInfo" style="">Role</th>
							</tr>
							<tr>
								<td class="data" style="height:400px;width:50%;padding:0px;">
									<div id=dvScColumns class="rollInfo" style="height: 400px;min-height: 40px;">
									</div>
								</td>
								<td class="data attrInfo" style="height:400px;width:50%;padding:0px;">
									<div id=dvScSeledtedXTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>X Axis</div>
									<div id=dvScSeledtedX  			class="rollInfo" style="height:115px;border:0px solid blue;"></div>
									<div id=dvScSeledtedYTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Y Axis</div>
									<div id=dvScSeledtedY  			class="rollInfo" style="height:116px;border:0px solid blue"></div>
									<div id=dvScSeledtedGTitle  class="rollInfo" style="background-color: #174A6C;color:#ffffff;" align=center>Group</div>
									<div id=dvScSeledtedG  			class="rollInfo" style="height:115px;border:0px solid blue"></div>
								</td>
							</tr>
						</table>
					</td>
				</tr>				
			</table>

		</div>

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
	<ul id="contextClick" 	class="contextMenu" style="display:none;position:absolute"></ul>
	<ul id="contextDblClick" 	class="contextMenu" style="display:none;position:absolute"></ul>
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