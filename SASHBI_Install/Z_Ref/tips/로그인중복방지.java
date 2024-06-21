/* 
* 로그인 중복체크
* 이미 로그인한 사용자가 있을경우 기존의 사용자 세션을 종료후 자신이 로그인.
* 해시테이블에 세션과 접속자 아이디를 저장해 둔다.
* 세션 Object를 저장하는 이유는 동일한 아이디로 재접속 했을경우 
* 아이디로 세션Object를 찾아내어 기존의 접속을 끊기위해서다.(invalidate)
*/ 


============== WEB-INF\src\test\LoginManager.java ===============
package test; 

import java.util.*;
import javax.servlet.http.*;
/*
* session이 끊어졌을때를 처리하기 위해 사용
* static메소드에서는 static만사용 하므로static으로 선언한다.
*/
public class LoginManager implements HttpSessionBindingListener{

    private static LoginManager loginManager = null;
    
    //로그인한 접속자를 담기위한 해시테이블
    private static Hashtable loginUsers = new Hashtable();
    
    /*
     * 싱글톤 패턴 사용
     */
    public static synchronized LoginManager getInstance(){
        if(loginManager == null){
            loginManager = new LoginManager();
        }
        return loginManager;
    }
     
    
    /*
     * 이 메소드는 세션이 연결되을때 호출된다.(session.setAttribute("login", this))
     * Hashtable에 세션과 접속자 아이디를 저장한다.
     */
    public void valueBound(HttpSessionBindingEvent event) {
        //session값을 put한다.
        loginUsers.put(event.getSession(), event.getName());
        System.out.println(event.getName() + "님이 로그인 하셨습니다.");
        System.out.println("현재 접속자 수 : " +  getUserCount());
     }
    
    
     /*
      * 이 메소드는 세션이 끊겼을때 호출된다.(invalidate)
      * Hashtable에 저장된 로그인한 정보를 제거해 준다.
      */
     public void valueUnbound(HttpSessionBindingEvent event) {
         //session값을 찾아서 없애준다.
         loginUsers.remove(event.getSession());
         System.out.println("  " + event.getName() + "님이 로그아웃 하셨습니다.");
         System.out.println("현재 접속자 수 : " +  getUserCount());
     }
     
     
     /*
      * 입력받은 아이디를 해시테이블에서 삭제. 
      * @param userID 사용자 아이디
      * @return void
      */ 
     public void removeSession(String userId){
          Enumeration e = loginUsers.keys();
          HttpSession session = null;
          while(e.hasMoreElements()){
               session = (HttpSession)e.nextElement();
               if(loginUsers.get(session).equals(userId)){
                   //세션이 invalidate될때 HttpSessionBindingListener를 
                   //구현하는 클레스의 valueUnbound()함수가 호출된다.
                   session.invalidate();
               }
          }
     }
     
     
     /*
      * 사용자가 입력한 ID, PW가 맞는지 확인하는 메소드
      * @param userID 사용자 아이디
      * @param userPW 사용자 패스워드
      * @return boolean ID/PW가 일치하는 지 여부
      */
     public boolean isValid(String userId, String userPw){
         
         /*
          * 이부분에 Database 로직이 들어간다.
          */
         return true;
     }


    /*
     * 해당 아이디의 동시 사용을 막기위해서 
     * 이미 사용중인 아이디인지를 확인한다.
     * @param userID 사용자 아이디
     * @return boolean 이미 사용 중인 경우 true, 사용중이 아니면 false
     */
    public boolean isUsing(String userID){
        return loginUsers.containsValue(userID);
    }
     
    
    /*
     * 로그인을 완료한 사용자의 아이디를 세션에 저장하는 메소드
     * @param session 세션 객체
     * @param userID 사용자 아이디
     */
    public void setSession(HttpSession session, String userId){
        //이순간에 Session Binding이벤트가 일어나는 시점
        //name값으로 userId, value값으로 자기자신(HttpSessionBindingListener를 구현하는 Object)
        session.setAttribute(userId, this);//login에 자기자신을 집어넣는다.
    }
     
     
    /*
      * 입력받은 세션Object로 아이디를 리턴한다.
      * @param session : 접속한 사용자의 session Object
      * @return String : 접속자 아이디
     */
    public String getUserID(HttpSession session){
        return (String)loginUsers.get(session);
    }
     
     
    /*
     * 현재 접속한 총 사용자 수
     * @return int  현재 접속자 수
     */
    public int getUserCount(){
        return loginUsers.size();
    }
     
     
    /*
     * 현재 접속중인 모든 사용자 아이디를 출력
     * @return void
     */
    public void printloginUsers(){
        Enumeration e = loginUsers.keys();
        HttpSession session = null;
        System.out.println("===========================================");
        int i = 0;
        while(e.hasMoreElements()){
            session = (HttpSession)e.nextElement();
            System.out.println((++i) + ". 접속자 : " +  loginUsers.get(session));
        }
        System.out.println("===========================================");
     }
     
    /*
     * 현재 접속중인 모든 사용자리스트를 리턴
     * @return list
     */
    public Collection getUsers(){
        Collection collection = loginUsers.values();
        return collection;
    }
}

/*
* 거의 대부분의 웹사이트를 보면 브라우저를 열고 로그인후
* 또다시 다른브라우저를 열고 로그인을 하면 로그인이 되는것을 확인하실수
* 있습니다. 이는 즉... 여러곳에서 동일한 아이디로 접속을 할수있다는 예입 
* 니다. 이와 반대로 메신저같은경우는 이미 로그인이 되어있을시 다른곳에서
* 로그인을 하면 접속을 끊을지를 물어보는 기능도 보셨을 겁니다. 이를 웹에
* 서 구현하여 보았습니다. 
* 본 예제소스는 우리가 구현하려고 예제에서 가장 핵심적인 부분을 맡고있
* 는 소스입니다.
* 여기서 HttpSessionBindingListener는 서블릿 컨테이너에서 세션이 끊길때
* (valueUnBound)와 이를 구현하는 오브젝트가 해당 세션에 setAttribute될
* 때(valueBound) 호출합니다. 굳이 이를 구현하는이유는 세션이 끊기는 시
* 점을 정확히 잡아내기 위함입니다. 사용자가 로그아웃버튼을 누를시도 있지
* 만 세션이 타임아웃되는경우도 세션이 끊겨야 하기 때문입니다. 그리고 
* 브라우저의 닫기버튼, Alt+F4, Ctrl+E버튼 을 누를시 이벤트를 잡는방법도 
* 차근차근 알아보도록 합시다.
=============================== login.jsp ============================
<%
    /*
     * 로그인 페이지, 로그인전 현재 로그인된 이용자수를 출력한다.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR"%>
<%@ page import="test.LoginManager"%>
<%!
    //싱글톤 패턴을 사용하였기 때문에 생생되어있는 인스턴스를 얻어온다.
    LoginManager loginManager = LoginManager.getInstance(); 
%>
<%
    //login_try에서 로그인을 하지 않을경우 세션에 남아있는 userId를 제거한다.
    session.removeAttribute("userId");
%>
<html>
<head>
    <title>로그인 중복방지 Test</title>
</head>
<body>
    <h3 align="center">현재 접속자 수 : <%=loginManager.getUserCount() %>명</h3>
    <form action="login_try.jsp" name="login">
        <div align="center">
            아이디  :   <input type="text" name="userId"><br>
            비밀번호    :   <input type="passward" name="userPw"><br>
            <input type="submit" value="로그인">
        </div>
    </form>
</body>
</html>




============================= login_try.jsp ============================
<%
    /*
     * 로그인 시도페이지, id, pw유무를 체크하고, 올바르다면 
     * 이미 접속한 아이디인지 체크한다. 이미 접속한 아이디라면
     * 기존 접속을 유지할것인지, 기존접속을 kill시키고 로그인할것인지를 
     * 확인한다.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR" %>
<%@ page import="test.LoginManager"%>
<%!
    //싱글톤 패턴을 사용하였기 때문에 생생되어있는 인스턴스를 얻어온다.
    LoginManager loginManager = LoginManager.getInstance(); 
%>
<html>
<head>
    <title>로그인 중복방지 Test</title>
</head>
<body align="center" valign="center">
<%
    String userId = request.getParameter("userId");
    String userPw = request.getParameter("userPw");
    
    //아이디 패스워드 체크
    if(loginManager.isValid(userId, userPw)){
        
        //접속자 아이디를 세션에 담는다.
        session.setAttribute("userId", userId);
        
        //이미 접속한 아이디인지 체크한다.
        //out.println(userId);
        //out.println(loginManager.isUsing(userId));
        loginManager.printloginUsers();
        if(loginManager.isUsing(userId)){
%>
            이미 접속중입니다. 기존의 접속을 종료하시겠습니까?<P>
            <a href="disconnect.jsp">예 </a>
            <a href="login.jsp">아니오</a>
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
            alert("로그인후 이용해 주세요.");
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
     * login_try.jsp에서 로그인 중복시 무시하고 로그인할경우 호출.
     * 기존의 session을 끊고 hashTable에 저장후 login_ok.jsp를 호출.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR" %>
<%@ page import="test.LoginManager"%>
<%!
    //싱글톤 패턴을 사용하였기 때문에 생생되어있는 인스턴스를 얻어온다.
    LoginManager loginManager = LoginManager.getInstance(); 
%>
<html>
<head>
    <title>로그인 중복방지 Test</title>
</head>
<body>
<%
    String userId = (String)session.getAttribute("userId");
    if(userId != null){
        //기존의 접속(세션)을 끊는다.
        loginManager.removeSession(userId);
        
        //새로운 세션을 등록한다. setSession함수를 수행하면 valueBound()함수가 호출된다.
        loginManager.setSession(session, userId);
        response.sendRedirect("login_ok.jsp");
    }
%>
</body>
</html>




============================= login_ok.jsp ============================
<%
    /*
     * 정상적으로 로그인되었을경우 호출
     * 접속자 아이디를 보여주고 현재 접속중인 모든 사용자를 뿌려준다.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR" %>
<%@ page import="java.util.*, test.LoginManager"%>

<%!
    //싱글톤 패턴을 사용하였기 때문에 생생되어있는 인스턴스를 얻어온다.
    LoginManager loginManager = LoginManager.getInstance(); 
%>
<html>
<head>
    <title>로그인 중복방지 Test</title>
</head>
<body align="center" valign="center">
<%
    //jsp내장객체 session을 이용하여 접속자 아이디를 얻어온다.
    String userId = (String)session.getAttribute("userId");

    if(userId != null){
%>
        <%=userId%>님 환영합니다.
        <a href="logout.jsp">로그아웃</a>
        <p>
        현재 접속자 : <br>
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
            alert("로그인후 이용해 주세요.");
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
     * 로그아웃을 클릭했을때 호출된다.
     */
%>
<%@ page language="java" contentType="text/html; charset=EUC-KR" %>
<%
//session을 확~~~끊어 버린다. 이시점에 LoginManager의 valueUnbound()가 호출된다.
session.invalidate();
response.sendRedirect("login.jsp");
%>

지금까지 중복로그인 체크를 막기위한 테스트를 해 보았다.

처음 강좌에서 얘기했던 윈도우 닫기버튼, 

윈도우 닫기 단축키인 Alt+F4, Ctrl+E를 수행했을때 세션을 끊는방법을 

알아보겠다. 우리가 아래 예제를 수행했던 이유를 먼저 알아보자.

특정 사용자가 로그인을 시도한다고 생각해보자. 

일반 웹사이트에서는 로그인을하고 다른쪽에서 

로그인을 시도할경우 아무런 대책없이 로그인을 허용하였다.

우리가 많이 사용하는 메신저의 예를 들어보자.

메신저의 경우 로그인을 했을시 이미 접속중이라는 메시지가 뜨게된다.

만약 위와같은 메시지가 수시로 뜬다면 

자신의 id가 누군가가 도용해서 사용중이라는 사실을 알수있을것이다...

그런 느낌이 온다면 우리는 id, password를 변경하여 정보누출을 

어느정도 막을수 있을것이다. 

그리고 또하나 자신의 계정으로 접속중에 제 3자의 누군가가 로그인을 했다면

누군가가 다른곳에서 접속중이라는 메시지를 뿌려줄수 있다면 훨씬 더 좋을

것이다.

우리가 만든 예제에서는 몇가지 문제점이 있다.

위기능을 사용하기 위해서는 로그인시 누군가가 자신의 id로 

이미 로그인 중인지를 알아내는것이 중요하다. 

그리고 이미 로그인된것이 확인 되었다면 자신이 로그인하기를 원한다면 

이미 로그인한 세션을 끊고 자신의 세션을 등록해야한다.. 

그러기 위해서 우리는 해시테이블을 사용하였으며..

기존의 세션을 끊기위해서 세션 오브젝트를 직접 담았다.

문제점은 누군가가 자신의 id로 이미 로그인중인지 알아내는것이다.

우리가 로그인을 하고 무조건 로그아웃버튼을 클릭했다면 그당시 세션을 끊어

다른곳에서의 로그인을 바로 허용하면 되지만 닫기버튼을 누를때나 

Alt+F4, Ctrl+E를 누를때 이벤트를 잡지못하면 안된다는것이다.

그렇지 못하면 그 세션은 서버의 메모리에 계속 살아서 세션이 타임아웃되기

까지는 계속 살아있을것이다.(이때는 HttpSessionBindingListener의 valueUnbound함수가 서블릿 컨테이너에서 호출한다.)

정상적으로 로그아웃버튼을 누르고 브라우저를 닫는사람이 어디있겠는가?

대게의 사용자들은 로그아웃을 하지 않고 바로 닫아버릴것이다.

여기서 위의 방법으로 닫았을때 이벤트를 잡을수 있는 방법을 설명하겠다.

예제는 간단하다.




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
    * 작 성 자 : 권홍재
    * 작 성 일 : 2006-12-18
    * 개    요  : 브라우저가 닫길시 호출
    * return값 : void
    */
    function logout(){
        location.href = 'logout.jsp';
    }
</script>

</head>
<body OnUnload="logout()">
</body>
</html>






위처럼 onUnLoad이벤트를 사용하면 된다.

프레임으로 나눈 이유는 브라우저가 하나의 프레임만으로 되어있다면..

페이지 이동시마다 onUnLoad이벤트가 발생한다는것이다..

곧 페이지가 이동시마다 로그아웃이 발생한다는뜻이며 

고로 세션이 끊겨서 페이지를 이동할수 없다는 말이 된다.

이를 방지하기 위해서 프레임으로 나누어서 메인 프레임에는

일반적인 페이지를 호출을 하고 로그아웃 페이지를 호출하는부분은

페이지가 변경되지 않는 frame.html에서 로그아웃 처리를 하는것이다.

페이지가 닫길때 frame.html에서 onUnLoad이벤트가 발생하여

logout.jsp를 호출하는것이다.

참... 그리고 한가지 새로고침버튼이나 F5번버튼 마우스 오른쪽 버튼을 

클릭하고 새로고침을 할경우는 어쩔수 없다는 것이다..

페이지를 다시 부르는것이기때문에 페이지를 부르기전 기존페이지가 

죽기전에 onUnload이벤트가 발생한다는 것이다. 이를 해결하기 위해서는 

마우스 오른쪽버튼 상단의 메누 보이지 않기, 키업이벤트에서 F5번키를

막는수밖에는 없다.^^;

이것으로 중복로그인체크 강좌를 마치겠다...^^*



출처: http://otep.tistory.com/333 [막블로그]