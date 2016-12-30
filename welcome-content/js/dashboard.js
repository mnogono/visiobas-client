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
		}
	}
	
	//global variable of current authorized user
	window.DASHBOARD = new Dashboard();
})();