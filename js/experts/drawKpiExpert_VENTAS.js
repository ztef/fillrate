var drawKpiExpert_VENTAS={};


drawKpiExpert_VENTAS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".ventasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ventasDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");

}


drawKpiExpert_VENTAS.DrawTooltipDetail=function(entity){   
    
    d3.select("#svgTooltip").selectAll(".ventasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ventasDetail").data([]).exit().remove();
    
    drawKpiExpert_VENTAS.DrawTooltipDetail_Producto_Presentacion(entity);
    drawKpiExpert_VENTAS.DrawTooltipDetail_Estado(entity);

}         

drawKpiExpert_VENTAS.DrawTooltipDetail_Producto_Presentacion=function(entity){    

    var maximo=0; 
    var maximoVolumen=0;  

    var arr=d3.nest()
            .key(function(d) { return d.AgrupProducto; })
            .entries(entity.ventas.values);

    for(var i=0; i < arr.length; i++ ){

        arr[i].Dif=0;
        arr[i].VolReal_FR=0;
        arr[i].VolPlan_FR =0;
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;
        arr[i].PctReal_FR=0;

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolPlan_FR+=Number(arr[i].values[j].VolPlan_FR);
            arr[i].VolReal_FR+=Number(arr[i].values[j].VolReal_FR);
            
        }

        if(arr[i].VolumenReal>0){
            arr[i].difPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            arr[i].difVal=arr[i].VolumenReal-arr[i].VolumenPlan;
        }else{
            arr[i].difPer=0;
        }

        arr[i].difPer=arr[i].difPer*100;

        if(maximo < arr[i].difPer){
            maximo=arr[i].difPer;
        }

        if(maximoVolumen < arr[i].VolumenReal){
            maximoVolumen=arr[i].VolumenReal;
        }


    }

    arr = arr.sort((a, b) => b.difVal - a.difVal); 
    arr.reverse(); 

    var altura=30;
    var caso=0;
   
    var svgTooltipHeight=(arr.length*altura)+50;
    var svgTooltipWidth=550;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;

    $("#toolTip3").css("visibility","visible");            
    $("#toolTip3").css("left",(mouse_x+930)+"px");
    
    if( (mouse_y-100)+(arr.length*altura) > windowHeight  )
        $("#toolTip3").css("top",(windowHeight-(arr.length*altura)-150)+"px");

    var toolText =  
        "<span style='color:#fff600'><span style='color:#ffffff'>Detalle Ventas por Producto y Presentación</span></span>"+               
        "<svg id='svgTooltip3'  style='pointer-events:none;'></svg> ";

    $("#toolTip3").html(toolText);

    d3.select("#toolTip3")                                     
    .style("width", (svgTooltipWidth)+"px" );

    d3.select("#svgTooltip3")                     
        .style("width", svgTooltipWidth )
        .style("height", svgTooltipHeight )
        ;


    var posY=mouse_y-50;
    if( $("#toolTip3").height()+mouse_y > windowHeight ){
        posY=windowHeight-$("#toolTip3").height()-150;
    }
    if( posY < 0 ){
        posY=0;
    }

    $("#toolTip3").css("top",posY);


    d3.select("#svgTooltip3")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Vol. Plan")
    .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip3")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Vol. Real")
    .transition().delay(0).duration(i*50);


    d3.select("#svgTooltip3")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( tamanioFuente+10  )+")  rotate("+(0)+") ")
    .text("Dif (k)")
    .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip3")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.7  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Dif (%)")
    .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip3")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.9  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Peso")
    .transition().delay(0).duration(i*50);   

   
    for(var i=0; i < arr.length; i++ ){
    
        var anchoVol=GetValorRangos( arr[i].VolumenReal,1, maximoVolumen ,1,svgTooltipWidth*.15 );

        d3.select("#svgTooltip3").append("rect")		    		
					.attr("width",anchoVol )
                    .attr("class","ventasDetail")
					.attr("x",svgTooltipWidth*.9    )
					.attr("y", (altura*caso)+marginTop )
					.attr("height",1)
					.attr("fill","#FFFE97")
                    .transition().delay(0).duration(i*50)
					.style("height",altura*.4 )	
					;

        d3.select("#svgTooltip3")
                  .append("text")						
                  .attr("class","ventasDetail")
                  .style("fill","#ffffff")		
                  .style("font-family","Cabin")
                  .style("font-weight","bold")
                  .style("font-size",tamanioFuente)						
                  .style("text-anchor","start")
                  .style("opacity",0 )
                  .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                  .text(function(){
                  
                      return formatNumber(Math.round(arr[i].VolumenReal));

                  })
                  .transition().delay(0).duration(i*50)
                  .style("opacity",1 )
                ;

        var ancho=GetValorRangos( arr[i].difPer,1, maximo ,1,svgTooltipWidth*.15 ); 

        d3.select("#svgTooltip3").append("rect")		    		
                    .attr("width",ancho )
                    .attr("class","ventasDetail")
                    .attr("x", svgTooltipWidth*.7  )
                    .attr("y", (altura*caso)+marginTop )
                    .attr("height",1)
                    .attr("fill","#ffffff")
                    .transition().delay(0).duration(i*50)
                    .style("height",altura*.4 )	
                    ;
    
        d3.select("#svgTooltip3")
                    .append("text")						
                    .attr("class","ventasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( (svgTooltipWidth*.7)+ancho+2  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                    
                        return Math.round(arr[i].difPer)+"%";

                    })
                    .transition().delay(0).duration(i*50)
                    .style("opacity",1 )
                    ;                  
        
            d3.select("#svgTooltip3")
                        .append("text")						
                        .attr("class","ventasDetail")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){
                        
                            return formatNumber(Math.round(arr[i].VolumenPlan));
    
                        })
                        .transition().delay(0).duration(i*50)
                        .style("opacity",1 )
                    ;
        
                d3.select("#svgTooltip3")
                        .append("text")						
                        .attr("class","ventasDetail")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){
                        
                            return formatNumber((Math.round(arr[i].VolumenReal - arr[i].VolumenPlan)));
        
                        })
                        .transition().delay(0).duration(i*50)
                        .style("opacity",1 )
                      ;
        
                d3.select("#svgTooltip3")
                            .append("text")						
                            .attr("class","ventasDetail")
                            .style("fill","#ffffff")		
                            .style("font-family","Cabin")
                            .style("font-weight","bold")
                            .style("font-size",tamanioFuente)	
                            .style("text-anchor","start")
                            .attr("transform"," translate("+String( 5  )+","+String( altura*caso+(tamanioFuente )+marginTop   )+")  rotate("+(0)+") ")
                            .text(function(){
                          
                                return  arr[i].key;
        
                            });                   

                    caso++;       
    }  

}

drawKpiExpert_VENTAS.DrawTooltipDetail_Estado=function(entity){    

    var maximo=0; 
    var maximoVolumen=0;   
   
    var arr=d3.nest()
            .key(function(d) { return d.EstadoDem; })
            .entries(entity.ventas.values);
          

    for(var i=0; i < arr.length; i++ ){

        arr[i].Dif=0;
        arr[i].VolReal_FR=0;
        arr[i].VolPlan_FR =0;
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;
        arr[i].PctReal_FR=0;

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolPlan_FR+=Number(arr[i].values[j].VolPlan_FR);
            arr[i].VolReal_FR+=Number(arr[i].values[j].VolReal_FR);
            
        }       

        if(arr[i].VolumenReal>0){
            arr[i].difPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            arr[i].difVal=arr[i].VolumenReal/arr[i].VolumenPlan;
            arr[i].difResta=arr[i].VolumenReal-arr[i].VolumenPlan;
        }else{
            arr[i].difPer=0;
        }

        arr[i].difPer=arr[i].difPer*100;

        if(maximo < arr[i].difPer){
            maximo=arr[i].difPer;
        }
        if(maximoVolumen < arr[i].VolumenReal){
            maximoVolumen=arr[i].VolumenReal;
        }

    }
    
    arr = arr.sort((a, b) => b.difResta - a.difResta); 
    arr.reverse();

   
    var altura=30;
    var caso=0;

    var svgTooltipHeight=(arr.length*altura)+50;
    var svgTooltipWidth=530;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("left",(mouse_x+350)+"px");    
    
    if( (mouse_y-100)+(arr.length*altura) > windowHeight  )
        $("#toolTip2").css("top",(windowHeight-(arr.length*altura)-150)+"px");

    var toolText =  
        "<span style='color:#fff600'><span style='color:#ffffff'>Detalle Ventas por Estado</span></span>"+               
        "<svg id='svgTooltip'  style='pointer-events:none;'></svg> ";

    $("#toolTip2").html(toolText);

    d3.select("#toolTip2")                                     
    .style("width", (svgTooltipWidth)+"px" );

    d3.select("#svgTooltip")                     
        .style("width", svgTooltipWidth )
        .style("height", svgTooltipHeight )
        ;


    var posY=mouse_y-50;
    if( $("#toolTip2").height()+mouse_y > windowHeight ){
    posY=windowHeight-$("#toolTip2").height()-150;
    }
    if( posY < 0 ){
    posY=0;
    }

    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Vol. Plan")
    .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Vol. Real")
    .transition().delay(0).duration(i*50);


    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Dif (k)")
    .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.7  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Dif (%)")
    .transition().delay(0).duration(i*50);

    d3.select("#svgTooltip")
    .append("text")						
    .attr("class","ventasDetail")
    .style("fill","#8EBBFF")		
    .style("font-family","Cabin")
    .style("font-weight","bold")
    .style("font-size",tamanioFuente)						
    .style("text-anchor","start")
    .style("opacity",1 )
    .attr("transform"," translate("+String( svgTooltipWidth*.9  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
    .text("Peso")
    .transition().delay(0).duration(i*50);    

    $("#toolTip2").css("top",posY);

    for(var i=0; i < arr.length; i++ ){          

        var anchoVol=GetValorRangos( arr[i].VolumenReal,1, maximoVolumen ,1,svgTooltipWidth*.15 );

        d3.select("#svgTooltip").append("rect")		    		
					.attr("width",anchoVol )
                    .attr("class","ventasDetail")
					.attr("x",svgTooltipWidth*.9    )
					.attr("y", (altura*caso)+marginTop )
					.attr("height",1)
					.attr("fill","#FFFE97")
                    .transition().delay(0).duration(i*50)
					.style("height",altura*.4 )	
					;

        d3.select("#svgTooltip")
                  .append("text")						
                  .attr("class","ventasDetail")
                  .style("fill","#ffffff")		
                  .style("font-family","Cabin")
                  .style("font-weight","bold")
                  .style("font-size",tamanioFuente)						
                  .style("text-anchor","start")
                  .style("opacity",0 )
                  .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                  .text(function(){
                  
                      return formatNumber(Math.round(arr[i].VolumenReal));

                  })
                  .transition().delay(0).duration(i*50)
                  .style("opacity",1 )
                ;


        var ancho=GetValorRangos( arr[i].difPer,1, maximo ,1,svgTooltipWidth*.15 ); 
        
        d3.select("#svgTooltip").append("rect")		    		
                    .attr("width",ancho )
                    .attr("class","ventasDetail")
                    .attr("x", svgTooltipWidth*.7  )
                    .attr("y", (altura*caso)+marginTop )
                    .attr("height",1)
                    .attr("fill","#ffffff")
                    .transition().delay(0).duration(i*50)
                    .style("height",altura*.4 )	
                    ;
    
        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","ventasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( (svgTooltipWidth*.7)+ancho+2  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                    
                        return Math.round(arr[i].difPer)+"%";

                    })
                    .transition().delay(0).duration(i*50)
					.style("opacity",1 )
                  ;                  

        d3.select("#svgTooltip")
                  .append("text")						
                  .attr("class","ventasDetail")
                  .style("fill","#ffffff")		
                  .style("font-family","Cabin")
                  .style("font-weight","bold")
                  .style("font-size",tamanioFuente)						
                  .style("text-anchor","start")
                  .style("opacity",0 )
                  .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                  .text(function(){
                  
                      return formatNumber(Math.round(arr[i].VolumenPlan));

                  })
                  .transition().delay(0).duration(i*50)
                  .style("opacity",1 )
                ;

        d3.select("#svgTooltip")
                .append("text")						
                .attr("class","ventasDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",0 )
                .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                .text(function(){
                
                    return formatNumber((Math.round(arr[i].VolumenReal - arr[i].VolumenPlan)));

                })
                .transition().delay(0).duration(i*50)
                .style("opacity",1 )
              ;

        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","ventasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)	
                    .style("text-anchor","start")
                    .attr("transform"," translate("+String( 5  )+","+String( altura*caso+(tamanioFuente )+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                  
                        return  arr[i].key;

                    });

                    caso++;

        
    }    
}