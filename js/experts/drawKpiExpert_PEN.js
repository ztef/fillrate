var kpiExpert_PENDIENTES={};

kpiExpert_PENDIENTES.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".prodDetail").data([]).exit().remove();   
    
    $("#toolTip2").css("visibility","hidden");

}


kpiExpert_PENDIENTES.DrawTooltipDetail=function(entity){   
    
    d3.select("#svgTooltip").selectAll(".penDetail").data([]).exit().remove();
    kpiExpert_PENDIENTES.DrawTooltipDetail_Tipo(entity);  
    kpiExpert_PENDIENTES.DrawTooltipDetail_Dia(entity);  

}

kpiExpert_PENDIENTES.DrawTooltipDetail_Dia=function(entity){    

    var maximo=0;

    console.log("arr",entity);

    var arr=d3.nest()
            .key(function(d) { 

                    if(d.fecha){
                            return d.fecha.getTime(); 
                    }else{                       
                            return 0;
                    }                        
    
            })
            .entries(entity.pendientes.allRecords);

            

    for(var i=0; i < arr.length; i++ ){

        arr[i].Pendientes=0;
        arr[i].fecha=arr[i].values[0].fecha.getTime();

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].Pendientes+=Number(arr[i].values[j].Libre_Retrasado);

        }

        if(maximo < arr[i].Pendientes){
            maximo=arr[i].Pendientes;
        }

    }

    arr = arr.sort((a, b) => {                
        return b.fecha - a.fecha;                                    

    }); 

    arr=arr.reverse();
    var ancho=20;

    var marginBottom=svgTooltipHeight*.11;

    var svgTooltipWidth=arr.length*ancho;
    if(svgTooltipWidth < 80)
    svgTooltipWidth=80;

    var svgTooltipHeight=500;
    var marginBottom=svgTooltipHeight*.11;
    var tamanioFuente=ancho*.8;   

    $("#toolTip3").css("visibility","visible");            
    $("#toolTip3").css("left",(mouse_x+950)+"px");

  
    var toolText =  
            "<span style='color:#fff600'><span style='color:#ffffff'>FillRate por Estado</span></span> "+               
            "<svg id='svgTooltip3'  style='pointer-events:none;'></svg> ";

    $("#toolTip3").html(toolText);

    d3.select("#toolTip3")                                     
                    .style("width", (svgTooltipWidth)+"px" );

    d3.select("#svgTooltip3")                     
                    .style("width", svgTooltipWidth )
                    .style("height", (svgTooltipHeight)+50 )
                    ;

    var posY=mouse_y-50;

    if( $("#toolTip3").height()+mouse_y+50 > windowHeight ){
            posY=windowHeight-($("#toolTip3").height()+20);
    }

    if( posY < 0 ){
            posY=50;
    }

    $("#toolTip3").css("top",posY);

    for(var i=0; i < arr.length; i++ ){   

        var altura=GetValorRangos( arr[i].Pendientes,1, maximo ,1,svgTooltipHeight*.4);

        console.log("altura",altura);

        d3.select("#svgTooltip3").append("rect")		    		
                .attr("height",altura)
                .attr("class","frDetail")
                .attr("x",svgTooltipWidth*.7  )
                .attr("y", (altura*caso)+marginTop )
                .attr("width",1)
                .attr("fill","#FFFFFF")
                .transition().delay(0).duration(i*50)
                .style("width",ancho )	
                ;
                
        d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","abasDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)	
                .style("text-anchor","start")
                .attr("transform"," translate("+String( (svgTooltipWidth*.7)+ancho+3  )+","+String( (altura*caso)+tamanioFuente+marginTop    )+")  rotate("+(0)+") ")
                .text(function(){
                
                    return  Math.round((arr[i].CantEntfinal/1000)*100)/100 +"k";

                });
    }

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