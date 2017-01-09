// ----- InputStream ------

function InputStream(str) {
	var pos = 0;
	var line = 1;
	var col = 0;
	
	return {
		next: next,
		peek: peek,
		eof: eof,
		error: error
	};
	
	//return next character from string
	function next() {
		var ch = str.charAt(pos++);
		if (ch == "\n") {
			line++;
			col = 0;
		} else {
			col++;
		}
		return ch;
	};

	function peek(offset) {
		return str.charAt(pos + (offset || 0));
	};

	function eof() {
		return peek() == "";
	};

	function error(msg) {
		let lines = str.split("\n");
		
		let debug = [];
		
		for (let l = 0; l <= line; ++l) {
			debug.push(lines[l]);
		}
		
		let debugLine = [];
		
		for (let c = 0; c < col; ++c) {
			debugLine.push(".");
		}
		debugLine.push("^");
		
		throw new Error(msg + "pos: " + pos + ", line: " + line + ", col: " + col + "\n" + debug.join("\n") + "\n" + debugLine.join(""));
	};	
}

// ----- TokenStream -------
/**
@param {InputStream} is
*/
function TokenStream(is) {
	var current = null;
	var keywords = " if then else true false lambda ";
	
	return {
		next: next,
		peek: peek,
		eof: eof,
		error: is.error
	};
	
	//function isEol(ch) {
	//	return ch == "\n";
	//}

	function isPunc(ch) {
		return ",;(){}[]".indexOf(ch) >= 0;
	}

	function isDigit(ch) {
		return /[0-9]/i.test(ch);
	}

	function isIdStart(ch) {
		return /[a-z_]/i.test(ch);
	}

	function isId(ch) {
		return isIdStart(ch) || " 0123456789".indexOf(ch) > 0;
	}

	function isKeyword(str) {
		return keywords.indexOf(" " + str + " ") >= 0;
	}

	function isWhitespace(ch) {
		return " \t\r\n".indexOf(ch) >= 0;
	}	
	
	function isOperation(ch) {
		return "+-*/%=&|<>!".indexOf(ch) >= 0;
	}
	
	function next() {
		var token = current;
		current = null;
		return token || readNext();
	}
	
	function peek() {
		return current || (current = readNext());
	}
	
	function eof() {
		return peek() == null;
	}
	
	function skipLine() {
		readWhile(function(ch){
			return ch != "\n";
		});
	}

	function skipWhitespace() {
		readWhile(isWhitespace);
	}
	
	function isComment(ch) {
		if (ch == "#") {
			return true;
		}
		if (ch == "/" && is.peek(1) == "/") {
			return true;
		}
	}
	
	function readNext() {
		skipWhitespace();

		if (is.eof()) {
			return null;
		}
		
		var ch = is.peek();
		
		//if (ch == "//") {
		//	skipLine();
		//	return readNext();
		//}
		//if (ch == "#") {
		//	skipLine();
		//	return readNext();
		//}
		
		if (isComment(ch)) {
			skipLine();
			return readNext();
		}
		
		if (ch == '"') {
			return readString();
		}
		
		if (isDigit(ch)) {
			return readNumber();
		}
		
		if (isIdStart(ch)) {
			return readIdent();
		}
		
		if (isPunc(ch)) {
			return readPunc();
		}
		
		if (isOperation(ch)) {
			return readOperation();
		}
		
		is.error("Can't handle character: " + ch);
	}
	
	function readEscapedString() {
		var str = "";
		//character input stream already at position '"'
		//skip '"' symbol
		is.next();
		var escaped = false;
		
		while (!is.eof()) {
			var ch = is.next();
			if (escaped) {
				str += ch;
				escaped = false;
			} else if (ch == "\\") {
				escaped = true;
			} else if (ch == '"') {
				break;
			} else {
				str += ch;
			}
		}
		
		return str;
	}
	
	function readNumber() {
		var hasDot = false;
		var number = readWhile(function(ch) {
			if (ch == ".") {
				if (hasDot) {
					return false;
				}
				hasDot = true;
				return true;
			}
			return isDigit(ch);
		});
		
		return {type: "num", value: parseFloat(number)};
	}
	
	function readString() {
		return {type: "str", value: readEscapedString()};
	}
	
	function readIdent() {
		var id = readWhile(isId);
		if (isKeyword(id)) {
			return {type: "kw", value: id};
		}
		
		return {type: "var", value: id};
	}
	
	function readPunc() {
		var punc = is.next();
		return {type: "punc", value: punc};
	}
	
	function readOperation() {
		var op = readWhile(isOperation);
		return {type: "op", value: op};
	}
	
	function readWhile(predicate) {
		var str = "";
		while (!is.eof() && predicate(is.peek())) {
			str += is.next();
		}
		return str;
	}
};


// ----- ASTParser ----

/**
@param {TokenStream} ts
*/
function parse(ts) {
	var PRECEDENCE = {
		"=": 1,
		"||": 2,
		"&&": 3,
		"<": 7, ">": 7, "<=": 7, ">=": 7, "==": 7, "!=": 7,
        "+": 10, "-": 10,
        "*": 20, "/": 20, "%": 20,
	};
	
	var FALSE = {type: "bool", value: false};
	
	return parseTopLevel();
	
	function isPunc(ch) {
		var tok = ts.peek();
		return tok && tok.type == "punc" && (!ch || tok.value == ch) && tok;
	}
	
	function isKeyword(keyword) {
		var tok = ts.peek();
		return tok && tok.type == "kw" && (!keyword || tok.value == keyword) && tok;
	}
	
	function isOperation(op) {
		var tok = ts.peek();
		return tok && tok.type == "op" && (!op || tok.value == op) && tok;
	}
	
	function skipPunc(ch) {
		if (isPunc(ch)) {
			ts.next();
		} else {
			ts.error("Expecting punctuation: \"" + ch + "\"");
		}
	}
	
	function skipKeyword(keyword) {
		if (isKeyword(keyword)) {
			ts.next();
		} else {
			ts.error("Expecting keyword: \"" + keyword + "\"");
		}
	}
	
	function skipOperation(op) {
		if (isOperation(op)) {
			ts.next();
		} else {
			ts.error("Expecting operator: \"" + op + "\"");
		}
	}
	
	function unexpected() {
		ts.error("Unexpected token: " + JSON.stringify(ts.peek()));
	}
	
	/**
	@param {Token} left this is left sentence of binary expression
	@param {number} myPrec precedence
	*/
	function maybeBinary(left, myPrec) {
		var tok = isOperation();
		if (tok) {
			var hisPrec = PRECEDENCE[tok.value];
			if (hisPrec > myPrec) {
				ts.next();
				
				return maybeBinary({
					type: tok.value == "=" ? "assign" : "binary",
					operator: tok.value,
					left: left,
					right: maybeBinary(parseAtom(), hisPrec)
				}, myPrec);
			}
		}
		
		return left;
	}
	
	/**
	@param {string} start punctuation
	@param {string} end punctuation
	@param {string} separator
	@param {function} parser
	*/
	function delimited(start, stop, separator, parser) {
		var a = [];
		var first = true;
		skipPunc(start);
		while (!ts.eof()) {
			if (isPunc(stop)) {
				break;
			}
			
			if (first) {
				first = false;
			} else {
				skipPunc(separator);
			}
			
			if (isPunc(stop)) {
				break;
			}
			
			a.push(parser());
		}
		
		skipPunc(stop);
		
		return a;
	}
	
	function parseCall(func) {
		return {
			type: "call",
			func: func,
			args: delimited("(", ")", ",", parseExpression)
		};
	}
	
	/**
	parse variable name
	@return {string} variable name
	*/
	function parseVarName() {
		var name = ts.next();
		if (name.type != "var") {
			ts.error("Expecting variable name");
		}
		
		return name.value;
	}
	
	function parseIf() {
		skipKeyword("if");
		var condition = parseExpression();
		if (!isPunc("{")) {
			skipKeyword("then");
		}
		
		var then = parseExpression();
		
		//skipPunc(";");
		
		var result = {
			type: "if",
			cond: condition,
			then: then
		};
		
		if (isKeyword("else")) {
			ts.next();
			result.else = parseExpression();
		}
		
		return result;
	}
	
	
	function parseLambda() {
		return {
			type: "lambda",
			vars: delimited("(", ")", ",", parseVarName),
			body: parseExpression()
		};
	}
	
	function parseBool() {
		return {
			type: "bool",
			value: ts.next().value == "true"
		}
	}
	
	function maybeCall(expr) {
		expr = expr();
		return isPunc("(") ? parseCall(expr) : expr;
	}
	
	function parseAtom() {
		return maybeCall(function() {
			if (isPunc("(")) {
				ts.next();
				var exp = parseExpression();
				skipPunc(")");
				return exp;
			}
			
			if (isPunc("{")) {
				return parseProgramm();
			}
			if (isKeyword("if")) {
				return parseIf();
			}
			if (isKeyword("true") || isKeyword("false")) {
				return parseBool();
			}
			if (isKeyword("lambda")) {
				ts.next();
				return parseLambda();
			}
			
			var tok = ts.next();
			
			if (tok.type == "var" || tok.type == "num" || tok.type == "str") {
				return tok;
			}
			
			unexpected();
		});
	}
	
	function parseTopLevel() {
		var prog = [];
		
		while (!ts.eof()) {
			prog.push(parseExpression());
			if (!ts.eof()) {
				skipPunc(";");
			}
		}
		
		return {type: "prog", prog: prog};
	}

	function parseProgramm() {
		var programm = delimited("{", "}", ";", parseExpression);
		if (programm.length == 0) {
			return FALSE;
		}
		if (programm.length == 1) {
			return programm[0];
		}
		
		return {type: "prog", prog: programm};
	}
	
	function parseExpression() {
		return maybeCall(function() {
			return maybeBinary(parseAtom(), 0);
		});
	}
}


// ------ Environment --------

function Environment(parent) {
    this.vars = Object.create(parent ? parent.vars : null);
    this.parent = parent;
}
Environment.prototype = {
    extend: function() {
        return new Environment(this);
    },
    lookup: function(name) {
        var scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name))
                return scope;
            scope = scope.parent;
        }
    },
    get: function(name) {
        if (name in this.vars)
            return this.vars[name];
        throw new Error("Undefined variable " + name);
    },
    set: function(name, value) {
        var scope = this.lookup(name);
        if (!scope && this.parent)
            throw new Error("Undefined variable " + name);
        return (scope || this).vars[name] = value;
    },
    def: function(name, value) {
        return this.vars[name] = value;
    }
};

function evaluate(exp, env) {
    switch (exp.type) {
      case "num":
      case "str":
      case "bool":
        return exp.value;

      case "var":
        return env.get(exp.value);

      case "assign":
        if (exp.left.type != "var")
            throw new Error("Cannot assign to " + JSON.stringify(exp.left));
        return env.set(exp.left.value, evaluate(exp.right, env));

      case "binary":
        return apply_op(exp.operator,
                        evaluate(exp.left, env),
                        evaluate(exp.right, env));

      case "lambda":
        return make_lambda(env, exp);

      case "if":
        var cond = evaluate(exp.cond, env);
        if (cond !== false) return evaluate(exp.then, env);
        return exp.else ? evaluate(exp.else, env) : false;

      case "prog":
        var val = false;
        exp.prog.forEach(function(exp){ val = evaluate(exp, env) });
        return val;

      case "call":
        var func = evaluate(exp.func, env);
        return func.apply(null, exp.args.map(function(arg){
            return evaluate(arg, env);
        }));

      default:
        throw new Error("I don't know how to evaluate " + exp.type);
    }
}

function apply_op(op, a, b) {
    function num(x) {
        if (typeof x != "number")
            throw new Error("Expected number but got " + x);
        return x;
    }
    function div(x) {
        if (num(x) == 0)
            throw new Error("Divide by zero");
        return x;
    }
    switch (op) {
      case "+": return num(a) + num(b);
      case "-": return num(a) - num(b);
      case "*": return num(a) * num(b);
      case "/": return num(a) / div(b);
      case "%": return num(a) % div(b);
      case "&&": return a !== false && b;
      case "||": return a !== false ? a : b;
      case "<": return num(a) < num(b);
      case ">": return num(a) > num(b);
      case "<=": return num(a) <= num(b);
      case ">=": return num(a) >= num(b);
      case "==": return a === b;
      case "!=": return a !== b;
    }
    throw new Error("Can't apply operator " + op);
}

function make_lambda(env, exp) {
    function lambda() {
        var names = exp.vars;
        var scope = env.extend();
        for (var i = 0; i < names.length; ++i)
            scope.def(names[i], i < arguments.length ? arguments[i] : false);
        return evaluate(exp.body, scope);
    }
    return lambda;
}
