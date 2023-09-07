
var radarMosaic={};
radarMosaic.radarRadius=150;
radarMosaic.topOffset=150;
radarMosaic.visible=false;

radarMosaic.toogle=function(){

    if(radarMosaic.visible){
        radarMosaic.EraseMosaic();
    }else{
        radarMosaic.DrawRadars();
    }

} 

radarMosaic.EraseMosaic=function(){ 

    svgLines.selectAll(".mosaicElement").data([]).exit().remove();
    
    svgLines.selectAll(".labelMosaic").data([]).exit().remove();

    $("#radarDiv").css("visibility","visible");

    radarMosaic.visible=false;

}

radarMosaic.DrawRadars=function(){   
   
    radar.CleanWindows();

    radarMosaic.EraseMosaic();

    $("#radarDiv").css("visibility","hidden");

    radarMosaic.visible=true;

    $('#Controls').css('visibility','hidden');

    svgLines.append("rect")		    		
                        .attr("width",windowWidth )
                        .attr("class","mosaicElement")
                        .attr("height",windowHeight)
                        .attr("x", 0  )
                        .attr("y", radarMosaic.topOffset-60  )	
                        .style("opacity", 0.8  )						
                        .attr("fill","black")
                        ;

    radarMosaic.columns=Math.floor(windowWidth/radarMosaic.radarRadius);
    var rebanadasAngulos=360/radar.config.length;

    maxValueFR = 0;

    for(var i=0; i < entities.length; i++){

        if(maxValueFR < entities[i].fillRate.totalSolicitado)
            maxValueFR = entities[i].fillRate.totalSolicitado;

    }

    var lineFunction = d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .interpolate("linear-closed");

    
    for(var i=0; i < entities.length; i++){

                var posX=i%radarMosaic.columns*radarMosaic.radarRadius;
                var posY=Math.floor(i/radarMosaic.columns)*radarMosaic.radarRadius+radarMosaic.topOffset;

                if(posY > windowHeight+radarMosaic.radarRadius)
                    break;

                var radio= GetValorRangos(entities[i].fillRate.totalSolicitado ,1, maxValueFR,50,radarMosaic.radarRadius*1.2)   ;

                var puntosLinea=[];

                for(var j=0; j < radar.config.length; j++){
            
                    var posicion1 = CreaCoordenada( rebanadasAngulos*j  ,  radio*.5  , {x: posX+( radio/2 ) , y:posY+(radio/2) }  );	
                    puntosLinea.push({x:posicion1.x,y:posicion1.y});
            
                } 

                svgLines	
                        .append("path")
                        .attr("d", lineFunction(puntosLinea))		                
                        .style("stroke", function(){
                            this.data= entities[i];
                            return "#FFFFFF";
                        })
                        .attr("filter","url(#dropshadowRadar)")
                        .attr("class","mosaicElement")
                        .style("pointer-events", "auto")
                        .style("stroke-width", 1)
                        .style("stroke-opacity", .2)	                               
                        .attr("fill", "black")
                        .style("opacity", 1)
                        .on("mouseover",function(){

                                    d3.select(this).attr("fill","#5D5D5D");
                                    d3.select(this).transition().delay(0).duration(1000)
                                    .attr("fill", "black");

                                    $("#toolTip").css("visibility","visible");

                                    svgLines.selectAll(".labelMosaic").style("visibility", "hidden");

                                    $("#toolTip").css("left",mouse_x+50);

                                    $("#toolTip").html(dataManager.getTooltipText(this.data) );                            
                                    
                                    var posY=mouse_y-50;
                                    if( $("#toolTip").height()+mouse_y > windowHeight ){
                                        posY=windowHeight-$("#toolTip").height()-50;
                                    }
                                    $("#toolTip").css("top",posY);

                                    if(this.data.radarData.mosaic){
                                        if(this.data.radarData.mosaic.labels){
                                            for(var j=0; j < this.data.radarData.mosaic.labels.length; j++){
                                                
                                                this.data.radarData.mosaic.labels[j].style("visibility", "visible");

                                            }
                                        }
                                    }

                        
                        })
                        .on("mouseout",function(){
                            

                        
                        })
                        .on("click",function(){
                            radarMosaic.EraseMosaic();
                            radar.CleanWindows();
                            Stage.FocusMapElement(this.data.key);
                        });

                var puntosLinea=[];

                for(var j=0; j < radar.config.length; j++){
            
                    var posicion1 = CreaCoordenada( rebanadasAngulos*j  ,  radio*.4 , {x: posX+( radio/2 ) , y:posY+(radio/2) }  );		
                    puntosLinea.push({x:posicion1.x,y:posicion1.y});
            
                }
                       
                svgLines	
                        .append("path")
                        .attr("d", lineFunction(puntosLinea))		                
                        .style("stroke", "#FFFFFF")
                        .attr("filter","url(#dropshadowRadar)")
                        .attr("class","mosaicElement")
                        .style("pointer-events", "none")
                        .style("stroke-width", 1)
                        .style("stroke-opacity", .4)	                               
                        .attr("fill", "black")
                        .style("opacity", .4)
                        ;


                var puntosLinea=[];

                var lineFunction = d3.svg.line()
                                .x(function(d) { return d.x; })
                                .y(function(d) { return d.y; })
                                .interpolate("linear-closed");


                var puntosLinea=[];

                entities[i].radarData.mosaic={labels:[]};

                for(var j=0; j < radar.config.length; j++){

                    
                    if( entities[i][radar.config[j].var]!= null && entities[i][radar.config[j].var]!= undefined ){ 

                        if( entities[i][radar.config[j].var][radar.config[j].var]!= null && entities[i][radar.config[j].var][radar.config[j].var]!= undefined ){               

                                var escalaPosicion=d3.scale.linear().domain([radar.config[j].minimoValor , radar.config[j].valorEquilibrio , radar.config[j].maximoValor]).range([(radio*.1) , radio*.4 ,(radio/2)*.99]);

                                var posicionMarcador = escalaPosicion(entities[i][radar.config[j].var][radar.config[j].var]);
        
                                if(posicionMarcador < radio*.08 )
                                posicionMarcador=radio*.08;      
                            
        
                                if(posicionMarcador > (radio/2)*.97){ // Si se sale de radar mantiene en margenes
                                    posicionMarcador = (radio/2)*.97;
                                }
        
                                var centroMarcador = CreaCoordenada( entities[i].radarData.kpis[radar.config[j].var].angulo  , posicionMarcador  , {x:posX+(radio/2) , y:posY+(radio/2) }  );
        
                                puntosLinea.push({x:centroMarcador.x,y:centroMarcador.y});


                        }else{

                                var escalaPosicion=d3.scale.linear().domain([radar.config[j].minimoValor , radar.config[j].valorEquilibrio , radar.config[j].maximoValor]).range([0+(radio*.1), radio*.4 ,(radio/2)*.99]);

                                var posicionMarcador = escalaPosicion(radar.config[j].valorEquilibrio);
        
                                if(posicionMarcador < radio*.08 )
                                    posicionMarcador=radio*.08;
        
                                var centroMarcador = CreaCoordenada( entities[j].radarData.kpis[radar.config[j].var].angulo  , posicionMarcador  , {x:posX+(radio/2) , y:posY+(radio/2) }  );					
                
                                puntosLinea.push({x:centroMarcador.x,y:centroMarcador.y});

                        }

                    }else{





                    }

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

                    var posLabel = CreaCoordenada( entities[i].radarData.kpis[radar.config[j].var].angulo  , (radio/2)+30  , {x:posX+( radio/2 )  , y:posY+(radio/2) }  );


                    entities[i].radarData.mosaic.labels.push(
                                svgLines						
                                    .append("text")						
                                    .attr("class","radarElement labelMosaic")
                                    .style("fill",radar.config[j].color)		
                                    .style("font-family","Cabin")
                                    .style("font-weight","bold")
                                    .style("font-size",12)									
                                    .style("text-anchor",anchor) 
                                    .style("visibility","hidden")                                   
                                    .attr("transform"," translate("+String((posLabel.x+xOffset) )+","+String((posLabel.y)+yOffset )+")  rotate("+(0)+") ")
                                    .text(function(){
                                    
                                        return radar.config[j].abreviacion;

                                    })
                        );

                }

                svgLines	
                        .append("path")
                        .attr("d", lineFunction(puntosLinea))	
                        .attr("class","mosaicElement")	                
                        .style("stroke", "#FFFFFF")
                        .style("pointer-events", "none")
                        .attr("filter","url(#glow)")
                        .style("stroke-width", 2)                                       
                        .attr("fill", "black")
                        .style("opacity", 1)        	
                        ;


                for(var j=0; j < radar.config.length; j++){    

                    var posicion1 = CreaCoordenada( rebanadasAngulos*j  ,  0 , {x:posX+( radio/2 ) , y:posY+(radio/2) }  );
                    var posicion2 = CreaCoordenada( rebanadasAngulos*j  , (radio/2)*.97  , {x:posX+( radio/2 ) , y:posY+(radio/2) }  );
                
                    svgLines
                            .append("line")
                            .style("stroke","#cccccc" )
                            .attr("class","mosaicElement")
                            .style("stroke-width", 1 )
                            .style("stroke-opacity", .2 )
                            .attr("x1",posicion1.x)
                            .attr("y1",posicion1.y)
                            .attr("x2",posicion2.x)
                            .attr("y2",posicion2.y)
                            ;        
            
                }


    }

}