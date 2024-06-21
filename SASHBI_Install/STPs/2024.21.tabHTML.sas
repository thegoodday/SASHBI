%macro webout;
	optios nocenter;
    ods html file=_webout (no_top_matter no_bottom_matter);
    DATA WORK.PRDSALE;
        SET SASHELP.PRDSALE;
    RUN;

	TITLE H=6 "Result 1";
	TITLE3 "버튼명은 _STPREPORT_HEADER_JS 에서 변경 - $(document).ready, submitSTPCust() 에서 재정의." ;
	TITLE4 "행추가 버튼은 _STPREPORT_BTN_ADD_ROW_CUST 추가하고 addRowCust 함수 선언하여 사용.";
	TITLE5 "저장 버튼은 _STPREPORT_SAVE_PGM 추가하고 saveDataCust 선언. _program 의 값은 ${savePGM}(StoredProcess) 로 설정.";
	PROC TABULATE
		DATA=WORK.PRDSALE;
		VAR PREDICT  /style=[WIDTH=50px];;
		VAR ACTUAL   /style=[WIDTH=100px];;
		CLASS YEAR QUARTER MONTH;
		CLASS PRODUCT			/	ORDER=UNFORMATTED MISSING;
		CLASS PRODTYPE		/	ORDER=UNFORMATTED MISSING;
		CLASS COUNTRY			/	ORDER=UNFORMATTED MISSING;
		CLASS REGION 			/	ORDER=UNFORMATTED MISSING;
		CLASSLEV YEAR			/ style=[WIDTH=50px TEXTALIGN=CENTER];
		CLASSLEV QUARTER	/ style=[WIDTH=100px TEXTALIGN=CENTER];
		CLASSLEV MONTH		/ style=[WIDTH=150px TEXTALIGN=CENTER];
		CLASSLEV COUNTRY	/ style=[TEXTALIGN=CENTER];
		
		TABLE 
			YEAR=''*QUARTER=''*MONTH='',
			COUNTRY=''* (PREDICT='Predict Amount' ACTUAL='Actual Amount')*SUM=''*F=COMMA20.
		;
	RUN;

    
	TITLE H=6 "Result 2";
	PROC TABULATE
		DATA=WORK.PRDSALE;
		VAR PREDICT  /style=[WIDTH=50px];;
		VAR ACTUAL   /style=[WIDTH=100px];;
		CLASS YEAR QUARTER MONTH;
		CLASS PRODUCT			/	ORDER=UNFORMATTED MISSING;
		CLASS PRODTYPE		/	ORDER=UNFORMATTED MISSING;
		CLASS COUNTRY			/	ORDER=UNFORMATTED MISSING;
		CLASS REGION 			/	ORDER=UNFORMATTED MISSING;
		CLASSLEV YEAR			/ style=[WIDTH=50px TEXTALIGN=CENTER];
		CLASSLEV QUARTER	/ style=[WIDTH=100px TEXTALIGN=CENTER];
		CLASSLEV MONTH		/ style=[WIDTH=150px TEXTALIGN=CENTER];
		CLASSLEV COUNTRY	/ style=[TEXTALIGN=CENTER];
		
		TABLE 
			YEAR=''*QUARTER='',
			COUNTRY=''* (PREDICT='Predict Amount' ACTUAL='Actual Amount')*SUM=''*F=COMMA20.
		;
	RUN;

    
	TITLE H=6 "Wide Table";
	proc sql;
		create table work.target as
		select * 
		from sashelp.prdsale
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
	TITLE H=6 "Cars";
	/* TITLE10 "NOFROZEN"; */
    proc print data=sashelp.cars CONTENTS="TEST";
			id make  /style=[WIDTH=100px];;
			id model  /style=[WIDTH=250px];;
            var _numeric_ / style=[WIDTH=100px];;
    run;
    ods html close; 
%mend;
%webout;

