document.addEventListener('DOMContentLoaded', function(){ 
	var pName='mainpic';
	var pic = document.getElementById(pName);
	var urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has(pName)){
		var pValue = urlParams.get(pName);
		pic.src = 'images/'+pValue+'.jpg';
	}
});