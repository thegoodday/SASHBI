
<div id="dvTitle" style="display:none;"></div>
<div id="sasGrid" style="display:none;"></div>
<div id="dvFooter" style="display:none;"></div>

<script>
$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-$("#dvToolBar").height()-50));
$("#sasGrid").width(eval($("#dvCondi").width()+10));
$(window).resize(function() {
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-40));
	$("#sasGrid").width(eval($("#dvCondi").width()+20));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
});	
//alert("");
var sgGrid;
var sgData;
function setSlickGrid(data){
	console.log("setSlickGrid :\n" );

	$("#sasGrid").show();
	var dataView = new Slick.Data.DataView();
	
	//var sasJsonRes=eval (data)[0];
	var sasJsonRes=data[0];
	
	var columns =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	var options=sasJsonRes["Options"][0];

	var isChk=options.chkBox;
	if (isChk){
		columns.push(checkboxSelector.getColumnDefinition());
		columns=$.extend(sasJsonRes["ColumInfo"],columns);;
	}
	columns=sasJsonRes["ColumInfo"];
	for(var ii in columns){
		console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	console.log("columns");
	console.log(columns);
	console.log("options \n" + JSON.stringify(options));
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML=data;
	//console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	//console.log("nstp_sessionid: \n" + nstp_sessionid);
	//console.log("save_path: \n" + save_path);

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	console.log("sgData");
	console.log(sgData);
	//dataView.setItems(sgData);	
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid.onClick.subscribe(function(e, args) {
		var item = args.item;
	});	
	sgGrid.onDblClick.subscribe(function (e, args){
		var cell = sgGrid.getCellFromEvent(e)
		var row = cell.row;
	});	
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress=0; 
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);	
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
	$("#progressIndicatorWIP").hide();
}

</script>  
 