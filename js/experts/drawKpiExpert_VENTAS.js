var drawKpiExpert_VENTAS={};
drawKpiExpert_VENTAS.detalleDeTiempo="dia";
drawKpiExpert_VENTAS.lastEntity;


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
    d3.select("#svgTooltip4").selectAll(".ventasDetail").data([]).exit().remove();
    
    $("#toolTip2").css("visibility","hidden");
    $("#toolTip3").css("visibility","hidden");
    $("#toolTip4").css("visibility","hidden");


}


drawKpiExpert_VENTAS.DrawTooltipDetail=function(entity){  
  
    drawKpiExpert_VENTAS.lastEntity=entity;

    d3.select("#svgTooltip").selectAll(".ventasDetail").data([]).exit().remove();
    d3.select("#svgTooltip3").selectAll(".ventasDetail").data([]).exit().remove();
    d3.select("#svgTooltip4").selectAll(".ventasDetail").data([]).exit().remove();
    
    
    drawKpiExpert_VENTAS.DrawTooltipDetail_Estado(entity);

    drawKpiExpert_VENTAS.DrawTooltipDetail_Producto_Presentacion(entity);

    drawKpiExpert_VENTAS.DrawTooltipDetail_porDia(entity,dateInit,dateEnd);

    opacidadCesium=30;
    $("#cesiumContainer").css("opacity",opacidadCesium/100); 


    // DISTRIBUYE 
    vix_tt_distributeDivs(["#toolTip2","#toolTip3","#toolTip4"]);  

}  

drawKpiExpert_VENTAS.DrawTooltipDetail_porDia=function(entity, dateInit, dateEnd){ 
  
  console.log(entity, dateInit, dateEnd);

    

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
          if(store.apiDataSources[i].varName=="ventasDia"){
                  
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

                  dataLoader.AddLoadingTitle("Ventas por Día");

                  d3.json(URL, function (error, data) {

                          dataLoader.DeleteLoadingTitle("Ventas por Día"); 

                          dataLoader.HideLoadings();

                          $("#cargando").css("visibility","hidden");

                          if(error){
                            alert("Error API Ventas por Día",error);
                            resolve();
                            return;
                          }

                          if(data.error){
                              alert("Error API Ventas por Día",data.error);
                              resolve();
                              return;
                          }

                          console.log("Ventas por Día",data.recordset); 

                         //FECHAS *******

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
                                      obj.VolumenReal=0;
                                      obj.VolPlan_Acum=0;
                                      obj.VolReal_Acum=0;
                                      obj.CantEntFinal=0;
                                      obj.CantEntFinal_Suma=0;
                                      obj.PctPlan=0;
                                      obj.PctReal=0;
                                      obj.PctPlan_FR=0;
                                      obj.PctReal_FR=0;
                                      obj.VolPlan_FR=0;
                                      obj.VolReal_FR=0;
                                      obj.Dif_FR=0;
                                      obj.VolPlan_FR_NP=0;
                                      obj.VolReal_FR_NP=0;
                                      obj.Dif_FR_NP=0;
                                      obj.VolPlan_FR_Total=0;
                                      obj.VolReal_FR_Total=0;
                                      obj.VolumenPlan_Total=0;
                                      obj.VolumenReal_Total=0;
                                      obj.Peso=0;
                                      obj.Fecha=String(new Date(i)),
                                      obj.fecha=new Date(i);
                                      data_.push(obj);
                              }
      
                          }

                          data.recordset=data_;

                          for(var i=0; i < data.recordset.length; i++ ){

                            var fechaDelMes = new Date(data.recordset[i].fecha.getFullYear(), data.recordset[i].fecha.getMonth());
                            
                            data.recordset[i].mes=fechaDelMes;

                          }                          

                          if(drawKpiExpert_VENTAS.detalleDeTiempo=="dia"){

                                  var arr=d3.nest()
                                          .key(function(d) { 

                                                  if(d.fecha){
                                                          return d.fecha.getTime(); 
                                                  }else{                       
                                                          return 0;
                                                  }                        
                                  
                                          })
                                          .entries(data.recordset);

                          }else if(drawKpiExpert_VENTAS.detalleDeTiempo=="mes"){

                                    var arr=d3.nest()
                                          .key(function(d) { 

                                                  if(d.mes){
                                                    console.log(d);
                                                          return d.mes.getTime(); 
                                                  }else{                       
                                                          return 0;
                                                  }                        
                                  
                                          })
                                          .entries(data.recordset);

                          }

                          console.log("arr",arr);

                         
                          var maximo=0;
                                
                          for(var i=0; i < arr.length; i++ ){

                                  arr[i].VolumenPlan=0;
                                  arr[i].VolumenReal=0;

                                  if(drawKpiExpert_VENTAS.detalleDeTiempo=="dia"){

                                      arr[i].Fecha=arr[i].values[0].fecha.getDate()+" "+getMes(arr[i].values[0].fecha.getMonth());

                                  }else if(drawKpiExpert_VENTAS.detalleDeTiempo=="mes"){

                                      arr[i].Fecha=getMes(arr[i].values[0].mes.getMonth())+" "+arr[i].values[0].mes.getFullYear();

                                  }

                                  for(var j=0; j < arr[i].values.length; j++ ){

                                        arr[i].VolumenPlan+=Number(arr[i].values[j].VolumenPlan);
                                        arr[i].VolumenReal+=Number(arr[i].values[j].VolumenReal);

                                  }

                                  if(maximo < arr[i].VolumenPlan && arr[i].VolumenPlan>0 ){
                                    maximo=arr[i].VolumenPlan;

                               } 

                          }

                          arr = arr.sort((a, b) => {  

                            if(drawKpiExpert_VENTAS.detalleDeTiempo=="dia"){
                                          
                                return b.fecha - a.fecha;   
                            
                            }else if(drawKpiExpert_VENTAS.detalleDeTiempo=="mes"){

                                return b.mes - a.mes;   

                            }
            
                          });

                          console.log("fechas",arr);

                          drawKpiExpert_VENTAS.lastDataByDay=arr;

                          //arr=arr.reverse();

                          var ancho=18;
                          var caso=0;    

                          var svgTooltipWidth=arr.length*(ancho*1.05) ;

                          if(svgTooltipWidth < 300)
                                svgTooltipWidth=300;
                  
                          var svgTooltipHeight=480;

                          var tamanioFuente=ancho*.8;   
                                                 

                          vix_tt_formatToolTip("#toolTip4","Ventas por Día "+dataManager.getNameFromId(entity.key)+" (TM)",svgTooltipWidth+7,svgTooltipHeight+100,dataManager.GetTooltipInfoData("toolTip4","Venta"));               
                
                          var svgElement =
                          
                          `<svg id='svgTooltip4' style='pointer-events:none;'></svg>
                          <div class="item2 loginContainer login-page form " style="
                          position: relative;
                          padding: 10px;
                          top: 0px;
                          margin: 0px;
                          width: 263px;
                          left: 0px;
                          background: #000000;">

                                <div class="dateContainer " style="padding-top: 0px;">
                                    <div class="dateContainer " style="display: flex;">
                                            <div class="dateContainer " style="margin-right: 9px;
                                                display: grid;align-content: flex-start">
                                                <button id="" style="font-size: 10px;margin-top: 2px;" class="loginBtn" onclick="drawKpiExpert_VENTAS.detalleDeTiempo='mes';drawKpiExpert_VENTAS.DrawTooltipDetail_porDia(drawKpiExpert_VENTAS.lastEntity,new Date($('#datepicker_').val()),new Date($('#datepicker2_').val()))">Mes</button> 
                                                <button id="" style="font-size: 10px; margin-top: 2px;opacity:.5;" class="loginBtn" onclick="">Semana</button> 
                                                <button id="" style="font-size: 10px; margin-top: 2px;" class="loginBtn" onclick="drawKpiExpert_VENTAS.detalleDeTiempo='dia';drawKpiExpert_VENTAS.DrawTooltipDetail_porDia(drawKpiExpert_VENTAS.lastEntity,new Date($('#datepicker_').val()),new Date($('#datepicker2_').val()))">Día</button> 
                                            </div>
                                            <div class="dateContainer " style="    padding-top: 14px;">
                                                <input id="datepicker_" width="100%" placeholder="Desde"/>
                                                <input id="datepicker2_" width="100%" placeholder="A"/>   
                                            </div>  
                                            
                                    </div>
                                    <button id="updateVentasDates" class="loginBtn" onclick="">Cambia Período</button> 

                                </div>    
                        
                              </div>
                             
                              <div class="bottom-bar" onClick="drawKpiExpert_VENTAS.DownloadCSVByDay('${entity.key}')" style="    margin-left: 10px;padding: 5px; height: 20px; width: 28px; background-color: rgb(31, 46, 57); border-top-left-radius: 2px; border-top-right-radius: 2px;"><div style="float: left;"><button class="download-button" style="float: right; cursor: pointer; background-color: transparent; border: none; color: rgb(255, 255, 255);"><i class="fas fa-download"></i></button></div></div>
                              `
                          
                            ;

                            d3.select("#toolTip4").append("div").html(svgElement); 

                            $("#updateVentasDates").click(function(){    

                                      var newDateInit=new Date($('#datepicker_').val());
                                      var newDateEnd=new Date($('#datepicker2_').val());

                                      drawKpiExpert_VENTAS.DrawTooltipDetail_porDia(entity,newDateInit,newDateEnd);
                                   
                                      d3.select("#svgTooltip4").selectAll(".ventasDetail").data([]).exit().remove();                                      
                                 
                                      $("#toolTip4").css("visibility","hidden");

                            });                           
                          
                          $('#datepicker_').datepicker({format: 'mm-dd-yyyy'});
                          $('#datepicker2_').datepicker({format: 'mm-dd-yyyy'}); 
      
                          $('#datepicker_').val((dateInit.getMonth()+1)+"-"+dateInit.getDate()+"-"+dateInit.getFullYear());
                          $('#datepicker2_').val((dateEnd.getMonth()+1)+"-"+dateEnd.getDate()+"-"+dateEnd.getFullYear());      


                          // Continua con la Generacion de las graficas dentro del svgTooltip   
                          
                          var lastPosY;

                          for(var i=0; i < arr.length; i++ ){                            

                                var altura=(svgTooltipHeight*.22);

                                if(arr[i].VolumenPlan==0 && arr[i].VolumenPlan==0){
                                  var altura1=1;
                                  var altura2=1;
                                }else{
                                  var altura1=GetValorRangos( arr[i].VolumenReal,1, maximo ,1,altura);
                                  var altura2=GetValorRangos( arr[i].VolumenPlan,1, maximo ,1,altura);
                                }                               
                               

                                d3.select("#svgTooltip4").append("rect")		    		
                                                .attr("width",ancho*.9 )
                                                .attr("class","ventasDetail")
                                                .attr("x",(ancho*caso)  )
                                                .attr("y", ((svgTooltipHeight*.65))-altura1-80  )
                                                .attr("height",1)
                                                .attr("fill","#00A8FF")
                                                .transition().delay(0).duration(i*50)
                                                .style("height",altura1 )	
                                                ;

                                if(lastPosY){

                                  d3.select("#svgTooltip4").append("line")       
                                                .attr("class","ventasDetail")                                
                                                .attr("x1",lastPosY.x+(ancho/2) )
                                                .attr("y1", lastPosY.y   )
                                                .attr("x2",ancho*caso+(ancho/2) )
                                                .attr("y2", ((svgTooltipHeight*.65))-altura2-80  )
                                                .style("stroke","#ffffff")
                                                .style("stroke-width",2)
                                                .style("stroke-opacity",1);

                                }

                                lastPosY={x:(ancho*caso) ,y:((svgTooltipHeight*.65))-altura2-80 };
                                

                                d3.select("#svgTooltip4")
                                                .append("text")						
                                                .attr("class","frDetail")
                                                .style("fill","#ffffff")		
                                                .style("font-family","Cabin")
                                                .style("font-weight","bold")
                                                .style("font-size",tamanioFuente*.7)						
                                                .style("text-anchor","start")
                                                .style("opacity",0 )
                                                .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)+1  )+","+String( ((svgTooltipHeight*.2))-10 )+")  rotate("+(-90)+") ")
                                                .text(function(){
                                                  
                                                  var porDif="0";

                                                  if(arr[i].VolumenPlan>0){

                                                    porDif = Math.round((arr[i].VolumenReal/arr[i].VolumenPlan)*100);

                                                  }

                                                  if(arr[i].VolumenPlan == 0){
                                                    return "0";
                                                  }

                                                return  "R: "+formatNumber(arr[i].VolumenReal)+" -  "+ porDif +"%";
                        
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
                                                .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)  )+","+String( (svgTooltipHeight*.65)-74  )+")  rotate("+(-90)+") ")
                                                .text(function(){
                                                        
                                                  return  arr[i].Fecha;
                        
                                                });

                                

                                caso++; 

                          }

                          $(".gj-picker").css("z-index", 99999999);

                          $("#toolTip4").css("visibility","visible");        
                          $("#toolTip4").css("max-height","");    
                          $("#toolTip4").css("bottom",4+"px");
                          $("#toolTip4").css("right",30+"px");

                          if(windowWidth > 1500 ){

                            $("#toolTip4").css("top",80+"px");
                            $("#toolTip4").css("left",windowWidth/2+"px");
                           
                          }  

                          d3.select("#svgTooltip4")                     
                                .style("width", svgTooltipWidth )
                                .style("height", (svgTooltipHeight*.6) )
                                ;

                        

                  });

            }

      }      

}

drawKpiExpert_VENTAS.DownloadCSVByDay=function(entity){

  console.log(entity);

  if(drawKpiExpert_VENTAS.lastDataByDay){

          var csv = 'Entidad,Volumen Plan,Volumen Real,Fecha\n';

          for(var i=0;  i < drawKpiExpert_VENTAS.lastDataByDay.length; i++){

                            

                            csv +=entity+',';
                            csv +=drawKpiExpert_VENTAS.lastDataByDay[i].VolumenPlan+',';
                            csv +=drawKpiExpert_VENTAS.lastDataByDay[i].VolumenReal+',';
                            csv +=drawKpiExpert_VENTAS.lastDataByDay[i].Fecha+',';
                    

                    csv += "\n";
                          
          }

          console.log(csv);

          var hiddenElement = document.createElement('a');
              
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';

          hiddenElement.download = 'Ventas por dia de '+entity+'  .csv';
          hiddenElement.click();

    
  }
  
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
    { key: "VolumenPlan", header: "Vol Plan", sortable: true, width: "100px" },
    { key: "VolumenReal", header: "Vol Real", sortable: true, width: "100px" },
    { key: "DifK", header: "Dif", sortable: true, width: "100px" },
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

  vix_tt_formatToolTip("#toolTip3","Detalle de Ventas por Producto y Presentación (TM)",svgTooltipWidth,svgTooltipHeight,dataManager.GetTooltipInfoData("toolTip3","Venta"));

  
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
        { key: "VolumenPlan", header: "Vol Plan", sortable: true, width: "100px" },
        { key: "VolumenReal", header: "Vol Real", sortable: true, width: "100px" },
        { key: "DifK", header: "Dif", sortable: true, width: "100px" },
        { key: "DifP", header: "Cumplimiento (%)", sortable: true,  width: "120px" },
        { key: "Peso", header: "Peso", sortable: true,  width: "80px" }
      ];
    
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return `<div class="key-selector" onclick=" backInfoNav.push({entity:'${entity.key}' , catlog:'${dataManager.getCurrentCatlog()}'});filterControls.arrowUpdate();filterControls.lookForEntity('${value}','cat_estado','${entity.key}')">${value}
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
   
      vix_tt_formatToolTip("#toolTip2","Detalle de Ventas por Estado (TM)",svgTooltipWidth,svgTooltipHeight,dataManager.GetTooltipInfoData("toolTip2","Venta"));
  
    
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