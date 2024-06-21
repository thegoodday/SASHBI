<%
					if (grp_opt.equalsIgnoreCase("")){
						grp_opt="margin: {left: 0, bottom: 0},\n";
						grp_opt+="\t\t\t\tdelay:0,\n";
						grp_opt+="\t\t\t\ttransitionDuration: 50";
					}
%>
function render<%=objID%>(data){
	var gDataPie=eval(data);
	console.log("Pie Data");
	console.log(gDataPie);
	nv.addGraph(function() {
		var width = <%=pie_width%>, height = <%=pie_height%>;
	
		var chart = nv.models.pieChart()
			.x(function(d) { return d.key })
			.y(function(d) { return d.y })
			.color(d3.scale.category10().range())
			.width(<%=pie_width%>)
			.height(<%=pie_height%>)
			.options({
				<%=grp_opt%>		 		
			});
		<%=grp_stmt%>
		console.log("Pie width : " + width);
		console.log("Pie height : " + height);
		console.log("Pie gDataPie : " + JSON.stringify(gDataPie));
		try {
		d3.select('#<%=objID%> svg')
			.datum(gDataPie)
			.transition().duration(1200)
			.attr('width', width)
			.attr('height', height)
			.call(chart);
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
		chart.pie.dispatch.on('elementClick', function(e){
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
						scr="execSTPA(\"SBIP://METASERVER"+stpID+"\",\"render"+funcName+"\","+"e.data.key"+");";
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
						out.println("\t\t\texecAjax(\"" + fURL +"\",\""+metaID+"\",true,\"render" + funcName + "\",\""+outType+"\",\""+funcName+"\",e.data.key);");	
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
		chart.pie.dispatch.on('elementDblClick', function(e){
			tParams=eval('[{}]');
			console.log('elementDblClick: ' + e.value);
			console.dir(e.data);
			console.log(e.data.key);
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
						scr="tParams['param1']='" + params.trim() + "';";
						out.println("\t\t\t"+scr);
						scr="execSTPA(\"SBIP://METASERVER"+stpID+"\",\""+funcName+"\","+"e.data.key"+");";
						out.println("\t\t\t"+scr);
					}
				}
				out.println("\t\t});");
%>
	
	
		} catch(err) {
			console.log("ERROR Occured!!! : " + err);
			//render<%=objID%>(data);
		}
		return chart;
	});
}
