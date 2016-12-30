/**
* introduce USER as a global variable just to keep in memory current authorized user
*/
(function(){
	function UserFile(description, filePath) {
		var _description = description;
		var _filePath = filePath;
		
		var userFile = {
			getFilePath: function() {return _filePath;},
			getDescription: function() {return _description;}
		}
		
		userFile.__defineGetter__("description", function() { return _description; });
		userFile.__defineGetter__("filePath", function() { return _filePath; });
		
		return userFile;
	}
	
	//current authorized user
	function User() {
		var _token = "";
		var _userFiles = [];
		
		var user = {
			authorized: authorized,
		}
		
		user.__defineGetter__("token", function() { return _token; });
		user.__defineGetter__("userFiles", function() { return _userFiles; });
		
		return user;
		
		/**
		* when authorized user, get all necessary data from server too
		*/
		function authorized(data) {
			_userFiles = (data.userFiles || []).map(function(o) {
				return UserFile(o.description, o.filePath);
			});
			
			setToken(data.token);
		}
		
		/**
		* @param {string} value of token
		*/
		function setToken(token) {
			_token = token
		}
	}
	
	//global variable of current authorized user
	window.USER = User();
})();