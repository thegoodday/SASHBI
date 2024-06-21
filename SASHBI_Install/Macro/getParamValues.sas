/*
			_debug		: '0',
			_program	: stpURI,
			tableName	: tableName,
			colName		: colName,
			param1		: param1,
			param2		: param2,
			
			param1 : whereStatements
			param2 : column sortOrder
			param3 : label column ID
			param4 : label column sortOrder
			param5 : isDisplayValue
			
*/
options validvarname=any nomlogic mprint source source2;
%macro createParam;
	%global isparam isCheck;
	%if %symexist(param1) %then %do;
		%let kk= %length(&param1);
		%let wcnt=%eval(%length(&param1)-%length(%sysfunc(compress(&param1,:))));
		%put NOTE: CNT: &wcnt;

		%let libname=%sysfunc(urldecode(&libStmt)) ;
		&libname  ;
		%let isCheck=0;
		%do ii=1 %to &wcnt;
			%let tempC=%scan(&param1,&ii,:);
			%let varname=%scan(&tempC,1,=);
			%let value=%scan(&tempC,2,=);		
			%if not %symexist(&value) %then %do;
				%put NOTE: &value not exist!!!;
				%let isCheck=%eval(&isCheck+1);	
				%if %symexist(&&value.0) %then %do;
					%put NOTE: &&&value.0 ;
					%let isCheck=%eval(&isCheck-1);	
				%end;
			%end;
		%end;
		%put NOTE: &=isCheck;
		%if &isCheck > 0 %then %return;

		proc sql;
			create table work.param as
			select distinct &colName
			%if &param3 ne %then %do;
				, &param3
			%end; 
			from &tableName
		
			%if &wcnt > 0 %then %do;
				where 1=1
				%do ii=1 %to &wcnt;
					%let tempC=%scan(&param1,&ii,:);
					%let varname=%scan(&tempC,1,=);
					%let value=%scan(&tempC,2,=);
					
					%let dsid=%sysfunc(open(&tableName));
					%if &dsid %then %do;
						%let varType = %sysfunc(vartype(&dsid,%sysfunc(varnum(&dsid,&varname))));
						%let rc=%sysfunc(close(&dsid));
					%end;
					
					%if %symexist(&&varname.0) %then 
						%let isMulti=&&&varname.0;
					%else 
						%let isMulti=1;
					%put NOTE: isMulti is &isMulti;
					%if &isMulti eq 1 %then %do;
						%if &varType = C %then %do;
					and &varname = "&&&value"
						%end;
						%else %do;
					and &varname = &&&value
						%end;
					%end;
					%else %if &isMulti > 1 %then %do;
					and &varname in (
						%do ii=1 %to &isMulti;
							%if &ii eq 1 %then %do;
								"&&&varname&ii"
							%end;
							%else %do;
								,"&&&varname&ii"
							%end;
						%end;
						)
					%end;
				%end;
			%end;
			%if &param2 ne %then %do;
			order by &colName &param2
			%end;
			%if &param4 ne %then %do;
			order by &param3 &param4
			%end;
			;
		quit;	
	%end;
%mend;
%createParam;

%macro createScript;
	%if &isCheck > 0 %then %do;
		data _null_;;
			file _webout;
			put 'ERROR: value required...';
		run;
		%return;	
	%end;
	%put param1 : &param1;
	proc sql noprint;
		select count(*) into: cnt
		from work.param;
	quit;	
	%if %symexist(param1) %then %do;
	data _null_;
		file _webout;
		set work.param end=eof;
		if _n_ eq 1 then do;
			put '<script>';
			cmd='$("#slt'||trim("&target")||' option").remove();';
			put cmd;
		end;
		%if &param3 ne %then %do;
			%if &param5 eq true %then %do;
			/*
				smd='$("#slt'||trim("&target")||'").append("<option value='||trim(&colName)||' >'||trim(&param3)||'['||trim(&colName)||']</option>");';
			*/
				smd='$("#slt'||trim("&target")||'").append("<option value='||"'"||trim(&colName)||"'"||' >'||trim(&param3)||'['||trim(&colName)||']</option>");';
			%end;
			%else %do;
			/*
				smd='$("#slt'||trim("&target")||'").append("<option value='||trim(&colName)||' >'||trim(&param3)||'</option>");';
			*/
				smd='$("#slt'||trim("&target")||'").append("<option value='||"'"||trim(&colName)||"'"||' >'||trim(&param3)||'</option>");';
			%end;
		%end;
		%else %do;
			/*
			smd='$("#slt'||trim("&target")||'").append("<option value='||trim(&colName)||' >'||trim(&colName)||'</option>");';
			*/
			smd='$("#slt'||trim("&target")||'").append("<option value='||"'"||trim(&colName)||"'"||' >'||trim(&colName)||'</option>");';
		%end;
		put smd;
		if eof then put '</script>';
	run;
	%end;
	%else %do;
		data _null_;
			file _webout;
			put 'ok...';
		run;	
	%end;
	%if &cnt = 0 %then %do;
	data _null_;
		file _webout;
		put '<script>';
		cmd='$("#slt'||trim("&target")||' option").remove();';
		put cmd;
		put '</script>';
	run;
	%end;
%mend;	
%createScript;
*dd;
