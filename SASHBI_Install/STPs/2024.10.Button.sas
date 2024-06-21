data work.prdsale;
    set sashelp.prdsale(obs=100);
run;
data work.prdsale2;
	length _check_yn OBS 8 COUNTRY REGION DIVISION PRODTYPE PRODUCT $20 YEAR QUARTER MONTH ACTUAL PREDICT 8;
	set 
		work.PRDSALE(obs=100)
	;
	_check_yn=1;
	OBS=_n_;
	Label OBS = 'OBS';
    format _numeric_ comma20.;
    format year 8. month  monname3.;
    format OBS 8.;
    drop ii;
run; 

%json4Slick(
	tableName=work.prdsale2,
	columns	=%str(_check_yn OBS COUNTRY REGION DIVISION PRODTYPE PRODUCT YEAR QUARTER MONTH ACTUAL PREDICT),
	width	=%str(90 90 90 90 90 90 90 90 90 90 120 120), 
	css		=%str(c c c l l l l l l l r r),
	sort	=%str(1 1 1 1 1 1 1 1 1 1 1 1),
	resize	=%str(1 1 1 1 1 1 1 1 1 1 0 0),
    editor = %str(
                &etxt &etxt &etxt &etxt &etxt 
                &etxt &etxt &etxt &etxt &etxt 
                &etxt &etxt &etxt &etxt &etxt 
    ),
	multiColumnSort=false,
	chkBox=true,
    editable=true,
    enableAddRow=true,
    enableCellNavigation=true,
    autoEdit=false,
    frozenColumn=2
);
