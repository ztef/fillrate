var kpiExpert_ABAS={};

kpiExpert_ABAS.eraseChart=function(){ 

    d3.select("#svgTooltip").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip5").selectAll(".abasDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");
    $("#toolTip5").css("visibility","hidden");

}

kpiExpert_ABAS.DrawTooltipDetail=function(entity){   

    $("#toolTip").css("visibility","hidden");        
    
    d3.select("#svgTooltip").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".abasDetail").data([]).exit().remove();
    d3.select("#svgTooltip5").selectAll(".abasDetail").data([]).exit().remove();

    // VENTANA SE MUESTRA SI SE ESTA EN NIVEL DE UNIDAD DE NEGOCIO
   
   
    if( 5 == $("#nivel_cb").val() ){
       kpiExpert_ABAS.DrawTooltipDetail_UNComoOrigen(entity); 
       kpiExpert_ABAS.DrawTooltipDetail_Origen(entity);  
    }else{
        kpiExpert_ABAS.DrawTooltipDetail_UN(entity);
    }    

    //kpiExpert_ABAS.DrawTooltipDetail_Origen(entity);    
    
    kpiExpert_ABAS.DrawTooltipDetail_Transporte(entity);
      

    opacidadCesium=30;
      $("#cesiumContainer").css("opacity",opacidadCesium/100);     

    // DISTRIBUYE
    if( 5 == $("#nivel_cb").val() ){
         vix_tt_distributeDivs(["#toolTip5","#toolTip4","#toolTip2"]);  
    } else {
         vix_tt_distributeDivs(["#toolTip3","#toolTip2"]);
    }


}


 //********************************************************************************************************************** */

kpiExpert_ABAS.DrawTooltipDetail_UNComoOrigen=function(entity){    

    var maximo=0;
    var maximoVolumen=0;

    var arrTemp=[];

    for(var i=0; i < store.abasto.length; i++ ){
        
        if(store.abasto[i].Origen==entity.key){
            console.log("insertaa");
            arrTemp.push(store.abasto[i]);
        }
            
    }

    if( 5 == $("#nivel_cb").val() ){

      for(var i=0; i < arrTemp.length; i++ ){
        arrTemp[i].DestinoTrans=arrTemp[i].Destino+"_"+arrTemp[i].Transporte;
       
      }

      var arr=d3.nest()
            .key(function(d) { return d.DestinoTrans; })
            .entries(arrTemp);

    }else{

      var arr=d3.nest()
            .key(function(d) { return d.Destino; })
            .entries(arrTemp); 

    }     

   
    for(var i=0; i < arr.length; i++ ){
        arr[i].Dif=0;
    
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0;
        arr[i].PesoPlan=0;
        arr[i].PesoReal=0;
        arr[i].Peso=0;
    
        for(var j=0; j < arr[i].values.length; j++ ){
        
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
            arr[i].PesoPlan+=Number(arr[i].values[j].VolPlan_Peso);
            arr[i].PesoReal+=Number(arr[i].values[j].VolReal_Peso);
            arr[i].Peso+=Number(arr[i].values[j].Peso);

        }         

        arr[i].DifPer=0;
        arr[i].DifPesos=0;
        arr[i].Dif=0;

        if(arr[i].VolumenPlan>0){
            arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
            arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
        }
        
        if(arr[i].PesoPlan>0){
          arr[i].DifPesos=arr[i].PesoReal-arr[i].PesoPlan;
        }
        
        if(maximo < arr[i].DifPesos*1000){
          maximo = arr[i].DifPesos*1000;
        }

        if(maximoVolumen < arr[i].DifPer*1000){
            maximoVolumen=arr[i].DifPer*1000;
        }

    } 

    arr = arr.sort((a, b) => b.Dif - a.Dif);    
    arr.reverse();

    var altura=30;
    var caso=0;

    var svgTooltipHeight=arr.length*altura*.55;

    if(svgTooltipHeight<140){
      console.log("corrigee");
      svgTooltipHeight=140;
    }
     

    if(svgTooltipHeight>windowHeight*.8){

      svgTooltipHeight=windowHeight*.8;
     
    }    

    var svgTooltipWidth=600;
    var marginLeft=svgTooltipWidth*.2;
    var tamanioFuente=altura*.4;
    var marginTop=35;
    
    $("#toolTip5").css("visibility","visible");            
    $("#toolTip4").css("top",70+"px");
    $("#toolTip4").css("bottom","");
    $("#toolTip5").css("right","2%");

    if(windowWidth > 1500 ){

      $("#toolTip5").css("top",90+"px");
      $("#toolTip5").css("right","2%");
     
    }

    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  ((item.VolumenReal / item.VolumenPlan) ) * 100,
          "PesoPlan": item.PesoPlan,
          "PesoReal": item.PesoReal,
          "DifPesos": item.DifPesos
        };
        });   
    
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Destino", sortable: true, width: "110px" },
        { key: "VolumenPlan", header: "Vol Plan (TM)", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real (TM)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (TM)", sortable: true, width: "100px" },
        { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
        { key: "PesoPlan", header: "Peso Plan (TM)", sortable: true,  width: "100px" },
        { key: "PesoReal", header: "Peso Real (TM)", sortable: true,  width: "100px" },
        { key: "DifPesos", header: "Dif (TM)", sortable: true,  width: "100px" }
      ];
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
          value=value.replaceAll("_"," ");
            return `<div>${value}
            </div>`;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) + " TM";
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) + " TM";
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) + " TM";
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

      vix_tt_formatToolTip("#toolTip5","Abasto desde "+dataManager.getNameFromId(entity.key)+" hacia otras UN",820,svgTooltipHeight+80);

      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK','PesoPlan','PesoReal','DifPesos']; 
      var totalsColumnVisitors = {
                'VolumenPlan': function(value) { 
                  return vix_tt_formatNumber(value) + " TM";
                },
                'VolumenReal': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'DifK': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'PesoPlan': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'PesoReal': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'DifPesos': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                }
                };      
   
     // CREA TABLA USANDO DATOS
      
     vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip5", columnsWithTotals );        

     // Crea una barra inferior y pasa una funcion de exportacion de datos
     vix_tt_formatBottomBar("#toolTip5", function () {
       var dataToExport = formatDataForExport(data, columns);
       var filename = "exported_data";
       exportToExcel(dataToExport, filename);
     });
      
      
      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip5");
      
    
}


 //********************************************************************************************************************** */
    
kpiExpert_ABAS.DrawTooltipDetail_Transporte=function(entity){    
   
    var maximo=0;
    var maximoVolumen=0;   
   
    var arr=d3.nest()
            .key(function(d) { return d.Transporte; })
            .entries(entity.abasto.values);         
    
    for(var i=0; i < arr.length; i++ ){
        arr[i].Dif=0;
      
        arr[i].VolumenReal=0;
        arr[i].VolumenPlan=0; 
        arr[i].PesoPlan=0;
        arr[i].PesoReal=0;
        arr[i].Peso=0;      

        for(var j=0; j < arr[i].values.length; j++ ){
        
            arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
            arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan); 
            arr[i].PesoPlan+=Number(arr[i].values[j].VolPlan_Peso);
            arr[i].PesoReal+=Number(arr[i].values[j].VolReal_Peso);
            arr[i].Peso+=Number(arr[i].values[j].Peso);        

        }

        arr[i].DifPer=0;
        arr[i].DifPesos=0;
        arr[i].Dif=0;
        
        if(arr[i].VolumenReal>0){
            arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
            arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
        }

        if(arr[i].PesoPlan>0){
          arr[i].DifPesos=arr[i].PesoReal-arr[i].PesoPlan;
        }
        
        if(maximo < arr[i].DifPesos*1000){
          maximo = arr[i].DifPesos*1000;
        }

        if(maximoVolumen < arr[i].DifPer*1000){
            maximoVolumen=arr[i].DifPer*1000;
        }

    } 
    
    arr = arr.sort((a, b) => b.Dif - a.Dif);    
    arr.reverse();

    var altura=30;
    var caso=0;
   
    var svgTooltipHeight=arr.length*(altura*.55);


    if(svgTooltipHeight<80)
     svgTooltipHeight=80;

    var svgTooltipWidth=500;
    var marginLeft=svgTooltipWidth*.15;
    var tamanioFuente=altura*.4;
    var marginTop=35;


    $("#toolTip2").css("visibility","visible");  
    $("#toolTip2").css("inset","");            
    $("#toolTip2").css("bottom","1%");
    $("#toolTip2").css("right","100px");

    if(windowWidth > 1500 ){

      $("#toolTip2").css("top",windowHeight*.5+"px");
      //$("#toolTip2").css("left",windowWidth*.6+"px");
      $("#toolTip2").css("right","10px");
     
    }

    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  ((item.VolumenReal / item.VolumenPlan) ) * 100,
          "PesoPlan": item.PesoPlan,
          "PesoReal": item.PesoReal,
          "DifPesos": item.DifPesos
        };
        });  
    
      
    
      // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Transporte", sortable: true, width: "110px" },
        { key: "VolumenPlan", header: "Vol Plan (TM)", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real (TM)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (TM)", sortable: true, width: "100px" },
        { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
        { key: "PesoPlan", header: "Peso Plan (TM)", sortable: true,  width: "100px" },
        { key: "PesoReal", header: "Peso Real (TM)", sortable: true,  width: "100px" },
        { key: "DifPesos", header: "Dif (TM)", sortable: true,  width: "100px" }
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
           
            '<span class="bar-value" style="width:60px">'  + barValue + '</span>' + '<svg width="90%" height="10">'  
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
    
      vix_tt_formatToolTip("#toolTip2","Abasto por Tipo de Transporte",840,svgTooltipHeight+120);


      $("#toolTip2").mousedown();
    
      
      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK','PesoPlan','PesoReal','DifPesos']; 
      var totalsColumnVisitors = {
                'VolumenPlan': function(value) { 
                  return vix_tt_formatNumber(value) + " TM";
                },
                'VolumenReal': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'DifK': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'PesoPlan': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'PesoReal': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'DifPesos': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
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

 //********************************************************************************************************************** */

  kpiExpert_ABAS.DrawTooltipDetail_UN=function(entity){  

        var maximo=0;    
        var maximoVolumen=0;   
    
        var arr=d3.nest()
                .key(function(d) { return d.Destino; })
                .entries(entity.abasto.values);

        
        for(var i=0; i < arr.length; i++ ){
            arr[i].Dif=0;
        
            arr[i].VolumenReal=0;
            arr[i].VolumenPlan=0;
            arr[i].PesoPlan=0;
            arr[i].PesoReal=0;
            arr[i].Peso=0;
        
            for(var j=0; j < arr[i].values.length; j++ ){
            
                arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
                arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
                arr[i].PesoPlan+=Number(arr[i].values[j].VolPlan_Peso);
                arr[i].PesoReal+=Number(arr[i].values[j].VolReal_Peso);
                arr[i].Peso+=Number(arr[i].values[j].Peso);

            }                 
           

            arr[i].DifPer=0;
            arr[i].DifPesos=0;
            arr[i].Dif=0;

            if(arr[i].PesoPlan>0){
              arr[i].DifPesos=arr[i].PesoReal-arr[i].PesoPlan;
            }

            if(arr[i].VolumenPlan>0){
                arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
                arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            } 
            
            if(maximo < arr[i].DifPesos*1000){
                maximo = arr[i].DifPesos*1000;
            }

            if(maximoVolumen < arr[i].DifPer*1000){
                maximoVolumen=arr[i].DifPer*1000;
            }

        } 
        
        arr = arr.sort((a, b) => b.Dif - a.Dif);    
        arr.reverse();

        var altura=50;
        var caso=0;
    
        var svgTooltipHeight=arr.length*(altura*.55);

        if(svgTooltipHeight<120)
            svgTooltipHeight=120;

        if(svgTooltipHeight>windowHeight*.61)
            svgTooltipHeight=windowHeight*.61;



        var svgTooltipWidth=620;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=35;

        $("#toolTip3").css("visibility","visible");            
        $("#toolTip3").css("left",radio*.5+"px");
        $("#toolTip3").css("top",70+"px");
        $("#toolTip3").css("max-height","");

        if(windowWidth > 1500 ){

          $("#toolTip3").css("top",80+"px");
          $("#toolTip3").css("left",radio+"px");
         
        }


    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  item.DifPer * 100,
          "PesoPlan": item.PesoPlan,
          "PesoReal": item.PesoReal,
          "DifPesos": item.DifPesos,
        };
        });   
    
      
    
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Unidad de Neogcio", sortable: true, width: "110px" },
        { key: "VolumenPlan", header: "Vol Plan (TM)", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real (TM)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (TM)", sortable: true, width: "100px" },
        { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
        { key: "PesoPlan", header: "Peso Plan (TM)", sortable: true,  width: "100px" },
        { key: "PesoReal", header: "Peso Real (TM)", sortable: true,  width: "100px" },
        { key: "DifPesos", header: "Dif (TM)", sortable: true,  width: "100px" }
      ];
    
    
         // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
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

          value=Math.round(value);

          var barWidth = value*.66 + '%';
          var barValue = vix_tt_formatNumber(value)+'%   ';

            //var fixedWidth = '60px';

          return '<div class="bar-container">' +
            '<span class="bar-value">' + barValue + '</span>' +
            '<svg width="90%" height="10">'  +
            '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' +        
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
    
      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK','PesoPlan','PesoReal','DifPesos']; 
      var totalsColumnVisitors = {
                'VolumenPlan': function(value) { 
                  return vix_tt_formatNumber(value) + " TM";
                },
                'VolumenReal': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'DifK': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'PesoPlan': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'PesoReal': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'DifPesos': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                }
                };
 


      vix_tt_formatToolTip("#toolTip3","Abasto recibido en UN que atienden "+dataManager.getNameFromId(entity.key) ,840,svgTooltipHeight+130);

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

 //********************************************************************************************************************** */

kpiExpert_ABAS.DrawTooltipDetail_Origen=function(entity){  

        var maximo=0;    
        var maximoVolumen=0;  
        
        if( 5 == $("#nivel_cb").val() ){

          for(var i=0; i < entity.abasto.values.length; i++ ){
              entity.abasto.values[i].OrigenTrans=entity.abasto.values[i].Origen+"_"+entity.abasto.values[i].Transporte;
           
          }
          var arr=d3.nest()
                .key(function(d) { return d.OrigenTrans; })
                .entries(entity.abasto.values);

        }else{
          var arr=d3.nest()
                .key(function(d) { return d.Origen; })
                .entries(entity.abasto.values);
        }
    
        

        
        for(var i=0; i < arr.length; i++ ){

            arr[i].Dif=0;
            
            arr[i].VolumenReal=0;
            arr[i].VolumenPlan=0;
            arr[i].Peso=0;    
           
            for(var j=0; j < arr[i].values.length; j++ ){
            
                arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);
                arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);   
                arr[i].Peso+=Number(arr[i].values[j].Peso);                
                
            }
          
            if(arr[i].VolumenPlan>0){
                arr[i].Dif=arr[i].VolumenReal-arr[i].VolumenPlan;
                arr[i].DifPer=arr[i].VolumenReal/arr[i].VolumenPlan;
            }else{
                arr[i].Dif=0;
                arr[i].DifPer=0;
            }  
            
            if(maximo < arr[i].Peso){
                maximo = arr[i].Peso;
            }

            if(maximoVolumen < arr[i].DifPer*1000){
                maximoVolumen=arr[i].DifPer*1000;
            }     

        } 
        
        arr = arr.sort((a, b) => b.Dif - a.Dif);    
        arr.reverse();


        var altura=30;
        var caso=0;
    
        var svgTooltipHeight=arr.length*altura;

        if(svgTooltipHeight<180)
          svgTooltipHeight=180;

        if(svgTooltipHeight>windowHeight*.7)
            svgTooltipHeight=windowHeight*.7;


        var svgTooltipWidth=600;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=35;

        $("#toolTip4").css("inset","");   
        $("#toolTip4").css("visibility","visible");  
        
        $("#toolTip4").append("<svg id='svgTooltip4'  style='pointer-events:none; line-heigth:22px;'></svg> ");
    

    // DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP":  item.DifPer * 100,
          "Peso": item.Peso,
        };
        });   
    
      
    
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Origen", sortable: true, width: "110px" },
        { key: "VolumenPlan", header: "Vol Plan (TM)", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real (TM)", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif (TM)", sortable: true, width: "100px" },
        { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Ponderación", sortable: true,  width: "100px" }
      ];
    
    
        // DEFINE VISITORS PARA CADA COLUMNA
    
    
        var columnVisitors = {
            key: function(value) {

                value=value.replaceAll("_"," ");
                return `<div class="key-selector" onclick="filterControls.lookForEntity('${value}')">${value}
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


          value=Math.round(value);

          var barWidth = value*.66 + '%';
          var barValue = vix_tt_formatNumber(value)+'%   ';
      
          return '<div class="bar-container">' +
          '<span class="bar-value" style="width:60px">' + barValue + '</span>' + '<svg width="90%" height="10">'  
        + '<rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;margin-right:3px;"></rect></svg>' +        
          '</div>';
        },
        Peso: function(value){
      
            if(value==0)
              value=1;

            var barWidth = (value/maximo)*100;
           
            if(barWidth<= 0){
            
              barWidth=1;
            }
            barWidth=barWidth+'%';
          
            var barValue = vix_tt_formatNumber(value)+' TM';
       
           return '<div class="bar-container">' +
          
           '<svg width="90%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: yellow;"></rect></svg>' +      
           '</div>';
        }
      };

      
      $("#toolTip4").css("top",16+"%"); 

      if( 5 == $("#nivel_cb").val() ){
                 
          $("#toolTip4").css("left",1+"%");
          $("#toolTip4").css("top",70+"px");

          if(windowWidth > 1500 ){

            $("#toolTip4").css("top",90+"px");
            $("#toolTip4").css("left",100+"px");
           
          }

          vix_tt_formatToolTip("#toolTip4","Orígenes de Abasto hacia "+toTitleCase(entity.key)+"",650,svgTooltipHeight);
      
        }else{

          $("#toolTip4").css("bottom","1%");
          $("#toolTip4").css("right","1%");                   

          vix_tt_formatToolTip("#toolTip4","Origenes de abasto hacia UN que atienden "+toTitleCase(entity.key)+"",650,svgTooltipHeight);
      } 
   
     

      // COLUMNAS CON TOTALES :

      var columnsWithTotals = ['VolumenPlan','VolumenReal','DifK']; 
      var totalsColumnVisitors = {
                'VolumenPlan': function(value) { 
                  return vix_tt_formatNumber(value) + " TM";
                },
                'VolumenReal': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                },
                'DifK': function(value) { 
                  return vix_tt_formatNumber(value) + " TM"; 
                }
                };
      
          
          
                console.log("kjkjjk");


            
      // CREA TABLA USANDO DATOS
      
      vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip4", columnsWithTotals );        

      // Crea una barra inferior y pasa una funcion de exportacion de datos
      vix_tt_formatBottomBar("#toolTip4", function () {
        var dataToExport = formatDataForExport(data, columns);
        var filename = "exported_data";
        exportToExcel(dataToExport, filename);
      });
     
      return;
      
      // APLICA TRANSICIONES 
    
      vix_tt_transitionRectWidth("toolTip4");
      
    
    }