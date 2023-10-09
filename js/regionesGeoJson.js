

var coodsEstados=[];

function DibujaEstados()
{
    $.ajax({
      type: "GET",
      url: "docs/geojson/Estados_CEMEX2.json",
      dataType: "text",
      success: function(data) {parseEstados(data);}
   });
}

var estadosSiluetas={};
function parseEstados(allText)
{

  var seccionesJson=JSON.parse(allText);

  for(var i in seccionesJson.features){

        var claveGeo=seccionesJson.features[i].properties.Estado;

        estadosSiluetas[claveGeo]=[];
        
        for(var j=0; j < seccionesJson.features[i].geometry.coordinates.length; j++){

            if(seccionesJson.features[i].geometry.coordinates.length > 1){

                var element=[];

                for(var k=0; k < seccionesJson.features[i].geometry.coordinates[j][0].length; k++){

                        var lat=seccionesJson.features[i].geometry.coordinates[j][0][k][0];
                        var lng=seccionesJson.features[i].geometry.coordinates[j][0][k][1];
                        element.push(lat);
                        element.push(lng);
                    
                }

                coodsEstados.push(element);  
                
                estadosSiluetas[claveGeo].push(element);

                

            }else{

                var element=[];

                for(var k=0; k < seccionesJson.features[i].geometry.coordinates[j].length; k++){

                        var lat=seccionesJson.features[i].geometry.coordinates[j][k][0];
                        var lng=seccionesJson.features[i].geometry.coordinates[j][k][1];
                        element.push(lat);
                        element.push(lng);
                    
                }

                coodsEstados.push(element);     

                estadosSiluetas[claveGeo].push(element);
                
            }

        }             

    }   
    
}

var ultimosEstadosDibujados={};

var equivalenciasNombres={};
equivalenciasNombres["Estado de México"]="Ciudad de México";
equivalenciasNombres["Coahuila"]="Coahuila de Zaragoza";
equivalenciasNombres["Michoacán"]="Michoacán de Ocampo";
equivalenciasNombres["Veracruz"]="Veracruz Sur";
equivalenciasNombres["Veracruz N"]="Veracruz Norte";



function DibujaEstadoEspecifico(entity, color)
{

    var encontro=false;
    for(var e in estadosSiluetas){
        if(e.toLowerCase() == entity.toLowerCase() ){
            encontro=true;
        } 
        
        if(equivalenciasNombres[entity]){

            if(equivalenciasNombres[entity].toLowerCase() == e.toLowerCase() ){
                encontro=true;
            }

        }

        if(encontro){

            if(ultimosEstadosDibujados[entity]){
                for(var k=0; k < ultimosEstadosDibujados[entity].length; k++ ){
                    viewer.entities.remove(ultimosEstadosDibujados[entity][k]);
                }
            }

            ultimosEstadosDibujados[entity]=[];

            for(var j=0; j < estadosSiluetas[e].length; j++ ){               
                    
                var polygon = viewer.entities.add({
                    polygon: {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(estadosSiluetas[e][j]),
                    height: 0,
                    material: Cesium.Color.fromCssColorString(color).withAlpha(0.2),
                    outline: true,
                    outlineColor: Cesium.Color.WHITE,
                    },
                });

                polygon.seleccionado=false;
                polygon.originalMaterial=Cesium.Color.fromCssColorString(color).withAlpha(0.2);

                ultimosEstadosDibujados[entity].push(polygon);

            }

            break;
        }
    } 

}

function EliminaEstadosDibujados()
{
    for(var e in ultimosEstadosDibujados){

        for(var k=0; k < ultimosEstadosDibujados[e].length; k++ ){
            viewer.entities.remove(ultimosEstadosDibujados[e][k]);
        }

    }
}



var coords=[]; 

function DibujaRegiones()
{
    $.ajax({
      type: "GET",
      url: "docs/geojson/Centro.json",
      dataType: "text",
      success: function(data) {parseSecciones(data);}
   });
}

function parseSecciones(allText)
{

  var seccionesJson=JSON.parse(allText);

  for(var i in seccionesJson.features){

        var element=[];

        var claveGeo=Number(seccionesJson.features[i].section);

        console.log(seccionesJson.features[i]);

        for(var j=0; j < seccionesJson.features[i].geometry.coordinates.length; j++){

               for(var k=0; k < seccionesJson.features[i].geometry.coordinates[j].length; k++){

                    var lat=seccionesJson.features[i].geometry.coordinates[j][k][0];
                    var lng=seccionesJson.features[i].geometry.coordinates[j][k][1];
                    element.push({lat:lat,lng:lng});
               }

        }

        coords.push(element);

    } 
    ConsultaRegion2();
}


function ConsultaRegion2()
{
    $.ajax({
      type: "GET",
      url: "docs/geojson/Noreste.json",
      dataType: "text",
      success: function(data) {parseSecciones2(data);}
   });
}

function parseSecciones2(allText)
{

  var seccionesJson=JSON.parse(allText);

  for(var i in seccionesJson.features){

        var element=[];        

        console.log(seccionesJson.features[i]);

        for(var j=0; j < seccionesJson.features[i].geometry.coordinates.length; j++){

               for(var k=0; k < seccionesJson.features[i].geometry.coordinates[j].length; k++){

                    var lat=seccionesJson.features[i].geometry.coordinates[j][k][0];
                    var lng=seccionesJson.features[i].geometry.coordinates[j][k][1];
                    element.push({lat:lat,lng:lng});
               }

        }

        coords.push(element);

    } 

    ConsultaRegion3();

}


function ConsultaRegion3()
{
    $.ajax({
      type: "GET",
      url: "docs/geojson/Pacifico.json",
      dataType: "text",
      success: function(data) {parseSecciones3(data);}
   });
}

function parseSecciones3(allText)
{

    var seccionesJson=JSON.parse(allText);

    console.log(seccionesJson);

    for(var i in seccionesJson.features){
  
          var element=[];        
  
          console.log(seccionesJson.features[i]);
  
          for(var j=0; j < seccionesJson.features[i].geometry.coordinates.length; j++){

           
            for(var k=0; k < seccionesJson.features[i].geometry.coordinates[j].length; k++){

               
                for(var l=0; l < seccionesJson.features[i].geometry.coordinates[j][k].length; l++){

                   
                    if(seccionesJson.features[i].geometry.coordinates[j][k][l].length< 3){
                       
                        var lat=seccionesJson.features[i].geometry.coordinates[j][k][l][0];
                        var lng=seccionesJson.features[i].geometry.coordinates[j][k][l][1];
                        
                        
                        element.push({lat:lat,lng:lng});
                    }
    
                }

            }

          }
  
          coords.push(element);
  
      } 

      ConsultaRegion4();
}


function ConsultaRegion4()
{
    $.ajax({
      type: "GET",
      url: "docs/geojson/Sureste.json",
      dataType: "text",
      success: function(data) {parseSecciones4(data);}
   });
}

function parseSecciones4(allText)
{

    var seccionesJson=JSON.parse(allText);

    console.log(seccionesJson);

    for(var i in seccionesJson.features){
  
          var element=[];        
  
          console.log(seccionesJson.features[i]);
  
          for(var j=0; j < seccionesJson.features[i].geometry.coordinates.length; j++){

           
            for(var k=0; k < seccionesJson.features[i].geometry.coordinates[j].length; k++){

               
                for(var l=0; l < seccionesJson.features[i].geometry.coordinates[j][k].length; l++){

                   
                    if(seccionesJson.features[i].geometry.coordinates[j][k][l].length< 3){
                       
                        var lat=seccionesJson.features[i].geometry.coordinates[j][k][l][0];
                        var lng=seccionesJson.features[i].geometry.coordinates[j][k][l][1];
                        
                       
                        element.push({lat:lat,lng:lng});
                    }
    
                }

            }

          }
  
          coords.push(element);
  
      } 

    DibujaGeoJsons();
}

function DibujaGeoJsons(){

    for(var i=0; i< coords.length; i++){

        for(var j=0; j< coords[i].length; j++){

            if(!coords[i][j+1]){
                break;
            }

            if(Math.abs(distanciaGeodesica(coords[i][j].lat ,coords[i][j].lng,coords[i][j+1].lat ,coords[i][j+1].lng)) > 100){
                continue;
            } 
            
        

            if(Math.floor(distanciaGeodesica(coords[i][j].lat ,coords[i][j].lng,coords[i][j+1].lat ,coords[i][j+1].lng)) == 0){
                continue;
            }

            var surfacePosition = Cesium.Cartesian3.fromDegrees( coords[i][j].lat ,coords[i][j].lng , 0);

            var heightPosition = Cesium.Cartesian3.fromDegrees( coords[i][j+1].lat ,coords[i][j+1].lng , 0); 

            var polyline = new Cesium.PolylineGraphics();
            
            polyline.material = Cesium.Color.fromCssColorString("#31A6B0").withAlpha(0.2);

            polyline.width = new Cesium.ConstantProperty(3);
            polyline.followSurface = new Cesium.ConstantProperty(false);
            polyline.positions = new Cesium.ConstantProperty([surfacePosition, heightPosition]);
            polyline.width = 3;

            //The polyline instance itself needs to be on an entity.
            var entity = viewer.entities.add({
                name : getRandomInt(0,100000000),
                //show : show,
                polyline : polyline
            
            });

        }
      

    }

  

}