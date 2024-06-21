<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java" contentType= "application/vnd.ms-excel; charset=euc-kr" %>
<%@ page import="com.sas.hbi.tools.*,
		com.sas.services.session.SessionContextInterface,
		com.sas.iom.SAS.ILanguageService,
		com.sas.services.user.UserContextInterface,
		com.sas.web.keys.CommonKeys,
		java.util.*,
		org.apache.log4j.*
" %>
<%
	//response.setContentType("text/json;");
	response.setContentType("application/vnd.ms-excel");
	response.setCharacterEncoding("euc-kr");
	response.setHeader("Content-Disposition", "attachment; filename=\"ÇÑ±Û.xls\"");
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");
	
	Logger logger = Logger.getLogger("exportExcel");
	logger.setLevel(Level.DEBUG); 

		//! get Info. from session...
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif    = sci.getUserContext();

	
	SubmitO SubmitO = new SubmitO(sci);
	
	
	
	String DRInfo=SubmitO.getDRInfo(sci, request);
	logger.debug("DRInfo:"+DRInfo);
	if (DRInfo.equalsIgnoreCase("")){
		logger.error("DRInfo did not passed...");
		return;
	}

	
	ILanguageService sas = SubmitO.getWorkSpace(request);
	SubmitO.setInitPGM(request);
	
	SubmitO.genExportExcelSAS(DRInfo, request);
	
	SubmitO.getSASLog(ucif, sas, session);
	
	List<String> exceptParam = new ArrayList<String>();
	exceptParam.add("GRIDDATA");
	SubmitO.execSTP(ucif,exceptParam,request,response,out);
%>

