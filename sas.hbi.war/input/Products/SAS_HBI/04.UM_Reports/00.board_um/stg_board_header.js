
var debug = true;
var isHideBG, qryCnt;
var sgGrid, curRow;
var sgGridAttachFiles, curRow2;
var editor;
var waitImage ="<div align=center><img src='/SASHBI/images/progress.gif' style='width:80px;' >";
const board_id = 1000; // Notice

$(document).ready(function () {
	var boardJS = document.createElement('script');
    // Web/WebAppServer/SASServer2_1/sas_webapps/sas.hbi.war/input/Products/SAS_HBI/04.UM_Reports/00.board_um/stg_board.js
	boardJS.src = '/SASHBI/input/Products/SAS_HBI/04.UM_Reports/00.board_um/stg_board.js';
	document.head.appendChild(boardJS);

	console.log("userID", userID);
	/*
    $.ajax({
        url: "/SASHBI/input/Products/SAS_HBI/02.STP_Reports/00.Example/board.js",
        dataType: "script",
        async: false,
        success: function () {
            console.log("JS Loading!!!");
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:" + status + ": xhrㄹ: " + xhr + "error: " + error);
            alert("cbConfirmRegistArticle", error);
        },
    });
	
	fetch('/SASHBI/input/Products/SAS_HBI/02.STP_Reports/00.Example/board.js')
		.then((response) => console.log("board.js", response.body));
	*/
});
function fnOpenArticle(curRow) {
    $("#dvBG").show();
    curRow2 = "";
    //$("#iptTitle").val(curRow.ARTICLE_TITLE);
    //$("#iptTitle").prop("readonly", true);
    $("#tdTitle").html(curRow.article_title);
    $("#tdRegistrant").html(curRow.reg_user);
    $("#sasGridAttachFiles").show();
    $("#sasGridAttachFiles").html(waitImage);
    updateViewCnt();
    getAttachFiles(curRow);

    $("#dvArticle").dialog({
        title: "Notice Board - " + curRow.article_title,
        width: 855,
        maxHeight: 670,
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
                text: "수정",
                id: "btnDialogSave",
                click: function () {
                    fnConfirmUpdateArticle();
                },
            },
            {
                text: "닫기",
                id: "btnDialogCancel",
                click: function () {
                    $("#dvArticle").dialog('close');
                },
            },
        ],
    });

    console.log("userID in fnOpenArticle", userID);
    console.log("curRow.reg_user in fnOpenArticle", curRow.reg_user);
    if (userID != curRow.reg_user) {
        $("#btnDialogSave").hide();
    } else {
        $("#btnDialogSave").show();
    }
    $(".spHeader:last").height($("#dvAttachW").height());
    editor.getDoc().setValue(curRow.article_content);
    editor.clearHistory();
    editor.refresh();
    if (userID == curRow.reg_user) {
        //$("#dvAttachW input[type='button']").show();
        $("#btnDialogSave").show();
    } else {
        $("#btnDialogSave").hide();
    }
}