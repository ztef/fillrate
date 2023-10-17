var dataManager={};

var lastDateInit;
var lastDateEnd;

dataManager.CambiaModoKPI=function(modo){

    console.log(modo);

    $("#iconFR").attr("src","images/mode_1.png");
    $("#iconOOSF").attr("src","images/mode_2.png");
    $("#iconVenta").attr("src","images/mode_3.png");
    ordenRadares="Vol";

   

    if(modo =="FR"){

        store.map_var=kpiExpert_FR;
        $("#iconFR").attr("src","images/mode1_.png");
        $("#logo").attr("src","images/logo1.png");
        dataManager.ClusterObjects();
        $("#simbologia").attr("src","images/simbologia FR.png");      
        

    }else if(modo =="OOS F"){

        store.map_var=kpiExpert_OOS_Filiales;
        $("#iconOOSF").attr("src","images/mode2_.png");
        $("#logo").attr("src","images/logo2.png");
        dataManager.ClusterObjects();
        $("#simbologia").attr("src","images/Simbolog¡a OOS Filiales.png");
       

    }else if(modo =="Venta"){

        store.map_var=drawKpiExpert_VENTAS;
        $("#iconVenta").attr("src","images/mode3_.png");
        $("#logo").attr("src","images/logo3.png");
        dataManager.ClusterObjects();
        $("#simbologia").attr("src","images/Simbolog¡a Ventas.png");
      
        
    }  
    
}

//PROCESO QUE AGRUPA ELEMENTOS SEGUN EL NIVEL AL Q SE ENCUENTRA
var entities;

 dataManager.ClusterObjects= function(){

    if(loadsCount!=loadsTarget){
        //return;
    }
    
    Stage.blockScreen.style("visibility","visible"); 
    
    Stage.EraseMapObjects();

    if(backInfoNav.length > 0){
        $("#back_btn").css("visibility","visible");
       
    } else{
        $("#back_btn").css("visibility","hidden");
    }  

    radar.CleanWindows();

    entities=[];

    dataLoader.AddLoadingTitle("Fillrate");

    loadsCount=1; 
    loadsTarget=0;    


    calculateKpiExpert_FR.calculateKPI().then(()=>{

            loadsCount=0; 
            loadsTarget=0;    

            filterControls.createDataFiltersControls(store.catlogsForFilters);

            dataLoader.DeleteLoadingTitle("Fillrate");

            dataLoader.HideLoadings();

            if( lastDateInit!=$('#datepicker').val() || lastDateEnd!=$('#datepicker2').val()  ) {

                lastDateInit=$('#datepicker').val();
                lastDateEnd=$('#datepicker2').val();

                dataManager.UpdateCatlogs();         

            }else{

                dataManager.ProcessEntities();

            }       
        
    }); 

}

//Funcion para actualizar catalogos si hubo un cambio de fechas, solo aquellos catalogos que utilizan fechas para ser filtrados
dataManager.UpdateCatlogs= function(){

        var catlogsSources=[];

        for(var i=0; i < store.localDataSources.length; i++){
            if(store.localDataSources[i].varName=="cat_zt" || store.localDataSources[i].varName=="cat_cliente_ref"){
                catlogsSources.push(store.localDataSources[i]);
            }
        }

        console.log("catlogsSources",catlogsSources);
        
        dataLoader.LoadInitialData(  catlogsSources ).then(function(){ 

            filterControls.createDataFiltersControls(store.catlogsForFilters);

            dataManager.ProcessEntities();

        });

}


dataManager.getCurrentCatlog=function(){

    var catlog;                                            

    for(var j=0; j < store.niveles.length; j++){

        if( String(store.niveles[j].id) ==  String($("#nivel_cb").val()) ){

            if(store.niveles[j].coordinatesSource){

                catlog = store.niveles[j].coordinatesSource;            

            }

        }
    }

    if(catlog){

        return catlog;

    }else{
        return "";
    }

}

dataManager.getNameFromId=function(id){

    var nombre=id;

    for(var j=0; j < store.niveles.length; j++){   
        if( store.niveles[j].id == $("#nivel_cb").val() ){
            if(store.niveles[j].coordinatesSource){
               
                dataCatlog=store[store.niveles[j].coordinatesSource];
                for(var j=0; j < dataCatlog.length; j++){    
                    if(dataCatlog[j].ID==nombre){ 
                        if(dataCatlog[j].Nombre!=nombre){
                            nombre=dataCatlog[j].Nombre;
                        }      
                    }      
                }
            }else{
                nombre=" Nacional";
            }
        }	                     
    }

    nombre=nombre.replaceAll("_"," ");
    nombre=nombre.replaceAll("undefined"," ");

    if(nombre.length > 30)
        nombre=nombre.substr(0,30)+"...";

    return toTitleCase(nombre);

}

dataManager.ProcessEntities= function(){    

    console.log("entities",entities);

    // se HARCODEA EL TKPI DE DF solo para q apaarezca en el radar
    for(var j=0;  j < entities.length; j++){
        entities[j].df={df:0};
        entities[j].estadias={estadias:0};
    }
    
    // ****

    radar.CleanWindows();
    
    //Utiliza un timeout solo para q sea posible poner una pantalla de espera (negra)
    setTimeout(()=>{        

        dataManager.CalculateKPIs();
        $('#Controls').css("visibility","hidden");
        $('#Controls2').css('visibility','hidden');

        //en casod e que exista un campo para busqueda de entidades lo llena
        if( $("#inputEnfoqueCamara") ){

            $("#inputEnfoqueCamara").val("");

            var arrAutoCompleteArr=[];   

            for(var j=0;  j < entities.length; j++){
                arrAutoCompleteArr.push(entities[j].key);
            }

            if(svgRadar){
                
                svgRadar.selectAll(".radarElement").data([]).exit().remove();       
            } 

            autocomplete(document.getElementById("inputEnfoqueCamara"), arrAutoCompleteArr);
        }

    }, 100);

}



//PROCESO QUE GESTIONA CALCULOS DE KPI´s SEGUN EL NIVEL EN EL Q SE ENCUENTRA
var loadsCount=0;
var loadsTarget=0;

dataManager.CalculateKPIs=function(){ 

    console.log("CalculateKPIs");   

    loadsCount=0;

    loadsTarget=0;     
    
    
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
    if(calculateKpiExpert_Abasto  ){

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
            if(calculateKpiExpert_Pendientes  ){
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
    if(calculateKpiExpert_Produccion   ){
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


    // 9
    if(calculateKpiExpert_Flota   ){
        loadsTarget++;
        dataLoader.AddLoadingTitle("SP Déficit Flota");
        setTimeout(()=>{
            calculateKpiExpert_Flota.calculateKPI(entities).then(()=>{
                                                                loadsCount++;
                                                                dataLoader.DeleteLoadingTitle("SP Déficit Flota"); 
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
            

        }if(store.map_var==drawKpiExpert_VENTAS){

            var estados  = d3.nest()
                .key(function(d) { return  d["EstadoDem"]; })                           
                .entries(store.ventas);

            calculateKpiExpert_Ventas.calculateFRPorEstado(estados);
            

        }

        filterControls.createDataFiltersControls(store.catlogsForFilters);

        filterControls.showActiveFilters();

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

  
    var text=` <div class="detailContainer" style="">
        
        <div>
            <div class="tooltipHeader" style="display:flex;">
                <span style='color:#00C6FF;font-size:15px;'></span><span style='color:#00C6FF'>${nombre}</span>
            </div>
        </div>
        <div style="display: flex;">
        <div class="detail1" style="">
               
        `
        if(calculateKpiExpert_Ventas.getTooltipDetail){

            if(calculateKpiExpert_Ventas.getTooltipDetail(entity.key)!=undefined){
                if(entity.ventas)
                    text+=calculateKpiExpert_Ventas.getTooltipDetail(entity.key);
            }

        }

        if(calculateKpiExpert_FR.getTooltipDetail){

            if(store.map_var==kpiExpert_FR || store.map_var==drawKpiExpert_VENTAS)
                text+=calculateKpiExpert_FR.getTooltipDetail(entity.key,store.mainDataset);
            
        }

        

        if(calculateKpiExpert_Pendientes.getTooltipDetail){

            if(calculateKpiExpert_Pendientes.getTooltipDetail(entity.key)!=undefined){
                if(entity.pendientes)
                    text+=calculateKpiExpert_Pendientes.getTooltipDetail(entity.key);
            }

        }

        
        

        text+="</div> <div class='detail2' style='top: 0px;position: relative;'>";

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

        if(calculateKpiExpert_Flota.getTooltipDetail){

            if(calculateKpiExpert_Flota.getTooltipDetail(entity.key)!=undefined){
                if(entity.flota)
                    text+=calculateKpiExpert_Flota.getTooltipDetail(entity.key);
            }

        } 

        text+="</div></div></div>";

        return text;

}