%inc "/.../hbi_auto.sas";


%global branch board_id article_id ischk msg;

options nosource nosource2 noprint;
options source source2 oprint;
options minoperater mindelimiter=',';
options symbolgen;

%macro deleteArticle;
    %let sysdbmsg = ;
    %if "&bk_cd" eq "" %then %let bk_cd = GB;
    proc sql;
        create table work.file_info as
        select * from db_amla.fsb_file_manager
        where 1=1
          and bk_cd = "&bk_cd"
          and join_ke in (&article_id)
        ;
    quit;
    %let attachCnt = &sysnobs;
    proc sql noprint;
        connect to oracle();
        execute(
            delete fsb_board_mst
            where 1=1
              and bk_cd = %nrbquote('&bk_cd')
              and board_id = &board_id
              and article_id in (&article_id)
        ) by oracle;
        %put NOTE: &=sysdbrd;
        %put NOTE: SYSDBMSG = %superq(sysdbmsg);
        
    %if &attachCnt > 0 and &sysdbrc eq 0 %then %do;
        execute(
            delete fsb_file_manager
            where 1=1
            and bk_cd = %nrbquote('&bk_cd')
            and join_key in (&article_id)
        ) by oracle;
        %put NOTE: &=sysdbrd;
        %put NOTE: SYSDBMSG = %superq(sysdbmsg);
    %end;
        
        disconnect from oracle;
    quit;

    %if &sysdbrc ne 0 %then %do;
        %let msg = %superq(sysdbmsg);
    %end;
    %else %do;
        %let msg = Successfully Deleted...;
        data _null_;
            set work.file_info;
            cmd = cat("rm -f ", compress(file_path||'/'||file_name));
            call system(cmd);
            put 'NOTE: ' cmd;
        run;
    %end;
%mend deleteArticle;
%deleteArticle;

data work.status;
    msg = "&msg";
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
