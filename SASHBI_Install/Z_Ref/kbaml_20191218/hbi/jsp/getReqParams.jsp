<%response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");%>
<%@ page language="java" contentType= "text/json; charset=UTF-8" %>
<%
	String stp_params =(String)request.getSession().getAttribute("stp_params");
%>
<%=stp_params%>