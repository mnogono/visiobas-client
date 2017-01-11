(function() {
	/**
	* scope of predefined method like "VB."
	*/
	function VisiobasPredefined() {
		this.controls = {};
	}

	VisiobasPredefined.prototype.Debug = function(val) {
		console.log(val);
	}

	VisiobasPredefined.prototype.Read = function(id) {
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

/*
$(document).ready(function(){
	var globalEnv = new Environment();

	globalEnv.def("print", function(val){
		console.log(val);
	});

	globalEnv.def("requestFloat", function(id){
		//console.log("request float value for sensor id: " + id);
		return Math.random() * 100;
	});

	globalEnv.def("setText", function(id, text){
		$("#" + id).text(text);
	});

	globalEnv.def("round", function(val, digits){
		return lib.baseTypes.round(val, digits);
	});

	globalEnv.def("startAnimation", function(id){
		//$("#" + id)[0].unpauseAnimations();
		$("#" + id).attr("dur", "indefinite");
	});

	globalEnv.def("stopAnimation", function(id){
		//$("#FFF")[0].pauseAnimations();
		$("#" + id).attr("dur", "2s");
		//$("#" + id).attr("repeatCount", "1");
	});

	$("visiobas").each(function(i, visiobas) {
		var interval = $(visiobas).attr("interval");

		var code = visiobas.textContent;
        //var ast = parse(TokenStream(InputStream(code)));

		setInterval(function() {
			"use strict";

			console.log("execute some function...");
			//new Function();

			//evaluate(ast, globalEnv);
		}, interval);
	});
})
*/
