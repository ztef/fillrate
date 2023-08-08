var calculateKpiExpert_OOS={};

calculateKpiExpert_OOS.calculateKPI=function(entities,cb){  

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
          
                        if(store.apiDataSources[i].varName=="oos"){
                                
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
            
                         var URL=apiURL+"/"+serviceName+"&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                         console.log(URL);  

                        if(URL.indexOf("undefined" < 0)){

                                d3.json(URL, function (error, data) {

                                        $("#cargando").css("visibility","hidden");
                            
                                        if(error){
                                            alert("Error API OOS",error);
                                            resolve();
                                            return;
                                        }
            
                                        if(data.error){
                                            alert("Error API OOS",data.error);
                                            resolve();
                                            return;
                                        }
            
                                        console.log("oos",data.recordset); 
                                        
                                        var entities_coll={};

                                        for(var i=0;  i < entities.length; i++){ 
            
                                            entities[i].oos={oos:0,Numerador:0,Denominador:0,values:[]};
                                            entities_coll[entities[i].key]=entities[i];                                 
                                        }  

                                        for(var j=0;  j < data.recordset.length; j++){

                                                var entidad=entities_coll[data.recordset[j].Agrupador];

                                                if(entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]] && !entidad){
                                                        entidad=entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]];
                                                }

                                                if( entidad ){

                                                        entidad.oos.Numerador+=Number(data.recordset[j].Numerador); 
                                                        entidad.oos.Denominador+=Number(data.recordset[j].Denominador); 
                                                        entidad.oos.values.push(data.recordset[j]);                                                   
                        
                                                }else{
                                                        console.log("no existe entidad mencionada en OOS:",data.recordset[j].Agrupador);
                                                }  

                                        }

                                        for(var i=0;  i < entities.length; i++){ 
            
                                                entities[i].oos.oos=Math.round(  (entities[i].oos.Numerador/entities[i].oos.Denominador)    *10000)/100;
                                                                                
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



calculateKpiExpert_OOS.getTooltipDetail=function(entityId){    

        for(var i=0;  i < entities.length; i++){                
           
            if(entities[i].key.toLowerCase()==entityId.toLowerCase()){

                var prodPer="Sin Dato";
    
                if(entities[i].oos){

                        if(entities[i].oos.oos!=undefined)
                                prodPer=entities[i].oos.oos+"%";

                        var text=`<hr class="hr"><span style='color:#ffffff;font-size:${15*escalaTextos}px;'>OOS: </span><br>
                        <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Total: <span style='color:#ffffff'>${ prodPer }
                        `
                        return text;

                }
            }
                
        }
    }




    calculateKpiExpert_OOS.downloadCSV=function(entityId){

        for(var i=0;  i < entities.length; i++){
    
                if(entities[i].key == entityId){
    
                        var csv = 'Agrupador,CantEntFinal,CantEntFinal_Total,Denominador,DescrProducto,Destino,N1,N2,N3,Numerador,OOS_Final,grupo\n';
    
                        var LLaves=["Agrupador","CantEntFinal","CantEntFinal_Total","Denominador","DescrProducto","Destino","N1","N2","N3","Numerador","OOS_Final","Grupo"];
    
                        //merge the data with CSV
    
                            for(var j=0;  j < entities[i].oos.values.length; j++){
    
                                for(var k=0;  k < LLaves.length; k++){
                                        csv +=entities[i].oos.values[j][LLaves[k]]+',';
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