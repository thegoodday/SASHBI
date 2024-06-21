
$(document).ready(function () {
    //$("#dvToolBar").html("");
    $("#dvToolBar").append("<input type=button value='등록' id=btnDelete class=condBtn onclick='fnRegistArticle();'>");
    $("#dvToolBar").append("<input type=button value='삭제' id=btnDelete class=condBtn onclick='fnConfirmDelete();'>");

    $(".hadDatepicker").width(90);
    $(".hasDatepicker").css("text-align", "left");

    //$("#sltgrpLevel").val(grpLevel1);

    //commonBkCdInit('notiBoard');

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
    if (sgGrid != undefined) {
        sgGrid.resizeCanvas();
    }
}
/*
function resizeMain() {
    $("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
    $("#sasGird").width(eval($(window).width()-30));
    //$(".slick-viewport").height(eval($("#sasGrid").height()-5));
    if (sgGrid!=undefined) {
        sgGrid.resizeCanvas();
    }
    $(".spHeader:last").height($("#dvAttachW").height());
}
*/
function setSlickGrid(data) {
    console.log("setSlickGrd :\n");	
    console.log("userID", userID);
    console.log("tParams",tParams );

    qryCnt = 0;
    curRow = "";
	$("#sasGrid").show();
	var dataView = new Slick.Data.DataView();

	//var sasJsonRes=eval (data)[0];
	var sasJsonRes = data[0];

	var columns = [];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
		cssClass: "slick-cell-checkboxsel"
	});
	var options = sasJsonRes["Options"][0];

	var isChk = options.chkBox;
	if (isChk) {
		columns.push(checkboxSelector.getColumnDefinition());
		columns = $.extend(sasJsonRes["ColumInfo"], columns);;
	}
	columns = sasJsonRes["ColumInfo"];
	for (var ii in columns) {
		console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter = eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor = eval(columns[ii].editor);
	}
	console.log("columns", columns);
	console.log("options", options);
	var sessionInfo = [];
	sessionInfo = sasJsonRes["SessionInfo"][0];
	nstp_sessionid = sessionInfo["nstp_sessionid"];
	stp_sessionid = nstp_sessionid;
	save_path = sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML = data;
	//console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	//console.log("nstp_sessionid: \n" + nstp_sessionid);
	//console.log("save_path: \n" + save_path);

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for (ii in sgData) {
		var objTemp = $.extend(sgData[ii], eval({ "id": ii }));
	}
	console.log("sgData", sgData);
	//dataView.setItems(sgData);	

	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
	if (isChk) {
		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
	sgGrid.onSort.subscribe(function (e, args) {
		var comparer = function (a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid.onClick.subscribe(function (e, args) {
		var item = args.item;
	});
	sgGrid.onDblClick.subscribe(function (e, args) {
		var cell = sgGrid.getCellFromEvent(e);
        curRow = args.grid.getDataItem(args.row);
        fnOpenArticle(curRow);
	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress = 0;
		item = $.extend({}, item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);
	})
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();
	$("#sasGrid").height(eval($(window).height() - $("#dvCondi").height() - 75));
	$("#sasGrid").width(eval($(window).width() - 30));
	if (sgGrid != undefined) {
		sgGrid.resizeCanvas();
	}
	$("#progressIndicatorWIP").hide(); 
    $("#dvToolBar").show();   
}
function fnConfirmRegistArticle() {
    var content = editor.getValue();
    console.log("content", editor.getValue());

    inHideBG = false;
    if ($("#iptTitle").val() == "" || $("#iptTitle").val().replace(/ /g, "") == "") {
        alertMsg("반드시, 제목을 입력해 주십시오!");
        return;
    }
    if (content == "" || content.replace(/ /g, "") == "") {
        alertMsg("반드시, 내용을 입력해 주십시오!");
        return;
    }
    isHideBG = false;
    confirmMsg("정말 저장을 원하십니까?", "cbConfirmRegistArticle");
}
function cbConfirmRegistArticle() {
    $("#progressIndicatorWIP").show();
    $("button").prop("disabled", true);

    var form = $("#fomUpload") [0];
    var updata = new FormData(form);
    //updata.append("BRANCH", $("#sltbranch").val()=="" ? "GB" : $("#sltbranch").val());
    updata.append("board_id", board_id);
    updata.append("parent_id", 0);

    var artTitle = $("#iptTitle").val();
    console.log("artTitle : ", artTitle);
    artTitle2 = encodeURIComponent(artTitle);
    console.log("artTitle2 : ", artTitle2);
    var artContent = editor.getValue(); 
    artContent2 = encodeURIComponent(artContent);
	var blob = new Blob([artContent], {type: 'text/plain'});
	updata.append("article", blob, "__article__.txt");
    updata.append("ARTICLE_TITLE", artTitle2);
    updata.append("ARTICLE_CONTENT", artContent2);
    updata.append("ARTICLE_OWNER", userID);

    //updata.append("charset", "euc-kr");
    updata.append(
        "_program",
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/02.Board_um/stg_registArticle(StoredProcess)"
    );

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
    $("input[type='file']:last").click();
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
    newRow.file_name_org = new_file;
    newRow.file_path = "";

    dataView.beginUpdate();
    dataView.addItem(newRow);
    dataView.endUpdate();
}
/*
    var dataView = sgGridTraning.getData();
    if (curRow2 != undefined || curRow2 != "") {
        var item = curRow2;
        if (item) dataview.deleteItem(item.id); 
    };
    sgGridTraning.invalidate();
    sgGridTraning.render();
    sgGridTraning.setSelectedRows([]);
*/
function fnDeleteAttach() {
    var title = $("#iptTitle").val();
    console.log("title in fnDeleteAttach", title);

    var dataView = sgGridAttachFiles.getData();
    var sgData = dataView.getItems();
    console.log("sgData", JSON.stringify(sgData));
    console.log("currow2 in fnDeleteAttach", curRow2);
    if (curRow2 == undefined || curRow2 == ""){
        alertMsg("반드시, 삭제할 파일을 선택해 주십시오!");
        return;
    }
    file_name_org = curRow2.file_name_org;
    console.log("file_name_org : ", file_name_org);
    $("#dvAttach input[type='file']").each(function () {
        orgFilename = $(this)[0].files[0].name;
        if (file_name_org == orgFilename) $(this).remove();
    });
    //tParams.BK_CD = curRow2.BK_CD;
    tParams.file_key = curRow2.file_key;
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
    //curRow.BK_CD = $("#sltbranch").val();

    getAttachFiles(curRow);
    $("#tdTitle").html('<input type=text id=iptTitle size=20 style="width:500px;" maxlength="100">');
    $("#iptTitle").val("");
    $("#iptTitle").prop("readonly", false);
    console.log("userID", userID);
    $("#tdRegistrant").html(userID);
    $(".CodeMirror-line").html("");

    $("#dvAttach").html("");

    $("#dvArticle").dialog({
        title: "New Article",
        width: 855,
        maxHeight: 670,
        closeText: "X",
        close: function () {
            $("#dvBG").hide();
            close();
        },
        buttons: [
            {
                text: "저장",
                id: "btnDialogSave",
                click: function () {
                    fnConfirmRegistArticle();
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
    //tParams.BK_CD = curRow.BK_CD;
    //tParams.BRANCH = curRow.BK_CD;//"GB";
    tParams=eval('[{}]');
    tParams.board_id =  board_id;
    tParams.article_id = curRow.article_id;
    tParams.view_cnt = curRow.view_cnt;
    isHideBG = false;
    console.log("tParams", tParams );
    execAjax(
        "",
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/01.updateViewCnt(StoredProcess)",
        true,
        "cbUpdateViewCnt",
        "json",
        debug
    );
    /*
    */
}
function cbUpdateViewCnt(data) {
    console.log("cbUpdateViewCnt", data);
}
function getAttachFiles(rowInfo) {
    console.log("rowInfo.article_id : ", rowInfo.article_id);
    if (rowInfo.article_id == undefined) {
        rowInfo.article_id = 0;
        tParams.from = "";
    } else {
        tParams.from = "";
    }
    //tParams.BK_CD = rowInfo.BK_CD;
    tParams.article_id = rowInfo.article_id;
    isHideBG = false;
    console.log("tParams", tParams );
    execAjax(
        "",
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/02.Board_um/stg_getAttachFiles(StoredProcess)",
        true,
        "cbGetAttachFiles",
        "json",
        debug
    );
}
function fmtDownload(row, cell, value, columnDef, dataContext) {
    //console.log("row", row, dataContext);
    if (dataContext.file_path != "") {
        var text = "<input type=button value='Download' onClick='fnDownloadFile(\"" + row + "\")'>";
    } else {
        var text = "";
    }
    return text;
}
function fnDownloadFile(row) {
    var sgData = sgGridAttachFiles.getData().getItems();
    //var BK_CD = sgData[Row].BK_CD;
    var file_key = sgData[row].file_key;
    var file_name = sgData[row].file_name;
    var file_name_org = sgData[row].file_name_org;
    var file_path = sgData[row].file_path;
    var join_key = sgData[row].join_key;
    console.log("file_key", file_key);
    console.log("isIE : ", top.isIE);

    var url =
        "/SASStoredProcess/do?_program=" +
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/02.Board_um/stg_downloadFile(StoredProcess)";
    //url += "&branch=" + BK_CD + "$file_key=" + file_key + "&join_key=" + join_key;
    url += "&file_key=" + file_key + "&join_key=" + join_key;
    //$("#fileDown").prop("src",rul);
    if (top.isIE) {
        $("#fileDown").attr("src", url);
    } else {
        var decFileName = decodeURI(file_name_org);
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
    $("#sasGridAttachFiles").show();
    var dataView = new Slick.Data.DataView();

    var sasJsonRes = data[0];

    var columns = [];
    var checkboxSelector = new Slick.CheckboxSelectColumn({
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
        if (columns[ii].id == "file_path") {
            columns[ii].formatter = fmtDownload;
        }
    }
    //columns[4].editor=eval("HierEditor");

    console.log("columns", columns);
    console.log("options \n" + JSON.stringify(options));

    var sgData = [];
    sgData = sasJsonRes["SASResult"];
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
        curRow2=args.grid.getDataItem(args.row);
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

function fnConfirmThread() {
    var content = editor.getValue();
    console.log("content", editor.getValue());

    isHideBG = false;
    if ($("#iptTitle").val() == "") {
        alertMsg("반드시, 제목을 입력해 주십시오!");
        return;
    }
    if (content == "") {
        alertMsg("반드시, 내용을 입력해 주십시오!");
        return;
    }
    isHideBG = false;
    confirmMsg("정말 저장을 원하십니까?", "cbConfirmThread");
}
function cbConfirmThread(){
    $("#progressIndicatorWIP").show();
    $("button").prop("disabled", true);

    console.log("curRow in cbConfirmThread", curRow);

    var form = $("#fomUpload") [0];
    var updata = new FormData(form);
    updata.append("board_id", board_id);
    updata.append("parent_id", curRow.article_id);

    //var artTitle = "Re: " + $("#iptTitle").val();
    var artTitle = "Re: " + curRow.article_title;
    console.log("artTitle : ", artTitle);
    artTitle2 = encodeURIComponent(artTitle);
    console.log("artTitle2 : ", artTitle2);
    var artContent = editor.getValue(); 
    artContent2 = encodeURIComponent(artContent);
	var blob = new Blob([artContent], {type: 'text/plain'});
	updata.append("article", blob, "__article__.txt");
    updata.append("ARTICLE_TITLE", artTitle2);
    updata.append("ARTICLE_CONTENT", artContent2);
    updata.append("ARTICLE_OWNER", userID);

    //updata.append("charset", "euc-kr");
    updata.append(
        "_program",
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/02.Board_um/stg_registArticle(StoredProcess)"
    );

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
function fnConfirmUpdateArticle() {
    var content = editor.getValue();
    console.log("content", editor.getValue());

    isHideBG = false;
    if ($("#iptTitle").val() == "") {
        alertMsg("반드시, 제목을 입력해 주십시오!");
        return;
    }
    if (content == "") {
        alertMsg("반드시, 내용을 입력해 주십시오!");
        return;
    }
    isHideBG = false;
    confirmMsg("정말 수정하기를 원하십니까?", "cbConfirmUpdateArticle");
}
function cbConfirmUpdateArticle() {
    $("#progressIndicatorWIP").show();
    $("button").prop("disabled", true);

    //"SBIP://METASERVER/NHAML/00.Environments/StoredProcess/06.Board/01.updateArticle(StoredProcess)",

    var form = $("#fomUpload")[0];
    var update = new FormData(form);
    //update.append("BRANCH", curRow.BK_CD);
    //update.append("BK_CD", curRow.BK_CD);
    update.append("board_id", board_id);
    update.append("article_id", curRow.article_id);

    var artTitle = encodeURIComponent(curRow.article_title);
    var artContent = editor.getValue();
    artContent2 = encodeURIComponent(artContent);
    //update.append("ARTICLE_TITLE", artTitle);
    update.append("ARTICLE_CONTENT", artContent2);
    update.append("ARTICLE_OWNER", userID);

    sgData = sgGridAttachFiles.getData().getItems();
    update.append("ATTACH_INFO", JSON.stringify(sgData));
    update.append(
        "_program",
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/02.Board_um/stg_updateArticle(StoredProcess)"
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
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/01.executeCode(StoredProcess)"
    );
    update.append("pgm", encodeURIComponent(selectedPGM));
    $.ajax({
        enctype: "multipart/form-data",
        type: "post",
        url: "/SASStoredProcess/do",
        _program: "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/01.executeCode(StoredProcess)",
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
        alertMsg("반드시, 삭제하실 글을 선택해 주십시오!");
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
    exist0 = 0;
   for (ii in selectedIndexes) {
        console.log("sgData[selectedIndexes[ii]].reg_user", sgData[selectedIndexes[ii]].reg_user, userID);
        if (sgData[selectedIndexes[ii]].reg_user != userID) exist0++;
   }
   if (exist0 > 0) {
       isHideBG = true;
       alertMsg("You can only delete the article you have created.");
       return;
   }
   isHideBG = false;
   confirmMsg("삭제해도 후회하지 않으시겠습니까?", "cbConfirmDelete");
}
function cbConfirmDelete() {
    var selectedIndexes = sgGrid.getSelectedRows().sort().reverse();
    console.log("selectedIndexes : " + selectedIndexes);
    var sgData = sgGrid.getData().getItems();
    var article_ids = "";
    tParams = eval("[{}]");
    for (ii in selectedIndexes) {
        article_ids += "," + sgData[selectedIndexes[ii]].article_id;
    }
    console.log("article_ids : ", article_ids);
    //tParams["BK_CD"] = $("#sltbranch").val();
    tParams["board_id"] = board_id;
    tParams["article_id"] = article_ids.substring(1);
    console.log("[tParams : ", tParams);
    execAjax(
        "",
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/02.Board_um/stg_deleteArticle(StoredProcess)",
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

function closeArticle() {
    alert("Really, Cancel?");
}