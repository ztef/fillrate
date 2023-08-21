var kpiExpert_OOS_Filiales={};

kpiExpert_OOS_Filiales.DrawElement=function(entity,i){      
      
    var altura1=GetValorRangos(entity.oosFiliales.oosFiliales,1 ,20 ,1 ,entity.altura );

    if(altura1 < 0)
        altura1=1;

    if(altura1 == NaN || String(altura1) == "NaN" )
        return;

    if(altura1>entity.altura)
        altura1=entity.altura;
    
    var color="#cccccc";
    if(entity.oosFiliales.oosFiliales <= 8){
        color="#28F100";
    }else if(entity.oosFiliales.oosFiliales <= 10){
        color="#FFF60C";
    }else if(entity.oosFiliales.oosFiliales > 10){
        color="#FF0000";
    }

    var geometry1= viewer.entities.add({
            name : '',
            position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura1/2)  ),
            cylinder : {
                length : altura1,
                topRadius : entity.radio*.9,
                bottomRadius : entity.radio*.9,
                material : Cesium.Color.fromCssColorString(color).withAlpha(1)              
                
            }
    });

    mapElementsArr.push(geometry1);						

    //VASO EXTERIOR
    var geometryExt= viewer.entities.add({
        name : '',
        position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (entity.altura/2)  ),
        cylinder : {
                length : entity.altura+(entity.altura*.04),
                topRadius : entity.radio,
                bottomRadius : entity.radio,
                material : Cesium.Color.fromCssColorString("#ffffff").withAlpha(.2)              
                
        }
    });

    entity.geometries=[geometry1,geometryExt];
    mapElementsArr.push(geometryExt);
    mapElements[geometryExt.id]=entity; 
    
    if(i < 100){

            entity.labelSVG=svgLines.append("text")                            
                    .attr("x",0 )
                    .attr("y", 0   )
                    .style("fill","#FFFFFF")
                    .attr("filter","url(#dropshadowText)")
                    .attr("class","entityLabel")                                    
                    .style("font-family","Cabin")
                    .style("text-anchor","middle")
                    .style("font-weight","normal")
                    .style("font-size",12)                                
                    .text( function(d){
                        
                    return entity.oosFiliales.oosFiliales+"%";
                    
                    });

    }

    if(Stage.labelsInterval)        
            clearInterval(Stage.labelsInterval);
   
    Stage.labelsInterval = setInterval(function(){ Stage.DrawFRLabels(); }, 50);

}


kpiExpert_OOS_Filiales.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".ossFilialesDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ossFilialesDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");	
    $("#toolTip3").css("visibility","hidden");

}

kpiExpert_OOS_Filiales.DrawTooltipDetail=function(entity){    
 
    d3.select("#svgTooltip").selectAll(".ossFilialesDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ossFilialesDetail").data([]).exit().remove();
    
    kpiExpert_OOS.DrawTooltipDetail_UN(entity);
    kpiExpert_OOS.DrawTooltipDetail_Dia(entity);

}

kpiExpert_OOS_Filiales.DrawTooltipDetail_UN=function(entity){    

    d3.select("#svgTooltip").selectAll(".ossFilialesDetail").data([]).exit().remove();

    var maximo=0;
    var maximoVolumen=0;   

    for(var i=0; i < entity.oos.values.length; i++ ){

        entity.oos.values[i].grupo=entity.oos.values[i].DescrProducto+"_"+entity.oos.values[i].Destino;       

    }

    var arr=d3.nest()
            .key(function(d) { return d.Destino; })
            .entries(entity.oos.values);            
    
    for(var i=0; i < arr.length; i++ ){

        arr[i].Numerador=0;
        arr[i].Denominador=0;
        arr[i].CantEntFinal=0;

        for(var j=0; j < arr[i].values.length; j++ ){
            
            arr[i].Numerador+=Number(arr[i].values[j].Numerador);
            arr[i].Denominador+=Number(arr[i].values[j].Denominador);
            arr[i].CantEntFinal+=Number(arr[i].values[j].CantEntFinal);            

            if(maximoVolumen < arr[i].CantEntFinal){
                maximoVolumen=arr[i].CantEntFinal;
            }

        }

    }

    for(var i=0; i < arr.length; i++ ){
        arr[i].OOS=Math.round(  (arr[i].Numerador/arr[i].Denominador)*10000)/100;
        if(maximo < arr[i].OOS*1000){
            maximo=arr[i].OOS*1000;
        }
    }

    arr = arr.sort((a, b) => b.OOS*1000 - a.OOS*1000);

    var altura=30;
    var caso=0;
   
    var svgTooltipHeight=(arr.length*altura)+50;
    var svgTooltipWidth=600;
    var marginLeft=svgTooltipWidth*.3;
    var tamanioFuente=altura*.5;
    if(tamanioFuente < 12)
    tamanioFuente=12;

    var marginTop=30;


    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("left",(300)+"px");   
  

    var toolText =  
                "<span style='color:#fff600'><span style='color:#ffffff'>OOS por U.N. y Producto de "+entity.key+"</span></span> <br>"+               
                "<svg id='svgTooltip'  style='pointer-events:none;'></svg> ";

    $("#toolTip2").html(toolText);

    d3.select("#toolTip2")                                     
                .style("width", (svgTooltipWidth)+"px" );

    vix_tt_formatToolTip("#toolTip2","OOS por U.N. y Producto de "+entity.key,svgTooltipWidth);

    $("#toolTip2").css("top",(300)+"px");

    var svgElement = "<svg id='svgTooltip' style='pointer-events:none;'></svg>";
    d3.select("#toolTip2").append("div").html(svgElement);

    d3.select("#svgTooltip")                     
        .style("width", svgTooltipWidth )
        .style("height", (svgTooltipHeight)+50 )
                    ;



    d3.select("#svgTooltip")
            .append("text")						
            .attr("class","ossFilialesDetail")
            .style("fill","#8EBBFF")		
            .style("font-family","Cabin")
            .style("font-weight","bold")
            .style("font-size",tamanioFuente)						
            .style("text-anchor","start")
            .style("opacity",1 )
            .attr("transform"," translate("+String( svgTooltipWidth*.3  )+","+String( altura*caso+(tamanioFuente)   )+")  rotate("+(0)+") ")
            .text("Cant Ent Final (k)")
            .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip")
            .append("text")						
            .attr("class","ossFilialesDetail")
            .style("fill","#8EBBFF")		
            .style("font-family","Cabin")
            .style("font-weight","bold")
            .style("font-size",tamanioFuente)						
            .style("text-anchor","start")
            .style("opacity",1 )
            .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( altura*caso+(tamanioFuente)   )+")  rotate("+(0)+") ")
            .text("OOS (%)")
            .transition().delay(0).duration(i*50);
    
    d3.select("#svgTooltip")
            .append("text")						
            .attr("class","ossFilialesDetail")
            .style("fill","#8EBBFF")		
            .style("font-family","Cabin")
            .style("font-weight","bold")
            .style("font-size",tamanioFuente)						
            .style("text-anchor","start")
            .style("opacity",1 )
            .attr("transform"," translate("+String( svgTooltipWidth*.8  )+","+String( altura*caso+(tamanioFuente)   )+")  rotate("+(0)+") ")
            .text("Numerador")
            .transition().delay(0).duration(i*50);

    for(var i=0; i < arr.length; i++ ){
    
        var ancho=GetValorRangos(arr[i].CantEntFinal,1, maximoVolumen ,1,svgTooltipWidth*.15 );

        d3.select("#svgTooltip").append("rect")		    		
                .attr("width",1 )
                .attr("class","ossFilialesDetail")
                .attr("x",marginLeft   )
                .attr("y", (altura*caso)+marginTop )
                .attr("height",altura*.5)
                .attr("fill","#ffffff")
                .transition().delay(0).duration(1000)
                .attr("width",ancho )	
                ;

        d3.select("#svgTooltip")
                .append("text")						
                .attr("class","ossFilialesDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente*.8)						
                .style("text-anchor","start")
                .style("opacity",0 )
                .attr("transform"," translate("+String( ancho+(marginLeft)+10  )+","+String( altura*caso+(tamanioFuente)+marginTop -(tamanioFuente*.3)  )+")  rotate("+(0)+") ")
                .text(function(){

                    return formatNumber(Math.round(arr[i].CantEntFinal/1000));

                    })
                    .transition().delay(0).duration(1000)
					.style("opacity",1 )
                  ;
        
        // BARRA 2

        var anchoVol=GetValorRangos(  arr[i].OOS*1000,1, maximo ,1,svgTooltipWidth*.13 );

        d3.select("#svgTooltip").append("rect")		    		
                    .attr("width",1 )
                    .attr("class","ossFilialesDetail")
                    .attr("x",(svgTooltipWidth*.55)   )
                    .attr("y", (altura*caso)+marginTop )
                    .attr("height",altura*.5)
                    .attr("fill","#FFFE97")
                    .transition().delay(0).duration(1000)
                    .attr("width",anchoVol)	
                    ;

        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","ossFilialesDetail")
                    .style("fill","#FFFE97")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente*.8)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( (svgTooltipWidth*.55)+anchoVol+10  )+","+String( altura*caso+(tamanioFuente)+marginTop -(tamanioFuente*.3)  )+")  rotate("+(0)+") ")
                    .text(function(){
    
                            return  arr[i].OOS+"%";
    
                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 )
                      ;       
       

                    
        d3.select("#svgTooltip")
                  .append("text")						
                  .attr("class","ossFilialesDetail")
                  .style("fill","#ffffff")		
                  .style("font-family","Cabin")
                  .style("font-weight","bold")
                  .style("font-size",tamanioFuente)						
                  .style("text-anchor","start")
                  .style("opacity",0 )
                  .attr("transform"," translate("+String( svgTooltipWidth*.84  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                  .text(function(){
                  
                      return arr[i].Numerador;

                  })
                  .transition().delay(0).duration(i*50)
                  .style("opacity",1 )
                ;

        d3.select("#svgTooltip")
                  .append("text")						
                  .attr("class","ossFilialesDetail")
                  .style("fill","#ffffff")		
                  .style("font-family","Cabin")
                  .style("font-weight","bold")
                  .style("font-size",tamanioFuente)	
                  .style("text-anchor","start")
                  .style("pointer-events","auto")
                  .attr("transform"," translate("+String( 5  )+","+String( altura*caso+(tamanioFuente )+marginTop   )+")  rotate("+(0)+") ")
                  .text(function(){

                        this.name=arr[i].key;
                        return  arr[i].key;

                    })
                    .on("mouseover",function(){
                            d3.select(this).style("fill","#F0FF00");
                        
                    })
                    .on("mouseout",function(){
                            d3.select(this).style("fill","#FFFFFF");
                            
                    })
                    .on("click",function(){
                            
                        kpiExpert_OOS.eraseChart();

                        if(filterControls){
                                filterControls.lookForEntity(this.name);
                        }
                            
                    });

                    caso++;
        
    }    

}

kpiExpert_OOS_Filiales.DrawTooltipDetail_Dia=function(entity){ 

    var maximo=0;
    var maximo2=0;

    var arr=d3.nest()
            .key(function(d) { 

                    if(d.fecha){
                            return d.fecha.getTime(); 
                    }else{                       
                            return 0;
                    }                        
    
            })
            .entries(entity.oos.values);

            for(var i=0; i < arr.length; i++ ){

                arr[i].Numerador=0;
                arr[i].Denominador=0;
                arr[i].Fisico=0;
                arr[i].fecha=arr[i].values[0].fecha.getTime();
        
                for(var j=0; j < arr[i].values.length; j++ ){
        
                    arr[i].Numerador+=Number(arr[i].values[j].Numerador);
                    arr[i].Denominador+=Number(arr[i].values[j].Denominador);
                    arr[i].Fisico+=Number(arr[i].values[j].Fisico);

                }

                if(maximo2 < arr[i].Fisico)
                    maximo2 = arr[i].Fisico;
        
            }

            for(var i=0; i < arr.length; i++ ){
                arr[i].OOS=Math.round(  (arr[i].Numerador/arr[i].Denominador)*10000)/100;
                
                if(maximo < arr[i].OOS*1000){
                    maximo=arr[i].OOS*1000;
                }
            }           

            arr = arr.sort((a, b) => {                
                return b.fecha - a.fecha;                                    
        
            }); 
        
            arr=arr.reverse();
        
            var ancho=20;

            
            var svgTooltipWidth=arr.length*ancho;

            if(svgTooltipWidth < 80)
            svgTooltipWidth=80;

            var svgTooltipHeight=500;
            var tamanioFuente=ancho*.8;   
        
            $("#toolTip3").css("visibility","visible");            
            $("#toolTip3").css("right",(svgTooltipWidth+30)+"px");        
        
            $("#toolTip3").css("top","300px");
        
            var marginBottom=svgTooltipHeight*.04;

            // FORMATEA TOOL TIP :
            
            vix_tt_formatToolTip("#toolTip3","OOS por Día de "+entity.key,svgTooltipWidth);
        
            // Agrega un div con un elemento svg :
        
            var svgElement = "<svg id='svgTooltip3' style='pointer-events:none;'></svg>";
            d3.select("#toolTip3").append("div").html(svgElement);
        
            d3.select("#svgTooltip3")                     
                .style("width", svgTooltipWidth )
                .style("height", (svgTooltipHeight)+50 )
                            ;

            for(var i=0; i < arr.length; i++ ){   

               
                var altura1=GetValorRangos( arr[i].OOS*1000,1, maximo ,1,svgTooltipHeight*.3);
                var altura2=GetValorRangos( arr[i].Fisico ,1, maximo2 ,1,svgTooltipHeight*.3);
                
                
                var color="#1ADD00";

                if(arr[i].OOS > 8){
                    color="#ff0000";
                }else if(arr[i].OOS > 5.9){
                    color="#FCFF11";
                }

                d3.select("#svgTooltip3").append("rect")		    		
                                .attr("width",ancho*.8 )
                                .attr("class","ossFilialesDetail")
                                .attr("x",(ancho*i)  )
                                .attr("y", (svgTooltipHeight)-altura1-marginBottom  )
                                .attr("height",altura1)
                                .attr("fill",color)
                                .style("pointer-events","auto")
                                ;
                               	
        
                d3.select("#svgTooltip3").append("rect")		    		
                                .attr("width",ancho*.8 )
                                .attr("class","ossFilialesDetail")
                                .attr("x",(ancho*i)  )
                                .attr("y", (svgTooltipHeight*.5)-altura2-marginBottom  )
                                .attr("height",altura2)
                                .attr("fill","#ffffff")
                                .style("pointer-events","auto")
                                ;


                d3.select("#svgTooltip3")
                                .append("text")						
                                .attr("class","ossFilialesDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)	
                                .style("text-anchor","start")
                                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight)-altura1-marginBottom-9   )+")  rotate("+(-90)+") ")
                                .text(function(){
                                
                                    return  formatNumber(arr[i].OOS,true)+"%" ;
                
                                });
                
                d3.select("#svgTooltip3")
                                .append("text")						
                                .attr("class","ossFilialesDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)	
                                .style("text-anchor","end")
                                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight)-marginBottom+10   )+")  rotate("+(-90)+") ")
                                .text(function(){
                                
                                    var date=new Date( Number(arr[i].key) );
                
                                    return  date.getDate()+" "+getMes(date.getMonth());
                
                                });    

                d3.select("#svgTooltip3")
                                .append("text")						
                                .attr("class","ossFilialesDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)	
                                .style("text-anchor","start")
                                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight*.5)-altura2-marginBottom-3   )+")  rotate("+(-90)+") ")
                                .text(function(){
                                
                                    return  formatNumber(arr[i].Fisico/1000)+"k" ;
                
                                });
                

            }

}