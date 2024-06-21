				console.log("getMain rptType :Tabular Start:"+displayTime());
				//$("#dvBox").show();
				$("#dvColumnHeader").show();
				//$("#dvRowHeader").show();
				$("#dvData").show();

				res="<table class=table cellspacing=0 cellpadding=5 rules=all frame=box>" + $("#dvRes .table").html() + "</table>";
				//$("#dvColumnHeader").html("<table class=table cellspacing=0 cellpadding=5 rules=all frame=box><thead>"
				//									+$("#dvRes .table thead").html()+"</thead></table>");
				$("#dvColumnHeader").html(res);
				$("#dvData").html(res);

				$("#dvColumnHeader tbody tr:gt(0)").remove();
				colHeaderRowCnt=$("#dvColumnHeader th:eq(0)").attr("rowspan");
				if (typeof colHeaderRowCnt == "undefined") colHeaderRowCnt=1;
				
				var BrowserType = getBrowserType();
	
				if (BrowserType == "IE7" || BrowserType == "IE8" ){              
				} else {
				}
				adjHeight=eval($("#dvColumnHeader thead").height() + eval(colHeaderRowCnt)+0);
				
				// for Debug
				$("#dvColumnHeader").height(adjHeight);
				console.log("colHeaderRowCnt :" + colHeaderRowCnt);
				console.log("dvColumnHeader adjHeight :" + adjHeight);
				console.log("document.documentMode : " + document.documentMode);
				console.log("BrowserType : " + getBrowserType());

				$("#dvColumnHeader").width(100000000);
				var tableWidth=$("#dvColumnHeader table").width();
				
				$("#dvColumnHeader table").width(eval(tableWidth));
				$("#dvData table").width(eval(tableWidth));
				
				$("#dvData thead").html($("#dvColumnHeader table thead").html());
				$("#dvData thead th").each(function(){
					$(this).html("");
					$(this).height(1);
					$(this).css("font-size","1px");
					$(this).css("padding-top","0px");
					$(this).css("padding-bottom","0px");
					$(this).css("border-bottom-width","0px");
				})

console.log("dvColumnHeader table: " + $("#dvColumnHeader table").width());
console.log("dvData table        : " + $("#dvData table").width());

				if ($("#dvColumnHeader table").width() != $("#dvData table").width()){		// oTL width not defined...
					maxTablewidth=Math.max($("#dvColumnHeader table").width(),$("#dvData table").width());
					$("#dvColumnHeader table").width(maxTablewidth);
					$("#dvData table").width(maxTablewidth);
				}
				if (userDefHeader.length > 10) {		
					$("#dvData tbody tr:first th").each(function(index){
						hWid=$(this).width();
						console.log("aa: " + $(this).width() + ":" + $(this).html());
						$("#dvColumnHeader tbody tr:first th:eq("+index+")").width(hWid);
						//$("#dvColumnHeader tbody tr:first th:eq("+index+")").css("background-color","green");
					})
					$("#dvData tbody tr:first td").each(function(index){
						hWid=$(this).width();
						$("#dvColumnHeader tbody tr:first td:eq("+index+")").width(hWid);
						//$("#dvColumnHeader tbody tr:first td:eq("+index+")").css("background-color","orange");
					})
				}
				