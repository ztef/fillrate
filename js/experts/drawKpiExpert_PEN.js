var kpiExpert_PENDIENTES={};

kpiExpert_PENDIENTES.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".prodDetail").data([]).exit().remove();   
    d3.select("#svgTooltip3").selectAll(".penDetail").data([]).exit().remove();
    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");

}


kpiExpert_PENDIENTES.DrawTooltipDetail=function(entity){   
    
    d3.select("#svgTooltip").selectAll(".penDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".penDetail").data([]).exit().remove();

    kpiExpert_PENDIENTES.DrawTooltipDetail_Tipo(entity);  
    kpiExpert_PENDIENTES.DrawTooltipDetail_Dia(entity);  

}

kpiExpert_PENDIENTES.DrawTooltipDetail_Dia=function(entity){    

    var maximo=0;

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

        arr[i].Libre_Pendiente_Hoy=0;
        arr[i].Libre_Retrasado=0;
        arr[i].Total=0;
        arr[i].fecha=arr[i].values[0].fecha.getTime();

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].Libre_Retrasado+=Number(arr[i].values[j].Libre_Retrasado);
            arr[i].Libre_Pendiente_Hoy+=Number(arr[i].values[j].Libre_Retrasado);
            arr[i].Total+=arr[i].Libre_Retrasado+arr[i].Libre_Pendiente_Hoy;

        }

        if(maximo < arr[i].Total){
            maximo=arr[i].Total;
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

    var marginBottom=svgTooltipHeight*.11;


    $("#toolTip3").css("visibility","visible");            
    $("#toolTip3").css("right",(svgTooltipWidth+10)+"px");


    var posY=mouse_y-50;

    if( $("#toolTip3").height()+mouse_y+50 > windowHeight ){
            posY=windowHeight-($("#toolTip3").height()+20);
    }

    if( posY < 0 ){
            posY=50;
    }

    $("#toolTip3").css("top",posY);


    // FORMATEA TOOL TIP :
    
    vix_tt_formatToolTip("#toolTip3","Retrasados por Día de "+entity.key,svgTooltipWidth);

    // Agrega un div con un elemento svg :

    var svgElement = "<svg id='svgTooltip3' style='pointer-events:none;'></svg>";
    d3.select("#toolTip3").append("div").html(svgElement);

    d3.select("#svgTooltip3")                     
        .style("width", svgTooltipWidth )
        .style("height", (svgTooltipHeight)+50 )
                    ;

    for(var i=0; i < arr.length; i++ ){   

        var altura=svgTooltipHeight*.7;
        var altura1=GetValorRangos( arr[i].Libre_Pendiente_Hoy,1, maximo ,1,altura);
        var altura2=GetValorRangos( arr[i].Libre_Retrasado,1, maximo ,1,altura);
   
        d3.select("#svgTooltip3").append("rect")		    		
                                            .attr("width",ancho*.8 )
                                            .attr("class","penDetail")
                                            .attr("x",(ancho*i)  )
                                            .attr("y", (svgTooltipHeight)-altura1-marginBottom  )
                                            .attr("height",altura1)
                                            .attr("fill","#00A8FF")
                                            .style("pointer-events","auto")
                                            .append('title')
                                            .text("Libre Pendiente Hoy: "+formatNumber(arr[i].Libre_Pendiente_Hoy));	

        d3.select("#svgTooltip3").append("rect")		    		
                                    .attr("width",ancho*.8 )
                                    .attr("class","penDetail")
                                    .attr("x",(ancho*i)  )
                                    .attr("y", (svgTooltipHeight)-altura1-altura2-marginBottom-2  )
                                    .attr("height",altura2)
                                    .attr("fill","#EAFF00")
                                    .style("pointer-events","auto")
                                    .append('title')
                                    .text("Libre Retrasado: "+formatNumber(arr[i].Libre_Retrasado));	
                                    ;
                
        d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","penDetail")
                .style("fill","#ffffff")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)	
                .style("text-anchor","start")
                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight)-altura1-altura2-marginBottom-9   )+")  rotate("+(-90)+") ")
                .text(function(){
                
                    return  formatNumber(arr[i].Total) ;

                });

        d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","penDetail")
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
    $("#toolTip2").css("left",(200)+"px");
   

    if( (mouse_y-100)+(campos.length*altura) > windowHeight  )
        $("#toolTip2").css("top",(windowHeight-(campos.length*altura)-150)+"px");
        
  

    d3.select("#svgTooltip")                     
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

    vix_tt_formatToolTip("#toolTip2","Retrasados por Tipo de "+entity.key,svgTooltipWidth);

    var svgElement = "<svg id='svgTooltip' style='pointer-events:none;'></svg>";
    d3.select("#toolTip2").append("div").html(svgElement);

    d3.select("#svgTooltip")                     
        .style("width", svgTooltipWidth )
        .style("height", (svgTooltipHeight)+50 )
                    ;



    for(var i=0; i < campos.length; i++ ){

        var ancho=GetValorRangos(  Number(dataElement[campos[i]]) ,1, maximo ,1,svgTooltipWidth*.4);
     
        d3.select("#svgTooltip").append("rect")		    		
                    .attr("width",1 )
                    .attr("class","penDetail")
                    .attr("x",marginLeft   )
                    .attr("y", (altura*caso)+marginTop )
                    .attr("height",altura*.4)
                    .attr("fill","#ffffff")
                    .transition().delay(0).duration(1000)
                    .attr("width",ancho )
                    ;

        d3.select("#svgTooltip")
                    .append("text")						
                    .attr("class","penDetail")
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
                    .attr("class","penDetail")
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