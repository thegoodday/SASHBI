%MACRO JSON4SCATTER(DATA=,CLASS_INFO=,CLASS_VAR_NAME=,CLASS_VAR_LABEL=);
	PROC JSON OUT=_webout ;*PRETY; 
		WRITE OPEN ARRAY;
			%let ii=0;
			%let dsid=%sysfunc(open(&CLASS_INFO ));
			%if &dsid %then %do;
				%do %while(%sysfunc(fetch(&dsid)) eq 0);
					%let CLS_NAME 	= %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,&CLASS_VAR_NAME.))));
					%let CLS_LABEL 	= %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,&CLASS_VAR_LABEL.))));
	
			WRITE OPEN OBJECT; 
				WRITE VALUES key "&CLS_LABEL";
				WRITE VALUES "values";
				WRITE OPEN ARRAY;
					EXPORT &DATA (WHERE=(&CLASS_VAR_NAME ="&CLS_NAME") ) /  NOSASTAGS;
				WRITE CLOSE;
			WRITE CLOSE;
				
				%end;
				%let rc=%sysfunc(close(&dsid));
			%end;	
		WRITE CLOSE;
	RUN;
%MEND;