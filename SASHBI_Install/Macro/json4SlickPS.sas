%global stp_sessionid save_path editable enableAddRow autoEdit enableColumnReorder;

%macro json4SlickPS(
	tableName=,
	hidden_cols=,columns=,dataCols=,width=,css=,resize=,editor=,sort=,validator=,formatter=,
	enableCellNavigation=, enableColumnReorder=, multiColumnSort=, 
	editable=, enableAddRow=, asyncEditorLoading=, autoEdit=, chkBox=, isTree=0);
	options notes source source2 mprint nomlogic;
%let stp_sessionid=TEST;
%let save_path=save_path;

	data &columninfo._2;
		length json $32767;
		set &columninfo end=eof;
		keep json;
		if _n_ =1 then do;
			json='"ColumInfo":[';
			output;
		end;
		if eof then do;
			json='{"id":"'||trim(id)||'","name":"'||trim(label)||'","field":"'||trim(id)||'","width":'||trim(width)||',"cssClass":"'||trim(align)||
					'","resizeable":'||trim(isResize)||',"sortable":'||trim(isSort)||'}'; output;
			json='],';output;
		end;
		else do;
			json='{"id":"'||trim(id)||'","name":"'||trim(label)||'","field":"'||trim(id)||'","width":'||trim(width)||',"cssClass":"'||trim(align)||
					'","resizeable":'||trim(isResize)||',"sortable":'||trim(isSort)||'},' ; output;
		end;
	run;
	data &dataInfo._2;
		length json $32767;
		keep json;
			set &columninfo._2 &dataInfo;
	run;
%mend;
%macro writesocket(
	enableCellNavigation=, enableColumnReorder=, 
	editable=, enableAddRow=, asyncEditorLoading=, autoEdit=);
	data _null_;
		length json $32767;
		file w_&uid; 
		set &dataInfo._2 end=eof;
		if _n_ = 1 then do;
			put '[{"SessionInfo":[{"nstp_sessionid":"' "&stp_sessionid" '","save_path":"' "&save_path" '"}],' @;
			put '"Options":[{"editable":' "&editable" ',"enableAddRow":' "&enableAddRow" ',"enableCellNavigation":true,"autoEdit":' "&autoEdit" ',"enableColumnReorder":' "&enableColumnReorder" ',"multiColumnSort":' "true" '}],' @;
		end;
		
		if eof then do;
			put json @;
		end;
		else do;
			put json @;
		end;
	run;
	%if &syserr > 0  %then %do;
		%let rc=%sysfunc(sleep(1));
		%put NOTE: Waiting....;
		%writesocket;
	%end;
%mend;
