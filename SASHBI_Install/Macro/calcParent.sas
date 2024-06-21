%macro calcParent(table=,class=);
	%let class=%sysfunc(compbl(&class));

	%let clsNum=%eval(%length(&class)-%length(%sysfunc(compress(&class,%str( ))))+1);
	%put NOTE: &clsNum;
	    options mprint nomlogic;
	proc sort data=&table out=&table._sort;
		by &class;
	run;
	data work.summ0;
		set &table._sort;
		by &class;
		id=_n_-1;
		if _type_ ne 0 then parent=0;
		type2=put(_type_,binary&clsNum..);
		pid=.;
	run;
	proc sql;
	%do ii=1 %to &clsNum-1;
		%let type1=%sysfunc(repeat(1,%eval(&ii-1)));
		%let type0=%sysfunc(repeat(0,%eval(&clsnum-&ii-1)));
		%let type=&type1&type0;
		create table pid&ii as
		select distinct 
		%do jj=1 %to &ii;
			%let varname=%scan(&class,&jj);
			&varname ,
			%end;
			id
			from work.summ0
			where put(_type_,binary&clsNum..) eq "&type"
			order by 
			%do kk=1 %to &ii;
				%let varname=%scan(&class,&kk);
				%if &kk eq 1 %then %do;
				&varname
			%end;
			%else %do;
			   ,&varname
			%end;
		%end;
		;
	%end;
	quit;
	%do ii=1 %to &clsNum-1;
		%let type1=%sysfunc(repeat(1,%eval(&ii-0)));
		%let type0=;
		%if %eval(&clsnum-&ii) > 1 %then %do;
			%let type0=%sysfunc(repeat(0,%eval(&clsnum-&ii-2)));
		%end;
		%let type=&type1&type0;
		%let tid=%eval(&ii-1);
		data work.summ&ii;
			merge work.summ&tid (drop=pid) pid&ii (rename=(id=pid));
			by 
			%do jj=1 %to &ii;
				%let varname=%scan(&class,&jj);
				&varname 
			%end;
			;
			if put(_type_,binary&clsNum..) eq "&type" then parent=pid;
	%end;
		run;

	data work.tree;
		length id indent parent 8 title $100;
		set _last_;
		indent=length(compress(type2,'0'));
		if id eq 0 then indent=0;
		if _type_ eq 0 then 		title="_Total_";
	%do ii=1 %to &clsNum-0;
		%let type1=%sysfunc(repeat(1,%eval(&ii-1)));
		%let type0=;
		%if %eval(&clsnum-&ii) > 0 %then %do;
			%let type0=%sysfunc(repeat(0,%eval(&clsnum-&ii-1)));
		%end;
		%let type=&type1&type0;
		else if type2 eq "&type" then 		title=%scan(&class,&ii,%str( ));
	%end;
		format _freq_ comma20.;
		label _freq_='ºóµµ¼ö';
	run;
%mend calcParent;

/*
%calcParent(
	table=work.summ,
	class=%str(country,region,division)
);
*/