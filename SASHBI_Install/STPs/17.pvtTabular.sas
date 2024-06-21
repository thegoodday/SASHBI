%inc "/sas/sasv94/config/Lev1/Applications/SASHBI/Macro/hbi_init.sas";

data work.prdsale;
	length OBS 8 COUNTRY REGION DIVISION PRODTYPE PRODUCT $20 YEAR QUARTER MONTH ACTUAL PREDICT 8;
	set HBIDEMO.PRDSALE	(where=(product="&product"));
	OBS=_n_;
	FORMAT ACTUAL PREDICT 8.;
run;

%json4PVT(
	tableName=work.prdsale,
	class=%str(COUNTRY REGION DIVISION PRODTYPE PRODUCT YEAR QUARTER), 
	var=%str(ACTUAL PREDICT), 
	rows=%str(COUNTRY REGION DIVISION), 
	cols=%str(YEAR QUARTER)
);
