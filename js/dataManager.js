var dataManager={};

dataManager.CambiaModoKPI=function(modo){

    console.log(modo);

    $("#iconFR").attr("src","images/mode_1.png");
    $("#iconOOSF").attr("src","images/mode_2.png");
    $("#iconVenta").attr("src","images/mode_3.png");

    if(modo =="FR"){

        store.map_var=kpiExpert_FR;
        $("#iconFR").attr("src","images/mode1_.png");
        $("#logo").attr("src","images/logo1.png");
        dataManager.ClusterObjects();
        

    }else if(modo =="OOS F"){

        store.map_var=kpiExpert_OOS_Filiales;
        $("#iconOOSF").attr("src","images/mode2_.png");
        $("#logo").attr("src","images/logo2.png");
        dataManager.ClusterObjects();
       

    }else if(modo =="Venta"){

        store.map_var=drawKpiExpert_VENTAS;
        $("#iconVenta").attr("src","images/mode3_.png");
        $("#logo").attr("src","images/logo3.png");
        dataManager.ClusterObjects();
      
        
    }

    

}

//PROCESO QUE AGRUPA ELEMENTOS SEGUN EL NIVEL AL Q SE ENCUENTRA
var entities;
dataManager.ClusterObjects=function(){

    dataLoader.HideLoadings();

    Stage.blockScreen.style("visibility","visible"); 
    
    Stage.EraseMapObjects();

    if(svgRadar){
        radar.CleanWindows();
        svgRadar.selectAll(".radarElement").data([]).exit().remove();       
    }      

    
    if(backInfoNav.length > 0){
        $("#back_btn").css("visibility","visible");
       
    } else{
        $("#back_btn").css("visibility","hidden");
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

    console.log("entities",entities);

    // se HARCODEA EL TKPI DE DF solo para q apaarezca en el radar
    for(var j=0;  j < entities.length; j++){
        entities[j].df={df:0};
        entities[j].estadias={estadias:0};
    }
    
    // ****
    
    //Utiliza un timeout solo para q sea posible poner una pantalla de espera (negra)
    setTimeout(()=>{

        filterControls.showActiveFilters();

        dataManager.CalculateKPIs(entities);
        $('#Controls').css("visibility","hidden");

        //en casod e que exista un campo para busqueda de entidades lo llena
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

    loadsTarget=0;

    // 1
    loadsTarget++;
    dataLoader.AddLoadingTitle("Fillrate");
    setTimeout(()=>{
        console.log("Elimina fillrate");
        entities = calculateKpiExpert_FR.calculateKPI(entities_,"fillRate");   
       
        dataLoader.DeleteLoadingTitle("Fillrate"); 
        loadsCount++;
        dataManager.checkAllLoads();
    }, 500);       
    
    

    // 2   
    if(calculateKpiExpert_OOS){

        loadsTarget++;
        dataLoader.AddLoadingTitle("SP OOS");
        setTimeout(()=>{

            calculateKpiExpert_OOS.calculateKPI(entities).then(()=>{
                loadsCount++;
                dataLoader.DeleteLoadingTitle("SP OOS"); 
                dataManager.checkAllLoads();
             }); 

        }, 500);   

    }    
    
    // 3
   if(store.map_var==kpiExpert_OOS_Filiales || store.map_var==drawKpiExpert_VENTAS){

        if(calculateKpiExpert_OOSFiliales){
            loadsTarget++;
            dataLoader.AddLoadingTitle("SP OOS Filiales");
            setTimeout(()=>{
                calculateKpiExpert_OOSFiliales.calculateKPI().then(()=>{
                    loadsCount++;
                    dataLoader.DeleteLoadingTitle("SP OOS Filiales"); 
                    dataManager.checkAllLoads();
                });
            }, 500);
       

        } 
   }

   
    // 4
    if(calculateKpiExpert_Ventas){
        loadsTarget++;
        dataLoader.AddLoadingTitle("SP Ventas");
        setTimeout(()=>{
            calculateKpiExpert_Ventas.calculateKPI(entities).then(()=>{
                                                                    loadsCount++;
                                                                    dataLoader.DeleteLoadingTitle("SP Ventas"); 
                                                                    dataManager.checkAllLoads();
                                                             });
        }, 500);
    }  

    
    
    
    // 5
    if(calculateKpiExpert_Abasto && $("#nivel_cb").val() ){

        loadsTarget++;
        dataLoader.AddLoadingTitle("SP Abasto");
        setTimeout(()=>{
        calculateKpiExpert_Abasto.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataLoader.DeleteLoadingTitle("SP Abasto"); 
                                                                dataManager.checkAllLoads();
                                                             });
        }, 500);
    }   
    
    

    if(store.map_var==kpiExpert_FR){

            // 6
            if(calculateKpiExpert_Pendientes && $("#nivel_cb").val() ){
                loadsTarget++;
                dataLoader.AddLoadingTitle("SP Pendientes");
                setTimeout(()=>{
                    calculateKpiExpert_Pendientes.calculateKPI(entities).then(()=>{
                                                                        loadsCount++;
                                                                        dataLoader.DeleteLoadingTitle("SP Pendientes"); 
                                                                        dataManager.checkAllLoads();
                                                                        });
                }, 500);
            }   
        
        
            // 7  
            if(calculateKpiExpert_Mas){
                loadsTarget++;
                dataLoader.AddLoadingTitle("Masivos");
                setTimeout(()=>{
                    dataLoader.DeleteLoadingTitle("Masivos"); 
                    calculateKpiExpert_Mas.calculateKPI(entities,dataManager.checkAllLoads);
                }, 500);
            }  

    }

    
    

    // 8
    if(calculateKpiExpert_Produccion && $("#nivel_cb").val()  ){
        loadsTarget++;
        dataLoader.AddLoadingTitle("SP Produccion");
        setTimeout(()=>{
            calculateKpiExpert_Produccion.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataLoader.DeleteLoadingTitle("SP Produccion"); 
                                                                dataManager.checkAllLoads();
                                                             });
        }, 500);
    } 
    
    

}

dataManager.checkAllLoads=function(){ 
    
    console.log("Cargas esperadas: "+loadsTarget,"Cargas completadas: "+loadsCount);

    if(loadsTarget==loadsCount){

        //Segundo filtrado asociado a Selecciones de nivel:
        console.log("Inicia filtros: ",entities);

        entities = calculateKpiExpert_FR.filterByLevel(entities);        
        entities = calculateKpiExpert_Ventas.filterByLevel(entities);
        entities = calculateKpiExpert_OOSFiliales.filterByLevel(entities);

        dataLoader.HideLoadings();

        radar.DrawEntities(entities);

        Stage.DrawMapObjects(entities);

        kpiExpert_FR.DrawMainHeader();

        kpiExpert_FR.DrawFilteredHeader();

        // COLOREA ESTADOS SOLO SI SE ESTA VIENDO FILL RATE O OOSF

        EliminaEstadosDibujados();

        if(store.map_var==kpiExpert_FR){

            var estados  = d3.nest()
                .key(function(d) { return  d["EstadoZTDem"]; })                           
                .entries(store.dataToDraw);

            calculateKpiExpert_FR.calculateFRPorEstado(estados);

        }if(store.map_var==kpiExpert_OOS_Filiales){

            var estados  = d3.nest()
                .key(function(d) { return  d["EstadoDem"]; })                           
                .entries(store.oosFiliales);

            calculateKpiExpert_OOSFiliales.calculateFRPorEstado(estados);
            

        }

    }
}

dataManager.getTooltipText=function(entity){

    var dataCatlog="";
    var nombre = entity.key;  
    
    for(var i=0; i < store.niveles.length; i++){    

        if( store.niveles[i].id == $("#nivel_cb").val() ){

            dataCatlog=store[store.niveles[i].coordinatesSource]; 

            if(dataCatlog){
            
                for(var j=0; j < dataCatlog.length; j++){    
                
                    if(dataCatlog[j].ID==entity.key){
                        if(dataCatlog[j].Nombre!=nombre)
                            nombre+=" "+dataCatlog[j].Nombre;
                    }
                        
                }

            }
        }						
    }

    nombre=nombre.replaceAll("_"," ");
    nombre=nombre.replaceAll("undefined"," ");


    var text=`
        <span style='color:#00C6FF;font-size:15px;'><span style='color:#00C6FF'>${nombre}
        `
        if(calculateKpiExpert_Ventas.getTooltipDetail){

            if(calculateKpiExpert_Ventas.getTooltipDetail(entity.key)!=undefined){
                if(entity.ventas)
                    text+=calculateKpiExpert_Ventas.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_FR.getTooltipDetail){

            if(store.map_var==kpiExpert_FR)
                text+=calculateKpiExpert_FR.getTooltipDetail(entity.key,store.mainDataset);
            
        }

        

        if(calculateKpiExpert_Pendientes.getTooltipDetail){

            if(calculateKpiExpert_Pendientes.getTooltipDetail(entity.key)!=undefined){
                if(entity.pendientes)
                    text+=calculateKpiExpert_Pendientes.getTooltipDetail(entity.key);
            }

        }

        
        if(calculateKpiExpert_Mas.getTooltipDetail){

            if(calculateKpiExpert_Mas.getTooltipDetail(entity.key)!=undefined){
                if(entity.masivos)
                    text+=calculateKpiExpert_Mas.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_OOS.getTooltipDetail){

            if(calculateKpiExpert_OOS.getTooltipDetail(entity.key)!=undefined){
                if(entity.oos)
                    text+=calculateKpiExpert_OOS.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_OOSFiliales.getTooltipDetail){

            if(calculateKpiExpert_OOSFiliales.getTooltipDetail(entity.key)!=undefined){
                if(entity.oosFiliales)
                    text+=calculateKpiExpert_OOSFiliales.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_Abasto.getTooltipDetail){

            if(calculateKpiExpert_Abasto.getTooltipDetail(entity.key)!=undefined){
                if(entity.abasto)
                    text+=calculateKpiExpert_Abasto.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_Produccion.getTooltipDetail){

            if(calculateKpiExpert_Produccion.getTooltipDetail(entity.key)!=undefined){
                if(entity.produccion)
                    text+=calculateKpiExpert_Produccion.getTooltipDetail(entity.key);
            }

        } 

        

        return text;

}