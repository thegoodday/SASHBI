<%@ page language="java" contentType="text/html; charset=EUC-KR"%>
<%@ page import = "org.apache.log4j.*" %>
<%------------------------------------------------------------------------------
  - /autho_error.jsp Created on 2019. 10. 04
  -
  - Copyright (C) SAS Institute Inc. All Rights Reserved.
  -
  - Author  Tae-su Choi
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
    Logger logger = Logger.getLogger("auth_error.jsp");
    logger.setLevel(Level.INFO);

    String errorCd = (String) session.getAttribute("_AUTH_ERROR_CD");
    String errorMsg = (String) session.getAttribute("_AUTH_ERROR_MSG");
    String errorMsgDetail = (String) session.getAttribute("_AUTH_ERROR_MSG_DETAIL");

    if(isNull(errorMsg)) {
        errorMsg = "시스템 접속 중에러가 발생하였습니다.";
    }

    if(!isNull(errorMsgDetail)) {
        logger.info("errorMsgDetail ==================> "+ errorMsgDetail);
    }
    
%>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr">
<head>
<title>Kookmin Bank</title>
<script type="text/javascript" src="/SASLogon/js/jquery.js"></script>
</head>
<body>
<!--    
<div class="log_wrap">
	<div class="log_con">
		<h1 class="log_h1"><img src="/SASLogon/kb_images/error_tit.png" /></h1>
		<div class="log_box">
			<p class="t1">시스템 접속 실패!<p>
			<p class="t2">보안 강화를 위해 브라우저를 닫습니다.<p>
		</div>
		<p class="copyright">Copyright Kookmin Bank. All Rights Reserved.</p>
	</div>
</div>
-->
<script>
$(document).ready(function () {
    alert("시스템 접속 실패! 보안 강화를 위해 현재 창을 닫습니다.");
    var IE_USER_AGENT="trident";
    var CHROME_USER_AGENT="chrome";
    var userAgent = navigator.userAgent.toLowerCase();
    if(userAgent.indexOf(IE_USER_AGENT) != -1){
        top.window.close();
    }else if(userAgent.indexOf(CHROME_USER_AGENT) != -1){
        window.open('about:blank', '_self').close();
    }else {
        top.window.close();
    }
});
</script>
</body>
</html>
