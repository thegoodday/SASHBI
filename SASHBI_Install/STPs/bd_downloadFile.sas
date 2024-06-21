
%global branch FILE_KEY JOIN_KEY;
options nosource nosource2 nomprint;
options source source2 mprint;
options minoperator mindelimiter=',';


%macro download_file;
    proc sql noprint;
        connect to postgres(&pg_conn);
        create table work.file_mst as
        select *
        from connection to postgres( 
            select * /* file_key, join_key, file_name_org, file_name, file_path  */
            from file_mst
            where 1=1
/*                and bk_cd = &nrbquote('&branch')*/
                and file_key = &file_key
                and join_key = &join_key
        );
        disconnect from postgres;
    quit;
data _null_;
	set work.file_mst;
	ext = scan(FILE_NAME, -1, '.');
	abs_file_path=cat(trim(file_path),'/',file_name);
	file_rc = fileexist(abs_file_path);
	put file_rc=;

	if ext eq 'zip'				then conttype = 'application/zip';
	else if ext eq 'pdf'  	 then conttype = 'application/pdf';
	else if ext eq 'xls'  	 then conttype = 'application/vnd.ms-excel';
	else if ext eq 'xlsx'    then conttype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
	else if ext eq 'doc'  	then conttype = 'application/msword';
	else if ext eq 'docx'  then conttype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
	else if ext eq 'ppt'  	 then conttype = 'application/ms-powerpoint';
	else if ext eq 'pptx'    then contype = 'application/vnd.openxmlforamts-officedocument.presentationml.presentation';
	else if ext eq 'txt'  	   then conttype = 'text/plain';
	else if ext eq 'hwp'  	then conttype = 'application/x-hwp';

	isIE=index(symget("_HTUA"), 'Trident');

	call symput('file_path',strip(file_path));
	call symput('file_name',strip(file_name));
	call symput('file_name_org',strip(file_name_org));
	call symput('_content_type',strip(conttype));
	call symput('file_exist', file_rc);
	call symput('isIE', isIE);
run;

%if &file_exist > 0 %then %do;
	filename tfile "&file_path./&file_name.";
	%let rv = &sysfunc(stpsrv_header(Content-type, &_content_type.));
	%if &isIE > 0 %then %do;
		%let rc=&sysfunc(appsrv_header(Content-disposition, %str(attachment; filename="&file_name_org")));
	%end;
	%let rc=&sysfunc(appsrv_header(Content-Transfer-Encoding, %str(binary)));


		data _null_;
			length data $1;
			infile tfile recfm=n;
			file _webout recfm=n;
			input data $char1. @@;
			put data $char1. @@;
		run;
	%end;
	%else %do;
		data work.status;
			if &msg eq "" then msg="The external file &file_name_org does not exist.";
			else msg= &msg;
		run;

		proc json out=_webout pretty nosastags;
			export work.status;
		run;
	%end;
%mend;
%download_file;

/*
%if &syscc > 4 %then %do;
    options obs=max nosyntaxcheck;
    %put NOTE: &=syscc;
    data _null_;
        file _webout;
        rc = stpsrvset('program error',0);
        msg = cat('[{"msg":"',"ERROR",'"}]');
        *put msg;    
    run;
    %let syscc=0;
%end;
*/
%if %sysfunc(exist(work.status)) %then %do;
    proc json out=_webout pretty nosastags;
        export work.status;
    run;
%end;
