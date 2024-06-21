/*
 * 주 시스템 명 : MI REPORT
 * 화    면    명  : SAS HBI > Boards > Notice Board
 * 프로그램명       : 01.Notice_header.js
 * 기           능 : Notice Board
 * 작     성    자 :
 * 작     성    일 : 2021-11-10
 * ======================================================================
 * 수정 내역
 * NO     수정일      작업자      내용
 * 
 */
var debug = true;
var isHideBG, qryCnt;
var sgGrid, curRow;
var sgGridAttachFiles, curRow2;
var editor;
const waitImage ="<div align=center><img src='/SASHBI/images/nhaml/progress.gif' style='width:80px; h 짤림(게시판/KakaoTalk_20230112_141913344_21.jpg)"
const BOARD_ID2 = 1000; // Notice

$(document).ready(function () {
    console.log("start board.js");
    //alert("start board.js");
    $.ajax({
        //url: "/SASHBI/input/NHAML/06.Board/01.Board/board.js",
        //sasv94/config/Lev1/Web/WebAppServer/SASServer2_1/sas_webapps/sas.hbi.war/input/Products/SAS_HBI/05.LEO_Reports/board.js
        url: "/SASHBI/input/Products/SAS_HBI/05.LEO_Reports/00.board/board.js",
        dataType: "script",
        async: false,
        success: function () {
            console.log("JS Loading!!!");
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:" + status + ": xhr: " + xhr + "error: " + error);
            alert("cbConfirmRegistArticle", error);
        },
    });

    console.log("userID", userID);
});
function fnOpenArticle(curRow) {
    $("#dvBG").show();
    curRow2 = "";
    //$("#iptTitle").val(curRow.ARTICLE_TITLE);
    //$("#iptTitle").prop("readonly", true);
    $("#tdTitle").html(curRow.article_title);
    $("#tdRegistrant").html(curRow.reg_user);
    $("#txaContent").val(curRow.article_content);
    $("#txaContent").attr('readonly', true);

    $("#sasGridAttachFiles").show();
    $("#sasGridAttachFiles").html(waitImage);
    //updateView();
    getAttachFiles(curRow);

    $("#dvArticle").dialog({
        title: "Notice Board - " + curRow.article_title,
        width: 855,
        maxHeight: 670,
        close: function () {
            $("#dvBG").hide();
            close();
        },
        resizeable: false,
        closeOnEscape: true,
        modal: false,
        buttons: [
            {
                text: "Update",
                id: "btnDialogSave",
                click: function () {
                    fnConfirmUpdateArticle();
                },
            },
        ],
    });

    console.log("userID in fnOpenArticle", userID);
    console.log("curRow.REG_USER in fnOpenArticle", curRow.REG_USER);
    if (userID != curRow.reg_user) {
        $("#btnDialogSave").hide();
    } else {
        $("#btnDialogSave").show();
        $("#tdTitle").html('<input type=text id=iptTitle size=20 style="width:500px;" maxlength="100">');
        $("#iptTitle").val(curRow.article_title);
        $("#iptTitle").prop("readonly", false);
        $("#txaContent").prop("readonly", false);
    }
    $(".spHeader:last").height($("#dvAttachW").height());
    // editor.getDoc().setValue(curRow.ARTICLE_CONTENT);
    // editor.clearHistory();
    // editor.refresh();
    if (userID == curRow.reg_user) {
        $("#dvAttachW input[type='button']").show();
    } else {
        $("#dvAttachW input[type='button']").hide();
    }
}