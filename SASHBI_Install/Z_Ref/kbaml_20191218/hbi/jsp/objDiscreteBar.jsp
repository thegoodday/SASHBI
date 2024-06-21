<%
					logger.debug("=======: dBarChart");
					if (grp_opt.equalsIgnoreCase("")){
						grp_opt="margin: { left: 120, bottom: 50 },\n";
						grp_opt+="\t\t\tshowXAxis: true,\n";
						grp_opt+="\t\t\tshowYAxis: true,\n";
						grp_opt+="\t\t\ttooltips: true,\n";
						grp_opt+="\t\t\tshowValues: true,\n";
						grp_opt+="\t\t\tdelay:1,\n";
						grp_opt+="\t\t\trotateLabels:0,\n";
						grp_opt+="\t\t\tgroupSpacing:0.1,\n";
						grp_opt+="\t\t\ttransitionDuration: 250";
					} else {
						grp_opt = grp_opt.replace(",",",\n\t\t\t");
					}
%>
var min<%=objID%>;
var max<%=objID%>;
var orgData<%=objID%>;
function render<%=objID%>(data,isRedraw){
	var gDataDBar=eval(data);
	//console.log(gDataDBar);
	if (isRedraw == undefined) {orgData<%=objID%>=gDataDBar;} 
	
	nv.addGraph(function() {
		var tooltip = function(key, x, y, e, graph) {
		    return 'Custom Tooltip<br/>' +
		           '<h3>' + key + '</h3>' +
		           '<p>' +  y + ' on ' + x + '</p>';
		};
		chart = nv.models.discreteBarChart()
			    .x(function(d) { return d.label })
			    .y(function(d) { return d.value })
				.options({
					<%=grp_opt%>
				});
	
		//chart.reduceXTicks(false).staggerLabels(true);
		//chart.yAxis.tickFormat(d3.format(',.0f'));
		try {		
		d3.select('#<%=objID%> svg')
		  	.datum(gDataDBar)
		  	.call(chart);
		
		nv.utils.windowResize(chart.update);
		//var xAxisA = chart.xAxis.scale().domain();
		//console.log("xAxisA: " + xAxisA[0] + " : " + xAxisA[eval(xAxisA.length-1)]);
		//console.log(xAxisA);
	
<%			
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
		chart.discretebar.dispatch.on('elementClick', function(e){
			tParams=eval('[{}]');
	    console.log('element: ' + e.value);
	    console.dir(e);
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
						scr="tParams['param1']='" + params.trim() + "';";
						out.println("\t\t\t"+scr);
						scr="execSTPA(\"SBIP://METASERVER"+stpID+"\",\"render"+funcName+"\","+"e.data.label"+");";
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
						out.println("\t\t\texecAjax(\"" + fURL +"\",\""+metaID+"\",true,\"render" + funcName + "\",\""+outType+"\",\""+funcName+"\",e.data.label);");	
					}
				}
				out.println("\t\t});");
				
				JSONArray dbl_stp;
				try {
					dbl_stp = (JSONArray)colObj.getJSONArray("dbl_stp");
				} catch (JSONException e) {
					dbl_stp = new JSONArray(stpInit);
				}
				logger.debug("dbl_stp : " + dbl_stp);
%>
		chart.discretebar.dispatch.on('elementDblClick', function(e){
	    console.log('element: ' + e.value);
	    console.dir(e.data);
	    console.log(e.data.label);
<%					
				for (mm=0; mm<dbl_stp.length();mm++){
					if (mm == 0){		
					}
					JSONObject evD=(JSONObject)dbl_stp.getJSONObject(mm);
					columnName=(String)evD.get("columnName");
					funcName=(String)evD.get("funcName");
					if (!funcName.equalsIgnoreCase("")) funcName="render"+funcName;
					stpID=(String)evD.get("stp");
					params=(String)evD.get("params");
					logger.debug("DblClick STP columnName : " + columnName);
					logger.debug("DblClick STP funcName : " + funcName);
					logger.debug("DblClick STP stpID : " + stpID);
					logger.debug("DblClick STP params : " + params);
					if (!stpID.equalsIgnoreCase("")) {
						scr="execSTPA(\"SBIP://METASERVER"+stpID+"\",\""+funcName+"\","+"e.data.label"+");";
						out.println("\t\t\t"+scr);
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
