<%
					if (grp_opt.equalsIgnoreCase("")){
						grp_opt="margin: {left: 60, bottom: 45},\n";
						grp_opt+="\t\t\tx: function(d,i) {return d[0]},\n";
						grp_opt+="\t\t\ty: function(d) {return d[1]},\n";
						grp_opt+="\t\t\tshowXAxis: true,\n";
						grp_opt+="\t\t\tshowYAxis: true,\n";
						grp_opt+="\t\t\ttransitionDuration: 250";
					}
					String chartModel="";
					if ( x_slider.equalsIgnoreCase("Yes")) {
						chartModel="lineWithFocusChart()";
					}
					else { chartModel="lineChart()";}
					logger.debug("x_slider : " + x_slider);
					logger.debug("chartModel : " + chartModel);			
%>
function render<%=objID%>(data){
	var gDataLine=eval(data);
	var chart;
	nv.addGraph(function() {
		chart = nv.models.<%=chartModel%>	
		.color(d3.scale.category10().range())
		.interpolate("basis") 
		.options({
			x: function(d,i) {return d[0]},
			y: function(d) {return d[1]},  
			<%=grp_opt%>
		})
	
		//chart.xAxis.tickFormat(d3.format(',r'));
		//chart.xAxis.tickFormat(function(d) { return d3.time.format('%Y/%m/%d')(new Date(d)); });
		//chart.yAxis.tickFormat(d3.format(',.4f'));
		<%=grp_stmt%>
		try {
		d3.select('#<%=objID%> svg')
			.datum(gDataLine)
			.call(chart);
		
		nv.utils.windowResize(chart.update);
		
		chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });
		
		
<%			
				logger.debug("objType : " + objType);
				String columnName="";
				String funcName="";
				String stpID="";
				String objGraphType="";
				String outType="";
				String fURL="";
				String gType="";
				String params="";
				String param="";
				String scr="";
				int mm;
				JSONArray cl_stp;
				try {
					cl_stp = (JSONArray)colObj.getJSONArray("cl_stp");
					if (colObj.has("graph_type")) objGraphType = (String)colObj.get("graph_type");
				} catch (JSONException e) {
					cl_stp = new JSONArray(stpInit);
				}
				logger.debug("cl_stp : " + cl_stp);			
%>
		chart.lines.dispatch.on('elementClick', function(e){
			console.log('element: ' + e.value);
			console.dir(e);
			console.log("key : " + e.series.key);
			console.log("x : " + e.point[0]);
			console.log("y : " + e.point[1]);
			var xVal=eval(e.point[0] + (365*10*24*60*60*1000) + (3*24*60*60*1000))/(24*60*60*1000);
<%					
				for (mm=0; mm<cl_stp.length();mm++){
					if (mm == 0){
					}
					JSONObject evC=(JSONObject)cl_stp.getJSONObject(mm);
					funcName	=(String)evC.get("funcName");
					//if (!funcName.equalsIgnoreCase("")) funcName="render"+funcName;
					if (evC.has("stp")) stpID = (String)evC.get("stp");
					if (evC.has("params")) params = (String)evC.get("params");
					if (evC.has("gType")) gType = (String)evC.get("gType");
					logger.debug("Click STP funcName : " + funcName);
					logger.debug("Click STP stpID : " + stpID);
					logger.debug("Click STP params : " + params);
					if (!stpID.equalsIgnoreCase("") && !stpID.equalsIgnoreCase("User Defined")) {
						StringTokenizer tkParams = new StringTokenizer(params, ",");
						int ii=1;
						while(tkParams.hasMoreTokens()){
							param = tkParams.nextToken().trim();
							logger.debug("\t\t\tParam : " + param);
							scr="tParams['param" + ii + "']='" + param + "';";
							out.println("\t\t\t"+scr);
							ii++;
						}						
						scr="execSTPA(\"SBIP://METASERVER"+stpID+"\",\"render"+funcName+"\","+"e.point[0],"+"e.point[1]"+");";
						out.println("\t\t\t"+scr);
					} else if (stpID.equalsIgnoreCase("User Defined")){
						scr="tParams['param1']='target';";
						out.println("\t\t\t"+scr);
						
						StringTokenizer tkParams = new StringTokenizer(params, ","); 
						int ii=2;
						while(tkParams.hasMoreTokens()){
							param = tkParams.nextToken().trim();
							logger.debug("\t\t\tParam : " + param);
							scr="tParams['param" + ii + "']='_DRILL_" + param + "';";
							out.println("\t\t\t"+scr);
							ii++;
						}	
						fURL="submit"+gType;
						if (objType.equalsIgnoreCase("HTML")) outType="html";
						else outType="json";
						logger.debug("fURL : " + fURL);
						out.println("\t\t\texecAjax(\"" + fURL +"\",\""+metaID+"\",true,\"render" + funcName + "\",\""+outType+"\",\""+funcName+"\",xVal);");	
					}
				}
				out.println("\t\t});");
%>
		} catch(err) {
			console.log("ERROR Occured!!! : " + err);
		}
		return chart;
	});	
}
