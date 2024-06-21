<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="org.jdom.*" %>
<%@ page import="org.jdom.filter.ElementFilter" %>
<%@ page import="org.jdom.input.*" %>
<%@ page import="org.jdom.output.*" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="java.sql.ResultSetMetaData"%>
<%@ page import="java.sql.PreparedStatement" %>
<%@ page import="java.sql.Statement" %>
<%@ page import="java.sql.SQLException"%>


<%@ page import="java.util.*" %>
<%@ page import="java.util.regex.*"%>
<%@ page import="org.apache.log4j.*"%>
<%@ page import="org.apache.poi.xssf.streaming.*"%>
<%@ page import="org.apache.poi.ss.usermodel.*"%>
<%@ page import="org.apache.poi.ss.util.*"%>

<%@ page import="sun.jdbc.rowset.CachedRowSet"%>
<%@ page import="com.sas.storage.jdbc.JDBCToTableModelAdapter"%>
<%@ page import="com.sas.prompts.valueprovider.dynamic.DataProvider"%>
<%@ page import="com.sas.prompts.valueprovider.dynamic.DataProviderUtil"%>
<%@ page import="com.sas.rio.MVAConnection"%>
<%@ page import="com.sas.iom.SAS.IDataService"%>
<%@ page import="com.sas.iom.SAS.ILanguageService"%>
<%@ page import="com.sas.iom.SAS.ILanguageServicePackage.CarriageControlSeqHolder"%>
<%@ page import="com.sas.iom.SAS.ILanguageServicePackage.LineTypeSeqHolder"%>
<%@ page import="com.sas.iom.SAS.IWorkspace"%>
<%@ page import="com.sas.iom.SASIOMDefs.StringSeqHolder"%>
<%@ page import="com.sas.services.session.SessionContextInterface"%>			
<%@ page import="com.sas.hbi.storedprocess.StoredProcessFacade"%>			
<%@ page import="com.sas.hbi.tools.Stub"%>
<%@ page import="com.sas.hbi.tools.POI"%>

<!--
<%@ page import="com.sas.bitreeviewer.tools.SASConnection"%>
<%@ page import="com.sas.iom.SASIOMDefs.GenericError"%>
<%@ page import="com.sas.table.TableException"%>
-->


<%@ page import="com.sas.web.keys.CommonKeys"%>


<%
Logger logger = Logger.getLogger("PromptTest");
logger.setLevel(Level.DEBUG);
logger.addAppender(new ConsoleAppender(new PatternLayout("%d %t %-5p %m \n")));
out.clear(); 

/*
execSTP(sp_URI,tableName,colName,target,libStmt,param1,param2,param3,param4,param5)
			_program	: stpURI,
			tableName	: tableName,
			colName		: colName,		
			param1 : whereStatements
			param2 : column sortOrder
			param3 : label column ID
			param4 : label column sortOrder
			param5 : isDisplayValue
*/
String tableName 			= request.getParameter("tableName");
String colName 			= request.getParameter("colName");
String sortColumn 		= request.getParameter("sortColumn");
String labelID 			= request.getParameter("labelID");
String labelSortOrder 	= request.getParameter("labelSortOrder");
String isDisplayValue 	= request.getParameter("isDisplayValue");

String logicalServerName = "SASApp - Logical Pooled Workspace Server"; 

DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");
IWorkspace iWorkspace = dataProvider.getIWorkspace(logicalServerName);
ILanguageService sasConn = iWorkspace.LanguageService();
/*
logger.debug("dataProvider: " + dataProvider);
logger.debug("iWorkspace: " + iWorkspace);
logger.debug("sasConn: " + sasConn);
*/

String stmt="proc print data=sashelp.prdsale; run;;";
sasConn.Submit(stmt);
CarriageControlSeqHolder logCarriageControlHldr = new CarriageControlSeqHolder();
LineTypeSeqHolder logLineTypeHldr = new LineTypeSeqHolder();
StringSeqHolder logHldr = new StringSeqHolder();
sasConn.FlushLogLines(Integer.MAX_VALUE, logCarriageControlHldr, logLineTypeHldr, logHldr);
String[] logLines = logHldr.value;
out.println("<pre>");

for (int i = 0; i < logLines.length; i++) {
	//logger.debug("sasConn: " + logLines[i]);
	out.println(logLines[i]);
}
out.println("</pre>");

/*
*/
%>