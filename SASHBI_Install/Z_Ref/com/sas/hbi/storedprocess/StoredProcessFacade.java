/**
 * SAS Institute does not support customer implementations or extension of this class or interface.
 * In general, SAS Institute will maintain binary compatibility for these SAS provided Application 
 * Programming Interfaces (API) for customer code which uses but does not extend or implement the 
 * SAS provided implementation. However, future releases of SAS software may contain changes in this 
 * API which may not be source compatible or binary compatible with customer supplied extensions or 
 * customer supplied implementations of this class or interface.
 */
package com.sas.hbi.storedprocess;


import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Level;
import org.apache.log4j.Logger;

import com.sas.hbi.listeners.STPSessionBindingListener;
import com.sas.hbi.listeners.STPSessionBindingListener.DestroyableObjectInterface;
//import com.sas.hbi.servlets.STPRVServlet.StoredProcessDestroyableObject;
import com.sas.io.InputStreamHeaderInterface;
import com.sas.prompts.InvalidPromptValueException;
import com.sas.prompts.PromptValuesInterface;
import com.sas.prompts.definitions.PromptDefinitionInterface;
import com.sas.services.InitializationException;
import com.sas.services.ServiceException;
import com.sas.services.TransportException;
import com.sas.services.connection.ConnectionFactoryException;
import com.sas.services.information.ServerInterface;
import com.sas.services.information.InformationServiceInterface;
import com.sas.services.information.metadata.MetadataInterface;
import com.sas.services.information.metadata.PathUrl;
import com.sas.services.storedprocess.Execution2Interface;
import com.sas.services.storedprocess.ExecutionBaseInterface;
import com.sas.services.storedprocess.ExecutionException;
import com.sas.services.storedprocess.ExecutionStatusListener2Interface;
import com.sas.services.storedprocess.MetadataConstants;
import com.sas.services.storedprocess.OutputParameterInterface;
import com.sas.services.storedprocess.StoredProcess2Interface;
import com.sas.services.storedprocess.StoredProcessBaseInterface;
import com.sas.services.storedprocess.StoredProcessServiceInterface;
import com.sas.services.storedprocess.metadata.StoredProcessInterface;
import com.sas.services.storedprocess.metadata.StoredProcessOptions;
import com.sas.services.user.UserContextInterface;
import com.sas.servlet.util.BaseUtil;



/**
 * A StoredProcessFacade represents a SAS Stored Process and its execution results (after the
 * stored process has been executed.)
 * 
 * The StoredProcessFacade class wraps two interfaces from the SAS Stored Process Service: 
 * {@link StoredProcess2Interface} and {@link Execution2Interface}.
 * 
 * See the {@link com.sas.services.storedprocess} package summary Javadoc for more information
 * about the SAS Stored Process Service.
 */
public class StoredProcessFacade 
{
	// Keys and values for common SAS Stored Process macro variables
	public static final String DEBUG_KEY = "_debug";
	public static final String SESSION_ID_KEY = "_sessionid";
	public static final String PROGRAM_KEY = "_program";
	public static final String REPLAY_PROGRAM_VALUE = "replay";
	public static final String STORED_PROCESS_DESTROYABLE_OBJECT	= "sas_StoredProcessDestroyableObject_SPF"; 
	public static final String STORED_PROCESS_CONNECTION 		 	= "sas_StoredProcessConnection_HBI";
	public static final String STORED_PROCESS_FACADE 				= "sas_StoredProcessFacade_HBI";    
	public static final String _URL_KEY = "_URL";
	 
	private Logger logger = Logger.getLogger("StoredProcessFacade");
	
	/**
	 * The _RESULT parameter to a SAS stored process indicates the type of result to be returned
	 * from the stored process.
	 * 
	 * See the {@link com.sas.services.storedprocess} package summary Javadoc for more information about the
	 * _RESULT parameter and its use in SAS stored processes.
	 * 
	 * @see com.sas.services.storedprocess
	 */
	public static final String RESULT_PARAMETER_KEY = MetadataConstants.RES_NAME_RESULT;
			
	/**
	 * Value for parameter _RESULT used to indicate to a SAS stored process that a streaming
	 * result is to be returned
	 */	
	public static final String RESULT_PARAMETER_STREAM_VALUE = "STREAM";	
	

	private StoredProcess2Interface storedProcess = null;
	private Execution2Interface ex = null;
	
	private StoredProcessConnection connection = null;
	
	private PathUrl pathUrl = null;
	
	@SuppressWarnings("rawtypes")
	private Map storedProcessInputParameterValues = null;
	
	private StoredProcessOptions storedProcessOptions = null;
	
	private String streamingResultsContentType = null;
	
	private StoredProcess2Interface replayStoredProcess = null;
	private Execution2Interface replayExecution = null;
	
	private String metaID;
	
	
	public StoredProcessFacade(final StoredProcessConnection connection, final PathUrl pathUrl, 
			@SuppressWarnings("rawtypes") final Map storedProcessInputParameterValues)				
		throws IllegalStateException, ServiceException, RemoteException
	{
		this(connection, pathUrl, storedProcessInputParameterValues, new StoredProcessOptions());
	}

	
	public StoredProcessFacade(final StoredProcessConnection connection, final PathUrl pathUrl, 
			@SuppressWarnings("rawtypes") final Map storedProcessInputParameterValues, 
			final StoredProcessOptions options)				
		throws IllegalStateException, ServiceException, RemoteException
	{
		this.connection = connection;
		this.storedProcessInputParameterValues = storedProcessInputParameterValues;
		this.storedProcessOptions = options;
		this.pathUrl = pathUrl;
		this.storedProcess = getStoredProcess();
		//logger.setLevel(Level.DEBUG);
	}

	
	public void destroyStoredProcessObjects() 
		throws RemoteException, IllegalStateException, ConnectionFactoryException, TransportException 
	{
		if (ex != null)
		{
			ex.destroy();
			ex = null;
		}
		if (storedProcess != null)
		{
			storedProcess.destroy();
			storedProcess = null;
		}
				
		destroyReplayStoredProcessObjects();
	}
	
	
	public void destroyReplayStoredProcessObjects() 
		throws RemoteException,	ConnectionFactoryException, TransportException 
	{
		if (replayExecution != null)
		{
			replayExecution.destroy();
			replayExecution = null;
		}
		if (replayStoredProcess != null)
		{
			replayStoredProcess.destroy();
			replayStoredProcess = null;
		}
	}
	
	
	/**
	 * Executes the stored process synchronously and returns the execution object for this stored process.
	 * Once the stored process has been executed, the execution object may also be retrieved
	 * via the {@link #getExecutionObject()} method.
	 * 
	 * @return A {@link com.sas.services.storedprocess.Execution2Interface} object describing
     * the state and the results of the execution for this stored process.
     * The {@link com.sas.services.storedprocess.Execution2Interface#getStatus()} method provides 
     * information about different completion codes generated by the execute() method.
     * 
	 * @see #executeStoredProcess(boolean, ExecutionStatusListener2Interface, boolean, Object)
	 * 
	 * @throws IllegalStateException
	 * @throws ServiceException
	 * @throws ExecutionException
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public Execution2Interface executeStoredProcess() 
		throws IllegalStateException, ServiceException, ExecutionException, IOException, InterruptedException
	{
		return executeStoredProcess(true);
	}
	
	
	/**
	 * Executes the stored process and returns the execution object for this stored process.
	 * Once the stored process has been executed, the execution object may also be retrieved
	 * via the {@link #getExecutionObject()} method.
	 * 
     * @param synchronous   true: execute synchronously; false: execute asynchronously.
     * 
	 * @return A {@link com.sas.services.storedprocess.Execution2Interface} object describing
     * the state and the results of the execution for this stored process.
     * The {@link com.sas.services.storedprocess.Execution2Interface#getStatus()} method provides 
     * information about different completion codes generated by the execute() method.
     * 
	 * @see #executeStoredProcess(boolean, ExecutionStatusListener2Interface, boolean, Object)
	 * @throws IllegalStateException
	 * @throws ServiceException
	 * @throws ExecutionException
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public Execution2Interface executeStoredProcess(final boolean synchronous) 
		throws IllegalStateException, ServiceException, ExecutionException, IOException, InterruptedException
	{
		// Execute the stored process with no listener (first null) or alerts (false) and let the 
		// StoredProcessService create the connection to the server (second null).
		return executeStoredProcess(synchronous, null, false, null);
	}
	
	
	/**
	 * Executes the stored process and returns the execution object for this stored process.
	 * Once the stored process has been executed, the execution object may also be retrieved
	 * via the {@link #getExecutionObject()} method.
	 * <p>
	 * This method is a wrapper method for the 
	 * {@link com.sas.services.storedprocess.StoredProcess2Interface#execute(boolean, ExecutionStatusListener2Interface, boolean, Object) execute method} 
	 * of the {@link com.sas.services.storedprocess.StoredProcess2Interface StoredProcess2Interface}.
	 * See the {@link com.sas.services.storedprocess.StoredProcess2Interface StoredProcess2Interface Javadoc}
	 * for more information.
	 * </p>
	 * @param synchronous   true: execute synchronously; false: execute asynchronously.
	 * @param listener      specifies the listener that gets control when execution completes; can be null.
	 * @param createAlert   true: capture results by creating an
	 * {@link com.sas.services.storedprocess.metadata.StoredProcessAlertItemInterface alert}
	 * item; false: do not capture results.
	 * @param serverConnection    This argument should be null if the stored process service is to
	 * obtain a connection to a StoredProcess server or Workspace server.  If a connection is supplied to
	 * the method, then see {@link com.sas.services.storedprocess.StoredProcess2Interface#execute(boolean, ExecutionStatusListener2Interface, boolean, Object)}
	 * for an explanation of the valid argument types.
	 * <b>A {@link StoredProcessConnection} object should <i>not</i> be supplied as the value for this parameter.</b>
	 * </p>
	 * 
	 * @return A {@link com.sas.services.storedprocess.Execution2Interface} object describing
	 * the state and the results of the execution for this stored process.
	 * The {@link com.sas.services.storedprocess.Execution2Interface#getStatus()} method provides
	 * information about different completion codes generated by the execute() method.
	 * 
	 * @see #getExecutionObject()
	 * @see com.sas.services.storedprocess.StoredProcess2Interface#execute(boolean, ExecutionStatusListener2Interface, boolean, Object)
	 * 
	 * @throws IllegalStateException
	 * @throws ServiceException
	 */
	public Execution2Interface executeStoredProcess(final boolean synchronous, final
			ExecutionStatusListener2Interface listener, final boolean createAlert, 
			final Object serverConnection) 
		throws IllegalStateException, ServiceException, ExecutionException, IOException, InterruptedException
	{
		if (storedProcessInputParameterValues != null)
		{
			storedProcess.setParameterValues(storedProcessInputParameterValues);
		}
		//System.out.println("listener : " + listener);
		ex = storedProcess.execute(synchronous, listener, createAlert, serverConnection);
				
		return ex;
	}
	
	public Execution2Interface executeStoredProcess(HttpServletResponse response,final HttpServletRequest request, final Object serverConnection) 
			throws TransportException, IllegalStateException, IOException, ExecutionException
	{
		final HttpSession session = request.getSession();
		StoredProcessFacade facade=(StoredProcessFacade)session.getAttribute("sas_StoredProcessFacade_HBI");
		//facade.executeStoredProcess(false);
		ex = storedProcess.execute(true, null, false, serverConnection);
		String log = ex.readSASLog(ExecutionBaseInterface.LOG_FORMAT_HTML,ExecutionBaseInterface.LOG_ALL_LINES);
		String [] logs = {log};

		Long curDT = new Date().getTime();
		int ran = (int)(Math.random() * 1000);
		
		String logID = curDT.toString() + ran;
		LinkedHashMap<String, String[]> SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
		SASLogs.put(logID,logs);
		session.setAttribute("SASLogs",SASLogs);			

		if (facade.isStreamCapable()) 
		{
			writeStreamingResults(request, response, facade, facade.getExecutionObject());
		}

/*
		final BufferedInputStream inData = new BufferedInputStream(ex.getInputStream(MetadataConstants.WEBOUT));
		final BufferedOutputStream outData = new BufferedOutputStream(response.getOutputStream());
		final byte[] buffer = new byte[4096];
		for (int n = 0; (n = inData.read(buffer, 0, buffer.length)) > 0; ) {
			outData.write(buffer, 0, n);
		}
		outData.flush();
		outData.close();
*/		
		return ex;		
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
	public Execution2Interface executeSubsequentStoredProcess(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException 
	{

		StoredProcessFacade facade = null;
		Execution2Interface storedProcessExecution = null;

		try {
			final HttpSession session = request.getSession();

			// Get stored process connection
			final StoredProcessConnection connection = (StoredProcessConnection) session.getAttribute(STORED_PROCESS_CONNECTION);

			facade=(StoredProcessFacade)session.getAttribute(STORED_PROCESS_FACADE);	//"sas_StoredProcessFacade_HBI"

			final String program = request.getParameter(StoredProcessFacade.PROGRAM_KEY);
			if ((program == null) || (program.trim().compareTo("") == 0))
			{
				throw new IllegalStateException("The parameter _PROGRAM must be set.");
			}
 			
			PathUrl path = new PathUrl("SBIP://METASERVER" + program + "(StoredProcess)");
			
			final StoredProcessOptions storedProcessOptions = new StoredProcessOptions();
			storedProcessOptions.setSessionContextInterface(connection.getSessionContext());

			//Get URL parameters
			//@SuppressWarnings("rawtypes")
			//Map storedProcessParameters = StoredProcessFacade.getStoredProcessParametersFromRequest(request);
			this.storedProcessInputParameterValues = facade.getStoredProcessParametersFromRequest(request);

			storedProcessInputParameterValues.put(_URL_KEY, request.getRequestURI());

			// Set the _RESULT parameter to indicate streaming results are desired when the
			// stored process supports streaming.
			storedProcessInputParameterValues.put(StoredProcessFacade.RESULT_PARAMETER_KEY, StoredProcessFacade.RESULT_PARAMETER_STREAM_VALUE);

			
			// Create a facade for executing the SAS Stored Process
			//facade = new StoredProcessFacade(connection, path, storedProcessParameters, storedProcessOptions);
/*
			Map params = facade.getStoredProcessParametersFromRequest(request);
			Set paramKey = params.keySet();
			Iterator itr = params.keySet().iterator();
			while (itr.hasNext()) {
				String key = (String)itr.next();
				String[] value = (String[])params.get(key);
				storedProcessParameters.put(key, value[0]);
				logger.debug(key + " : " + value[0]);
			}
*/		
			//facade.setParameterValues(params);

			// Place the facade into the session so it can be used in a possible replay scenario
			//session.setAttribute(STORED_PROCESS_FACADE, facade);
			

/*			
			// Add the facade to the StoredProcessDestroyableObject so ExamplesSessionBindingListener
			// can clean it up when the session expires
			StoredProcessDestroyableObject destroyableObject = 
				(StoredProcessDestroyableObject) session.getAttribute(STORED_PROCESS_DESTROYABLE_OBJECT);
			if (destroyableObject == null)
			{
				destroyableObject = new StoredProcessDestroyableObject();
				STPSessionBindingListener.getInstance(session).addDestroyableObject(destroyableObject);
			}
			destroyableObject.addFacade(facade);				
*/
			
			// Retrieve the session id from parameters which came from the HttpServletRequest 
			// (retrieved above via StoredProcessFacade.getStoredProcessParametersFromRequest)
			String sessionId = null;
			final String[] sessionIdValues = (String[]) storedProcessInputParameterValues.get(StoredProcessFacade.SESSION_ID_KEY);
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
			//handleExecutionStatus(facade);
			
			ex = facade.getExecutionObject();
			String log = ex.readSASLog(ExecutionBaseInterface.LOG_FORMAT_HTML,ExecutionBaseInterface.LOG_ALL_LINES);
			String [] logs = {log};

			Long curDT = new Date().getTime();
			int ran = (int)(Math.random() * 1000);
			
			String logID = curDT.toString() + ran;
			LinkedHashMap<String, String[]> SASLogs = (LinkedHashMap<String, String[]>)session.getAttribute("SASLogs");
			SASLogs.put(logID,logs);
			session.setAttribute("SASLogs",SASLogs);			

			return ex;
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
	 * Returns the execution object for this stored process. The return value will be non-null
	 * only if one of the executeStoredProcess methods has been called first.
	 * 
	 * @return A {@link com.sas.services.storedprocess.Execution2Interface} object describing
     * the state and the results of the execution for this stored process.
     * The {@link com.sas.services.storedprocess.Execution2Interface#getStatus()} method provides 
     * information about different completion codes generated by the execute() method.
     * 
     * @see #executeStoredProcess()
	 * @see #executeStoredProcess(boolean)
	 * @see #executeStoredProcess(boolean, ExecutionStatusListener2Interface, boolean, Object)
	 */
	public Execution2Interface getExecutionObject()
	{
		return ex;
	}
	
	
	/**
	 * @see Execution2Interface#waitForCompletion()
	 */
	public int waitForCompletion() 
		throws RemoteException, InterruptedException
	{
		return ex.waitForCompletion();
	}
	
	
	/**
	 * @see StoredProcess2Interface#getParameters()
	 */
	public List<PromptDefinitionInterface> getParameters() 
		throws IllegalStateException, ServiceException, RemoteException 
	{
		return Arrays.asList(storedProcess.getParameters());
	}
	

	/**
	 * Returns a list of the output parameters for a stored process with the values resulting
	 * from executing the stored process.
	 *	 
	 * This method should be called after the stored process has been executed.
	 * 
	 * @return A list of the output parameters for a stored process with result values, or an empty list if
	 * the stored process has not been executed.
	 * @throws TransportException
	 * @throws RemoteException
	 */
	public List<OutputParameterInterface> getOutputParametersWithValues()
		throws TransportException, RemoteException
	{
		List<OutputParameterInterface> outputParameters = new ArrayList<OutputParameterInterface>();
		if (ex != null)
		{
			outputParameters = ex.getOutputParameters();
		}
		
		return outputParameters;
	}
	
	
	/**
	 * @see StoredProcess2Interface#isStreamCapable()
	 */
	public boolean isStreamCapable() 
		throws RemoteException
	{
		return storedProcess.isStreamCapable();
	}
	
	
	/**
	 * @see StoredProcess2Interface#isPackageCapable()
	 */
	public boolean isPackageCapable() 
		throws RemoteException
	{
		return storedProcess.isPackageCapable();
	}
	
	
	/**
	 * @see StoredProcess2Interface#getPromptValues()
	 */
	public PromptValuesInterface getPromptValues() 
		throws RemoteException
	{
		return storedProcess.getPromptValues();
	}
	
	
	/**
	 * @see StoredProcess2Interface#setPromptValues(PromptValuesInterface)
	 */
	public void setPromptValues(final PromptValuesInterface promptValues) 
		throws RemoteException
	{
		storedProcess.setPromptValues(promptValues);
	}
	
	public void setParameterValues(Map map) throws RemoteException, ServiceException{
		storedProcess.setParameterValues(map);
	} 
	

	protected void setStreamingResultsContentType(final Execution2Interface execution, final String streamName) 
		throws IllegalStateException, IOException
	{
		// Set up access to the stream
		final InputStream inputStream = execution.getInputStream(streamName);
		final InputStreamHeaderInterface inputStreamHeader = execution.getInputStreamHeader(streamName);
		
		if (inputStream != null) 
		{
			if (inputStreamHeader != null)
			{
				streamingResultsContentType = inputStreamHeader.getContentType();
			}
		}
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
	
	
	public void writeStreamingResults(final OutputStream outputStream, final Execution2Interface executionObject) 
		throws IllegalStateException, IOException
	{
		final BufferedInputStream inData = 
			new BufferedInputStream(executionObject.getInputStream(MetadataConstants.WEBOUT));
		
		final BufferedOutputStream outData = new BufferedOutputStream(outputStream);
		
		final byte[] buffer = new byte[4096];
		for (int n = 0; (n = inData.read(buffer, 0, buffer.length)) > 0; )
		{
			outData.write(buffer, 0, n);
		}
		outData.flush();
	}
	
	
	public String getStreamingResultsContentType()
	{
		return streamingResultsContentType;
	}
	
	
	public boolean isContentTypeText()
	{
		boolean isTypeText = false;

		if (streamingResultsContentType != null)
		{
			int slashIndex = streamingResultsContentType.indexOf("/");
			if (slashIndex > 0)
			{
				final String type = streamingResultsContentType.substring(0, slashIndex).trim();
				isTypeText = type.trim().matches("text");
			}
		}
		
		return isTypeText;
	}
	
	
	/**
	 * @see Execution2Interface#readSASLog(int, int)
	 */
	public String getSASLog(int logFormat, int maximumLines) 
		throws TransportException, RemoteException, IllegalStateException
	{
		return ex.readSASLog(logFormat, maximumLines);
	}
	
	
	/**
	 * Convenience method to call {@link #getSASLog(int, int)} to retrieve all lines of the
	 * SAS log as unformatted text. 
	 */
	public String getSASLogAsText() throws TransportException, RemoteException, IllegalStateException
	{
		return getSASLog(ExecutionBaseInterface.LOG_FORMAT_TEXT, ExecutionBaseInterface.LOG_ALL_LINES);
	}
	
	
	/**
	 * Convenience method to call {@link #getSASLog(int, int)} to retrieve all lines of the
	 * SAS log wrapped by a &lt;pre&gt; for use in HTML.
	 */
	public String getSASLogAsHtml() throws TransportException, RemoteException, IllegalStateException
	{
		return getSASLog(ExecutionBaseInterface.LOG_FORMAT_HTML, ExecutionBaseInterface.LOG_ALL_LINES);
	}
	
	
	/**
	 * Gets the underlying {@link StoredProcess2Interface} object which this StoredProcessFacade represents.
	 * 
	 * @return the underlying {@link StoredProcess2Interface} object which this StoredProcessFacade represents.
	 * @throws ServiceException
	 * @throws RemoteException
	 * @see StoredProcess2Interface
	 */
	public StoredProcess2Interface getStoredProcess()	
		throws ServiceException, RemoteException
	{
		StoredProcess2Interface stp2 = storedProcess;		

		if (stp2 == null)
		{
		
			// Since the server is known, get the stored process metadata object directly from the server.
			// When the server is not known, then use the information service to get the stored
			// process metadata object:
			final InformationServiceInterface infoService = connection.getInformationService();
			MetadataInterface metadataObject = null;
			//if (infoService == null) {
				final ServerInterface authServer = connection.getAuthServer();
				metadataObject = authServer.getObjectByPath(pathUrl);
			//} else {
				//final UserContextInterface userContext = connection.getUserContext();
				//metadataObject = infoService.getObjectByPath(userContext, pathUrl);
			//}
/*			
 * 
*/	
			if (metadataObject != null){
				metaID=metadataObject.getReposId();
			} else {
				logger.error("metadataObject is null : pathUrl is " + pathUrl );
			}
			
			
			if (metadataObject instanceof StoredProcessInterface)
			{
				final StoredProcessInterface stp = (StoredProcessInterface) metadataObject;
				stp2 = (StoredProcess2Interface) stp.newServiceObject(storedProcessOptions);			
			}
		}
		else {
			logger.debug("StoredProcess Object will reuse!!!");;
		}
 
		return stp2;
	}
	
	
	/**
	 * Get input stream header from stored process and write it to the response.
	 * 
	 * @param execution can be the execution object from the initial stored process, a replay 
	 * stored process, or a subsequent stored process. This object must be passed in since the
	 * StoredProcessFacade contains up to two stored process execution instances at any time (one
	 * non-replay and one replay).	
	 */
	public void writeResponseContentType(final HttpServletRequest request, 
			final HttpServletResponse response,	final Execution2Interface execution)
		throws RemoteException,	IOException 
	{
		if (execution != null)
		{
			final String streamName = MetadataConstants.WEBOUT;
			
			// Get the content type from the input stream header and store it for later use
			setStreamingResultsContentType(execution, streamName);
			
			
			final InputStreamHeaderInterface header = execution.getInputStreamHeader(streamName);

			if (header != null) 
			{
				if (isContentTypeText() == true)
				{
					// Text content is being returned, so use the encoding from the request when
					// setting the content type
					setResponseContentType(request, response, execution);					
				}
				else 
				{
					// Non-text content (for instance, image/gif or image/png) is being returned,
					// so set appropriate headers in the response from the headers in the input stream
					// header.
					@SuppressWarnings("unchecked")					
					final Map<String, String> headerlines = header.getHeaders();
					if (headerlines != null) 
					{
						final Iterator<String> it = headerlines.keySet().iterator();
						while (it.hasNext() == true) 
						{
							final String key = it.next();
							response.addHeader(key, headerlines.get(key));
						}
					}
				}
			}
			else
			{
				// No input stream header was found, so set the encoding directly
				setResponseContentType(request, response, execution);				
			}
		}
	}
	
	
	public void setResponseContentType(final HttpServletRequest request,
			final HttpServletResponse response, final Execution2Interface execution)
		throws RemoteException, IOException 
	{
		final String storedProcessContentType = getStreamingResultsContentType();		

		// Initialize the content-type header for the response to be whatever came from the 
		// stored process. This value will be used if the MIME type portion of the content-type
		// header is NOT text.
		String responseContentType = storedProcessContentType;
		
		if (isContentTypeText() == true)
		{
			// If the MIME type portion of the content-Type header is text, then need to adjust
			// the character encoding to match whatever was specified in the request if it was
			// set.
			String charset = getOutputCharacterEncoding(request, response, execution);
			
			final int typeSeparatorIndex = storedProcessContentType.indexOf(";");
			
			String mimeType = storedProcessContentType;
			if (typeSeparatorIndex > 0)
			{
				mimeType = storedProcessContentType.substring(0, typeSeparatorIndex + 1);
			}
			else
			{
				mimeType += ";";
			}
			
			responseContentType = mimeType + " charset=" + charset;
		}
		
		response.setContentType(responseContentType);
	}

	
	private String getOutputCharacterEncoding(final HttpServletRequest request,
			final HttpServletResponse response, final Execution2Interface execution)
		throws RemoteException, IOException 
	{
		String charset = BaseUtil.getOutputCharacterEncoding(request);
		if (request.getParameter("charset") != null){
			charset = request.getParameter("charset");
		}
		
		if (charset == null)
		{
			// If no encoding was set on the request, then check to see if there is an
			// encoding set on the input stream header. If so, use it.
			if (execution != null)
			{
				final InputStreamHeaderInterface inputStreamHeader = execution.getInputStreamHeader(MetadataConstants.WEBOUT);
				if (inputStreamHeader != null)
				{
					charset = inputStreamHeader.getCharacterEncoding();
				}
			}
		}
			
		// If the facade was null or the inputStreamHeader did not have an encoding,
		// then get the encoding from the response.
		if (charset == null)
		{
			charset = response.getCharacterEncoding();
		}

		return charset;
	}
	
	
	/**
	 * Handle the execution of a replay stored process.
	 * <p> 
	 * See the SAS Stored Processes Developer's Guide for more information about replay.
	 */	
	public Execution2Interface replay(final HttpServletRequest request) 
		throws IllegalArgumentException, RemoteException, ServiceException, InvalidPromptValueException, IllegalStateException
	{
		replayStoredProcess = createManuallyDefineStoredProcess();
		
		replayStoredProcess.setSourceFromFile("", REPLAY_PROGRAM_VALUE);
		replayStoredProcess.setName("Replay");

		// Get URL parameters from the request
		Map<String, String[]> paramMap = StoredProcessFacade.getStoredProcessParametersFromRequest(request);

		final String[] programValues = paramMap.get(PROGRAM_KEY);
		logger.debug("programValues : " + programValues.toString());
		
		if (programValues != null)
		{
			final String program = programValues[0];
			logger.debug("program : " + program);

			if ((program == null) || (program.toLowerCase().compareTo(REPLAY_PROGRAM_VALUE) != 0))
			{
				throw new IllegalStateException("The parameter _PROGRAM must be set to replay.");
			}
		}
		
		final String[] sessionIdValues = paramMap.get(SESSION_ID_KEY);
		final String sessionId = sessionIdValues[0];
		logger.debug("sessionId : " + sessionId);
	

		// Set stored process parameters
		replayStoredProcess.setParameterValues(paramMap);
		replayStoredProcess.setParameterValue(RESULT_PARAMETER_KEY, RESULT_PARAMETER_STREAM_VALUE);
		
		// Run stored process
		try 
		{
			replayExecution = replayStoredProcess.execute(false, null, false, sessionId);
		} 
		catch (Exception e) 
		{
			logger.error("Error when performing stored process replay: "
					+ e.getLocalizedMessage(), e);
			throw new IllegalStateException(e);
		}

		return replayExecution;
	}

	
	public static Map<String, String[]> getStoredProcessParametersFromRequest(final HttpServletRequest request) 
	{
		final Map<String, String[]> paramMap = new HashMap<String, String[]>();
		@SuppressWarnings("unchecked")
		final Enumeration<String> params = request.getParameterNames();
		while (params.hasMoreElements() == true) 
		{
			String key = params.nextElement();
			String values[] = request.getParameterValues(key);
			paramMap.put(key, values);
		}
		
		return paramMap;
	}


	public StoredProcess2Interface createManuallyDefineStoredProcess() 
		throws InitializationException,	RemoteException 
	{
		final StoredProcessOptions spOptions = new StoredProcessOptions();
		spOptions.setSessionContextInterface(connection.getSessionContext());
		
		final StoredProcessServiceInterface storedProcessService = connection.getStoredProcessService();

		// Create manually defined StoredProcess
		final StoredProcess2Interface definedStoredProcess =
				(StoredProcess2Interface) storedProcessService.newStoredProcess(
						StoredProcessBaseInterface.SERVER_TYPE_STOREDPROCESS, spOptions);
		
		return definedStoredProcess;
	}
	

	public StoredProcess2Interface getReplayStoredProcess()
	{
		return replayStoredProcess;
	}

	
	public int replayWaitForCompletion() 
		throws RemoteException, InterruptedException
	{
		return replayExecution.waitForCompletion();
	}
	public String getMetaID(){
		return metaID;
	}	
	
}