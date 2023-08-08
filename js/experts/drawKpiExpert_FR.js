var kpiExpert_FR={};

kpiExpert_FR.DrawElement=function(entity,varName,i){      
      
        var altura1=GetValorRangos(entity[varName].por1,1 ,100 ,1 ,entity.altura );
   
        var geometry1= viewer.entities.add({
                name : '',
                position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura1/2)  ),
                cylinder : {
                    length : altura1,
                    topRadius : entity.radio*.9,
                    bottomRadius : entity.radio*.9,
                    material : Cesium.Color.fromCssColorString("#4989FF").withAlpha(1)              
                    
                }
        });


        mapElementsArr.push(geometry1);						

        var altura2=GetValorRangos(entity[varName].por2,1 ,100 ,1 ,entity.altura );

        var geometry2= viewer.entities.add({
                name : '',
                position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura2/2)+altura1+(entity.altura*.02) ),
                cylinder : {
                    length : altura2,
                    topRadius : entity.radio*.9,
                    bottomRadius : entity.radio*.9,
                    material : Cesium.Color.fromCssColorString("#FFF117").withAlpha(1)              
                    
                }
        });


        mapElementsArr.push(geometry2);

        var altura3=GetValorRangos(entity[varName].por3,1 ,100 ,1 ,entity.altura );

        var geometry3= viewer.entities.add({
                name : '',
                position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (altura3/2)+altura1+altura2+(entity.altura*.04)  ),
                cylinder : {
                    length : altura3,
                    topRadius : entity.radio*.9,
                    bottomRadius : entity.radio*.9,
                    material : Cesium.Color.fromCssColorString("#FF0018").withAlpha(1)              
                    
                }
        });

        mapElementsArr.push(geometry3);

        if(i < 300){

                //VASO EXTERIOR
                var geometryExt= viewer.entities.add({
                        name : '',
                        position: Cesium.Cartesian3.fromDegrees( entity.lng , entity.lat , (entity.altura/2)  ),
                        cylinder : {
                                length : entity.altura+(entity.altura*.04),
                                topRadius : entity.radio,
                                bottomRadius : entity.radio,
                                material : Cesium.Color.fromCssColorString("#ffffff").withAlpha(.2)              
                                
                        }
                        });
                
                entity.geometries=[geometry1,geometry2,geometry3,geometryExt];
                mapElementsArr.push(geometryExt);
                mapElements[geometryExt.id]=entity;

        }else{

                entity.geometries=[geometry1,geometry2,geometry3];

                if(altura1 > 100){              
                        mapElementsArr.push(geometry1);
                        mapElements[geometry1.id]=entity;
                }else if(altura2 > 100){
                        mapElementsArr.push(geometry2);
                        mapElements[geometry2.id]=entity;
                }else if(altura3 > 100){
                        mapElementsArr.push(geometry3);
                        mapElements[geometry3.id]=entity;
                }

        }   

       
   
}

kpiExpert_FR.eraseChart=function(){ 

        d3.select("#svgTooltip").selectAll(".frDetail").data([]).exit().remove();
        d3.select("#svgTooltip3").selectAll(".frDetail").data([]).exit().remove();

        $("#toolTip2").css("visibility","hidden");
        $("#toolTip3").css("visibility","hidden");
       
       
}


kpiExpert_FR.DrawTooltipDetail=function(entity){   

        d3.select("#svgTooltip").selectAll(".frDetail").data([]).exit().remove();
        d3.select("#svgTooltip3").selectAll(".frDetail").data([]).exit().remove();

        kpiExpert_FR.DrawTooltipDetail_Estado(entity);
        kpiExpert_FR.DrawTooltipDetail_ByDay(entity);

       

}

kpiExpert_FR.DrawTooltipDetail_Estado=function(entity){ 

        var maximo=0;

        var arr=d3.nest()
            .key(function(d) { return d.EstadoZTDem; })
            .entries(entity.values);  

        for(var i=0; i < arr.length; i++ ){
                
                arr[i].CantEntfinal=0;
                arr[i].fecha=arr[i].values[0].fecha.getTime();
                arr[i].totalSolicitado=0;

                arr[i].vol1=0;
                arr[i].vol2=0;
                arr[i].vol3=0;

                arr[i].por1=0;
                arr[i].por2=0;
                arr[i].por3=0;

                for(var j=0; j < arr[i].values.length; j++ ){

                        arr[i].CantEntfinal+=Number(arr[i].values[j][campoDeVolumenFR]);
                        arr[i].totalSolicitado+=Number(arr[i].values[j][campoTotalSolicitado]);

                        if(arr[i].values[j][campoDeATiempo] == "A Tiempo"){
                                arr[i].vol1+=Number(arr[i].values[j][campoDeVolumenFR]);
                        }else if(arr[i].values[j][campoDeATiempo] == "1 a 2 días Tarde"){
                                arr[i].vol2+=Number(arr[i].values[j][campoDeVolumenFR]);
                        }else if(arr[i].values[j][campoDeATiempo] == "3 o más días Tarde"){
                                arr[i].vol3+=Number(arr[i].values[j][campoDeVolumenFR]);
                        } 
                        
                }

                if(maximo < arr[i].CantEntfinal){
                        maximo=arr[i].CantEntfinal;
                } 
                
                arr[i].por1=Math.round((arr[i].vol1/arr[i].totalSolicitado)*100);
                arr[i].por2=Math.round((arr[i].vol2/arr[i].totalSolicitado)*100);
                arr[i].por3=Math.round((arr[i].vol3/arr[i].totalSolicitado)*100);      

        }

        arr = arr.sort((a, b) => {                
                return b.CantEntfinal - a.CantEntfinal;                                    

        }); 

        arr=arr.reverse();

        var altura=30;
        var caso=0;
       
        var svgTooltipHeight=arr.length*altura;
    
        if(svgTooltipHeight<100)
            svgTooltipHeight=100;
    
    
        var svgTooltipWidth=600;
        var marginLeft=svgTooltipWidth*.2;
        var tamanioFuente=altura*.4;
        var marginTop=35;

        $("#toolTip3").css("visibility","visible");            
        $("#toolTip3").css("left",(mouse_x+950)+"px");
    
      
        var toolText =  
                "<span style='color:#fff600'><span style='color:#ffffff'>FillRate por Estado</span></span> "+               
                "<svg id='svgTooltip3'  style='pointer-events:none;'></svg> ";

        $("#toolTip3").html(toolText);

        d3.select("#toolTip3")                                     
                        .style("width", (svgTooltipWidth)+"px" );

        d3.select("#svgTooltip3")                     
                        .style("width", svgTooltipWidth )
                        .style("height", (svgTooltipHeight)+50 )
                        ;

        var posY=mouse_y-50;

        if( $("#toolTip3").height()+mouse_y+50 > windowHeight ){
                posY=windowHeight-($("#toolTip3").height()+20);
        }

        if( posY < 0 ){
                posY=50;
        }

        $("#toolTip3").css("top",posY);

        d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","abasDetail")
                .style("fill","#8EBBFF")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",1 )
                .attr("transform"," translate("+String( svgTooltipWidth*.3  )+","+String( tamanioFuente+10   )+")  rotate("+(0)+") ")
                .text("FillRate")
                .transition().delay(0).duration(i*50);

        d3.select("#svgTooltip3")
                .append("text")						
                .attr("class","abasDetail")
                .style("fill","#8EBBFF")		
                .style("font-family","Cabin")
                .style("font-weight","bold")
                .style("font-size",tamanioFuente)						
                .style("text-anchor","start")
                .style("opacity",1 )
                .attr("transform"," translate("+String( svgTooltipWidth*.7  )+","+String( tamanioFuente+10  )+")  rotate("+(0)+") ")
                .text("Vol. Entregado")
                .transition().delay(0).duration(i*50);

        for(var i=0; i < arr.length; i++ ){

                var ancho=svgTooltipWidth*.3;
                var ancho1=GetValorRangos( arr[i].por1,1, 100 ,1,ancho);
                var ancho2=GetValorRangos( arr[i].por2,1, 100 ,1,ancho);
                var ancho3=GetValorRangos( arr[i].por3,1, 100 ,1,ancho);

                d3.select("#svgTooltip3").append("rect")		    		
                                            .attr("height",altura*.6 )
                                            .attr("class","frDetail")
                                            .attr("x",svgTooltipWidth*.3  )
                                            .attr("y", (altura*caso)+marginTop )
                                            .attr("width",1)
                                            .attr("fill","#00A8FF")
                                            .transition().delay(0).duration(i*50)
                                            .style("width",ancho1 )	
                                            ;

                d3.select("#svgTooltip3")
                                            .append("text")						
                                            .attr("class","abasDetail")
                                            .style("fill","#ffffff")		
                                            .style("font-family","Cabin")
                                            .style("font-weight","bold")
                                            .style("font-size",tamanioFuente)	
                                            .style("text-anchor","middle")
                                            .attr("transform"," translate("+String( svgTooltipWidth*.3+(ancho1/2)  )+","+String( ((altura*caso)+marginTop)+tamanioFuente    )+")  rotate("+(0)+") ")
                                            .text(function(){
                                            
                                                return  arr[i].por1+"%";
    
                                            });

                d3.select("#svgTooltip3").append("rect")		    		
                                            .attr("height",altura*.6 )
                                            .attr("class","frDetail")
                                            .attr("x",(svgTooltipWidth*.3)+ancho1  )
                                            .attr("y", (altura*caso)+marginTop  )
                                            .attr("width",1)
                                            .attr("fill","#EAFF00")
                                            .transition().delay(0).duration(i*50)
                                            .style("width",ancho2 )	
                                            ;

                 d3.select("#svgTooltip3").append("rect")		    		
                                            .attr("height",altura*.6 )
                                            .attr("class","frDetail")
                                            .attr("x",(svgTooltipWidth*.3)+ancho1+ancho2  )
                                            .attr("y", (altura*caso)+marginTop  )
                                            .attr("width",1)
                                            .attr("fill","#FF0000")
                                            .transition().delay(0).duration(i*50)
                                            .style("width",ancho3 )	
                                            ;

                // BARRA 2

                var ancho=GetValorRangos( arr[i].CantEntfinal,1, maximo ,1,svgTooltipHeight*.4);
               
                d3.select("#svgTooltip3").append("rect")		    		
                                            .attr("height",altura*.6 )
                                            .attr("class","frDetail")
                                            .attr("x",svgTooltipWidth*.7  )
                                            .attr("y", (altura*caso)+marginTop )
                                            .attr("width",1)
                                            .attr("fill","#FFFFFF")
                                            .transition().delay(0).duration(i*50)
                                            .style("width",ancho )	
                                            ;

                d3.select("#svgTooltip3")
                                            .append("text")						
                                            .attr("class","abasDetail")
                                            .style("fill","#ffffff")		
                                            .style("font-family","Cabin")
                                            .style("font-weight","bold")
                                            .style("font-size",tamanioFuente)	
                                            .style("text-anchor","start")
                                            .attr("transform"," translate("+String( (svgTooltipWidth*.7)+ancho+3  )+","+String( (altura*caso)+tamanioFuente+marginTop    )+")  rotate("+(0)+") ")
                                            .text(function(){
                                            
                                                return  Math.round((arr[i].CantEntfinal/1000)*100)/100 +"k";
    
                                            });


                d3.select("#svgTooltip3")
                                        .append("text")						
                                        .attr("class","abasDetail")
                                        .style("fill","#ffffff")		
                                        .style("font-family","Cabin")
                                        .style("font-weight","bold")
                                        .style("font-size",tamanioFuente)	
                                        .style("text-anchor","start")
                                        .attr("transform"," translate("+String( 5  )+","+String( altura*caso+(tamanioFuente )+marginTop   )+")  rotate("+(0)+") ")
                                        .text(function(){

                                                this.name=arr[i].key;
                                                return  arr[i].key;

                                        })
                                        .style("pointer-events","auto")
                                        .on("mouseover",function(){
                                                d3.select(this).style("fill","#F0FF00");
                                                
                                        })
                                        .on("mouseout",function(){
                                                d3.select(this).style("fill","#FFFFFF");
                                                
                                         })
                                         .on("click",function(){
                                                
                                                kpiExpert_FR.eraseChart();

                                                if(filterControls){
                                                        filterControls.lookForEntity(this.name);
                                                }
                                                
                                         });

                    caso++; 

        }

}
    
kpiExpert_FR.DrawTooltipDetail_ByDay=function(entity){    
    
        console.log(entity);  
       
        var maximo=0;

        var arr=d3.nest()
                .key(function(d) { 

                        if(d.fecha){
                                return d.fecha.getTime(); 
                        }else{                       
                                return 0;
                        }                        
        
                })
                .entries(entity.values);

        
        for(var i=0; i < arr.length; i++ ){

                        arr[i].CantEntfinal=0;
                        arr[i].fecha=arr[i].values[0].fecha.getTime();
                        arr[i].totalSolicitado=0;

                        arr[i].vol1=0;
                        arr[i].vol2=0;
                        arr[i].vol3=0;

                        arr[i].por1=0;
                        arr[i].por2=0;
                        arr[i].por3=0;

                        for(var j=0; j < arr[i].values.length; j++ ){

                                arr[i].CantEntfinal+=Number(arr[i].values[j][campoDeVolumenFR]);
                                arr[i].totalSolicitado+=Number(arr[i].values[j][campoTotalSolicitado]);

                                if(arr[i].values[j][campoDeATiempo] == "A Tiempo"){
                                        arr[i].vol1+=Number(arr[i].values[j][campoDeVolumenFR]);
                                }else if(arr[i].values[j][campoDeATiempo] == "1 a 2 días Tarde"){
                                        arr[i].vol2+=Number(arr[i].values[j][campoDeVolumenFR]);
                                }else if(arr[i].values[j][campoDeATiempo] == "3 o más días Tarde"){
                                        arr[i].vol3+=Number(arr[i].values[j][campoDeVolumenFR]);
                                } 
                                
                        }

                        if(maximo < arr[i].CantEntfinal){
                                maximo=arr[i].CantEntfinal;
                        } 
                        
                        arr[i].por1=Math.round((arr[i].vol1/arr[i].totalSolicitado)*100);
                        arr[i].por2=Math.round((arr[i].vol2/arr[i].totalSolicitado)*100);
                        arr[i].por3=Math.round((arr[i].vol3/arr[i].totalSolicitado)*100);            

        } 
        
        arr = arr.sort((a, b) => {                
                        return b.fecha - a.fecha;                                    
        
        }); 
        
        arr=arr.reverse();

        var ancho=20;
        var caso=0;
       
        
        var svgTooltipWidth=arr.length*ancho;
        if(svgTooltipWidth < 80)
        svgTooltipWidth=80;
    
        var svgTooltipHeight=500;
        var marginBottom=svgTooltipHeight*.11;
        var tamanioFuente=ancho*.8;   
    
        $("#toolTip2").css("visibility","visible");            
        $("#toolTip2").css("left",(mouse_x+300)+"px");
           
        var toolText =  
                    "<span style='color:#fff600'><span style='color:#ffffff'>Detalle de Días de FR de "+entity.key+"</span></span> <br>"+               
                    "<svg id='svgTooltip'  style='pointer-events:none;'></svg> ";
    
        $("#toolTip2").html(toolText);
        d3.select("#toolTip2")                                     
                    .style("width", (svgTooltipWidth)+"px" );
    
        d3.select("#svgTooltip")                     
                    .style("width", svgTooltipWidth )
                    .style("height", svgTooltipHeight )
                    ;
                    var posY=mouse_y+50;

        if( $("#svgTooltip").height()+mouse_y+50 > windowHeight ){
                posY=windowHeight-($("#svgTooltip").height()+20);
        }

        var posY=mouse_y-50;

        if( $("#toolTip2").height()+mouse_y+50 > windowHeight ){
                posY=windowHeight-($("#toolTip2").height()+20);
        }

        if( posY < 0 ){
                posY=50;
        }

        $("#toolTip2").css("top",posY);
       
        for(var i=0; i < arr.length; i++ ){        
                
                var altura=svgTooltipHeight*.3;
                var altura1=GetValorRangos( arr[i].por1,1, 100 ,1,altura);
                var altura2=GetValorRangos( arr[i].por2,1, 100 ,1,altura);
                var altura3=GetValorRangos( arr[i].por3,1, 100 ,1,altura);
              
          
                d3.select("#svgTooltip").append("rect")		    		
                                            .attr("width",ancho )
                                            .attr("class","frDetail")
                                            .attr("x",ancho*caso  )
                                            .attr("y", (svgTooltipHeight)-altura-3-marginBottom  )
                                            .attr("height",1)
                                            .attr("fill","none")
                                            .style("stroke-width",1)
                                            .style("stroke-color","#ffffff")
                                            .transition().delay(0).duration(i*50)
                                            .style("height",altura )	
                                            ;

                d3.select("#svgTooltip").append("rect")		    		
                                            .attr("width",ancho*.6 )
                                            .attr("class","frDetail")
                                            .attr("x",(ancho*caso)+(ancho*.1)  )
                                            .attr("y", (svgTooltipHeight)-altura1-3-marginBottom  )
                                            .attr("height",1)
                                            .attr("fill","#00A8FF")
                                            .transition().delay(0).duration(i*50)
                                            .style("height",altura1 )	
                                            ;

                d3.select("#svgTooltip").append("rect")		    		
                                            .attr("width",ancho*.6 )
                                            .attr("class","frDetail")
                                            .attr("x",(ancho*caso)+(ancho*.1)  )
                                            .attr("y", (svgTooltipHeight)-altura1-altura2-3-marginBottom  )
                                            .attr("height",1)
                                            .attr("fill","#EAFF00")
                                            .transition().delay(0).duration(i*50)
                                            .style("height",altura2 )	
                                            ;

                 d3.select("#svgTooltip").append("rect")		    		
                                            .attr("width",ancho*.6 )
                                            .attr("class","frDetail")
                                            .attr("x",(ancho*caso)+(ancho*.1)  )
                                            .attr("y", (svgTooltipHeight)-altura1-altura2-altura3-3-marginBottom  )
                                            .attr("height",1)
                                            .attr("fill","#FF0000")
                                            .transition().delay(0).duration(i*50)
                                            .style("height",altura3 )	
                                            ;


                var alturaVolumen=GetValorRangos( arr[i].CantEntfinal,1, maximo ,1,svgTooltipHeight*.3);

                d3.select("#svgTooltip").append("rect")		    		
                                        .attr("width",(ancho*.7) )
                                        .attr("class","frDetail")
                                        .attr("x", ancho*caso  )
                                        .attr("y", (svgTooltipHeight*.5)-alturaVolumen-3  )
                                        .attr("height",alturaVolumen)
                                        .attr("fill","#FFFFFF")                                     
                                        .transition().delay(0).duration(i*50)
                                        .style("height",alturaVolumen )	
                                        ;

        
    
                d3.select("#svgTooltip")
                        .append("text")						
                        .attr("class","frDetail")
                        .style("fill","#ffffff")		
                        .style("font-family","Cabin")
                        .style("font-weight","bold")
                        .style("font-size",tamanioFuente*.8)						
                        .style("text-anchor","start")
                        .style("opacity",0 )
                        .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)+3  )+","+String( ((svgTooltipHeight*.6))-marginBottom-alturaVolumen  )+")  rotate("+(-90)+") ")
                        .text(function(){
                        
                            return  Math.round((arr[i].CantEntfinal/1000)*100)/100 +"k";
    
                        })
                        .transition().delay(0).duration(i*50)
                                            .style("opacity",1 )
                      ;

                d3.select("#svgTooltip")
                      .append("text")						
                      .attr("class","frDetail")
                      .style("fill","#FFFFFF")		
                      .style("font-family","Cabin")
                      .style("font-weight","bold")
                      .style("font-size",tamanioFuente*.84)						
                      .style("text-anchor","start")
                      .style("opacity",0 )
                      .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.8)+1  )+","+String( (svgTooltipHeight-50)-marginBottom )+")  rotate("+(-90)+") ")
                      .text(function(){
                      
                          return  arr[i].por1+"%";
  
                      })
                      .transition().delay(0).duration(i*50)
                                          .style("opacity",1 )
                    ;
    
                d3.select("#svgTooltip")
                                .append("text")						
                                .attr("class","frDetail")
                                .style("fill","#ffffff")		
                                .style("font-family","Cabin")
                                .style("font-weight","bold")
                                .style("font-size",tamanioFuente*.7)	
                                .style("text-anchor","end")
                                .attr("transform"," translate("+String( ancho*caso+(tamanioFuente*.7)  )+","+String( (svgTooltipHeight)-marginBottom+10  )+")  rotate("+(-90)+") ")
                                .text(function(){
                                        
                                var date=new Date( Number(arr[i].key) );

                                return  date.getDate()+" "+getMes(date.getMonth());
        
                                });
    
                        caso++;            
        }         
    
    }

    kpiExpert_FR.DrawMainHeader=function(){

                kpiExpert_FR.ancho=windowWidth*.75;
                kpiExpert_FR.offSetLeft=70;
                kpiExpert_FR.offSetTop=10;              

                kpiExpert_FR.altura=60;

                var ancho=kpiExpert_FR.ancho;
                var offSetLeft=kpiExpert_FR.offSetLeft;
                var offSetTop=kpiExpert_FR.offSetTop;
                ancho=kpiExpert_FR.ancho;

                var altura=kpiExpert_FR.altura;
                
                svgLines.selectAll(".encabezado").data([]).exit().remove();

                // SOLICITADO **********

                svgLines														
			.append("rect")
			.attr("fill","#292929")
			.style("stroke","#cccccc")
			.attr("filter","url(#glow)")
                        .attr("class","encabezado")
			.style("stroke-width",1)
			.style("stroke-opacity",.7)
			.style("opacity",.85 )
                        .attr("rx",10)
			.attr("width",ancho )
			.attr("height",altura-offSetTop )
			.attr("x",offSetLeft)
			.attr("y",offSetTop)
			;

             
                svgLines.append("text")							
			.style("fill","#AFAFAF")		
                        .attr("class","encabezado")					
			.style("opacity",0)
			.style("font-family","Cabin")
			.style("font-weight","normal")
			.style("font-size",11*escalaTextos)						
			.style("text-anchor","start")
			.attr("x",offSetLeft)
			.attr("y",altura-offSetTop+24)
			.text(function(){

				return "Muestra del "+dateInit.getDate()+" "+getMes(dateInit.getMonth())+" al "+dateEnd.getDate()+" "+getMes(dateInit.getMonth())+" "+String(dateInit.getFullYear());

			})
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );

                

                
                // AZUL **********
                
                var ancho2 = GetValorRangos( vol1_ref ,1, totalCanSol_ref , 1,ancho);
                svgLines														
			.append("rect")
			.attr("fill","#00A8FF")			
			.attr("filter","url(#glow)")
                        .attr("class","encabezado")			
			.style("opacity",1 )
                        .attr("rx",6)
			.attr("width",1 )
			.attr("height",(altura*.48)-offSetTop )
			.attr("x",offSetLeft+3)
			.attr("y",offSetTop+3)
                        .transition().delay(0).duration(1000)
                        .style("width",ancho2-3 )
			;

                svgLines.append("text")							
			.style("fill","#FFFFFF")		
                        .attr("class","encabezado")					
			.style("opacity",0)
			.style("font-family","Cabin")
			.style("font-weight","bold")
			.style("font-size",15*escalaTextos)						
			.style("text-anchor","middle")
			.attr("x",offSetLeft+ancho2-(ancho2/2))
			.attr("y",29)
			.text(function(){

				return por1_ref +"%";

			})
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );
                
                // AMARILLO

                var ancho3 = GetValorRangos( vol2_ref ,1, totalCanSol_ref , 1,ancho);
                svgLines														
                        .append("rect")
                        .attr("fill","#FCFF00")                        
                        .attr("filter","url(#glow)")
                        .attr("class","encabezado")                       
                        .style("opacity",1 )
                        .attr("rx",6)
                        .attr("width",1 )
                        .attr("height",(altura*.48)-offSetTop )
                        .attr("x",offSetLeft+ancho2+3 )
                        .attr("y",offSetTop+3)
                        .transition().delay(1000).duration(1000)
                        .attr("width",ancho3-3 )
                        ;

                svgLines.append("text")							
			.style("fill","#6C0000")		
                        .attr("class","encabezado")					
			.style("opacity",0)
			.style("font-family","Cabin")
			.style("font-weight","bold")
			.style("font-size",14*escalaTextos)						
			.style("text-anchor","middle")
			.attr("x",offSetLeft+ancho2+ancho3-(ancho3/2))
			.attr("y",29)
			.text(function(){

				return por2_ref +"%";

			})
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );;

                // ROJO

                var ancho4 = GetValorRangos( vol3_ref ,1, totalCanSol_ref , 1,ancho);
                svgLines														
                        .append("rect")
                        .attr("fill","#FF0000")                        
                        .attr("filter","url(#glow)")
                        .attr("class","encabezado")                        
                        .style("opacity",1 )
                        .attr("rx",6)
                        .attr("width",1 )
                        .attr("height",(altura*.48)-offSetTop )
                        .attr("x",offSetLeft+ancho2+ancho3+3 )
                        .attr("y",offSetTop+3)
                        .transition().delay(2000).duration(1000)
                        .attr("width",ancho4-3 )
                        ;
                
                 svgLines.append("text")							
			.style("fill","#EAFF00")		
                        .attr("class","encabezado")					
			.style("opacity",0)
			.style("font-family","Cabin")
			.style("font-weight","bold")
			.style("font-size",15*escalaTextos)						
			.style("text-anchor","middle")
			.attr("x",offSetLeft+ancho2+ancho3+ancho4-(ancho4/2))
			.attr("y",29)
			.text(function(){

				return por3_ref +"%";

			})
                        .transition().delay(1000).duration(1000)
                        .style("opacity",1 );;

                // ENTREGADO **********

                svgLines				
                        .append("circle")
                        .attr("class","encabezado")
                        .attr("fill","#ffffff")
                        .attr("cx",offSetLeft+ancho2+ancho3+ancho4-5)
                        .attr("cy",offSetTop+10)                   
                        .attr("r",3);

                svgLines.append("line")
                        .style("stroke","#ffffff" )
                        .attr("class","encabezado ")
                        .style("stroke-width", 1 )
                        .style("stroke-opacity", 1 )
                        .attr("x1",offSetLeft+ancho2+ancho3+ancho4-5)
                        .attr("y1",offSetTop+9)
                        .attr("x2",offSetLeft+ancho2+ancho3+ancho4-5)
                        .attr("y2",offSetTop+9+50);

                svgLines.append("text")							
			//.attr("x",20 )
			//.attr("y", (alturaPorPeriodo*i)+margenSuperior+30  )
			.style("fill","white")		
                        .attr("class","encabezado")					
			.style("opacity",0)
			.style("font-family","Cabin")
			.style("font-weight","normal")
			.style("font-size",13*escalaTextos)						
			.style("text-anchor","start")
			.attr("x",offSetLeft+ancho2+ancho3+ancho4-7)
			.attr("y", offSetTop+9+63 )
			.text(function(){

				return "-  Entregado: "+Math.round((totalCanEnt_ref/totalCanSol_ref)*100)+"% ";

			})
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );

                svgLines.append("text")							
			//.attr("x",20 )
			//.attr("y", (alturaPorPeriodo*i)+margenSuperior+30  )
			.style("fill","white")		
                        .attr("class","encabezado")					
			.style("opacity",0)
			.style("font-family","Cabin")
			.style("font-weight","normal")
			.style("font-size",9*escalaTextos)						
			.style("text-anchor","start")
			.attr("x",offSetLeft+ancho2+ancho3+ancho4+97)
			.attr("y", offSetTop+9+63 )
			.text(function(){

				return "("+formatNumber(Math.round(totalCanEnt_ref/1000) )+") k Ton ";

			})
                        .transition().delay(0).duration(1000)
                        .style("opacity",1 );

                svgLines.append("text")							
			.style("fill","white")		
                        .attr("class","encabezado")					
			.style("opacity",0)
			.style("font-family","Cabin")
			.style("font-weight","normal")
			.style("font-size",13*escalaTextos)						
			.style("text-anchor","end")
			.attr("x",offSetLeft+ancho2+ancho3+ancho4-9)
			.attr("y", offSetTop+9+63)
			.text(function(){

				return "Solicitado: "+formatNumber(Math.round(totalCanSol_ref/1000) )+" k Ton";

			}).transition().delay(0).duration(1000)
                        .style("opacity",1 );

    }


    kpiExpert_FR.DrawFilteredHeader=function(){

        svgLines.selectAll(".encabezadoFiltered").data([]).exit().remove();

        if( (store[store.mainDataset].length==store.dataToDraw.length) )
        return;

        var altura=kpiExpert_FR.altura;

        //Datos
        totalCanEnt_filtered=0;
        totalCanSol_filtered=0;

        vol1_filtered=0;
        vol2_filtered=0;
        vol3_filtered=0;

        por1_filtered=0;
        por2_filtered=0;
        por3_filtered=0;


        for(var k=0;  k < store.dataToDraw.length; k++){      
                
                totalCanSol_filtered+=Number(store.dataToDraw[k][campoTotalSolicitado]);
                
                totalCanEnt_filtered+=Number(store.dataToDraw[k][campoDeVolumenFR]);
                
                if(store.dataToDraw[k][campoDeATiempo] == "A Tiempo"){
                        vol1_filtered+=Number(store.dataToDraw[k][campoDeVolumenFR]);
                }else if(store.dataToDraw[k][campoDeATiempo] == "1 a 2 días Tarde"){
                        vol2_filtered+=Number(store.dataToDraw[k][campoDeVolumenFR]);
                }else if(store.dataToDraw[k][campoDeATiempo] == "3 o más días Tarde"){
                        vol3_filtered+=Number(store.dataToDraw[k][campoDeVolumenFR]);
                }                 
        }
        

        por1_filtered=Math.round((vol1_filtered/totalCanSol_filtered)*100);
        por2_filtered=Math.round((vol2_filtered/totalCanSol_filtered)*100);
        por3_filtered=Math.round((vol3_filtered/totalCanSol_filtered)*100);          

        // AZUL **********
        
        var ancho2 = GetValorRangos( vol1_filtered ,1, totalCanSol_ref , 1,kpiExpert_FR.ancho);
        
        svgLines														
                .append("rect")
                .attr("fill","#00A8FF")			
                .attr("filter","url(#glow)")
                .attr("class","encabezadoFiltered")			
                .style("opacity",1 )
                .attr("rx",4)
                .attr("width",1 )
                .attr("height",(altura*.4)-kpiExpert_FR.offSetTop )
                .attr("x",kpiExpert_FR.offSetLeft+3)
                .attr("y",kpiExpert_FR.offSetTop+5+(altura*.4))
                .transition().delay(0).duration(1000)
                .style("width",ancho2-3 )
                ;

                
        
        // AMARILLO

        var ancho3 = GetValorRangos( vol2_filtered ,1, totalCanSol_ref , 1,kpiExpert_FR.ancho);
        svgLines														
                .append("rect")
                .attr("fill","#FCFF00")                        
                .attr("filter","url(#glow)")
                .attr("class","encabezadoFiltered")                       
                .style("opacity",1 )
                .attr("rx",4)
                .attr("width",1 )
                .attr("height",(altura*.4)-kpiExpert_FR.offSetTop )
                .attr("x",kpiExpert_FR.offSetLeft+ancho2+3 )
                .attr("y",kpiExpert_FR.offSetTop+5+(altura*.4))
                .transition().delay(1000).duration(1000)
                .attr("width",ancho3-3 )
                ;

       

        // ROJO

        var ancho4 = GetValorRangos( vol3_filtered ,1, totalCanSol_ref , 1,kpiExpert_FR.ancho);
        svgLines														
                .append("rect")
                .attr("fill","#FF0000")                        
                .attr("filter","url(#glow)")
                .attr("class","encabezadoFiltered")                        
                .style("opacity",1 )
                .attr("rx",4)
                .attr("width",1 )
                .attr("height",(altura*.4)-kpiExpert_FR.offSetTop )
                .attr("x",kpiExpert_FR.offSetLeft+ancho2+ancho3+3 )
                .attr("y",kpiExpert_FR.offSetTop+5+(altura*.4))
                .transition().delay(2000).duration(1000)
                .attr("width",ancho4-3 )
                ;
        

        // ENTREGADO **********
       
        svgLines.append("text")							
                //.attr("x",20 )
                //.attr("y", (alturaPorPeriodo*i)+margenSuperior+30  )
                .style("fill","white")		
                .attr("class","encabezadoFiltered")					
                .style("opacity",0)
                .style("font-family","Cabin")
                .style("font-weight","normal")
                .style("font-size",13*escalaTextos)						
                .style("text-anchor","start")
                .attr("x", offSetLeft+ancho2+ancho3+ancho4+10)
                .attr("y", kpiExpert_FR.offSetTop+11+(altura*.5))  
                .text(function(){
                        
                        return "Solicitado: "+formatNumber(Math.round(totalCanSol_filtered/1000) )+" k Ton - Entregado: "+formatNumber(Math.round(totalCanEnt_filtered/1000) )+" k Ton ("+ Math.round((totalCanEnt_filtered/totalCanSol_filtered)*100) +"%)";

                })
                .transition().delay(0).duration(1000)
                .style("opacity",1 );

        
        // TEXTO AZUL

        svgLines.append("text")							
                .style("fill","#00A8FF")		
                .attr("class","encabezadoFiltered")					
                .style("opacity",0)
                .style("font-family","Cabin")
                .style("font-weight","normal")
                .style("font-size",13*escalaTextos)						
                .style("text-anchor","start")
                .attr("x", offSetLeft+ancho2+ancho3+ancho4+(24*(escalaTextos*13) ) )
                .attr("y", kpiExpert_FR.offSetTop+11+(altura*.5))  
                .text(function(){
                        
                        return por1_filtered+"%";

                })
                .transition().delay(0).duration(1000)
                .style("opacity",1 );

         // TEXTO AMARILLO

         svgLines.append("text")							
                .style("fill","#FCFF00")		
                .attr("class","encabezadoFiltered")					
                .style("opacity",0)
                .style("font-family","Cabin")
                .style("font-weight","normal")
                .style("font-size",13*escalaTextos)						
                .style("text-anchor","start")
                .attr("x", offSetLeft+ancho2+ancho3+ancho4+(27*(escalaTextos*13) ))
                .attr("y", kpiExpert_FR.offSetTop+11+(altura*.5))  
                .text(function(){
                        
                        return por2_filtered+"%";

                })
                .transition().delay(0).duration(1000)
                .style("opacity",1 );

          // TEXTO ROJO

        svgLines.append("text")							
                .style("fill","#FF0000")		
                .attr("class","encabezadoFiltered")					
                .style("opacity",0)
                .style("font-family","Cabin")
                .style("font-weight","normal")
                .style("font-size",13*escalaTextos)						
                .style("text-anchor","start")
                .attr("x", offSetLeft+ancho2+ancho3+ancho4+(30*(escalaTextos*13) ))
                .attr("y", kpiExpert_FR.offSetTop+11+(altura*.5))  
                .text(function(){
                        
                        return por3_filtered+"%";

                })
                .transition().delay(0).duration(1000)
                .style("opacity",1 );
                

}