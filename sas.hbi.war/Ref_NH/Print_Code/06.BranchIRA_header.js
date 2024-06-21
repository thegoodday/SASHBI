/*
* 주 시스템 명 : MI REPORT
* 화  면   명 : SAS HBI > MI Reports > Vearly > Branch Inherent Risk Assessment
* 프로그램명   : 06.BranchIRA_header.js
* 기      능 : Branch Inherent Risk Assessment
* 작  성  자 :
* 작  성  일 : 2022-03-04
* =======================================================================
* 수정 내역
* NO   수정일	     작업자	     내용
*
*/
var debug = true;
var isHideBG, gryCnt;
var sgGrid, curRow;
var detailInfo;
$(document).ready(function  () {
    $(".hasDatepicker").width(70);
    $(".hasDatepicker").css("text_align", "left"); 

    commonBkCdInit();

    console.log("userID : " + userID);

    var date = new Date();
    var year = date.getFullYear();
    for (var ii=0; ii<5; ii++){
        $("#sltYEAR").append("<option value=" + year + ">" + year + "</option>");
        //$("#sltYEAR").append('<option value=${year}>${year}</option>`);
        year--;
    }    

    $("#sltTITLE").on("keydown", function (event) {
        if (event.keyCode ==13) submitSTP();
    });
});
$(window).resize(function () {
    resizeContents();
});
function resizeContents() {
    console.log('$("#dvToolBar").height()', $("#dvToolBar").height());
    console.log("dvToolBar is ", $("#dvToolBar").is(":visible"));
    var toolBarHeight = 53 ;
    if ($("#dvToolBar").is(":visible")) toolBarHeight = 70;
    $("#sasGrid").height(eval($(window).height() - $("#dvCondi").height() - toolBarHeight - 0));
    $("#sasGrid").width(eval($(window).width() - 50));
    //$(".slick-viewport").height(eval($("#sasGrid").height()-5));
    if (sgGrid != undefined) {
        sgGrid.resizeCanvas();
    }
}
function fnGetDatetime() {
    var date = new Date();
    var year = date.getFullYear().toString();

    var month = date.getMonth() + 1 ;
    month = month < 10 ? "0" + month.toString() : month.toString();
    var day = date.getDate();
    day = day < 10 ? "0" + day.toString() : day.toString();
    var hour = date.getHours();
    hour = hour < 10 ? "0" + hour.toString() : hour.toString();
    var minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute.toString() : minute.toString();
    var seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
    var dt = year + month + day + hour + minute + seconds ;
    return dt ;
}
function setSlickGrid(data) {
    console.log("setSlickGrid :\n");
    gryCnt = 0 ;
    curRow = "";
    $("#sasGrid").show();
    var dataView = new setSlickGrid.Data.DataView();

    var sasJsonRes = data[0];

    var columns = [];
    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel",
    });
    var options = sasJsonRes["Options"][0];

    var isChk = options.chkBox;
    if (isChk) {
        columns.push(checkboxSelector.getColumnDefinition());
        columns = $.extend(sasJsonRes["ColumInfo"], columns);
    }
    columns = sasJsonRes["ColumInfo"];

    console.log("columns", columns);
    console.log("options \n" + JSON.stringify(options));
    var sessionInfo = [];
    sessionInfo = sasJsonRes["SessionInfo"][0];
    nstp_sessionid = sessionInfo["nstp_sessionid"];
    stp_sessionid = nstp_sessionid;
    save_path = sessionInfo["save_path"];
    $sasExcelHTML = data;

    var sgData = [];
    sgData = sasJsonRes["SASResult"];
    $("#dvResInfo").html("Total : " + sgData.length + " Rows");
    for (ii in sgData) {
        var objTemp = $.extend(sgData[ii], eval({ id: ii }));
    }
    console.log("sgData", sgData);
    //dataView.setItems(sgData);

    sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
    dataView.onRowCountChanged.subscribe(function (e, args) {
        sgGrid.updateRowCount();
        sgGrid.render();
    });
    dataView.onRowCountChanged.subscribe(function (e, args) {
        sgGrid.invalidateRows(args.rows);
        sgGrid.render();
    });
    sgGrid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
    if (isChk) {
        sgGrid.registerPlugin(checkboxSelector);
    }
    sgGrid.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
    sgGrid.onClick.subscribe(function (e, args) {
        curRow = args.grid.getDataItem(args.row);
    });
    sgGrid.onDblClick.subscribe(function (e, args) {
        curRow = args.grid.getDataItem(args.row);
        openModalWin(curRow);
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
    if (!isHQ) $("#dvToolBar").show();
    resizeContents();
}
function openModalWin(rowInfo) {
    tParams.year = curRow.PERIOD;
    execAjax(
        "",
        "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/04.MIReports/26.getDetails(StoredProcess)",
        true,
        "cbGetDetails",
        "json",
        debug
    );
    setDefaultValueOndvModalWin(rowInfo);

    $("#dvBG").show();
    //$("#dvModalWiN").show();

    $("#dvModalWin").dialog({
        title: "Branch Inherent Risk Assessment",
        height: 700,
        width: 1400,
        close: function () {
            $("#dvBG").hide();
            close();
        },
        buttons: [
            {
                text: "Print",
                id: "btnDialogPrint",
                click: function () {
                    fnConfirmPrint();
                },
            },
            {
                text: "Save",
                id: "btnDialogSave",
                click: function () {
                    fnConfirmSave();
                },
            },
        ],
        resizeable: false,
        closeOnEscape: true,
        modal: false,
    });
    $("#dvModalWin").scrollTop(0);
    //console.Log("scrollTop : " + $("#dvModalWin").scrollTop());
    if (isHQ) $("#btnDialogSave").hide();
}
function setDefaultValueOndvModalWin(rowInfo) {
    console.log("[CCM] - [rowInfo]", rowInfo);
    var rowInfoNames = Object.keys(rowInfo);
    for (ii in rowInfoNames) {
        console.log("Name in rowInfo", rowInfoNames[ii], rowInfo[rowInfoNames[ii]]);
        varName = rowInfoNames[ii];
        $("#" + varName).val("");
    }
    for (ii in rowInfoNames) {
        varName = rowInfoNames[ii];
        $("#" + varName).val(rowInfo[rowInfoNames[ii]]);
    }
    $("#txaOPTIONS").val("");
    if (rowInfo.PERIOD == "") {
        $("#dvTITLE").html(
            "<input type=text id=txtTITLE name=txtTITLE placeholder='Input the title.' style='width:100%; text-align 짤림(print/KakaoTalk_20230112_140641190_03.jpg)"
        );
        console.log("rowInfo.PERIOD", rowInfo.PERIOD);
        $("#dvPERIOD").html(
            "<input type=text id=txtPERIOD name=txtPERIOD style='width:70px; text-align:center;background-color: 짤림(print/KakaoTalk_20230112_140641190_03.jpg)"
        );
        $("#txtPERIOD").datepicker({
            defaultDate: "0m",
            numberOfMonths: 1,
            changeMonth: true,
            changeYear: true,
            showButtonPanel: false,
            dateFormat: "yymm",
            onClose: function () { },
        });
    } else if (rowInfo.PERIOD != "" || rowInfo.PERIOD != undefined) {
        console.log("rowInfo", rowInfo.PERIOD + "|");
        $("#dvTITLE").html(rowInfo.TITLE);
        $("#dvPERIOD"),html(rowInfo.PERIOD);
        $("#txaOPTIONS").val(rowInfo.OPTIONS);
    }
}
function fnConfirmSave() {
    isHideBG = false;
    if (fnValidation() == false) {
        return;
    }
    confirmMsg("Are you sure you want to save?", "cbConfirmSave");
}
function cbConfirmSave() {
    //event.preventDefault();
    $("#progressIndicatorWIP").show();
    $("button").prop("disabled", true);
    var form = $("#fomUpload")[0];
    var updata = new FormData(form);

    updata.append("BK_CD", curRow.BK_CD);
    updata.append("RPT_NO", curRow.RPT_NO);
    title = curRow.TITLE == "" ? $("#txtTITLE").val() : curRow.TITLE ;
    updata.append("TITLE", title);
    period = curRow.PERIOD == "" ? $("#txtPERIOD").val() : curRow.PERIOD ;
    updata.append("PERIOD", period);
    updata.append("encOPTIONS", encodeURIComponent($("#txaOPTIONS").val()));
    updata.append(
        "_program",
        "SBIP://METASERVER/NHAML/00.Environments/StoreProcess/04.MIReports/26.saveBrachIRA(StoredProcess)"
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
        timeout: 600000,
        beforeSend: function (xhr, setting) {
            $("#progressIndicatorWIP").show();
        },
        success: function (data) {
            console.log(data);
            cbSaveBranchCCM(data);
        },
        complete: function (data) {
            $("button").prop("disabled", false);
            isRun = 0;
            tParams = eval("[{}]");
            submitSTP();
            $("#progressIndicatorWIP").hide();
            $("#dvModalWin").dialog("close");
            $("#dvBG").hide();
        },
        error: function (xhr, status, error) {
            console.log("ERROR: Status:", status, ": xhr: ", xhr, "error: ", error);
        },
    });
}
function cbSaveBranchCCM(data) {
    isHideBG = true;
    //submitSTP();
    $("button").prop("disabled", false);
    $("#dvBG").hide();
    alertMsg(data[0].msg);
}
function fnConfirmPrint() {
    isHideBG = false;
    confirmMsg("Are you sure you want to print?", "cbConfirmPrint");
}
function cbConfirmPrint() {
    $("#progressIndicatorWIP").show();
    $("button").prop("disabled", true);

    var param = {};
    var datetime = fnGetDatetime();
    param.datetime = datetime;
    param.userid = userID;
    param.curRow = "[" + JSON.stringify(curRow) +"]";

    $.ajax({
        url: "/SASHBI/input/NHAML/04.MIReports/02.Yearly/jsp/26.BranchIRA.jsp",
        type: "POST",
        data: param,
        success: function (response, status) {
            console.log("cbConfirmPrint success");
            fnFileDownload(datetime);
        },
        complete: function (data) {
            console.log("cbConfirmPrint complete");
            $("#progressIndicatorWIP").hide();
            $("#dvModalWin").dialog("close");
            $("button").prop("disabled", false);
            $("#dvBG").hide();
        },
        error: function () {
            console.error("cbConfirmPrint");
        },
    });

    $("#dvModalWin").dialog("close");
}
function fnFileDownload(datetime) {
    document.frmDown.target = "fileDown";
    document.frmDown.fileName.value = userID + "_" + datetime + "_branch_ira_result.xlsx";
    document.frmDown.submit();
}

function fnValidation() {
    var chkResult = true;

    //2020.02.26 Options u??????uu
    var options = $("#txaOPTIONS").val().trim();
    if (options != "") {
        var options_pattern = /[/'",#^&:;\\{\[\]<>}\t\n]/g;
        // if(options_pattern.test(options)){
        // alertMsg('You Cannot input [ . / \' \" , # ^ & : ; / { [ < > ] } Tab NewLine ] in the options 짤림(print/KakaoTalk_20230112_140641190_06.jpg))
        // chkResult = false ;
        // }
        if (fnChkByte(options) > 2000) {
            alertMsg('The maximum length of options is 2000 byte.');
            return false;
        }
    }

    var title = $("#txtTITLE").val() == undefined ? $("#dvTITLE").html().trim() : $("#txtTITLE").val();
    console.log("[Info Req] - title : " + title);
    if (title == null || title == "") {
        alertMsg("Title is necessary!");
        return false;
    }

    var period = $("#txtPERIOD").val() == undefined ? $("#dvPERIOD").html().trim() : $("#txtPERIOD").val();
    console.log("[Info Req] - period : " + period);
    if (period == ""){
        alertMsg("Please, Input the period.");
        return false;
    }
}
function fnConfirmAdd() {
    execAjax(
        "",
        "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/04.MIReports/00.getSequence(StoredProcess)",
        true,
        "cbConfirmAdd",
        "json",
        debug
    );
}
function cbConfirmAdd(seq_info) {
    console.log("seq_info", seq_info);
    rowInfo = new Object();
    rowInfo.BK_CD = $("#sltBK_CD option:selected").val();
    rowInfo.TITLE = "";
    rowInfo.RPT_NO = seq_info[0].ID;
    rowInfo.PERIOD = "";
    console.log("rowInfo after RPT_ID", rowInfo);
    curRow = rowInfo;
    openModalWin(rowInfo);
}
function fnConfirmDelete() {
    console.log("[curRow]", curRow);
    if (curRow =="" || curRow == undefined || curRow.PERIOD == "" || curRow.PERIOD == undefined) {
        alertMsg("There is no selected Row");
        return;
    }
    confirmMsg("Are you sure you want to delete?", "cbConfirmDelete");
}
function cbConfirmDelete() {
    $("#progressIndicatorWIP").show();
    $("button").prop("disabled", true);

    tParams.PERIOD = curRow.PERIOD;
    tParams.RPT_NO = curRow.RPT_NO;
    console.log("[tParams]", tParams);
    execAjax(
        "",
        "SBIP://METASERVER/NHAML/00.Environments/StoredProcess/04.MIReports/09.deleteBranchCCM(StoredProcess)",
        true,
        "cbDeleteBranchCCM",
        "json",
        debug
    );
}
function cbDeleteBranchCCM(data) {
    isHideBG = true;
    submitSTP();
    $("button").prop("disabled", false);
    $("#dvGB").hide();
    alertMsg(data[0].msg);
}
function fnChkByte(text_val){
    const maxByte = 2000;
    const text_len = text_val.length;

    let totalByte = 0;
    for(let ii=0; ii<text_len; ii++){
        const each_char = text_val.charAt(ii);
        const uni_char = escape(each_char);
        if (uni_char.length>4){
            totalByte += 3;
        } else {
            totalByte += 1;
        }
    }
    console.log('totalByte', totalByte);
    return totalByte;
}
function cbChkDupPeriod(data) {
    console.log("period dup check result", data);
    if (data[0].msg != '') {
        alertMsg(data[0].msg);
        $("#txtPERIOD").val('');
        $("#txtPERIOD").css('background-color','#ffc4c4');
    } else {
        $("#txtPERIOD").css('background-color','#fff');
    }
}

function calcScoreAvg() {
    var prod_demand_dep_trans_val_d = parseFloat($("PROD_DEMAND_DEP_TRANS_VAL").val().replace(/,/g, ""));
    var prod_demand_dep_sc_d = parseFloat($("#PROD_DEMAND_DEP_SC").val());
    var prod_time_dep_trans_val_d = parseFloat($("#PROD_TIME_DEP_TRANS_VAL").val().replace(/,/g, ""));
    var prod_time_dep_sc_d = parseFloat($("#PROD_TIME_DEP_SC").val());
    var prod_install_dep_trans_val_d = parseFloat($("#PROD_INSTALL_DEP_TRANS_VAL").val().replace(/,/g, ""));
    var prod_install_dep_sc_d = parseFloat($("#PROD_INSTALL_DEP_SC").val());
    var prod_dome_fund_trsf_trans_val_d = parseFloat($("#PROD_DOME_FUND_TRSF_TRANS_VAL").val().replace(/,/g, ""));
    var prod_dome_fund_trsf_sc_d = parseFloat($("#PROD_DOME_FUND_TRSF_SC").val());
    var prod_exc_curr_trans_val_d = parseFloat($("#PROD_EXC_CURR_VAL").val().replace(/,/g, ""));
    var prod_exc_curr_sc_d = parseFloat($("#PROD_EXC_CURR_SC").val());
    var prod_deposits_sum = prod_demand_dep_trans_val_d + prod_time_dep_trans_val_d + prod_install_dep_trans_val_d +
                            prod_dome_fund_trsf_trans_val_d + prod_exc_curr_trans_val_d;
    var prod_deposits_sc = (prod_demand_dep_trans_val_d * prod_demand_dep_sc_d
                            + prod_time_dep_trans_val_d * prod_time_dep_sc_d
                            + prod_install_dep_trans_val_d * prod_install_dep_sc_d
                            + prod_dome_fund_trsf_trans_val_d * prod_dome_fund_trsf_sc_d
                            + prod_exc_curr_trans_val_d * prod_exc_curr_sc_d) / prod_deposits_sum;
                            
    var prod_money_mk_lend_trans_val_d = parseFloat($("PROD_MONEY_MK_LEND_TRANS_VAL").val().replace(/,/g, ""));
    var prod_money_mk_lend_sc_d = parseFloat($("#PROD_MONEY_MK_LEND_SC").val());
    var prod_money_mk_br_trans_val_d = parseFloat($("#PROD_MONEY_MK_BR_TRANS_VAL").val().replace(/,/g, ""));
    var prod_money_mk_br_sc_d = parseFloat($("#PROD_MONEY_MK_BR_SC").val());
    var prod_treasury_sum = prod_money_mk_lend_trans_val_d + prod_money_mk_br_trans_val_d;
    var prod_treasury_sc = (prod_money_mk_lend_trans_val_d * prod_money_mk_lend_sc_d
                            + prod_money_mk_br_trans_val_d * prod_money_mk_br_sc_d) / prod_treasury_sum;
    var prod_psn_loan_trans_val_d = parseFloat($("#PROD_PSN_LOAN_TRANS_VAL").val().replace(/,/g, ""));
    var prod_psn_loan_sc_d = parseFloat($("#PROD_PSN_LOAN_SC").val());
    var prod_cmcl_loan_trans_val_d = parseFloat($("#PROD_CMCL_LOAN_TRANS_VAL").val().replace(/,/g, ""));
    var prod_cmcl_loan_sc_d = parseFloat($("#PROD_CMCL_LOAN_SC").val());
    var prod_guarantee_trans_val_d = parseFloat($("#PROD_GUARANTEE_TRANS_VAL").val().replace(/,/g, ""));
    var prod_guarantee_sc_d = parseFloat($("#PROD_GUARANTEE_SC").val());
    var prod_other_loan_trans_val_d = parseFloat($("#PROD_OTHER_LOAN_TRANS_VAL").val().replace(/,/g, ""));
    var prod_other_loan_loan_sc_d = parseFloat($("#PROD_OTHER_LOAN_SC").val());
    var prod_lending_sum = prod_psn_loan_trans_val_d + prod_cmcl_loan_trans_val_d +
                            prod_guarantee_trans_val_d + prod_other_loan_trans_val_d;
    var prod_lending_sc = (prod_psn_loan_trans_val_d * prod_psn_loan_sc_d +
                            prod_cmcl_loan_trans_val_d * prod_cmcl_loan_sc_d +
                            prod_guarantee_trans_val_d * prod_guarantee_sc_d +
                            prod_other_loan_trans_val_d * prod_other_loan_loan_sc_d) / prod_lending_sum;
    
    var prod_issuance_lc_trans_val_d = parseFloat($("#PROD_ISSUANCE_LC_TRANS_VAL").val().replace(/,/g, ""));
    var prod_issuance_lc_sc_d = parseFloat($("#PROD_ISSUANCE_LC_SC")).val();
    var prod_standby_lc_trans_val_d = parseFloat($("#PROD_STANDBY_LC_TRANS_VAL").val().replace(/,/g/ ""));
    var prod_standby_lc_sc_d = parseFloat($("#PROD_STANDBY_LC_SC").val());
    var prod_nego_lc_dp_da_trans_val_d = parseFloat($("PROD_NEGO_LC_DP_DA_TRANS_VAL").val().replace(/,/g, ""));
    var prod_nego_lc_dp_da_sc_d = parseFloat($("#PROD_NEGO_LC_DP_DA_SC").val());
    var prod_advice_lc_trans_Val_d = parseFloat($("PROD_ADVICE_LC_TRANS_VAL").val().replace(/,/g, ""));
    var prod_advice_lc_sc_d = parseFloat($("#PROD_ADVICE_LC_SC").val());
    var prod_finance_sum = prod_issuance_lc_trans_val_d + prod_standby_lc_trans_val_d +
                            prod_nego_lc_dp_da_trans_val_d + prod_advice_lc_trans_Val_d;
    var prod_finance_sc = 0;
    if (prod_finance_sum != 0) {
        prod_finance_sc = (prod_issuance_lc_trans_val_d * prod_issuance_lc_sc_d +
                    prod_standby_lc_trans_val_d * prod_standby_lc_sc_d +
                    prod_nego_lc_dp_da_trans_val_d * prod_nego_lc_dp_da_sc_d +
                    prod_advice_lc_trans_Val_d * prod_advice_lc_sc_d) / prod_finance_sum ;
    }
    var prod_usd_vnd_bk_trans_val_d = parseFloat($("#PROD_USD_VND_BK_TRANS_VAL").val().replace(/,/g, ""));
    var prod_usd_vnd_bk_sc_d = parseFloat($("#PROD_USD_VND_BK_SC").val());
    var prod_inout_remit_trans_val_d = parseFloat($("#PROD_INOUT_REMIT_TRANS_VAL").val().replace(/,/g, ""));
    var prod_inout_remit_sc_d = parseFloat($("#PROD_INOUT_REMIT_SC").val());
    var prod_banking_sum = prod_usd_vnd_bk_trans_val_d + prod_inout_remit_trans_val_d;
    var prod_banking_sc = (prod_usd_vnd_bk_trans_val_d * prod_usd_vnd_bk_sc_d +
                            prod_inout_remit_trans_val_d * prod_inout_remit_sc_d) / prod_banking_sum;
    
    var prod_risk_score_avg = (prod_deposits_sum * prod_deposits_sc +
                                prod_treasury_sum * prod_treasury_sc +
                                prod_lending_sum * prod_lending_sc +
                                prod_finance_sum * prod_finance_sc +
                                prod_banking_sum * prod_banking_sc) /
                                (prod_deposits_sum + prod_treasury_sum + prod_lending_sum + prod_finance_sum + prod_banking_sum);

    var cust_risk_score_avg = $("#CUST_RISK_SCORE_AVG").val() == "" ? 0 : $("$CUST_RISK_SCORE_AVG").val();
    var geo_risk_score_avg = $("#GEO_RISK_SCORE_AVG").val() == "" ? 0 : $("#GEO_RISK_SCORE_AVG").val();
    if ($("#PROD_RISK_SCORE_AVG").val() == "") $("#PROD_RISK_SCORE_AVG").val("0");
    var prod_risk_score_avg_dd = parseFloat($("#PROD_RISK_SCORE_AVG").val().replace(/,/g/ ""));

    var ra_risk_score = cust_risk_score_avg * 0.4 + geo_risk_score_avg * 0.2 + prod_risk_score_avg_dd * 0.4;
    $("#RA_RISK_SCORE").val(ra_risk_score.toFixed(2));
    $("#PROD_RISK_SCORE_AVG").val(prod_risk_score_avg.toFixed(2));

    console.log("------------------------------------------------------------");
    console.log("cust_risk_score_avg : " + cust_risk_score_avg);
    console.log("geo_risk_score_avg : " + geo_risk_score_avg);
    console.log("prod_risk_score_avg : " + prod_risk_score_avg_dd);

    console.log("cust_risk_score_avg*0.4 : " + cust_risk_score_avg * 0.4);
    console.log("geo_risk_score_avg*0.2 : " + geo_risk_score_avg * 0.2);
    console.log("prod_risk_score_avg_dd*0.4 : " + prod_risk_score_avg_dd * 0.4);

    console.log("re_risk_score : " + ra_risk_score);
    console.log("------------------------------------------------------------");

    var rtValue = "";
    if (ra_risk_score >= 0 && ra_risk_score < 4.0) {
        rtValue = "LOW";
    } else if (ra_risk_score >= 4 && ra_risk_score < 6.0) {
        rtValue = "MEDIUM";
    } else if (ra_risk_score >= 6) {
        rtValue = "HIGH" ;
    } else {
        rtValue = "";
    }
    $("#RA_RISK_RAT").val(rtValue);

    var rtValue = "";
    if (prod_risk_score_avg >= 0 && prod_risk_score_avg < 4.0) {
        rtValue = "LOW";
    } else if (prod_risk_score_avg >= 4 && prod_risk_score_avg < 6.0) {
        rtValue = "MEDIUM";
    } else if (prod_risk_score_avg >= 6) {
        rtValue = "HIGH";
    } else {
        rtValue = "";
    }
    $("#PROD_RISK_SCORE_AVG_RT").val(rtValue);
}
function calcScore1() {
    var prod_demand_dep_trans_val_d = parseFloat($("#PROD_DEMAND_DEP_TRANS_VAL").val().replace(/,/g, ""));
    var prod_demand_dep_sc_d = parseFloat($("#PROD_DEMAND_DEP_SC").val());
    var prod_time_dep_trans_val_d = parseFloat($("#PROD_TIME_DEP_TRANS_VAL").val().replace(/,/g, ""));
    var prod_time_dep_sc_d = parseFloat($("#PROD_TIME_DEP_SC").val());
    var prod_install_dep_trans_val_d = parseFloat($("#PROD_INSTALL_DEP_TRANS_VAL").val().replace(/,/g, ""));
    var prod_install_dep_sc_d = parseFloat($("#PROD_INSTALL_DEP_SC").val());
    var prod_dome_fund_trsf_trans_val_d = parseFloat($("#PROD_DOME_FUND_TRSF_TRANS_VAL").val().replace(/,/g, ""));
    var prod_dome_fund_trsf_sc_d = parseFloat($("#PROD_DOME_FUND_TRSF_SC").val());
    var prod_exc_curr_trans_val_d = parseFloat($("#PROD_EXC_CURR_VAL").val().replace(/,/g, ""));
    var prod_exc_curr_sc_d = parseFloat($("#PROD_EXC_CURR_SC").val());

    var prod_deposits_sum =
        prod_demand_dep_trans_val_d +
        prod_time_dep_trans_val_d +
        prod_install_dep_trans_val_d +
        prod_dome_fund_trsf_trans_val_d +
        prod_exc_curr_trans_val_d;
    console.log("prod_demand_dep_trans_val_d" , prod_demand_dep_trans_val_d);
    console.log("prod_demand_dep_sc_d" , prod_demand_dep_sc_d);
    console.log("prod_time_dep_trans_val_d" , prod_time_dep_trans_val_d);
    console.log("prod_time_dep_sc_d" , prod_time_dep_sc_d);
    console.log("prod_install_dep_trans_val_d" , prod_install_dep_trans_val_d);
    console.log("prod_install_dep_sc_d" , prod_install_dep_sc_d);
    console.log("prod_dome_fund_trsf_trans_val_d" , prod_dome_fund_trsf_trans_val_d);
    console.log("prod_dome_fund_trsf_sc_d" , prod_dome_fund_trsf_sc_d);
    console.log("prod_exc_curr_trans_val_d" , prod_exc_curr_trans_val_d);
    console.log("prod_exc_curr_sc_d" , prod_exc_curr_sc_d );
    var prod_deposits_sc =
        (prod_demand_dep_trans_val_d * prod_demand_dep_sc_d +
            prod_time_dep_trans_val_d * prod_time_dep_sc_d +
            prod_install_dep_trans_val_d * prod_install_dep_sc_d +
            prod_dome_fund_trsf_trans_val_d * prod_dome_fund_trsf_sc_d +
            prod_exc_curr_trans_val_d * prod_exc_curr_sc_d) /
        prod_deposits_sum;
    $("#PROD_DEPOSITS_SC").val(prod_deposits_sc.toFixed(2));

    var rtValue = "";
    if (prod_deposits_sc >= 0 && prod_deposits_sc < 4.0) {
        rtValue = "LOW";
    } else if (prod_deposits_sc >= 4 && prod_deposits_sc < 6.0) {
        rtValue = "MEDIUM";
    } else if (prod_deposits_sc >= 6) {
        rtValue = "HIGH";
    } else {
        rtValue = "";
    }
    $("$PROD_DEPOSITS_RT").val(rtValue);

    calcScoreAvg();        
}

function calcScore2() {
    var prod_money_mk_lend_trans_val_d = parseFloat($("PROD_MONEY_MK_LEND_TRANS_VAL").val().replace(/,/g, ""));
    var prod_money_mk_lend_sc_d = parseFloat($("#PROD_MONEY_MK_LEND_SC").val());
    var prod_money_mk_br_trans_val_d = parseFloat($("#PROD_MONEY_MK_BR_TRANS_VAL").val().replace(/,/g, ""));
    var prod_money_mk_br_sc_d = parseFloat($("#PROD_MONEY_MK_BR_SC").val());
    var prod_treasury_sum = prod_money_mk_lend_trans_val_d + prod_money_mk_br_trans_val_d;

    var prod_treasury_sc = 
        (prod_money_mk_lend_trans_val_d * prod_money_mk_lend_sc_d +
            prod_money_mk_br_trans_val_d * prod_money_mk_br_sc_d) / 
        prod_treasury_sum;
    $("#PROD_TREASURY_SC").val(prod_treasury_sc.toFixed(2));
    console.log("prod_money_mk_lend_trans_val_d" , prod_money_mk_lend_trans_val_d);
    console.log("prod_money_mk_lend_sc_d" , prod_money_mk_lend_sc_d);
    console.log("prod_money_mk_br_trans_val_d" , prod_money_mk_br_trans_val_d);
    console.log("prod_money_mk_br_sc_d" , prod_money_mk_br_sc_d);

    var rtValue = "";
    if (prod_treasury_sc >= 0 && prod_treasury_sc < 4.0) {
        rtValue = "LOW";
    } else if (prod_treasury_sc >= 4 && prod_treasury_sc < 6.0) {
        rtValue = "MEDIUM";
    } else if (prod_treasury_sc >= 6) {
        rtValue = "HIGH";
    } else {
        rtValue = "";
    }
    $("#PROD_TREASURY_RT").val(rtValue);

    calcScoreAvg();
}
function calcScore3() {
    var prod_psn_loan_trans_val_d = parseFloat($("#PROD_PSN_LOAN_TRANS_VAL").val().replace(/,/g, ""));
    var prod_psn_loan_sc_d = parseFloat($("#PROD_PSN_LOAN_SC").val());
    var prod_cmcl_loan_trans_val_d = parseFloat($("#PROD_CMCL_LOAN_TRANS_VAL").val().replace(/,/g, ""));
    var prod_cmcl_loan_sc_d = parseFloat($("#PROD_CMCL_LOAN_SC").val());
    var prod_guarantee_trans_val_d = parseFloat($("#PROD_GUARANTEE_TRANS_VAL").val().replace(/,/g, ""));
    var prod_guarantee_sc_d = parseFloat($("#PROD_GUARANTEE_SC").val());
    var prod_other_loan_trans_val_d = parseFloat($("#PROD_OTHER_LOAN_TRANS_VAL").val().replace(/,/g, ""));
    var prod_other_loan_loan_sc_d = parseFloat($("#PROD_OTHER_LOAN_SC").val());
    var prod_lending_sum = 
        prod_psn_loan_trans_val_d + 
        prod_cmcl_loan_trans_val_d +
        prod_guarantee_trans_val_d + 
        prod_other_loan_trans_val_d;

    var prod_lending_sc = 
        (prod_psn_loan_trans_val_d * prod_psn_loan_sc_d +
            prod_cmcl_loan_trans_val_d * prod_cmcl_loan_sc_d +
            prod_guarantee_trans_val_d * prod_guarantee_sc_d +
            prod_other_loan_trans_val_d * prod_other_loan_loan_sc_d) / 
        prod_lending_sum;
    $("#PROD_LENDING_SC").val(prod_lending_sc.toFixed(2));
    console.log("prod_psn_loan_trans_val_d" , prod_psn_loan_trans_val_d);
    console.log("prod_psn_loan_sc_d" , prod_psn_loan_sc_d);
    console.log("prod_cmcl_loan_trans_val_d" , prod_cmcl_loan_trans_val_d);
    console.log("prod_cmcl_loan_sc_d" , prod_cmcl_loan_sc_d);
    console.log("prod_guarantee_trans_val_d" , prod_guarantee_trans_val_d);
    console.log("prod_guarantee_sc_d" , prod_guarantee_sc_d);
    console.log("prod_other_loan_trans_val_d" , prod_other_loan_trans_val_d);
    console.log("prod_other_loan_loan_sc_d" , prod_other_loan_loan_sc_d);


    var rtValue = "";
    if (prod_lending_sc >= 0 && prod_lending_sc < 4.0) {
        rtValue = "LOW";
    } else if (prod_lending_sc >= 4 && prod_lending_sc < 6.0) {
        rtValue = "MEDIUM";
    } else if (prod_lending_sc >= 6) {
        rtValue = "HIGH";
    } else {
        rtValue = "";
    }

    $("#PROD_LENDING_RT").val(rtValue);

    calcScoreAvg();
}
function calcScore4() {
    var prod_issuance_lc_trans_val_d = parseFloat($("#PROD_ISSUANCE_LC_TRANS_VAL").val().replace(/,/g, ""));
    var prod_issuance_lc_sc_d = parseFloat($("#PROD_ISSUANCE_LC_SC")).val();
    var prod_standby_lc_trans_val_d = parseFloat($("#PROD_STANDBY_LC_TRANS_VAL").val().replace(/,/g/ ""));
    var prod_standby_lc_sc_d = parseFloat($("#PROD_STANDBY_LC_SC").val());
    var prod_nego_lc_dp_da_trans_val_d = parseFloat($("PROD_NEGO_LC_DP_DA_TRANS_VAL").val().replace(/,/g, ""));
    var prod_nego_lc_dp_da_sc_d = parseFloat($("#PROD_NEGO_LC_DP_DA_SC").val());
    var prod_advice_lc_trans_Val_d = parseFloat($("PROD_ADVICE_LC_TRANS_VAL").val().replace(/,/g, ""));
    var prod_advice_lc_sc_d = parseFloat($("#PROD_ADVICE_LC_SC").val());
    var prod_finance_sum = 
        prod_issuance_lc_trans_val_d + 
        prod_standby_lc_trans_val_d +                  
        prod_nego_lc_dp_da_trans_val_d +
        prod_advice_lc_trans_Val_d;

    var prod_finance_sc = 0.0;
    if (prod_finance_sum != 0) {
        prod_finance_sc = 
            (prod_issuance_lc_trans_val_d * prod_issuance_lc_sc_d +
                    prod_standby_lc_trans_val_d * prod_standby_lc_sc_d +
                    prod_nego_lc_dp_da_trans_val_d * prod_nego_lc_dp_da_sc_d +
                    prod_advice_lc_trans_Val_d * prod_advice_lc_sc_d) / 
            prod_finance_sum ;
    }
    $("#PROD_FINANCE_SC").val(prod_finance_sc.toFixed(2));
    console.log("prod_issuance_lc_trans_val_d" , prod_issuance_lc_trans_val_d);
    console.log("prod_issuance_lc_sc_d" , prod_issuance_lc_sc_d);
    console.log("prod_standby_lc_trans_val_d" , prod_standby_lc_trans_val_d);
    console.log("prod_standby_lc_sc_d" , prod_standby_lc_sc_d);
    console.log("prod_nego_lc_dp_da_trans_val_d" , prod_nego_lc_dp_da_trans_val_d);
    console.log("prod_nego_lc_dp_da_sc_d" , prod_nego_lc_dp_da_sc_d);
    console.log("prod_advice_lc_trans_Val_d" , prod_advice_lc_trans_Val_d);
    console.log("prod_advice_lc_sc_d" , prod_advice_lc_sc_d);

    var rtValue = "";
    if (prod_finance_sc >= 0 && prod_finance_sc < 4.0) {
        rtValue = "LOW";
    } else if (prod_finance_sc >= 4 && prod_finance_sc < 6.0) {
        rtValue = "MEDIUM";
    } else if (prod_finance_sc >= 6) {
        rtValue = "HIGH";
    } else {
        rtValue = "";
    }
    $("#PROD_FINANCE_RT").val(rtValue);

    calcScoreAvg();
}
function calcScore5() {
    var prod_usd_vnd_bk_trans_val_d = parseFloat($("#PROD_USD_VND_BK_TRANS_VAL").val().replace(/,/g, ""));
    var prod_usd_vnd_bk_sc_d = parseFloat($("#PROD_USD_VND_BK_SC").val());
    var prod_inout_remit_trans_val_d = parseFloat($("#PROD_INOUT_REMIT_TRANS_VAL").val().replace(/,/g, ""));
    var prod_inout_remit_sc_d = parseFloat($("#PROD_INOUT_REMIT_SC").val());
    var prod_banking_sum = prod_usd_vnd_bk_trans_val_d + prod_inout_remit_trans_val_d;

    var prod_banking_sc = 
        (prod_usd_vnd_bk_trans_val_d * prod_usd_vnd_bk_sc_d + prod_inout_remit_trans_val_d * prod_inout_remit_sc_d) / 
        prod_banking_sum;
    $("#PROD_BANKING_SC").val(prod_banking_sc.toFixed(2));
    console.log("prod_usd_vnd_bk_trans_val_d" , prod_usd_vnd_bk_trans_val_d);
    console.log("prod_usd_vnd_bk_sc_d" , prod_usd_vnd_bk_sc_d);
    console.log("prod_inout_remit_trans_val_d" , prod_inout_remit_trans_val_d);
    console.log("prod_inout_remit_sc_d" , prod_inout_remit_sc_d);

    var rtValue = "";
    if (prod_banking_sc >= 0 && prod_banking_sc < 4.0) {
        rtValue = "LOW";
    } else if (prod_banking_sc >=4 && prod_banking_sc < 6.0) {
        rtValue = "MEDIUM";
    } else if (prod_banking_sc >= 6) {
        rtValue = "HIGH";
    } else {
        rtValue = "";
    }
    $("#PROD_BANKING_RT").val(rtValue);

    calcScoreAvg();
}
function showDetails() {
    if ($("#dvDetails").is(":visible")) {
        $("#dvDetails").hide();
    } else {
        $("#dvDetails").show();
    }
}
function cbGetDetails(data) {
    $("#dvDetails").show();
    $("#sgDetails").show();
    detailInfo = data;
    var dataView = new Slick.Data.DataView();
    var sasJsonRes = data[0];
    var columns = [];
    var options = sasJsonRes["Options"][0];

    columns = sasJsonRes["ColumnInfo"];
    columns[0].cssClass = "c colGroup";

    console.log("columns", columns);
    console.log("options \n" , JSON.stringify(options));

    var sgData = [];
    sgData = sasJsonRes["SASResult"];
    for (ii in sgDAta) {
        var objTemp = $.extend(sgData[ii], eval({ id: ii }));
    }
    console.log("sgData", sgData);

    sgGridDetails = new Slick.Grid("#sgDetails", dataView, columns, options);
    dataView.onRowCountChanged.subscribe(function (e, args) {
        sgGridDetails.updateRowCount();
        sgGridDetails.render();
    });
    dataView.onRowCountChanged.subscribe(function (e, args) {
        console.log("args",args);
        sgGridDetails.invalidateRows(args.rows);
        sgGridDetails.render();
    });
    sgGridDetails.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
    sgGridDetails.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
    sgGridDetails.onClick.subscribe(function (e, args) {
    });
    sgGridDetails.onDblClick.subscribe(function (e, args) {
    });
    sgGridDetails.onSort.subscribe(function (e, args) {
        var comparer = function (a, b) {
            return a[args.sortCol.filed] > b[args.sortCol.field] ? 1 : -1;
        };
        dataView.sort(comparer, args.sortAsc);
    });
    dataView.beginUpdate();
    dataView.setItems(sgDAta);
    dataView.endUpdate();
    $("#dvDetails").hide();
}

