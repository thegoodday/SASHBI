$inc "/app/sas/sasv94/config/Lev1/Application/SASHBI/Macro/hbi_auto.sas";

%global bk_cd title period;
options nosource nosource2 nomprint;
$foaautoexec(aml_auto=1, bnk=&bk_cd.BU_PKG);
options source source2 mprint;

%macro fmt_gen(dsname=);
    %let dsid=%sysfunc(open(&dsname));
    %put NOTE: &=dsid;
    %if &dsid %then %do;
        %let nobs=%sysfunc(attrn(&dsid,nlobsf));
        %do %while(%sysfunc(fetch(&dsid)) eq 0);
            %let colname=%sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,name)) ));
            FORMAT &colname comma20.2 %STR(;);
        %end;
        %let rc=%sysfunc(close(&dsid));
    %end;
%mend;
%macro makeData;
    PROC SQL;
        CREATE TABLE work.FSB_BRANCH_IRA AS
        SELECT
           A.BK_CD,
           B.LOV_TYPE_DESC AS BK_NM,
           A.RPT_NO,
           A.TITLE,
           A.PERIOD,
           A.RA_RISK_SCORE,
           A.RA_RISK_RAT,
           A.CUST_DEP_CRR,
           A.CUST_DEP_NEW_CUST,
           A.CUST_DEP_CHANNEL,
           A.CUST_DEP_OTHER_RISK,
           A.CUST_DEP_RISK_RT,
           A.CUST_DEP_RISK_RT_CALC,
           A.CUST_DEP_TRANS_VAL,
           A.CUST_TREASURY_CRR,
           A.CUST_TREASURY_NEW_CUST,
           A.CUST_TREASURY_CHANNEL,
           A.CUST_TREASURY_OTHER_RISK,
           A.CUST_TREASURY_RISK_RT,
           A.CUST_TREASURY_RISK_RT_CALC,
           A.CUST_TREASURY_TRANS_VAL,
           A.CUST_LNED_CRR,
           A.CUST_LNED_NEW_CUST,
           A.CUST_LNED_CHANNEL,
           A.CUST_LNED_OTHER_RISK,
           A.CUST_LNED_RISK_RT,
           A.CUST_LNED_RISK_RT_CALC,
           A.CUST_LNED_TRANS_VAL,
           A.CUST_TD_FIN_CRR,
           A.CUST_TD_FIN_NEW_CUST,
           A.CUST_TD_FIN_CHANNEL,
           A.CUST_TD_FIN_OTHER_RISK,
           A.CUST_TD_FIN_RISK_RT,
           A.CUST_TD_FIN_RISK_RT_CALC,
           A.CUST_TD_FIN_TRANS_VAL,
           A.CUST_COR_BK_CRR,
           A.CUST_COR_BK_NEW_CUST,
           A.CUST_COR_BK_CHANNEL,
           A.CUST_COR_BK_OTEHR_RISK,
           A.CUST_COR_BK_RISK_RT,
           A.CUST_COR_BK_RISK_RT_CALC,
           A.CUST_COR_BK_TRANS_VAL,
           A.CUST_ALL_CRR,
           A.CUST_ALL_NEW_CUST,
           A.CUST_ALL_CHANNEL,
           A.CUST_ALL_OTEHR_RISK,
           A.CUST_RISK_SCORE_AVG,
           A.GEO_DEP_CUST_GEO_RISK_SC,
           A.GEO_DEP_TRANS_CEO_RISK_SC,
           A.GEO_DEP_RISK_RT,
           A.GEO_DEP_RISK_RT_CALC,
           A.GEO_DEP_TRANS_VAL,
           A.GEO_TREASURY_CUST_CEO_RISK_SC,
           A.GEO_TREASURY_TRANS_CEO_RISK_SC,
           A.GEO_TREASURY_RISK_RT,
           A.GEO_TREASURY_RISK_RT_CALC,
           A.GEO_TREASURY_TRANS_VAL,

           /* 짤림(게시판/KakaoTalk_20230112_140701210_05.jpg) */

          
          
          
          
          
          
          
          
          
          
           A.GEO_COR_BK_RISK_RT_CALC,
           A.GEO_COR_BK_TRANS_VAL,
           A.GEO_ALL_CUST_GEO_RISK_SC,
           A.GEO_ALL_TRANS_CEO_RISK_SC,
           A.GEO_RISK_SCORE_AVG,
           A.PROD_DEPOSITS_SUM,
           A.PROD_DEPOSITS_SC,
           A.PROD_DEPOSITS_RT,
           A.PROD_TREASURY_SUM,
           A.PROD_TREASURY_SC,
           A.PROD_TREASURY_RT,
           A.PROD_LENDING_SUM,
           A.PROD_LENDING_SC,
           A.PROD_LENDING_RT,
           A.PROD_FINANCE_SUM,
           A.PROD_FINANCE_SC,
           A.PROD_FINANCE_RT,
           A.PROD_BANKING_SUM,
           A.PROD_BANKING_SC,
           A.PROD_BANKING_RT,
           A.PROD_RISK_SCORE_AVG,
           A.PROD_DEMAND_DEP_SC,
           A.PROD_DEMAND_DEP_TRANS_VAL,
           A.PROD_DEMAND_DEP_RISK_RT,
           A.PROD_TIME_DEP_SC,
           A.PROD_TIME_DEP_TRANS_VAL,
           A.PROD_TIME_DEP_RISK_RT,
           A.PROD_INSTALL_DEP_SC,
           A.PROD_INSTALL_DEP_TRANS_VAL,
           A.PROD_INSTALL_DEP_RISK_RT,
           A.PROD_DOME_FUND_TRSF_SC,
           A.PROD_DOME_FUND_TRSF_TRANS_VAL,
           A.PROD_DOME_FUND_TRSF_RISK_RT,
           A.PROD_EXC_CURR_SC,
           A.PROD_EXC_CURR_VAL,
           A.PROD_EXC_CURR_RT,
           A.PROD_MONEY_MK_LEND_SC,
           A.PROD_MONEY_MK_LEND_TRANS_VAL,
           A.PROD_MONEY_MK_LEND_RISK_RT,
           A.PROD_MONEY_MK_BR_SC,
           A.PROD_MONEY_MK_BR_TRANS_VAL,
           A.PROD_MONEY_MK_BR_RISK_RT,
           A.PROD_PSN_LOAN_SC,
           A.PROD_PSN_LOAN_TRANS_VAL,
           A.PROD_PSN_LOAN_RISK_RT,
           A.PROD_CMCL_LOAN_SC,
           A.PROD_CMCL_LOAN_TRANS_VAL,
           A.PROD_CMCL_LOAN_RISK_RT,
           A.PROD_GUARANTEE_SC,
           A.PROD_GUARANTEE_TRANS_VAL,
           A.PROD_GUARANTEE_RISK_RT,
           A.PROD_OTHER_LAON_SC,
           A.PROD_OTHER_LAON_TRANS_VAL,
           A.PROD_OTHER_LAON_RISK_RT,
           A.PROD_ISSUANCE_LC_SC,
           A.PROD_ISSUANCE_LC_TRANS_VAL,
           A.PROD_ISSUANCE_LC_RISK_RT,
           A.PROD_STANDBY_LC_SC,
           A.PROD_STANDBY_LC_TRANS_VAL,
           A.PROD_STANDBY_LC_RISK_RT,
           A.PROD_NEGO_LC_DP_DA_SC,
           A.PROD_NEGO_LC_DP_DA_TRANS_VAL,
           A.PROD_NEGO_LC_DP_DA_RISK_RT,
           A.PROD_ADVICE_LC_SC,
           A.PROD_ADVICE_LC_TRANS_VAL,
           A.PROD_ADVICE_LC_RISK_RT,
           A.PROD_USD_VND_BK_SC,
           A.PROD_USD_VND_BK_TRANS_VAL,
           A.PROD_USD_VND_BK_RISK_RT,
           A.PROD_INOUT_REMIT_SC,
           A.PROD_INOUT_REMIT_TRANS_VAL,
           A.PROD_INOUT_REMIT_RISK_RT,
           A.OPTIONS,
           A.MODIFY_DATE,
           datepart(A.REG_DATE) as REG_DATE FORMAT=yymmdd10.,
           A.REG_USER,
           A.MODIFY_USER
        FROM SEG_KC.FSB_BRANCH_IRA A
           LEFT JOIN(
               SELECT LOV_TYPE_CODE
                    , LOV_TYPE_DESC
                 FROM SEG_KC.FSK_LOV
                WHERE 1=1
                  AND LOV_TYPE_NAME = "BANK_NAME"
                  AND UPPER(LOV_LANGUAGE_DESC) = UPPER('EN')
           ) B
           
           /* 짤림(게시판/KakaoTalk_20230112_140701210_06.jpg~게시판/KakaoTalk_20230112_140701210_07.jpg) */


           AND USER(A.TITLE) LIKE UPPER("%%&TITLE%")
        %END;

        ORDER BY PERIOD DESC;
        ;
    QUIT;
    proc format;
        value risk_fmt
           0-<4 = 'LOW'
           4-<6 = 'MEDIUM'
           6-high = 'HIGH'
           other = ' '
        ;
    run;

    proc sql;
        create table work.col_info as
        select * from sashelp.vcolumn
        where libname='WORK'
          and memname = 'FSB_BRANCH_IRA'
          and type = 'num'
/*        and scan(name,1,'_') in ('CUST', 'GEO', 'PROD')*/
          and format = ''
        ;
    quit;
    data work.FSB_BRANCH_IRA;
        /*
        length PROD_RISK_SCORE_AVG_J PROD_RISK_SCORE_AVG_M
           PROD_RISK_SCORE_AVG_C
           a1 - a5 b1 - b4 8. ;
        */
        set work.FSB_BRANCH_IRA;
        array value{*} _numeric_;
        do ii=1 to dim(nvalue);
           if nvalue{ii} = . then nvalue{ii} = 0;
        end;

        CUST_ALL_RISK_RT_CALC = put(input(cust_risk_score_avg, &.), risk_fmt.);
        GEO_ALL_RISK_RT_CALC = put(input(geo_risk_score_avg, &.), risk_fmt.);
        PROD_RISK_SCORE_AVG_RT = put(input(prod_risk_score_avg, &.), risk_fmt.);
        /*
        a1 = input(prod_deposits_sum, comma20.) * input(prod_deposits_sc, comma20.) ;
        a2 = input(prod_treasury_sum, comma20.) * input(prod_treasury_sc, comma20.) ;
        a3 = input(prod_lending_sum, camma20.) * input(prod_lending_sc, comma20.) ;

        짤림(게시판/KakaoTalk_20230112_140701210_07.jpg~게시판/KakaoTalk_20230112_140701210_08.jpg)


        b3 = input(prod_lending_sum, comma20.);
        b4 = input(prod_finance_sum, comma20.);
        b5 = input(prod_banking_sum, comma20.);
        PROD_RISK_SCORE_AVG_J = sum(of a1 a2 a3 a4 a5);
        PROD_RISK_SCORE_AVG_M = sum(of b1 b2 b3 b4 b5);
        PROD_RISK_SCORE_AVG_N = PROD_RISK_SCORE_AVG_J / PROD_RISK_SCORE_AVG_M;
        PROD_RISK_SCORE_AVG = put(PROD_RISK_SCORE_AVG_N, comma20.);
        PROD_RISK_SCORE_AVG_RT = put(PROD_RISK_SCORE_AVG_N, risk_fmt.);
        if PROD_RISK_SCORE_AVG_N eq . then PROD_RISK_SCORE_AVG = "0.00";
        */
        *format PROD_RISK_SCORE_AVG comma20.2;
        %fmt_gen(dsname=work.col_info);
    run;


    OPTIONS MRPINT;
    proc datasets lib=work nolist details;
        modify FSB_BRANCH_IRA;
           label
              BK_CD           = 'Branch Code'
              BK_NM           = 'Branch Name'
              TITLE = 'Title'
              PERIOD = 'Period'
              REG_DATE = 'Regist Date'
           ;
    quit;
    proc contents data=work.FSB_BRANCH_IRA out=work.cont;
    run;
    data _null_;
        set work.cont;
        put _all_;
    run;
%mend makeData;
%makeData;

        
%if &syscc > 4 %then %do;
   options obs=max no$syntaxcheck;
   %put NOTE: &=syscc;
   data _null_;
      file _webout;
      rc = stpsrvset('program error',0);
      msg = cat('[{"msg": "',"ERROR",'"}]');
      put msg;
   run;
   %let syscc=0;
%end;
%json4Slick(
    tableName=work.FSB_BRANCH_IRA,
    columns =$str(BK_CD BK_NM TITLE PERIOD REG_DATE),
    width =%str(80 120 1200 100 100).
    css   =%str(c c c c c);
    sort  =%str(1 1 1 1 1 1 1 1 1 1 1 1),
    enableCellNavigation=true,
    enableColumnReorder=false,
    enableAddRow=fasle,
    multiColumnSort=false,
    autoEdit=fasle,
    editable=true,
 /* chkbox=true,*/
    forceFitColumns=true
);






/*
proc sql;
    create table work.FSB_BRANCH_IRA as