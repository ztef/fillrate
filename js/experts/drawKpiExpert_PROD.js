var kpiExpert_PROD={};

kpiExpert_PROD.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".prodDetail").data([]).exit().remove();   
    
    $("#toolTip2").css("visibility","hidden");


}

kpiExpert_PROD.DrawTooltipDetail=function(entity){   
    
    d3.select("#svgTooltip").selectAll(".prodDetail").data([]).exit().remove();
    kpiExpert_PROD.DrawTooltipDetail_Planta(entity);   

}

    kpiExpert_PROD.DrawTooltipDetail_Planta=function(entity){    
       
        var maximo=0; 
        var maximo2=0;    
       
        var arr=d3.nest()
                .key(function(d) { return d.Planta; })
                .entries(entity.produccion.values);          

        
        for(var i=0; i < arr.length; i++ ){

            arr[i].Dif=0;
           
            arr[i].VolVenta_Real=0;
            arr[i].VolVenta_Plan=0;
    

            for(var j=0; j < arr[i].values.length; j++ ){

             
                arr[i].VolVenta_Real+=Number(arr[i].values[j].VolVenta_Real);
                arr[i].VolVenta_Plan+=Number(arr[i].values[j].VolVenta_Plan);
                

            }

            if(arr[i].VolVenta_Plan>0){
                arr[i].Dif=arr[i].VolVenta_Real-arr[i].VolVenta_Plan;
                arr[i].DifPer=arr[i].VolVenta_Real/arr[i].VolVenta_Plan;
            }else{
                arr[i].Dif=0;
                arr[i].DifPer=0;
            }  
            
            if(maximo < arr[i].VolVenta_Real){
                maximo = arr[i].VolVenta_Real;
            }

            if(maximo2 < arr[i].DifPer*1000){
                maximo2=arr[i].DifPer*1000;
            }

        } 
        
        arr = arr.sort((a, b) => b.Dif - a.Dif); 
        arr.reverse();

        var altura=30;
        var caso=0;
       
        var svgTooltipHeight=arr.length*altura;
        var svgTooltipWidth=650;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=svgTooltipHeight*.15;

        $("#toolTip2").css("visibility","visible");            
        $("#toolTip2").css("left",(mouse_x+350)+"px");
       

        if( (mouse_y-100)+(arr.length*altura) > windowHeight  )
            $("#toolTip2").css("top",(windowHeight-(arr.length*altura)-150)+"px");
            
        var toolText =  
                    "<span style='color:#fff600'><span style='color:#ffffff'>Producción por Planta</span></span>"+               
                    "<svg id='svgTooltip'  style='pointer-events:none;'></svg> ";

        $("#toolTip2").html(toolText);

        d3.select("#toolTip2")                                     
                    .style("width", (svgTooltipWidth)+"px" );

        d3.select("#svgTooltip")                     
                    .style("width", svgTooltipWidth )
                    .style("height", svgTooltipHeight+50 )
                    ;

        var posY=mouse_y-100;

        if( $("#toolTip2").height()+mouse_y+50 > windowHeight ){
            posY=windowHeight-($("#toolTip2").height()+20);
        }

        if( posY < 0 ){
            posY=20;

        }
        $("#toolTip2").css("top",posY);
        
        d3.select("#svgTooltip")
        .append("text")						
        .attr("class","ventasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( altura*caso+(tamanioFuente)   )+")  rotate("+(0)+") ")
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
        .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( altura*caso+(tamanioFuente)   )+")  rotate("+(0)+") ")
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
        .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( altura*caso+(tamanioFuente)   )+")  rotate("+(0)+") ")
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
        .attr("transform"," translate("+String( svgTooltipWidth*.7  )+","+String( altura*caso+(tamanioFuente)   )+")  rotate("+(0)+") ")
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
        .attr("transform"," translate("+String( svgTooltipWidth*.9  )+","+String( altura*caso+(tamanioFuente)   )+")  rotate("+(0)+") ")
        .text("Volumen Real")
        .transition().delay(0).duration(i*50);    
     
        for(var i=0; i < arr.length; i++ ){

            if(arr[i].VolVenta_Real==0)
                continue;
        
            var ancho=GetValorRangos( arr[i].VolVenta_Real,1, maximo ,1,svgTooltipWidth*.11 );
         
            d3.select("#svgTooltip").append("rect")		    		
    					.attr("width",1 )
                        .attr("class","abasDetail")
    					.attr("x",svgTooltipWidth*.9   )
    					.attr("y", (altura*caso)+marginTop )
    					.attr("height",altura*.4)
    					.attr("fill","#FFFE97")
                        .transition().delay(0).duration(1000)
    					.attr("width",ancho )
    					;

          
            //BARRA 2

            var anchoVol=GetValorRangos( arr[i].DifPer*1000,1, maximo2 ,1,svgTooltipWidth*.11 );

            d3.select("#svgTooltip").append("rect")		    		
                        .attr("width",1 )
                        .attr("class","prodDetail")
                        .attr("x",svgTooltipWidth*.7   )
                        .attr("y", (altura*caso)+marginTop )
                        .attr("height",altura*.4)
                        .attr("fill","#ffffff")
                        .transition().delay(0).duration(1000)
                        .attr("width",anchoVol)	
                        ;       

            d3.select("#svgTooltip")
                      .append("text")						
                      .attr("class","prodDetail")
                      .style("fill","#ffffff")		
                      .style("font-family","Cabin")
                      .style("font-weight","bold")
                      .style("font-size",tamanioFuente)						
                      .style("text-anchor","start")
                      .style("opacity",0 )
                      .attr("transform"," translate("+String( (svgTooltipWidth*.7)+anchoVol+2  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                      .text(function(){
                      
                          return Math.round( arr[i].DifPer*1000)/10+"%";
                      })
                      .transition().delay(0).duration(1000)
                      .style("opacity",1 )
                    ;


                        // SEPARADAS
                        d3.select("#svgTooltip")
                                .append("text")						
                                .attr("class","prodDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)						
                                .style("text-anchor","start")
                                .style("opacity",0 )
                                .attr("transform"," translate("+String( svgTooltipWidth*.2  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                                .text(function(){
                                
                                   
                                    return (((Math.round( (arr[i].VolVenta_Plan*10)/1000  )/10)));

                                })
                                .transition().delay(0).duration(i*50)
                                .style("opacity",1 )
                            ;


                        d3.select("#svgTooltip")
                                .append("text")						
                                .attr("class","prodDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)						
                                .style("text-anchor","start")
                                .style("opacity",0 )
                                .attr("transform"," translate("+String( svgTooltipWidth*.4  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                                .text(function(){
                                
                                    return (((Math.round( (arr[i].VolVenta_Real*10)/1000  )/10)));

                                })
                                .transition().delay(0).duration(i*50)
                                .style("opacity",1 )
                            ;

                            d3.select("#svgTooltip")
                            .append("text")						
                            .attr("class","prodDetail")
                            .style("fill","#ffffff")		
                            .style("font-family","Cabin")
                            .style("font-weight","bold")
                            .style("font-size",tamanioFuente)						
                            .style("text-anchor","start")
                            .style("opacity",0 )
                            .attr("transform"," translate("+String( svgTooltipWidth*.55  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                            .text(function(){
                            
                                return (((Math.round( (arr[i].Dif*10)/1000  )/10)));
            
                            })
                            .transition().delay(0).duration(i*50)
                            .style("opacity",1 )
                          ;

                       

            d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","prodDetail")
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
                                
                            kpiExpert_PROD.eraseChart();

                            if(filterControls){
                                    filterControls.lookForEntity(this.name);
                            }
                                
                        });
    

                        caso++;

            
        }    

    }

