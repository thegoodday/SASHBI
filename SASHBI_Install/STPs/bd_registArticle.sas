
%global branch board_id article_id parent_id article_title article_content _webin_file_count
    v3result v3filepath v3res_cd v3res_msg msg;

options nosource nosource2 nomprint;
options source source2 mprint nosyntaxcheck;
options minoperator mindelimiter=',' symbolgen mlogic;
options urlencoding=utf8;

%macro v3scan(filepaht);
    %let v3filepath = &filepath;
    %inc '/app/sas/sasv94/fcs/GLOBAL/SASHBI/00.Common/remoteV3scan.sas';

    %pu NOTE: &=v3res_cd;
    %pu NOTE: &=v3res_msg;
%mend v3scan;

%macro saveFile(
    save_path=,
    prefix=,
    wi_filename=,
    wi_fileref=,
    wi_fileext=,
    join_key=
);
    %put NOTE: Macro saveFile start....;

    data _null_;
        file = "&wi_filename";
        if index(file, '\') then do;
            filename = scan(file, -1, '\');
            call symput('wi_filename', filename);
        end;
    run;

    %if ("&wi_filename" ne "") and ("&wi_fileref" ne "") %then %do;
		%if "&wi_filename" eq "__article__.txt" %then %do;
			data _null_;
				path=pathname('work');
				put path=;
				call symputx('work_path',path);
			run;
			filename arttxt "&work_path./article.txt";
			filename arttxt "&save_path./article.txt";
            data hbidemo.article;
                length data $1;
                infile &wi_fileref recfm=n;
                file arttxt recfm=n;
                input data $char1. @@;
                put data $char1. @@;
            run;
		%end;
		%else %if "&wi_filename" ne "" %then %do;
	        %let file_ext = %lowcase(&wi_fileext);
	        %if &file_ext in (doc, docx, pdf, xls, xlsx, ppt, pptx, txt, hwp, zip, exe, png, mp3, mp4) %then %do;
	            data _null_;
	                time = compress(compress(put(time(), time12.3),':'),'.');
	                fname = catx('_', put(today(), yymmddn8.), time, "&&_username", "&prefix")||".&wi_fileext";
	                call symput('fname', strip(fname));    
	            run;

	            filename upfile "&save_path./&fname";
	            data _null_;
	                length data $1;
	                infile &wi_fileref recfm=n;
	                file upfile recfm=n;
	                input data $char1. @@;
	                put data $char1. @@;
	            run;

	            %let isFile = %sysfunc(fileexist("&save_path./&fname"));
	            %put NOTE: &=isFile;

	            %if &isFile > 0 %then %do;
	                %*v3scan(&save_path./&fname);
					%let v3res_cd = 0;
	                %if &v3res_cd eq 0 %then %do;
	                    options sastrace=',,,d' sastraceloc=saslog;
	                    proc sql noprint;
	        				connect to postgres(&pg_conn);
	                        execute(
	                            insert into file_mst (join_key, file_name, file_name_org, file_path, reg_dt)
	                            values (
	                                &join_key,
	                                %nrbquote('&fname'),
	                                %nrbquote('&wi_filename'),
	                                %nrbquote('&save_path'),
	                                now()
	                            )
	                        ) by postgres;
	                        disconnect from postgres;
	                    quit;
	                    %put NOTE: &=sysdbrc;
	                    %put NOTE: SYSDBMSG = %superq(sysdbmsg);

	                    %if &sysdbrc ne 0 %then %do;
	                        %let msg = &sysdbmsg;
	                    %end;
	                %end;
	                %else %do;
	                    %let msg = Virus scan faild. <br> Scan Result : &v3res_msg.;
	                %end;
	            %end; /* &=isFile > 0 ; */
	            %else %do;
	                %let msg = Failed to save file. <br> Please contact system administrator.;
	            %end;
	        %end; /* doc, dox.... */
		%end;
        %else %do;
            %let msg  = File extentions that cannot be attached.;
        %end;
    %end; /* &wi_filename ne and &wi_fileref ne ; */

%mend saveFile;

%macro putMsg(dsname=);
	%let dsid = %sysfunc(open(&dsname));
	%if &dsid %then %do;
		%let ii=1;
		%let nobs = %sysfunc(attrn(&dsid,nobs));
		%*put NOTE: &=nobs;
		
		%do %while(%sysfunc(fetch(&dsid)) eq 0);
			%let linetxt = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,line))));
			%if &ii ne &nobs %then %do;							
				%let linetxt = %nrbquote($$&linetxt$$||chr(10),);
			%end;
			%else %do;									
				%let linetxt = %nrbquote($$&linetxt$$);
			%end;
			%*put &linetxt;
			&linetxt
			%let ii = %eval(&ii + 1);
		%end;
		%let rc = %sysfunc(close(&dsid));
	%end;
%mend putMsg;

%macro saveAttachment;
    proc sql noprint;
        connect to postgres(&pg_conn);
        select id into:article_id from connection to postgres(
            select nextval('board_seq') as id 
        );
        disconnect from postgres;
    quit;
	
	%if &_webin_file_count eq %then %let _webin_file_count = 0;

    %put NOTE: &=article_id;
    %put NOTE: &=_webin_file_count;

    %if &_webin_file_count > 0 %then %do;
        %if &_webin_file_count =1 %then %do;
            %put NOTE: &=_webin_file_count;
            %saveFile(
                save_path=/sas/sasv94/config/Lev1/Web/WebAppServer/SASServer2_1/sas_webapps/sas.hbi.war/fileUpload/&board_id./boardFile,
                prefix = &board_id,
                wi_filename=%quote(&_webin_filename),
                wi_fileref=&_webin_fileref,
                wi_fileext=&_webin_fileext,
                join_key=&article_id
            );
        %end;
        %else %do;
            %do ii=1 %to &_webin_file_count;
                %put NOTE: &=_webin_file_count;
                %saveFile(
					save_path=/sas/sasv94/config/Lev1/Web/WebAppServer/SASServer2_1/sas_webapps/sas.hbi.war/fileUpload/&board_id./boardFile,
                	prefix = &board_id,                
                    wi_filename=%quote(&&_webin_filename&ii),
                    wi_fileref=&&_webin_fileref&ii,
                    wi_fileext=&&_webin_fileext&ii,
                    join_key=&article_id
                );
            %end;
        %end; 
    %end; 
    %else %do;
        %put NOTE: No Attachment!!!;
    %end;
%mend saveAttachment;

%macro registArticle;
    options sastrace=',,,d' sastraceloc=saslog;
	%if &article_owner ne %then %do;
    data work.article;
        length
/*            bk_cd $2*/
            board_id article_id parent_id 8
            article_title $10000
            article_content $30000
            reg_user $20
            reg_dt
            attachment_id
            view_cnt
            last_update_dt 8
        ;
/*        bk_cd = "&branch";*/
        board_id = &board_id;
        article_id = &article_id;
        parent_id = &parent_id;
        article_title = urldecode("&article_title");
        article_content = urldecode(symget("article_content"));
        reg_user = "&article_owner";
        reg_dt = datetime();
        attachment_id = &_webin_file_count;
        view_cnt = 0;
        last_update_dt = datetime();
		*put article_content=;
        output;
    run;
	libname tmp '/tmp';
	data tmp.article; set work.article;run;
    proc append base=pg.board_mst data=work.article force;
    run;
	data _null_;
		infile arttxt encoding='utf-8';
		input;
		*put _infile_;
	run;
/*
	data work.text;
		length line $32760;
		infile arttxt encoding='utf-8' lrecl=32767;
		input ;
		line = urlencode(_infile_);
		*line = _infile_;
		put line;
	run;	
    proc sql noprint;
        connect to postgres(&pg_conn);
        execute( 
            update board_mst
            set article_content = concat(
				%putMsg(dsname=work.text)
			)
            where 1=1
              and article_id = &article_id
        ) by postgres;
        disconnect from postgres;
    quit;
*/
	%end;

    %if &sysdbrc ne 0 %then %do;
        %let msg = &sysdbmsg;
    %end;
%mend registArticle;

%macro processRegist;
    %saveAttachment;
    %if &msg eq %then %do;
        %registArticle;
		%if &msg eq %then %do;
			%let msg = Successfully Saved...;
		%end;
    %end;
    %else %do;
        %let msg = Faild to save file(s). &msg Contact to system administrator.;
    %end;
%mend processRegist;
%processRegist;

data work.status;
    length msg $1000;
    msg = "[&sysjobid] - " || symget('msg');
	output;
run;

/*
*/
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
%if %sysfunc(exist(work.status)) %then %do;
    proc json out=_webout pretty nosastags;
        export work.status;
    run;
%end;
