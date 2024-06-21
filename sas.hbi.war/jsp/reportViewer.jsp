<%
	response.setCharacterEncoding("utf-8");
	response.setHeader("Pragma", "No-cache");
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Expires", "0");
%>
<!DOCTYPE HTML>
<%@ page language="java" contentType= "text/html; charset=UTF-8" %>
<%@ page language="java" 
    import="com.sas.datatypes.DataTypeInterface,
			com.sas.prompts.PromptValuesInterface,
			com.sas.prompts.definitions.*,
			com.sas.prompts.definitions.shared.*,
			com.sas.prompts.groups.*,
			com.sas.prompts.groups.shared.SharedTransparentGroup,
			com.sas.prompts.groups.PromptGroupInterface,
			com.sas.prompts.valueprovider.dynamic.DataProvider,
			com.sas.services.information.metadata.LogicalServerInterface,
			com.sas.services.session.SessionContextInterface,
			com.sas.services.storedprocess.*,
			com.sas.services.user.UserContextInterface,
			com.sas.servlet.util.BaseUtil,
			com.sas.storage.valueprovider.*,
			com.sas.web.keys.CommonKeys,
			com.sas.hbi.storedprocess.StoredProcessFacade,
			com.sas.hbi.tools.*,
			com.sas.hbi.property.*,
			org.apache.log4j.*,
			org.json.*,
			java.text.DateFormat,
			java.text.ParseException,
			java.text.SimpleDateFormat,
			java.io.*,
			java.net.*,
			java.util.*"
%>
<jsp:useBean id="userDefinedHeader" class="com.sas.hbi.tools.UserDefinedHeader"/>
<jsp:useBean id="stpNote" class="com.sas.hbi.tools.STPNote"/>
<%
response.setHeader("Pragma", "No-cache");
response.setHeader("Cache-Control", "no-cache");
response.setHeader("Expires", "0");
String contextName = application.getInitParameter("application-name");
Logger logger = Logger.getLogger("reportViewer");
logger.setLevel(Level.DEBUG); 

String charset = BaseUtil.getOutputCharacterEncoding(request);
int maxTime = session.getMaxInactiveInterval();
long lastAccTime = session.getLastAccessedTime();
logger.debug("maxTime : " + maxTime);
logger.debug("lastAccTime : " + new Date(lastAccTime));
String userIP = request.getHeader("x-forwarded-for");
if (userIP == null){
	userIP = request.getHeader("x-forwarded-for");
}
if (userIP == null){
	userIP = request.getHeader("http_x_forwarded_for");
}
if (userIP == null){
	userIP = request.getHeader("WL-Proxy-Client-IP");
}
if (userIP == null){
	userIP = request.getHeader("Proxy-Client-IP");
}
if (userIP == null){
	userIP = request.getRemoteAddr();
}
String desc="";
String dftVal="";
String rptType="";
String custOutJS="";
String hStr="";
String opName="";
String opValue="";
String en_desc="";
int prmptNum=0;
Locale locale=request.getLocale();

SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
ServletContext context = getServletContext();
String sp_pathUrl =(String)request.getSession().getAttribute("sp_pathUrl");
StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
StoredProcess2Interface stp2 = (StoredProcess2Interface)facade.getStoredProcess();
String metaID=facade.getMetaID();
LogicalServerInterface logicalServer = stp2.getServer();
String stpSrvName = logicalServer.getName();		//Bingo!!!  "SASPmo2 - Logical Stored Process Server"
String appSrvName = stpSrvName.split(" ")[0];
userDefinedHeader.setStpObjId(facade.getMetaID());
stpNote.setStpObjId(facade.getMetaID());
String layoutStr=stpNote.getSTPNote(sci,"Layout");
String DRInfo	=stpNote.getSTPNote(sci,"DataRole");

String sso_empno = (String) session.getAttribute("_STPRV_LOGINID");
String login_ip   = (String) session.getAttribute("_STPRV_LOGINIP");

HBIConfig hbiconf = HBIConfig.getInstance();
Properties conf = HBIConfig.getConf();
String stpInstallPath = conf.getProperty("stp.installpath");

logger.info("facadeSTPObjID : "+metaID);
logger.info("appSrvName : "+appSrvName);
logger.info("layoutStr : "+layoutStr);
logger.info("DRInfo : "+DRInfo);
logger.info("sp_pathUrl : "+sp_pathUrl);
logger.info("sso_empno : " + sso_empno);
logger.info("login_ip : " + login_ip);
logger.info("stpInstallPath : " + stpInstallPath);

DataProvider dataProvider = (DataProvider)request.getSession().getAttribute("sas_StoredProcessDataProvider_HBI");
UserContextInterface userContext = (UserContextInterface)request.getSession().getAttribute(CommonKeys.USER_CONTEXT);
String sasUserId = userContext.getPerson().getName();
List groupList = userContext.getGroups();
String userName = userContext.getName();
boolean isAdmin = userContext.isInGroup("Report Admin");
logger.debug("Groups: " + groupList.toString());
logger.debug("userName: " + userName);
logger.debug("isReportAdmin: " + isAdmin);
String GroupArr="";
for (int ii=0;ii<groupList.size();ii++){
	if (ii==0) GroupArr+="'"+groupList.get(ii)+"'";
	else GroupArr+=","+"'"+groupList.get(ii)+"'";
}
logger.debug("GroupArr: " + GroupArr);

if (stp2.getDescription().equalsIgnoreCase("")) {
	desc=stp2.getName();
}
else {
	desc=stp2.getDescription();
}
int isDLM=desc.indexOf("|");
if(isDLM > 0) { 
	desc=desc.substring(0,isDLM); 
} 
en_desc = URLEncoder.encode(desc, "UTF-8");

// Help ###################################################################################
String helpDocRootPath = "/fssas/sasv94/SASALM/WhelpTRS";
String helpDocFullPath = "";
String helpDocFileName = "";
boolean hasHelpDoc = false;

if (! sp_pathUrl.isEmpty()) {
	String SAS_META_FOLDER_SEP = "/";
	String SAS_META_ALM_ROOT_FOLDER = "/SASTRS/Home";
	int idx = sp_pathUrl.indexOf(SAS_META_ALM_ROOT_FOLDER);
	//
	if (idx != -1) {
		String stpMetaPath = sp_pathUrl.substring(idx + SAS_META_ALM_ROOT_FOLDER.length());
		int lastIdx = stpMetaPath.lastIndexOf(SAS_META_FOLDER_SEP);
		if (lastIdx > 0) {
			String stpMenu = stpMetaPath.substring(0, lastIdx);
			//
			helpDocFullPath = helpDocRootPath + stpMenu + SAS_META_FOLDER_SEP;
			helpDocFileName = desc.trim() + ".pdf";
			//

			try {
				File helpDocFile = new File(helpDocFullPath + helpDocFileName);
				if (helpDocFile.isFile()){
					hasHelpDoc = true;
				}
			} catch (Exception e) {
			}
		} 
	}
} 

PromptValuesInterface pvi  = stp2.getPromptValues();
PromptGroupInterface pgi = pvi.getPromptGroup();
List<PromptDefinitionInterface> promptDefinitions = pgi.getPromptDefinitions(true);
logger.debug("promptDefinitions Size:"+promptDefinitions.size());

Viewer Viewer = new Viewer();

List subLT=pgi.getPromptDefinitions(true); //getPromptDefinitionsAndSubgroups();
Iterator subIter=subLT.iterator();
while(subIter.hasNext()){
	Object infoObj=subIter.next();
	if (infoObj instanceof TextDefinition){
		PromptDefinitionInterface pdi=(PromptDefinitionInterface)infoObj;
		logger.debug("TextDefinition::::::"+infoObj.toString());													
	} else if (infoObj instanceof SharedTextDefinition){
		logger.debug("SharedTextDefinition:"+infoObj.toString());
	} else if (infoObj instanceof DateDefinition){
		logger.debug("DateDefinition:"+infoObj.toString());
	} else if (infoObj instanceof ModalGroup){
		logger.debug("ModalGroup:"+infoObj.toString());
	} else if (infoObj instanceof TransparentGroup){
		logger.debug("TransparentGroup:"+infoObj.toString());
	} else if (infoObj instanceof PromptGroup){
		logger.debug("PromptGroup:"+infoObj.toString());
	} else if (infoObj instanceof SharedTransparentGroup){
		logger.debug("SharedTransparentGroup:"+infoObj.toString());
		List pdL=((SharedTransparentGroup) infoObj).getPromptSubgroups(true);
		Iterator pdIter=pdL.iterator();
		while(pdIter.hasNext()){
			Object pdf=pdIter.next();
			logger.debug("SharedTransparentGroup: "+pdf.toString());
		}
	} else {
		logger.debug("ETC==============:"+infoObj.toString());
		//com.sas.prompts.definitions.InputFileDefinition
		//InputFileDefinition ifd = (InputFileDefinition)infoObj;		
		//String eleName=ifd.getDefinitionElementName();
		
		//logger.info("eleName : " + ifd.getScripts());
	}
}



HashMap<String, String> hiddenInfo = new HashMap<String, String>();

LinkedHashMap<String, String[]> SASLogs = new LinkedHashMap<String, String[]>();
session.setAttribute("SASLogs",SASLogs);

String portalID = (String)session.getAttribute("portalID");
logger.debug("portalID : " + portalID);
//if (portalID == null) portalID="_KFI_NY_AML_Compliance";
logger.debug("portalID : " + portalID);

List subL=pgi.getPromptDefinitions(true); //getPromptDefinitionsAndSubgroups();

HashMap<String, List<String>> map = new HashMap<String, List<String>>();			// Prompt dependancy info {promptName,(dependantPromptName1,...)};
HashMap<String, String> paramInfo = new HashMap<String, String>();
HashMap<String, String> datePInfo = new HashMap<String, String>();
HashMap<String, String> sharedDatePInfo = new HashMap<String, String>();
List defList=null;
List<String> defInfo = new ArrayList<String>();
List<String> multiInfo = new ArrayList<String>();
List<String> almGroup = new ArrayList<String>();
boolean isDebug=false;	//true;
boolean isOSW=false;
JSONObject rowObj = null;

for (int ii=0;ii<groupList.size();ii++){
	String grpName = (String)groupList.get(ii);
	//
	if (grpName.startsWith("ALM")){
		almGroup.add(grpName);
	}
}
String alGroupS = almGroup.toString();

for (int i = 0; i < promptDefinitions.size(); i++) {
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	if(pdi.getPromptName().toUpperCase().equalsIgnoreCase("_DEBUG")){
		isDebug = true;
	}
	int selectionType=0;
	paramInfo.put(pdi.getPromptName().toUpperCase(), pdi.getPromptName());
	dftVal = "";
	if (pdi.isHidden()){
		if(pdi.isDefaultValueSet()){
			dftVal = pdi.getDefaultValue().toString();
		}
		hiddenInfo.put(pdi.getPromptName().toUpperCase(), dftVal);
		logger.debug("Hidden TextDefinition:" + pdi.getPromptName().toUpperCase() + " : "+dftVal);
	}
	if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)){
		datePInfo.put(pdi.getPromptName(), "");
	} else if ((pdi instanceof DateRangeDefinition) || (pdi instanceof SharedDateRangeDefinition)){
		sharedDatePInfo.put(pdi.getPromptName(), "");
	}
	if (pdi instanceof TextDefinition){
		TextDefinition td = (TextDefinition)pdi;
		selectionType=td.getSelectionType();
	} else if (pdi instanceof SharedTextDefinition){
		SharedTextDefinition sd = (SharedTextDefinition)pdi;
		selectionType=sd.getSelectionType();
	}
	if (selectionType > 300) {
		logger.debug("selectionType:" +pdi.getPromptName() + selectionType);
		multiInfo.add(pdi.getPromptName());
	}
}
logger.debug("multiInfo isDebug: "+multiInfo.toString());
//logger.debug("hiddenInfo: "+ hiddenInfo.toString());


if(hiddenInfo.containsKey("_STPREPORT_TYPE")){
	rptType=hiddenInfo.get("_STPREPORT_TYPE");
	logger.debug("rptType in Metadata: "+rptType);
	if (rptType.length() > 5) {
		if ( rptType.substring(0,5).equalsIgnoreCase("opnSW") ) isOSW=true;
	}
}
logger.debug("isOSW(rptType) : " + isOSW);
if(hiddenInfo.containsKey("_STPREPORT_CUST_OUTPUT")){
	custOutJS=hiddenInfo.get("_STPREPORT_CUST_OUTPUT");
	logger.debug("_STPREPORT_CUST_OUTPUT: "+custOutJS);
}
int rowsPerPage=0;
if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
	rowsPerPage=Integer.parseInt(hiddenInfo.get("_STPREPORT_PAGE"));
}
logger.debug("rowsPerPage: "+ rowsPerPage);

boolean ON_LOAD_COLLAPSE = false;
if(hiddenInfo.containsKey("_STPREPORT_ON_LOAD_COLLAPSE")){
	if (hiddenInfo.get("_STPREPORT_ON_LOAD_COLLAPSE").equalsIgnoreCase("1")) ON_LOAD_COLLAPSE = true;
}
String ON_LOAD_SUBMIT = "";
if(hiddenInfo.containsKey("_STPREPORT_ON_LOAD_SUBMIT")){
	ON_LOAD_SUBMIT=hiddenInfo.get("_STPREPORT_ON_LOAD_SUBMIT");
}
int isNoSubmitBtn = 0;															
if (hiddenInfo.containsKey("_STPREPORT_NOSUBMIT_BTN")){															
	try{														
		isNoSubmitBtn=Integer.parseInt(hiddenInfo.get("_STPREPORT_NOSUBMIT_BTN"));													
	} catch (Exception e) {														
		isNoSubmitBtn = 1;													
	} finally {														
	}														
}															
logger.debug("isNoSubmitBtn : " + isNoSubmitBtn);		


String STPREPORT_OUT_LAYOUT = "";
if(hiddenInfo.containsKey("STPREPORT_OUT_LAYOUT")){
	STPREPORT_OUT_LAYOUT = hiddenInfo.get("STPREPORT_OUT_LAYOUT");
}
String excelPGM = "";
if(hiddenInfo.containsKey("_STPREPORT_EXCEL_PGM")){
	excelPGM = hiddenInfo.get("_STPREPORT_EXCEL_PGM");
}
String savePGM = "";
if(hiddenInfo.containsKey("_STPREPORT_SAVE_PGM")){
	savePGM = hiddenInfo.get("_STPREPORT_SAVE_PGM");
}
String uploadPGM = "";
if(hiddenInfo.containsKey("_STPREPORT_UPLOAD_PGM")){
	uploadPGM = hiddenInfo.get("_STPREPORT_UPLOAD_PGM");
}
String initPGM = "";
if(hiddenInfo.containsKey("_STPREPORT_INIT_PGM")){
	initPGM = hiddenInfo.get("_STPREPORT_INIT_PGM");
}
String hideUpload = "";
if(hiddenInfo.containsKey("_STPEDITOR_HIDE_UPLOAD_BTN")){
	hideUpload = hiddenInfo.get("_STPEDITOR_HIDE_UPLOAD_BTN");
}
String hideDelete = "";
if(hiddenInfo.containsKey("_STPEDITOR_HIDE_DELETE_BTN")){
	hideDelete = hiddenInfo.get("_STPEDITOR_HIDE_DELETE_BTN");
}
String showAddRow = "";
if(hiddenInfo.containsKey("_STPEDITOR_SHOW_ADDROW_BTN")){
	showAddRow = hiddenInfo.get("_STPEDITOR_SHOW_ADDROW_BTN");
}
String showAddRowCust = "";
if(hiddenInfo.containsKey("_STPEDITOR_SHOW_ADDROWCUST_BTN")){
	showAddRowCust = hiddenInfo.get("_STPEDITOR_SHOW_ADDROWCUST_BTN");
}
String download_type = "xlsx";
if(hiddenInfo.containsKey("_STPREPORT_DOWNLOAD_TYPE")){
	download_type = hiddenInfo.get("_STPREPORT_DOWNLOAD_TYPE");
}
boolean btnAddRow = false;
if(hiddenInfo.containsKey("_STPREPORT_BTN_ADD_ROW")){
	if (Integer.parseInt(hiddenInfo.get("_STPREPORT_BTN_ADD_ROW")) > 0 ) btnAddRow = true;
}
boolean btnAddRowCust = false;
if(hiddenInfo.containsKey("_STPREPORT_BTN_ADD_ROW_CUST")){
	if (Integer.parseInt(hiddenInfo.get("_STPREPORT_BTN_ADD_ROW_CUST")) > 0 ) btnAddRowCust = true;
}
boolean btnDelete = false;
if(hiddenInfo.containsKey("_STPREPORT_BTN_DELETE")){
	if (Integer.parseInt(hiddenInfo.get("_STPREPORT_BTN_DELETE")) > 0 ) btnDelete = true;
}
boolean btnSave = false;
if(hiddenInfo.containsKey("_STPREPORT_BTN_SAVE")){
	if (Integer.parseInt(hiddenInfo.get("_STPREPORT_BTN_SAVE")) > 0 ) btnSave = true;
}
boolean btnUpload = false;
if(hiddenInfo.containsKey("_STPREPORT_BTN_UPLOAD")){
	if (Integer.parseInt(hiddenInfo.get("_STPREPORT_BTN_UPLOAD")) > 0 ) btnUpload = true;
}
if (rptType.equalsIgnoreCase("tabHTML")){
	custOutJS = "tabHTML";
}
if (rptType.equalsIgnoreCase("tabGrid")){
	custOutJS = "tabGrid";
	isOSW = true;
}
String servlet = "HBI";
if(hiddenInfo.containsKey("_STPREPORT_SERVLET")){
	servlet = hiddenInfo.get("_STPREPORT_SERVLET");
}

//String InstallPath = (String)session.getAttribute("sas_StoredProcessCustomPath_STPRV");
String stpCustPath = (String)session.getAttribute("sas_StoredProcessCustomPath_HBI");
//String curSTPPath = sp_pathUrl.substring(10);
String headerJS = hiddenInfo.get("_STPREPORT_HEADER_JS");
int hbiIdx = stpCustPath.indexOf("sas.hbi.war");
int lastIdx = stpCustPath.lastIndexOf("/");
String headerJSURL = "/SASHBI" + stpCustPath.substring(hbiIdx+11, lastIdx) + "/" + headerJS;

logger.info("stpCustPath:" + stpCustPath);
logger.info("stpInstallPath:" + stpInstallPath);
logger.info("sp_pathUrl:" + sp_pathUrl);
logger.info("headerJSURL:" + headerJSURL);
logger.info("headerJS:" + headerJS);

%>
<html lang=ko>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link rel="stylesheet" href="/SASHBI/styles/HtmlBlue.css">
	<link rel="stylesheet" href="/SASHBI/styles/Portal.css" type="text/css" />
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/themes/start/jquery.ui.all.css">
	<link rel="stylesheet" href="/SASHBI/styles/custom.css" type="text/css" />
<%
if(hiddenInfo.containsKey("_STPREPORT_OUT_LAYOUT") || isOSW){
%>
	<!--
	<link rel="stylesheet" href="/SASHBI/scripts/ax5/combobox/dist/ax5combobox.css">
	<link rel="stylesheet" href="/SASHBI/scripts/ax5/formatter/dist/ax5formatter.css">
	<link rel="stylesheet" href="/SASHBI/scripts/ax5/picker/dist/ax5picker.css">
	<link rel="stylesheet" href="/SASHBI/scripts/ax5/select/dist/ax5select.css">
	<link rel="stylesheet" href="/SASHBI/scripts/ax5/grid/dist/ax5grid.css">
	-->
	<link rel="stylesheet" type="text/css" href="/SASHBI/scripts/SlickGrid/slick.grid.css">
	<link rel="stylesheet" type="text/css" href="/SASHBI/scripts/pvt/dist/pivot.css">
	<link rel="stylesheet" type="text/css" href="/SASHBI/scripts/nvd3/build/nv.d3.css">
<%
}
%>
	<link rel="stylesheet" href="/SASHBI/styles/<%=portalID%>.css" type="text/css" />
	<style>
<%
Viewer.prtGenStyleFromMeta(hiddenInfo,out);
/*
_STPREPORT_LABEL_WIDTH
_STPREPORT_LABEL_HEIGHT
_STPREPORT_ITEM_WIDTH
 */
Stub.incFile(hiddenInfo,"_STPREPORT_CSS", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
%>
	</style>
	<!--
		<script src="/SASHBI/scripts/SlickGrid/lib/jquery-1.11.2.js"></script>
		<script src="/SASHBI/scripts/SlickGrid/lib/jquery-ui-1.11.3.js"></script>
		<script src="/SASHBI/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	-->
	<script src="/SASHBI/scripts/jquery/js/jquery.js"></script>
	<script src="/SASHBI/scripts/jquery/jquery-ui.js"></script>
	<script src="/SASHBI/scripts/jquery/js/jquery-migrate-3.4.1.min.js"></script>
	<!-- script src="/SASHBI/scripts/jquery/bitreeviewer.js" -->
<%
logger.debug("rptType: "+rptType.toUpperCase());

if(hiddenInfo.containsKey("_STPREPORT_OUT_LAYOUT") || isOSW){
%>
	<!--
		<script src="/SASHBI/scripts/ax5/core/dist/ax5core.min.js"></script>
		<script src="/SASHBI/scripts/ax5/combobox/dist/ax5combobox.js"></script>
		<script src="/SASHBI/scripts/ax5/formatter/dist/ax5formatter.js"></script>
		<script src="/SASHBI/scripts/ax5/picker/dist/ax5picker.js"></script>
		<script src="/SASHBI/scripts/ax5/select/dist/ax5select.js"></script>
		<script src="/SASHBI/scripts/ax5/grid/dist/ax5grid.js	"></script>
	-->
	<script src="/SASHBI/scripts/jquery/format.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/lib/Sortable.min.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/lib/firebugx.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/lib/jquery.event.drag-2.3.0.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/lib/jquery.event.drop-2.3.0.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.core.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.formatters.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.editors.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.grid.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.groupitemmetadataprovider.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.dataview.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.interactions.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/slick.groupitemmetadataprovider.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.autotooltips.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellcopymanager.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellrangedecorator.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellrangeselector.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellselectionmodel.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.cellexternalcopymanager.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.checkboxselectcolumn.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.rowmovemanager.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/plugins/slick.rowselectionmodel.js"></script>
	<script src="/SASHBI/scripts/SlickGrid/controls/slick.columnpicker.js"></script>
    <!-- script src="/SASHBI/scripts/SlickGrid/lib/require.js"></script -->
    <script src="/SASHBI/scripts/SlickGrid/lib/underscore.js"></script>
    <script src="/SASHBI/scripts/SlickGrid/lib/jquery.slickgrid.export.excel.js"></script>	
	<script src="/SASHBI/scripts/pvt/dist/pivot.js"></script>	
	<script src="/SASHBI/scripts/SlickGrid/controls/slick.pager.js"></script>

	<script src="/SASHBI/scripts/d3/d3.min.js"></script>
	<script src="/SASHBI/scripts/nvd3/build/nv.d3.js"></script>
	<script src="/SASHBI/scripts/saveSvgAsPng/saveSvgAsPng.js"></script>
	<script src="/SASHBI/scripts/jstree/dist/jstree.js"></script>	
<%
}
%>
	<script defer src="/SASHBI/scripts/jquery/reportViewer.js" ></script>
<%
if (rptType.equalsIgnoreCase("tabHTML")){
%>	
	<script defer src="/SASHBI/scripts/jquery/tabHTML.js" charset="euc-kr"></script>
<%
} else if (rptType.equalsIgnoreCase("tabGrid")){
%>	
	<script defer src="/SASHBI/scripts/jquery/tabGrid.js" charset="euc-kr"></script>
<%
} else if (rptType.equalsIgnoreCase("opnSWSlickGrid")){
%>	
	<script defer src="/SASHBI/scripts/jquery/grid.js" charset="euc-kr"></script>
<%
} else if (rptType.equalsIgnoreCase("opnSWSlickGridEdit")){
%>	
	<script defer src="/SASHBI/scripts/jquery/gridEditor.js" charset="euc-kr"></script>
<%
} 
%>
<%
logger.info("headerJS 917:" + headerJS);
if (headerJS != null){
%>	
	<script src="<%=headerJSURL%>" charset="euc-kr"></script>
<%
}
%>
<%
if (!isAdmin) {
%>
	<script src="/SASHBI/scripts/jquery/js/protectCode.js"></script>
<%
}
%>
	<script>
var isAdmin = <%=isAdmin%>;
<%
Viewer.prtInitPromptValue(promptDefinitions, locale, out);
%>		
function definitions(){}
const isOSW = <%=isOSW%>;
const spPathUrl = "<%=sp_pathUrl%>";
// const basePath = spPathUrl.substring(0, spPathUrl.lastIndexOf("/")+1);
const metaID = "<%=metaID%>";
const _REPORT_DESC = "<%=desc%>";
const isDebug = <%=isDebug%>;
const orgRptType = "<%=rptType%>";
const hasHelpDoc = "<%=hasHelpDoc%>";
const storedXlsFilePath = encodeURIComponent("<%=helpDocFullPath%>");
const storedXlsFileName = encodeURIComponent("<%=helpDocFileName%>");
const excelPGM = "<%=excelPGM%>";
const savePGM = "<%=savePGM%>";
const uploadPGM = "<%=uploadPGM%>";
const initPGM = "<%=initPGM%>";
const hideUpload = "<%=hideUpload%>";
const hideDelete = "<%=hideDelete%>";
const showAddRow = "<%=showAddRow%>";
const showAddRowCust = "<%=showAddRowCust%>";

const btnAddRow = <%=btnAddRow%>;
const btnAddRowCust = <%=btnAddRowCust%>;
const btnDelete = <%=btnDelete%>;
const btnSave = <%=btnSave%>;
const btnUpload = <%=btnUpload%>;
const rowsPerPage = <%=rowsPerPage%>;
const isNoSubmitBtn = <%=isNoSubmitBtn%>;
const onLoadCollapse = <%=ON_LOAD_COLLAPSE%>;
const userIP = "<%=userIP%>";
const download_type = "<%=download_type%>";
const servlet = "<%=servlet%>";
_STPREPORT_OUT_LAYOUT = "<%=STPREPORT_OUT_LAYOUT%>";
let pagenum ;
let multipleVars = [];
<%
	String js = "";
	for (int i=0; i < multiInfo.size();i++){
		String multiVar = (String)multiInfo.get(i);
		js = "multipleVars.push('" + multiVar + "');";
		out.println(js);
	}
%>



$(document).ready(function () {
<%
for (int i = 0; i < promptDefinitions.size(); i++) {
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	String pName=pdi.getPromptName();
	if((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)){
		String dateType="";
		if (pdi instanceof DateDefinition) {
			dateType=((DateDefinition) pdi).getDateType().toString();
		} else if (pdi instanceof SharedDateDefinition) {
			dateType=((SharedDateDefinition) pdi).getDateType().toString();
		}
		logger.debug("dateType:" + dateType);
		out.println("\t$(\"#slt" + pName +"\").datepicker({");
		out.println("\t\tdefaultDate: \"0m\",");
		//out.println("\t\tnumberOfMonths: 1,");
		out.println("\t\tchangeMonth: true,");
		out.println("\t\tchangeYear: true,");
		//out.println("\t\tminDate: new Date(1980, 1 - 1, 1),");
		out.println("\t\tfirstDay: 1,");
		if (!dateType.equals("DATE")) {
			out.println("\t\tonClose: function(dateText, inst) {");
			out.println("\t\t\tvar month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();");
			out.println("\t\t\tvar year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();");
			out.println("\t\t\t$(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));");
			out.println("\t\t},");
		} 
		out.println("\t\tshowButtonPanel: true");
		out.println("\t});");
		if (dateType.equals("DATE")) {
			out.println("\t$(\"#slt" + pName + "\").datepicker(\"option\",\"dateFormat\",\"yy-mm-dd\");");
		} else if (dateType.equals("MONTH")) {
			out.println("\t$(\"#slt" + pName + "\").datepicker(\"option\",\"dateFormat\",\"yy-mm\");");
			out.println("\t$(\"#slt" + pName + "\").bind('click',function(){$('.ui-datepicker-calendar').css('display','none');});");
			out.println("\t$(\"#slt" + pName + "\").bind('focus',function(){$('.ui-datepicker-calendar').css('display','none');});");
		} else if (dateType.equals("YEAR")) {
			out.println("\t$(\"#slt" + pName + "\").datepicker(\"option\",\"dateFormat\",\"yy\");");
		}
	}
	if((pdi instanceof DateRangeDefinition) || (pdi instanceof SharedDateRangeDefinition)){
		String minDateString="";
		String maxDateString="";
		String dateType="";
		//String maxDateType="";
		if(pdi.isDefaultValueSet()){
			/*
			Date minDate=dr.getMinimum();
			minDateString=Stub.getDefaultDate(minDate.toString());
			Date maxDate=dr.getMaximum();
			maxDateString=Stub.getDefaultDate(maxDate.toString());
			*/
			Object dftDateR=pdi.getDefaultValue();
			Date dftRange[]=(Date[])dftDateR;
			minDateString=Stub.getDefaultDate(dftRange[0].toString());
			maxDateString=Stub.getDefaultDate(dftRange[1].toString());
			if (pdi instanceof DateRangeDefinition) {
				dateType=((DateRangeDefinition) pdi).getDateType().toString();
			} else if (pdi instanceof SharedDateRangeDefinition) {
				dateType=((SharedDateRangeDefinition) pdi).getDateType().toString();
			}
			//minDateType=dftRange[0].toString().substring(0,1);
			//maxDateType=dftRange[1].toString().substring(0,1);
			logger.debug("minDateString:"+dftRange[0].toString());
			logger.debug("maxDateString:"+maxDateString);
		}

		out.println("\t$(\"#slt" + pName +"_start\").datepicker({");
		out.println("\t\tdefaultDate: \"0m\",");
		out.println("\t\tnumberOfMonths: 1,");
		out.println("\t\tchangeMonth: true,");
		out.println("\t\tchangeYear: true,");
		if (!dateType.equals("DATE")) {
			out.println("\t\tonClose: function(dateText, inst) {");
			out.println("\t\t\tvar month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();");
			out.println("\t\t\tvar year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();");
			out.println("\t\t\t$(this).datepicker('setDate', new Date(year, month, 1));");
			out.println("\t\t},");
		}
		out.println("\t\tshowButtonPanel: true");
		out.println("\t});");
		if (dateType.equals("DATE")) {
			out.println("\t$(\"#slt" + pName + "_start\").datepicker(\"option\",\"dateFormat\",\"yy-mm-dd\");");
		} else if (dateType.equals("MONTH")) {
			out.println("\t$(\"#slt" + pName + "_start\").datepicker(\"option\",\"dateFormat\",\"yy-mm\");");
		} else if (dateType.equals("YEAR")) {
			out.println("\t$(\"#slt" + pName + "_start\").datepicker(\"option\",\"dateFormat\",\"yy\");");
		}

		out.println("\t$(\"#slt" + pName +"_end\").datepicker({");
		out.println("\t\tdefaultDate: \"0m\",");
		out.println("\t\tnumberOfMonths: 1,");
		out.println("\t\tchangeMonth: true,");
		out.println("\t\tchangeYear: true,");
		if (!dateType.equals("DATE")) {
			out.println("\t\tonClose: function(dateText, inst) {");
			out.println("\t\t\tvar month = $('#ui-datepicker-div .ui-datepicker-month :selected').val();");
			out.println("\t\t\tvar year = $('#ui-datepicker-div .ui-datepicker-year :selected').val();");
			out.println("\t\t\t$(this).datepicker('setDate', new Date(year, month, 1));");
			out.println("\t\t},");
		}
		out.println("\t\tshowButtonPanel: true");
		out.println("\t});");
		if (dateType.equals("DATE")) {
			out.println("\t$(\"#slt" + pName + "_end\").datepicker(\"option\",\"dateFormat\",\"yy-mm-dd\");");
		} else if (dateType.equals("MONTH")) {
			out.println("\t$(\"#slt" + pName + "_end\").datepicker(\"option\",\"dateFormat\",\"yy-mm\");");
		} else if (dateType.equals("YEAR")) {
			out.println("\t$(\"#slt" + pName + "_end\").datepicker(\"option\",\"dateFormat\",\"yy\");");
		}
		out.println("\t$(\"#slt" + pName + "_start\").bind('change',function(){");
		out.println("\t\tvar start_val=$(\"#slt" + pName + "_start\").val();");
		out.println("\t\tvar end_val=$(\"#slt" + pName + "_end\").val();");
		out.println("\t\tif (start_val > end_val) {");
		out.println("\t\t\talertMsg(\"Check the period.\");");
		out.println("\t\t\t$(\"#slt" + pName + "_start\").val($(\"#slt" + pName + "_end\").val());");
		out.println("\t\t}");
		out.println("\t});");
		out.println("\t$(\"#slt" + pName + "_end\").bind('change',function(){");
		out.println("\t\tvar start_val=$(\"#slt" + pName + "_start\").val();");
		out.println("\t\tvar end_val=$(\"#slt" + pName + "_end\").val();");
		out.println("\t\tif (start_val > end_val) {");
		out.println("\t\t\talertMsg(\"Check the period.\");");
		out.println("\t\t\t$(\"#slt" + pName + "_end\").val($(\"#slt" + pName + "_start\").val());");
		out.println("\t\t}");
		out.println("\t});");
			
	}
}
for (int i = 0; i < promptDefinitions.size(); i++) {
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	//if (!pdi.getPromptName().toUpperCase().equalsIgnoreCase("_DEBUG") && !pdi.getPromptName().startsWith("_STPREPORT")) {
	if (!pdi.getPromptName().startsWith("_STPREPORT")) {
		logger.debug("Pompt : " + pdi.getPromptName() + " is hidden??? : " + pdi.isHidden());
		out.println("\t"+"get_" + pdi.getPromptName() + "();");
		//setTimeout("getMain()",1*1);
	}
}
for (int i = 0; i < promptDefinitions.size(); i++) {
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	if (pdi instanceof DateRangeDefinition || pdi instanceof SharedDateRangeDefinition) {
%>
			var <%=pdi.getPromptName()%>_start = getCookie('<%=pdi.getPromptName()%>_start');
			if (<%=pdi.getPromptName()%>_start == "" ){ 
			} else if (<%=pdi.getPromptName()%>_start != undefined){
				$("#slt<%=pdi.getPromptName()%>_start").val(<%=pdi.getPromptName()%>_start);
			}

			var <%=pdi.getPromptName()%>_end = getCookie('<%=pdi.getPromptName()%>_end');
			if (<%=pdi.getPromptName()%>_start == "" ){ 
			} else if (<%=pdi.getPromptName()%>_end != undefined){
				$("#slt<%=pdi.getPromptName()%>_end").val(<%=pdi.getPromptName()%>_end);
			}
<%
	} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
%>
			var <%=pdi.getPromptName()%>_DD = getCookie('<%=pdi.getPromptName()%>');
			if (<%=pdi.getPromptName()%>_DD == "") {
			} else if (<%=pdi.getPromptName()%>_DD != undefined){
				$("#slt<%=pdi.getPromptName()%>_DD").val(<%=pdi.getPromptName()%>_DD);
			}
<%		
	}
}
logger.debug("ON_LOAD_COLLAPSE : " + ON_LOAD_COLLAPSE);
logger.debug("hiddenInfo: "+ hiddenInfo.toString());
%>	
});
function submitSTP(){
	$("#btnRun").prop("disabled", true);	
	console.log("Start submitSTP");
	var isSltNull =0;
	$("#dvCondi select").each(function(){
		var cur_val = $(this).val();
		console.log("select cur_val : " + cur_val);
		if (cur_val == null){
			//alert("조회조건을 확인하시고 실행하여 주시기 바랍니다.");
			isSltNull++;
		}
	});
	if (isSltNull > 0) {
		alertMsg("조회조건이 초기화 중입니다. <br> 다시 실행하여 주시기 바랍니다.");	
		$("#btnRun").prop("disabled",false);	
		return;
	}
<%
	String varNameBaseDate=null;
	for (int i = 0; i < promptDefinitions.size(); i++) {
		PromptDefinitionInterface pdi = promptDefinitions.get(i);
		String pName = pdi.getPromptName();
		if ((pdi instanceof DateRangeDefinition) || (pdi instanceof SharedDateRangeDefinition)){
			varNameBaseDate = pdi.getPromptName();
			hStr="\tvar " + pdi.getPromptName() +"_start" + "=$(\"#slt" + pdi.getPromptName()+ "_start\").val();";
			out.println(hStr);
			hStr="\tvar " + pdi.getPromptName() +"_end" + "=$(\"#slt" + pdi.getPromptName()+ "_end\").val();";
			out.println(hStr);
%>
			var <%=pdi.getPromptName()%>_start=$("#slt<%=pdi.getPromptName()%>_start").val();
			var <%=pdi.getPromptName()%>_end=$("#slt<%=pdi.getPromptName()%>_end").val();
			
			//alert($("#slt<%=pdi.getPromptName()%>_start").val().replace(/-/gi, ""));
			//document.getElementById("_startDate1").value = $("#slt<%=pdi.getPromptName()%>_start").val().replace(/-/gi, "");
			//document.getElementById("_startDate2").value = $("#slt<%=pdi.getPromptName()%>_start").val().replace(/-/gi, "");
			//document.getElementById("_endDate1").value = $("#slt<%=pdi.getPromptName()%>_end").val().replace(/-/gi, "");
			//document.getElementById("_endDate2").value = $("#slt<%=pdi.getPromptName()%>_end").val().replace(/-/gi, "");
						
			//setCookie("<%=pdi.getPromptName()%>_start", <%=pdi.getPromptName()%>_start,30);
			//setCookie("<%=pdi.getPromptName()%>_end", <%=pdi.getPromptName()%>_end,30);
<%
		} else if ((pdi instanceof DateDefinition) || (pdi instanceof SharedDateDefinition)) {
%>
			var <%=pdi.getPromptName()%>=$("#slt<%=pdi.getPromptName()%>").val();
			
			//document.getElementById("_startDate1").value = $("#slt<%=pdi.getPromptName()%>").val().replace(/-/gi, "");
			//document.getElementById("_startDate2").value = $("#slt<%=pdi.getPromptName()%>").val().replace(/-/gi, "");
			//setCookie("<%=pdi.getPromptName()%>", <%=pdi.getPromptName()%>,30);
<%
		} else {
			if (!pName.startsWith("_STPREPORT_")){
				hStr="\tvar " + pdi.getPromptName() + "=$(\"#slt" + pdi.getPromptName()+ "\").val();";
				out.println(hStr);
			}
		}
	}
	if(hiddenInfo.containsKey("_STPREPORT_RETRIEVE_TERM") && varNameBaseDate!=null){
		out.println("    var _term_num=Number(_STPREPORT_RETRIEVE_TERM); \n");
		out.println("    var _diffDay=getDiffDay("+varNameBaseDate+"_start, "+varNameBaseDate+"_end); \n");
		out.println("    if(_term_num < _diffDay){ \n");
		out.println("        alertMsg2('조회가능 기간은 '+_STPREPORT_RETRIEVE_TERM+'일입니다.'); \n");
		out.println("        return; \n");
		out.println("    } \n");
	}
%>

	$("#dvSubImg").hide();
	$("#dvSASLog").html("");
	$("#dvRslt").show();
	$("#dvOutput").show();
	//$("#dvOutput").hide();
	$("#dvGraph1").hide();	
	$("#dvBox").hide();
	$("#dvColumnHeader").hide();
	$("#dvRowHeader").hide();
	$("#dvData").hide();
	// $("#dvTitle").html("");
	$("#dvBox").html("");
	$("#dvColumnHeader").html("");
	$("#dvRowHeader").html("");
	$("#dvData").html("");
	$("#dvRes").html("");
	$("#dvPagePanel").html("");
	$("#dvDummy").html("");
	$("#dvRes").hide();
	$("#dvDummy").hide();
	$("#dvPagePanel").hide();
	$("#progressIndicatorWIP").show();
	isDisplayProgress=1;
	// if (rowsPerPage > 0) $("#pagenum").val("");

<%
	/*
	if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
		out.println("\t$(\"#pagenum\").val(\"\");");	
	}
	*/
	String stpCustomFile = (String)session.getAttribute("sas_StoredProcessCustomFile_HBI");
	logger.debug("custOutJS : " + custOutJS);
	
	if (custOutJS.equalsIgnoreCase("") && !isOSW){
		out.println("\tsetTimeout(\"getMain()\", 1000*1);");
	} else {
		if (rptType.equalsIgnoreCase("tabHTML")){
			//
			out.println("\t$sasResHTML = \"\";");
			out.println("\t$sasResHTML = execSTPH(\""+sp_pathUrl+"\", 'cbSubmit');");
		} else if (rptType.equalsIgnoreCase("tabGrid")){
			//
			out.println("\t$sasResHTML = \"\";");
			out.println("\t$sasResHTML = execSTPA(\""+sp_pathUrl+"\", 'cbSubmit');");
		} else if (rptType.equalsIgnoreCase("opnSWSlickGrid")){
			//
			out.println("\t$sasResHTML = \"\";");
			out.println("\t$sasResHTML = execSTPA(\""+sp_pathUrl+"\", 'setSlickGrid');");
		} else if (rptType.equalsIgnoreCase("opnSWSlickGridEdit")){
			//
			out.println("\t$sasResHTML = \"\";");
			out.println("\t$sasResHTML = execSTPA(\""+sp_pathUrl+"\", 'setSlickGrid');");
		} else if (rptType.equalsIgnoreCase("opnSWSlickGridTree")){
			out.println("\t$(\"#sasGrid\").hide();");
			out.println("\t$sasResHTML = \"\";");
			out.println("\t$sasResHTML = execSTPA(\""+sp_pathUrl+"\", 'setSlickGridTree');");
		} else if (rptType.equalsIgnoreCase("opnSWPVT")){
			out.println("\t$(\"#sasGrid\").hide();");
			out.println("\t$sasResHTML = \"\";");
			out.println("\t$sasResHTML = execSTPA(\""+sp_pathUrl+"\", 'setPVT');");
		} else if (rptType.equalsIgnoreCase("opnSWPVTUI")){
			out.println("\t$(\"#sasGrid\").hide();");
			out.println("\t$sasResHTML = \"\";");
			out.println("\t$sasResHTML = execSTPA(\""+sp_pathUrl+"\", 'setPVTUI');");
		} else {
			out.println("\t$sasResHTML = \"\";");
			out.println("\t$sasResHTML = execSTP(\""+sp_pathUrl+ "\",\"\",\"\",\"\",\"\");");
			Stub.incFile(hiddenInfo, "_STPREPORT_CUST_OUTPUT", (String)session.getAttribute("sas_StoredProcessCustomFile_STPRV"), out);
		}
	}
%>	
	$('#btnExcel').show();
	$("#btnRun").prop("disabled",false);	
}	// End of submitSTP();


<%
Viewer.prtGenFunction(promptDefinitions,map,defInfo,request,out);				//for condi debug

for (int i = 0; i < promptDefinitions.size(); i++) {
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	if (pdi instanceof IntegerDefinition || pdi instanceof DoubleDefinition) {
        // IntegerDefinition id = (IntegerDefinition)pdi;
		String pName = pdi.getPromptName();
		hStr = "function get_"+ pName +"(){}";
		out.println(hStr);	
	}
}

if(ON_LOAD_SUBMIT.equalsIgnoreCase("1")){
	int submitCondCount = prmptNum + map.size()-1;
%>
function onLoadStart(){
	// console.log("submitCondCount : " + submitCondCount);
	if ( submitCondCount >= <%=submitCondCount%> ) {
	setTimeout("submitSTP()",500*1);
	}
}
setTimeout("onLoadStart()",1000*1);
<%
}
%>
</script>
</head>
<body style="overflow: hidden;border:0px solid #ff0000; margin:0px 0px 0px 0px; padding:0px 0px 0px 0px;" onresize="//resizeFrame();">
<div id=dvCondi style="display:block;">
	<table width="100%">
		<tr style="padding:0px;">
	        <td width=10 ><!--img src="/SASHBI/images/ico_titleType2.png" border="0"  style="padding-top:5px;"--></td>
	        <th class="t ReportTitle"><%=desc%></th>
           <td align="right" v-align="bottom">
           <span id="condShowHide" class="ui-accordion-header-icon ui-icon ui-icon-circle-arrow-n"  style="cursor:pointer;"></span>
           </td>
	    </tr>
	    <tr id="condBottomMargin" style="height:10px;">
	    </tr>
	</table>
	<div id="dvCondTable">
	<table class="condTable" cellspacing="0" cellpadding="0" >
		<tr>
			<td style="border:0px solid #ff0000;">
<%
Viewer.prtPromptCondi(promptDefinitions,map,request,out);
%>
			</td>
			<td class="buttonArea" id="condButtonArea">	
				<div id="viewableDateMsg" class="viewableLabel" style="width:240px; height:20px;position: absolute; top:12px; right:80px"></div>	
<%
	if (isNoSubmitBtn == 0){
%>			
		<input type=button id="btnRun" class="condBtnSearch" value="조회" disabled><br> 
<%
	}
int isNoExcelBtn = 0;
if(hiddenInfo.containsKey("_STPREPORT_NOEXCEL_BTN")){ 
	try{
		isNoExcelBtn = Integer.parseInt(hiddenInfo.get("_STPREPORT_NOEXCEL_BTN"));
	} catch ( Exception e) {
		isNoExcelBtn=1;
	} finally {
		
	}
}
logger.debug("isNoExcelBtn : " + isNoExcelBtn);
String excelDisabled = "";
if ( isNoSubmitBtn == 0) excelDisabled = "disabled";
if ( isNoExcelBtn == 0){
%>				
		<input type=button id="btnExcel" class="condBtnExcel" value="엑셀" <%=excelDisabled%><br>
		<!--
		<input type=button id="btnExcel" class="condBtnExcel" value="엑셀" onclick="exportEXCEL();">
		<button type="button" id="btnExcel" class="condBtnExcel" onclick="exportEXCEL();"><i></i>엑셀</button>
		-->
<%
}
if (userContext.isInGroup("Report Admin")){
%>
		<span id="btnHeaderEdit" onclick="editHeader();" ></span>
		<span id="btnEditLayout" onclick="editLayout();" ></span>
		<span id="btnSASLog" onclick="getSASLog();" ></span>
		<span id="btnHelp" onclick="downloadDoc();" ></span>
<!-- 
		<img id="btnHeaderEdit"  src="/SASHBI/images/icon_log.png" border=0 onclick="editHeader();" >
		<a href="/SASHBI/HBIServlet?sas_forwardLocation=editLayout" target="editLayout">
		<img id="btnEditLayout"  src="/SASHBI/images/editLayout.gif" border=0 onclick="//editLayout();" >
		</a>
		<img id="btnSASLog"  src="/SASHBI/images/icon_log.png" border=0 onclick="getSASLog();" >
-->		
<%
}
%>
			</td>
		</tr>
<%
for (int i=1; i < promptDefinitions.size(); i++){
	PromptDefinitionInterface pdi = promptDefinitions.get(i);
	if (pdi instanceof TextDefinition){
		TextDefinition td = (TextDefinition)pdi;
		ValueProviderInterface vs = td.getValueProvider();
		if (vs == null){
			String dftValue = "";
			if (pdi.isHidden()){
				if (td.isDefaultValueSet()){
					Object oDV = td.getDefaultValue();
					dftValue = oDV.toString();
				}
				int size = td.getMaximumLength();
				hStr = "<input type=hidden id=slt" + pdi.getPromptName() + " name=slt" +pdi.getPromptName()
					+ " value=\"" + dftValue + "\""
					+ " />";
				out.println(hStr);	
			}
		}
	}
}
/* 
if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
	out.println("<input type=hidden id=pagenum name=pagenum value='' />");
}
*/
%>
	</table>
	</div>
</div>
<div id=dvToolBar style="display:none;padding:10px 10px 0px 0px;" align=right></div>
<%
if (layoutStr != null) {
%>
	<%@include file="layoutMakeFromMeta.jsp"%>	
<%
} else if(hiddenInfo.containsKey("_STPREPORT_OUT_LAYOUT")){
	Stub.incFile(hiddenInfo,"_STPREPORT_OUT_LAYOUT", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
} else if (rptType.equalsIgnoreCase("opnSWSlickGrid")) {
%>
	<%@include file="layoutSlickGridN.jsp"%>	
<%
} else if (rptType.equalsIgnoreCase("opnSWSlickGridTree")) {
%>
	<%@include file="layoutSlickGridTree.jsp"%>	
<%
} else if (rptType.equalsIgnoreCase("opnSWPVT")) {
%>
	<%@include file="layoutPVT.jsp"%>	
<%
} else if (rptType.equalsIgnoreCase("opnSWPVTUI")) {
%>
	<%@include file="layoutPVTUI.jsp"%>	
<%
} else if (rptType.equalsIgnoreCase("tabHTML")) {
%>
	<%@include file="layoutTabHTML.jsp"%>	
<%
} else if (rptType.equalsIgnoreCase("tabGrid")) {
%>
	<%@include file="layoutTabGrid.jsp"%>	
<%
} else {
%>
	<%@include file="layoutDefault.jsp"%>	
<%
}
%>
<%
if (hiddenInfo.containsKey("_STPREPORT_ADDON_LAYOUT")){
	Stub.incFile(hiddenInfo, "_STPREPORT_ADDON_LAYOUT",(String)session.getAttribute("sas_StoredProcessCustomPath_STPRV"),out);
}
%>
<div id=dvDummy style="display:none;width:1000000"></div>
<div id=dvUserHeader style="display:none;">
<%=userDefinedHeader.view(sci)%>
<%
Stub.incFile(hiddenInfo,"_STPREPORT_HEADER_HTML", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
%>
</div>
<div id="progressIndicatorWIP"
      style="display:none; position:absolute;top:300px;left:0px;  padding:50px 100px 50px 100px;  z-index:100005; border: 0px solid #dfdfdf; background-color: #FFFFFF">
    <table border="0" cellspacing="0" cellpadding="0" style="height:100%;width:100%;" summary="">
        <tr>
            <td style="text-align:center;vertical-align:top;">
                <table border="0" cellspacing="0" cellpadding="0" style="width:100%;" summary="">

                    <tr>
                        <td style="text-align:center;vertical-align:bottom;">
                            <img id="progressIndicatorImage" src='/SASHBI/images/progress.gif'
                                style="width:120px; height:120px" alt="잠시 기다리십시오." />
                        </td>
                    </tr>
                    <tr><td class="lineSpacer">&nbsp;</td></tr>
                    <tr>
                        <td style="text-align:center;vertical-align:top;" class="progress">
                            <span id="pleaseWaitMessage">
                                잠시 기다리십시오.
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align:center;vertical-align:top;" class="progress">
                            <span id="progressMessage">
                                시스템이 정보를 탐색 중입니다...
                            </span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
<div id=dvSubImg class="none_data" style="display:block">
	<img src="/SASHBI/images/icon_nopage.png" alt="" />
	<p>조건을 선택하고 조회하여 주세요</p>
</div>
<div id=dvTooltip ></div>
<div id=dvHelp class="dvHelp"></div>
<div id=dvSASLogWin class="dvSASLogWin">
	<div onClick="$('#dvSASLogWin').hide();" class="ui-widget-header dvSASLogHeader">
	SAS Log
	</div>
	<div id=dvSASLog  class="dvSASLog"></div>
</div>
<div id=dvAlert2 style="display:none">
	<div id=dvMsgBox2 style="font-size:11pt;padding:15px 0px 15px 0px"></div>
</div>
<div id=dvConfirm2 style="display:none">
	<div id=dvConfirmMsgBox2 style="font-size:11pt;padding:15px 0px 15px 0px"></div>
</div>
<div id=dvBG style="position: absolute;top:0px;left:0px;display:none;z-index: 40000;background: #efefef;opacity: 0.8;width:100%;height:inhertit"></div>
<div id="canvas" style="display:none;"></div>
<div id="previewGraph"></div>
<div id=grPop style="position:absolute;display:none;cursor:pointer;padding: 15px;z-index: 100001;background: #efefef;box-shadow: 0px 0px 15px black;-moz-box-shadow: 0px 0px 15px black;-webkit-box-shadow: 0px 0px 15px black;">
<span onClick="saveGraph();">Save Graph as PNG</span>
</div>

<div style="display:none;">
	<form id="fomUpload" name="fomUpload" action="/SASStoredProcess/do" method="post" enctype="multipart/form-data" accept-charset="euc-kr">
	</form>
	<iframe id="fileDown" name="fileDown" style='display:none;' src="" width="0" height="0" frameborder="0"></iframe>
</div>
<div id=dvUploadFile style="display:none;">
	<form id="fomExcelUpload" name="fomExcelUpload" action="/SASStoredProcess/do" method="post" enctype="multipart/form-data" accept-charset="euc-kr">
		<table style="width:100%;">
			<tr>
				<td style="text-align:center;width:100px;background:#efefef;">
					<span style="font-weight: bold;">Upload File</span>
				</td>
				<td style="width:350px;padding:3px 10px;border-bottom:1px solid gray;">
					<span id="spnFilename"></span>
				</td>
				<td>
					<input type="button" value="파일선택" id="btnFileSelect" class="btn_basic" style="width:80px" onclick="$('#iptAttachFile').click();">
				</td>
			</tr>
		</table>
		<div style="display: none;">
			<input type="file" name="iptAttachFile" id="iptAttachFile" style="width: 480px;" onchange="fnSelectAttachFile();">
		</div>
	</form>
<div>

</body>
</html>
