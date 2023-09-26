
var kpi_date_status={};

kpi_date_status.loadData = function( ){

    $("#cargando").css("visibility","visible");

    var serviceName;

    var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
    var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
    
    var apiURL= _bkserver+"/getSP/VIS_ObtenerFechas?Pantalla=Fillrate&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"";
    console.log(apiURL);

    d3.json(apiURL, function (error, data) {

        $("#cargando").css("visibility","hidden");

        if(error){
            alert("Error API Fehas de KPI",error);
           
            return;
        }

        if(data.error){
            alert("Error API Fehas de KPI",data.error);
           
            return;
        }

        console.log("Fehas de KPIs",data.recordset);      


    });
}   