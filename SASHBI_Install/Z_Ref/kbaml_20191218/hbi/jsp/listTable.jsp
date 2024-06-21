				console.log("getMain rptType:List Start:"+displayTime());
				$("#dvBox").show();
				$("#dvColumnHeader").show();
				//$("#dvRowHeader").show();
				$("#dvData").show();

				res="<table class=table cellspacing=0 cellpadding=5 rules=all frame=box>" + $("#dvRes .table").html() + "</table>";
				$("#dvColumnHeader").html("<table class=table cellspacing=0 cellpadding=5 rules=all frame=box><thead>"
													+$("#dvRes .table thead").html()+$orgHead.html()+"</thead></table>");
				$("#dvData").html(res);

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

				$("#dvColumnHeader tbody tr:gt(0)").remove();
				$("#dvColumnHeader br").remove();
				$("#dvColumnHeader").css("overflow","scroll");
				//$("#dvColumnHeader").width(100000000);

				var tableWidth=$("#dvRes").width();
				$("#dvColumnHeader table").css("table-layout","fixed");
				console.log("winW: "+winW);
				console.log("tableWidth: "+tableWidth);
				if ( $("#dvColumnHeader table").width() > winW ) {
					console.log("dvColumnHeader table > "+winW);
				   //$("#dvColumnHeader table").width(eval(tableWidth-25));
				} else {
					//$("#dvColumnHeader table").width(eval(tableWidth-0));
				}
				$("#dvColumnHeader").show();
				$("#dvColumnHeader").css("overflow","hidden");

				$("#dvData colgroup").remove();
				$("#dvData thead").remove();

				$("#dvData tbody").before("<thead>"+$("#dvColumnHeader thead ").html()+"</thead>");
				$("#dvData table").width(eval($("#dvColumnHeader table").width()-0));
				$("#dvData thead").width(eval($("#dvColumnHeader thead").width()-0));

				$("#dvData tbody tr:first td").each(function(index){
					$(this).width($(this).width());
				});
				$("#dvData table").css("table-layout","fixed");

				$("#dvData").css("overflow","scroll");

				$("#dvRowHeader th").height("16");
				$("#dvData td").height("12");

				$("#dvColumnHeader tr:last").remove();

				$("#dvData thead th").each(function(){
					$(this).html("");
					$(this).height(1);
					$(this).css("font-size","1px");
					$(this).css("padding-top","0px");
					$(this).css("padding-bottom","0px");
					$(this).css("border-bottom-width","0px");
				})
				$("#dvData thead th").each(function(){
					$(this).height(1);
				})

				$("#dvData").scrollTop(eval($("#dvData thead").height()-0));
