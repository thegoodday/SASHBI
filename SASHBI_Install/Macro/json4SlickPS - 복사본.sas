%macro json4SlickPS(
	tableName=,
	hidden_cols=,columns=,dataCols=,width=,css=,resize=,editor=,sort=,validator=,formatter=,
	enableCellNavigation=, enableColumnReorder=, multiColumnSort=, 
	editable=, enableAddRow=, asyncEditorLoading=, autoEdit=, chkBox=, isTree=0);
	OPTIONS MPRINT SOURCE SOURCE2;
	/*
	%let old = %sysfunc(stpsrv_header(Content-type, text/json%str(;) encoding=utf-8));
	%let old = %sysfunc(stpsrv_header(Pragma, nocache));
	*/
	%if &enableCellNavigation eq %then %let enableCellNavigation=true;
	%if &enableColumnReorder eq %then %let enableColumnReorder=false;
	%if &multiColumnSort eq %then %let multiColumnSort=true;
	/*
	data _null_;
		if libref('save') then do;
			rc=stpsrv_session('create');
			rc=stpsrvset('session timeout',60*60*24);
		end;
	run;	
	data _null_;
		file webout;
		save_path=pathname('save');
		save_path=TRANSLATE(save_path,"/","\");
		call symput("save_path",trim(save_path));
	run;  	
	data save.WEBDATA;
		set &tableName;
		%if &isTree eq 1 %then %do;
			title=repeat('-',indent)||title;
			drop id indent parent type2 pid;
		%end;
	run;
	*/
	%let is2step=%index(&tablename,%str(.));
	%if &is2step > 0 %then %let dataname=%scan(&tablename,2,.);
	%else %let dataname=&tablename;
	/*
	data save.&dataname;
		set &tableName;
		%if &isTree eq 1 %then %do;
			title=repeat('-',indent)||title;
			drop id indent parent type2 pid;
		%end;
	run;
	*/
	

		proc contents data=&tableName out=work.cont noprint;
		run;
	%if &columns eq %then %do;
		%if &hidden_cols eq %then %do;
		proc sql noprint;
			select name into:columns separated by ' ' from work.cont
			order by varnum
			;
		quit;
		%end;
		%else %do;
		%let comma=;
			%let hidden_cols=%sysfunc(compbl(&hidden_cols));
			%let hidden_cols_num=%eval(%length(&hidden_cols)-%length(%sysfunc(compress(&hidden_cols,%str( ))))+1);
		proc sql noprint;
			select name into:columns separated by ' ' from work.cont
			where upcase(name) not in (
			%do ii=1%to &hidden_cols_num;
				%let varName=%upcase(%scan(&hidden_cols,&ii,%str( )));
				%put &varName;
				%if &ii ne 1 %then %let comma=,;
				&comma. "&varName"
			%end;
			)
			order by varnum
			;
		quit;
		%end;
		%put NOTE: columns - &columns ;
		
	%end;
	%else %do;
		%let columns=%sysfunc(compbl(&columns));
	%end;
	%if &dataCols = %then %do;
		%let dataCols = &columns;
		proc sql noprint;
			select name into:dataCols separated by ' ' from work.cont
			;
		quit;
	%end;
	%else %do;
		%let dataCols=%sysfunc(compbl(&dataCols));
	%end;
	%put NOTE: Columns : &columns;
	%put NOTE: dataCols : &dataCols;
	%if &width 			ne %then %let width			=%sysfunc(compbl(&width));
	%if &css	 			ne %then %let css				=%sysfunc(compbl(&css));
	%if &sort	 			ne %then %let sort			=%sysfunc(compbl(&sort));
	%if &resize 		ne %then %let resize		=%sysfunc(compbl(&resize));
	%if &editor 		ne %then %let editor		=%sysfunc(compbl(&editor));
	%if &formatter 	ne %then %let formatter	=%sysfunc(compbl(&formatter));
	
	%put NOTE: width : &width;
	%put NOTE: css : &css;
	%put NOTE: sort : &sort;
	%put NOTE: resize : &resize;
	%put NOTE: editor : &editor;
	%put NOTE: formatter : &formatter;

	%let colNum=%eval(%length(&columns)-%length(%sysfunc(compress(&columns,%str( ))))+1);
	%let dColNum=%eval(%length(&dataCols)-%length(%sysfunc(compress(&dataCols,%str( ))))+1);
	%put NOTE: json4Slick Colnum Num : &colNum;
	%put NOTE: json4Slick dataCols Num : &dColNum;
proc json out=webout ;
	write open array;
		write open object;
			write value "SessionInfo";
			write open array;
				write open object;
					write values nstp_sessionid "&_SESSIONID";
					write values save_path "&save_path";
				write close;
			write close;
			write value "ColumInfo";
			write open array;
			%let dsid=%sysfunc(open(&tableName));
			%if &dsid %then %do;
				%do ii=1 %to &colNum;
					%let varName=%scan(&columns,&ii,%str( ));
					%put varName : &varName;
					%let varLabel=%sysfunc(varlabel(&dsid,%sysfunc(varnum(&dsid,&varname))));
					%put NOTE: varLabel = &varLabel;
					%if %length(&varLabel) = 0 %then %let varLabel=&varName;
					%let varLabel=%str(&varLabel);
					%put NOTE: varLabel = &varLabel;
					write open object;
						write values id "&varName";
						write values name "&varLabel";
						write values field "&varName";
		
					%if &width ne %then %do;
						%let widthItem=%scan(&width,&ii,%str( ));
						write values width &widthItem;
					%end;
					%put css : &css ;
					%put ii : &ii ;
					%if &css ne %then %do;
						%let cssItem=%scan( &css , &ii , %str( )); 
						write values cssClass "&cssItem";
					%end;
					%if &editor ne %then %do;
						%let editorItem=%scan(&editor,&ii,%str( ));
						write values editor "&editorItem";
					%end;
					%if &resize ne %then %do;
						%let resizeItem=%scan(&resize,&ii,%str( ));
						%if &resizeItem ne 0 %then %let resizeItem=true;
						%else %let resizeItem=false;
						write values resizable &resizeItem;
					%end;
					%if &sort ne %then %do;
						%let sortItem=%scan(&sort,&ii,%str( ));
						%if &sortItem ne 0 %then%let sortItem=true;
						%else %let sortItem=false;
						write values "sortable" &sortItem;
					%end;
					%if &validator ne %then %do;
						%let validatorItem=%scan(&validator,&ii,%str( ));
						write values "validator" "&validatorItem";
					%end;
					%if &formatter ne %then %do;
						%let formatterItem=%scan(&formatter,&ii,%str( ));
						write values formatter "&formatterItem";
					%end;
		
					write close;
				%end;
				%let rc=%sysfunc(close(&dsid));
			%end;
	
			write close;
			write value "Options";
			write open array;
				write open object;
				%if &editable ne %then %do;
					write values "editable" &editable;
				%end;
				%if &enableAddRow ne %then %do;
					write values "enableAddRow" &enableAddRow;
				%end;
				%if &enableCellNavigation ne %then %do;
					write values "enableCellNavigation" &enableCellNavigation;
				%end;
				%if &asyncEditorLoading ne %then %do;
					write values "asyncEditorLoading" &asyncEditorLoading;
				%end;
				%if &autoEdit ne %then %do;
					write values "autoEdit" &autoEdit;
				%end;
				%if &enableColumnReorder ne %then %do;
					write values "enableColumnReorder" &enableColumnReorder;
				%end;
				%if &multiColumnSort ne %then %do;
					write values "multiColumnSort" &multiColumnSort;
				%end;
				%if &chkBox ne %then %do;
					write values "chkBox" &chkBox;
				%end;
				write close;
			write close;
			write value "SASResult";
			write open array;
					export &tableName (keep=
					%if &isTree eq 1 %then %do;
						id indent parent
					%end;
					%do ii=1 %to &dColNum;
						%let varName=%scan(&dataCols,&ii,%str( ));
						&varName
					%end;
					) / nosastags fmtnumeric;
			write close;
		write close;
	write close;
run;
%mend json4Slick;
