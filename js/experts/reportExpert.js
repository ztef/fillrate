var reportExpert={}

reportExpert.EraseReport=function(){
    
    d3.select("#svgTooltipReport").selectAll(".reportDetail").data([]).exit().remove();
    $("#toolTip4").css("visibility","hidden");  
    Stage.blockScreen.style("visibility","hidden"); 
    $("#Controls").css("visibility","hidden");
    $("#radarDiv").css("opacity",1);

}

reportExpert.DrawReport=function(entities){

        Stage.blockScreen.style("visibility","visible");
        $("#toolTip4").css("visibility","visible");   
        $("#Controls").css("visibility","hidden");
        $("#radarDiv").css("opacity",.3);
        radar.CleanWindows();

        d3.select("#svgTooltipReport").selectAll(".reportDetail").data([]).exit().remove();

        $("#toolTip4").css("visibility","visible");            
        $("#toolTip4").css("left",(400)+"px");
        $("#toolTip4").css("top",(80)+"px"); 

        var anchoVentana=windowWidth-600;
        var altoVentana=(windowHeight*.9)-80;


        var toolText =  
                    "<span style='color:#fff600'><span style='color:#ffffff'>Diagnóstico de Indicadres</span></span>"+               
                    "<svg id='svgTooltipReport'  style='pointer-events:none;'></svg> ";

        $("#toolTip4").html(toolText);
        
        d3.select("#toolTip4")                                     
                    .style("width", anchoVentana+"px" );

        d3.select("#svgTooltipReport")                     
                    .style("width", anchoVentana )
                    .style("height", altoVentana )
                    ;
            
        var offSetTop=50;
        var offSetLeft=300;
        var indicadores=["FR","Venta","Demanda","Oferta","Razón Probable"];
        var anchoColumna=(anchoVentana-offSetLeft)/indicadores.length;
        var alturaRenglon=altoVentana/entities.length;   

        if(alturaRenglon < 10)
            alturaRenglon=10;

        var tamanoLetra=alturaRenglon*.9;

        if(tamanoLetra > 20)
        tamanoLetra=20;
        
        for(var j=0; j < indicadores.length; j++ ){

            var x=anchoColumna*j;

            d3.select("#svgTooltipReport")
                        .append("text")						
                        .attr("class","reportDetail")
                        .style("fill","#F6FF00")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",25)	
                        .style("text-anchor","start")
                        .attr("transform"," translate("+String( x+5+offSetLeft  )+","+String( 40   )+")  rotate("+(0)+") ")
                        .text(function(){
                    
                            return  indicadores[j];

                        });

        }

        var x=10;

        for(var i=0; i < entities.length; i++ ){

            if(i > 160 ||  (alturaRenglon*i)+offSetTop+40 > altoVentana)
            continue;

            var y=(alturaRenglon*i)+offSetTop+40;

            d3.select("#svgTooltipReport")
            .append("text")						
            .attr("class","reportDetail")
            .style("fill","#12FFFF")		
            .style("font-family","Cabin")
            .style("font-weight","bold")
            .style("font-size",tamanoLetra)	
            .style("text-anchor","start")
            .attr("transform"," translate("+String( 5  )+","+String( y   )+")  rotate("+(0)+") ")
            .text(function(){
        
                return  entities[i].key;

            });

            d3.select("#svgTooltipReport").append("line")
                        .style("stroke","#cccccc" )
                        .attr("class","ticks ")
                        .style("stroke-width", 1 )
                        .style("stroke-opacity", .3 )
                        .attr("x1",0)
                        .attr("y1",y+(5))
                        .attr("x2",anchoVentana)
                        .attr("y2",y)

            for(var j=0; j < indicadores.length; j++ ){

                        var x=anchoColumna*j;

                        d3.select("#svgTooltipReport")
                                    .append("text")						
                                    .attr("class","reportDetail")
                                    .style("fill","#ffffff")		
                                    .style("font-family","Cabin")
                                    .style("font-weight","bold")
                                    .style("font-size",tamanoLetra)	
                                    .style("text-anchor","start")
                                    .attr("transform"," translate("+String( x+5+offSetLeft  )+","+String( y   )+")  rotate("+(0)+") ")
                                    .text(function(){
                                
                                        return  "0";

                                    });

            }

        }

    }