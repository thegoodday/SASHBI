%MACRO JSON4LINE(DATA=,LINE_VAR=);
	PROC SORT DATA=&DATA OUT=WORK.GRP_NUM NODUPKEY; BY &LINE_VAR ; 
	RUN;
	
	%let ii=0;
	%let dsid=%sysfunc(open(WORK.GRP_NUM));
	%if &dsid %then %do;
		%do %while(%sysfunc(fetch(&dsid)) eq 0);
			%let ii=%eval(&ii+1);
			%let GRP_ID = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,&LINE_VAR))));
			DATA WORK.PLOT_&II.; 
				SET WORK.PLOT(WHERE=(&LINE_VAR ="&GRP_ID") );
				KEEP X Y; 
			RUN;
		%end;
		%let rc=%sysfunc(close(&dsid));
	%end;	

	PROC JSON OUT=_webout; 
		WRITE OPEN ARRAY;
			%let ii=0;
			%let dsid=%sysfunc(open(WORK.GRP_NUM));
			%if &dsid %then %do;
				%do %while(%sysfunc(fetch(&dsid)) eq 0);
					%let ii=%eval(&ii+1);
					%let GRP_ID = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,&LINE_VAR ))));
	
			WRITE OPEN OBJECT; 
				WRITE VALUES key "&GRP_ID";
				WRITE VALUES "values";
				WRITE OPEN ARRAY;
					EXPORT WORK.PLOT_&II / NOKEYS NOSASTAGS ;
				WRITE CLOSE;
			WRITE CLOSE;
				
				%end;
				%let rc=%sysfunc(close(&dsid));
			%end;	
		WRITE CLOSE;
	RUN;
%MEND;