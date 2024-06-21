%inc "/..../hbi_auto.sas";

%global branch board_id article_id view_cnt msg;
options nosource nosource2 noprint;
options source source2 oprint;
options minoperater mindelimiter=',';

options symbolgen;

%macro updateViewCnt;
    proc sql noprint;
        select view_cnt into:view_cnt
        from db_amla.fsb_board_mst
        where 1=1
          and bk_cd ="&branch"
          and board_id = &board_id
          and article_id = &article_id
        ;
    quit;
    %let view_cnt = %eval(&view_cnt + 1);

    proc sql noprint;
        connect to oracle();
        execute( 
            update fsb_board_mst
            set view_cnt = &view_cnt
            where 1=1
              and bk_cd = %nrbuote('&branch')
              and board_id = &board_id
              and article_id = &article_id
        ) by oracle;
        disconnect from oracle;
    quit;
    %put NOTE: &=sysdbrc;
    %put NOTE: SYSDBMSG = %superq(sysdbmsg);

    %if &sysdbrc ne - %then %do;
        %let msg = %superq(sysdbmsg);
    %end;
    %else %do;
        %let msg = Successfully Saved...;
    %end;
%mend updateViewCnt;

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