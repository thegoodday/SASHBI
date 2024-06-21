<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<jsp:useBean id="userDefinedHeader" class="com.sas.hbi.tools.UserDefinedHeader"/>

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


<%@ page import="java.io.UnsupportedEncodingException" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.regex.*"%>
<%@ page import="org.apache.log4j.*"%>

<%@ page import="org.apache.poi.xssf.streaming.*"%>
<%@ page import="org.apache.poi.ss.usermodel.*"%>
<%@ page import="org.apache.poi.ss.util.*"%>

<%@ page import="sun.jdbc.rowset.*"%>
<%@ page import="com.sas.storage.jdbc.JDBCToTableModelAdapter"%>
<%@ page import="com.sas.prompts.valueprovider.dynamic.DataProvider"%>
<%@ page import="com.sas.prompts.valueprovider.dynamic.DataProviderUtil"%>
<%@ page import="com.sas.rio.MVAConnection"%>
<%@ page import="com.sas.iom.SAS.IDataService"%>
<%@ page import="com.sas.iom.SAS.ILanguageService"%>
<%@ page import="com.sas.iom.SAS.IWorkspace"%>
<%@ page import="com.sas.services.session.SessionContextInterface"%>			
<%@ page import="com.sas.hbi.property.HBIConfig"%>			
<%@ page import="com.sas.hbi.storedprocess.StoredProcessFacade"%>			
<%@ page import="com.sas.hbi.tools.Stub"%>
<%@ page import="com.sas.hbi.tools.POI"%>

<%@ page import="com.sas.web.keys.CommonKeys"%>


<%
Logger logger = Logger.getLogger("Excel POI");
logger.setLevel(Level.DEBUG);
out.clear(); 

String libPhysicalPath = request.getParameter("_savepath");
String targetData = request.getParameter("_data");
logger.debug("Excel POI targetData : " + targetData);

//String stpObjId = "A5X5MBE6.BD00032V";
/* HTML 헤더 정보 가져오기 */
String stpObjID =null;
stpObjID=(String)session.getAttribute("metaID");
StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
stpObjID=facade.getMetaID();
logger.debug("stpObjID : "+stpObjID);
SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);

userDefinedHeader.setStpObjId(stpObjID);

String htmlText = userDefinedHeader.view(sci);
/* HTML 헤더 정보 가져오기 */				  

SXSSFWorkbook wb = new SXSSFWorkbook();

Sheet sh = wb.createSheet("Report");

Document doc = null;

int rowNum = 0;
int colNum = 0;
DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");

//String logicalServerName = "SASApp - Logical Workspace Server"; 
HBIConfig hbiconf = HBIConfig.getInstance();
Properties conf = hbiconf.getConf();

String logicalServerName = conf.getProperty("app.logicalServerName"); 

POI poi = new POI(logicalServerName, libPhysicalPath, dataProvider);
try {				  
	doc = poi.CreateHeaderDocument(htmlText, libPhysicalPath, dataProvider, targetData);

	Element root = doc.getRootElement();
	Element firstRow = (Element)root.getChildren().get(0);
	
	rowNum = root.getChildren().size();
	
	for(int i = 0; i < firstRow.getChildren().size(); i++) {
		Element aElement = (Element)firstRow.getChildren().get(i);
		Attribute attr = aElement.getAttribute("colspan");
		
		if(attr == null) {
			colNum += 1;
		}
		else {
			colNum += Integer.parseInt(attr.getValue());
		}
	}

	if(doc != null) {
		poi.CreateHeader(wb, sh, rowNum, colNum, doc.getRootElement());
	}
} catch(Exception ex) {
	ex.printStackTrace();
}	


try {
	String rptName = request.getParameter("_name");
	logger.debug("rptName : "+rptName);

	String uBrowser = request.getHeader("User-Agent");
	logger.debug("uBrowser : "+uBrowser);
	if (uBrowser.contains("MSIE")) {
		uBrowser="MSIE";
		rptName = rptName.replaceAll("\\+","%20") + ".xlsx";
	} else if (uBrowser.contains("Chrome")) {
		uBrowser="Chrome";
		rptName = URLDecoder.decode(rptName,"8859_1")+".xlsx";
	} else if (uBrowser.contains("rv:")) {
		uBrowser="MSIE";
		rptName = rptName.replaceAll("\\+","%20") + ".xlsx";
	}
	logger.debug("uBrowser : "+uBrowser);

	
	/*
	String rptName2 = URLDecoder.decode(rptName,"8859_1")+".xlsx";
	String rptName_utf8 = URLDecoder.decode(rptName,"utf-8");
	String rptName_euckr = URLDecoder.decode(rptName,"euc-kr");
	String rptName_8859 = URLDecoder.decode(rptName,"8859_1");
	String rptName_ksc = URLDecoder.decode(rptName,"ksc5601");
	logger.debug("rptName_utf8 : "+rptName_utf8);
	logger.debug("rptName_euckr : "+rptName_euckr);
	logger.debug("rptName_8859 : "+rptName_8859);
	logger.debug("rptName_ksc : "+rptName_ksc);
	*/

	poi.CreateData(wb, sh, rowNum, libPhysicalPath, dataProvider, targetData);
	response.setContentType("application/vnd.ms-excel");
	response.setCharacterEncoding("utf-8");
	//response.setHeader("Content-Disposition", "attachment; filename=\"excel.xlsx\"");
	response.setHeader("Content-Disposition", "attachment; filename=\""+rptName +"\"");
	response.setHeader("Pragma", "no-cache");
	response.setHeader("Cache-Control", "no-cache");
	/* For IE Excel Download Issue... */
	response.setHeader("Pragma", "private");
	response.setHeader("Cache-Control", "private");

	wb.write(response.getOutputStream());
	poi.closeConnection();
	
} catch(Exception ex) {
	out.println("<script type='text/javascript'>alert('메뉴를 다시 실행하세요.');</script>");	
	ex.printStackTrace();
}
	  
%>