var kpiExpert_Flota={};

kpiExpert_Flota.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".flotaDetail").data([]).exit().remove();

}

kpiExpert_Flota.DrawTooltipDetail=function(entity){    
 
    d3.select("#svgTooltip").selectAll(".flotaDetail").data([]).exit().remove();

    kpiExpert_Flota.DrawTooltipDetail_Origen(entity);
  

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

    var svgTooltipWidth=400;
    var altura=30;

    var tamanioFuente=altura*.5;
    if(tamanioFuente < 12)
    tamanioFuente=12;

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("left",24+"%"); 
    $("#toolTip2").css("top",15+"%");

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
            return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
            </div>`;
          },
    
          Numero: function(value) {
          return vix_tt_formatNumber(value);
        },
       
        Deficit: function(value){
            console.log(maximo,Math.abs(value)*100);
            var barWidth = (Math.abs(value)*100/maximo)*100 + '%';
            var barValue = value;
        
            return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' + '<svg width="100%" height="10">'  
            + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
          '</div>';
        }
      };

      // FORMATEA DIV :
      
      vix_tt_formatToolTip("#toolTip2","Déficit de Flota por Origen "+entity.key,svgTooltipWidth);
      
            // COLUMNAS CON TOTALES :
    
            var columnsWithTotals = ['Deficit']; 
            var totalsColumnVisitors = {
                        'Deficit': function(value) { 
                        return vix_tt_formatNumber(value) ; 
                        }
                      
                      
                      };
                      
        // CREA TABLA USANDO DATOS
                
        vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );           
            
            
        // APLICA TRANSICIONES 

        vix_tt_transitionRectWidth("toolTip2");
 

}