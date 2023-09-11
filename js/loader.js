var dataLoader={};
var dataSourcesToLoad=[];
var resolveLoader;
var dateInit;
var dateEnd;

dataLoader.LoadInitialData = function(dataSources ){

    console.log("dataSources",dataSources);
    dataSourcesToLoad=[];
   
    for(var i=0; i < dataSources.length; i++){

        if(dataSources[i].onInitLoad   ){
            dataSourcesToLoad.push(dataSources[i]);
        }           

    }

    return new Promise((resolve, reject) => { 

        loadsToComplete=dataSourcesToLoad.length;

        for(var i=0; i < dataSourcesToLoad.length; i++){          
     
            dataLoader.LoadData( dataSourcesToLoad[i] , dataLoader.CheckIfComplete);

        }

        resolveLoader=resolve;

    });

}

dataLoader.loadings={history:[],current:[]};
dataLoader.AddLoadingTitle=function(name){
    dataLoader.loadings.current.push(name);
    dataLoader.ShowLoadings();
}

dataLoader.DeleteLoadingTitle=function(name){

    var arrTemp=dataLoader.loadings.current;

    for(var i=0; i < dataLoader.loadings.current.length; i++ ){

        if(dataLoader.loadings.current[i] == name){
            arrTemp.splice(i,1);
            dataLoader.loadings.history.push(name);

            if(arrTemp.length==0)
            dataLoader.HideLoadings();
            
            break;
        }      

    }

    dataLoader.loadings.current=arrTemp;
    dataLoader.ShowLoadings();

}   

dataLoader.ShowLoadings=function(){

    $("#toolTipLoader").css("visibility","visible");
			    	
    $("#toolTipLoader").css("left",((windowWidth/2)-40)+"px" );    

    $("#toolTipLoader").css("width","200px" );    

   // $("#toolTipLoader").css("height","400px" ); 

    var text=`
        <span style='color:#7F7F7F;font-size:11px;'>Cargas Recientes: </span><br>
    `;

    for(var i=0; i < dataLoader.loadings.history.length; i++ ){
        text+=`
        <span style='color:#7F7F7F;font-size:11px;'>Terminó ${ toTitleCase(dataLoader.loadings.history[i]).replaceAll("_"," ") }...<br>
        `   
    }

    text+=`
        <hr class="hr">
    `;

    for(var i=0; i < dataLoader.loadings.current.length; i++ ){
        text+=`
        <span style='color:#00EAFF;font-size:16px;'>Cargando ${ toTitleCase(dataLoader.loadings.current[i]).replaceAll("_"," ") }...<br>
        `   
    }

    $("#toolTipLoader").html(text);

    $("#toolTipLoader").css("top","20%");

}

dataLoader.HideLoadings=function(){

    dataLoader.loadings={history:[],current:[]};
    $("#toolTipLoader").css("visibility","hidden");
   // $("#toolTipLoader").css("height","400px" ); 

}



dataLoader.LoadData=function(def,cb){  

    $("#cargando").css("visibility","visible");   

    if(def.apiURL && def.onInitLoad){

        var mes=Number(dateInit.getMonth())+1;
        if(mes < 10)
            mes="0"+String(mes);

        var mes2=Number(dateEnd.getMonth())+1;
        if(mes2 < 10)
        mes2="0"+String(mes2);


        var dia=Number(dateInit.getDate());
        if(dia < 10)
        dia="0"+String(dia);

        var dia2=Number(dateEnd.getDate());
        if(dia2 < 10)
        dia2="0"+String(dia2);

        var URL=def.apiURL+"/"+def.serviceName;
        if(def.serviceName.indexOf("?") == -1){
            var URL=def.apiURL+"/"+def.serviceName+"?";
        }           

        if(def.tableName){
            URL+="table="+def.tableName;            
        }            

        var dateInit_=dateInit.getFullYear()+"-"+String(mes)+"-"+String(dia);
        var dateEnd_=dateEnd.getFullYear()+"-"+String(mes2)+"-"+String(dia2);

        if(def.useDateFilters){
            URL+="&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_;
        }

        //AGRUPADOR
        var agrupador=config.agrupadorInicial;

        if(def.useGroup){
            URL+="&agrupador="+agrupador;
        }

        if(def.where){
            where=def.where;
            where = where.replaceAll("fechaInicio",dateInit_);
            where = where.replaceAll("fechaFin",dateEnd_);
            URL+="&where="+where;
        }

        var columns="";
        if(def.columns){
            columns=def.columns;
            URL+="&columns="+columns;
        }

        console.log(URL);

        dataLoader.AddLoadingTitle(def.varName);

        d3.json(URL, function (error, data) {

            dataLoader.DeleteLoadingTitle(def.varName);

            if(error){
                alert("Error API ",def.serviceName,error);
                resolveLoader();
                return;
            }

            if(data.error){
                alert("Error API ",def.serviceName,data.error);
                resolveLoader();
                return;
            }

            if(data.recordset.length == 0){
                alert("Regresando vacío la consulta de "+def.varName);

            }

            if(data.recordset){
                data=data.recordset;
            }            

            for(var i=0; i < data.length; i++){

                if( def.idFieldInCatlog ){ 
                    data[i].ID=data[i][def.idFieldInCatlog];
                }
                if( def.nameInCatlog ){ 
                    data[i].Nombre=data[i][def.nameInCatlog];
                }

                if(def.dateField){

                    if(data[i][def.dateField]!=""){

                        if(data[i][def.dateField].indexOf("T") > -1){

                            var fechaSplit=data[i][def.dateField].split("T");
                            
                            fechaSplit=fechaSplit[0].split("-");                   

                        }else{
                            var fechaSplit=data[i][def.dateField].split("-");
    
                        }                

                        data[i].fecha= new Date(Number(fechaSplit[0]),Number(fechaSplit[1])-1 ,Number(fechaSplit[2]));                   

                    } 
                } 

            }

            console.log(def.varName,data);

            store[def.varName]=data;
                  
           cb();

        });

    }else if(config[def.sourceName])
    {
       console.log(config[def.sourceName]);

       dataLoader.AddLoadingTitle(def.varName);

        d3.csv(config[def.sourceName])
                .row(function(d) { return d; })
                .get(function(error, rows) {
       
                 console.log(config[def.sourceName],rows);
                
                 dataLoader.DeleteLoadingTitle(def.varName);

                var rowsTemp=[];
               
                for(var i=0; i < rows.length; i++){
                    //for(var i=0; i < 500; i++){  

                    if(def.dateField){

                        if(!rows[i][def.dateField]){
                            
                            continue;
                        }

                        if(rows[i][def.dateField]==""){
                            
                            rows[i].fecha= new Date(Number(rows[i]["Año"]),Number(rows[i]["Mes"])-1 ,Number(rows[i]["Dia"]));

                        }else if(rows[i][def.dateField]!=""){

                            var fechaSplit=rows[i][def.dateField].split(" ");
                            var fechaSplit=fechaSplit[0].split("/");
                            rows[i].fecha= new Date(Number(fechaSplit[2]),Number(fechaSplit[1])-1 ,Number(fechaSplit[0]));

                        }                        
                       
                        if(rows[i].fecha.toString() == "Invalid Date"){ 
                                     
                            continue;
                        }else{                   
                        
                            if(rows[i].fecha.getTime() >= dateInit.getTime() && rows[i].fecha.getTime() <= dateEnd.getTime() ){
                                rowsTemp.push(rows[i]);
                            }else{
                                   
                            }
                        }
                    }else{
                          
                        rowsTemp.push(rows[i]);
                    }

                }

                
                rows=rowsTemp;

                store[def.varName]=rows;

                //lama funcion para validar si ya terminaron de cargar todos los CSV
                cb();

    });

    }else{
        alert("Existe un origen de datos mal definido");
    }
       
    

}

var loadsToComplete=0;
var loadsCompleted=0;
dataLoader.CheckIfComplete=function(){
    
    loadsCompleted++;
    if(loadsCompleted == loadsToComplete){

        dataLoader.HideLoadings();

        for(var i=0; i < dataSourcesToLoad.length; i++){

            if(dataSourcesToLoad[i].varName==store.mainDataset){
             
                store.dataToDraw=store[dataSourcesToLoad[i].varName];
                
            }
        }
       
        $("#cargando").css("visibility","hidden");

       resolveLoader();
    }
}