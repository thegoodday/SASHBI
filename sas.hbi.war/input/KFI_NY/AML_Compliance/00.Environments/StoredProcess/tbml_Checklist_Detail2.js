$(document).ready(function () {
	$("#progressIndicatorWIP").hide();
	submitSTP.bind("submit",function(){
		alert('');
	});	
	console.log('submitSTP');
	console.log(submitSTP);
});

function setSlickGrid(data){
	console.log(data);
	for(ii in data[0]){
		val=data[0][ii];
		console.log(ii + " : " + val);
	}
}	