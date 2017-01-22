/**
 * introduce DASHBOARD as a global variable
 */
(function() {
    //current user dashboard
    function Dashboard() {
        init();

        function init() {
            subscribe();
        }

        function executeVisiobasCodeBlockOnce(visiobas, code) {
            "use strict";
            let delay = parseInt($(visiobas).attr("delay") || "0");

            setTimeout(function() {
              VISIOBAS_EXECUTER.execute(code);
            }, delay);
        }

        function executeVisiobasCodeBlockInterval(visiobas, code) {
            let interval = parseInt($(visiobas).attr("interval"));
            let delay = parseInt($(visiobas).attr("delay") || "0");

            setTimeout(function() {
              setInterval(function() {
                  "use strict";
                  window.VISIOBAS_EXECUTER.execute(code);
              }, interval);
            }, delay);
        }

        function embeddedVisiobasSvg(svgText, parentNode) {
            $(parentNode).html(svgText);
        }

        function executeVisiobasCodeBlock(visiobas, code, parentNode, src) {
            let interval = $(visiobas).attr("interval") || $(visiobas).attr("timer") || "-1";
            let parent = $(visiobas).attr("parent");
            let srcExt = "";

            if (!_.isEmpty(src)) {
              srcExt =  src.split(".").pop();
            }

            if (srcExt.toLowerCase() == "svg") {
                let _parentNode = _.isEmpty(parent) ? parentNode : $("#" + parent)[0];
                embeddedVisiobasSvg(code, _parentNode);

            } else {
                if (interval === "indefinite" || interval === "-1") {
                    executeVisiobasCodeBlockOnce(visiobas, code);

                } else {
                    executeVisiobasCodeBlockInterval(visiobas, code);
                }
            }
        }

        function parseVisiobasCodeBlocks(visiobas) {
            let parentNode = visiobas.parentNode;

            let src = $(visiobas).attr("src");
            let dataType = "text";

            if (!_.isEmpty(src)) {
                //src point to source file, load it and execute
                $.ajax({
                    type: "GET",
                    url: src,
                    dataType: dataType
                }).done((code, textStatus, jqXHR) => {
                    //find all replace tags under visiobas, and make replace procedure

                    $(visiobas).find("replace").each(function(i, e) {
                      let find = $(e).attr("find");
                      let replace = $(e).text();

                      code = code.replace(new RegExp(find, "g"), replace);
                    });

                    executeVisiobasCodeBlock(visiobas, code, parentNode, src);

                }).fail((jqXHR, textStatus, errorThrown) => {
                    console.warn("loading visiobas code failed..." + src);
                });

            } else {
                let code = visiobas.textContent;
                executeVisiobasCodeBlock(visiobas, code, parentNode, src);
            }
        }

        function userAuthorized(user) {
            //request user dashboard startpage
            $.ajax({
                type: "GET",
                url: "/vbas/scada/user/getfile/" + user.token + "?path=" + user.userFiles[0].filePath,
                dataType: "json"
            }).done((data, textStatus, jqXHR) => {

                $("#content").html(data.data);

                $("visiobas").each(function(i, visiobas) {
                    parseVisiobasCodeBlocks(visiobas);
                });

            }).fail((jqXHR, textStatus, errorThrown) => {
                console.warn("loading user svg failed...");
            });
        }

        function sandbox(user) {
            $.ajax({
                type: "GET",
                url: user.userFiles[0].filePath,
                dataType: "text"
            }).done((data, textStatus, jqXHR) => {
                $("#content").html(data);

                $("visiobas").each(function(i, visiobas) {
                    parseVisiobasCodeBlocks(visiobas);

                });

            }).fail((jqXHR, textStatus, errorThrown) => {
                console.warn("loading sand box failed...");
            });
        }

        /**
         * dashboard subscribe for some of events
         */
        function subscribe() {
            EVENTS
                .filter(event => event.type === "UserAuthorized")
                .subscribe(
                    event => {
                        let user = event.user;
                        userAuthorized(user);
                    }
                );

            EVENTS
                .filter(event => event.type === "SandboxAuthorized")
                .subscribe(
                    event => {
                        let user = event.user;
                        sandbox(user);
                    }
                );
        }
    }

    //global variable of current authorized user
    window.DASHBOARD = new Dashboard();
})();
