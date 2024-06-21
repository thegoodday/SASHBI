var curObj;
var curPObj;
var curPName;
//var roleDef = [];
var gridClickSTP;
var dataClickSTP = [];
var gridDblClickSTP;
var dataDblClickSTP = [];
var gridGrpOpt1;
var dataGrpOpt1 = [];
var gridGrpOpt2;
var dataGrpOpt2 = [];
var gridGrpOpt3;
var dataGrpOpt3 = [];
var libraryData;
var preLibID;
var orgColumnInfo = [];
var tablesData;
var columnsData;
var gridSltdCols;
var dataSltdCols = [];
var dataVwSltdCols;
var columns = [
	{id: "columnName", name: "Column", field: "columnName", width: 100, cssClass: "l", editor: Slick.Editors.Text},
	{id: "stp", name: "Program", field: "stp", width: 120, editor: Slick.Editors.Text},
	{id: "funcName", name: "Target", field: "funcName", width: 100, editor: Slick.Editors.Text},
	{id: "params", name: "Parameters", field: "params", width: 180, editor: Slick.Editors.Text}
];
var options = {
	resizable: true,
	editable: true,
	enableAddRow: false,
	enableCellNavigation: true,
	asyncEditorLoading: false,
	forceFitColumns: true,
	autoEdit: false
};
var columnsSltdCols = [
	{id: "v",			name: "Visibility", 	field: "v",			width: 20, 	cssClass: "c", editor: Slick.Editors.Dummy},
	{id: "name",	name: "Name", 				field: "name",	width: 100, cssClass: "l", editor: Slick.Editors.Dummy},
	{id: "desc",	name: "Description", 	field: "desc",	width: 120, cssClass: "l", editor: Slick.Editors.Text},
	{id: "type", 	name: "Type", 				field: "type", 	width: 40, 	cssClass: "c", editor: Slick.Editors.Dummy},
	{id: "a", 		name: "Align", 				field: "a", 		width: 50, 	cssClass: "c", editor: Slick.Editors.Text},
	{id: "w",			name: "Width", 				field: "w",			width: 50, 	cssClass: "c", editor: Slick.Editors.Text},
	{id: "s",			name: "Sortable",			field: "s",			width: 50, 	cssClass: "c", editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
	{id: "r",			name: "Resizeable",		field: "r",			width: 50, 	cssClass: "c", editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
	{id: "fmt",		name: "Format", 			field: "fmt",		width: 80, 	cssClass: "l", editor: Slick.Editors.Text},
	{id: "efmt",	name: "Formater",  		field: "efmt",	width: 120, cssClass: "l", editor: Slick.Editors.Text},
	{id: "editor",name: "Editor",  			field: "editor",width: 120, cssClass: "l", editor: Slick.Editors.Text}
];
var optionsSltdCols = {
	resizable: true,
	editable: true,
	enableAddRow: false,
	enableCellNavigation: true,
	asyncEditorLoading: false,
	forceFitColumns: false,
	autoEdit: false
};
var grpOpt1columns = [
	{id: "leftMargin",	name: "Left Margin", 	field: "leftMargin", 	width: 163, cssClass: "c",editor: Slick.Editors.Text},
	{id: "rightMargin",	name: "Right Margin", field: "rightMargin", width: 163, cssClass: "c",editor: Slick.Editors.Text},
	{id: "bottomMargin",name: "Bottom Margin",field: "bottomMargin",width: 164, cssClass: "c",editor: Slick.Editors.Text}
];
var grpOpt2columns = [
	{id: "showValues",name: "Show Values", field: "showValues",width: 123, cssClass: "c",editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
	{id: "showXAxis",	name: "Show X-Axis", field: "showXAxis", width: 123, cssClass: "c",editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
	{id: "showYAxis",	name: "Show Y-Axis", field: "showYAxis", width: 123, cssClass: "c",editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
	{id: "stacked",		name: "Grouped/Stacked",field: "stacked",	 width: 124, cssClass: "c",editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark}
];
var grpOpt3columns = [
	{id: "staggerLabels",				name: "Stagger Labels", 		field: "staggerLabels",				width: 123, cssClass: "c",editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
	{id: "tooltips",						name: "Tooltips", 					field: "tooltips", 						width: 123, cssClass: "c",editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
	{id: "transitionDuration",	name: "TransitionDuration", field: "transitionDuration", 	width: 123, cssClass: "c",editor: Slick.Editors.Text},
	{id: "delay",								name: "Delay",		 					field: "delay",	 							width: 124, cssClass: "c",editor: Slick.Editors.Text}
];
var grpOptoptions = {
	editable: true,
	enableAddRow: false,
	enableCellNavigation: true,
	asyncEditorLoading: false,
	autoEdit: false
};
$(window).resize(function () {
	//$(".inputAttr").css("width",eval($(window).width()-780)+"px");
	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-0)/2));
}); 
$(document).ready(function () {
	getLibraries();
	$(".column").sortable({
		connectWith: ".column",
		handle: ".portlet-header",
		cancel: ".portlet-toggle",
		placeholder: "portlet-placeholder ui-corner-all"
	});
	$(".portlet")
		.addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
		.find( ".portlet-header" )
		.addClass( "ui-widget-header ui-corner-all" )
		.prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

	$(".portlet-toggle" ).click(function() {
		var icon = $( this );
		icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
		icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
	});
	//$("#dvAttr").width($(window).width()-600);
	//$(".inputAttr").css("width",eval($(window).width()-780)+"px");
	$(".inputAttr").css("border","1px solid #white");

	$("#dvModalWin").css("left",eval(eval($(window).width()-$("#dvModalWin").width()-0)/2));
	$("#dvModalWin").css("top",eval(eval($(window).height()-$("#dvModalWin").height()-0)/2));

	//$(".column").width(eval($("#dvLay").width()-40));
	$(".portlet-header").click(function() {
		clickPortletHeader(this);
		//$(".slick-viewport").css("overflow","auto");
	});
	console.log("savedLayObj : " + JSON.stringify(savedLayObj));
	console.log(savedLayObj);
	console.log("savedDR : " + JSON.stringify(savedDR));
	console.log(savedDR);
	if (savedLayObj != null) {
		var rowCount = Object.keys(savedLayObj).length;
		for(var ii=0;ii<rowCount;ii++){
			var row=savedLayObj["R"+ii];
			if (savedDR["R"+ii] == undefined) {
				savedDR["R"+ii]={}; 
			}
			var rowDR=savedDR["R"+ii];
			console.log("rowDR : " + rowDR);
			var colNum = Object.keys(row).length;
			for (var jj=0; jj<colNum; jj++){
				var obj=row["C" + jj];
				if (rowDR["C" + jj] == undefined ) rowDR["C" + jj]={};
				var objDR=rowDR["C" + jj]; 
				console.log("objDR");
				console.log(objDR);
				/*
				var id				=obj.id				  ;
				var stp			  =obj.stp				;
				var width		  =obj.width			;
				var height		=obj.height		  ;
				var float			=obj.float		  ;
				var refresh		=obj.refresh		;
				var style			=obj.style		  ;
				var exec			=obj.exec			  ;
				var type			=obj.type			  ;
				var tag				=obj.tag			  ;
				var graph_type=obj.graph_type	;
				var grp_opt		=obj.grp_opt	;
				var grp_stmt	=obj.grp_stmt	;
				var x_slider	=obj.x_slider	;
				var pie_height=obj.pie_height	;
				var pie_width	=obj.pie_width	;
				var sort			=obj.sort			  ;
				var cl_stp		=obj.cl_stp		  ;
				var cl_fn		  =obj.cl_fn			;
				var cl_param	=obj.cl_param	  ;
				var dbl_stp	  =obj.dbl_stp		;
				var dbl_fn		=obj.dbl_fn		  ;
				var dbl_param =obj.dbl_param  ;
				var obj=row["C" + jj];
				layoutObj[objName]={"id":id,"stp":stp,"curDR":objDR.drInfo,"width":width,"height":height,"float":float,"refresh":refresh,"style":style,"exec":exec,"type":type,"tag":tag,"sort":sort,"graph_type":graph_type,"grp_opt":grp_opt,"grp_stmt":grp_stmt,"x_slider":x_slider,"pie_height":pie_height,"pie_width":pie_width,"cl_stp":cl_stp,"cl_fn":cl_fn,"cl_param":"","dbl_stp":dbl_stp,"dbl_fn":dbl_fn,"dbl_param":""};
				console.log("comp layoutObj");
				console.log(layoutObj[objName]);
				*/
				var objName="Object"+ii+jj;
				layoutObj[objName]=obj;
				layoutObj[objName]["curDR"]=objDR.drInfo;
				console.log(layoutObj[objName]);
			}
		}

		
		// 아래 데이터 관려된 부분은 불필요해 보임.
		var rowCount = Object.keys(savedLayObj).length;
		//console.log("savedLayObj rowCount : " + rowCount);
		for(var ii=0;ii<rowCount;ii++){
			var row=savedLayObj["R"+ii];
			var rowDR=savedDR["R"+ii];
			var colNum = Object.keys(row).length;
			addColSection();
			for (var jj=0; jj<colNum; jj++){
				var obj=row["C" + jj];
				var objDR=rowDR["C" + jj];
				var id				=obj.id				  ;
				var stp				=obj.stp				;
				var width			=obj.width			;
				var height		=obj.height		  ;
				var float			=obj.float		  ;
				var refresh		=obj.refresh		;
				var style			=obj.style		  ;
				var jsCode		=obj.jsCode		  ;
				var exec			=obj.exec			  ;
				var type			=obj.type			  ;
				var tag				=obj.tag			  ;
				var graph_type=obj.graph_type ;
				var grp_opt		=obj.grp_opt		;
				var grp_stmt	=obj.grp_stmt		;
				var x_slider	=obj.x_slider		;
				var pie_height=obj.pie_height	;
				var pie_width	=obj.pie_width	;
				var sort			=obj.sort			  ;
				var cl_stp		=obj.cl_stp		  ;
				var cl_fn		  =obj.cl_fn			;
				var cl_param	=obj.cl_param	  ;
				var dbl_stp	  =obj.dbl_stp		;
				var dbl_fn		=obj.dbl_fn		  ;
				var dbl_param =obj.dbl_param  ;
	
				var html=$(".column:eq("+ii+")").html();
				width=width.replace("px","");
				height=height.replace("px","");
	
				var objNum=$(".portlet").length+1;
				html+='<div class="portlet"><div class="portlet-header" name=Object' + ii+jj +'>' + id +'</div><div class="portlet-content"><li> Width : ' + width + " px <li> Height : " + height + ' px</div></div>';
				$(".column:eq("+ii+")").html(html);
				$( ".portlet" )
					.addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
					.find( ".portlet-header" )
					.addClass( "ui-widget-header ui-corner-all" );
					//.prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
	
				$( ".portlet-toggle" ).click(function() {
					var icon = $( this );
					icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
					icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
				});
				$(".portlet-header").click(function() {
					clickPortletHeader(this);
				});
			}
		}
	} 	// 	if (savedLayObj != null) {

	/*
	for(var ii=0;ii<rowCount;ii++){
		var row=savedLayObj["R"+ii];
		roleDef["R"+ii]={};
		var rdRow=roleDef["R"+ii];
		var colNum = Object.keys(row).length;
		for (var jj=0; jj<colNum; jj++){
			rdRow["C"+jj]={};
		}
	}	
	console.log("roleDef" + JSON.stringify(roleDef));
	console.log(roleDef);
	*/
	$("#dvColumns, #dvSeledtedX, #dvSeledtedY").sortable({
		connectWith: ".rollInfo"
	}).disableSelection();
	$( "#dvSeledtedX" ).droppable({
		drop: function( event, ui ) {
			var grp_x="";
			$("#dvSeledtedX li").each(function(){
				var varName=$(this).attr("id");
				console.log(varName);
				if (varName != undefined) grp_x+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_x"]=grp_x;
			console.log("curDRInfo");
			console.log(curDRInfo);			

			var grp_rColumns="";
			$("#dvColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvSeledtedY" ).droppable({
		drop: function( event, ui ) {
			console.log($(this).attr("id"));
			var grp_y="";
			$("#dvSeledtedY li").each(function(){
				console.log(this);
				var varName=$(this).attr("id");
				console.log(varName);
				if (varName != undefined) grp_y+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_y"]=grp_y;
			console.log("curDRInfo");
			console.log(curDRInfo);			
			var grp_rColumns="";
			$("#dvColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	// Drag & Drop Div Link
	$("#dvBarColumns, #dvBarSeledtedX, #dvBarSeledtedY").sortable({
		connectWith: ".rollInfo"
	}).disableSelection();
	$( "#dvBarSeledtedX" ).droppable({
		drop: function( event, ui ) {
			var grp_x="";
			$("#dvBarSeledtedX li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_x+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_x"]=grp_x;
			var grp_rColumns="";
			$("#dvBarColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvBarSeledtedY" ).droppable({
		drop: function( event, ui ) {
			var grp_y="";
			$("#dvBarSeledtedY li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_y+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_y"]=grp_y;
			var grp_rColumns="";
			$("#dvBarColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$("#dvLineColumns, #dvLineSeledtedX, #dvLineSeledtedY").sortable({
		connectWith: ".rollInfo"
	}).disableSelection();
	$( "#dvLineSeledtedX" ).droppable({
		drop: function( event, ui ) {
			var grp_x="";
			$("#dvLineSeledtedX li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_x+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_x"]=grp_x;
			var grp_rColumns="";
			$("#dvLineColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvLineSeledtedY" ).droppable({
		drop: function( event, ui ) {
			var grp_y="";
			$("#dvLineSeledtedY li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_y+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_y"]=grp_y;
			var grp_rColumns="";
			$("#dvLineColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$("#dvPieColumns, #dvPieSeledtedX, #dvPieSeledtedY").sortable({
		connectWith: ".rollInfo"
	}).disableSelection();
	$( "#dvPieSeledtedX" ).droppable({
		drop: function( event, ui ) {
			var grp_x="";
			$("#dvPieSeledtedX li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_x+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_x"]=grp_x;
			var grp_rColumns="";
			$("#dvPieColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvPieSeledtedY" ).droppable({
		drop: function( event, ui ) {
			var grp_y="";
			$("#dvPieSeledtedY li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_y+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_y"]=grp_y;
			var grp_rColumns="";
			$("#dvPieColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	
	$("#dvMLineColumns, #dvMLineSeledtedX, #dvMLineSeledtedY, #dvMLineSeledtedG").sortable({
		connectWith: ".rollInfo"
	}).disableSelection();
	$( "#dvMLineSeledtedX" ).droppable({
		drop: function( event, ui ) {
			var grp_x="";
			$("#dvMLineSeledtedX li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_x+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_x"]=grp_x;
			var grp_rColumns="";
			$("#dvMLineColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvMLineSeledtedY" ).droppable({
		drop: function( event, ui ) {
			var grp_y="";
			$("#dvMLineSeledtedY li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_y+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_y"]=grp_y;
			var grp_rColumns="";
			$("#dvMLineColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvMLineSeledtedG" ).droppable({
		drop: function( event, ui ) {
			var grp_g="";
			$("#dvMLineSeledtedG li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_g+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_g"]=grp_g;
			console.log("curDRInfo");
			console.log(curDRInfo);
			var grp_rColumns="";
			$("#dvMLineColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});		
	$("#dvBLineColumns, #dvBLineSeledtedX, #dvBLineSeledtedY, #dvBLineSeledtedG").sortable({
		connectWith: ".rollInfo"
	}).disableSelection();
	$( "#dvBLineSeledtedX" ).droppable({
		drop: function( event, ui ) {
			var grp_x="";
			$("#dvBLineSeledtedX li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_x+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_x"]=grp_x;
			var grp_rColumns="";
			$("#dvBLineColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvBLineSeledtedY" ).droppable({
		drop: function( event, ui ) {
			var grp_y="";
			$("#dvBLineSeledtedY li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_y+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_y"]=grp_y;
			var grp_rColumns="";
			$("#dvBLineColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvBLineSeledtedG" ).droppable({
		drop: function( event, ui ) {
			var grp_g="";
			$("#dvBLineSeledtedG li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_g+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_g"]=grp_g;
			console.log("curDRInfo");
			console.log(curDRInfo);
			var grp_rColumns="";
			$("#dvBLineColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});		
	$("#dvBPlotColumns, #dvBPlotSeledtedX, #dvBPlotSeledtedY, #dvBPlotSeledtedG").sortable({
		connectWith: ".rollInfo"
	}).disableSelection();
	$( "#dvBPlotSeledtedX" ).droppable({
		drop: function( event, ui ) {
			var grp_x="";
			$("#dvBPlotSeledtedX li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_x+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_x"]=grp_x;
			var grp_rColumns="";
			$("#dvBPlotColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvBPlotSeledtedY" ).droppable({
		drop: function( event, ui ) {
			var grp_y="";
			$("#dvBPlotSeledtedY li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_y+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_y"]=grp_y;
			var grp_rColumns="";
			$("#dvBPlotColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvBPlotSeledtedG" ).droppable({
		drop: function( event, ui ) {
			var grp_g="";
			$("#dvBPlotSeledtedG li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_g+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_g"]=grp_g;
			console.log("curDRInfo");
			console.log(curDRInfo);
			var grp_rColumns="";
			$("#dvBPlotColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});		
	
	
	$("#dvScColumns, #dvScSeledtedX, #dvScSeledtedY, #dvScSeledtedG").sortable({
		connectWith: ".rollInfo"
	}).disableSelection();
	$( "#dvScSeledtedX" ).droppable({
		drop: function( event, ui ) {
			var grp_x="";
			$("#dvScSeledtedX li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_x+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_x"]=grp_x;
			var grp_rColumns="";
			$("#dvScColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvScSeledtedY" ).droppable({
		drop: function( event, ui ) {
			var grp_y="";
			$("#dvScSeledtedY li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_y+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_y"]=grp_y;
			var grp_rColumns="";
			$("#dvScColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
	$( "#dvScSeledtedG" ).droppable({
		drop: function( event, ui ) {
			var grp_g="";
			$("#dvScSeledtedG li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_g+=" " + varName;
			});
			var curDRInfo=curObj["curDR"];
			curDRInfo["grp_g"]=grp_g;
			console.log("curDRInfo");
			console.log(curDRInfo);
			var grp_rColumns="";
			$("#dvScColumns li").each(function(){
				var varName=$(this).attr("id");
				if (varName != undefined) grp_rColumns+=" " + varName;
			});
			curDRInfo["grp_rColumns"]=grp_rColumns;
		}
	});	
});

function getLibraries(){
	var dataType='html';
	var param={
	}

	$.ajax({
		url: "/SASHBI/HBIServlet?sas_forwardLocation=getLibraries",
		type: "post",
		data: param,
		dataType: dataType,
		cache:false,
		async: "true",
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) {
				$("#progressIndicatorWIP").show();
			}		
		},
		success : function(data){	
			console.log("execAjax success" );
			if (dataType=='json') console.log(data);
			setLibraries(data);
		},
		complete: function(data){
			isRun=0;
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alert(error);
		}
	});
}
function setLibraries(data){
	data=data.trim();
	libraryData=eval(data);
	console.log(libraryData.length);
	console.log(libraryData);
	$("#sltLibrary option").remove();
	$("#sltLibrary").append("<option value=''>===== Select Library =====</option>");

	for(ii=0;ii<libraryData.length;ii++){
		var id=libraryData[ii].id;
		var libref=libraryData[ii].libref;
		var label=libraryData[ii].label;
		$("#sltLibrary").append("<option value='" + libref +"'>" + label + "</option>");
	}
}
function getTables(){
	console.log("getTables started...");
	var dataType='html';
	var libraryID = $("#sltLibrary").val();
	var libraryName = $("#sltLibrary option:selected").text();
	var param={
		libraryID : libraryID,
		libraryName : libraryName
	}

	$.ajax({
		url: "/SASHBI/HBIServlet?sas_forwardLocation=getTables",
		type: "post",
		data: param,
		dataType: dataType,
		cache: false,
		async: false,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) {
				$("#progressIndicatorWIP").show();
			}		
		},
		success : function(data){	
			console.log("getTables Ajax success" );
			if (dataType=='json') console.log(data);
			setTables(data);
		},
		complete: function(data){
			isRun=0;
			$("#progressIndicatorWIP").hide();
			console.log("getTables Ajax completed..." );
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			//alert(error);
		}
	});
}
/*
		out.write ( "\"DISPLAY\":\""+rs.getObject(1).toString().trim() + "\"," );
		out.write ( "\"MEMNAME\":\""+rs.getObject(2).toString().trim() + "\"," );
		out.write ( "\"MEMTYPE\":\""+rs.getObject(3).toString().trim() + "\"," );
		out.write ( "\"MEMLABEL\":\""+rs.getObject(4).toString().trim() + "\"}" );

*/
function setTables(data){
	console.log("setTables start...");
	data=data.trim();
	tablesData=eval(data);
	$("#sltTables option").remove();
	$("#sltTables").append("<option value=''>===== Select Table =====</option>");

	for(ii=0;ii<tablesData.length;ii++){
		var DISPLAY=tablesData[ii].DISPLAY.trim();
		var TableName=tablesData[ii].TableName.trim();
		var TableDesc=tablesData[ii].TableDesc.trim();
		//if (TableDesc != "") TableDesc="("+TableDesc+")";
		$("#sltTables").append("<option value='" + TableName +"'>" + DISPLAY + "</option>");
	}	
}
function getColumns(){
	var dataType='html';
	var libraryID = $("#sltLibrary").val();
	var libraryName = $("#sltLibrary option:selected").text();
	var tableID = $("#sltTables").val();
	var param={
		libraryID : libraryID,
		libraryName : libraryName,
		tableID : tableID
	}

	$.ajax({
		url: "/SASHBI/HBIServlet?sas_forwardLocation=getColumns",
		type: "post",
		data: param,
		dataType: dataType,
		cache:false,
		async: "true",
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) {
				$("#progressIndicatorWIP").show();
			}		
		},
		success : function(data){	
			console.log("execAjax success" );
			console.log("curObj.graph_type : " + curObj.graph_type);
			//if (dataType=='json') console.log(data);
			if (curObj.type == "Grid") {
				renderColumns(data);
			} else if (curObj.type == "GridTree") {
				renderColumns(data);
			} else if(curObj.graph_type == "BarChart") {
				initBarGraphDataRoll(data);
			} else if(curObj.graph_type == "dBarChart") {
				initGraphDataRoll(data);
			} else if(curObj.graph_type == "LineChart") {
				initLineGraphDataRoll(data);
			} else if(curObj.graph_type == "Pie") {
				initPieGraphDataRoll(data);
			} else if(curObj.graph_type == "mLineChart") {
				initMLineGraphDataRoll(data);
			} else if(curObj.graph_type == "barLineChart") {
				initBLineGraphDataRoll(data);
			} else if(curObj.graph_type == "boxPlot") {
				initBPlotGraphDataRoll(data);
			} else if(curObj.graph_type == "Scatter") {
				initScGraphDataRoll(data);
			}
		},
		complete: function(data){
			isRun=0;
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alert(error);
		}
	});
}
function moveUp() {
	var rowIndex = gridSltdCols.getActiveCell().row;
	console.debug("rowIndex : " + rowIndex);
	dataVwSltdCols.getItem(rowIndex).rank = nz(parseInt(dataVwSltdCols.getItem(rowIndex).rank)-1,5) ;
	dataVwSltdCols.getItem(rowIndex-1).rank = nz(parseInt(dataVwSltdCols.getItem(rowIndex-1).rank)+1,5);
	dataVwSltdCols.fastSort('rank');
	console.debug(dataSltdCols);
	gridSltdCols.invalidate();
	gridSltdCols.render();
	gridSltdCols.setActiveCell(eval(rowIndex-1),0);
}
function moveDown() {
	var rowIndex = gridSltdCols.getActiveCell().row;
	var rowCount = gridSltdCols.getDataLength();
	console.debug("rowIndex : " + rowIndex);
	if (rowIndex+1 == rowCount) return;
	dataVwSltdCols.getItem(rowIndex).rank = nz(parseInt(dataVwSltdCols.getItem(rowIndex).rank)+1,5) ;
	console.debug("rowIndex : " + dataVwSltdCols.getItem(rowIndex).rank);
	dataVwSltdCols.getItem(rowIndex+1).rank = nz(parseInt(dataVwSltdCols.getItem(rowIndex+1).rank)-1,5);
	
	console.debug("rowCount : " + rowCount);
	
	dataVwSltdCols.fastSort('rank');

	gridSltdCols.invalidate();
	gridSltdCols.render();
	gridSltdCols.setActiveCell(eval(rowIndex+1),0);
}
function moveBottom() {
	var rowIndex = gridSltdCols.getActiveCell().row;
	dataVwSltdCols.getItem(rowIndex).rank = parseInt(gridSltdCols.length)+1;
	dataVwSltdCols.fastSort('rank');
	gridSltdCols.invalidate();
	gridSltdCols.render();
	gridSltdCols.setActiveCell(eval(gridSltdCols.length),0);
}
function moveTop() {
	var rowIndex = gridSltdCols.getActiveCell().row;
	dataVwSltdCols.getItem(rowIndex).rank = 0 ;
	dataVwSltdCols.fastSort('rank');
	gridSltdCols.invalidate();
	gridSltdCols.render();
	gridSltdCols.setActiveCell(0,0);
	console.log(dataSltdCols);
}
function renderColumns(data,from){
	var columnsData;
	dataSltdCols =[];
	/*
	{id: "v",			name: "Visibility", 	field: "v",			width: 20, 	cssClass: "c", editor: Slick.Editors.Dummy},
	{id: "name",	name: "Name", 				field: "name",	width: 100, cssClass: "l", editor: Slick.Editors.Text},
	{id: "desc",	name: "Description", 	field: "desc",	width: 120, cssClass: "l", editor: Slick.Editors.Text},
	{id: "type", 	name: "Type", 				field: "type", 	width: 50, 	cssClass: "c", editor: Slick.Editors.Dummy},
	{id: "a", 		name: "Align", 				field: "a", 		width: 50, 	cssClass: "c", editor: Slick.Editors.Dummy},
	{id: "w",			name: "Width", 				field: "w",			width: 50, 	cssClass: "c", editor: Slick.Editors.Text},
	{id: "s",			name: "Sortable",			field: "s",			width: 50, 	cssClass: "c", editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
	{id: "r",			name: "Resizeable",		field: "r",			width: 50, 	cssClass: "c", editor: Slick.Editors.Checkbox, formatter: Slick.Formatters.Checkmark},
	{id: "fmt",		name: "Format", 			field: "fmt",		width: 100, cssClass: "l", editor: Slick.Editors.Text},
	*/
	console.log("from : " + from);
	if (from != "saved") {
		console.log("from Meta");
		data=data.trim();
		columnsData=eval(data);
		console.log("columnsData");
		console.log(columnsData);
		console.log("columnsData.length : " + columnsData.length);

		for(ii=0;ii<columnsData.length;ii++){
	    dataSltdCols[ii] = {
				id		: columnsData[ii].id.trim(),
	    	rank	: nz(ii,5),
	    	v			: "S",
				name	: columnsData[ii].name.trim(),
				desc	: columnsData[ii].desc.trim(),
				type	: columnsData[ii].type.trim(),
				a			: columnsData[ii].type.trim()=="char"?"Left":"Right",
				w			: eval(columnsData[ii].length.trim() * 10),
				s			: true,
				r			: true,
				fmt		: columnsData[ii].fmt.trim(),
				efmt	: "Slick.Formatters.text",
				editor: "Slick.Editors.Text"
	    };		
		}						
	} else {
		dataSltdCols=data;
	}

	console.log("dataSltdCols" );
	console.log(dataSltdCols);
	
	dataVwSltdCols = new Slick.Data.DataView();
	dataVwSltdCols.setItems(dataSltdCols);
	
	gridSltdCols	= new Slick.Grid("#dvSltdCols",  dataVwSltdCols, columnsSltdCols,  optionsSltdCols);
	gridSltdCols.setSelectionModel(new Slick.RowSelectionModel());
	gridSltdCols.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
	var columnpicker = new Slick.Controls.ColumnPicker(columnsSltdCols, gridSltdCols, optionsSltdCols); 
	gridSltdCols.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );

	gridSltdCols.onClick.subscribe(function (e) {
		var cell = gridSltdCols.getCellFromEvent(e);
		console.log("gridSltdCols.getColumns()[cell.cell].id : " + gridSltdCols.getColumns()[cell.cell].id);
		if (gridSltdCols.getColumns()[cell.cell].id == "v") {
			if (!gridSltdCols.getEditorLock().commitCurrentEdit()) {
				return;
			}
			
			var isShow = { "S": "H", "H": "X", "X": "S" };
			dataSltdCols[cell.row].v = isShow[dataSltdCols[cell.row].v];
			gridSltdCols.updateRow(cell.row);
			e.stopPropagation();
		}
		if (gridSltdCols.getColumns()[cell.cell].id == "a") {
			if (!gridSltdCols.getEditorLock().commitCurrentEdit()) {
				return;
			}
			
			var align = { "Left": "Right", "Right": "Center", "Center": "Left" };
			dataSltdCols[cell.row].a = align[dataSltdCols[cell.row].a];
			gridSltdCols.updateRow(cell.row);
			e.stopPropagation();
		}
	});		
	setDataRole();
}
function initGraphDataRoll(data,from){
	$("#dvColumns").html("");
	$("#dvSeledtedX").html("");
	$("#dvSeledtedY").html("");
	if(curObj.curDR == undefined) curObj["curDR"]={};
	setDataRole();
	var curDRInfo=curObj["curDR"];
	console.log(curDRInfo);			
	if (from != "saved") {
		console.log(curDRInfo);
		data=data.trim();
		dataSltdCols=eval(data);
		console.log("dataSltdCols:" );
		console.log(dataSltdCols);
		console.log(dataSltdCols.length);
		//if (curObj.curDR.columns == undefined) curObj.curDR["columns"]=dataSltdCols;
		curDRInfo["columns"]=dataSltdCols;
		console.log("curObj.curDR at initGraphDataRoll========================");
		console.log(curDRInfo);			
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();
			var ColumnID=dataSltdCols[ii].id.trim();
			var ColumnName=dataSltdCols[ii].name.trim();
			var SASColumnLength=dataSltdCols[ii].length.trim();
			var SASColumnType=dataSltdCols[ii].type.trim();
			var SASFormat=dataSltdCols[ii].fmt.trim();
			//var SASInformat=dataSltdCols[ii].SASInformat.trim();
			//$("#dvColumns").append("<label id='"+ ColumnID.trim() + "' class='objColnum' ondrop='preventDrag(event);' draggable='true' ondragstart='drag(event)'>" + ColumnDesc +"</label>");
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			$("#dvColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
		}		
	} else {
		console.log("with Saved Info...");
		grp_rColumns=curDRInfo["grp_rColumns"].trim() + " ";
		grp_x=curDRInfo["grp_x"].trim() + " ";
		grp_y=curDRInfo["grp_y"].trim() + " ";
		dataSltdCols=data;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();
			var ColumnID=dataSltdCols[ii].id.trim();
			var ColumnName=dataSltdCols[ii].name.trim() + " ";
			var SASColumnLength=dataSltdCols[ii].length.trim();
			var SASColumnType=dataSltdCols[ii].type.trim();
			var SASFormat=dataSltdCols[ii].fmt.trim();
			//var SASInformat=dataSltdCols[ii].SASInformat.trim();
			//$("#dvColumns").append("<label id='"+ ColumnID.trim() + "' class='objColnum' ondrop='preventDrag(event);' draggable='true' ondragstart='drag(event)'>" + ColumnDesc +"</label>");
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			isBe=grp_rColumns.indexOf(ColumnName);
			console.log(isBe);
			if (grp_rColumns.indexOf(ColumnName) > -1) {
				$("#dvColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_x.indexOf(ColumnName) > -1) {
				$("#dvSeledtedX").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_y.indexOf(ColumnName) > -1) {
				$("#dvSeledtedY").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			}
		}
	}	
	setDataRole();
}




function initPieGraphDataRoll(data,from){
	$("#dvPieColumns").html("");
	$("#dvPieSeledtedX").html("");
	$("#dvPieSeledtedY").html("");
	if(curObj.curDR == undefined) curObj["curDR"]={};
	setDataRole();
	var curDRInfo=curObj["curDR"];
	if (from != "saved") {
		data=data.trim();
		dataSltdCols=eval(data);
		curDRInfo["columns"]=dataSltdCols;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();					//
			var ColumnName=dataSltdCols[ii].name.trim();					//
			var SASColumnType=dataSltdCols[ii].type.trim();		//
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			$("#dvPieColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
		}		
	} else {
		console.log("curDRInfo : " );
		console.log(curDRInfo);
		console.log(curDRInfo["grp_rColumns"]);
		if ( curDRInfo["grp_rColumns"] != undefined){
			grp_rColumns=curDRInfo["grp_rColumns"].trim() + " ";
			grp_x=curDRInfo["grp_x"].trim() + " ";
			grp_y=curDRInfo["grp_y"].trim() + " ";
			dataSltdCols=data;
			for(ii=0;ii<dataSltdCols.length;ii++){
				var ColumnDesc=dataSltdCols[ii].desc.trim();
				var ColumnName=dataSltdCols[ii].name.trim() + " ";
				var SASColumnType=dataSltdCols[ii].type.trim();
				if (ColumnDesc=="") ColumnDesc=ColumnName;
				if (grp_rColumns.indexOf(ColumnName) > -1) {
					$("#dvPieColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
				} else if (grp_x.indexOf(ColumnName) > -1) {
					$("#dvPieSeledtedX").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
				} else if (grp_y.indexOf(ColumnName) > -1) {
					$("#dvPieSeledtedY").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
				}
			}
		}
	}	
	setDataRole();
}
function initBarGraphDataRoll(data,from){
	$("#dvBarColumns").html("");
	$("#dvBarSeledtedX").html("");
	$("#dvBarSeledtedY").html("");
	if(curObj.curDR == undefined) curObj["curDR"]={};
	setDataRole();
	var curDRInfo=curObj["curDR"];
	if (from != "saved") {
		data=data.trim();
		dataSltdCols=eval(data);
		curDRInfo["columns"]=dataSltdCols;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();					//
			var ColumnName=dataSltdCols[ii].name.trim();					//
			var SASColumnType=dataSltdCols[ii].type.trim();		//
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			$("#dvBarColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
		}		
	} else {
		grp_rColumns=curDRInfo["grp_rColumns"].trim() + " ";
		grp_x=curDRInfo["grp_x"].trim() + " ";
		grp_y=curDRInfo["grp_y"].trim() + " ";
		dataSltdCols=data;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();
			var ColumnName=dataSltdCols[ii].name.trim() + " ";
			var SASColumnType=dataSltdCols[ii].type.trim();
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			if (grp_rColumns.indexOf(ColumnName) > -1) {
				$("#dvBarColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_x.indexOf(ColumnName) > -1) {
				$("#dvBarSeledtedX").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_y.indexOf(ColumnName) > -1) {
				$("#dvBarSeledtedY").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			}
		}
	}	
	setDataRole();
}
function initLineGraphDataRoll(data,from){
	$("#dvLineColumns").html("");
	$("#dvLineSeledtedX").html("");
	$("#dvLineSeledtedY").html("");
	if(curObj.curDR == undefined) curObj["curDR"]={};
	setDataRole();
	var curDRInfo=curObj["curDR"];
	if (from != "saved") {
		data=data.trim();
		dataSltdCols=eval(data);
		curDRInfo["columns"]=dataSltdCols;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();					//
			var ColumnName=dataSltdCols[ii].name.trim();					//
			var SASColumnType=dataSltdCols[ii].type.trim();		//
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			$("#dvLineColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
		}		
	} else {
		grp_rColumns=curDRInfo["grp_rColumns"].trim() + " ";
		grp_x=curDRInfo["grp_x"].trim() + " ";
		grp_y=curDRInfo["grp_y"].trim() + " ";
		dataSltdCols=data;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();
			var ColumnName=dataSltdCols[ii].name.trim() + " ";
			var SASColumnType=dataSltdCols[ii].type.trim();
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			if (grp_rColumns.indexOf(ColumnName) > -1) {
				$("#dvLineColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_x.indexOf(ColumnName) > -1) {
				$("#dvLineSeledtedX").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_y.indexOf(ColumnName) > -1) {
				$("#dvLineSeledtedY").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			}
		}
	}	
	setDataRole();
}


function initMLineGraphDataRoll(data,from){
	$("#dvMLineColumns").html("");
	$("#dvMLineSeledtedX").html("");
	$("#dvMLineSeledtedY").html("");
	$("#dvMLineSeledtedG").html("");
	if(curObj.curDR == undefined) curObj["curDR"]={};
	setDataRole();
	var curDRInfo=curObj["curDR"];
	if (from != "saved") {
		data=data.trim();
		dataSltdCols=eval(data);
		curDRInfo["columns"]=dataSltdCols;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();					//
			var ColumnName=dataSltdCols[ii].name.trim();					//
			var SASColumnType=dataSltdCols[ii].type.trim();		//
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			$("#dvMLineColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
		}		
	} else {
		grp_rColumns=curDRInfo["grp_rColumns"].trim() + " ";
		grp_x=curDRInfo["grp_x"].trim() + " ";
		grp_y=curDRInfo["grp_y"].trim() + " ";
		grp_g=curDRInfo["grp_g"].trim() + " ";
		dataSltdCols=data;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();
			var ColumnName=dataSltdCols[ii].name.trim() + " ";
			var SASColumnType=dataSltdCols[ii].type.trim();
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			if (grp_rColumns.indexOf(ColumnName) > -1) {
				$("#dvMLineColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_x.indexOf(ColumnName) > -1) {
				$("#dvMLineSeledtedX").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_y.indexOf(ColumnName) > -1) {
				$("#dvMLineSeledtedY").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_g.indexOf(ColumnName) > -1) {
				$("#dvMLineSeledtedG").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			}
		}
	}	
	setDataRole();
}


function initBLineGraphDataRoll(data,from){
	console.log("from : " + from);
	console.log(data);
	$("#dvBLineColumns").html("");
	$("#dvBLineSeledtedX").html("");
	$("#dvBLineSeledtedY").html("");
	$("#dvBLineSeledtedG").html("");
	if(curObj.curDR == undefined) curObj["curDR"]={};
	setDataRole();
	var curDRInfo=curObj["curDR"];
	if (from != "saved") {
		data=data.trim();
		dataSltdCols=eval(data);
		curDRInfo["columns"]=dataSltdCols;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();					//
			var ColumnName=dataSltdCols[ii].name.trim();					//
			var SASColumnType=dataSltdCols[ii].type.trim();		//
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			$("#dvBLineColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
		}		
	} else {
		if (data == undefined) return;
		grp_rColumns=curDRInfo["grp_rColumns"].trim() + " ";
		grp_x=curDRInfo["grp_x"].trim() + " ";
		grp_y=curDRInfo["grp_y"].trim() + " ";
		grp_g=curDRInfo["grp_g"].trim() + " ";
		dataSltdCols=data;
		console.log("grp_rColumns : " + grp_rColumns);
		console.log("grp_x : " + grp_x);
		console.log("grp_y : " + grp_y);
		console.log("grp_g : " + grp_g);
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();
			var ColumnName=dataSltdCols[ii].name.trim()+" ";
			var SASColumnType=dataSltdCols[ii].type.trim();
			console.log("ColumnName : " + ColumnName +":"+grp_rColumns.indexOf(ColumnName)+":"+grp_x.indexOf(ColumnName)+":"+grp_y.indexOf(ColumnName)+":"+grp_g.indexOf(ColumnName));
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			if (grp_rColumns.indexOf(ColumnName) > -1) {
				$("#dvBLineColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_x.indexOf(ColumnName) > -1) {
				$("#dvBLineSeledtedX").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_y.indexOf(ColumnName) > -1) {
				console.log("grp_y : " + ColumnName + ":" + grp_y);
				$("#dvBLineSeledtedY").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_g.indexOf(ColumnName) > -1) {
				$("#dvBLineSeledtedG").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else {
				console.log("Error : " + ColumnName);
			}
		}
	}	
	setDataRole();
}




function initScGraphDataRoll(data,from){
	$("#dvScColumns").html("");
	$("#dvScSeledtedX").html("");
	$("#dvScSeledtedY").html("");
	$("#dvScSeledtedG").html("");
	if(curObj.curDR == undefined) curObj["curDR"]={};
	setDataRole();
	var curDRInfo=curObj["curDR"];
	if (from != "saved") {
		data=data.trim();
		dataSltdCols=eval(data);
		curDRInfo["columns"]=dataSltdCols;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();					//
			var ColumnName=dataSltdCols[ii].name.trim();					//
			var SASColumnType=dataSltdCols[ii].type.trim();		//
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			$("#dvScColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
		}		
	} else {
		grp_rColumns=curDRInfo["grp_rColumns"].trim() + " ";
		grp_x=curDRInfo["grp_x"].trim() + " ";
		grp_y=curDRInfo["grp_y"].trim() + " ";
		grp_g=curDRInfo["grp_g"].trim() + " ";
		dataSltdCols=data;
		for(ii=0;ii<dataSltdCols.length;ii++){
			var ColumnDesc=dataSltdCols[ii].desc.trim();
			var ColumnName=dataSltdCols[ii].name.trim() + " ";
			var SASColumnType=dataSltdCols[ii].type.trim();
			if (ColumnDesc=="") ColumnDesc=ColumnName;
			if (grp_rColumns.indexOf(ColumnName) > -1) {
				$("#dvScColumns").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_x.indexOf(ColumnName) > -1) {
				$("#dvScSeledtedX").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_y.indexOf(ColumnName) > -1) {
				$("#dvScSeledtedY").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			} else if (grp_g.indexOf(ColumnName) > -1) {
				$("#dvScSeledtedG").append("<li class='portlet-header ui-corner-all ui-widget-header' id='"+ ColumnName.trim() + "'>" + ColumnDesc +" : "+SASColumnType+"</li>");
			}
		}
	}	
	setDataRole();
}



function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	console.log("ondrop ev");
	console.log(ev);
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	console.log("data : " + data);
	ev.target.appendChild(document.getElementById(data));
}
function testit(){
	console.log($("#div2").html());
	var varNum=$("#div2").children().length;
	console.log("varNum : " + varNum);
	for (ii=0;ii<varNum;ii++){
		var itemID = $("#div2 label:eq("+ii+")").attr("id");
		console.log("\t\tID : " + itemID);
	}
}
function preventDrag(event){
	//if drag over event -- allows for drop event to be captured, in case default for this is to not allow drag over target
	//prevent text dragging -- IE and new Mozilla (like Firefox 3.5+)
	if(event.type=='dragenter' || event.type=='dragover' || event.type=='drop') {
		if(event.stopPropagation) { //(Mozilla)
			event.preventDefault();
			event.stopPropagation(); 
			// prevent drag operation from bubbling up and causing text to be modified on old Mozilla 
			// (before Firefox 3.5, which doesn't have drop event -- this avoids having to capture old dragdrop event)
		}
		return false; //(IE)
	}
}
function renderGrpOpt1(data){
	if (data == undefined){
		var d = (dataGrpOpt1[dataGrpOpt1.length] = {});
		d["leftMargin"] = "0";
		d["rightMargin"] = "0";
		d["bottomMargin"] = "0";
	} else {
		if (data == "" ) data = [];
		dataGrpOpt1=data;
	}
	
	dataVwClickSTP = new Slick.Data.DataView({ inlineFilters: true });
	gridGrpOpt1 = new Slick.Grid("#dvGraphOpt1", dataGrpOpt1, grpOpt1columns, grpOptoptions);
	gridGrpOpt1.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGrpOpt1.setSelectionModel(new Slick.CellSelectionModel());	

	gridGrpOpt1.onClick.subscribe(function (e, args) {
	})	
	gridGrpOpt1.onCellChange.subscribe(function (e) {
		setGraphOptions();
	});
	//$(".slick-viewport").css("overflow","hidden");
}
function renderGrpOpt2(data){
	if (data == undefined){
		var d = (dataGrpOpt2[dataGrpOpt2.length] = {});
		d["showValues"] = true;
		d["showXAxis"] = true;
		d["showYAxis"] = true;
		d["stacked"] = true;
	} else {
		if (data == "" ) data = [];
		dataGrpOpt2=data;
	}
	
	gridGrpOpt2 = new Slick.Grid("#dvGraphOpt2", dataGrpOpt2, grpOpt2columns, grpOptoptions);
	gridGrpOpt2.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGrpOpt2.setSelectionModel(new Slick.CellSelectionModel());	

	gridGrpOpt2.onClick.subscribe(function (e, args) {
	})	
	gridGrpOpt2.onCellChange.subscribe(function (e) {
		setGraphOptions();
	});
	//$(".slick-viewport").css("overflow","hidden");
}
function renderGrpOpt3(data){
	if (data == undefined){
		var d = (dataGrpOpt3[dataGrpOpt3.length] = {});
		d["staggerLabels"] = true;
		d["tooltips"] = true;
		d["transitionDuration"] = "0";
		d["delay"] = "0";
	} else {
		if (data == "" ) data = [];
		dataGrpOpt3=data;
	}
	
	gridGrpOpt3 = new Slick.Grid("#dvGraphOpt3", dataGrpOpt3, grpOpt3columns, grpOptoptions);
	gridGrpOpt3.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridGrpOpt3.setSelectionModel(new Slick.CellSelectionModel());	

	gridGrpOpt3.onClick.subscribe(function (e, args) {
	})	
	gridGrpOpt3.onCellChange.subscribe(function (e) {
		setGraphOptions();
	});
	//$(".slick-viewport").css("overflow","hidden");
}
function delDblSTP(){
	if (gridDblClickSTP.getActiveCell() == null){
		return;
	}

  var dataDblClickSTP = gridDblClickSTP.getData();
  var current_row = gridDblClickSTP.getActiveCell().row;
  dataDblClickSTP.splice(current_row,1);
  var r = current_row;
  while (r<dataDblClickSTP.length){
    gridDblClickSTP.invalidateRow(r);
    r++;
  }
  gridDblClickSTP.updateRowCount();
  gridDblClickSTP.render();
  gridDblClickSTP.scrollRowIntoView(current_row-1);  
}
function renderDBL_STP(data){
	if (data == undefined){
		var d = (dataDblClickSTP[dataDblClickSTP.length] = {});
		var stpid=$("#txDBL_STP").val();
		d["columnName"] = "";
		d["funcName"] = "";
		d["stp"] = stpid;
		d["params"] = getParams(stpid);

	} else {
		if (data == "" ) data = [];
		dataDblClickSTP=data;
	}
	
	dataVwClickSTP = new Slick.Data.DataView({ inlineFilters: true });
	gridDblClickSTP = new Slick.Grid("#grDblSTP", dataDblClickSTP, columns, options);
	gridDblClickSTP.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridDblClickSTP.setSelectionModel(new Slick.CellSelectionModel());

	gridDblClickSTP.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridDblClickSTP.getCellFromEvent(e);
		curCxtID=gridDblClickSTP.getColumns()[cell.cell].id;
		if (gridDblClickSTP.getColumns()[cell.cell].id == "funcName") {
			$("#contextDblClick")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextDblClick").hide();
			});
		}
	});  		
	$("#contextDblClick").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridDblClickSTP.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		dataDblClickSTP[row].funcName = $(e.target).html();
		gridDblClickSTP.updateRow(row);
	});		
	gridDblClickSTP.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		gridDblClickSTP.invalidateRow(data.length);
		gridDblClickSTP.push(item);
		gridDblClickSTP.updateRowCount();
		gridDblClickSTP.render();
	});
	gridDblClickSTP.onClick.subscribe(function (e, args) {
		curObj.dbl_stp=dataDblClickSTP;
	});
	gridDblClickSTP.onCellChange.subscribe(function (e) {
		curObj.dbl_stp=dataDblClickSTP;
	});	
}
function delClickSTP(){
	if (gridClickSTP.getActiveCell() == null){
		return;
	}

  var dataClickSTP = gridClickSTP.getData();
  var current_row = gridClickSTP.getActiveCell().row;
  dataClickSTP.splice(current_row,1);
  var r = current_row;
  while (r<dataClickSTP.length){
    gridClickSTP.invalidateRow(r);
    r++;
  }
  gridClickSTP.updateRowCount();
  gridClickSTP.render();
  gridClickSTP.scrollRowIntoView(current_row-1);  
}
function getParamsInfo(data){
	var params = eval(data)[0].params;
}
function getParams(sp_pathUrl){
	if (curObj.exec=="STP" && curObj.type!="Tag" && sp_pathUrl=="") {
		alert("No Selected Stored Process...");
		return;
	}
	if (sp_pathUrl=="") {
		return;
	}
	var fn='getParamsInfo';
	sp_pathUrl = "SBIP://METASERVER" + sp_pathUrl;
	var param={
		sp_pathUrl : sp_pathUrl
	}
	params=$.ajax({
		url: "/SASHBI/STPHBIServlet?sas_forwardLocation=getReqParams",
		type: "post",
		data: param,
		dataType: 'text',
		async: false,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show();
		}
	}).responseText;
	return params;	
}
function renderCL_STP(data){
	if (data == undefined){
		var d = (dataClickSTP[dataClickSTP.length] = {});
		var stpid=$("#txCL_STP").val();
		//console.log("STP : " + stpid);
		d["columnName"] = "";
		d["funcName"] = "";
		d["stp"] = stpid;
		d["params"] = getParams(stpid);
		d["gType"] = "";
	} else {
		if (data == "" ) data = [];
		dataClickSTP=data;
	}
	dataVwClickSTP = new Slick.Data.DataView({ inlineFilters: true });

	gridClickSTP = new Slick.Grid("#grClickSTP", dataClickSTP, columns, options);
	gridClickSTP.registerPlugin( new Slick.AutoTooltips({ enableForHeaderCells: true }) );
	gridClickSTP.setSelectionModel(new Slick.CellSelectionModel());

	gridClickSTP.onContextMenu.subscribe(function (e) {
		e.preventDefault();
		var cell = gridClickSTP.getCellFromEvent(e);
		curCxtID=gridClickSTP.getColumns()[cell.cell].id;
		if (gridClickSTP.getColumns()[cell.cell].id == "funcName") {
			$("#contextClick")
				.data("row", cell.row)
				.css("top", e.pageY)
				.css("left", e.pageX)
				.show();
			
			$("body").one("click", function () {
				$("#contextClick").hide();
			});
		}
	});  		
	$("#contextClick").click(function (e) {
		if (!$(e.target).is("li")) {
			return;
		}
		if (!gridClickSTP.getEditorLock().commitCurrentEdit()) {
			return;
		}
		var row = $(this).data("row");
		var execType=$(e.target).attr("execType");
		var execSTP=$(e.target).attr("execSTP");
		var gType=$(e.target).attr("gType");
		var params=$(e.target).attr("params");
		console.log("params : " + params);
		if (execType == "UD") {
			dataClickSTP[row].stp = "User Defined";
			dataClickSTP[row].gType = gType;
			dataClickSTP[row].params = params;
		} else {
			dataClickSTP[row].stp = execSTP;
		}
		dataClickSTP[row].funcName = $(e.target).html();
		gridClickSTP.updateRow(row);
	});			
	gridClickSTP.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		gridClickSTP.invalidateRow(data.length);
		gridClickSTP.push(item);
		gridClickSTP.updateRowCount();
		gridClickSTP.render();
	});
	gridClickSTP.onClick.subscribe(function (e, args) {
		curObj.cl_stp=dataClickSTP;
	});
	gridClickSTP.onCellChange.subscribe(function (e) {
		curObj.cl_stp=dataClickSTP;
	});	
}
function addColSection(){
	$("#dvLay").append('<div class="column"/>');
	$( ".column" ).sortable({
		connectWith: ".column",
		handle: ".portlet-header",
		cancel: ".portlet-toggle",
		placeholder: "portlet-placeholder ui-corner-all"
	});
	//$(".column").width(eval($("#dvLay").width()-40));
}
function selectSTP(sbipUrl,objID){
	$("#txtSTP_ID").val(objID);
	$("#txtSTP_URI").val(sbipUrl);
}
function addObj(){
	var html=$(".column:first").html();
	var objNum=$(".portlet").length+1;
	html+='<div class="portlet"><div class="portlet-header" name=Object' + objNum +'>New Object</div><div class="portlet-content"></div></div>';
	$(".column:first").html(html);
	$( ".portlet" )
		.addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
		.find( ".portlet-header" )
		.addClass( "ui-widget-header ui-corner-all" );
		//.prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

	$( ".portlet-toggle" ).click(function() {
		var icon = $( this );
		icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
		icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
	});
	$(".portlet-header").click(function() {
		clickPortletHeader(this);
	});
}
function getAttr(obj){
	$("#txID").val("");
	$("#txSTP").val("");
	$("#txWidth").val("");
	$("#txHeight").val("");
	$("#sltFloat").val("");
	$("#txRefresh").val("");
	$("#txrStyle").val("");
	$("#txrJS").val("");
	$("#sltExec").val("");
	$("#sltType").val("");
	$("#txrTag").val("");
	$("#sltSort").val("");
	$("#sltEditable").val("");
	$("#sltAddRow").val("");
	$("#sltFitColumns").val("");
	$("#sltGraphType").val("");
	$("#txrGraphOptions").val("");
	$("#txrGraphStmt").val("");
	$("#txCL_STP").val("");
	$("#txCL_FN").val("");
	$("#txCL_Param").val("");
	$("#txDBL_STP").val("");
	$("#txDBL_FN").val("");
	$("#txDBL_Param").val("");
	$("#sltPreCodeYN").val("N");
	$("#txrPreCode").val("");
	$("#dvColumns").html("");
	$("#dvSeledtedX").html("");
	$("#dvSeledtedY").html("");
	
	dataClickSTP = [];
	dataDblClickSTP = [];
	var objName=$(obj).attr('name');
	curObj=eval('layoutObj.' + $(obj).attr('name'));
	console.log("curObj");
	console.log(curObj);
	console.log("layoutObj");
	console.log(layoutObj);

	if (typeof curObj == "undefined") {
		layoutObj[objName]={"id":"","stp":"","curDR":{},"width":"","height":"","float":"left","refresh":"","style":"","jsCode":"","exec":"","type":"","tag":"","sort":"","editable":"0","autoedit":"0","addRow":"0","fitColumns":"0","graph_type":"BarChart","grp_opt":"","grp_stmt":"","x_slider":"","pie_height":"","pie_width":"","cl_stp":"","cl_fn":"","cl_param":"","dbl_stp":"","dbl_fn":"","dbl_param":""};
		curObj=layoutObj[objName];
	}
	
	$("#txID").val(curObj.id);
	$("#txSTP").val(curObj.stp);
	setSTP();
	curObj.width=curObj.width.replace("px","");
	curObj.height=curObj.height.replace("px","");

	$("#txWidth").val(curObj.width);
	$("#txHeight").val(curObj.height);
	val=curObj.float? curObj.float : "";
	
	$("#txRefresh").val(curObj.refresh ? curObj.refresh : "");
	$("#sltFloat").val(curObj.float ? curObj.float : "");
	$("#txrStyle").val(curObj.style);
	$("#txrJS").val(curObj.jsCode ? curObj.jsCode : "");
	$("#sltGraphType").val(curObj.graph_type);

	$(".clsUD").hide();
	console.log("curObj.graph_type : " + curObj.graph_type);
		  if (curObj.graph_type=="Grid") $("#udGrid").show();
	else if (curObj.graph_type=="dBarChart") $("#udDbar").show();
	else if (curObj.graph_type=="LineChart") $("#udLine").show();
	else if (curObj.graph_type=="Pie") $("#udPie").show();
	else if (curObj.graph_type=="BarChart") $("#udBar").show();
	else if (curObj.graph_type=="mLineChart") $("#udMLine").show();
	else if (curObj.graph_type=="barLineChart") $("#udBarLine").show();
	else if (curObj.graph_type=="boxPlot") $("#udBoxPlot").show();
	else if (curObj.graph_type=="Scatter") $("#udScatter").show();
	
	
	if (curObj.type =="Graph"){
		curObj.type=curObj.graph_type;
	}
	$("#sltType").val(curObj.type);
	$("#txrTag").val(curObj.tag ? curObj.tag : "");
	$("#sltSort").val(curObj.sort);
	$("#sltEditable").val(curObj.editable ? curObj.editable : "0");
	$("#sltAutoEdit").val(curObj.autoedit ? curObj.autoedit : "0");
	$("#sltAddRow").val(curObj.addRow ? curObj.addRow : "0");
	$("#sltFitColumns").val(curObj.fitColumns ? curObj.fitColumns : "0");
	getGraphOptions();
	$("#txrGraphStmt").val(curObj.grp_stmt ? curObj.grp_stmt : "");
	var kk=$("#txrGraphStmt").val();
	console.log("txrGraphStmt : " + kk);
	$("#sltXSlider").val(curObj.x_slider ? curObj.x_slider : "");
	$("#txPHeight").val(curObj.pie_height ? curObj.pie_height : "");
	$("#txPWidth").val(curObj.pie_width ? curObj.pie_width : "");
	renderCL_STP(curObj.cl_stp);
	$("#txCL_FN").val(curObj.cl_fn);
	$("#txCL_Param").val(curObj.cl_param);
	renderDBL_STP(curObj.dbl_stp);
	$("#txDBL_FN").val(curObj.dbl_fn);
	$("#txDBL_Param").val(curObj.dbl_param);
	console.log("curObj.exec : " + curObj.exec);
	if(curObj.exec == undefined){
		curObj.exec="STP";
	}
	$("#sltExec").val(curObj.exec);
	setExecution();
	setType();
	//console.log("curObj");
	//console.log(curObj);
	
	//console.log("libraryData" + JSON.stringify(libraryData));
	//console.log(libraryData);
	var libIndex=0;
	var find=0;
	var libid;
	var libref;
	console.log("curObj : ");
	console.log(curObj);
	//console.log("curObj.curDR : " + curObj.curDR);

	//console.log("curObj.curDR.library : " + curObj.curDR.library);
	//console.log("libraryData.length :" + libraryData.length);
	if ( curObj.curDR != undefined) {
		if(curObj.curDR.precode == undefined){
			curObj.curDR["precode"]="N";
			curObj.curDR["pcode"]="";
		}
		console.log("curObj.curDR");
		console.log(curObj.curDR);
		$("#sltPreCodeYN").val(curObj.curDR.precode);
		setPreCodeYN();
		$("#txrPreCode").val(curObj.curDR.pcode);
				
/*				
		while(find==0){
			console.log("libraryData : " + libraryData);
			console.log("libIndex : " + libIndex);
			console.log(libraryData);
			console.log("libraryData.length : " + libraryData.length);
			if (libraryData[libIndex].libref == curObj.curDR.library) {
				libid = libraryData[libIndex].id;
				libref = libraryData[libIndex].libref;
				console.log("libid : " + libid);
				console.log("libref : " + libref);
				find=1;
				break;
			}
			libIndex++;
		}
*/
		find=0;
		for(var libIndex=0; libIndex < libraryData.length; libIndex++){
			if (libraryData[libIndex].libref == curObj.curDR.library) {
				libid = libraryData[libIndex].id;
				libref = libraryData[libIndex].libref;
				console.log("libid : " + libid);
				console.log("libref : " + libref);
				find=1;
				break;
			}
		}		
		//$("#sltLibrary").val(libid);
		$("#sltLibrary").val(libref);
		
		if(libid != preLibID) {
			getTables();
		}
		preLibID=libid;
		
		
		if(find == 1) findTableID();	
	
	

		if (curObj.type == "Grid") {
			renderColumns(curObj.curDR.columns,"saved");
		} else if (curObj.type == "GridTree") {
			//renderColumns(data);
			renderColumns(curObj.curDR.columns,"saved");
		} else if(curObj.graph_type == "BarChart") {
			initBarGraphDataRoll(curObj.curDR.columns,"saved");
		} else if(curObj.graph_type == "dBarChart") {
			initGraphDataRoll(curObj.curDR.columns,"saved");
		} else if(curObj.graph_type == "LineChart") {
			initLineGraphDataRoll(curObj.curDR.columns,"saved");
		} else if(curObj.graph_type == "Pie") {
			initPieGraphDataRoll(curObj.curDR.columns,"saved");
		} else if(curObj.graph_type == "mLineChart") {
			initMLineGraphDataRoll(curObj.curDR.columns,"saved");
		} else if(curObj.graph_type == "barLineChart") {
			initBLineGraphDataRoll(curObj.curDR.columns,"saved");
		} else if(curObj.graph_type == "boxPlot") {
			initBPlotGraphDataRoll(curObj.curDR.columns,"saved");
		} else if(curObj.graph_type == "Scatter") {
			initScGraphDataRoll(curObj.curDR.columns,"saved");
		}	
		
	}		// if ( curObj.curDR != undefined) {
	$("input:radio[name=objSet]")[0].checked = true;		//Tab : Defualt Set
}
function findTableID(){
	console.log("findTableID start...");
	find=0;
	tableIndex=0;
	console.log("tablesData");
	console.log(tablesData);
	console.log("curObj.curDR.data : " + curObj.curDR.data);
	if ( tablesData == undefined) {
		setTimeout("findTableID()",1000*1);
	} else {
		if (curObj.curDR.data != undefined){
			while(find==0){
				if (tablesData[tableIndex].TableName == curObj.curDR.data) {
					//tableID = tablesData[tableIndex].tableID;
					tableID = tablesData[tableIndex].TableName;
					console.log("tableID in findTableID: " + tableID);
					find=1;
				}
				tableIndex++;
			}
			$("#sltTables").val(tableID.trim());	
		}		//if (tablesData[tableIndex].TableName != undefined){
	}
}
function getGraphOptions(){
	var grp_opt=curObj.grp_opt ? curObj.grp_opt : "";
	var grp_opt=eval("[{"+grp_opt+"}]");
	if (dataGrpOpt1.length == 0) {
		var d = (dataGrpOpt1[dataGrpOpt1.length] = {});
		d["leftMargin"] = "0";
		d["rightMargin"] = "0";
		d["bottomMargin"] = "0";
	}
	if (dataGrpOpt2.length == 0) {
		var d = (dataGrpOpt2[dataGrpOpt2.length] = {});
		d["showValues"] = true;
		d["showXAxis"] = true;
		d["showYAxis"] = true;
		d["stacked"] = true;
	}
	if (dataGrpOpt3.length == 0) {
		var d = (dataGrpOpt3[dataGrpOpt3.length] = {});
		d["staggerLabels"] = true;
		d["tooltips"] = true;
		d["transitionDuration"] = "0";
		d["delay"] = "0";
	}
	//console.log("grp_opt[0].margin : " + grp_opt[0].margin);
	if (grp_opt[0].margin == undefined){
		grp_opt[0].margin={left:0, right:0, bottom:0};
	}
	dataGrpOpt1[0].leftMargin		=grp_opt[0].margin.left ? grp_opt[0].margin.left : "0";
	dataGrpOpt1[0].rightMargin	=grp_opt[0].margin.right ? grp_opt[0].margin.right : "0";
	dataGrpOpt1[0].bottomMargin	=grp_opt[0].margin.bottom ? grp_opt[0].margin.bottom : "0";

	if ( grp_opt[0].showValues == undefined) grp_opt[0].showValues=true;
	if ( grp_opt[0].showXAxis == undefined) grp_opt[0].showXAxis=true;
	if ( grp_opt[0].showYAxis == undefined) grp_opt[0].showYAxis=true;
	if ( grp_opt[0].stacked == undefined) 	grp_opt[0].stacked=true;
	dataGrpOpt2[0].showValues		=grp_opt[0].showValues;			//? grp_opt[0].showValues : true;
	dataGrpOpt2[0].showXAxis		=grp_opt[0].showXAxis	;			//? grp_opt[0].showXAxis : true;
	dataGrpOpt2[0].showYAxis		=grp_opt[0].showYAxis ;			//? grp_opt[0].showYAxis : true;
	dataGrpOpt2[0].stacked			=grp_opt[0].stacked 	;			//? grp_opt[0].stacked : true;

	if ( grp_opt[0].staggerLabels == undefined) grp_opt[0].staggerLabels=true;
	if ( grp_opt[0].tooltips == undefined) 			grp_opt[0].tooltips=true;
	dataGrpOpt3[0].staggerLabels=grp_opt[0].staggerLabels ;	//? grp_opt[0].staggerLabels : true;
	dataGrpOpt3[0].tooltips			=grp_opt[0].tooltips ;			//? grp_opt[0].tooltips : true;
	dataGrpOpt3[0].transitionDuration=grp_opt[0].transitionDuration ? grp_opt[0].transitionDuration : "250";
	dataGrpOpt3[0].delay				=grp_opt[0].delay ? grp_opt[0].delay : "0";

	renderGrpOpt1(dataGrpOpt1);
	renderGrpOpt2(dataGrpOpt2);
	renderGrpOpt3(dataGrpOpt3);
}

function clickPortletHeader(obj){
	//console.log("portlet-header click");
	$(".portlet-header").removeClass('ui-widget-header');
	$(".portlet-header").css("background-color","#efefef");
	$(".portlet-header").css("border","1px solid #4297d7");
	$( obj ).addClass('ui-widget-header');
	curPObj=obj;
	curPName=$(obj).attr("name");
	console.log("curPName : " + curPName);
	console.log(obj);
	getAttr(obj);
	setUpContext();
	$(".slick-viewport").css("overflow","hidden");
}
function delColSection(){
	$(".column:last").remove();
}
function setPreCodeYN(){
	var precode=$("#sltPreCodeYN").val();
	var curDRInfo=curObj["curDR"];
	curDRInfo["precode"]=precode;
	console.log("curDRInfo");
	console.log(curDRInfo);
	
	if (precode == "Y") {
		$(".clsPreCode").show();
	} else {
		$(".clsPreCode").hide();
	}
}
function setPreCode(){
	var pcode=$("#txrPreCode").val();
	var curDRInfo=curObj["curDR"];
	curDRInfo["pcode"]=pcode;
	console.log("setPreCode end...");
}
function setID(){
	var id=$("#txID").val();
	curObj.id=id;
	//console.log(layoutObj);
	//console.log("curPObj : " + $(curPObj).html());
	$(curPObj).html(id + " : " + curObj.type);
	setupPortlet();
	setUpContext();
}
function setSTP(){
	var stp=$("#txSTP").val();
	curObj.stp=stp;
	//console.log(layoutObj);
	//console.log("setSTP curPObj : " + $(curPObj).html());
	var params=getParams(stp);
	console.log("getReqParam : " + params);
	$("#spnSTPReqParam").html(params);
	setupPortlet();
}
function setWidth(){
	var width=$("#txWidth").val();
	curObj.width=width;
	//console.log(layoutObj);
	setupPortlet();
}
function setHeight(){
	var height=$("#txHeight").val();
	curObj.height=height;
	//console.log(layoutObj);
	setupPortlet();
}
function setRefresh(){
	var refresh=$("#txRefresh").val();
	curObj.refresh=refresh;
	//console.log(layoutObj);
	setupPortlet();
}
function setFloat(){
	var float=$("#sltFloat").val();
	curObj.float=float;
	setupPortlet();
}
function setStyle(){
	var style=$("#txrStyle").val();
	curObj.style=style;
	setupPortlet();
}
function setJS(){
	var jsCode=$("#txrJS option:selected").val();
	if (Object.keys(curObj).indexOf(" jsCode") > 0) {
		curObj.push={jsCode:"0"};
	}
	curObj.jsCode=jsCode;
	setupPortlet();
}
function setExecution(){
	var exec=$("#sltExec option:selected").val();
	var oType=$("#sltType option:selected").val();
	if (exec == "STP" ){
		$(".stpInfo").show();
		$("#lbTab3").hide();
	} else if (exec == "STP_ASYNC" ){
		$(".stpInfo").show();
		$("#lbTab3").hide();
	} else {
		$(".stpInfo").hide();
		$("#lbTab3").show();
	}
	if (oType == "Tag") {
		$("#lbTab2").hide();
		$("#lbTab3").hide();
	}
	curObj.exec=exec;
}
function setDataRole(){
	if (curObj["curDR"] == undefined) curObj["curDR"]={};
	var curDRInfo=curObj["curDR"];
	curDRInfo["id"]=curObj.id;
	var libIndex=eval($("#sltLibrary option:selected").index()-1);
	console.log("libIndex : " + libIndex);
	if ( libIndex < 0) return;
	var library = libraryData[libIndex].libref;
	var tableIndex=eval($("#sltTables option:selected").index()-1);
	console.log("tableIndex " + tableIndex);
	console.log("tablesData");
	console.log(tablesData);

	curDRInfo["library"]=library;

	if (tableIndex > -1) {
		var tableName = tablesData[tableIndex].TableName;		
	}
	curDRInfo["data"]=tableName;
	curDRInfo["columns"]=dataSltdCols;
	console.log(curDRInfo);			
	console.log("curObj :");
	console.log(curObj);
}
function setType(){
	$("#dvColumns").html("");
	$("#dvSeledtedX").html("");
	$("#dvSeledtedY").html("");
	$("#dvBarColumns").html("");
	$("#dvBarSeledtedX").html("");
	$("#dvBarSeledtedY").html("");
	$("#dvLineColumns").html("");
	$("#dvLineSeledtedX").html("");
	$("#dvLineSeledtedY").html("");
	$("#dvPieColumns").html("");
	$("#dvPieSeledtedX").html("");
	$("#dvPieSeledtedY").html("");

	$("#dvMLineColumns").html("");
	$("#dvMLineSeledtedX").html("");
	$("#dvMLineSeledtedY").html("");
	$("#dvMLineSeledtedG").html("");
	
	$("#dvBLineColumns").html("");
	$("#dvBLineSeledtedX").html("");
	$("#dvBLineSeledtedY").html("");
	$("#dvBLineSeledtedG").html("");
	
	$("#dvBPlotColumns").html("");
	$("#dvBPlotSeledtedX").html("");
	$("#dvBPlotSeledtedY").html("");
	$("#dvBPlotSeledtedG").html("");
	
	$("#dvScColumns").html("");
	$("#dvScSeledtedX").html("");
	$("#dvScSeledtedY").html("");
	$("#dvScSeledtedG").html("");
	$("#dvSltdCols").html("");
	$("#dvGTSltdCols").html("");
	
	$("#lbTab2").show();


	$("#sltTables option:eq(0)").attr("selected", "selected");
	var type=$("#sltType option:selected").val();
	console.log("type : " + type);
	if (type=="Tag") {
		$("#lbTab2").hide();
	}

	$(".clsUD").hide();
	console.log("type : " + type);
			 if (type=="Grid") $("#udGrid").show();
	else if (type=="GridTree") $("#udGrid").show();			//$("#udGridTree").show();
	else if (type=="dBarChart") $("#udDbar").show();
	else if (type=="LineChart") $("#udLine").show();
	else if (type=="mLineChart") $("#udMLine").show();
	else if (type=="barLineChart") $("#udBarLine").show();
	else if (type=="boxPlot") $("#udBoxPlot").show();
	else if (type=="Pie") $("#udPie").show();
	else if (type=="BarChart") $("#udBar").show();
	else if (type=="Scatter") $("#udScatter").show();

	if (type == "dBarChart" 		|| 
			type == "BarChart"			|| 
			type == "LineChart" 		|| 
			type == "mLineChart" 		|| 
			type == "barLineChart" 	|| 
			type == "boxPlot" 			|| 
			type == "Pie"						|| 
			type=="Scatter" ) {
		$("#sltGraphType").val(type);
		type="Graph";
	}
	if ( type=="Grid" ) {
		$(".trSTP").show();
		$(".trGrid").show();
		$(".trGraph").hide();
		$(".trTag").hide();  
	} else if ( type=="Graph" ){
		$(".trSTP").show();
		$(".trGrid").hide();
		$(".trGraph").show();
		$(".trTag").hide();
	} else if ( type=="Tag" ){
		$(".trSTP").hide();
		$(".trGrid").hide();
		$(".trGraph").hide();
		$(".trTag").show();
	} else {
		$(".trSTP").show();
		$(".trGrid").hide();
		$(".trGraph").hide();
		$(".trTag").hide();
	}
	curObj.type=type;
	setGraphType();
	$(curPObj).html(curObj.id + " : " + type);
	setupPortlet();
	setExecution();
}
function setTag(){
	var tag=$("#txrTag").val();
	curObj.tag=tag;
	setupPortlet();
}
function setGraphType(){
	var graph_type=$("#sltGraphType option:selected").val();
	//console.log("graph_type : " + graph_type);
	//console.log("curObj.grp_stmt : " + curObj.grp_stmt);
	if (graph_type == "LineChart" && curObj.grp_stmt.length < 10){
		graphStmt="//chart.xAxis.tickFormat(function(d) { return d3.time.format('%Y/%m/%d')(new Date(d)); });"+"\u000D";
		graphStmt+="//chart.yAxis.tickFormat(d3.format(',.2f')); // ex: 32.03 "+"\u000D";
		graphStmt+="//chart.yAxis.tickFormat(d3.format(',r'));   // Rounded"+"\u000D";
		graphStmt+="//var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] ";
		graphStmt+="//chart.xAxis.tickValues([0, 1, 2, 3, 4, 5, 6]).tickFormat(function(d){return days[d]});		";
		graphStmt+="//Ref: https://github.com/mbostock/d3/wiki/Formatting"+"\u000D";
		graphStmt+="//Ref: http://koaning.s3-website-us-west-2.amazonaws.com/html/d3format.html";


		$("#txrGraphStmt").val(graphStmt);
	} else if (graph_type == "LineChart" && curObj.grp_stmt != "") {
		$("#txrGraphStmt").val(curObj.grp_stmt);
	} else {
		/* 2015-10-27 오후 2:38:26
		$("#txrGraphStmt").val("");
		curObj.grp_stmt="";
		*/
		$("#txrGraphStmt").val(curObj.grp_stmt ? curObj.grp_stmt : "");

	}
	curObj.graph_type=graph_type;
	setupPortlet();
}
function setGraphOptions(){
	leftMargin=dataGrpOpt1[0].leftMargin;
	rightMargin=dataGrpOpt1[0].rightMargin;
	bottomMargin=dataGrpOpt1[0].bottomMargin;
	
	showValues=dataGrpOpt2[0].showValues;
	showXAxis=dataGrpOpt2[0].showXAxis;
	showYAxis=dataGrpOpt2[0].showYAxis;
	stacked=dataGrpOpt2[0].stacked;
	
	staggerLabels=dataGrpOpt3[0].staggerLabels;
	tooltips=dataGrpOpt3[0].tooltips;
	transitionDuration=dataGrpOpt3[0].transitionDuration;
	delay=dataGrpOpt3[0].delay;
	
	grp_opt="margin:{left:"+leftMargin+",right:"+rightMargin+",bottom:"+bottomMargin+"},";
	grp_opt+="showValues:"+showValues+",";
	grp_opt+="showXAxis:"+showXAxis+",";
	grp_opt+="showYAxis:"+showYAxis+",";
	grp_opt+="stacked:"+stacked+",";
	grp_opt+="staggerLabels:"+staggerLabels+",";
	grp_opt+="tooltips:"+tooltips+",";
	grp_opt+="transitionDuration:"+transitionDuration+",";
	grp_opt+="delay:"+delay;
	
	var grp_opt_add=$("#txrGraphOptions").val();
	if (grp_opt_add != "") grp_opt+=","+grp_opt_add;
	curObj.grp_opt=grp_opt;
	setupPortlet();
	//console.log("grp_opt : " + grp_opt);
	////console.log(JSON.stringify(grpOpt1columns));
}
function setGraphStmt(){
	var grp_stmt=$("#txrGraphStmt").val();
	curObj.grp_stmt=grp_stmt;
	setupPortlet();
}
function setXSlider(){
	var x_slider=$("#sltXSlider").val();
	curObj.x_slider=x_slider;
	setupPortlet();
}
function setPHeight(){
	var pie_height=$("#txPHeight").val();
	curObj.pie_height=pie_height;
	setupPortlet();
}
function setPWidth(){
	var pie_width=$("#txPWidth").val();
	curObj.pie_width=pie_width;
	setupPortlet();
}
function setSort(){
	var sort=$("#sltSort option:selected").val();
	curObj.sort=sort;
	setupPortlet();
}
function setEditable(){
	var editable=$("#sltEditable option:selected").val();
	if (Object.keys(curObj).indexOf(" editable") > 0) {
		curObj.push={editable:"0"};
	}
	curObj.editable=editable;
	var curDRInfo=curObj["curDR"];
	curDRInfo["editable"]=editable;	
	setupPortlet();
}
function setAutoEdit(){
	var autoedit=$("#sltAutoEdit option:selected").val();
	if (Object.keys(curObj).indexOf(" autoedit") > 0) {
		curObj.push={autoedit:"0"};
	}
	curObj.autoedit=autoedit;
	var curDRInfo=curObj["curDR"];
	curDRInfo["autoedit"]=autoedit;
	setupPortlet();
}
function setAddRow(){
	var addRow=$("#sltAddRow option:selected").val();
	if (Object.keys(curObj).indexOf(" addRow") > 0) {
		curObj.push={addRow:"0"};
	}
	curObj.addRow=addRow;
	var curDRInfo=curObj["curDR"];
	curDRInfo["addRow"]=addRow;
	setupPortlet();
}
function setFitColumns(){
	var fitColumns=$("#sltFitColumns option:selected").val();
	if (Object.keys(curObj).indexOf(" fitColumns") > 0) {
		curObj.push={fitColumns:"0"};
	}
	curObj.fitColumns=fitColumns;
	var curDRInfo=curObj["curDR"];
	curDRInfo["fitColumns"]=fitColumns;
	setupPortlet();
}
function setCL_STP(){
	/*
	var cl_stp=$("#txCL_STP").val();
	curObj.cl_stp=cl_stp;
	setupPortlet();
	*/
}
function setCL_FN(){
	var cl_fn=$("#txCL_FN").val();
	curObj.cl_fn=cl_fn;
	setupPortlet();
}
function setCL_Param(){
	var cl_param=$("#txCL_Param").val();
	curObj.cl_param=cl_param;
	setupPortlet();
}
function setDBL_STP(){
	var dbl_stp=$("#txDBL_STP").val();
	curObj.dbl_stp=dbl_stp;
	setupPortlet();
}
function setDBL_FN(){
	var dbl_fn=$("#txDBL_FN").val();
	curObj.dbl_fn=dbl_fn;
	setupPortlet();
}
function setDBL_Param(){
	var dbl_param=$("#txDBL_Param").val();
	curObj.dbl_param=dbl_param;
	setupPortlet();
}
function setupPortlet(){
	$curObj=$("div[name='" + curPName + "']").parent().find(".portlet-content");
	$curObj.html("<li> Width : " + curObj.width + " px<li> Height : " + curObj.height+ " px");
	//console.log("curObj.html : " + $curObj.html());
}
function deleteLayout(){
	var fn='alertResMsg';
	var param={
	}
	$.ajax({
		url: "/SASHBI/HBIServlet?sas_forwardLocation=deleteLayout",
		type: "post",
		data: param,
		dataType: 'text',
		async: true,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show();
		},
		success : function(data){
			//console.log("layout Delete success \n" );
			window[fn](data);
		},
		complete: function(data){
			//data.responseText;
			//console.log(data);
			isRun=0;
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			//console.log("ERROR: Status:" + status + ": xhr: " +  xhr + "error: " + error);
			alert(error);
		}
	});	
}
function saveLayout(){
	var layoutRes={};
	var savedDRInfo={};
	var colNum=$(".column").length;
	for (var ii=0;ii<colNum ; ii++){
		var poNum=$(".column:eq("+ii+") > .portlet").length;
		layoutRes["R"+ii]={};
		curRowSection=layoutRes["R"+ii];
		savedDRInfo["R"+ii]={};
		curRowObj=savedDRInfo["R"+ii];
		for(var jj=0; jj<poNum; jj++){
			var cPortletName=$(".column:eq("+ii+") > .portlet:eq("+jj+") > .portlet-header").attr("name");
			curRowSection["C"+jj]={"id":"","stp":"","width":"","height":"","float":"","refresh":"","style":"","jsCode":"","exec":"","type":"","tag":"","sort":"","graph_type":"BarChart","grp_opt":"","grp_stmt":"","x_slider":"","pie_height":"","pie_width":"","cl_stp":"","cl_fn":"","cl_param":"","dbl_stp":"","dbl_fn":"","dbl_param":""};
			var curCell=curRowSection["C"+jj];
			curRowObj["C"+jj]={};
			var curRCObj=curRowObj["C"+jj];
			curRCObj["drInfo"] = layoutObj[cPortletName].curDR;

			curCell.id			=layoutObj[cPortletName].id;
			curCell.stp			=layoutObj[cPortletName].stp;
			curCell.width		=layoutObj[cPortletName].width;
			curCell.height	=layoutObj[cPortletName].height;
			if (curCell.width != "" )		curCell.width	=layoutObj[cPortletName].width.replace(/px/g,""); 
			if (curCell.height != "" ) curCell.height	=layoutObj[cPortletName].height.replace(/px/g,""); 
			curCell.float		=layoutObj[cPortletName].float?layoutObj[cPortletName].float:"";
			curCell.refresh		=layoutObj[cPortletName].refresh?layoutObj[cPortletName].refresh:"";
			curCell.style		=layoutObj[cPortletName].style;
			console.log("jsCode : " + layoutObj[cPortletName].jsCode);
			curCell.jsCode			=layoutObj[cPortletName].jsCode?layoutObj[cPortletName].jsCode:"";
			curCell.exec			=layoutObj[cPortletName].exec?layoutObj[cPortletName].exec:"";
			console.log("exec : " + curCell.exec);
			curCell.type		=layoutObj[cPortletName].type;
			curCell.tag			=layoutObj[cPortletName].tag?layoutObj[cPortletName].tag:"";
			curCell.graph_type	=layoutObj[cPortletName].graph_type;
			curCell.grp_opt		=layoutObj[cPortletName].grp_opt?layoutObj[cPortletName].grp_opt:"";
			curCell.grp_stmt	=layoutObj[cPortletName].grp_stmt?layoutObj[cPortletName].grp_stmt:"";
			curCell.x_slider	=layoutObj[cPortletName].x_slider?layoutObj[cPortletName].x_slider:"";
			curCell.pie_width	=layoutObj[cPortletName].width;		//layoutObj[cPortletName].pie_width?layoutObj[cPortletName].pie_width:"";
			curCell.pie_height=layoutObj[cPortletName].height;	//layoutObj[cPortletName].pie_height?layoutObj[cPortletName].pie_height:"";
			curCell.sort		=layoutObj[cPortletName].sort;
			curCell.editable=layoutObj[cPortletName].editable;
			curCell.autoedit=layoutObj[cPortletName].autoedit;
			curCell.addRow=layoutObj[cPortletName].addRow;
			curCell.fitColumns=layoutObj[cPortletName].fitColumns;
			curCell.cl_stp		=layoutObj[cPortletName].cl_stp;
			curCell.cl_fn		=layoutObj[cPortletName].cl_fn;
			curCell.cl_param	=layoutObj[cPortletName].cl_param;
			curCell.dbl_stp		=layoutObj[cPortletName].dbl_stp;
			curCell.dbl_fn		=layoutObj[cPortletName].dbl_fn;
			curCell.dbl_param	=layoutObj[cPortletName].dbl_param;
			//curCell.precode	=layoutObj[cPortletName].precode;
			//curCell.pcode		=layoutObj[cPortletName].pcode;
		}
	}
	
	console.log("Saved JSON layoutRes :\n" + JSON.stringify(layoutRes));
	console.log(layoutRes);
	console.log("Saved JSON savedDRInfo :\n" + JSON.stringify(savedDRInfo));
	console.log(savedDRInfo);

	isDisplayProgress=0;
	var layout=JSON.stringify(layoutRes);
	var fn='alertResMsg';
	var param={
			layout	: layout
	}
	$.ajax({
		url: "/SASHBI/HBIServlet?sas_forwardLocation=saveLayout",
		type: "post",
		data: param,
		dataType: 'text',
		async: true,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show();
		},
		success : function(data){
			window[fn](data);
		},
		complete: function(data){
			isRun=0;
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			alert(error);
		}
	});
	var layout2=JSON.stringify(savedDRInfo);
	var fn2='consoleLog';
	var param2={
			saveDataRole	: layout2
	}
	$.ajax({
		url: "/SASHBI/HBIServlet?sas_forwardLocation=saveDataRole",
		type: "post",
		data: param2,
		dataType: 'text',
		async: true,
		beforeSend: function() {
			isRun=1;
			if (isDisplayProgress==1) $("#progressIndicatorWIP").show();
		},
		success : function(data){
			window[fn2](data);
		},
		complete: function(data){
			isRun=0;
			$("#progressIndicatorWIP").hide();
		},
		error : function(xhr, status, error) {
			alert(error);
		}
	});
	setUpContext();
}
function alertResMsg(data){
	isDisplayProgress=1;
	//var msg=eval(data);
	//console.log("alertResMsg");
	//console.log(data);
	var res=data.replace(/\r\n/g, "");
	//console.log("res: " + res);
	alertMsg(res);
}
function consoleLog(data){
	var res=data.replace(/\r\n/g, "");
	console.log("res: " + res);
}
var curSTPName;
function findSTP(objName){
	$("#dvModalID").show();
	curSTPName=objName;
}
function setSTPURI(){
	$("#"+curSTPName).val(decodeURI($("#txtSTP_URI").val().substring(17)).replace(/\+/g, " "));
	$("#txtSTP_URI").val("");
	$("#dvModalID").hide();
	fn="set"+curSTPName.substring(2);
	//console.log("fn: " + fn);
	window[fn]();
	
}
function setUpContext(){
	var layoutRes={};
	var colNum=$(".column").length;
	var ctxMenuStr="";
	for (var ii=0;ii<colNum ; ii++){
		var poNum=$(".column:eq("+ii+") > .portlet").length;
		layoutRes["R"+ii]={};
		curRowSection=layoutRes["R"+ii];
		for(var jj=0; jj<poNum; jj++){
			var cPortletName=$(".column:eq("+ii+") > .portlet:eq("+jj+") > .portlet-header").attr("name");
			var objName=layoutObj[cPortletName].id;
			var objExec=layoutObj[cPortletName].exec;
			var objSTP=layoutObj[cPortletName].stp;
			var objType=layoutObj[cPortletName].type;
			var objGType=layoutObj[cPortletName].graph_type;
			if (objExec == undefined) objExec="";
			if (objSTP == undefined) objSTP="";
			if (objType == undefined) obGType="";
			if (objGType == undefined) objGType="";
			console.log("cPortletName: " + cPortletName);
			console.log("objExec : " + objExec);
			console.log("objSTP : " + objSTP);
			console.log("objGype : " + objType);
			console.log("objGType : " + objGType);
			if (objType!="Graph") objGType=objType;
			
			var curDRInfo=curObj["curDR"];
			if (curDRInfo == undefined){
				curDRInfo={}
			}
			var type=curObj["type"];
			var graph_type=curObj["graph_type"];
			if (type=="Graph") {objType=graph_type;}
			else {objType=type;}
				
			var grp_x=curDRInfo["grp_x"];
			if (grp_x != undefined || grp_x == ""){
				grp_x=grp_x.trim().replace(" ",",");
			}
			
			var params="";
			if (objType=="Grid"){
				params="";
			} else if (objType=="Grid") {
				params="";
			} else if (objType=="GridTree") {
				params="";
			} else if (objType=="dBarChart") {
				params=grp_x;
			} else if (objType=="BarChart") {
				params=grp_x;
			} else if (objType=="LineChart") {
				params=grp_x;
			} else if (objType=="Pie") {
				params=grp_x;
			} else if (objType=="mLineChart") {
				var grp_y=curDRInfo["grp_y"];
				params=grp_x+","+grp_y.trim();
			} else if (objType=="barLineChart") {
				var grp_y=curDRInfo["grp_y"];
				if (grp_y == undefined) grp_y="";
				params=grp_x+","+grp_y.trim();
			} else if (objType=="boxPlot") {
				var grp_y=curDRInfo["grp_y"];
				params=grp_x+","+grp_y.trim();
			} else if (objType=="Scatter") {
				var grp_y=curDRInfo["grp_y"];
				params=grp_x+","+grp_y.trim();
			}
			
			
			//curRowObj=savedDRInfo["R"+ii];
			//var curDRInfo = layoutObj[cPortletName].curDR;
			//var grpX = curDRInfo.grp_x;
			//오브젝트 별로 전달해야하는 파마미터가 상이함.... 어쩌지???
			ctxMenuStr+="<li data='render" + objName + "' execType='" + objExec + "' execSTP='"+objSTP+"' gType='"+objGType+"' params='"+params+"'>" + objName +"</li>";
		}
	}
	$("#contextClick").html(ctxMenuStr);
	$("#contextDblClick").html(ctxMenuStr);
	console.log("layoutObj : ");
	console.log(layoutObj);
}
function nz(number,znum){
	var zn=Array(znum+1).join("0");
	var zn2=eval(zn.length);
	var z = (zn + number).slice(-zn2);	
	return z;
}
