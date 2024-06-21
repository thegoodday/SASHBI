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
    
    /*DB�� ��ϵ� ����� ���˵��� ���� �߰� Ȯ���� ���� ������
    �켱�� kbUserId �� ���� �����ϸ� ����ڷ� ������.
    */
    if(!isNull(kbUserId)) {
        isAMLUser=true;
    }
    
    /*������ ALM ������� ���*/
    if(isAMLUser){
        response.sendRedirect("./sso.jsp");
    }else{
        session.setAttribute("_AUTH_ERROR_CD", "0");
        session.setAttribute("_AUTH_ERROR_MSG", "AML �ý��ۿ� ��ϵ� ����ڰ� �ƴմϴ�.");
        session.setAttribute("_AUTH_ERROR_MSG_DETAIL", "user_auth.jsp ERROR.");
        response.sendRedirect("./auth_error.jsp");
    }
%>

 
 
 
 
 
 
 
 
