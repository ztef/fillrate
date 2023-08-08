
var calculateKpiExpert_Ventas={};

calculateKpiExpert_Ventas.calculateKPI=function(entities){

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
          
            if(store.apiDataSources[i].varName=="ventas"){
               
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
                        alert("Error API Ventas",error);
                        resolve();
                        return;
                    }

                    if(data.error){
                        alert("Error API Ventas",data.error);
                        resolve();
                        return;
                    }

                    console.log("ventas",data.recordset);      

                    var entities_coll={};

                    for(var i=0;  i < entities.length; i++){ 

                        entities[i].ventas={VolumenPlan:0,VolumenReal:0,VolPlan_FR:0 ,VolReal_FR:0, ventas:undefined,values:[]};
                        entities_coll[entities[i].key]=entities[i];                       

                    } 


                    for(var j=0;  j < data.recordset.length; j++){
                        var entidad=entities_coll[data.recordset[j].Agrupador];

                        if(entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]] && !entidad){
                            entidad=entities_coll[ diccionarioNombres[ data.recordset[j].Agrupador ]];
                        }

                        if( entidad ){

                            entidad.ventas.VolumenPlan+=Number(data.recordset[j].VolumenPlan);
                            entidad.ventas.VolumenReal+=Number(data.recordset[j].VolumenReal);
                            entidad.ventas.VolPlan_FR+=Number(data.recordset[j].VolPlan_FR);
                            entidad.ventas.VolReal_FR+=Number(data.recordset[j].VolReal_FR);

                            entidad.ventas.values.push(data.recordset[j]);

                            if(entidad.ventas.VolumenReal>0){
                                entidad.ventas.difPer=Math.round((entidad.ventas.VolumenReal/entidad.ventas.VolumenPlan)*100);
                                entidad.ventas.ventas=entidad.ventas.difPer;
                            }

                        }else{
                            console.log("no existe entidad mencionada en ventas:",data.recordset[j].Agrupador);
                        }

                    }

                    resolve();

                });
            }


        }else{
            alert("Error al encontrar URL API Ventas");
            resolve();
        } 

    });
}  




calculateKpiExpert_Ventas.getTooltipDetail=function(entityId){

    for(var i=0;  i < entities.length; i++){

        if(entities[i].key.toLowerCase()==entityId.toLowerCase()){

            var prodPer="Sin Dato";

            if(entities[i].ventas){

                if(entities[i].ventas.ventas!=undefined)
                    prodPer=entities[i].ventas.ventas+"%";

                var text=`<br><hr class="hr"><span style='color:#ffffff;font-size:15px;'>CUMPLIMIENTO VENTAS: </span><br>
                <span style='color:#fff600;font-size:15px;'>Diferencia: <span style='color:#ffffff'>${prodPer} <span style='color:#ffffff;font-size:10px;'> (Plan: ${formatNumber(entities[i].ventas.VolumenPlan/1000)}k , Real:${formatNumber(entities[i].ventas.VolumenReal/1000)}k)<br>
                `

                return text;

            }
        }

    }
}




calculateKpiExpert_Ventas.downloadCSV=function(entityId){

    for(var i=0;  i < entities.length; i++){

            if(entities[i].key == entityId){

                    var csv = 'AgrupProducto,Agrupador,CantEntFinal,CantEntFinal_2,CantEntFinal_Suma,ContRows,Dif_FR,Dif_FR_NP,EstadoDem,PctPlan,PctPlan_FR,PctReal,PctReal_FR,Presentacion,VolPlan_Acum,VolPlan_FR,VolPlan_FR_NP,VolPlan_FR_Total,VolReal_Acum,VolReal_FR,VolReal_FR_NP,VolReal_FR_Total,VolumenPlan,VolumenPlan_Total,VolumenReal,VolumenReal_Total\n';

                    var LLaves=["Agrupador","FechaActual","Libre_Pendiente_Hoy","Libre_Programado_CaminoRural","Libre_Programado_NoProg","Libre_Programado_Programable","Libre_Programado_Total","Libre_RecAutf","Libre_Retrasado","Libre_Retrasado_CaminoRural","Libre_Retrasado_NoProg_1D","Libre_Retrasado_NoProg_2D","Libre_Retrasado_NoProg_3D","Libre_Retrasado_NoProg_4D","Libre_Retrasado_NoProg_5D","Libre_Retrasado_NoProg_6D","Libre_Retrasado_NoProg_7oMas","Libre_Retrasado_NoProg_Total","Libre_Retrasado_Programable","Libre_Total","Libre_TotalPorEntregar","Retenido_Entregado","Retenido_RecAutf","Retenido_Total","Total","fecha"];

                    //merge the data with CSV

                        for(var j=0;  j < entities[i].ventas.values.length; j++){

                            for(var k=0;  k < LLaves.length; k++){
                                    csv +=entities[i].ventas.values[j][LLaves[k]]+',';
                            }

                            csv += "\n";
                    };

                    var hiddenElement = document.createElement('a');

                    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
                    hiddenElement.target = '_blank';

                    hiddenElement.download = 'Ventas nivel_'+$("#nivel_cb").val()+' '+entityId+' '+$('#datepicker').val()+' al '+$('#datepicker2').val()+' .csv';
                    hiddenElement.click();

            }

    }

}