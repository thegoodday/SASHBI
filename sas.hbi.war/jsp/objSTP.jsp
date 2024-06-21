function render<%=objID%>(data){
	$("#dvRes<%=objID%>").html(data);
	$sasResHTML=data;
	var resSize= $sasResHTML.length;
	//console.log("$sasResHTML : \n" + $sasResHTML);
	$("#<%=objID%>").css("overflow","hidden");
	$("#<%=objID%>").css("overflow-x","hidden");
	$("#<%=objID%>").css("overflow-y","hidden");
	
	var summary=$("#dvRes<%=objID%> .table").attr("summary");
	//console.log("summary : \n" + summary);
	if(typeof summary != "undefined"){
		var summArray=summary.split(" ");
		var procedure=summArray[1].replace(":","");
		if (procedure=="Print") rptType="List";
		else if (procedure=="Tabulate") rptType="Tabular";
	}
	console.log("rptType : " + rptType);

	var dvResRows=$("#dvRes<%=objID%> .table tbody tr").length;
	var branchNum=$("#dvRes<%=objID%> .branch").length;
	var isPaging=$("#dvRes<%=objID%> .dvPagePanel").length;
	if (isPaging > 0) branchNum=1;

	console.log("resSize : " + resSize);
	console.log("branchNum : " + branchNum);
	var title=$("#dvRes<%=objID%> .systitleandfootercontainer").html();
	console.log("title : " + title);
	if (title != undefined) {
		$("#dvTitle<%=objID%>").html("<table width=100%>"+title+"</table>");
		$("#dvTitle<%=objID%>").show();
	}

	if (rptType == "Tabular") {
		$("#dvColumnHeader<%=objID%>").show();
		$("#dvData<%=objID%>").show();
		res="<table class=table cellspacing=0 cellpadding=5 rules=all frame=box>" + $("#dvRes<%=objID%> .table").html() + "</table>";
		$("#dvColumnHeader<%=objID%>").html(res);
		$("#dvData<%=objID%>").html(res);
		$("#dvColumnHeader<%=objID%> tbody tr:gt(0)").remove();
		colHeaderRowCnt=$("#dvColumnHeader<%=objID%> th:eq(0)").attr("rowspan");
		if (typeof colHeaderRowCnt == "undefined") colHeaderRowCnt=1;

		$("#dvColumnHeader<%=objID%>").width(100000000);
		var tableWidth=$("#dvColumnHeader<%=objID%> table").width();
		$("#dvColumnHeader<%=objID%> table").width(eval(tableWidth));
		$("#dvData<%=objID%> table").width(eval(tableWidth));

		adjHeight=eval($("#dvColumnHeader<%=objID%> table thead").height() + 2);
		console.log("$(#dvColumnHeader<%=objID%> table thead).height() :" + $("#dvColumnHeader<%=objID%> table thead").height());
		console.log("adjHeight :" + adjHeight);
		//adjHeight=eval($("#dvColumnHeader<%=objID%> thead").height() + eval(colHeaderRowCnt)+0);
		$("#dvColumnHeader<%=objID%>").height(adjHeight);
		
		
		$("#dvData<%=objID%> thead").html($("#dvColumnHeader<%=objID%> table thead").html());
		$("#dvData<%=objID%> thead th").each(function(){
			$(this).html("");
			$(this).height(1);
			$(this).css("font-size","1px");
			$(this).css("padding-top","0px");
			$(this).css("padding-bottom","0px");
			$(this).css("border-bottom-width","0px");
		})
		if ($("#dvColumnHeader<%=objID%> table").width() != $("#dvData<%=objID%> table").width()){		// oTL width not defined...
			maxTablewidth=Math.max($("#dvColumnHeader<%=objID%> table").width(),$("#dvData<%=objID%> table").width());
			$("#dvColumnHeader<%=objID%> table").width(maxTablewidth);
			$("#dvData<%=objID%> table").width(maxTablewidth);
		}

	
		prntW=$("#<%=objID%>").width();			//$(window).width();
		var dvCondiHeight=$("#dvCondi").height();		
		rMargin=0;
		console.log("$.browser.msie : " + $.browser.msie);
		if($.browser.msie ==true) {
			rMargin=10;
			bMargin=45;
			if ($("#dvPagePanel<%=objID%>").height() < 10 ) bMargin=35;
		}
		var scrollWid=16;
		$("#dvRes<%=objID%>").height(eval($(window).height()-dvCondiHeight-rMargin-bMargin));   // returns height of browser viewport
		dvTitleHeight= $("#dvTitle<%=objID%>").height();
	
		console.log("rMargin : " + rMargin);
		obj<%=objID%>Height=<%=height%> ;
		$("#dvData<%=objID%>").width(eval(prntW-$("#dvRowHeader<%=objID%>").width()-rMargin));
		$("#dvData<%=objID%>").height(eval(obj<%=objID%>Height
												//-$("#dvTitle<%=objID%>").height()
												-$("#dvColumnHeader<%=objID%>").height()
												//-$("#dvPagePanel<%=objID%>").height()
												//-bMargin
												//-dvCondiHeight
												));
		$("#dvData<%=objID%>").parent().prop("height",$("#dvData<%=objID%>").height()+"px");							
		$("#dvData<%=objID%>").parent().attr("height",$("#dvData<%=objID%>").height()+"px");							
		$("#dvData<%=objID%>").parent().height($("#dvData<%=objID%>").height());		
		$("#dvData<%=objID%>").parent().css("vertical-align","top");							
							
	
		$("#dvColumnHeader<%=objID%>").width(eval($("#dvData<%=objID%>").width()-scrollWid));	
		var isOBS=$("#dvRowHeader<%=objID%> tbody tr:eq(0)").find("th").length;
		$("#dvData<%=objID%>").scroll(function() {
			if($(this).scrollTop() < $("#dvData<%=objID%> thead").height() ) {
				$(this).scrollTop(eval($("#dvData<%=objID%> thead").height()-0));
			}
	    	$("#dvColumnHeader<%=objID%>").scrollLeft($(this).scrollLeft());
	    	$("#dvRowHeader<%=objID%>").scrollTop($(this).scrollTop());
				if(isOBS > 0){
		    	if($(this).scrollTop() > $("#dvRowHeader<%=objID%>").scrollTop() ) {
		    		$(this).scrollTop($("#dvRowHeader<%=objID%>").scrollTop());
		    	}
	    	}
	    	if($(this).scrollLeft() > $("#dvColumnHeader<%=objID%>").scrollLeft() ) {
	    		$(this).scrollLeft($("#dvColumnHeader<%=objID%>").scrollLeft());
	    	}
		});

/*		
		//$("#dvData<%=objID%> tbody tr").height(10);
		//$("#dvData<%=objID%> td").css("vertical-align","top");
		//$("#dvData<%=objID%> tbody td").removeClass("b");
		//$("#dvData<%=objID%> tbody td").addClass("t");
		//$("#dvData<%=objID%> tbody td").css("padding","0px 3px 7px 3px");

*/


			
	} else {																			// Start of List or Tabular 가 아니라면
		//$("#dvRes<%=objID%>").show();
		$("#<%=objID%>").html(data);
	} 																						// End of List or Tabular 가 아니라면

	$("#dvOutput<%=objID%>").hide();
	if (resSize < threshold ){
		$("#dvData<%=objID%> tr:odd").find("td").addClass("dataStripe");
		$("#dvData<%=objID%> tr").mouseover(function(){
			$(this).find("td").addClass("curRow");
		})
		$("#dvData<%=objID%> tr").mouseout(function(){
			$(this).find("td").removeClass("curRow");
		})
	}
 
	$("#dvOutput<%=objID%>").fadeIn("slow");
	$("#progressIndicatorWIP").hide();
	$sasExcelHTML=$("#dvRes<%=objID%>").html();
}
