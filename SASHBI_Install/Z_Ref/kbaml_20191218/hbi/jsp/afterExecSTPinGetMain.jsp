	console.log("getMain Check Start:"+displayTime());

	// execSTP에서 dvRes에 copy했음으로...
	//$("#dvRes").html($sasResHTML);

	var summary=$("#dvRes .table").attr("summary");
	//var summary=$sasResHTML.find("table").attr("summary");
	console.log("getMain Metadata rptType: " + rptType);
	console.log("getMain table summary : "+summary);
	if(typeof summary != "undefined"){
		var summArray=summary.split(" ");
		var procedure=summArray[1].replace(":","");
		//if (rptType == "") {
			if (procedure=="Print") rptType="List";
			else if (procedure=="Tabulate") rptType="Tabular";
		//}
		console.log("getMain Captured rptType: " + rptType);
	}
	console.log("dvRes map : " + $("#dvRes map").length);
	if($("#dvRes map").length > 0){
		rptType="Graph";
	}
	//var org=$sasResHTML;
	var ErrorHTML=$("#SASLog").html();
	var debugMSG=$("#dvRes div:last").html();
	var Contents="";
	$("#dvRes .branch").each(function( index ){
				Contents=Contents+$(this).html();
	});
	//console.log("Contents : "+ Contents);
	if(typeof ErrorHTML != "undefined"){
		$("#progressIndicatorWIP").hide();
		var ErrorTitle=$("#dvRes .solutionsErrorTitle").html();
		if(isDebug=="true") {
			$("#dvRes").html(ErrorTitle+ErrorHTML);
		} else {
			$("#dvRes").html(ErrorTitle+"\n 관리자에게 문의하시기 바랍니다.");
		}
		bMargin=30;rMargin=10;
		var dvCondiHeight=$("#dvCondi").css("height").substring(0,$("#dvCondi").css("height").length-2);
		$("#dvRes").css("width",eval($(window).width()-rMargin)+"px");
		$("#dvRes").css("height",eval($(window).height()-dvCondiHeight-bMargin)+"px");
		$("#dvRes").show();
		return;
	} else if(typeof Contents != "undefined"){
		$sasResHTML=Contents;
	}

	console.log("getMain Check End:"+displayTime());


	$orgHead=$("#dvRes thead").clone();
	if ($("#dvUserHeader").html().length > 10) {
		//console.log("getMain dvUserHeader:\n" + $("#dvUserHeader").html());
		//$userHeader="<thead>"+$("#dvUserHeader tbody").html() + "</thead>";
		$userHeader=$("#dvUserHeader tbody").html();
		$("#dvRes thead").html($userHeader);
	}

	console.log("getMain userHeader End:"+displayTime());


	//console.log("getMain resSize:"+ resSize);
	var dvResRows=$("#dvRes .table tbody tr").length;
	console.log("dvResRows : " + dvResRows);
	var branchNum=$("#dvRes .branch").length;
	console.log("branchNum : " + branchNum);
	var isPaging=$("#dvRes .dvPagePanel").length;
	console.log("isPaging : " + isPaging);
	if (isPaging > 0) branchNum=1;
	console.log("getMain last rptType : " + rptType);

	if (
			(resSize > threshold || branchNum > 1)
			&& ( orgRptType != "GraphTable" )
			&& ( orgRptType != "2GraphTable" )
			) {
		console.log("Start : resSize > threshold || branchNum > 1  ");
		$("#dvRes").show();
	} else if (branchNum ==1 && (rptType == "" || rptType == "Graph") ) {		// 그래프를 하나만 그렸을 경우... 다른 case가 있을까???
		console.log("Start : branchNum ==1 and rptType in ('','graph')");
		$("#dvRes").show();
		$("#dvTitle").hide();
	} else {																						// Start of resSize > threshold else 결과사이즈가 임계치 안에 있다면
		console.log("Start by RptType  ");

		// Title은 버젼이나 리포트 타입에 영향받지 않음으로...
		var title=$("#dvRes .systitleandfootercontainer").html();
		if (title != undefined) {
			$("#dvTitle").html("<table width=100%>"+title+"</table>");
			$("#dvTitle").show();
		}

		//if ($.browser.version == 8 && document.documentMode == 8) {
			if (orgRptType == "GraphTable") {																	// Graph & Table
				console.log("GraphTable");
				$("#dvGraph1").show();
				$("#dvBox").show();
				$("#dvColumnHeader").show();
				//$("#dvRowHeader").show();
				$("#dvData").show();

				$("#dvGraph1").html($("#dvRes .branch:eq(0)").html());
				$("#dvGraph1 br").remove();
				//$("#dvGraph1").html("<img src='/SASBITreeViewer/images/progress.gif'>");
				//$("#dvGraph1").html("<p style='height:200px;'>test</p>");
				rptType="Tabular";
			} else if (orgRptType == "2GraphTable") {																	// Graph & Table
				console.log("2GraphTable");
				$("#dvTitle").hide();
				$("#dvGraph1").show();
				$("#dvBox").show();
				$("#dvColumnHeader").show();
				//$("#dvRowHeader").show();
				$("#dvData").show();

				$("#dvGraph1").html("<table width=100%><tr><td>"+$("#dvRes .branch:eq(0)").html()+"</td><td>" + $("#dvRes .branch:eq(1)").html()+"</td></tr></table>");
				$("#dvGraph1 br").remove();
				$("#dvGraph1 p").remove();
				$("#dvGraph1 hr").remove();
				//$("#dvGraph1").html("<img src='/SASBITreeViewer/images/progress.gif'>");
				//$("#dvGraph1").html("<p style='height:200px;'>test</p>");
				rptType="Tabular";
			}
			if (rptType == "List") {
				<%@include file="listTable.jsp"%>			
			} else if (rptType == "Tabular") {
				<%@include file="tabularTable.jsp"%>
			} else {																		// Start of List or Tabular 가 아니라면
				console.log("getMain not (List or Tabular) Start:"+displayTime());
				$("#dvRes").show();
			} 																						// End of List or Tabular 가 아니라면
	}																								// End of resSize > threshold else 결과사이즈가 임계치 안에 있다면


	$("#dvOutput").hide();


/*
	if (resSize < threshold ){
		//* Data Table Stripe ********************************************************************;
		$("#dvData tr:odd").find("td").addClass("dataStripe");
		$("#dvData tr").mouseover(function(){
			$(this).find("td").addClass("curRow");
		})
		$("#dvData tr").mouseout(function(){
			$(this).find("td").removeClass("curRow");
		})
	}
*/ 

	$("#dvOutput").fadeIn("slow");

	$("#progressIndicatorWIP").hide();

	console.log("getMain EXL Copy Start:"+displayTime());
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML=$("#dvRes").html();
	console.log("getMain dvRes Size: " + $("#dvRes").html().length);
	console.log("getMain EXL Copy End:"+displayTime());


<%
	Stub.incFile(hiddenInfo,"_STPREPORT_AFTER_MAIN_JS", (String)session.getAttribute("sas_StoredProcessCustomPath_HBI"),out);
%>
	if (msieversion() == 0) resizeFrame();
	if (document.documentMode > 7) resizeFrame();