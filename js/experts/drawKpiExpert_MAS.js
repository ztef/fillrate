var kpiExpert_MAS={};


kpiExpert_MAS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".masDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");	

}


kpiExpert_MAS.DrawTooltipDetail=function(entity){  

    d3.select("#svgTooltip").selectAll(".masDetail").data([]).exit().remove();

    var maximo=0;
    var maximoVol=0;
    var arr=d3.nest()
            .key(function(d) { return d.EstadoZTDem; })
            .entries(entity.masivos.values);

            console.log("arr",arr);

    for(var i=0; i < arr.length; i++ ){

        arr[i].Masivos=0; 
        arr[i].MasivosVol=0;
        arr[i].totalSolicitado=0;    

        for(var j=0; j < arr[i].values.length; j++ ){
            
            if( arr[i].values[j].TipoPedido == "Masivo" ){

                arr[i].MasivosVol+=Number(arr[i].values[j].CantSolfinal);
          
            }

            arr[i].totalSolicitado+=Number(arr[i].values[j].CantSolfinal);            

        }

        arr[i].Masivos=arr[i].MasivosVol/arr[i].totalSolicitado;

        if(maximo < arr[i].Masivos*1000){
            maximo=arr[i].Masivos*1000;
        }
        if(maximoVol < arr[i].totalSolicitado){
            maximoVol=arr[i].totalSolicitado;
        }

    }

    arr = arr.sort((a, b) => b.Masivos*100 - a.Masivos*100);

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
    $("#toolTip2").css("top",15+"%");
    $("#toolTip2").css("left",34+"%");


    var toolText =  
                "<span style='color:#fff600'><span style='color:#ffffff'>Masivos por Estado de "+entity.key+"</span></span> <br>"+               
                "<svg id='svgTooltip'  style='pointer-events:none;'></svg> ";

    $("#toolTip2").html(toolText);

    d3.select("#toolTip2")                                     
                .style("width", (svgTooltipWidth)+"px" );

    d3.select("#svgTooltip")                     
                .style("width", svgTooltipWidth )
                .style("height", svgTooltipHeight )
                ;   

    d3.select("#svgTooltip")
        .append("text")						
        .attr("class","ventasDetail")
        .style("fill","#8EBBFF")		
        .style("font-family","Cabin")
        .style("font-weight","bold")
        .style("font-size",tamanioFuente)						
        .style("text-anchor","start")
        .style("opacity",1 )
        .attr("transform"," translate("+String( svgTooltipWidth*.3  )+","+String( altura*.25+(tamanioFuente)   )+")  rotate("+(0)+") ")
        .text("Volumen Masivos (k)")
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
        .attr("transform"," translate("+String( svgTooltipWidth*.7  )+","+String( altura*.25+(tamanioFuente)   )+")  rotate("+(0)+") ")
        .text("Volumen Solicitado (%)")
        .transition().delay(0).duration(i*50);

    for(var i=0; i < arr.length; i++ ){

        var ancho=GetValorRangos( arr[i].Masivos*1000,1, maximo ,1,svgTooltipWidth*.15 );

        d3.select("#svgTooltip").append("rect")		    		
                .attr("width",1 )
                .attr("class","ossDetail")
                .attr("x",marginLeft+(svgTooltipWidth*.4)    )
                .attr("y", (altura*caso)+marginTop )
                .attr("height",altura*.4)
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
                .style("font-size",tamanioFuente*.9)						
                .style("text-anchor","start")
                .style("opacity",0 )
                .attr("transform"," translate("+String(    ancho+(marginLeft)+10+(svgTooltipWidth*.4) )+","+String( altura*caso+(tamanioFuente)+marginTop -(tamanioFuente*.3)  )+")  rotate("+(0)+") ")
                .text(function(){

                    return Math.round(arr[i].Masivos*1000)/10+" %";
                     
                    })
                    .transition().delay(0).duration(i*50)
					.style("opacity",1 )
                  ;

        var ancho2=GetValorRangos( arr[i].totalSolicitado ,1, maximoVol ,1,svgTooltipWidth*.15 );

        d3.select("#svgTooltip").append("rect")		    		
                .attr("width",1 )
                .attr("class","ossDetail")
                .attr("x",marginLeft  )
                .attr("y", (altura*caso)+marginTop)
                .attr("height",altura*.4)
                .attr("fill","#FBFFBB")
                .transition().delay(0).duration(1000)
                .attr("width",ancho2 )	
                ;

       d3.select("#svgTooltip")
                .append("text")						
                .attr("class","ossDetail")
                .style("fill","#FBFFBB")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente*.9)						
                .style("text-anchor","start")
                .style("opacity",0 )
                .attr("transform"," translate("+String( ancho2+(marginLeft)+10  )+","+String( altura*caso+(tamanioFuente)+marginTop -(tamanioFuente*.3)  )+")  rotate("+(0)+") ")
                .text(function(){

                    return Math.round(arr[i].totalSolicitado/1000)+" k";
                     
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
                .attr("transform"," translate("+String( 5  )+","+String( altura*caso+(tamanioFuente )+marginTop   )+")  rotate("+(0)+") ")
                .text(function(){
                
                    return  arr[i].key;

                });

                  caso++;

    }

}