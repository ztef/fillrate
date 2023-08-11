var dataManager={};

//PROCESO QUE AGRUPA ELEMENTOS SEGUN EL NIVEL AL Q SE ENCUENTRA
var entities;
dataManager.ClusterObjects=function(){

    Stage.blockScreen.style("visibility","visible");      

    if(svgRadar){
        radar.CleanWindows();
        svgRadar.selectAll(".radarElement").data([]).exit().remove();
       
    }      

    if(backInfoNav.entity){
        $("#back_btn").css("visibility","visible");
    }
    

    var agrupador="";

    
    for(var i=0; i < store.niveles.length; i++){    
       if( store.niveles[i].id == $("#nivel_cb").val() )
            agrupador=store.niveles[i].field;           
    }

    if(!agrupador==""){
        entities  = d3.nest()
                        .key(function(d) { return  d[agrupador]; })                           
                        .entries(store.dataToDraw);
    }else{
        entities = [{key:"Nacional" , values:store.dataToDraw}];
    }    

    
    //Utiliza un timeout solo para q sea posible poner una pantalla de espera (negra)
    setTimeout(()=>{

        filterControls.showActiveFilters();

        dataManager.CalculateKPIs(entities);
        $('#Controls').hide();

        //en casod e que exista un campo ara busqueda de entidades lo llena
        if( $("#inputEnfoqueCamara") ){

            $("#inputEnfoqueCamara").val("");

            var arrAutoCompleteArr=[];   

            for(var j=0;  j < entities.length; j++){
                arrAutoCompleteArr.push(entities[j].key);
            }

            autocomplete(document.getElementById("inputEnfoqueCamara"), arrAutoCompleteArr);
        }

    }, 100);

}

//PROCESO QUE GESTIONA CALCULOS DE KPI´s SEGUN EL NIVEL EN EL Q SE ENCUENTRA
var loadsCount=0;
var loadsTarget=0;

dataManager.CalculateKPIs=function(entities_){ 

    console.log("CalculateKPIs");   

    loadsCount=0;

    loadsTarget=7;

    // 1
    entities = calculateKpiExpert_FR.calculateKPI(entities_,"fillRate",dataManager.checkAllLoads);  
    
    console.log("entities",entities);
    
    
    // 2
    if(calculateKpiExpert_Pendientes && $("#nivel_cb").val() ){
        
        calculateKpiExpert_Pendientes.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                                });
    }
    
    
    
    // 3
    if(calculateKpiExpert_Ventas){
       
        calculateKpiExpert_Ventas.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                             });
    }  
    
    

    // 4
    if(calculateKpiExpert_Abasto && $("#nivel_cb").val() ){
        
        calculateKpiExpert_Abasto.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                             });
    }     
   
    // 5
    if(calculateKpiExpert_OOS){
        
        calculateKpiExpert_OOS.calculateKPI(entities).then(()=>{
            loadsCount++;
            dataManager.checkAllLoads();
         });

    }    
   
 
    // 6  
    if(calculateKpiExpert_Mas){
    
        calculateKpiExpert_Mas.calculateKPI(entities,dataManager.checkAllLoads);
    }  
    

    // 7
    if(calculateKpiExpert_Produccion && $("#nivel_cb").val()  ){
        
        calculateKpiExpert_Produccion.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataManager.checkAllLoads();
                                                             });
    }    

    
    

}

dataManager.checkAllLoads=function(){ 
    
    console.log(loadsTarget,loadsCount);

    if(loadsTarget==loadsCount){

        radar.DrawEntities(entities);

        Stage.DrawMapObjects(entities,store.mainDataset);

        kpiExpert_FR.DrawMainHeader();

        kpiExpert_FR.DrawFilteredHeader();

    }
}