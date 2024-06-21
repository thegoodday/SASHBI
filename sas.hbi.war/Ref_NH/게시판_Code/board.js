/*
 * 주 시스템 명 : MI REPORT
 * 화    면    명  : SAS HBI > Boards > Board
 * 프로그램명       : board.js
 * 기           능 : Board 공통
 * 작     성    자 :
 * 작     성    일 : 2021-11-10
 * ======================================================================
 * 수정 내역
 * NO     수정일      작업자      내용
 * 
 */
$(document).ready(function () {
    $("#dvToolBar").append("<input type=button value='Regist' id=btnDelete class=condBtn onclick='fnRegistArticle():'>");
    $("#dvToolBar").append("<input type=button value='Delete' id=btnDelete class=condBtn onclick='fnConfirmDelete():'>");

    $(".hadDatepicker").width(90);
    $(".hasDatepicker").css("text-align", "left");

    $("#sltgrpLevel").val(grpLevel1);

    commonBkCdInit('notiBoard');

    console.log("userID : " + userID);

    editor = CodeMirror.fromTextArea(document.getElementById("txaContent"), {
        mode: "sas",
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: Infinity,
        indentWithTabs: true,
        tabSize: 4,
        indentUnit: 4,
        extraKeys: {
            /*
            Tab:function(cm){
                if(cm.getSelection().length){
                    CodeMirror.commands.indentMore(cm);
                } else { cm.replaceSelection(' ', 'end'): }
            },
            'Shift-Tab':function(cm){
                CodeMirror.commands.indentLess(cm);
            }
            "Tab": function(cm){
                var pos = cm.getCursor();
                cm.setCursor( {line :pos.line , ch :0});
                cm.replaceSelection("\t");
                cm.setCursor( {line :pos.line , ch : pos.sh +1} );
            },
        */
            "Shift-Tab": "indentLess",
        },
    });
    var util = {};
    util.key = {
        9: "tab",
        13: "enter",
        16: "shift",
        18: "alt",
        27: "esc",
        33: "rePag",
        34: "avPag",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
    };
    document.addEventListener("keydown", function (e)  {
        //console.log(' [e]',e);
        var key = util.key[e.which]; //질문
        if (key === "F4") fnExecuteCode();
    });

    resizeContents();
});

$(window).resize(function ()  {
    resizeContents();
});
function resizeContents() {
    console.log('$("#dvToolBar").height()', $("#dvToolBar").height());
    console.log("dvToolBar is ", $("#dvToolBar").is(":visible"));
    var toolBarHeight = 70;
    if ($("#dvToolBar").is(":visible")) toolBarHeight = 75;
    $("#sasGrid").height(eval($(window).height() - $("#dvCondi").height() - toolBarHeight - 0));
    $("#sasGird").width(eval($(window).width() - 50));
    //$(".slick-viewport").height(eval($("sasGrid").height()-5));
    if (sgGrid != undefined0) {
        sgGird.resizeCanvas();
    }
}
/*
function resizeMain() {
    $("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
    $("#sasGird").width(eval($(window).width()-30));
    //$(".slick-viewport").height(eval($("#sasGrid").height()-5));
    if (sgGird!=undefined) {
        sgGird.resizeCanvas();
    }
    $(".spHeader:last").height($("#dvAttachW").height());
}
*/
function setSlickGrid(data) {
    console.log("setSlickGrd :\n");
    qryCnt = 0;
    curRow = "";
    $("#sasGrid").show();
    var dataView = new setSlickGrid.Data.DataView();

    var sasJsonRes = data[0];

    var columns = [];
    var checkboxSelector = new setSlickGrid.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel",
    });
    var options = sasJsonRes["Options"][0];

    var isChk = options.chkBox;
    if (isChk) {
        columns.push(checkboxSelector.getColumnDefinition());
        columns = $.extend(sasJsonRes["ColumInfo"], columns);
    }
    columns = sasJsonRes["ColumInfo"];
    //columns[2].formatter=eval("StatusFommater");
    //columns[4].editor=eval("HierEditor");

    console.log("columns");
    console.log(columns);
    console.log("options \n" + JSON.stringify(options));
    var sessionInfo = [];
    sessionInfo = sasJsonRes["SessionInfo"][0];
    nstp_sessionid = sessionInfo["nstp_sessionid"];
    stp_sessionid = nstp_sessionid;
    save_path = sessionInfo["save_path"];
    $sasExcelHTML = data;

    var sgData = [];
    sgData = sasJsonRes["SASResult"];
    $("#dvResInfo").html("Total : " + sgData.length + " Articles");
    for (ii in sgData) {
        var objTemp = $.extend(sgData[ii], eval({ id: ii }));
    }
    console.log("sgData")
    console.log(sgData);
    //dataView.setItems(sgData);

    sgGrid = new setSlickGrid.Grid("#sasGird", dataView, columns, options);
    dataView.onRowCountChanged.subscribe(function (e, args) {
        sgGrid.updateRowCount();
        sgGird.render();
    });
    dataView.onRowsChanged.subscribe(function (e, args) {
        sgGrid.invalidateRows(args.rows);
        sgGrid.render();
    });
    dataView.setSelectionModel(new setSlickGrid.RowSelectionModel({ selectActiveRow: false }));
    if (isChk) {
        sgGrid.registerPlugin(checkboxSelector);
    }
    sgGrid.registerPlugin(new setSlickGrid.AutoTooltips({ enableForHeaderCells: true }));
    sgGrid.onClick.subscribe(function (e, args) {});
    sgGrid.onDblClick.subscribe(function (e, args) {
        console.log("[CDD] - onDblClick");
        curRow = args.grid.getDataItem(args.row);
        fnOpenArticle(curRow);
    });
    sgGrid.onSort.subscribe(function (e, args) {
        var comparer = function (a, b) {
            return a[args.sortCol.field] > b[args.sortCol.field] ? 1 : -1;
        };
        dataView.sort(comparer, args.sortAsc);
    });
    dataView.beginUpdate();
    dataView.setItems(sgData);
    dataView.endUpdate();
    $("#progressIndicatorWIP").hide();
    console.log("grpLevel1 :", grpLevel1);
    $("#dvToolBar").show();   
}
function fnConfirmRegistArticle() {
    var content = editor.getValue();
    console.log("content", editor.getValue());

    inHideBG = false;
    if ($("optTitle").val() == "" || $("#optTitle").val().replace(/ /g, "") == "") {
        alertMsg("Please, Input the Title...");
        return;
    }
    if (content == "" || content.replace(/ /g, "") == "") {
        alertMsg("Please, Input the content...");
        return;
    }
    isHideBG = false;
    confirmMsg("Are you sure you want to save?", "cbConfirmRegistArticle");
}
function cbConfirmRegistArticle() {
    $("#progressIndicatorWIP").show();
    $("button").prop("disabled", true);

    var form = $("#fomUpload") [0];
    var updata = new FormData(form);
    updata.append("BRANCH", $("#sltbranch").val()=="" ? "GB" : $("#sltbranch").val());
    updata.append("BOARD_ID", BOARD_ID);

    var artTitle = $("#optTitle").val();
    console.log("artTitle : ", artTitle);
    artTitle2 = encodeURIComponent(artTitle);
    console.log("artTitle2 : ", artTitle2);
    var artContent = editor.getValue();
    artContent2 = encodeURIComponent(artContent);
    updata.append("ARTICLE_TITLE", artTitle2);
    updata.append("ARTICLE_CONTENT", artContent2);
    updata.append("ARTICLE_OWNER", userID);
    updata.append(
        "_program",
        "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.registArticle(StoredProcess)"
    );

    $.ajax({
        enctype: "multipart/form-data",
        type: "post",
        url: "/SASStoredProcess/do",
        dataType: "json",
        data: updata,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 6000000,
        beforeSend: function (xhr, setting) {
            $("#progressIndicatorWIP").show();
        },
        success: function (data) {
            $("button").prop("disabled", false);
            console.log(data);
            cbRegistArticle(data);
        },
        complete: function (data) {
            isRun = 0;
            tParams = eval("[{}]");
            submitSTP();
            $("#progressIndicatorWIP").hide();
            $("#dvArticle").dialog("close");
            $("#dvBG").hide();
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:" + status + ": xhr: " + xhr + "error: " + error);
            alert("cbConfirmRegistArticle", error);
        },
    });
}
function cbRegistArticle(data) {
    alertMsg(data[0].msg);
}
function fnShowArticle(param) {
    console.log("Param : " + param);
}
function fnAddAttach() {
    $("#dvAttach").append("<input type=file name=iptAttachFile style='width: 480px;' onChange='fnAddAttachGrid()'>");
    //$("#dvAttach").show();
    $(".spHeader:last").height($("#dvAttachW").height());
    $("input[type='file']:last").Click();
}
function fnAddAttachGrid() {
    var new_file = $("input[type='file']:last")[0].files[0].name;
    var extention = new_file.split(".").pop().toLowerCase();
    console.log("Last input value : ", new_file);
    console.log("File extention : ", extention);
    var acceptExt = ["doc", "docx", "pdf", "xls", "xlsx", "ppt", "pptx", "txt", "hwp", "zip", "exe", "png", "mp3", "mp4"];
    //if (!acceptExt.includes(extention)) {
    if (acceptExt.indexOf(extention) < 0) {
        isHideBG = false;
        alertMsg("Unsupported file extention.");
        $("input[type='file']:last")[0].remove();
        return;
    }

    var dataView = sgGridAttachFiles.getData();
    newId = dataView.getLength();
    var newId = eval(sgGridAttachFiles.getData().getItems().length + 1);
    console.log("newId : ", newId);

    var newRow = {};
    newRow.id = "" + eval(newId);
    newRow.BK_CD = curRow.BK_CD;
    newRow.FILE_NAME_ORG = new_file;
    newRow.FILE_PATH = "";

    dataView.beginUpdate();
    dataView.addItem(newRow);
    dataView.endUpdate();
}
/*
    var dataView = sgGirdTraning.getData();
    if (curRow2 != undefined || curRow2 != "") {
        var item = curRow2;
        if (item) dataview.deleteItem(item.id); 
    };
    sgGridTraning.invalidate();
    sgGridTraning.render();
    sgGirdTraning.setSelectedRows([]);
*/
function fnDeleteAttach() {
    var title = $("#iptTitle").val();
    console.log("title in fnDeleteAttach", title);

    var dataView = sgGridAttachFiles.getData();
    var sgData = dataView.getItems();
    console.log("sgData", JSON.stringify(sgData));
    console.log("currow2 in fnDeleteAttach", curRow2);
    if (curRow2 == undefined || curRow2 == ""){
        alertMsg("Please, select the row to delete.");
        return;
    }
    FILE_NAME_ORG = curRow2.FILE_NAME_ORG;
    console.log("FILE_NAME_ORG : ", FILE_NAME_ORG);
    $("#dvAttach input[type='file']").each(function () {
        orgFilename = $(this)[0].files[0].name;
        if (FILE_NAME_ORG == orgFilename) $(this).remove();
    });
    tParams.BK_CD = curRow2.BK_CD;
    tParams.FILE_KEY = curRow2.FILE_KEY;
    if (curRow2) dataView.deleteItem(curRow2.id);

    sgGridAttachFiles.setSelectedRows([]);
    sgGridAttachFiles.invalidate();
    sgGridAttachFiles.render();

    $("#sasGridAttachFiles .Slick-row").each(function(index, item){
        console.log('item',item);
        if ($(item).hasClass('active')) $(item).removeClass('active');
    });
    //hasClass("active").removeClass("active")
}
function cbDeleteAttach(data){
    console.log("cbDeleteAttach", data);
}
function fnRegistArticle() {
    $("#dvBG").show();

    curRow = {};
    curRow.BK_CD = $("#sltbranch").val();

    getAttachFiles(curRow);
    $("#tdTitle").html('<input type=text id=iptTitle size=20 style="width:500px;" maxlength="100">');
    $("#iptTitle").val("");
    $("#iptTitle").prop("readonly", false);
    $("#tdRegistrant").html(userID);
    $(".CodeMirror-line").html("");

    $("#dvAttach").html("");

    $("#dvArticle").dialog({
        title: "New Article",
        width: 855,
        maxHeight: 670,
        close: function () {
            $("#dvBG").hide();
            close();
        },
        buttons: [
            {
                text: "Save",
                id: "btnDialogSave",
                click: function () {
                    fnConfirmRegistArticle();
                },
            },
        ],
        resizeable: false,
        closeOnEscape: true,
        modal: false,
    });
    $(".spHeader:last").height($("#dvAttachW").height());
    editor.getDoc().setValue("");
    editor.clearHistory();
    editor.refresh();
    $("#dvAttachW input[type='button']").show();
}
function updateViewCnt() {
    tParams.BK_CD = curRow.BK_CD;
    tParams.BRANCH = curRow.BK_CD;//"GB";
    tParams.BOARD_ID =  BOARD_ID;
    tParams.ARTICLE_ID = curRow.ARTICLE_ID;
    tParams.VIEW_CNT = curRow.VIEW_CNT;
    isHideBG = false;
    execAjax(
        "",
        "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.updateViewCnt(StoredProcess)",
        true,
        "cbUpdateViewCnt",
        "json",
        debug
    );
}
function cbUpdateViewCnt(data) {
    console.log("cbUpdateViewCnt", data);
}
function getAttachFiles(rowInfo) {
    console.log("rowInfo.ARTICLE_ID : ", rowInfo.ARTICLE_ID);
    if (rowInfo.ARTICLE_ID == undefined) {
        rowInfo.ARTICLE_ID = 0;
        tParams.from = "";
    } else {
        tParams.from = "";
    }
    tParams.BK_CD = rowInfo.BK_CD;
    tParams.ARTICLE_ID = rowInfo.ARTICLE_ID;
    isHideBG = false;
    execAjax(
        "",
        "SBIP://NETASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.getAttachFiles(StoredProcess)",
        true,
        "cbGetAttachFiles",
        "json",
        debug
    );
}
function fmtDownload(row, cell, value, columnDef, dataContext) {
    //console.log("row", row, dataContext);
    if (dataContext.FILE_PATH != "") {
        var text = "<input type=button value='Download' onClick='fnDownloadFile(\"" + row + "\")'>";
    } else {
        var text = "";
    }
    return text;
}
function fnDownloadFile(row) {
    var sgData = sgGridAttachFiles.getData().getItems();
    var BK_CD = sgData[Row].BK_CD;
    var FILE_KEY = sgData[row].FILE_KEY;
    var FILE_NAME = sgData[row].FILE_NAME;
    var FILE_NAME_ORG = sgData[row].FILE_NAME_ORG;
    var FILE_PATH = sgData[row].FILE_PATH;
    var JOIN_KEY = sgData[row].JOIN_KEY;
    console.log("FILE_KEY", FILE_KEY);
    console.log("isIE : ", top.isIE);

    var url =
        "/SASStoredProcess/do?_program=" +
        "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.downloadFile(StoredProcess)";
    rul += "&branch=" + BK_CD + "$FILE_KEY=" + FILE_KEY + "&JOIN_KEY=" + JOIN_KEY;
    //$("#fileDown").prop("src",rul);
    if (top.isIE) {
        $("#fileDown").attr("src", url);
    } else {
        var decFileName = decodeURI(FILE_NAME_ORG);
        console.log("decFileName : " + decFileName);
        var link = document.createElement("a");
        link.href = url;
        link.target = "_self";
        link.download = decFileName;
        document.body.append(link);
        link.click();
        //link.remove();
        window.URL.revokeObjectURL(url);
    }
}
function cbGetAttachFiles(data) {
    console.log("setSlickGird :\n");
    //qryCnt=0;
    //curRow="";
    $("$sasGridAttachFiles").show();
    var dataView = new setSlickGrid.Data.DataView();

    var sasJsonRes = data[0];

    var columns = [];
    var checkboxSelector = new setSlickGrid.CheckboxSelectColumn({
        cssClass: "Slick-cell-checkboxsel",
    });
    var options = sasJsonRes["Options"][0];

    var isChk = options.chkBox;
    if (isChk) {
        columns.push(checkboxSelector.getColumnDefinition());
        columns = $.extend(sasJsonRes["ColumnInfo"], columns);
    }
    columns = sasJsonRes["ColumInfo"];
    for (ii in columns) {
        if (columns[ii].id == "FILE_PATH") {
            columns[ii].formatter = fmtDownload;
        }
    }
    //columns[4].editor=eval("HierEditor");

    console.log("columns", columns);
    console.log("options \n" + JSON.stringify(options));

    var sgData = [];
    saData = sasJsonRes["SASResult"];
    for (ii in sgData) {
        var objTemp = $.extend(sgData[ii], eval({ id: ii }));
    }
    console.log("sgData", sgData);

    sgGridAttachFiles = new Slick.Grid("#sasGridAttachFiles", dataView, columns, options);
    dataView.onRowCountChanged.subscribe(function (e, args) {
        sgGridAttachFiles.updateRowCount();
        sgGridAttachFiles.render();
    });
    dataView.onRowCountChanged.subscribe(function (e, args) {
        sgGridAttachFiles.invalidateRows(args.rows);
        sgGridAttachFiles.render();
    });
    sgGridAttachFiles.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
    if (isChk) {
        sgGridAttachFiles.registerPlugin(checkboxSelector);
    }
    sgGridAttachFiles.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
    sgGridAttachFiles.onClick.subscribe(function (e, args) {
        curRow2=args.grid.getDataItem(args, row);
    });
    sgGridAttachFiles.onDblClick.subscribe(function (e, args) {
        console.log("[CDD] - onDblClick");
        curRow2=args.grid.getDataItem(args.row);
        //fnOpenArticle(curRow);
    });
    sgGridAttachFiles.onSort.subscribe(function (e, args) {
        var comparer = function (a, b) {
            return a[args,sortCol.field] > b[args.sortCol.field] ? 1 : -1;
        };
        dataView.sort(comparer, args.sortAsc);
    });
    dataView.beginUpdate();
    dataView.setItems(sgData);
    dataView.endUpdate();
    $(".spHeader:last").height($("#dvAttachW").height());
    $("#dvAttach").html("");
    $("#progressIndicatorWIP").hide();
}
function fnConfirmUpdateArticle() {
    var content = editor.getValue();
    console.log("content", editor.getValue());

    isHideBG = false;
    if ($("#iptTitle").val() == "") {
        alertMsg("Please, input the Title...");
        return;
    }
    if (content == "") {
        alertMsg("Please, Input the content...");
        return;
    }
    isHideBG = false;
    confirmMsg("Are you sure you want to update?", "cbConfirmUpdateArticle");
}
function cbConfirmUpdateArticle() {
    $("#progressIndicatorWIP").show();
    $("button").prop("disabled", true);

    //"SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.updateArticle(StoredProcess)",

    var from = $("#fomUpload")[0];
    var update = new FormData(form);
    update.append("BRANCH", curRow.BK_CD);
    update.append("BK_CD", curRow.BK_CD);
    update.append("BOARD_ID", BOARD_ID);
    update.append("ARTICLE_ID", curRow.ARTICLE_ID);

    var artTitle = encodeURIComponent(curRow.ARTICLE_TITLE);
    var artContent = editor.getValue();
    artContent2 = encodeURIComponent(artContent);
    //update.append("ARTICLE_TITLE", artTitle);
    update.append("ARTICLE_CONTENT", artContent2);
    update.append("ARTICLE_OWNER", userID);

    sgData = sgGridAttachFiles.getData().getItems();
    update.append("ATTACH_INFO", JSON.stringify(sgData));
    update.append(
        "_program",
        "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.updateArticle(StoredProcess)"
    );

    $.ajax({
        enctype: "multipart/form-data",
        type: "post",
        url: "/SASStoredProcess/do",
        dataType: "json",
        data: update,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 6000000,
        beforeSend: function (xhr, setting) {
            $("#progressIndicatorWIP").show();
        },
        success: function (data) {
            $("button").prop("disabled", false);
            console.log(data);
            cbRegistArticle(data);
        },
        complete: function (data) {
            isRun = 0;
            tParams = eval("[{}]");
            submitSTP();
            $("#progressIndicatorWIP").hide();
            $("#dvArticle").dialog("close");
            $("#dvBG").hide();
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:" + status + ": xhr: " + xhr + "error: " + error);
            alert("cbConfirmRegistArticle", error);
        },
    });
}
function cbUpdateArticle(data) {
    $("#dvArticle").dialog("close");
    $("button").prop("disabled", false);
    submitSTP();
    isHideBG = true;
    alertMsg(data[0].msg);
}
function fnExecuteCode() {
    pgms = editor.getValue();
    console.log("pgms", pgms);
    var selectedPGM = editor.getSelection();
    console.log("selectedPGM", selectedPGM);

    tParams.pgm = encodeURIComponent(selectedPGM);
    //execAjax("","SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.executeCode(StoredProcess)")
    var update = new FormData();
    update.append(
        "_program",
        "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.executeCode(StoredProcess)"
    );
    update.append("pgm", encodeURIComponent(selectedPGM));
    $.ajax({
        enctype: "multipart/form-data",
        type: "post",
        url: "/SASStoredProcess/do",
        _program: "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.executeCode(StoredProcess)",
        dataType: "json",
        data: update,
        processData: false,
        contentType: false,
        caches: false,
        timeout: 6000000,
        success: function (data) {
            cbExecuteCode(data);
        },
        complete: function (data) {},
        error:function (xhr, status, error) {
            console.error("ERROR: Status:", status, "xhr: ", xhr, "error: ", error);
        },
    });
}
function cbExecuteCode(data) {
    //console.log("LOGS : ", data);
    for (ii in data) {
        console.log("SASLOG: " + data[ii].msg);
    }
}
function fnConfirmDelete() {
    var selectedIndexes = sgGrid.getSelectedRows().sort().reverse();
    console.log("selectedIndexes", selectedIndexes);

    if (selectedIndexes.length == 0) {
        isHideBG = true;
        alertMsg("Please, Select the article...");
        return;
    }
    var sgData = sgGrid.getData().getItems();
    /* 2022-05-10 : 김광원 과장 요청 사항
    existGB = 0;
    for (ii in selectedIndexes) {
        if (sgData[selectedIndexes[ii]].BK_CD == "GB") existGb++;
    }
    if (existGB > 0) {
        isHideBG = true;
        alertMsg("The article registered by HQ cannot be deleted.");
        return;
    }
    */
   existO = 0;
   for (ii in selectedIndexes) {
        console.log("sgData[selectedIndexes[ii]].REG_USER", sgData[selectedIndexes[ii]].REG_USER, userID);
        if (sgData[selectedIndexes[ii]].REG_USER != userID) exist0++;
   }
   if (existO > 0) {
       isHideBG = true;
       alertMsg("You can only delete the article you have created.");
       return;
   }
   isHideBG = false;
   confirmMsg("Are you sure you want to delete?", "cbConfirmDelete");
}
function cbConfirmDelete() {
    var selectedIndexes = sgGrid.getSelectedRows().sort().reverse();
    console.log("selectedIndexes : " + selectedIndexes);
    var sgData = sgGird.getData().getItems();
    var ARTICLE_IDs = "";
    for (ii in selectedIndexes) {
        tParams = eval("[{}]");
        ARTICLE_IDs += "," + sgData[selectedIndexes[ii]].ARTICLE_ID;
    }
    console.log("ARTICLE_IDs : ", ARTICLE_IDs);
    tParams["BK_CD"] = $("#sltbranch").val();
    tParams["BOARD_ID"] = BOARD_ID;
    tParams["ARTICLE_ID"] = ARTICLE_IDs.substring(1);
    console.log("[tParams : ", tParams);
    execAjax(
        "",
        "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.deleteArticle(StoredProcess)",
        true,
        "cbDeleteArticle",
        "json",
        debug
    );
}
function cbDeleteArticle(data) {
    submitSTP();
    isHideBG = true;
    alertMsg(data[0].msg);
}
