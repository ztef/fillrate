var etiquetaTiempo="";

function SeleccionaRangoFechas(dias){

        lapsoDeTiempoSeleccionado=dias;

        switch(dias){
             case 1:

                $("#dia_btn").css("color","yellow");
                $("#semana_btn").css("color","gray");
                $("#mes_btn").css("color","gray");
                $("#anio_btn").css("color","gray");

                etiquetaTiempo="Llamadas de las Ultimas Horas";

               

            break;
            case 7:

                 $("#dia_btn").css("color","gray");
                $("#semana_btn").css("color","yellow");
                $("#mes_btn").css("color","gray");
                $("#anio_btn").css("color","gray");

                etiquetaTiempo="Llamadas de la Semana";

               

            break;
            case 30:

                 $("#dia_btn").css("color","gray");
                $("#semana_btn").css("color","gray");
                $("#mes_btn").css("color","yellow");
                $("#anio_btn").css("color","gray");

                etiquetaTiempo="Llamadas del Mes";

                         

            break;
            case 365:

                $("#dia_btn").css("color","gray");
                $("#semana_btn").css("color","gray");
                $("#mes_btn").css("color","gray");
                $("#anio_btn").css("color","yellow");

                etiquetaTiempo="Llamadas del Año";
                        

            break;

        }

       
        $("#etiquetaTiempo").html(etiquetaTiempo);

        ConsultaDatosPrincipalesMpos();        


}


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function round_dec(num) {
  return Math.round(num * 10) / 10;
}


function toScreenPosition(obj, camera)
{
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*windowWidth;
    var heightHalf = 0.5*windowHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
        x: vector.x,
        y: vector.y
    };

};


function latLng2Point(latLng, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
  return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
}

function point2LatLng(point, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}


var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};


Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

Date.prototype.removeDays = function(days) {
    this.setDate(this.getDate() - parseInt(days));
    return this;
};

function distanciaGeodesica(lat1, long1, lat2, long2){ 
    var degtorad = 0.01745329; 
    var radtodeg = 57.29577951; 
    var dlong = (long1 - long2); 
    var dvalue = (Math.sin(lat1 * degtorad) * Math.sin(lat2 * degtorad)) 
        + (Math.cos(lat1 * degtorad) * Math.cos(lat2 * degtorad) 
            * Math.cos(dlong * degtorad));     
    var dd = Math.acos(dvalue) * radtodeg;   
    var miles = (dd * 69.16); 
    var km = (dd * 111.302);    
    
    return km; 
}

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


// google.maps.Polygon.prototype.getBounds = function(latLng) {
//     var bounds = new google.maps.LatLngBounds();
//     var paths = this.getPaths();
//     var path;
//     for (var p = 0; p < paths.getLength(); p++) {
//         path = paths.getAt(p);
//         for (var i = 0; i < path.getLength(); i++) {
//             bounds.extend(path.getAt(i));
//         }
//     }
//     return bounds;
// }


function polygonCenter(poly) {
    var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = [],
        vertices = poly.getPath();

    for(var i=0; i<vertices.length; i++) {
      lngs.push(vertices.getAt(i).lng());
      lats.push(vertices.getAt(i).lat());
    }

    lats.sort();
    lngs.sort();
    lowx = lats[0];
    highx = lats[vertices.length - 1];
    lowy = lngs[0];
    highy = lngs[vertices.length - 1];
    center_x = lowx + ((highx-lowx) / 2);
    center_y = lowy + ((highy - lowy) / 2);
    return (new google.maps.LatLng(center_x, center_y));
  }

function arcInterpolator(r) {
   
    return function(points) {
   
        var allCommands = [];
        
        var startAngle;
                             
        points.forEach(function(point, i) {            
          
            var angle = Math.atan2(point[0], point[1]);

            var command;
            
            if (i) command = ["A", //draw an arc from the previous point to this point
                        r,
                        r,
                        0,
                       +(Math.abs((angle) - (startAngle)) > Math.PI),                           
                       +(angle < startAngle),
                       point[0], 
                       point[1] 
                       ];
            
            else command = point; 
            
            startAngle = angle;
            
            allCommands.push( command.join(" ") ); 

        });
                                      
        return allCommands.join(" ");
    };
}

function CreaCoordenada(angulo,radio,_centroide)
{  


    if (typeof(_centroide)==='undefined') _centroide = centroide;

    var rad  = (angulo-90) * (Math.PI / 180);
    //  origen  +  radio  *  Math.cos(rad);
    var Temp=new Object();
    Temp.x = (0 + radio * Math.cos(rad))+_centroide.x;
    Temp.y = (0 + radio * Math.sin(rad))+_centroide.y;

    return Temp;               

}

 function getDia(dia){
  switch(dia){
    case 0:
        return "Dom";
    break;
    case 1:
        return "Lun";
    break;
    case 2:
        return "Mar";
    break;
    case 3:
        return "Mie";
    break;
    case 4:
        return "Jue";
    break;
    case 5:
        return "Vie";
    break;
    case 6:
        return "Sab";
    break;

  }
}

function getMes(mes){
  switch(mes){
    case 0:
        return "Ene";
    break;
    case 1:
        return "Feb";
    break;
    case 2:
        return "Mar";
    break;
    case 3:
        return "Abr";
    break;
    case 4:
        return "May";
    break;
    case 5:
        return "Jun";
    break;
    case 6:
        return "Jul";
    break;
     case 7:
        return "Ago";
    break;
     case 8:
        return "Sep";
    break;
     case 9:
        return "Oct";
    break;
     case 10:
        return "Nov";
    break;
     case 11:
        return "Dic";
    break;

  }
}


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


function getPointerLocation(currentLatLng) {
    var scale = Math.pow(2, mapa_.getZoom());
   
  

    var nw = new google.maps.LatLng(
        mapa_.getBounds().getNorthEast().lat(),
        mapa_.getBounds().getSouthWest().lng()
    );    

    var worldCoordinateNW = mapa_.getProjection().fromLatLngToPoint(nw);    

    var worldCoordinate = mapa_.getProjection().fromLatLngToPoint(currentLatLng);
    var currentLocation = new google.maps.Point(
        Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
        Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
    );
    
    return currentLocation;
}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}




function GetValorRangos(valor,X1,X2,Y1,Y2){ 
    var  m =  (Y2 - Y1 ) / (X2-X1)
    var b=Y1-m*X1
    var NuevaPos=(m*valor)+b
    return NuevaPos;
}

function formatNumber(number,dec)
{   
  try{
    number = number.toFixed(2) + '';

    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    if(dec)
    return x1+x2;

    return x1;
    }catch(e){
    
  }
}

function LastDayOfMonth(Year, Month) {
    return new Date((new Date(Year, Month, 1)) - 1);
  }

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

//  *************  convertidor de coordennadas utm a cooords geograficas****************
function utmToLatLng(zone, easting, northing, northernHemisphere){
        if (!northernHemisphere){
            northing = 10000000 - northing;
        }

        var a = 6378137;
        var e = 0.081819191;
        var e1sq = 0.006739497;
        var k0 = 0.9996;

        var arc = northing / k0;
        var mu = arc / (a * (1 - Math.pow(e, 2) / 4.0 - 3 * Math.pow(e, 4) / 64.0 - 5 * Math.pow(e, 6) / 256.0));

        var ei = (1 - Math.pow((1 - e * e), (1 / 2.0))) / (1 + Math.pow((1 - e * e), (1 / 2.0)));

        var ca = 3 * ei / 2 - 27 * Math.pow(ei, 3) / 32.0;

        var cb = 21 * Math.pow(ei, 2) / 16 - 55 * Math.pow(ei, 4) / 32;
        var cc = 151 * Math.pow(ei, 3) / 96;
        var cd = 1097 * Math.pow(ei, 4) / 512;
        var phi1 = mu + ca * Math.sin(2 * mu) + cb * Math.sin(4 * mu) + cc * Math.sin(6 * mu) + cd * Math.sin(8 * mu);

        var n0 = a / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (1 / 2.0));

        var r0 = a * (1 - e * e) / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (3 / 2.0));
        var fact1 = n0 * Math.tan(phi1) / r0;

        var _a1 = 500000 - easting;
        var dd0 = _a1 / (n0 * k0);
        var fact2 = dd0 * dd0 / 2;

        var t0 = Math.pow(Math.tan(phi1), 2);
        var Q0 = e1sq * Math.pow(Math.cos(phi1), 2);
        var fact3 = (5 + 3 * t0 + 10 * Q0 - 4 * Q0 * Q0 - 9 * e1sq) * Math.pow(dd0, 4) / 24;

        var fact4 = (61 + 90 * t0 + 298 * Q0 + 45 * t0 * t0 - 252 * e1sq - 3 * Q0 * Q0) * Math.pow(dd0, 6) / 720;

        var lof1 = _a1 / (n0 * k0);
        var lof2 = (1 + 2 * t0 + Q0) * Math.pow(dd0, 3) / 6.0;
        var lof3 = (5 - 2 * Q0 + 28 * t0 - 3 * Math.pow(Q0, 2) + 8 * e1sq + 24 * Math.pow(t0, 2)) * Math.pow(dd0, 5) / 120;
        var _a2 = (lof1 - lof2 + lof3) / Math.cos(phi1);
        var _a3 = _a2 * 180 / Math.PI;

        var latitude = 180 * (phi1 - fact1 * (fact2 + fact3 + fact4)) / Math.PI;

        if (!northernHemisphere){
          latitude = -latitude;
        }

        var longitude = ((zone > 0) && (6 * zone - 183.0) || 3.0) - _a3;

        var obj = {
              latitude : latitude,
              longitude: longitude
        };


        return obj;
      }


convertPixels = function(x, y) {

    return overlay.getProjection().fromDivPixelToLatLng(new google.maps.Point(x, y));

};

var poligonos=new Object();
poligonos.poligonoN0;
poligonos.poligonoN1;

function CalcularGrados(lat,lng,intensidad){
   
    PintaPoligonosTemporales(String(lat+","+lng),120,0xFF0000,1,"poligonoN1"); //Calcular Minutos  1
    PintaPoligonosTemporales(String(lat+","+lng),1200,0xFF0000,.5,"poligonoN0"); //Calcular Segundos  0      

}

function PintaPoligonosTemporales(cad,divisor,colorLinea,alphaLinea,poligono){ 
    

    var Coords=CalculaCoordenadas(cad,divisor);
    
    CoordsPoligono = new Array();

    var coords=new Array();

    var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
    coords.push(latLng);
   

    var latLng=new google.maps.LatLng(Coords.Y1,Coords.X2);     
    coords.push(latLng);

    var latLng=new google.maps.LatLng(Coords.Y2,Coords.X2);     
    coords.push(latLng);
         

    var latLng=new google.maps.LatLng(Coords.Y2,Coords.X1);     
    coords.push(latLng);

    var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
    coords.push(latLng);    
    
    if(poligonos[poligono]){poligonos[poligono].setMap(null)}

    //Calcula la intensidad del color:
    var intensidad=0;
    if(poligono=="poligonoN0")
    
    if(coleccionN0[Coords.Y1+","+Coords.X1] && poligono=="poligonoN0"){
        intensidad=(GetValorRangos(coleccionN0[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN0, 1,10)/10);
        alphaLinea=0;
    }

    var strokeWeight=.6;
    if(coleccionN1[Coords.Y1+","+Coords.X1] && poligono=="poligonoN1"){

        strokeWeight=(GetValorRangos(coleccionN1[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN1, 1,30))/10;
        alphaLinea=(GetValorRangos(coleccionN1[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN1, 2,10))/10;
        
    }

    poligonos[poligono] = new google.maps.Polygon({
                          paths: coords,
                          strokeColor:  colorLinea,
                          strokeOpacity: alphaLinea,
                          strokeWeight: strokeWeight,
                          fillColor: 'red',
                          fillOpacity: intensidad                                                 
                        });        

    poligonos[poligono].setMap(mapa_); 

}

var TodosN1Dibujados=[];
var TodosN0Dibujados=[];

function DibujaTodosN1(){

        for(var e in coleccionN1){

                var Coords=coleccionN1[e].coordenadas;
            
                CoordsPoligono = new Array();

                var coords=new Array();

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
                coords.push(latLng);

               

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X2);     
                coords.push(latLng);

                var latLng=new google.maps.LatLng(Coords.Y2,Coords.X2);     
                coords.push(latLng);                 

                var latLng=new google.maps.LatLng(Coords.Y2,Coords.X1);     
                coords.push(latLng);

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
                coords.push(latLng);           

                //Calcula la intensidad del color:

                var intensidad=(GetValorRangos(coleccionN1[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN1, 0,5))/10;             

                TodosN1Dibujados.push(new google.maps.Polygon({
                                      paths: coords,                                  
                                      strokeOpacity: 0,
                                      strokeWeight: 0,
                                      fillColor: 'red',
                                      fillOpacity: intensidad                                                 
                                    })
                );        

                TodosN1Dibujados[TodosN1Dibujados.length-1].setMap(mapa_);
                

        }


        for(var e in coleccionN0){

                var Coords=coleccionN0[e].coordenadas;
            
                CoordsPoligono = new Array();

                var coords=new Array();

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
                coords.push(latLng);               

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X2);     
                coords.push(latLng);

                var latLng=new google.maps.LatLng(Coords.Y2,Coords.X2);     
                coords.push(latLng);                 

                var latLng=new google.maps.LatLng(Coords.Y2,Coords.X1);     
                coords.push(latLng);

                var latLng=new google.maps.LatLng(Coords.Y1,Coords.X1);     
                coords.push(latLng);    

                     

                //Calcula la intensidad del color:

                var intensidad=(GetValorRangos(coleccionN0[Coords.Y1+","+Coords.X1].valor,1,maximaCantidadN0, 0,30))/10;             

                TodosN0Dibujados.push(new google.maps.Polygon({
                                      paths: coords,                                  
                                      strokeOpacity: 0,
                                      strokeWeight: 0,
                                      fillColor: 'red',
                                      fillOpacity: intensidad                                                 
                                    })
                );        

                TodosN0Dibujados[TodosN0Dibujados.length-1].setMap(mapa_);
                

        }

}

function EliminaTodosN(){

    for(var i=0;i<TodosN1Dibujados.length;i++){

        TodosN1Dibujados[i].setMap(null);

    }

    TodosN1Dibujados=[];

     for(var i=0;i<TodosN0Dibujados.length;i++){

        TodosN0Dibujados[i].setMap(null);

    }

    TodosN0Dibujados=[];

}

function ObtieneNombres(lat,lng){
   
    var n1=CalculaCoordenadas(String(lat+","+lng),120); //Calcular Minutos  1
    var n0=CalculaCoordenadas(String(lat+","+lng),1200); //Calcular Segundos  0 

    return {n0:{Y1:n0.Y1,X1:n0.X1,Y2:n0.Y2,X2:n0.X2  },n1:{ Y1:n1.Y1,X1:n1.X1,Y2:n1.Y2,X2:n1.X2} };

}


function CalculaCoordenadas(cad,divisor){

    var arrTem = cad.split(",");
    var cad = arrTem[1];
    var cordX = cad.split(".");
    var cordY = new Array();

    XXEntero= cordX[0];
   
    Xdecimales = Number("."+cordX[1]);
    Xdecimales =  Xdecimales / (1/divisor);
   
    cordX = Xdecimales.toString().split(".");
    
    
    X1 = Number(cordX[0]);
    X2 = (X1+1)*(1/divisor);
    X1 = X1 *(1/divisor);
    if(X1 >=0){
        if(XXEntero >= 0){
            X1 = XXEntero+X1;
        }
        else{
            X1 = XXEntero-X1;
        }
    }else{
        X1 = Number(XXEntero+(X1.toString().substr(1)));
    }
    if(X2 >=0){
        if(XXEntero > 0){
            X2 = XXEntero+X2;
        }
        else{
            X2 = XXEntero-X2;
        }
    }else{
        X2 = Number(XXEntero+(X2.toString().substr(1)));
    }
    
    if(arrTem[1].toString().split(".")[0] == "-0"){
        X1= (X1*-1);
    }
    if(arrTem[1].toString().split(".")[0] == "0"){
        X2 =(X2*-1);
    }   

    cad = arrTem[0];
    cordY = cad.split(".");
    YYEntero= cordY[0];
     
    Ydecimales = Number("."+cordY[1]);
    Ydecimales =  Ydecimales / (1/divisor);
    cordY = Ydecimales.toString().split(".");
    
    
    Y1 = Number(cordY[0]);
    Y2 = (Y1+1)*(1/divisor);
    Y1 = Y1 *(1/divisor);
    
    if(Y1 >=0){
        if(YYEntero >= 0){
            Y1 = Number(YYEntero)+Number(Y1);
        }
        else{
            Y1 = Number(YYEntero)-Number(Y1);
        }
    }else{
        Y1 = Number(Number(YYEntero)+Number(Y1.toString().substr(1)));
    }
    

    if(Y2 >=1){
        if(YYEntero >= 0){
            
            Y2 = Number(YYEntero)+Number(Y2);
        }
        else{
            
            Y2 =Number(Number(YYEntero)+Number(Y2.toString().substr(1)));
        }
    }
    else{
        Y2 = Number(YYEntero+(Y2.toString().substr(1)));
    }
    if(arrTem[0].toString().split(".")[0] == "-0"){
        Y1= (Y1*-1);
        Y2 =(Y2*-1);
    }
    return {Y1:Y1,X1:X1,Y2:Y2,X2:X2};
}




