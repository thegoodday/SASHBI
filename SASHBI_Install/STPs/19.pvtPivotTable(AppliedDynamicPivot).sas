libname stprv 'C:\STPRVDemo';
%inc "/sas/sasv94/config/Lev1/Applications/SASHBI/Macro/hbi_init.sas";

%macro getParam(param);
	%global &param._vals ;
	%if %symexist(&param.0) %then %do;
		%let &param._vals=;
		%do ii=1 %to &&&param.0 ;
			%let &param._vals=&&&param._vals &&&param.&ii ;
		%end;
	%end;
	%else %do;
			%put &param. ;
	%end;
	%put &param._vals ;
%mend getParam;
%getParam(VARS);
%getParam(ANAL_VAR);
options source source2 mprint;
%inc "c:\STPRVDemo\json4PVT.sas";
%json4PVT(
	tableName=stprv.&TABLE_NAME,
	class=%str(&VARS_vals), 
	var=%str(&anal_var_vals), 
	rows=%str(&vars2), 
	cols=%str(&vars1)
);
