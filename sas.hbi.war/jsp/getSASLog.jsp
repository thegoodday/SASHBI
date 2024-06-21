<%@ page language="java" contentType= "text/json; charset=utf-8" %>
<%@ page import="
	java.io.*,
	java.util.*,
	org.apache.log4j.*" 
%>
<%
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");
	
	Logger logger = Logger.getLogger("getSASLog");
	logger.setLevel(Level.ERROR);
	
	LinkedHashMap<String, String[]> SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
	
	logger.debug("SASLogs keySet():" + SASLogs.keySet());	
	Iterator<String> iterator = SASLogs.keySet().iterator();
	while (iterator.hasNext()) { 
		String key = (String)iterator.next();
		String[] logLines = (String[])SASLogs.get(key);
		if (logLines != null){
			String logStr="";
			for (int logii=0;logii<logLines.length;logii++){
				logStr=logLines[logii];
				if (logStr.startsWith("NOTE: ")){
					logStr="<font color=blue>"+logStr + "</font>";
				} else if (logStr.startsWith("WARNING: ")){
					logStr="<font color=green>"+logStr + "</font>";
				} else if (logStr.startsWith("ERROR: ")){
					logStr="<font color=red>"+logStr + "</font>";
				} else if (logStr.startsWith("      ")){
					logStr="<font color=blue>"+logStr + "</font>";
				} 
				out.println(logStr);
			}	
		}
	}
%>

