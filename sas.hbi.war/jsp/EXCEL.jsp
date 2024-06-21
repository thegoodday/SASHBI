<%@ page language="java" 
    import="org.apache.log4j.*,
			java.io.*,
			java.net.*,
			java.io.UnsupportedEncodingException,
			java.net.URLDecoder,
			java.nio.charset.StandardCharsets,
			java.util.*"
%>
<%
	Logger logger = Logger.getLogger("Excel");
	logger.setLevel(Level.DEBUG);

	String rptName = request.getParameter("_name");
	logger.debug("rptName : "+rptName);

	String uBrowser = request.getHeader("User-Agent");
	logger.debug("uBrowser : "+uBrowser);
	if (uBrowser.contains("MSIE")) {
		uBrowser="MSIE";
		rptName = rptName.replaceAll("\\+","%20") + ".xls";
	} else if (uBrowser.contains("Chrome")) {
		uBrowser="Chrome";
		rptName = URLDecoder.decode(rptName,"8859_1")+".xls";
	} else if (uBrowser.contains("rv:")) {
		uBrowser="MSIE";
		rptName = rptName.replaceAll("\\+","%20") + ".xls";
	}
	logger.debug("uBrowser : "+uBrowser);	

	response.setContentType("application/vnd.ms-excel");
	response.setCharacterEncoding("utf-8");
	response.setHeader("Content-Disposition", "attachment; filename=\""+rptName +"\"");
	response.setHeader("Pragma", "no-cache");
	response.setHeader("Cache-Control", "no-cache");
	/* IE8 Excel Download issue.... */
	response.setHeader("Pragma", "private");
	response.setHeader("Cache-Control", "private");
%>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<%
	out.print("<meta http-equiv=\"Content-Type\" content=\"application/vnd.ms-excel; charset=utf-8\">");
	//String sasExcel = new String(request.getParameter("sasExcel").getBytes("8859_1"),"KSC5601");
	String sasExcel = request.getParameter("sasExcel");
	String resultText = org.apache.commons.lang.StringEscapeUtils.unescapeHtml(sasExcel);
%>
<style>
@page
{
margin:1.0in .34in 1.0in .47in;
mso-header-margin:.5in;
mso-footer-margin:.5in;
mso-page-orientation:landscape;
mso-border:1px black;
}	
</style>
</head>
<body>
<%=resultText%>
</body>
</html>
