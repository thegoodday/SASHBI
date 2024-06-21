	tParams=eval('[{}]');

	var LIBRARY=$("#sltLIBRARY option:selected").val();
	var DATA_NAME=$("#sltDATA_NAME option:selected").val();
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/06.Tree Rollup/01/fmt001_getDftFmtList(StoredProcess)","renderdvDftFmtList",LIBRARY,DATA_NAME);			
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/06.Tree Rollup/01/fmt001_getUserFmtList(StoredProcess)","renderdvUserFmtList",LIBRARY,DATA_NAME);					
		tParams['LIBRARY']=LIBRARY;
		tParams['DATA_NAME']=DATA_NAME;
		tParams['COL_TYPE']='N';
	console.debug("tParams in SubmitSTP");
	console.debug(tParams);
	getParamVal("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)","ALMConf.COL_INFO_LST","COL_NAME","COL_NAME2","libname+ALMConf+list%3B","LIBNAME=LIBRARY:DATA_NAME=DATA_NAME:COL_TYPE=COL_TYPE:","","COL_DESC","","false","","true");
	setTimeout("addAllToColName2();",3*1000);
	/*
	execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getColumnsLayout(StoredProcess)",true,"renderdvDftFmtList","json",LIBRARY,DATA_NAME);
	execAjax("","SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/01.Common/getColumnsUser(StoredProcess)",true,"renderdvUserFmtList","json",LIBRARY,DATA_NAME);
	*/
