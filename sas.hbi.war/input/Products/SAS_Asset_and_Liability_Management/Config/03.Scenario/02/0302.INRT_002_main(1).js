	curINRT_CRV_ID=$("#sltINRT_CRV_ID option:selected").val();

	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/03.Scenario/02/inrt002_getCurveNameContext(StoredProcess)","initContextMenu",curINRT_CRV_ID);				

	renderGR2($sasResHTML);