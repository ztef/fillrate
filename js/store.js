const _bkserver = "https://uscldv3dwad01.azurewebsites.net";
//const _bkserver = "http://10.26.83.182:8080";

var store={
   dataToDraw:[],
   mainDataset:"fillRate",

   map_var:kpiExpert_FR,
   //map_var:kpiExpert_OOS_Filiales,

   localDataSources:[
    
            //DATA LOCAL

            //CATALOGOS
            //{sourceName:"regionSource",varName:"cat_region",onInitLoad:true},
            {apiURL:_bkserver ,serviceName:"getTable",tableName:"Vis_CatRegion" ,varName:"cat_region",onInitLoad:true,useDateFilters:false},
            //{sourceName:"estadoSource",varName:"cat_estado",onInitLoad:true}, 
            {apiURL:_bkserver ,serviceName:"getTable",tableName:"Vis_CatEstado" ,varName:"cat_estado",onInitLoad:true,useDateFilters:false},
            //{sourceName:"gerenciaSource",varName:"cat_gerencia",onInitLoad:true},         
            {apiURL:_bkserver ,serviceName:"getTable",tableName:"Vis_CatGerenciaCS" ,varName:"cat_gerencia",onInitLoad:true,useDateFilters:false},
            //{sourceName:"unSource",varName:"cat_un",onInitLoad:true},
            {apiURL:_bkserver ,serviceName:"getTable",tableName:"Vis_CatUN_Cemento" ,varName:"cat_un",onInitLoad:true,useDateFilters:false},
            //{sourceName:"ztSource",varName:"cat_zt",onInitLoad:true},
            {apiURL:_bkserver ,serviceName:"getSP/Generico?spname=VIS_GetZT_FillRate",varName:"cat_zt",idFieldInCatlog:"ID" ,onInitLoad:true,useDateFilters:true},            
            //{sourceName:"clienteSource",varName:"cat_cliente",onInitLoad:true}, 
            {apiURL:_bkserver ,serviceName:"getSP/Generico?spname=VIS_GetFrentes_FillRate",varName:"cat_cliente",idFieldInCatlog:"HoldingNum" ,nameInCatlog:"Holding",onInitLoad:true,useDateFilters:true},            
            //Catalogos PRODUCTO y PRESENTACION 
            //{apiURL:_bkserver ,serviceName:"getTable",tableName:"Vis_CatUN_Cemento" ,varName:"cat_producto",onInitLoad:true,useDateFilters:true},
  
    ],

    apiDataSources:[

        {apiURL:_bkserver ,serviceName:"getSP/VIS_Calcular_FillRate_conParams",tableName:"d",varName:"fillRate",dateField:"dtOnSiteFinal",onInitLoad:false,useDateFilters:true,useGroup:true},
        {apiURL:_bkserver ,serviceName:"getSP/VIS_Calcular_KPI_Abasto_FillRate",varName:"abasto",onInitLoad:false,useDateFilters:true},

        {apiURL:_bkserver ,serviceName:"getSP/VIS_Calcular_OOSFilial",varName:"oosFiliales",onInitLoad:false,useDateFilters:true},
        {apiURL:_bkserver ,serviceName:"getSP/VIS_Calcular_KPI_Produccion_FillRate",varName:"produccion",onInitLoad:false,useDateFilters:true},
        {apiURL:_bkserver ,serviceName:"getSP/Generico?spname=VIS_Calcular_KPI_OOS_FillRate",varName:"oos",onInitLoad:false,useDateFilters:true},
        {apiURL:_bkserver ,serviceName:"getSP/Generico?spname=VIS_Calcular_KPI_Flota_FillRate",varName:"flota",onInitLoad:false,useDateFilters:true},
        
        {apiURL:_bkserver ,serviceName:"getSP/Generico?spname=VIS_Calcular_KPI_Venta_FillRate",varName:"ventas",onInitLoad:false,useDateFilters:true},
        {apiURL:_bkserver ,serviceName:"getSP/Generico?spname=VIS_Calcular_KPI_PedidosPendientes",varName:"pendientes",onInitLoad:false,useDateFilters:true},
       
    ],

    catlogsForFilters:[         
           
            {data:"cat_un",placeholder:"Unidad Negocio",fieldInCatlog:"Nombre",id:"cat_un",type:"autoComplete",nameOnFR:"vc50_UN_Tact",nameOnPendientes:"Unidad", color:"#3733E7",storeProcedureField:"vc50_UN_Tact"},
            {data:"cat_gerencia",placeholder:"Gerencia",fieldInCatlog:"Nombre",id:"cat_gerencia",type:"autoComplete",nameOnFR:"GerenciaUN",nameOnPendientes:"Gerencia", color:"#3733E7",storeProcedureField:"GerenciaUN"},
            {data:"cat_region_origen",placeholder:"Region Origen",fieldInCatlog:"Nombre" , id:"cat_region_origen",type:"autoComplete",nameOnFR:"RegionZTDem",nameOnPendientes:"Region", color:"#3733E7",storeProcedureField:"vc50_Region_UN"},
            {data:"cat_region",placeholder:"Region Destino",fieldInCatlog:"Nombre" , id:"cat_region",type:"autoComplete",nameOnFR:"RegionZTDem",nameOnPendientes:"Region", color:"#12FF00",storeProcedureField:"RegionZTDem"},
            

            {data:"cat_estado",placeholder:"Estado",fieldInCatlog:"Nombre",id:"cat_estado",type:"autoComplete",nameOnFR:"EstadoZTDem",nameOnPendientes:"Estado", color:"#12FF00",storeProcedureField:"EstadoZTDem"},
            {data:"cat_zt",placeholder:"Zona Transporte",fieldInCatlog:"Nombre",id:"cat_zt",type:"autoComplete",nameOnFR:"ZonaTransporte",nameOnPendientes:"Zona_de_Entrega", color:"#12FF00",storeProcedureField:"Zona_de_Entrega"},
            {data:"cat_cliente",placeholder:"Holding",fieldInCatlog:"Nombre",id:"cat_cliente",type:"autoComplete",nameOnFR:"Cliente",nameOnPendientes:"HoldingNum", color:"#12FF00",storeProcedureField:"Cliente"},
            //{data:"fillRate",placeholder:"Segmento",fieldInCatlog:"Segmento",id:"cat_segmento",type:"autoComplete",nameOnFR:"Segmento",nameOnPendientes:"Segmento", color:"#12FF00",storeProcedureField:"Segmento"},
            {data:"cat_frente",placeholder:"Frente",fieldInCatlog:"Nombre",id:"cat_frente",type:"autoComplete",nameOnFR:"Frente",nameOnPendientes:"Frente", color:"#12FF00",storeProcedureField:"Frente"},
            {data:"cat_sucursal",placeholder:"Sucursal",fieldInCatlog:"Nombre",id:"cat_sucursal",type:"autoComplete",nameOnFR:"",nameOnPendientes:"", color:"#12FF00",storeProcedureField:"Obra"},

            {data:"fillRate",placeholder:"AgrupProducto",fieldInCatlog:"AgrupProducto",id:"cat_producto",type:"autoComplete",nameOnFR:"AgrupProducto",nameOnPendientes:"TipoProducto", color:"#F716FF",storeProcedureField:"AgrupProducto",default:"Gris", hardcodedData:["Gris","Mortero","Blanco","Especial","Impercem","Otros"]},
            {data:"fillRate",placeholder:"Presentación",fieldInCatlog:"Presentacion",id:"cat_presentacion",type:"autoComplete",nameOnFR:"Presentacion",nameOnPendientes:"Presentacion", color:"#F716FF",storeProcedureField:"Presentacion"},
            {data:"fillRate",placeholder:"Material",fieldInCatlog:"Producto_Tactician",id:"cat_material",type:"autoComplete",nameOnFR:"Producto_Tactician",nameOnPendientes:"Descripcion", color:"#F716FF",storeProcedureField:"Producto_Tactician"},
               
        ],
    
    niveles:[

        {id:0,label:"Nacional",field:"",coordinatesSource:"",storeProcedureField:"Nacional",oosFlilialesField:"Nacional"},
        {id:1,label:"Región Destino",field:"RegionZTDem",coordinatesSource:"cat_region",storeProcedureField:"Region",oosFlilialesField:"RegionDem"},
        {id:2,label:"Región Origen",field:"RegionZTDem",coordinatesSource:"cat_region_origen",storeProcedureField:"RegionOrigen",oosFlilialesField:"RegionDem"},
        {id:3,label:"Estado",field:"EstadoZTDem",coordinatesSource:"cat_estado",storeProcedureField:"Estado",oosFlilialesField:"EstadoDem"},
        {id:4,label:"Gerencia",field:"GerenciaUN",coordinatesSource:"cat_gerencia",storeProcedureField:"Gerencia",oosFlilialesField:"Gerencia"},
        {id:5,label:"Unidad de Negocio",field:"vc50_UN_Tact",coordinatesSource:"cat_un",storeProcedureField:"UnidadNegocio"},
        {id:6,label:"Zona de transporte",field:"ZonaTransporte",coordinatesSource:"cat_zt",storeProcedureField:"ZT"},       
        {id:7,label:"Frente",field:"Frente",coordinatesSource:"cat_frente",storeProcedureField:"Frente"},    
        {id:8,label:"Sucursal",field:"Obra",coordinatesSource:"cat_sucursal",storeProcedureField:"Obra"},   

    ]

}; 

