
var kpi_date_status={};

kpi_date_status.loadData = function(muestra ){

    $("#cargando").css("visibility","visible");

    var serviceName;

    var dateInit=new Date($('#datepicker').val());
    var dateEnd=new Date($('#datepicker2').val());

    var dateInit_=dateInit.getFullYear()+"-"+String(Number(dateInit.getMonth())+1)+"-"+dateInit.getDate();
    var dateEnd_=dateEnd.getFullYear()+"-"+String(Number(dateEnd.getMonth())+1)+"-"+dateEnd.getDate();
    
    var apiURL= _bkserver+"/getSP/VIS_ObtenerFechas?Pantalla=Fillrate&fechaInicio="+dateInit_+"&fechaFin="+dateEnd_+"";
    console.log(apiURL);

    d3.json(apiURL, function (error, data) {

        $("#cargando").css("visibility","hidden");

        if(error){
            alert("Error API Fechas de KPI",error);
           
            return;
        }

        if(data.error){
            alert("Error API Fechas de KPI",data.error);
           
            return;
        }

        console.log("Fechas de KPIs",data.recordset);     

        kpi_date_status.data=data.recordset;

        var cuantos=0;
        for(var i=0; i < kpi_date_status.data.length; i++ ){
            if(kpi_date_status.data[i].esWarning > 0){
                cuantos+=kpi_date_status.data[i].esWarning;
            }

        }

        if(cuantos > 0){
            $("#dates_img").attr("src","images/dates_1.png");
        }
         if(cuantos > 2){
            $("#dates_img").attr("src","images/dates_2.png");
        }

        if(muestra)
            kpi_date_status.ShowWindows();

    });
}   

kpi_date_status.ShowWindows = function( ){

        var data=[];

        for(var i=0; i < kpi_date_status.data.length; i++ ){

            //if(kpi_date_status.data[i].esWarning > 0){

                var fechaSplit=kpi_date_status.data[i].maxFecha.split("T");
  
                kpi_date_status.data[i].max_fecha=fechaSplit[0];
                kpi_date_status.data[i].titulo={esWarning:kpi_date_status.data[i].esWarning , Indicador:kpi_date_status.data[i].Indicador };
                data.push(kpi_date_status.data[i]);

            //}                

        }

        $("#toolTip3").css("visibility","visible");  
        $("#toolTip3").css("inset","");           
        $("#toolTip3").css("bottom","20px");
        $("#toolTip3").css("right","40px");

        // DATOS 
        var data = data.map(function(item) {
            return {
                "titulo": item.titulo,
                "max_fecha": item.max_fecha,
                "esWarning": item.esWarning          
            };
        });

        // DEFINE COLUMNAS      
        var columns = [

            { key: "titulo", header: "KPI", sortable: true, width: "150px" },
            { key: "max_fecha", header: "Última Fecha", sortable: true, width: "130px" },
            { key: "esWarning", header: " ", sortable: true, width: "60px" }        
        
        ];

        // DEFINE VISITORS PARA CADA COLUMNA
        var columnVisitors = {
            titulo: function(value) {
                var color="#ffffff";

                if(value.esWarning > 0){
                    color="#F2B600";
                }

                return `<div class="key-selector" style="color:${color}" onclick="">${value.Indicador}
                </div>`;
              },
        
            max_fecha: function(value){

                return `<div class="key-selector" onclick="">${value}
                </div>`;
            },
            esWarning: function(value){
                var src="";
                if(value > 0){
                    src="images/warning.png";
                }
                return `<img id="" src="${src}" style="width:30px;"></img>
                `;
            }
        };

        var columnsWithTotals = ['Indicador']; 
        var totalsColumnVisitors = {
            'Indicador': function(value) { 
                return ""; 
            }              
          
          };

        vix_tt_formatToolTip("#toolTip3","Últimas fechas disponibles por KPI ",270,370);
      
        // CREA TABLA USANDO DATOS
      
        vix_tt_table_extended(data, columns, columnVisitors, totalsColumnVisitors, "toolTip3", columnsWithTotals );        

        // APLICA TRANSICIONES 
        vix_tt_transitionRectWidth("toolTip3");

}