var drawKpiExpert_VENTAS={};


drawKpiExpert_VENTAS.DrawElement=function(entity,i){      
      
  var altura1=GetValorRangos(entity.ventas.ventas,1 ,100 ,1 ,entity.altura );

  if(altura1 < 0)
      altura1=1;

  if(altura1 == NaN || String(altura1) == "NaN" )
      return;

  if(altura1>entity.altura)
      altura1=entity.altura;

  var color="#cccccc";
  if(entity.ventas.ventas > 100){
      color="#11EC00";
  }else if(entity.ventas.ventas <= 100 && entity.ventas.ventas >= 95){
      color="#94FF3F";
  }else if(entity.ventas.ventas <= 95 && entity.ventas.ventas >= 90){
    color="#FCED00";
  }else if(entity.ventas.ventas < 90){
      color="#FF0000";
  }

  var geometry1= viewer.entities.add({
          name : '',
          position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura1/2)  ),
          cylinder : {
              length : altura1,
              topRadius : entity.radio*.9,
              bottomRadius : entity.radio*.9,
              material : Cesium.Color.fromCssColorString(color).withAlpha(1)              
              
          }
  });

  mapElementsArr.push(geometry1);						

  //VASO EXTERIOR
  var geometryExt= viewer.entities.add({
      name : '',
      position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (entity.altura/2)  ),
      cylinder : {
              length : entity.altura+(entity.altura*.04),
              topRadius : entity.radio,
              bottomRadius : entity.radio,
              material : Cesium.Color.fromCssColorString("#FFFFFF").withAlpha(.2)              
              
      }
  });

  entity.geometries=[geometry1,geometryExt];
  mapElementsArr.push(geometryExt);
  mapElements[geometryExt.id]=entity; 
  
  if(i < 100){

          entity.labelSVG=svgLines.append("text")                            
                  .attr("x",0 )
                  .attr("y", 0   )
                  .style("fill","#FFFFFF")
                  .attr("filter","url(#dropshadowText)")
                  .attr("class","entityLabel")                                    
                  .style("font-family","Cabin")
                  .style("text-anchor","middle")
                  .style("font-weight","normal")
                  .style("font-size",12)                                
                  .text( function(d){
                      
                  return entity.ventas.ventas+"%";
                  
                  });

  }

  if(Stage.labelsInterval)        
          clearInterval(Stage.labelsInterval);
 
  Stage.labelsInterval = setInterval(function(){ Stage.DrawFRLabels(); }, 50);

}


drawKpiExpert_VENTAS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".ventasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ventasDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");

}


drawKpiExpert_VENTAS.DrawTooltipDetail=function(entity){   
  /*
    var positions=Stage.SetWindowPos([
        {
            idealWidh:6*120,
            minWidth:6*80,
        },
        {
          idealWidh:6*120,
          minWidth:6*80,
        }
    ]
    );
    */
    
    d3.select("#svgTooltip").selectAll(".ventasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ventasDetail").data([]).exit().remove();
    
    drawKpiExpert_VENTAS.DrawTooltipDetail_Producto_Presentacion(entity);
    drawKpiExpert_VENTAS.DrawTooltipDetail_Estado(entity);

    opacidadCesium=.3;
    $("#cesiumContainer").css("opacity",opacidadCesium/100);

}         

drawKpiExpert_VENTAS.DrawTooltipDetail_Producto_Presentacion=function(entity){    

    var maximo=0; 
    var maximoVolumen=0;

    var arr=d3.nest()
            .key(function(d) { return d.AgrupProducto; })
            .entries(entity.ventas.values);

    for(var i=0; i < arr.length; i++ ){

        arr[i].Dif=0;
       
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;
       
        arr[i].Peso=0;

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
           
            arr[i].Peso+=Number(arr[i].values[j].Peso);
            
        }

        if(arr[i].VolumenReal>0){
            arr[i].difPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            arr[i].difVal=arr[i].VolumenReal-arr[i].VolumenPlan;
        }else{
            arr[i].difPer=0;
        }

        arr[i].difPer=arr[i].difPer*100;

        if(maximo < arr[i].difPer){
            maximo=arr[i].difPer;
        }

        if(maximoVolumen < arr[i].Peso){
            maximoVolumen=arr[i].Peso;
        }


    }

    arr = arr.sort((a, b) => b.difVal - a.difVal); 
    arr.reverse(); 

    var altura=30;
    var caso=0;
   
    var svgTooltipHeight=(arr.length*altura)+120;
    var svgTooltipWidth=550;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;
 
    

    $("#toolTip3").css("visibility","visible"); 
    $("#toolTip3").css("inset","");           
    $("#toolTip3").css("bottom","1%");
    $("#toolTip3").css("right","1%");
    

    
    /* 

        VIX_TT  : Prepara datos para el tool tip

    */


    // DATOS 

    var data = arr.map(function(item) {
    return {
      key: item.key,
      "VolumenPlan": item.VolumenPlan,
      "VolumenReal": item.VolumenReal,
      "DifK": item.VolumenReal - item.VolumenPlan,
      "DifP":  ((item.VolumenReal / item.VolumenPlan) ) * 100,
      "Peso": item.Peso,
    };
    });
  

    // DEFINE COLUMNAS
  
  var columns = [
    { key: "key", header: "Producto", sortable: true, width: "100px" },
    { key: "VolumenPlan", header: "Vol Plan (TM)", sortable: true, width: "100px" },
    { key: "VolumenReal", header: "Vol Real (TM)", sortable: true, width: "100px" },
    { key: "DifK", header: "Dif (TM)", sortable: true, width: "100px" },
    { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
    { key: "Peso", header: "Volumen Real", sortable: true,  width: "100px" }
  ];


   // DEFINE VISITORS PARA CADA COLUMNA


  var columnVisitors = {
    key: function(value) {
        return `<div>${value}
        </div>`;
      },

    VolumenPlan: function(value) {
      return vix_tt_formatNumber(value) + "TM";
    },
    VolumenReal: function(value) {
        return vix_tt_formatNumber(value) + "TM";
    },
    DifK: function(value) {
        return vix_tt_formatNumber(value) + "TM";
    },
    DifP: function(value){
  
        var barWidth = value + '%';
        var barValue = vix_tt_formatNumber(value)+'%   ';
    
        return '<div class="bar-container">' +
        '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10px">'  
        + '<rect class="bar-rect" width="' + barWidth + '" height="10px" style="fill: white;"></rect></svg>' +        
        '</div>';
    },
    Peso: function(value){
  
        var barWidth = (value/maximoVolumen)*100 + '%';
        var barValue = vix_tt_formatNumber(value)+'TM';
   
       return '<div class="bar-container">' +
       '<span class="bar-value" style="width:30px"></span>' +
       '<svg width="100%" height="10px"><rect class="bar-rect" width="' + barWidth + '" height="10px" style="fill: yellow;"></rect></svg>' +      
       '</div>';
    }
  };


  // FORMATEA DIV :

  vix_tt_formatToolTip("#toolTip3","Detalle de Ventas por Producto y Presentación",700,svgTooltipHeight);

  
        // COLUMNAS CON TOTALES :

        var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK']; 
        var totalsColumnVisitors = {
                  'VolumenPlan': function(value) { 
                    return vix_tt_formatNumber(value) + "TM";
                  },
                  'VolumenReal': function(value) { 
                    return vix_tt_formatNumber(value) + "TM"; 
                  },
                  'DifK': function(value) { 
                    return vix_tt_formatNumber(value) + "TM"; 
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

drawKpiExpert_VENTAS.DrawTooltipDetail_Estado=function(entity){    

    var maximo=0; 
    var maximoVolumen=0;   
   
    var arr=d3.nest()
            .key(function(d) { return d.EstadoDem; })
            .entries(entity.ventas.values);
          

    for(var i=0; i < arr.length; i++ ){

        arr[i].Dif=0;
       
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;
       
        arr[i].Peso=0;

        for(var j=0; j < arr[i].values.length; j++ ){

            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
           
            arr[i].Peso+=Number(arr[i].values[j].Peso);
            
        }       

        if(arr[i].VolumenReal>0){
            arr[i].difPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            arr[i].difVal=arr[i].VolumenReal/arr[i].VolumenPlan;
            arr[i].difResta=arr[i].VolumenReal-arr[i].VolumenPlan;
        }else{
            arr[i].difPer=0;
        }

        arr[i].difPer=arr[i].difPer*100;

        if(maximo < arr[i].difPer){
            maximo=arr[i].difPer;
        }
        if(maximoVolumen < arr[i].Peso){
            maximoVolumen=arr[i].Peso;
        }

    }
    
    arr = arr.sort((a, b) => b.difResta - a.difResta); 
    arr.reverse();

   
    var altura=30;
    var caso=0;

    var svgTooltipHeight=(arr.length*altura)+50;
    var svgTooltipWidth=530;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;

    $("#toolTip2").css("visibility","visible");            

    $("#toolTip2").css("top","100px");
    $("#toolTip2").css("left","10");

   // Daniel, quite estas 2 lineas que estaban colocando la ventana muy arriba :
    
   // if( (mouse_y-100)+(arr.length*altura) > windowHeight  )
      //  $("#toolTip2").css("top",(windowHeight-(arr.length*altura)-150)+"px");

    var toolText =  
        "<span style='color:#fff600'><span style='color:#ffffff'>Detalle Ventas por Estado</span></span>"+               
        "<svg id='svgTooltip'  style='pointer-events:none;'></svg> ";

    $("#toolTip2").html(toolText);


    // DATOS 

    var data = arr.map(function(item) {
        return {

          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  ((item.VolumenReal / item.VolumenPlan) ) * 100,
          "Peso": item.Peso
        };
        });   


      
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Estado", sortable: true, width: "100px" },
        { key: "VolumenPlan", header: "Vol Plan", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (TM)", sortable: true, width: "100px" },
        { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Volumen Real", sortable: true,  width: "100px" }
      ];
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
            </div>`;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) + "TM";
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) + "TM";
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) + "TM";
        },
        DifP: function(value){
      
            var barWidth = value + '%';
            var barValue = vix_tt_formatNumber(value)+'%';
        
            return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
        '</div>';
    
        },
        Peso: function(value){
      

           var barWidth = (value/maximoVolumen)*100 + '%';
           var barValue = vix_tt_formatNumber(value)+'TM';
      
          return '<div class="bar-container">' +
          '<span class="bar-value" style="width:30px"></span>' +
          '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: yellow;"></rect></svg>' +
          
          '</div>';

    
        }
      };


           // COLUMNAS CON TOTALES :

           var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK']; 
           var totalsColumnVisitors = {
                     'VolumenPlan': function(value) { 
                       return vix_tt_formatNumber(value) + "T";
                     },
                     'VolumenReal': function(value) { 
                       return vix_tt_formatNumber(value) + "T"; 
                     },
                     'DifK': function(value) { 
                       return vix_tt_formatNumber(value) + "T"; 
                     }
                     };

      // FORMATEA DIV :
   
      vix_tt_formatToolTip("#toolTip2","Detalle de Ventas por Estado",700);
  
    
      // CREA TABLA USANDO DATOS

      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );

      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip2");   
    
    
}