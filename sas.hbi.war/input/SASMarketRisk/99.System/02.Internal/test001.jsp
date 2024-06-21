<html>
<head>
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/themes/redmond/jquery-ui.css">
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/themes/start/jquery-ui.css">
	<link rel="stylesheet" href="/SASHBI/scripts/jquery/css/demos.css">
	<link rel="stylesheet" href="/SASHBI/styles/custom.css" type="text/css" />
	<link rel="stylesheet" href="/SASHBI/styles/SASMarketRisk.css" type="text/css" />
	<script src="/SASHBI/scripts/jquery/js/jquery-1.9.1.min.js"></script>
	<script src="/SASHBI/scripts/jquery/js/jquery-migrate-1.2.0.js"></script>
	<script src="/SASHBI/scripts/jquery/js/jquery-ui-1.10.2.custom.js"></script>
	<script src="/SASHBI/scripts/jquery/bitreeviewer.js"></script>
	<script>
$(document).ready(function () {
	var timestamp = new Date();
	console.log("timestamp.getTime() : " + timestamp.getTime());
	$("#subtabs").tabs({
      beforeLoad: function( event, ui ) {
        ui.jqXHR.fail(function() {
          ui.panel.html(
            "Couldn't load this tab. We'll try to fix this as soon as possible. " +
            "If this wouldn't be a demo." );
        });
      }
	});
	$("body").show();
})	
		
	</script>
</head>
<body style="overflow-y: hidden;border:0px solid #ff0000;margin:0px 20px 0px 0px;padding:0px 0px 0px 10px;" scroll=no onresize="//resizeFrame();">

<div id="subtabs">
  <ul>
    <li>
    	<a href="http://marketdemo.kor.sas.com/SASHBI/HBIServlet?sp_pathUrl=SBIP%3A%2F%2FMETASERVER%2FSASMarketRisk%2F99.System%2F02.Internal%2F990101.internal_rf%28StoredProcess%29&sas_forwardLocation=reportViewer&reportURI=fromExpK">Tab-1</a>
    </li>
    <li>
    	<a href="http://marketdemo.kor.sas.com/SASHBI/HBIServlet?sp_pathUrl=SBIP%3A%2F%2FMETASERVER%2FSASMarketRisk%2F99.System%2F02.Internal%2F990101.internal_rf%28StoredProcess%29&sas_forwardLocation=reportViewer&reportURI=fromExpK">Tab 1</a>
    </li>
    <li><a href="http://marketdemo.kor.sas.com/SASHBI/HBIServlet?sp_pathUrl=SBIP%3A%2F%2FMETASERVER%2FSASMarketRisk%2F99.System%2F02.Internal%2F990202_2.internal_adm%28StoredProcess%29&sas_forwardLocation=reportViewer&reportURI=fromExpK">Tab 2</a></li>
    <li><a href="ajax/content3-slow.php">Tab 3 (slow)</a></li>
    <li><a href="ajax/content4-broken.php">Tab 4 (broken)</a></li>
  </ul>
  <div id="tabs-1">
    <p>Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit amet mauris. Nam elementum quam ullamcorper ante. Etiam aliquet massa et lorem. Mauris dapibus lacus auctor risus. Aenean tempor ullamcorper leo. Vivamus sed magna quis ligula eleifend adipiscing. Duis orci. Aliquam sodales tortor vitae ipsum. Aliquam nulla. Duis aliquam molestie erat. Ut et mauris vel pede varius sollicitudin. Sed ut dolor nec orci tincidunt interdum. Phasellus ipsum. Nunc tristique tempus lectus.</p>
  </div>
</div>
</body>
</html>