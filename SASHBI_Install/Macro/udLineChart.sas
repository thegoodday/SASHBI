filename _temp "%trim(&path)\_&uid.json";

DATA WORK.TARGET_&UID;
	SET _LAST_;
	GRP_ID="X-Axis";
	X= &_grpX *24*60*60*1000 - (365*10*24*60*60*1000) - (3*24*60*60*1000);
	Y= &_grpY;
	KEEP GRP_ID X Y;
RUN;
%MACRO JSON4LINE(DATA=,LINE_VAR=);
	PROC SORT DATA=_LAST_ OUT=WORK.GRP_NUM NODUPKEY; BY GRP_ID ; 
	RUN;	
	%let ii=0;
	%let dsid=%sysfunc(open(WORK.GRP_NUM));
	%if &dsid %then %do;
		%do %while(%sysfunc(fetch(&dsid)) eq 0);
			%let ii=%eval(&ii+1);
			%let GRP_ID = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,GRP_ID))));
			DATA WORK.PLOT_&UID.&II.; 
				SET WORK.TARGET_&UID(WHERE=(GRP_ID ="&GRP_ID") );
				KEEP X Y; 
			RUN;
		%end;
		%let rc=%sysfunc(close(&dsid));
	%end;	
	PROC JSON OUT=_temp pretty; 
		WRITE OPEN ARRAY;
			%let ii=0;
			%let dsid=%sysfunc(open(WORK.GRP_NUM));
			%if &dsid %then %do;
				%do %while(%sysfunc(fetch(&dsid)) eq 0);
					%let ii=%eval(&ii+1);
					%let GRP_ID = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,GRP_ID ))));
			WRITE OPEN OBJECT; 
				WRITE VALUES key "&GRP_ID";
				WRITE VALUES "values";
				WRITE OPEN ARRAY;
					EXPORT WORK.PLOT_&UID.&II. / NOKEYS NOSASTAGS ;
				WRITE CLOSE;
			WRITE CLOSE;			
				%end;
				%let rc=%sysfunc(close(&dsid));
			%end;	
		WRITE CLOSE;
	RUN;
%MEND;
%JSON4LINE;
data _null_;
		infile _temp length=len encoding="utf-8" ;*lrecl=32767;
		file webout;
		input json $varying200. len;
		put json;
run;			
                       








data _null_;
		infile _temp length=len encoding="utf-8";
		file webout;
		input json $varying200. len;
		put json;
run;			
