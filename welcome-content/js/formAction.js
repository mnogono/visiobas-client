//$(document).ready(function(){
    //$("#content").load("/authorization.svg");
//});

var login="";
var password="";
var enter=0;
function enterLogin() {
    enter=1;
    $("#login").text(login);
    document.onkeypress = function checkKeycode(event) {
        var keycode, keyChar;
        if (!event) var event = window.event;
        if (event.keyCode) keycode = event.keyCode;
        else if (event.which) keycode = event.which;
        if(keycode==9){
            enterPassword();
        }
        else {
            keyChar = String.fromCharCode(keycode);
            login += keyChar;
        }
        $("#login").text(login);
    }
}
function enterPassword() {
    enter=2;
    $("#password").text(password);
    document.onkeypress = function checkKeycode(event) {
        var keycode, keyChar;
        if (!event) var event = window.event;
        if (event.keyCode) keycode = event.keyCode;
        else if (event.which) keycode = event.which;
        if(keycode==13){
            goSubmit()
        }
        else {
            keyChar = String.fromCharCode(keycode);
            password += keyChar;
        }
        console.log(password.length);
        var hiddpass="*";
        var i=1;
        while(i<password.length){
            hiddpass+="*";
            i++;
        }
        $("#password").text(hiddpass);
    }
}
function goSubmit(){
    run(login,password);
    login="";
    password="";
}
var kaps=0;
function enterKey(key) {
    var symbol='';

    console.log(key);
    if(key=="capsLock"){
        if(kaps==0)
            kaps=1;
        else
            kaps=0;
    }else{
        symbol=key;
    }
    if(enter==1) {
        if (key == "clear") {
            login = "";
        }
        else {
            if (kaps == 1)
                login += symbol;
            else
                login += symbol.toLowerCase();
        }
        $("#login").text(login);
    }
    if(enter==2){
        var hidePass = "";
        if(key=="clear"){
            password="";
        }
        else {
            if (kaps == 1)
                password += symbol;
            else
                password += symbol.toLowerCase();
            var i = 0;
            while (i < password.length) {
                hidePass += "*";
                i++;
            }
        }
        $("#password").text(hidePass);
    }
}
