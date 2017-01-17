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

    VisiobasPredefined.prototype.Attr = function(selector, attr, value) {
        //$("#" + id).attr(attr, value);
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
