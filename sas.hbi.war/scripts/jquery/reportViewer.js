console.clear();
$.browser = {};
$.browser.mozilla =
    /mozilla/.test(navigator.userAgent.toLowerCase()) &&
    !/webkit/.test(navigator.userAgent.toLowerCase());
$.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
$.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
//$.browser.msie - /msie/.test(navigator.userAgent.toLowerCase());
$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
var tParams = new Object();
var $sasResHTML;
var submitCondCount = 0;
var noDataMessage = "조회된 데이터가 없습니다.";
var jobOKMsg = "정상종료";
var stp_sessionid = "";
var nstp_sessionid = "";
var _thissession = "";
var save_path = "";
var isRun = 0;
var winW = $(window).width();
var TabulaRowHeaderCnt = 0;
var resizeTimer;
var rptType;
var colHeaderRowCnt;
var resSize;
var docMode = "";
// var threshold = 10000;
var threshold = 1300000;
var renderingType;
// var servlet;
var $sasExcelHTML = "";
var rMargin = 10;
var bMargin = 45;
var colWidth = 80;
var scrollWid = 16;
const mainBottomMargin = 20;
// let _STPREPORT_OUT_LAYOUT;
var isDisplayProgress = 1;
(function ($) {
    $.browser.msie = false;
    $.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        $.browser.msie = true;
        $.browser.version = RegExp.$1;
    }
    //
})(jQuery);

(function ($) {
    $.fn.setSASTable = function (sasRes) {};
})(jQuery);

$(document).ready(function () {
    if (window.location.host == "ealapd11:7980") {
        $("#banner").css("background-color", "orange");
        $("#banner").css("opacity", "0.3");
    }
    
	sortValue = $("#dvCondi").outerHeight() + 160;
	$(".none_data").css("top", sortValue + "px");

	$("#btnRun").on( "click", function() {
		submitSTP();
	});
	$("#btnExcel").bind("click", function(){exportEXCEL();});
	$("#condShowHide").click(function(){
		if ($(this).hasClass("ui-icon-circle-arrow-n")){
			condCollapseStyle();
			$("#dvCondTable").slideUp();
			setTimeout("resizeFrame()",500*1);
		} else {
			$(this).removeClass("ui-icon-circle-arrow-s");
			$(this).addClass("ui-icon-circle-arrow-n");
			$("#dvCondi").css("padding-bottom","9px");
			$("#condBottomMargin").css("height","10px");
			$("#dvCondTable").slideDown();
			setTimeout("resizeFrame()",500*1);
            if (typeof resizeGrid == "function") {
                setTimeout("resizeGrid()",500*1);
            }
		}
	});	
	$("#dvSASLogWin").on( "resize", function() {
		// console.log("dvSASLog resize occured...");
		$("#dvSASLog").height($("#dvSASLogWin").height()-20);
		$("#dvSASLog").width($("#dvSASLogWin").width());
	});
	$( "#dvSASLogWin" ).trigger( "resize" );

	$(window.document).bind( "click", function() {
		$("#dvLogoutPannel", window.top.document).hide();
	});

	execAjax("","SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/createSession(StoredProcess)", true, "checkSession", "html");
		
    $("#progressIndicatorWIP").css("left",eval(eval($(window).width()-$("#progressIndicatorWIP").width()-300)/2));
	$("#progressIndicatorWIP").css("top",eval(eval($(window).height()-$("#progressIndicatorWIP").height()-100)/2));

	$("#dvOutput").width(eval($("#dvCondi").width()+22)); 
	$("#dvTitle").width($("#dvCondi").outerWidth());
	$("#dvOutput").height(eval($(window).height()-$("#dvCondi").height()-28));
	$("#dvRes").width(eval($("#dvCondi").width()+22));
	$(".condLabelDummy").width(eval($(".condLabel").width()+1));	

	$("#dvBox").hide();
	$("#dvColumnHeader").hide();
	$("#dvRowHeader").hide();
	$("#dvData").hide();
	$("#progressIndicatorWIP").hide();
    // console.log("onLoadCollapse", onLoadCollapse);
    if (onLoadCollapse) {
        condCollapseStyle();
        $("#dvCondTable").hide();
    }
});
$(window).on("load", function () {
    // $("#btnRun").off("click");
    // $("#btnRun").on("click", function(){
    //});
    //
    checkParam(0);
});

$(window).resize(function () {
    $("#progressIndicatorWIP").css(
        "left",
        eval(
            eval($(window).width() - $("progressIndicatorWIP").width() - 300) /
                2
        )
    );
    $("#progressIndicatorWIP").css(
        "top",
        eval(
            eval($(window).width() - $("progressIndicatorWIP").height() - 300) /
                2
        )
    );
    var cs = 1;
    cdItemWidth = $(".condItem").width();
    $(".condItem").each(function () {
        if ($(this).find("td").hasClass("condLbelLF")) {
            $(this).width(1);
            cs = 0;
        } else {
            if (cs == 0) {
                $(this).css("clear", "both");
                $(this).css("float", "left");
            }
            cs++;
        }
    });
    //
    resizeFrame();
});
function checkParam(iter) {
    console.log("checkParam called!!!!");
    let isExistNull = false;
    $("select").each(function () {
        let name = $(this).attr("id");
        // name = name.substring(3);
        let value = $(this).val();
        if (value == null) {
            isExistNull = true;
            console.log("name:value", name, value);
        }
    });
    if (isExistNull && iter < 5) {
        iter++;
        setTimeout(`checkParam(${iter})`, 500);
    } else {
        $("#btnRun").prop("disabled", false);
        console.log("btnRun active!");
    }
}
function resizeFrame() {
    console.log("resizeFrame in reportViewer.js");
    //
    if (_STPREPORT_OUT_LAYOUT != "" || isOSW) {
        console.log("isOSW");
        //
        //
        //
        //
        //
    } else if (renderingType == "RAW") {
        console.log("renderingType RAW");
        winH = windw.innerHeight;
        winW = windw.innerWidth;
        // winH = $(window).height();
        condiH = $("#dvCondi").outerHeight();
        toolBarH = $("#dvToolBar").outerHeight();
        titleH = $("#dvTitle").outerHeight();
        footerH = $("#dvFooter").outerHeight();
        console.log("mainBottomMargin", mainBottomMargin);
        $("#dvRslt").height(winH - condiH - mainBottomMargin);

        adjWidth = 5;
        if (preHasScroll == undefined) {
            adjWidth = 0;
        }
        console.log("adjWidth", adjWidth);
        $("#dvRslt").width(winW - 77);
    } else {
        console.log("renderingType Table");
        index = "";
        winH = window.innerHeight;
        // winH = $(window).height();
        condiH = $("#dvCondi").outerHeight();
        toolBarH = $("#dvToolBar").outerHeight();
        titleH = $("#dvTitle").outerHeight();
        footerH = $("#dvFooter").outerHeight();
        //
        //

        $("#dvRslt").height(winH - condiH - mainBottomMargin);
        //
        //

        $("#dvOutput").width(eval(winW - 5));
        $("#dvOutput").height(eval(winH - condiH - toolBarH - titleH - 20));
        if ($.browser.msie == true) {
            rMargin = 10;
            bMargin = 45;
            if ($("#dvPagePanel").height() < 10) bMargin = 35;
        }

        $("#dvRes").height(
            eval($(window).height() - condiH - rMargin - bMargin)
        );

        // console.log("dvBox Height", $(`#dvBox${index} table`).height());
        index = "";
        let dataHeight = eval(
            $(window).height() -
                $("#dvCondi").height() -
                $("#dvColumnHeader").height() -
                20 -
                $("#dvTitle").outerHeight()
        );
        $(`#dvRowHeader${index}`).height(dataHeight);
        // console.log("dvRowHeader height", dataHeight);
        $(`#dvData${index}`).height(dataHeight);
        // console.log("dvBox Height", $(`#dvBox${index} table`).height());

        dvDataW = $(window).width() - $("#dvBox").width() - 10 - 5;
        $(`#dvColumnHeader${index}`).width(dvDataW);
        $(`#dvData${index}`).width(dvDataW);
    }
    if (typeof resizeGrid == "function") {
        //
        resizeGrid();
    }
}

function updateTimeoutHBI() {
    window.top.alertCnt = 0;
    sas_framework_timeout = new Date().getTime();
    window.top.sas_framework_timeout = sas_framework_timeout;
}
if (window.console == undefined) {
    console = { log: function () {} };
}
Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return (
        yyyy +
        "-" +
        (mm[1] ? mm : "0" + mm[0]) +
        "-" +
        (dd[1] ? dd : "0" + dd[0])
    ); // padding
};

function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0)
        // If Internet Explorer, return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
    // If another browser, return 0
    else return 0;
}
function getBrowserType() {
    var _ua = navigator.userAgent;

    /* IE7,8,9,10,11 */
    if (navigator.appName == "Microsoft Internet Explorer") {
        var rv = -1;
        var trident = _ua.match(/Trident\/(\d.\d)/i);

        if (trident != null && trident[1] == "7.0") return (rv = "IE" + 11);
        if (trident != null && trident[1] == "6.0") return (rv = "IE" + 10);
        if (trident != null && trident[1] == "5.0") return (rv = "IE" + 9);
        if (trident != null && trident[1] == "4.0") return (rv = "IE" + 8);
        if (trident == null) return (rv = "IE" + 7);

        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(_ua) != null) rv = parseFloat(RegExp.$1);
        return rv;
    }

    /* etc */
    var agt = _ua.toLowerCase();
    if (agt.indexOf("chrome") != -1) return "Chrome";
    if (agt.indexOf("opera") != -1) return "Opera";
    if (agt.indexOf("staroffice") != -1) return "Star Office";
    if (agt.indexOf("webtv") != -1) return "WebTV";
    if (agt.indexOf("beonex") != -1) return "Beonex";
    if (agt.indexOf("chimera") != -1) return "Chimera";
    if (agt.indexOf("netpositive") != -1) return "NetPositive";
    if (agt.indexOf("phoenix") != -1) return "Phoenix";
    if (agt.indexOf("firefox") != -1) return "Firefox";
    if (agt.indexOf("safari") != -1) return "Safari";
    if (agt.indexOf("skipstone") != -1) return "SkipStone";
    if (agt.indexOf("netscape") != -1) return "Netscape";
    if (agt.indexOf("mozilla/5.0") != -1) return "Mozilla";
}
function displayTime() {
    var str = "";

    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var mseconds = currentTime.getTime();

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if (hours > 11) {
        str += "PM " + mseconds;
    } else {
        str += "AM " + mseconds;
    }
    return str;
}

function getDiffDay(startDate, endDate) {
    var diffDay = 0;
    var start_yyyy = startDate.substring(0, 4);
    var start_mm = startDate.substring(5, 7);
    var start_dd = startDate.substring(8, startDate.length);
    var sDate = new Date(start_yyyy, start_mm - 1, start_dd);
    var end_yyyy = endDate.substring(0, 4);
    var end_mm = endDate.substring(5, 7);
    var end_dd = endDate.substring(8, endDate.length);
    var eDate = new Date(end_yyyy, end_mm - 1, end_dd);

    diffDay =
        Math.ceil((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)) +
        1;

    return diffDay;
}

function condCollapseStyle() {
    $("#condShowHide").removeClass("ui-icon-circle-arrow-n");
    $("#condShowHide").addClass("ui-icon-circle-arrow-s");
    $("#dvCondi").css("padding-bottom", "0px");
    $("#condBottomMargin").css("height", "0px");
}

/*
** koryhh
HBIServlet
	=> 그래프 안됨(세션 사용 불가). 인코딩 변경 적용 가능. execSTP, execSTPN
STPRVServlet
	=> 그래프 정상. 인코딩 변경 적용 불가(서버 인코딩 상속)
*/

function editLayout() {
    var objectName = new Object();
    editorURL = "/SASHBI/HBIServlet?sas_forwardLocation=editLayout";
    var style = "dialogWidth:1200px;dialogHeight:600px;resizable:yes;";
    window.open(
        editorURL,
        "HeaderEditor",
        "scrollbars=yes,menubar=no,toolbar=no,resizable=yes,width=1150,height=800,left=0,top=0"
    );
    /*
	window.showModalDialog(editorURL, objectName ,style );
	*/
}

function editHeader() {
    var objectName = new Object();
    editorURL = "/SASHBI/HBIServlet?sas_forwardLocation=headerEdit";
    var style = "dialogWidth:800px;dialogHeight:600px;resizable:yes;";
    window.open(
        editorURL,
        "HeaderEditor",
        "scrollbars=yes,menubar=no,toolbar=no,resizable=yes,width=900,height=800,left=0,top=0"
    );
    /*
	window.showModalDialog(editorURL, objectName ,style );
	*/
}

function alertMsg(msg) {
    $("#dvMsgBox").html(msg);

    $("#dvBG").show();
    $("#dvAlert").css(
        "left",
        eval(eval($(window).width() - $("#dvAlert").width() - 0) / 2)
    );
    $("#dvAlert").css(
        "top",
        eval(eval($(window).height() - $("#dvAlert").height() - 100) / 2)
    );
    $("#dvAlert").show();

    $("#dvBG").css("height", $(window).height() + "px");
    $("#dvBG").width($(window).width());
    $("#btnAlertMsgOK").focus();
}
function hideMsgBox() {
    $("#dvAlert").hide();
    $("#dvBG").hide();
}
var confirmFN = "";
function confirmMsg(msg, fn) {
    //
    //
    $("#dvConfirmMsgBox").html(msg);
    confirmFN = fn;

    $("#dvBG").show();
    $("#dvConfirm").css(
        "left",
        eval(eval($(window).width() - $("#dvConfirm").width() - 0) / 2)
    );
    $("#dvConfirm").css(
        "top",
        eval(eval($(window).height() - $("#dvConfirm").height() - 100) / 2)
    );
    $("#dvConfirm").show();

    $("#dvBG").css("height", $(window).height() + "px");
    $("#dvBG").width($(window).width());
    $("#btnConfirmMsgOK").focus();
}
function hideConfirmMsgBox(isRes, fn) {
    console.log("Confirm Res : " + isRes);
    if (isRes == true) window[fn]();
    $("#dvConfirm").hide();
    $("#dvBG").hide();
    return isRes;
}

function confirmMsg2(msg, yesCB, noCB) {
    $("#dvConfirmMsgBox2").html(msg);
    confirmDialog = $("#dvConfirm2").dialog({
        title: "Confirm",
        width: 350,
        closeText: "X",
        close: function () {
            $("#dvBG").hide();
            close();
        },
        resizeable: false,
        closeOnEscape: true,
        modal: true,
        buttons: [
            {
                text: "OK",
                class: "btn_basic",
                id: "btnDialogOK",
                click: function () {
                    yesCB();
                    $("#dvConfirm2").dialog("close");
                },
            },
            {
                text: "Cancel",
                class: "btn_basic",
                id: "btnDialogCancel",
                click: function () {
                    if (noCB != undefined) {
                        noCB();
                    } else {
                    }
                    $("#dvConfirm2").dialog("close");
                },
            },
        ],
    });
}
function alertMsg2(msg) {
    $("#dvMsgBox2").html(msg);
    confirmDialog = $("#dvAlert2").dialog({
        title: "Alert",
        width: 350,
        closeText: "X",
        close: function () {
            $("#dvBG").hide();
            close();
        },
        resizeable: false,
        closeOnEscape: true,
        modal: true,
        buttons: [
            {
                text: "OK",
                class: "btn_basic",
                id: "btnDialogOK",
                click: function () {
                    $("#dvAlert2").dialog("close");
                },
            },
        ],
    });
}
function setCookie(cName, cValue, cDay) {
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + "=" + escape(cValue) + "; path=/ ";
    //
    if (typeof cDay != "undefined")
        cookies += ";expires=" + expire.toGMTString() + ";";
    document.cookie = cookies;
}
function getCookie(cName) {
    var cookieData = document.cookie;
    cookies = cookieData.split(";");
    cookieObj = new Object();
    for (let ii in cookies) {
        cookie = cookies[ii].split("=");
        //
        cookieObj[cookie[0].replace(/ /g, "")] = cookie[1];
    }
    //
    cValue = cookieObj[cName];
    if (cValue == undefined) cValue = "";
    //
    return unescape(cValue);
}
var curGraph = "";
function savePop(objID) {
    curGraph = objID;
    console.log("objID : " + objID);

    //event.preventDefault();
    if (event.preventDefaut) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
    console.log(event);
    //console.log("pageX : " + pageX);
    $("#grPop").css("top", event.pageX + "px");
    $("#grPop").css("left", event.pageY + "px");
    $("#grPop").show();
}
function saveGraph() {
    $("#canvas").html(
        "<style>\n" + nvcss + "\n</style>\n" + $("#" + curGraph).html()
    );
    var canvas = $("#" + curGraph).find("svg")[0];
    console.log(canvas);
    try {
        svgAsDataUri(canvas, null, function (uri) {
            $("#previewGraph").html('<img src="' + uri + '" />');
        });
        saveSvgAsPng(canvas, "graph.png");
        $("#canvas").html("");
        $("#previewGraph").html("");
        $("#canvas").hide();
        $("#previewGraph").hide();
    } catch (err) {
        console.log("Error Occured : " + err);
        $("#previewGraph").html("");
    }

    $("#grPop").hide();
}
function nz(number, znum) {
    var zn = Array(znum + 1).join("0");
    var zn2 = eval(zn.length);
    var z = (zn + number).slice(-zn2);
    return z;
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > milliseconds) {
            break;
        }
    }
}
function updateTimeoutHBI() {
    sas_framework_timeout = new Date().getTime();
    window.top.sas_framework_timeout = sas_framework_timeout;
}
function checkSession(res, dataType) {
	// console.log("checkSession", res, dataType);
    var sInfo = eval(res)[0];
    nstp_sessionid = sInfo.nstp_sessionid;
    save_path = sInfo.save_path;
	_thissession = sInfo._THISSESSION;
	// console.log("_thissession", _thissession, sInfo);
}
function getSASLog() {
    var url = "/SASHBI/HBIServlet?sas_forwardLocation=getSASLog";
    var sp_URI = "";
    var isAsync = true;
    var fn = "showSASLog";
    var dataType = "html";
    execAjax(url, sp_URI, isAsync, fn, dataType); //,param1,param2);
}
function showSASLog(saslog) {
    $("#dvSASLogWin").css("top", "40px");
    //$('#dvSASLogWin').html("<h3 class='ui-widget-header dvSASLogHeader' onClick=$('#dvSASLogWin').hide();>SAS Log</h3><pre style='padding:0px 20px;'>" + saslog + "</pre>");
    $("#dvSASLog").html("<pre style='padding:0px 20px;'>" + saslog + "</pre>");
    $("#dvSASLogWin").width($("#dvCondi").width() - 40);
    $("#dvSASLogWin").css(
        "left",
        eval(eval($(window).width() - $("#dvSASLogWin").width() - 0) / 2)
    );
    $("#dvSASLogWin").height(eval($(window).height() - 100));
    $("#dvSASLog").height(eval($("#dvSASLogWin").height() - 40));
    $("#dvSASLog").width($("#dvSASLogWin").width());
    $("#dvSASLogWin").show();
    $("#dvSASLog").show();
}
function getLastDayYYYYMMDD(p_yyyymm) {
    var result = "";
    var yyyy = "";
    var mm = "";
    if (p_yyyymm == null || p_yyyymm.length == 0) {
        return result;
    }
    if (p_yyyymm.indexOf("-") > -1) {
        var tmpArr = p_yyyymm.split("-");
        yyyy = tmpArr[0];
        mm = tmpArr[1];
    } else {
        if (p_yyyymm.length >= 6) {
            var tmpStr = p_yyyymm.replace(/-/gi, "").trim();
            yyyy = tmpStr.substr(0, 4);
            mm = tmpStr.substr(4, 2);
        } else {
            return result;
        }
    }
    var lastDay = new Date(yyyy, mm, "").getDate();
    if (lastDay == null || lastDay.length == 0 || lastDay == undefined) {
        return "";
    }
    result = yyyy + mm + lastDay;
    return result.trim();
}
function getParams(param, paramsAgrs) {
    //
    if (param instanceof FormData) {
        //

        $(":text").each(function () {
            var tagid = $(this).attr("id");
            var value = $(this).val();
            if (tagid != undefined && tagid.length > 3) {
                prefix = tagid.substring(3);
                if (tagid.indexOf("_STPREPORT_") < 0) {
                    var name = tagid.substring(3);
                    var value = $(this).val();
                    param.append(name, value);
                }
            }
        });
        $("select").each(function () {
            var name = $(this).attr("id");
            if (name != undefined && name.length > 3) {
                name = name.substring(3);
                if (!multipleVars.includes(name)) {
                    var value = $(this).val();
                    var txtValue = $(this).find("option:selected").text();
                    //
                    //
                    param.append(name, value);
                    //
                }
            }
        });
        for (ii in multipleVars) {
            var mVarNM = multipleVars[ii];
            var multi = $("#slt" + mVarNM).val() || [];
            var mCount = multi.length;
            for (var jj = 0; jj < multi.length; jj++) {
                pName = mVarNM + eval(jj + 1);
                param.append(pName, multi[ii]);
            }
            param.append(mVarNM + "0", mCount);
        }

        param.append("_REPORT_NAME", encodeURIComponent(_REPORT_DESC));
        param.append("save_path", save_path);
        //
        //
    } else if (typeof param === "object") {
        $(":text").each(function () {
            var tagid = $(this).attr("id");
            var value = $(this).val();
            //
            if (tagid != undefined && tagid.length > 3) {
                prefix = tagid.substring(3);
                if (tagid.indexOf("_STPREPORT_") < 0) {
                    var name = tagid.substring(3);
                    var value = $(this).val();
                    param[name] = value;
                    //
                }
            }
        });
        $("select").each(function () {
            var name = $(this).attr("id");
            if (name != undefined && name.length > 3) {
                name = name.substring(3);
                if (!multipleVars.includes(name)) {
                    var value = $(this).val();
                    var txtValue = $(this).find("option:selected").text();
                    param[name] = value;
                    param[name + "_txt"] = txtValue;
                    //
                }
            }
        });
        // console.log("multipleVars", multipleVars);
        for (ii in multipleVars) {
            var mVarNM = multipleVars[ii];
            var multi = $("#slt" + mVarNM).val() || [];
            var mCount = multi.length;
            var values = $(`#slt${mVarNM}`).val();
            // console.log("values", values);
            // console.log("mVarNM", $("#slt" + mVarNM).val());
            // console.log("mVarNM : multi", mVarNM, multi, mCount);
            for (var jj = 0; jj < multi.length; jj++) {
                pName = mVarNM + eval(jj + 1);
                console.log("pName", pName);
                if (mCount == 1){
                    param[mVarNM] = multi[jj];
                } else {
                    param[pName] = multi[jj];
                }
            }
            if (mCount > 1) param[mVarNM + "0"] = mCount;
            //
        }
        //
        //
        for (var ii = 0; ii < paramsAgrs.length; ii++) {
            param["param" + eval(ii + 1)] = paramsAgrs[ii];
        }
        //

        chkObj = new Object();
        preObjname = "";
        $("#dvCondTable :checkbox").each(function () {
            objname = $(this).attr("id");
            if (objname != preObjname) {
                ii = 1;
            } else {
                ii++;
            }
            iptVal = $(this).val();
            isChk = $(this).is(":checked");
            if (isChk) {
                if (chkObj[objname] == undefined) {
                    chkObj[objname] = 1;
                } else {
                    chkObj[objname] = chkObj[objname] + 1;
                }
                param[objname + ii] = iptVal;
            }
            preObjname = objname;
            //
        });
        // console.log("chkObj", chkObj);
        for (ii in chkObj) {
            //
            param[ii + "0"] = chkObj[ii];
        }

        param.save_path = save_path;
        param._REPORT_NAME = _REPORT_DESC;
        //
        //
    }
    // console.log("rowsPerPage", rowsPerPage, pagenum);
    if ( rowsPerPage > 0) param.pagenum = pagenum;
    // console.log("param in getParams", param);
    return param;
}



function getParamVal(sp_URI, tableName, colName, target, libStmt, ...params) {
    // console.log("target at getParamVal", target);
    updateTimeoutHBI();
    submitCondCount++;
    isAsync = true;
    if (params[7] == "false") isAsync = false;
    //console.log("getParamVal Started:"+displayTime());
    /*
		param1 : whereStatements
		param2 : column sortOrder
		param3 : label column ID
		param4 : label column sortOrder
		param5 : formated value(isValueDisplayed)
		param6 : default Value
		param7 : isRequired (전체)
	*/
    if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();

    var param = {
        _program: sp_URI,
        _result: "STREAMFRAGMENT",
        libStmt: libStmt,
        tableName: tableName,
        colName: colName,
        target: target,
        winW: winW,
    };
    //

    var paramCount = Object.keys(tParams).length;
    for (ii = 0; ii < paramCount; ii++) {
        param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
    }

    //
    param = getParams(param, params);
    //

    var chkParam = 0;
    var whT = params[0].split(":");
    // console.log("whT", whT);
    if (params[0] != "") {
        for (wVar in whT) {
            var wh_var = whT[wVar].split("=")[0];
            var wh_val = whT[wVar].split("=")[1];
            // console.log("wVar : " + wh_var + ":" + wh_val);
            if (param[wh_val] == undefined && wh_var != "") {
                chkParam++;
            }
        }
    }
    // console.log("whT length", whT.length);
    if (chkParam > 0 && whT.length == 1 ) {
        console.log("chkParam : Parameter not set count", chkParam);
        return;
    }

    $.ajax({
        // url: "/SASHBI/HBIServlet?sas_forwardLocation=getParams",
        url: "/SASStoredProcess/do?",
        data: param,
        dataType: "html",
        cache: false,
        async: isAsync,
        beforeSend: function () {
            isRun = 1;
            if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();
        },
        complete: function (data) {
            // console.log("result of getParamVal", data);
            isError = data.responseText.substring(0,5);
            // console.log("isError", isError);
            if (isError == "ERROR") {
                $("#progressIndicatorWIP").hide();
                return;
            }
            $("#dvDummy").hide();
            $("#dvDummy").html(data.responseText);
            tObjName = "slt" + target;
            // console.log("params in getParamVal", params);
            if (params[6] == "false") {
                //if (param7 == "false" && param8 != "chk"){
                // $(`#${tObjName} option`).remove();
                $(`#${tObjName}`).prepend("<option value=''>전체</option>");
            } else {
                try {
                    chgFn = "onChange_" + target + "()";
                    chgFnName = "onChange_" + target;
                    //console.log("chgFnName : " + chgFnName);
                    eval(chgFn);
                } catch (err) {}
            }
            if (params[5] != "") {
                tObjName = "slt" + target;
                $("#" + tObjName)
                    .val(params[5].trim())
                    .prop("selected", true);
                try {
                    chgFn = "onChange_" + target + "()";
                    chgFnName = "onChange_" + target;
                    eval(chgFn);
                } catch (err) {}
            } else {
                $("#" + tObjName + " option:eq(0)").prop("selected", true);
            }
            $("#progressIndicatorWIP").hide();
            isRun = 0;
        },
    });
}
let preHasScroll;
function getMain() {
    console.log("getMain Started:" + displayTime());
    $("#dvTilte").show();
    $("#dvTitleButtons").show();
    //
    //
    if (showAddRow == "1") {
        $("#btnAddRow").show();
        //
    } else {
        $("#btnAddRow").hide();
        //
    }
    isAddRowVisible = $("#btnAddRow").is(":visible");
    isAddRowCustVisible = $("#btnAddRowCust").is(":visible");
    if (isAddRowCustVisible) {
        $("#btnAddRowCust").show();
    } else {
        $("#btnAddRowCust").hide();
    }
    console.log("AddRow : ", isAddRowVisible, isAddRowCustVisible);
    if (isAddRowVisible == false && isAddRowCustVisible == false) {
        $("#dvTitleButton").hide();
    }

    $("#dvPagePanel").show();
    var userDefHeader = $("#dvUserHeader").html();
    $sasResHTML = "";

    updateTimeoutHBI();
    if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();

    // if (rowsPerPage > 0 == 1) pagenum = $("#pageum").val();

    $sasResHTML = execSTP(spPathUrl, "", "", "", "");           // koryhh
    

    if (typeof $sasResHTML != "undefined") {
        rptType = orgRptType;
    } else {
        return;
    }

    let resSize = $sasResHTML.length;
    console.log("SASHTML resSize", resSize);

    if (resSize < 10) {
        alertMsg2(
            "실행 결과가 출력되지 않았습니다.\n 관리자에게 문의하시기 바랍니다."
        );
        return;
    } else if (resSize < 200) {
        $("#dvOutput").hide();
        return;
    }

    $sasExcelHTML = $("#dvRes").html();
    var summary = $("#dvRes .table").attr("summary");
    //
    if (typeof summary != "undefined") {
        var summArray = summary.split(" ");
        //
        var procedure = summArray[1].replace(":", "");
        //
        //
        rptType = procedure;
    }
    if ($("#dvRes map").length > 0) rptType = "Graph";
    var ErrorHTML = $("#SASLog").html();
    var debugMSG = $("#dvRes div:last").html();
    var Contents = "";
    $("#dvRes .branch").each(function (index) {
        Contents = Contents + $(this).html();
    });
    if (typeof ErrorHTML != "undefined") {
        $("#progressIndicatorWIP").hide();
        var ErrorTitle = $("#dvRes .solutionsErrorTitle").html();
        if (isDebug == "true") {
            $("#dvRes").html(ErrorTitle + ErrorHTML);
        } else {
            $("#dvRes").html(ErrorTitle + "\n 관리자에게 문의하시기 바랍니다.");
        }
        bMargin = 30;
        rMargin = 10;
        var dvCondiHeight = $("#dvCondi")
            .css("height")
            .substring(0, $("#dvCondi").css("height").length - 1);
        $("#dvRes").css("width", eval($(window).width() - rMargin) + "px");
        $("#dvRes").css(
            "height",
            eval($(window).height() - dvCondiHeight - bMargin) + "px"
        );
        $("#dvRes").show();
        return;
    } else if (typeof Contents != "undefined") {
        $sasResHTML = Contents;
    }
    console.log("rptType", rptType);

    $orgHead = $("#dvRes thead").clone();
    if ($("#dvUserHeader").html().length > 10) {
        $userHeader = $("#dvUserHeader tbody").html();
        $("#dvRes thead").html($userHeader);
    }

    var dvResRows = $("dvRes .table tbod tr").length;
    var branchNum = $("#dvRes .branch").length;
    var isPaging = $("#dvRes .dvPagePanel").length;
    if (isPaging > 0) barnchNum = 1;

    console.log("resSize", resSize);
    console.log("threshold", threshold, resSize > threshold);
    console.log(
        "OrgRsltWidth",
        $("#dvRslt").width(),
        $("#dvRslt").outerHeight()
    );
    if (
        (resSize > threshold || branchNum > 1) &&
        orgRptType != "GraphTable" &&
        orgRptType != "2GraphTable"
    ) {
        console.log("Rendering case1", rptType);
        renderingType = "RAW";
        //
        //
        orgRsltWidth = $("#dvRslt").width();

        $("#dvRslt").html($("#dvRes").html());
        $("#dvRslt").css("overflow", "scroll");

        let maxWidth = $("#dvRslt").innerWidth() - 50;
        //

        //

        $("#dvRslt").width(1000000);
        $("#dvRslt .branch .table").each(function () {
            tblWidth = $(this).width();
            maxWidth = tblWidth > maxWidth ? tblWidth : maxWidth;
            //
            //
            //
        });

        //

        if (maxWidth > orgRsltWidth) {
            $("#dvRslt .branch").width(maxWidth);
        }

        //

        $(".branch div").removeAttr("align");
        $("#dvRslt .branch").css("text-align", "left");
        $("#dvRslt .branch").css("margin-bottom", "30px");

        //
        curHasScroll =
            $("#dvRslt").height() == $("#dvRslt").get(0).scrollHeight
                ? false
                : true;
        //
        adjWidth = 5;
        if (preHasScroll == undefined) {
            adjWidth = 0;
        }
        //
        // $("#dvRslt").width(orgRsltWidth + adjWidth);
        $("#dvRslt").width($(window).width());


        if (rowsPerPage > 0) {
            pagePanelLeft = ($(window).width() - $(".dvPagePanel").width())/2;
            // console.log("pagePanelLeft", $(window).width(), $(".dvPagePanel").width(), pagePanelLeft);
            $(".dvPagePanel").css("left", pagePanelLeft);
        }

        $("#dvRslt").scroll(function(){
            if (rowsPerPage > 0) {
                pagePanelLeft = ($(window).width() - $(".dvPagePanel").width() )/2;
                // console.log("pagePanelLeft", $(window).width(), $(".dvPagePanel").width(), pagePanelLeft);
                $(".dvPagePanel").css("left", pagePanelLeft + $(this).scrollLeft());
            }

        });
        //
        $("#dvRslt hr").remove();
        $("#dvRslt br").remove();

        $("#dvRes").html("");
        $("#dvRes").hide();
        //
        preHasScroll = curHasScroll;
    } else if (branchNum == 1 && (rptType == "" || rptType == "Graph")) {
        console.log("Rendering case2");
        renderingType = "GraphTable";
        $("#dvRes").show();
        $("#dvTitle").hide();
    } else {
        console.log("Rendering case3", rptType);
        renderingType = "Tabular";
        var title = $("#dvRes .systitleandfootercontainer").html();
        // console.log("title", title);
        if (title != undefined) {
            $("#dvTitle").show();
            $("#dvSystemTitle").html("<table width=100%" + title + "</table>");
            $("#dvSystemTitle").show();
        }

        if (rptType == "Print") {
            renderListTable();
        } else if (rptType == "Tabulate") {
            renderTabular();
        } else {
            console.log("rptType", rptType);
            $("#dvRslt").hide();
            $("#dvRes").show();
            resHeight = eval($(window).height() - $("#dvCondi").height() - 30);
            $("#dvRes").height(resHeight);
        }
    }
    console.log("End of getMain");
}
function renderListTable() {
    console.log("renderListTable start!!!!");
    $("#dvRes").width(50000);
    $("#dvColumnHeader").width(50000);
    $("#dvData").width(50000);
    $("#dvRes").show();

    $("#dvColumnHeader").css("overflow-y", "hidden");
    $("#dvRowHeader").css("overflow-x", "hidden");

    $("#dvBox").show();
    $("#dvColumnHeader").show();
    $("#dvRowHeader").show();
    $("#dvData").show();

    $("#dvBox").width(0);
    $("#dvRowHeader").width(0);

    $("#dvRowHeader").height(100);
    $("#dvData").height(100);

    let rowHeaderWidth = 0;
    let boxHeight = 0;
    let columnHeaderWidth = 0;
    let columnHeaderHeight = 0;
    let frozenColumn = 0;
    let $columnHeader = "<table class=table cellspacing=0 cellpadding=5 rules=all frame=box><thead>";
    $columnHeader += $("#dvRes table thead ").html() + "</thead></table>";

    let $tbData = "<table class=table cellspacing=0 cellpadding=5 rules=all frame=box>";
    $tbData += "<thead>" + $("#dvRes .table thead ").html() + "</thead>";
    $tbData += "<tbody>" + $("#dvRes .table tbody ").html() + "</tbody></table>";
    $("#dvData").html($tbData);
    // console.log("tbData", $tbData);

    $("#dvRes tbody tr:first .rowheader").each(function () {
        rowHeaderWidth += $(this).width();
        frozenColumn++;
    });
    console.log("frozenColumn", frozenColumn);
    //

    $("#dvColumnHeader").html($columnHeader);
    console.log("$columnHeader", $columnHeader);

    if (frozenColumn > 0) {
        for (ii = 0; ii < frozenColumn; ii++) {
            $("#dvData th:eq(" + ii + ")").remove();
        }

        $("#dvBox").html($columnHeader);
        let $rowHeader = "<table class=table cellspacing=0 cellpadding=5 rules=all frame=box>";
        $rowHeader += $("#dvRes table tbod ").html() + "</table>";
        $("#dvRowHeader").html($rowHeader);
        $("#dvRowHeader .data").remove();

        $("#dvBox").width(rowHeaderWidth + 1);
        $("#dvRowHeader").width(rowHeaderWidth + 1);
        //

        if (frozenColumn == 1 && $("#dvBox th:eq(0)").html() == "OBS") {
            const lPanel = $("#dvRowHeader table").width();
            $("#dvBox").width(lPanel + 1);
            $("#dvRowHeader").width(lPanel + 1);
        }

        $("#dvBox th:gt(" + eval(frozenColumn - 1) + ")").remove();
        $("#dvColumnHeader th:lt(" + frozenColumn + ")").remove();
        $("#dvData .rowheader").remove();

        let boxColNO = 0;
        $("#dvBox tbody tr:first th").each(function () {
            boxHeadCellWidth = $(this).width();
            $("dvRowHeader th:eq(" + boxColNO + ")").width(boxHeadCellWidth);
            boxColNO++;
        });

        $("#dvColumnHeader").css("overflow-y", "scroll");
        $("#dvRowHeader").css("overflow-x", "scroll");
        $("#dvData").css("overflow", "scroll");
    }

    $("#dvColumnHeader th").each(function () {
        // columnHeaderWidth += $(this).width() + 15;
        columnHeaderWidth += $(this).outerWidth();
    });
    $("#dvColumnHeader table").width(columnHeaderWidth);
    $("#dvData table").width(columnHeaderWidth);

    let dataLengthInfo = new Object();
    let dataColNO = 0;
    $("#dvData th").each(function () {
        if (dataLengthInfo[dataColNO] == undefined)
            dataLengthInfo[dataColNO] = new Object();
        dataLengthInfo[dataColNO].resHeader = $(this).width();
        
        if ($("#dvUserHeader").html().length > 10) {

        } else {
            $("#dvColumnHeader th:eq(" + dataColNO + ")").width($(this).width());
        }
        //
        dataColNO++;
    });


    dataColNo = 0;
    $("#dvColumnHeader tbody tr:first th").each(function () {
        columnHeadCellWidth = $(this).width();
        dataCellWidth = $("#dvData td:eq(" + dataColNO + ")").width();

        if (dataLengthInfo[dataColNO] == undefined)
            dataLengthInfo[dataColNO] = new Object();
        dataLengthInfo[dataColNO].header = columnHeadCellWidth;
        dataLengthInfo[dataColNO].body = dataCellWidth;

        $("#dvData td:eq(" + dataColNO + ")").width(columnHeadCellWidth);

        dataColNO++;
    });
    if ($("#dvUserHeader").html().length > 10) {
        $("#dvData thead").html($("#dvColumnHeader thead").html());
        // $("#dvData th").hide();
    } else {
        $("#dvData thead").html($("#dvColumnHeader thead").html());
        // $("#dvData th").hide();
    } 

    let dataHeight = eval(
        $(window).height() -
            $("#dvCondi").height() -
            $("#dvColumnHeader").height() -
            $("#dvTitle").height() -
            40
    );
    $("#dvRowHeader").height(dataHeight);
    $("#dvColumnHeader").width(
        eval($(window).width() - $("#dvBox").width() - scrollWid - 10)
    );
    console.log("dvColumnHeader Width : ", eval($(window).width() - $("#dvBox").width() - scrollWid - 10) );
    $("#dvData").width($(window).width() - $("#dvBox").width() - 10);
    $("#dvData").height(dataHeight);

    $("#dvRes").hide();
    
    $("#dvColumnHeader tbody").html($("#dvData table tbody").html());
    $("#dvData thead th").html("");
    $("#dvData thead").css("height","0px");
    // $("#dvData thead th").css("padding","0px 0px");
    $("#dvData thead th").css("padding-top","0px");
    $("#dvData thead th").css("padding-bottom","0px");
    // $("#dvData thead th").css("border","0px");

    $("#dvData").scroll(function () {
        if ($(this).scrollTop() < $("#dvData thead").height()) {
            //
        }
        dataScrollLeft = $(this).scrollLeft();
        $("#dvColumnHeader").scrollLeft($(this).scrollLeft());
        // console.log("scrollLeft", $(this).scrollLeft(), $("#dvColumnHeader").scrollLeft() );
        $("#dvRowHeader").scrollTop($(this).scrollTop());
        if ($(this).scrollLeft() > $("#dvColumnHeader").scrollLeft()) {
            // $(this).scrollLeft($("#dvColumnHeader").scrollLeft());
        }
    });

    if (resSize < threshold) {
        $("#dvData tr:odd").find("td").addClass("dataStripe");
        $("#dvData tr").mouseover(function () {
            $(this).find("td").addClass("curRow");
        });
        $("#dvData tr").mouseout(function () {
            $(this).find("td").removeClass("curRow");
        });
    }
}
function renderTabular() {
    console.log("renderTabular start!!");
    index = "";
    $("#dvRes").width(1000000);
    $("#dvRes").show();

    resTableW = $("#dvRes .table").outerWidth();
    console.log("resTableW", resTableW);
    if (resTableW == undefined) return;

    //

    $("#dvBox").show();
    $("#dvColumnHeader").show();
    $("#dvRowHeader").show();
    $("#dvData").show();

    //
    //
    //
    //

    //
    //
    //
    //

    let rowHeaderWidth = 0;
    let boxHeight = 0;
    let columnHeaderWidth = 0;
    let columnHeaderHeight = 0;

    console.log("userDefHeader", $("#dvUserHeader").html());
    console.log("userDefHeader", $("#dvUserHeader").html().replace(/\s/g, "").startsWith("null"));
    let $columnHeader = `<table class=table cellspacing=0 cellpadding=5 rules=all frame=box style="width:${resTableW}px">`;
    const hasUserDefinedHeader = $("#dvUserHeader").html().replace(/\s/g, "").startsWith("null");
    if (hasUserDefinedHeader){
        $columnHeader += "<thead>" + $("#dvRes .table thead ").html() + "</thead></table>";
        $(`#dvBox${index}`).html($columnHeader);
        $(`#dvBox${index} th:gt(0)`).remove();
    } else {
        let boxHeaderText = "";
        let columnHeaderText = "";
        // elTH = document.querySelectorAll("th");
        elTH = $("#dvUserHeader tr:first th");
        console.log("elTH", elTH);
        for (el in elTH) {
            console.log("el", elTH[el].role, elTH[el].outerHTML);
            if (elTH[el].role == "box") {
                boxHeaderText += elTH[el].outerHTML;
            }
        }
        $boxHeader = "<table class=table cellspacing=0 cellpadding=5 rules=all frame=box><thead><tr>";
        $boxHeader += boxHeaderText + "</tr></thead></table>";
        console.log("dvRes", $("#dvRes .table thead ").html());
        console.log("role=box", $("#dvRes th[role=box]"));
        $("#dvRes th[role=box]").each(function(index){
            console.log("index", index);
            $(this).remove();
        });
        dvRes = document.getElementById("dvRes");
        console.log("role=box", dvRes, typeof dvRes);
        $columnHeader += "<thead><tr>" + $("#dvRes .table thead ").html() ;
        $columnHeader += "</tr></thead></table>";
        console.log("$columnHeader", $columnHeader);
        $(`#dvBox${index}`).html($boxHeader);
    }
    $(`#dvBox${index} table`).css("border-bottom-width", "0px");
    $(`#dvBox${index} table`).css("border-right-width", "2px"); // ????
        

    let $rowHeader = "<table id=rowHeaderTable classs=table cellspacing=0 cellpadding=5 rules=all frame=box>";
    $rowHeader += $("#dvRes .table tbody ").html() + "</table>";
    $(`#dvRowHeader${index}`).html($rowHeader);
    $(`#dvRowHeader${index} .data`).remove();

    $rowHeaderTable = document.getElementById("rowHeaderTable");
    console.log("$rowHeaderTable", $rowHeaderTable);

    $(`#dvColumnHeader${index}`).html($columnHeader);
    console.log("hasUserDefinedHeader", hasUserDefinedHeader);
    if (hasUserDefinedHeader) $(`#dvColumnHeader${index} th:eq(0)`).remove();

    let $tbData = `<table id=dataTable class=table cellspacing=0 cellpadding=5 rules=all frame=box style="width:${resTableW}px">`;
    $tbData += "<thead>" + $("#dvRes .table thead ").html() + "</thead>";
    $tbData +=
        "<tbody>" + $("#dvRes .table tbody ").html() + "</tbody></table>";
    //
    $(`#dvData${index}`).html($tbData);
    $(`#dvData${index} .rowheader`).remove();
    $(`#dvData${index} table thead th:first`).remove();
    $(`#dvData${index} table thead th`).css("padding-top", "0px");
    $(`#dvData${index} table thead th`).css("padding-bottom", "0px");

    $(`#dvColumnHeader${index} table`).append(
        "<tbody>" + $(`#dvData${index} table tbody`).html() + "</tbody>"
    );
    $(`#dvColumnHeader${index}`).height(
        $(`#dvColumnHeader${index} table thead`).height() + 2
    ); // header edit

    $dataTable = document.getElementById("dataTable");
    //

    $(`#dvData${index} table thead th`).each(function () {
        $(this).html("");
    });
    $(`#dvData${index} table thead tr`).height(0);
    $(`#dvData${index} table thead th`).height(0);

    columnHeaderHeight = $(`#dvColumnHeader${index} table thead`).height();
    console.log("columnHeaderHeight", columnHeaderHeight);

    //

    $("#dvRes tbody tr:first .rowheader").each(function () {
        rowHeaderWidth += $(this).width() + 15;
    });
    // rowHeaderWidth += 1;
    console.log("rowHeaderWidth", rowHeaderWidth);
    $(`#dvBox${index}`).width(rowHeaderWidth);

    $(`#dvData${index} thead .header`).css("border-color", "#f2f2f2");
    $(`#dvData${index} thead tr:last .header`).css(
        "border-bottom-color",
        "#B0B7BB"
    );
    $(`#dvData${index} thead tr:first th`).each(function () {
        rs = $(this).attr("rowspan");
        if (rs != undefined && rs > 1) {
            $(this).css("border-bottom-color", "#B0B7BB");
        }
    });

    let dataHeight = eval(
        $(window).height() -
            $("#dvCondi").height() -
            $(`#dvColumnHeader${index}`).height() -
            $("#dvTitle").outerHeight() -
            30
    );
    console.log(
        "dataHeight",
        $("#dvCondi").height(),
        $(`#dvColumnHeader${index}`).height(),
        $("#dvTitle").height()
    );
    console.log("dvRowHeader Height", dataHeight);

    $(`#dvRowHeader${index}`).height(dataHeight);
    $(`#dvRowHeader${index}`).width(10000);
    rowHeaderTableW = $(`#dvRowHeader${index} table`).width();
    $(`#dvRowHeader${index}`).width(rowHeaderTableW);
    console.log("rowHeaderTableW", rowHeaderTableW);
    console.log("rowHeaderTableW", $(`#dvRowHeader${index}`).width());

    // $(`#dvBox${index} table`).height(columnHeaderHeight);
    $(`#dvBox${index} table`).css(
        "height",
        eval(columnHeaderHeight + 2) + "px"
    );
    $(`#dvBox${index}`).height(columnHeaderHeight + 2); // header edit
    console.log("columnHeaderHeight", columnHeaderHeight);
    console.log("object", $(`#dvBox${index} table`).height());
    $(`#dvBox${index}`).width($(`#dvRowHeader${index}`).width() - 1);
    $(`#dvBox${index} table`).width($(`#dvRowHeader${index}`).width());

    $(`#dvBox${index} table`).width($(`#dvBox${index}`).width());

    if (!hasUserDefinedHeader) {
        $(`#dvRowHeader${index} tr:first th`).each(function(colIdx){
            $(`#dvBox${index} table th:eq(${colIdx})`).width($(this).width());
            console.log("$(this).width()", $(this).width());
            console.log("object", $(`#dvBox${index} table th:eq(${colIdx})`).width());
        })
    }

    rowHeaderHeight = $(`#dvRowHeader${index}`).height();
    columnHeaderWidth = $(`#dvColumnHeader${index}`).width();
    console.log("columnHeaderWidth", columnHeaderWidth);
    $(`#dvData${index}`).height(dataHeight);
    //
    console.log("window.innerWidth");
    console.log("rowHeaderWidth", rowHeaderWidth);
    //
    // dvDataW = $(window).width() - $("#dvBox").width() - 10 - 65;
    dvDataW = $(window).width() - $("#dvBox").width() - 10 - 5;
    console.log("dvDataW", dvDataW);

    $(`#dvColumnHeader${index}`).width(dvDataW);
    // $(`#dvColumnHeader${index}`).css("width", dvDataW + "px");
    $(`#dvData${index}`).width(dvDataW);
    $(`#dvColumnHeader${index}`).css("overflow-y", "scroll");
    $(`#dvRowHeader${index}`).css("overflow-y", "hidden");
    $(`#dvRowHeader${index}`).css("overflow-x", "scroll");
    $(`#dvData${index}`).css("overflow-x", "scroll");
    $(`#dvData${index} table`).css("border-top-width", "1px");

    //

    dataHeight = $(`#dvData${index} table tbody`).height();
    dataWidth = $(`#dvRes table`).width();
    dvDataHeight = $(`#dvData${index}`).height();
    dvDataWidth = $(`#dvRes`).width();

    if (dataHeight < dvDataHeight) {
        $(`#dvData${index}`).append("<div class=dvDataFooter></div>");
        $(`#dvRowHeader${index}`).append("<div class=dvDataFooter></div>");
    }
    $(".dvDataFooter").height(eval(dvDataHeight - dataHeight + 30));

    //
    //
    //
    //
    dvDataHeadH = $(`#dvData${index} thead`).height() + 0;
    //
    $(`#dvData${index}`).scrollTop(dvDataHeadH);
    $(`#dvData${index}`).scroll(function () {
        if ($(this).scrollTop() < dvDataHeadH) {
            $(this).scrollTop(eval(dvDataHeadH));
        }
        $(`#dvColumnHeader${index}`).scrollLeft($(this).scrollLeft());
        $(`#dvRowHeader${index}`).scrollTop($(this).scrollTop() - dvDataHeadH);
        if ($(this).scrollLeft() > $(`#dvColumnHeader${index}`).scrollLeft()) {
            $(this).scrollLeft($(`#dvColumnHeader${index}`).scrollLeft());
        }
        //
    });
    //
    $(`#dvRowHeader${index}`).scroll(function () {
        $(this).scrollLeft(0);
    });
    $(`#dvColumnHeader${index}`).scroll(function () {
        $(this).scrollTop(0);
    });
    console.log("call resizeFrame after renderTabluar");

    $("#dvData tr:odd").find("td").addClass("dataStripe");
    $("#dvData tr").mouseover(function () {
        $(this).find("td").addClass("curRow");
    });
    $("#dvData tr").mouseout(function () {
        $(this).find("td").removeClass("curRow");
    });

    console.log("object", $(`#dvBox${index} table`).height());
    $("#dvRes").hide();
    // resizeFrame();
}

function execSTP(sp_URI, tableName, colName, target, libStmt, ...params) {
    /*
		param1 : whereStatements
		param2 : column sortOrder
		param3 : label column ID
		param4 : label column sortOrder
	*/
    updateTimeoutHBI();
    if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();
    var param = {
        _program: sp_URI,
        _result: "STREAMFRAGMENT",
		// _sessionid: nstp_sessionid,
        libStmt: libStmt,
        tableName: tableName,
        colName: colName,
        target: target,
        _REPORT_NAME: _REPORT_DESC,
        windw: winW,
    };

    param = getParams(param, params);
	console.log("_thissession", _thissession);
	console.log("servlet", servlet);
    if (servlet == "HBI") {
        url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTP";
    } else {
        url = "/SASHBI/STPRVServlet?sas_forwardLocation=execSTP";
        url = "/SASStoredProcess/do";
    }
    $sasResHTML = $.ajax({                                          // koryhh
        url: url,
        // url: _thissession,
        // url: "/SASStoredProcess/do",
        data: param,
        dataType: "json",
        async: false,
        beforeSend: function () {
            if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();
        },
    }).responseText;
    $sasResHTML = $sasResHTML.replace(/<style[^>]*>(.|\n)*<\/style>/g, "");
    $("#progressIndicatorWIP").hide();
    $("#dvRes").html($sasResHTML);
    // console.log("$sasResHTML : "+ $sasResHTML);
    var hasError = $("#dvRes .solutionsErrorTitle").html();
    var isSASLog = $sasResHTML.substring(0, 80).split("\n").reverse();
    var isErr2 = isSASLog[0];
    resSize = $sasResHTML.length;

    if (resSize > threshold) {
        //console.log("esSize > threshold : " + resSize);

        $("#dvRes").show();

        // $sasResHTML 리턴함으로 getMain에서 처리
        //$sasExcelHTML=$sasResHTML;
        return $sasResHTML;
    }

    if (resSize < 1) {
        msg =
            "<html><body><img src='/SASTheme_default/themes/default/images/MessageError24.gif' border=0>";
        msg += "Stored Process Error<br>";
        if (isDebug == "true") msg += "<xmp>" + $sasResHTML + "</xmp>";
        $("#dvRes").html(msg);
        $("#dvRes").show();
        //
        console.log("execSTP resSize", resSize);
        alertMsg2("조회된 데이터가 없습니다.");
        return;
    } else if (
        typeof hasError == "undefined" &&
        isErr2 != "<h1>Stored Process Error</h1>"
    ) {
        console.log("undefined && isErr2 ne Stored Process Error");
        return $sasResHTML;
    } else if (isErr2 == "<h1>Stored Process Error</h1>") {
        if (isDebug == "true")
            $("#dvRes").html("<xmp>" + $sasResHTML + "</xmp>");
        $("#dvRes").show();
        //console.log("dvRes:"+$("#dvRes").html()+":" + $sasResHTML.length);
        return;
    } else if (hasError.length > 10) {
        $("#dvRes").show();
        $ErrorTitle = $("#dvRes .solutionsErrorTitle").clone();
        $LogLines = $("#dvRes .solutionsSmallItem").clone();
        // console.log("LogLines:"+$LogLines.html());
        $SASLog = $("#SASLog").clone();
        //console.log("SASLog:"+$SASLog);
        //console.log("SASLog:"+$SASLog.html());
        var beSASLog = $SASLog.html();
        if (beSASLog == undefined) {
            $SASLog = $("#dvRes div:last").clone();
        }
        if (isDebug == "true") {
            $("#dvRes").html(
                $ErrorTitle.html() + $LogLines.html() + $SASLog.html()
            ); //$("#dvRes").html($ErrorTitle.html()+ "\n - 관리자에게 문의하시기 바랍니다.");
        } else {
            $("#dvRes").html(
                $ErrorTitle.html() + "\n - 관리자에게 문의하시기 바랍니다."
            );
        }
        var dvCondiHeight = $("#dvCondi").height(); //css("height").substring(0,$("#dvCondi").css("height").length-2);
        // 아래 두줄 20140522 주석 다시 해제 dvRes Height 가 최대로 늘어남.... 20140610
        $("#dvRes").width(eval($("#dvCondi").width() + 40 - rMargin));
        $("#dvRes").height(eval($(window).height() - dvCondiHeight - bMargin));
        $("#dvRes").css("overlay", "scroll");
        //console.log("dvRes width:" + $("#dvRes").width());
        //console.log("dvRes height:" + $("#dvRes").height());

        //resizeFrame();
        return;
    } else {
        //$("#dvRes").html("");
        return $sasResHTML;
    }
}
function execSTPA(sp_URI, fn, ...params) {
    updateTimeoutHBI();
    if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();
    var param = {
        _program: sp_URI,
        _result: "STREAMFRAGMENT",
        _REPORT_NAME: _REPORT_DESC,
        save_path: save_path,
        windw: winW,
    };
    param = getParams(param, params);
    // console.log("param", param);

    var paramCount = Object.keys(tParams).length;
    for (ii = 0; ii < paramCount; ii++) {
        param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
    }

    if (servlet == "HBI") {
        url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTPN";
    } else {
        url = "/SASHBI/STPRVServlet?sas_forwardLocation=execSTP";
        url = "/SASStoredProcess/do";
    }
    $.ajax({
        url: url,       // "/SASHBI/HBIServlet?sas_forwardLocation=execSTPN",
        type: "post",
        data: param,
        dataType: "json",
        async: true,
        beforeSend: function () {
            isRun = 1;
            if (isDisplayProgress == 1) {
                $("#progressIndicatorWIP").show();
            }
        },
        success: function (data) {
            if (typeof eval(fn) != "function")
                console.log("callback function name", fn, "Not Exist!!!");
            window[fn](data);
        },
        complete: function (data) {
            isRun = 0;
            $("#progressIndicatorWIP").hide();
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:xhr:error: ", status, xhr, error);
            if (xhr.responseText == "")
                alertMsg2("조회된 데이터가 없습니다.");
        },
    });
}
function execSTPS(sp_URI, ...params) {
    updateTimeoutHBI();
    if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();
    var param = {
        _program: sp_URI,
        _result: "STREAMFRAGMENT",
        _REPORT_NAME: _REPORT_DESC,
        save_path: save_path,
        windw: winW,
    };
    param = getParams(param, params);
    //

    var paramCount = Object.keys(tParams).length;
    for (ii = 0; ii < paramCount; ii++) {
        param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
    }

    if (servlet == "HBI") {
        url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTP";
    } else {
        url = "/SASHBI/STPRVServlet?sas_forwardLocation=execSTP";
        url = "/SASStoredProcess/do";
    }
    var resData = $.ajax({
        url: url, //"/SASHBI/HBIServlet?sas_forwardLocation=execSTP",
        type: "post",
        data: param,
        dataType: "json",
        async: false,
    }).responseText; //$("#progressIndicatorWIP").hide();
    return resData;
}
function execSTPH(sp_URI, fn, ...params) {
    updateTimeoutHBI();
    if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();
    var param = {
        _program: sp_URI,
        _result: "STREAMFRAGMENT",
        _REPORT_NAME: _REPORT_DESC,
        save_path: save_path,
        windw: winW,
    };
    param = getParams(param, params);
    //

    var paramCount = Object.keys(tParams).length;
    for (ii = 0; ii < paramCount; ii++) {
        param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
    }

    if (servlet == "HBI") {
        url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTP";
    } else {
        url = "/SASHBI/STPRVServlet?sas_forwardLocation=execSTP";
        url = "/SASStoredProcess/do";
    }
    $.ajax({
        url: url,
        type: "post",
        data: param,
        dataType: "html",
        async: true,
        beforeSend: function () {
            isRun = 1;
            if (isDisplayProgress == 1) {
                $("#progressIndicatorWIP").show();
            }
        },
        success: function (data) {
            //
            if (typeof eval(fn) != "function")
                console.log("callback function name", fn, "Not Exist!!!");
            window[fn](data);
            return data;
        },
        complete: function (data) {
            isRun = 0;
            $("#progressIndicatorWIP").hide();
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:xhr:error: ", status, xhr, error);
        },
    });
}
function execAjaxMultipart(updata, cbfunc) {
    updateTimeoutHBI();

    $.ajax({
        enctype: "multipart/form-data;",
        type: "post",
        url: "/SASStoredProcess/do",
        dataType: "json",
        data: updata,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 6000000,
        beforeSend: function () {
            $("#progressIndicatorWIP").show();
        },
        success: function (data) {
            $("button").prop("disabled", false);
            //
            window[cbfunc](data);
        },
        complete: function (data) {
            isRun = 0;
            $("#progressIndicatorWIP").hide();
            $("#dvBG").hide();
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:xhr:error: ", status, xhr, error);
            alertMsg2("execAjaxMultipart");
        },
    });
}
function execAjax(url, sp_URI, isAsync, fn, dataType, ...params) {
    updateTimeoutHBI();
	// console.log("call back function : ", fn);
    var orgURL = url;
    if (url == "") {
        url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTPN";
        if (servlet == "HBI") {
            url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTPN";
        } else {
            url = "/SASStoredProcess/do";
        }
        /*
        koryhh : HBIServlet 맞을거 같은데 왜 STPRVServlet 일까??? - 2024-04-01 10:51:23
        */
    } 
    // else {
    //     url = "/SASHBI/HBIServlet?sas_forwardLocation=" + url;
    // }
    
    if (dataType == "" || dataType == "undefined") dataType = "json";

    if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();
    var param = {
        _program: sp_URI,
        _result: "STREAMFRAGMENT",
        _REPORT_NAME: _REPORT_DESC,
        save_path: save_path,
        windw: winW,
    };
    param = getParams(param, params);
    //

    var paramCount = Object.keys(tParams).length;
    //
    for (ii = 0; ii < paramCount; ii++) {
        param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
    }
    //

    $.ajax({
        url: url,
        type: "post",
        data: param,
        dataType: dataType,
        cache: false,
        async: isAsync,
        beforeSend: function () {
            isRun = 1;
            if (isDisplayProgress == 1) {
                $("#progressIndicatorWIP").show();
            }
        },
        success: function (data) {
			// console.log("data in execAjax : success", data, fn, dataType);
            if (dataType == "json") console.log(data);
            if (params[0] == "ExcelDown") dataType = "XML";
            if (typeof eval(fn) != "function") {
                console.log("callback function name", fn, "Not Exist");
			}
			/*
			console.log("typeof", typeof eval(fn));
			console.log("object");
			eval(fn)(data, dataType);
			*/
			// console.log(eval(fn));
            window[fn] (data, dataType);
        },
        complete: function (data) {
            isRun = 0;
            $("#progressIndicatorWIP").hide();
            tParams = new Object();
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:xhr:error: ", status, xhr, error);
        },
    });
}

function execAjaxSTP(sp_URI, isAddRowCustVisible, fn, dataType, ...params) {
    updateTimeoutHBI();
    url = "/SASStoredProcess/do?";
    // if (servlet == "HBI") {
    //     url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTPN";
    // } else {
    //     url = "/SASHBI/STPRVServlet?sas_forwardLocation=execSTP";
    //     url = "/SASStoredProcess/do";
    // }
    if (dataType == "" || dataType == "undefined") dataType = "json";

    if (isDisplayProgress == 1) $("#progressIndicatorWIP").show();
    var param = {
        _program: sp_URI,
        _result: "STREAMFRAGMENT",
        //_REPORT_NAME: _REPORT_DESC,
        save_path: save_path,
        windw: winW,
    };
    //param = getParams(param, params);
    //

    var paramCount = Object.keys(tParams).length;
    //
    for (ii = 0; ii < paramCount; ii++) {
        param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
    }
    //

    $.ajax({
        url: url,
        type: "post",
        data: param,
        dataType: dataType,
        cache: false,
        async: isAsync,
        beforeSend: function () {
            isRun = 1;
            if (isDisplayProgress == 1) {
                $("#progressIndicatorWIP").show();
            }
        },
        success: function (data) {
            if (dataType == "json") console.log(data);
            if (param[0] == "ExcelDown") dataType = "XML";
            if (typeof eval(fn) != "function")
                console.log("callback function name", fn, "Not Exist");
            window[fn](data, dataType);
        },
        complete: function (data) {
            isRun = 0;
            $("#progressIndicatorWIP").hide();
            tParams = new Object();
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:xhr:error: ", status, xhr, error);
        },
    });
}

function downloadDoc() {
    if (hasHelpDoc) {
        var storedXlsFilePath = encodeURIComponent(helpDocFullPath);
        var storedXlsFileName = encodeURIComponent(helpDocFullName);
        console.log(storedXlsFilePath, storedXlsFileName);

        var myForm = document.xlsFileDownloadForm;
        myForm._sessionid.value = nstp_sessionid;
        myForm.save_path.value = save_path;
        myForm.storedXlsFilePath.value = storedXlsFilePath;
        myForm.storedXlsFileName.value = storedXlsFileName;

        myForm.action = "/SASHBI/jsp/downloadDoc.jsp";
        myForm.target = "fileDown";
        myForm.submit();
    } else {
        console.log("");
        alertMsg2("도움말 파일이 없습니다.");
        return;
    }
}
//

function uploadLayout() {
    if (save_type == "UPDATE" && sgData.length == 0) {
        alertMsg2("조회 후 파일업로드를 하십시오.");
        return;
    }

    $("#dvBG").css("height", $(window).height() + "px");
    $("#dvBG").width($(window).width());
    $("#dvBG").show();
    $("#dvUpload").css(
        "left",
        eval(eval($(window).width() - $("#dvOpen").width() - 0) / 2)
    );
    $("#dvUpload").css(
        "top",
        eval(eval($(window).height() - $("#dvOpen").height() - 100) / 2)
    );
    $("#dvUpload").show();
}

function closeUploadWindow() {
    $("#dvUpload").hide();
    $("#dvBG").hide();
}

function checkExtention(p_filename) {
    if (p_filename == null || p_filename == undefined || p_filename.length == 0)
        return false;

    var result = false;
    var validUploadFileTypes = ["xlsx", "xls"];
    var ext = p_filename
        .substring(p_filename.lastIndexOf(".") + 1, p_filename.length)
        .toLowerCase();
    for (var i = 0; i < validUploadFileTypes.length; i++) {
        if (ext == validUploadFileTypes[i]) {
            result = true;
            break;
        }
    }

    return result;
}

function checkFileSize(p_fileName) {
    if (p_fileName == null || p_fileName == undefined || p_fileName.length == 0)
        return false;
    var result = false;
    var limitFilesize = 10485760; /* 10MB */
    if (uploadFileSize !== 0 && uploadFileSize <= limitFilesize) {
        result = true;
    }
    return result;
}

function uploadFileSend() {
    var myForm = document.uploadForm;
    var filename = myForm.file.value;
    if (filename == "" || filename.length <= 0) {
        alertMsg2("Upload 파일을 선택하세요.");
        myForm.file.focus();
        return;
    }

    if (!checkExtention(fileName)) {
        alertMsg2("xlsx 파일만 Upload 할 수 있습니다.");
        myForm.file.focus();
        return;
    }

    if (!checkFileSize(fileName)) {
        alertMsg2("10MB 이상의 파일을 첨부하 수 없습니다.");
        myForm.file.focus();
        return;
    }

    myForm.action =
        "/SASHBI/FileUploadServlet?save_path=" +
        save_path +
        "&nstp_sessionid=" +
        nstp_sessionid +
        "&table_name=" +
        table_name +
        "&_STPREPORT_TYPE=EDIT_VIEWER";
    myForm.target = "fileUpload";
    myForm.submit();
}

function executeImportExcel(p_uploadedFileName) {
    var param = {
        _program:
            "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/importExcel(StoredProcess)",
        _result: "STREAMFRAGMENT",
        P_UPLOADED_FILE_NAME: p_uploadedFileName,
        save_path: save_path,
    };
    if (servlet == "HBI") {
        url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTPN";
    } else {
        url = "/SASHBI/STPRVServlet?sas_forwardLocation=execSTP";
        url = "/SASStoredProcess/do";
    }
    $.ajax({
        url: url,
        data: param, 
        type: "post",
        dataType: "json",
        cache: false,
        async: false,
        success: function (data) {
            window["importSuccess"](data);
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:xhr:error: ", status, xhr, error);
        },
    });
}

function importSuccess(p_data) {
    var resultFlag = p_data["ResultFlag"];
    if (resultFlag == "0") {
        alertMsg2("");
        return;
    } else if (resultFlag == "-1") {
        alertMsg2("");
        return;
    }
    // validationUploadedFile(p_data);
}
function setSessionInit(res) {
    console.log("setSessionInit");
    sessionInfo = res.SESSION_INFO;
    //

    if (sessionInfo == undefined || $.isEmptyObject(sessionInfo)) {
        //
        //

        viewable_date = "";
    } else {
        sessionInfoKeys = Object.keys(sessionInfo);
        //
        viewable_date = sessionInfo["viewable_date"];
    }

    if (
        viewable_date != null &&
        viewable_date != "" &&
        viewable_date.length > 0
    ) {
        //
        if (viewable_date == "0") {
            //
        } else {
            if (viewable_date.length == 5) {
                $("#viewableDateMsg").html(
                    "보고서 산출가능 최종년 <font color=blue>" +
                        viewable_date +
                        "</font>"
                );
            } else if (viewable_date.length == 8) {
                $("#viewableDateMsg").html(
                    "보고서 산출가능 최종년월 <font color=blue>" +
                        viewable_date +
                        "</font>"
                );
            } else {
                $("#viewableDateMsg").html(
                    "보고서 산출가능 최종일자 <font color=blue>" +
                        viewable_date +
                        "</font>"
                );
            }
        }
    }

    info_message = res.InfoMessage;
    console.log("object");
    if (info_message != "") {
        $("#dvTitle").show();
        $("#dvInfoMessage").show();
        $("#info_msg").html(info_message);
        console.log("object");
        resizeFrame();
    } else {
        $("#dvTitle").hide();
        $("#dvInfoMessage").hide();
    }

    if (typeof setSessionInitEditer === "function") {
        setSessionInitEditer(res);
    } else {
        console.log("object");
    }
    if (typeof setSessionInitCust === "function") {
        setSessionInitCust(res);
    } else {
        console.log("object");
    }
}

function openUploadDialog(cbfunc) {
    //
    $("#dvUploadFile").dialog({
        title: "File Upload",
        width: 600,
        maxHeight: 670,
        closeText: "X",
        close: function () {
            $("#dvBG").hide();
            close();
        },
        resizeable: false,
        closeOnEscapre: true,
        modal: true,
        buttons: [
            {
                text: "Upload",
                id: "btnUpload",
                click: function () {
                    //
                    cbfunc("testfilename");
                    $("#dvUploadFile").dialog("close");
                },
            },
        ],
    });
}

function fnSelectAttachFile() {
    var new_file = $("#iptAttachFile")[0].files[0].name;
    var extention = new_file.split(".").pop().toLowerCase();
    //
    //

    if (extention.toUpperCase() != "XLSX") {
        //
        //
        alertMsg2("엑셀 파일만 업로드 할 수 있습니다.");
        $("#spnFilename").html("");
        return false;
    }
    $("#spnFilename").html(new_file);
}
function validateDate(type, dateStr) {
    try {
        $.datepicker.parseDate(type, dateStr, null);
        return true;
    } catch (error) {
        return false;
    }
}
function getTextLength(str) {
    let len = 0;
    for (let ii = 0; ii < str.length; ii++) {
        if (escape(str.charAt(ii)).length == 0) {
            len++;
        }
        len++;
    }
    return len;
}
Date.prototype.yyyymmdd = function () {
    let mm = this.getMonth() + 1;
    let dd = this.getDate();
    return [
        this.getFullYear(),
        (mm > 9 ? "" : "0") + mm,
        (dd > 9 ? "" : "0") + dd,
    ].join("");
};
function addCommas(nStr) {
    nStr += "";
    var x = nStr.split(".");
    var x1 = x[0];
    var x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

function exportEXCEL(){
	var userDefHeader = $("#dvUserHeader").html();
	if (isNoSubmitBtn == 0) {
		if($sasExcelHTML.length < 10 && orgRptType.indexOf("opnSWSlickGrid") < 0 ){
			alertMsg2("조회된 결과가 없습니다.");
			return;
		} 
	}

	if (excelPGM == "POI") {                                            // SAS Datasets to POI
    } else if (excelPGM == "SAS") {                                     // SAS_Stream(EXCEL) to Excel
        // var url = "/SASHBI/HBIServlet?sas_forwardLocation=exportExcel"; 
        var url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTP"; 
        var sp_URI = spPathUrl;
        // var isAsync = true;
        // var fn = "downExcel";
        // var dataType = "html";
        // function execAjax(url, sp_URI, isAsync, fn, dataType, ...params) {
        // execAjax(url, metaID, true, "downExcel", "html");
        // execAjax(url, sp_URI, isAsync, fn, dataType);
        tParams.param1 = "ExcelDown";
        exportSAS2Excel(url, sp_URI);
        return;
    } else if (excelPGM == "HTML") {                                    // HTML to Excel
        var url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTP";
        var sp_URI = spPathUrl;
        var isAsync = true;
        var fn = "downloadXls";                                         
        var dataType = "html";
        // executeExcelAjax(url, sp_URI, isAsync, fn, dataType, ...params)
        // executeExcelAjax(url, sp_pathUrl, isAsync, fn, dataType, "ExcelDown");
        tParams.param1 = "ExcelDown";
        execAjax(url, sp_URI, isAsync, fn, dataType);
        return;
    } else if (excelPGM == "") {                                        // SAS Datasets to POI
        /*
        var myForm = fomExcel;
        myForm.action = "/SASStoredProcess/do";
        myForm.target = "fileDown";
        myForm._program.value = spPathUrl;
        if (nstp_sessionid == "") {
            alertMsg2("세션이 종료되었습니다.");
            return;
        }
        myForm.save_path.value = save_path;
        myForm.submit();
        return;
        */
    } else if (excelPGM.length > 5) {                                   // SAS_Stream(EXCEL) to Excel
        console.log("exportSAS2Excel()");
        var url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTP"; 
        var sp_URI = "SBIP://METASERVER" + excelPGM + "(StoredProcess)";    // sp_pathUrl;
        exportSAS2Excel(url, sp_URI);
        return;
    }
}
/* //#region 
function executeExcelAjax(url, sp_URI, isAsync, fn, dataType, ...params) {
    updateTimeoutHBI();

    url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTP";

    if (dataType == "" || dataType == "undefined") dataType = "json";

    var param = {
        _program: sp_URI,
        _result: "STREAMFRAGMENT",
        _REPORT_NAME: _REPORT_DESC,
        save_path: save_path,
    };
    param = getParams(param, params);
    //

    if (nstp_sessionid.length > 10) {
        //
        param.save_path = save_path;
    }
    if (colHeaderRowCnt != "") {
        param._colHeaderRowCnt = ColHeaderRowCnt;
    }
    var rowCount = Object.keys(tParams).length;
    for (ii = 0; ii < rowCount; ii++) {
        var varName = tParams["param" + ii];
        param[varName] = eval("param" + ii);
    }
    var paramCount = Object.keys(tParams).length;
    for (ii = 0; ii < paramCount; ii++) {
        param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
    }

    $.ajax({
        url: url,
        type: "post",
        data: param,
        dataType: dataType,
        cache: false,
        async: isAsync,
        beforeSend: function () {
            isRun = 1;
            if (isDisplayProgress == 1) {
                $("#progressIndicatorWIP").show();
            }
        },
        success: function (data) {
            if (dataType == "json") console.log(data);
            if (param[0] == "ExcelDown") dataType = "XML";
            if (typeof eval(fn) != "function")
                console.log("callback function name", fn, "Not Exist");
            window[fn](data, dataType);
        },
        complete: function (data) {
            isRun = 0;
            $("#progressIndicatorWIP").hide(); 
            // tParams = new Object();
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:xhr:error: ", status, xhr, error);
        },
    });
}
function downExcel(data) {
    // ie에서 오류 Chrome 정상 작동
	// data=data.replace(/ss:StyleID="data__l1" ss:Index="4"><Data ss:Type="String">/gi, 'ss:MergeAcross="2" ss:StyleID="data__l1" ss:Index="4"><Data ss:Type="String">');
	// window.open('data:application/vnd.ms-excel,' + encodeURIComponent('<?xml version="1.0" encoding="utf-8"?>') + encodeURIComponent(data.substring(39)));
	
    // window.open('data:application/vnd.ms-excel,' + encodeURIComponent('<?xml version="1.0" encoding="utf-8"?>') + encodeURIComponent(data.substring(39)));
}
function downExcel2(data, dataType) {
    if (dataType.toUpperCase() == "HTML") {
        data = data.replace(/euc-kr/gi, "utf-8");
        window.open(
            "data:application/vnd.ms-excel," + encodeURIComponent(data)
        );
    } else if (dataType.toUpperCase() == "XML") {
        window.open(
            "data:application/vnd.ms-excel," +
            encodeURIComponent('<?xml version="1.0" encoding="utf-8"?>') +
            encodeURIComponent(data.substring(39))
        );
    }
}
function downloadXls(p_data) {
    //
    if (p_data != "" && p_data == 0) {
        alertMsg2("조회된 데이터가 없습니다.");
        return;
    }
    if (nstp_sessionid == "") {
        alertMsg2("세션이 종료되었습니다.");
        return;
    }

    var xlsFileName = _REPORT_DESC;
    var storedXlsFilePath = save_path;
    var storedXlsFileName = "excel.xls";
    //
    //

    var myForm = document.xlsFileDownloadForm;
    myForm._sessionid.value = nstp_sessionid;
    myForm.save_path.value = save_path;
    myForm.storedXlsFilePath.value = storedXlsFilePath;
    myForm.storedXlsFileName.value = storedXlsFileName;
    myForm.xlsFileName.value = xlsFileName;

    myForm.action = "/SASHBI/jsp/downloadDoc.jsp";
    myForm.target = "fileDown";
    myForm.submit();
}
//#endregion */
function exportSAS2Excel(url, sp_URI) {
    $("#progressIndicatorWIP").show();
    var param = {
        _program: sp_URI,           //"SBIP://METASERVER" + excelPGM + "(StoredProcess)",
        _result: "STREAMFRAGMENT",
    };
    params = new Array();
    param = getParams(param, params);
    
    var paramCount = Object.keys(tParams).length;
    for (ii = 0; ii < paramCount; ii++) {
        param[Object.keys(tParams)[ii]] = tParams[Object.keys(tParams)[ii]];
    }
    paramStr = "";
    for (ii in param) {
        if (paramStr == "") {
            paramStr += `${ii}=${param[ii]}`;
        } else {
            paramStr += `&${ii}=${param[ii]}`;
        }
    }
    console.log("param", param);
    console.log("paramStr", paramStr);
    const req = new XMLHttpRequest();
    // url = "/SASHBI/HBIServlet?sas_forwardLocation=execSTP";
    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // req.setRequestHeader("Content-type", "application/json");
    req.responseType = "arraybuffer";
    req.onload = function () {
        const arrayBuffer = req.response;
        if (arrayBuffer) {
            var blob = new Blob([arrayBuffer], {
                type: "application/octetstream",
            });
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            console.log("_REPORT_DESC", _REPORT_DESC);

            link.download = _REPORT_DESC.trim() + "." + download_type;
            link.click();
            $("#progressIndicatorWIP").hide();
        }
    };
    req.send(paramStr);
}
function goPage(index){
	$("#dvOutput").hide();
	// $("#pagenum").val(pagenum);
    pagenum = parseInt(index);
    console.log("pagenum", pagenum);
	getMain();
}