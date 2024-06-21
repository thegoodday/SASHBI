data work.prdsale;
    set sashelp.prdsale(obs=1000);
    array tmp{20} var1 - var20;
    do ii=1 to dim(tmp);
        tmp{ii} = int(ranuni(0) * 1000000);
    end;
    format var1 - var10 comma20.;
run;
data work.prdsale2;
	length OBS 8 COUNTRY REGION DIVISION PRODTYPE PRODUCT $20 YEAR QUARTER MONTH ACTUAL PREDICT 8;
	set 
		work.PRDSALE(obs=1000)
		work.PRDSALE(obs=1000)
		work.PRDSALE(obs=1000)
		work.PRDSALE(obs=1000)
		work.PRDSALE(obs=1000)
		work.PRDSALE(obs=1000)
	;
	OBS=_n_;
	Label OBS = 'OBS';
    format _numeric_ comma20.;
    format year 8. month  monname3.;
    drop ii;
run; 

%json4Slick(
	tableName=work.prdsale2,
	multiColumnSort=false
);
