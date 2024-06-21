package com.sas.hbi.servlets;

import java.io.*;
import java.util.Properties;
import javax.servlet.*;
import javax.servlet.http.*;
import com.sas.actionprovider.HttpActionProvider;
import com.sas.servlet.util.BaseUtil;
import com.sas.storage.jdbc.JDBCConnection;
import com.sas.storage.jdbc.JDBCAdapter;
import com.sas.util.SasPasswordString;
import com.sas.web.keys.ComponentKeys;
import com.sas.hbi.listeners.STPSessionBindingListener;

public class JDBCControllerServlet extends javax.servlet.http.HttpServlet
{
	// Declare a default version ID since parent class implements java.io.Serializable
	private static final long serialVersionUID = 1L;
	// Global webapp Strings
	private static final String ACTION_PROVIDER = "sas_actionProvider_JDBCDefaultExample";
	// Global webapp JDBC variables
	private static final String	SAS_MODEL = "sas_model_JDBCDefaultExample";
	private static final String	JDBC_CONNECTION = "sas_JDBCConnection_JDBCDefaultExample";
	private static final String	JDBC_DRIVER_NAME = "com.sas.rio.MVADriver";
	private static final String	JDBC_DATABASE_URL = "jdbc:sasiom://koryhh5.apac.sas.com:8591";

	private static final Properties staticJDBCConnectionProperties = new Properties();
	static {	// Specify JDBC connection properties here
		// Use: staticJDBCConnectionProperties.put("<property name>", "<property value>");
	}

    /* 
     * doPost()
     * Respond to the Post message.
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        // Note: Calling doGet to provide same behavior to POST and GET HTTP methods.
		doGet(request, response);
    }

    /*
     * doGet()
     * Respond to the Get message.
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException
    {
        // Note: Add User DO_GET code here
		HttpSession session = request.getSession();

		// Ensure character set is specified before calling response.getWriter().
		String charset = BaseUtil.getOutputCharacterEncoding(request);
		response.setContentType("text/html; charset=" + charset);
		// Setup the ActionProvider
		HttpActionProvider sas_actionProvider = null;
		synchronized (session) {
			if (session != null){
				sas_actionProvider = (HttpActionProvider)session.getAttribute(ACTION_PROVIDER);
			}
			// If ActionProvider is null, create one and put it on the session
			if (sas_actionProvider == null) {
				sas_actionProvider = new HttpActionProvider();
				sas_actionProvider.setLocale(request.getLocale());
				sas_actionProvider.setControllerURL(request.getContextPath() + "/JDBCDefaultExample");
				sas_actionProvider.setName(ACTION_PROVIDER);
				// store object in its scope
				if (session != null)
					session.setAttribute(ACTION_PROVIDER, sas_actionProvider);
			}
			// Else execute the ActionProvider command
			else{
				sas_actionProvider.executeCommand(request, response, response.getWriter());
			}
		}

		synchronized (session) {
			// Setup the JDBC connection
			JDBCConnection sas_JDBCConnection = null;
			if (session != null){
				sas_JDBCConnection = (JDBCConnection)session.getAttribute(JDBC_CONNECTION);
			}

			if (sas_JDBCConnection == null){
				try{
					sas_JDBCConnection = new JDBCConnection();
					sas_JDBCConnection.setDriverName(JDBC_DRIVER_NAME);
					sas_JDBCConnection.setDatabaseURL(JDBC_DATABASE_URL);
					ServletConfig sc = getServletConfig();
					Properties connectionProperties = new Properties();
					// Add static JDBC connection properties
					connectionProperties.putAll(staticJDBCConnectionProperties);
					// Add additional JDBC connection properties
					String username = sc.getInitParameter("username");
					if (username != null && username.length() > 0) {
						connectionProperties.put("user", username);
						String password = sc.getInitParameter("password");
						if (password != null && password.length() > 0) {
							// Add password property, decode if SAS password encoded
							connectionProperties.put("password", SasPasswordString.decode(password));
						}
					}
					sas_JDBCConnection.setConnectionInfo(connectionProperties);
					session.setAttribute(JDBC_CONNECTION, sas_JDBCConnection);
				}
				catch(Exception e){
					throw new ServletException(e);
				}
			}

			// TODO Setup the query for the connection, such as "select * from sashelp.class"
			String jdbcQuery = "select country from sashelp.prdsale";

			// Setup the JDBC model adapter
			JDBCAdapter adapter = null;
			if (session != null){
				adapter = (JDBCAdapter)session.getAttribute(SAS_MODEL);
			}
			if (adapter == null){
				try{
					// TODO Add code below to create the model adapter. See the com.sas.storage.jdbc package in the API for more details.
					//INSERT_MODEL_ADAPTER_CODE_HERE

					// Set it on the session
					if (session != null){
						session.setAttribute(SAS_MODEL, adapter);
						STPSessionBindingListener.getInstance(session).addAdapter(adapter);
					}
				}
				catch(Exception e){
					throw new ServletException(e);
				}
			}
		}
		
		// Forward the request to the JSP for display
		String sas_forwardLocation = request.getParameter(ComponentKeys.FORWARD_LOCATION);
		if (sas_forwardLocation == null)
		{ 
			sas_forwardLocation = "/JDBCDefaultExampleViewer.jsp";
		}
		RequestDispatcher rd = getServletContext().getRequestDispatcher(sas_forwardLocation);
		rd.forward(request, response);

    }
}