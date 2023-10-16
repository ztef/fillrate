
Cesium.BingMapsApi.defaultKey="Ao97p5MHevB_IeYJJ0hqvH0-N4KBgeFWHrGaJ9Y_eHDI8Z1OhYLKbmitA0rH1LsK";

var extent = Cesium.Rectangle.fromDegrees(-128,44,-67,15);

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;

Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

var svgLines;

var svgLines2;


var Stage={};

Stage.labelsInterval;

Stage.allowMultipleSelection=false;
Stage.selectedItems={};

Stage.initStage=function(resolve, reject){

		viewer = new Cesium.Viewer('cesiumContainer', {
			imageryProvider : new Cesium.UrlTemplateImageryProvider({
				//url : 'https://api.mapbox.com/styles/v1/dcontreras1979/ciwiilbs100022qnvp3m3vnsh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGNvbnRyZXJhczE5NzkiLCJhIjoiY2l3Z3dpY2gxMDFhbzJvbW40cWRqNmZ0OCJ9.KIrZ8JiXWYgjLBb-nL3kYg',
				url : 'https://api.mapbox.com/styles/v1/dcontreras1979/clkbl3i2z000d01p57y20fkss/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGNvbnRyZXJhczE5NzkiLCJhIjoiY2l3Z3dpY2gxMDFhbzJvbW40cWRqNmZ0OCJ9.KIrZ8JiXWYgjLBb-nL3kYg',
				credit : '',
				
				terrainProvider: new Cesium.CesiumTerrainProvider({
					url: `https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key=6mKJJJYS8B7DcCpfaQSV`,
					credit: new Cesium.Credit("\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy;MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e", true),
					requestVertexNormals: true
		})
	 
			
		}),
		timeline:false,
		infoBox:false,
		animation : false,
		skyBox:false,

		baseLayerPicker : false
		});

		var terrainProvider = new Cesium.CesiumTerrainProvider({
		url: `https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key=6mKJJJYS8B7DcCpfaQSV`,
		});


		viewer.camera.flyTo({
			destination : Cesium.Cartesian3.fromDegrees(-101.777344, 8.121772, 2500000.0),
			orientation : {
				heading : Cesium.Math.toRadians(0),
				pitch : Cesium.Math.toRadians(-58.0),
				roll : 0.0
			}
		});
		
		viewer._cesiumWidget._creditContainer.parentNode.removeChild( viewer._cesiumWidget._creditContainer);
		$(".cesium-viewer-toolbar").css("visibility","hidden");
		//$(".cesium-viewer-toolbar").css("position","fixed");
		//$(".cesium-viewer-toolbar").css("bottom","0px");

		handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

		handler.setInputAction(function(click) {

		    var pickedObject = viewer.scene.pick(click.position);

		    localizacion=undefined;

		    if (Cesium.defined(pickedObject)) {
				
		        	for(var e in ultimosEstadosDibujados){					
						for(var j=0; j < ultimosEstadosDibujados[e].length; j++ ){

							if( ultimosEstadosDibujados[e][j]._id == pickedObject.id._id ){
								//Stage.FocusMapElement(e);
								console.log(e);
								filterControls.lookForEntity(e,"cat_estado");
								break;
							}	
							
						}
					}				

		    }else
		    {
		    	$("#toolTip").css("visibility","hidden");
				
				radar.CleanWindows();

				$('#Controls').css("visibility","hidden");

		    }	  


		}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

		handler.setInputAction(function(click) {

		    var pickedObject = viewer.scene.pick(click.position);

		    localizacion=undefined;

		    if (Cesium.defined(pickedObject)) {

		        	
			        $("#chartContainer").css("visibility","visible");

					$("#toolTip").css("visibility","hidden");
					
					if(mapElements[pickedObject.id._id]){

						Stage.FocusMapElement(mapElements[pickedObject.id._id].key);

					}else
					{
						$("#toolTip").css("visibility","hidden");
						
						radar.CleanWindows();
		
						$('#Controls').css("visibility","hidden");
		
					}

					if(Stage.allowMultipleSelection){

						for(var e in ultimosEstadosDibujados){	

							for(var j=0; j < ultimosEstadosDibujados[e].length; j++ ){
	
								if( ultimosEstadosDibujados[e][j]._id == pickedObject.id._id ){

									if(ultimosEstadosDibujados[e][j].seleccionado){
										
										ultimosEstadosDibujados[e][j].seleccionado=false;
										ultimosEstadosDibujados[e][j]._polygon.material=ultimosEstadosDibujados[e][j].originalMaterial;
										delete Stage.selectedItems[e];

									}else{	

										ultimosEstadosDibujados[e][j].seleccionado=true;
										ultimosEstadosDibujados[e][j]._polygon.material=Cesium.Color.fromCssColorString("#ffffff").withAlpha(.7);
										Stage.selectedItems[e]=true;

									}								

								}	
								
							}

						}

					}

		    }else
		    {
		    	$("#toolTip").css("visibility","hidden");
				
				radar.CleanWindows();

				$('#Controls').css("visibility","hidden");

		    }	  


		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		handler.setInputAction(function(click) {  

			var pickedObject = viewer.scene.pick(click.endPosition);

		    localizacion=undefined;
			    
		    if (Cesium.defined(pickedObject)) {				

		        if(mapElements[pickedObject.id._id]){
				
		        	$("#toolTip").css("visibility","visible");
			    	
			        $("#toolTip").css("left",mouse_x+50);

					if(  windowWidth-mouse_x < 500 )
					$("#toolTip").css("left",mouse_x-600);

					var text=dataManager.getTooltipText(mapElements[pickedObject.id._id]);

					

					$("#toolTip").html(text );

					var posY=mouse_y-50;
					if( $("#toolTip").height()+mouse_y > windowHeight ){
						posY=windowHeight-$("#toolTip").height()-150;
					}
					if( posY < 0 ){
						posY=0;
					}
					$("#toolTip").css("top",posY);
					
		    	}else
				{
	
					$("#toolTip").css("visibility","hidden");		    	
	
				}
		    	
		    }else
		    {

		    	$("#toolTip").css("visibility","hidden");		    	

		    }

		 } ,Cesium.ScreenSpaceEventType.MOUSE_MOVE);


		 $("#svgLines")
						.css("width","100%")
						.css("height",windowHeight);


		svgLines = d3.select("#svgLines")						
							.append("svg")								
							.attr("width", "100%" )
							.attr("height",  "100%" )
							;

		$("#svgLines2")
							.css("width","100%")
							.css("height",windowHeight);

		svgLines2 = d3.select("#svgLines2")						
							.append("svg")								
							.attr("width", "100%" )
							.attr("height",  "100%" )
							;

		svgLines.append("rect")		
							.attr("id","borderBlack")
							.attr("width",windowWidth*.14 )
							.attr("y", 0  )
							.attr("height",windowHeight)
							.attr("fill","url(#grad1)")
							;

		svgLines.append("rect")		    		
					.attr("width","100%" )
					.attr("filter","url(#dropshadowRadar)")
					.attr("x",0  )
					.attr("y", 0  )
					.attr("height",85)
					.attr("fill","#131313")
					;

		svgLines.append("line")
					.style("stroke","#515252" )
				
					.style("stroke-width", 1 )
					.style("stroke-opacity", .4 )
					.attr("x1",0 )
					.attr("y1",85)
					.attr("x2","100%" )
					.attr("y2",85);

		Stage.blockScreen=svgLines.append("rect")		    		
					.attr("width",windowWidth )
					.attr("x", 0  )
					.attr("y", 0  )
					.attr("height",windowHeight)
				
					.style("opacity",.6)
					.attr("fill","black")
					.style("visibility","hidden")
					;

		resolve();
		
};

Stage.CleanSelectedItems=function(){
	
	for(var e in ultimosEstadosDibujados){	

		for(var j=0; j < ultimosEstadosDibujados[e].length; j++ ){

				ultimosEstadosDibujados[e][j].seleccionado=false;
				ultimosEstadosDibujados[e][j]._polygon.material=ultimosEstadosDibujados[e][j].originalMaterial;
			
		}

	}

	Stage.selectedItems={};
}

var mapElements={};
var mapElementsArr=[];
var escalado=1;
var currentEntities;

Stage.GoHome=function(){

	viewer.camera.flyTo({
		destination : Cesium.Cartesian3.fromDegrees(-101.777344, 8.121772, 2500000.0),
		orientation : {
			heading : Cesium.Math.toRadians(0),
			pitch : Cesium.Math.toRadians(-58.0),
			roll : 0.0
		}
	});

}

Stage.EraseMapObjects=function(){

	for(var i=0;i < mapElementsArr.length;i++){

		viewer.entities.remove(mapElementsArr[i]);

	}

}



Stage.DrawMapObjects=function(entities){
	console.log(entities);

	Stage.EraseMapObjects();

	mapElementsArr=[];
	entitiesCoords=[];

	for(var i=0; i < entities.length; i++){   

		for(var j=0; j < store.niveles.length; j++){ 

			if( store.niveles[j].id == Number($("#nivel_cb").val()) ){

				if(store.niveles[j].coordinatesSource ){

				var catalogoDeCoordenadas=store[store.niveles[j].coordinatesSource];
				
					for(var k=0; k < catalogoDeCoordenadas.length; k++){

							if(catalogoDeCoordenadas[k].ID==entities[i].key || catalogoDeCoordenadas[k].Nombre==entities[i].key){								
								entities[i].lat=Number(catalogoDeCoordenadas[k].Lat);
								entities[i].lng=Number(catalogoDeCoordenadas[k].Long);
								entitiesCoords.push({lat:entities[i].lat ,lng:entities[i].lng});
							}
					}

				}

			}

		}
	}

	var agrupadorActual=Number($("#nivel_cb").val());
	mapElements={};
	
	var radioScale = d3.scale.linear()
						.domain([1,calculateKpiExpert_FR.max])
						//.domain([entities.min,entities.max])
						//.range([config.radiosMinimos[agrupadorActual], config.radiosMaximos[agrupadorActual] ]);
						.range([config.radiosMinimos[agrupadorActual], config.radiosMaximos[agrupadorActual] ]);

	for(var i=0; i < entities.length; i++){  			
		
			if(entities[i].lat){

					entities[i].altura = config.alturas[agrupadorActual];

					entities[i].radio=radioScale(entities[i].fillRate.totalSolicitado);

					entities[i].altura = entities[i].altura*escalado;
					entities[i].radio=entities[i].radio*escalado;

					if(entities[i].radio < 40)
						entities[i].radio=40;

					store.map_var.DrawElement(entities[i],i);

			}
	}

	currentEntities=entities;

	Stage.blockScreen.style("visibility","hidden");
	//$("#Controls").css("visibility","visible");



	setTimeout(()=>{

        filterControls.CheckIfFocus();       

    }, 1000);

	Stage.GetCammeraPos(entitiesCoords);

}

var calendarVisible=true;

Stage.ToogleCalendar=function(val){ 

	if(val){

		if(val=="on"){

			$('.loginContainer').css('visibility','visible');
			$('#Controls').css('visibility','hidden');
			$('#dateSelect').val('');
			calendarVisible=true;

		}else{
			$('.loginContainer').css('visibility','hidden');		
			calendarVisible=false;
		}

	}else{

		calendarVisible=!calendarVisible;

		if(calendarVisible){

			$('.loginContainer').css('visibility','visible');
			$('#Controls').css('visibility','hidden');
			$('#dateSelect').val('');
			calendarVisible=true;

		}else{
			$('.loginContainer').css('visibility','hidden');		
			calendarVisible=false;
		}
	}	

}

Stage.GetCammeraPos=function(coords){ 

	
	if( $("#nivel_cb").val()==0 ){ // para nivel nacional


		var rootpos = Cesium.Cartesian3.fromDegrees(-101.777344, 8.121772, 2500000.0);

		viewer.camera.flyTo({
			destination : rootpos,
			orientation : {
				heading : Cesium.Math.toRadians(0),
				pitch : Cesium.Math.toRadians(-58.0),
				roll : 0.0
			}

		});
		
		
	}else{


		// arreglo de coordenadas, angulo desde la camara hacia abajo, factor de altura
		// El factor de altura es proporcional a la diagonal del bounding box 

		// coords, angulo hacia  abajo, factor de altitud, factor de distancia 

		//calculateCameraPosition PITCH , factor de altitud , lejania
		var angulo= -45
		var altitud= 0.5
		var distancia= 0.5

		if($("#nivel_cb").val() < 3){
            angulo= -50;
			altitud= 1;
			distancia= 1.2;

		}else if($("#nivel_cb").val() <= 4){
            angulo= -45;
			altitud= 0.9;
			distancia= 0.7;

		}else if($("#nivel_cb").val() > 4){
            angulo= -45;
			altitud= 1;
			distancia= 0.7;
		}
            
		
		var c_pos= calculateCameraPosition(coords, angulo, altitud, distancia);
   		
		viewer.camera.flyTo({
			destination : c_pos.position,
			orientation : c_pos.orientation,
		});
	}

}
  




// CALCULO DE POSICION DE CAMARA :  BOUNDING BOX y CENTROIDE


function calculateCameraPosition(coordinates, pitchDegrees, altitudeFactor, diagonalFactor) {
	
	if (coordinates.length === 0) {
	  throw new Error('Input array is empty.');
	}
	
	 
	// Calcula complemento del angulo 
	const pitchComplement = 90 + pitchDegrees;

    let diagonalDistance = 1000;

	
	
			// Calcula bounding box :

			let west = Number.MAX_VALUE;
			let south = Number.MAX_VALUE;
			let east = -Number.MAX_VALUE;
			let north = -Number.MAX_VALUE;
	
			for (const coord of coordinates) {
			if(isInsideMexico(coord.lat,coord.lng)){
				west = Math.min(west, coord.lng);
				south = Math.min(south, coord.lat);
				east = Math.max(east, coord.lng);
				north = Math.max(north, coord.lat);
			}
			}
	
			// Calcula centroide del  bounding box
			var centerLat = (north + south) / 2;
			var centerLong = (east + west) / 2;
	
			// Calcula la distancia de la diagonal del bounding box
			diagonalDistance = calculateDistance(
			{ lat: south, long: west },
			{ lat: north, long: east }
			);
	
			
			if (coordinates.length == 1) { 
					 diagonalDistance = 1000000;
			}

	
	
	
	// Calcula la posicion al sur del centro (en metros ) y la convierte a grados

		// ojo : usa teorema de pitagoras para calcular el cateto opuesto (d){}
		// en base a la altura y el angulo. Por eso la tangente.
		// va


	const pitchRadians = Cesium.Math.toRadians(pitchComplement);
	
	//const latAdjustmentMeters = altitude * Math.tan(pitchRadians);
	
	const latAdjustmentMeters = diagonalDistance * diagonalFactor;
	const newLat = centerLat - (latAdjustmentMeters / 111319.9); // Convierte metros a grados (1 grado  de latitud ≈ 111319.9 metros)
	
	// Calcula la altura como proporcion a la diagonal
	const altitude = altitudeFactor * (latAdjustmentMeters / Math.tan(pitchRadians));
	
	
	const cameraPosition = new Cesium.Cartesian3.fromDegrees(centerLong, newLat, altitude);
	
	const fly = {
	  position: cameraPosition,
	  orientation: {
		heading: 0, // Norte
		pitch: Cesium.Math.toRadians(pitchDegrees), // pitch hacia abajo
		roll: 0, // Roll: 0
	  },
	};
	
	//console.log("VOLAR A : ", fly)
	
	return fly;
  }
  
  
  
  function calculateDistance(coord1, coord2) {
	// Calcula la distancia entre dos coordenadas
	const lat1 = Cesium.Math.toRadians(coord1.lat);
	const lon1 = Cesium.Math.toRadians(coord1.long);
	const lat2 = Cesium.Math.toRadians(coord2.lat);
	const lon2 = Cesium.Math.toRadians(coord2.long);
  
	// Usa la formula Haversine sobre un circulo  para calcular la distancia
	const dLat = lat2 - lat1;
	const dLon = lon2 - lon1;
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			  Math.cos(lat1) * Math.cos(lat2) *
			  Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const radiusOfEarth = 6371000; // Earth's radius in meters
	const distance = radiusOfEarth * c;
  
	return distance;
  }
  
	
  
  function isInsideMexico(lat, lng) {
    // Bounding Box de Mexico
    const mexicoBoundingBox = {
        north: 32.718333,
        south: 14.532778,
        west: -117.127764,
        east: -86.710278
    };

    // Checa si la coord esta en Mexico
    return (
        lat >= mexicoBoundingBox.south &&
        lat <= mexicoBoundingBox.north &&
        lng >= mexicoBoundingBox.west &&
        lng <= mexicoBoundingBox.east
    );
}
	


  



Stage.FocusMapElement=function(id){

	radar.CleanWindows();

	var encontro=false;

	for(var e in mapElements){
		
		if(mapElements[e].key.toLowerCase()==id.toLowerCase()){
			
			viewer.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(mapElements[e].lng, mapElements[e].lat+config.offSetCamaraParaEnfocar[$("#nivel_cb").val()], config.alturas[$("#nivel_cb").val()]*config.offSetAlturaParaEnfocar[$("#nivel_cb").val()] ),
				orientation : {
					heading : Cesium.Math.toRadians(0),
					pitch : Cesium.Math.toRadians(-58.0),
					roll : 0.0
				}
			});

			encontro=true;

			if( !mapElements[e].radarData ){
				if(radar )
					radar.AddNewRadar(mapElements[e]);
			}
	
			$("#radarDiv").animate({scrollTop: mapElements[e].radarData.posY-200}, 1000);
			mapElements[e].radarData.svgBack.attr("fill", "#9A9C9C").transition().delay(2000).duration(getRandomInt(0,2000))
			.attr("fill", "black");

			break;

		}		

	}

	if(!encontro){

		setTimeout(()=>{
			alert("No se encuentra en mapa el elemento");
		}, 500); 

	}
		

}

Stage.ReorderLayout=function(){

	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;

	if(store.fillRate){
		kpiExpert_FR.DrawMainHeader();
		kpiExpert_FR.DrawFilteredHeader();
	}

	$("#svgLines").css("height",windowHeight+"px");
	
	if(svgLines)
		svgLines.attr("height",windowHeight+"px");
	
	$("#titulo").css("width",((windowWidth*.9)-220)+"px");

	filterControls.showActiveFilters();

	$("#borderBlack").css("height",windowHeight+"px");
	
}


Stage.SetWindowPos=function(windowReq){
	
}


Stage.DrawFRLabels=function(){
      
	svgLines.selectAll(".entityLabel").style("opacity",0) ;

	 for(var i=0;  i < entities.length; i++){

			 var newPoint = new Point (Number( entities[i].lat ),Number( entities[i].lng ));

			 var nextPoint = new Point (Cesium.Math.toDegrees(viewer.camera.positionCartographic.latitude),Cesium.Math.toDegrees(viewer.camera.positionCartographic.longitude));

			 var distance = newPoint.distanceTo(nextPoint); 
		   
			 if( distance < 18 ){  
					 
					 var position = Cesium.Cartesian3.fromDegrees(Number( entities[i].lng ),Number( entities[i].lat ), 0 );
					 
					 var coord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);  
			  
					 if(coord){
							
							 if(coord.x > 400 && coord.x < $(document).width()-50 && coord.y > 40 && coord.y < ($(document).height())){
									if( entities[i].labelSVG){
										entities[i].labelSVG.attr("x",coord.x+7 )
											.attr("y", coord.y+3  ).style("opacity",opacidadCesium/100); 
									}							
													 
							 }
					 }

			 }
	 }
}   