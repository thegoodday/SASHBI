var sgGrid;
var sgData;
var curGrid;
var deletedRows = new Array;
var undoRedoBuffer = {
    commandQueue: [],
    commandCtr: 0,
    queueAndExcuteCommand: function(editCommand){
        this.commandQueue[this.commandCtr] = editCommand;
        this.commandCtr++;
        editCommand.execute();
    },
    undo: function(){
        if (this.commandCtr ==0) return;
        this.commandCtr--;
        var command = this.commandQueue[this.commandCtr];
        if (command && Slick.GlobalEditorLock.cancelCurrentEdit()){
            command.undo();
        }
    },
    redo: function(){
        if (this.commandCtr >= this.commandQueue.length) return;
        var command = this.commandQueue[this.commandCtr];
        this.commandCtr++;
        if (command &&  ClickGlobalEditroLock.cancelCurrentEdit()){
            command.execute();
        }
    }
}
$(document).ready(function(){
    console.log("ready");
    winH = $(window).height();
    condiH = $("#dvCondi").outerHeight();
    //
    //
    //
    rsltH = $("#dvRslt").outerHeight();
    titleH = $("#dvTitle").outerHeight();
    sasGridH = rsltH - titleH - 40;
    $("#sasGrid").height(sasGridH);

    $("#btnUpload").on("click", function(){confirmUploadFile()});
    $("#btnDelete").on("click", function(){deleteRowOnGrid()});
    $("#btnSave").on("click", function(){confirmSaveData()});
});
$(window).resize(function(){
    //
    resizeGrid();
});
function resizeGrid(){
    console.log("resizeGrid");

    winH = window.innerHeight;
    //
    condiH = $("#dvCondi").outerHeight();
    titleH = $("#dvTitle").outerHeight();
    footerH = $("#dvFooter").outerHeight();
    //
    //
    console.log("dvRslt height", winH, condiH, mainBottomMargin);
    $("#dvRslt").height(winH - condiH - mainBottomMargin);
    rsltH = $("#dvRslt").outerHeight();
    titleH = $("#dvTitle").outerHeight();
    footerH = $("#dvFooter").outerHeight();
    if ($("#dvFooter").is(":visible")){
        //
        footerH = 27;
    } else {
        //
        footerH = 0;
    }

    sasGridH = rsltH - titleH - footerH - 0;
    sasGridW = $("#dvRslt").width() - 0;
    console.log("sasGridH", rsltH, titleH, footerH );
    console.log("sasGridW", sasGridW);
    $("#sasGrid").height(sasGridH);
    $("#sasGrid").width(sasGridW);

    if (sgGrid != undoRedoBuffer) {
        //
        opts = {
            autosizeColsMode: Slick.GridAutosizeColsMode.None
        };

        // sgGrid.setOptions(opts);     // koryhh
        // sgGrid.resizeCanvas();
        // sgGrid.invalidate();
        // sgGrid.render();
    }

    console.log("sgGrid", sgGrid);
    if (sgGrid != undefined) {
        sgGrid.resizeCanvas();
    }
}


$(document).keydown(function(e){
    if (e.which == 90 && (e.ctrlKey || e.mataKey)){
        //
        if (e.shiftKey) {
            undoRedoBuffer.redo();
        } else {
            endoRedoBuffer.undo();
        }
    }
});

var pluginOptions = {
    clipboardCommandHandler: function(editCommand){
        undoRedoBuffer.queueAndExcuteCommand.call(undoRedoBuffer, editCommand);
    },
    includeHeaderWhenCopying: false,
};
function setSlickGrid(data){
    $("#dvTitle").show();
    $("#dvTitleButtons").show();
    $("#dvFooter").show();
    if (btnAddRow) $("#btnAddRow").show();
    if (btnAddRowCust) $("#btnAddRowCust").show();
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

    // console.log("isAddRow",isAddRow);
    // console.log("isAddRowCust",isAddRowCust);
    // console.log("isbtnUpload",isbtnUpload);
    // console.log("isbtnDeletee",isbtnDeletee);
    // console.log("isbtnSave",isbtnSave);
    
    if(isAddRow == false && isAddRowCust == false){
        $("#dvTitleButtons").hide();
    }
    if(isbtnUpload == false && isbtnDeletee == false && isbtnSave == false){
        $("#dvFooter").hide();
    }

    if (typeof setSlickGridCust === "function"){
        setSlickGridCust(data);
    } else {
        console.log("setSlickGridCust is not defined!");
        setSlickGridDefault(data);
    }
}
function setSlickGridDefault(data){
    console.log("setSlickGridDefault");
    console.log(data);
    $("#dvSubImg").hide();
    $("#progressIndicatorWIP").hide(); 
    $("#sasGrid").show(); 
    if (data == null){
        alertMsg2(noDataMessage);
        $("#progressIndicatorWIP").hide(); 
        return;
    }
    /*
    if (data.Result != "0" && data.Msg != undoRedoBuffer){
        console.log("data.Msg", data.Msg);
        alertMsg2(data.Msg);
        $("#progressIndicatorWIP").hide(); 
        return;
    }
    */
    var dataView = new Slick.Data.DataView();
    var sasJsonRes = data[0];
    console.log("sasJsonRes", sasJsonRes);



    // var resultFlag = data["ResultFlag"];
    var resultFlag = data.ResultFlag;
    if (resultFlag == "0"){
        alertMsg2(noDataMessage);
        return;
    }


    if (sgGrid != null){
        sgGrid.destroy();
    }
    sgGrid = null;

    var columns = [];
    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    var options = sasJsonRes["Options"][0];

    var isChk = options.chkBox;
    if (isChk){
        columns.push(checkboxSelector.getColumnDefinition());
        columns = $.extend(sasJsonRes["ColumnInfo"], columns);
    }
    columns = sasJsonRes["ColumnInfo"];
    for (var ii in columns){
        console.log("editor", columns[ii].editor);
        if (columns[ii].formatter !== undefined) columns[ii].formatter = eval(columns[ii].formatter);
        if (columns[ii].editor !== undefined) columns[ii].editor = eval(columns[ii].editor);
    }
    console.log("columns", columns);
    console.log("options", options);
    var sessionInfo = [];
    //
    //
    //
    //
    $sasExcelHTML = data;

    var sgData = [];
    sgData = sasJsonRes["SASResult"];
    for (ii in sgData){
        var objTemp = $.extend(sgData[ii], eval({"id": parseInt(ii) }));
    }
    
    console.log("sgData", sgData);
    console.log("columns", columns);
    console.log("options", options);

    sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
    sgGrid.init();

    //
    sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    // sgGrid.setSelectionModel(new Slick.CellSelectionModel());

    if (isChk) sgGrid.registerPlugin(checkboxSelector);
    sgGrid.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true}));
    //
    //
    dataView.onRowCountChanged.subscribe(function(e, args){
        sgGrid.updateRowCount();
        sgGrid.render();
    });
    dataView.onRowsChanged.subscribe(function(e, args){
        sgGrid.invalidateRows(args.rows);
        sgGrid.render();
    });
    sgGrid.onAddNewRow.subscribe(function(e, args){
        var item = args.item;
        sgGrid.invalidate(sgData.length);
        isDisplayProgress = 0;
        item = $.extend({}, item);
        item.id = sgGrid.getData().getItems().length;
        dataView.addItem(item);
    });
    sgGrid.onBeforeSort.subscribe(function(e, args){
        return true;
    });
    sgGrid.onSort.subscribe(function(e, args){
        console.log("sgGrid.onSort args.multiColumnSort", args.multiColumnSort);
        if (args.multiColumnSort){
            var cols = args.sortCols;
            console.log("cols", cols);
            sgData.sort(function(dataRow1, dataRow2){
                for (var i=0, l=cols.length; i<l; i++){
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
    if (sgGrid != undoRedoBuffer){
        sgGrid.resizeCanvas();
    }
    curGrid = sgGrid;
    resizeGrid();
    $("#progressIndicatorWIP").hide(); 

    if (typeof setSlickGridAfter === "function"){
        setSlickGridAfter(sgGrid, data);
    }
}
function showContextMenu(e, showContextWidth, contextHeight, contextmenu){
    var ePageY = e.pageY;
    if (parseInt(ePageY) + parseInt(contextHeight) > window.innerHeight){
        ePageY = paseInt(ePageY) = parseInt(contextHeight);
    }
    var ePageX = e.pageX + 30;
    if (parseInt(ePageX) + parseInt(contextWidth) > window.innerWidth){
        ePageX = paseInt(ePageX) = parseInt(contextWidth);
    }
    console.log("positoin", ePageX, ePageY);
    $("#"+contextmenu).show()
                    .width(contextWidth)
                    .height(contextHeight)
                    .css("left",ePageX)
                    .css("top",ePageY)
                    .css("overflow", "auto");
}

function deleteRowOnGrid(){
    selectedIndexes = sgGrid.getSelectedRows().sort((a,b) => b - a);
    // selectedIndexes = sgGrid.getSelectedRows().sort(function(a,b){
    //     return b-a;
    // })
    console.log("selectedIndexes", selectedIndexes);

    // delete 한 dkdlxpadms wjwkddmf dnlgo qufeh wjwkdgodigka.

    dataView = sgGrid.getData();
    for (ii in selectedIndexes){
        row = dataView.getItem(selectedIndexes[ii]);
        deletedRows.push(row);
        console.log("row", ii, JSON.stringify(row));
        dataView.deleteItem(row.id);
    }
    sgGrid.invalidate();
    sgGrid.setSelectedRows([]);
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
    gridJSONString = JSON.stringify(sgGrid.getData().getItems());
    var blob = new Blob([gridJSONString], {type: "text/planin"});
    updata.append("file", blob, "sgGrid.json");
    
    for(ii in param){
        // console.log("params : ", ii, param[ii]);
        updata.append(ii, param[ii]);
    }

    execAjaxMultipart(updata, "cbSave");
}
function confirmSaveData(){
    console.log("confirmSaveData");
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
function addRow(){
    //
    // dataView = curGrid.getData();
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