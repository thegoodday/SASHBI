%macro getData;
    data work.class;
        length _check_yn $1;
        set sashelp.class;
    run;
    proc contents out=content_class(keep=name type length varnum label) noprint;
    proc sort; by varnum;
    run;
    data work.content_class;
        length 
            NAME $32 TYPE LENGTH VARNUM 8 LABEL $256
            width         8
            formatter     $50
            editor        $50
            css           $50
            sort          8
        ;
		set work.content_class;
		if type eq 1 then css='r';
        if name eq 'Sex' then css='c';
        sort = 1;
        editor = "&etxt";
        if name eq 'Weight' then do;
            editor = "&eflt";
        end;
    run;

    data work.prdsale;
        length _check_yn $1  YEAR 8 QUARTER 8 MONTH 8
            COUNTRY REGION DIVISION $10
            PRODTYPE PRODUCT $10
            ACTUAL PREDICT 8;
        set sashelp.prdsale(obs=1000);
    run;
    proc contents out=content_prdsale(keep=name type length varnum label) noprint;
    proc sort; by varnum;
    run;
    data work.content_prdsale;
        length
            NAME $32 TYPE LENGTH VARNUM 8 LABEL $256
            width         8
            formatter     $50
            editor        $50
            css           $50
            sort          8
            columnGroup   $50
        ;
        set work.content_prdsale;
        if name = "YEAR" then do;
            columnGroup = "기간";
        end;
        if name = "QUARTER" then do; 
            columnGroup = "기간";
        end;
        if name = "MONTH" then do;
            columnGroup = "기간";
        end;
        if name = "COUNTRY" then do;
            columnGroup = "지역";
        end;
        if name = "REGION" then do;
            columnGroup = "지역";
        end;
        if name = "DIVISION" then do;
            columnGroup = "지역";
        end;
        if name = "PRODTYPE" then do;
            columnGroup = "상품";
        end;
        if name = "PRODUCT" then do;
            columnGroup = "상품";
        end;
        if name = "ACTUAL" then do;
            columnGroup = "금액";
            css = "r";
        end;
        if name = "PREDICT" then do;
            columnGroup = "금액";
            css = "r";
        end;
        editor = "&etxt";
        sort = 1;
    run;

    data work.prdsal2;
        length _check_yn $1;
        set sashelp.prdsale(obs=20);
    run;
    proc contents out=content_prdsal2(keep=name type length varnum label) noprint;
    proc sort; by varnum;
    run;
    data work.content_prdsal2;
        length
            NAME $32 TYPE LENGTH VARNUM 8 LABEL $256
            width         8
            formatter     $50
            editor        $50
            css           $50
            sort          8
        ;
        set work.content_prdsal2;
        if name = "PREDICT" then do;
            css = "r";
        end;
        editor = "&etxt";
        sort = 1;
    run;

    data work.cars;
        set sashelp.cars;
    run;
    proc contents out=content_cars(keep=name type length varnum label) noprint;
    proc sort; by varnum;
    run;
    data work.content_cars;
        length
            NAME $32 TYPE LENGTH VARNUM 8 LABEL $256
            width         8
            formatter     $50
            editor        $50
            css           $50
            sort          8
        ;
        set work.content_cars;
        editor = "&etxt";
        sort = 1;
    run;

    data work.tabsInfo;
        length tableID $32 tabLabel $100 infoMsg $32767;

        tableID = "class";      tabLabel = "Class";
		infoMsg = "";
        output;

        tableID = "prdsale";      tabLabel = "매출 1";
        infoMsg = "<li>1. 테이블에 관련되 메시지를 여기에 출력</li>";
        infoMsg = trim(infoMsg)||"<li>2. 테이블에 관련되 메시지를 여기에 출력</li>";
        infoMsg = trim(infoMsg)||"<li>3. 테이블에 관련되 메시지를 여기에 출력</li>";
        output;

        tableID = "prdsal2";      tabLabel = "매출 2";
		infoMsg = "저장시 value 에 대한 정합성 검정/조정 필요시 _STPREPORT_HEADER_JS 를 이용하여 saveDataCust 함수 생성하여 조정.";
        output;

        tableID = "Cars";      tabLabel = "Cars";
        infoMsg = "<li>4. 테이블에 관련되 메시지를 여기에 출력</li>";
        output;
    run;

    data work.options;
        editable = 1;
        autoEdit = 0;
        autosizeColsMode = "LOF";  * LOF / LFF;
        enableCellNavigation = 1 ;
        enableColumnReorder = 1;
        multiColumnSort = 0;
        frozenColumn = 3;
        output;
    run;

    %json4tabGrid(
        tabsInfo = work.tabsInfo
        ,optionsInfo = work.options
/*
        ,addTables = %str(
            tab1_context_type1:work.tab1_context_type1,
            tab1_context_type2:work.tab1_context_type2,
            tab1_context_type3:work.tab1_context_type3,
            tab1_context_type4:work.tab1_context_type4
        )
*/
    );
%mend getData;
%getData;
