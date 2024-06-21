goptions target = gif;
/* ods html body = "example1.html"; */
proc format;
   value webfmt
   1='href="http://www.sas.com/"'
   2='href="http://www.sas.com/service/techsup/faq/qc/shewproc.html"'
   3='href="http://www.sas.com/rnd/app/qc.html"'
   4='href="http://www.sas.com/rnd/app/qc/qcnew.html"'
   5='href="http://www.sas.com/rnd/app/qc/qc.html"'
   ;
data Times;
   informat Day date7. ;
   format   Day date7. ;
   input Day @ ;
   do Flight=1 to 25;
      input Delay @ ;
      output;
   end;
   datalines;
16DEC88   4  12   2   2  18   5   6  21   0   0
          0  14   3   .   2   3   5   0   6  19
          7   4   9   5  10
17DEC88   1  10   3   3   0   1   5   0   .   .
          1   5   7   1   7   2   2  16   2   1
          3   1  31   5   0
18DEC88   7   8   4   2   3   2   7   6  11   3
          2   7   0   1  10   2   3  12   8   6
          2   7   2   4   5
19DEC88  15   6   9   0  15   7   1   1   0   2
          5   6   5  14   7  20   8   1  14   3
         10   0   1  11   7
20DEC88   2   1   0   4   4   6   2   2   1   4
          1  11   .   1   0   6   5   5   4   2
          2   6   6   4   0
21DEC88   2   6   6   2   7   7   5   2   5   0
          9   2   4   2   5   1   4   7   5   6
          5   0   4  36  28
22DEC88   3   7  22   1  11  11  39  46   7  33
         19  21   1   3  43  23   9   0  17  35
         50   0   2   1   0
23DEC88   6  11   8  35  36  19  21   .   .   4
          6  63  35   3  12  34   9   0  46   0
          0  36   3   0  14
24DEC88  13   2  10   4   5  22  21  44  66  13
          8   3   4  27   2  12  17  22  19  36
          9  72   2   4   4
25DEC88   4  33  35   0  11  11  10  28  34   3
         24   6  17   0   8   5   7  19   9   7
         21  17  17   2   6
26DEC88   3   8   8   2   7   7   8   2   5   9
          2   8   2  10  16   9   5  14  15   1
         12   2   2  14  18
;


run;
data work.Times;
	length href phref $200;
   set work.Times;
   href = "href='javascript:alertMsg2(" || '"'|| put(Day,date7.) ||Delay||'"'|| ");'";
   ohhref = "href='javascript:alertMsg2(" || '"OUT High :'|| put(Day,date7.) ||Delay ||'"'|| ");'";
   olhref = "href='javascript:alertMsg2(" || '"OUT Low :'|| put(Day,date7.) ||Delay ||'"'|| ");'";
   olhref = "href='javascript:alertMsg2(" || '"Point Low :'|| put(Day,date7.) ||Delay ||'"'|| ");'";
run;
proc means data=Times noprint;
   var Delay;
   by Day ;
   output out=Cancel nmiss=Ncancel;

data Times;
   merge Times cancel;
   by Day;
run;
data Weather;
   informat Day date7. ;
   format   Day date7. ;
   length Reason $ 16 ;
   input Day Flight Reason & ;
   datalines;
16DEC88  8   Fog
17DEC88  18  Snow Storm
17DEC88  23  Sleet
21DEC88  24  Rain
21DEC88  25  Rain
22DEC88  7   Mechanical
22DEC88  15  Late Arrival
24DEC88  9   Late Arrival
24DEC88  22  Late Arrival
;

data Times;
   merge Times Weather;
   by Day Flight;
run;

   proc shewhart data=Times;
      where Day <= '21DEC88'D;
      boxchart Delay * Day /
         nochart
         outlimits=Timelim;
   run;


ods html file=_webout (no_top_matter no_bottom_matter)
	path=&_tmpcat(url=&_replay) STYLE=HtmlBlue;
title 'Boxplot Control Chart';
symbol1 value=DIAMONDFILLED color=orange;
symbol2 value=DIAMONDFILLED color=blue;
symbol3 value=DIAMONDFILLED color=red;
proc shewhart data=Times /* limits=Timelim */;
   boxchart Delay * Day = Ncancel /
      /* nohlabel */
      /* nolegend */
      boxstyle      = schematic /* schematic SCHEMATICIDFAR*/
      /* odstitle      = title */
      boxwidthscale = 2
      NOFRAME 
      /* CLIPSYMBOL=dot */
      CSTARS = orange
      grid
      CGRID= "#d0def7"
      html = href
      outhighhtml= ohhref
      pointshtml= olhref
      ;
run;


title 'Analysis of Airline Departure Delays';
/* TITLE10 "NOFROZEN"; */
proc print data=Times(drop=href ohhref olhref phref) obs;
   var _character_   /style(header)={TEXTALIGN=CENTER width=200px};
   var _numeric_     /style(header)={TEXTALIGN=CENTER width=100px};
run;quit;
ods html close;
