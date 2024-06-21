<%
	request.setCharacterEncoding("utf-8");
	response.setContentType("text/json");
	response.setCharacterEncoding("utf-8");
	response.setHeader("Pragma", "no-cache");
	response.setHeader("Cache-Control", "no-cache");
%>
Layout Deleted...
<%@ page language="java"
    import="com.sas.services.session.SessionContextInterface,
						com.sas.hbi.storedprocess.StoredProcessFacade,
						com.sas.web.keys.CommonKeys,
						org.apache.log4j.*,
						java.util.*"
%>			

<jsp:useBean id="stpNote" class="com.sas.hbi.tools.STPNote"/>
<jsp:useBean id="Stub" class="com.sas.hbi.tools.Stub"/>
<%
	Logger logger = Logger.getLogger("STPRV");

	String stpObjID =null;
	StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
	stpObjID=facade.getMetaID();
	logger.debug("stpObjID:"+stpObjID);
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);

	String layout = request.getParameter("layout");
	logger.debug("request.getParameter layout:"+layout);

	stpNote.setStpObjId(stpObjID);
	String layoutObj=stpNote.getSTPNote(sci,"Layout");
	logger.debug("layoutObj:"+layoutObj);
	stpNote.setSTPNote(layout);
	try{
		stpNote.deleteSTPNote(sci,"Layout");
		logger.debug("Layout Deleted....");
	} catch(Exception e) {
		e.printStackTrace();
	}

	//stpNote.setStpObjId(stpObjID);
	//String drObj=stpNote.getSTPNote(sci,"DataRole");
	//stpNote.setSTPNote(layout);
	try{
		stpNote.deleteSTPNote(sci,"DataRole");
		logger.debug("DataRole Deleted....");
	} catch(Exception e) {
		e.printStackTrace();
	}
	
%>
