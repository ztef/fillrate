function WindowsContext(windows){

    svgLines2.selectAll(".windowsContext").data([]).exit().remove();

    for(var i=0; i < windows.length; i++){        

		svgLines2.append("rect")		    		
            .attr("width","300px" )
            .attr("class","windowsContext" )
            .attr("filter","url(#dropshadowRadar)")
            .style("pointer-events","auto")
            .attr("x",windowWidth*.45  )
            .attr("y", 100+(i*33)  )
            .attr("height",30)
            .attr("fill",function(d){
                this._method=windows[i].method;
                this.entity=windows[i].entity;;
                return "#6FA0AE";
            })
            .on("mouseover",function(d){
                d3.select(this).attr("fill","#8EB9C5");
            })
            .on("mouseout",function(d){
                d3.select(this).attr("fill","#6FA0AE");
            })
            .on("click",function(d){
                this._method(this.entity);
            })
            ;

        svgLines2
            .append("text")						
            
            .attr("class","windowsContext" )
            .style("fill","#ffffff")            		
            .style("font-family","Cabin")
            .style("font-weight","bold")
            .style("font-size",16)	
            .style("text-anchor","start")
            .attr("transform"," translate("+String( windowWidth*.45+25  )+","+String( 100+(i*33)+22   )+")  rotate("+(0)+") ")
            .text(function(){
            
                return  windows[i].titulo;

            });

    }
   

}