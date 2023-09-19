var kpiExpert_PENDIENTES={};

kpiExpert_PENDIENTES.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".prodDetail").data([]).exit().remove();   
    d3.select("#svgTooltip3").selectAll(".penDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".penDetail").data([]).exit().remove();
    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");

}


kpiExpert_PENDIENTES.DrawTooltipDetail=function(entity){   
    
    d3.select("#svgTooltip").selectAll(".penDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".penDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".penDetail").data([]).exit().remove();

    kpiExpert_PENDIENTES.DrawTooltipDetail_Tipo(entity);  
    kpiExpert_PENDIENTES.DrawTooltipDetail_Dia(entity);
    kpiExpert_PENDIENTES.DrawTooltipDetail_Estado(entity);  

    opacidadCesium=.3;
    $("#cesiumContainer").css("opacity",opacidadCesium/100);

}

kpiExpert_PENDIENTES.DrawTooltipDetail_Estado=function(entity){    

            $("#cargando").css("visibility","visible");

            var serviceName;
            var apiURL;
            var agrupador="";
            var nombreCatalogoParaDiccionario;
            var diccionarioNombres=[];

            for(var i=0; i < store.niveles.length; i++){    

                    if( store.niveles[i].id == $("#nivel_cb").val() ){
                            agrupador=store.niveles[i].storeProcedureField; 
                            nombreCatalogoParaDiccionario=store.niveles[i].coordinatesSource;
                    }                        
            }

            for( var i=0; i < store.catlogsForFilters.length; i++ ){    
                    if(store.catlogsForFilters[i].data==nombreCatalogoParaDiccionario){
                            diccionarioNombres=store.catlogsForFilters[i].diccNames;
                            
                    }
            } 
            
            for(var i=0; i < store.apiDataSources.length; i++){
          
                if(store.apiDataSources[i].varName=="pendientesEstado"){
                        
                        serviceName=store.apiDataSources[i].serviceName;
                        apiURL=store.apiDataSources[i].apiURL;
                }

            }

            if(serviceName && apiURL){

                var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
                var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
                       
                // FILTROS****
                var params="";
                       
                for(var j=0; j < store.catlogsForFilters.length; j++){
    
                    if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined ){
    
                        params+="&"+store.catlogsForFilters[j].storeProcedureField+"="+store.catlogsForFilters[j].diccNames[ $("#"+store.catlogsForFilters[j].id).val() ];
    
                    }
    
                }

                //FILTRO DE MASIVO
                if($("#masivos_cb").val() == "Todos" || $("#masivos_cb").val() == ""){

                        params+="&masivos=Todos";               

                }else if($("#masivos_cb").val() == "SinMasivos"){

                        params+="&masivos=Sin Masivos"; 

                }else if($("#masivos_cb").val() == "SoloMasivos"){

                        params+="&masivos=Solo Masivos"; 
                        
                }

                //ID de entidad
                params+="&idSpider="+entity.key;

                var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                console.log(URL);  

                if(URL.indexOf("undefined" < 0)){

                    dataLoader.AddLoadingTitle("Pendientes por Estado");

                    d3.json(URL, function (error, data) {

                                    dataLoader.DeleteLoadingTitle("Fillrate"); 

                                    dataLoader.HideLoadings();

                                    $("#cargando").css("visibility","hidden");

                                    if(error){
                                        alert("Error API Pendientes Estados",error);
                                        resolve();
                                        return;
                                    }

                                    if(data.error){
                                        alert("Error API Pendientes Estados",data.error);
                                        resolve();
                                        return;
                                    }

                                    console.log("Pendientes Estados",data.recordset); 

                                    var maximo1=0;
                                    var maximo2=0;

                                    var arrTemp=[];

                                    var arr=d3.nest()
                                        .key(function(d) { return d.EstadoDem; })
                                        .entries(data.recordset);  

                                    for(var i=0; i < arr.length; i++ ){

                                        arr[i].Libre_Pendiente_Hoy=0;
                                        arr[i].Libre_Retrasado=0;

                                        for(var j=0; j < arr[i].values.length; j++ ){        
                                        
                                            arr[i].Libre_Pendiente_Hoy+=Number(arr[i].values[j].Libre_Pendiente_Hoy);
                                            arr[i].Libre_Retrasado+=Number(arr[i].values[j].Libre_Retrasado);
                                
                                        }

                                        if(maximo1 < arr[i].Libre_Pendiente_Hoy){
                                            maximo1 = arr[i].Libre_Pendiente_Hoy;
                                        }
                                
                                        if(maximo2 < arr[i].Libre_Retrasado){
                                            maximo2= arr[i].Libre_Retrasado;
                                        }

                                    }

                                    arr = arr.sort((a, b) => b.Libre_Pendiente_Hoy - a.Libre_Pendiente_Hoy);    
                                    //arr.reverse();

                                    var altura=30;
                                    var caso=0;

                                    var svgTooltipHeight=(arr.length*altura )+150;

                                    if(svgTooltipHeight<150)
                                        svgTooltipHeight=150;

                                    if(svgTooltipHeight>windowHeight*.7)
                                        svgTooltipHeight=windowHeight*.7;

                                    var svgTooltipWidth=400;
                                    var marginLeft=svgTooltipWidth*.2;
                                    var tamanioFuente=altura*.4;
                                    var marginTop=35;

                                    $("#toolTip4").css("visibility","visible");      
                                    $("#toolTip4").css("right","1%");
                                    $("#toolTip4").css("bottom","1%");
                                

                                    // DATOS 
                                    var data = arr.map(function(item) {
                                        return {
                                        key: item.key,
                                        "Libre_Pendiente_Hoy": item.Libre_Pendiente_Hoy,
                                        "Libre_Retrasado": item.Libre_Retrasado,
                                       
                                        };
                                        });


                                    // DEFINE COLUMNAS      
                                    var columns = [
                                        { key: "key", header: "Estado", sortable: true, width: "100px" },
                                        { key: "Libre_Pendiente_Hoy", header: "Libre Pendiente Hoy (TM)", sortable: true, width: "150px" },
                                        { key: "Libre_Retrasado", header: "Libre Retrasado (TM)", sortable: true, width: "150px" },
                                      
                                    ];

                                    // DEFINE VISITORS PARA CADA COLUMNA   
                                    var columnVisitors = {
                                        key: function(value) {
                                            return `<div>${value}
                                            </div>`;
                                        },                                   
                                       
                                        Libre_Pendiente_Hoy: function(value){
                                    
                                            var barWidth = (value/maximo1)*100 + '%';
                                            var barValue = vix_tt_formatNumber(value)+'%   ';
                                        
                                            return '<div class="bar-container">' +
                                            '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
                                            + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: #0096E3;"></rect></svg>' +        
                                            '</div>';
                                        },
                                        Libre_Retrasado: function(value){
                                    
                                            var barWidth = (value/maximo1)*100 + '%';
                                            var barValue = vix_tt_formatNumber(value)+'TM   ';
                                    
                                        return '<div class="bar-container">' +
                                        '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
                                        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: #0096E3;"></rect></svg>' +        
                                        '</div>';
                                        }
                                    };

                                    // FORMATEA DIV :
                                    vix_tt_formatToolTip("#toolTip4","Pendientes por Estado de "+entity.key,400);

                                    // COLUMNAS CON TOTALES :
                                    var columnsWithTotals = ['Libre_Pendiente_Hoy','Libre_Retrasado']; 
                                    var totalsColumnVisitors = {
                                                'Libre_Pendiente_Hoy': function(value) { 
                                                return vix_tt_formatNumber(value) + " TM";
                                                },
                                                'Libre_Retrasado': function(value) { 
                                                return vix_tt_formatNumber(value) + " TM"; 
                                                }
                                                };   
    
     
    
                                    // CREA TABLA USANDO DATOS                                        
                                    vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip4", columnsWithTotals );

                                    // APLICA TRANSICIONES
                                    vix_tt_transitionRectWidth("toolTip4");


                    });
                }                

            }else{
                alert("Error al encontrar URL API Pendienetes por Estado");
                
            }

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

    var fechas={};        

    for(var i=0; i < arr.length; i++ ){

        arr[i].Libre_Pendiente_Hoy=0;
        arr[i].Libre_Retrasado=0;
        arr[i].Total=0;
        arr[i].fecha=arr[i].values[0].fecha.getTime();

        fechas[arr[i].values[0].fecha.getDate()+"_"+arr[i].values[0].fecha.getDay()]=true;

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].Libre_Retrasado+=Number(arr[i].values[j].Libre_Retrasado);
            arr[i].Libre_Pendiente_Hoy+=Number(arr[i].values[j].Libre_Pendiente_Hoy);
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

    var arrTemp=[];

    var dia=((1000*60)*60)*24;
   
    for(var i=0; i < arr.length; i++ ){

        arrTemp.push(arr[i]);
        
            var date_=new Date(arr[i].fecha);
            
            if(date_.getDay()==5){

                    var sabado=new Date(arr[i].fecha+dia);
                    
                    if(!fechas[sabado.getDate()+"_"+sabado.getDay()] ){
                    
                            arrTemp.push({
                                Libre_Pendiente_Hoy:0,
                                Libre_Retrasado:0,
                             
                                fecha:new Date(arr[i].fecha+dia+dia),
                                Total:0,
                                agregado:true,
                                key:arr[i].fecha+dia
                            });

                    }

            }

           
            if(date_.getDay()==6){
            
                    var domingo=new Date(arr[i].fecha+dia+dia );
                   
                    if(!fechas[domingo.getDate()+"_"+domingo.getDay()] ){
                       
                            arrTemp.push({
                                Libre_Pendiente_Hoy:0,
                                Libre_Retrasado:0,
                             
                                fecha:new Date(arr[i].fecha+dia+dia),
                                Total:0,
                                agregado:true,
                                key:arr[i].fecha+dia+dia
                            });

                    }
            }

    }

    arr=arrTemp; 
    var ancho=17;

    var svgTooltipWidth=arr.length*ancho;

    if(svgTooltipWidth < 100)
        svgTooltipWidth=100;

    var svgTooltipHeight=290;
    var tamanioFuente=ancho*.7;   

    var marginBottom=svgTooltipHeight*.28;


    $("#toolTip3").css("visibility","visible");            
    $("#toolTip3").css("inset","");         
    $("#toolTip3").css("left","10%");  
    $("#toolTip3").css("bottom","1%");
  


    // FORMATEA TOOL TIP :
    
    vix_tt_formatToolTip("#toolTip3","Pedidos Pendientes por Día de "+entity.key,svgTooltipWidth+30);

    // Agrega un div con un elemento svg :

    var svgElement = `<img id="simbologia" src="images/simb FR libre.png" style="width:340px;position:absolute;float:left;right:7px;bottom:10px;"></img><svg id='svgTooltip3' style='pointer-events:none;'></svg>`;
    d3.select("#toolTip3").append("div").html(svgElement);

    d3.select("#svgTooltip3")                     
        .style("width", svgTooltipWidth+"px" )
        .style("height", svgTooltipHeight+"px" )
                    ;

    for(var i=0; i < arr.length; i++ ){   

        var altura=svgTooltipHeight*.5;
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
                .attr("transform"," translate("+String( (ancho*i)+tamanioFuente-2  )+","+String( (svgTooltipHeight)-altura1-altura2-marginBottom-9   )+")  rotate("+(-90)+") ")
                .text(function(){
                
                    return  formatNumber(arr[i].Total) ;

                });

        d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","penDetail")
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
                
    }

}


kpiExpert_PENDIENTES.DrawTooltipDetail_Tipo=function(entity){    

    var maximo=0;

    var dataElement=entity.pendientes.values[0];

    var campos=["Entregado:","Libre_Retrasado","Libre_Pendiente_Hoy","Libre_Programado_Total","AutoFlete y Recogido:","Libre_RecAutf",];
    var colores=["#00DEFF","#00DEFF","#00DEFF","#00DEFF","#8BFF1A","#8BFF1A",];

    for(var i=0; i < campos.length; i++ ){
        console.log(Number(dataElement[campos[i]]));
        if(maximo < Number(dataElement[campos[i]]) ){
            maximo = Number(dataElement[campos[i]]);
        } 
    }

    var altura=30;
    var caso=0;

    var svgTooltipHeight=campos.length*altura;
    var svgTooltipWidth=500;
    var marginLeft=svgTooltipWidth*.4;
    var tamanioFuente=altura*.5;
    var marginTop=svgTooltipHeight*.05;

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("top",1+"%");
    $("#toolTip2").css("left","1px");
 

    vix_tt_formatToolTip("#toolTip2","Pedidos Pendientes por Tipo de "+entity.key,svgTooltipWidth,svgTooltipHeight+50);

    var svgElement = "<svg id='svgTooltip' style='pointer-events:none;'></svg>";
    d3.select("#toolTip2").append("div").html(svgElement);

    d3.select("#svgTooltip")                     
        .style("width", svgTooltipWidth )
        .style("height", svgTooltipHeight+"px" )
                    ;



    for(var i=0; i < campos.length; i++ ){

        if( !dataElement[campos[i]] ){

            d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","penDetail")
                        .style("fill",colores[caso])		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( 10  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){
                        
                            return campos[i];
                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 )
                    ;

        }else{


            var ancho=GetValorRangos(  Number(dataElement[campos[i]]) ,1, maximo ,1,svgTooltipWidth*.4);
        
            d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","penDetail")
                        .style("fill",colores[caso])		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente*.8)
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( ancho+(marginLeft)+10  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){
            
                            return formatNumber((Math.round(   (Number(dataElement[campos[i]])))))+" TM";
            })
            .transition().delay(0).duration(1000)
            .style("opacity",1 )
        ;                  
           
            d3.select("#svgTooltip").append("rect")		    		
                        .attr("width",1 )
                        .attr("class","penDetail")
                        .attr("x",marginLeft   )
                        .attr("y", (altura*caso)+marginTop )
                        .attr("height",altura*.4)                        
                        .attr("fill",colores[caso])
                        .transition().delay(0).duration(1000)
                        .attr("width",ancho )
                        ;

            

            d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","penDetail")
                        .style("fill",colores[caso])		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente*.8)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( 10  )+","+String( altura*caso+(tamanioFuente)+marginTop   )+")  rotate("+(0)+") ")
                        .text(function(){
                        
                            return config.checkLabel(campos[i]);
                        })
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 )
                    ;

          

        }
        caso++;

    }
}