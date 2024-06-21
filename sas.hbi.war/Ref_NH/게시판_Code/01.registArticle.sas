%inc "/.../hbi_auto.sas";

%global branch board_id article_id article_title article_content
    v3result v3filepath v3res_cd v3res_msg msg;

options nosource nosource2 noprint;
options source source2 oprint;
options minoperater mindelimiter=',';

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
    %put NOTE: Mcro saveFile start....;

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
                %v3scan(&save_path./&fname);
                %if &v3res_cd eq 0 %then %do;
                    options sastrace=',,,d' sastraceloc=saslog;
                    proc sql noprint;
                        connect to oracle();
                        execute(
                            insert into fsb_file_manager (bk_cd, file_key, join_key, file_name, file_name_org, file_path, create_date)
                            values (
                                %nrbquote('&branch'),
                                fsb_process_seq.NEXTVAL,
                                &join_key,
                                %nrbquote('&fname'),
                                %nrbquote('&wi_filename'),
                                %nrbquote('&save_path'),
                                sysdate
                            )
                        ) by oracle;
                        disconnect from oracle;
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
    proc sql noprint;
        connect to oracle();
        select id into:article_id from connection to oracle(
            select fsb_process_seq.NEXTVAL as id from dual
        );
        disconnect from oracle;
    quit;
    %put NOTE: &=article_id;
    %put NOTE: &=_webin_file_count;

    %if &_webin_file_count > 0 %then %do;
        %if &_webin_file_count =1 %then %do;
            %put NOTE: &=_webin_file_count;
            %saveFile(
                save_path=/app/sas/fileUpload/&branch./boardFile,
                prefix = &branch._&board_id,
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
                    save_path=/app/sas/fileUpload/&branch./boardFile,
                    prefix = &branch._&board_id,
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
    data work.article;
        length
            bk_cd $2
            board_id article_id 8
            article_title $10000
            atricle_content $30000
            reg_user $20
            reg_dt
            attachment_id
            view_cnt
            last_update_dt 8
        ;
        bk_cd = "&branch";
        board_id = &board_id;
        article_id = &article_id;
        article_title = urldecode("article_title");
        article_content = urldecode(symget('article_content'));
        reg_user = "&article_owner";
        reg_dt = datetime();
        attachment_id = &_webin_file_count;
        view_cnt = 0;
        last_update_dt = datetime();
        ouput;
    run;
    proc append base=db_amla.fsb_board_mst data=work.article force;
    run;

    %if &sysdbrc ne 0 %then %do;
        %let msg = &sysdbmsg;
    %end;
%mend registArticle;

%macro processRegist;
    %saveAttachment;
    %if &msg eq %then %do;
        %registArticle;
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
%if %sysfunc(exist(work.status)) %then %do;
    proc json out=_webout pretty nosastags;
        export work.status;
    run;
%end;