var radar={};
var svgRadar;
var heightInit="4000px";
var widthInit=25;
var offSetTop=60;
var offSetLeft=20;
var radaresDibujados=0;
var paddingTop=50;
radar.lastRadarEntities=[];
radar.escalado=1;
var radio;
var radioInt;
var radioInicialInidcador=8;
var maximaCantidadRadaresDibujables=50;
var minValueFR=0;
var maxValueFR=0;

radar.radarInitStage=function(){    

    var elemDiv = document.createElement('div');
    elemDiv.setAttribute("id", "radarDiv");
    elemDiv.style.cssText = 'width:'+widthInit+'%;position:fixed;bottom:0px;top:80px;z-index:99999;pointer-events:auto;overflow-y: scroll;'+'height:'+(windowHeight-80)+"px"+';';
   
    document.body.appendChild(elemDiv);

    svgRadar =d3.select(elemDiv)						
                .append("svg")
                .attr("id","containerSCG")
                .attr("width", "100%" )
                .attr("height", heightInit )
                ;   

}

radar.CleanWindows=function(){    

    if(kpiExpert_OOS){
        if(kpiExpert_OOS.DrawTooltipDetail){
            kpiExpert_OOS.eraseChart();
        }
    }
    if(kpiExpert_ABAS){
        if(kpiExpert_ABAS.DrawTooltipDetail){
            kpiExpert_ABAS.eraseChart();
        }
    }
    if(kpiExpert_PROD){
        if(kpiExpert_PROD.DrawTooltipDetail){
            kpiExpert_PROD.eraseChart();
        }
    }
    if(kpiExpert_FR){
        if(kpiExpert_FR.DrawTooltipDetail){
            kpiExpert_FR.eraseChart();
        }
    }
    if(kpiExpert_MAS){
        if(kpiExpert_MAS.DrawTooltipDetail){
            kpiExpert_MAS.eraseChart();
        }
    }
    if(drawKpiExpert_VENTAS){
        if(drawKpiExpert_VENTAS.DrawTooltipDetail){
            drawKpiExpert_VENTAS.eraseChart();
        }
    }
    if(kpiExpert_PENDIENTES){
        if(kpiExpert_PENDIENTES.DrawTooltipDetail){
            kpiExpert_PENDIENTES.eraseChart();
        }
    }
    if(reportExpert){
                
        reportExpert.EraseReport();
        
    }

}

radar.config=[

    {label:"Cump Venta",color:"#4EFF00",var:"ventas",minimoValor:60,valorEquilibrio:100 , maximoValor:140, abreviacion:"VENTA" ,unidad:"%",tooltipDetail:drawKpiExpert_VENTAS,calculateExpert:calculateKpiExpert_Ventas},
    {label:"Fill Rate",color:"#E4FF00",var:"fillRate",minimoValor:50 ,valorEquilibrio:100,maximoValor:150, abreviacion:"FR",unidad:"%",tooltipDetail:kpiExpert_FR,calculateExpert:calculateKpiExpert_FR},
    {label:"Pedidos Retrasados (Miles de Ton)",color:"#00F6FF",var:"pendientes",labelVar: "volumen",minimoValor:100,valorEquilibrio:0 ,maximoValor:-100, abreviacion:"RETRA",tooltipDetail:kpiExpert_PENDIENTES,unidad:"k",calculateExpert:calculateKpiExpert_Pendientes},
    {label:"Pedidos Masivos",color:"#FF00F6",var:"masivos",minimoValor:50,valorEquilibrio:0 ,maximoValor:-50, abreviacion:"MAS",unidad:"%" ,tooltipDetail:kpiExpert_MAS,calculateExpert:calculateKpiExpert_Mas},
    {label:"Déficit Flota",color:"#6CFF00",var:"df",minimoValor:0 ,valorEquilibrio:50,maximoValor:100, abreviacion:"DF",unidad:""},
    {label:"Out of Stock",color:"#08D3FF",var:"oos",minimoValor:10,valorEquilibrio:0 ,maximoValor:-10, abreviacion:"OOS",unidad:"%",tooltipDetail:kpiExpert_OOS,calculateExpert:calculateKpiExpert_OOS},
    {label:"Cump Abasto",color:"#6349FF", var:"abasto",minimoValor:60,valorEquilibrio:100 , maximoValor:140, abreviacion:"ABAS",unidad:"%",tooltipDetail:kpiExpert_ABAS,calculateExpert:calculateKpiExpert_Abasto},
    {label:"Cump Producción",color:"#FFFFFF",var:"produccion",minimoValor:60,valorEquilibrio:100 ,maximoValor:140, abreviacion:"PROD",unidad:"%",tooltipDetail:kpiExpert_PROD,calculateExpert:calculateKpiExpert_Produccion}

];
radar.DrawEntities=function(entities){       

    $("#radarDiv").css("width",(widthInit*radar.escalado)+"%");
    $("#radarDiv").animate({scrollTop: 0}, 1000);

    if(kpiExpert_OOS){
        if(kpiExpert_OOS.DrawTooltipDetail){
            kpiExpert_OOS.eraseChart();
        }
    }

    if(kpiExpert_ABAS){
        if(kpiExpert_ABAS.DrawTooltipDetail){
            kpiExpert_ABAS.eraseChart();
        }
    }

    if(kpiExpert_PROD){
        if(kpiExpert_PROD.DrawTooltipDetail){
            kpiExpert_PROD.eraseChart();
        }
    }

    if(drawKpiExpert_VENTAS){
        if(drawKpiExpert_VENTAS.DrawTooltipDetail){
            drawKpiExpert_VENTAS.eraseChart();
        }
    }


    maxValueFR = 0;

    svgRadar.selectAll(".radarElement").data([]).exit().remove();
    
    radar.lastRadarEntities=[];

    radio=((window.innerWidth*(widthInit/100))*radar.escalado) *.9;

    for(var i=0; i < entities.length; i++){
        if(maxValueFR < entities[i].fillRate.totalSolicitado)
            maxValueFR = entities[i].fillRate.totalSolicitado;
    }

    for(var i=0; i < entities.length; i++){

                //Evita dibujar demasiados radares
                if(i > maximaCantidadRadaresDibujables){                    
                    continue;
                }
                
                svgRadar.attr("height", (radio*(i+1) )+offSetTop+(paddingTop*entities.length) );

                entities[i].radarData={};

                entities[i].radarData.posY=radio*radar.lastRadarEntities.length+offSetTop+(paddingTop*i);

                entities[i].radarData.kpis={};

                radar.DrawBaseRadar(entities[i]);                 

                radar.lastRadarEntities.push(entities[i]);               

    }

}

radar.AddNewRadar=function(entity){ 
    
    svgRadar.attr("height", ( radio*(radar.lastRadarEntities.length+1) )+offSetTop+(paddingTop*(radar.lastRadarEntities.length+1) ) );

    entity.radarData={};

    entity.radarData.posY=radio*radar.lastRadarEntities.length+offSetTop+(paddingTop*(radar.lastRadarEntities.length) );

    entity.radarData.kpis={};

    radar.DrawBaseRadar(entity);                 

    radar.lastRadarEntities.push(entity);

}

radar.DrawBaseRadar=function(entity){

    var tamanioTexto=20;
    var alturaBarra=tamanioTexto*.6;

    svgRadar.append("text")							
                .attr("class","radarElement")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioTexto*radar.escalado)							
                .style("text-anchor","start")
                .attr("transform"," translate("+String(10)+","+String(entity.radarData.posY-(alturaBarra*2.5) )+")  rotate("+(0)+") ")
                .text(function(){
                    
                        var nombre=entity.key;

                        for(var j=0; j < store.niveles.length; j++){    

                            if( store.niveles[j].id == $("#nivel_cb").val() ){

                                if(store.niveles[j].coordinatesSource){

                                    dataCatlog=store[store.niveles[j].coordinatesSource];
                                    
                                    for(var j=0; j < dataCatlog.length; j++){    
                                        
                                        if(dataCatlog[j].ID==nombre){
                                            if(dataCatlog[j].Nombre!=nombre)
                                                nombre=dataCatlog[j].Nombre;
                                        }
                                            
                                    }

                                }else{
                                    nombre="Indicadores Nacionales";
                                }
                            }	
                                                
                        }

                        nombre=nombre.replaceAll("_"," ");
                        nombre=nombre.replaceAll("undefined"," ");

                        if(nombre.length > 30)
                            nombre=nombre.substr(0,30)+"...";

                        return nombre;

                });
    
    if(entity.fillRate){

        if(entity.fillRate.totalVolumenEntregado){

            var anchoBarra=GetValorRangos(  entity.fillRate.totalVolumenEntregado  ,1 ,maxValueFR,1,radio-(radio*.2));

            svgRadar.append("rect")		    		
                        .attr("width",anchoBarra )
                        .attr("class","radarElement")
                        .attr("x",radio*.25  )
                        .attr("y", entity.radarData.posY-(tamanioTexto*.7)-((tamanioTexto*radar.escalado)*.4)   )
                        .style("height",(tamanioTexto*radar.escalado)*.3 )
                        .attr("fill","#ffffff")
                        ;

            svgRadar.append("text")							
                        .attr("class","radarElement")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size", (tamanioTexto*radar.escalado)*.6 )							
                        .style("text-anchor","start")
                        .attr("transform"," translate("+String(10)+","+String(entity.radarData.posY-(tamanioTexto*.7) )+")  rotate("+(0)+") ")
                        .text(function(){

                            if(entity.fillRate.totalVolumenEntregado < 1000)
                                return "Entregado "+formatNumber(entity.fillRate.totalVolumenEntregado);

                            return "Entregado "+formatNumber(entity.fillRate.totalVolumenEntregado/1000)+" k";

                        });               

        }
    }

    var rebanadasAngulos=360/radar.config.length;

    var lineFunction = d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .interpolate("linear-closed");

    var puntosLinea=[];

    for(var j=0; j < radar.config.length; j++){

        var posicion1 = CreaCoordenada( rebanadasAngulos*j  ,  radio*.5  , {x:radio/2 , y:entity.radarData.posY+(radio/2) }  );	
        puntosLinea.push({x:posicion1.x,y:posicion1.y});

    }               
            
    entity.radarData.svgBack = svgRadar	
            .append("path")
            .attr("d", lineFunction(puntosLinea))		                
            .style("stroke", "#FFFFFF")
            .attr("class","radarElement")
            .style("pointer-events", "none")
            .style("stroke-width", 1)
            .style("stroke-opacity", .2)	                               
            .attr("fill", "#9A9C9C")
            .style("opacity", 1);

    entity.radarData.svgBack.transition().delay(0).duration(getRandomInt(0,2000))
                .attr("fill", "black")	
            ;

    var puntosLinea=[];

    for(var j=0; j < radar.config.length; j++){

        var posicion1 = CreaCoordenada( rebanadasAngulos*j  ,  radio*.4 , {x:radio/2 , y:entity.radarData.posY+(radio/2) }  );		
        puntosLinea.push({x:posicion1.x,y:posicion1.y});

    }
                    
    svgRadar	
        .append("path")
        .attr("d", lineFunction(puntosLinea))		                
        .style("stroke", "#FFFFFF")
        .attr("class","radarElement")
        .style("pointer-events", "none")
        .style("stroke-width", 1)
        .style("stroke-opacity", .4)	                               
        .attr("fill", "black")
        .style("opacity", .4)
        ; 
        
    for(var j=0; j < radar.config.length; j++){    

            var posicion1 = CreaCoordenada( rebanadasAngulos*j  ,  0 , {x:radio/2 , y:entity.radarData.posY+(radio/2) }  );
            var posicion2 = CreaCoordenada( rebanadasAngulos*j  , (radio/2)*.97  , {x:radio/2 , y:entity.radarData.posY+(radio/2) }  );
        
            entity.radarData.kpis[radar.config[j].var]={angulo:rebanadasAngulos*j};
    
            svgRadar
                    .append("line")
                    .style("stroke",radar.config[j].color )
                    .attr("class","radarElement")
                    .style("stroke-width", 1 )
                    .style("stroke-opacity", .3 )
                    .attr("x1",posicion1.x)
                    .attr("y1",posicion1.y)
                    .attr("x2",posicion2.x)
                    .attr("y2",posicion2.y)
                    ;

            // ETIQUETA        
            var anchor="middle";
            var xOffset=0;
            var yOffset=0;

            if(rebanadasAngulos*j  > 0 && rebanadasAngulos*j < 91){
                yOffset=-5;
            }if(rebanadasAngulos*j  > 260 ){
                yOffset=-5;
            }else if(rebanadasAngulos*j  > 91 ){
                yOffset=5;
            }

            
            if(rebanadasAngulos*j  > 260 && rebanadasAngulos*j < 359){
                anchor="start";
            }

            var posLabel = CreaCoordenada( rebanadasAngulos*j  , radio/2  , {x:radio/2 , y:entity.radarData.posY+(radio/2) }  );

            svgRadar
                .append("text")						
                .attr("class","radarElement")
                .style("fill",radar.config[j].color)		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",15*radar.escalado)									
                .style("text-anchor",anchor)
                .attr("transform"," translate("+String((posLabel.x+xOffset) )+","+String((posLabel.y)+yOffset )+")  rotate("+(0)+") ")
                .text(function(){
                
                    return radar.config[j].abreviacion;

                });

    } 

    //for(var j=0; j < radar.config.length; j++){
        radar.DrawEntityValues( entity );
    //}                

}

radar.DrawEntityValues=function(entity){

    var puntosLinea=[];

    var lineFunction = d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .interpolate("linear-closed");
    
    for(var i=0; i < radar.config.length; i++){
           
            if( entity[radar.config[i].var] ){  
                
                if( entity[radar.config[i].var][radar.config[i].var] ){ 
              
                       // var posicionMarcador=GetValorRangos( entity[radar.config[i].var][radar.config[i].var] , radar.config[i].minimoValor , radar.config[i].maximoValor , 0+(radio*.16) , (radio/2)*.99 );

                        var escalaPosicion=d3.scale.linear().domain([radar.config[i].minimoValor , radar.config[i].valorEquilibrio , radar.config[i].maximoValor]).range([0+(radio*.16), radio*.4 ,(radio/2)*.99]);

                        var posicionMarcador = escalaPosicion(entity[radar.config[i].var][radar.config[i].var]);

                        if(posicionMarcador < 0){ // Si se sale de radar mantiene en margenes
                            posicionMarcador = 0;
                        }

                        if(posicionMarcador > (radio/2)*.97){ // Si se sale de radar mantiene en margenes
                            posicionMarcador = (radio/2)*.97;
                        }

                        var centroMarcador = CreaCoordenada( entity.radarData.kpis[radar.config[i].var].angulo  , posicionMarcador  , {x:radio/2 , y:entity.radarData.posY+(radio/2) }  );

                        puntosLinea.push({x:centroMarcador.x,y:centroMarcador.y});
                
                        svgRadar				
                                .append("circle")
                                .attr("class","radarElement")
                                .attr("fill",function(d){                            
                                    
                                    this.data=entity;
                                    this.color_=radar.config[i].color;  
                                    this.tootipDetail= radar.config[i].tooltipDetail;    
                                    this.calculateExpert=radar.config[i].calculateExpert;                
                                    return radar.config[i].color;
                                
                                })
                                .attr("cx",centroMarcador.x)
                                .attr("cy",centroMarcador.y)                   
                                .attr("r",radioInicialInidcador)
                                .style("stroke","none")
                                .style("pointer-events","auto")
                                .on("mouseover",function(d){

                                    radar.CleanWindows();

                                    d3.select(this).attr("fill","white");
                                    d3.select(this).attr("r",radioInicialInidcador*2);  
                                    
                                    $("#toolTip").css("visibility","visible");

                                    $("#toolTip").css("left",mouse_x+50);

                                    var dataCatlog="";
                                    var nombre = this.data.key;                                    
                                    
                                    for(var i=0; i < store.niveles.length; i++){    

                                        if( store.niveles[i].id == $("#nivel_cb").val() ){

                                            dataCatlog=store[store.niveles[i].coordinatesSource]; 

                                            if(dataCatlog){
                                            
                                                for(var j=0; j < dataCatlog.length; j++){    
                                                
                                                    if(dataCatlog[j].ID==this.data.key){
                                                        if(dataCatlog[j].Nombre!=nombre)
                                                            nombre+=" "+dataCatlog[j].Nombre;
                                                    }
                                                        
                                                }

                                            }
                                        }						
                                    }

                                    nombre=nombre.replaceAll("_"," ");
                                    nombre=nombre.replaceAll("undefined"," ");

                                    var text=`
                                                <span style='color:#00C6FF;font-size:15px;'><span style='color:#00C6FF'>${nombre}<br>
                                            `
                                            if(calculateKpiExpert_Ventas.getTooltipDetail){
                                                if(calculateKpiExpert_Ventas.getTooltipDetail(this.data.key)!=undefined)
                                                text+=calculateKpiExpert_Ventas.getTooltipDetail(this.data.key);
                                            }
        
                                            if(calculateKpiExpert_FR.getTooltipDetail){
                                                text+=calculateKpiExpert_FR.getTooltipDetail(this.data.key,store.mainDataset);
                                            }
        
                                          if(calculateKpiExpert_Pendientes.getTooltipDetail){
                                                if(calculateKpiExpert_Pendientes.getTooltipDetail(this.data.key)!=undefined)
                                                text+=calculateKpiExpert_Pendientes.getTooltipDetail(this.data.key);
                                            }
        
                                            if(calculateKpiExpert_Mas.getTooltipDetail){
                                                if(calculateKpiExpert_Mas.getTooltipDetail(this.data.key)!=undefined)
                                                text+=calculateKpiExpert_Mas.getTooltipDetail(this.data.key);
                                            }
        
                                            if(calculateKpiExpert_OOS.getTooltipDetail){
                                                if(calculateKpiExpert_OOS.getTooltipDetail(this.data.key)!=undefined)
                                                text+=calculateKpiExpert_OOS.getTooltipDetail(this.data.key);
                                            }
        
                                            if(calculateKpiExpert_Abasto.getTooltipDetail){
                                                if(calculateKpiExpert_Abasto.getTooltipDetail(this.data.key)!=undefined)
                                                text+=calculateKpiExpert_Abasto.getTooltipDetail(this.data.key);
                                            }
        
                                            if(calculateKpiExpert_Produccion.getTooltipDetail){
                                                if(calculateKpiExpert_Produccion.getTooltipDetail(this.data.key)!=undefined)
                                                text+=calculateKpiExpert_Produccion.getTooltipDetail(this.data.key);
                                            }
        
                                                                       
                

                                    $("#toolTip").html(text );                            
                                    
                                    var posY=mouse_y-50;
                                    if( $("#toolTip").height()+mouse_y > windowHeight ){
                                        posY=windowHeight-$("#toolTip").height()-50;
                                    }
                                    $("#toolTip").css("top",posY);

                                    Stage.FocusMapElement(this.data.key);

                                })
                                .on("mouseout",function(d){

                                    d3.select(this).attr("fill",this.color_);
                                    d3.select(this).attr("r",radioInicialInidcador);  
                                    $("#toolTip").css("visibility","hidden");		    	


                                })
                                .on("click",function(d){

                                    if(this.tootipDetail){

                                        this.tootipDetail.DrawTooltipDetail(this.data);    	

                                        if(backInfoNav){

                                            backInfoNav.entity=this.data.key;

                                            for(var j=0; j < store.niveles.length; j++){
                       
                                                    if( String(store.niveles[j].id) ==  String($("#nivel_cb").val()) ){
                            
                                                        if(store.niveles[j].coordinatesSource){

                                                            backInfoNav.catlog= store.niveles[j].coordinatesSource;            
                            
                                                        }
                            
                                                    }
                                                }
                                            }
                                           
                                    }                                      

                                })
                                .on("dblclick",function(d){

                                    if(this.calculateExpert){
                                        this.calculateExpert.downloadCSV(this.data.key);	
                                    }                               	    	

                                })
                                ;

                        var anchor="start";
                        var xOffset=10;
                        var yOffset=0;
                
                        if(entity.radarData.kpis[radar.config[i].var].angulo   > 0 && entity.radarData.kpis[radar.config[i].var].angulo  < 91){
                            //yOffset=-5;
                        }if(entity.radarData.kpis[radar.config[i].var].angulo   > 260 ){
                            //yOffset=-5;
                        }else if(entity.radarData.kpis[radar.config[i].var].angulo   > 91 ){
                            //yOffset=5;
                        }
                
                        
                        if(entity.radarData.kpis[radar.config[i].var].angulo  > 1 && entity.radarData.kpis[radar.config[i].var].angulo < 170){
                            anchor="end";
                            xOffset=xOffset*-1;
                        }else{

                        }

                        svgRadar
                                .append("text")						
                                .attr("class","radarElement")
                                .style("fill",radar.config[i].color)		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",15*radar.escalado)		
                                .style("pointer-events","none")						
                                .style("text-anchor",anchor)
                                .attr("filter","url(#dropshadowText)")
                                .attr("transform"," translate("+String((centroMarcador.x+xOffset) )+","+String( centroMarcador.y  )+")  rotate("+(0)+") ")
                                .text(function(){
                                    
                                    var label = entity[radar.config[i].var][radar.config[i].var];

                                    if(radar.config[i].labelVar)
                                        label = entity[radar.config[i].var][radar.config[i].labelVar];                                    
                                    
                                    if(radar.config[i].unidad=="k"){

                                        label = String( ( Math.round(Number(label)/10)/100 ) )+"k";
                                        
                                    }                                    

                                    return label;

                                });
                }else{ // Para dibujar circulo aun cuando no se tiene datos

                    var escalaPosicion=d3.scale.linear().domain([radar.config[i].minimoValor , radar.config[i].valorEquilibrio , radar.config[i].maximoValor]).range([0+(radio*.16), radio*.4 ,(radio/2)*.99]);

                    var posicionMarcador = escalaPosicion(radar.config[i].valorEquilibrio);

                    var centroMarcador = CreaCoordenada( entity.radarData.kpis[radar.config[i].var].angulo  , posicionMarcador  , {x:radio/2 , y:entity.radarData.posY+(radio/2) }  );					
                    puntosLinea.push({x:centroMarcador.x,y:centroMarcador.y});
    
                    svgRadar				
                            .append("circle")
                            .attr("class","radarElement")
                            .attr("fill","#777777")
                            .attr("cx",centroMarcador.x)
                            .attr("cy",centroMarcador.y)                   
                            .attr("r",radioInicialInidcador*.5)
                            .style("stroke","none")
                            .style("pointer-events","auto")
                            
                            ;
    
                }

                
            }else{ // Para dibujar circulo aun cuando no se tiene datos

                var escalaPosicion=d3.scale.linear().domain([radar.config[i].minimoValor , radar.config[i].valorEquilibrio , radar.config[i].maximoValor]).range([0+(radio*.16), radio*.4 ,(radio/2)*.99]);

                var posicionMarcador = escalaPosicion(radar.config[i].valorEquilibrio);

                var centroMarcador = CreaCoordenada( entity.radarData.kpis[radar.config[i].var].angulo  , posicionMarcador  , {x:radio/2 , y:entity.radarData.posY+(radio/2) }  );	

                puntosLinea.push({x:centroMarcador.x,y:centroMarcador.y});

				svgRadar				
						.append("circle")
						.attr("class","radarElement")
						.attr("fill","#777777")
						.attr("cx",centroMarcador.x)
						.attr("cy",centroMarcador.y)                   
						.attr("r",radioInicialInidcador*.5)
                        .style("stroke","none")
                        .style("pointer-events","auto")
                        
						;

            }


    }

    svgRadar	
    	.append("path")
        .attr("d", lineFunction(puntosLinea))	
        .attr("class","radarElement")	                
        .style("stroke", "#FFFFFF")
        .style("pointer-events", "none")
        .style("stroke-width", 3)
        .style("stroke-opacity", 1)	                               
        .attr("fill", "black")
        .style("opacity", .1)
        ;

}