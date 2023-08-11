var elementosContextoMapa={};
var uns={};
elementosContextoMapa.DibujaUNs=function(){

    for( var e in store ){    

        if( e == "cat_un"){
           
            for(var i=0; i < store[e].length; i++){

                if(store[e][i].Lat){

                    uns[ store[e][i].ID ]=store[e][i];

                    var color="#F2FFA8";

                    if(store[e][i].Nombre.indexOf("Pta")> -1)
                        color="#52C8FF";

                        
                    uns[ store[e][i].ID ].labelSVG=svgLines.append("text")                            
                                    .attr("x",0 )
                                    .attr("y", 0   )
                                    .style("fill",color)
                                    .attr("class","lineTooltip")                                    
                                    .style("font-family","Cabin")
                                    .style("text-anchor","start")
                                    .style("font-weight","normal")
                                    .style("font-size",12)                                
                                    .text( function(d){
                                           
                                        return "";
                                        
                                    });
                    
                    var radio=2;
                    if(store[e][i].Nombre.indexOf("Pta")> -1)
                        radio=4;

                    uns[ store[e][i].ID ].circle=svgLines.append("circle")
                                    .attr("r",radio )
                                    .attr("class","lineTooltip")                      
                                    .attr("cx",0)
                                    .attr("cy", 0  )
                                    .attr("fill",function(d){
                                        this.data=uns[ store[e][i].ID ];
                                        return color;
                                    })
                                    .style("pointer-events","auto")
                                    .style("opacity",.5)
                                    .on("mouseover",function(d){
                                        this.data.labelSVG.text("U.N. "+this.data.Nombre);
                                    })
                                    .on("mouseout",function(d){
                                        this.data.labelSVG.text("");
                                    });

                    /*

                    if(store[e][i].Nombre.indexOf("Pta")> -1){

                                    var colorBase = Cesium.Color.fromCssColorString("#52C8FF");	

                                    var cilindroBase = viewer.entities.add({
                
                                            name : '',
                                            position: Cesium.Cartesian3.fromDegrees( store[e][i].Long , store[e][i].Lat , 500000/2 ),
                                                cylinder : {
                                                    length : 500000,
                                                    topRadius :  450,
                                                    bottomRadius : 450,
                                                    material : colorBase.withAlpha(.3)
                                                   
                                                   
                                                }
                                            });

                    }

                    */

                }

            }
            
        }

    }

    setInterval(function(){ elementosContextoMapa.DrawUNLabels(); }, 50);

}

elementosContextoMapa.DrawUNLabels=function(){

        svgLines.selectAll(".unMap").data([]).exit().remove();

        for(var e in uns){

            var  coords = [ uns[e].Long , uns[e].Lat  ];

            var newPoint = new Point (Number( coords[1] ),Number( coords[0] ));

            var nextPoint = new Point (Cesium.Math.toDegrees(viewer.camera.positionCartographic.latitude),Cesium.Math.toDegrees(viewer.camera.positionCartographic.longitude));

            var distance = newPoint.distanceTo(nextPoint);   
        
            if( distance < 8 ){   

                    var position = Cesium.Cartesian3.fromDegrees( Number(coords[0]) ,Number(coords[1]), 0 );

                    var coord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);                         
   
                    if(coord){
                    
                            if(coord.x > 400 && coord.x < $(document).width()-50 && coord.y > 40 && coord.y < ($(document).height())){

                                uns[e].labelSVG.attr("x",coord.x+7 )
                                                    .attr("y", coord.y+3  );

                                uns[e].circle.attr("cx",coord.x )
                                                    .attr("cy", coord.y  );

                            }else {        				

                                uns[e].labelSVG.attr("x",-10 )
                                                .attr("y", -10  );
                
                                uns[e].circle.attr("cx",-10 )
                                                .attr("cy", -10  );
                            }
                    }else {        				

                        uns[e].labelSVG.attr("x",-10 )
                                        .attr("y", -10  );
        
                        uns[e].circle.attr("cx",-10 )
                                        .attr("cy", -10  );
                    }

            }else {        				

                uns[e].labelSVG.attr("x",-10 )
                                .attr("y", -10  );

                uns[e].circle.attr("cx",-10 )
                                .attr("cy", -10  );
            }

        }
}

let point;

class Point {

    constructor(x,y){

        this.x = x;
        this.y = y;
        

        this.distanceTo = function (point)
        {
            var distance = Math.sqrt((Math.pow(point.x-this.x,2))+(Math.pow(point.y-this.y,2)))
            return distance;
        };

    }



}
