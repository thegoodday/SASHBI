%global pgm;
filename slog temp;
filename sout temp;
data _null_;
    length pgm $32767;
    pgm = urldecode(symput('pgm'));
    call symput('dec_pgm',pgm);
    put pgm;
run;
options source source2 mprint mlogic symbolgen;
proc printto log=slog print=sout;run;

&dec_pgm

;*';*";*/;quit;run;

proc printto; run;

    44444444444444
data work.status;
    length msg $250;
    infile slog;
    input ;
    msg=trim(_infile_);
    if msg eq '' then delete;
run;
data work.out;
    length msg $250;
    infile sout;
    input ;
    msg=trim(_infile_);
run;
proc append base=status data=out;
run;

filename slog clear;
filename sout clear;


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


%let pgm=;
%let dec_pgm=;
