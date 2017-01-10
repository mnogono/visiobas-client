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
						
						//VISIOBAS_EXECUTER.execute("console.log(\"Hello World;\");");
						//VISIOBAS_EXECUTER.execute("Debug(\"Hello World;\");");
						
						$("visiobas").each(function(i, visiobas) {
							var interval = $(visiobas).attr("interval");
							
							var code = visiobas.textContent;
							//var ast = parse(TokenStream(InputStream(code)));
							
							setInterval(function() {
								"use strict";
								
								VISIOBAS_EXECUTER.execute(code);
								
								//console.log("execute some function...");
								//new Function();
								//evaluate(ast, globalEnv);
							}, interval);
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