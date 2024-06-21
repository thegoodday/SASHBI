let result, curGrid;
let gridInfo = new Object();
let defaultOptions = {
    autoEdit: false,
    editable: true,
    enableCellNavigation: true,
    enableColumnReorder: false
}
$(document).ready(function(){
    $("#btnUpload").on("click", function(){confirmUploadFile()});
    $("#btnDelete").on("click", function(){deleteRowOnGrid()});
    $("#btnSave").on("click", function(){confirmSaveData()});
});
$(window).resize(function(){
    //
    // reportViewer.js 의 resizeFrame에서 resizeGrid 호출함으로 불필요!
    // resizeGrid();
});
function resizeGrid(){
    console.log("resizeGrid in tagGrid.js");
    $("#dvRes").hide();

    winH = $(window).height();
    winH = window.innerHeight;
    dvCondiHeight = $("#dvCondi").outerHeight();
    dvToolBarHeight = $("#dvToolbar").outerHeight();
    dvTitleHeight = $("#dvTitle").outerHeight();
    //
    //

    $("#dvRslt").height(winH - dvCondiHeight - mainBottomMargin);

    isFooterVisible = $("#dvFooter").is(":visible");
    footerOH = $("#dvFooter").outerHeight();
    //
    if (!isFooterVisible) footerOH = 0;

    rsltH = $("#dvRslt").height();
    titleH = $("#dvTitle").height();
    // console.log("#Gridtabs", rsltH - titleH - footerOH -3, rsltH , titleH , footerOH);
    // $("#Gridtabs").height(rsltH - titleH - footerOH - 3);      // koryhh
    $("#Gridtabs").height(rsltH - footerOH + 0);      // koryhh : 그리드 height 조정시
    ulH = $("#Gridtabs ul").outerHeight();
    ulH = 40;

    //
    $(".sasGrid").width($("#dvRslt").outerWidth() - 10);            // koryhh
    //

    $(".dvInfoMsg").each(function(){
        objID = $(this).attr("id");
        tableID = objID.substring(11);
        //
        if ($(this).html() != ""){
            infoH = $(this).outerHeight();
        } else {
            infoH = $(this).outerHeight();
        }
        // infoH = 60;
        // console.log("#sasGrid tableID", tableID, rsltH - ulH - infoH - footerOH - 10);
        // console.log("#sasGrid tableID", tableID, rsltH, ulH, infoH, footerOH);
        $("#sasGrid" + tableID).height(rsltH - ulH - infoH - footerOH - 3);    // koryhh
    });

    if (typeof curGrid == "object"){
        //
        curGrid.invalidate();
        curGrid.render();
        curGrid.resizeCanvas();
    }
}
function cbSubmit(res){
    console.log("cbSubmit", res);
    gridInfo = new Object();
    // $("#dvTitle").show();
    // $("#dvTitleButtons").show();
    $("#dvFooter").show();
    if (btnUpload) $("#btnUpload").show();
    if (btnDelete) $("#btnDelete").show();
    if (btnSave) $("#btnSave").show();
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

    if (typeof cbSubmitInit == "function"){
        cbSubmitInit(res);
    }
    result = res;
    $sasExcelHTML = res;

    if($("#Gridtabs").tabs("instance") != undefined) $("#Gridtabs").tabs("destroy");
    $("#Gridtabs").html("<ul></ul>");

    if (res.options != undefined){
        defaultOptions = res.options[0];
    }
    console.log("defaultOptions", defaultOptions);

    tabsInfo = res.tabsInfo;
    for (ii in tabsInfo){
        tableID = tabsInfo[ii].tableID;
        tabLabel = tabsInfo[ii].tabLabel;
        infoMsg = tabsInfo[ii].infoMsg;
        sgData = res.data[tableID];
        $("#Gridtabs ul").append(`<li><a href='#tabCont${tableID}' id="tab${tableID}">${tabLabel}</a></li>\n`);
        $("#Gridtabs").append(`
            <div id='tabCont${tableID}' >
                <div id="dvInfoTable${tableID}" class="dvInfoMsg">${infoMsg}</div>
                <div id="sasGrid${tableID}" class="sasGrid"></div>
            </div>\n`
        );
        if (ii == 0) {
            let sgGrid = setSlickGridO(sgData, `sasGrid${tableID}`, tableID);
            gridInfo[tableID] = sgGrid;
            curGrid = sgGrid;
            console.log("gridInfo", tableID, gridInfo);
        }
    }
    buttons = `<li style="float: right;font-size: 13px;">`;
    if (btnAddRow) buttons +=`<input type=button id="btnAddRow" class="btn_basic" value="행추가" title="행추가" onclick="addRow();" style="margin:0px 2px;font-size:11px;position:relative;bottom:5px;padding:3px 10px;">`;
    if (btnAddRowCust) buttons +=`<input type=button id="btnAddRowCust" class="btn_basic" value="행추가" title="행추가" onclick="addRow();" style="margin:0px 2px;font-size:11px;position:relative;bottom:5px;padding:3px 10px;">`;
    buttons +=`</li>`;
    $("#Gridtabs ul").append(buttons);


    // if (showAddRow == "1") $("#btnAddRow").show();

    $("#Gridtabs").tabs({
        activate : (event, ui)=>{
            console.log("ui in activate", ui);
            targetID = ui.newPanel[0].id;
            var tableID = targetID.substring(7);
            sgData = res.data[tableID];
            console.log("targetID:tableID:sgData in activate", targetID, tableID, sgData);
            let sgGrid = setSlickGridO(sgData, `sasGrid${tableID}`, tableID);
            curGrid = sgGrid;
            console.log("tableID", tableID);
            gridInfo[tableID] = sgGrid;

            console.log("gridInfo", tableID, gridInfo);
            //
        }
    });

    if (typeof submitSTPAfter == "function"){
        submitSTPAfter(res);
    }
    //
    resizeGrid();
}
function setSlickGridO(data, target, id){
    // console.log("id in setSlickGridO", id);
    // console.log("result in setSlickGridO", result);
    rsltH = $("#dvRslt").outerHeight();
    $("#" + target).show();
    $("#" + target).height(rsltH - 80);
    colInfo = result.tab_content[id];
    //
    // console.log("colInfo in setSlickGridO", colInfo);
    let isChk = colInfo[0].NAME == "_check_yn" ? true : false;
    // console.log("isChk in setSlickGridO", isChk);
    let isMultiColumnHeader = false;

    columns = new Array();
    for (ii in colInfo) {
        column = new Object();
        rname = colInfo[ii].NAME;
        rlabel = colInfo[ii].LABEL == "" ? rname : colInfo[ii].LABEL;
        column.id = rname;
        column.field =rname;
        column.name = rlabel;
        if (colInfo[ii].width != undefined && colInfo[ii].width != null){
            rwidth = colInfo[ii].width;
        } else {
            rwidth = colInfo[ii].LENGTH * 10;
        }
        column.width = rwidth;

        if (colInfo[ii].css != undefined && colInfo[ii].css != ""){
            rcss = colInfo[ii].css;
        } else {
            rcss = colInfo[ii].TYPE == 1 ? "r" : (colInfo[ii].TYPE == 2 ? "l" : (colInfo[ii].TYPE == 3 ? "c" : colInfo[ii].TYPE));
        }
        column.cssClass = rcss;

        if (colInfo[ii].editor != undefined && colInfo[ii].editor != ""){
            reditor = colInfo[ii].editor;
            column.editor = eval(reditor);
        }

        if (colInfo[ii].formatter != undefined && colInfo[ii].formatter != ""){
            column.formatter = eval(colInfo[ii].formatter);
        }

        if (colInfo[ii].sort != undefined && colInfo[ii].sort != ""){
            rsort = colInfo[ii].sort == 1 ? true : false;
        } else {
            rsort = false;
        }
        column.sortable = rsort;

        if (colInfo[ii].columnGroup != undefined ){
            column.columnGroup = colInfo[ii].columnGroup;
            isMultiColumnHeader = true;
        }


        column.resizeable = true;
        column.selectable = true;
        columns.push(column);
    }

    options = new Object();
    for (ii in defaultOptions){
        options[ii] = defaultOptions[ii];
    }

    if (isMultiColumnHeader){
        options.enableColumnReorder = false;
        options.createPreHeaderPanel = true;
        options.showPreHeaderPanel = true;
        options.preHeaderPanelHeight = 20;
        options.explictInitialization = true;
        if (options.autosizeColsMode != undefined){
            delete options.autosizeColsMode;
            delete options.frozenColumn;
        }
    }

    var dataView = new Slick.Data.DataView();

    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    if (isChk) {
        chkColumn = new Array();
        chkColumn.push(checkboxSelector.getColumnDefinition());
        columns = $.extend(columns, chkColumn);
    }

    sgData = data;
    for (ii in sgData) {
        var objTemp = $.extend(sgData[ii], eval({"id": ii}));
    }
    //
    console.log("columns", columns);
    console.log("options", options);
    sgGrid = new Slick.Grid("#" + target, dataView, columns, options);
    sgGrid.init();
    if (isMultiColumnHeader){
        for (ii in columns){
            if (columns[ii].columnGroup == undefined || columns[ii].columnGroup == "") columns[ii].columnGroup = "";
        }
    }

    sgGrid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
    if (isChk) sgGrid.registerPlugin(checkboxSelector);
    sgGrid.registerPlugin(new Slick.AutoTooltips({ anableForHederCells: true }));
    sgGrid.getCanvasNode().focus();

    if (isMultiColumnHeader){
        sgGrid.onColumnsResized.subscribe(function(e, args){
            createAddHeaderRow();
        });
        createAddHeaderRow();
    }

    sgGrid.onSort.subscribe(function(e, args){
        //
        sgData = sgGrid.getData().getItems();
        if (args.multiColumnSort){
            var cols = args.sortCols;
            //
            sgData.sort(function(dataRow1, dataRow2){
                for (var i=1, l=cols.length; i<l; i++){
                    var field = cols[i].sortCol.field;
                    var sign = cols[i].sortAsc ? 1 : -1;
                    var value1 = dataRow1[field], value2 = dataRow2[field];
                    var result = (value1 == value2 ? 0 : value1 > value2 ? 1 : -1) * sign;
                    if (result != 0) {
                        return result;
                    }
                }
                return 0;
            });
            dataView.beginUpdate();
            dataView.setItems(sgData);
            dataView.endUpdate();
        } else {
            var comparer = function(a,b){
                return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
            }
            dataView.sort(comparer, args.sortAsc);
        }
        sgGrid.invalidate();
        sgGrid.render();
    });
    
    dataView.beginUpdate();
    dataView.setItems(sgData);
    dataView.endUpdate();

    if (typeof setSlickGridAfter == "function") {
        setSlickGridAfter(sgGrid, id);
    }

    resizeGrid();

    sgGrid.invalidate();
    sgGrid.render();
    if (sgGrid != undefined) {
        sgGrid.resizeCanvas();
    }
    opt = sgGrid.getOptions();
    console.log("options", opt);
    return sgGrid;
}

function deleteRowOnGrid(){
    opt = curGrid.getOptions();

    selectedIndexes = curGrid.getSelectedRows().sort((a, b) => b - a );

    dataView = curGrid.getData();
    sgData = dataView.getItems();
    for (ii in selectedIndexes) {
        row = dataView.getItem(selectedIndexes[ii]);
        //
        dataView.deleteItem(row.id);
    }
    sgGrid.invalidate();
    sgGrid.setSelectedRows([]);

}
function addRow(){
    //
    dataView = curGrid.getData();
    sgData = dataView.getItems();
    //
    let row = sgData[sgData.length-1];
    curGrid.invalidateRow(sgData.length);
    row = $.extend({}, row);
    //
    for (let ii in row){
        if (typeof row[ii] == "string"){
            row[ii] = "";
        } else {
            row[ii] = null;
        }
    }
    row.id = sgData.length;

    dataView.addItem(row);
    curGrid.invalidate();
    curGrid.render();

    newOBS = sgData.length;
    //
    curGrid.scrollRowIntoView(newOBS);
}

function createAddHeaderRow(){
    let $preHeaderPanel = $(sgGrid.getPreHeaderPanel())
                            .empty()
                            .addClass("slick-header-columns")
                            .css("left", "-1000px")
                            .width(sgGrid.getHeadersWidth());
    $preHeaderPanel.parent().addClass("slick-header");

    let headerColumnWidthDiff = sgGrid.getHeaderColumnWidthDiff();
    let mm, header, lastColumnGroup = "", widthTotal = 0;

    for (let ii = 0; ii < columns.length; ii++) {
        mm = columns[ii];
        if (lastColumnGroup === mm.columnGroup && ii > 0) {
            widthTotal += mm.width;
            header.width(widthTotal - headerColumnWidthDiff);
        } else {
            widthTotal = mm.width;
            header = $("<div class='ui-state-default slick-header-column' />")
                        .html(`<span class='slick-column-name'>${mm.columnGroup}</span>`)
                        .width(mm.width - headerColumnWidthDiff)
                        .appendTo($preHeaderPanel);
        }
        lastColumnGroup = mm.columnGroup;
    }
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

function saveData(){
    console.log("saveData");
    if (!sgGrid.getEditorLock().commitCurrentEdit()) {return;}

    param = new Object();
    params = new Array();
    param = getParams(param, params);
    // console.log("param at saveData", param);

    form = $("#fomUpload")[0];
    updata = new FormData(form);
    updata.append("_program", `${savePGM}(StoredProcess)`);

    // tabsInfo = result.tabsInfo;
    for (ii in gridInfo){
        tempGrid = gridInfo[ii];
        tempJSON = JSON.stringify(tempGrid.getData().getItems());
        var savedData = JSON.parse(tempJSON);
        console.log("savedData", savedData);
        if (typeof saveDataCust == "function"){
            // console.log("typeof saveDataCust", typeof saveDataCust);
            var sgData = saveDataCust(ii, savedData);
        } else {
            var sgData = savedData;
        }
        var gridJSONString = JSON.stringify(sgData);
        var blob = new Blob([gridJSONString], {type: "text/planin"});
        updata.append("file", blob, `${ii}.json`);
        // console.log("gridJSONString", gridJSONString);
    }
    
    for(ii in param){
        // console.log("params : ", ii, param[ii]);
        updata.append(ii, param[ii]);
    }
    // updata.append("_debug", "log");
    execAjaxMultipart(updata, "cbSave");
}
function confirmSaveData(){
    console.log("confirmSaveData");
    
    console.log("gridInfo", gridInfo);

    confirmMsg = `저장하시겠습니까?`;
    confirmMsg2(confirmMsg, saveData);
}
function cbSave(res){
    console.log("cbSave");
    if (res.Msg == ""){
        alertMsg2("저장되었습니다.");
    } else {
        alertMsg2(res.Msg);
    }
}