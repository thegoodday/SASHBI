options validvarname=any;


data work.linechart;
	length date2 $10;
	set sashelp.air;
	*date2 = date * 24 * 60 * 60;
	date2 = put(date,yymmdd10.);
	AIR2 = int(air * ranuni(0));
	*format date2 datetime.;
	drop date;
run;

proc json out=_webout pretty;  
   	export work.linechart(obs=100) / fmtchar fmtdt  nosastags ;
run;
