var kpiExpert_Flota={};

kpiExpert_Flota.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".flotaDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".flotaDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".flotaDetail").data([]).exit().remove();
    svgLines2.selectAll(".windowsContext").data([]).exit().remove();

}

kpiExpert_Flota.DrawTooltipDetail=function(entity){    
 
    d3.select("#svgTooltip").selectAll(".flotaDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".flotaDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".flotaDetail").data([]).exit().remove();

    
    kpiExpert_Flota.DrawTooltipDetail_Origen(entity);
    kpiExpert_Flota.DrawTooltipDetail_Presentacion(entity);
    //kpiExpert_Flota.DrawTooltipDetail_PorDia(entity);

    opacidadCesium=30;
    $("#cesiumContainer").css("opacity",opacidadCesium/100); 
    

     // DISTRIBUYE 
     vix_tt_distributeDivs(["#toolTip2","#toolTip3","#toolTip4"]);  

}

kpiExpert_Flota.DrawTooltipDetail_PorDia=function(entity){   

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
        if(store.apiDataSources[i].varName=="flotaDia"){
                
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
    
                    if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined && $("#"+store.catlogsForFilters[j].id).val() != "Todos" ){
    
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

                      dataLoader.AddLoadingTitle("Flota por Día");

                      d3.json(URL, function (error, data) {

                        dataLoader.DeleteLoadingTitle("Flota por Día"); 

                        dataLoader.HideLoadings();

                        $("#cargando").css("visibility","hidden");

                        if(error){
                            alert("Error API Flota por Día",error);
                            resolve();
                            return;
                        }

                        if(data.error){
                            alert("Error API Flota por Día",data.error);
                            resolve();
                            return;
                        }

                        console.log(" API Flota por Día",data.recordset);

                        var maxDate=0;

                        for(var j=0;  j < data.recordset.length; j++){

                                if(data.recordset[j].Fecha!=""){

                                      if( data.recordset[j].Fecha.indexOf("T") > -1){
                    
                                              var fechaSplit=data.recordset[j].Fecha.split("T");
                                              
                                              fechaSplit=fechaSplit[0].split("-");                   
                      
                                      }else{
                                              
                                              var fechaSplit=data.recordset[j].Fecha.split("-");
                        
                                      }  
                                      
                                      data.recordset[j].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2])); 

                                      if(maxDate < data.recordset[j].fecha.getTime())
                                          maxDate = data.recordset[j].fecha.getTime();
                                }

                        }

                        // VALIDA DIAS FALTANTES *****

                        var diasDelPeriodo={};
                        var data_=[];

                        for(var i=0; i < data.recordset.length; i++ ){

                              if(data.recordset[i].fecha){
                                if(data.recordset[i].Fecha.indexOf("1900") > -1)
                                console.log("registra fecha:", data.recordset[i]);
                                      diasDelPeriodo[ data.recordset[i].fecha.getTime() ]=true;
                                      data_.push(data.recordset[i]);

                              }else{
                                      
                              }
  
                        }

                        var dia=((1000*60)*60)*24;
                        var init=dateInit.getTime();
                        var end=dateEnd.getTime();

                        for(var i=init; i < end+1000; i+=((1000*60)*60)*24 ){

                              if(!diasDelPeriodo[new Date(i).getTime()]){
                                    
                                      var obj={};
                                      obj.VolumenPlan=0;
                                      obj.Deficit=0;
                                      obj.fecha=new Date(i);
                                      data_.push(obj);
                              }
  
                        }

                        data.recordset=data_;

                        var maximo=0;

                        var arr=d3.nest()
                                      .key(function(d) { 

                                              if(d.fecha){
                                                      return d.fecha.getTime(); 
                                              }else{                       
                                                      return 0;
                                              }                        
                              
                                      })
                                      .entries(data.recordset);

                        for(var i=0; i < arr.length; i++ ){

                              arr[i].Deficit=0;

                              for(var j=0; j < arr[i].values.length; j++ ){

                                  arr[i].Deficit+=Number(arr[i].values[j].Deficit);
                                  
                              }
                              
                              if(maximo < Math.abs( arr[i].Deficit)*100  ){
                                maximo=Math.abs( arr[i].Deficit)*100;
                              }

                        }

                        arr = arr.sort((a, b) => {   

                          return b.fecha - a.fecha;                                    
          
                        });

                        var ancho=18;
                          var caso=0;    

                          var svgTooltipWidth=arr.length*(ancho*1.05) ;

                          if(svgTooltipWidth < 250)
                                svgTooltipWidth=250;
                  
                          var svgTooltipHeight=260;

                          var tamanioFuente=ancho*.75;  

                          $("#toolTip4").css("visibility","visible");        
                          $("#toolTip4").css("max-height","");    
                          $("#toolTip4").css("bottom",4+"px");
                          $("#toolTip4").css("right",30+"px");

                          if(windowWidth > 1500 ){

                            $("#toolTip4").css("top",80+"px");
                            $("#toolTip4").css("left",windowWidth/2+"px");
                           
                          }                         

                          vix_tt_formatToolTip("#toolTip4","Déficit por Día "+dataManager.getNameFromId(entity.key),svgTooltipWidth+7,svgTooltipHeight);               
                          
                          var svgElement =  `<svg id='svgTooltip4' style='pointer-events:none;'></svg>`;
                          
                          d3.select("#toolTip4").append("div").html(svgElement); 

                          for(var i=0; i < arr.length; i++ ){

                                var altura=(svgTooltipHeight*.35);
                                var altura1=Math.abs(GetValorRangos( arr[i].Deficit*100,1, maximo ,1,altura));

                                console.log(arr[i].Deficit,altura1,maximo);

                                d3.select("#svgTooltip4").append("rect")		    		
                                                .attr("width",ancho*.9 )
                                                .attr("class","ventasDetail")
                                                .attr("x",(ancho*caso)  )
                                                .attr("y", ((svgTooltipHeight*.8))-altura1-60  )
                                                .attr("height",1)
                                                .attr("fill","#00A8FF")
                                                .transition().delay(0).duration(i*50)
                                                .style("height",altura1 )	
                                                ;

                                d3.select("#svgTooltip4")
                                                .append("text")						
                                                .attr("class","frDetail")
                                                .style("fill","#ffffff")		
                                                .style("font-family","Cabin")
                                                .style("font-weight","bold")
                                                .style("font-size",tamanioFuente*.8)						
                                                .style("text-anchor","start")
                                                .style("opacity",0 )
                                                .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)+1  )+","+String( ((svgTooltipHeight*.8))-altura1-64 )+")  rotate("+(-90)+") ")
                                                .text(function(){
                                                  
                                                  var porDif="0";

                                                  if(arr[i].VolumenPlan>0){

                                                    porDif = Math.round((arr[i].VolumenReal/arr[i].VolumenPlan)*100);

                                                  }

                                                return  formatNumber(arr[i].Deficit);
                        
                                                })
                                                .transition().delay(0).duration(i*50)
                                                .style("opacity",1 );
                                

                                d3.select("#svgTooltip4")
                                                .append("text")						
                                                .attr("class","frDetail")
                                                .style("fill","#ffffff")		
                                                .style("font-family","Cabin")
                                                .style("font-weight","bold")
                                                .style("font-size",tamanioFuente*.8)	
                                                .style("text-anchor","end")
                                                .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)  )+","+String( (svgTooltipHeight*.8)-54  )+")  rotate("+(-90)+") ")
                                                .text(function(){
                                                        
                                                var date=new Date( Number(arr[i].key) );
        
                                                return  date.getDate()+" "+getMes(date.getMonth());
                        
                                                });

                                caso++;
                          }
                          

                          d3.select("#svgTooltip4")                     
                                .style("width", svgTooltipWidth )
                                .style("height", (svgTooltipHeight) )
                                ;

                });

              }
    }

}

kpiExpert_Flota.DrawTooltipDetail_Presentacion=function(entity){   

        var maximo=0;

        var arr=d3.nest()
              .key(function(d) { return d.Presentacion; })
              .entries(entity.flota.values);

        for(var i=0; i < arr.length; i++ ){

            arr[i].Deficit=0;
            for(var j=0; j < arr[i].values.length; j++ ){
    
                arr[i].Deficit+=Number(arr[i].values[j].Deficit);
            }
           
            if(maximo < Math.abs( arr[i].Deficit)*100  ){
                maximo=Math.abs( arr[i].Deficit)*100;
            }
    
        }

        arr = arr.sort((a, b) => b.Deficit - a.Deficit );
        arr.reverse();

        var svgTooltipWidth=350;
        var altura=30;

        var tamanioFuente=altura*.5;

        if(tamanioFuente < 12)
          tamanioFuente=12;

        $("#toolTip3").css("visibility","visible");  
        $("#toolTip3").css("inset","");           
        $("#toolTip3").css("top",170+"px");
          $("#toolTip3").css("left",radio+"px");

        if(windowWidth > 1500 ){

          $("#toolTip3").css("top",170+"px");
          $("#toolTip3").css("left",radio+"px");
         
        }

        // DATOS 
        var data = arr.map(function(item) {
              return {
                key: item.key,
                "Deficit": item.Deficit         
              };
          });

        // DEFINE COLUMNAS      
        var columns = [
          { key: "key", header: "Origen", sortable: true, width: "150px" },
          { key: "Deficit", header: "Deficit", sortable: true, width: "150px" }
       
        
        ];

        // DEFINE VISITORS PARA CADA COLUMNA
        var columnVisitors = {
              key: function(value) {
                  return `<div class="key-selector" onclick="">${value}
                  </div>`;
                },
          
                Numero: function(value) {
                return vix_tt_formatNumber(value);
              },
            
              Deficit: function(value){
                  console.log(maximo,Math.abs(value)*100);
                  var barWidth = (Math.abs(value)*100/maximo)*100 + '%';
                  var barValue = formatNumber(value,2);
              
                  return '<div class="bar-container">' +
                  '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
                  + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
                '</div>';
              }
        };


        // FORMATEA DIV :
      
      vix_tt_formatToolTip("#toolTip3","Déficit de Flota por Presentación "+dataManager.getNameFromId(entity.key),svgTooltipWidth);
      
      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['Deficit']; 
      var totalsColumnVisitors = {
                  'Deficit': function(value) { 
                  return formatNumber(value,2); 
                  }              
                
                };
                
      // CREA TABLA USANDO DATOS
      
      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip3", columnsWithTotals );        

      // Crea una barra inferior y pasa una funcion de exportacion de datos
      vix_tt_formatBottomBar("#toolTip3", function () {
        var dataToExport = formatDataForExport(data, columns);
        var filename = "exported_data";
        exportToExcel(dataToExport, filename);
      });
            
        // APLICA TRANSICIONES 
        vix_tt_transitionRectWidth("toolTip3");


}

kpiExpert_Flota.DrawTooltipDetail_Origen=function(entity){   


    d3.select("#svgTooltip").selectAll(".flotaDetail").data([]).exit().remove();

    var maximo=0;
    
    var arr=d3.nest()
        .key(function(d) { return d.Origen; })
        .entries(entity.flota.values);  

    for(var i=0; i < arr.length; i++ ){
        arr[i].Deficit=0;
        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].Deficit+=Number(arr[i].values[j].Deficit);
        }
        console.log(arr[i].Deficit);
        if(maximo < Math.abs( arr[i].Deficit)*100  ){
            maximo=Math.abs( arr[i].Deficit)*100;
        }

    }

    arr = arr.sort((a, b) => b.Deficit - a.Deficit );
    arr.reverse();

       

    var svgTooltipWidth=350;
    var altura=30;

    var svgTooltipHeight=(arr.length*(altura) );
 
    if(svgTooltipHeight>windowHeight*.8){
 
      svgTooltipHeight=windowHeight*.8;
    }
     

    var tamanioFuente=altura*.5;
    if(tamanioFuente < 12)
    tamanioFuente=12;

    $("#toolTip2").css("visibility","visible");            
   
    $("#toolTip2").css("top",170+"px");
    $("#toolTip2").css("left",windowWidth*.65+"px");

    if(windowWidth > 1500 ){

      $("#toolTip2").css("top",170+"px");
      $("#toolTip2").css("left",windowWidth*.65+"px");
     
    }

    // DATOS 
    var data = arr.map(function(item) {
        return {
          key: item.key,
          "Deficit": item.Deficit         
        };
        });
    
        // DEFINE COLUMNAS
      
        var columns = [
            { key: "key", header: "Origen", sortable: true, width: "150px" },
            { key: "Deficit", header: "Deficit", sortable: true, width: "150px" }
         
          
          ];

          // DEFINE VISITORS PARA CADA COLUMNA
    
    
        var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_un')">${value}
            </div>`;
          },
    
          Numero: function(value) {
          return vix_tt_formatNumber(value);
        },
       
        Deficit: function(value){
            
            var barWidth = (Math.abs(value)*100/maximo)*100 + '%';
            var barValue = formatNumber(value,2);
        
            return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
            + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
          '</div>';
        }
      };

      // FORMATEA DIV :
      
      vix_tt_formatToolTip("#toolTip2","Déficit de Flota por Origen "+dataManager.getNameFromId(entity.key),svgTooltipWidth,svgTooltipHeight+130);
      
            // COLUMNAS CON TOTALES :
    
            var columnsWithTotals = ['Deficit']; 
            var totalsColumnVisitors = {
                        'Deficit': function(value) { 
                        return formatNumber(value,2) ; 
                        }
                      
                      
                      };
                      
      // CREA TABLA USANDO DATOS
      
      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );        

      // Crea una barra inferior y pasa una funcion de exportacion de datos
      vix_tt_formatBottomBar("#toolTip2", function () {
        var dataToExport = formatDataForExport(data, columns);
        var filename = "exported_data";
        exportToExcel(dataToExport, filename);
      });       
            
            
      // APLICA TRANSICIONES
       vix_tt_transitionRectWidth("toolTip2");
 

}