var menusize = 280; //220;
var menuShow = "/SASHBI/images/CollapseRightArrows2.gif";
var menuHide = "/SASHBI/images/CollapseLeftArrows2.gif";
var isDisplayProgress = 0;

function msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
    function pad(n, z) {
        z = z || 2;
        return ("00" + n).slice(-z);
    }
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return pad(hrs) + ":" + pad(mins) + ":" + pad(secs) + "." + pad(ms, 3);
}

function toggleFolder(id) {
    $("#sub" + id).toggle();
}
function checkTimeoutHBI() {
    var timestamp = new Date();
    var curTime = timestamp.getTime();
    var diff = eval(curTime - sas_framework_timeout);
    //   console.log("Elapsed Time from last Access : " + msToTime(diff));
    if (diff > 60 * 60 * 5 * 1000) {
        // Timeout!!!
        sas_framework_onTimeout();
    } else {
        setTimeout("checkTimeoutHBI();", 60 * 1000); //
    }
}
function execAjax(url, sp_URI, isAsync, fn, ...params) {
    if (url == "") url = "/SASStoredProcess/do?";
    var param = {};
    $.ajax({
        url: url,
        data: param,
        dataType: "html",
        cache: false,
        async: true,
        beforeSend: function () {
            isRun = 1;
            if (isDisplayProgress == 1) {
                $("#progressIndicatorWIP").show();
            }
        },
        sucess: function (data) {
            console.log("execAjax success");
            console.log(data);
            window[fn](data);
        },
        error: function (xhr, status, error) {
            console.log(
                "ERROR: Status:" + status + ": xhr: " + xhr + "error: " + error
            );
            alert(error);
        },
        complete: function (data) {
            console.log("execAjax complete");
            window[fn](data);
        },
    });
}
function alertResMsg(data) {
    isDisplayProgress = 1;
    var msg = eval(data);
    console.log("MSG: " + msg.msg);
}
function isAlive(data) {
    var titleText = $("#frmBITree").contents().find("title").html(); //$("#dvDummy title").html();
    console.log("titleText : " + titleText);
    if (titleText != "SASHBI") {
        console.error("Session Expired....");
    } else {
        $("body").show();
        $("#dvDummy").html("");
        $("#dvDummy").hide();
    }
}
$(document).ready(function () {
    // if ($.browser.msie == true) {
        //alert("지원하지 않는 브라우져 입니다. \nChrome이나 Firefox 와 같은 브라우져를 설치하고 \n다시 로그인 하시기 바랍니다.");
        //window.location.href='/SASHBI/Logoff';
    // }
    var timestamp = new Date();
    console.log("timestamp.getTime() : " + timestamp.getTime());
    $("#tabs").tabs({
        activate: function (event, ui) {
            $(window).resize();
        },
    });
    $(".STPRVmenuItem").bind("click", function () {
        $(".STPRVmenuItem").removeClass("curReport");
        $(this).addClass("curReport");
    });
    $(".STPRVmenuItem")
        .mouseenter(function (e) {
            msg = $(this).find("a").attr("uDesc");
            msg = "<pre>" + msg;
            msg = msg.replace(/\n/g, "<br>");
            msg = msg + "</pre>";
            tooltip(e, msg);
        })
        .mouseleave(function (e) {
            $("#dvTooltip").html("");
            $("#dvTooltip").hide();
        });
    $("body").show();
});
setTimeout("isAlive()", 1000 * 3);

function tooltip(event, text) {
    //console.log("text.trim().length : " + text.trim().length);
    //console.log("event");
    //console.log(event);
    //console.log("Msg : " + text);
    if (text.trim().length > 1) {
        $("#dvTooltip").css("left", eval(event.pageX + 5) + "px");
        $("#dvTooltip").css("top", eval(event.pageY + 5) + "px");
        $("#dvTooltip").html(text);
        $("#dvTooltip").show();
    }
}
