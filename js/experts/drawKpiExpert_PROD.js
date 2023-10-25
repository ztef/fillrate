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
            arr[i].PesoPlan=0;
            arr[i].PesoReal=0;
            arr[i].Peso=0;

            for(var j=0; j < arr[i].values.length; j++ ){

             
                arr[i].VolVenta_Real+=Number(arr[i].values[j].VolVenta_Real);
                arr[i].VolVenta_Plan+=Number(arr[i].values[j].VolVenta_Plan);
                arr[i].PesoPlan+=Number(arr[i].values[j].VolPlan_Peso);
                arr[i].PesoReal+=Number(arr[i].values[j].VolReal_Peso);
                arr[i].Peso+=Number(arr[i].values[j].Peso);

            }

            arr[i].DifPesos=0;

            if(arr[i].VolVenta_Plan>0){
                arr[i].Dif=arr[i].VolVenta_Real-arr[i].VolVenta_Plan;
                arr[i].DifPer=arr[i].VolVenta_Real/arr[i].VolVenta_Plan;
            }else{
                arr[i].Dif=0;
                arr[i].DifPer=0;
            }  

            if(arr[i].PesoPlan>0){
              arr[i].DifPesos=arr[i].PesoReal-arr[i].PesoPlan;
            }
            
            if(maximo < arr[i].DifPesos*1000){
              maximo = arr[i].DifPesos*1000;
            }

            if(maximo2 < arr[i].DifPer*1000){
                maximo2=arr[i].DifPer*1000;
            }

        } 
        
        arr = arr.sort((a, b) => b.Dif - a.Dif); 
        arr.reverse();

        var altura=30;
        var caso=0;
       
        var svgTooltipHeight=arr.length*(altura*.55);


        if(svgTooltipHeight<80)
        svgTooltipHeight=80;

        var svgTooltipWidth=650;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=svgTooltipHeight*.15;

        $("#toolTip2").css("visibility","visible");            
        $("#toolTip2").css("left",radio+"px");
        $("#toolTip2").css("top",100+"px");
        $("#toolTip2").css("bottom","");

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
          "PesoPlan": item.PesoPlan,
          "PesoReal": item.PesoReal,
          "DifPesos": item.DifPesos
        };
        });
    


      
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Estado", sortable: true, width: "100px" },
        { key: "VolVenta_Plan", header: "Vol Plan ", sortable: true, width: "100px" },
        { key: "VolVenta_Real", header: "Vol Real ", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif ", sortable: true, width: "100px" },
        { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
        { key: "PesoPlan", header: "Peso Plan ", sortable: true,  width: "100px" },
        { key: "PesoReal", header: "Peso Real ", sortable: true,  width: "100px" },
        { key: "DifPesos", header: "Dif ", sortable: true,  width: "100px" }
      ];
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick="backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_un','${entity.key}')">${value}
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
        PesoPlan: function(value) {
        
          return '<div style="padding-left:10px;">' +vix_tt_formatNumber(value)+'</div>';   ;
        },
        PesoReal: function(value) {
          return vix_tt_formatNumber(value) ;
        },
        DifPesos: function(value) {
          return vix_tt_formatNumber(value) ;
        }
      };

          // FORMATEA DIV :
          
           // COLUMNAS CON TOTALES :

           var columnsWithTotals = ['VolVenta_Plan','VolVenta_Real','DifK','PesoPlan','PesoReal','DifPesos']; 
           var totalsColumnVisitors = {
                     'VolVenta_Plan': function(value) { 
                       return vix_tt_formatNumber(value) ;
                     },
                     'VolVenta_Real': function(value) { 
                       return vix_tt_formatNumber(value) ; 
                     },
                     'DifK': function(value) { 
                       return vix_tt_formatNumber(value) ; 
                     },
                     'PesoPlan': function(value) { 
                       return vix_tt_formatNumber(value) ; 
                     },
                     'PesoReal': function(value) { 
                       return vix_tt_formatNumber(value) ; 
                     },
                     'DifPesos': function(value) { 
                       return vix_tt_formatNumber(value) ; 
                     }
                     };     

              var titulo="Producción Molienda por Planta";

              if($("#nivel_cb").val().toString() != "0" )
                  titulo="Producción Molienda por Planta de "+dataManager.getNameFromId(entity.key)+" (TM)";

    
              vix_tt_formatToolTip("#toolTip2",titulo,840,svgTooltipHeight+130);


      
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
      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip2", columnsWithTotals );        

      // Crea una barra inferior y pasa una funcion de exportacion de datos
      vix_tt_formatBottomBar("#toolTip2", function () {
        var dataToExport = formatDataForExport(data, columns);
        var filename = "exported_data";
        exportToExcel(dataToExport, filename);
      });   

      

    }
     