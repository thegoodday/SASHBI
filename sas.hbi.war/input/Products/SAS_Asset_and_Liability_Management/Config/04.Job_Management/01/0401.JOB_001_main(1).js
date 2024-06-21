	curJOB_ID=$("#sltJOB_ID option:selected").val();
	console.log("main curJOB_ID : " + curJOB_ID);
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/04.Job Management/01/job001_getBJobInfoGR2(StoredProcess)","renderGR2");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/04.Job Management/01/job001_getBJobInfoGR3(StoredProcess)","renderGR3");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/04.Job Management/01/job001_getBJobInfoGR4(StoredProcess)","renderGR4");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/04.Job Management/01/job001_getBJobInfoGR5(StoredProcess)","renderGR5");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs/04.Job Management/01/job001_getBJobInfoGR6(StoredProcess)","renderGR6");				
