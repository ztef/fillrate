var filterControls={};
var createdControls={};
var controlsInit=false;

filterControls.createDataFiltersControls=function(catalogs){

    if(!controlsInit){

        controlsInit=true;
        vix_tt_formatMenu("#Controls",".",160);
        //$("#Controls").css("max-height","600px");
        $("#Controls").css("height","550px");
        $("#Controls").css("width","400px");


        $("#Controls").append(`

            <div id="ControlsBlocks" style="display: flex;">

                    <div id="ControlsFields"></div>  
                    
                    <div style="width:90%;position:absolute;bottom:19px;display: flex;">
                                <button class="filters" onclick="filterControls.CleanFields();" style="margin: 3px;color:black">Limpiar</button> 
                                <button class="filters" onclick="forzarFiltrado=true;filterControls.FilterData();" style="margin: 3px;color:black">Filtrar</button>  
                        </div>

                    <div id="ControlsFieldsCustom">                    

                    </div>
            </div>

        `);

        filterControls.creaCatalogosDerivadorDeClientes();   
    }
    
    
    for(var i=0;  i < catalogs.length; i++){

        var catlog=store[catalogs[i].data];

        if(!catlog){
            console.log("no se encuentra data para catalogo: ",catalogs[i].data,catalogs[i].placeholder);
            continue;
        }         
        
        if(!createdControls[catalogs[i].id]){

            if(catalogs[i].type=="autoComplete"){
                
                $("#ControlsFields").append(
                    `<div class="autocomplete loginBtn" style="width: 100%;margin-top:15px;" >
                        <input class="inputs" id="${catalogs[i].id}" type="text" style="border-color:${catalogs[i].color};" name="" placeholder="${ catalogs[i].placeholder }">
                    </div>`
                ); 
                
                createdControls[catalogs[i].id]=true;
                
                var arr=d3.nest()
                            .key(function(d) { return d[catalogs[i].fieldInCatlog]; })
                            .entries(catlog);

                            

                var arrAutoCompleteArr=[];   
                
                catalogs[i].diccNames={};
                
                for(var j=0;  j < arr.length; j++){

                    if(arr[j].values[0].ID){
                        catalogs[i].diccNames[arr[j].key]=arr[j].values[0].ID;
                    }else{
                        catalogs[i].diccNames[arr[j].key]=arr[j].key;
                    }
                
                    arrAutoCompleteArr.push(arr[j].key);

                }
                
                if(catalogs[i].hardcodedData){

                    autocomplete(document.getElementById(catalogs[i].id), catalogs[i].hardcodedData);

                    for(var j=0;  j < catalogs[i].hardcodedData.length; j++){
                        catalogs[i].diccNames[catalogs[i].hardcodedData[j]]=catalogs[i].hardcodedData[j];
                    }

                }else{
                    autocomplete(document.getElementById(catalogs[i].id), arrAutoCompleteArr);
                }               

                if(catalogs[i].default)
                    $("#"+catalogs[i].id).val(catalogs[i].default);
                
            }

        }

    } 


}


filterControls.CleanFields=function(){

    for(var e in createdControls){

        if(e == "nivel_cb"){

            $("#nivel_cb").val(1);

        } else if(e == "masivos_cb"){

            $("#masivos_cb").val("Todos");

        }else{

            $("#"+e).val("");

        }
       
    }

    setTimeout(()=>{ 

        filterControls.FilterData();
    
    }, 100);

}

// SE CREAN CATALOGOS A PARTIR DE UNA UNICA CONSULTA 
filterControls.creaCatalogosDerivadorDeClientes=function(){

    if(store.cat_cliente){

            // FRENTES

            var arrTemp=[];  

            var idCreados={};

            var caso=0;
            
            for(var i=0; i < store.cat_cliente.length; i++){

                if(!idCreados[store.cat_cliente[i].FrenteNum]){
                    arrTemp[caso]={...store.cat_cliente[i]};
                    arrTemp[caso].ID=arrTemp[caso].FrenteNum;
                    arrTemp[caso].Nombre=arrTemp[caso].Frente;
                    idCreados[arrTemp[caso].FrenteNum]=true;
                    caso++;
                }              

            }

            store.cat_frente=arrTemp;

            // SUCURSALES            

            var arrTemp=[]; 
            
            var idCreados={};

            var caso=0;
            
            for(var i=0; i < store.cat_cliente.length; i++){

                if(store.cat_cliente[i].Destino == store.cat_cliente[i].Frente){

                    if(!idCreados[store.cat_cliente[i].DestinoNum]){

                        arrTemp[caso]={...store.cat_cliente[i]};
                        arrTemp[caso].ID=arrTemp[caso].DestinoNum;
                        arrTemp[caso].Nombre=arrTemp[caso].Destino;                  
                        idCreados[arrTemp[caso].DestinoNum]=true;
                        caso++;

                    }
                }

            }

            store.cat_sucursal=arrTemp;

            // CLIENTES  HOLDINGS            

            var arrTemp=[]; 
            
            var idCreados={};

            var caso=0;
            
            for(var i=0; i < store.cat_cliente.length; i++){               

                    if(!idCreados[store.cat_cliente[i].HoldingNum]){

                        arrTemp[caso]={...store.cat_cliente[i]};                    
                        idCreados[arrTemp[caso].HoldingNum]=true;
                        caso++;

                    }               

            }

            store.cat_cliente=arrTemp;

    }  
    
    if(store.cat_region){

        store.cat_region_origen=[...store.cat_region];

    }

}

var caso=0;
var filtrosAplicados={};
var nivelLecturaActual;
var forzarFiltrado=false;

filterControls.FilterData=function(e,val){

    console.log("FilterData",e,val);

    if(e){
        
            if(e.toLowerCase().indexOf("enfoque") > -1 ){

                Stage.FocusMapElement(val);
                return;
            };
        
    }    

     //Valida si hay valores en los formControls
     caso=0;

     for(var i=0; i < store.catlogsForFilters.length; i++){
         
             if($("#"+store.catlogsForFilters[i].id).val() != "" && $("#"+store.catlogsForFilters[i].id).val() != undefined ){
                filtrosAplicados[store.catlogsForFilters[i].id]=$("#"+store.catlogsForFilters[i].id).val();
                 caso++;
             }else{
                delete filtrosAplicados[store.catlogsForFilters[i].id];
             }
         
     } 

     if($("#nivel_cb").val()!=nivelLecturaActual){
            nivelLecturaActual=$("#nivel_cb").val();
            caso++;
     }     

     console.log("caso",caso);

    //valida , si no ha cmabiado nada no procede con el filtrado
    if(!store[store.mainDataset])
    return;

    if( caso==0 && (store[store.mainDataset].length==store.dataToDraw.length) && forzarFiltrado==false ){

        return;

    }else{

        forzarFiltrado=false;

        store.dataToDraw=filterControls.FilterSpecificDataSet(store[store.mainDataset],"nameOnFR");

        $("#masivos_cb")[0].checkFilterStatus(true);

        dataManager.ClusterObjects();

    }    

}

filterControls.FilterSpecificDataSet=function(Rows,fieldsNames){  
    
    if(caso>0){

        for(var i=0; i < Rows.length; i++){

                Rows[i].filtrosCumplidos=0;
                Rows[i].visible=false;

                for(var j=0; j < store.catlogsForFilters.length; j++){ 

                        if($("#"+store.catlogsForFilters[j].id).val() != "" && $("#"+store.catlogsForFilters[j].id).val() != undefined ){                             
                                    
                                    if(Rows[i][store.catlogsForFilters[j][fieldsNames]]){                                 

                                        if( 
                                            ($("#"+store.catlogsForFilters[j].id).val().toLowerCase() == String(Rows[i][store.catlogsForFilters[j][fieldsNames]]).toLowerCase() ) ||
                                            (  String( store.catlogsForFilters[j].diccNames[ $("#"+store.catlogsForFilters[j].id).val()]  )).toLowerCase() == String(Rows[i][store.catlogsForFilters[j][fieldsNames]]).toLowerCase()                             
                                        ) {         
                                            
                                            Rows[i].filtrosCumplidos++;
                                        }   

                                    }else{

                                        Rows[i].filtrosCumplidos++;
                                    }          

                        }else{

                            Rows[i].filtrosCumplidos++;
                        }
                    
                }

                if(Rows[i].filtrosCumplidos==store.catlogsForFilters.length){
                                
                    Rows[i].visible=true;
                }               

        }

    }else{

        for(var i=0; i < Rows.length; i++){
            Rows[i].visible=true;    
        }

    } 
   
    var visibles=[];
    var no_visibles=[];

    for(var i=0; i < Rows.length; i++){
       if( Rows[i].visible==true){
            visibles.push(Rows[i]);    
       }else{
            no_visibles.push(Rows[i]);    
       }        
    } 

    return visibles;    

}

filterControls.showActiveFilters=function(){

    for(var i=0; i < store.catlogsForFilters.length; i++){
         
        if($("#"+store.catlogsForFilters[i].id).val() != "" && $("#"+store.catlogsForFilters[i].id).val() != undefined ){
           filtrosAplicados[store.catlogsForFilters[i].id]=$("#"+store.catlogsForFilters[i].id).val();
            caso++;
        }else{
           delete filtrosAplicados[store.catlogsForFilters[i].id];
        }
    
}

    // visibilidad de filtros por nivel
    $("#ordenOOSF").hide();
    if(store.map_var==kpiExpert_OOS_Filiales){        

        $("#oosfil_filter").show();
        $("#ventas_cb").hide();
        $("#fillRate_cb ").hide();       
        
        $("#id_4").hide();
        $("#id_5").hide();
        $("#id_6").hide();

        if($("#nivel_cb").val() > 4 ){
            $("#nivel_cb").val("4");
            alert("Se cambia el nivel a Gerencia, No existen niveles mas bajos");
        }
          
        $("#ordenOOSF").show();

    }else if(store.map_var==kpiExpert_FR ){

        $("#oosfil_filter").hide();
        $("#ventas_cb").hide();
        $("#fillRate_cb").show();

        $("#id_4").show();
        $("#id_5").show();
        $("#id_6").show();

    }else if( store.map_var==drawKpiExpert_VENTAS){

        $("#oosfil_filter").hide();
        $("#ventas_cb").show();
        $("#fillRate_cb").hide();

        $("#id_4").hide();
        $("#id_5").hide();
        $("#id_6").hide();

        if($("#nivel_cb").val() > 4 ){
            $("#nivel_cb").val("4");
            alert("Se cambia el nivel a Gerencia, No existen niveles mas bajos");
        }

    }

    svgLines.selectAll(".filters").data([]).exit().remove();

    var caso=1;  
    var topOffset=130;           
   
    for(var e in filtrosAplicados){

        if(e !="cat_producto" && e !="cat_presentacion"){

            svgLines.append("text")						
                    .attr("class","filters")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",14*escalaTextos)	
                    .style("text-anchor","end")
                    .style("pointer-events","auto")
                    .attr("transform"," translate("+String( windowWidth-10  )+","+String(  (caso*25)+topOffset  )+")  rotate("+(0)+") ")
                    .text(function(){

                        var nombre = e.replaceAll("_"," ");
                       
                        return toTitleCase(nombre)+": "+filtrosAplicados[e].replaceAll("_"," ");

                    });

                    caso++;

        }

    }

    var nivel="";
    var pedidosEntregados="Pedidos Entregados.";

    for(var i=0; i < store.niveles.length; i++){    
        if( store.niveles[i].id == $("#nivel_cb").val() )
            nivel+=store.niveles[i].label;        
    }    

    if(store.map_var==kpiExpert_OOS_Filiales){        

        var filtroPresentacion=" Granel " ;
        var filtroProducto="Cemento Gris, Blanco ";


    }else if(store.map_var==kpiExpert_FR || store.map_var==drawKpiExpert_VENTAS){

        var filtroPresentacion="Sacos y Granel";
        var filtroProducto="Cemento Gris, Mortero, Blanco, Especiales";

    }    

    if(store.map_var==kpiExpert_OOS_Filiales || store.map_var==drawKpiExpert_VENTAS){

        var pedidosEntregados="";
       
    }

    if(filtrosAplicados["cat_producto"]){
        filtroProducto="Cemento "+filtrosAplicados["cat_producto"];
    }    


    if(filtrosAplicados["cat_presentacion"]){
        filtroPresentacion=filtrosAplicados["cat_presentacion"];
    }

    var titulo=`<div style="font-size:100%"> ${filtroProducto} | ${filtroPresentacion} | ${pedidosEntregados} Nivel: ${nivel} 
    <span style="font-size:12px; color:white">
       Período del ${dateInit.getDate()} ${getMes(dateInit.getMonth())} al ${dateEnd.getDate()}  ${getMes(dateInit.getMonth())} ${String(dateInit.getFullYear())}
    </span></div>`;

    $("#titulo").html(titulo);   
    
    $("#titulo").css("width","70%");   

    svgLines.append("text")						
                    .attr("class","filters")
                    .style("fill","#ffffff")		
                    .style("font-family","Cabin")
                    .style("font-weight","bold")
                    .style("font-size",14*escalaTextos)	
                    .style("text-anchor","end")
                    .style("pointer-events","auto")
                    .attr("transform"," translate("+String( windowWidth-10  )+","+String(  topOffset  )+")  rotate("+(0)+") ")
                    .text(function(){

                        if(caso == 1 ){
                            return "Ningún otro filtro aplicado";
                        }else{
                            return "Otros Filtros activos:";
                        }                       

                    });    

}

var posAnterior;

filterControls.createHardCodedControls=function(){

        // NIVELES DE AGRUPACIÓN
        $("#ControlsFieldsCustom").append(
                `
                <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
                    Nivel de Lectura: <br> <br>                 
                    <select id="nivel_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
                         
                    </select>

                </div>                                
                `
            );

        for(var i=0; i < store.niveles.length; i++){    
            $("#nivel_cb").append(
                `<option id="id_${store.niveles[i].id}" value="${store.niveles[i].id}">${store.niveles[i].label}</option>   `); 
        }

        $("#nivel_cb").val(0);
        nivelLecturaActual=0;

        posAnterior=0;
      
        $("#nivel_cb").change(function(){

            if($("#nivel_cb").val() > 5){
                if($("#cat_cliente").val() == "" && $("#cat_region").val() == "" &&  $("#cat_estado").val() == "" && $("#cat_gerencia").val() == ""  && $("#cat_un").val() == ""){

                    if(posAnterior)
                        $("#nivel_cb").val(posAnterior);

                    alert("Seleccione algun filtro para continuar con niveles de detalle altos");

                    return;
                }
            }           

            posAnterior=$("#nivel_cb").val();            
            
        })

        // NIVELES DE FILLRATE
        $("#ControlsFieldsCustom").append(
            `
            <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
                Niveles de FillRate: <br> <br>                 
                <select id="fillRate_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
                <option value=""></option>
                <option value="40">Menores de 40</option>
                <option value="50">Menores de 50</option>
                <option value="60">Menores de 60</option>
                <option value="70">Menores de 70</option>
                <option value="80">Menores de 80</option>
                <option value="90">Menores de 90</option>
                </select>

            </div>                            
            `
        );

        createdControls["fillRate_cb"]=true;

        d3.select("#fillRate_cb").on("change",function(){           

                    if($("#fillRate_cb").val()!=""){           
                     
                        filtrosAplicados["niveles_fillrate"]="Menores de "+$("#fillRate_cb").val()+"%";
                      

                    }else{                

                        delete filtrosAplicados["niveles_fillrate"];                       

                    }   

                    filterControls.showActiveFilters();
                    store.dataToDraw=[];
                    filterControls.FilterData();
    
        });

        // NIVELES DE OOS FILIALES
        $("#ControlsFieldsCustom").append(
            `
            <div id="oosfil_filter" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
                Niveles de OOS Filiales: <br> <br>                 
                <select id="oosfil_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
                <option value=""></option>
                <option value="3">Mayores de 3</option>
                <option value="5">Mayores de 5</option>
                <option value="10">Mayores de 10</option>
             
                </select>

            </div>                            
            `
        );

        createdControls["oosfil_cb"]=true;

       
        d3.select("#oosfil_cb").on("change",function(){           

                    if($("#oosfil_cb").val()!=""){           
                     
                        filtrosAplicados["niveles_oosFill"]="Mayores de "+$("#oosfil_cb").val()+"%";
                        //dataManager.ClusterObjects();

                    }else{                

                        delete filtrosAplicados["niveles_oosFill"];                       

                    }   

                    filterControls.showActiveFilters();
                    store.dataToDraw=[];
                    filterControls.FilterData();
    
        });

        // NIVELES DE  VENTA
        $("#ControlsFieldsCustom").append(
            `
            <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
                Niveles de Ventas: <br> <br>                 
                <select id="ventas_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
                <option value=""></option>
                <option value="75">Menores de 75</option>
                <option value="85">Menores de 85</option>
                <option value="95">Menores de 95</option>
             
                </select>

            </div>                            
            `
        );

        createdControls["ventas_cb"]=true;

        d3.select("#ventas_cb").on("change",function(){           

                    if($("#ventas_cb").val()!=""){           
                     
                        filtrosAplicados["niveles_ventas"]="Menores de "+$("#ventas_cb").val()+"%";
                        //dataManager.ClusterObjects();

                    }else{                

                        delete filtrosAplicados["niveles_ventas"];                       

                    }   

                    filterControls.showActiveFilters();
                    store.dataToDraw=[];
                    filterControls.FilterData();
    
        });

        //BUSQUEDA DE ELEMENTOS EN MAPA
        $("#ControlsFieldsCustom").append(
            `<div class="autocomplete loginBtn" style="width: 100%;margin-top:15px;" >
                <input class="inputs" id="inputEnfoqueCamara" type="text" style="border-color:#ffffff;" name="" placeholder="Enfocar">
            </div>`
        );

        createdControls["inputEnfoqueCamara"]=true;


         // FILTRO DE PEDIDOS MASIVOS
         $("#ControlsFieldsCustom").append(
            `
            <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
                Pedidos Masivos: <br> <br>                 
                <select id="masivos_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
                <option value="Todos">Todos</option>
                <option value="SinMasivos">Sin pedidos masivos</option>
                <option value="SoloMasivos">Solo pedidos masivos</option>
               
                </select>

            </div>                            
            `
        );

        createdControls["masivos_cb"]=true;

        d3.select("#masivos_cb").on("change",function(){

                 $("#masivos_cb")[0].checkFilterStatus();                

        });

        $("#masivos_cb")[0].checkFilterStatus=function(onlyFilterData){

                if($("#masivos_cb").val() == "Todos" || $("#masivos_cb").val() == ""){

                    delete filtrosAplicados["pedidos_masivos"];               

                }else if($("#masivos_cb").val() == "SinMasivos"){

                    filtrosAplicados["pedidos_masivos"]="Sin Masivos";

                }else if($("#masivos_cb").val() == "SoloMasivos"){

                    filtrosAplicados["pedidos_masivos"]="Solo Masivos";
                    
                } 

                if($("#masivos_cb").val() == "Todos" || $("#masivos_cb").val() == ""){

                    if(!onlyFilterData){
                        filterControls.FilterData();   
                        return;
                    }                                    

                }

                var dataTemp=[];

                for(var i=0; i < store.dataToDraw.length; i++){

                        if($("#masivos_cb").val() == "SinMasivos"){

                            if(store.dataToDraw[i].TipoPedido != "Masivo" ){

                                dataTemp.push(store.dataToDraw[i]);
            
                            }

                        }else if($("#masivos_cb").val() == "SoloMasivos"){

                            if( store.dataToDraw[i].TipoPedido == "Masivo" ){

                                dataTemp.push(store.dataToDraw[i]);                            
            
                            }
                            
                        } 
                    
                }

                if($("#masivos_cb").val() != "Todos" && $("#masivos_cb").val() != ""){
                    store.dataToDraw=dataTemp;
                }

                if(!onlyFilterData){
                    
                    dataManager.ClusterObjects();
                }                                             
                

        }

}

var waitingToFocus;
var backInfoNav=[];

filterControls.back=function(){

    if(backInfoNav.length > 1){

        filterControls.lookForEntity(backInfoNav[backInfoNav.length-2].entity,backInfoNav[backInfoNav.length-2].catlog);

    }

    if(backInfoNav.length > 0){
        backInfoNav.splice(backInfoNav.length-1,1);        
    }

    filterControls.arrowUpdate();

    setTimeout(()=>{

        if(backInfoNav.length > 1){
            $("#back_btn").css("visibility","visible");           
        } else{
            $("#back_btn").css("visibility","hidden");
        }  
    
    }, 1000);

    radar.CleanWindows();
        
}

filterControls.arrowUpdate=function(){

    $("#toolTip").html("");

    if(backInfoNav.length > 1){

        console.log("arrowUpdate");

        document.getElementById("back_btn").onmouseover = function() {

                $("#toolTip").css("visibility","visible");

                $("#toolTip").css("top",mouse_y+20);

                $("#toolTip").css("left",mouse_x+20);

                $("#toolTip").html(
                    
                    `
                        <span style='color:#fff600;font-size:${15*escalaTextos}px;'>Regresa a: <span style='color:#00EAFF'>${toTitleCase(backInfoNav[backInfoNav.length-2   ].entity)}<br>
                        <span style='color:#fff600;font-size:${15*escalaTextos}px;'>En: <span style='color:#00EAFF'>${backInfoNav[backInfoNav.length-1].catlog}
                
                    `
                );

            };   
            
             

    }else
    {
        
        $("#toolTip").css("visibility","hidden");		    	

    }

    if(backInfoNav.length > 1){
        $("#back_btn").css("visibility","visible");           
    } else{
        $("#back_btn").css("visibility","hidden");
    } 

}

filterControls.lookForEntity=function(name, catlog){

    name=String(name).toLocaleLowerCase();

    console.log("buscando nombre ",name);

    waitingToFocus=undefined;
    
    for(var e in store){

        if(e.indexOf("cat_") > -1 && filterControls.checkCatlogName(e,catlog) ){
            
            for(var i=0; i < store[e].length; i++){
               
                if( String(store[e][i].ID).toLocaleLowerCase()== name || String(store[e][i].Nombre).toLocaleLowerCase() == name  ){                   
                   
                    for(var j=0; j < store.niveles.length; j++){
                       
                        if(store.niveles[j].coordinatesSource){
                            
                            if(store.niveles[j].coordinatesSource==e){
                                console.log(String($("#nivel_cb").val()) , String(store.niveles[j].id));
                                if( String($("#nivel_cb").val()) != String(store.niveles[j].id) ){
                                    $("#nivel_cb").val(store.niveles[j].id);
                                    backInfoNav.push({entity:name , catlog:e});
                                    waitingToFocus=name;
                                    filterControls.FilterData();
                                }else{
                                    Stage.FocusMapElement(name);
                                }                 
   
                            }

                        }
                    }
                    
                    return;
                }

            }

        }

    }

    alert("No encontró una entidad con el nombre: "+name);

}

filterControls.checkCatlogName=function(cat1, cat2){

    if(!cat2){
        return true;
    }else if( String(cat1).toLowerCase() == String(cat2).toLowerCase() ){
        return true;
    }else{
        return false;
    }

}


filterControls.CheckIfFocus=function(){
    if(waitingToFocus){
        console.log("waitingToFocus",waitingToFocus);
        Stage.FocusMapElement(waitingToFocus);
        waitingToFocus=undefined;
    }
}