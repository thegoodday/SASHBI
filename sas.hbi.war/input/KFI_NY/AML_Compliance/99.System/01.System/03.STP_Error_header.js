$(document).ready(function () {
	//alert('한글');
	//$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid1();'>");
	//$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid1();'>");
	//$("#dvToolBar").show();
	//fnGetScore();
	$(document).keyup(function(e){
		if (e.keyCode == 27) {
			$('#dvModalWinDetail').hide();
			$('#dvBG').hide();
		}
	});	
	/*	
	*/
	var cur_time = new Date();
	cur_hour = cur_time.getHours(); /* 1440 */
	min_hour = (cur_hour - 2) * 60;
	max_hour = (cur_hour + 1) * 60;
	console.log("cur_hour : " + cur_hour);
	console.log("min_hour : " + min_hour);
	console.log("max_hour : " + max_hour);
	$("#time-range").slider({
		range: true,
		min: min_hour,
		max: max_hour,
		step: 1,
		slide: function(event, ui){
			console.log(event);
			console.log(ui);
			console.log(ui.values[0] + " ~ " + ui.values[1] );
			var hour_s = Math.floor(ui.values[0] / 60);
			var min_s = ui.values[0] - (hour_s * 60);
			st_hour="0"+hour_s;
			st_min="0"+min_s;
			if (st_hour.length == 2) hour_s=st_hour;
			if (st_min.length == 2) min_s=st_min;
			var hour_e = Math.floor(ui.values[1] / 60);
			var min_e = ui.values[1] - (hour_e * 60);
			end_hour="0"+hour_e;
			end_min="0"+min_e;
			if (end_hour.length == 2) hour_e=end_hour;
			if (end_min.length == 2) min_e=end_min;
			
			$("#start_time").html( hour_s + ":" + min_s);
			$("#end_time").html( hour_e + ":" + min_e );
		}
	});
	$("#time-range").slider("values",[eval(12*60),eval(13*60)]);
});
function resizeGrid(){
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-45));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
}
setTimeout('resizeGrid();',500*1);
//setInterval('submitSTP();',1000*30);
$(window).resize(function() {
	resizeGrid();
});
var sgGrid, sgGrid2;	
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
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	//columns[3].formatter=eval("RiskCodeFommater");
	//columns[7].formatter=eval("RiskFommater");
	//columns[4].editor=eval("YesNoSelectEditor");	
	//columns[5].editor=eval("YesNoSelectEditor");	
	//columns[7].editor=eval("RiskEditor");	

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
	//console.log("sgData");
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
	sgGrid.onDblClick.subscribe(function(e, args) {
		var cell = sgGrid.getCellFromEvent(e);
		var row = cell.row;
		var data=sgGrid.getData().getItems();
		var fname=data[row].fname;
		var session_id=data[row].session_id;
		console.log("session_id : " + session_id);
		fnShowLog(fname,session_id);
	});	
	sgGrid.onCellChange.subscribe(function(e, args) {
		setTimeout("setCellColor();",100*1);
	});	
	sgGrid.onMouseEnter.subscribe(function(e, args) {
		//console.log("onMouseEnter");
		//setCellColor();
	});	
	sgGrid.onMouseLeave.subscribe(function(e, args) {
		//setCellColor();
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
	})		
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}
function fnShowLog(fname,session_id){
	console.log("fname : " + fname);
	console.log("session_id : " + session_id);
	tParams=eval('[{}]');
	tParams['fname']=fname;
	tParams['session_id']=session_id;
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/9903_showDetailLog(StoredProcess)",'showDetailLog');
	
}
function showDetailLog(res){
	//console.log(res);
	$("#dvModalWinDetail").height(eval($(window).height()-90));
	$("#dvModalWinDetail").width(eval($(window).width()-60));
	$("#sasGridDetail").height(eval($(window).height()-190));
	//$("#sasGridDetailW").width(eval($(window).width()-80));
	$("#dvModalWinDetail").css("left",eval(eval($(window).width()-$("#dvModalWinDetail").width()-40)/2));
	$("#dvModalWinDetail").css("top",eval(eval($(window).height()-$("#dvModalWinDetail").height()-0)/2));
	$('#dvModalWinDetail').show();
	setSlickGridDetailLog(res);
}
function setCellColor(){
	$(".colorVH").parent().css("color","#FF0000");
	$(".colorG").parent().css("color","#008000");
	$(".colorB").parent().css("color","#0000FF");
	$(".colorL").parent().css("color","#000000");
	$(".colorVH").parent().css("border-bottom-color","#ffffff");
	$(".colorG").parent().css("border-bottom-color","#ffffff");
	$(".colorB").parent().css("border-bottom-color","#ffffff");
	$(".colorL").parent().css("border-bottom-color","#ffffff");
}
function ErrorFommater(row, cell, value, columnDef, dataContext) {
	var data=sgGrid2.getData().getItems();
	//console.log("row risk : " + data[row].type);
	var type=data[row].type;	
	var msg=data[row].msg;	
	var text="";
	//console.log("msg : " + msg.substring(0,6));
	if( value==null) value="";
	if (type == "ERROR"){
		text = "<span style='font-weight:normal;' class='colorVH'><pre>" + value + "</pre></span>";
	} else if (type == "WARN"){
		text = "<span style='font-weight:normal;' class='colorG'><pre>" + value + "</pre></span>";
	} else if (type == "INFO" && msg.substring(0,6) == "NOTE: " ){
		text = "<span style='font-weight:normal;' class='colorB'><pre>" + value + "</pre></span>";
	} else if (type == "INFO" && msg.substring(0,15) == "      real time" ){
		text = "<span style='font-weight:normal;' class='colorB'><pre>" + value + "</pre></span>";
	} else if (type == "INFO" && msg.substring(0,14) == "      cpu time" ){
		text = "<span style='font-weight:normal;' class='colorB'><pre>" + value + "</pre></span>";
	} else {
		text = "<span style='font-weight:normal;' class='colorL'><pre>" + value + "</pre></span>";
	}
	return text;
}
function setSlickGridDetailLog(data){
	console.log("setSlickGridDetailLog :\n" );

	$("#sasGridDetail").show();
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
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	columns[6].formatter=ErrorFommater;
	
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
	console.log("sgData.length : " + sgData.length);
	//dataView.setItems(sgData);	

	var st_log_time = sgData[0].log_time;	
	var end_log_time = sgData[sgData.length-1].log_time;	
	console.log("st_log_time : " + st_log_time);
	console.log("end_log_time : " + end_log_time);

	var st_hour = st_log_time.substr(0,2);
	var end_hour = end_log_time.substr(0,2);
	var st_min = st_log_time.substr(3,2);
	var end_min = end_log_time.substr(3,2);
	console.log("st_log_time : " + st_hour + ":" + st_min);
	console.log("end_log_time : " + end_hour + ":" + end_min);
	
	if (st_hour + ":" + st_min == end_hour + ":" + end_min){
		end_hour = Number(end_hour) + 1;
		console.log("same!!!!!!");
		console.log("st_log_time : " + st_hour + ":" + st_min);
		console.log("end_log_time : " + end_hour + ":" + end_min);
	} 
	new_st = eval(st_hour*60 + Number(st_min) );
	new_en = eval(end_hour*60 + Number(end_min) );// + end_min );
	console.log("new_st : " + new_st);
	console.log("new_en : " + new_en);
	$("#time-range").slider("values",[new_st, new_en]);
	$("#time-range").slider({min:(Number(st_hour)-2)*60});
	$("#time-range").slider({max:(Number(end_hour)+2)*60});
	$("#start_time").html( st_hour + ":" + st_min);
	$("#end_time").html( end_hour + ":" + end_min );
	
	
	sgGrid2 = new Slick.Grid("#sasGridDetail", dataView, columns, options);	
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid2.updateRowCount();
		sgGrid2.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid2.invalidateRows(args.rows);
		sgGrid2.render();
	});
	sgGrid2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	sgGrid2.onScroll.subscribe(function (e) {
		setCellColor();
	});
	sgGrid2.onCellChange.subscribe(function(e, args) {		
		setTimeout("setCellColor();",100*1);		
	});	
	
	if (isChk){
  		sgGrid2.registerPlugin(checkboxSelector);
	};
	sgGrid2.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );	
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	setTimeout("setCellColor();",1*100);	
		
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}
function fnShowLogWTime(){
	var st_time = $("#time-range").slider("values",0);
	var end_time = $("#time-range").slider("values",1);
	var hour_s = Math.floor(st_time / 60);
	var min_s = st_time - (hour_s * 60);	
	st_hour="0"+hour_s;
	st_min="0"+min_s;
	if (st_hour.length == 2) hour_s=st_hour;
	if (st_min.length == 2) min_s=st_min;	
	var hour_e = Math.floor(end_time / 60);
	var min_e = end_time - (hour_e * 60);	
	end_hour="0"+hour_e;
	end_min="0"+min_e;
	if (end_hour.length == 2) hour_e=end_hour;
	if (end_min.length == 2) min_e=end_min;	
	console.log("st_time : " + hour_s + ":" + min_s);
	console.log("end_time : " + hour_e + ":" + min_e);
	sgData=sgGrid2.getData().getItems();
	fname = sgData[0].fname;	
	session_id = sgData[0].session_id;	
	tParams=eval('[{}]');
	tParams['fname']=fname;
	tParams['session_id']=session_id;
	tParams['st_time']=hour_s + ":" + min_s;
	tParams['end_time']=hour_e + ":" + min_e;
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/9903_showDetailLog(StoredProcess)",'showDetailLog');
}