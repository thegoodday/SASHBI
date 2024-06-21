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
	/*
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
	output; 
	*/
    title = "Revenue2";   
    subtitle = "US$, in thousands2";    
    ranges = "150,225,300";  
    measures = "220";    
    markers = "250, 100"; 
    markerLines = "240, 120"; 
    markerLabels = "'Target Inventory', 'Low Inventory'";    
    markerLineLabels = "'Break even Inventory', 'Threshold Inventory'";    
    rangeLabels = "'Maximum Inventory','Average Inventory','Minimum Inventory'"; 
    measureLabels = "'Current Inventory'";  
	output; 
run;


%macro bullet(dsname);
	%let dsid = %sysfunc(open(&dsname));
	%put NOTE: &=dsid;	
	%let obs = 0;
	
	%let obsnum = %sysfunc(attrn(&dsid,nobs));
	%put NOTE: &=obsnum;


proc json out=_webout ;
	write open array;

	%do %while(%sysfunc(fetch(&dsid)) eq 0);
		write open object;
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
		%if "&ranges" ne "" %then %do;
			%let isMany = %eval(%sysfunc(length(&ranges)) - %sysfunc(length(%qsysfunc(compress(%quote(&ranges),%str(,) )) )));
			%put NOTE: &=ranges &=isMany;
			write values "ranges" ;
			write open array; 
			%do ii=1 %to %eval(&isMany + 1);
				%let range = %scan(%quote(&ranges), &ii, %str(,));
            	write values &range.;   
			%end;                           
			write close;  
		%end;
		
		%let measures = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,measures))));
		%if "&measures" ne "" %then %do;
			write values "measures" ;
			write open array; 
            	write values &measures.;         
			write close;  
		%end;
		%let markers = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,markers))));
		%if "&markers" ne "" %then %do;
			%let isMany = %eval(%sysfunc(length(&markers)) - %sysfunc(length(%qsysfunc(compress(%quote(&markers),%str(,) )) )));
			%put NOTE: &=markers &=isMany;
			write values "markers" ;
			write open array; 
			%do ii=1 %to %eval(&isMany + 1);
				%let marker = %scan(%quote(&markers), &ii, %str(,));
            	write values &marker.;   
			%end;                           
			write close;  
		%end;
		%let markerLines = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,markerLines))));
		%if "&markerLines" ne "" %then %do;
			%let isMany = %eval(%sysfunc(length(&markerLines)) - %sysfunc(length(%qsysfunc(compress(%quote(&markerLines),%str(,) )) )));
			%put NOTE: &=markerLines &=isMany;
			write values "markerLines" ;
			write open array; 
			%do ii=1 %to %eval(&isMany + 1);
				%let markerLine = %scan(%quote(&markerLines), &ii, %str(,));
            	write values &markerLine.;   
			%end;                           
			write close;  
		%end;
		%let markerLabels = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,markerLabels))));
		%if "&markerLabels" ne "" %then %do;
			%let isMany = %eval(%sysfunc(length(&markerLabels)) - %sysfunc(length(%qsysfunc(compress(%quote(&markerLabels),%str(,) )) )));
			%put NOTE: &=markerLabels &=isMany;
			write values "markerLabels" ;
			write open array; 
			%do ii=1 %to %eval(&isMany + 1);
				%let markerLabel = %scan(%quote(&markerLabels), &ii, %str(,));
            	write values &markerLabel.;   
			%end;                           
			write close;  
		%end;
		%let markerLineLabels = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,markerLineLabels))));
		%if "&markerLineLabels" ne "" %then %do;
			%let isMany = %eval(%sysfunc(length(&markerLineLabels)) - %sysfunc(length(%qsysfunc(compress(%quote(&markerLineLabels),%str(,) )) )));
			%put NOTE: &=markerLineLabels &=isMany;
			write values "markerLineLabels" ;
			write open array; 
			%do ii=1 %to %eval(&isMany + 1);
				%let markerLineLabel = %scan(%quote(&markerLineLabels), &ii, %str(,));
            	write values &markerLineLabel.;   
			%end;                           
			write close;  
		%end;
		%let rangeLabels = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,rangeLabels))));
		%if "&rangeLabels" ne "" %then %do;
			%let isMany = %eval(%sysfunc(length(&rangeLabels)) - %sysfunc(length(%qsysfunc(compress(%quote(&rangeLabels),%str(,) )) )));
			%put NOTE: &=rangeLabels &=isMany;
			write values "rangeLabels" ;
			write open array; 
			%do ii=1 %to %eval(&isMany + 1);
				%let rangeLabel = %scan(%quote(&rangeLabels), &ii, %str(,));
            	write values &rangeLabel.;   
			%end;                           
			write close;  
		%end;
		%let measureLabels = %sysfunc(getvarC(&dsid, %sysfunc(varnum(&dsid,measureLabels))));
		%if "&measureLabels" ne "" %then %do;
			%let isMany = %eval(%sysfunc(length(&measureLabels)) - %sysfunc(length(%qsysfunc(compress(%quote(&measureLabels),%str(,) )) )));
			%put NOTE: &=measureLabels &=isMany;
			write values "measureLabels" ;
			write open array; 
			%do ii=1 %to %eval(&isMany + 1);
				%let measureLabel = %scan(%quote(&measureLabels), &ii, %str(,));
            	write values &measureLabel.;   
			%end;                           
			write close;  
		%end;
		%put NOTE: &=title;
		write close;
	%end;
	%if &dsid %then %let rc = %sysfunc(close(&dsid));
	                       
	write close;
run;
%mend bullet;
%bullet(work.bullet);
