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

                                params+="&masivos=Todos";               

                        }else if($("#masivos_cb").val() == "SinMasivos"){

                                params+="&masivos=Sin Masivos"; 

                        }else if($("#masivos_cb").val() == "SoloMasivos"){

                                params+="&masivos=Solo Masivos"; 
                                
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
            
                                            entities[i].oos={oos:0,Numerador:0,Denominador:0,oos_lastDate:{Numerador:0,Denominador:0,oos:undefined},values:[]};
                                            entities_coll[entities[i].key]=entities[i];                                 
                                        }  

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

                                                var entidad=entities_coll[data.recordset[j].Agrupador];

                                         
                                                if(entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ] ] && !entidad){
                                                        entidad=entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]];
                                                }

                                                if( entidad ){

                                                        entidad.oos.Numerador+=Number(data.recordset[j].Numerador); 
                                                        entidad.oos.Denominador+=Number(data.recordset[j].Denominador); 
                                                        entidad.oos.values.push(data.recordset[j]);                                                   
                        
                                                }else{
                                                        if(data.recordset[j].Agrupador!=null)
                                                                console.log("no existe entidad mencionada en OOS:",data.recordset[j].Agrupador);
                                                }  

                                        }

                                        for(var i=0;  i < entities.length; i++){ 

                                                
                                                for(var j=0;  j < data.recordset.length; j++){                                                        

                                                        var entidad=entities_coll[data.recordset[j].Agrupador];

                                                        if(entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]] && !entidad){
                                                                entidad=entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]];
                                                        }

                                                        if( entidad ){

                                                                if( data.recordset[j].fecha.getTime() == maxDate ){
                                                                        entidad.oos.oos_lastDate.Numerador+=Number(data.recordset[j].Numerador); 
                                                                        entidad.oos.oos_lastDate.Denominador+=Number(data.recordset[j].Denominador); 
                                                                        entidad.oos.oos_lastDate.oos=Math.round(  (entidad.oos.oos_lastDate.Numerador/entidad.oos.oos_lastDate.Denominador)    *10000)/100;

                                                                }                                              
                                
                                                        }
        
                                                }

                                        }                                       

                                        
                                        for(var i=0;  i < entities.length; i++){ 

                                                if(entities[i].oos.Numerador>0){                                                      

                                                        entities[i].oos.oos=Math.round(  (entities[i].oos.Numerador/entities[i].oos.Denominador)    *10000)/100;
                                                }else{
                                                        entities[i].oos.oos=0;
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


calculateKpiExpert_OOS.getTooltipDetail=function(entityId){    

        for(var i=0;  i < entities.length; i++){                
           
            if(entities[i].key.toLowerCase()==entityId.toLowerCase()){

                var prodPer="Sin Dato";
    
                if(entities[i].oos){

                        if(entities[i].oos.oos!=undefined)
                                prodPer=entities[i].oos.oos+"%";

                        var text=`<div class="tooltipDetailElement"><img id="" src="images/OOS.png" style=""></img>
                        <span style='color:#ffffff;font-size:${15*escalaTextos}px;'>OOS: </span><br>
                        <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Total:</span> <span style='color:#ffffff'>${ prodPer }</span><br>
                        <span style='color:#fff600;font-size:${15*escalaTextos}px;'>OOS Ultima Fecha:</span> <span style='color:#ffffff'>${ entities[i].oos.oos_lastDate.oos }% <span style='color:#ffffff;font-size:${12*escalaTextos}px;'> (Num: ${entities[i].oos.oos_lastDate.Numerador})</span></span><br>
                        </div>
                        `
                        return text;

                }
            }
                
        }
    }




    calculateKpiExpert_OOS.downloadCSV=function(entityId){

        for(var i=0;  i < entities.length; i++){
    
                if(entities[i].key == entityId){
    
                        var csv = 'Agrupador,CantEntFinal,Denominador,DescrProducto,Destino,Fecha,Fisico,Numerador,grupo\n';
    
                        var LLaves=["Agrupador","CantEntFinal","Denominador","DescrProducto","Destino","Fecha","Fisico","Numerador","grupo"];
                        
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