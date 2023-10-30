var filterControls={};
var createdControls={};
var controlsInit=false;

filterControls.estadoSelection={};
filterControls.handlerEstadoMultipleSelection_Select=function(values){

    filterControls.estadoSelection[values]=true;

    $("#cat_estado").val(Object.keys(filterControls.estadoSelection).toString().replaceAll("'",""));
    $($("#cat_estado").siblings().first()[0].firstChild).val(Object.keys(filterControls.estadoSelection).toString().replaceAll("'",""));
      
}
filterControls.handlerEstadoMultipleSelection_DesSelect=function(values){

    delete filterControls.estadoSelection[values];
    $("#cat_estado").val(Object.keys(filterControls.estadoSelection).toString().replaceAll("'",""));
    $($("#cat_estado").siblings().first()[0].firstChild).val(Object.keys(filterControls.estadoSelection).toString().replaceAll("'",""));

}
filterControls.cat_estado_Clean=function(){
    
    $("#cat_estado_multiple").multiSelect('deselect_all');
    filterControls.estadoSelection={};

}

filterControls.createDataFiltersControls=function(catalogs){

    if(!controlsInit){

        controlsInit=true;
        vix_tt_formatMenu("#Controls",".",160);
        //$("#Controls").css("max-height","600px");
        $("#Controls").css("height","570px");
        $("#Controls").css("width","400px");


        $("#Controls").append(`

            <div id="ControlsBlocks" style="display: flex;">

                    <div id="ControlsFields"></div>  
                    
                    <div style="width:90%;position:absolute;bottom:15px;display: flex;">
                                <button class="filters" onclick="$('#Controls2').css('visibility','visible');" style="margin: 3px;color:black">Selección Multiple</button>
                                <button class="filters" onclick="filterControls.CleanFields();" style="margin: 3px;color:black">Limpiar</button> 
                                <button class="filters" onclick="forzarFiltrado=true;filterControls.FilterData();  $('#Controls2').css('visibility','hidden');" style="margin: 3px;color:black">Filtrar</button>  
                        </div>

                    <div id="ControlsFieldsCustom" style="margin-left: 15px;">                    

                    </div>
            </div>

        `);

        vix_tt_formatMenu("#Controls2",".",160);
        $("#Controls2").css("height","570px");
        $("#Controls2").css("width","400px");
        $("#Controls2").css("right","480px");
    
        
    }

    filterControls.creaCatalogosDerivadorDeClientes();  
    
    for(var i=0;  i < catalogs.length; i++){

        var catlog=store[catalogs[i].data];

        if(!catlog){
            console.log("no se encuentra data para catalogo: ",catalogs[i].data,catalogs[i].placeholder);
            continue;
        }         
        
        if(!createdControls[catalogs[i].id]){

            if(catalogs[i].type=="" || !catalogs[i].type)
                continue;

            if(catalogs[i].type=="autoComplete"){

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
                
                arrAutoCompleteArr.sort();

                /*
                arrAutoCompleteArr.sort(); = arrAutoCompleteArr.sort((a, b) => {

                    if(String(Number(a.key))!="NaN"){
                        
                        return b.key - a.key;

                    }else{

                        if (a.key < b.key) {
                            return -1;
                        }
                        if (a.key > b.key) {
                            return 1;
                        }
                        return 0;
                        }

                    }
                            
                 );
                 */
                
                arrAutoCompleteArr

                // crea control de select  
                $("#ControlsFields").append(
                        `
                        <div class="ui-widget autocomplete loginBtn" style="width:90%;margin-top:15px;color:white" >
                        
                        <select id="${catalogs[i].id}" style="width:90%;border-style: solid;border-width: 1px;border-color:${catalogs[i].color};" placeholder="${ catalogs[i].placeholder }">
                        <option value=""> </option>                   
                        </select>
                        </div>`
                        );
                
                // crea control de seleccion multiple
                if(catalogs[i].multipleSelection){

                    createdControls[catalogs[i].id+"_multiple"]={Clean:filterControls[catalogs[i].id+"_Clean"]};
                    
                    $("#Controls2").append(`

                                <div id="" style="margin:10px;">

                                        <div id="" style="color:white">${ catalogs[i].placeholder }<br><br></div>                                          
                                        <select id='${catalogs[i].id}_multiple' multiple='multiple'>
                                                 
                                        </select>

                                        
                                </div>
                                `
                    );
                    
                    
                }
              
                if(catalogs[i].hardcodedData){

                    for(var j=0;  j < catalogs[i].hardcodedData.length; j++){     
                                              
                        $("#"+catalogs[i].id).append(`<option value="${catalogs[i].hardcodedData[j]}">${catalogs[i].hardcodedData[j]}</option>`);
                    }

                    for(var j=0;  j < catalogs[i].hardcodedData.length; j++){
                        catalogs[i].diccNames[catalogs[i].hardcodedData[j]]=catalogs[i].hardcodedData[j];
                    }

                }else{

                    $("#"+catalogs[i].id).append(`<option value="Todos">${catalogs[i].placeholder}: Todos</option>`);              

                    

                    for(var j=0;  j < arrAutoCompleteArr.length; j++){  
                        
                     
                                             
                        $("#"+catalogs[i].id).append(`<option value="${arrAutoCompleteArr[j]}">${arrAutoCompleteArr[j]}</option>`);

                        if(catalogs[i].multipleSelection){
                            $("#"+catalogs[i].id+"_multiple").append(`<option value="${arrAutoCompleteArr[j]}">${arrAutoCompleteArr[j]}</option>`);
                        }
                    }

                }   

                

                if(catalogs[i].default)
                    $("#"+catalogs[i].id).val(catalogs[i].default);

                //*****//******//******//******//******* */
               
                $.widget( "custom.combobox", {
                    _create: function() {
                    this.wrapper = $( "<span>" )
                        .addClass( "custom-combobox "+catalogs[i].id )
                        .insertAfter( this.element );
                    this.element.hide();
                    this._createAutocomplete();
                    this._createShowAllButton();
                },

			    _createAutocomplete: function() {

				var selected = this.element.children( ":selected" ),
					value = selected.val() ? selected.text() : "";

				this.input = $( "<input>" )
					.appendTo( this.wrapper )
					.val( value )
					.attr( "title", "" )
                    .attr( "placeholder", catalogs[i].placeholder )
					.addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: $.proxy( this, "_source" )
					}).css({'border-style': 'solid','border-width': '2px','border-color': catalogs[i].color})
					.tooltip({
						classes: {
							"ui-tooltip": "ui-state-highlight"
						}
					});
                                     
                    this._id=catalogs[i].id;

				this._on( this.input, {
					autocompleteselect: function( event, ui ) {
						ui.item.option.selected = true;
						this._trigger( "select", event, {
							item: ui.item.option
						});
                        
                        if(ui.item.option.value.indexOf("Todos") > -1 || ui.item.option.value=="" ){
                            if(filterControls[this._id+"_Clean"])
                                filterControls[this._id+"_Clean"]();
                        }
                        
					},

					autocompletechange: "_removeIfInvalid"
				});
			},

			_createShowAllButton: function() {
				var input = this.input,
					wasOpen = false;

				$( "<a>" )
					.attr( "tabIndex", -1 )                    
					.attr( "title", "Mostrar todo" )
					.tooltip()
					.appendTo( this.wrapper )
					.button({
						icons: {
							primary: "ui-icon-triangle-1-s"
						},
						text: false
					})
					.removeClass( "ui-corner-all" )
					.addClass( "custom-combobox-toggle ui-corner-right" )
					.on( "mousedown", function() {
						wasOpen = input.autocomplete( "widget" ).is( ":visible" );
					})
					.on( "click", function() {
						input.trigger( "focus" );

						// Close if already visible
						if ( wasOpen ) {
							return;
						}

						// Pass empty string as value to search for, displaying all results
						input.autocomplete( "search", "" );
					});
			},

			_source: function( request, response ) {
				var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
				response( this.element.children( "option" ).map(function() {
					var text = $( this ).text();
					if ( this.value && ( !request.term || matcher.test(text) ) )
						return {
							label: text,
							value: text,
							option: this
						};
				}) );
			},

			_removeIfInvalid: function( event, ui ) {

                    // Selected an item, nothing to do
                    if ( ui.item ) {
                        return;
                    }

                    // Search for a match (case-insensitive)
                    var value = this.input.val(),
                        valueLowerCase = value.toLowerCase(),
                        valid = false;
                    this.element.children( "option" ).each(function() {
                        if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                            this.selected = valid = true;
                            return false;
                        }
                    });

                    // Found a match, nothing to do
                    if ( valid ) {
                        return;
                    }

                    // Remove invalid value
                    this.input
                        .val( "" )
                        .attr( "title", value + " No coincide lo escrito " )
                        .tooltip( "open" );
                    this.element.val( "" );
                    this._delay(function() {
                        this.input.tooltip( "close" ).attr( "title", "" );
                    }, 2500 );
                    this.input.autocomplete( "instance" ).term = "";

                    filterControls.estadoSelection={};
                    if(filterControls[this._id+"_Clean"])
                        filterControls[this._id+"_Clean"]();
			},

			_destroy: function() {
				this.wrapper.remove();
				this.element.show();
			}
		    });

		    $( "#"+catalogs[i].id ).combobox();

            //*****//******//******//******//******* */

            if(catalogs[i].multipleSelection){

                    $("#"+catalogs[i].id+"_multiple").multiSelect({
                        afterSelect: filterControls.handlerEstadoMultipleSelection_Select,
                        afterDeselect: filterControls.handlerEstadoMultipleSelection_DesSelect
                    });

                    // $("#"+catalogs[i].id).change(function(element){
                    $($("#"+catalogs[i].id).siblings().first()[0].firstChild).change(function(element){

                            if($(element.target).val() == "" || $(element.target).val() == undefined || $(element.target).val() == null || $(element.target).val() == "Todos" ){
                                
                                if( filterControls[$(element.target).attr("id")+"_Clean"])
                                 filterControls[$(element.target).attr("id")+"_Clean"]();
                            
                            }                       
                        
                    });

            }                

                
            }

        }

    } 


}

filterControls.CreateSelectAuto=function(){

$( function() {
    $.widget( "custom.combobox", {
        _create: function() {
            this.wrapper = $( "<span>" )
                .addClass( "custom-combobox" )
                .insertAfter( this.element );
            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },

        _createAutocomplete: function() {
            var selected = this.element.children( ":selected" ),
                value = selected.val() ? selected.text() : "";

            this.input = $( "<input>" )
                .appendTo( this.wrapper )
                .val( value )
                .attr( "title", "" )
                .attr( "placeholder", "test" )
                .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
                .autocomplete({
                    delay: 0,
                    minLength: 0,
                    source: $.proxy( this, "_source" )
                })
                .tooltip({
                    classes: {
                        "ui-tooltip": "ui-state-highlight"
                    }
                });

            this._on( this.input, {
                autocompleteselect: function( event, ui ) {
                    ui.item.option.selected = true;
                    this._trigger( "select", event, {
                        item: ui.item.option
                    });
                },

                autocompletechange: "_removeIfInvalid"
            });
        },

        _createShowAllButton: function() {
            var input = this.input,
                wasOpen = false;

            $( "<a>" )
                .attr( "tabIndex", -1 )
                .attr( "title", "Show All Items" )
                .tooltip()
                .appendTo( this.wrapper )
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
                .removeClass( "ui-corner-all" )
                .addClass( "custom-combobox-toggle ui-corner-right" )
                .on( "mousedown", function() {
                    wasOpen = input.autocomplete( "widget" ).is( ":visible" );
                })
                .on( "click", function() {
                    input.trigger( "focus" );

                    // Close if already visible
                    if ( wasOpen ) {
                        return;
                    }

                    // Pass empty string as value to search for, displaying all results
                    input.autocomplete( "search", "" );
                });
        },

        _source: function( request, response ) {
            var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
            response( this.element.children( "option" ).map(function() {
                var text = $( this ).text();
                if ( this.value && ( !request.term || matcher.test(text) ) )
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
            }) );
        },

        _removeIfInvalid: function( event, ui ) {

            // Selected an item, nothing to do
            if ( ui.item ) {
                return;
            }

            // Search for a match (case-insensitive)
            var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
            this.element.children( "option" ).each(function() {
                if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                    this.selected = valid = true;
                    return false;
                }
            });

            // Found a match, nothing to do
            if ( valid ) {
                return;
            }

            // Remove invalid value
            this.input
                .val( "" )
                .attr( "title", value + " didn't match any item" )
                .tooltip( "open" );
            this.element.val( "" );
            this._delay(function() {
                this.input.tooltip( "close" ).attr( "title", "" );
            }, 2500 );
            this.input.autocomplete( "instance" ).term = "";
        },

        _destroy: function() {
            this.wrapper.remove();
            this.element.show();
        }
    });

    $( "#js__apply_now" ).combobox();
    
} );

}

filterControls.CleanFields=function(filtra){

    for(var e in createdControls){

            if(e.indexOf("multiple") >-1){
                createdControls[e].Clean();
            }           

    }
    

    for(var e in createdControls){

        if(e == "nivel_cb"){

            $("#nivel_cb").val(config.nivelInicial);

        } else if(e == "masivos_cb"){

            $("#masivos_cb").val("Todos");

        }if(e == "inputEnfoqueCamara"){


        }else{
        
            if(e.indexOf("multiple") < 0){
               
                $("#"+e).val("");
                $($("#"+e).siblings().first()[0].firstChild).val("");
            }


        }
       
    }

}

filterControls.SetDefaultValues=function(){

    for(var i=0;  i < store.catlogsForFilters.length; i++){
        console.log(store.catlogsForFilters[i].default);
            if(store.catlogsForFilters[i].default){
                console.log("encuentra default");
                $("#"+store.catlogsForFilters[i].id).val(store.catlogsForFilters[i].default);
                $($("#"+store.catlogsForFilters[i].id).siblings().first()[0].firstChild).val(store.catlogsForFilters[i].default) 
            }                   

    }        

}

// SE CREAN CATALOGOS A PARTIR DE UNA UNICA CONSULTA 
filterControls.creaCatalogosDerivadorDeClientes=function(){

    if(store.cat_cliente_ref){

            console.log("store.cat_cliente",store.cat_cliente_ref.length);

            // FRENTES

            var arrTemp=[];  

            var idCreados={};

            var caso=0;
            
            for(var i=0; i < store.cat_cliente_ref.length; i++){

                if(!idCreados[store.cat_cliente_ref[i].FrenteNum]){

                    arrTemp[caso]={};
                    arrTemp[caso].ID=store.cat_cliente_ref[i].FrenteNum;
                    arrTemp[caso].Nombre=store.cat_cliente_ref[i].Frente;
                    arrTemp[caso].Lat=store.cat_cliente_ref[i].Lat;
                    arrTemp[caso].Long=store.cat_cliente_ref[i].Long;
                    idCreados[store.cat_cliente_ref[i].FrenteNum]=true;

                   
                    caso++;

                }              

            }

            store.cat_frente=arrTemp;

            // SUCURSALES  PARA FILTROS       

            var arrTemp=[]; 
            
            var idCreados={};

            var caso=0;
            
            for(var i=0; i < store.cat_cliente_ref.length; i++){                

                if(!idCreados[store.cat_cliente_ref[i].DestinoNum]){

                    arrTemp[caso]={...store.cat_cliente_ref[i]};
                    arrTemp[caso].ID=arrTemp[caso].DestinoNum;
                    arrTemp[caso].Nombre=arrTemp[caso].Destino;                  
                    idCreados[store.cat_cliente_ref[i].DestinoNum]=true;
                    caso++;

                }               

            }          

            store.cat_sucursal=arrTemp;

            // SUCURSALES  PARA GEOLOCALIZACION       

            var arrTemp=[]; 
            
            var idCreados={};

            var caso=0;

            var registroDeNombres;
            for(var i=0;  i < store.catlogsForFilters.length; i++){

                if(store.catlogsForFilters[i].data=="cat_sucursal_estado"){

                    store.catlogsForFilters[i].diccNames={};
                    registroDeNombres=store.catlogsForFilters[i];

                    break;
                }                

            }
            
            for(var i=0; i < store.cat_cliente_ref.length; i++){                

                if(!idCreados[store.cat_cliente_ref[i].DestinoNum+"_"+store.cat_cliente_ref[i].EstadoDem]){

                    arrTemp[caso]={...store.cat_cliente_ref[i]};
                    arrTemp[caso].ID=arrTemp[caso].DestinoNum+"_"+arrTemp[caso].EstadoDem;
                    arrTemp[caso].Nombre=arrTemp[caso].Destino+"_"+arrTemp[caso].EstadoDem;
                    arrTemp[caso].Lat=arrTemp[caso].Lat_DestinoEstado;
                    arrTemp[caso].Long=arrTemp[caso].Lon_DestinoEstado;            
                    idCreados[store.cat_cliente_ref[i].DestinoNum+"_"+store.cat_cliente_ref[i].EstadoDem]=true;

                    registroDeNombres.diccNames[arrTemp[caso].ID]=arrTemp[caso].ID;

                    caso++;

                }               

            }          

            store.cat_sucursal_estado=arrTemp;

            // CLIENTES  HOLDINGS            

            var arrTemp_=[]; 
            
            var idCreados_={};    
            
            for(var i=0; i < store.cat_cliente_ref.length; i++){               

                    if(!idCreados_[store.cat_cliente_ref[i].HoldingNum]){
                       
                        arrTemp_.push(store.cat_cliente_ref[i]);                   
                        idCreados_[store.cat_cliente_ref[i].HoldingNum]=true;                        

                    }               

            }            

            store.cat_cliente=arrTemp_; 
            
            // CLIENTES  HOLDINGS  CON ESTADO          

            var arrTemp_=[]; 
            
            var idCreados_={};    

            var caso=0;

            var registroDeNombres;
            for(var i=0;  i < store.catlogsForFilters.length; i++){

                if(store.catlogsForFilters[i].data=="cat_cliente_estado"){

                    store.catlogsForFilters[i].diccNames={};
                    registroDeNombres=store.catlogsForFilters[i];

                    break;
                }                

            }
            
            for(var i=0; i < store.cat_cliente_ref.length; i++){               

                    if( !idCreados_[store.cat_cliente_ref[i].HoldingNum+"_"+store.cat_cliente_ref[i].EstadoDem] ){
                       
                        arrTemp_[caso]={...store.cat_cliente_ref[i]};
                        arrTemp_[caso].ID=store.cat_cliente_ref[i].HoldingNum+"_"+store.cat_cliente_ref[i].EstadoDem;
                        arrTemp_[caso].Nombre=store.cat_cliente_ref[i].Holding+"_"+store.cat_cliente_ref[i].EstadoDem;
                        arrTemp_[caso].Lat=store.cat_cliente_ref[i].Lat_HoldingEstado;
                        arrTemp_[caso].Long=store.cat_cliente_ref[i].Lon_HoldingEstado;                
                        idCreados_[store.cat_cliente_ref[i].HoldingNum+"_"+store.cat_cliente_ref[i].EstadoDem]=true;

                        registroDeNombres.diccNames[store.cat_cliente_ref[i].HoldingNum+"_"+store.cat_cliente_ref[i].EstadoDem]=store.cat_cliente_ref[i].HoldingNum+"_"+store.cat_cliente_ref[i].EstadoDem;

                        caso++;                      

                    }               

            }            

            store.cat_cliente_estado=arrTemp_; 
                  

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

        if($("#"+store.catlogsForFilters[i].id).siblings().first()[0]){
         
                if($($("#"+store.catlogsForFilters[i].id).siblings().first()[0].firstChild).val() != "" && $($("#"+store.catlogsForFilters[i].id).siblings().first()[0].firstChild).val() != undefined && $("#"+store.catlogsForFilters[i].id).val() != "Todos" ){
                    
                    filtrosAplicados[store.catlogsForFilters[i].id]=toTitleCase($($("#"+store.catlogsForFilters[i].id).siblings().first()[0].firstChild).val());
                    caso++;

                }else{
                    delete filtrosAplicados[store.catlogsForFilters[i].id];
                }

        }else{

                if($("#"+store.catlogsForFilters[i].id).val() != "" && $("#"+store.catlogsForFilters[i].id).val() != undefined && $("#"+store.catlogsForFilters[i].id).val() != "Todos" ){
                    filtrosAplicados[store.catlogsForFilters[i].id]=toTitleCase($("#"+store.catlogsForFilters[i].id).val());
                    caso++;
                }else{
                    delete filtrosAplicados[store.catlogsForFilters[i].id];
                }

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
    if(!svgLines){
        return;
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

    console.log(nivel);

    var titulo=`<div style="font-size:100%;width:${windowWidth*.56}px";> ${filtroProducto} | ${filtroPresentacion} | ${pedidosEntregados} Nivel: ${nivel} 
    <span style="font-size:12px; color:white">
       Período: ${dateInit.getDate()} ${getMes(dateInit.getMonth())} ${String(dateInit.getFullYear())} al ${dateEnd.getDate()}  ${getMes(dateEnd.getMonth())} ${String(dateEnd.getFullYear())}
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
                            return "Ningún Otro Filtro Aplicado";
                        }else{
                            return "Otros Filtros Activos:";
                        }                       

                    });    

}

var posAnterior;

filterControls.createHardCodedControls=function(){

        // NIVELES DE AGRUPACIÓN
        $("#ControlsFieldsCustom").append(
                `
                <div id="" class="ui-widget"  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
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

        $("#nivel_cb").val(config.nivelInicial);
        nivelLecturaActual=config.nivelInicial;

        posAnterior=0;
      
        $("#nivel_cb").change(function(){

            if($("#nivel_cb").val() > 5){
                if($("#cat_cliente").val() == "" && $("#cat_region").val() == "" && $("#cat_region_origen").val() == "" &&  $("#cat_estado").val() == "" && $("#cat_gerencia").val() == ""  && $("#cat_un").val() == ""){

                    if(posAnterior || posAnterior.toString() == "0")
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

         // CAPAS DE CLIMA
         $("#ControlsFieldsCustom").append(
            `
            <div id="" class=""  style="font-family:Cabin;font-size:11px;color:#cccccc;z-index:9999999;opacity:1;font-weight: normal;margin-top:20px;">
                Capas de clima en mapa: <br> <br>                 
                <select id="weather_cb" style="font-size:12px;background-color:black;border-color: gray;border-width:1px;color:white;width:100%;opacity:.8;margin:2px;">
                <option value=""></option>
                <option value="clouds_new">Nubes</option>
                <option value="precipitation_new">Precipitación</option>
                <option value="temp_new">Temperatura</option>
                <option value="wind_new">Velocidad de Viento</option>
             
                </select>

            </div>                            
            `
        );

        createdControls["weather_cb"]=true;

        d3.select("#weather_cb").on("change",function(){            
                
                //elimina los estados
                EliminaEstadosDibujados();

                if($("#weather_cb").val()!=""){      
                    
                    viewer.imageryLayers.removeAll();

                    var imageryLayers=viewer.imageryLayers;
                    var url='https://api.mapbox.com/styles/v1/dcontreras1979/clodg9bi4000x01qseqsma88k/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGNvbnRyZXJhczE5NzkiLCJhIjoiY2l3Z3dpY2gxMDFhbzJvbW40cWRqNmZ0OCJ9.KIrZ8JiXWYgjLBb-nL3kYg';
                    layer=new Cesium.UrlTemplateImageryProvider(
                        {
                            url:url
                        }
                    );
                    imageryLayers.addImageryProvider(layer);  
                    
                    var imageryLayers=viewer.imageryLayers;
                    var url='https://tile.openweathermap.org/map/'+$("#weather_cb").val()+'/{z}/{x}/{y}.png?appid=497190b8b2c9ba28013a941c3172a3fc';
                    layer=new Cesium.UrlTemplateImageryProvider(
                        {
                            url:url,
                            alpha: 1,
                        }
                    );
                    imageryLayers.addImageryProvider(layer)

                }else{

                    viewer.imageryLayers.removeAll();

                    var imageryLayers=viewer.imageryLayers;
                    var url='https://api.mapbox.com/styles/v1/dcontreras1979/ciwiilbs100022qnvp3m3vnsh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZGNvbnRyZXJhczE5NzkiLCJhIjoiY2l3Z3dpY2gxMDFhbzJvbW40cWRqNmZ0OCJ9.KIrZ8JiXWYgjLBb-nL3kYg';
                    layer=new Cesium.UrlTemplateImageryProvider(
                        {
                            url:url
                        }
                    );
                    imageryLayers.addImageryProvider(layer); 
                    
                    //crea nuevamente los estados
                    var estados  = d3.nest()
                        .key(function(d) { return  d["EstadoZTDem"]; })                           
                        .entries(store.dataToDraw);
    
                    calculateKpiExpert_FR.calculateFRPorEstado(estados);
                }
                   
    
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

    if(backInfoNav.length > 0){

        if(backInfoNav[backInfoNav.length-1].entity.toLowerCase()=="sacos" || backInfoNav[backInfoNav.length-1].entity.toLowerCase()=="granel" ){
            $("#cat_presentacion").val("");
            $($("#cat_presentacion").siblings().first()[0].firstChild).val("");
        }

        filterControls.lookForEntity(backInfoNav[backInfoNav.length-1].entity,backInfoNav[backInfoNav.length-1].catlog);

    }

    if(backInfoNav.length > 0){
        backInfoNav.splice(backInfoNav.length-1,1);        
    }

    filterControls.arrowUpdate();

    setTimeout(()=>{

        if(backInfoNav.length > 0){
            $("#back_btn").css("visibility","visible");           
        } else{
            $("#back_btn").css("visibility","hidden");
        }  
    
    }, 1000);

    radar.CleanWindows();
        
}

filterControls.arrowUpdate=function(){

    $("#toolTip").html("");

    if(backInfoNav.length > 0){

        console.log("arrowUpdate");

        document.getElementById("back_btn").onmouseover = function() {

                $("#toolTip").css("visibility","visible");

                $("#toolTip").css("top",mouse_y+20);

                $("#toolTip").css("left",mouse_x+20);

                $("#toolTip").html("");

               

                $("#toolTip").html(
                    
                    `
                        <span style='color:#fff600;font-size:${15*escalaTextos}px;margin:13px;'>Regresa a: <span style='color:#00EAFF;margin:5px;padding-right:30px;'>${toTitleCase(backInfoNav[backInfoNav.length-1   ].entity)}</span> </span>   <br>
                        <span style='color:#fff600;font-size:${15*escalaTextos}px;margin:13px;'>En: <span style='color:#00EAFF;margin:5px;'>${backInfoNav[backInfoNav.length-1].catlog}</span></span>
                
                    `
                );

            };   
            
             

    }else
    {
        
        $("#toolTip").css("visibility","hidden");		    	

    }

    if(backInfoNav.length > 0){
        $("#back_btn").css("visibility","visible");           
    } else{
        $("#back_btn").css("visibility","hidden");
    } 

}

filterControls.lookForEntity=function(name, catlog, parent){        

        name=String(name).toLocaleLowerCase();

        console.log("lookForEntity ",name, catlog,parent);

        waitingToFocus=undefined;
        
        for(var e in store){

            if(e.indexOf("cat_") > -1 && filterControls.checkCatlogName(e,catlog) ){
                
                for(var i=0; i < store[e].length; i++){
                
                    if( String(store[e][i].ID).toLocaleLowerCase()== name || String(store[e][i].Nombre).toLocaleLowerCase() == name  ){                   
                    
                        for(var j=0; j < store.niveles.length; j++){
                        
                            if(store.niveles[j].coordinatesSource){
                                
                                if(store.niveles[j].coordinatesSource==e){
                                    
                                    if( String($("#nivel_cb").val()) != String(store.niveles[j].id) ){                                        

                                        $("#nivel_cb").val(store.niveles[j].id);

                                        if(parent){

                                            if(parent.toLowerCase()=="sacos" ){
                                                $("#cat_presentacion").val("Sacos");
                                                $($("#cat_presentacion").siblings().first()[0].firstChild).val("Sacos");
                                            } if( parent.toLowerCase()=="granel"){
                                                $("#cat_presentacion").val("Sacos");
                                                $($("#cat_presentacion").siblings().first()[0].firstChild).val("Granel");
                                            }
                                            
                                        }
                                        
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

        if(name.toLowerCase()=="nacional" || name.toLowerCase()=="sacos" || name.toLowerCase()=="granel"){
            $("#nivel_cb").val(0);
            filterControls.FilterData();
            return;
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

        Stage.FocusMapElement(waitingToFocus);
        waitingToFocus=undefined;
    }

}