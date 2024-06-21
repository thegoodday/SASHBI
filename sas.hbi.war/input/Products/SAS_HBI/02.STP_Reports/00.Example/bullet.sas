/*
[{
        "title":"Revenue",
        "subtitle":"US$, in thousands",
        "ranges":[150,225,300],
        "measures":[220],
        "markers":[250, 100],
        "markerLines":[240, 120],
        "markerLabels":['Target Inventory', 'Low Inventory'],
        "markerLineLabels":['Break even Inventory', 'Threshold Inventory'],
        "rangeLabels":['Maximum Inventory','Average Inventory','Minimum Inventory'],
        "measureLabels":['Current Inventory']
    }]
*/

data work.bullet;
	length
        title               $50
        subtitle            $50
        ranges              $50
        measures            $50
        markers             $50
        markerLines         $50
        markerLabels        $500
        markerLineLabels    $500
        rangeLabels         $500
        measureLabels       $50
	;
    title = "Revenue";   
    subtitle = "US$, in thousands";    
    ranges = "150,225,300";  
    measures = "220";    
    markers = "250, 100"; 
    markerLines = "240, 120"; 
    markerLabels = "'Target Inventory', 'Low Inventory'";    
    markerLineLabels = "'Break even Inventory', 'Threshold Inventory'";    
    rangeLabels = "'Maximum Inventory','Average Inventory','Minimum Inventory'"; 
    measureLabels = "'Current Inventory'";   
run;


proc json out=_webout ;
	write open array;
		write open object;
            write values title "Revenue"; 
            write values subtitle "US$, in thousands";  
            write values ranges "150,225,300";                                                      /* */
            write values measures "220";  
            write values markers "250, 100";                                                        /* */
            write values markerLines "240, 120";                                                    /* */
			write values markerLabels "'Target Inventory', 'Low Inventory'";                        /* */
            write values markerLineLabels "'Break even Inventory', 'Threshold Inventory'";          /* */
            write values rangeLabels "'Maximum Inventory','Average Inventory','Minimum Inventory'"; /* */
            write values measureLabels "'Current Inventory'";                                        
		write close;
	write close;
run;


%macro bullet(dsname);
    proc json out=_webout ;
        write open array;
            write open object;

	%let dsid = %sysfunc(open(&dsname));
	%put NOTE: &=dsid;	
	%let obs = 0;
	
	%let obsnum = %sysfunc(attrn(&dsid,nobs));
	%put NOTE: &=obsnum;

    %if &obsnum %then %do;
    %end;


	%do %while(%sysfunc(fetch(&dsid)) eq 0);
		%let obs = %eval(&obs + 1);
		%put NOTE: &=obs;

		%let title = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,title))));
        %if "&title" ne "" %then %do;
                write values title "&title"; 
        %end;
		%let subtitle = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,subtitle))));
        %if "&subtitle" ne "" %then %do;
                write values subtitle "&subtitle"; 
        %end;
		%let ranges = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,ranges))));
		%put NOTE: &=ranges;
        %if "&ranges" ne "" %then %do;
                write open array;
        %end;
		%let isMany = %eval(%sysfunc(length(&ranges)) - %sysfunc(length(%qsysfunc(compress(%quote(&ranges),%str(,) )) )));
		%put NOTE: &=isMany ;
		%do ii=1 %to &isMany;
			%let range = %scan(%quote(&ranges), &ii, %str(,));
			%put NOTE: &=range;
		%end;
		%let measures = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,measures))));
		%let markers = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,markers))));
		%let markerLines = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,markerLines))));
		%let markerLabels = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,markerLabels))));
		%let markerLineLabels = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,markerLineLabels))));
		%let rangeLabels = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,rangeLabels))));
		%let measureLabels = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,measureLabels))));
		%put NOTE: &=title;
	%end;
	%if &dsid %then %let rc = %sysfunc(close(&dsid));

                                          
		write close;
        write close;
    run;
%mend bullet;
%bullet(work.bullet);
