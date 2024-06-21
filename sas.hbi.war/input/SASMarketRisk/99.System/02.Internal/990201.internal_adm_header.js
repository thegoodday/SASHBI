$(document).ready(function () {
	$("#dvToolBar").append("<input type=button value=Delete id=btnDelete class=condBtn onclick='fnDeleteRowConfirm();'>");
	$("#dvToolBar").append("<input type=button value=Save id=btnSave class=condBtn onclick='fnSaveOrg();'>");
	$("#dvToolBar").show();
});
$(window).resize(function() {
	$("#sasGrid").height(eval($(window).height()-$("#dvCondi").height()-75));
	$("#sasGrid").width(eval($(window).width()-30));
	//$(".slick-viewport").height(eval($("#sasGrid").height()-5));
	if (sgGrid!=undefined) {
		sgGrid.resizeCanvas();
	}
	console.log("resize function.....")
});
function fnSaveOrg(){
	if (!sgGrid.getEditorLock().commitCurrentEdit()) {
		return;
	}
	tParams=eval('[{}]');
	//var data=sgGrid.getData();
	var data=sgGrid.getData();
	console.log('data');
	console.log(data);
	var gridData=JSON.stringify(data);
	console.log(gridData);
	tParams['gridData']=gridData;
	tParams['_library']="mr_temp";
	tParams['_tablename']="column_info";
	tParams['_program']="SBIP://METASERVER/SASMarketRisk/00.Environments/StoredProcess/990201_save_data(StoredProcess)";
	console.log("gridData : ");
	console.log(gridData);
	console.log(tParams);
	execAjax("saveGrid2SASData","",true,"fnSavedOrgData","json");
}
function fnSavedOrgData(data){
	//alertMsg(data.MSG);
   if (data.MSG == "Successfully saved...") {
   	alertMsg("성공적으로 저장되었습니다.");
   }
	save_path=data._savepath;
	console.log("save_path : " + save_path);
}
function fnDeleteRowConfirm(){
  if ( sgGrid.getActiveCell() == null) {
		alertMsg("Select the Group Set ID.");
		return;
  }
  var isDelete = confirmMsg("Are you sure you want to delete?","fnDeleteRow");
}
function fnDeleteRow(){
  var sgData = sgGrid.getData();
  var current_row = sgGrid.getActiveCell().row;
  console.log("current_row : " + current_row);
  sgData.splice(current_row,1);
  var r = current_row;
  while (r<sgData.length){
    sgGrid.invalidateRow(r);
    r++;
  }
  sgGrid.updateRowCount();
  sgGrid.render();
  sgGrid.scrollRowIntoView(current_row-1);
}