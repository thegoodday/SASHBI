%MACRO JSON4BAR(DATA=,CLASS_INFO=,CLASS_VAR_NAME1=,CLASS_VAR_NAME2=,CLASS_VAR_LABEL=,ANAL_VAR_NAME=);
	%if &CLASS_VAR_NAME2 = %then %let CLASS_VAR_NAME2=_NAME_;
	%if &CLASS_VAR_LABEL = %then %let CLASS_VAR_LABEL=_LABEL_;
	PROC JSON OUT=_webout; 
		WRITE OPEN ARRAY;
			%let ii=0;
			%let dsid=%sysfunc(open(&CLASS_INFO ));
			%if &dsid %then %do;
				%do %while(%sysfunc(fetch(&dsid)) eq 0);
					%let CLS_NAME1 	= %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,&CLASS_VAR_NAME1))));
					%let CLS_NAME2	= %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,&CLASS_VAR_LABEL))));
					%let CLS_ID 	= %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,&CLASS_VAR_NAME2))));
	
			WRITE OPEN OBJECT; 
				WRITE VALUES key "&CLS_NAME1 : &CLS_NAME2";
				WRITE VALUES "values";
				WRITE OPEN ARRAY;
					EXPORT &DATA (WHERE=(&CLASS_VAR_NAME1 ="&CLS_NAME1" AND &CLASS_VAR_NAME2="&CLS_ID")) /  NOSASTAGS;
				WRITE CLOSE;
			WRITE CLOSE;
				
				%end;
				%let rc=%sysfunc(close(&dsid));
			%end;	
		WRITE CLOSE;
	RUN;
%MEND;