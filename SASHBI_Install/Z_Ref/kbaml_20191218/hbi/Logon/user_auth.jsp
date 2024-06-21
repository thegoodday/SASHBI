<%@ page language="java" contentType="text/html; charset=EUC-KR"%>
<%@ page import = "java.util.*" %>
<%@ page import = "javax.servlet.*" %>
<%@ page import = "org.apache.log4j.*" %>
<%@ page import = "com.kbstar.wse.authentication.business.LoginDTO"%>
<%------------------------------------------------------------------------------
  - /user_auth.jsp Created on 2019. 10. 04
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
    Logger logger = Logger.getLogger("user_auth.jsp");
    logger.setLevel(Level.INFO);
    LoginDTO loginCheckDTO = (LoginDTO) session.getAttribute("loginDTO");
    String kbUserId = loginCheckDTO.getEmployeeNumber();

    boolean isAMLUser=false;
    
    /*DB에 등록된 사용자 점검등을 위한 추가 확인을 위한 페이지
    우선은 kbUserId 의 값이 존재하면 사용자로 간주함.
    */
    if(!isNull(kbUserId)) {
        isAMLUser=true;
    }
    
    /*인증된 ALM 사용자인 경우*/
    if(isAMLUser){
        response.sendRedirect("./sso.jsp");
    }else{
        session.setAttribute("_AUTH_ERROR_CD", "0");
        session.setAttribute("_AUTH_ERROR_MSG", "AML 시스템에 등록된 사용자가 아닙니다.");
        session.setAttribute("_AUTH_ERROR_MSG_DETAIL", "user_auth.jsp ERROR.");
        response.sendRedirect("./auth_error.jsp");
    }
%>

 
 
 
 
 
 
 
 
