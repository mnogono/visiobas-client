/**
* introduce DASHBOARD as a global variable
*/
(function(){
	//current user dashboard
	function Dashboard() {
		init();

		function init() {
			subscribe();
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
			);

			EVENTS
			.filter(event => event.type === "SandboxAuthorized")
			.subscribe(
				event => {
					let user = event.user;

					$.ajax({
						type: "GET",
						url: user.userFiles[0].filePath
					}).done((data, textStatus, jqXHR) => {
						$("#content").html(jqXHR.responseText);

						$("visiobas").each(function(i, visiobas) {
							var interval = $(visiobas).attr("interval");
							var src = $(visiobas).attr("src");

							if (!_.isEmpty(src)) {
								//src point to source file, load it and execute
								$.ajax({
									type: "GET",
									url: src,
									dataType: "text"
								}).done((code, textStatus, jqXHR) => {

//TODO code dublication
									if (interval === "indefinite") {
										//execute ony once
										let code = visiobas.textContent;
										VISIOBAS_EXECUTER.execute(code);

									} else {
										//execute every interval ms
										setInterval(function() {
											"use strict";
											VISIOBAS_EXECUTER.execute(code);
										}, interval);
									}

								}).fail((jqXHR, textStatus, errorThrown) => {
									console.warn("loading visiobas code failed..." + src);
								});

							} else {
								let code = visiobas.textContent;
								if (interval === "indefinite") {
									//execute ony once
									VISIOBAS_EXECUTER.execute(code);

								} else {
									//execute every interval ms
									setInterval(function() {
										"use strict";
										VISIOBAS_EXECUTER.execute(code);
									}, interval);
								}
							}

						});

					}).fail((jqXHR, textStatus, errorThrown) => {
						console.warn("loading sand box failed...");
					});
				}
			);
		}
	}

	//global variable of current authorized user
	window.DASHBOARD = new Dashboard();
})();
