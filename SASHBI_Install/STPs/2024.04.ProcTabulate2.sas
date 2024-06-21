
ods html file=_webout (no_top_matter no_bottom_matter);
	TITLE H=6 "&COUNTRY / &PRODTYPE / &PRODUCT";
	Title2 "TEST Report";
	proc sql;
		create table work.target as
		select * 
		from hbidemo.prdsale
		;
	quit;
	PROC TABULATE
		DATA=work.target;
			VAR PREDICT  /style=[WIDTH=50px];;
			VAR ACTUAL   /style=[WIDTH=70px];;
			CLASS YEAR QUARTER MONTH;
			CLASS PRODUCT			/	ORDER=UNFORMATTED MISSING;
			CLASS PRODTYPE			/	ORDER=UNFORMATTED MISSING;
			CLASS COUNTRY			/	ORDER=UNFORMATTED MISSING;
			CLASS REGION 			/	ORDER=UNFORMATTED MISSING;
			CLASSLEV YEAR			/ style=[WIDTH=60px TEXTALIGN=CENTER];
			CLASSLEV QUARTER	/ style=[WIDTH=80px TEXTALIGN=CENTER];
			CLASSLEV MONTH		/ style=[WIDTH=100px TEXTALIGN=CENTER];
			CLASSLEV COUNTRY	/ style=[TEXTALIGN=CENTER];
			
			TABLE 
				YEAR=''*QUARTER=''*MONTH='',	
				COUNTRY=''* (PREDICT='Predict' ACTUAL='Actual' PREDICT='Predict' ACTUAL='Actual' PREDICT='Predict' ACTUAL='Actual' PREDICT='Predict' ACTUAL='Actual')*SUM=''*F=COMMA10.
			;
	RUN;
ods html close;
