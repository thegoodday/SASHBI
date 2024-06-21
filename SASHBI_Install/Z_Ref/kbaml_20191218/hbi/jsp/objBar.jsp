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
var min<%=objID%>;
var max<%=objID%>;
var orgData<%=objID%>;
function render<%=objID%>(data,isRedraw){ 
	var gDataBar=eval(data);
	console.log(gDataBar);
	if (isRedraw == undefined) {orgData<%=objID%>=gDataBar;}
	
	nv.addGraph(function() {
		var tooltip = function(key, x, y, e, graph) {
		    return 'Custom Tooltip<br/>' +
		           '<h3>' + key + '</h3>' +
		           '<p>' +  y + ' on ' + x + '</p>';
		};
		chart = nv.models.multiBarChart()
		.options({
			<%=grp_opt%>
		});
	
		chart.multibar.hideable(false);
		chart.reduceXTicks(false).staggerLabels(true);
		chart.yAxis.tickFormat(d3.format(',.0f'));
		try {
		d3.select('#<%=objID%> svg')
		  	.datum(gDataBar)
		  	.call(chart);
		
		nv.utils.windowResize(chart.update);
		var xAxisA = chart.xAxis.scale().domain();
		console.log("xAxisA: " + xAxisA[0] + " : " + xAxisA[eval(xAxisA.length-1)]);
		//console.log(xAxisA);
		
		if (isRedraw == undefined) {
			$("#slider<%=objID%>").slider({
				range: true,
				min: 1,
				max: xAxisA.length,
				values: [1, xAxisA.length],
				slide: function( event, ui ) {
					redraw<%=objID%>(orgData<%=objID%>,ui.values[0],ui.values[1]);
				}
			});
		}
		
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
		chart.multibar.dispatch.on('elementClick', function(e){
			tParams=eval('[{}]');
	    console.log('element: ' + e.value);
	    console.dir(e);
	    /*
	    console.log("key : " + e.series.key);
	    console.log("anal_var : " + e.data.anal_var);
	    console.log("x : " + e.data.x);
	    console.log("y : " + e.data.y);
	    console.log("Point Test e.data[0]: " + e.data[0]);
	    console.log("Point Test e.data[1]: " + e.data[1]);
		 */
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
						scr="execSTPA(\"SBIP://METASERVER"+stpID+"\",\"render"+funcName+"\","+"e.data.anal_var,"+"e.data.label,"+"e.data.value"+");";
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
						if (ii > 2) {
							out.println("\t\t\texecAjax(\"" + fURL +"\",\""+metaID+"\",true,\"render" + funcName + "\",\""+outType+"\",\""+funcName+"\",e.series.key.split(\" \")[0],e.data.label);");	
						} else {
							out.println("\t\t\texecAjax(\"" + fURL +"\",\""+metaID+"\",true,\"render" + funcName + "\",\""+outType+"\",\""+funcName+"\",e.data.label);");	
						}
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
		chart.multibar.dispatch.on('elementDblClick', function(e){
			console.log("Double Clicked!!!");
	    console.log('element: ' + e.value);
	    console.dir(e);
	    //console.log("key : " + e.series.key);
	    console.log("anal_var : " + e.data.anal_var);
	    console.log("x : " + e.data.x);
	    console.log("y : " + e.data.y);
		
<%					
				for (mm=0; mm<dbl_stp.length();mm++){
					if (mm == 0){
					}
					JSONObject evC=(JSONObject)dbl_stp.getJSONObject(mm);
					funcName	=(String)evC.get("funcName");
					if (!funcName.equalsIgnoreCase("")) funcName="render"+funcName;
					stpID			=(String)evC.get("stp");
					params		=(String)evC.get("params");
					logger.debug("Click STP funcName : " + funcName);
					logger.debug("Click STP stpID : " + stpID);
					logger.debug("Click STP params : " + params);
					if (!stpID.equalsIgnoreCase("")) {
						StringTokenizer tkParams = new StringTokenizer(params, ","); 
						int ii=1;
						while(tkParams.hasMoreTokens()){
							param = tkParams.nextToken().trim();
							logger.debug("\t\t\tParam : " + param);
							scr="tParams['param" + ii + "']='" + param + "';";
							out.println("\t\t\t"+scr);
							ii++;
						}	
						scr="execSTPA(\"SBIP://METASERVER"+stpID+"\",\""+funcName+"\","+"e.data.anal_var,"+"e.data.x,"+"e.data.y"+");";
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
function redraw<%=objID%>(data,min,max){
	console.log("min:max - " + min + " : " + max);
	var newData= eval(JSON.stringify(data));
	console.log("chart data");
	//console.log(newData);
	
	for(ii=0;ii<newData.length;ii++){
		var cList=newData[ii].values;
		cList.length=0;
		for (jj=0; jj<data[ii].values.length; jj++){
			//var num=parseInt(data[ii].values[jj].x.substring(1));
			//if (eval(num >= min) && eval(num <= max)) {
			if (eval(jj >= min) && eval(jj <= max)) {
				cList.push(data[ii].values[jj]);
			} else {
			}
		}
		
	}
	render<%=objID%>(newData,1);
}
			