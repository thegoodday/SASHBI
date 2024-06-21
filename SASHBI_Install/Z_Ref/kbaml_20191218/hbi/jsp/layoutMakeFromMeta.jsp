<div id=dvOutput style="width:100%;display:block;border:0px solid #efefef;overflow-y:auto;overflow-x:auto;">
<%
	String objID="";
	try{
	rowObj = new JSONObject(layoutStr);
	for (int ii=0; ii<rowObj.length(); ii++){
		JSONObject row=(JSONObject)rowObj.getJSONObject("R"+ii);
%>
	<table style="width:100%;table-layout:fixed;border:0px solid #ffdddd;border-spacing:0px;" border=0>		
		<tr>
			<td style="padding:0px;">
<%
		int empColNum=0;
		int notEmpColWidth=0;
		for(int jj=0;jj<row.length();jj++){
			JSONObject colObj=(JSONObject)row.getJSONObject("C"+jj);
			String width	=(String)colObj.get("width");
			width=width.replaceAll("px","");
			logger.debug("width : " + width);
			if (width.equalsIgnoreCase("")) {  
				empColNum++;
			} else {
				int widthNum =Integer.parseInt(width);
				notEmpColWidth+=widthNum;
			}
		}
		notEmpColWidth=Math.max(1,notEmpColWidth);
%>
<script>
var empColNum<%=ii%> = <%=empColNum %> ;
var notEmpColWidth<%=ii%>=<%=notEmpColWidth %>;
console.log("empColNum : <%=empColNum%>");	
console.log("notEmpColWidth : <%=notEmpColWidth%>");	
</script>
<%		
		for(int jj=0;jj<row.length();jj++){
			JSONObject colObj=(JSONObject)row.getJSONObject("C"+jj);
			objID	=(String)colObj.get("id");
			String type	=(String)colObj.get("type");
			String typeOpt="";
			String svgTag="";
			String contextTag="";
			String sliderTag="";
			if (type.equalsIgnoreCase("HTML")) typeOpt="overflow-y:auto;overflow-x:auto;";
			logger.debug("typeOpt: " + typeOpt);
			String width	=(String)colObj.get("width")+"px";
			String height	=(String)colObj.get("height")+"px";
			String float_opt	=(String)colObj.get("float");
			//if ( row.length() > 0 ) float_opt="left";
			// ==> center???
			String style	=(String)colObj.get("style");
			String htmlTag =(String)colObj.get("tag");
			if (!width.equalsIgnoreCase("")) width="width:"+ width +";";
			if (!height.equalsIgnoreCase("")) height="height:"+ height +";";
			if (!float_opt.equalsIgnoreCase("")) float_opt="float:"+ float_opt +";";
			if (style.equalsIgnoreCase("")) style="position:relative;border:0px solid #fefefe;";
			if (type.equalsIgnoreCase("Graph")){
				svgTag="<svg id=svg"+objID+"></svg>";
				String graph_type = (String)colObj.get("graph_type");
				String x_slider = (String)colObj.get("x_slider");
				contextTag="oncontextmenu=\"savePop(\'"+objID+"\');\"";
				logger.debug("contextTag : " + contextTag);
				//if (graph_type.equalsIgnoreCase("BarChart")){			//LineChart
				if (x_slider.equalsIgnoreCase("Yes")){	
						sliderTag="<div style='padding:5px;width:90%;float:right;margin-right:5px;'><div id='slider"+ objID +"'></div></div>";
%>
			<script>			
			$(document).ready(function () {
				$("#<%=objID%>").height(eval($("#<%=objID%>").height()-18)); //18은 슬라이더 height
			})
			</script>			
<%
				}
				//}
			} else if (type.equalsIgnoreCase("Tag")){
			}
%>
				<div id="prt<%=objID%>" style="<%=width%>;<%=height%>;<%=float_opt%>;<%=style%>;">
					<div id="<%=objID%>" <%=contextTag%> style="display:none;float:clear;border:0px solid #dddddd;<%=height%><%=typeOpt%>"><%=svgTag%><%=htmlTag%>
<%
					if (type.equalsIgnoreCase("HTML")) {
%>
						<table id=tblOutput<%=objID%> border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td colspan=2>
									<div id=dvTitle<%=objID%> ></div>
								</td>
							</tr>
							<tr>
								<td><div id=dvBox<%=objID%> class=></div></td>
								<td vAlign=top><div id=dvColumnHeader<%=objID%> ></div></td>
							</tr>
							<tr>
								<td><div id=dvRowHeader<%=objID%> class=></div></td>
								<td vAlign=top><div id=dvData<%=objID%> ></div></td>
							</tr>
							<tr>
								<td colspan=2>
									<div id=dvPagePanel<%=objID%> style="text-align:center"></div>
								</td>
							</tr>
						</table>
						<div id=dvRes<%=objID%> style="display:none;"></div>
						<style>
#dvTitle<%=objID%> {
	overflow: hidden;
	margin: 0px 0px 0px 0px;
	background-color: #ffffff;
	border:0px solid #ff0000;
}
#dvBox<%=objID%> {
	overflow: hidden;
	margin: 0px 0px 0px 0px;
	background-color: #ffffff;
	border:0px solid #ff0000;
}
#dvColumnHeader<%=objID%> {
	overflow-x: hidden;
	overflow-y: hidden;
	margin-bottom:0px;
	margin-right:0px;
	text-align:left;
	background-color: #ffffff;
	border:0px solid #ff0000;
}
#dvRowHeader<%=objID%> {
	overflow: hidden;
	height:444px;
	margin-bottom:0px;
	text-align:left;
	background-color: #ffffff; 
	border : 0px solid #8597C7;
	table-layout: fixed;
}
#dvData<%=objID%> { 
	overflow-y: scroll;
	overflow-x: scroll;
	height:300px;
	margin-top:0px;
	margin-bottom:14px;
	margin-right:0px;
	text-align:left;
	border : 0px solid #8597C7;
}	
#dvRes<%=objID%> { 
	overflow-y: scroll;
	overflow-x: scroll;
	margin-top:0px;
	margin-bottom:14px;
	margin-right:0px;
	text-align:left;
	border : 0px solid #8597C7;
}	
						</style>
<%
					}
%>						
					</div>
					<%=sliderTag%>
				</div>
<%			
			String tStr=(String)colObj.get("width");
			logger.debug("tStr : " + tStr);
			if ( tStr.equalsIgnoreCase("")){
%>
			<script>			
			$(document).ready(function () {		// 20 : Scroll-bar Width
				var objWidth=eval(($(window).width()-20-notEmpColWidth<%=ii%>)/empColNum<%=ii%>);
				console.log("$(window).width() : " + $(window).width());
				console.log("objWidth : " + objWidth);
				var adjW=eval(objWidth-empColNum<%=ii%>-20);
				console.log("adjW : " + adjW);
				$("#prt<%=objID%>").css("width",eval(objWidth-empColNum<%=ii%>*3)+"px"); 
			})
			$(window).resize(function () {
				var objWidth=eval(($(window).width()-20-notEmpColWidth<%=ii%>)/empColNum<%=ii%>);
				console.log("objWidth : " + objWidth);
				$("#prt<%=objID%>").css("width",eval(objWidth-empColNum<%=ii%>*3)+"px"); 
			})
			</script>			
<%			
			}
			tStr=(String)colObj.get("height");
			logger.debug("Height : " + tStr);
			logger.debug("rowObj.length() : " + rowObj.length());
			if (rowObj.length() == 1 && tStr.equalsIgnoreCase("")){
			//if (tStr.equalsIgnoreCase("")){
%>
			<script>			
			$(document).ready(function () {
				var objHeight=eval($(window).height()-$("#dvCondi").height()-35);
				$("#prt<%=objID%>").css("height",eval(objHeight-0)+"px"); 
				$("#<%=objID%>").css("height",eval(objHeight-0)+"px"); 
			})
			$(window).resize(function () {
				var objHeight=eval($(window).height()-$("#dvCondi").height()-35);
				$("#prt<%=objID%>").css("height",eval(objHeight-0)+"px"); 
				$("#<%=objID%>").css("height",eval(objHeight-0)+"px"); 
			})
			</script>			
<%			
			}
		}
%>
			</td>
		</tr>
	</table>
<%			
	}
	} catch (Exception e){
		logger.error("layoutStr Parsing Error!!!");
		logger.error("layoutStr :\n");
		logger.error(layoutStr);
	}
%>          
</div>  
<style>
.ui-slider .ui-slider-handle {
	height:10px;
	width:10px;
}
.ui-slider-horizontal {
	height:5px;
}

						
</style> 