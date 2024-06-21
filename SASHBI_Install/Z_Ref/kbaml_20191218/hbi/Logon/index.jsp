<%@ page language="java" contentType="text/html; charset=EUC-KR" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.regex.*" %>
<%@ page import="org.apache.log4j.*" %>
<%------------------------------------------------------------------------------
  - /index.jsp Created on 2019. 10. 04
  -
  - Copyright (C) SAS Institute Inc. All Rights Reserved.
  -
  - Author  kortsc
  - Version 1.0
  - Date    2019-10-04
------------------------------------------------------------------------------%>
<%!
    public static boolean isNull(String str) {
        return (str == null || str.trim().length() == 0);
    }
    
    public static boolean isNullStr(String str) {
        return (str == null || str.trim().length() == 0 || "NULL".equalsIgnoreCase(str));
    }
%>

<%
Logger logger = Logger.getLogger("index.jsp");
logger.setLevel(Level.INFO); 

final String SERVER_URL=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort();
/*
final String URL_PREFIX      = "http://kboamldev.kbstar.com:7980";
final String URL_CONTEXTPATH = request.getContextPath();

logger.info("request.getContextPath() is "+ request.getContextPath());

final String refererPage1 = URL_PREFIX+"/"+"index.html";
//final String selfPage = "https://ealapo02/SASLogon/index.jsp";
final String testPage = "https://ealapo02/SASLogon/LoginServlet?method=preChallenge&returnURL=&isRemoteReq=";
final String testPage2 = "https://ealapo02/SASLogon/login/sso.html";
*/
logger.info("SERVER_URL is "+SERVER_URL);
logger.info("request.getContextPath() is "+request.getContextPath());

String refererPage  = SERVER_URL+request.getContextPath()+"/"+"sso.html";
//String testPage = SERVER_URL+request.getContextPath()+"/LoginServlet?method=checkAuthentication";
String testPage = SERVER_URL+request.getContextPath()+"/LoginServlet?method=preChallenge&returnURL=&isRemoteReq=";
//String testPage1 = SERVER_URL+request.getContextPath()+"/LoginServlet?method=preChallenge&returnURL=null&isRemoteReq=";


String userRefererPage = request.getHeader("referer");

logger.info("#####################################################################");
logger.info("userRefererPage is xxxxxxxxxxxxxxxxxxxxxxxxxxxxx "+userRefererPage);

/*
http://kboamldev.kbstar.com:7980/SASLogon/LoginServlet?method=checkAuthentication
*/

String serviceLogon = SERVER_URL+request.getContextPath()+"/login?service";
String serviceLogon1 = SERVER_URL+request.getContextPath()+"?direct_authentication_ticket";

boolean isManualLogin=false;
boolean isSasLogon   =false;

if(!isNull(userRefererPage) && userRefererPage.startsWith(serviceLogon)) {
    isManualLogin=true;
}

if(!isNull(userRefererPage) && userRefererPage.startsWith(serviceLogon1)) {
    isManualLogin=true;
}

logger.info("isManualLogin is "+isManualLogin);
logger.info("refererPage is "+refererPage);

if(refererPage.equals(userRefererPage) || 
    testPage.equals(userRefererPage) 
    /*|| testPage1.equals(userRefererPage)*/
    ) {

    if(!isManualLogin) {

%>

<%
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");
%>

<%
    Pattern pat = Pattern.compile("<SCRIPT");
    Matcher mat = null;
	boolean xssChkValue = false;
	request.setCharacterEncoding("euc-kr");
	String returnURL = request.getParameter("returnURL");
	if(returnURL == null) {
		returnURL = "";
	} else {
		mat = pat.matcher(returnURL.toUpperCase());
		if(mat.find()){
			xssChkValue =  true;
		}
	}

	String isRemoteReq = request.getParameter("isRemoteReq");
	if(isRemoteReq == null) {
		isRemoteReq = "";
	} else {
		mat = pat.matcher(isRemoteReq.toUpperCase());
		if(mat.find()){
			xssChkValue =  true;
		}
	}
	
	String initMethod = request.getParameter("initMethod");
	
	if(initMethod == null || "".equals(initMethod)) {
		initMethod = "preChallenge";
	} else {
		mat = pat.matcher(initMethod.toUpperCase());
		if(mat.find()){
			xssChkValue =  true;
		}
	}
	
	String title = request.getParameter("title");
	if(title == null || "".equals(title)) {
		title = "KB국민은행";
	} else {
		mat = pat.matcher(title.toUpperCase());
		if(mat.find()){
			xssChkValue =  true;
		}
	}
	
%>
<!doctype html>
<html>
<head>
<!--META HTTP-EQUIV="Content-Type" Pragma="no-cache" Cache-control="no-cache" CONTENT="text/html; charset=euc-kr"-->
<META HTTP-EQUIV="Content-Type"  CONTENT="text/html; charset=euc-kr">
<META HTTP-EQUIV="Pragma" CONTENT ="no-cache">
<META HTTP-EQUIV="Cache-control" CONTENT="no-cache">
<title><%=com.kbstar.wse.agent.XSSUtil.removeXSS(title, false)%></title>
<script type="text/javascript" src="/SASLogon/js/jquery.js"></script>
<script>

$(document).ready(function () {
    var IE_USER_AGENT="trident";
    var CHROME_USER_AGENT="chrome";
    var userAgent = navigator.userAgent.toLowerCase();
    if(userAgent.indexOf(IE_USER_AGENT) != -1 && parseInt(navigator.appVersion)>=4){
        //console.log("success");        
    }else {
        alert("인터넷 익스플로러 9이상만 지원합니다.\n보안 강화를 위해 현재 창을 닫습니다.");
        if(userAgent.indexOf(IE_USER_AGENT) != -1){
            top.window.close();
        }else if(userAgent.indexOf(CHROME_USER_AGENT) != -1){
            window.open('about:blank', '_self').close();
        }else {
            top.window.close();
        }
    }
});

<%
if(xssChkValue){
%>
	alert("비정상적인 접근입니다. 창을 닫습니다.");
	top.opener = null;
	top.window.close();
<% 
} 
%>
</script>
</head>
<frameset rows="100%, 0%" cols="1*">
<frame name="main" scrolling="auto" marginwidth="10" marginheight="14" src="<%=request.getContextPath()%>/LoginServlet?method=<%=com.kbstar.wse.agent.XSSUtil.removeXSS(initMethod, false)%>&returnURL=<%=java.net.URLEncoder.encode(returnURL, "EUC-KR")%>&isRemoteReq=<%=com.kbstar.wse.agent.XSSUtil.removeXSS(isRemoteReq, false)%>">
<frame name="foot" scrolling="auto" marginwidth="10" marginheight="14" src="/SASLogon/kblogin/sso.html" noresize="noresize">
</frameset>
</html>

<%
    }else{
        logger.info(" YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
        isSasLogon=true;
    }
}else{
    logger.info(" false XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    isSasLogon=true;
}
if(isSasLogon) {
    final String queryString = request.getQueryString();
    final String url = request.getContextPath() + "/login" + (queryString != null ? "?" + queryString : "");
    logger.info("url is "+url);
    response.sendRedirect(response.encodeURL(url));
}
%>
