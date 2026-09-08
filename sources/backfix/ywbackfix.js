//use the script like this:
/*
<script src="ywbackfix.js"
  data-links="['https://example.com?subid={subid}', 'https://second.com']"
  data-traceenabled="false"
  data-redirect="false"
  data-isoff="false">
</script>
 */
const scriptTag = document.currentScript;
const redirect = scriptTag && scriptTag.hasAttribute("data-redirect")
  ? scriptTag.getAttribute("data-redirect") == "true"
  : false;
const links = JSON.parse((scriptTag && scriptTag.getAttribute("data-links")) || "[]");
const traceEnabled = scriptTag && scriptTag.hasAttribute("data-traceenabled")
  ? scriptTag.getAttribute("data-traceenabled") == "true"
  : false;
const isOff = scriptTag && scriptTag.hasAttribute("data-isoff")
  ? scriptTag.getAttribute("data-isoff") == "true"
  : false;

bootstrapWhenLocalReady(function() {
  if (isOff) {
    trace("BackFix switched OFF! Exiting...");
    return;
  }

  var context = resolveExecutionContext();

  trace(
    "Back Button Fix v0.7.0 by Yellow Web",
    "font-size:25px;color:yellow;font-weight:bold",
  );

  if (isLocalHost()) {
    if (traceEnabled) trace("Localhost found!");
    else return;
  }

  if (context.mode === "nested-unsupported") {
    trace(context.reason);
    return;
  }

  if (context.mode === "svg-host") {
    trace("SVG host mode detected. Using parent document.");
  }

  trace(`Links: ${JSON.stringify(links)}`);
  trace(`Mode is: ${redirect ? "Redirect" : "Iframe"}`);
  if (links.length === 0) {
    trace("No links provided, backfix disabled.");
    return;
  }

  bootstrapWhenHostReady(context, function() {
    startBackfix(context);
  });
});

function bootstrapWhenLocalReady(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
    return;
  }

  callback();
}

function bootstrapWhenHostReady(context, callback) {
  if (
    context.hostDocument.readyState !== "loading" &&
    context.hostDocument.body
  ) {
    callback();
    return;
  }

  context.hostDocument.addEventListener("DOMContentLoaded", function() {
    callback();
  }, { once: true });
}

function startBackfix(context) {
  var frameNames = [];
  for (var i = 0; i < links.length; i++) {
    frameNames.push("BfFrame_" + i);
  }

  var viewCount = links.length + 1; // landing(0) + N links

  removeAnchors(context);
  trace("Anchors fix started...");
  backInFrame(context, frameNames, viewCount);
}

function backInFrame(context, frameNames, viewCount) {
  var hostWindow = context.hostWindow;
  var hostDocument = context.hostDocument;
  var hostHistory = context.hostHistory;
  var depth = 50;

  function init() {
    primeHistory();
    trace(`Pushed ${depth + 1} states for ${viewCount} views.`);

    createFrame(frameNames[0], links[0]);

    var idle = hostWindow.requestIdleCallback || function(cb) {
      hostWindow.setTimeout(cb, 1);
    };

    for (var j = 1; j < links.length; j++) {
      (function(idx) {
        idle(function() {
          createFrame(frameNames[idx], links[idx]);
        });
      })(j);
    }
  }

  if (!isIos()) {
    trace("Not IOs, cheching gesture!");
    checkUserGesture(context, function() {
      init();
      trace("Initialized after gesture.");
    });
  } else {
    trace("IOs found!");
    init();
    trace("Initialized.");
  }

  hostWindow.addEventListener("popstate", function(t) {
    if (!t.state || !t.state.bf) {
      trace("OnPopState: not our state!");
      return;
    }

    trace(`Popped state: view=${t.state.view}`);

    if (redirect) {
      hostWindow.location.href = links[0];
      return;
    }

    showView(t.state.view);
  });

  function primeHistory() {
    for (var i = depth; i >= 1; i--) {
      var view = i % viewCount;
      hostHistory.pushState({ bf: true, view: view }, "", hostWindow.location.href);
    }
    hostHistory.pushState({ bf: true, view: 0 }, "", hostWindow.location.href);
  }

  function showView(viewIndex) {
    if (viewIndex === 0) {
      trace("Showing landing page.");
      frameNames.forEach(function(fn) {
        var frameNode = hostDocument.getElementById(fn);
        if (frameNode) {
          frameNode.style.display = "none";
        }
      });
      hostDocument.querySelectorAll("body > *").forEach(function(node) {
        if (frameNames.indexOf(node.id) === -1) {
          node.style.display = "";
        }
      });
      hostDocument.body.style.overflow = "";
      return;
    }

    showFrame(frameNames[viewIndex - 1]);
  }

  function createFrame(name, url) {
    if (redirect) {
      trace("Creating prerender for redirect.");
      let prerender = hostDocument.createElement("link");
      prerender.rel = "prerender";
      prerender.href = url;
      hostDocument.head.appendChild(prerender);
      return;
    }

    var nodeFrame = hostDocument.getElementById(name);
    if (nodeFrame) {
      nodeFrame.parentNode.removeChild(nodeFrame);
    }

    var frame = hostDocument.createElement("iframe");
    frame.style.width = "100%";
    frame.id = name;
    frame.name = name;
    frame.style.height = "100vh";
    frame.style.position = "fixed";
    frame.style.top = 0;
    frame.style.left = 0;
    frame.style.border = "none";
    frame.style.zIndex = 999997;
    frame.style.display = "none";
    frame.style.backgroundColor = "#fff";
    hostDocument.body.append(frame);
    frame.src = url;
    trace(`Created frame ${name} for ${url}!`);
  }

  function showFrame(name) {
    var nodeFrame = hostDocument.getElementById(name);
    if (!nodeFrame) {
      trace(`Frame ${name} not found!`);
      return;
    }

    nodeFrame.style.display = "block";
    hostDocument.body.style.overflow = "hidden";
    hostDocument.querySelectorAll(`body > *:not(#${name})`).forEach(function(node) {
      node.style.display = "none";
    });
    trace(`Frame ${name} displayed!`);
  }
}

function checkUserGesture(context, callback) {
  var audio = context.hostDocument.createElement("audio");
  var st = context.hostWindow.setInterval(function() {
    var playPromise = audio.play();
    if (playPromise instanceof Promise) {
      if (!audio.paused) {
        context.hostWindow.clearInterval(st);
        callback();
      }
      playPromise.then(function() {}).catch(function() {});
    } else {
      if (!audio.paused) {
        context.hostWindow.clearInterval(st);
        callback();
      }
    }
  }, 100);
}

function removeAnchors(context) {
  context.hostWindow.setInterval(function() {
    const anchors = context.hostDocument.querySelectorAll('a[href*="#"]');
    for (let anchor of anchors) {
      if (anchor.dataset.bfFixed) continue;
      anchor.dataset.bfFixed = "1";
      anchor.removeAttribute("onclick");
      anchor.addEventListener("click", function(e) {
        var blockId = anchor.getAttribute("href").substring(1);
        var block = context.hostDocument.getElementById(blockId);
        if (!block) {
          trace(`Anchor target #${blockId} not found.`);
          return;
        }
        e.preventDefault();
        block.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, 1000);
}

function resolveExecutionContext() {
  var context = {
    mode: "page",
    localWindow: window,
    localDocument: document,
    hostWindow: window,
    hostDocument: document,
    hostHistory: window.history,
    tracePrefix: "page",
    reason: ""
  };
  var localRootTag = getDocumentRootTag(document);

  if (!isNestedContext()) {
    if (localRootTag === "svg" || !document.body) {
      context.mode = "nested-unsupported";
      context.tracePrefix = "standalone-svg";
      context.reason = "Standalone SVG mode is not supported by Backfix.";
      return context;
    }

    return context;
  }

  if (localRootTag !== "svg") {
    context.mode = "nested-unsupported";
    context.tracePrefix = "nested-html";
    context.reason = "Nested HTML mode is not supported. Backfix exits in regular frames.";
    return context;
  }

  try {
    var parentWindow = window.parent;
    var parentDocument = parentWindow.document;
    var parentRootTag = getDocumentRootTag(parentDocument);

    if (!parentDocument || parentRootTag !== "html") {
      context.mode = "nested-unsupported";
      context.tracePrefix = "svg-host";
      context.reason = "SVG host mode requires a same-origin parent HTML document.";
      return context;
    }

    context.mode = "svg-host";
    context.hostWindow = parentWindow;
    context.hostDocument = parentDocument;
    context.hostHistory = parentWindow.history;
    context.tracePrefix = "svg-host";
    return context;
  } catch (e) {
    context.mode = "nested-unsupported";
    context.tracePrefix = "svg-host";
    context.reason = "SVG host mode requires same-origin parent access.";
    return context;
  }
}

function isNestedContext() {
  try {
    return (
      window !== window.top ||
      document !== window.top.document ||
      self.location !== window.top.location
    );
  } catch (e) {
    return true;
  }
}

function getDocumentRootTag(targetDocument) {
  if (!targetDocument || !targetDocument.documentElement) {
    return "";
  }

  return targetDocument.documentElement.nodeName.toLowerCase();
}

function isIos() {
  return /(iPad|iPod|iPhone|Mac)/i.test(navigator.platform);
}

function isLocalHost() {
  return (
    window.location.host.includes("localhost") ||
    window.location.host.includes("127.0.0.1") ||
    window.location.protocol === "file:"
  );
}

function trace(msg, style = null) {
  if (!traceEnabled) return;
  if (style == null) console.log("Backfix: " + msg);
  else {
    console.log("%c" + msg, style);
  }
}
