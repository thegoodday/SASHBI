var dataVw<%=objID%>;
var grid<%=objID%>;
var data<%=objID%> = [];
var percentCompleteThreshold = 0;
var searchString = "";
function grFilter<%=objID%>(item) {
	if (item.parent != null) {
		var parent = data<%=objID%>[item.parent];
		ii=0;
		while (parent) {
			if (parent._collapsed || (parent["percentComplete"] < percentCompleteThreshold) || (searchString != "" && parent["title"].indexOf(searchString) == -1)) {
			return false;
		}
		ii++;	
		parent = data<%=objID%>[parent.parent];
		if (ii>220)  parent=0;
		} 
	}
	return true;
}
var TaskNameFormatter = function (row, cell, value, columnDef, dataContext) {
	value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	var spacer = "<span style='display:inline-block;height:1px;width:" + (15 * dataContext["indent"]) + "px'></span>";
	var idx = dataVw<%=objID%>.getIdxById(dataContext.id);
	if (data<%=objID%>[idx + 1] && data<%=objID%>[idx + 1].indent > data<%=objID%>[idx].indent) {
		if (dataContext._collapsed) {
			return spacer + " <span class='toggle expand'></span>&nbsp;" + value;
		} else {
			return spacer + " <span class='toggle collapse'></span>&nbsp;" + value;
		}
	} else {
		return spacer + " <span class='toggle'></span>&nbsp;" + value;
	}
};	
function render<%=objID%>(data){
	var sasJsonRes=eval(data)[0];
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	//nstp_sessionid=sessionInfo["nstp_sessionid"]; 
	stp_sessionid=nstp_sessionid; 
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;
	console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	console.log("nstp_sessionid: \n" + nstp_sessionid);
	console.log("save_path: \n" + save_path); 
	 
	data<%=objID%> =[];
	columns<%=objID%> =[];
	columns<%=objID%>	=sasJsonRes["ColumInfo"];
	options<%=objID%>	=sasJsonRes["Options"][0];
	data<%=objID%>	= sasJsonRes["SASResult"];
	dataVw<%=objID%> = new Slick.Data.DataView({ inlineFilters: true });
	dataVw<%=objID%>.beginUpdate();
	dataVw<%=objID%>.setItems(data<%=objID%>);
	dataVw<%=objID%>.setFilter(grFilter<%=objID%>);
	dataVw<%=objID%>.endUpdate();	
	grid<%=objID%>	= new Slick.Grid("#<%=objID%>",  dataVw<%=objID%>, columns<%=objID%>,  options<%=objID%>);
	var columnpicker = new Slick.Controls.ColumnPicker(columns<%=objID%>, grid<%=objID%>, options<%=objID%>);	
	grid<%=objID%>.onClick.subscribe(function (e, args) {
		console.log("grid<%=objID%>.onClick");
		console.log("hasClass : " + $(e.target).hasClass("toggle"));
		if ($(e.target).hasClass("toggle")) {
			var item = dataVw<%=objID%>.getItem(args.row);
			console.log("JSON.stringify(item) : " + JSON.stringify(item));
			if (item) {
				if (!item._collapsed) {
					item._collapsed = true;
				} else {
					item._collapsed = false;
				}
				dataVw<%=objID%>.updateItem(item.id, item);
				console.log("dataVw<%=objID%>.updateItem");
			}
			e.stopImmediatePropagation();
		}
	});	
  dataVw<%=objID%>.onRowCountChanged.subscribe(function (e, args) {
    grid<%=objID%>.updateRowCount();
    grid<%=objID%>.render();
  });
  dataVw<%=objID%>.onRowsChanged.subscribe(function (e, args) {
    grid<%=objID%>.invalidateRows(args.rows);
    grid<%=objID%>.render();
  });
	for (var kk=0;kk < data<%=objID%>.length; kk++){
		var item=data<%=objID%>[kk];
		//console.log("item.indent : " + item.indent);
		if (item.indent > 1) {
			item._collapsed = true;
			dataVw<%=objID%>.updateItem(item.id, item);
		}
	}	
}	
