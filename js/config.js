var config={

    modoSoloFillRate:true,

    nivelInicial:0 , //Debe especificarse el id de store.niveles

   

    //DATA OPERATIVA
    fillRateSource:"docs/FillRate_mayoGS.csv",
    oosSource:"docs/OOS_Mayo_GS.csv",
    pendientesSource:"docs/Pedidos_Pendientes_Mayo_GS.csv",

    agrupadorInicial:"Nacional",

    //CATALOGOS
    infoSource:"docs/catalogos/help_tooltip_txt.csv",
    regionSource:"docs/catalogos/RegionZT.csv",
    estadoSource:"docs/catalogos/EstadoZTDem.csv",
    unSource:"docs/catalogos/Unidad_de_Negocio_.csv",
    ztSource:"docs/catalogos/ZonaTransporte3.csv",
    clienteSource:"docs/catalogos/Cliente.csv",
    frenteSource:"docs/catalogos/Catalogo_Frentes_GS.csv",
    gerenciaSource:"docs/catalogos/Cat_Gerencias_GS.csv",


    //DIMENSIONES DE ELEMENTOS GRAFICOS

    radiosMinimos:[110,110,110,110,110,110,110,110,110,110],
    radiosMaximos:[50000,50000,50000,30000,18000,9500,4000,4000,4000,4000],
    alturas:[300000,300000,300000,110000,90000,50000,5000,6000,6000,6000],
    offSetCamaraParaEnfocar:[-3,-3,-3,-3,-2,-1,-.5,-.5,-.5,-.5], //es offset de la altitud que se agrega a la cordenada del cilindro y q deterina la posicion de l camara
    offSetAlturaParaEnfocar:[3,3,3,5,4,5,20,20,20,20], //es la cantidad de veces q se multiplica la altura del cilindro  segun cada nivel para colocar la camara 
    
    labels:{
        "Libre_RecAutf":"Libre Recogido"
    }
}

config.checkLabel=function(label){

    if(config.labels[label]){
        return config.labels[label];
    }else{
        label=label.replaceAll("_"," ");
        return label;
    }

}