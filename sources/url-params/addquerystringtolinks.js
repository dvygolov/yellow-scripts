document.addEventListener("DOMContentLoaded", function() {
 var hvost = window.location.search.substring(1);
 
 var elements = document.getElementsByTagName('a');

 for (var i = 0; i < elements.length; i++) {
  var newHref = elements[i].href;
  if (newHref.indexOf("#")!=-1) continue;
  if (newHref.indexOf("?")==-1) newHref += "?";
  else newHref += "&#038;";
  if (hvost!="") elements[i].href = newHref + hvost;
 }
});