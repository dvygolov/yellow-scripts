 document.addEventListener("DOMContentLoaded", function() {
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        var _day = _hour * 24;

        //От какого времени начинаем отсчёт (по умолчанию - от текущего времени)
        var now = new Date();
        //До какого времени считаем (по умолчанию - до завтра)
        var end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 00, 00, 01);
        var distance = end - now;

        function showRemaining() {
            var now = new Date();
            var distance = end - now;
            var hours = Math.floor((distance % _day) / _hour);
            if (hours < 10) hours = '0' + hours;
            var minutes = Math.floor((distance % _hour) / _minute);
            if (minutes < 10) minutes = '0' + minutes;
            var seconds = Math.floor((distance % _minute) / _second);
            if (seconds < 10) seconds = '0' + seconds;

            document.getElementById('h').innerText = (hours);
            document.getElementById('m').innerText = (minutes);
            document.getElementById('s').innerText = (seconds);
        }
        showRemaining();
        setInterval(showRemaining, 1000);
    });