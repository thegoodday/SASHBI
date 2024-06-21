<%
	request.setCharacterEncoding("utf-8");
	response.setContentType("text/json");
	response.setCharacterEncoding("utf-8");
	response.setHeader("Pragma", "no-cache");
	response.setHeader("Cache-Control", "no-cache");
%>
Saved
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
	Logger logger = Logger.getLogger("saveDataRole");

	String stpObjID =null;
	StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
	stpObjID=facade.getMetaID();
	logger.debug("stpObjID:"+stpObjID);
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);

	String DRInfo = request.getParameter("saveDataRole");
	logger.debug("request.getParameter DRInfo:"+DRInfo);

	stpNote.setStpObjId(stpObjID);
	String layoutObj=stpNote.getSTPNote(sci,"DataRole");
	logger.debug("layoutObj:"+layoutObj);
	stpNote.setSTPNote(DRInfo);
	try{
		stpNote.saveSTPNote(sci,"DataRole");
		logger.debug("Saved....");
	} catch(Exception e) {
		e.printStackTrace();
	}
%>
