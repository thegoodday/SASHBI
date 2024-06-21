<%
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");
%>
<!doctype html>
<%@ page language="java"
    import="java.net.URLEncoder,
			java.net.URLDecoder,
			java.io.BufferedReader,
			java.io.File,
			java.io.FileReader,						
			java.io.StringWriter,
			java.io.PrintWriter,
			java.io.IOException,
			java.util.*,
			org.apache.logging.log4j.*,
			org.apache.logging.log4j.core.config.Configurator,
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
<%@ page language="java"
	import="java.rmi.RemoteException,	
			org.apache.commons.lang.StringUtils,
			com.sas.metadata.remote.AssociationList,
			com.sas.metadata.remote.CMetadata,
			com.sas.metadata.remote.ClassifierMap,
			com.sas.metadata.remote.MdException,
			com.sas.metadata.remote.MdFactory,
			com.sas.metadata.remote.MdFactoryImpl,
			com.sas.metadata.remote.MdOMIUtil,
			com.sas.metadata.remote.MdOMRConnection,
			com.sas.metadata.remote.MdObjectStore,
			com.sas.metadata.remote.MetadataObjects,
			com.sas.metadata.remote.PrimaryType,
			com.sas.metadata.remote.TextStore,
			com.sas.metadata.remote.Tree,
			com.sas.servlet.tbeans.models.TreeNode"
	contentType="text/html; charset=UTF-8"%>
<%
//org.apache.log4j.*,
/*
			org.apache.logging.log4j.LogManager,
			org.apache.logging.log4j.Logger,	
			org.apache.logging.log4j.core.config.Configurator,
 */
// /sas/sasv94m8/config/Lev2/Web/WebAppServer/SASServer2_1/sas_webapps/sas.hbi.war/main.jsp
	String contextName = application.getInitParameter("application-name");
	// Logger logger = Logger.getLogger("Main.jsp");
	// logger.setLevel(Level.DEBUG); 
	Logger logger = LogManager.getLogger(this.getClass());
	Configurator.setRootLevel(Level.ERROR);
	Configurator.setLevel(this.getClass(), Level.INFO);
	
	long lastAccTime = session.getLastAccessedTime();
	session.setMaxInactiveInterval(60*60*5);
	
	String protocol=request.getProtocol().substring(0,request.getProtocol().indexOf("/"));
	int serverPort = request.getServerPort();
	String wServerName = request.getServerName();
	String reqURI = request.getRequestURI().substring(1,request.getRequestURI().indexOf("/", 1));
	
	String baseURL=protocol.toLowerCase() + "://" +  wServerName ;
	String hbiURL = baseURL;
	if (serverPort != 80) {
		hbiURL += ":" + serverPort ;
		baseURL = hbiURL ; 
	}
	hbiURL += "/" + reqURI;
	logger.info("hbiURL : " + hbiURL);	
	
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
	String portalID=portalName.replaceAll("/","_").replaceAll(" ","_");
	String banner_page="/jsp/banner_"+portalID+".jsp";
	logger.debug("banner_page: " + banner_page);
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

	HBIConfig hbiconf = HBIConfig.getInstance();
	Properties conf = hbiconf.getConf();
	String stpInstallPath = conf.getProperty("stp.installpath");
	String os = System.getProperty("os.name").substring(0,3);
	String sep = "/";
	if (os.equalsIgnoreCase("Win")) {
		sep = "\\" ; 
		banner_page = banner_page.replace("/","\\");
	}	
%>
<html lang="ko">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
	<meta charset="utf-8">
	<title>SASHBI</title>
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/themes/redmond/jquery-ui.css">
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/themes/start/jquery-ui.css">
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/css/demos.css">
	<link rel="stylesheet" href="/SASHBI/styles/custom.css" type="text/css" />
	<link rel="stylesheet" href="/SASHBI/styles/<%=portalID%>.css" type="text/css" />
	<script src="/SASHBI/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/SASHBI/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/SASHBI/scripts/jquery/js/jquery-ui-1.10.2.custom.js"></script>
	<script src="/SASHBI/scripts/jquery/bitreeviewer.js"></script>
	<script src="/SASHBI/scripts/jquery/main.js"></script>
	<script type="text/javascript">
var portalID="<%=portalID%>";
var sas_framework_timeout=<%=lastAccTime%>;
var url='/SASLogon/login?service=' + "<%=hbiURL%>/j_spring_cas_security_check";
function sas_framework_onTimeout() {
   var url = "<%=baseURL%>/SASLogon/TimedOut.do?_locale=ko_KR&_sasapp=SASHBI";
   if(window.top){
		window.top.location.href = url;
   }
   else {
		window.location.href = url;
   }
}
checkTimeoutHBI();
</script>
</head>
<body style="display:none;border:0px solid #ff0000;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;overflow-y: hidden;" scroll=no>
<%
	String filePath = stpInstallPath+banner_page;
	File f = new File(filePath);
	if(f.exists() && !f.isDirectory()) { 
		%>
		<jsp:include page="<%=banner_page%>" >
		<jsp:param name="displayName" value="<%=displayName%>"/>
		</jsp:include>
		<%
	} else {
		logger.debug("banner default");
		%>
		<jsp:include page="/jsp/banner.jsp" >
		<jsp:param name="displayName" value="<%=displayName%>"/>
		</jsp:include>
		<%
	}
	logger.debug("stpInstallPath : " + stpInstallPath);
	logger.debug("OS: "+os);
	logger.debug("Seperater: "+sep);
	logger.debug("banner_page : " + banner_page);
	logger.debug("banner file : " + filePath);
%>	
<%!
public static class MenuTree {
	private SessionContextInterface sci = null;
	private MdFactory mdFactory = null;
	public MenuTree(SessionContextInterface sci) {
		this.sci = sci;
		initializeFactory();
	}
	private void initializeFactory() {
		try {
			mdFactory = new MdFactoryImpl(false);

			boolean debug = false;
			if (debug) {
				mdFactory.setDebug(false);
				mdFactory.setLoggingEnabled(false);
				mdFactory.getUtil().setOutputStream(System.out);
				mdFactory.getUtil().setLogStream(System.out);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public static void traverseTree(TreeNode tn, String p,
			javax.servlet.jsp.JspWriter out, String sessionID,
			String vaReportDirection, String fID, String contextName)
			throws IOException {

		// Logger logger2 = Logger.getLogger("Main.jsp");
		Logger logger2 = LogManager.getLogger();
		// logger2.setLevel(Level.DEBUG);

		String[] s = null;
		s = (String[]) tn.getUserObject();
		String itemText = tn.getText();
		int isDLM = itemText.indexOf("|");
		if (isDLM > 0) {
			itemText = itemText.substring(0, isDLM);
		}
		int level 		= p.length();
		String uDesc 	= tn.getTitle();
		String url 		= tn.getURL();
		String desc 	= "";
		String objType 	= s[0];
		String objID 	= s[1];
		String shortID	= objID.substring(9);
		String objName 	= s[2];
		String objDesc 	= s[3];
		String blk		= "&nbsp;";
		logger2.debug("TreeInfo:" + p + ":" + level + " objType:" + objType + " objID:" + objID + " shotID:" + shortID + " objName:" + objName + ":" + objDesc);

		if (objDesc.equalsIgnoreCase("")) {
			desc = objName;
		} else {
			desc = objDesc;
		}

		if (level == 2 && objType.equalsIgnoreCase("Tree")) {
				out.println("<h3>" + desc + "</h3>");
				out.println("<div alt='TEST'>");
		} else if (level > 2 && objType.equalsIgnoreCase("Tree")) {
			int folderDepth = level - 2 ;
			out.println("<div class='subFolder" + folderDepth +  "' onClick=\"toggleFolder('" + shortID + "')\">" + StringUtils.repeat(blk, level-2) + desc + "</div>");
			out.println("<div id=\'sub" + shortID + "\' style='display:none;'>");
		} else if (level > 2) {
			uDesc = "Report ID : " + shortID + "\n" + uDesc;
			out.println("<span class=\"STPRVmenuItem\">&nbsp;&nbsp;<a href='"
					+ url + "' target='frm" + contextName + fID + "' id='rpt" + shortID + "'" + " uDesc=\""
					+ uDesc + "\">" + itemText + "</a></span>");
		}

		if (tn.getAllowsChildren()) {
			Enumeration enm = tn.children();
			while (enm.hasMoreElements()) {
				TreeNode n = (TreeNode) enm.nextElement();
				traverseTree(n, p + " ", out, sessionID, vaReportDirection, fID, contextName);
			}
		}
		if (objType.equalsIgnoreCase("Tree")) {
			out.println("</div>");
		} 
	}
	public static void traverseTreeToObj(TreeNode tn, String p,
			javax.servlet.jsp.JspWriter out, String sessionID,
			String vaReportDirection, String fID, String contextName)
			throws IOException {

		// Logger logger = Logger.getLogger("Main.jsp");
		Logger logger = LogManager.getLogger();
		// logger.setLevel(Level.DEBUG); 

		String[] s = null;
		s = (String[]) tn.getUserObject();
		String itemText = tn.getText();
		int isDLM = itemText.indexOf("|");
		if (isDLM > 0) {
			itemText = itemText.substring(0, isDLM);
		}

		int level 		= p.length();
		String uDesc 	= tn.getTitle();
		String url 		= null;
		String objType 	= s[0];
		String objID 	= s[1];
		String shortID	= objID.substring(9);
		String objName 	= s[2];
		String objDesc 	= s[3];
		String blk		= "&nbsp;";
		logger.debug("TreeInfo:" + p + ":" + level + " objType:" + objType + " objID:" + objID + " shotID:" + shortID + " objName:" + objName + ":" + objDesc);

		if (objDesc.equalsIgnoreCase("")) objDesc = objName;

		if (level == 2 && objType.equalsIgnoreCase("Tree")) {
				out.println("");
		} else if (level > 2 && objType.equalsIgnoreCase("Tree")) {
			out.println("");
		} else if (level > 2) {
			out.println("");
		}

		if (tn.getAllowsChildren()) {
			Enumeration enm = tn.children();
			while (enm.hasMoreElements()) {
				TreeNode n = (TreeNode) enm.nextElement();
				traverseTree(n, p + " ", out, sessionID, vaReportDirection, fID, contextName);
			}
		}
		if (objType.equalsIgnoreCase("Tree")) {
			out.println("");
		} 
	}
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
			logger.debug("isLeafNodeType: " + isLeafNodeInfo.toString());
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
	//MetadataUtil.traverseTree(pageTN, "+", out, "","Viewer",fID,contextName);			
	MenuTree.traverseTree(pageTN, "+", out, "","Viewer", fID, contextName);			
%>
			</div>
		</div>
		<div id="dvMenuIMG<%=fID%>" style="position:absolute; bottom:7px;">
			<a  id="panel_control<%=fID%>" href="javascript:hideTree<%=fID%>()"> 
			<img id="menuShowHide<%=fID%>" name="menuShowHide<%=fID%>" title="Open/Close" src="/SASHBI/images/CollapseLeftArrows2.gif" border=0>
			</a>
		</div>
    </td>
    <td class="" style="width:10px;">
    	&nbsp;
    </td>
    <td width="100%" style="padding:0px;">
    	<iframe name="frmSASHBI<%=fID%>" id="frmSASHBI<%=fID%>" width="100%" frameborder="0" src="<%=pURL%>" ></iframe>
    </td>
  </tr>
</table> 
<style>
#accordion-resizer<%=fID%> {
	padding: 0px 0px 0px 0px; 
	width: 250px;
	height: 420px;
}
</style>
<script>
var isHide<%=fID%> = 1;
var accWidth<%=fID%> = menusize; 		//180;
function hideTree<%=fID%>(){ 
  if (isHide<%=fID%> != 1) {
		imgMenuShow<%=fID%> = new Image();
		imgMenuShow<%=fID%>.src = menuShow;
		document.menuShowHide<%=fID%>.src = imgMenuShow<%=fID%>.src;
		isHide<%=fID%> = 1;      
		$("#accordion-resizer<%=fID%>").hide("slow");
		$("#dvMenuIMG<%=fID%>").css("position","absolute");
		$("#dvMenuIMG<%=fID%>").css("left","0px");
		var tabHeight = $(".ui-tabs-nav").height();
		$("#dvMenuIMG<%=fID%>").css("top",eval(tabHeight+15) + "px");
  }
  else {
		imgMenuHide<%=fID%> = new Image();
		imgMenuHide<%=fID%>.src = menuHide;
		document.menuShowHide<%=fID%>.src = imgMenuHide<%=fID%>.src;
		isHide<%=fID%> = 0;      
		$("#accordion-resizer<%=fID%>").show("slow");
		$("#dvMenuIMG<%=fID%>").css("position","absolute");
		$("#dvMenuIMG<%=fID%>").css("left",eval(accWidth<%=fID%>+1)+"px");
		var tabHeight = $(".ui-tabs-nav").height();
		$("#dvMenuIMG<%=fID%>").css("top",eval(tabHeight+15) + "px");
  }
	accWidth<%=fID%> = $("#accordion-resizer<%=fID%>").width();
}
function resizeFrame<%=fID%>(){
	var topMenuHeight=22;
	$("#frmSASHBI<%=fID%>").css("height",eval($(window).height()-$("#banner").height()-$("ul:first").height()-topMenuHeight)+"px");
	$("#accordion-resizer<%=fID%>").css("height",eval($(window).height()-$("#banner").height()-$("ul:first").height()-topMenuHeight-5)+"px");
	$("#accordion<%=fID%>").accordion("refresh");
	$(".ui-accordion-content-active").css("overflow","auto");
	accWidth<%=fID%> = $("#accordion-resizer<%=fID%>").width();
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
		width: menusize
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
	console.log("h3 binding....");
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
<div id=dvAlert style="position: absolute;width:300px;display:none;padding: 15px;z-index: 100011;
	background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
	<div id=dvMsgBox style="font-size:11pt;padding:15px 0px 15px 0px;"></div>
	<div align=center>
		<input type=button id="btnAlertMsgOK" class="condBtn" value="OK" onclick="hideMsgBox();">
	</div>
</div>
<div id=dvConfirm style="position: absolute;width:300px;display:none;padding: 15px;z-index: 100011;
	background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
	<div id=dvConfirmMsgBox style="font-size:11pt;padding:15px 0px 15px 0px;"></div>
	<div align=center>
		<input type=button id="btnConfirmMsgOK"     class="condBtn" value="OK"     onclick="hideConfirmMsgBox(true,confirmFN);">
		<input type=button id="btnConfirmMsgCancel" class="condBtn" value="Cancel" onclick="hideConfirmMsgBox(false);">
	</div>
</div>
<div id=dvBG style="position: absolute;top:0px;left:0px;display:none;z-index: 100000;background: #efefef;opacity: 0.8;"></div>

<%
logger.debug("Main.jsp End ::::::::::::");
HttpSessionContext context = session.getSessionContext();
Enumeration ids = context.getIds();
while(ids.hasMoreElements()) {
	String idd = (String) ids.nextElement();
	out.println(idd);
	HttpSession foreignSession = context.getSession(idd);
	String foreignUser = (String) foreignSession.getValue("empno");
	String foreignName = (String) foreignSession.getValue("dept");
}
%>
</body>
</html>

