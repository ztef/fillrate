var kpiExpert_MAS={};


kpiExpert_MAS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".masDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");	

}


kpiExpert_MAS.DrawTooltipDetail=function(entity){  

    d3.select("#svgTooltip").selectAll(".masDetail").data([]).exit().remove();

    var maximo=0;
    var maximoVol=0;
    var arr=d3.nest()
            .key(function(d) { return d.EstadoZTDem; })
            .entries(entity.masivos.values);

            console.log("arr",arr);

    for(var i=0; i < arr.length; i++ ){

        arr[i].Masivos=0; 
        arr[i].MasivosVol=0;
        arr[i].totalSolicitado=0;    

        for(var j=0; j < arr[i].values.length; j++ ){
            
            if( arr[i].values[j].TipoPedido == "Masivo" ){

                arr[i].MasivosVol+=Number(arr[i].values[j].CantSolFinal);
          
            }

            arr[i].totalSolicitado+=Number(arr[i].values[j].CantSolFinal);            

        }

        arr[i].Masivos=arr[i].MasivosVol/arr[i].totalSolicitado;

        if(maximo < arr[i].Masivos*1000){
            maximo=arr[i].Masivos*1000;
        }
        if(maximoVol < arr[i].totalSolicitado){
            maximoVol=arr[i].totalSolicitado;
        }

    }

    arr = arr.sort((a, b) => b.Masivos*100 - a.Masivos*100);

    var altura=30;
    var caso=0;
   
    var svgTooltipHeight=(arr.length*altura)+50;
    var svgTooltipWidth=600;
    var marginLeft=svgTooltipWidth*.3;
    var tamanioFuente=altura*.5;
    if(tamanioFuente < 12)
    tamanioFuente=12;

    var marginTop=30;

    $("#toolTip2").css("visibility","visible");            
    $("#toolTip2").css("left",34+"%");
    $("#toolTip2").css("top",80+"px");

    //Agrega div con un elemento svg :

    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "MasivosVol": item.MasivosVol,      
          "totalSolicitado": item.totalSolicitado,
          "DifP": ((item.MasivosVol / item.totalSolicitado)) *100
        };
        });

    // DEFINE COLUMNAS
      
     var columns = [
        { key: "key", header: "Estado", sortable: true, width: "130px" },
        { key: "MasivosVol", header: "Volumen Masivos", sortable: true, width: "150px" },    
        { key: "totalSolicitado", header: "Vol. Solicitado", sortable: true, width: "150px" },
        { key: "DifP", header: "Procentaje", sortable: true, width: "150px" },
        ];

    // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value,i) {
            return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
            </div>`;
          },
    
        MasivosVol: function(value,i) {
                var ancho=GetValorRangos( value,1, maximo ,1,svgTooltipHeight*.4);
                var barValue = formatNumber(value)+" TM";
               
              

                return '<div class="bar-container">' +
               
                '<span class="bar-value">' + barValue + '</span>' +
                '</div>';



                
        },
        
        totalSolicitado: function(value,i) {
                var ancho=GetValorRangos( value,1, maximoVol ,1,svgTooltipHeight*.4);
                var barValue = formatNumber(value)+" TM";              
              

                return '<div class="bar-container">' +
              
                '<span class="bar-value">' + barValue + '</span>' +
                '</div>';



                
        }, 
        DifP: function(value,i) {
            var ancho=GetValorRangos( value,1, maximoVol ,1,svgTooltipHeight*.4);
            var barValue = formatNumber(value)+" %";              
          

            return '<div class="bar-container">' +
          
            '<span class="bar-value">' + barValue + '</span>' +
            '</div>';



            
    }
      };

      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['MasivosVol','totalSolicitado','DifP']; 
      var totalsColumnVisitors = {
                'MasivosVol': function(value) { 
                        var v = formatNumber(value)+" TM";
             
                        return v; 
                },
                'totalSolicitado': function(value) { 
                        var v = formatNumber(value)+" TM";
             
                        return v; 
                }
               
                };

    
    
      // FORMATEA DIV :

      vix_tt_formatToolTip("#toolTip2","Masivos por estado de "+entity.key, 600);
    
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
    