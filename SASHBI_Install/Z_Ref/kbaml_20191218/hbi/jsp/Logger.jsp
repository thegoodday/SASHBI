<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<%@ page language="java" 
    import="org.apache.log4j.*,
    		java.io.*"
%>


<%
	Logger logger = Logger.getLogger("Logger.jsp");
	String layout = "%d %-5p [%t] %-17c{2} (%13F:%L) %3x - %m%n";
	String logfilename ="/SASConf/Lev2/Web/Logs/SASServer1_1/STPWebReportViewer.log";
	String datePattern = ".yyyy-MM-dd ";
	PatternLayout patternlayout = new PatternLayout(layout);
	DailyRollingFileAppender appender = new DailyRollingFileAppender(patternlayout, logfilename, datePattern);
	logger.addAppender(appender);
	logger.setLevel(Level.INFO); 
	logger.info("TEST by koryhh");
%>
    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
<title>Insert title here</title>
</head>
<body>
test
</body>
</html>