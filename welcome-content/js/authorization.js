//TODO move EVENT into separate file (maybe globals.js) ?
(function(){
	window.EVENTS = new Rx.Subject();
})()

$(document).ready(function() {
	console.info("document ready...");
	
	$("#login").val("operator");
	$("#password").val("12345");
});

function authorization() {
	console.info("authorization...");
	
	var login = $("#login").val();
	var password = $("#password").val();
	
	//make password hash
	var hash = hex_md5(password);
	
	//make json object for authorization
	var userProfile = JSON.stringify({"login": login, "password": hash});
	
	//try to perform authorization
	$.ajax({
		type: "POST",
		url: "/vbas/scada/user/login",
		data: userProfile,
		contentType: "application/json;charset=UTF-8"
	}).done(function(response) {
		USER.authorized(response.data);
		
		//notify observers about user authorized success
		EVENTS.onNext({
			type: "UserAuthorized",
			user: USER
		});
		
	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.warn("login failed... " + errorThrown);
	});
}