var calculateKpiExpert_OOSFiliales={};

calculateKpiExpert_OOSFiliales.calculateKPI=function(cb){ 

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

                for( var i=0; i < store.catlogsForFilters.length; i++ ){    
                        if(store.catlogsForFilters[i].data==nombreCatalogoParaDiccionario){
                                diccionarioNombres=store.catlogsForFilters[i].diccNames;
                                
                        }
                }
               

                for(var i=0; i < store.apiDataSources.length; i++){
          
                        if(store.apiDataSources[i].varName=="oosFiliales"){
                                
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
                        
                        
                       
                         var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                         console.log(URL);  

                        if(URL.indexOf("undefined" < 0)){

                                d3.json(URL, function (error, data) {

                                        $("#cargando").css("visibility","hidden");
                            
                                        if(error){
                                            alert("Error API OOS Filiales",error);
                                            resolve();
                                            return;
                                        }
            
                                        if(data.error){
                                            alert("Error API OOS Filiales",data.error);
                                            resolve();
                                            return;
                                        }
            
                                        console.log("oos filiales",data.recordset);

                                        for(var j=0;  j < data.recordset.length; j++){
                                                data.recordset[j].Nacional="Nacional";
                                        }

                                        var agrupador="";
    
                                        for(var i=0; i < store.niveles.length; i++){    
                                                if( store.niveles[i].id == $("#nivel_cb").val() )
                                                        agrupador=store.niveles[i].oosFlilialesField;           
                                        }
                                       
                                        if(agrupador==""){
                                                alert("No se tiene data de OOS Filiales en ese Nivel");
                                                resolve();
                                                return;
                                        }
 
                                        var entities_coll={};

                                        for(var i=0;  i < entities.length; i++){ 
            
                                                entities[i].oosFiliales={oosFiliales:0,Numerador:0,Denominador:0,values:[]};
                                                entities_coll[entities[i].key]=entities[i];                                 
                                        }     
                                        
                                        store.oosFiliales=[];

                                        for(var j=0;  j < data.recordset.length; j++){

                                                if(data.recordset[j].Fecha!=""){
                                                        
                                                        if( data.recordset[j].Fecha.indexOf("T") > -1){
                
                                                                var fechaSplit=data.recordset[j].Fecha.split("T");
                                                                
                                                                fechaSplit=fechaSplit[0].split("-");                   
                                        
                                                        }else{
                                                                
                                                                var fechaSplit=data.recordset[j].Fecha.split("-");
                                          
                                                        }                   
                                        
                                                        data.recordset[j].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2])); 
                        
                                                }

                                                var entidad=entities_coll[data.recordset[j][agrupador]];

                                                if(entities_coll[ diccionarioNombres[ data.recordset[j][agrupador] ]] && !entidad){
                                                        entidad=entities_coll[ diccionarioNombres[ data.recordset[j][agrupador] ]];
                                                }

                                                if( entidad ){

                                                        entidad.oosFiliales.Numerador+=Number(data.recordset[j].Numerador); 
                                                        entidad.oosFiliales.Denominador+=Number(data.recordset[j].Denominador); 
                                                        entidad.oosFiliales.values.push(data.recordset[j]);                                                   
                        
                                                }else{
                                                        console.log("no existe entidad mencionada en OOS Filiales:",data.recordset[j][agrupador]);
                                                }  

                                                store.oosFiliales.push(data.recordset[j]);

                                        }

                                        for(var i=0;  i < entities.length; i++){ 
                                                if(entities[i].oosFiliales.Numerador>0){
                                                      
                                                        entities[i].oosFiliales.oosFiliales=Math.round(  (entities[i].oosFiliales.Numerador/entities[i].oosFiliales.Denominador)    *10000)/100;
                                                }else{
                                                        entities[i].oosFiliales.oosFiliales=0;
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


calculateKpiExpert_OOSFiliales.calculateFRPorEstado=function(estados){

        for(var i=0;  i < estados.length; i++){ 

                estados[i].Numerador=0; 
                estados[i].Denominador=0; 

                for(var j=0;  j < estados[i].values.length; j++){

                        estados[i].Numerador+=Number(estados[i].values[j].Numerador); 
                        estados[i].Denominador+=Number(estados[i].values[j].Denominador); 
                        
                }

                estados[i].oosFiliales=Math.round(  (estados[i].Numerador/estados[i].Denominador)    *10000)/100; 

         
                var color="#cccccc";
                if(estados[i].oosFiliales <= 8){
                    color="#28F100";
                }else if(estados[i].oosFiliales <= 10){
                    color="#FFF60C";
                }else if(estados[i].oosFiliales > 10){
                    color="#FF0000";
                }
            
                DibujaEstadoEspecifico(estados[i].key, color);

        }

}


calculateKpiExpert_OOSFiliales.filterByLevel=function(entities){

        //Valida si hay filtro de oosFiliales minimo  
        var dataToDrawFiltered=[];
    
        if($("#oosfil_cb").val()!=""){         
    
            var value=Number($("#oosfil_cb").val());   
    
            var entitiesFiltered=[];        
    
            for(var i=0;  i < entities.length; i++){   
    
                // SE FILTRAN SOLO AQUELLOS QUE CUMPLEN CON CRITERIO DE FILTRADO DE FILL RATE
                if(entities[i].oosFiliales.oosFiliales>=value){
                    
                    entitiesFiltered.push(entities[i]);
                    
                    for(var j=0;  j < entities[i].values.length; j++){ 
                        dataToDrawFiltered.push(entities[i].values[j]);
                    }
                }            
    
            }  
           
            entities=entitiesFiltered;
            store.dataToDraw=dataToDrawFiltered;
    
            return entities;
    
        }else{
                return entities;
        }    
    
    }



calculateKpiExpert_OOSFiliales.getTooltipDetail=function(entityId){    

        for(var i=0;  i < entities.length; i++){                
           
            if(entities[i].key.toLowerCase()==entityId.toLowerCase()){

                var prodPer="Sin Dato";
    
                if(entities[i].oosFiliales){

                        if(entities[i].oosFiliales.oosFiliales!=undefined)
                                prodPer=entities[i].oosFiliales.oosFiliales+"%";

                        var text=`<div class="tooltipDetailElement"><img id="" src="images/OOS.png" style=""></img>
                        <span style='color:#ffffff;font-size:${15*escalaTextos}px;'>OOS Filiales: </span><br>
                        <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Total:</span> <span style='color:#ffffff'>${ prodPer }</span><br>
                        </div>
                        `
                        return text;

                }
            }
                
        }
    }




    calculateKpiExpert_OOSFiliales.downloadCSV=function(entityId){

        for(var i=0;  i < entities.length; i++){
    
                if(entities[i].key == entityId){
    
                        var csv = 'Agrupador,CantEntFinal,CantEntFinal_Total,Denominador,DescrProducto,Destino,N1,N2,N3,Numerador,OOS_Final,grupo\n';
    
                        var LLaves=["Agrupador","CantEntFinal","CantEntFinal_Total","Denominador","DescrProducto","Destino","N1","N2","N3","Numerador","OOS_Final","Grupo"];
    
                        //merge the data with CSV
    
                            for(var j=0;  j < entities[i].oosFiliales.values.length; j++){
    
                                for(var k=0;  k < LLaves.length; k++){
                                        csv +=entities[i].oosFiliales.values[j][LLaves[k]]+',';
                                }
    
                                csv += "\n";
                        };
    
                        var hiddenElement = document.createElement('a');
    
                        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
                        hiddenElement.target = '_blank';
    
                        hiddenElement.download = 'Out Of Stock nivel_'+$("#nivel_cb").val()+' '+entityId+' '+$('#datepicker').val()+' al '+$('#datepicker2').val()+' .csv';
                        hiddenElement.click();
    
                }
    
        }
    
    }