				console.log("getMain rptType :Tabular Start:"+displayTime());
				//$("#dvBox").show();
				$("#dvColumnHeader").show();
				//$("#dvRowHeader").show();
				$("#dvData").show();

				res="<table class=table cellspacing=0 cellpadding=5 rules=all frame=box>" + $("#dvRes .table").html() + "</table>";
				$("#dvColumnHeader").html("<table class=table cellspacing=0 cellpadding=5 rules=all frame=box><thead>"
													+$("#dvRes .table thead").html()+"</thead></table>");

				if ($("#dvUserHeader").html().length < 10) {		//tabulate의 사용자정의헤더가 없는 경우 RowHeader 사이즈 조정
					var rowHeaderCnt=$("#dvColumnHeader th:eq(0)").attr("colspan");
					console.log("rowHeaderCnt : "+rowHeaderCnt);
					//$("#dvColumnHeader th:eq(0)").width(eval(rowHeaderCnt*colWidth));
					//$("#dvData th:eq(0)").width(eval(rowHeaderCnt*colWidth));
				}

				<%
				if(hiddenInfo.containsKey("_STPREPORT_PAGE")){
				%>
				$("#dvPagePanel").html($("#dvRes .dvPagePanel").html());
				<%
				}
				%>

				$("#dvColumnHeader div").css("text-align","left");
				$("#dvData div").css("text-align","left");
				$("#dvData").css("overflow","scroll");


//
				$("#dvColumnHeader tbody tr:gt(5)").remove();
				$("#dvColumnHeader br").remove();
				$("#dvColumnHeader").css("overflow","scroll");
				//$("#dvColumnHeader").width(100000000);

				/*
				setTimeout(function(){
				},0);
				*/

				$("#dvDummy").html($sasResHTML);
				$("#dvDummy").show();
				var tableWidth=$("#dvDummy .table").width();
				var RowCols=0;
				$("#dvDummy tbody tr:first th").each(function(){
					RowCols+=parseInt($(this).attr("colspan"),10);
				});
				var ColCols=$("#dvDummy thead tr:last th").length;
				adjWidth=eval((RowCols+ColCols)*100);
				console.log("dvDummy RowCols:"+RowCols);
				console.log("dvDummy ColCols:"+ColCols);
				console.log("dvDummy adjWidth:"+adjWidth);
				console.log("dvDummy tableWidth:"+tableWidth);
				console.log("dvDummy cols:"+$("#dvDummy thead tr:last th").length);
				if (tableWidth < adjWidth) tableWidth=adjWidth;
				console.log("dvDummy adjTableWidth:"+tableWidth);
				$("#dvDummy").html("");
				$("#dvDummy").hide();

				$("#dvColumnHeader table").css("table-layout","fixed");
				$("#dvColumnHeader table").width(eval(tableWidth));
				$("#dvColumnHeader").css("overflow","hidden");

				$("#dvData colgroup").remove();

				$("#dvData table").width(eval($("#dvColumnHeader table").width()-0));
				$("#dvData thead").width(eval($("#dvColumnHeader thead").width()-0));

				$("#dvData table").css("table-layout","fixed");

				$("#dvData").css("overflow","scroll");

				/*
				$("#dvRowHeader th").height("16");
				$("#dvData td").height("12");
				*/

				$("#dvData thead th").each(function(){
					//$(this).html("");
					$(this).height(10);
					$(this).css("font-size","10px");
					$(this).css("padding-top","0px");
					$(this).css("padding-bottom","0px");
					$(this).css("border-bottom-width","0px");
				})
				$("#dvData thead th").each(function(){
					$(this).height(10);
				})

				$("#dvData").scrollTop(eval($("#dvData thead").height()-0));
				// [계] 합치기 - 20130829 고도균
				//mergeCol();
