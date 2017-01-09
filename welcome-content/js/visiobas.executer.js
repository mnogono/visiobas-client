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
		$("#" + id).attr("repeatCount", "0");
	});
	
	globalEnv.def("stopAnimation", function(id){
		//$("#FFF")[0].pauseAnimations();
		$("#" + id).attr("repeatCount", "indefinite");
	});
	
	$("visiobas").each(function(i, visiobas) {
		var timer = $(visiobas).attr("timer");
		
		var code = visiobas.textContent;
        var ast = parse(TokenStream(InputStream(code)));
        
		setInterval(function() {
			evaluate(ast, globalEnv);
		}, timer);
		
	});
})