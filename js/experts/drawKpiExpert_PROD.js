var kpiExpert_PROD={};

kpiExpert_PROD.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".prodDetail").data([]).exit().remove();   
    
    $("#toolTip2").css("visibility","hidden");    

}

kpiExpert_PROD.DrawTooltipDetail=function(entity){   
    
    d3.select("#svgTooltip").selectAll(".prodDetail").data([]).exit().remove();
    kpiExpert_PROD.DrawTooltipDetail_Planta(entity);   

    opacidadCesium=30;
    $("#cesiumContainer").css("opacity",opacidadCesium/100); 

}

kpiExpert_PROD.DrawTooltipDetail_Planta=function(entity){    
       
        var maximo=0; 
        var maximo2=0; 
       
        var arr=d3.nest()
                .key(function(d) { return d.Planta; })
                .entries(entity.produccion.values);          

        
        for(var i=0; i < arr.length; i++ ){

            arr[i].Dif=0;
           
            arr[i].VolVenta_Real=0;
            arr[i].VolVenta_Plan=0;
            arr[i].Peso=0;

            for(var j=0; j < arr[i].values.length; j++ ){

             
                arr[i].VolVenta_Real+=Number(arr[i].values[j].VolVenta_Real);
                arr[i].VolVenta_Plan+=Number(arr[i].values[j].VolVenta_Plan);
                arr[i].Peso+=Number(arr[i].values[j].Peso);

            }

            if(arr[i].VolVenta_Plan>0){
                arr[i].Dif=arr[i].VolVenta_Real-arr[i].VolVenta_Plan;
                arr[i].DifPer=arr[i].VolVenta_Real/arr[i].VolVenta_Plan;
            }else{
                arr[i].Dif=0;
                arr[i].DifPer=0;
            }  
            
            if(maximo < arr[i].Peso){
                maximo = arr[i].Peso;
            }

            if(maximo2 < arr[i].DifPer*1000){
                maximo2=arr[i].DifPer*1000;
            }

        } 
        
        arr = arr.sort((a, b) => b.Dif - a.Dif); 
        arr.reverse();

        var altura=30;
        var caso=0;
       
        var svgTooltipHeight=arr.length*altura*100;
        var svgTooltipWidth=650;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=svgTooltipHeight*.15;

        $("#toolTip2").css("visibility","visible");            
        $("#toolTip2").css("left",24+"%");
        $("#toolTip2").css("top",15+"%");

        if(svgTooltipHeight > 300){
          $("#toolTip2").css("top","");
          $("#toolTip2").css("bottom","10px");
        }
            
     // DATOS 

    var data = arr.map(function(item) {
        return {

          key: item.key,
          "VolVenta_Plan": item.VolVenta_Plan,
          "VolVenta_Real": item.VolVenta_Real,
          "DifK": item.VolVenta_Real - item.VolVenta_Plan,
          "DifP":  item.DifPer * 100,
          "Peso": item.Peso,
        };
        });
    


      
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Estado", sortable: true, width: "100px" },
        { key: "VolVenta_Plan", header: "Vol Plan (TM)", sortable: true, width: "100px" },
        { key: "VolVenta_Real", header: "Vol Real (TM)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (TM)", sortable: true, width: "100px" },
        { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Ponderación", sortable: true,  width: "100px" }
      ];
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
            </div>
            `;
          },
    
          VolVenta_Plan: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        VolVenta_Real: function(value) {
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
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="90%" height="10">'  
        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
        '</div>';
    
        },
        Peso: function(value){
      

           var barWidth = (value/maximo)*100 + '%';
           var barValue = vix_tt_formatNumber(value)+' TM';
      
          return '<div class="bar-container">' +
         
          '<svg width="90%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: yellow;"></rect></svg>' +
          
          '</div>';

    
        }
      };

          // FORMATEA DIV :
          
          vix_tt_formatToolTip("#toolTip2","Producción por Planta",650);

           // COLUMNAS CON TOTALES :

           var columnsWithTotals = ['VolVenta_Plan','VolVenta_Real','DifK']; 
           var totalsColumnVisitors = {
                     'VolVenta_Plan': function(value) { 
                       return vix_tt_formatNumber(value) + " TM";
                     },
                     'VolVenta_Real': function(value) { 
                       return vix_tt_formatNumber(value) + " TM"; 
                     },
                     'DifK': function(value) { 
                       return vix_tt_formatNumber(value) + " TM"; 
                     }
                     };
     
         
      // CREA TABLA USANDO DATOS
      
      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );        

      
      
      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip2");

  
      if( createdControls["cat_producto"] ){

        if($("#cat_producto").val() == "Gris"){
            $("#toolTip2").find(".content").append(`<div id="" class="sombra" align="left" style="font-family:Cabin;pointer-events:none;font-size:18px;color:#7DDFFF;opacity:1;font-weight:bold;"/><br> Incluye Gris, Impercem y Mortero </div>`);
        } else if( $("#cat_producto").val() == "Gris" || $("#cat_producto").val() == "Blanco" ){
            $("#toolTip2").find(".content").append(`<div id="" class="sombra" align="left" style="font-family:Cabin;pointer-events:none;font-size:18px;color:#7DDFFF;opacity:1;font-weight:bold;"/><br> Incluye Blanco y Especiales </div>`);
        }      

      }
      
       // DISTRIBUYE 
       vix_tt_distributeDivs(["#toolTip2"]);  

      // Crea una barra inferior y pasa una funcion de exportacion de datos
      vix_tt_formatBottomBar("#toolTip2", function () {
        var dataToExport = formatDataForExport(data, columns);
        var filename = "exported_data";
        exportToExcel(dataToExport, filename);
      });


    }
     