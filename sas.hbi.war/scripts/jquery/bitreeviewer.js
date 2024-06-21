$.browser = {};
$.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
$.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
$.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
var tParams=eval('[{}]');
var $sasResHTML ;
var submitCondCount=0;
(function( $ ){
	
	$.fn.setSASTable = function(sasRes) {
		var layoutHTML = "";
		layoutHTML+="<table id=tblOutput border='1' cellspacing='0' cellpadding='0'>";
		layoutHTML+="	<tr>                                                         ";
		layoutHTML+="		<td colspan=2>                                            ";
		layoutHTML+="			<div id=dvTitle></div>                                 ";
		layoutHTML+="		</td>                                                     ";
		layoutHTML+="	</tr>                                                        ";
		layoutHTML+="	<tr>                                                         ";
		layoutHTML+="		<td><div id=dvBox ></div></td>                            ";
		layoutHTML+="		<td vAlign=top><div id=dvColumnHeader ></div></td>        ";
		layoutHTML+="	</tr>                                                        ";
		layoutHTML+="	<tr>                                                         ";
		layoutHTML+="		<td><div id=dvRowHeader ></div></td>                      ";
		layoutHTML+="		<td vAlign=top><div id=dvData ></div></td>                ";
		layoutHTML+="	</tr>                                                        ";
		layoutHTML+="	<tr>                                                         ";
		layoutHTML+="		<td colspan=2>                                            ";
		layoutHTML+="			<div id=dvPagePanel style='text-align:center'></div>   ";
		layoutHTML+="		</td>                                                     ";
		layoutHTML+="	</tr>                                                        ";
		layoutHTML+="</table>                                                       ";
		layoutHTML+="<div id=dvResDummy ></div>                                     ";
		this.html(layoutHTML);
		$sasRes2=sasRes;
		/*
		$tableA = $sasRes2.find("table");
		console.log("table:" + $tableA);



		$("#dvResDummy").html($sasRes);
		$("#dvColumnHeader").html($("#dvResDummy thead").html());
		$("#dvData").html($sasRes);
		*/
		resizeFrame();
		//this.show();
		console.log("this.html: " + this.value);
	};

})( jQuery );

if(window.console==undefined) { console={log:function(){}};}
var stp_sessionid="";
var nstp_sessionid="";
var _THISSESSION="";
var save_path="";
var isRun=0;
var winW=$(window).width();   // returns height of browser viewport
var TabulaRowHeaderCnt=0;
var resizeTimer;
var rptType;
var colHeaderRowCnt;
var resSize;
var docMode="";
var threshold=1000000;
var $sasExcelHTML="";
var rMargin=10;			
var bMargin=45;
var colWidth=80;			
var isDisplayProgress = 1;
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
};

function msieversion(){
	var ua = window.navigator.userAgent
	var msie = ua.indexOf ( "MSIE " )

	if ( msie > 0 )      // If Internet Explorer, return version number
	   return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )))
	else                 // If another browser, return 0
	   return 0
}
function getBrowserType(){
 
    var _ua = navigator.userAgent;
     
    /* IE7,8,9,10,11 */
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var rv = -1;
        var trident = _ua.match(/Trident\/(\d.\d)/i);
         
        //ie11������ MSIE��ū�� ���ŵǰ� rv:11 ��ū���� ������ (Tridentǥ��� ����)
        if(trident != null && trident[1]  == "7.0") return rv = "IE" + 11;
        if(trident != null && trident[1]  == "6.0") return rv = "IE" + 10;
        if(trident != null && trident[1]  == "5.0") return rv = "IE" + 9;
        if(trident != null && trident[1]  == "4.0") return rv = "IE" + 8;
        if(trident == null) return rv = "IE" + 7;
         
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(_ua) != null) rv = parseFloat(RegExp.$1)
        return rv;
    }
     
    /* etc */
    var agt = _ua.toLowerCase();
    if (agt.indexOf("chrome") != -1) return 'Chrome';
    if (agt.indexOf("opera") != -1) return 'Opera'; 
    if (agt.indexOf("staroffice") != -1) return 'Star Office'; 
    if (agt.indexOf("webtv") != -1) return 'WebTV'; 
    if (agt.indexOf("beonex") != -1) return 'Beonex'; 
    if (agt.indexOf("chimera") != -1) return 'Chimera'; 
    if (agt.indexOf("netpositive") != -1) return 'NetPositive'; 
    if (agt.indexOf("phoenix") != -1) return 'Phoenix'; 
    if (agt.indexOf("firefox") != -1) return 'Firefox'; 
    if (agt.indexOf("safari") != -1) return 'Safari'; 
    if (agt.indexOf("skipstone") != -1) return 'SkipStone'; 
    if (agt.indexOf("netscape") != -1) return 'Netscape'; 
    if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
}
function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()
    var mseconds = currentTime.getTime()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM " + mseconds
    } else {
        str += "AM " + mseconds
    }
    return str;
}

function getDiffDay(startDate, endDate) {
    var diffDay = 0;
    var start_yyyy = startDate.substring(0,4);
    var start_mm = startDate.substring(5,7);
    var start_dd = startDate.substring(8,startDate.length);
    var sDate = new Date(start_yyyy, start_mm-1, start_dd);
    var end_yyyy = endDate.substring(0,4);
    var end_mm = endDate.substring(5,7);
    var end_dd = endDate.substring(8,endDate.length);
    var eDate = new Date(end_yyyy, end_mm-1, end_dd);

    diffDay = Math.ceil((eDate.getTime() - sDate.getTime())/(1000*60*60*24))+1;
            
    return diffDay;
}


function condCollapseStyle(){
	$("#condShowHide").removeClass("ui-icon-circle-arrow-n");
	$("#condShowHide").addClass("ui-icon-circle-arrow-s");
	$("#dvCondi").css("padding-bottom","0px");
	$("#condBottomMargin").css("height","0px");
}
function editLayout(){
	var objectName = new Object();
	editorURL="/SASHBI/HBIServlet?sas_forwardLocation=editLayout";
	var style ="dialogWidth:1200px;dialogHeight:600px;resizable:yes;";
	window.open(editorURL,'HeaderEditor','scrollbars=yes,menubar=no,toolbar=no,resizable=yes,width=1150,height=800,left=0,top=0');
	/*
	window.showModalDialog(editorURL, objectName ,style );
	*/
}

function editHeader(){
	var objectName = new Object();
	editorURL="/SASHBI/HBIServlet?sas_forwardLocation=EDIT";
	var style ="dialogWidth:800px;dialogHeight:600px;resizable:yes;";
	window.open(editorURL,'HeaderEditor','scrollbars=yes,menubar=no,toolbar=no,resizable=yes,width=900,height=800,left=0,top=0');
	/*
	window.showModalDialog(editorURL, objectName ,style );
	*/
}
function tooltip(event,text){
	//console.log("text.trim().length : " + text.trim().length);
	//console.log("event");
	//console.log(event); 
	//console.log("Msg : " + text);
	if (text.trim().length > 1) {
		$("#dvTooltip").css("left",eval(event.pageX+5)+"px");
		$("#dvTooltip").css("top",eval(event.pageY+5)+"px");
		$("#dvTooltip").html(text);
		$("#dvTooltip").show();
	}
}
function alertMsg(msg){
	$("#dvMsgBox").html(msg);

	$("#dvBG").show();
	$("#dvAlert").css("left",eval(eval($(window).width()-$("#dvAlert").width()-0)/2));
	$("#dvAlert").css("top",eval(eval($(window).height()-$("#dvAlert").height()-100)/2));
	$("#dvAlert").show();

	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$("#btnAlertMsgOK").focus();
	
}
function hideMsgBox(){
	$("#dvAlert").hide();
	$("#dvBG").hide();
}
var confirmFN="";
function confirmMsg(msg,fn){
	$("#dvConfirmMsgBox").html(msg);
	confirmFN=fn;

	$("#dvBG").show();
	$("#dvConfirm").css("left",eval(eval($(window).width()-$("#dvConfirm").width()-0)/2));
	$("#dvConfirm").css("top",eval(eval($(window).height()-$("#dvConfirm").height()-100)/2));
	$("#dvConfirm").show();

	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$("#btnConfirmMsgOK").focus();
	
}
function hideConfirmMsgBox(isRes,fn){
	console.log("Confirm Res : " + isRes);
	if (isRes == true) window[fn]();
	$("#dvConfirm").hide();
	$("#dvBG").hide();
	return isRes;
}
function setCookie(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; 
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
         start += cName.length;
         var end = cookieData.indexOf(';', start);
         if(end == -1)end = cookieData.length;
         cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}
var curGraph="";
function savePop(objID){
	curGraph=objID;
	console.log("objID : " + objID);

	//event.preventDefault();
  if (event.preventDefaut){ 
    event.preventDefault();
  } else {
    event.returnValue = false;
  }	
  console.log(event);
  //console.log("pageX : " + pageX);
	$("#grPop").css("top",event.pageX+"px");
	$("#grPop").css("left",event.pageY+"px");
	$("#grPop").show();
}		
function saveGraph(){
	$('#canvas').html("<style>\n"+nvcss+"\n</style>\n"+$("#" + curGraph).html());
	var canvas = $("#"+curGraph).find('svg')[0];
	console.log(canvas);
	try {
	  svgAsDataUri(canvas, null, function(uri) {
	    $("#previewGraph").html('<img src="' + uri + '" />');
	  });
		saveSvgAsPng(canvas, 'graph.png');
		$('#canvas').html("");
		$("#previewGraph").html("");
		$('#canvas').hide();
		$('#previewGraph').hide();
	} catch(err) {
		console.log("Error Occured : " + err);
		$("#previewGraph").html("");
	}

	$("#grPop").hide();
}
function nz(number,znum){
	var zn=Array(znum+1).join("0");
	var zn2=eval(zn.length);
	var z = (zn + number).slice(-zn2);	
	return z;
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
function updateTimeoutHBI(){
	sas_framework_timeout = new Date().getTime();
	window.top.sas_framework_timeout = sas_framework_timeout;
}
