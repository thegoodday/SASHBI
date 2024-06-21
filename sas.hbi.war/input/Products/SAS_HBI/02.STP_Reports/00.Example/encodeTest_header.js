var board_id = 1000;
var userID = "sas";

function setSlickGrid(data){
}
$(document).ready(function () {

    console.log("Encode Test");
    encodeTest1();          //STP Parameter Error!!! ==> 
        /*
            FormData() 사용시 한글 깨짐 현상 발생 
                ==> encodeURIComponent 
                    ==> utf8로 데이터 전송
                        ==> sas_ko 에서 transcode 에러 발생
        */
    // encodeTest2();      OK!!!
    // encodeTest3();    utf8 데이터로 서버에 전달
    // encodeTest4();
});
function encodeTest4(){    
    var charset = "EUC-KR"
    var url = "/SASStoredProcess/do";
    var dataType = "JSON";
    var isAsync = true;

    article_title = "한글 테스트 타이틀";
    article_content = "한글 테스트 컨텐츠";

    
    utf8Encoder = new TextEncoder();
    eucKrDecoder = new TextDecoder('euc-kr');
    article_title_U8B = utf8Encoder.encode(article_title);
    article_title = eucKrDecoder.decode(article_title_U8B);
    console.log("article_title", article_title);

    article_content_U8B = utf8Encoder.encode(article_content);
    article_content = eucKrDecoder.decode(article_content_U8B);

    article_title = encodeURIComponent(article_title);
    article_content = encodeURIComponent(article_content);
	var param={
        _debug      : "log",
        _program	: "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/encodeTest(StoredProcess)",
        _result     : "STREAMFRAGMENT",
        charset		: charset,
        board_id: 1000,
        parent_id: 0,
        article_title : article_title,
        article_content : article_content,        
    }

	$.ajax({
		url: url,
		type: "post",
		data: param,
		dataType: dataType,
		cache:false,
		async: isAsync,
        charset: charset,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) {
				$("#progressIndicatorWIP").show();
			}		
		},
		success : function(data){	
			console.log("execAjax success" );
		},
		complete: function(data){
			//data.responseText;	
			isRun=0;
			tParams=eval('[{}]');
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" +  xhr + "error: " + error);
			console.log(xhr);
			console.log(status);
			alert(error);
		}
	});    
}
function encodeTest3(){    
    var charset = "EUC-KR"
    var url = "/SASStoredProcess/do";
    var dataType = "JSON";
    var isAsync = true;

    article_title = encodeURIComponent("한글 테스트 타이틀");
    article_content = encodeURIComponent("한글 테스트 컨텐츠");
	var param={
        _debug      : "log",
        _program	: "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/encodeTest(StoredProcess)",
        _result     : "STREAMFRAGMENT",
        charset		: charset,
        board_id: 1000,
        parent_id: 0,
        article_title : article_title,
        article_content : article_content,        
    }

	$.ajax({
		url: url,
		type: "post",
		data: param,
		dataType: dataType,
		cache:false,
		async: isAsync,
        charset: charset,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) {
				$("#progressIndicatorWIP").show();
			}		
		},
		success : function(data){	
			console.log("execAjax success" );
		},
		complete: function(data){
			//data.responseText;	
			isRun=0;
			tParams=eval('[{}]');
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" +  xhr + "error: " + error);
			console.log(xhr);
			console.log(status);
			alert(error);
		}
	});    
}
function encodeTest2(){    
    var charset = "EUC-KR"
    var url = "/SASStoredProcess/do";
    var dataType = "JSON";
    var isAsync = true;

    article_title = "한글 테스트 타이틀";
    article_content = "한글 테스트 컨텐츠";
	var param={
        _debug      : "log",
        _program	: "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/encodeTest(StoredProcess)",
        _result     : "STREAMFRAGMENT",
        charset		: charset,
        board_id: 1000,
        parent_id: 0,
        article_title : article_title,
        article_content : article_content,        
    }

	$.ajax({
		url: url,
		type: "post",
		data: param,
		dataType: dataType,
		cache:false,
		async: isAsync,
        charset: charset,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) {
				$("#progressIndicatorWIP").show();
			}		
		},
		success : function(data){	
			console.log("execAjax success" );
		},
		complete: function(data){
			//data.responseText;	
			isRun=0;
			tParams=eval('[{}]');
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" +  xhr + "error: " + error);
			console.log(xhr);
			console.log(status);
			alert(error);
		}
	});    
}
function encodeTest1(){
    
    var form = $("#fomUpload") [0];
    var updata = new FormData(form);
    var updata = new FormData();
    
    article_title = "한글 테스트 타이틀";
    article_content = "한글 테스트 컨텐츠";

    updata.append("article_title", article_title);
    updata.append("article_content", article_content);
    updata.append("article_owner", userID);
    updata.append("charset", "UTF-8");
    updata.append(
        "_program",
        "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/encodeTest(StoredProcess)"
    );
    console.log("form", updata);
    $.ajax({
        enctype: "multipart/form-data; charset=UTF-8",
        // enctype: "application/x-www-form-urlencoded",
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
function cbRegistArticle(data){
    console.log("data", data);
}