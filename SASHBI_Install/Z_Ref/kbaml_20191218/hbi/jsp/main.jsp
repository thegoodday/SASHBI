<%
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");
%>
<!doctype html>
<%@ page language="java"
    import="java.net.URLEncoder,
						java.net.URLDecoder,
						java.io.StringWriter,
						java.io.PrintWriter,
						java.io.IOException,
						java.util.*,
						org.apache.log4j.*,
						com.sas.hbi.omr.MetadataObjectIf,
						com.sas.hbi.omr.MetadataSearchUtil,
						com.sas.hbi.tools.MetadataUtil,
						com.sas.hbi.tools.Page,
						com.sas.hbi.tools.Stub,
						com.sas.services.information.metadata.PathUrl,
						com.sas.services.information.RepositoryInterface,
						com.sas.services.session.SessionContextInterface,
						com.sas.services.user.UserContextInterface,
						com.sas.services.user.UserIdentityInterface,
						com.sas.servlet.tbeans.models.TreeNode,
						com.sas.util.Strings,
						com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8"%>
<%
	String contextName = application.getInitParameter("application-name");
	Logger logger = Logger.getLogger("Main.jsp");
	logger.setLevel(Level.DEBUG); 

	session.setAttribute("empno","E8319");
	session.setAttribute("dept","PMO");
	
	long lastAccTime = session.getLastAccessedTime();
	
	String protocol=request.getProtocol().substring(0,request.getProtocol().indexOf("/"));
	int serverPort = request.getServerPort();
	String wServerName = request.getServerName();
	String reqURI = request.getRequestURI().substring(1,request.getRequestURI().indexOf("/", 1));
	
	String baseURL=protocol.toLowerCase() + "://" +  wServerName ;
	String hbiURL = baseURL;
	if (serverPort != 80) {
		hbiURL += ":" + serverPort ;
	}
	hbiURL += "/" + reqURI;
	logger.debug("hbiURL : " + hbiURL);
	
	
	Iterator ppInfoIter;
	HashMap<String, String> pageURLInfo = new HashMap<String, String>();
	String pURL="";
 
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();
	RepositoryInterface rif = ucif.getRepository("Foundation");
	UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth");
	String hostName = rif.getHost();
	int port = rif.getPort();

	String displayName = ucif.getPerson().getDisplayName();
	if (displayName.equalsIgnoreCase("")) displayName = ucif.getName();
	
	String portalName = "";
	portalName = request.getParameter("board");
	logger.debug("portalName: " + portalName);
	if ( portalName == null) 	portalName = "Products";

	Page pgInfo = new Page();
	pgInfo.initMSU(sci, hostName, String.valueOf(port));
	HashMap<String, String> pageList = pgInfo.getPageList(portalName); 
	logger.debug("pageList : " + pageList);
	HashMap<String, TreeNode> pageTreeInfo = pgInfo.getPageTreeInfo();
	logger.debug("pageTreeInfo : " + pageTreeInfo);
	LinkedHashMap pDescInfo = pgInfo.getPageDescriptionInfo();
	LinkedHashMap pNameInfo = pgInfo.getPageNameInfo();
	
	String boardTitle = pgInfo.getBoardTitle();
	String fName, fID, fDesc;
	
%>
<html lang="en">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=9" />
	<meta charset="utf-8">
	<title><%=contextName%></title>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-ui-1.10.2.custom.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/bitreeviewer.js"></script>
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/themes/redmond/jquery-ui.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/themes/start/jquery-ui.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/css/demos.css">
	<link rel="stylesheet" href="/<%=contextName%>/styles/custom.css" type="text/css" />
	<link rel="stylesheet" href="/<%=contextName%>/styles/custom.css" type="text/css" />
	<link rel="stylesheet" href="/<%=contextName%>/styles/kbStyle.css" type="text/css" />
	<script type="text/javascript">
var sas_framework_timeout=<%=lastAccTime%>;
function sas_framework_onTimeout() {
   var url = "<%=baseURL%>/SASLogon/TimedOut.do?_locale=ko_KR&_sasapp=SASHBI";
   if(window.top){
		window.top.location.href = url;
   }
   else {
		window.location.href = url;
   }
}
function checkTimeoutHBI(){
	var timestamp = new Date();
	var curTime = timestamp.getTime();
	var diff = eval(curTime-sas_framework_timeout);
	console.log("Elapsed Time from last Access : " + diff);
	if ( diff > 60*3600*1000) {	// Timeout!!!
		sas_framework_onTimeout();
	} else {		
		setTimeout("checkTimeoutHBI();",60*1000);				//
	}
}
checkTimeoutHBI();
</script>
<script>
var menusize=220;
var menuShow="/<%=contextName%>/images/CollapseRightArrows.gif";
var menuHide ="/<%=contextName%>/images/CollapseLeftArrows.gif";             
var isDisplayProgress=0;
function execAjax(url,sp_URI,isAsync,fn,param1,param2,param3,param4,param5,param6,param7,param8,param9,param10,param11,param12,param13,param14,param15){
	if (url=="") url="/SASStoredProcess/do?";
	var param={
	}

	$.ajax({
		url: url,
		data: param,
		dataType: 'html',
		cache:false,
		async: true,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) {
				$("#progressIndicatorWIP").show();
			}		
		},
		sucess : function(data){	
			console.log("execAjax success" );
			console.log(data);
			window[fn](data);
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alert(error);
		},
		complete: function(data){
			console.log("execAjax complete" );
			window[fn](data);
		}		
	});
}
function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	console.log("MSG: " + msg.msg);
}   
function isAlive(data){
	var titleText=$("#frmBITree").contents().find("title").html(); //$("#dvDummy title").html();
	console.log("titleText : " + titleText);
	if (titleText != "<%=contextName%>"){
		alert("Session Expired....");
	} else {
		$("body").show();
		$("#dvDummy").html("");
		$("#dvDummy").hide();
	}
}
$(document).ready(function () {
	var timestamp = new Date();
	console.log("timestamp.getTime() : " + timestamp.getTime());
	$("#tabs").tabs({
		activate: function( event, ui ) {
			$(window).resize();
		}
	});
	$(".STPRVmenuItem").bind("click", function() {
		$(".STPRVmenuItem").removeClass("curReport");
		$(this).addClass("curReport");	
	});
	$(".STPRVmenuItem")
		.mouseenter(function(e) {
			msg=$(this).find("a").attr("uDesc");
			msg='<pre>'+msg;
			msg=msg.replace(/\n/g,'<br>');
			msg=msg+'</pre>';
			tooltip(e,msg);
		})
		.mouseleave(function(e) {
			$("#dvTooltip").html("");
			$("#dvTooltip").hide();
		});
	$("body").show();
})	
setTimeout("isAlive()",1000*3);
var url='/SASLogon/login?service=' + "<%=hbiURL%>/j_spring_cas_security_check";
</script>
</head>
<body style="display:none;border:0px solid #ff0000;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;overflow-y: auto;" scroll=auto>
<%@include file="jsp/banner.jsp"%>		
<div id="tabs">
  <ul>
<%
	ppInfoIter = pDescInfo.keySet().iterator();
	while (ppInfoIter.hasNext()) {
		fID = (String) ppInfoIter.next();
		fID = fID.substring(fID.indexOf(".")+1);
		fName = (String) pNameInfo.get(fID);
		fDesc = (String) pDescInfo.get(fID);
		logger.debug("fDesc : " + fDesc);
		// description 205 character limitation!!!
		if (fDesc.equalsIgnoreCase("")) fDesc=fName;
		int hasURL = fDesc.indexOf(":");
		if (hasURL > 0){
			pURL = fDesc.substring(hasURL+1);
			logger.debug("pURL: " + pURL);
			fDesc = fDesc.substring(0,hasURL);
			pageURLInfo.put(fID,pURL);
		}
		out.println("<li><a href='#"+fID+"'>"+fDesc+"</a></li>");
	} // while
%>

  </ul>
<%
	
	ppInfoIter = pDescInfo.keySet().iterator();
	while (ppInfoIter.hasNext()) {
		fID = (String) ppInfoIter.next();
		fID = fID.substring(fID.indexOf(".")+1);
		fName = (String) pNameInfo.get(fID);
		fDesc = (String) pDescInfo.get(fID);
		TreeNode pageTN=(TreeNode)pageTreeInfo.get(fID);

		boolean isRVPage = true;
		String leafURL = "";
		String leafName = "";
		int chCnt = pageTN.getChildCount();
		logger.debug("getChildCount: " + chCnt );		
		if (chCnt == 1) {
			Enumeration penm = pageTN.children();
			TreeNode isLeafNode = (TreeNode)penm.nextElement();
			String[] isLeafNodeInfo = (String[])isLeafNode.getUserObject();
			logger.debug("isLeafNodeType: " + isLeafNodeInfo[0]);
			if (isLeafNodeInfo[0] == "StoredProcess") {
				isRVPage = false;
				leafURL = isLeafNode.getURL();
				leafName = isLeafNode.getText();
			}
		}
		logger.debug("isRVPage: " + isRVPage);
		
		pURL="";
		if(pageURLInfo.containsKey(fID)) {
			pURL = pageURLInfo.get(fID);
		}
		out.println("<div id='"+fID+"' style='padding:0px 0px 0px 0px;'>");
		if (isRVPage){		
%>
<table cellspacing="0px" cellpadding="0px" width="100%" border=0 id="menuTable<%=fID%>" >
  <tr valign="top">
    <td id="menuTD<%=fID%>" style="" >
			<div id="accordion-resizer<%=fID%>" >
				<div id="accordion<%=fID%>">
<%		
	MetadataUtil.traverseTree(pageTN, "+", out, "","Viewer",fID,contextName);			
%>
				</div>
			</div>
			<div id="dvMenuIMG<%=fID%>" style="position:absolute; bottom:7px;">
		      <a  id="panel_control<%=fID%>" href="javascript:hideTree<%=fID%>()"> 
		      <img id="menuShowHide<%=fID%>" name="menuShowHide<%=fID%>" title="Open/Close" src="/<%=contextName%>/images/CollapseLeftArrows.gif" border=0>
		      </a>
			</div>
    </td>
    <td class="" style="width:10px;">
    	&nbsp;
    </td>
    <td width="100%" style="padding:0px;">
      <iframe name="frm<%=contextName%><%=fID%>" id="frm<%=contextName%><%=fID%>" width="100%"" frameborder="0" src="<%=pURL%>" ></iframe>
    </td>
  </tr>
</table> 
<style>
#accordion-resizer<%=fID%> {
	padding: 0px 0px 0px 0px; 
	width: 180px;
	height: 420px;
}
</style>
<script>
var isHide<%=fID%>=1;
var accWidth<%=fID%>=180;
function hideTree<%=fID%>(){ 
  if (isHide<%=fID%>!=1) {
		imgMenuShow<%=fID%>=new Image();
		imgMenuShow<%=fID%>.src=menuShow;
		document.menuShowHide<%=fID%>.src=imgMenuShow<%=fID%>.src;
		isHide<%=fID%>=1;      
		$("#accordion-resizer<%=fID%>").hide("slow");
		$("#dvMenuIMG<%=fID%>").css("position","absolute");
		$("#dvMenuIMG<%=fID%>").css("left","0px");
		var tabHeight = $(".ui-tabs-nav").height();
		$("#dvMenuIMG<%=fID%>").css("top",eval(tabHeight+16) + "px");
  }
  else {
		imgMenuHide<%=fID%>=new Image();
		imgMenuHide<%=fID%>.src=menuHide;
		document.menuShowHide<%=fID%>.src=imgMenuHide<%=fID%>.src;
		isHide<%=fID%>=0;      
		$("#accordion-resizer<%=fID%>").show("slow");
		$("#dvMenuIMG<%=fID%>").css("position","absolute");
		$("#dvMenuIMG<%=fID%>").css("left",accWidth<%=fID%>+"px");
		var tabHeight = $(".ui-tabs-nav").height();
		$("#dvMenuIMG<%=fID%>").css("top",eval(tabHeight+16) + "px");
  }
	accWidth<%=fID%>=$("#accordion-resizer<%=fID%>").width();
}
function resizeFrame<%=fID%>(){
	var topMenuHeight=22;
	$("#frm<%=contextName%><%=fID%>").css("height",eval($(window).height()-$("#banner").height()-$("ul:first").height()-topMenuHeight)+"px");
	$("#accordion-resizer<%=fID%>").css("height",eval($(window).height()-$("#banner").height()-$("ul:first").height()-topMenuHeight-5)+"px");
	$("#accordion<%=fID%>").accordion("refresh");
	$(".ui-accordion-content-active").css("overflow","auto");
	accWidth<%=fID%>=$("#accordion-resizer<%=fID%>").width();
	$("#dvMenuIMG<%=fID%>").css("left",accWidth<%=fID%>+"px");
}
$(window).resize(function () {
	resizeFrame<%=fID%>();
});
$(function() {
	hideTree<%=fID%>();
	var icons = {
		header: "ui-icon-circle-arrow-e",
		activeHeader: "ui-icon-circle-arrow-s"
	};
	$( "#accordion<%=fID%>" ).accordion({
		icons: icons,
		heightStyle: "fill", //"fill""content",
		collapsible: true,
		width: 220
	});
	$( "#accordion-resizer<%=fID%>" ).resizable({
		minHeight: 300,
		minWidth: 100,
		maxWidth: 500,
		resize: function() {
			$("#accordion<%=fID%>").accordion("refresh");
		}
	});
	$(".workarea").css("overflow-y","hidden");
	resizeFrame<%=fID%>();
});
$("h3").bind("click", function (e, data) {
	resizeFrame<%=fID%>();
	$(".ui-accordion-content-active").css("overflow-y","auto");
});
</script>				
<%		
		} else { // not [Tree], [StoredProcess]
			logger.debug("leafURL: " + leafURL);
			int pp=leafURL.indexOf("=")+1;
			logger.debug("sp_pathURL: " + leafURL.substring(leafURL.indexOf("=")+1,leafURL.length()));
			
			String sp_pathURL = leafURL.substring(pp,leafURL.length());
			sp_pathURL = URLDecoder.decode(sp_pathURL,"ascii");
			logger.debug("sp_pathURL: " + sp_pathURL);
			
			logger.debug("Stub.getCustSTPPath(sp_pathURL): " + Stub.getCustSTPPath(sp_pathURL));
			String custSTPPath = Stub.getCustSTPPath(sp_pathURL) + leafName + ".jsp";
			logger.debug("leafName: " + leafName);
			logger.debug("custSTPPath: " + custSTPPath);
			try {
			%>
			<jsp:include page="<%=custSTPPath%>" flush="true" />
			<%
			} catch (Exception e) {
				logger.error(e.getStackTrace());
			}
		}
		out.println("</div>");              
	} // while
	pgInfo.closeMSU();
%>

</div>
<div id="dvDummy" style="display:none;">
		<iframe id=frmBITree src="/SASLogon/login?service=<%=hbiURL%>/j_spring_cas_security_check"></iframe>
</div>  
<div id=dvTooltip style=""></div>

</body>
</html>

