
var grid<%=objID%>;
var data<%=objID%>;
var dataVw<%=objID%>;

$(document).keydown(function(e){
	//console.debug("KEY : ==========================" + e.which);
	if (e.which == 90 && (e.ctrlKey || e.metaKey)) {    // CTRL + (shift) + Z
		if (e.shiftKey){
			undoRedoBuffer<%=objID%>.redo();
		} else {
			undoRedoBuffer<%=objID%>.undo();
		}
	}
});
var undoRedoBuffer<%=objID%> = {
	commandQueue : [],
	commandCtr : 0,
	
	queueAndExecuteCommand : function(editCommand) {
		this.commandQueue[this.commandCtr] = editCommand;
		this.commandCtr++;
		editCommand.execute();
	},
	
	undo : function() {
		if (this.commandCtr == 0)
		  return;
	
		this.commandCtr--;
		var command = this.commandQueue[this.commandCtr];
		
		if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
		  command.undo();
		}
	},
	redo : function() {
		if (this.commandCtr >= this.commandQueue.length)
		  return;
		var command = this.commandQueue[this.commandCtr];
		this.commandCtr++;
		if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
		  command.execute();
		}
	}
}
var pluginOptions<%=objID%> = {
  clipboardCommandHandler: function(editCommand){ undoRedoBuffer<%=objID%>.queueAndExecuteCommand.call(undoRedoBuffer<%=objID%>,editCommand); },
  includeHeaderWhenCopying : false
};

function grFilter<%=objID%>(item) {
	return true;
}
function render<%=objID%>(data){
	console.debug("render<%=objID%> started!!!!=======================");
	var sasJsonRes=eval(data)[0];
	console.debug("sasJsonRes");
	console.debug(sasJsonRes);
	
	if (sasJsonRes.SASLog != undefined) {
		var sasLog<%=objID%>	= sasJsonRes.SASLog;
		console.debug("SAS Logs\n");
		console.debug(sasLog<%=objID%>);
		$("#dvSASLog").html("<pre>" +$("#dvSASLog").html() + sasLog<%=objID%>+"</pre>");
		//$("#dvSASLogWin").show();
		$("#dvSASLogWin").css("top","40px");
	}
	
	
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	//nstp_sessionid=sessionInfo["nstp_sessionid"];
	//stp_sessionid=nstp_sessionid;
	//save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;
	console.debug("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.debug("nstp_sessionid: \n" + nstp_sessionid);
	console.debug("save_path: \n" + save_path); 
	
	data<%=objID%> =[];
	columns<%=objID%> =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	
	options<%=objID%>	=sasJsonRes["Options"][0];
	
	var isChk=options<%=objID%>.chkBox;
	if (isChk){
		columns<%=objID%>.push(checkboxSelector.getColumnDefinition());
		columns<%=objID%>=$.extend(sasJsonRes["ColumInfo"],columns<%=objID%>);;
	}
	columns<%=objID%>	=sasJsonRes["ColumInfo"];
	for(ii in columns<%=objID%>){
		var objTemp = columns<%=objID%>[ii].editor;
		columns<%=objID%>[ii].editor=eval(objTemp);
	}
	
	
	data<%=objID%>	= sasJsonRes["SASResult"];
		
	dataVw<%=objID%> = new Slick.Data.DataView({ inlineFilters: true });
	
	/*
	dataVw<%=objID%>.beginUpdate();
	dataVw<%=objID%>.setItems(data<%=objID%>);
	dataVw<%=objID%>.setFilterArgs({
		percentCompleteThreshold: percentCompleteThreshold,
		searchString: searchString
	});
	dataVw<%=objID%>.setFilter(grFilter<%=objID%>);
	dataVw<%=objID%>.endUpdate();
	*/
	
	grid<%=objID%>	= new Slick.Grid("#<%=objID%>",  data<%=objID%>, columns<%=objID%>,  options<%=objID%>);
	if (isChk){
  	grid<%=objID%>.registerPlugin(checkboxSelector);
	}
	grid<%=objID%>.setSelectionModel(new Slick.RowSelectionModel());
	grid<%=objID%>.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: true}));
	grid<%=objID%>.setSelectionModel(new Slick.CellSelectionModel());
	var columnpicker = new Slick.Controls.ColumnPicker(columns<%=objID%>, grid<%=objID%>, options<%=objID%>); 
	grid<%=objID%>.getCanvasNode().focus();
	grid<%=objID%>.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
	grid<%=objID%>.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions<%=objID%>));
	grid<%=objID%>.onSort.subscribe(function (e, args) {
	  var cols = args.sortCols;
	  data<%=objID%>.sort(function (dataRow1, dataRow2) {
		for (var i = 0, l = cols.length; i < l; i++) {
		  var field = cols[i].sortCol.field;
		  var sign = cols[i].sortAsc ? 1 : -1;
		  var value1 = dataRow1[field], value2 = dataRow2[field];
		  var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
		  if (result != 0) {
			return result;
		  }
		}
		return 0;
	  });
	  grid<%=objID%>.invalidate();
	  grid<%=objID%>.render();
	});		
	
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
				int mm ; 
				JSONArray cl_stp;
				try {
					cl_stp = (JSONArray)colObj.getJSONArray("cl_stp");
				} catch (JSONException e) {
					cl_stp = new JSONArray(stpInit);
				}
				logger.debug("cl_stp : " + cl_stp);
				for (mm=0; mm<cl_stp.length();mm++){
					if (mm == 0){
%>
	grid<%=objID%>.onClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = grid<%=objID%>.getCellFromEvent(e);
		curRow<%=objID%> = cell.row;
		console.debug("grid<%=objID%> Clicked!!!");
<%					
					}
					JSONObject evC=(JSONObject)cl_stp.getJSONObject(mm);
					columnName=(String)evC.get("columnName");
					if (!columnName.equalsIgnoreCase("")){
%>
		if(grid<%=objID%>.getColumns()[cell.cell].id == "<%=columnName%>" ) {
			console.debug("column Name : " + grid<%=objID%>.getColumns()[cell.cell].id);
<%					
					}
					funcName=(String)evC.get("funcName");
					//if (!funcName.equalsIgnoreCase("")) funcName="render"+funcName;
					if (evC.has("stp")) stpID = (String)evC.get("stp");
					if (evC.has("params")) params = (String)evC.get("params");
					if (evC.has("gType")) gType = (String)evC.get("gType");
					logger.debug("Click STP columnName :" + columnName+":");
					logger.debug("Click STP funcName : " + funcName);
					logger.debug("Click STP stpID : " + stpID);
					logger.debug("Click STP params : " + params);
					if (!stpID.equalsIgnoreCase("") && !stpID.equalsIgnoreCase("User Defined")) {
						if (!columnName.equalsIgnoreCase("")) {
							scr="var " + columnName + "= data" + objID+"[curRow"+objID+"]."+columnName+";";
							out.println("\t\t\t"+scr);
						}
						if (params.equalsIgnoreCase("")) {
							params=columnName;
						} else {
							if (!columnName.equalsIgnoreCase("")) params+=","+columnName;
						}
						StringTokenizer tkParams = new StringTokenizer(params, ",");
						int ii=1;
						while(tkParams.hasMoreTokens()){
							param = tkParams.nextToken().trim();
							logger.debug("\t\t\tParam : " + param);
							scr="var " + param + "= data" + objID.trim()+"[curRow"+objID.trim()+"]."+param.trim()+";";
							out.println("\t\t"+scr);
							scr="tParams['param" + ii + "']='" + param + "';";
							out.println("\t\t"+scr);
							ii++;
						}
						if (!columnName.equalsIgnoreCase("")) {
							scr="execSTPA(\"SBIP://METASERVER"+stpID.trim()+"\",\"render"+funcName.trim()+"\","+params.trim()+");";
						} else {
							scr="execSTPA(\"SBIP://METASERVER"+stpID.trim()+"\",\"render"+funcName.trim()+"\","+params.trim()+");";
						}
						out.println("\t\t"+scr);
						if (!columnName.equalsIgnoreCase("")){
							out.println("\t\t}");
						}
					} else if (stpID.equalsIgnoreCase("User Defined")){
						scr="tParams['param1']='target';";
						out.println("\t\t"+scr);
						
						StringTokenizer tkParams = new StringTokenizer(params, ","); 
						int ii=2;
						while(tkParams.hasMoreTokens()){
							param = tkParams.nextToken().trim();
							logger.debug("\t\tParam : " + param);
							scr="tParams['param" + ii + "']='_DRILL_" + param + "';";
							out.println("\t\t"+scr);
							ii++;
						}	

						StringTokenizer tk2Params = new StringTokenizer(params, ","); 
						while(tk2Params.hasMoreTokens()){
							param = tk2Params.nextToken().trim();
							scr="var " + param + "= data" + objID+"[curRow"+objID+"]."+param+";";
							out.println("\t\t"+scr);
						}	

						fURL="submit"+gType;
						if (objType.equalsIgnoreCase("HTML")) outType="html";
						else outType="json";
						logger.debug("fURL : " + fURL);
						out.println("\t\texecAjax(\"" + fURL +"\",\""+metaID+"\",true,\"render" + funcName + "\",\""+outType+"\",\""+funcName+"\","+params.trim()+");");	
					}
					if (!columnName.equalsIgnoreCase("")){
						out.println("\t\t};");
					}
					if (mm == cl_stp.length()-1){
						out.println("\t});");
					}
				}
				
				JSONArray dbl_stp;
				try {
					dbl_stp = (JSONArray)colObj.getJSONArray("dbl_stp");
				} catch (JSONException e) {
					dbl_stp = new JSONArray(stpInit);
				}
				logger.debug("dbl_stp : " + dbl_stp);
				for (mm=0; mm<dbl_stp.length();mm++){
					if (mm == 0){
%>
	grid<%=objID%>.onDblClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = grid<%=objID%>.getCellFromEvent(e);
		curRow<%=objID%> = cell.row;
		console.debug("grid<%=objID%> Double Clicked!!!");
<%					
					}
					JSONObject evD=(JSONObject)dbl_stp.getJSONObject(mm);
					columnName=(String)evD.get("columnName");
					if (!columnName.equalsIgnoreCase("")){
%>
		if(grid<%=objID%>.getColumns()[cell.cell].id == "<%=columnName%>" ) {
			console.debug("column Name : " + grid<%=objID%>.getColumns()[cell.cell].id);
<%					
					}
					funcName=(String)evD.get("funcName");
					if (!funcName.equalsIgnoreCase("")) funcName="render"+funcName;
					stpID=(String)evD.get("stp");
					params=(String)evD.get("params");
					logger.debug("DblClick STP columnName : " + columnName);
					logger.debug("DblClick STP funcName : " + funcName);
					logger.debug("DblClick STP stpID : " + stpID);
					logger.debug("DblClick STP params : " + params);

					if (!stpID.equalsIgnoreCase("")) {
					if (!columnName.equalsIgnoreCase("")) {
						scr="var " + columnName + "= data" + objID+"[curRow"+objID+"]."+columnName +";";
						out.println("\t\t\t"+scr);
					}
					if (params.equalsIgnoreCase("")) {
						params=columnName;
					} else {
						if (!columnName.equalsIgnoreCase("")) params+=","+columnName;
					}
					int ii=1;
					StringTokenizer tkParams = new StringTokenizer(params, ",");
					while(tkParams.hasMoreTokens()){
						param = tkParams.nextToken().trim();
						logger.debug("\t\t\tParam : " + param);
						scr="var " + param + "= data" + objID.trim()+"[curRow"+objID+"]."+param.trim()+";";
						out.println("\t\t"+scr);
						scr="tParams['param" + ii + "']='" + param + "';";
						out.println("\t\t"+scr);
						ii++;
					}
					if (!columnName.equalsIgnoreCase("")) { 
						scr="execSTPA(\"SBIP://METASERVER"+stpID.trim()+"\",\""+funcName.trim()+"\","+params.trim()+");";
					} else {
						//scr="execSTPA(\"SBIP://METASERVER"+stpID+"\",\""+funcName+"\");";
						scr="execSTPA(\"SBIP://METASERVER"+stpID.trim()+"\",\""+funcName.trim()+"\","+params.trim()+");";
					}
					out.println("\t\t"+scr);
					if (!columnName.equalsIgnoreCase("")){
						out.println("\t\t}");
					}
					}
					if (mm == dbl_stp.length()-1){
						out.println("\t});");
					}
				}
%>
}