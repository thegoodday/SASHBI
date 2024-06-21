

filename newfile '/tmp/conString.txt' encoding=utf8;
data _null_;
	length data $1;
	infile &_webin_fileref recfm=n;
	file newfile recfm=n;
	input data $char1. @@;
	put data $char1. @@;
run;


libname injson json  fileref=newfile;
proc datasets lib=injson;
quit;
data work.res;
	set injson.root;
run;


proc json out=_webout;
	export sashelp.Prdsal2  / nosastags;
run;
