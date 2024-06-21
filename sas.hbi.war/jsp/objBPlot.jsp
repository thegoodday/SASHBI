<%				
					if (grp_opt.equalsIgnoreCase("")){
						grp_opt="margin: { left: 120, bottom: 50 },\n";
						grp_opt+="\t\t\tshowXAxis: true,\n";
						grp_opt+="\t\t\tshowYAxis: true,\n";
						grp_opt+="\t\t\tstacked: true,\n";
						grp_opt+="\t\t\ttooltips: true,\n";
						grp_opt+="\t\t\tdelay:1,\n";
						grp_opt+="\t\t\trotateLabels:0,\n";
						grp_opt+="\t\t\tgroupSpacing:0.1,\n";
						grp_opt+="\t\t\ttransitionDuration: 250";
					}
%>
function render<%=objID%>(data){ 
	var gDataScatter=eval(data);
	//console.log(gDataScatter);
	
	var chart;
	nv.addGraph(function() {	
		chart = nv.models.scatterChart()
			.showDistX(true)
			.showDistY(true)
			.useVoronoi(true)
			.color(d3.scale.category10().range()) 
			//.transitionDuration(300)
		;
		
		chart.xAxis.tickFormat(d3.format('.02f'));
		chart.yAxis.tickFormat(d3.format('.02f'));
		/*
		chart.tooltipContent(function(key) {
			return '<h3>' + key + '</h3>';
		});
		*/
		
		console.log(gDataScatter);
		try {
		d3.select('#<%=objID%> svg')
			.datum(gDataScatter)
			.call(chart);		
		nv.utils.windowResize(chart.update);
		
		chart.dispatch.on('stateChange', function(e) { ('New State:', JSON.stringify(e)); });
		console.log(chart);
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
		chart.scatter.dispatch.on('elementClick', function(e){
			tParams=eval('[{}]');
	    console.log(e.point.series);
	    console.log("key : " + e.series.key);
	    console.log("x : " + e.point.x);
	    console.log("y : " + e.point.y);
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
						scr="execSTPA(\"SBIP://METASERVER"+stpID+"\",\"render"+funcName+"\","+"e.point.id,"+"e.point.x,"+"e.point.y"+");";
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
						out.println("\t\t\texecAjax(\"" + fURL +"\",\""+metaID+"\",true,\"render" + funcName + "\",\""+outType+"\",\""+funcName+"\",e.point.x,e.point.y);");	
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