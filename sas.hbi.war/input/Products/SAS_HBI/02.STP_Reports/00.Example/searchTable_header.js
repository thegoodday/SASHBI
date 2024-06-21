//alert("TEST Hello!!!");

var sgGrid, sgGrid2, sgGrid3;
var sgData, sgData2, sgData3;
var waitImage = "";
function setSlickGrid(data) {
	console.log("setSlickGrid!!!!");
	console.log("data", data);

	qryCnt = 0;
	curRow = "";
	$("#sasGrid1").show();
	var dataView = new Slick.Data.DataView();

	//var sasJsonRes=eval (data)[0];
	var sasJsonRes = data[0];

	var columns = [];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
		cssClass: "slick-cell-checkboxsel"
	});
	var options = sasJsonRes["Options"][0];

	var isChk = options.chkBox;
	if (isChk) {
		columns.push(checkboxSelector.getColumnDefinition());
		columns = $.extend(sasJsonRes["ColumInfo"], columns);;
	}
	columns = sasJsonRes["ColumInfo"];
	for (var ii in columns) {
		console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter = eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor = eval(columns[ii].editor);
	}
	console.log("columns", columns);
	console.log("options", options);
	var sessionInfo = [];
	sessionInfo = sasJsonRes["SessionInfo"][0];
	nstp_sessionid = sessionInfo["nstp_sessionid"];
	stp_sessionid = nstp_sessionid;
	save_path = sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML = data;
	//console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	//console.log("nstp_sessionid: \n" + nstp_sessionid);
	//console.log("save_path: \n" + save_path);

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for (ii in sgData) {
		var objTemp = $.extend(sgData[ii], eval({ "id": ii }));
	}
	console.log("sgData", sgData);
	//dataView.setItems(sgData);	

	sgGrid = new Slick.Grid("#sasGrid1", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
	if (isChk) {
		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
	sgGrid.onSort.subscribe(function (e, args) {
		var comparer = function (a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid.onClick.subscribe(function (e, args) {
		var item = args.item;
	});
	sgGrid.onDblClick.subscribe(function (e, args) {
		var cell = sgGrid.getCellFromEvent(e);
		var sgData = sgGrid.getData().getItems();
		var libname = sgData[cell.row].libname;
		console.log("cell", cell);
		console.log("sgData", sgData);
		console.log("libname", libname);
		fnGetTableList(libname);
	});
	sgGrid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		sgGrid.invalidateRow(sgData.length);
		isDisplayProgress = 0;
		item = $.extend({}, item);
		item.id = sgGrid.getData().getItems().length;
		dataView.addItem(item);
	})
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();
	$("#sasGrid").height(eval($(window).height() - $("#dvCondi").height() - 75));
	$("#sasGrid").width(eval($(window).width() - 30));
	if (sgGrid != undefined) {
		sgGrid.resizeCanvas();
	}
	$("#progressIndicatorWIP").hide();
}
function setSlickGrid2(data) {
	console.log("setSlickGrid!!!!");
	console.log("data", data);

	qryCnt = 0;
	curRow = "";
	$("#sasGrid2").show();
	var dataView = new Slick.Data.DataView();

	//var sasJsonRes=eval (data)[0];
	var sasJsonRes = data[0];

	var columns = [];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
		cssClass: "slick-cell-checkboxsel"
	});
	var options = sasJsonRes["Options"][0];

	var isChk = options.chkBox;
	if (isChk) {
		columns.push(checkboxSelector.getColumnDefinition());
		columns = $.extend(sasJsonRes["ColumInfo"], columns);;
	}
	columns = sasJsonRes["ColumInfo"];
	for (var ii in columns) {
		console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter = eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor = eval(columns[ii].editor);
	}
	console.log("columns", columns);
	console.log("options", options);
	var sessionInfo = [];
	sessionInfo = sasJsonRes["SessionInfo"][0];
	nstp_sessionid = sessionInfo["nstp_sessionid"];
	stp_sessionid = nstp_sessionid;
	save_path = sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML = data;
	//console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	//console.log("nstp_sessionid: \n" + nstp_sessionid);
	//console.log("save_path: \n" + save_path);

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for (ii in sgData) {
		var objTemp = $.extend(sgData[ii], eval({ "id": ii }));
	}
	console.log("sgData", sgData);
	//dataView.setItems(sgData);	

	sgGrid2 = new Slick.Grid("#sasGrid2", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid2.updateRowCount();
		sgGrid2.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid2.invalidateRows(args.rows);
		sgGrid2.render();
	});
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
	if (isChk) {
		sgGrid2.registerPlugin(checkboxSelector);
	};
	sgGrid2.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
	sgGrid2.onSort.subscribe(function (e, args) {
		var comparer = function (a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid2.onClick.subscribe(function (e, args) {
		var item = args.item;
	});
	sgGrid2.onDblClick.subscribe(function (e, args) {
		var cell = sgGrid2.getCellFromEvent(e);
		var sgData = sgGrid2.getData().getItems();
		console.log("sgData2", sgData);
		var libname = sgData[cell.row].libname;
		var memname = sgData[cell.row].memname;
		fnGetTableDetail(libname, memname);
	});
	sgGrid2.onAddNewRow.subscribe(function (e, args) {
	})
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();
	$("#sasGrid").height(eval($(window).height() - $("#dvCondi").height() - 75));
	$("#sasGrid").width(eval($(window).width() - 30));
	if (sgGrid2 != undefined) {
		sgGrid2.resizeCanvas();
	}
	$("#progressIndicatorWIP").hide();
}

function setSlickGrid3(data) {
	console.log("setSlickGrid!!!!");
	console.log("data", data);

	qryCnt = 0;
	curRow = "";
	$("#sasGrid3").show();
	var dataView = new Slick.Data.DataView();

	//var sasJsonRes=eval (data)[0];
	var sasJsonRes = data[0];

	var columns = [];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
		cssClass: "slick-cell-checkboxsel"
	});
	var options = sasJsonRes["Options"][0];

	var isChk = options.chkBox;
	if (isChk) {
		columns.push(checkboxSelector.getColumnDefinition());
		columns = $.extend(sasJsonRes["ColumInfo"], columns);;
	}
	columns = sasJsonRes["ColumInfo"];
	for (var ii in columns) {
		console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter = eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor = eval(columns[ii].editor);
	}
	console.log("columns", columns);
	console.log("options", options);
	var sessionInfo = [];
	sessionInfo = sasJsonRes["SessionInfo"][0];
	nstp_sessionid = sessionInfo["nstp_sessionid"];
	stp_sessionid = nstp_sessionid;
	save_path = sessionInfo["save_path"];
	//$sasExcelHTML=$sasResHTML;
	$sasExcelHTML = data;
	//console.log("sessionInfo: \n" + JSON.stringify(sessionInfo));
	//console.log("nstp_sessionid: \n" + nstp_sessionid);
	//console.log("save_path: \n" + save_path);

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for (ii in sgData) {
		var objTemp = $.extend(sgData[ii], eval({ "id": ii }));
	}
	console.log("sgData", sgData);
	//dataView.setItems(sgData);	

	sgGrid3 = new Slick.Grid("#sasGrid3", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		sgGrid3.updateRowCount();
		sgGrid3.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		sgGrid3.invalidateRows(args.rows);
		sgGrid3.render();
	});
	sgGrid3.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
	if (isChk) {
		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid3.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: true }));
	sgGrid3.onSort.subscribe(function (e, args) {
		var comparer = function (a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
	});
	sgGrid3.onClick.subscribe(function (e, args) {
		var item = args.item;
	});
	sgGrid3.onDblClick.subscribe(function (e, args) {
		var cell = sgGrid3.getCellFromEvent(e)
		var row = cell.row;
	});
	sgGrid3.onAddNewRow.subscribe(function (e, args) {
	})
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();
	$("#sasGrid").height(eval($(window).height() - $("#dvCondi").height() - 75));
	$("#sasGrid").width(eval($(window).width() - 30));
	if (sgGrid3 != undefined) {
		sgGrid3.resizeCanvas();
	}
	$("#progressIndicatorWIP").hide();
}
function fnGetTableList(libname) {
	tParams = [{}];
	tParams['libname'] = libname;
	//execSTPA("SBIP://METASERVER/Products/SAS HBI/02.STP Reports/00.Board/searchTable(StoredProcess)",'setSlickGrid');
	execSTPA("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/getTableList(StoredProcess)", 'setSlickGrid2');
}
function fnGetTableDetail(libname, memname){
	tParams = [{}];
	tParams['libname'] = libname;
	tParams['memname'] = memname;
	//execSTPA("SBIP://METASERVER/Products/SAS HBI/02.STP Reports/00.Board/searchTable(StoredProcess)",'setSlickGrid');
	execSTPA("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/02.STP Reports/00.Board/getTableDetail(StoredProcess)", 'setSlickGrid3');

}