
var calculateKpiExpert_Pendientes={};

calculateKpiExpert_Pendientes.calculateKPI=function(entities){  
    
    $("#cargando").css("visibility","visible");

    return new Promise((resolve, reject) => {

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
        for(var i=0; i < store.catlogsForFilters.length; i++){    
            if(store.catlogsForFilters[i].data==nombreCatalogoParaDiccionario){
                diccionarioNombres=store.catlogsForFilters[i].diccNames;
                
            }
        } 

        for(var i=0; i < store.apiDataSources.length; i++){
          
            if(store.apiDataSources[i].varName=="pendientes"){
               
                serviceName=store.apiDataSources[i].serviceName;
                apiURL=store.apiDataSources[i].apiURL;
            }

        }

        if(serviceName && apiURL){

            var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
            var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
           
             // FILTROS ****
            var params="";
           
            for(var j=0; j < store.catlogsForFilters.length; j++){ 
 
                 if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined ){
 
                    params+="&"+store.catlogsForFilters[j].storeProcedureField+"="+store.catlogsForFilters[j].diccNames[ $("#"+store.catlogsForFilters[j].id).val() ];
 
                 }
 
            }

              //FILTRO DE MASIVO
            if($("#masivos_cb").val() == "Todos" || $("#masivos_cb").val() == ""){

                        params+="&Masivos=Todos";               

            }else if($("#masivos_cb").val() == "SinMasivos"){

                        params+="&Masivos=Sin Masivos"; 

            }else if($("#masivos_cb").val() == "SoloMasivos"){

                        params+="&Masivos=Solo Masivos"; 
                        
            } 

             var URL=apiURL+"/"+serviceName+"&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
             console.log(URL);

            if(URL.indexOf("undefined" < 0)){
                d3.json(URL, function (error, data) {

                            $("#cargando").css("visibility","hidden");
                            
                            if(error){
                                alert("Error API pendientes",error);
                                resolve();
                                return;
                            }

                            if(data.error){
                                alert("Error API pendientes",data.error);
                                resolve();
                                return;
                            }

                           
                            var entities_coll={};

                            for(var i=0;  i < entities.length; i++){ 

                                entities[i].pendientes={pendientes:0,volumen:0,Libre_Pendiente_Hoy:0,values:[],allRecords:[]};
                                entities_coll[entities[i].key]=entities[i];                                 
                            }    
                            
                            console.log("pendientes",entities);

                            var ultimaFecha=0; 

                            for(var j=0;  j < data.recordset.length; j++){

                                if(data.recordset[j].FechaActual!=""){

                                    if( data.recordset[j].FechaActual.indexOf("T") > -1){
                
                                        var fechaSplit=data.recordset[j].FechaActual.split("T");
                                        
                                        fechaSplit=fechaSplit[0].split("-");                   
                
                                    }else{
                                        
                                        var fechaSplit=data.recordset[j].FechaActual.split("-");
                  
                                    }                   
                
                                    data.recordset[j].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2])); 

                                    if(ultimaFecha < data.recordset[j].fecha.getTime())
                                        ultimaFecha = data.recordset[j].fecha.getTime();
                                    
                                } 

                            }

                            for(var j=0;  j < data.recordset.length; j++){

                                var entidad=entities_coll[data.recordset[j].Agrupador];

                                if(entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]] && !entidad){
                                    entidad=entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]];
                                }

                                if( entidad ){
                                    
                                    if( data.recordset[j].fecha.getTime() == ultimaFecha ){          
                                       
                                            entidad.pendientes.pendientes += Math.round(Number( data.recordset[j].Pct_Radar)*1000)/10;
                                            entidad.pendientes.Libre_Pendiente_Hoy+= Number( data.recordset[j].Libre_Pendiente_Hoy );
                                            entidad.pendientes.volumen += Number( data.recordset[j].Libre_Retrasado );
                                            entidad.pendientes.values.push( data.recordset[j] );                                           
                            
                                    }

                                    entidad.pendientes.allRecords.push( data.recordset[j] );       

                                }else{
                                    //console.log("no existe entidad mencionada en pendientes:",data.recordset[j].Agrupador);
                                }

                            }
                            
                            resolve();

                });
            }

        }else{
            alert("Error al encontrar URL API Pendienetes");
            resolve();
        } 

    });
}  


calculateKpiExpert_Pendientes.getTooltipDetail=function(entityId){    

    for(var i=0;  i < entities.length; i++){
       
        if(entities[i].key.toLowerCase()==entityId.toLowerCase()){

            var prodPer="Sin Dato";

            if(entities[i].pendientes){

                    if(entities[i].pendientes.volumen!=undefined)
                        prodPer=formatNumber(Math.round(entities[i].pendientes.volumen*100)/100)+"";
                
                var text=`<div class="tooltipDetailElement"><img id="" src="images/retrasados.png" style=""></img>
                <span style='color:#ffffff;font-size:${15*escalaTextos}px;'>Retrasados: </span><br>
                <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Con Compromiso Vencido:</span> <span style='color:#ffffff'>${ prodPer } TM</span><br><span style='color:#ffffff;font-size:${12*escalaTextos}px;'> (Libre Pendiente Hoy: ${formatNumber(entities[i].pendientes.Libre_Pendiente_Hoy)} TM )</span><br>
                
                </div>

                `
                return text;

            }
        }
            
    }
}




calculateKpiExpert_Pendientes.downloadCSV=function(entityId){

    for(var i=0;  i < entities.length; i++){

            if(entities[i].key == entityId){

              var csv = 'Agrupador,FechaActual,Libre_Pendiente_Hoy,Libre_Programado_CaminoRural,Libre_Programado_NoProg,Libre_Programado_Programable,Libre_Programado_Total,Libre_RecAutf,Libre_Retrasado,Libre_Retrasado_CaminoRural,Libre_Retrasado_NoProg_1D,Libre_Retrasado_NoProg_2D,Libre_Retrasado_NoProg_3D,Libre_Retrasado_NoProg_4D,Libre_Retrasado_NoProg_5D,Libre_Retrasado_NoProg_6D,Libre_Retrasado_NoProg_7oMas,Libre_Retrasado_NoProg_Total,Libre_Retrasado_Programable,Libre_Total,Libre_TotalPorEntregar,Retenido_Entregado,Retenido_RecAutf,Retenido_Total,Total,fecha\n';

              var LLaves=["Agrupador","FechaActual","Libre_Pendiente_Hoy","Libre_Programado_CaminoRural","Libre_Programado_NoProg","Libre_Programado_Programable","Libre_Programado_Total","Libre_RecAutf","Libre_Retrasado","Libre_Retrasado_CaminoRural","Libre_Retrasado_NoProg_1D","Libre_Retrasado_NoProg_2D","Libre_Retrasado_NoProg_3D","Libre_Retrasado_NoProg_4D","Libre_Retrasado_NoProg_5D","Libre_Retrasado_NoProg_6D","Libre_Retrasado_NoProg_7oMas","Libre_Retrasado_NoProg_Total","Libre_Retrasado_Programable","Libre_Total","Libre_TotalPorEntregar","Retenido_Entregado","Retenido_RecAutf","Retenido_Total","Total","fecha"];

                    //merge the data with CSV

                        for(var j=0;  j < entities[i].pendientes.values.length; j++){

                            for(var k=0;  k < LLaves.length; k++){
                                    csv +=entities[i].pendientes.values[j][LLaves[k]]+',';
                            }

                            csv += "\n";
                    };

                    var hiddenElement = document.createElement('a');

                    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
                    hiddenElement.target = '_blank';

                    hiddenElement.download = 'Pendientes nivel_'+$("#nivel_cb").val()+' '+entityId+' '+$('#datepicker').val()+' al '+$('#datepicker2').val()+' .csv';
                    hiddenElement.click();

            }

    }

}