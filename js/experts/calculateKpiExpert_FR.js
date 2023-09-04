var calculateKpiExpert_FR={};
var campoDeVolumenFR="CantEntFinal";
var campoDeATiempo="Estatus_Entrega_Orig_2";
var campoTotalSolicitado="CantSolFinal";

var fillRateEntities=[];

var totalCanEnt_ref=0;
var totalCanSol_ref=0;

var vol1_ref=0;
var vol2_ref=0;
var vol3_ref=0;

var por1_ref=0;
var por2_ref=0;
var por3_ref=0;

var initialized=false;

calculateKpiExpert_FR.max=0;
calculateKpiExpert_FR.min=1000000000;

calculateKpiExpert_FR.calculateKPI=function(){  

    $("#cargando").css("visibility","visible");

    return new Promise((resolve, reject) => {

        var serviceName;
        var apiURL;
        var agrupador="";

        for(var i=0; i < store.niveles.length; i++){    
     
            if( store.niveles[i].id == $("#nivel_cb").val() ){
                
                    agrupador=store.niveles[i].storeProcedureField; 
                   
            }                        
        }

        
        for(var i=0; i < store.apiDataSources.length; i++){
          
            if(store.apiDataSources[i].varName=="fillRate"){
                    
                    serviceName=store.apiDataSources[i].serviceName;
                    apiURL=store.apiDataSources[i].apiURL;
            }

        }

        if(serviceName && apiURL){

            var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
            var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
           

        }

        // FILTROS****
        var params="";
                       
        for(var j=0; j < store.catlogsForFilters.length; j++){

            if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined ){

                params+="&"+store.catlogsForFilters[j].storeProcedureField+"="+store.catlogsForFilters[j].diccNames[ $("#"+store.catlogsForFilters[j].id).val() ];

            }

        }

        if(serviceName && apiURL){

                //FILTRO DE MASIVO
                if($("#masivos_cb").val() == "Todos" || $("#masivos_cb").val() == ""){

                        params+="&Masivos=Todos";               

                }else if($("#masivos_cb").val() == "SinMasivos"){

                        params+="&Masivos=Sin Masivos"; 

                }else if($("#masivos_cb").val() == "SoloMasivos"){

                        params+="&Masivos=Solo Masivos"; 
                        
                }

                if(!initialized){
                    params+="&AgrupProducto=Gris"
                }

                var URL=apiURL+"/"+serviceName+"?fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"&agrupador="+agrupador+""+params;
                console.log(URL); 

                    if(URL.indexOf("undefined" < 0)){

                        d3.json(URL, function (error, data) {

                            $("#cargando").css("visibility","hidden");

                            if(error){
                                alert("Error API FillRate",error);
                                resolve();
                                return;
                            }

                            if(data.error){
                                alert("Error API FillRate",data.error);
                                resolve();
                                return;
                            }

                            console.log("fillRate",data.recordset); 

                            if(data.recordset.length == 0){
                                alert("No hay data de FillRate obtenida, revisar filtros");
                                return;
                            }

                            entities  = d3.nest()
                                .key(function(d) { return  d.Agrupador; })                           
                                .entries(data.recordset);

                            for(var i=0; i < entities.length; i++){
                                if(entities[i].key == null || entities[i].key == undefined || entities[i].key == "" || entities[i].key == "null"){
                                    entities.splice(i,1);
                                    break;
                                }
                            }

                            fillRateEntities=entities;
                            calculateKpiExpert_FR.max=0;

                            if(!initialized){

                                initialized=true;

                                totalCanEnt_ref=0;
                                totalCanSol_ref=0;

                                 vol1_ref=0;
                                 vol2_ref=0;
                                 vol3_ref=0;

                                 por1_ref=0;
                                 por2_ref=0;
                                 por3_ref=0;

                                for(var j=0;  j < data.recordset.length; j++){

                                    totalCanSol_ref+=Number(data.recordset[j][campoTotalSolicitado]);
                                
                                    totalCanEnt_ref+=Number(data.recordset[j][campoDeVolumenFR]);

                                    if(data.recordset[j][campoDeATiempo] == "A Tiempo"){
                                        vol1_ref+=Number(data.recordset[j][campoDeVolumenFR]);
                                    }else if(data.recordset[j][campoDeATiempo] == "1 a 2 días Tarde"){
                                        vol2_ref+=Number(data.recordset[j][campoDeVolumenFR]);
                                    }else if(data.recordset[j][campoDeATiempo] == "3 o más días Tarde"){
                                        vol3_ref+=Number(data.recordset[j][campoDeVolumenFR]);
                                    }

                                }

                                por1_ref=Math.round((vol1_ref/totalCanSol_ref)*100);
                                por2_ref=Math.round((vol2_ref/totalCanSol_ref)*100);
                                por3_ref=Math.round((vol3_ref/totalCanSol_ref)*100);

                                store.fillRate=data.recordset;

                            }

                            for(var i=0;  i < entities.length; i++){ 

                                entities[i].fillRate={};
                                entities[i].fillRate.totalVolumenEntregado=0;
                                entities[i].fillRate.totalSolicitado=0;

                                entities[i].fillRate.vol1=0;
                                entities[i].fillRate.vol2=0;
                                entities[i].fillRate.vol3=0;

                                entities[i].fillRate.por1=0;
                                entities[i].fillRate.por2=0;
                                entities[i].fillRate.por3=0;

                                for(var k=0;  k < entities[i].values.length; k++){

                                    entities[i].fillRate.totalSolicitado+=Number(entities[i].values[k][campoTotalSolicitado]);
                    
                                    entities[i].fillRate.totalVolumenEntregado+=Number(entities[i].values[k][campoDeVolumenFR]);

                                    if(entities[i].values[k][campoDeATiempo] == "A Tiempo"){
                                        entities[i].fillRate.vol1+=Number(entities[i].values[k][campoDeVolumenFR]);
                                    }else if(entities[i].values[k][campoDeATiempo] == "1 a 2 días Tarde"){
                                        entities[i].fillRate.vol2+=Number(entities[i].values[k][campoDeVolumenFR]);
                                    }else if(entities[i].values[k][campoDeATiempo] == "3 o más días Tarde"){
                                        entities[i].fillRate.vol3+=Number(entities[i].values[k][campoDeVolumenFR]);
                                    } 

                                    //Crea objetos fecha para cada record
                                    if(entities[i].values[k].dtOnSiteFinal != ""){

                                        if(entities[i].values[k].dtOnSiteFinal.indexOf("T") > -1){
                
                                            var fechaSplit=entities[i].values[k].dtOnSiteFinal.split("T");
                                            
                                            fechaSplit=fechaSplit[0].split("-");                   
                
                                        }else{
                                            var fechaSplit=data[i][def.dateField].split("-");
                    
                                        }                
                
                                        entities[i].values[k].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2]));                   
                
                                    } 

                                }

                                if(calculateKpiExpert_FR.max < entities[i].fillRate.totalVolumenEntregado)
                                calculateKpiExpert_FR.max=entities[i].fillRate.totalVolumenEntregado;
                
                                if(calculateKpiExpert_FR.min > entities[i].fillRate.totalVolumenEntregado)
                                    calculateKpiExpert_FR.min=entities[i].fillRate.totalVolumenEntregado;

                                entities[i].fillRate.por1=Math.round((entities[i].fillRate.vol1/entities[i].fillRate.totalSolicitado)*100);
                                entities[i].fillRate.por2=Math.round((entities[i].fillRate.vol2/entities[i].fillRate.totalSolicitado)*100);
                                entities[i].fillRate.por3=Math.round((entities[i].fillRate.vol3/entities[i].fillRate.totalSolicitado)*100);
                    
                                entities[i].fillRate.fillRate=entities[i].fillRate.por1;
                                   

                            }

                            store.dataToDraw=data.recordset;

                            resolve();

                        });

                    }

        }else{
            alert("Error al encontrar URL API Fillrate");
            resolve();
        }

    });

}


calculateKpiExpert_FR.filterByLevel=function(entities){

    //Valida si hay filtro de fillrate minimo  
    var dataToDrawFiltered=[];

    if($("#fillRate_cb").val()!=""){         

        var value=Number($("#fillRate_cb").val());   

        var entitiesFiltered=[];        

        for(var i=0;  i < entities.length; i++){   

            // SE FILTRAN SOLO AQUELLOS QUE CUMPLEN CON CRITERIO DE FILTRADO DE FILL RATE
            if(entities[i].fillRate.fillRate<=value){
                
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


calculateKpiExpert_FR.calculateFRPorEstado=function(estados){

    for(var i=0;  i < estados.length; i++){ 

            estados[i].totalSolicitado=0;
            estados[i].vol1=0;
            estados[i].por1=0;

            // SE AGRUPAN POR PEDIDO, llavepos
            var pedidos = d3.nest()
                        .key(function(d) { return d.llavepos; })
                        .entries(estados[i].values);

            for(var j=0;  j < pedidos.length; j++){             

                for(var k=0;  k < pedidos[j].values.length; k++){

                    estados[i].totalSolicitado+=Number(pedidos[j].values[k][campoTotalSolicitado]);

                    if(pedidos[j].values[k][campoDeATiempo] == "A Tiempo"){
                        estados[i].vol1+=Number(pedidos[j].values[k][campoDeVolumenFR]);
                    }

                }

            }

            estados[i].por1=Math.round((estados[i].vol1/estados[i].totalSolicitado)*100);

            var color="#ffffff";
            if(estados[i].por1 >= 90){
                color="#18CC00";
            }else if(estados[i].por1 <= 70){
                color="#FF0000";
            }else{
                color="#F0FF00";
            }

            DibujaEstadoEspecifico(estados[i].key, color);

    }

}


calculateKpiExpert_FR.getTooltipDetail=function(entityId,varName){    

    for(var i=0;  i < fillRateEntities.length; i++){
       
        if(fillRateEntities[i].key.toLowerCase()==entityId.toLowerCase()){

            var text=`<div class="tooltipDetailElement"><img id="" src="images/fillrate.png" style=""></img>
            <span style='color:#ffffff;font-size:${15*escalaTextos}px;'>FillRate: </span><br>
            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>A Tiempo: </span><span style='color:#00EAFF'>${fillRateEntities[i][varName].por1}% </span><span style='color:#00EAFF;font-size:${12*escalaTextos}px;'>(${formatNumber(fillRateEntities[i][varName].vol1)})</span><br>
            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>1 a 2 días: </span> <span style='color:#FFCC00'>${fillRateEntities[i][varName].por2}% </span><span style='color:#FFCC00;font-size:${12*escalaTextos}px;'>(${formatNumber(fillRateEntities[i][varName].vol2)})</span><br>
            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Más de 3 días: </span> <span style='color:#FF0000'>${fillRateEntities[i][varName].por3}% </span><span style='color:#FF0000;font-size:${12*escalaTextos}px;'>(${formatNumber(fillRateEntities[i][varName].vol3)})</span><br><br>

            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Volumen Entregado:</span> <span style='color:#ffffff'>${Math.round((fillRateEntities[i][varName].totalVolumenEntregado/fillRateEntities[i][varName].totalSolicitado)*100)}% </span><span style='color:#ffffff;font-size:${12*escalaTextos}px;'>${formatNumber(fillRateEntities[i][varName].totalVolumenEntregado)}k</span><br>
            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Volumen Solicitado:</span> <span style='color:#ffffff'>${formatNumber(fillRateEntities[i][varName].totalSolicitado)}</span><br>
            </div>
            `
            return text;
        }
            
    }
}