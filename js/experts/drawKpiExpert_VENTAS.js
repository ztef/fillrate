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
  
    
    d3.select("#svgTooltip").selectAll(".ventasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ventasDetail").data([]).exit().remove();
    
    
    drawKpiExpert_VENTAS.DrawTooltipDetail_Estado(entity);

    drawKpiExpert_VENTAS.DrawTooltipDetail_Producto_Presentacion(entity);

    opacidadCesium=30;
      $("#cesiumContainer").css("opacity",opacidadCesium/100); 


      // DISTRIBUYE 
      vix_tt_distributeDivs(["#toolTip2","#toolTip3"]);  

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

    if(svgTooltipHeight < 160)
      svgTooltipHeight=160;

    var svgTooltipWidth=600;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;
 
    

    $("#toolTip3").css("visibility","visible"); 
    $("#toolTip3").css("inset","");           
    $("#toolTip3").css("top","80px");
    $("#toolTip3").css("right","1%");
    
    if(windowWidth > 1500 ){

      $("#toolTip2").css("top","80px");
      $("#toolTip3").css("left",windowWidth*.5+"px");
     
    }

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
    { key: "Peso", header: "Peso", sortable: true,  width: "80px" }
  ];


   // DEFINE VISITORS PARA CADA COLUMNA


  var columnVisitors = {
    key: function(value) {
        return `<div>${value}
        </div>`;
      },

    VolumenPlan: function(value) {
      return vix_tt_formatNumber(value) ;
    },
    VolumenReal: function(value) {
        return vix_tt_formatNumber(value) ;
    },
    DifK: function(value) {
        return vix_tt_formatNumber(value) ;
    },
    DifP: function(value){

        if(value<0)
        value=0;

        if(value > 150 && value!=Infinity)
          value=150;          

        if(value!=Infinity){

          var barWidth = value*.66 + '%';
          var barValue = vix_tt_formatNumber(value)+'%   ';

        }else{

          var barWidth =  '0%';
          var barValue = vix_tt_formatNumber(0)+'%   ';

        }         
    
        return '<div class="bar-container">' +
        '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10px">'  
        + '<rect class="bar-rect" width="' + barWidth + '" height="10px" style="fill: white;"></rect></svg>' +        
        '</div>';
    },
    Peso: function(value){
  
        var barWidth = (value/maximoVolumen)*100 + '%';
        var barValue = vix_tt_formatNumber(value)+'TM';
   
       return '<div class="bar-container">' +
       '<svg width="100%" height="10px"><rect class="bar-rect" width="' + barWidth + '" height="10px" style="fill: yellow;"></rect></svg>' +      
       '</div>';
    }
  };


  // FORMATEA DIV :

  vix_tt_formatToolTip("#toolTip3","Detalle de Ventas por Producto y Presentación",svgTooltipWidth,svgTooltipHeight);

  
        // COLUMNAS CON TOTALES :

        var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK']; 
        var totalsColumnVisitors = {
                  'VolumenPlan': function(value) { 
                    return vix_tt_formatNumber(value) ;
                  },
                  'VolumenReal': function(value) { 
                    return vix_tt_formatNumber(value) ; 
                  },
                  'DifK': function(value) { 
                    return vix_tt_formatNumber(value) ; 
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

    if(svgTooltipHeight < 160)
      svgTooltipHeight=160;

    if(svgTooltipHeight > windowHeight*.8 )
      svgTooltipHeight=windowHeight*.8;


    var svgTooltipWidth=600;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("top","80px");
    $("#toolTip2").css("left",radio*.7+"px");

    if(windowWidth > 1500 ){
             
        $("#toolTip2").css("left",radio+"px");
     
    }   

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
        { key: "VolumenPlan", header: "Vol Plan (TM)", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real (TM)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (TM)", sortable: true, width: "100px" },
        { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Peso", sortable: true,  width: "80px" }
      ];
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick=" backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_estado')">${value}
            </div>`;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) ;
        },
        DifP: function(value){
      
          if(value<0)
            value=0;

          if(value > 150 && value!=Infinity)
            value=150;          

          if(value!=Infinity){
            var barWidth = value*.66 + '%';
            var barValue = vix_tt_formatNumber(value)+'%   ';
          }else{
            var barWidth =  '0%';
            var barValue = vix_tt_formatNumber(0)+'%   ';
          }      
        
            return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
        '</div>';
    
        },
        Peso: function(value){
      

           var barWidth = (value/maximoVolumen)*100 + '%';
           var barValue = vix_tt_formatNumber(value)+'TM';
      
          return '<div class="bar-container">' +
          
          '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: yellow;"></rect></svg>' +
          
          '</div>';

    
        }
      };


           // COLUMNAS CON TOTALES :

           var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK']; 
           var totalsColumnVisitors = {
                     'VolumenPlan': function(value) { 
                       return vix_tt_formatNumber(value) ;
                     },
                     'VolumenReal': function(value) { 
                       return vix_tt_formatNumber(value) ; 
                     },
                     'DifK': function(value) { 
                       return vix_tt_formatNumber(value) ; 
                     }
                     };

      // FORMATEA DIV :
   
      vix_tt_formatToolTip("#toolTip2","Detalle de Ventas por Estado",svgTooltipWidth,svgTooltipHeight);
  
    
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