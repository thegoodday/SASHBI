*  EG 생성 코드 시작(이 행 편집 안 함);
*
*  Enterprise Guide Stored Process Manager V7.1에 의해 등록된
*  스토어드 프로세스
*
*  ====================================================================
*  스토어드 프로세스 이름: 27.Chart01
*  ====================================================================
*;


*ProcessBody;

%STPBEGIN;

%LET _SASSERVERNAME=%NRBQUOTE(SASApp);

*  EG 생성 코드 종료(이 행 편집 안 함);


/* --- 공유 매크로 함수의 시작 --- */
/* save the current settings of XPIXELS and YPIXELS */
/* so that they can be restored later               */
%macro _sas_pushchartsize(new_xsize, new_ysize);
	%global _savedxpixels _savedypixels;
	options nonotes;
	proc sql noprint;
	select setting into :_savedxpixels
	from sashelp.vgopt
	where optname eq "XPIXELS";
	select setting into :_savedypixels
	from sashelp.vgopt
	where optname eq "YPIXELS";
	quit;
	options notes;
	GOPTIONS XPIXELS=&new_xsize YPIXELS=&new_ysize;
%mend _sas_pushchartsize;

/* restore the previous values for XPIXELS and YPIXELS */
%macro _sas_popchartsize;
	%if %symexist(_savedxpixels) %then %do;
		GOPTIONS XPIXELS=&_savedxpixels YPIXELS=&_savedypixels;
		%symdel _savedxpixels / nowarn;
		%symdel _savedypixels / nowarn;
	%end;
%mend _sas_popchartsize;

/* Conditionally delete set of tables or views, if they exists          */
/* If the member does not exist, then no action is performed   */
%macro _eg_conditional_dropds /parmbuff;
	
   	%local num;
   	%local stepneeded;
   	%local stepstarted;
   	%local dsname;
	%local name;

   	%let num=1;
	/* flags to determine whether a PROC SQL step is needed */
	/* or even started yet                                  */
	%let stepneeded=0;
	%let stepstarted=0;
   	%let dsname= %qscan(&syspbuff,&num,',()');
	%do %while(&dsname ne);	
		%let name = %sysfunc(left(&dsname));
		%if %qsysfunc(exist(&name)) %then %do;
			%let stepneeded=1;
			%if (&stepstarted eq 0) %then %do;
				proc sql;
				%let stepstarted=1;

			%end;
				drop table &name;
		%end;

		%if %sysfunc(exist(&name,view)) %then %do;
			%let stepneeded=1;
			%if (&stepstarted eq 0) %then %do;
				proc sql;
				%let stepstarted=1;
			%end;
				drop view &name;
		%end;
		%let num=%eval(&num+1);
      	%let dsname=%qscan(&syspbuff,&num,',()');
	%end;
	%if &stepstarted %then %do;
		quit;
	%end;
%mend _eg_conditional_dropds;

/* --- 공유 매크로 함수의 마지막 --- */

/* --- "프로그램"의 코드 시작 --- */
data kk;
tt='Canada';
val=ranuni(0)*1000;
output;
tt='USA';
val=ranuni(0)*1000;
output;
tt='Japan';
val=ranuni(0)*1000;
output;
run;
/* --- "프로그램"의 코드 마지막 --- */

/* --- "막대 그래프"의 코드 시작 --- */
/* -------------------------------------------------------------------
   SAS 작업으로 생성된 코드

   생성일: 2015년 6월 19일 금요일, 오후 5:26:17
   작업: 막대 그래프

   입력 데이터: SASApp:WORK.KK
   서버: SASApp
   ------------------------------------------------------------------- */

%_eg_conditional_dropds(WORK.SORTTempTableSorted);
/* -------------------------------------------------------------------
   데이터셋 SASApp:WORK.KK 정렬
   ------------------------------------------------------------------- */

PROC SQL;
	CREATE VIEW WORK.SORTTempTableSorted AS
		SELECT T.tt, T.val
	FROM WORK.KK as T
;
QUIT;
Axis1
	STYLE=1
	WIDTH=1
	MINOR=NONE


;
Axis2
	STYLE=1
	WIDTH=1


;
TITLE;
TITLE1 "막대 그래프";
FOOTNOTE;
FOOTNOTE1 "생성 환경: SAS 시스템(&_SASSERVERNAME, &SYSSCPL), 생성 일시: %TRIM(%QSYSFUNC(DATE(), NLDATE20.)), %TRIM(%SYSFUNC(TIME(), NLTIMAP20.))";
PROC GCHART DATA=WORK.SORTTempTableSorted
;
	VBAR 
	 tt
 /
	SUMVAR=val
	CLIPREF
FRAME	TYPE=SUM
	NOLEGEND
	COUTLINE=BLACK
	RAXIS=AXIS1
	MAXIS=AXIS2
PATTERNID=MIDPOINT
;
/* -------------------------------------------------------------------
   작업 코드의 마지막
   ------------------------------------------------------------------- */
RUN; QUIT;
%_eg_conditional_dropds(WORK.SORTTempTableSorted);
TITLE; FOOTNOTE;

/* --- "막대 그래프"의 코드 마지막 --- */

*  EG 생성 코드 시작(이 행 편집 안 함);
;*';*";*/;quit;
%STPEND;

*  EG 생성 코드 종료(이 행 편집 안 함);

