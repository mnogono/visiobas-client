var req = new XMLHttpRequest();
var retSession;//переменная сессии
var token;
//var urlAuth="http://server.visiobas.com:8080/arossa/scada/user/login";
var urlAuth="http://127.0.0.1:8080/arossa/scada/user/login";
var ulrLoadSignal=null;

var arrayClass="";//
var arraySignal="[]";
function run(login,password) {
    var hash=hex_md5(password);//хешируем пароль
    var userProfile=JSON.stringify({"login":login, "password":hash});//JSON авторизации
    requestToServer(urlAuth,userProfile,false);//авторизуемся
    loadUserFile(retSession.data.token,retSession.data.userFiles[0].filePath,true);//запускаем функцию загруски файла на страницу
    token=retSession.data.token;
    ulrLoadSignal=("http://127.0.0.1:8080/arossa/scada/arm/get/"+retSession.data.token);
}
/*1. авторизация на сервере*/
function requestToServer(url,json,asynhr) {
    req.open('POST', url, asynhr);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                retSession = JSON.parse(req.responseText);
            }
            else {
                dump("Error loading page\n");
            }
        }
    };
    req.send(json);
}

/*2.функция загрузки файла на страницу*/
function loadUserFile(token,filePath,asynhr) {
    var url="http://127.0.0.1:8080/arossa/scada/user/getfile/"+token+"?path="+filePath;
    req.open('GET', url, asynhr);
    req.onreadystatechange = function (aEvt) {
        req.onprogress = function(event) {
            document.body.style.cursor = "wait";
            //alert( 'Получено с сервера ' + event.loaded + ' байт из ' + event.total );
        };

        if (req.readyState == 4) {
            document.body.style.cursor = "default";
            if (req.status == 200) {
                var retFile = JSON.parse(req.responseText);
                $('#content').html(parserSVG(retFile.data));// загружаю свг на страницу
                if(filePath=="reception.svg")
                    reception();
            }
            else {
                dump("Error loading page\n");
            }
        }
    };

    req.send(null);
}
/*функция парсинга мaкроподстановок*/
function parserSVG(svg) {
    var patt = /(\<.*?)\>\{\%(.*?)\%\}/g;
    var patt2=/(onclick=\"go):(.*?)(\")/g;
    var res;
    var classes;
    arraySignal="[";
    arrayClass="";
    while ( (classes=patt.exec(svg))!=null){
        arraySignal+="\""+ classes[2]+"\",";
        arrayClass+=classes[2].replace(/\./g,"_").replace(/\//,"_")+",";
    }
    arraySignal=arraySignal.slice(0,-1);
    arraySignal+="]";
    function replacer(match, p1, p2, p3, offset, string) {
        return p1+"class=\""+p2.replace(/\./g,"_").replace(/\//,"_")+"\">";
    }
    res = svg.replace(patt,replacer);//вписываем тег signal
    res= res.replace(patt2,"$1('$2')$3");
    $('.session').append(arrayClass);
    return res;
}
function go(fileName) {
    console.log(token);
    loadUserFile(token,fileName,true);
}
/* загрузка значений с сервера*/
setInterval(function(){

    var arrClass=arrayClass.split(',');
    var i=0;

    console.log(arraySignal);
    requestToServer(ulrLoadSignal,arraySignal);
    console.log(retSession);
    while(i<(arrClass.length-1)) {
        $("." + arrClass[i]).text(retSession.data[i]);
        i++;
    }
}, 20000);

//подгрузка данных с сервера
function reception() {

}