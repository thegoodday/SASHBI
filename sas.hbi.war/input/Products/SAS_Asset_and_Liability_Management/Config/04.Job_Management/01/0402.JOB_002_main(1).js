	curJOB_ID=$("#sltJob_ID option:selected").val();
	console.log("main curJOB_ID : " + curJOB_ID);
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs//getJobInfoGR2(StoredProcess)","renderGR2");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs//getJobInfoGR3(StoredProcess)","renderGR3");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs//getJobInfoGR4(StoredProcess)","renderGR4");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs//getJobInfoGR5(StoredProcess)","renderGR5");				
	execSTPA("SBIP://METASERVER/Products/SAS Asset and Liability Management/STPs//getJobInfoGR6(StoredProcess)","renderGR6");				
