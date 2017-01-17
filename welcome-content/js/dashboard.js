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
            VISIOBAS_EXECUTER.execute(code);
        }

        function executeVisiobasCodeBlockInterval(visiobas, code) {
            let interval = parseInt($(visiobas).attr("interval"));

            setInterval(function() {
                "use strict";
                VISIOBAS_EXECUTER.execute(code);
            }, interval);
        }

        function embeddedVisiobasSvg(svgText, parentNode) {
            $(parentNode).html(svgText);
        }

        function executeVisiobasCodeBlock(visiobas, code, parentNode, src) {
            let interval = $(visiobas).attr("interval") || $(visiobas).attr("timer");
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
            }).done(function(response) {
                //response.data
                $('#content').html(response.data);

            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.warn("loading user dashboard failed... " + errorThrown);
            });
        }

        function sandbox(user) {
            $.ajax({
                type: "GET",
                url: user.userFiles[0].filePath
            }).done((data, textStatus, jqXHR) => {
                $("#content").html(jqXHR.responseText);

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
