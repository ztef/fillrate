var kpiExpert_OOS={};

kpiExpert_OOS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");	

}

kpiExpert_OOS.DrawTooltipDetail=function(entity){    

    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();

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
    $("#toolTip2").css("left",(mouse_x+300)+"px");
    
  

    var toolText =  
                "<span style='color:#fff600'><span style='color:#ffffff'>OOS por U.N. y Producto de "+entity.key+"</span></span> <br>"+               
                "<svg id='svgTooltip'  style='pointer-events:none;'></svg> ";

    $("#toolTip2").html(toolText);

    d3.select("#toolTip2")                                     
                .style("width", (svgTooltipWidth)+"px" );

    d3.select("#svgTooltip")                     
                .style("width", svgTooltipWidth )
                .style("height", svgTooltipHeight )
                ;   

    var posY=mouse_y+50;

    if( $("#toolTip2").height()+mouse_y+50 > windowHeight ){
        posY=windowHeight-($("#toolTip2").height()+20);
    }

    if( posY < 0 ){
        posY=20;

    }
    $("#toolTip2").css("top",posY);


    d3.select("#svgTooltip")
            .append("text")						
            .attr("class","abasDetail")
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
            .attr("class","abasDetail")
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
            .attr("class","abasDetail")
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
                .attr("class","ossDetail")
                .attr("x",marginLeft   )
                .attr("y", (altura*caso)+marginTop )
                .attr("height",altura*.5)
                .attr("fill","#ffffff")
                .transition().delay(0).duration(1000)
                .attr("width",ancho )	
                ;

        d3.select("#svgTooltip")
                .append("text")						
                .attr("class","ossDetail")
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
                    .attr("class","ossDetail")
                    .attr("x",(svgTooltipWidth*.55)   )
                    .attr("y", (altura*caso)+marginTop )
                    .attr("height",altura*.5)
                    .attr("fill","#FFFE97")
                    .transition().delay(0).duration(1000)
                    .attr("width",anchoVol)	
                    ;

        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","ossDetail")
                    .style("fill","#FFFE97")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente*.8)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( (svgTooltipWidth*.55)+anchoVol+10  )+","+String( altura*caso+(tamanioFuente)+marginTop -(tamanioFuente*.3)  )+")  rotate("+(0)+") ")
                    .text(function(){
    
                            return  arr[i].OOS;
    
                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 )
                      ;  
       
       

                    
        d3.select("#svgTooltip")
                  .append("text")						
                  .attr("class","ossDetail")
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
                  .attr("class","ossDetail")
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