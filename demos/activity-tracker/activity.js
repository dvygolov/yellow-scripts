class ActivityTracker {
  constructor(totalTime, checkTime, metrikaId, debug = false) {
    this.events = [
      "touchmove",
      "blur",
      "focus",
      "focusin",
      "focusout",
      "load",
      "resize",
      "scroll",
      "unload",
      "click",
      "dblclick",
      "mousedown",
      "mouseup",
      "mousemove",
      "mouseover",
      "mouseout",
      "mouseenter",
      "mouseleave",
      "change",
      "select",
      "submit",
      "keydown",
      "keypress",
      "keyup",
      "error",
    ];
    this.need = totalTime;
    this.checkTime = checkTime;
    this.IDmetrika = metrikaId;
    this.loop = true;
    this.counter = 0;
    this.activeParts = 0;
    this.timer = 0;
    this.cookieName = `${this.counter * this.need}sec_ap`;
    this.parts = Math.ceil(this.need / this.checkTime);
    this.period = { start: 0, end: 0, events: false };
    this.timeoutId = null;
    this.debug = debug;
  }

  setEvents() {
    this.events.forEach((eventName) => {
      window.addEventListener(eventName, (e) => {
        if (e.isTrusted) {
          this.period.events = true;
        }
      });
    });
  }

  getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  }

  setCookie(name, value, days = 0) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  }

  checkCookie() {
    const cookieValue = this.getCookie(this.cookieName);
    if (!cookieValue) {
      return true;
    }
    const value = parseInt(cookieValue, 10);
    if (value >= this.parts && !this.loop) {
      return false;
    }
    this.activeParts = value;
    return true;
  }

  start() {
    this.setPeriod();
    this.runPeriod();
  }

  setPeriod() {
    this.period.start = Date.now() / 1000;
    this.period.end = this.period.start + this.checkTime;
    this.period.events = false;
  }

  runPeriod() {
    this.timeoutId = setTimeout(
      () => this.checkPeriod(),
      this.checkTime * 1000,
    );
  }

  checkPeriod() {
    if (this.period.events) {
      this.log("This part of interaction looks real!");
      this.activeParts++;
    } else {
      this.log("This part of interaction DOES NOT look real!");
    }
    this.timer = this.activeParts * this.checkTime;

    if (this.timer >= this.need) {
      this.sendGoal();
      if (this.loop) {
        this.reset();
      }
    } else {
      this.start();
    }
    this.setCookie(this.cookieName, this.activeParts);
  }

  sendGoal() {
    this.log("Activity goal reached: 60sec");
    // fbq('init',this.IDmetrika);
    // fbq('track','Lead');
    ym(this.IDmetrika, "reachGoal", "60sec", Object.fromEntries(new URLSearchParams(window.location.search)));
    if (!this.loop) {
      clearTimeout(this.timeoutId);
    }
  }

  reset() {
    this.counter++;
    this.timer = 0;
    this.activeParts = 0;
    this.cookieName = `${this.counter * this.need}sec_ap`;
  }

  init() {
    if (this.checkCookie()) {
      this.log("Starting to monitor activity...");
      this.setEvents();
      this.start();
    }
  }

  log(msg) {
    if (this.debug) console.log(msg);
  }
}