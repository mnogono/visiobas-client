/**
 * this is mock object only for test purpose
 */

(function() {
    /**
     * scope of predefined method like "VB."
     */
    function VisiobasPredefined() {
        this.controls = {};
    }

    VisiobasPredefined.prototype.Read = function(id) {
        if (_.isEmpty(id)) {
            return;
        }

        //replace all special symbols into
        //id = id.replace(/[:\s\/\.-]/g, "_");

        let addr = id.split(".");
        let code = addr.pop();
        let device = addr.join(".");

        let devices = {
            "L960B17/TRUNK.SUB-24.Parameters.DI_2402": {
                type: "analog"
            },
            "L960B17/TRUNK.SUB-24.Parameters.DA_2402": {
                type: "binary"
            },
            "L960B17/TRUNK.SUB-24.Parameters.DA_2403": {
                type: "binary"
            },
            "L960B17/TRUNK.SUB-24.Parameters.DA_2404": {
                type: "binary"
            }
        }

        if (code == 112) {
            //there are system status
            return $("#system-status").val();

        } else if (code == 85) {
            //there are value
            let info = devices[device];
            if (!_.isEmpty(info)) {
                if (device == "L960B17/TRUNK.SUB-24.Parameters.DA_2404") {
                  return $("#binary-value-2").val();
                }

                if (info.type == "analog") {
                    return $("#analog-value").val();
                } else if (info.type == "binary") {
                    return $("#binary-value").val();
                }
            }
        }

        return Math.random() * 100;
    }

    VisiobasPredefined.prototype.Write = function(id, val) {
        return true;
    }

    VisiobasPredefined.prototype.Fan = function(id) {
        console.log("creating new fan... " + id);
        return Fan(id);
    }

    VisiobasPredefined.prototype.Controls = function(id) {
        return this.controls[id];
    };

    /**
    * set / get attr value
    */
    VisiobasPredefined.prototype.Attr = function(selector, attr, value) {
        if (_.isUndefined(value)) {
          return $(selector).attr(attr);
        }

        $(selector).attr(attr, value);
    }

    /**
     * register some control
     */
    VisiobasPredefined.prototype.Register = function(control) {
        if (control.type === "fan") {
            this.controls[control.id] = Fan(control)
        }
    }

    VisiobasPredefined.prototype.OnClick = function(selector, fn) {
      $(selector).click(function(e) {
        fn.call(window, e.currentTarget);
      });
    }

  /**
  * @param {string} src
  * @param {node} e
  * @param {object} [replace]
  */
    VisiobasPredefined.prototype.WindowBinary = function(src, e, replace) {
      $.ajax({
          type: "GET",
          url: src,
          dataType: "html"
      }).done((html, textStatus, jqXHR) => {
          //some specific of binary window information
          if (_.isObject(replace)) {
            Object.keys(replace).forEach(function(key) {
              html = html.replace(new RegExp(key, "g"), replace[key]);
            });
          };

          $(html).dialog({
            close: function() {
              $(this).dialog("destroy").remove();
            },
            modal: true,
            buttons: [
              {
                text: "Save",
                click: function() {
                  $(this).dialog("close");
                }
              },
              {
                text: "Cancel",
                click: function() {
                  $(this).dialog("close");
                }
              }
            ]
          });
      }).fail((jqXHR, textStatus, errorThrown) => {
          console.warn("loading window binary failed..." + src);
      });
    }

    /**
    * load some resource from server into some element by selector
    * @param {string} src - server resource url
    * @param {string} selector jquery selector to file parent where will be insertet resource
    */
    VisiobasPredefined.prototype.Load = function(src, selector) {
      $.ajax({
        type: "GET",
        url: src,
        dataType: "text"
      }).done((data, textStatus, jqXHR) => {
        $(selector).html(data);
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.warn("loadin resource failed..." + src);
      });
    }

    function VisiobasExecuter() {
        var predefined = new VisiobasPredefined();

        return {
            execute: execute
        }

        /**
         * @param {string} code to execute
         */
        function execute(code) {
            (new Function("var VB = this;" + code)).bind(predefined)();
        }
    }

    window.VISIOBAS_EXECUTER = VisiobasExecuter();
})();
