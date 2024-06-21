$(document).ready(function () {
   $("#dvToolBar").show();
   setInterval("getChangeStatus();",1000*20);
   //alert("");
});
$(window).resize(function () {															
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
});		
var _sessionid="";
function getChangeStatus(){
	tParams=eval('[{}]');
	if (_sessionid !="") {
		tParams['_sessionid']=_sessionid;
		console.log("_sessionid b: " + _sessionid);
	}

	//tParams['logPath']=logPath;
	//$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990402_get_log_file(StoredProcess)",'makeAnlsList');
	url="";
	sp_URI="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990402_get_change_status(StoredProcess)";
	isAsync=true;
	fn="getChangeStatus2";
	$sasResHTML=execAjax(url,sp_URI,isAsync,fn,"json");
	//$sasResHTML=execSTPA(sp_URI,fn);
}
function getChangeStatus2(data){
	console.log(data);
	if (data._sessionid !="") _sessionid=data._sessionid;
	console.log("_sessionid r: " + _sessionid);
	if (data.isChange > 0 ) {
		console.log("Changed!!!");
		submitSTP();
	}
}
var sgGrid;
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
	columns[8].formatter=eval("StatusFommater");
	columns[9].formatter=eval("underLineFommater");
	//columns[4].editor=eval("HierEditor");

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
	sgGrid.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid.onMouseEnter.subscribe(function(e, args) {
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
	});
	sgGrid.onClick.subscribe(function (e) {
		tParams=eval('[{}]');
		var cell = sgGrid.getCellFromEvent(e);
		curRow = cell.row;
		curCell = cell.cell;
		console.log(cell);
		if (curCell == 9){
			isDisplayProgress=1;
			status = sgData[curRow].status;
			if (status == "R") {
				alertMsg("실행중인 작업 로그는 로그파일를 확인 할 수 없습니다. 작업이 완료된 후에 로그파일을 확인하시기 바랍니다.");
				return;
			}
			logPath = sgData[curRow].log_file;
			console.log("logPath : " + logPath);
		   tParams=eval('[{}]');
   		tParams['logPath']=logPath;
			//$sasResHTML=execSTPA("SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990402_get_log_file(StoredProcess)",'makeAnlsList');
			url="";
			sp_URI="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990402_get_log_file(StoredProcess)";
			isAsync=true;
			fn="showSASLog";
			$sasResHTML=execAjax(url,sp_URI,isAsync,fn,"html");
		}
	});	
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		item = $.extend({},item);
		item.id = sgGrid.getData().getItems().length;
		console.log("item : ")
		console.log(item)
		$.extend(item, args.item);
		dataView.addItem(item);
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#progressIndicatorWIP").hide();
}
function setCellColor(){
	//console.log("setCellColor : ");
	$(".slick-group-totals").css("background-color","#FFFF9F");
	$(".colorBLUE").parent().css("background-color","#0080FF");
	$(".colorGREEN").parent().css("background-color","#00FF00");
	//$(".colorYELLOW").parent().css("background-color","#FFFF80");
	$(".colorYELLOW").parent().addClass("colorYELLOWP");
	$(".colorWHITE").parent().css("background-color","#ffffff");
	$(".foreY").parent().css("background-color","#FFFF80");
	$(".foreN").parent().css("background-color","#ffffff");
}
function StatusFommater(row, cell, value, columnDef, dataContext) {
	var text="";
	var isErr=0;
	if( value==null) value="";
	if (value == "S"){
		text = "<img src='/SASHBI/images/vimg/circle_green.png' style='padding-top:10px;width:20px;height:20px' border=0 title='Success'>";
	} else if (value == "R"){
		text = "<img src='/SASHBI/images/vimg/circle_blue.png' style='padding-top:10px;width:20px;height:20px' border=0 title='Running'>";
	} else if (value == "F"){
		text = "<img src='/SASHBI/images/vimg/circle_red.png' style='padding-top:10px;width:20px;height:20px' border=0 title='Fail'>";
	}
	return text;
}
function underLineFommater(row, cell, value, columnDef, dataContext) {
	var text="";
	var isErr=0;
	if( value==null) value="";
	text = "<span style='text-decoration: underline;cursor:pointer'>"+value+"</span>";
	return text;
}
function showLogFile(html){
	console.log(html);
}