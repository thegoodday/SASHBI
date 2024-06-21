<!DOCTYPE HTML>
<%@ page language="java" contentType= "text/html; charset=UTF-8" %>
<%@ page language="java" 
    import="com.sas.datatypes.DataTypeInterface,
			com.sas.prompts.PromptValuesInterface,
			com.sas.prompts.definitions.*,
			com.sas.prompts.definitions.shared.*,
			com.sas.prompts.groups.*,
			com.sas.prompts.groups.shared.SharedTransparentGroup,
			com.sas.prompts.groups.PromptGroupInterface,
			com.sas.prompts.valueprovider.dynamic.DataProvider,
			com.sas.services.information.RepositoryInterface,
			com.sas.services.session.SessionContextInterface,
			com.sas.services.storedprocess.*,
			com.sas.services.user.UserContextInterface,
			com.sas.services.user.UserIdentityInterface,
			com.sas.storage.valueprovider.*,
			com.sas.web.keys.CommonKeys,
			com.sas.hbi.storedprocess.StoredProcessFacade,
			com.sas.hbi.tools.*,
			org.apache.log4j.*,
			org.json.*,
			java.text.DateFormat,
			java.text.ParseException,
			java.text.SimpleDateFormat,
			java.io.*,
			java.net.*,
			java.util.*"
%>
<%
	Logger logger = Logger.getLogger("EditLayout");
	logger.setLevel(Level.INFO);
	String contextName = application.getInitParameter("application-name");
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	RepositoryInterface rif = ucif.getRepository("Foundation");
	UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth");
	String hostName = rif.getHost();
	int port = rif.getPort();
	
	String principal=(String) id.getPrincipal();
	String credential=(String) id.getCredential();
	String displayName = ucif.getPerson().getDisplayName();
%>
<html lang=ko>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel=stylesheet href="/SASHBI/styles/HtmlBlue.css">
	<link rel=stylesheet href="/SASHBI/styles/Portal.css" type="text/css" />
	<link rel=stylesheet href="/SASHBI/styles/custom.css" type="text/css" />
<!--
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/css/demos.css">
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/themes/start/jquery.ui.all.css">
	<link rel="stylesheet" type="text/css" href="/SASHBI/scripts/SlickGrid/slick.grid.css">
-->
	<style>
		body {
			/*
		  min-width: 520px;
		  */
		}
		#banner{
			vertical-align:middle;
			font-weight:bold;
			color:#343434;
			padding: 20px 0px ;
		}
		#topMenu{
			position: absolute;
			top : 0px;
			right: 10px;
		}	
		.condBtn {
			width: 20px;
			height: 20px;
			float:left;
		}
	</style>
	<script src="/SASHBI/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/SASHBI/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/SASHBI/scripts/jquery/ui/jquery-ui.custom.js"></script>

	<script src="/SASHBI/scripts/SlickGrid/lib/firebugx.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/lib/jquery.event.drag-2.2.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.autotooltips.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellcopymanager.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellrangedecorator.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellrangeselector.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellselectionmodel.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellexternalcopymanager.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.checkboxselectcolumn.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.rowmovemanager.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.rowselectionmodel.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/controls/slick.columnpicker.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.core.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.formatters.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.editors.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.grid.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.dataview.js"></script>
	<script src="/SASHBI/scripts/pvt/dist/pivot.js"></script>
	<style>
		#btn1{
			float:left;
		}	
	</style>
	<script>
function kkFunc(){
	console.log("kk call....................");
}
$(function() {
/*	
	var addClasses = $( "#btnRun" ).draggable();
	console.log("addClasses : " + addClasses);
	console.log(addClasses);
	$( "#draggable" ).draggable();
	$( ".selector" ).draggable({
	  axis: "y"
	});
	
	var axis = $( ".selector" ).draggable( "option", "axis" );
	console.log("axis");
	console.log(axis);
*/	
	$("#dv1").sortable();
	$("#btn1").resizable({
      maxHeight: 350,
      maxWidth: 350,
      minHeight: 20,
      minWidth: 20
    });
	$( "#btn1" ).draggable({
		helper: "clone",
		opacity: 0.15,
		drag: function( event, ui ) {
      	//console.log(event);
      	//console.log(ui);	
		}		
	});
	$( "#btnVC" ).draggable({
		helper: "clone",
		drag: function( event, ui ) {
      	//console.log(event.pageX + ":" + event.pageY);
      	//console.log(ui);	
		},
		start: function( event, ui ) {
      	console.log("start");
      	//console.log(ui);	
		},
		stop: function ( event, ui ) {
      	console.log("stop");
      	//console.log(ui);	
		}
	});
	$( "#btnHC" ).draggable({
		helper: "clone"
	});
	$( "#btn4" ).draggable({
	});
	$( "#btn5" ).draggable({
	});
	
	$("#dv1").droppable({
		//accept: ".condBtn",
		drop: function( event, ui ) {
			event.stopPropagation();
      	var id = ui.helper.context.id;
      	cbObj(id,this.id);
      },
      over: function (event, wg){
      	console.log("dropable over : " + event.pageX + ":" + event.pageY);
      }
	});
	$("#dv1").on( "click", function( e, u ) {
		console.log("click Event : dv1");
	});
	
	$("#dvToolbar").droppable({
	});

});
var ozIndex=1000;
function cbObj(objType,target){
	console.log("objType : " + objType);
	console.log("cbObj target : " + target);

	var no=parseInt(Math.random()*1000);

	$("#"+target).append("<div id=dvObj"+no+"></div>");
	$("#dvObj"+no).css("clear","both");
	$("#dvObj"+no).css("border","0px solid #000");
	$("#dvObj"+no).css("padding","1px 1px");
	$("#dvObj"+no).height($("#dvObj"+no).height()-2);
	$("#dvObj"+no).width($("#dvObj"+no).width()-2);
	$("#dvObj"+no).css("background-color",getRandomColor());
	//$("#dvObj"+no).css("background-color","#fff");
	var  pHeight = $("#dvObj"+no).parent().height();
	$("#dvObj"+no).height(pHeight);
	$("#dvObj"+no).css("width","100%");
	$("#dvObj"+no).css("z-index",eval(ozIndex+1));
	
	var top = $("#dvObj"+no).css("top");
	var left = $("#dvObj"+no).css("left");
	console.log("top : " + top);
	console.log("left : " + left);
	console.log($("#dvObj"+no));
	console.log($("#dvObj"+no)[0].offsetTop);
	console.log($("#dvObj"+no)[0].offsetLeft);
	console.log($("#dvObj"+no)[0].offsetHeight);
	console.log($("#dvObj"+no)[0].offsetWidth);
	
	oT = $("#dvObj"+no)[0].offsetTop;    
	oL = $("#dvObj"+no)[0].offsetLeft;   
	oH = $("#dvObj"+no)[0].offsetHeight;
	oW = $("#dvObj"+no)[0].offsetWidth;

	$("#"+target).append("<div id=dvOT"+no+" class=dv" + no+"></div>");
	$("#dvOT"+no).css("border","10px solid #00ff00");
	$("#dvOT"+no).css("position","absolute");
	$("#dvOT"+no).css("top",oT+"px");
	$("#dvOT"+no).css("left",oL+"px");
	$("#dvOT"+no).css("height",eval(oH/2-20)+"px");
	$("#dvOT"+no).css("width",eval(oW-20)+"px");

	$("#"+target).append("<div id=dvOB"+no+" class=dv" + no+"></div>");
	$("#dvOB"+no).css("border","10px solid #00ffdd");
	$("#dvOB"+no).css("position","absolute");
	obTop = eval(oT+oH/2 - 10);
	console.log("obTop : " + obTop);
	$("#dvOB"+no).css("top",obTop+"px");
	$("#dvOB"+no).css("left",oL+"px");
	$("#dvOB"+no).css("height",eval(oH/2-20)+"px");
	$("#dvOB"+no).css("width",eval(oW-20)+"px");

	$("#"+target).append("<div id=dvOL"+no+" class=dv" + no+"></div>");
	$("#dvOL"+no).css("border","10px solid #ff0000");
	$("#dvOL"+no).css("position","absolute");
	$("#dvOL"+no).css("top",oT+"px");
	$("#dvOL"+no).css("left",oL+"px");
	$("#dvOL"+no).css("height",eval(oH-20)+"px");
	$("#dvOL"+no).css("width",eval(oW/2-10)+"px");

	$("#"+target).append("<div id=dvOR"+no+" class=dv" + no+"></div>");
	$("#dvOR"+no).css("border","10px solid #0000ff");
	$("#dvOR"+no).css("position","absolute");
	obLeft = eval(oL+oW/2 - 10);
	console.log("obLeft : " + obLeft);
	$("#dvOR"+no).css("top",oT+"px");
	$("#dvOR"+no).css("left",obLeft+"px");
	$("#dvOR"+no).css("height",eval(oH-20)+"px");
	$("#dvOR"+no).css("width",eval(oW/2-10)+"px");

	$("#dvOT"+no).hide();
	$("#dvOB"+no).hide();
	$("#dvOL"+no).hide();
	$("#dvOR"+no).hide();
	
	
	if (objType == "btnVC"){
	} else if (objType == "btnHC"){
	}
	$("#"+target).droppable('option', 'disabled', true);
	ozIndex++;
	$("#dvObj"+no).droppable({
		drop: function( e, u ) {
			console.log("Current Obj ID : " + u.helper.context.id);
			cbObj(u.helper.context.id,"dvObj"+no);
		}
	});
	$("#dvObj"+no).on( "click", function( e, u ) {
		console.log("click Event : dvObj" + no);
		event.stopPropagation();
	});
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
	</script>	
</head>
<body style="border:0px solid #ff0000;margin:0px 0px;padding:0px 0px;overflow-y: auto;" >
<%@include file="designerBanner.jsp"%>		
<div id="dvToolbar" style="border:1px solid blue;height:50px;">
	<div id="btn1" class="condBtn ui-widget-content" >1</div>
	<div id="btnVC" class="condBtn" >VC</div>
	<div id="btnHC" class="condBtn" >HC</div>
	<div id="btn4" class="condBtn" >4</div>
	<div id="btn5" class="condBtn" >5</div>
</div>
<div style="clean:both;">
	<div id="dv1" class="ui-sortable" style="border:1px solid blue;height:550px;z-index:500;">
	</div>
</div>
</body>
</html>
