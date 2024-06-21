%inc "/sas/sasv94/config/Lev1/Applications/SASHBI/Macro/hbi_init.sas";

data work.prdsale;
	length chkbox $1 OBS 8 COUNTRY REGION DIVISION PRODTYPE PRODUCT $20 YEAR QUARTER MONTH ACTUAL PREDICT 8;
	set 
		HBIDEMO.PRDSALE(obs=1000)
	;
	chkbox=0;
	OBS=_n_;
run; 

%json4Slick(
	tableName=work.prdsale,
	columns	=%str(CHKBOX OBS COUNTRY REGION DIVISION PRODTYPE PRODUCT YEAR QUARTER MONTH ACTUAL PREDICT),
	width	=%str(90 90 90 90 90 90 90 90 90 90 120 120), 
	css		=%str(c c c l l l l l l l r r),
	sort	=%str(1 1 1 1 1 1 1 1 1 1 1 1),
	resize	=%str(1 1 1 1 1 1 1 1 1 1 0 0),
	enableCellNavigation=true, 
	enableColumnReorder=false, 
	multiColumnSort=true,
	chkbox=true
);
