var kpiExpert_PENDIENTES={};

kpiExpert_PENDIENTES.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".prodDetail").data([]).exit().remove();   
    
    $("#toolTip2").css("visibility","hidden");


}


kpiExpert_PENDIENTES.DrawTooltipDetail=function(entity){   
    
    d3.select("#svgTooltip").selectAll(".penDetail").data([]).exit().remove();
    kpiExpert_PENDIENTES.DrawTooltipDetail_Tipo(entity);   

}


kpiExpert_PENDIENTES.DrawTooltipDetail_Tipo=function(entity){    

    var maximo=0;

    var dataElement=entity.pendientes.values[0];

    var campos=["Libre_Retrasado","Libre_RecAutf","Libre_Pendiente_Hoy","Libre_Programado_Total"];

    for(var i=0; i < campos.length; i++ ){
        console.log(Number(dataElement[campos[i]]));
        if(maximo < Number(dataElement[campos[i]]) ){
            maximo = Number(dataElement[campos[i]]);
        } 
    }

    var altura=50;
    var caso=0;

    var svgTooltipHeight=campos.length*altura;
    var svgTooltipWidth=700;
    var marginLeft=svgTooltipWidth*.4;
    var tamanioFuente=altura*.4;
    var marginTop=svgTooltipHeight*.1;

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("left",(mouse_x+350)+"px");
   

    if( (mouse_y-100)+(campos.length*altura) > windowHeight  )
        $("#toolTip2").css("top",(windowHeight-(campos.length*altura)-150)+"px");
        
    var toolText =  
                "<span style='color:#fff600'><span style='color:#ffffff'>Pendientes por tipo</span></span>"+               
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

    for(var i=0; i < campos.length; i++ ){

        var ancho=GetValorRangos(  Number(dataElement[campos[i]]) ,1, maximo ,1,svgTooltipWidth*.4);
     
        d3.select("#svgTooltip").append("rect")		    		
                    .attr("width",1 )
                    .attr("class","abasDetail")
                    .attr("x",marginLeft   )
                    .attr("y", (altura*caso)+marginTop )
                    .attr("height",altura*.4)
                    .attr("fill","#ffffff")
                    .transition().delay(0).duration(1000)
                    .attr("width",ancho )
                    ;

        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","abasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( 10  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                    
                        return campos[i].replaceAll("_"," ");
                    })
                    .transition().delay(0).duration(1000)
					.style("opacity",1 )
                  ;

        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","abasDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",tamanioFuente)						
                    .style("text-anchor","start")
                    .style("opacity",0 )
                    .attr("transform"," translate("+String( ancho+(marginLeft)+10  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                    .text(function(){
                    
                        return formatNumber((Math.round(   (Number(dataElement[campos[i]])/1000)   *100)/100) ,true)+" k";
                    })
                    .transition().delay(0).duration(1000)
					.style("opacity",1 )
                  ;

                  caso++;

    }
   

}