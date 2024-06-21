<%@ page language="java" contentType="text/html; charset=EUC-KR"%>
<%@ page import = "java.net.URI" %>
<%@ page import = "java.net.URISyntaxException" %>
<%@ page import = "java.net.URL" %>
<%@ page import = "java.net.URLEncoder" %>
<%@ page import = "java.util.*" %>
<%@ page import = "java.io.IOException" %>
<%@ page import = "javax.servlet.*" %>
<%@ page import = "org.apache.log4j.*" %>
<%@ page import = "com.sas.svcs.security.authentication.client.AuthenticationClient" %>
<%@ page import = "com.sas.svcs.security.authentication.client.AuthenticationClientHolder" %>
<%@ page import = "com.kbstar.wse.authentication.business.LoginDTO"%>
<%------------------------------------------------------------------------------
  - /sso.jsp Created on 2019. 10. 04
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
    Logger logger = Logger.getLogger("sso.jsp");
    logger.setLevel(Level.INFO);
    
    LoginDTO loginCheckDTO = (LoginDTO) session.getAttribute("loginDTO");
    String kbUserId = loginCheckDTO.getEmployeeNumber();

    if(!isNull(kbUserId)) {
    
        String sasUserId = kbUserId.trim()+"@saspw";
        /*
        String sasUserPwd = Config.getInstance().getProperty("sas_user_password");
        */
        String sasUserPwd = "sask@123";        

        logger.info("sasUserId is "+ sasUserId);
        logger.info("sasUserPwd is "+ sasUserPwd);
        
        boolean isAuthSuccess=false;
        URI reconnectUri = null;
        try{
            URL targetUrl = new URL(request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/SASComplianceSolutionsMid/");
            URL casUrl = new URL(targetUrl.getProtocol(), targetUrl.getHost(), targetUrl.getPort(), "/SASLogon");

            AuthenticationClient client = new AuthenticationClient(casUrl.toString());
            client.logon(sasUserId ,sasUserPwd);
            AuthenticationClientHolder.set(client);
            final String ticket = client.acquireTicket(targetUrl.toString());
            reconnectUri = new URI(casUrl + "?direct_authentication_ticket=" + ticket + "&service=" + URLEncoder.encode(targetUrl.toString(), "UTF-8"));
            isAuthSuccess=true;

            logger.info("targetUrl.toString()" + targetUrl.toString());
            logger.info("casUrl.toString()" + casUrl.toString());
            logger.info("ticket" + ticket);
            logger.info("reconnectUri.toString()" + reconnectUri.toString());
        } catch(Exception e){
            session.setAttribute("_AUTH_ERROR_CD", "0");
            session.setAttribute("_AUTH_ERROR_MSG", "Metadata 인증처리중 에러가 발생하였습니다.");
            session.setAttribute("_AUTH_ERROR_MSG_DETAIL", "sso.jsp SAS Meta 인증 ERROR.");
        }

        if(isAuthSuccess){
            session.setAttribute("_AUTH_ERROR_CD", "0");
            /*
            session.getServletContext().getContext("/SASLogon").setAttribute("almUserViewDT", userViewDT);
            */
            /*
            session.setAttribute("liveSession", userViewDT);
            */
%>
<script>    
    top.window.location.href="<%=reconnectUri.toString()%>";
</script>

<%            
            //response.sendRedirect(reconnectUri.toString());
        }else{
            session.setAttribute("_AUTH_ERROR_MSG", "Metadata 인증처리중 에러가 발생하였습니다.");
            session.setAttribute("_AUTH_ERROR_MSG_DETAIL", "sso.jsp isAuthSuccess false ERROR.");
            response.sendRedirect("./auth_error.jsp");
        }

    }else{
        session.setAttribute("_AUTH_ERROR_CD", "0");
        session.setAttribute("_AUTH_ERROR_MSG", "Metadata 인증처리중 에러가 발생하였습니다.");
        session.setAttribute("_AUTH_ERROR_MSG_DETAIL", "sso.jsp session에 almUserViewDT 정보 NULL.");
        response.sendRedirect("./auth_error.jsp");
    }


%>
