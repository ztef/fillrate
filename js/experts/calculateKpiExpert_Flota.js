var calculateKpiExpert_Flota={};


calculateKpiExpert_Flota.calculateKPI=function(entities){  
  
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
          
            if(store.apiDataSources[i].varName=="flota"){
               
                serviceName=store.apiDataSources[i].serviceName;

                if(store.map_var==kpiExpert_FR){

                    serviceName ="getSP/Generico?spname=VIS_Calcular_KPI_Flota_FillRate";                   
        
                }else if(store.map_var==kpiExpert_OOS_Filiales){               
                
                        serviceName ="getSP/Generico?spname=VIS_Calcular_KPI_Flota_OOSFiliales";

                      
                }else if(store.map_var==drawKpiExpert_VENTAS){               
                
                        serviceName ="getSP/Generico?spname=VIS_Calcular_KPI_Flota_Venta";

                }



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


            var URL=apiURL+"/"+serviceName+"&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
            console.log(URL); 

            if(URL.indexOf("undefined" < 0)){
                d3.json(URL, function (error, data) {

                    $("#cargando").css("visibility","hidden");

                    
                    if(error){
                        alert("Error API Flota",error);
                        resolve();
                        return;
                    }

                    if(data.error){
                        alert("Error API Flota",data.error);
                        resolve();
                        return;
                    }

                    console.log("Flota",data.recordset);

                    var entities_coll={};

                    for(var i=0;  i < entities.length; i++){ 
            
                        entities[i].flota={flota:0,values:[],deficit:0};
                        entities_coll[entities[i].key]=entities[i];      

                    } 

                    for(var j=0;  j < data.recordset.length; j++){

                        var entidad=entities_coll[data.recordset[j].Agrupador];

                        if(entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]] && !entidad){
                                entidad=entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]];
                        }

                        if( entidad ){

                            entidad.flota.flota+=Number(data.recordset[j].Pct_Radar)*100; 
                            entidad.flota.deficit+=Number(data.recordset[j].Deficit); 
                          

                            entidad.flota.values.push(data.recordset[j]);                                                              

                        }else{
                                if(data.recordset[j].Agrupador!=null)
                                        console.log("no existe entidad mencionada en Flota:",data.recordset[j].Agrupador);
                        }  

                    }

                    resolve();

                });

            }

        }else{
            alert("Error al encontrar URL API Flota");
            resolve();
        }


    });

}


calculateKpiExpert_Flota.getTooltipDetail=function(entityId){    

    for(var i=0;  i < entities.length; i++){                
       
        if(entities[i].key.toLowerCase()==entityId.toLowerCase()){

            var prodPer="Sin Dato";

            if(entities[i].oos){

                    if(entities[i].oos.oos!=undefined)
                            prodPer= String(Math.round(entities[i].flota.deficit*10)/10) + "";

                    var text=`<div class="tooltipDetailElement"><img id="" src="images/ico deficit de flota.png" style=""></img>
                    <span style='color:#ffffff;font-size:${15*escalaTextos}px;'>Déficil de Flota: </span><br>
                    <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Total:</span> <span style='color:#ffffff'>${ prodPer }</span><br>
                   
                    </div>
                    `
                    return text;

            }
        }
            
    }
}
