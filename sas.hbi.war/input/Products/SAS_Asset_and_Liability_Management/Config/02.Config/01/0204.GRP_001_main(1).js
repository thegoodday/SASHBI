	curGRPSetListID=$("#sltgrp_set_id option:selected").val();
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_getGroupSet(StoredProcess)","initGridGRPSetOnDblClick",curGRPSetListID);			
	console.log("main $sasResHTML: " + $sasResHTML);
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/02.Config/01/grp001_getSegList(StoredProcess)","initGridSegList",$sasResHTML.trim());
