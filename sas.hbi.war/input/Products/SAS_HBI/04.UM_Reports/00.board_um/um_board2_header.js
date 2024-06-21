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
var waitImage ="<div align=center><img src='/SASHBI/images/progress.gif' style='width:80px;' >";
const BOARD_ID = 1000; // Notice

$(document).ready(function () {
    console.log("start board.js");
    //alert("start board.js");
    $.ajax({
        // Web/WebAppServer/SASServer2_1/sas_webapps/sas.hbi.war/input/Products/SAS_HBI/04.UM_Reports/00.board_um/um_board2.js
        url: "/SASHBI/input/Products/SAS_HBI/04.UM_Reports/00.board_um/um_board2.js",
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
});
function fnOpenArticle(curRow) {
    $("#dvBG").show();
    curRow2 = "";
    //$("#iptTitle").val(curRow.ARTICLE_TITLE);
    //$("#iptTitle").prop("readonly", true);
    $("#tdTitle").html(curRow.ARTICLE_TITLE);
    $("#tdRegistrant").html(curRow.REG_USER);
    $("#sasGridAttachFiles").show();
    $("#sasGridAttachFiles").html(waitImage);
    updateView();
    getAttachFiles(curRow);

    $("#dvArticle").dialog({
        title: "Notice Board - " + curRow.ARTICLE_TITLE,
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
    if (userID != curRow.REG_USER) {
        $("#btnDialogSave").hide();
    } else {
        $("#btnDialogSave").show();
    }
    $(".spHeader:last").height($("#dvAttachW").height());
    editor.getDoc().setValue(curRow.ARTICLE_CONTENT);
    editor.clearHistory();
    editor.refresh();
    if (userID == curRow.REG_USER) {
        $("#dvAttachW input[type='button']").show();
    } else {
        $("#dvAttachW input[type='button']").hide();
    }
}