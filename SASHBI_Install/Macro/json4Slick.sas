%macro json4Slick(
	tableName=,
	hidden_cols=,columns=,dataCols=,width=,css=,resize=,editor=,sort=,validator=,formatter=,
	enableCellNavigation=, enableColumnReorder=, multiColumnSort=, 
	editable=, enableAddRow=, asyncEditorLoading=, autoEdit=, chkBox=, forceFitColumns=, isTree=0, rowHeight=25, frozenColumn=0, addTables=);
	%local fileexist _sessionid;
	OPTIONS NOMPRINT NOSOURCE NOSOURCE2 NONOTES;
	/* OPTIONS MPRINT MLOGIC SOURCE SOURCE2 NOTES; */
	options validvarname=any;

	%if &enableCellNavigation eq %then %let enableCellNavigation=true;
	%if &enableColumnReorder eq %then %let enableColumnReorder=false;
	%if &multiColumnSort eq %then %let multiColumnSort=true;

	%let old = %sysfunc(stpsrv_header(Content-type, text/json%str(;) encoding=utf-8));
	%let old = %sysfunc(stpsrv_header(Pragma, nocache));

	data _null_;
		_program = substr(symget('_program'),1,7);

		if _program ne '/SASTRS' then do;
			rc=stpsrv_session('create');
			rc=stpsrvset('session timeout',60*60*24);
			put "NOTE: Session Created...";
			call symput("save_path",pathname('save'));
		end;
	run;

	%if not %symexist(save_path) %then %let save_path = %sysfunc(pathname(work));
	%if "&save_path" eq "" %then %let save_path = %sysfunc(pathname(work));
	%put NOTE: &=save_path;

	%if %sysfunc(libref(savea)) %then %do;
		%let savelib=_save;
		%if "&save_path" ne "%sysfunc(pathname(save))" %then %do;
			%if "&sysuserid" eq "sassrv" %then %do;
		libname _save "&save_path";
			%end;
			%else %do;
		libname _save "%sysfunc(pathname(work))";
			%end;
		%end;
		%else %do;
		libname _save "&save_path";
		%end;
	%end;
	%else %do;
		%let savelib=savea;
		%put NOTE: &=savea;
	%end;
	
	%let yymmdd=%sysfunc(today(),yymmddn8.);
	%let time=%sysfunc(compress(%sysfunc(time(),time8.),:));
	%if  not %symexist(_objPos) %then %do;
		%let _objPos=1;
	%end;	
	%put NOTE: &yymmdd.&time._&_objPos;	
	data &savelib.._save_&yymmdd.&time._&_objPos (label="&tableName") &savelib..WEBDATA;
		set &tableName;
		%if &isTree eq 1 %then %do;
			title=repeat('-',indent)||title;
			drop id indent parent type2 pid;
		%end;
	run;
	%let is2step=%index(&tablename,%str(.));
	%if &is2step > 0 %then %let dataname=%scan(&tablename,2,.);
	%else %let dataname=&tablename;
	data &savelib..&dataname;
		set &tableName;
		%if &isTree eq 1 %then %do;
			title=repeat('-',indent)||title;
			drop id indent parent type2 pid;
		%end;
	run;	

	proc contents data=&tableName out=work.__cont noprint;
	run;
	proc sql noprint;
		select 
		%if "&columns" eq "" %then %do;
			name as v_columns ,
		%end;
		%if "&width" eq "" %then %do;
			case
				when upcase(name) = upcase('CHKBOX') then '30'
				when type = 1 then "100"
				else put(length*10, 8.)
			end as v_width ,
		%end;
		%if "&css" eq "" %then %do;
			case
				when type=2 then 'l'
				else 'r'
			end as v_css ,
		%end;
		%if "&sort" eq "" %then %do;
			'1' as v_sort ,
		%end;
		%if "&resize" eq "" %then %do;
			'1' as v_resize ,
		%end;
			1 as dummy
			into
		%if "&columns" eq "" %then %do;
			:columns separated by ' ',
		%end;
		%if "&width" eq "" %then %do;
			:width separated by ' ',
		%end;
		%if "&css" eq "" %then %do;
			:css separated by ' ',
		%end;
		%if "&sort" eq "" %then %do;
			:sort separated by ' ',
		%end;
		%if "&resize" eq "" %then %do;
			:resize separated by ' ',
		%end;
			:dummy separated by ' '
		from work.__cont
	%if &hidden_cols ne %then %do;
		%let comma=;
		%let hidden_cols=%sysfunc(compbl(&hiddencols));
		%let hidden_cols_num=%eval(%length(&hidden_cols)-%length(%sysfunc(compress(&hidden_cols,%str( ))))+1);
		where upcase(name) not in (
        %do ii=1 %to &hidden_cols_num;
			%let varName=%upcase(%scan(&hidden_cols,&ii,%str( )));
			%*put &varname;
			%if &ii ne 1 %then %let comma=,;
			&comma. "&varName"
		%end;
		)
	%end;
		order by varnum
		;
	quit;
	%put NOTE: &=columns;
	%put NOTE: &=width;
	%put NOTE: &=css;
	%put NOTE: &=sort;
	%put NOTE: &=resize;
		
	%if "&columns." eq "" %then %do;
		%if "&hidden_cols" eq "" %then %do;
		proc sql noprint;
			select name into:columns separated by ' ' from work.__cont
			order by varnum
			;
		quit;
		%end;
		%else %do;
		%let comma=;
			%let hidden_cols=%sysfunc(compbl(&hidden_cols));
			%let hidden_cols_num=%eval(%length(&hidden_cols)-%length(%sysfunc(compress(&hidden_cols,%str( ))))+1);
		proc sql noprint;
			select name into:columns separated by ' ' from work.__cont
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
		options notes;
		%put NOTE: columns - &columns ;
		
	%end;
	%else %do;
		%let columns=%sysfunc(compbl(&columns));
	%end;
	%if &dataCols = %then %do;
		%let dataCols = &columns;
		proc sql noprint;
			select name into:dataCols separated by ' ' from work.__cont
			;
		quit;
	%end;
	%else %do;
		%let dataCols=%sysfunc(compbl(&dataCols));
	%end;
	OPTIONS NOTES;
	%put NOTE: [json4Slick] Columns : &columns;
	%put NOTE: [json4Slick] dataCols : &dataCols;
	%if &width 			ne %then %let width			=%sysfunc(compbl(&width));
	%if &css	 			ne %then %let css				=%sysfunc(compbl(&css));
	%if &sort	 			ne %then %let sort			=%sysfunc(compbl(&sort));
	%if &resize 		ne %then %let resize		=%sysfunc(compbl(&resize));
	%if &editor 		ne %then %let editor		=%sysfunc(compbl(&editor));
	%if &formatter 	ne %then %let formatter	=%sysfunc(compbl(&formatter));
	
	%put NOTE: [json4Slick] width : &width;
	%put NOTE: [json4Slick] css : &css;
	%put NOTE: [json4Slick] sort : &sort;
	%put NOTE: [json4Slick] resize : &resize;
	%put NOTE: [json4Slick] editor : &editor;
	%put NOTE: [json4Slick] formatter : &formatter;

	%let colNum=%eval(%length(&columns)-%length(%sysfunc(compress(&columns,%str( ))))+1);
	%let dColNum=%eval(%length(&dataCols)-%length(%sysfunc(compress(&dataCols,%str( ))))+1);
	%*put NOTE: json4Slick Colnum Num : &colNum;
	%*put NOTE: json4Slick dataCols Num : &dColNum;
proc json out=_webout ;
	write open array;
		write open object;
			write value "SessionInfo";
			write open array;
				write open object;
					write values nstp_sessionid "&_SESSIONID";
					write values save_path "&save_path";
				write close;
			write close;
			write value "ColumnInfo";
			write open array;
			%let dsid=%sysfunc(open(&tableName));
			%if &dsid %then %do;
				%do ii=1 %to &colNum;
					%let varName=%scan(&columns,&ii,%str( ));
					%*put varName : &varName;
					%let varLabel=%sysfunc(varlabel(&dsid,%sysfunc(varnum(&dsid,&varname))));
					%*put NOTE: varLabel = &varLabel;
					%if %length(&varLabel) = 0 %then %let varLabel=&varName;
					%let varLabel=%str(&varLabel);
					%*put NOTE: varLabel = &varLabel;
					write open object;
						write values id "&varName";
						write values name "&varLabel";
						write values field "&varName";
		
					%if &width ne %then %do;
						%let widthItem=%scan(&width,&ii,%str( ));
						write values width &widthItem;
					%end;
					%*put css : &css ;
					%*put ii : &ii ;
					%if &css ne %then %do;
						%let cssItem=%scan( &css , &ii , %str( )); 
						%*put NOTE: cssItem : &cssItem ;
						%if %index(&cssItem,%nrstr(*)) %then %do;
							%let cssItem = %sysfunc(translate(&cssItem,%str( ),%nrstr(*)));
						%end;
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
						write values formatter %unquote("&formatterItem");
					%end;
						write values headerCssClass "c";
		
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
				%if &forceFitColumns ne %then %do;
					/* write values "forceFitColumns" &forceFitColumns; */
					write values "autosizeColsMode" "LFF";
				%end;
				%if &chkBox ne %then %do;
					write values "chkBox" &chkBox;
				%end;
				%if &frozenColumn ne 0 %then %do;
					write values "frozenColumn" &frozenColumn;
				%end;
				%if &rowHeight ne 25 %then %do;
					write values "rowHeight" &rowHeight;
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
					) / nosastags fmtnumeric fmtcharacter fmtdatetime;
			write close;
			%if "&addTables" ne "" %then %do;
				%let iter=%eval(%sysfunc(countc(&addTables, %str(,)))+1);
				%do ii=1 %to &iter;
					%let tableInfo = %scan(&addTables, ii, %str(,));
					%let tblLabel = %scan(&tableInfo, 1, %str(:));
					%let tblName = %scan(&tableInfo, 2, %str(:));
			write value "&tblLabel";
			write open array;
					export &tblName / nosastags fmtnumeric fmtcharacter fmtdatetime;
			write close;
				%end;
			%end;
		write close;
	write close;
run;
%mend json4Slick;
