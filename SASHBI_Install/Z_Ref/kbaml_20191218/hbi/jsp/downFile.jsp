<%@ page trimDirectiveWhitespaces="true" %>
<%@ page language="java"
    import="java.io.*,
			java.util.*,
			org.apache.log4j.*,
			com.sas.hbi.tools.Viewer,
			com.sas.prompts.valueprovider.dynamic.DataProvider,
			com.sas.services.session.SessionContextInterface,
			com.sas.services.user.UserContextInterface,
			com.sas.web.keys.CommonKeys"
    contentType="text/html; charset=UTF-8" %>
      
<% 
	response.setContentType("application/vnd.ms-excel");
	response.setCharacterEncoding("utf-8");
	response.setHeader("Content-Disposition", "attachment; filename=\"excel.xls\"");
	response.setHeader("Pragma", "no-cache");
	response.setHeader("Cache-Control", "no-cache");
	/* For IE Excel Download Issue... */
	response.setHeader("Pragma", "private");
	response.setHeader("Cache-Control", "private");

	Logger logger = Logger.getLogger("downFile");
	logger.setLevel(Level.DEBUG);

	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	UserContextInterface ucif   = sci.getUserContext();

	String str_pathUrl =(String)request.getParameter("_program");

	DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_STPRV");

	List<String> exceptParam = new ArrayList<String>();
	exceptParam.add("GRIDDATA");
			
	Viewer vw = new Viewer();
	vw.execSTP(ucif,str_pathUrl,exceptParam,request,response,out);
%>
