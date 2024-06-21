<%@ page language="java" contentType="text/html; charset=EUC-KR"%>
<%@ page import = "org.apache.log4j.*" %>
<%@ page import = "com.kbstar.wse.authentication.business.LoginDTO"%>
<%------------------------------------------------------------------------------
  - /site_connect.jsp Created on 2019. 10. 04
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
    response.setHeader("Cache-Control","no-store"); //HTTP 1.1
    response.setHeader("Pragma","no-cache"); //HTTP 1.0
    response.setDateHeader ("Expires", 0);

    Logger logger = Logger.getLogger("site_connect.jsp");
    logger.setLevel(Level.INFO);
    
    logger.info("This page is site_connect.jsp.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<link type="text/css" rel="stylesheet" href="/SASLogon/themes/default/css/sas.css" />
<script type="text/javascript" src="/SASLogon/js/jquery.js"></script>
<script>
function setCookie(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; 
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}
</script>
<style>
.progress{
    font-family:'malgun gothic';font-size:12px;color:#333333;
}
</style>
</head>
<body>
<div id="progressIndicatorWIP"
      style="visibility:visible; position:absolute;top:10px; height:80%;width:99%; text-align:center;vertical-align:middle;  z-index:50000; border: 0px solid #dfdfdf; background-color: #FFFFFF">
    <table border="0" cellspacing="0" cellpadding="0" style="height:100%;width:100%;" summary="">
        <tr>
            <td style="text-align:center;vertical-align:middle;">
                <table border="0" cellspacing="0" cellpadding="0" style="width:100%;" summary="">

                    <tr>
                        <td style="text-align:center;vertical-align:bottom;">
                            <img id="progressIndicatorImage" src='/SASLogon/images/progress.gif'
                                alt="잠시 기다리십시오." />
                        </td>
                    </tr>
                    <tr><td class="lineSpacer">&nbsp;</td></tr>
                    <tr>
                        <td style="text-align:center;vertical-align:top;" class="progress">
                            <span id="pleaseWaitMessage">
                                잠시 기다리십시오.
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align:center;vertical-align:top;" class="progress">
                            <span id="progressMessage">
                                시스템에 접속중입니다...
                            </span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>

<jsp:include page="/kblogin/loginCheck.jsp"></jsp:include>
<%
    boolean isNoError=false;

    LoginDTO loginCheckDTO = (LoginDTO) session.getAttribute("loginDTO");
    String kbUserId = "";
    if(loginCheckDTO != null){
        logger.info("loginCheckDTO is not null");
        if(!isNull(loginCheckDTO.getEmployeeNumber())) {
        
            isNoError=true;
            kbUserId = loginCheckDTO.getEmployeeNumber();
        }
    }else{
        logger.info("loginCheckDTO is null");
    }

    logger.info("kbUserId is "+kbUserId);
    String pageName = "";
    if(isNoError) {
        pageName = "user_auth.jsp";
    } else {
        session.setAttribute("_AUTH_ERROR_CD", "0");
        session.setAttribute("_AUTH_ERROR_MSG", "인증서 로그인에 실패 하였습니다.");
        session.setAttribute("_AUTH_ERROR_MSG_DETAIL", "site_connect.jsp ERROR.");
        pageName = "auth_error.jsp";
    }
    logger.info("pageName is "+pageName);
    
    
    //response.sendRedirect(pageName);
    
%>
<script>    
    setCookie("_kbUserId", "<%=kbUserId%>", 1);
    window.location.href="<%=pageName%>";
</script>

</body>
</html>
