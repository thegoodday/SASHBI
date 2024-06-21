package com.sas.hbi.servlets;


import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File; 
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Properties;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.sas.hbi.listeners.STPSessionBindingListener;
import com.sas.hbi.listeners.STPSessionBindingListener.DestroyableObjectInterface;
import com.sas.hbi.storedprocess.StoredProcessConnection;
import com.sas.hbi.storedprocess.StoredProcessFacade;
//import com.sas.hbi.tools.HBIConfig;
import com.sas.hbi.property.HBIConfig;


import com.sas.prompts.InvalidPromptValueException;
import com.sas.services.ServiceException;
import com.sas.services.TransportException;
import com.sas.services.connection.ConnectionFactoryException;
import com.sas.services.deployment.ServiceDeploymentException;
import com.sas.services.information.InformationServiceInterface;
import com.sas.services.information.metadata.PathUrl;
import com.sas.services.session.SessionContextInterface;
import com.sas.services.storedprocess.Execution2Interface;
import com.sas.services.storedprocess.ExecutionBaseInterface;
import com.sas.services.storedprocess.ExecutionException;
import com.sas.services.storedprocess.MetadataConstants;
import com.sas.services.storedprocess.StoredProcess2Interface;
import com.sas.services.storedprocess.StoredProcessServiceInterface;
import com.sas.services.storedprocess.metadata.StoredProcessOptions;
import com.sas.services.user.UserContextInterface;
import com.sas.servlet.util.BaseUtil;
import com.sas.util.Strings;
import com.sas.web.keys.CommonKeys;
import com.sas.web.keys.ComponentKeys;



/**
 * StoredProcessDriverServlet provides an example servlet implementation 
 * for executing a SAS Stored Process.
 */
public class STPRVServlet extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
	
	// Keys and values for the input parameters (prompts) to the stored process follow this
	// comment block.
	//
	// These constants are used to create the map of input parameter (prompt) values which will
	// be supplied to the stored process. The constants for each key and value are used to build
	// the map in the populateParameterMap() method in the StoredProcessDriverServlet class. 
	//
	// Each of the input parameters is defined in the metadata for the stored process being executed. 
	// You may examine the input parameters in the SAS Management Console by selecting the Parameters 
	// tab of the properties window for the stored process. Select a prompt (input parameter) and 
	// edit it to see the properties. The Prompt Type and Values tab of the properties window for the 
	// prompt will show values for the input parameter. If there is a default value for the prompt, 
	// it will be shown in the properties window as well. The type of the prompt values is represented 
	// in Java by the data types in the com.sas.datatypes package.
	//
	// Some frequently encountered prompts may include the _ODSSTYLE and _DEBUG input parameters. These
	// parameters generally expect String values, so replace the appropriate values below with typical
	// values. For instance, the value for _ODSSTYLE could be set to "Plateau", while the value
	// for _DEBUG could be set to "true" or "false".
	//
	// For convenience, the parameter values have been initially set to the default value (if it exists) 
	// as specified in metadata for the following data types: StringType, IntegerType, and DoubleType. 
	// Consult the Javadoc for the com.sas.datatypes package to determine how to supply values for 
	// other data types. The values can be supplied to the stored process via the input parameter map 
	// created in the populateParameterMap() method in the StoredProcessDriverServlet class.


	// Keys for objects stored in the session
	public static final String STORED_PROCESS_DESTROYABLE_OBJECT 	= "sas_StoredProcessDestroyableObject_HBIM"; 
	public static final String STORED_PROCESS_CONNECTION 			= "sas_StoredProcessConnection_HBIM";
	public static final String STORED_PROCESS_FACADE 				= "sas_StoredProcessFacade_HBIM";
	
	// _URL is the SAS Stored Process macro variable which specifies the URL of the Web server middle tier 
	// used to access the stored process.
	private static final String _URL_KEY = "_URL";
	
	// The path to the stored process to be executed initially by this servlet	
	private String STORED_PROCESS_PATH_URL; 
	
	private static final String AuthDomain	="DefaultAuth";
	private static final String Repository="Foundation";
	
	private InformationServiceInterface informationService;
	private StoredProcessServiceInterface storedProcessService;

	private PathUrl path;
	private String 	reurl;
	private String 	hostname;
	private int 	port;
	private String 	username;
	private String 	password;
	private Locale 	locale;

	private Logger logger;
	
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public STPRVServlet()
    {
        super();
    }
	
	
    /**
     * Spring injection method to store the value of the information service from the 
     * SAS Web Infrastructure Platform.
     */
    public void setInformationService(InformationServiceInterface informationService) 
    {
    	this.informationService = informationService;
    }


    /** 
     * Spring injection method to store the value of the remote stored process service from the 
     * SAS Web Infrastructure Platform.
     */
    public void setStoredProcessService(StoredProcessServiceInterface storedProcessService) 
    {
    	this.storedProcessService = storedProcessService;
    }


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException 
	{
        // Call doGet to provide same behavior for POST and GET HTTP methods.
		doGet(request, response);
	}

    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException 
	{
		logger = Logger.getLogger("STPRVServlet");
		final HttpSession session = request.getSession();
		final UserContextInterface userContext = (UserContextInterface) session.getAttribute(CommonKeys.USER_CONTEXT);
		final SessionContextInterface sessionContext = (SessionContextInterface) session.getAttribute(CommonKeys.SESSION_CONTEXT);

		//String charset = BaseUtil.getOutputCharacterEncoding(request);
		//charset = request.getParameter("charset");
		//response.setContentType("text/html; charset=" + charset);

		synchronized (session)
		{
			boolean showSASLog = true;	// Controls whether the SAS log is shown with the initial results
			
			String program = request.getParameter(StoredProcessFacade.PROGRAM_KEY);
			String sas_forwardLocation = request.getParameter("sas_forwardLocation");
			String isAsync = request.getParameter("isAsync");
			if (sas_forwardLocation == null) sas_forwardLocation="";
			if (isAsync == null) isAsync="";
			/*
			if (sas_forwardLocation.equalsIgnoreCase("execSTPN")) {
			} else
			*/ 
			if (sas_forwardLocation.equalsIgnoreCase("getParams")){
				program = "SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/getParamValues(StoredProcess)";
			}
			if (program.equalsIgnoreCase("SBIP://METASERVER/Products/SAS HBI/00.Environments/StoredProcess/createSession(StoredProcess)")){
				isAsync = "true";
			}
			 
			/*
			String  pagenumStr = request.getParameter("pagenum");
			int pagenum = 0;
			if ( pagenumStr != null && !pagenumStr.equalsIgnoreCase("")){
				pagenum = Integer.parseInt((String)request.getParameter("pagenum"));
			} 
			*/
			
			STORED_PROCESS_PATH_URL = program;
			if (program != null) 
			{
				if (program.equals(StoredProcessFacade.REPLAY_PROGRAM_VALUE) == true) 
				{
					replay(request, response);
					return;
				}
				//else if (!sas_forwardLocation.equalsIgnoreCase("execSTP") && pagenum > 1)
				//else if (pagenum > 0)
				//else 
				//else if (session.getAttribute(STORED_PROCESS_CONNECTION) != null)
				else if (isAsync.equalsIgnoreCase("false"))
				{
					executeSubsequentStoredProcess(request, response);
					return;
				}
			}
			

			
			try {
				if (userContext.isInGroup("Report Admin")){
					session.setAttribute("isReportAdmin", true);
					logger.debug("User Group : Report Admin");
				}
			} catch (ServiceException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
			try 
			{
				StoredProcessDestroyableObject destroyableObject = (StoredProcessDestroyableObject) session.getAttribute(STORED_PROCESS_DESTROYABLE_OBJECT);
				if (destroyableObject == null)
				{
					destroyableObject = new StoredProcessDestroyableObject();
					STPSessionBindingListener.getInstance(session).addDestroyableObject(destroyableObject);
					
					session.setAttribute(STORED_PROCESS_DESTROYABLE_OBJECT, destroyableObject);
				}
				
				StoredProcessConnection connection = (StoredProcessConnection) session.getAttribute(STORED_PROCESS_CONNECTION);
				if (connection == null)
				{
					//final UserContextInterface userContext = (UserContextInterface) session.getAttribute(CommonKeys.USER_CONTEXT);
					//final SessionContextInterface sessionContext = (SessionContextInterface) session.getAttribute(CommonKeys.SESSION_CONTEXT);
						
					connection = new StoredProcessConnection(userContext, sessionContext, informationService, storedProcessService);
					
					connection.connect();
					
					session.setAttribute(STORED_PROCESS_CONNECTION, connection);

					destroyableObject.setConnection(connection);
				}
				
				StoredProcessFacade sessionFacade = (StoredProcessFacade) session.getAttribute(STORED_PROCESS_FACADE);
				if (sessionFacade != null)
				{
					sessionFacade.destroyStoredProcessObjects();
					destroyableObject.removeFacade(sessionFacade);
					sessionFacade = null;					
				}

				final Map<String, Object> storedProcessParameters = populateParameterMap(request);
				

				// Set the _RESULT parameter to indicate streaming results are desired when the
				// stored process supports streaming.
				storedProcessParameters.put(StoredProcessFacade.RESULT_PARAMETER_KEY, StoredProcessFacade.RESULT_PARAMETER_STREAM_VALUE);
				
				
				// Create a facade representing the SAS Stored Process and its execution results
				final PathUrl path = new PathUrl(STORED_PROCESS_PATH_URL);
				final StoredProcessFacade facade = new StoredProcessFacade(connection, path, storedProcessParameters);
				
				// Place the facade into the session so it can be used in a possible replay scenario
				session.setAttribute(STORED_PROCESS_FACADE, facade);
				
				// Add the facade to the StoredProcessDestroyableObject so the
				// ExamplesSessionBindingListener can clean it up when the session expires
				destroyableObject.addFacade(facade);

				
				// Execute the initial (or perhaps only) SAS Stored Process and write the results 
				// to the browser
				/*
				*/
				executeStoredProcess(request, response, facade, showSASLog);
								
				
			} 
			catch (ServiceDeploymentException e) 
			{
				e.printStackTrace();
			} 
			catch (ServiceException e) 
			{
				e.printStackTrace();
			} 
			catch (IllegalStateException e) 
			{
				e.printStackTrace();
			} 
			catch (ExecutionException e) 
			{
				e.printStackTrace();
			}
			catch (InterruptedException e) 
			{
				e.printStackTrace();
			} 
			catch (ConnectionFactoryException e) 
			{
				e.printStackTrace();
			}
		
		}
		
	}
	
	
	/**
	 * Place the keys and values for the stored process prompts (input parameters) into
	 * a map. The map can then be provided to the StoredProcessFacade to supply the
	 * input parameters to the SAS Stored Process.
	 * @throws UnsupportedEncodingException 
	 */
	private Map<String, Object> populateParameterMap(HttpServletRequest request) throws UnsupportedEncodingException
	{
		final Map<String, Object> storedProcessParameters = new HashMap<String, Object>();
		//Map params = facade.getStoredProcessParametersFromRequest(request);
	    Enumeration paramNames = request.getParameterNames();
	    while(paramNames.hasMoreElements()){
	        String param_name = paramNames.nextElement().toString();
	        String param_value = new String(request.getParameter(param_name).getBytes("EUC-KR"),"EUC-KR");
	        if("".equals(param_value)||param_value==null){
	        	param_value = "";
	        }
			storedProcessParameters.put(param_name, param_value);
	    }	
		storedProcessParameters.put(StoredProcessFacade.RESULT_PARAMETER_KEY, StoredProcessFacade.RESULT_PARAMETER_STREAM_VALUE);
		storedProcessParameters.put(_URL_KEY, request.getRequestURI());
	
		return storedProcessParameters;
	}
			
	
	/**
	 * Executes the initial (or perhaps only) SAS Stored Process represented by the specified
	 * StoredProcessFacade and writes the results to the browser.
	 *
	 * @param request the HTTP request object
	 * @param response the HTTP response object
	 * @param facade the StoredProcessFacade which represents a SAS Stored Process and its execution results
	 * @param showSASLog true if the SAS log should be written to the servlet context log; false otherwise.
	 */	
	protected void executeStoredProcess(final HttpServletRequest request, 
			final HttpServletResponse response,	final StoredProcessFacade facade, final boolean showSASLog) 
		throws IllegalStateException, ServiceException, ExecutionException, IOException, InterruptedException,
			TransportException, RemoteException, ConnectionFactoryException 
	{
		// Execute the stored process asynchronously
		// 
		// The StoredProcessFacade provides convenience methods to access various properties
		// of the execution results, so it is optional to retrieve the execution object from the
		// executeStoredProcess method. The execution object can also be retrieved via the 
		// getExecutionObject method once the stored process has been executed by the StoredProcessFacade.
		facade.executeStoredProcess(false);

		// Retrieve and write streaming results to the browser
		if (facade.isStreamCapable()) 
		{
			writeStreamingResults(request, response, facade, facade.getExecutionObject());
		}
		
		// Wait for the stored process to finish executing. The waitForCompletion() method will return
		// the same status as facade.getExecutionObject().getStatus(). In this example, getStatus()
		// will be used rather than examining the status from waitForCompletion, so the status can be 
		// processed in the handleCompletionStatus() method.
		facade.waitForCompletion();
		handleExecutionStatus(facade);
		
		
		// Optionally write the SAS log from the stored process execution to the servlet context log
		if (showSASLog == true)
		{
			writeSASLog(facade, request);
		}

		
		// Cleanup the underlying stored process objects to prepare for a possible 
		// replay or subsequent stored process execution
		facade.destroyStoredProcessObjects();		
	}
	

	/**
	 * Write the results of a streaming stored process into the output stream of the HTTP response.
	 * 
	 * @param request the HTTP request object
	 * @param response the HTTP response object
	 * @param facade the StoredProcessFacade with the results to be written
	 * @param executionObject the execution object with the results to be written. The execution object
	 * may be from an initial execution, a subsequent execution, or a replay execution
	 * @throws IOException
	 */
	protected void writeStreamingResults(final HttpServletRequest request, final HttpServletResponse response,
			 final StoredProcessFacade facade, final Execution2Interface executionObject)
		throws IOException 
	{
		// Get content type and write it to the response		
		facade.writeResponseContentType(request, response, executionObject);
		
		// Get data and write it to the response output stream		
		facade.writeStreamingResults(response.getOutputStream(), executionObject);
	}
	

	/**
	 * This method writes the SAS log (from executing a stored process) into the log location specified
	 * by the {@link ServletContext}. This method may be modified to write the log to some other
	 * location as desired.
	 * 
	 * @param facade The StoredProcessFacade from which to retrieve the SAS log
	 * @throws IllegalStateException 
	 * @throws TransportException 
	 * @throws IOException 
	 */
	protected void writeSASLog(final StoredProcessFacade facade, HttpServletRequest request) 
		throws TransportException, IllegalStateException, IOException 
	{
		final ServletContext servletContext = getServletContext();
		
		String log = facade.getSASLogAsHtml();
		logger.trace("Begin SAS Log for STPRVServlet");
		logger.trace(log);
		logger.trace("End SAS Log for STPRVServlet");
		
		final HttpSession session = request.getSession();
		String [] logs = {log};

		Long curDT = new Date().getTime(); 
		int ran = (int)(Math.random() * 1000);
		
		String logID = curDT.toString() + ran;
		LinkedHashMap<String, String[]> SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
		if (SASLogs !=null) {
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);	
		}
	}
	
	
	/**
	 * Checks and logs the status codes of the stored process execution and the SAS stored process.
	 * 
	 * @param facade the StoredProcessFacade representing the SAS stored process being executed
	 * @see StoredProcessFacade#getExecutionObject()
	 * @see Execution2Interface#getStatus()
	 * @see Execution2Interface#getSASConditionCode()
	 * @throws RemoteException
	 */
	protected void handleExecutionStatus(final StoredProcessFacade facade) throws RemoteException 
	{
		final Execution2Interface storedProcessExecution = facade.getExecutionObject();
		
		// Check and log the stored process execution status; additional processing could
		// be done based on the status code value.
		final int completionStatus = storedProcessExecution.getStatus();	
		logger.info("Stored process execution completion status: "	+ completionStatus);
		
		// Check and log the SAS return code; additional processing could be done based on 
		// return code value.
		final int returnCode = storedProcessExecution.getSASConditionCode();
		logger.info("SAS stored process return code: "	+ returnCode);		
	}
	
	
	/**
	 * Handle the execution of a replay stored process.
	 * <p> 
	 * See the SAS Stored Processes Developer's Guide for more information about replay.
	 * @param request the HTTP request object
	 * @param response the HTTP response object
	 */	
	protected void replay(final HttpServletRequest request, final HttpServletResponse response) 
		throws ServletException, IOException
	{
		final HttpSession session = request.getSession();
		
		final StoredProcessFacade facade = (StoredProcessFacade) session.getAttribute(STORED_PROCESS_FACADE);
		
		Execution2Interface replayExecution = null;
		try 
		{
			replayExecution = facade.replay(request);
		} 
		catch (IllegalArgumentException e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		catch (ServiceException e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		catch (InvalidPromptValueException e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		catch (IllegalStateException e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if (replayExecution != null)
		{
			final StoredProcess2Interface replayStoredProcess = facade.getReplayStoredProcess(); 

			try
			{
				// Retrieve and write streaming results to the browser
				if (replayStoredProcess.isStreamCapable()) 
				{
					writeStreamingResults(request, response, facade, replayExecution);
				}
			} 
			catch (Exception e) 
			{
				throw new RuntimeException(e);
			} 
			finally 
			{
				try 
				{
					facade.replayWaitForCompletion();
					facade.destroyReplayStoredProcessObjects();
				} 
				catch (TransportException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				} 
				catch (ConnectionFactoryException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				} 
				catch (InterruptedException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
	}
	
	
	/**
	 * Executes a subsequent SAS Stored Process (e.g. for drill down) after an initial SAS
	 * stored process has been executed in 
	 * {@link #executeStoredProcess(HttpServletRequest, HttpServletResponse, StoredProcessFacade, boolean)} 
	 *
	 * @param request the HTTP request object
	 * @param response the HTTP response object
	 */	
	@SuppressWarnings("unchecked")	
	protected void executeSubsequentStoredProcess(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException 
	{

		StoredProcessFacade facade = null;
		Execution2Interface storedProcessExecution = null;
		try 
		{
			final HttpSession session = request.getSession();

			// Get stored process connection
			final StoredProcessConnection connection = (StoredProcessConnection) session.getAttribute(STORED_PROCESS_CONNECTION);
			
			final String program = request.getParameter(StoredProcessFacade.PROGRAM_KEY);
			if ((program == null) || (program.trim().compareTo("") == 0))
			{
				throw new IllegalStateException("The parameter _PROGRAM must be set.");
			}
			
			String prefix="SBIP://METASERVER";
			String stpStr="(StoredProcess)";
			PathUrl path = null;
			if ( program.substring(program.length()-stpStr.length(),program.length()).equalsIgnoreCase(stpStr)){
				prefix=""; stpStr="";
			}
			path = new PathUrl(prefix + program + stpStr);
			
			final StoredProcessOptions storedProcessOptions = new StoredProcessOptions();
			storedProcessOptions.setSessionContextInterface(connection.getSessionContext());

			//Get URL parameters
			@SuppressWarnings("rawtypes")
			Map storedProcessParameters = StoredProcessFacade.getStoredProcessParametersFromRequest(request);
			storedProcessParameters.put(_URL_KEY, request.getRequestURI());

			// Set the _RESULT parameter to indicate streaming results are desired when the
			// stored process supports streaming.
			storedProcessParameters.put(StoredProcessFacade.RESULT_PARAMETER_KEY, StoredProcessFacade.RESULT_PARAMETER_STREAM_VALUE);
			

			// Create a facade for executing the SAS Stored Process
			facade = new StoredProcessFacade(connection, path, storedProcessParameters, storedProcessOptions);

			// Place the facade into the session so it can be used in a possible replay scenario
			session.setAttribute(STORED_PROCESS_FACADE, facade);
			
			// Add the facade to the StoredProcessDestroyableObject so ExamplesSessionBindingListener
			// can clean it up when the session expires
			StoredProcessDestroyableObject destroyableObject = (StoredProcessDestroyableObject) session.getAttribute(STORED_PROCESS_DESTROYABLE_OBJECT);
			if (destroyableObject == null)
			{
				destroyableObject = new StoredProcessDestroyableObject();
				STPSessionBindingListener.getInstance(session).addDestroyableObject(destroyableObject);
			}
			destroyableObject.addFacade(facade);				
			
			// Retrieve the session id from parameters which came from the HttpServletRequest 
			// (retrieved above via StoredProcessFacade.getStoredProcessParametersFromRequest)
			String sessionId = null;
			final String[] sessionIdValues = (String[]) storedProcessParameters.get(StoredProcessFacade.SESSION_ID_KEY);
			if (sessionIdValues != null)
			{
				sessionId = sessionIdValues[0];
			}

			storedProcessExecution = facade.executeStoredProcess(false, null, false, sessionId);			

			// Set the character encoding and content type of the response
			facade.setResponseContentType(request, response, storedProcessExecution);
		
			// Retrieve and write streaming results to the browser
			if (facade.isStreamCapable() == true) 
			{
				writeStreamingResults(request, response, facade, storedProcessExecution);
			}
			
			// Wait for the stored process to finish executing. The waitForCompletion() method will return
			// the same status as facade.getExecutionObject().getStatus(). In this example, getStatus()
			// will be used rather than examining the status from waitForCompletion, so the status can be 
			// processed in the handleCompletionStatus() method.
			facade.waitForCompletion();
			handleExecutionStatus(facade);
			
			
			// Determine if the contents of the SAS log should be displayed 
			boolean showSASLog = true;
			final String[] debugValues = (String[]) storedProcessParameters.get(StoredProcessFacade.DEBUG_KEY);
			if ((debugValues != null) && (debugValues[0].trim().equalsIgnoreCase("") == false))
			{
				showSASLog = true;
			}
			
			// Optionally write the SAS log from the stored process execution to the servlet context log			
			if (showSASLog == true)
			{
				writeSASLog(facade, request);
			}
		} 
		catch (Exception e) 
		{
			throw new RuntimeException(e);
		} 
		finally 
		{
			try 
			{
				facade.destroyStoredProcessObjects();
			} 
			catch (TransportException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (IllegalStateException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (ConnectionFactoryException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}			
		}
	}
	

	
	/**
	 * The StoredProcessDestroyableObject class handles the clean up of stored process objects
	 * when the session expires. 
	 */
	private class StoredProcessDestroyableObject implements DestroyableObjectInterface 
	{
		private StoredProcessConnection connection = null;
		private List<StoredProcessFacade> facades = 
			Collections.synchronizedList(new ArrayList<StoredProcessFacade>());

		
		public void setConnection(final StoredProcessConnection connection)
		{
			this.connection = connection;
		}

		
		public void addFacade(final StoredProcessFacade facade)
		{
			facades.add(facade);
		}
		
		
		public boolean removeFacade(final StoredProcessFacade facade)
		{
			return facades.remove(facade);
		}
		
		
		// Methods for DestroyableObjectInterface are implemented below
		public void destroy() 
		{
			// Clean up the StoredProcessFacade objects for this session
			for (StoredProcessFacade facade : facades)
			{
				try 
				{
					facade.destroyStoredProcessObjects();
				} 
				catch (TransportException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				} 
				catch (RemoteException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				} 
				catch (IllegalStateException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				} 
				catch (ConnectionFactoryException e) 
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
			
			// Clean up the StoredProcessConnection object for this session				
			try 
			{
				connection.disconnect();
			} 
			catch (IllegalArgumentException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (IllegalStateException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (RemoteException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (ServiceException e) 
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}	
		}


		public int getOrder() 
		{
			// Ensure the StoredProcessDestroyableObject gets destroyed before the SAS Session Context
			return 0;
		}
		
	};
	
}