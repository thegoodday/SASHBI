package com.sas.hbi.tools;
import java.io.* ;

import org.jdom.* ;
import org.jdom.input.* ;

import java.sql.Connection ;
import java.sql.SQLException;
import java.util.* ;
import java.util.regex.*;

import org.apache.log4j.Logger; 
import org.apache.poi.xssf.streaming.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.*;

import com.sas.storage.jdbc.JDBCToTableModelAdapter;
import com.sas.table.TableException;
import com.sas.prompts.valueprovider.dynamic.DataProvider;
import com.sas.hbi.property.HBIConfig;
import com.sas.rio.MVAConnection;
import com.sas.iom.SAS.IDataService;
import com.sas.iom.SAS.IWorkspace;
import com.sas.iom.SASIOMDefs.GenericError;


public class POI {
	private DataProvider dataProvider = null;
	private String libPhysicalPath = null;
	private String libStmt = null;
	private String logicalServerName = null;
	private IWorkspace sasConn = null;
	private IDataService dService = null;
	private Connection sqlConnection = null;
	private JDBCToTableModelAdapter modelConn = null;
	private int rowCount = 0;
	private int columnCount = 0;
	Logger logger=Logger.getLogger(getClass().getName());
	/**
	 * @param args
	 */
	public POI(String logicalServerName, String libPhysicalPath, DataProvider dataProvider){
		this.logicalServerName = logicalServerName;
		this.libPhysicalPath = libPhysicalPath;
		this.dataProvider = dataProvider;
	}
	public JDBCToTableModelAdapter getModelConnection(String targetData) throws IOException{
		libStmt="LIBNAME WTEMP '" + libPhysicalPath + "'; \n";
    	//Properties conf = new HBIConfig().getConfig();
		HBIConfig hbiconf = HBIConfig.getInstance();
		Properties conf = hbiconf.getConf();

    	String connMethod = conf.getProperty("stp.connMethod").trim();
    	logger.debug("connMethod : " + connMethod);

		try {
			if (connMethod.equalsIgnoreCase("dataProvider")){
				sasConn=SASConnection.getWorkspace(dataProvider,logicalServerName,libStmt);
			} else {
				String serverType = conf.getProperty("stp.serverType").trim();
		    	String serverName = conf.getProperty("stp.serverName").trim();
		    	int port = Integer.parseInt(conf.getProperty("stp.port").trim());
		    	String userName = conf.getProperty("stp.userName").trim();
		    	String password = conf.getProperty("stp.password").trim();
		    	logger.debug("serverType : " + serverType);
		    	logger.debug("serverName : " + serverName);
		    	logger.debug("port : " + port);
		    	logger.debug("userName : " + userName);
		    	logger.debug("password : " + password);
		    	logger.debug("libStmt : " + libStmt);
		    	sasConn=SASConnection.getWorkspace(serverType, serverName, port, userName, password, libStmt);
			}
			dService = sasConn.DataService();
			sqlConnection = new MVAConnection(dService,new Properties());
			modelConn=new JDBCToTableModelAdapter();
			modelConn.setModel(sqlConnection);
			modelConn.setReadOnly(false);
			modelConn.setTrimUsed(true);
			modelConn.setFormattedDataUsed(true);		
			modelConn.setQueryStatement("select * from wtemp." + targetData + "\n");
			modelConn.setReadAheadAmount(100000);
			rowCount=modelConn.getRowCount();
			columnCount=modelConn.getColumnCount();
			logger.info("rowCount\t: "+rowCount);
			logger.info("columnCount\t: " + columnCount);
		} catch(Exception ex) {
			ex.printStackTrace();
		}	
		return modelConn;
	}
	public JDBCToTableModelAdapter getTModelAdapter(){
		return modelConn;
	}
	public Connection getSQLConn(){
		return sqlConnection;
	}
	public IWorkspace getSASConnection(){
		return sasConn;
	}
	public void closeConnection() throws SQLException, GenericError{
		modelConn.close();
		sqlConnection.close();
		sasConn._release();
		//sasConn.Close();
	}
	public String getLibStatement(){
		return libStmt;
	}
	public Document CreateHeaderDocument(String data, String libPhysicalPath, DataProvider dataProvider, String targetData) 
			throws JDOMException, IOException, SQLException, TableException {
		String html = data;
		
		if (html != null) {
			int tableStartIndex = html.indexOf("<table");
			int tableEndIndex = html.indexOf(">", tableStartIndex);
			
			String dummy = html.substring(tableStartIndex + "<table".length(), tableEndIndex);
			
			html = html.replace("\n", "");
			html = html.replace("\r", "");	
			html = html.replace(dummy, "");
		
			html = html.replaceAll("</TABLE", "</table").replaceAll("<TABLE", "<table");
			html = html.replaceAll("</TH>", "</th>").replaceAll("<TH", "<th");
			html = html.replaceAll("</TD", "</td").replaceAll("<TD", "<td");
			html = html.replaceAll("<BR", "<br");
		
			
			html = html.replaceAll("<br>", "<br/>");
			html = html.replaceAll("<table>", "<table>\n");
			html = html.replaceAll("<tr>", "<tr>\n").replaceAll("</tr>", "</tr>\n");
			html = html.replaceAll("</th>", "</th>\n");	
		} else {
			modelConn=getModelConnection(targetData);
			int dataCount = 0;
			html="<table>\n";
			html+="<tr>\n";
			dataCount++;
			for(int colNum=0;colNum<columnCount;colNum++){
				html+="<th>"+ modelConn.getColumnInfo(colNum+1, "LABEL").toString() + "</th>\n";
			}
			html+="</tr>\n";
			html+="</table>\n";
			modelConn.close();			
			
		}
		
		logger.debug("html: " + html);

		StringReader sr = new StringReader(html);
		BufferedReader br = new BufferedReader(sr);
		
		String clearHtml = "";
		String aLine = null;
		
		while( (aLine = br.readLine()) != null) {
			
			if(aLine.indexOf("<th") > -1) {
				String span = "";
				int index = -1;
				Pattern patternColspan = Pattern.compile("(?i)colspan[ ]*=[ ]*[\"']?[0-9]+[\"']?");
				Matcher matcherColspan = patternColspan.matcher(aLine);

				if(matcherColspan.find()) {
					String tempStr = "";
					
					tempStr = matcherColspan.group();
					tempStr = tempStr.replaceAll("\"", "").replaceAll("'", "");
					
					Pattern patternDigit=Pattern.compile("[0-9]+");
					Matcher matcherDigit=patternDigit.matcher(tempStr);
					if(matcherDigit.find()) {
						span += " colspan=\"" + matcherDigit.group() + "\"";
					}
				}

				Pattern patternRowspan = Pattern.compile("(?i)rowspan[ ]*=[ ]*[\"']?[0-9]+[\"']?");
				Matcher matcherRowspan = patternRowspan.matcher(aLine);

				if(matcherRowspan.find()) {
					String tempStr = "";
					
					tempStr = matcherRowspan.group();
					tempStr = tempStr.replaceAll("\"", "").replaceAll("'", "");
					
					Pattern patternDigit=Pattern.compile("[0-9]+");
					Matcher matcherDigit=patternDigit.matcher(tempStr);
					if(matcherDigit.find()) {
						span += " rowspan=\"" + matcherDigit.group() + "\"";
					}
				}
				
				Pattern patternScript=Pattern.compile("<th(?i)(.*?)>");
				Matcher matcherContent=patternScript.matcher(aLine);
				aLine=matcherContent.replaceAll("");
				
				clearHtml += "<th" + span + ">" + aLine.trim() + "\n";
			}
			else {
				clearHtml += aLine + "\n";
			}
		}

		//System.out.println(clearHtml);

		sr.close();
		SAXBuilder builder = new SAXBuilder();		
		StringReader sr2 = new StringReader(clearHtml);		
		Document doc = builder.build(sr2);		 
		sr2.close();
		return doc;

	}
	
	public boolean IsMergedCell(Sheet sh, Cell cell) {
		int mergedRangeNum = sh.getNumMergedRegions();
		
		for(int i = 0; i < mergedRangeNum; i++) {
			CellRangeAddress range = sh.getMergedRegion(i);
			
			if( range.isInRange(cell.getRowIndex(), cell.getColumnIndex()) == true ) {
				return true;
			}
		}
		
		return false;
	}
	public void CreateHeader(SXSSFWorkbook wb, Sheet sh, int maxRowNum, int maxColNum, Element root) {
		/* 헤더 폰트 지정 */
		Font headerFont = wb.createFont();
		headerFont.setBoldweight(Font.BOLDWEIGHT_BOLD);

		/* 헤더 스타일 지정 */
		CellStyle headerStyle = wb.createCellStyle();
		
		headerStyle.setBorderTop(CellStyle.BORDER_THIN);
		headerStyle.setBorderLeft(CellStyle.BORDER_THIN);
		headerStyle.setBorderRight(CellStyle.BORDER_THIN);
		headerStyle.setBorderBottom(CellStyle.BORDER_THIN);
		headerStyle.setBottomBorderColor((short)0x0 );
		headerStyle.setAlignment(CellStyle.ALIGN_CENTER);
		headerStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		headerStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
		headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		headerStyle.setFont(headerFont);
		

		/* 빈 영역 미리 생성 */
		for(int rownum = 0; rownum < maxRowNum; rownum++){
	        Row row = sh.createRow(rownum);
	        
	        for(int cellnum = 0; cellnum < maxColNum; cellnum++){
	        	Cell cell = row.createCell(cellnum);
	        	
	        	cell.setCellStyle(headerStyle);
	            cell.setCellValue("");
	        }
	    }
		

		/* 셀 너비 지정 */
		for(int cellnum = 0; cellnum < maxColNum; cellnum++) {
			sh.setColumnWidth(cellnum, 4000);
		}
		

		for(int rownum = 0; rownum < maxRowNum; rownum++){

			Element targetRow = (Element)root.getChildren().get(rownum);
			int elementColIndex = 0;

	        Row row = sh.getRow(rownum);
	       
	        for(int cellnum = 0; cellnum < maxColNum; cellnum++){
				Cell cell = row.getCell(cellnum);
	        	
	        	if(IsMergedCell(sh, cell) == false) {
	        		Element aElement = (Element)targetRow.getChildren().get(elementColIndex);
	        		int rowspan = 0;
	        		int colspan = 0;
	        		
	        		Attribute rowspanAttr = aElement.getAttribute("rowspan");
	        		Attribute colspanAttr = aElement.getAttribute("colspan");
	        		
	        		if(rowspanAttr != null) {
	        			rowspan = Integer.parseInt(rowspanAttr.getValue()) - 1;
	        		}
	        		
	        		if(colspanAttr != null) {
	        			colspan = Integer.parseInt(colspanAttr.getValue()) - 1;
	        		}
	        		
	        		if(rowspan > 0 || colspan > 0) {
	        			sh.addMergedRegion(new CellRangeAddress(rownum, rownum + rowspan, cellnum, cellnum + colspan));
	        		}
	        		
	        		elementColIndex++;
	        		
	        		cell.setCellValue(aElement.getValue());
	        	}
	        }
	    }
	}
	public void CreateData(SXSSFWorkbook wb, Sheet sh, int startRowNum, String libPhysicalPath,DataProvider dataProvider, String targetData) 
			throws SQLException, GenericError, IOException {
		DataFormat fmt = wb.createDataFormat();

		/* 데이터 스타일 지정 (문자) */
		CellStyle stringDataStyle = wb.createCellStyle();
		stringDataStyle.setBorderTop(CellStyle.BORDER_THIN);
		stringDataStyle.setBorderLeft(CellStyle.BORDER_THIN);
		stringDataStyle.setBorderRight(CellStyle.BORDER_THIN);
		stringDataStyle.setBorderBottom(CellStyle.BORDER_THIN);
		stringDataStyle.setBottomBorderColor((short)0x0 );

		/* 데이터 스타일 지정 (숫자) */
		CellStyle digitDataStyle = wb.createCellStyle();
		digitDataStyle.setBorderTop(CellStyle.BORDER_THIN);
		digitDataStyle.setBorderLeft(CellStyle.BORDER_THIN);
		digitDataStyle.setBorderRight(CellStyle.BORDER_THIN);
		digitDataStyle.setBorderBottom(CellStyle.BORDER_THIN);
		digitDataStyle.setBottomBorderColor((short)0x0 );
		digitDataStyle.setDataFormat(fmt.getFormat("#,##0"));

		/* 데이터 스타일 지정 (숫자:소수점) */
		CellStyle digitDotDataStyle = wb.createCellStyle();
		digitDotDataStyle.setAlignment(CellStyle.ALIGN_RIGHT);
		digitDotDataStyle.setBorderTop(CellStyle.BORDER_THIN);
		digitDotDataStyle.setBorderLeft(CellStyle.BORDER_THIN);
		digitDotDataStyle.setBorderRight(CellStyle.BORDER_THIN);
		digitDotDataStyle.setBorderBottom(CellStyle.BORDER_THIN);
		digitDotDataStyle.setBottomBorderColor((short)0x0 );
		digitDotDataStyle.setDataFormat(fmt.getFormat("#,##0.0"));

		CellStyle digitDot2DataStyle = wb.createCellStyle();
		digitDot2DataStyle.setAlignment(CellStyle.ALIGN_RIGHT);
		digitDot2DataStyle.setBorderTop(CellStyle.BORDER_THIN);
		digitDot2DataStyle.setBorderLeft(CellStyle.BORDER_THIN);
		digitDot2DataStyle.setBorderRight(CellStyle.BORDER_THIN);
		digitDot2DataStyle.setBorderBottom(CellStyle.BORDER_THIN);
		digitDot2DataStyle.setBottomBorderColor((short)0x0 );
		digitDot2DataStyle.setDataFormat(fmt.getFormat("#,##0.00"));

		CellStyle digitDot3DataStyle = wb.createCellStyle();
		digitDot3DataStyle.setAlignment(CellStyle.ALIGN_RIGHT);
		digitDot3DataStyle.setBorderTop(CellStyle.BORDER_THIN);
		digitDot3DataStyle.setBorderLeft(CellStyle.BORDER_THIN);
		digitDot3DataStyle.setBorderRight(CellStyle.BORDER_THIN);
		digitDot3DataStyle.setBorderBottom(CellStyle.BORDER_THIN);
		digitDot3DataStyle.setBottomBorderColor((short)0x0 );
		digitDot3DataStyle.setDataFormat(fmt.getFormat("#,##0.000"));

		CellStyle digitDot4DataStyle = wb.createCellStyle();
		digitDot4DataStyle.setAlignment(CellStyle.ALIGN_RIGHT);
		digitDot4DataStyle.setBorderTop(CellStyle.BORDER_THIN);
		digitDot4DataStyle.setBorderLeft(CellStyle.BORDER_THIN);
		digitDot4DataStyle.setBorderRight(CellStyle.BORDER_THIN);
		digitDot4DataStyle.setBorderBottom(CellStyle.BORDER_THIN);
		digitDot4DataStyle.setBottomBorderColor((short)0x0 );
		digitDot4DataStyle.setDataFormat(fmt.getFormat("#,##0.0000"));

		CellStyle digitDot5DataStyle = wb.createCellStyle();
		digitDot5DataStyle.setAlignment(CellStyle.ALIGN_RIGHT);
		digitDot5DataStyle.setBorderTop(CellStyle.BORDER_THIN);
		digitDot5DataStyle.setBorderLeft(CellStyle.BORDER_THIN);
		digitDot5DataStyle.setBorderRight(CellStyle.BORDER_THIN);
		digitDot5DataStyle.setBorderBottom(CellStyle.BORDER_THIN);
		digitDot5DataStyle.setBottomBorderColor((short)0x0 );
		digitDot5DataStyle.setDataFormat(fmt.getFormat("#,##0.00000"));



		//modelConn=getModelConnection();
		if (modelConn == null){
			modelConn=getModelConnection(targetData);			
		}
		/*
		ResultSetMetaData cMeta=null;
		String queryStr=modelConn.getQueryStatement();
		Connection sqlConn = modelConn.getModel();
		PreparedStatement pstmt = sqlConn.prepareStatement(queryStr);
		ResultSet rs = pstmt.executeQuery();
		cMeta = rs.getMetaData();			
		logger.info("Column Count: " + cMeta.getColumnCount());
		*/
		
		//String valueC = null;
		//int columnType;
		int dataCount = 0;
		for(int ii=0;ii<rowCount;ii++){
			Row row = sh.createRow(startRowNum + dataCount);
			dataCount++;
			for(int colNum=0;colNum<columnCount;colNum++){
				Cell cell = row.createCell(colNum+1 -1);
				sh.setColumnWidth(colNum+1 -1, 4000);
				
				String fmtName=modelConn.getFormat(colNum);
				//if ( ii == 1 ) logger.info("fmtName: " + fmtName);
				//int dotPos=fmtName.indexOf(".");
				//logger.info("dotPos: " + dotPos);
				//logger.info("fmtName.length: " +  modelConn.getColumnName(colNum) + " : " + fmtName + " : " + fmtName.length());
				if (fmtName.length() > 5) fmtName=fmtName.substring(0,5);
				//columnType=cMeta.getColumnType(colNum+1);
				//logger.info("columnType: " + columnType );
				
				//Double dd=0D;
				if (fmtName.equalsIgnoreCase("COMMA")) {
					cell.setCellStyle(digitDataStyle);
					Object obj=modelConn.getUnformattedValueAt(ii, colNum);
					if (obj instanceof Double) { 
						cell.setCellValue((Double)modelConn.getUnformattedValueAt(ii, colNum));
						String isFloat = modelConn.getFormattedValueAt(ii, colNum);
						int dotPos=isFloat.indexOf(".");
						int fNum=dotPos>0?isFloat.length()-dotPos:0;
						//logger.info(modelConn.getColumnName(colNum) + " : " + isFloat + " : " + isFloat.length() + " : " + dotPos + " : " + fNum);
						if ( dotPos > 0 ) {
							if ( fNum < 3) {
								cell.setCellStyle(digitDotDataStyle);
							} else if ( fNum < 4) {
								cell.setCellStyle(digitDot2DataStyle);
							} else if ( fNum < 5) {
								cell.setCellStyle(digitDot3DataStyle);
							} else if ( fNum < 6) {
								cell.setCellStyle(digitDot4DataStyle);
							} else {
								cell.setCellStyle(digitDot5DataStyle);
							} 
						}
					} else {
						cell.setCellValue(modelConn.getFormattedValueAt(ii, colNum));
					}
				} else {
					//cell.setCellType(Cell.CELL_TYPE_NUMERIC);
					cell.setCellStyle(stringDataStyle);
					cell.setCellValue(modelConn.getFormattedValueAt(ii, colNum));
				} 

			}
		}
			
	}
}
