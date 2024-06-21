options validvarname=any;

data work.scatter;
	set sashelp.iris;
run;

proc json out=_webout pretty;  
   	export work.scatter / fmtchar fmtdt  nosastags ;
run;
