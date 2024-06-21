<!DOCTYPE HTML>
<%@ page language="java" contentType= "text/html; charset=UTF-8" %>
<%@ page language="java"
    import="com.sas.services.session.SessionContextInterface,
				com.sas.hbi.storedprocess.StoredProcessFacade,
				com.sas.web.keys.CommonKeys,
				org.apache.log4j.*,
				java.util.*"
%>			
<jsp:useBean id="userDefinedHeader" class="com.sas.hbi.tools.UserDefinedHeader"/>
<%
	Logger logger = Logger.getLogger("STPRV");
	logger.setLevel(Level.INFO);
	
	String contextName = application.getInitParameter("application-name");
	
	String stpObjID =null;
	StoredProcessFacade facade=(StoredProcessFacade)request.getSession().getAttribute("sas_StoredProcessFacade_HBI");
	stpObjID=facade.getMetaID();
	logger.debug("stpObjID:"+stpObjID);
	
	
	SessionContextInterface sci = (SessionContextInterface)session.getAttribute(CommonKeys.SESSION_CONTEXT);
	
	userDefinedHeader.setStpObjId(stpObjID);
	String headerHtmlCode = userDefinedHeader.view(sci);
	logger.debug("headerHtmlCode : "+headerHtmlCode);
%>

<html>
<head>
<title>User Defined Header</title>
<style type="text/css">
    table, th {
        border: solid 1px black;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    th {
        padding: 8px;
        width: 20px;
        font-size:12px;
        font-family:arial;
    }
    .s {
        background: #d0eaf9;
    }
    #rows, #cols {
        width: 20px;
    }
    th div {
        outline: none;
    }
    #tableWrap {
        padding: 10px;
    }
</style>
	<link rel=stylesheet href="/<%=contextName%>/styles/Portal.css" type="text/css" />
	<link rel=stylesheet href="/<%=contextName%>/styles/custom.css" type="text/css" />
	<link rel="stylesheet" href="/<%=contextName%>/jquery/css/demos.css">
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/<%=contextName%>/scripts/jquery/js/headerEditor.js" type="text/javascript"></script>
<script language="javascript">
if(window.console==undefined) { console={log:function(){}};}
function goSave() {
    var myForm = fomHeader;
    if(myForm.headerHtmlCode.value == ''){
        myForm.headerHtmlCode.focus();
        return;
    }

    myForm.action = "/<%=contextName%>/HBIServlet";
    myForm.target = 'headerRes';            
    myForm.submit();
}
function goDelete() {
    var myForm = fomHeader;
    myForm.action = "/<%=contextName%>/HBIServlet";
    myForm.target = 'headerRes';          
    myForm.sas_forwardLocation.value="DELETE";
    myForm.submit();
}
<%
if (headerHtmlCode==null){
%>
$(document).ready(function () {
	$("#generate").trigger("click");
});
<%
}
%>
</script>
</head>
<body>
<div id=dvCondi>
	<input type=button id=generate class=condBtn value=Generate />
	Rows:<input id=rows type=text value=5 maxlength=2 />
	Cols:<input id=cols type=text value=10 maxlength=3 />
	<br />
	<input type=button id=getHeader 	class=condBtn value="Import" />
	<input type=button id=btnSave 	class=condBtn value="Save" onclick="goSave();" />
	<input type=button id=btnDelete 	class=condBtn value="Delete" onclick="goDelete();" />
	<br />
	<input type=button id=merge 		class=condBtn value="Merge" />
	<input type=button id=csplit 		class=condBtn value="Col Split" />
	<input type=button id=rsplit 		class=condBtn value="Row Split" />
	<input type=button id=addRow 		class=condBtn value="Add Row" />
	<input type=button id=addCol 		class=condBtn value="Add Column" />
	<br />
</div>
	
<hr />
<div id=tableWrap>
<%
if (headerHtmlCode!=null){
	out.println(headerHtmlCode);
}
%>
</div>
<hr />
<div style="display:none;">
	<form name=fomHeader method="post">
	<input type=hidden name=sas_forwardLocation value=SAVE>
	<span style="font-size:14px;">Genarated HTML</span><br/>
	<textarea name=headerHtmlCode cols=80 rows=10 id=export>
	</textarea>
	</form>
</div>
<hr/>
	<span style="font-size:14px;">Import HTML</span><br/>
<textarea name=import cols=80 rows=10 id=import></textarea>
<div style="display:none;">
<div id=dvDummy >
</div>
<iframe name="headerRes" id="headerRes" frameborder="0">
</iframe>
</div>
<script>
<%
if (headerHtmlCode!=null){
	out.println("$(\"#import\").val(\"" + headerHtmlCode.replaceAll("\"", "\'").replaceAll("\n","") + "\");");
}
%>
</script>
</body>
</html>