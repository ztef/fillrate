
/*


    Visual Interaction Systems Corp.

    Funciones auxiliares para el manejo de Tool Tips (jquery, d3.js)

    vix_tt (vix tool tip)


*/



/*

    EJEMPLO DE USO :


    // PREPARA DATOS 

    var data = arr.map(function(item) {
        return {
          key: item.key,
          "VolumenPlan": item.VolumenPlan,
          "VolumenReal": item.VolumenReal,
          "DifK": item.VolumenReal - item.VolumenPlan,
          "DifP": 100 + ((item.VolumenReal - item.VolumenPlan) / item.VolumenPlan) * 100,
          Peso: item.difPer
        };
        });
    
    
        // DEFINE COLUMNAS
      
      var columns = [
        { key: "key", header: "Estado", sortable: false, width: "500px" },
        { key: "VolumenPlan", header: "Vol Plan", sortable: true, width: "150px" },
        { key: "VolumenReal", header: "Vol Real", sortable: true, width: "150px" },
        { key: "DifK", header: "Dif (k)", sortable: true, width: "150px" },
        { key: "DifP", header: "Diferencia (%)", sortable: true,  width: "1500px" },
        { key: "Peso", header: "Peso", sortable: true,  width: "1500px" }
      ];
    
       // DEFINE VISITORS PARA CADA COLUMNA
    
    
      var columnVisitors = {
        key: function(value) {
            return value;
          },
    
        VolumenPlan: function(value) {
          return vix_tt_formatNumber(value) + " Tons";
        },
        VolumenReal: function(value) {
            return vix_tt_formatNumber(value) + " Tons";
        },
        DifK: function(value) {
            return vix_tt_formatNumber(value) + " Tons";
        },
        DifP: function(value){
      
            var barWidth = value + '%';
            var barValue = vix_tt_formatNumber(value)+'%';
            return '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: white;"></rect></svg>' + barValue;
       
        },
        Peso: function(value){
      
            var barWidth = value + '%';
            var barValue = tt_formatNumber(value)+'%';
            return '<svg width="100%" height="10"><rect class="bar-rect" width="' + barWidth + '" height="10" style="fill: yellow;"></rect></svg>' + barValue;
      
        }
      };
    
    
      // FORMATEA DIV :
    
      vix_tt_formatToolTip("#toolTip3","Detalle de Ventas por Producto y Presentación",350);
    
    
      // CREA TABLA USANDO DATOS
    
      vix_tt_table(data, columns, columnVisitors, "toolTip3");
      
      
      // APLICA TRANSICIONES 
      
      vix_tt_transitionRectWidth("toolTip3");
      
      




*/


// Formatea un numero, eliminando decimales y separando por comas.

function vix_tt_formatNumber(value) {

    // Redondea
    var roundedValue = Math.round(parseFloat(value));
  
    // Separa por comas 
    var formattedValue = roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    return formattedValue;
  }


// Funcion que lee de un div aquellos elementos de la clase .bar-rect
// y genera transiciones en base a su atributo width.
// Realiza 1000 operaiones 

function vix_tt_transitionRectWidth(containerID) {
    // Seleccciona Contenedor
    var container = d3.select(`#${containerID}`);
    // Selecciona elementos
    var rects = container.selectAll(".bar-rect");
  
    // Para cada elemento
    rects.each(function(d, i) {
        // Selecciona width original
      var originalWidth = d3.select(this).attr("width");
  
      // Pone el width en 0 
      d3.select(this).attr("width", 0)
        // Applica transicion :
        .transition()
        .duration(1000) // mil milisegundos
        .attr("width", originalWidth);  // with final (original)
    });
  }


/*

  Formatea cualquier elemento DIV del DOM :

    - hace que sea draggable
    - coloca una barra en la parte superior con un titulo
    - Agrega un boton de cerrado
    - Ajusta a un width determinado

*/


function vix_tt_formatToolTip(divElement, titulo, width) {


    $(divElement).html("");

    // Ajusta Estilo
    $(divElement).css({
      position: "absolute",
      border: "1px solid #6e647b",
      borderRadius: "7px",
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      boxShadow: "rgba(0, 0, 0, .5) 19px 15px 24px",
      width: width+"px", // You can adjust the width as needed
    });

    // Agrega capacidad de dragg al div
    $(divElement).draggable();

    // Crea barra superior
    var topBar = $("<div>", {
      class: "top-bar",
      css: {
        padding: "5px",
        backgroundColor: "#1f2e39",
        borderTopLeftRadius: "0px",

        borderTopRightRadius: "0px",
        cursor: "move",
      },
    });

    // Crea la zona de drag
    var dragHandle = $("<span>", {
      class: "drag-handle",
      text: titulo,
      
      css: {
        cursor: "move",
        fontSize: "18px",
      },
    });

    // Crea boton de cerrado
    var closeButton = $("<button>", {
        class: "close-button",
        css: {
          float: "right",
          cursor: "pointer",
          backgroundColor: "transparent",
          border: "none",
        },
      }).append('<i class="fas fa-times"></i>'); 

    // A la barra le agrega la zona de cerrado y el boton de cerrado
    topBar.append(dragHandle);
    topBar.append(closeButton);

    // Agrega la barra superior al div
    $(divElement).prepend(topBar);

    // Asocia evento de cerrado : OJO , Usa el CSS, no el visible del DOM
    closeButton.on("click", function () {
      $(divElement).css("visibility","hidden");
    });
  }


  
  
  /*

    vix_tt_table  : Crea una tabla en un container (div)


  */


  function vix_tt_table(data, columns, columnVisitors, containerID) {



    // CREA TABLA, Aplica estilos 

    var table = d3.select(`#${containerID}`).append("table")
      .style("border-collapse", "collapse")
      .style("border", "0px solid white"); // Set the table border color to white
  
    var thead = table.append("thead"); // Table header
    var tbody = table.append("tbody"); // Table body
  
    // Agrega fila header con iconos en las columnas sorteables
    thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .attr("class", "header-cell")
      .style("width", function(column) {
        return column.width;
      })
      .html(function(column, index) {
        var sortable = column.sortable;
        var sortOrder = sortable ? this.getAttribute("data-sort-order") : null;
        var sortIcon = sortable ? (sortOrder === "ascending" ? '<i class="fas fa-sort-up"></i>' : '<i class="fas fa-sort-down"></i>') : '';
        return column.header + ' ' + sortIcon;
      })
      .style("cursor", function(column, index) {        // Tipo de cursor
        return column.sortable ? "pointer" : "default";
      })
      .on("click", function(column, index) {    // Aplica logica de ordenamiento :
        if (column.sortable) {

            // Manejo de logica de orden ascendente/descendente

            var sortOrder = this.getAttribute("data-sort-order") || column.defaultSortOrder;
            var newSortOrder = sortOrder === "ascending" ? "descending" : "ascending";
    
            // Borra todos los iconos
            thead.selectAll("th")
              .attr("data-sort-order", null)
              .selectAll("i")
              .remove();
    
            // Actualiza el icono solo de la columna seleccionada
            d3.select(this).attr("data-sort-order", newSortOrder)
              .selectAll("i")
              .remove()
              .data([newSortOrder])
              .enter()
              .append("i")
              .attr("class", function(d) {
                return d === "ascending" ? "fas fa-sort-up" : "fas fa-sort-down";
              });
    
            // Realiza el sort de todos los renglones en base a la columna seleccionada y el orden (asc o desc)
            tbody.selectAll("tr")
              .sort(function(a, b) {
                return newSortOrder === "ascending" ? d3.ascending(a[column.key], b[column.key]) : d3.descending(a[column.key], b[column.key]);
              });
    
            // Guarda en data-sort-order el orden
            this.setAttribute("data-sort-order", newSortOrder);
   
        }
      });
  
    // Crea una fila (tr) para cada renglon de data
    var rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");
  
    // Crea una celda (td) para cada columna en data
    var cells = rows.selectAll("td")
      .data(function(row) {
        return columns.map(function(column) {
          return { column: column, value: row[column.key] };
        });
      })
      .enter()
      .append("td")
      .attr("class", "body-cell")
      .style("width", function(d) {
        return d.column.width;
      })
      .html(function(d) {
        var visitor = columnVisitors[d.column.key];                          // Aplica visitors para cada celda
        return visitor ? visitor(d.value) : d.value;    // si no hay visitor valor tal cual
      });
  
    return table;
  }
  