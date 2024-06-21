%macro reorderTree(
	inTable=,
	outTable=,
	parentID=,
	id=,
	pid=
);
%local dsid node nobs ;
%put --------------------;
%put NOTE: PID = &pid;

%let dsid=%sysfunc(open(&inTable(where=(&parentID=&pid))));
%*put NOTE: dsid : &dsid;
%if &dsid %then %do;
	%let nobs=%sysfunc(attrn(&dsid,nlobsf));
   %*put ::: &nobs;

	%do %while(%sysfunc(fetch(&dsid)) eq 0);
			%let node=%sysfunc(getvarN(&dsid, %sysfunc(varnum(&dsid,&id)) ));
			%put NOTE: ID = &node ;
			proc append base=&outTable data=&inTable(where=(&id=&node)); 
			run;
			%reorderTree(
					inTable=%str(&inTable),
					outTable=%str(&outTable),
					parentID=%str(&parentID),
					id=%str(&id),
					pid=%str(&node));
			%put NOTE: ID : &node;
	%end;
   %*put ::: close dsid=&dsid;
	%let rc=%sysfunc(close(&dsid));
%end;
%mend;

/*
options nomprint nomlogic;
proc delete data=work.reorder; run;
%reorderTree(
	inTable=%str(sptrv.tree_tree_plot),
	outTable=%str(work.reorder),
	parentID=%str(parent),
	id=%str(node),
	pid=%str(.)
);
*/
