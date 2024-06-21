
%global branch board_id article_id parent_id article_title article_content
    v3result v3filepath v3res_cd v3res_msg msg;

options nosource nosource2 nomprint;
options source source2 nomprint;
options minoperator mindelimiter=',';

%macro v3scan(filepaht);
    %let v3filepath = &filepath;
    %inc '/app/sas/sasv94/fcs/GLOBAL/SASHBI/00.Common/remoteV3scan.sas';

    %pu NOTE: &=v3res_cd;
    %pu NOTE: &=v3res_msg;
%mend v3scan;

%macro sasveFile(
    save_path=,
    prfix=,
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
        %let file_ext = %lowcase(&wi_fileext);
        %if &file_ext in (doc, docx, pdf, xls, xlsx, ppt, pptx txt, hwp, zip, exe, png, mp3, mp4) %then %do;
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
                            insert into file_mst (join_key, file_name, file_name_org, file_path, create_date)
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
        %else %do;
            %let msg  = File extentions that cannot be attached.;
        %end;
    %end; /* &wi_filename ne and &wi_fileref ne ; */

%mend saveFile;

%macro saveAttachment;
    filename sgdata temp encoding=utf8;
    data _null_;
        length sgdata $32767;
        file sgdata;
        sgdata = symget('attach_info');
        put sgdata;
    run;
    libname sgdata json;

    %if %sysfunc(exist(sgdata.root)) %then %do;
        data work.attach_info(index=(file_key));
            length
                bk_cd $2 file_key 8 file_name $100 file_name_org $100
                file-path $100 join_key 8
            ;
            set sgdata.root;
        run;

        proc sql;
            create table work.src_attach as 
            select bk_cd, file_key, file_path, file_name
            from db_alma.FSB_FILE_nanager
            where bk_cd = "&bk_cd"
              and join_key = &article_id
            order by file_key
            ;
        quit;
        libname tmp '/tmp';
        data tmp.attach_info; set work.attach_info; run;
        data tmp.src_attach; set work.src_attach; run;

        data work.delete_file;
            merge work.src_attach(in=ina) work.attach_info(in=inb);
            by file_key;
            if ina and inb then delete;
            if file_key eq . then delete;
        run;
        proc sql noprint;
            select file_key into:file_keys separated by ','
            form work.delete_file;
        quit;
        %put NOTE: &=file_keys;
        %if %symexist(file_keys) %then %do;
            proc sql noprint;
                connect to oracle();
                execute(
                    delete fsb_file_manager
                    where 1=1
                      and bk_cd = %nrbquote('&bk_cd')
                      and file_key in (&file_keys)
                ) by oracle;
                disconnect from oracle;
            quit;
            %put NOTE: &=sysdbrc;
            %put NOTE: SYSDBMSG = %superq(sysdbmsg);
            %if &sysdbrc ne 0 %then %do;
                %let msg = %superq(sysdbmsg);
            %end;
        %end;
        %else %do;
            %let msg =;
            data _null_;
                set work.delete_file;
                cmd = cat("rm -f ", compress(file_path)||'/'||file_name);
                call system(cmd);
                put 'NOTE: ' cmd;
            run;
        %end;
    %end;
    %else %do;
        %put NOTE: No Attach File!;
    %end;

/*
    proc sql noprint;
        connect to postgres(&pg_conn);
        select id into:article_id from connection to postgres(
            select nextval('board_seq') as id 
        );
        disconnect from postgres;
    quit;
*/
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

%macro updateArticle;
    options sastrace=',,,d' sastraceloc=saslog;
    data work.article;
        set db_amla.fsb_board_mst(
            where=(
                bk_cd = "&bk_cd"
                and board_id = &board_id
                and article_id = &article_id
            )
        );
        *article_title = urldecode("&article_title");
        article_content = urldecode(symget("article_content"));
        last_update_dt = datetime();
    run;
    proc sql noprint;
        connect to oracle();
        execute(
            delete fsb_board_mst
            where 1=1
              and bk_cd = %nrbquote('&bk_cd')
              and board_id = &board_id
              and article_id = &article_id
        ) by oracle;
    quit;
    %put NOTE: &=sysdbrc;
    %put NOTE: SYSDBMSG = %superq(sysdbmsg);

    proc append base=pg.board_mst data=work.article force;
    run;

    %if &sysdbrc ne 0 %then %do;
        %let msg = &sysdbmsg;
    %end;
    %else %do;
        %let msg = Successfully Saved...;
    %end;
%mend updateArticle;

%macro processRegist;
    %saveAttachment;
    %if &msg eq %then %do;
        %updateArticle;
        proc sql noprint;
            select count(*) as cnt into:attach_cnt
            from db_amla.fsb_file_manager
            where bk_cd = "&bk_cd"
              and join_key = article_id
            group by join_key
            ;
        quit;
        %put NOTE: &=attach_cnt;
        %if %symexist(attach_file) %then %do;
        %end;
        %else %do;
            %let attach_cnt = 0;
        %end;
        proc sql;
            update db_alma.fsb_board_mst
            set attachment_id = &attach_cnt
            where bk_cd = "&bk_cd"
              and article_id = &article_id
            ;
        quit;
    %end;
    %else %do;
        %let msg = Faild to save file(s). &msg Contact to system administrator.;
    %end;
%mend processRegist;
%processRegist;

data work.status;
    length msg $1000;
    if "&msg" eq "" then msg = "Successfully Saved...";
    else msg = "&msg";
run;

/*
%if &syscc > 4 %then %do;
    options obs=max no$syntaxcheck;
    %put NOTE: &=syscc;
    data _null_;
        file _webout;
        rc = stpsrvset('program error',0);
        msg = cat('[{"msg":"',"ERROR",'"}]');
        put msg;    
    run;
    %let syscc=0;
%end;
*/
%if %sysfunc(exist(work.status)) %then %do;
    proc json out=_webout pretty nosastags;
        export work.status;
    run;
%end;