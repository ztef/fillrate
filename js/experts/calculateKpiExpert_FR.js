var calculateKpiExpert_FR={};
var campoDeVolumenFR="CantEntfinal";
var campoDeATiempo="Estatus_Entrega_Orig_2";
var campoTotalSolicitado="CantSolfinal";

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

calculateKpiExpert_FR.calculateKPI=function(entities,varName,cb){  
    
    fillRateEntities=entities;

    if(!initialized){

        initialized=true;

        for(var k=0;  k < store.fillRate.length; k++){  

                totalCanSol_ref+=Number(store.fillRate[k][campoTotalSolicitado]);
                
                totalCanEnt_ref+=Number(store.fillRate[k][campoDeVolumenFR]);
                
                if(store.fillRate[k][campoDeATiempo] == "A Tiempo"){
                    vol1_ref+=Number(store.fillRate[k][campoDeVolumenFR]);
                }else if(store.fillRate[k][campoDeATiempo] == "1 a 2 días Tarde"){
                    vol2_ref+=Number(store.fillRate[k][campoDeVolumenFR]);
                }else if(store.fillRate[k][campoDeATiempo] == "3 o más días Tarde"){
                    vol3_ref+=Number(store.fillRate[k][campoDeVolumenFR]);
                }  
        }

        por1_ref=Math.round((vol1_ref/totalCanSol_ref)*100);
        por2_ref=Math.round((vol2_ref/totalCanSol_ref)*100);
        por3_ref=Math.round((vol3_ref/totalCanSol_ref)*100);

    }

    for(var i=0;  i < entities.length; i++){            

            entities[i][varName]={};
            entities[i][varName].totalVolumenEntregado=0;
            entities[i][varName].totalSolicitado=0;

            entities[i][varName].vol1=0;
            entities[i][varName].vol2=0;
            entities[i][varName].vol3=0;

            entities[i][varName].por1=0;
            entities[i][varName].por2=0;
            entities[i][varName].por3=0;

            // SE AGRUPAN POR PEDIDO, llavepos
            var pedidos = d3.nest()
                        .key(function(d) { return d.llavepos; })
                        .entries(entities[i].values);

            for(var j=0;  j < pedidos.length; j++){             

                for(var k=0;  k < pedidos[j].values.length; k++){

                        entities[i][varName].totalSolicitado+=Number(pedidos[j].values[k][campoTotalSolicitado]);
                
                        entities[i][varName].totalVolumenEntregado+=Number(pedidos[j].values[k][campoDeVolumenFR]);
                        
                        if(pedidos[j].values[k][campoDeATiempo] == "A Tiempo"){
                            entities[i][varName].vol1+=Number(pedidos[j].values[k][campoDeVolumenFR]);
                        }else if(pedidos[j].values[k][campoDeATiempo] == "1 a 2 días Tarde"){
                            entities[i][varName].vol2+=Number(pedidos[j].values[k][campoDeVolumenFR]);
                        }else if(pedidos[j].values[k][campoDeATiempo] == "3 o más días Tarde"){
                            entities[i][varName].vol3+=Number(pedidos[j].values[k][campoDeVolumenFR]);
                        }   
                    
                }

            }

            if(calculateKpiExpert_FR.max < entities[i][varName].totalVolumenEntregado)
                calculateKpiExpert_FR.max=entities[i][varName].totalVolumenEntregado;

            if(calculateKpiExpert_FR.min > entities[i][varName].totalVolumenEntregado)
                calculateKpiExpert_FR.min=entities[i][varName].totalVolumenEntregado;
            
            entities[i][varName].por1=Math.round((entities[i][varName].vol1/entities[i][varName].totalSolicitado)*100);
            entities[i][varName].por2=Math.round((entities[i][varName].vol2/entities[i][varName].totalSolicitado)*100);
            entities[i][varName].por3=Math.round((entities[i][varName].vol3/entities[i][varName].totalSolicitado)*100);

            entities[i][varName][varName]=entities[i][varName].por1;

            

    }

    //Valida si hay filtro de fillrate minimo  

    var dataToDrawFiltered=[];

    if($("#fillRate_cb").val()!=""){         

        var value=Number($("#fillRate_cb").val());   

        var entitiesFiltered=[];        

        for(var i=0;  i < entities.length; i++){   
            
            if(entities[i].fillRate.fillRate<=value){
                
                entitiesFiltered.push(entities[i]);

                for(var j=0;  j < entities[i].values.length; j++){ 
                    dataToDrawFiltered.push(entities[i].values[j]);
                }
            }            

        }  
       
        entities=entitiesFiltered;
        store.dataToDraw=dataToDrawFiltered;

    }

    entities=entities.sort((a, b) => b[varName].totalVolumenEntregado - a[varName].totalVolumenEntregado );

    loadsCount++;
    cb();

    return entities;

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

            
            var text=`<hr class="hr"><span style='color:#ffffff;font-size:${15*escalaTextos}px;'>FillRate: </span><br>
            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>A Tiempo: <span style='color:#00EAFF'>${fillRateEntities[i][varName].por1}% <span style='color:#00EAFF;font-size:${12*escalaTextos}px;'>(${formatNumber(fillRateEntities[i][varName].vol1)})<br>
            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>1 a 2 días: <span style='color:#FFCC00'>${fillRateEntities[i][varName].por2}% <span style='color:#FFCC00;font-size:${12*escalaTextos}px;'>(${formatNumber(fillRateEntities[i][varName].vol2)})<br>
            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Más de 3 días: <span style='color:#FF0000'>${fillRateEntities[i][varName].por3}% <span style='color:#FF0000;font-size:${12*escalaTextos}px;'>(${formatNumber(fillRateEntities[i][varName].vol3)})<br><br>

            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Volumen Entregado: <span style='color:#ffffff'>${Math.round((fillRateEntities[i][varName].totalVolumenEntregado/fillRateEntities[i][varName].totalSolicitado)*100)}% <span style='color:#ffffff;font-size:${12*escalaTextos}px;'>${formatNumber(fillRateEntities[i][varName].totalVolumenEntregado)}k<br>
            <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Volumen Solicitado: <span style='color:#ffffff'>${formatNumber(fillRateEntities[i][varName].totalSolicitado)}<br>

           
            `

            return text;
        }
            
    }
}