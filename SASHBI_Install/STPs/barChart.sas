options validvarname=any;

proc sql;
	create table work.barchart as
	select product, 
		sum(actual) as actual format=comma10. ,
		sum(predict) as predict format=comma10. 
	from sashelp.prdsale
	group by 1;
quit;

proc json out=_webout pretty;  
   	export work.barchart / fmtchar fmtdt  nosastags ;
run;
