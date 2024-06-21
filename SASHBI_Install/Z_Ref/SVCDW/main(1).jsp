<%
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");
%>
<%@ page language="java"
    import="java.net.*,
    					java.net.util.*,
    					java.io.IOException,
    					java.net.URLEncoder,
						java.net.URLDecoder,
						java.io.BufferedReader,
						java.io.File,
						java.io.FileReader,						
						java.io.StringWriter,
						java.io.PrintWriter,
						java.io.IOException,
						java.io.UnsupportedEncodingException,
						java.text.*,
						java.util.*,
						javax.servlet.*,
						org.apache.log4j.*,
						org.springframework.context.annotation.Configuration,
						org.springframework.context.annotation.PropertySource,
						java.rmi.RemoteException,
						java.lang.IllegalStateException,
						com.sas.hbi.cryptoUtil.AESCipher,
						com.sas.hbi.property.HBIConfig,
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
	Logger logger = Logger.getLogger("Main.jsp");
	logger.setLevel(Level.INFO);
	;
	session.setMaxInactiveInterval(60*360);
	long lastAccTime = session.getLastAccessedTime();
	SimpleDateFormat dt1 = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
	logger.debug("lastAccTime : " + dt1.format(lastAccTime));
	logger.debug("getMaxInactiveInterval : " + session.getMaxInactiveInterval());
		
	String contextName = application.getInitParameter("application-name");
	LinkedHashMap<String, String> paramInfo = new LinkedHashMap<String, String>();

	String portalName=(String) session.getAttribute("_STPRV_portalName");
	String LOGINID=(String) session.getAttribute("_STPRV_LOGINID");
	String LOGINIP=(String) session.getAttribute("_STPRV_LOGINIP");
	String board   = request.getParameter("board");
	if(!StringUtil.isNull(board))  portalName=board;
	
	logger.info("### session LOGINID is "+LOGINID);
	logger.info("### session LOGINIP is "+LOGINIP);
	String deParam = "";
	if(StringUtil.isNull(LOGINID)){
		String SSO_EMPNO   = request.getParameter("SSO_EMPNO");
		String SSO_LOGINIP = request.getParameter("SSO_LOGINIP");
		
		String paramLG=(String) request.getParameter("param");
		
		logger.debug("paramLG : " + paramLG);
		String param="";
		String p_name="";
		String p_value="";
		try{			
			AESCipher a256 = AESCipher.getInstance();
			deParam = a256.AES_Decode(paramLG);								
			logger.debug("deParam : " + deParam);

			StringTokenizer st = new StringTokenizer(deParam,"&"); 
			while(st.hasMoreTokens()) { 
				param = st.nextToken(); 
				logger.debug("param : " + param);
				p_name=param.substring(0,param.indexOf("="));
				p_value=param.substring(param.indexOf("=")+1);
				logger.debug("p_name : " + p_name);
				logger.debug("p_value : " + p_value);
				paramInfo.put(p_name, p_value);
			} 			
		} catch (Exception e ) {
			logger.debug(e.toString());
			logger.debug("=========================================================");
		}		

		portalName  = paramInfo.get("board");
		portalName  = URLDecoder.decode(portalName, "utf-8"); 
		SSO_EMPNO   = paramInfo.get("SSO_EMPNO");
		SSO_LOGINIP = paramInfo.get("SSO_LOGINIP");
		
		logger.info("### request portalName is "+ portalName);
		logger.info("### request SSO_EMPNO is "+ SSO_EMPNO);
		logger.info("### request SSO_LOGINIP is "+ SSO_LOGINIP);

		LOGINIP = SSO_LOGINIP;
		
		logger.info("### session LOGINID is "+LOGINID);
		logger.info("### session LOGINIP is "+LOGINIP);
		
		if(!StringUtil.isNull(SSO_EMPNO))  {
			try {
				//UserView userView =  new UserView();
				//UserViewDT dt = userView.getUserView(SSO_EMPNO);
				//if(dt!=null){
					session.setAttribute("_STPRV_LOGINIP"     ,SSO_LOGINIP);
					session.setAttribute("_STPRV_portalName"  ,portalName);
					//session.setAttribute("_STPRV_LOGINID"     ,dt.getCsEngrCode());
					//session.setAttribute("_STPRV_SOCIALID"    ,dt.getCsEngrCode());
					//session.setAttribute("_STPRV_USERNAME"    ,dt.getCsEngrName());		
					//session.setAttribute("_STPRV_EMPNO"       ,dt.getCsEngrCode());
					//session.setAttribute("_STPRV_BRANCH_CODE" ,dt.getBranchCode());
					//session.setAttribute("_STPRV_INSA_CODE"   ,dt.getInsaCode());
					//session.setAttribute("_STPRV_CENTER_CODE" ,dt.getCenter2Code());
					//session.setAttribute("_STPRV_CENTER_NAME" ,dt.getCenter2Name());
					//session.setAttribute("_STPRV_GPA_CODE"    ,dt.getGpaCode());		
					//session.setAttribute("_STPRV_ACL_GUBUN"   ,dt.getAclGubun());		
				//}
			} catch(Exception e){
				logger.error(e.toString());
			}		
		}
		
	}	
	
	String USERNAME=(String) session.getAttribute("_STPRV_USERNAME");
	String CENTER_NAME=(String) session.getAttribute("_STPRV_CENTER_NAME");	
	logger.info("### USERNAME is "+USERNAME);
	logger.info("### CENTER_NAME is "+CENTER_NAME);
	
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
	
	//portalName = request.getParameter("board");
	logger.debug("portalName: " + portalName);
	if ( portalName == null) 	portalName = "Products";
	String portalID=portalName.replaceAll("/","_").replaceAll(" ","_");
	String banner_page="banner_"+portalID+".jsp";
	logger.debug("banner_page: " + banner_page);
	logger.debug("portalID: " + portalID);
	session.setAttribute("portalName",portalName);
	session.setAttribute("portalID",portalID);
	

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
<!doctype html>
<html lang="en">
<head>
<%
if (portalID.substring(0,1).equalsIgnoreCase("7")){
%>
	<meta http-equiv="X-UA-Compatible" content="IE=8" />
<%
} else {
%>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<%
}
%>
	<meta charset="utf-8">
	<title><%=contextName%></title>
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/themes/redmond/jquery-ui.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/themes/start/jquery-ui.css">
	<link rel="stylesheet" href="/<%=contextName%>/scripts/jquery/css/demos.css">
	<link rel="stylesheet" href="/<%=contextName%>/styles/custom.css" type="text/css" />
	<link rel="stylesheet" href="/<%=contextName%>/styles/<%=portalID%>.css" type="text/css" />
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-ui-1.10.2.custom.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/bitreeviewer.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/protectCode.js"></script>
	<script type="text/javascript">
var clientIP="<%=LOGINIP%>";
var portalID="<%=portalID%>";
var sas_framework_timeout=<%=lastAccTime%>;
function sas_framework_onTimeout() {
	/* Modify *****/
   var url = "https://20.8.111.49/SASLogon/TimedOut.do?_locale=ko_KR&_sasapp=SASHBI";
   url = "<%=baseURL%>/SASLogon/TimedOut.do?_locale=ko_KR&_sasapp=SASHBI";
   if(window.top){
		window.top.location.href = url;
   }
   else {
		window.location.href = url;
   }
}
function msToTime(s) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3);
}

function checkTimeoutHBI(){
	var timestamp = new Date();
	var curTime = timestamp.getTime();
	var diff = eval(curTime-sas_framework_timeout);
	console.log("Elapsed Time from last Access : " + msToTime(diff));
	if ( diff > 60*60*5*1000) {	// Timeout!!!
		sas_framework_onTimeout();
	} else {		
		setTimeout("checkTimeoutHBI();",60*1000);				//
	}
}
checkTimeoutHBI();
</script>
<script>
var menusize=220;
var menuShow="/<%=contextName%>/images/CollapseRightArrows2.gif";
var menuHide ="/<%=contextName%>/images/CollapseLeftArrows2.gif";             
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
		}		
	});
}
function alertResMsg(data){
	isDisplayProgress=1;
	var msg=eval(data);
	//console.log("MSG: " + msg.msg);
}   
function isAlive(data){
	var titleText=$("#frmBITree").contents().find("title").html(); //$("#dvDummy title").html();
	console.log("titleText : " + titleText);
	if (titleText != "<%=contextName%>"){
		//console.error("Session Expired....");
	} else {
		$("body").show();
		$("#dvDummy").html("");
		$("#dvDummy").hide();
	}
}
$(document).ready(function () {
	if($.browser.msie ==true) {
		//alert("지원하지 않는 브라우져 입니다. \nChrome이나 Firefox 와 같은 브라우져를 설치하고 \n다시 로그인 하시기 바랍니다.");
		//window.location.href='/SASHBI/Logoff';
	}
	var timestamp = new Date();
	console.log("timestamp.getTime() : " + timestamp.getTime());
	$("#tabs").tabs({
		activate: function( event, ui ) {
			$(window).resize();
		}
	});
	$("#banner span").bind("click", function() {
		//var tabs = $("#tabs").tabs();
		//tabs.tabs({active:0});
		window.location.reload();
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
			//$(this).addClass("mouseover");
			//$(this).removeClass("mouseout");
			tooltip(e,msg);			//권상철 차장 요청사항 : 2018.06.13
		})
		.mouseleave(function(e) {
			$("#dvTooltip").html("");
			$("#dvTooltip").hide();
			//$(this).addClass("mouseout");
			//$(this).removeClass("mouseover");
		});
	$("body").show();
})	
setTimeout("isAlive()",1000*3);
var url='/SASLogon/login?service=' + "<%=hbiURL%>/j_spring_cas_security_check";
</script>
</head>
<body style="display:none;border:0px solid #ff0000;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;overflow-y: hidden;" scroll=no oncontextmenu="//return false">

<%
HBIConfig hbiconf = HBIConfig.getInstance();
Properties conf = hbiconf.getConf();
String stpInstallPath = conf.getProperty("stp.installpath");
logger.debug("stpInstallPath : " + stpInstallPath);
String os=System.getProperty("os.name").substring(0,3);
String sep="/";
logger.debug("OS: "+os);
if (os.equalsIgnoreCase("Win")) sep="\\" ; 
logger.debug("Seperater: "+sep);
//banner_page=banner_page.replace("/","\\");
String filePath = stpInstallPath+sep+"jsp"+sep+banner_page;
banner_page="jsp/"+banner_page;
logger.debug("banner_page : " + banner_page);
logger.debug("banner file : " + filePath);
File f = new File(filePath);
if(f.exists() && !f.isDirectory()) { 
%>
	<jsp:include page="<%=banner_page%>" >
		<jsp:param name="displayName" value="<%=displayName%>"/>
		<jsp:param name="USERNAME" value="<%=USERNAME%>"/>
		<jsp:param name="CENTER_NAME" value="<%=CENTER_NAME%>"/>
	</jsp:include>
<%
} else {
%>
	<jsp:include page="jsp/banner.jsp" >
		<jsp:param name="displayName" value="<%=displayName%>"/>
	</jsp:include>
<%
}
%>
	
<div id="tabs">
  <ul>
<%
	ppInfoIter = pDescInfo.keySet().iterator();
	while (ppInfoIter.hasNext()) {
		fID = (String) ppInfoIter.next();
		fID = fID.substring(fID.indexOf(".")+1);
		fName = (String) pNameInfo.get(fID);
		fDesc = (String) pDescInfo.get(fID);
		//logger.debug("fDesc : " + fDesc);
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
		      <img id="menuShowHide<%=fID%>" name="menuShowHide<%=fID%>" title="Open/Close" src="/<%=contextName%>/images/CollapseLeftArrows2.gif" border=0>
		      </a>
			</div>
    </td>
    <td class="" style="width:10px;">
    	&nbsp;
    </td>
    <td width="100%" style="padding:0px;">
      <iframe name="frm<%=contextName%><%=fID%>" id="frm<%=contextName%><%=fID%>" width="100%"" frameborder="0" src="<%=pURL%>" alt=''></iframe>
    </td>
  </tr>
</table> 
<style>
#accordion-resizer<%=fID%> {
	padding: 0px 0px 0px 0px; 
	width: 200px;
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
		$("#dvMenuIMG<%=fID%>").css("top",eval(tabHeight+43) + "px");
  }
  else {
		imgMenuHide<%=fID%>=new Image();
		imgMenuHide<%=fID%>.src=menuHide;
		document.menuShowHide<%=fID%>.src=imgMenuHide<%=fID%>.src;
		isHide<%=fID%>=0;      
		$("#accordion-resizer<%=fID%>").show("slow");
		$("#dvMenuIMG<%=fID%>").css("position","absolute");
		//$("#dvMenuIMG<%=fID%>").css("left",eval(accWidth<%=fID%>+1)+"px");
		$("#dvMenuIMG<%=fID%>").css("left",eval(accWidth<%=fID%>)+"px");
		var tabHeight = $(".ui-tabs-nav").height();
		$("#dvMenuIMG<%=fID%>").css("top",eval(tabHeight+43) + "px");
  }
	accWidth<%=fID%>=$("#accordion-resizer<%=fID%>").width();
}
function resizeFrame<%=fID%>(){
	var topMenuHeight=22;
	$("#frm<%=contextName%><%=fID%>").css("height",eval($(window).height()-$("#banner").height()-$("ul:first").height()-topMenuHeight)+"px");
	$("#accordion-resizer<%=fID%>").css("height",eval($(window).height()-$("#banner").height()-$("ul:first").height()-topMenuHeight-20)+"px");
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
		active: false,
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
	setTimeout("adjustOverflow();",1000*2);
});
function adjustOverflow(){
	$(".ui-accordion-content-active").css("overflow-y","auto");
	//console.log("h3 binding....");
}
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
				logger.error(e.getStackTrace().toString());
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

<%
HttpSessionContext context = session.getSessionContext();
Enumeration ids = context.getIds();
while(ids.hasMoreElements())
{
	String idd = (String) ids.nextElement();
	out.println(idd);
	HttpSession foreignSession = context.getSession(idd);
	String foreignUser = (String) foreignSession.getValue("empno");
	String foreignName = (String) foreignSession.getValue("dept");
	logger.debug("context.getIds() ::::::::::::" +foreignUser + ":" + foreignName);
}
%>
<!-- Modify --->
<%
if (portalID.substring(0,1).equalsIgnoreCase("7")){
%>
<script>
$(document).ready(function () {
	$(".STPRVmenuItem a").each(function(){	
		var orgHref=$(this).attr("href");
		orgHref+="&SSO_EMPNO=<%=LOGINID%>&SSO_LOGINIP=<%=LOGINIP%>"
		$(this).attr("href",orgHref);
		//console.log($(this).attr("href"));
	});
	
});
</script>
<%	
}
%>
</body>
</html>
