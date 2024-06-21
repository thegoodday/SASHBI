$(document).ready(function () {
	//alert('한글');
	//$("#dvToolBar").append("<input type=button value=Delete id=btnSave class=condBtn onclick='fnDeleteGrid1();'>");
	$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveGrid1();'>");
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
var sgGrid;	
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
function CustomerCheckFommater(row, cell, value, columnDef, dataContext) {
	//console.log("row : " + row);
	var data=sgGrid.getData().getItems();
	//console.log("row risk : " + data[row].CUSTOMER);
	var extnum=data[row].EXTERNAL_PARTY_NUMBER;
	var cluster=data[row].CLUSTER;
	var check=data[row].CUSTOMER;
	var text="";
	if( value==null) value="";
	for(var ii in data) {
		if (cluster == data[ii].CLUSTER && extnum == data[ii].EXTERNAL_PARTY_NUMBER){
			if (check == "FALSE"){
				text = "<INPUT type=checkbox value='false' class='editor-checkbox' hideFocus>";
			} else if (check == "TRUE"){
				text = "<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus checked>";
			}
		}
	}
	return text;
}
function PersonCheckFommater(row, cell, value, columnDef, dataContext) {
	//console.log("row : " + row);
	var data=sgGrid.getData().getItems();
	//console.log("row risk : " + data[row].CUSTOMER);
	var extnum=data[row].EXTERNAL_PARTY_NUMBER;
	var cluster=data[row].CLUSTER;
	var check=data[row].PERSON;
	var text="";
	if(value==null) value="";
	for(var ii in data) {
		//if (cluster == data[ii].CLUSTER && extnum == data[ii].EXTERNAL_PARTY_NUMBER){
		if (cluster != data[ii].CLUSTER){	
			if (check == "FALSE"){
				text = "<INPUT type=checkbox value='false' class='editor-checkbox' hideFocus>";
			} else if (check == "TRUE"){
				text = "<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus checked>";
			}
		}	
	}
	return text;
}
function frontChkEditor(args){
    var $select;
    var defaultValue;
    var scope = this;
    
	 var data=sgGrid.getData().getItems();
//console.log("args : " + JSON.stringify(args));
//console.log("data : " + JSON.stringify(data));

    this.init = function () {
		
      $select = $("<INPUT type=checkbox value='true' class='editor-checkbox' hideFocus>");
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
			//console.log("loadvalue - item[args.column.field] : " + item[args.column.field]);
      defaultValue = !!item[args.column.field];

      if (defaultValue) {
        $select.prop('checked', true);
      } else {
        $select.prop('checked', false);
      }
      
      var data=sgGrid.getData().getItems();
      for ( var ii in data) {
      	if (data[ii].CLUSTER	== data[args.item.id].CLUSTER) {
      		//console.log("External Party Number : " + data[ii].EXTERNAL_PARTY_NUMBER);
					if (data[ii].EXTERNAL_PARTY_NUMBER	== data[args.item.id].EXTERNAL_PARTY_NUMBER) {
							data[ii].CUSTOMER = 'true';
							//console.log("Customer : " + data[ii].CUSTOMER);
					}else{
							data[ii].CUSTOMER = 'false';
							//console.log("Customer : " + data[ii].CUSTOMER);
					}		
				}
    	};	
    };
    this.serializeValue = function () {
      return $select.prop('checked');
    };
    this.applyValue = function (item, state) {
     	item[args.column.field] = state;
    };
    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue);
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
	console.log("setSlickGrid :\n" );

	$("#sasGrid").show();
	var dataView = new Slick.Data.DataView();
console.log("dataView===");
console.log("data : " + JSON.stringify(data));
	//var sasJsonRes=eval (data)[0];
	var sasJsonRes=data[0];
	//console.log(sasJsonRes );
	
	var columns =[];
	var checkboxSelector = new Slick.CheckboxSelectColumn({
	  cssClass: "slick-cell-checkboxsel"
	});
	var options=sasJsonRes["Options"][0];

	//console.log("Options : " + JSON.stringify(options));

//	sasJsonRes["ColumInfo"][0].cssClass="grid_cell_hidden";
//	sasJsonRes["ColumInfo"][0].headerCssClass="grid_cell_hidden";
	
	columns=sasJsonRes["ColumInfo"];
	for(var ii in columns){
		//console.log(columns[ii].formatter)
		if (columns[ii].formatter !== undefined) columns[ii].formatter=eval(columns[ii].formatter);
		if (columns[ii].editor !== undefined) columns[ii].editor=eval(columns[ii].editor);
	}
	console.log("colums : " + JSON.stringify(columns));
	console.log("colums.length : " + columns.length);
	columns[5].formatter=eval("CustomerCheckFommater");
	columns[6].formatter=eval("PersonCheckFommater");
	columns[5].editor=eval("frontChkEditor");	
	columns[6].editor=eval("frontChkEditor");	
	

	var sessionInfo=[];
	sessionInfo=sasJsonRes["SessionInfo"][0];
	nstp_sessionid=sessionInfo["nstp_sessionid"];
	stp_sessionid=nstp_sessionid;
	save_path=sessionInfo["save_path"];
	$sasExcelHTML=data;

	var sgData = [];
	sgData = sasJsonRes["SASResult"];
	for(ii in sgData){
		var objTemp = $.extend(sgData[ii],eval({"id":ii}));
	}
	//console.log("sgData");
	//console.log(JSON.stringify(sgData));
	//dataView.setItems(sgData);	
	
	sgGrid = new Slick.Grid("#sasGrid", dataView, columns, options);
	dataView.onRowCountChanged.subscribe(function (e, args) {
		console.log("onRowCountChanged");
		sgGrid.updateRowCount();
		sgGrid.render();
	});
	dataView.onRowsChanged.subscribe(function (e, args) {
		console.log("onRowsChanged");
		sgGrid.invalidateRows(args.rows);
		sgGrid.render();
	});
	sgGrid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	sgGrid.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	sgGrid.onCellChange.subscribe(function(e, args) {
		//Front Check, Level1 Check, Level2 Check 변경 시점에 저장???
		//console.log("sgGrid.onCellChange!! : " + JSON.stringify(args));
		//console.log("args[item].SEQ_NO : " + args["item"].SEQ_NO);
		//console.log("args[item].frontCHK : " + args["item"].frontCHK);
		//console.log("args[item].lvl1CHK : " + args["item"].lvl1CHK);
		//console.log("args[item].lvl2CHK : " + args["item"].lvl2CHK);
		//console.log("gsngno : " + gsngno);
		//console.log("EXTERNAL_PARTY_NUMBER : " + args["item"].EXTERNAL_PARTY_NUMBER);
		
		
		
		//var form = $("#fomUpload")[0];
		//var updata = new FormData(form);

		//updata.append("customerID",$("#customerID").html());
		
		//updata.append("seqno",args["item"].SEQ_NO);
		//updata.append("frontchk",args["item"].frontCHK);
		//updata.append("gsngno",gsngno);
		//updata.append("lvl1chk",args["item"].lvl1CHK);
		//updata.append("lvl2chk",args["item"].lvl2CHK);
		
		//updata.append("EXTERNAL_PARTY_NUMBER",args["item"].EXTERNAL_PARTY_NUMBER);
		
		//updata.append("prssType","check");	// 체크박스 선택인지 save 버튼 클릭인지여부
		
//		$.ajax({
//			enctype: 'multipart/form-data',
//			type: "post",
//			url: "/SASStoredProcess/do",
//			_program : 'SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0303_ExternalPartyApproval_save(StoredProcess)',
//			dataType: 'json',
//			data: updata,
//			processData: false,
//			contentType: false,
//			cache: false,
//			timeout: 600000,
//			success : function(data){
//				$("#btnSave").prop("disabled",false);
//				console.log("execSTPA success" );
//				console.log(data);
//				//fnSaveResult(data);
//			},
//			complete: function(data){
//				//data.responseText;	
//				isRun=0;
//				tParams=eval('[{}]');
//				//$("#progressIndicatorWIP").hide();
//			},
//			error : function(xhr, status, error) {
//				console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
//				alert(error);
//			}			
//		});
	});
	sgGrid.onSort.subscribe(function (e, args) {
		var comparer = function(a, b) {
			return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
		}
		dataView.sort(comparer, args.sortAsc);
		setCellColor();
	});
	dataView.beginUpdate();
	dataView.setItems(sgData);
	dataView.endUpdate();	

	//$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
	
	sgGrid.onScroll.subscribe(function (e) {
		setCellColor();
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
	$("#dvToolBar").show();
	$("#progressIndicatorWIP").hide();
}	
function fnSaveGrid1(){
	var isSave = confirmMsg("Are you sure you want to save?","fnConfirmSaveGrid1");	
}
function fnConfirmSaveGrid1(){
	//Front Check, Level1 Check, Level2 Check 변경 시점에 저장???
		//console.log("sgGrid.onCellChange!! : " + JSON.stringify(args));
		//console.log("args[item].SEQ_NO : " + args["item"].SEQ_NO);
		//console.log("args[item].frontCHK : " + args["item"].frontCHK);
		//console.log("args[item].lvl1CHK : " + args["item"].lvl1CHK);
		//console.log("args[item].lvl2CHK : " + args["item"].lvl2CHK);
		//console.log("gsngno : " + gsngno);
		console.log("EXTERNAL_PARTY_NUMBER : " + args["item"].EXTERNAL_PARTY_NUMBER);
		
		var form = $("#fomUpload")[0];
		var updata = new FormData(form);

		updata.append("customerID",$("#customerID").html());
		
		//updata.append("seqno",args["item"].SEQ_NO);
		//updata.append("frontchk",args["item"].frontCHK);
		//updata.append("gsngno",gsngno);
		//updata.append("lvl1chk",args["item"].lvl1CHK);
		//updata.append("lvl2chk",args["item"].lvl2CHK);
		
		updata.append("EXTERNAL_PARTY_NUMBER",args["item"].EXTERNAL_PARTY_NUMBER);
		
		//updata.append("prssType","check");	// 체크박스 선택인지 save 버튼 클릭인지여부
		
		$.ajax({
			enctype: 'multipart/form-data',
			type: "post",
			url: "/SASStoredProcess/do",
			_program : 'SBIP://METASERVER/KFI_NY/AML Compliance/00.Environments/StoredProcess/0303_ExternalPartyApproval_save(StoredProcess)',
			dataType: 'json',
			data: updata,
			processData: false,
			contentType: false,
			cache: false,
			timeout: 600000,
			success : function(data){
				$("#btnSave").prop("disabled",false);
				console.log("execSTPA success" );
				console.log(data);
				//fnSaveResult(data);
			},
			complete: function(data){
				//data.responseText;	
				isRun=0;
				tParams=eval('[{}]');
				//$("#progressIndicatorWIP").hide();
			},
			error : function(xhr, status, error) {
				console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
				alert(error);
			}			
		});
}
function fnSaveResult(data){
	//alertMsg(data.MSG);
	setTimeout('submitSTP();',500*1);
	if (data.MSG == "Successfully saved...") {
		//alertMsg("성공적으로 저장되었습니다.");
		alertMsg("Sucessfully Saved.");
	}
	console.log("save_path : " + save_path);
}