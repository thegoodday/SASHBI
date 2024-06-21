/*
	56, 66, 67 ==> rc_cfg.fincen_institution 에 저장해도 AML 솔루션 화면에 반영되지 않음.
*/
var Inst = {
	"A":{"D":"Internal Revenue Service (IRS)"},
	"B":{"B":"Federal Reserve Board (FRB)",
		  "C":"Federal Deposit Insurance Corporation (FDIC)",
		  "D":"Internal Revenue Service (IRS)",
		  "E":"National Credit Union Administration (NCUA)",
		  "F":"Office of the Comptroller of the Currency (OCC)"},
	"C":{"D":"Internal Revenue Service (IRS)"},
	"D":{"D":"Internal Revenue Service (IRS)"},
	"E":{"A":"Commodities Futures Trading Commission (CFTC)",
		  "G":"Securities and Exchange Commission (SEC)"},
	"F":{"A":"Commodities Futures Trading Commission (CFTC)",
		  "B":"Federal Reserve Board (FRB)",
		  "C":"Federal Deposit Insurance Corporation (FDIC)",
		  "D":"Internal Revenue Service (IRS)",
		  "E":"National Credit Union Administration (NCUA)",
		  "F":"Office of the Comptroller of the Currency (OCC)",
		  "G":"Securities and Exchange Commission (SEC)",
		  "H":"Federal Housing Finance Agency (FHFA)",
		  "Z":"Not Applicable"},
	"G":{"A":"Commodities Futures Trading Commission (CFTC)",
		  "B":"Federal Reserve Board (FRB)",
		  "C":"Federal Deposit Insurance Corporation (FDIC)",
		  "D":"Internal Revenue Service (IRS)",
		  "E":"National Credit Union Administration (NCUA)",
		  "F":"Office of the Comptroller of the Currency (OCC)",
		  "G":"Securities and Exchange Commission (SEC)",
		  "H":"Federal Housing Finance Agency (FHFA)",
		  "Z":"Not Applicable"},
	"Z":{"A":"Commodities Futures Trading Commission (CFTC)",
		  "B":"Federal Reserve Board (FRB)",
		  "C":"Federal Deposit Insurance Corporation (FDIC)",
		  "D":"Internal Revenue Service (IRS)",
		  "E":"National Credit Union Administration (NCUA)",
		  "F":"Office of the Comptroller of the Currency (OCC)",
		  "G":"Securities and Exchange Commission (SEC)",
		  "H":"Federal Housing Finance Agency (FHFA)",
		  "Z":"Not Applicable"},
}

var sgGrid;	
var isNew, 	INSTITUTION_KEY;
$(document).ready(function () {
	//alert('한글');
	$("#dvToolBar").append("<input type=button value=Add id=btnSave class=condBtn onclick='fnAddReport();'>");
	$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid();'>");
	$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid();'>");
	//$("#dvToolBar").show();
	fnGetCountry();
	fnGetState();
	$(document).keyup(function(e){
		if (e.keyCode == 27) {
			$('#dvModalWin').hide();
			$('#dvBG').hide();
		}
	});
	$("#INSTITUTION_TYPE_CODE_TEXT").prop("disabled",true);
	$(".institution_sf_type_code").prop("checked",false);
	$("#INSTITUTION_TYPE_CODE_TEXT").val("");
	$("#INSTITUTION_GAMING_TYPE_CODE_TEXT").prop("disabled",true);
	$("#INSTITUTION_GAMING_TYPE_CODE_TEXT").val("");
	
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
	//fnShowPopUp();
});

function YesNoSelectEditor(args) {
	var $select;
	var defaultValue;
	var scope = this;
	
	this.init = function () {
		$select = $("<SELECT tabIndex='0' class='editor-yesno'><OPTION value='Y'>Y</OPTION><OPTION value='N'>N</OPTION></SELECT>");
		$select.appendTo(args.container);
		$select.focus();
	};
	
	this.destroy = function () {
		$select.remove();
	};

	this.focus = function () {
		$select.focus();
	};
	
	this.loadValue = function (item) {
		console.log("loadValue");
		console.log(item);
		$select.val((defaultValue = item[args.column.field]) ? "Y" : "N");
		$select.select();
	};
	
	this.serializeValue = function () {
		return ($select.val() == "Y");
	};
	
	this.applyValue = function (item, state) {
		console.log("state : " + state);
		var txt=$select.find("option:selected").val();
		console.log("txt : " + txt);
		if (txt == 'Y'){
			sgData=sgGrid.getData().getItems();
			for(ii in sgData){
				console.log("ii : " + ii);
				sgData[ii].DEFAULT_IND = 'N';
				sgGrid.updateRow(ii);
			}
		}
		item[args.column.field] = txt;
	};
	
	this.isValueChanged = function () {
		return ($select.val() != defaultValue);
	};
	
	this.validate = function () {
		return {
			valid: true,
			msg: null
		};
	};
	
	this.init();
}

function setSlickGrid(data){
	//console.log("setSlickGrid :\n" );

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
	columns[8].editor=eval("YesNoSelectEditor");	

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
	sgGrid.onDblClick.subscribe(function(e, args) {
		var cell = sgGrid.getCellFromEvent(e);
		var row = cell.row;
		var cur_col = cell.cell;
		var entity_key = sgData[row].ENTITY_KEY;
		console.log("cell");
		console.log(cell);
		console.log("entity_key : " + entity_key);
		if (entity_key > 0) {
			isNew=0;
			fnLoadInstInfo(entity_key);
		}
	});		
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	if (isChk){
  		sgGrid.registerPlugin(checkboxSelector);
	};
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onScroll.subscribe(function (e) {
		//setCellColor();
	});
	sgGrid.onCellChange.subscribe(function(e, args) {
		//setTimeout("setCellColor();",100*1);
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
		//setCellColor();
	});
	dataView.beginUpdate();
	dataView.setItems(sgData);
	//dataView.setFilter(myFilter);
	dataView.endUpdate();	
	//setTimeout("setCellColor();",1*100);	
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}


function fnSetInstType(){
	var curInstType = $("#INSTITUTION_TYPE_CODE").val();
	console.log("curInstType : " + curInstType);
	fnReset53();
	fnReset54();
	
	/*
	A => 53 Active / 54 Disable
	B => 53 Disable / 54 Disable
	C => 53 Disable / 54 Disable
	D => 53 Disable / 54 Disable
	E => 53 Disable / 54 Active
	F => 53 Disable / 54 Disable
	G => 53 Disable / 54 Disable
	Z => 53 Disable / 54 Disable / OTHER COMMENT Active
	
	*/
	var items=Inst[curInstType];
	console.log(items);
	$("#INSTITUTION_TYPE_CODE_TEXT").prop("disabled",true);
	$(".institution_sf_type_code").prop("checked",false);
	$("#INSTITUTION_TYPE_CODE_TEXT").val("");
	
	if (curInstType == "A"){
		$(".institution_gaming_type_code").prop("disabled",false);
		$(".institution_sf_type_code").prop("disabled",true);
	} else if (curInstType == "B" || curInstType == "C" || curInstType == "D" || curInstType == "F" || curInstType == "G"){
		$(".institution_gaming_type_code").prop("disabled",true);
		$(".institution_sf_type_code").prop("disabled",true);
	} else if (curInstType == "E"){
		$(".institution_gaming_type_code").prop("disabled",true);
		$(".institution_sf_type_code").prop("disabled",false);
	} else if (curInstType == "Z"){
		$(".institution_gaming_type_code").prop("disabled",true);
		$(".institution_sf_type_code").prop("disabled",true);
		$("#INSTITUTION_TYPE_CODE_TEXT").prop("disabled",false);
	}
	$("#INSTITUTION_PRIM_FED_REG_CODE option").remove();
	for(ii in items){
		val=items[ii];
		console.log(ii + " : " + val);
		$("#INSTITUTION_PRIM_FED_REG_CODE").append("<option value='" + ii +"' >" + val + "</option>");
	}
	
}
function fnGetCountry(){
	tParams=eval('[{}]');
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0210_getCountry(StoredProcess)",'makeCountry');
}
function makeCountry(data){
	console.log("makeCountry");
	console.log(data);
	$("#INSTITUTION_COUNTRY_NAME option").remove();
	for(ii in data){
		var chk="";
		var val=data[ii].COUNTRY_CODE_2;
		var optname =data[ii].COUNTRY_NAME; 
		if (val == 'US') chk="selected";
		$("#INSTITUTION_COUNTRY_NAME").append("<option value='" + val +"' " + chk + ">" + optname + "</option>");
	}
}
function fnGetState(){
	tParams=eval('[{}]');
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0210_getState(StoredProcess)",'fnMakeState');
}
function fnMakeState(State){
	$("#INSTITUTION_STATE_CODE option").remove();
	console.log("State");
	console.log(State);
	$("#INSTITUTION_STATE_CODE").append("<option value='' >Select State...</option>");
	for(ii in State){
		//console.log("Name : " + ii);
		//console.log(State[ii]);
		var optval =State[ii].cd; 
		var optname =State[ii].cd_nm; 
		$("#INSTITUTION_STATE_CODE").append("<option value='" + optval +"' >" + optname + "</option>");
	}
}

function setCellColor(){
	//$(".colorVH").parent().addClass("colorYELLOWP");
	//$(".colorVH").parent().css("background-color","#FF0000");
	//$(".colorH").parent().css("background-color","#FF8080");
	$(".colorVH").parent().css("color","#FF0000");
	$(".colorH").parent().css("color","#FF8080");
	$(".colorM").parent().css("color","#000000");
	$(".colorL").parent().css("color","#000000");
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






function fnDeleteGrid(){
	var selectedIndexes = sgGrid.getSelectedRows().sort().reverse();
	sgGrid.setSelectedRows([]);
	sgData=sgGrid.getData().getItems();
	$.each(selectedIndexes, function (index, value) {
		var item = sgGrid.getData().getItem(value); 
		if (item) sgGrid.getData().deleteItem(item.id); 
	});
	sgGrid.invalidate();
	sgGrid.render();
}

function fnSave(){
	var INSTITUTION_TYPE_CODE = $("#INSTITUTION_TYPE_CODE").val();
	var INSTITUTION_PRIM_FED_REG_CODE = $("#INSTITUTION_PRIM_FED_REG_CODE").val();
	var INSTITUTION_LEGAL_NAME_UNKNOWN = $("#INSTITUTION_LEGAL_NAME_UNKNOWN").attr('checked');	//57
	var INSTITUTION_LEGAL_NAME = $("#INSTITUTION_LEGAL_NAME").val();										//57
	var INSTITUTION_ALTERNATE_NAME = $("#INSTITUTION_ALTERNATE_NAME").val();							//58
	var INSTITUTION_TAX_ID_UNKNOWN = $("#INSTITUTION_TAX_ID_UNKNOWN").attr('checked');				//59
	var INSTITUTION_TAX_ID = $("#INSTITUTION_TAX_ID").val();													//59
	var INSTITUTION_ADDRESS_UNKNOWN = $("#INSTITUTION_ADDRESS_UNKNOWN").attr('checked');			//61
	var INSTITUTION_ADDRESS = $("#INSTITUTION_ADDRESS").val();												//61
	var INSTITUTION_CITY_NAME_UNKNOWN = $("#INSTITUTION_CITY_NAME_UNKNOWN").attr('checked');		//62
	var INSTITUTION_CITY_NAME = $("#INSTITUTION_CITY_NAME").val();											//62
	var INSTITUTION_STATE_CODE = $("#INSTITUTION_STATE_CODE").val();										//63
	var INSTITUTION_ZIP_CODE_UNKNOWN = $("#INSTITUTION_ZIP_CODE_UNKNOWN").attr('checked');			//64
	var INSTITUTION_ZIP_CODE = $("#INSTITUTION_ZIP_CODE").val();											//64
	var INSTITUTION_COUNTRY_NAME_UNKNOWN = $("#INSTITUTION_COUNTRY_NAME_UNKNOWN").attr('checked');		//65
	var INSTITUTION_COUNTRY_NAME = $("#INSTITUTION_COUNTRY_NAME").val();									//65

	console.log("51:INSTITUTION_TYPE_CODE : " + INSTITUTION_TYPE_CODE);
	console.log("52:INSTITUTION_PRIM_FED_REG_CODE : " + INSTITUTION_PRIM_FED_REG_CODE);
	console.log("57:INSTITUTION_LEGAL_NAME_UNKNOWN : " + INSTITUTION_LEGAL_NAME_UNKNOWN);
	console.log("57:INSTITUTION_LEGAL_NAME : " + INSTITUTION_LEGAL_NAME +"|");
	console.log("59:INSTITUTION_TAX_ID_UNKNOWN : " + INSTITUTION_TAX_ID_UNKNOWN);
	console.log("59:INSTITUTION_TAX_ID : " + INSTITUTION_TAX_ID);
	console.log("61:INSTITUTION_ADDRESS_UNKNOWN : " + INSTITUTION_ADDRESS_UNKNOWN);
	console.log("61:INSTITUTION_ADDRESS : " + INSTITUTION_ADDRESS);
	console.log("62:INSTITUTION_CITY_NAME_UNKNOWN : " + INSTITUTION_CITY_NAME_UNKNOWN);
	console.log("62:INSTITUTION_CITY_NAME : " + INSTITUTION_CITY_NAME);
	console.log("64:INSTITUTION_ZIP_CODE_UNKNOWN : " + INSTITUTION_ZIP_CODE_UNKNOWN);
	console.log("64:INSTITUTION_ZIP_CODE : " + INSTITUTION_ZIP_CODE);
	console.log("65:INSTITUTION_COUNTRY_NAME_UNKNOWN : " + INSTITUTION_COUNTRY_NAME_UNKNOWN);
	console.log("65:INSTITUTION_COUNTRY_NAME : " + INSTITUTION_COUNTRY_NAME);

	if (INSTITUTION_TYPE_CODE == "" ||																								//51
		 INSTITUTION_PRIM_FED_REG_CODE == "" ||																					//52
		 (INSTITUTION_LEGAL_NAME_UNKNOWN   == undefined && INSTITUTION_LEGAL_NAME   == "" )||						//57
		 (INSTITUTION_TAX_ID_UNKNOWN       == undefined && INSTITUTION_TAX_ID       == "" )||						//59
		 (INSTITUTION_ADDRESS_UNKNOWN      == undefined && INSTITUTION_ADDRESS      == "" )||						//61
		 (INSTITUTION_CITY_NAME_UNKNOWN    == undefined && INSTITUTION_CITY_NAME    == "" )||						//62
		 (INSTITUTION_ZIP_CODE_UNKNOWN     == undefined && INSTITUTION_ZIP_CODE     == "" )||						//64
		 (INSTITUTION_COUNTRY_NAME_UNKNOWN == undefined && INSTITUTION_COUNTRY_NAME == "" )							//65
		) {
		alertMsg("Please check the required items.");
		return;
	}
		 
		 	
	var isSave = confirmMsg("Are you sure you want to save?","fnConfirmSave");	
}

function fnConfirmSave(){
	var INSTITUTION_TYPE_CODE = $("#INSTITUTION_TYPE_CODE").val();
	var INSTITUTION_TYPE_CODE_TEXT = $("#INSTITUTION_TYPE_CODE_TEXT").val();
	var INSTITUTION_PRIM_FED_REG_CODE = $("#INSTITUTION_PRIM_FED_REG_CODE").val();
	var INSTITUTION_GAMING_TYPE_CODE="";																			//53
	$("input:checkbox[name=INSTITUTION_GAMING_TYPE_CODE]:checked").each(function(){
		INSTITUTION_GAMING_TYPE_CODE += $(this).val();
	});
	var INSTITUTION_GAMING_TYPE_CODE_TEXT = $("#INSTITUTION_GAMING_TYPE_CODE_TEXT").val();
	var INSTITUTION_SF_TYPE_CODE="";																					//54
	$("input:checkbox[name=INSTITUTION_SF_TYPE_CODE]:checked").each(function(){
		INSTITUTION_SF_TYPE_CODE += $(this).val();
	});
	var INSTITUTION_SF_TYPE_OTHER=$("#INSTITUTION_SF_TYPE_CODE_TEXT").val();							//54
	var INSTITUTION_ID_TYPE_CODE = $("#INSTITUTION_ID_TYPE_CODE").val();									//55
	var INSTITUTION_ID_NUMBER = $("#INSTITUTION_ID_NUMBER").val();											//55
	var INSTITUTION_ROLE_CODE = "";																				//56
	$("input:radio[name=INSTITUTION_ROLE_CODE]:checked").each(function(){
		INSTITUTION_ROLE_CODE += $(this).val();
	});
	var INSTITUTION_LEGAL_NAME_UNKNOWN = $("#INSTITUTION_LEGAL_NAME_UNKNOWN").attr('checked');	//57
	var INSTITUTION_LEGAL_NAME = $("#INSTITUTION_LEGAL_NAME").val();										//57
	var INSTITUTION_ALTERNATE_NAME = $("#INSTITUTION_ALTERNATE_NAME").val();							//58
	var INSTITUTION_TAX_ID_UNKNOWN = $("#INSTITUTION_TAX_ID_UNKNOWN").attr('checked');				//59
	var INSTITUTION_TAX_ID = $("#INSTITUTION_TAX_ID").val();													//59
	var INSTITUTION_TAX_ID_TYPE_CODE = $("#INSTITUTION_TAX_ID_TYPE_CODE").val();						//60
	var INSTITUTION_ADDRESS_UNKNOWN = $("#INSTITUTION_ADDRESS_UNKNOWN").attr('checked');			//61
	var INSTITUTION_ADDRESS = $("#INSTITUTION_ADDRESS").val();												//61
	var INSTITUTION_CITY_NAME_UNKNOWN = $("#INSTITUTION_CITY_NAME_UNKNOWN").attr('checked');		//62
	var INSTITUTION_CITY_NAME = $("#INSTITUTION_CITY_NAME").val();											//62
	var INSTITUTION_STATE_CODE = $("#INSTITUTION_STATE_CODE").val();										//63
	var INSTITUTION_ZIP_CODE_UNKNOWN = $("#INSTITUTION_ZIP_CODE_UNKNOWN").attr('checked');			//64
	var INSTITUTION_ZIP_CODE = $("#INSTITUTION_ZIP_CODE").val();											//64
	var INSTITUTION_COUNTRY_NAME_UNKNOWN = $("#INSTITUTION_COUNTRY_NAME_UNKNOWN").attr('checked');		//65
	var INSTITUTION_COUNTRY_NAME = $("#INSTITUTION_COUNTRY_NAME").val();									//65
	var INSTITUTION_CONTROL_NUMBER = $("#INSTITUTION_CONTROL_NUMBER").val();							//66
	var INSTITUTION_LOSS_FINANCIAL = $("#INSTITUTION_LOSS_FINANCIAL").val();							//67

	
	console.log("51:INSTITUTION_TYPE_CODE : " + INSTITUTION_TYPE_CODE);
	console.log("51:INSTITUTION_TYPE_CODE_TEXT : " + INSTITUTION_TYPE_CODE_TEXT);
	console.log("52:INSTITUTION_PRIM_FED_REG_CODE : " + INSTITUTION_PRIM_FED_REG_CODE);
	console.log("53:INSTITUTION_GAMING_TYPE_CODE : " + INSTITUTION_GAMING_TYPE_CODE);
	console.log("53:INSTITUTION_GAMING_TYPE_CODE_TEXT : " + INSTITUTION_GAMING_TYPE_CODE_TEXT);
	console.log("54:INSTITUTION_SF_TYPE_CODE : " + INSTITUTION_SF_TYPE_CODE);
	console.log("54:INSTITUTION_SF_TYPE_OTHER : " + INSTITUTION_SF_TYPE_OTHER);
	console.log("55:INSTITUTION_ID_TYPE_CODE : " + INSTITUTION_ID_TYPE_CODE);
	console.log("55:INSTITUTION_ID_NUMBER : " + INSTITUTION_ID_NUMBER);
	console.log("56:INSTITUTION_ROLE_CODE : " + INSTITUTION_ROLE_CODE);
	console.log("57:INSTITUTION_LEGAL_NAME : " + INSTITUTION_LEGAL_NAME);
	console.log("58:INSTITUTION_ALTERNATE_NAME : " + INSTITUTION_ALTERNATE_NAME);
	console.log("59:INSTITUTION_TAX_ID : " + INSTITUTION_TAX_ID);
	console.log("60:INSTITUTION_TAX_ID_TYPE_CODE : " + INSTITUTION_TAX_ID_TYPE_CODE);
	console.log("61:INSTITUTION_ADDRESS : " + INSTITUTION_ADDRESS);
	console.log("62:INSTITUTION_CITY_NAME : " + INSTITUTION_CITY_NAME);
	console.log("63:INSTITUTION_STATE_CODE : " + INSTITUTION_STATE_CODE);
	console.log("64:INSTITUTION_ZIP_CODE : " + INSTITUTION_ZIP_CODE);
	console.log("65:INSTITUTION_COUNTRY_NAME : " + INSTITUTION_COUNTRY_NAME);
	console.log("66:INSTITUTION_CONTROL_NUMBER : " + INSTITUTION_CONTROL_NUMBER);
	console.log("67:INSTITUTION_LOSS_FINANCIAL : " + INSTITUTION_LOSS_FINANCIAL);
	
	

	var new_data = new Array();	
	var new_row = new Object();
	new_data.push(new_row);
	console.log("isNew : " + isNew);
	console.log("INSTITUTION_KEY : " + INSTITUTION_KEY);
	if (isNew == 0){
		new_data[0]["INSTITUTION_KEY_C"]						= INSTITUTION_KEY;
	}
	new_data[0]["INSTITUTION_TYPE_CODE"] 					= INSTITUTION_TYPE_CODE;
	new_data[0]["INSTITUTION_TYPE_OTHER"] 					= INSTITUTION_TYPE_CODE_TEXT;
	new_data[0]["INSTITUTION_PRIM_FED_REG_CODE"] 		= INSTITUTION_PRIM_FED_REG_CODE;
	new_data[0]["INSTITUTION_GAMING_TYPE_CODE"] 			= INSTITUTION_GAMING_TYPE_CODE;
	new_data[0]["INSTITUTION_GAMING_TYPE_OTHER"] 		= INSTITUTION_GAMING_TYPE_CODE_TEXT;
	new_data[0]["INSTITUTION_SF_TYPE_CODE"] 				= INSTITUTION_SF_TYPE_CODE;
	new_data[0]["INSTITUTION_SF_TYPE_OTHER"] 				= INSTITUTION_SF_TYPE_OTHER;
	new_data[0]["INSTITUTION_ID_TYPE_CODE"] 				= INSTITUTION_ID_TYPE_CODE;
	new_data[0]["INSTITUTION_ID"] 							= INSTITUTION_ID_NUMBER;
	new_data[0]["INSTITUTION_ROLE_CODE"] 					= INSTITUTION_ROLE_CODE;
	new_data[0]["INSTITUTION_LEGAL_NAME"] 					= INSTITUTION_LEGAL_NAME;
	new_data[0]["INSTITUTION_ALTERNATE_NAME"] 			= INSTITUTION_ALTERNATE_NAME;
	new_data[0]["INSTITUTION_TAX_ID"] 						= INSTITUTION_TAX_ID;
	new_data[0]["INSTITUTION_TAX_ID_TYPE"] 				= INSTITUTION_TAX_ID_TYPE_CODE;
	new_data[0]["INSTITUTION_ADDRESS"] 						= INSTITUTION_ADDRESS;
	new_data[0]["INSTITUTION_CITY_NAME"] 					= INSTITUTION_CITY_NAME;
	new_data[0]["INSTITUTION_STATE_CODE"] 					= INSTITUTION_STATE_CODE;
	new_data[0]["INSTITUTION_ZIP_CODE"] 					= INSTITUTION_ZIP_CODE;
	new_data[0]["INSTITUTION_COUNTRY_CODE"] 				= INSTITUTION_COUNTRY_NAME;
	new_data[0]["INSTITUTION_CONTROL_NUMBER"] 			= INSTITUTION_CONTROL_NUMBER;
	new_data[0]["INSTITUTION_LOSS_FINANCIAL"] 			= INSTITUTION_LOSS_FINANCIAL;
	var gridData=JSON.stringify(new_data);	
	console.log(gridData);
	tParams=eval('[{}]');
	tParams['_savepath']=save_path;
	tParams['gridData']=gridData;
	tParams['_library']="stp_temp";
	tParams['_tablename']="fincen_institution";
	tParams['_program']="SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0210_saveInstitution(StoredProcess)";
	tParams['_isNew']=isNew;
	//console.log("gridData : ");
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSaveResult","json"); 
	$('#dvModalWin').hide();	
}

function fnSaveResult(data){
	//alertMsg(data.MSG);
	//setTimeout('submitSTP();',500*1);
	/*
	if (data.MSG == "Successfully saved...") {
		//alertMsg("성공적으로 저장되었습니다.");
		alertMsg("Sucessfully Saved.");
	}else{
		alertMsg("Sucessfully Saved.");
	}
	*/
	setTimeout('submitSTP();',500*1);
	alertMsg(data.MSG);
			
	console.log("save_path : " + save_path);
}
function fnAddReport(){
	isNew=1;
	fnShowPopUp();
}
function fnShowPopUp(){	
	//fomUpload.reset();
	$("#dvBG").css("height",$(window).height()+"px");
	$("#dvBG").width($(window).width());
	$('#dvBG').show();
	//$("#dvModalWin").css("height",eval($(window).height() - 80)+"px");
	$("#dvCont").css("height",eval($(window).height() - 140)+"px");
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-50)/2));
	$('#dvModalWin').show();	
}

function fnCheck(objname){
	cur_val = $("#"+objname+"_UNKNOWN").attr('checked');
	console.log("cur_val : " + cur_val);
	if (cur_val == 'checked'){
		$("#"+objname).val('');
		$("#"+objname).prop("disabled",true);
	} else {
		$("#"+objname).prop("disabled",false);
	}
}

function fnCheck2(obj, objname){
	console.log(obj);
	//cur_val = $("#"+objname).attr('checked');
	cur_val = $(obj).attr('checked');
	console.log("cur_val : " + cur_val);
	if (cur_val == 'checked'){
		$("#"+objname+"_TEXT").prop("disabled",false);
	} else {
		$("#"+objname+"_TEXT").val('');
		$("#"+objname+"_TEXT").prop("disabled",true);
	}
}

function fnSaveGrid(){
	if (!sgGrid.getEditorLock().commitCurrentEdit()) {
		return;
	}	
	sgData=sgGrid.getData().getItems();
	beDefaultInd=0;
	for (ii in sgData){
		if (sgData[ii].DEFAULT_IND == "Y") ++beDefaultInd;
	}
	console.log("beDefaultInd : " + beDefaultInd);
	if (beDefaultInd != 1 ){
		alertMsg("One 'Default Report' must be Set.");
		return;
	}
		
	var keep_var=['ENTITY_KEY','DEFAULT_IND'];
	var send_data = setArr(sgData,keep_var);
	
	var gridData=JSON.stringify(send_data);	
	console.log(gridData);
	tParams=eval('[{}]');
	tParams['_savepath']=save_path;
	tParams['gridData']=gridData;
	tParams['_library']="stp_temp";
	tParams['_tablename']="fincen_institution";
	tParams['_program']="SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0210_saveChange(StoredProcess)";
	//console.log("gridData : ");
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSaveChange","json"); 
	$('#dvModalWin').hide();	
}

function fnSaveChange(data){
	setTimeout('submitSTP();',500*1);
	alertMsg(data.MSG);
}

function fnLoadInstInfo(entity_key){
	tParams=eval('[{}]');
	tParams['entity_key']=entity_key;
	$sasResHTML=execSTPA("SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0210_getInstitution(StoredProcess)",'cbLoadInstInfo');
}
function cbLoadInstInfo(data){
	instInfo=data[0];
	console.log(instInfo);
	
	INSTITUTION_KEY=instInfo.INSTITUTION_KEY;
	
	$("#INSTITUTION_TYPE_CODE").val(instInfo.INSTITUTION_TYPE_CODE);											//51
	fnSetInstType($("#INSTITUTION_TYPE_CODE"));
	setTimeout('$("#INSTITUTION_TYPE_CODE_TEXT").val(instInfo.INSTITUTION_TYPE_OTHER);',1000*1);
	if (instInfo.INSTITUTION_TYPE_OTHER != "") $("#INSTITUTION_TYPE_CODE_TEXT").prop("disabled",false);
	//$("#INSTITUTION_PRIM_FED_REG_CODE").val(instInfo.INSTITUTION_PRIM_FED_REG_CODE);						//52
	
	var INSTITUTION_GAMING_TYPE_CODE = instInfo.INSTITUTION_GAMING_TYPE_CODE;													//53
	console.log("INSTITUTION_GAMING_TYPE_CODE : " + INSTITUTION_GAMING_TYPE_CODE.length);
	for (var ii=0; ii < INSTITUTION_GAMING_TYPE_CODE.length; ii++){
		var institution_gaming_type_code = INSTITUTION_GAMING_TYPE_CODE.substring(ii,ii+1);
		console.log("institution_gaming_type_code : " + institution_gaming_type_code);
		$("input:checkbox[name=INSTITUTION_GAMING_TYPE_CODE][value='" + institution_gaming_type_code + "']").prop('checked',true);
	};
	$("#INSTITUTION_GAMING_TYPE_CODE_TEXT").val(instInfo.INSTITUTION_GAMING_TYPE_OTHER);
	var INSTITUTION_SF_TYPE_CODE=instInfo.INSTITUTION_SF_TYPE_CODE;											//54
	console.log("INSTITUTION_SF_TYPE_CODE : " + INSTITUTION_SF_TYPE_CODE + "|");
	for (var ii=0; ii < INSTITUTION_SF_TYPE_CODE.length; ii++){
		var institution_sf_type_code = INSTITUTION_SF_TYPE_CODE.substring(ii,ii+1);
		console.log("institution_sf_type_code : " + ii + " : " + institution_sf_type_code);
		$("input:checkbox[name=INSTITUTION_SF_TYPE_CODE][value='" + institution_sf_type_code + "']").prop('checked',true);
	};
	$("#INSTITUTION_SF_TYPE_CODE_TEXT").val(instInfo.INSTITUTION_SF_TYPE_OTHER);							//54
	if (instInfo.INSTITUTION_SF_TYPE_OTHER != "") $("#INSTITUTION_SF_TYPE_CODE_TEXT").prop("disabled",false);
	$("#INSTITUTION_ID_TYPE_CODE").val(instInfo.INSTITUTION_ID_TYPE_CODE);									//55
	$("#INSTITUTION_ID_NUMBER").val(instInfo.INSTITUTION_ID);													//55
	var INSTITUTION_ROLE_CODE = instInfo.INSTITUTION_ROLE_CODE;													//56
	for (var ii=0; ii < INSTITUTION_ROLE_CODE.length; ii++){
		var institution_role_code = INSTITUTION_ROLE_CODE.substring(ii,ii+1);
		console.log("institution_role_code : " + institution_role_code);
		$("input:radio[name=INSTITUTION_ROLE_CODE][value='" + institution_role_code + "']").prop('checked',true);
	};
	$("#INSTITUTION_LEGAL_NAME").val(instInfo.INSTITUTION_LEGAL_NAME);										//57
	if (instInfo.INSTITUTION_LEGAL_NAME==""){
		$("#INSTITUTION_LEGAL_NAME_UNKNOWN").prop('checked',true);												//57
	}
	$("#INSTITUTION_ALTERNATE_NAME").val(instInfo.INSTITUTION_ALTERNATE_NAME);								//58
	$("#INSTITUTION_TAX_ID").val(instInfo.INSTITUTION_TAX_ID);													//59
	if (instInfo.INSTITUTION_TAX_ID==""){
		$("#INSTITUTION_TAX_ID_UNKNOWN").prop('checked',true);													//59
	}
	$("#INSTITUTION_TAX_ID_TYPE_CODE").val(instInfo.INSTITUTION_TAX_ID_TYPE);								//60
	$("#INSTITUTION_ADDRESS").val(instInfo.INSTITUTION_ADDRESS);												//61
	if (instInfo.INSTITUTION_ADDRESS==""){
		$("#INSTITUTION_ADDRESS_UNKNOWN").prop('checked',true);													//61
	}
	$("#INSTITUTION_CITY_NAME").val(instInfo.INSTITUTION_CITY_NAME);											//62
	if (instInfo.INSTITUTION_CITY_NAME == ""){
		$("#INSTITUTION_CITY_NAME_UNKNOWN").prop('checked',true);												//62
	}
	$("#INSTITUTION_STATE_CODE").val(instInfo.INSTITUTION_STATE_CODE);										//63
	$("#INSTITUTION_ZIP_CODE").val(instInfo.INSTITUTION_ZIP_CODE);												//64
	if (instInfo.INSTITUTION_ZIP_CODE == ""){
		$("#INSTITUTION_ZIP_CODE_UNKNOWN").prop('checked',true);													//64
	}
	$("#INSTITUTION_COUNTRY_NAME").val(instInfo.INSTITUTION_COUNTRY_CODE);									//65
	if (instInfo.INSTITUTION_COUNTRY_CODE == ""){
		$("#INSTITUTION_COUNTRY_NAME_UNKNOWN").prop('checked',true);											//65
	}
	
	//$("#INSTITUTION_CONTROL_NUMBER").val(instInfo.INSTITUTION_CONTROL_NUMBER);							//66
	//$("#INSTITUTION_LOSS_FINANCIAL").val(instInfo.INSTITUTION_LOSS_FINANCIAL);							//67	
	
	fnShowPopUp();
}
function fnReset53(){
	$('.institution_gaming_type_code').prop('checked',false);
	$('#INSTITUTION_GAMING_TYPE_CODE_TEXT').val('');
}
function fnReset54(){
	$('.institution_sf_type_code').prop('checked',false);
	$('#INSTITUTION_SF_TYPE_CODE_TEXT').val('');
}