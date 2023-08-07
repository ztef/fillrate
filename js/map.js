
Cesium.BingMapsApi.defaultKey="Ao97p5MHevB_IeYJJ0hqvH0-N4KBgeFWHrGaJ9Y_eHDI8Z1OhYLKbmitA0rH1LsK";

var extent = Cesium.Rectangle.fromDegrees(-128,44,-67,15);

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;

Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

var svgLines;


var Stage={};


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
		

		handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
		handler.setInputAction(function(click) {

		    var pickedObject = viewer.scene.pick(click.position);

		    localizacion=undefined;

		    if (Cesium.defined(pickedObject)) {

		        	$("#tool").css("visibility","visible");

			    	$("#tool").css("top",mouse_y-50);

			        $("#tool").css("left",mouse_x+50);

			        $("#chartContainer").css("visibility","visible");

			        console.log(pickedObject.id._id);

					if(mapElements[pickedObject.id._id]){						
						Stage.FocusMapElement(mapElements[pickedObject.id._id].key);
					}

		    }else
		    {
		    	$("#tool").css("visibility","hidden");		    	

		    }	  


		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

		handler.setInputAction(function(click) {  

			var pickedObject = viewer.scene.pick(click.endPosition);

		    localizacion=undefined;
			    
		    if (Cesium.defined(pickedObject)) {				

		        if(mapElements[pickedObject.id._id]){
				
		        	$("#toolTip").css("visibility","visible");
			    	
			        $("#toolTip").css("left",mouse_x+50);

					var dataCatlog="";
					var nombre=mapElements[pickedObject.id._id].key;
					
					for(var i=0; i < store.niveles.length; i++){    
						if( store.niveles[i].id == $("#nivel_cb").val() ){
							dataCatlog=store[store.niveles[i].coordinatesSource]; 
							
							for(var j=0; j < dataCatlog.length; j++){    
								//console.log(dataCatlog[j].ID);
								if(dataCatlog[j].ID==mapElements[pickedObject.id._id].key){
									if(dataCatlog[j].Nombre!=nombre)
										nombre+=" "+dataCatlog[j].Nombre;
								}
									
							}
						}						
					}					

					nombre=nombre.replaceAll("_"," ");
					nombre=nombre.replaceAll("undefined"," ");

					var text=`
								<span style='color:#00C6FF;font-size:15px;'><span style='color:#00C6FF'>${nombre} 
							`

							if(calculateKpiExpert_Ventas.getTooltipDetail){
								if(calculateKpiExpert_Ventas.getTooltipDetail(mapElements[pickedObject.id._id].key,store.mainDataset)!=undefined)
								text+=calculateKpiExpert_Ventas.getTooltipDetail(mapElements[pickedObject.id._id].key);
							}
		
							if(calculateKpiExpert_FR.getTooltipDetail){
								if(calculateKpiExpert_FR.getTooltipDetail(mapElements[pickedObject.id._id].key,store.mainDataset)!=undefined)
								text+=calculateKpiExpert_FR.getTooltipDetail(mapElements[pickedObject.id._id].key,store.mainDataset);
							}

							if(calculateKpiExpert_Pendientes.getTooltipDetail){
								if(calculateKpiExpert_Pendientes.getTooltipDetail(mapElements[pickedObject.id._id].key,store.mainDataset)!=undefined)
								text+=calculateKpiExpert_Pendientes.getTooltipDetail(mapElements[pickedObject.id._id].key);
							}
		
							
							if(calculateKpiExpert_Mas.getTooltipDetail){
								if(calculateKpiExpert_Mas.getTooltipDetail(mapElements[pickedObject.id._id].key,store.mainDataset)!=undefined)
								text+=calculateKpiExpert_Mas.getTooltipDetail(mapElements[pickedObject.id._id].key);
							}
		
							if(calculateKpiExpert_OOS.getTooltipDetail){
								if(calculateKpiExpert_OOS.getTooltipDetail(mapElements[pickedObject.id._id].key,store.mainDataset)!=undefined)
								text+=calculateKpiExpert_OOS.getTooltipDetail(mapElements[pickedObject.id._id].key);
							}
		
							if(calculateKpiExpert_Abasto.getTooltipDetail){
								if(calculateKpiExpert_Abasto.getTooltipDetail(mapElements[pickedObject.id._id].key,store.mainDataset)!=undefined)
								text+=calculateKpiExpert_Abasto.getTooltipDetail(mapElements[pickedObject.id._id].key);
							}
							
							if(calculateKpiExpert_Produccion.getTooltipDetail){
								if(calculateKpiExpert_Produccion.getTooltipDetail(mapElements[pickedObject.id._id].key,store.mainDataset)!=undefined)
								text+=calculateKpiExpert_Produccion.getTooltipDetail(mapElements[pickedObject.id._id].key);
							}
					

					$("#toolTip").html(text );

					var posY=mouse_y-50;
					if( $("#toolTip").height()+mouse_y > windowHeight ){
						posY=windowHeight-$("#toolTip").height()-150;
					}
					if( posY < 0 ){
						posY=0;
					}
					$("#toolTip").css("top",posY);
					
		    	}
		    	
		    }else
		    {

		    	$("#toolTip").css("visibility","hidden");		    	

		    }

		 } ,Cesium.ScreenSpaceEventType.MOUSE_MOVE);


		 $("#svgLines")
						.css("width",windowWidth)
						.css("height",windowHeight);


		svgLines = d3.select("#svgLines")						
						.append("svg")
						.attr("id","containerSCG")
						.attr("width", windowWidth )
						.attr("height", windowHeight )
						;


		svgLines = d3.select("#svgLines")						
							.append("svg")								
							.attr("width", windowWidth )
							.attr("height", windowHeight )
							;

		svgLines.append("rect")		    		
							.attr("width",windowWidth*.14 )
							.attr("y", 0  )
							.attr("height",windowHeight)
							.attr("fill","url(#grad1)")
							;
/*
		svgLines.append("rect")		    		
					.attr("width",windowWidth*.2 )
					.attr("x", windowWidth-(windowWidth*.14)  )
					.attr("y", 40  )
					.attr("height",windowHeight)
					.attr("fill","url(#grad2)")
					;*/

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

Stage.DrawMapObjects=function(entities,varName){
	console.log(entities);

	for(var i=0;i < mapElementsArr.length;i++){

		viewer.entities.remove(mapElementsArr[i]);

	}

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

	if(kpiExpert_FR.DrawElement){

		for(var i=0; i < entities.length; i++){  			
			
				if(entities[i].lat){

						entities[i].altura = config.alturas[agrupadorActual];

						entities[i].radio=radioScale(entities[i][varName].totalSolicitado);

						entities[i].altura = entities[i].altura*escalado;
						entities[i].radio=entities[i].radio*escalado;

						if(entities[i].radio < 40)
							entities[i].radio=40;

						kpiExpert_FR.DrawElement(entities[i],varName,i);

				}
		}

	}

	currentEntities=entities;

	Stage.blockScreen.style("visibility","hidden");
	$("#Controls").css("visibility","visible");

	setTimeout(()=>{

        filterControls.CheckIfFocus();        

    }, 1000);

	

}

Stage.FocusMapElement=function(id){

	console.log("FocusMapElement",id);
	
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