%global branch board_id article_id view_cnt msg;
options nosource nosource2 nomprint;
options source source2 nomprint;
options minoperator mindelimiter=',';

options symbolgen;

%macro updateViewCnt;
    proc sql noprint;
        select view_cnt into:view_cnt
        from pg.board_mst
        where 1=1
/*          and bk_cd ="&branch"*/
          and board_id = &board_id
          and article_id = &article_id
        ;
    quit;
    %let view_cnt = %eval(&view_cnt + 1);

    proc sql noprint;
        connect to postgres(&pg_conn);
        execute( 
            update board_mst
            set view_cnt = &view_cnt
            where 1=1
/*              and bk_cd = %nrbuote('&branch')*/
              and board_id = &board_id
              and article_id = &article_id
        ) by postgres;
        disconnect from postgres;
    quit;
    %put NOTE: &=sysdbrc;
    %put NOTE: SYSDBMSG = %superq(sysdbmsg);

    %if &sysdbrc ne 0 %then %do;
        %let msg = %superq(sysdbmsg);
    %end;
    %else %do;
        %let msg = Successfully Saved...;
    %end;
%mend updateViewCnt;
%updateViewCnt;

data work.status;
    msg = "&msg";
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
