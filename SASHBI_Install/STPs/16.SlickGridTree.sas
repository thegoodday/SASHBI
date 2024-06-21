%inc "/sas/sasv94/config/Lev1/Applications/SASHBI/Macro/hbi_init.sas";

options validvarname=any;

proc summary data=HBIDEMO.PRDSALE(where=(product="&product"));
	class country region division ;
	var actual predict;
	format actual predict comma10.;
	output out=summ(where=(put(_type_,binary3.) in ('000','100','110','111'))) sum=;
run;
%calcParent(
	table=work.summ,
	class=%str(country region division)
);
proc datasets library=work nolist;
   modify tree;
      label title='Region';
quit;

%json4Slick(
	tableName=work.tree,
	columns	=%str(title _FREQ_ ACTUAL PREDICT),
	width		=%str(220 120 120 120),
	css		=%str(l r r r),
	resize	=%str(1 1 1 1),
	formatter=%str(TaskNameFormatter),
  	editable=false,
  	enableAddRow=false,
  	enableCellNavigation=true,
  	asyncEditorLoading=false,
	isTree=1
);
