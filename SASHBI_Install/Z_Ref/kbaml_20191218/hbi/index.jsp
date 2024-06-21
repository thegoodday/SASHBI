<%response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");%>
<%@ page language="java"
    import="java.net.URL,
						java.net.URLEncoder,
						java.net.URLDecoder,
						java.io.*,
						java.util.*,
						org.apache.log4j.*,
						com.sas.hbi.omr.MetadataObjectIf,
						com.sas.hbi.omr.MetadataSearchUtil,
						com.sas.hbi.tools.MetadataUtil,
						com.sas.hbi.tools.Page,
						com.sas.hbi.tools.Stub,
						com.sas.hbi.property.HBIConfig,
						com.sas.services.information.metadata.PathUrl,
						com.sas.services.information.RepositoryInterface,
						com.sas.services.session.SessionContextInterface,
						com.sas.services.user.UserContextInterface,
						com.sas.services.user.UserIdentityInterface,
						com.sas.servlet.tbeans.models.TreeNode,
						com.sas.util.Strings,
						com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8"%>

<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>    
<%
		response.sendRedirect("http://kboamldev.kbstar.com:7980/SASHBI/main.jsp?board=/KFI_NY/AML%20Compliance");

    	Logger logger = Logger.getLogger("Index.jsp");
    	//logger.setLevel(Level.DEBUG); 
    	long now = new Date().getTime();
    	String contextName = application.getInitParameter("application-name");
    	String host = request.getServerName();
    	String uri = request.getRequestURI();	// contextName equal....
    	uri=request.getServerName();
    	uri += ":" + request.getServerPort();
    	//URL reqURI = new URL(request.getRequestURI());
    	//int port = reqURI.getPort();
    	
    	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
			UserContextInterface ucif    = sci.getUserContext();
			RepositoryInterface rif = ucif.getRepository("Foundation");
			UserIdentityInterface id  = ucif.getIdentityByDomain("DefaultAuth");
		String displayName = ucif.getPerson().getDisplayName();
			String hostName = rif.getHost();
			int port = rif.getPort();

    	Page pInfo = new Page();
    	pInfo.initMSU(sci,hostName, String.valueOf(port));
    		
    	HashMap<String, String> boardList = pInfo.getBoardList();
    	logger.debug("boardList : " + boardList);
    	
    	pInfo.closeMSU(); 
    	long now2 = new Date().getTime() - now;
    	logger.debug("Elaped Time closeMSU: " + now2);
    	
    	//Properties conf = new HBIConfig().getConfig();
    	HBIConfig hbiconf = HBIConfig.getInstance();
		Properties conf = hbiconf.getConf();
    	String installPath = conf.getProperty("stp.installpath");
    	logger.info("installPath : " + installPath);
    %>
<!doctype html>
<html>	
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>SASHBI</title>
	<style>
#banner{
	color: #fff;
	height:34px;
	font-size: 14px;
	/*font-family: 'Malgun Gothic',Tahoma, Gulim, Helvetica, Helv;*/
	vertical-align:middle;
	padding:6px 0px 0 20px;
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #0b2330), color-stop(1, #154157));
	background: -moz-linear-gradient(top, #0b2330 0%, #154157 100%);
	background: -webkit-linear-gradient(top,  #0b2330 0%, #154157 100%);
	background: -o-linear-gradient(top,  #0b2330 0%, #154157 100%);
	background: -ms-linear-gradient(top,  #0b2330 0%, #154157 100%);
	background: linear-gradient(top,  #0b2330 0%, #154157 100%);
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0b2330', endColorstr='#154157', gradientType=0);
	border-bottom: 1px solid #000;
}
#banner table span {padding-left: 23px; background: url('./images/icon_menu.png') no-repeat left center; line-height: 22px;}
#banner table span sup {vertical-align: text-top; font-size: 10px; line-height: 12px;}
#topMenu {position: absolute; top: 10px; right: 16px;}
#topMenu .search_wrap {position: relative; display: inline-block;}
#topMenu .search_wrap input[type=text] {width: 160px; height: 22px; padding: 0 25px 0 10px; border: none; border-radius: 11px;}
#topMenu .search_wrap .btn_search {position: absolute; width: 20px; height: 20px; border: none; background: url('./images/icon_gnb_search.png') no-repeat center; right: 1px; top: 1px;}
#topMenu a {display:inline-block; margin-left: 10px; vertical-align: top; text-decoration: none; font-size: 0; line-height: 22px;}
#topMenu a i {display: inline-block; width: 22px; height: 22px; background: url('./images/icon_gnb_function.png') no-repeat left top; vertical-align: middle;}
#topMenu a.alarm i {background-position: left 0;}
#topMenu a.help i {background-position: left -22px;}
#topMenu a.log_off i {margin-right: 8px; background-position: left -44px;}
#topMenu a.alarm:hover i {background-position: right 0;}
#topMenu a.help:hover i {background-position: right -22px;}
#topMenu a.log_off:hover i {background-position: right -44px;}
#topMenu a.log_off {color: #6ac4c9; font-weight:400; font-size:11px;}
#dvLogoutPannel{
	position : absolute;
	top : 51px;
	right : 0px;
	padding : 10px 30px 10px 30px;
	z-index: 9999;
	background-color:#fff;
	border: 1px solid #C3C3C3;
	box-shadow: 5px 5px 5px #DADADA;
	cursor: pointer;
	display: none;
}
button[type=button] {cursor: pointer;}
.btn_more {position: absolute; width: 10px; height: 19px; background: url('./images/icon_main_dot.png') no-repeat center; border: none; cursor: pointer; right: 10px; top: 8px;}
.container {padding : 10px 10px 10px 10px;}
.link_box {
	position: relative;
	display: inline-block;
	float: left;
	width: 158px;
	height: 158px;
	border-radius: 2px;
	box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.4);
	-webkit-box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.4);
	-moz-box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.4);
	text-shadow: none;
	text-align: center;
	cursor: pointer;
	margin: 8px 8px 8px 8px;
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #133F53), color-stop(1, #040d12));
	background: -moz-linear-gradient(top, #0d2937 0%, #040d12 100%);
	background: -webkit-linear-gradient(top,  #133F53 0%, #23759C 100%);
	background: -o-linear-gradient(top,  #0d2937 0%, #040d12 100%);
	background: -ms-linear-gradient(top,  #0d2937 0%, #040d12 100%);
	background: linear-gradient(top,  #0d2937 0%, #040d12 100%);
}
.link_box:hover {
	background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ddd), color-stop(1, #ddd));
}
.circle{
	border : 0px solid white;
	background: url('./images/vimg/sasIcons/sasdark/48_png/circle.png') no-repeat left top;
	margin-top: 30px;margin-left: 55px;
}
.link_box .circle .box_icon {
	display: inline-block; width: 48px; height: 30px; margin-top: 16px;margin-left: -24px;
	background: url('./images/vimg/sasIcons/sasdark/48_png/VisualAnalyticsExplorerThumbnail.png') no-repeat left top;
	background-size: 20px 20px;
	filter: brightness(0) invert(1);
}
.link_box .box_title {display: block; color: #fff; margin-top: 3px; padding: 0 17px; font-size: 15px; line-height: 23px;}			
.link_box .box_desc {display: block; color: #fff; margin-top: 3px; padding: 0 17px; font-size: 11px; line-height: 15px;}			
	</style>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>	
	<script>
var colorL=[{"s":"11394D","e":"23759C"},{"s":"FF8204","e":"BF6000"},{"s":"800080","e":"570057"},{"s":"004000","e":"002200"},{"s":"0000A0","e":"00005B"}];
function chgColor(){
	var ii=0;
	$(".link_box").each(function() {
		sVal=colorL[ii].s;
		eVal=colorL[ii].e;
		console.log(sVal + ":" + eVal);
		$( this ).css("background","-webkit-linear-gradient(top,#"+sVal+" 0%,#"+eVal+" 100%");
		//$( this ).css("background","-webkit-gradient(linear, left top, left bottom, color-stop(0,"+sVal+"), color-stop(1, #"+eVal+"))");
		//$( this ).css("background","-webkit-linear-gradient(top,#"+sVal+" 0%,#"+eVal+" 100%");
		//$( this ).css("background","-o-linear-gradient(top,#"+sVal+" 0%,#"+eVal+" 100%");
		//$( this ).css("background","-ms-linear-gradient(top,#"+sVal+" 0%,#"+eVal+" 100%");
		//$( this ).css("background","linear-gradient(top,#"+sVal+" 0%,#"+eVal+" 100%");
		ii++;
	});

}
function openBoard(boardName){
	self.location.href="/<%=contextName%>/main.jsp?board="+boardName;
}
function linkHelp(){
	window.open("http://support.sas.com/software/products/rmb/index.html#s1=1");
}
function confirmLogout(){
	$("#dvLogoutPannel").show();
}	
function logoutHBI(){
	window.location.href="/SASHBI/Logoff";
}
$(document).ready(function () {
	$(window.document).bind( "click", function() {
		$("#dvLogoutPannel").hide();
	});
	chgColor();
});
	</script>
</head>
<body style="border:0px solid #ff0000;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;overflow-y: auto;" scroll=auto>
	<div id="banner"><!-- 수정 -->
		<div id="topMenu"><!-- 수정 -->
			<a href="javascript:linkHelp();" class="help"><i></i>도움말</a>
			<a href="javascript:confirmLogout();" class="log_off"><i></i><%=displayName%></a>
		</div>
		<div>
			<table width="100%">
				<tr>
					<td>
						<span>
							SAS<sup>®</sup> HBI Home
						</span>
					</td>
				</tr>
			</table>		
		</div>
	</div> 
	<div id=dvLogoutPannel onClick="logoutHBI();">
		로그아웃
	</div>


	<div class="container">
<% 
	Iterator it = boardList.entrySet().iterator();
	int cnt=0;
	while(it.hasNext()){
		cnt++;
		Map.Entry board = (Map.Entry)it.next();
		String boardName = (String) board.getKey();
		String boardDesc = (String) board.getValue();
		//if (boardDesc.equalsIgnoreCase("")) boardDesc=boardName;
		it.remove();
		logger.debug(boardName + " : " + boardDesc + ":");
%>
			<div class="link_box" onClick="openBoard('<%=boardName %>');">
				<button type="button" class="btn_more"></button>
				<div class=circle>
					<span class="box_icon" style="background: url('./images/vimg/sasIcons/sasdark/48_png/VisualAnalyticsExplorerThumbnail.png') no-repeat left top;background-size: 20px 20px;"></span>
				</div>
				<span class="box_title"><%=boardName %></span>
				<span class="box_desc"><%=boardDesc %></span>
			</div>
<%		
		
	}
%>				
	</div>

<%
/*
    Enumeration paramNames = request.getSession().getAttributeNames();
    out.println("<table border=0 cellspacing=0 cellpadding=3>");
    out.println("<tr bgcolor=white><td colspan=2>getParameterNames()</td></tr>");

    paramNames = request.getParameterNames();
    while(paramNames.hasMoreElements()){
        String name = paramNames.nextElement().toString();
        String value = new String(request.getParameter(name).getBytes("EUC-KR"),"EUC-KR");
        if("".equals(value)||value==null){
            value = "&nbsp;";
        }
        out.println("<tr>");
        out.println("<td>"+name+"</td>");
        out.println("<td>"+value+"</td>");
        out.println("<tr>");
    }

	out.println("<tr><td>SessionID</td><td>");
	out.println(request.getSession().getId());
	out.println("</td></tr>");

   out.println("<tr bgcolor=blue><td colspan=2><span style='color:white'>getSession().getAttributeNames()</span></td></tr>");

    paramNames = request.getSession().getAttributeNames();
    while(paramNames.hasMoreElements()){
        String name = paramNames.nextElement().toString();
        String value = new String(request.getSession().getAttribute(name).toString().getBytes("EUC-KR"),"EUC-KR");
        if("".equals(value)||value==null){
            value = "&nbsp;";
        }
        out.println("<tr>");
        out.println("<td>"+name+"</td>");
        out.println("<td>"+value+"</td>");
        out.println("<tr>");
    }

    out.println("<tr bgcolor=blue><td colspan=2><span style='color:white'>getCookies()</span></td></tr>");

    Cookie[] cookies = request.getCookies();
    Cookie cookie = null;
    for(int i=0;i<cookies.length;i++){
        cookie = cookies[i];
        out.println("<tr>");
        out.println("<td>"+cookie.getName()+"</td>");
        out.println("<td>"+cookie.getValue()+" (path : "+cookie.getPath()+")</td>");
        out.println("<tr>");
    }
    
    out.println("<tr bgcolor=blue><td colspan=2><span style='color:white'>getAttributeNames()</span></td></tr>");
    Enumeration attrNames = request.getAttributeNames();
    while(attrNames.hasMoreElements()){
        String name = attrNames.nextElement().toString();
        String value = new String(request.getAttribute(name).toString().getBytes("8859_1"),"EUC-KR");
        if("".equals(value)||value==null){
            value = "&nbsp;";
        }
        out.println("<tr>");
        out.println("<td>"+name+"</td>");
        out.println("<td>"+value+"</td>");
        out.println("<tr>");
    }
    out.println("</table>");
    */
%>	
</body>
</html>