<%@ page language="java" 
    import="javax.servlet.*,
            java.io.IOException,
            java.net.URI,
            java.net.URISyntaxException,
            java.net.URL,
            java.net.URLEncoder,
            com.sas.svcs.security.authentication.client.AuthenticationClient,
            com.sas.svcs.security.authentication.client.AuthenticationClientHolder"
%>
<%
//sas.svcs.securit.authentication.client.jar

URL targetUrl = new URL("http://pt05.apac.sas.com:7990/SASHBI/");
URL casUrl = new URL(targetUrl.getProtocol(), targetUrl.getHost(), targetUrl.getPort(), "/SASLogon");

AuthenticationClient client = new AuthenticationClient(casUrl.toString());
client.logon("sasdemo","sask@123");
AuthenticationClientHolder.set(client);
final String ticket = client.acquireTicket(targetUrl.toString());
URI reconnectUri = new URI(casUrl + "?direct_authentication_ticket=" + ticket + "&service=" + URLEncoder.encode(targetUrl.toString(), "UTF-8"));
response.sendRedirect(reconnectUri.toString());
%>
<html>
<body>
<pre>    
    <%=targetUrl.toString()%> 
    <%=casUrl.toString()%>
    <%=ticket%>
    <%=reconnectUri.toString()%>
</pre>    
</body>
</html>