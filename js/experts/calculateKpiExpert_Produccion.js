var calculateKpiExpert_Produccion={};


calculateKpiExpert_Produccion.calculateKPI=function(entities){  
  
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
          
            if(store.apiDataSources[i].varName=="produccion"){
               
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

            //**** */

            var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
            console.log(URL);
            if(URL.indexOf("undefined" < 0)){
                d3.json(URL, function (error, data) {

                    $("#cargando").css("visibility","hidden");
                    
                    if(error){
                        alert("Error API Produccion",error);
                        resolve();
                        return;
                    }

                    if(data.error){
                        alert("Error API Produccion",data.error);
                        resolve();
                        return;
                    }

                    entities=entities;

                    console.log("produccion",data.recordset);                 

                    var entities_coll={};

                    for(var i=0;  i < entities.length; i++){ 

                        entities[i].produccion={VolVenta_Plan:0,VolVenta_Real:0,difPer:undefined,Pct_Radar:0, produccion:undefined,values:[]};
                        entities_coll[entities[i].key]=entities[i];                       

                    }                              

                    for(var j=0;  j < data.recordset.length; j++){

                        var entidad=entities_coll[data.recordset[j].Agrupador];

                        if(entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]] && !entidad){
                            entidad=entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]];
                        }

                        if( entidad ){

                            entidad.produccion.VolVenta_Plan+=Number(data.recordset[j].VolVenta_Plan);
                            entidad.produccion.VolVenta_Real+=Number(data.recordset[j].VolVenta_Real);
                            entidad.produccion.Pct_Radar+=Number(data.recordset[j].Pct_Radar);            

                            entidad.produccion.values.push(data.recordset[j]);
                            entidad.produccion.produccion=Math.round((entidad.produccion.Pct_Radar/entidad.produccion.values.length)*1000)/10;  

                            

                        }else{
                            console.log("no existe entidad mencionada en produccion:",data.recordset[j].Agrupador);
                        }                     

                    }

                    resolve();

                });
            }
        }else{
            alert("Error al encontrar URL API Produccion");
            resolve();
        }  

    });

}


calculateKpiExpert_Produccion.getTooltipDetail=function(entityId){    

    for(var i=0;  i < entities.length; i++){
       
        if(entities[i].key.toLowerCase()==entityId.toLowerCase()){

            var prodPer="Sin Dato";

            if(entities[i].produccion){

                if(entities[i].produccion.produccion!=undefined)
                    prodPer=entities[i].produccion.produccion+"%";
                
                var text=`<br><hr class="hr"><span style='color:#ffffff;font-size:${15*escalaTextos}px;'>Cumplimiento de Producción: </span><br>
                <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Diferencia: <span style='color:#ffffff'>${prodPer} <span style='color:#ffffff;font-size:${12*escalaTextos}px;'> (Plan: ${formatNumber(entities[i].produccion.VolVenta_Plan/1000)}k , Real:${formatNumber(entities[i].produccion.VolVenta_Real/1000)}k)<br>
                `

                return text;

            }
        }
            
    }
}


calculateKpiExpert_Produccion.downloadCSV=function(entityId){

    for(var i=0;  i < entities.length; i++){

            if(entities[i].key == entityId){

              var csv = 'Agrupador,DescrProducto,Destino,Pct_Radar,Peso,Planta,VolVenta_Plan,VolVenta_Real\n';

              var LLaves=["Agrupador","DescrProducto","Destino","Pct_Radar","Peso","Planta","VolVenta_Plan","VolVenta_Real"];
              
                    //merge the data with CSV

                        for(var j=0;  j < entities[i].produccion.values.length; j++){

                            for(var k=0;  k < LLaves.length; k++){
                                    csv +=entities[i].produccion.values[j][LLaves[k]]+',';
                            }

                            csv += "\n";
                    };

                    var hiddenElement = document.createElement('a');

                    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
                    hiddenElement.target = '_blank';

                    hiddenElement.download = 'Produccion nivel_'+$("#nivel_cb").val()+' '+entityId+' '+$('#datepicker').val()+' al '+$('#datepicker2').val()+' .csv';
                    hiddenElement.click();

            }

    }

}