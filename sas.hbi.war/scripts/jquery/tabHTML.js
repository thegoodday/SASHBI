let gridTabsH, rsltH, titleH, footerOH;
$(document).ready(function(){
    $("#btnUpload").on("click", function(){confirmUploadFile()});
    $("#btnDelete").on("click", function(){deleteRowOnGrid()});
    $("#btnSave").on("click", function(){confirmSaveData()});
});
$(window).resize(function(){
    resizeGrid();
});
function resizeGrid(){
    $("#dvRes").hide();
    isFooterVisible = $("#dvFooter").is(":visible");
    footerH = $("#dvFooter").height();
    footerOH = $("#dvFooter").outerHeight();
    //
    if (!isFooterVisible) footerOH = 0;
    rsltH = $("#dvRslt").height();
    titleH = $("#dvTitle").outerHeight();
    if (titleH > 0 ) titleH += 5;
    //
    //
    //
    gridTabsH = rsltH - titleH - footerOH - 0;                                  // koryhh : result Height
    // console.log("gridTabsH", gridTabsH, rsltH, titleH, footerOH);
    $("#Gridtabs").height(gridTabsH);
    // ulH = $("#Gridtabs ul").outerHeight();
    // if (ulH == undefined) ulH = 40;
    // console.log("rsltH - titleH - ulH - footerOH", rsltH, titleH, ulH, footerOH );
    // sasResH = rsltH - titleH - ulH - footerOH - 0;
    // $(".sasRes").height(sasResH);                                               // koryhh : result Height
    //

    $(".sasRes").width($("#dvRslt").outerWidth() - 5);
    rsltOH = $("#dvRslt").outerHeight();
    //
    $(".sasRes").css("overflow", "auto");
    $(".sasRes").css("margin-bottom", "20px");
    //

    if ($("#Gridtabs").tabs("instance") != undefined) {
        activeTabID = $("#Gridtabs").tabs("option", "active");
        console.log("activeTabID", activeTabID);
        resizeTabHTML(activeTabID);
        //
    }

}
function resizeTabHTML(index){
    ulH = $("#Gridtabs ul").outerHeight();
    infoH = $(`#dvInfoTable${index}`).outerHeight();
    // console.log("rsltH - titleH - infoH - ulH - footerOH", rsltH, titleH, infoH, ulH, footerOH );
    sasResH = rsltH - titleH - infoH - ulH - footerOH - 10;
    $(`#sasRes${index}`).height(sasResH);                                               // koryhh : result Height

    dvDataW = $("#Gridtabs").outerWidth() - $(`#dvRowHeader${index}`).outerWidth() - 7;
    // console.log("dvDataW", dvDataW);
    $(`#dvColumnHeader${index}`).width(dvDataW);

    let dataHeight = eval(                                          // koryhh : height
        $("#Gridtabs").outerHeight() -
        $(`#dvInfoTable${index}`).outerHeight() -
        $(`#dvColumnHeader${index}`).height() -
        50
    );
    // console.log("dataHeight", dataHeight);
    $(`#dvRowHeader${index}`).height(dataHeight);
    // console.log("dataHeight", dataHeight);
    
    $(`#dvData${index}`).height(dataHeight);
    $(`#dvData${index}`).width(dvDataW);

    dataHeight = $(`#dvData${index} table`).height();
    dvDataHeight = $(`#dvData${index}`).height();
    $(".dvDataFooter").height(eval(dvDataHeight - dataHeight + 30));

    columnHeaderHeight = $(`#dvColumnHeader${index} table thead`).height();
    //    
}
function cbSubmit(res) {
    //
    $("#dvFooter").show();
    if (btnUpload) $("#btnUpload").show();
    if (btnDelete) $("#btnDelete").show();
    if (btnSave) {
        console.log("btnSave", btnSave);
        $("#btnSave").show();
    }
    // console.log("btnAddRow", btnAddRow);
    // console.log("btnAddRowCust", btnAddRowCust);
    // console.log("btnUpload", btnUpload);
    // console.log("btnDelete", btnDelete);
    // console.log("btnSave", btnSave);

    isAddRow = $("#btnAddRow").is(":visible");
    isAddRowCust = $("#btnAddRowCust").is(":visible");
    isbtnUpload = $("#btnUpload").is(":visible");
    isbtnDeletee = $("#btnDelete").is(":visible");
    isbtnSave = $("#btnSave").is(":visible");

    $("#dvRslt").css("overflow", "hidden");
    $("#dvRslt").css("margin-bottom", "20px");
    if ($("#Gridtabs").tabs("instance") != undefined) $("#Gridtabs").tabs("destroy");
    $("#Gridtabs").html("<ul class-'ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-state-default'></ul>");

    $("#dvRes2").html(res);
    $sasExcelHTML = res;

    $("#dvRes2 .branch").each(function(index){
        $(this).find("P").remove();
        $(this).find("HR").remove();
        console.log("$(this)", $(this));
        resType = "";
        isFrozen = "";
        isTable = $(this).find("table").attr("summary");
        tabTitle = $(this).find(".systemtitle").html();
        infoMsg = $(this).find(".systemtitle3").html();
        if (infoMsg == undefined || infoMsg == "&nbsp;") infoMsg = "";
        // console.log("object",$(this).find(".systemtitle4").html()+"=");
        if ($(this).find(".systemtitle4").html() != undefined && $(this).find(".systemtitle4").html() != "&nbsp;") infoMsg += "<br>" + $(this).find(".systemtitle4").html();
        if ($(this).find(".systemtitle5").html() != undefined && $(this).find(".systemtitle4").html() != "&nbsp;") infoMsg += "<br>" + $(this).find(".systemtitle5").html();
        if ($(this).find(".systemtitle10").html() != undefined) 
            isFrozen = $(this).find(".systemtitle10").html();
        console.log("tabTitle infoMsg:", tabTitle, infoMsg);
        if (tabTitle == "" || tabTitle == undefined) {
            tabTitle = `Output ${index}`;
        } else {
            $(this).find(".systitleandfootercontainer").remove();
        }
        content = $(this).html();
        // console.log("content", content);
        console.log("content length : ", content.length, threshold);

        if (content.length < threshold) {
            // console.log("length < threshold");
            $("#dvRes").html(content);
            if (isTable != undefined)
                resType = $("#dvRes table").attr("summary").substring(10, $("#dvRes table").attr("summary").indexOf(":"));
            if (isFrozen == "NOFROZEN") resType = isFrozen;
            console.log("isTable", isTable);
            console.log("resType", resType);
            // kk = ` class='ui-tabs-tab ui-corner-top ui-state-default ui-tab '`;
            $("#Gridtabs ul").append(`<li><a href='#tabCont${index}' id="tab${index}">${tabTitle}</a</li>\n`);
            if (resType == "Print" || resType == "Tabulate") {
                $("#Gridtabs").append(`
                    <div id='tabCont${index}' class='ui-tab-panel ui-corner-bottom ui-widget-content'>
                        <div id="dvInfoTable${index}" class="dvInfoMsg">${infoMsg}</div>
                        <div id="sasRes${index}" class="sasRes">
                            <table id=tblOutput border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td><div id=dvBox${index} > </div></td>
                                    <td vAlign=top><div id=dvColumnHeader${index} style='overflow-x:hidden'></div></td>
                                </tr>
                                <tr>
                                    <td><div id=dvRowHeader${index} style='overflow-y:hidden'></div></td>
                                    <td valign=top><div id=dvData${index} style='overflow:scroll'></div></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                `);
            } else {
                console.log("not Table!!!!");
                $("#Gridtabs").append(`
                    <div id='tabCont${index}' class='ui-tab-panel ui-corner-bottom ui-widget-content'>
                        <div id="dvInfoTable${index}" class="dvInfoMsg">${infoMsg}</div>
                        <div id="sasRes${index}" class="sasRes">
                        ${content}
                        </div>
                    </div>
                `);
            }
        } else {
            console.log("length < threshold", content.length < threshold);
            $("#Gridtabs ul").append(`<li class='ui-tabs-tab ui-corner-top ui-state-default ui-tab '><a href='#tabCont${index}' id="tab${index}">${tabTitle}</a></li>\n`);
            $("#Gridtabs").append(`
                <div id'tabCont${index}' class='ui-tabs-panel ui-corner-bottom ui-widget-content'>
                    <div id="sasRes${index}" class="sasRes">
                    ${content}
                    </div>
                </div>
            `);
            $(`#sasRes${index}`).width(1000000);
            tabWidth = $(`#sasRes${index} table`).width();
            console.log("tabWidth", index, tabWidth);
            $(`#sasRes${index}`).width(tabWidth + 100);
            $(`#sasRes${index} table`).width(tabWidth);

        }
        if (content.length < threshold) renderTabular(index);
    });
    
    buttons = `<li style="float: right;font-size: 13px;">`;
    if (btnAddRow) buttons +=`<input type=button id="btnAddRow" class="btn_basic" value="행추가" title="행추가" onclick="addRow();" style="margin:0px 2px;font-size:11px;position:relative;bottom:5px;padding:3px 10px;">`;
    if (btnAddRowCust) buttons +=`<input type=button id="btnAddRowCust" class="btn_basic" value="행추가" title="행추가" onclick="addRow();" style="margin:0px 2px;font-size:11px;position:relative;bottom:5px;padding:3px 10px;">`;
    buttons +=`</li>`;
    $("#Gridtabs ul").append(buttons);

    $("#Gridtabs").tabs({
        activate: (event, ui)=>{
            targetID =ui.newPanel[0].id;
            tableID =targetID.substring(7);
            console.log("targetID", targetID, tableID);
            resizeTabHTML(tableID);
        }
    });
    $("#dvRes2").html("");
    if (typeof submitSTPAfter == "function"){
        submitSTPAfter(res);
    }
    resizeGrid();
}
function renderTabular(index){
    console.log("renderTabular", index);
    $("#dvRes").width(1000000);
    $("#dvRes").show();

    resTableW = $("#dvRes table").outerWidth();
    // console.log("resTableW", resTableW);
    if (resTableW == undefined) return;

    //

    $(`#dvBox${index}`).css("margin", "0 0 0 0");
    $(`#dvColumnHeader${index}`).css("margin", "0 0 0 0");
    $(`#dvRowHeader${index}`).css("margin", "0 0 0 0");
    $(`#dvData${index}`).css("margin", "0 0 0 0");

    $(`#dvBox${index}`).css("padding", "0 0 0 0");
    $(`#dvColumnHeader${index}`).css("padding", "0 0 0 0");
    $(`#dvRowHeader${index}`).css("padding", "0 0 0 0");
    $(`#dvData${index}`).css("padding", "0 0 0 0");


    let rowHeaderWidth = 0;
    let boxHeight = 0;
    let columnHeaderWidth = 0;
    let columnHeaderHeight = 0;

    let $columnHeader = `<table class=table cellspacing=0 cellpadding=5 rules=all frame=box style="width:${resTableW}px">`;
    $columnHeader += "<thead>" + $("#dvRes table thead ").html() + "</thead></table>";
    // console.log("#dvRes table summary : ", $("#dvRes table").attr("summary").length, $("#dvRes table").attr("summary"));
    resType = $("#dvRes table").attr("summary").substring(10, $("#dvRes table").attr("summary").indexOf(":"));
    console.log("resType : ", resType);


    $(`#dvBox${index}`).html($columnHeader);
    // console.log("$columnHeader", $columnHeader);
    // $(`#dvBox${index} th:gt(0)`).remove();

    let $rowHeader = "<table id=rowHeaderTable class=table cellspacing=0 cellpadding=5 rules=all frame=box>";
    $rowHeader += $("#dvRes table tbody ").html() + "</table>";
    $(`#dvRowHeader${index}`).html($rowHeader);
    $(`#dvRowHeader${index} .data`).remove();
    rowHeaderCount = $(`#dvRowHeader${index} tbody tr:first th`).length - 1;
    // console.log("rowHeaderCount", rowHeaderCount);
    if (resType == "Print"){
        $(`#dvBox${index} th:gt(${rowHeaderCount})`).remove();
    } else {
        $(`#dvBox${index} th:gt(0)`).remove();
    }

    $(`#dvColumnHeader${index}`).html($columnHeader);
    // console.log("#dvColumnHeader", $(`#dvColumnHeader${index}`).html());
    if (resType == "Print"){
        $(`#dvColumnHeader${index} th:lt(${rowHeaderCount+1})`).remove();
    } else {
        $(`#dvColumnHeader${index} th:eq(0)`).remove();
    }
    
    let $tbData = `<table id=dataTable class=table cellspacing=0 cellpadding=5 rules=all frame=box style="width:${resTableW}px">`;
    $tbData += "<thead>" + $("#dvRes table thead ").html() + "</thead>";
    $tbData += "<tbody>" + $("#dvRes table tbody ").html() + "</tbody></table>";
    // console.log("$tbData", $tbData);
    $(`#dvData${index}`).html($tbData);
    $(`#dvData${index} .rowheader`).remove();
    $(`#dvData${index} table thead th:first`).remove();
    $(`#dvData${index} table thead th`).css("padding-top", "0px");
    $(`#dvData${index} table thead th`).css("padding-bottom", "0px");
    if (resType == "Print"){
        columnHeaderCnt = $(`#dvColumnHeader${index} thead tr:first th`).length;
        dataHeaderColumnCnt = $(`#dvData${index} thead tr:first th`).length;
        console.log("columnHeaderCnt:dataHeaderColumnCnt", columnHeaderCnt, dataHeaderColumnCnt);
        if (columnHeaderCnt != dataHeaderColumnCnt)
        $(`#dvData${index} thead th:lt(${rowHeaderCount+1})`).remove();
    } else {
        // $(`#dvData${index} thead th:eq(0)`).remove();
    }

    $(`#dvColumnHeader${index} table`).append("<tbody>" + $(`#dvData${index} table tbody`).html() + "</tbody>");
    columnHeaderHeight = $(`#dvColumnHeader${index} table thead`).height();
    //
    $(`#dvColumnHeader${index}`).height(columnHeaderHeight);

    //
    //

    $(`#dvData${index} table thead th`).each(function(){
        $(this).html("");
    });
    $(`#dvData${index} table thead tr`).height(0);
    $(`#dvData${index} table thead th`).height(0);


    //

    $("#dvRes tbody tr:first .rowheader").each(function(){
        rowHeaderWidth += $(this).width() + 15;
    });
    rowHeaderWidth += 1;
    $(`#dvBox${index}`).width(rowHeaderWidth);
    // console.log("rowHeaderWidth", rowHeaderWidth);
    // console.log("dvBox Width:", $(`#dvBox${index}`).width());
    if (rowHeaderWidth == 1) $(`#dvBox${index}`).hide();

    $(`#dvData${index} thead .header`).css("border-color","#f2f2f2");
    $(`#dvData${index} thead tr:last .header`).css("border-bottom-color","#B0B7BB");
    $(`#dvData${index} thead tr:first th`).each(function(){
        rs = $(this).attr("rowspan");
        if (rs != undefined && rs > 1){
            $(this).css("border-bottom-color", "#B0B7BB");
        }
    });

    let dataHeight = eval(
        $("#Gridtabs").outerHeight() -
        $(`#dvColumnHeader${index}`).height() -
        50    
    );

    $(`#dvRowHeader${index}`).height(dataHeight);
    //
    $(`#dvRowHeader${index}`).width(10000);
    rowHeaderTableW = $(`#dvRowHeader${index} table`).width();
    $(`#dvRowHeader${index}`).width(rowHeaderTableW);
    
    $(`#dvBox${index} table`).height(columnHeaderHeight);
    $(`#dvBox${index}`).width($(`#dvRowHeader${index}`).width());
    $(`#dvBox${index} table`).width($(`#dvRowHeader${index}`).width());
    
    $(`#dvBox${index} table`).width($(`#dvBox${index}`).width());
    $(`#dvBox${index}`).height($(`#dvColumnHeader${index} table thead`).height());

    rowHeaderHeight = $(`#dvRowHeader${index}`).height();
    columnHeaderWidth = $(`#dvColumnHeader${index}`).width();
    $(`#dvData${index}`).height(dataHeight);
    //
    //
    //
    dvDataW = $("#Gridtabs").outerWidth() - $(`#dvRowHeader${index}`).outerWidth() - 7;
    $(`#dvColumnHeader${index}`).width(dvDataW);
    $(`#dvData${index}`).width(dvDataW);
    $(`#dvColumnHeader${index}`).css("overflow-y", "scroll");
    $(`#dvRowHeader${index}`).css("overflow-y", "hidden");
    $(`#dvRowHeader${index}`).css("overflow-x", "scroll");
    $(`#dvData${index}`).css("overflow-x", "scroll");

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
    dvDataHeadH = $(`#dvData${index} thead`).height();
    $(`#dvData${index}`).scrollTop(dvDataHeadH);
    $(`#dvData${index}`).scroll(function(){
        if ($(this).scrollTop() < dvDataHeadH){
            $(this).scrollTop(dvDataHeadH);
        }
        $(`#dvColumnHeader${index}`).scrollLeft($(this).scrollLeft());
        $(`#dvRowHeader${index}`).scrollTop($(this).scrollTop()-dvDataHeadH);
        if ($(this).scrollLeft() > $(`#dvColumHeader${index}`).scrollLeft()) {
            $(this).scrollLeft($(`#dvColumnHeader${index}`).scrollLeft());
        }
    });
    $(`#dvRowHeader${index}`).scroll(function(){
        $(this).scrollLeft(0);
    });
    $(`#dvColumnHeader${index}`).scroll(function(){
        $(this).scrollTop(0);
    });
    columnHeaderHeight = $(`#dvColumnHeader${index} table thead`).height();
    //

    $(`#dvData${index} tr:odd`).find("td").addClass("dataStripe");
    $(`#dvData${index} tr`).mouseover(function(){
        $(this).find("td").addClass("curRow");
    });
    $(`#dvData${index} tr`).mouseout(function(){
        $(this).find("td").removeClass("curRow");
    });
    
}


function mergeCol() {
    $("#dvData table.table tbody tr").each(
        function() {
            var headerObjects = $(this).children("th.rowheader[scope='row']");
            var dataObjects = $(this).children("td.data");
            var totalHeaderCount = headerObjects.length;

            var startIndex = -1;
            var colspanCount = 0;

            ////console.log("totalHeaderCount:"+ headerObjects[0]);

            for(var i = 0; i < totalHeaderCount; i++) {
                var innerText = $.trim( $(headerObjects[i]).text() );

                if(
                    (
                        innerText === '[계]' ||
                        innerText === '[총계]' ||
                        innerText === '[전사계]' ||
                        innerText === '[지사계]' ||
                        innerText === '[지점계]' ||
                        innerText === '[센터계]' ||
                        innerText === '[협력사계]' ||
                        innerText === '[모GPA계]' ||
                        innerText === '[자GPA계]' ||
                        innerText === '[참조1]'  ||  
                        innerText === '[참조2]'  ||
                        innerText === '[참조A1]' || 
                        innerText === '[참조A2]' ||
                        innerText === '[참조A3]' ||
                        innerText === '[참조B1]' || 
                        innerText === '[참조B2]' ||
                        innerText === '[참조B3]' 
              
                    ) && startIndex == -1) {
                    startIndex = i;
                    colspanCount++;
                    $(headerObjects[i]).css("background-color", "#d0e2fa");
                    //$(headerObjects[i]).removeAttr("width");
                }
                else if(
                        innerText === '[계]' ||
                        innerText === '[총계]' ||
                        innerText === '[전사계]' ||
                        innerText === '[지사계]' ||
                        innerText === '[지점계]' ||
                        innerText === '[센터계]' ||
                        innerText === '[협력사계]' ||
                        innerText === '[모GPA계]' ||
                        innerText === '[자GPA계]' ||
                        innerText === '[참조1]'  ||  
                        innerText === '[참조2]'  ||
                        innerText === '[참조A1]' || 
                        innerText === '[참조A2]' ||
                        innerText === '[참조A3]' ||
                        innerText === '[참조B1]' || 
                        innerText === '[참조B2]' ||
                        innerText === '[참조B3]' 
                       
                           
                       ){
                    colspanCount++;
                    $(headerObjects[i]).css("background-color", "#d0e2fa");
						  //$(headerObjects[i]).removeAttr("width");
                }
            }

            if(colspanCount > 1) {
                for(var i = startIndex; i < totalHeaderCount; i++) {
                    if(i == startIndex) {
                        $(headerObjects[i]).attr("colspan", colspanCount);
                        if(colspanCount >= 5) {
                            $(headerObjects[i]).css("background-color", "#629ced");
                        }
                        else if(colspanCount == 4) {
                            $(headerObjects[i]).css("background-color", "#77a9ef");
                        }
                        else if(colspanCount == 3) {
                            $(headerObjects[i]).css("background-color", "#9cc1f4");
                        }
                        else if(colspanCount == 2) {
                            $(headerObjects[i]).css("background-color", "#bad4f7");
                        }
                        else if(colspanCount == 1) {
                            $(headerObjects[i]).css("background-color", "#d0e2fa");
                        }
                    }
                    else if(i > startIndex) {
                        $(headerObjects[i]).remove();
                    }
                }
            }

            if(colspanCount >= 5) {
                dataObjects.css("background-color", "#629ced");
            }
            else if(colspanCount == 4) {
                dataObjects.css("background-color", "#77a9ef");
            }
            else if(colspanCount == 3) {
                dataObjects.css("background-color", "#9cc1f4");
            }
            else if(colspanCount == 2) {
                dataObjects.css("background-color", "#bad4f7");
            }
            else if(colspanCount == 1) {
                dataObjects.css("background-color", "#d0e2fa");
            }
        }
    );
}

function uploadFile(){
    console.log("uploadFile");
    param = new Object();
    params = new Array();
    param = getParams(param, params);
    // console.log("param at saveData", param);

    form = $("#fomExcelUpload")[0];
    updata = new FormData(form);
    updata.append("_program", `${uploadPGM}(StoredProcess)`);
    
    for(ii in param){
        // console.log("params : ", ii, param[ii]);
        // updata.append(ii, param[ii]);
    }
    // updata.append("_debug", "log");
    execAjaxMultipart(updata, "setSlickGridDefault");
}
function confirmUploadFile(){
    console.log("confirmUploadFile");
    openUploadDialog(uploadFile);
}
function deleteRowOnGrid(){
    if (typeof deleteButtonCust == "function"){
        deleteButtonCust();
    } else {
        console.log("Define deleteButtonCust in _STPREPORT_HEADER_JS");
    }
}

function saveData(){
    if (typeof saveDataCust == "function"){
        saveDataCust();
    } else {
        console.log("Define saveDataCust in _STPREPORT_HEADER_JS & _STPREPORT_SAVE_PGM");
        console.log("Usage >> _program : ${savePGM}(StoredProcess)");
    }
    // execAjaxMultipart(updata, "cbSave");
}
function confirmSaveData(){
    console.log("confirmSaveData");
    
    confirmMsg = `저장하시겠습니까?`;
    confirmMsg2(confirmMsg, saveData);
}