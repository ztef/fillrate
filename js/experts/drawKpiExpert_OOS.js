var kpiExpert_OOS={};

kpiExpert_OOS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();
    console.log("elimnaaa");
    d3.select("#svgTooltip3").selectAll(".ossDetail").data([]).exit().remove();

    console.log();
    
    $("#toolTip2").css("visibility","hidden");	
    $("#toolTip2").css("visibility","hidden");	
    $("#toolTip3").css("visibility","hidden");

}

kpiExpert_OOS.DrawTooltipDetail=function(entity){    
 
    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ossDetail").data([]).exit().remove();
    
    kpiExpert_OOS.DrawTooltipDetail_UN(entity);
    kpiExpert_OOS.DrawTooltipDetail_Dia(entity);

}

kpiExpert_OOS.DrawTooltipDetail_UN=function(entity){    

    d3.select("#svgTooltip").selectAll(".ossDetail").data([]).exit().remove();

    var maximo=0;
    var maximoVolumen=0;   

    for(var i=0; i < entity.oos.values.length; i++ ){

        entity.oos.values[i].grupo=entity.oos.values[i].DescrProducto+"_"+entity.oos.values[i].Destino;       

    }

    var arr=d3.nest()
            .key(function(d) { return d.Destino; })
            .entries(entity.oos.values);     
            
            console.log("arr",entity);
    
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
   // var caso=0;
   
    //var svgTooltipHeight=(arr.length*altura)+50;
    var svgTooltipWidth=600;
    //var marginLeft=svgTooltipWidth*.3;
    var tamanioFuente=altura*.5;
    if(tamanioFuente < 12)
    tamanioFuente=12;

    //var marginTop=30;


    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("top",15+"%");
    $("#toolTip2").css("left",24+"%"); 
  
 /* 

        VIX_TT  : Prepara datos para el tool tip

    */


    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "Numero": item.Numerador,
          "OOS": item.OOS,
          "Numera": item.CantEntFinal,
        };
        });
    
    
    
        // DEFINE COLUMNAS
      
        var columns = [
            { key: "key", header: "Producto", sortable: true, width: "150px" },
            { key: "Numero", header: "# OOS", sortable: true, width: "150px" },
            { key: "OOS", header: "% OOS", sortable: true, width: "150px" },
            { key: "Numera", header: "Volumen Entregado", sortable: true, width: "150px" },
          
          ];
        
      
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
       var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
            </div>`;
          },
    
          Numero: function(value) {
          return vix_tt_formatNumber(value);
        },
       
            OOS: function(value){
      
            var barWidth = value + '%';
            var barValue = vix_tt_formatNumber(value)+'%   ';
        
            return '<div class="bar-container">' +
                    '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
                    + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
                   '</div>';
        },
        Numera: function(value){
      
            var barWidth = (value/maximoVolumen)*100 + '%';
            var barValue = vix_tt_formatNumber(value);
       
           return '<div class="bar-container">' +
                    '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
                    + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
                  '</div>';
        }
      };
    

      // FORMATEA DIV :
    
      vix_tt_formatToolTip("#toolTip2","OOS por U.N. y Producto de "+entity.key,svgTooltipWidth);
    
      
            // COLUMNAS CON TOTALES :
    
            var columnsWithTotals = ['Numero','','Numera']; 
            var totalsColumnVisitors = {
                        'Numero': function(value) { 
                        return vix_tt_formatNumber(value) + " TM"; 
                        },
                        'Numera': function(value) { 
                        return vix_tt_formatNumber(value) + " TM";
                        },
                      
                      
                      };
      
 // CREA TABLA USANDO DATOS
          
 vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );
     
      
      
 // APLICA TRANSICIONES 

 vix_tt_transitionRectWidth("toolTip2");
 

}

kpiExpert_OOS.DrawTooltipDetail_Dia=function(entity){ 

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

            var fechas={};

            for(var i=0; i < arr.length; i++ ){

                    arr[i].Numerador=0;
                    arr[i].Denominador=0;
                    arr[i].Fisico=0;
                    arr[i].fecha=arr[i].values[0].fecha.getTime();

                    fechas[arr[i].values[0].fecha.getDate()+"_"+arr[i].values[0].fecha.getDay()]=true;
               
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

            var arrTemp=[];

            var dia=((1000*60)*60)*23.9;

            arr=arr.reverse();


            for(var i=0; i < arr.length; i++ ){

                    arrTemp.push(arr[i]);
                   
                    var date_=new Date(arr[i].fecha);

                    if(date_.getDay()==5){

                            var sabado=new Date(arr[i].fecha+dia);
                          
                            if(!fechas[sabado.getDate()+"_"+sabado.getDay()] ){
                               
                                    arrTemp.push({
                                        Numerador:0,
                                        Denominador:0,
                                        Fisico:0,
                                        fecha:new Date(arr[i].fecha+dia),
                                        OOS:0,
                                        agregado:true,
                                        key:arr[i].fecha+dia
                                    });

                            }

                    }

                   
                    if(date_.getDay()==6){
                       
                            var domingo=new Date(arr[i].fecha+dia+dia );
                            console.log("domingooo",domingo.getDate(),domingo.getDay());
                            if(!fechas[domingo.getDate()+"_"+domingo.getDay()] ){
                                console.log("insertaa",date_.getDay());
                                    arrTemp.push({
                                        Numerador:0,
                                        Denominador:0,
                                        Fisico:0,
                                        fecha:new Date(arr[i].fecha+dia+dia),
                                        OOS:0,
                                        agregado:true,
                                        key:arr[i].fecha+dia+dia
                                    });

                            }
                    }

            }

            arr=arrTemp;            
        
            var ancho=20;
            
            var svgTooltipWidth=arr.length*ancho;

            if(svgTooltipWidth < 80)
            svgTooltipWidth=80;

            var svgTooltipHeight=500;
            var tamanioFuente=ancho*.8;   
        
            $("#toolTip3").css("visibility","visible");            
            $("#toolTip3").css("top",15+"%");
            $("#toolTip3").css("left",64+"%");
        
            var marginBottom=svgTooltipHeight*.02;

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
                                .attr("class","ossDetail")
                                .attr("x",(ancho*i)  )
                                .attr("y", (svgTooltipHeight)-altura1-marginBottom  )
                                .attr("height",altura1)
                                .attr("fill",color)
                                .style("pointer-events","auto")
                                ;
                               	
        
                d3.select("#svgTooltip3").append("rect")		    		
                                .attr("width",ancho*.8 )
                                .attr("class","ossDetail")
                                .attr("x",(ancho*i)  )
                                .attr("y", (svgTooltipHeight*.5)-altura2-marginBottom  )
                                .attr("height",altura2)
                                .attr("fill","#ffffff")
                                .style("pointer-events","auto")
                                ;


                d3.select("#svgTooltip3")
                                .append("text")						
                                .attr("class","ossDetail")
                                .style("fill",function(d){
                                    
                                    var color ="#FFFFFF";

                                    if(arr[i].agregado){
                                        color ="#5C5C5C";
                                    }
                                    
                                    return color;
                                    
                                })		
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
                                .attr("class","ossDetail")
                                .style("fill",function(d){
                                    
                                    var color ="#FFFFFF";

                                    if(arr[i].agregado){
                                        color ="#5C5C5C";
                                    }
                                    
                                    return color;
                                    
                                })		
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
                                .attr("class","ossDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente)	
                                .style("text-anchor","start")
                                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight*.5)-altura2-marginBottom-3   )+")  rotate("+(-90)+") ")
                                .text(function(){
                                
                                    return  formatNumber(arr[i].Fisico) ;
                
                                });

                //TITULOS
                d3.select("#svgTooltip3")
                    .append("text")						
                    .attr("class","ossDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","normal")
                    .style("font-size",tamanioFuente)	
                    .style("text-anchor","start")
                    .attr("transform"," translate("+String( 3  )+","+String( 25 )+")  rotate("+(0)+") ")
                    .text("Inventario (TM):"); 

                d3.select("#svgTooltip3")
                    .append("text")						
                    .attr("class","ossDetail")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","normal")
                    .style("font-size",tamanioFuente)	
                    .style("text-anchor","start")
                    .attr("transform"," translate("+String( 3  )+","+String( svgTooltipHeight*.55  )+")  rotate("+(0)+") ")
                    .text("Porcentaje (%):");
                

            }

}