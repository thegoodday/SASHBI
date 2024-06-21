


data work.kk;
	var1="&var1";
	var2="&var2";
run;

proc append base=hbidemo.input data=work.kk force;
run;


%json4Slick(
	tableName=hbidemo.input
);
