var sgGrid, dataView;
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
	$("#dvToolBar").append("<input type=button value='Excel' id=btnExcel class=condBtn onclick='exportExcel();'>");
    $("#dvToolBar").append("<span style='display:none;'><a id='downloadLink2'>Excel</a></span>");
	//$("#dvToolBar").show();
});
function resizeGrid(){
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
}
setTimeout('resizeGrid();',500*1);
$(window).resize(function() {
	resizeGrid();
});

function setCellColor(){
	//$(".colorVH").parent().addClass("colorYELLOWP");
	//$(".colorVH").parent().css("background-color","#FF0000");
	//$(".colorH").parent().css("background-color","#FF8080");
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
	//console.log("setSlickGrid :\n" );

	$("#sasGrid").show();
	dataView = new Slick.Data.DataView();
	
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
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	//columns[7].formatter=eval("RiskFommater");
	//columns[4].editor=eval("YesNoSelectEditor");	

	
	//console.log("columns");
	//console.log(columns);
	//console.log("columns");
	//console.log("columns \n" + JSON.stringify(columns));  
	//console.log("options \n" + JSON.stringify(options));
	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML=data;

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	
	selectDataLen=sgData.length;
	//console.log("sgData");
	//console.log(selectDataLen);
	//console.log(sgData);
	//dataView.setItems(sgData);	
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		//console.log("onRowCountChanged");
		//console.log("onRowCountChanged : " + args.rows);
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		//console.log("onRowsChanged");
		//console.log("onRowsChanged : " + args.rows);
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){			
  		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid.onCellChange.subscribe(function(e, args) {		
		setTimeout("setCellColor();",100*1);		
    	sgGrid.invalidate();
    	sgGrid.render();
	});	
	sgGrid.onMouseEnter.subscribe(function(e, args) {
		//console.log("onMouseEnter");
		setCellColor();
	});	
	sgGrid.onMouseLeave.subscribe(function(e, args) {
		setCellColor();
	});		
	sgGrid.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
		setCellColor();
	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		//console.log("item : ")
		//console.log(item)
		$.extend(item, args.item);
		dataView.addItem(item);		
	});	
	
	var keep_var=['OBS','COUNTRY','REGION','DIVISION','PRODTYPE','PRODUCT','YEAR','QUARTER','MONTH','ACTUAL','PREDICT'];
	var excelData = setArr(sgData,keep_var);

    $('body').exportToExcel("downloadLink2", "Report.xlsx", "Report", excelData, excelOptions, function (response) {
        //console.log(response);
    });
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}

function exportExcel(){
	//href=$("#downloadLink").attr("href");
	//console.log("href : " + href);
	//window.open(href);
	var dLink = document.getElementById('downloadLink2');
	dLink.click();
}
