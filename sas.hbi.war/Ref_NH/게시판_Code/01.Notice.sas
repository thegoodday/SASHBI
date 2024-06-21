%inc "/app/sas/sasv94/config/Lev1/Applications/SASHBI/Macro/hbi_auto.sas";

%global branch title period grpLevel;
options nosource nosource2 nomprint;
%focautoexec(fcf_auto=1, bnk=GBBU_PKG);
options source source2 mprint;
/*
%let grpLevel=4;
%let branch=GB;
%let SEARCH_DATE_START=2022-03-13;
%let SEARCH_DATE_END=2022-04-13;

*/

%macro makeData;

proc sql noprint;
    create table work.fsb_board_mst as
    select *
    from db_amla_fsb_board_mst
    where 1=1
      and board_id = 1000;
     and datepart(reg_dt) between input("%SEARCH_DATE_START",yymmdd10.) and input ("%SEARCH_DATE_END",yymmdd10.)
    %if &branch ne %then %do;
          %if &grpLevel < 4 %then %do;
      and bk_cd in ("GB", "&branch")
       %end;
       %else %do;
      and bk_cd in ("&branch")
       %end;
    %end;
    order by LAST_UPDATE_DT descending
    ;
quit;

proc format;
    value &branch
        'GB' = 'Global'
        'HK' = 'Hong Kong'
        'SD' = 'Sydeny'
        'BJ' = 'Beijing'
        'HN' = 'Hanoi'
    ;
run;


data work.fsb_board_mst;
    length no &;
    set work.fsb_board_mst;
    NO=_n_;
    *format bk_cd &branch.;
    BK_NM=put(bk_cd, &branch.);
    REG_DT2 = put(datepart(REG_DT),yymmdd10.)||' '||put(timepart(REG_DT),time.);
    LAST_UPDATE_DT2 = put(datepart(LAST_UPDATE_DT),yymmdd10.)||' '||put(timepart(LAST_UPDATE_DT),time.);
    label
          BK_CD          = 'Branch Code'
          BK_NM          = 'Branch Name'
          BORAD_ID          = 'BORAD_ID       '
          ARTICLE_ID        = 'Article ID     '
          ARTICLE_TITLE     = 'Article Title  '
          ARTICLE_CONTENT   = 'ARTICLE_CONTENT'
          REG_USER          = 'Registrant     '
          REG_DT            = 'Registration Date'
          REG_DT2            = 'Registration Date'
          ATTACHMENT_ID     = 'Attachment YN  '
          VIEW_CNT          = 'View count     '
          LAST_UPDATE_DT     = 'Last Update Date'
          LAST_UPDATE_DT2     = 'Last Update Date'
          NO                = 'No'
    ;
run;;

%mend makeData;
%makeData;



%if &syscc > 4 %then %do;
   options obs=max no$syntaxcheck;
   %put NOTE : &=syscc;
   data _null_;
      file _webout;
      rc = stpsrvset('program error',0);
      msg = cat('[{"msg":"',"ERROR",'"}]');
      put msg;
   run;
   %let syscc=0;
%end;
%jaon4Slick(
    tableName=work.fsb_board_mst,
    columns  =%str(
        BORAD_ID no ARTICLE_ID BK_CD BK_NM
        ARTICLE_TITLE ATTACHMENT_ID REG_USER VIEW_CNT REG_DT2
        LAST_UPDATE_DT2
    ),
    width =%str(
        60 10 40 60 60 400
        50 80 40 100 100
        120 100 100 40 100
        60 100 60 100 100
    ),
    css  =%str(
        c c c c c l
        c c c c c
        c c c c c
        c c c c c
    ),
    sort  =%str(
        1 1 1 1 1
        1 1 1 1 1
        1 1 1 1 1
        1 1 1 1 1
    ),
    enableCellNavigation=true,
    enableColumnReorder=false,
    enable_AddRow=fasle,
    multiColumnSort=false,
    autoEdit=false,
    editable=true,
    chkbox=true,
    forceFitColumns=true
);