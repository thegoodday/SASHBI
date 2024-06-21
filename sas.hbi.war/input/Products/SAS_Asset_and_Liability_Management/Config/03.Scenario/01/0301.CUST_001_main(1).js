	curCUST_BEHAVIOR=$("#sltCUST_BEHAVIOR option:selected").val();
	//alertMsg(curCUST_BEHAVIOR);
	curModel_ID=$("#sltCUST_BHVR_ID option:selected").val();
	curGRP_SET_ID=$sasResHTML.trim();
	console.log("curModel_ID:GRP_SET_ID  " + curModel_ID + ":" + curGRP_SET_ID);
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/01/cust001_getGroupList(StoredProcess)","renderCustGR2",curGRP_SET_ID);			
