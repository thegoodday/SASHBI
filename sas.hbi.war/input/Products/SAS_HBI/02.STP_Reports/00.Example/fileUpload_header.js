console.log("fileUpload!!!");

function fnFileUpload(){
	contString = $("#txaContent").val();
	console.log("contString", contString);

    var form = $("#fomUpload") [0];
    var updata = new FormData(form);

	//execSTPA("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/getTableList(StoredProcess)", 'setSlickGrid2');

	var blob = new Blob([contString], {type: 'text/plain'});
    //updata.append("contString", contString);
	updata.append("file", blob, "contString.txt");
    updata.append(
        "_program",
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/uploadFile(StoredProcess)"
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
        },
        complete: function (data) {
            isRun = 0;
            tParams = eval("[{}]");
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