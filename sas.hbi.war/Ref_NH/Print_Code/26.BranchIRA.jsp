<%/**********************************************************************************
* 주 시스템 명 : MI REPORT
* 화    면    명 : SAS HBI > MI Reports > Monthly > Training Performace Status
* 프로그램  명 : 26.BranchIRA.jsp
* 기           능 : 교육 수행 현황-출력
* 작   성  자 : 황영호
* 작   성  일 : 2022-03-17
* ==============================================================================
* 수정 내역
* NO    수정일	   작업자	 내용
**********************************************************************************/%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.json.JSONArray"%>
<%@ page import="org.json.JSONObject"%>

<%@ page import="java.io.FileNotFoundException"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="java.io.FileOutputStream"%>
<%@ page import="java.io.IOException"%>
<%@ page import="java.io.*"%>
<%@ page import="java.io.util.ArrayList"%>
<%@ page import="java.io.util.Iterator"%>
<%@ page import="java.io.util.List"%>
<%@ page import="java.io.util.Enumeration" %>

<%@ page import="org.apache.log4j.*" %>

<%@ page import="org.apache.poi.ss.usermodel.Cell"%>
<%@ page import="org.apache.poi.ss.usermodel.CellStyle"%>
<%@ page import="org.apache.poi.ss.usermodel.Row"%>
<%@ page import="org.apache.poi.ss.usermodel.Sheet"%>
<%@ page import="org.apache.poi.ss.usermodel.Workbook"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFCell"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFRow"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFSheet"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFWorkbook"%>
<%@ page import="org.apache.poi.xssf.usermodel.HSSFWorkbook"%>

<%@ include file="/jsp/custom_common.jsp" %>
<%
    Logger logger = Logger.getLogger("BranchIRA");
    logger.setLevel(Level.DEBUG);
    logger.debug("26.BranchIRA Print ====================");

    response.setHeader("Pragma", "No-cache");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Expires", "0");

    String userid = (String)request.getParameter("userid");
    String datetime = (String)request.getParameter("datetime");

    String curRowString = (String)request.getParameter("curRow");
    JSONArray curRowL = new JSONArray(curRowString);

    Map<String, Object> curRowMap = new HashMap<String, Object>();
    for(int jj=0; jj < curRowL.length(); jj++) {
        JSONObject rowInfo = (JSONObject) curRowL.get(jj);
        Iterator<?> colkeys = rowInfo.keys();
        while( colkeys.hasNext() ) {
            String keyName = (String) colkeys.next();
            STring keyValue = (String) rowInfo.getString(keyName);
            curRowMap.put(keyName.toLowerCase(), keyValue);
        }
    }
    logger.debug("curRowMap : " + curRowMap.toString());


    //String IN_FILE_PATH = "/app/sas/sasv94/config/Lev1/Web/WebAppServer/SASServer2_1/sas.hbi.war/fileUpload/miReport/template/m1_report_13.xlsx";
    //String OUT_FILE_PATH = "/app/sas/sasv94/config/Lev1/Web/WebAppServer/SASServer2_1/sas.hbi.war/fileUpload/miReport/result/branch_ira_result.xlsx";
    String IN_FILE_PATH = "/app/sas/sasv94/config/Lev1/Web/WebAppServer/SASServer2_1/sas.hbi.war/fileUpload/miReport/template/26.BranchIRA.xlsx";
    String OUT_FILE_PATH = "/tmp/" + userid + "_" + datetime + "_branch_ira_result.xlsx";
    logger.debug("OUT_FILE_PATH : " + OUT_FILE_PATH);

    InputSTream  is = null;
    OUtputStream os = null;
    try{

        is = new FileInputStream(new File(IN_FILE_PATH));

        XLSTransformer transformer = new XLSTransformer();
        Workbook workbook = transformer.transformXLS(is, curRowMap);

        os = new FileOutputStream(new File(IN_FILE_PATH));
        workbook.write(os);
        os.flush();

    } catch(FileNotFoundException e) {
        out.print(e);
    } catch(IOException e) {
        out.print(e);
    } finally {
        try {
            if(is != null) is.close();
            if(os != null) os.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    JSONObject resJson = new JSONObject();
    resJson.put("result", "SUCCESS");
    out.print(resJson.toString());
%>

