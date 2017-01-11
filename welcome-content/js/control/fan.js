(function(){
  /**
  * fan object
  * @param {object} control
  */
  function Fan(control) {
    //let _addr = control.addr;
    //let _id = control.id;
    //let _systemStatus = "offline";

    let fan = {
      addr: control.addr,
      id: control.id,
      systemStatus: "offline",

      get addr() {},
      get id() {},
      get systemStatus() { return this.systemStatus; },

      start: start,
      stop: stop
    };

    //fan.__defineGetter__("addr", () => {return _addr});
    //fan.__defineGetter__("id", () => {return _id});
    //fan.__defineGetter__("systemStatus", () => {return _systemStatus});

    return fan;

    /**
    * start fan rotation
    */
    function start() {
      $("#" + _id).attr("dur", "indefinite");

    }

    /**
    * stop fan rotation
    */
    function stop() {
      $("#" + _id).attr("dur", "2s");
    }

    //function systemStatus() {
    //  _systemStatus = "online";
    //}

  }

  window.Fan = Fan;
})();
