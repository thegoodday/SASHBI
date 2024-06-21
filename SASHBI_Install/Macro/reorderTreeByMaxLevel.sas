%macro reorderTreeByMaxLevel(
	inTable=,
	outTable=,
	parentID=,
	id=
);

proc datasets lib=work nolist;
  delete lvl: tlvl: new_aaa new_final/ mt=data;
run;
quit;

/*** 1 level생성 및 t_one,t_two의 갯수 (distinct) **/
proc sort data=&inTable. (keep=&parentID.) out=z1 nodupkey;
   by &parentID.;
run;
proc sort data=&inTable. (keep=&id.) out=x1 nodupkey;
   by &id.;
run;
data lvl1 (rename=(lvl1=&id.)) max;
   merge z1 (in=ina rename=(&parentID.=lvl1))
         x1 (in=inb rename=(&id.=lvl1));
   by lvl1;
   level=1;
   if ina=1 and inb=0 then output lvl1;
   call symput('m_max',_n_);
run;
%let m_max= &m_max;

%let m_chk_cnt=0;
proc sql noprint;
   select count(*) into :m_chk_cnt
   from lvl1;
quit;
%let m_chk_cnt=&m_chk_cnt;

%if &m_chk_cnt > 0 %then %do;
   %put NOTE: level1의 시작점이 &m_chk_cnt.개 존재합니다.;
%end;
%else %do;
   %put ERROR: level1의 시작점이 존재하지 않습니다. ;
   %return;
%end;


   %do i=2 %to &m_max;
      %put :: &i :: 실행합니다 :::::::::::::::::::::::::::: ;
      %let mn = %eval(&i-1);

      %let m_chk_cnt = 0;
      proc sql noprint;
         create table lvl&i as
         select  distinct &parentID., &id. , &i as level
         from &inTable. 
         where &parentID. in (select distinct &id. from lvl&mn)
         order by &parentID. , &id.;
         select count(*) into :m_chk_cnt
         from lvl&i;
      quit;
      %let m_chk_cnt = &m_chk_cnt;

      %if &m_chk_cnt = 0 %then %do;
          %let m_max= &i;
          %goto doend;
      %end;
      proc sql noprint;
         create table tlvl&i as
         %if &i=2 %then %do;
            select a.&id. as lvl&mn , b.&id. as lvl&i
            from lvl&mn a left join lvl&i b
            on a.&id.=b.&parentID.
            order by a.&id., b.&id.
         %end;
         %else %do;
            select a.*, b.&id. as lvl&i
            from tlvl&mn a left join lvl&i b
            on a.lvl&mn = b.&parentID. 
            order by
                    %do j=1 %to &mn;
                       a.lvl&j ,
                    %end;
                       b.&id.
         %end;
         ;
      quit;

   %end;

   %doend:

   data new_aaa;
      length level 8  ;*Ref PntRef $ 10;
      set
        %do k=1 %to &m_max;
           %if &k=1 %then %do;
              lvl1 (rename=(&id.=Ref))
           %end;
           %else %do;
              lvl&k (rename=(&parentID.=PntRef &id.=Ref))
           %end;
        %end;
      ;
   run;
   %let m_n_cnt = %eval(&m_max. - 1);
   data work.pathResult (drop=l);
      n+1;
      set tlvl&m_n_cnt.;
      n_cnt = 0;
      array lvl{*} lvl: ;
      do l=1 to dim(lvl);
         if lvl{l} ^='' then n_cnt + 1;
      end;
   run;
   proc sql noprint;
      select max(n_cnt) into :m_n_cnt
      from work.pathResult;
   quit;
   %put ::: max(미싱이 아닌 변수의 수) ::: &m_n_cnt ;
   %let m_n_cnt = %eval(&m_n_cnt + 1) ;

	data new_final2(keep=n &id.);
	  set work.pathResult;
	  array lvl{*} lvl: ;
	  do i=1 to dim(lvl);
	     *value=input(lvl{i},8.);
	    &id.=lvl{i};
	     if &id. ^=. then output;
	  end;
	run;

	proc sort data=new_final2 out=final nodupkey;
		by &id;
	run;
	proc sort data=final out=resultID ;
		by n;
	run;
	data resultID;
		set resultID;
		_id_=_n_-1;
	run;
	proc sql;
		create table &outTable. as
		select a._id_, b.*
		from work.resultID a left join &inTable. b
		on a.&id. = b.&id.
		order by _id_
		;
	quit;

%mend reorderTreeByMaxLevel;



/*
data tree;
  set sptrv.tree_tree_plot ;
run;

%reorderTreeByMaxLevel(
	inTable=tree,
	outTable=result,
	parentID=parent,
	id=node
);
*/
