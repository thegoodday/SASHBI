var sgGrid_1, sgGrid_2;
var sgColumn_1=[], sgColumn_2=[];
var excelOptions = {
  headerStyle: {
	  font: {
		  bold: true,  //enable bold
		  font: 12, // font size
		  color: '00ffffff' //font color --Note: Add 00 before the color code
	  },
	  fill: {   //fill background
		  type: 'pattern', 
		  patternType: 'solid',
		  fgColor: '00428BCA' //background color --Note: Add 00 before the color code
	  }
  },
  cellStyle: {
	  font: {
		  bold: false,  //enable bold
		  font: 12, // font size
		  color: '00000000' //font color --Note: Add 00 before the color code
	  },
	  fill: {   //fill background
		  type: 'pattern',
		  patternType: 'solid',
		  fgColor: '00ffffff' //background color --Note: Add 00 before the color code
	  }
  },
};

$(document).ready(function () {
	//alert('한글');
	//$("#dvToolBar").append("<input type=button value='Excel' id=btnExcel class=condBtn onclick='testVar();'>");
	//$("#dvToolBar").show();
});
function resizeGrid(){
	$("#sasGrid_1").height(200);
	$("#sasGrid_1").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid_1!=undefined) {
		sgGrid_1.resizeCanvas();
	}
}
setTimeout('resizeGrid();',500*1);
$(window).resize(function() {
	resizeGrid();
});

function setCellColor(){
	$(".colorVH").parent().css("color","#FF0000");
	$(".colorH").parent().css("color","#FF8080");
	$(".colorM").parent().css("color","#000000");
	$(".colorL").parent().css("color","#000000");
}
function RiskFommater(row, cell, value, columnDef, dataContext) {
	var text="";
	if( value==null) value="";
	if (value == "VH"){
		text = "<span style='font-weight:normal;' class='colorVH'>" + value + "</span>";
	} else if (value == "H"){
		text = "<span style='font-weight:normal;' class='colorH'>" + value + "</span>";
	} else if (value == "M"){
		text = "<span style='font-weight:normal;' class='colorM'>" + value + "</span>";
	} else if (value == "L"){
		text = "<span style='font-weight:normal;' class='colorL'>" + value + "</span>";
	}
	return text;
}
function setArr(base,keep_var){
	var new_data = new Array();
	for (var ii in base){
		var row = new Object();
		new_data.push(row);
		//console.log( base[ii].CRR_SCORE_KEY);
		for (var col in keep_var){
			new_data[ii][keep_var[col]] = base[ii][keep_var[col]] ;
		}
	}
	return new_data;
}

function setSlickGrid(data){  
	console.log(sgGrid_1);
	sgGrid_1=setGrid(data, "sasGrid_1",sgGrid_1);
	console.log("setSlickGrid 1 ================================");
	console.log(sgGrid_1);
	sgGrid_1.onDblClick.subscribe(function(e, args) {
		var cell = sgGrid_1.getCellFromEvent(e);
		var row = cell.row;
		var col = cell.cell;
		fnShowDetail(sgGrid_1,row,col);
	});	
	
}
function setSlickGrid2(data){  
	sgGrid_2=setGrid(data, "sasGrid_2",sgGrid_2);
}
function setGrid(data, dvRefID, sgGrid){
	console.log("setSlickGrid :\n" );

	$("#"+dvRefID).show();
	dataView = new Slick.Data.DataView();
	
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
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;

	//var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	
	sgGrid = new Slick.Grid("#"+dvRefID, dataView, columns, options);
	
	dataView.onRowCountChanged.subscribe(function (e, args) {
		//console.log("onRowCountChanged");
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		//console.log("onRowsChanged");
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){			
  		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
	return sgGrid;
}
function fnShowDetail(sgGrid, row, col){
	console.log("Start of fnShowDetail");
	console.log("row : " + row + "        col : " +col);
	var columns=sgGrid.getColumns();
	var data=sgGrid.getData().getItems();
	var cur_cell=data[row][columns[col].id];
	console.log("Current Cell Value : " + cur_cell);

	tParams=eval('[{}]');
	tParams['save_path']=save_path;
	$sasResHTML=execSTPA("SBIP://METASERVER/Products/SAS HBI/02.STP Reports/02.Advanced Reports/15.SlickGridTable(small)(StoredProcess)",'setSlickGrid2');
	console.log("End of fnShowDetail");	
}
function testVar(){
	console.log("sgGrid_1 in testVar");
	console.log(sgGrid_1);
}