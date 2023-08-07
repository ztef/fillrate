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
            
            polyline.material = Cesium.Color.fromCssColorString("#31A6B0");

            polyline.width = new Cesium.ConstantProperty(2);
            polyline.followSurface = new Cesium.ConstantProperty(false);
            polyline.positions = new Cesium.ConstantProperty([surfacePosition, heightPosition]);
            polyline.width = 1;

            //The polyline instance itself needs to be on an entity.
            var entity = viewer.entities.add({
                name : getRandomInt(0,100000000),
                //show : show,
                polyline : polyline
            
            });

        }
      

    }

  

}