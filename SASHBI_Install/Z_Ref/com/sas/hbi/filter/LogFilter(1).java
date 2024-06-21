package com.sas.hbi.filter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Properties;
import java.util.StringTokenizer;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;
import com.sas.hbi.dao.HBILogDAOImpl;
import com.sas.hbi.property.HBIConfig;
import com.sas.services.user.UserContextInterface;
import com.sas.web.keys.CommonKeys;

public class LogFilter implements Filter {
	private Logger logger;
	private FilterConfig filterConfig;
	
	@Override
	public void init(FilterConfig config) {
		this.filterConfig = config;
		this.logger = Logger.getLogger(getClass().getName());
		//this.logger.setLevel(Level.ERROR);
	}
	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {

		long startTime = System.currentTimeMillis();
		Enumeration paramNames = null;
		HttpServletRequest httpReq = (HttpServletRequest) request;
		HashMap<String,String> params = new HashMap<String, String>();
		HashMap<String,String> addLoggingParam = new HashMap<String, String>();
		
		
		
		
		HBIConfig hbiconf = HBIConfig.getInstance();
		Properties conf = hbiconf.getConf();

		String isLogging = conf.getProperty("log.active").toUpperCase();
		logger.debug("LogFilter isLogging : " + isLogging);
		if (isLogging.equalsIgnoreCase("Y")){
			String isDetail = conf.getProperty("log.detail").toUpperCase();
			logger.debug("LogFilter isDetail : " + isDetail);

			ArrayList<String> loggingURI = new ArrayList<String>();
			String targetURIs = conf.getProperty("log.uri");
			StringTokenizer targetURI = new StringTokenizer(targetURIs, ",");
			while (targetURI.hasMoreElements()) {
				loggingURI.add((String) targetURI.nextElement());
			}
			logger.debug("LogFilter targetURI : " + loggingURI.toString());

			ArrayList<String> exParams = new ArrayList<String>();
			String exceptParams = conf.getProperty("log.execptParam");
			StringTokenizer exParam = new StringTokenizer(exceptParams, ",");
			while (exParam.hasMoreElements()) {
				exParams.add((String) exParam.nextElement());
			}
			logger.debug("LogFilter exceptParam : " + exParams.toString());


			
			ArrayList<String> sessionParam = new ArrayList<String>();
			String sessionParams = conf.getProperty("log.session");
			StringTokenizer seParam = new StringTokenizer(sessionParams, ",");
			while (seParam.hasMoreElements()) {
				sessionParam.add((String) seParam.nextElement());
			}
			logger.debug("LogFilter sessionParam : " + sessionParam.toString());


			

			try {
				httpReq.setCharacterEncoding("UTF-8");
			} catch ( UnsupportedEncodingException e) {
				e.printStackTrace();
			}

			HttpSession session = httpReq.getSession();
			String spPathURL = (String) session.getAttribute("sp_pathUrl");
			if (spPathURL == null){
				spPathURL = request.getParameter("sp_pathUrl");
				if (spPathURL == null) spPathURL = "";
			}
			try {
				String reqURI = httpReq.getRequestURI();
				logger.debug("LogFilter getRequestURI : " + reqURI);
				logger.debug("LogFilter getRequestURI in loggingURI : " + loggingURI.contains(reqURI));
				if(loggingURI.contains(reqURI)){
					UserContextInterface userContext = (UserContextInterface)session.getAttribute(CommonKeys.USER_CONTEXT); //sasUserContext_s
					String userID = "";
					if (userContext!=null) userID = userContext.getPerson().getName();
					String userIP = httpReq.getHeader("x-forwarded-for");
					String action = (String)request.getParameter("sas_forwardLocation");
					String program = (String)request.getParameter("_program");
					String rsRID = (String)request.getParameter("rsRID");
					String sessionid = (String)request.getParameter("_sessionid");
					if (action == null) action = "";
					if (program == null) program = "";
					if (rsRID == null) rsRID = "";
					if (sessionid == null) sessionid = "";


					if (!spPathURL.equalsIgnoreCase("") || spPathURL != null) program = spPathURL;
					if ( program.equalsIgnoreCase("") && rsRID != "") program=rsRID;

					logger.debug("LogFilter userID : " + userID);
					logger.debug("LogFilter userIP : " + userIP);
					logger.debug("LogFilter reqURI : " + reqURI);
					logger.debug("LogFilter action : " + action);
					logger.debug("LogFilter program : " + program);
					logger.debug("LogFilter sessionid : " + sessionid);
					logger.debug("LogFilter rsRID : " + rsRID);
					
				    paramNames = session.getAttributeNames();
				    while(paramNames.hasMoreElements()){
				    	String name = paramNames.nextElement().toString();
				    	String value = "";
				    	if(sessionParam.contains(name)){
				    		try{
				    			value = (String) session.getAttribute(name).toString();//new String(request.getSession().getAttribute(name).toString().getBytes("EUC-KR"),"EUC-KR");
				    			if(value.equalsIgnoreCase("")||value==null){
				    			}
				    			logger.debug("LogFilter in session : " + name + " = " + value);
				    		} catch (Exception e){
				    			logger.debug("ERROR: " + e.getLocalizedMessage());
				    		}
				    		addLoggingParam.put(name, value);
				    	}
				    }
					
					HBILogDAOImpl logDao = new HBILogDAOImpl("java:comp/env","jdbc/SASHBI");
					int seqid = logDao.insertHBILog(userID, userIP, reqURI, action, program,sessionid,addLoggingParam);
					logger.debug("seqid in Filter : " + seqid);
					
					if (isDetail.equalsIgnoreCase("Y")){
						if (!spPathURL.equalsIgnoreCase("")||spPathURL != null){
							paramNames = request.getParameterNames();
							while(paramNames.hasMoreElements()){
								String pName = paramNames.nextElement().toString();
								String pValue = (String)request.getParameter(pName);
								if(pValue==null) pValue = "";
								if(!exParams.contains(pName) && !pName.equalsIgnoreCase("") && !pValue.equalsIgnoreCase("")){
									params.put(pName, pValue);
								}
								logger.debug("LogFilter : " + pName + " = " + pValue);
							}	

							logDao.insertHBILogDetail(seqid, params);
						}  
					}
				}
			} catch (Exception e){
				e.printStackTrace();
			}
		}
		
		long elapsed = System.currentTimeMillis() - startTime;
		logger.debug("Filter elapsed time : " + elapsed);
		chain.doFilter(request, response);
	}
}
