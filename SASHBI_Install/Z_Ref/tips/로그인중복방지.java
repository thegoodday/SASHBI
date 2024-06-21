/* 
* �α��� �ߺ�üũ
* �̹� �α����� ����ڰ� ������� ������ ����� ������ ������ �ڽ��� �α���.
* �ؽ����̺� ���ǰ� ������ ���̵� ������ �д�.
* ���� Object�� �����ϴ� ������ ������ ���̵�� ������ ������� 
* ���̵�� ����Object�� ã�Ƴ��� ������ ������ �������ؼ���.(invalidate)
*/ 


============== WEB-INF\src\test\LoginManager.java ===============
package test; 

import java.util.*;
import javax.servlet.http.*;
/*
* session�� ������������ ó���ϱ� ���� ���
* static�޼ҵ忡���� static����� �ϹǷ�static���� �����Ѵ�.
*/
public class LoginManager implements HttpSessionBindingListener{

    private static LoginManager loginManager = null;
    
    //�α����� �����ڸ� ������� �ؽ����̺�
    private static Hashtable loginUsers = new Hashtable();
    
    /*
     * �̱��� ���� ���
     */
    public static synchronized LoginManager getInstance(){
        if(loginManager == null){
            loginManager = new LoginManager();
        }
        return loginManager;
    }
     
    
    /*
     * �� �޼ҵ�� ������ ��������� ȣ��ȴ�.(session.setAttribute("login", this))
     * Hashtable�� ���ǰ� ������ ���̵� �����Ѵ�.
     */
    public void valueBound(HttpSessionBindingEvent event) {
        //session���� put�Ѵ�.
        loginUsers.put(event.getSession(), event.getName());
        System.out.println(event.getName() + "���� �α��� �ϼ̽��ϴ�.");
        System.out.println("���� ������ �� : " +  getUserCount());
     }
    
    
     /*
      * �� �޼ҵ�� ������ �������� ȣ��ȴ�.(invalidate)
      * Hashtable�� ����� �α����� ������ ������ �ش�.
      */
     public void valueUnbound(HttpSessionBindingEvent event) {
         //session���� ã�Ƽ� �����ش�.
         loginUsers.remove(event.getSession());
         System.out.println("  " + event.getName() + "���� �α׾ƿ� �ϼ̽��ϴ�.");
         System.out.println("���� ������ �� : " +  getUserCount());
     }
     
     
     /*
      * �Է¹��� ���̵� �ؽ����̺��� ����. 
      * @param userID ����� ���̵�
      * @return void
      */ 
     public void removeSession(String userId){
          Enumeration e = loginUsers.keys();
          HttpSession session = null;
          while(e.hasMoreElements()){
               session = (HttpSession)e.nextElement();
               if(loginUsers.get(session).equals(userId)){
                   //������ invalidate�ɶ� HttpSessionBindingListener�� 
                   //�����ϴ� Ŭ������ valueUnbound()�Լ��� ȣ��ȴ�.
                   session.invalidate();
               }
          }
     }
     
     
     /*
      * ����ڰ� �Է��� ID, PW�� �´��� Ȯ���ϴ� �޼ҵ�
      * @param userID ����� ���̵�
      * @param userPW ����� �н�����
      * @return boolean ID/PW�� ��ġ�ϴ� �� ����
      */
     public boolean isValid(String userId, String userPw){
         
         /*
          * �̺κп� Database ������ ����.
          */
         return true;
     }


    /*
     * �ش� ���̵��� ���� ����� �������ؼ� 
     * �̹� ������� ���̵������� Ȯ���Ѵ�.
     * @param userID ����� ���̵�
     * @return boolean �̹� ��� ���� ��� true, ������� �ƴϸ� false
     */
    public boolean isUsing(String userID){
        return loginUsers.containsValue(userID);
    }
     
    
    /*
     * �α����� �Ϸ��� ������� ���̵� ���ǿ� �����ϴ� �޼ҵ�
     * @param session ���� ��ü
     * @param userID ����� ���̵�
     */
    public void setSession(HttpSession session, String userId){
        //�̼����� Session Binding�̺�Ʈ�� �Ͼ�� ����
        //name������ userId, value������ �ڱ��ڽ�(HttpSessionBindingListener�� �����ϴ� Object)
        session.setAttribute(userId, this);//login�� �ڱ��ڽ��� ����ִ´�.
    }
     
     
    /*
      * �Է¹��� ����Object�� ���̵� �����Ѵ�.
      * @param session : ������ ������� session Object
      * @return String : ������ ���̵�
     */
    public String getUserID(HttpSession session){
        return (String)loginUsers.get(session);
    }
     
     
    /*
     * ���� ������ �� ����� ��
     * @return int  ���� ������ ��
     */
    public int getUserCount(){
        return loginUsers.size();
    }
     
     
    /*
     * ���� �������� ��� ����� ���̵� ���
     * @return void
     */
    public void printloginUsers(){
        Enumeration e = loginUsers.keys();
        HttpSession session = null;
        System.out.println("===========================================");
        int i = 0;
        while(e.hasMoreElements()){
            session = (HttpSession)e.nextElement();
            System.out.println((++i) + ". ������ : " +  loginUsers.get(session));
        }
        System.out.println("===========================================");
     }
     
    /*
     * ���� �������� ��� ����ڸ���Ʈ�� ����
     * @return list
     */
    public Collection getUsers(){
        Collection collection = loginUsers.values();
        return collection;
    }
}

/*
* ���� ��κ��� ������Ʈ�� ���� �������� ���� �α�����
* �Ǵٽ� �ٸ��������� ���� �α����� �ϸ� �α����� �Ǵ°��� Ȯ���ϽǼ�
* �ֽ��ϴ�. �̴� ��... ���������� ������ ���̵�� ������ �Ҽ��ִٴ� ���� 
* �ϴ�. �̿� �ݴ�� �޽����������� �̹� �α����� �Ǿ������� �ٸ�������
* �α����� �ϸ� ������ �������� ����� ��ɵ� ������ �̴ϴ�. �̸� ����
* �� �����Ͽ� ���ҽ��ϴ�. 
* �� �����ҽ��� �츮�� �����Ϸ��� �������� ���� �ٽ����� �κ��� �ð���
* �� �ҽ��Դϴ�.
* ���⼭ HttpSessionBindingListener�� ���� �����̳ʿ��� ������ ���涧
* (valueUnBound)�� �̸� �����ϴ� ������Ʈ�� �ش� ���ǿ� setAttribute��
* ��(valueBound) ȣ���մϴ�. ���� �̸� �����ϴ������� ������ ����� ��
* ���� ��Ȯ�� ��Ƴ��� �����Դϴ�. ����ڰ� �α׾ƿ���ư�� �����õ� ����
* �� ������ Ÿ�Ӿƿ��Ǵ°�쵵 ������ ���ܾ� �ϱ� �����Դϴ�. �׸��� 
* �������� �ݱ��ư, Alt+F4, Ctrl+E��ư �� ������ �̺�Ʈ�� ��¹���� 
* �������� �˾ƺ����� �սô�.
=============================== login.jsp ============================
<%
    /*
     * �α��� ������, �α����� ���� �α��ε� �̿��ڼ��� ����Ѵ�.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR"%>
<%@ page import="test.LoginManager"%>
<%!
    //�̱��� ������ ����Ͽ��� ������ �����Ǿ��ִ� �ν��Ͻ��� ���´�.
    LoginManager loginManager = LoginManager.getInstance(); 
%>
<%
    //login_try���� �α����� ���� ������� ���ǿ� �����ִ� userId�� �����Ѵ�.
    session.removeAttribute("userId");
%>
<html>
<head>
    <title>�α��� �ߺ����� Test</title>
</head>
<body>
    <h3 align="center">���� ������ �� : <%=loginManager.getUserCount() %>��</h3>
    <form action="login_try.jsp" name="login">
        <div align="center">
            ���̵�  :   <input type="text" name="userId"><br>
            ��й�ȣ    :   <input type="passward" name="userPw"><br>
            <input type="submit" value="�α���">
        </div>
    </form>
</body>
</html>




============================= login_try.jsp ============================
<%
    /*
     * �α��� �õ�������, id, pw������ üũ�ϰ�, �ùٸ��ٸ� 
     * �̹� ������ ���̵����� üũ�Ѵ�. �̹� ������ ���̵���
     * ���� ������ �����Ұ�����, ���������� kill��Ű�� �α����Ұ������� 
     * Ȯ���Ѵ�.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR" %>
<%@ page import="test.LoginManager"%>
<%!
    //�̱��� ������ ����Ͽ��� ������ �����Ǿ��ִ� �ν��Ͻ��� ���´�.
    LoginManager loginManager = LoginManager.getInstance(); 
%>
<html>
<head>
    <title>�α��� �ߺ����� Test</title>
</head>
<body align="center" valign="center">
<%
    String userId = request.getParameter("userId");
    String userPw = request.getParameter("userPw");
    
    //���̵� �н����� üũ
    if(loginManager.isValid(userId, userPw)){
        
        //������ ���̵� ���ǿ� ��´�.
        session.setAttribute("userId", userId);
        
        //�̹� ������ ���̵����� üũ�Ѵ�.
        //out.println(userId);
        //out.println(loginManager.isUsing(userId));
        loginManager.printloginUsers();
        if(loginManager.isUsing(userId)){
%>
            �̹� �������Դϴ�. ������ ������ �����Ͻðڽ��ϱ�?<P>
            <a href="disconnect.jsp">�� </a>
            <a href="login.jsp">�ƴϿ�</a>
<%
        }else{
            loginManager.setSession(session, userId);
            response.sendRedirect("login_ok.jsp");
        }
%>
<%
    }else{
%>
        <script>
            alert("�α����� �̿��� �ּ���.");
            location.href = "login.jsp";
        </script>
<% 
    }
%>
</body>
</html>




========================== disconnect.jsp ============================
<%
    /*
     * login_try.jsp���� �α��� �ߺ��� �����ϰ� �α����Ұ�� ȣ��.
     * ������ session�� ���� hashTable�� ������ login_ok.jsp�� ȣ��.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR" %>
<%@ page import="test.LoginManager"%>
<%!
    //�̱��� ������ ����Ͽ��� ������ �����Ǿ��ִ� �ν��Ͻ��� ���´�.
    LoginManager loginManager = LoginManager.getInstance(); 
%>
<html>
<head>
    <title>�α��� �ߺ����� Test</title>
</head>
<body>
<%
    String userId = (String)session.getAttribute("userId");
    if(userId != null){
        //������ ����(����)�� ���´�.
        loginManager.removeSession(userId);
        
        //���ο� ������ ����Ѵ�. setSession�Լ��� �����ϸ� valueBound()�Լ��� ȣ��ȴ�.
        loginManager.setSession(session, userId);
        response.sendRedirect("login_ok.jsp");
    }
%>
</body>
</html>




============================= login_ok.jsp ============================
<%
    /*
     * ���������� �α��εǾ������ ȣ��
     * ������ ���̵� �����ְ� ���� �������� ��� ����ڸ� �ѷ��ش�.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR" %>
<%@ page import="java.util.*, test.LoginManager"%>

<%!
    //�̱��� ������ ����Ͽ��� ������ �����Ǿ��ִ� �ν��Ͻ��� ���´�.
    LoginManager loginManager = LoginManager.getInstance(); 
%>
<html>
<head>
    <title>�α��� �ߺ����� Test</title>
</head>
<body align="center" valign="center">
<%
    //jsp���尴ü session�� �̿��Ͽ� ������ ���̵� ���´�.
    String userId = (String)session.getAttribute("userId");

    if(userId != null){
%>
        <%=userId%>�� ȯ���մϴ�.
        <a href="logout.jsp">�α׾ƿ�</a>
        <p>
        ���� ������ : <br>
<%
        Collection collection = loginManager.getUsers();
        Iterator iterator = collection.iterator();
        int i=0;
        while(iterator.hasNext()){
            out.print((++i)+". "+iterator.next()+"<br>");
        }
    }else{
%>
        <script>
            alert("�α����� �̿��� �ּ���.");
            location.href = "login.jsp";
        </script>
<% 
    }
%>
</body>
</html>



============================= logout.jsp ==============================
<%
    /*
     * �α׾ƿ��� Ŭ�������� ȣ��ȴ�.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR" %>
<%
//session�� Ȯ~~~���� ������. �̽����� LoginManager�� valueUnbound()�� ȣ��ȴ�.
session.invalidate();
response.sendRedirect("login.jsp");
%>

���ݱ��� �ߺ��α��� üũ�� �������� �׽�Ʈ�� �� ���Ҵ�.

ó�� ���¿��� ����ߴ� ������ �ݱ��ư, 

������ �ݱ� ����Ű�� Alt+F4, Ctrl+E�� ���������� ������ ���¹���� 

�˾ƺ��ڴ�. �츮�� �Ʒ� ������ �����ߴ� ������ ���� �˾ƺ���.

Ư�� ����ڰ� �α����� �õ��Ѵٰ� �����غ���. 

�Ϲ� ������Ʈ������ �α������ϰ� �ٸ��ʿ��� 

�α����� �õ��Ұ�� �ƹ��� ��å���� �α����� ����Ͽ���.

�츮�� ���� ����ϴ� �޽����� ���� ����.

�޽����� ��� �α����� ������ �̹� �������̶�� �޽����� �߰Եȴ�.

���� ���Ͱ��� �޽����� ���÷� ��ٸ� 

�ڽ��� id�� �������� �����ؼ� ������̶�� ����� �˼��������̴�...

�׷� ������ �´ٸ� �츮�� id, password�� �����Ͽ� ���������� 

������� ������ �������̴�. 

�׸��� ���ϳ� �ڽ��� �������� �����߿� �� 3���� �������� �α����� �ߴٸ�

�������� �ٸ������� �������̶�� �޽����� �ѷ��ټ� �ִٸ� �ξ� �� ����

���̴�.

�츮�� ���� ���������� ��� �������� �ִ�.

������� ����ϱ� ���ؼ��� �α��ν� �������� �ڽ��� id�� 

�̹� �α��� �������� �˾Ƴ��°��� �߿��ϴ�. 

�׸��� �̹� �α��εȰ��� Ȯ�� �Ǿ��ٸ� �ڽ��� �α����ϱ⸦ ���Ѵٸ� 

�̹� �α����� ������ ���� �ڽ��� ������ ����ؾ��Ѵ�.. 

�׷��� ���ؼ� �츮�� �ؽ����̺��� ����Ͽ�����..

������ ������ �������ؼ� ���� ������Ʈ�� ���� ��Ҵ�.

�������� �������� �ڽ��� id�� �̹� �α��������� �˾Ƴ��°��̴�.

�츮�� �α����� �ϰ� ������ �α׾ƿ���ư�� Ŭ���ߴٸ� �״�� ������ ����

�ٸ��������� �α����� �ٷ� ����ϸ� ������ �ݱ��ư�� �������� 

Alt+F4, Ctrl+E�� ������ �̺�Ʈ�� �������ϸ� �ȵȴٴ°��̴�.

�׷��� ���ϸ� �� ������ ������ �޸𸮿� ��� ��Ƽ� ������ Ÿ�Ӿƿ��Ǳ�

������ ��� ����������̴�.(�̶��� HttpSessionBindingListener�� valueUnbound�Լ��� ���� �����̳ʿ��� ȣ���Ѵ�.)

���������� �α׾ƿ���ư�� ������ �������� �ݴ»���� ����ְڴ°�?

����� ����ڵ��� �α׾ƿ��� ���� �ʰ� �ٷ� �ݾƹ������̴�.

���⼭ ���� ������� �ݾ����� �̺�Ʈ�� ������ �ִ� ����� �����ϰڴ�.

������ �����ϴ�.




============================== main.jsp ==============================
<frameset rows="0,*" border="0">
    <frame name="duplChkFrame" scrolling=no frameborder=0 marginwidth="0" marginheight="0" src='frame.html' noresize>
    <frame name="topFrame" scrolling="no" frameborder=0 marginwidth="0" marginheight="0" target="mainFrame" src="mainFrame.jsp" noresize>
</frameset>


============================== frame.html' ============================
<html>
<head>
<script>
    /**
    * logout()
    * �� �� �� : ��ȫ��
    * �� �� �� : 2006-12-18
    * ��    ��  : �������� �ݱ�� ȣ��
    * return�� : void
    */
    function logout(){
        location.href = 'logout.jsp';
    }
</script>

</head>
<body OnUnload="logout()">
</body>
</html>






��ó�� onUnLoad�̺�Ʈ�� ����ϸ� �ȴ�.

���������� ���� ������ �������� �ϳ��� �����Ӹ����� �Ǿ��ִٸ�..

������ �̵��ø��� onUnLoad�̺�Ʈ�� �߻��Ѵٴ°��̴�..

�� �������� �̵��ø��� �α׾ƿ��� �߻��Ѵٴ¶��̸� 

��� ������ ���ܼ� �������� �̵��Ҽ� ���ٴ� ���� �ȴ�.

�̸� �����ϱ� ���ؼ� ���������� ����� ���� �����ӿ���

�Ϲ����� �������� ȣ���� �ϰ� �α׾ƿ� �������� ȣ���ϴºκ���

�������� ������� �ʴ� frame.html���� �α׾ƿ� ó���� �ϴ°��̴�.

�������� �ݱ涧 frame.html���� onUnLoad�̺�Ʈ�� �߻��Ͽ�

logout.jsp�� ȣ���ϴ°��̴�.

��... �׸��� �Ѱ��� ���ΰ�ħ��ư�̳� F5����ư ���콺 ������ ��ư�� 

Ŭ���ϰ� ���ΰ�ħ�� �Ұ��� ��¿�� ���ٴ� ���̴�..

�������� �ٽ� �θ��°��̱⶧���� �������� �θ����� ������������ 

�ױ����� onUnload�̺�Ʈ�� �߻��Ѵٴ� ���̴�. �̸� �ذ��ϱ� ���ؼ��� 

���콺 �����ʹ�ư ����� �޴� ������ �ʱ�, Ű���̺�Ʈ���� F5��Ű��

���¼��ۿ��� ����.^^;

�̰����� �ߺ��α���üũ ���¸� ��ġ�ڴ�...^^*



��ó: http://otep.tistory.com/333 [����α�]