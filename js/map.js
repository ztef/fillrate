
Cesium.BingMapsApi.defaultKey="Ao97p5MHevB_IeYJJ0hqvH0-N4KBgeFWHrGaJ9Y_eHDI8Z1OhYLKbmitA0rH1LsK";

var extent = Cesium.Rectangle.fromDegrees(-128,44,-67,15);

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;

Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

var svgLines;


var Stage={};

Stage.labelsInterval;

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
				console.log(pickedObject.id._id);
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
							.attr("height", windowHeight )
							;

		svgLines.append("rect")		    		
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

	for(var i=0; i < entities.length; i++){   
		for(var j=0; j < store.niveles.length; j++){ 

			if( store.niveles[j].id == Number($("#nivel_cb").val()) ){

				if(store.niveles[j].coordinatesSource ){

				var catalogoDeCoordenadas=store[store.niveles[j].coordinatesSource];
				
					for(var k=0; k < catalogoDeCoordenadas.length; k++){

							if(catalogoDeCoordenadas[k].ID==entities[i].key || catalogoDeCoordenadas[k].Nombre==entities[i].key){								
								entities[i].lat=Number(catalogoDeCoordenadas[k].Lat);
								entities[i].lng=Number(catalogoDeCoordenadas[k].Long);
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

	

}

Stage.FocusMapElement=function(id){

	radar.CleanWindows();

	for(var e in mapElements){

		if(mapElements[e].key.toLowerCase()==id.toLowerCase()){
			viewer.camera.flyTo({
				destination : Cesium.Cartesian3.fromDegrees(mapElements[e].lng, mapElements[e].lat+config.offSetCamaraParaEnfocar[$("#nivel_cb").val()], config.alturas[$("#nivel_cb").val()]*3 ),
				orientation : {
					heading : Cesium.Math.toRadians(0),
					pitch : Cesium.Math.toRadians(-58.0),
					roll : 0.0
				}
			});

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