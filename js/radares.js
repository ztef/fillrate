var alturaRadar2D=100;

function Init(){

    /*
    <div  id="barsContainer2"  style="width:100%;height:90%;position:fixed;top:82px;left:20px;z-index:99999;pointer-events:auto;    overflow-y: scroll;">

    <svg id="svgLinesTouchLeft"  height="4000px" width="100%" style="position:absolute;top:0;left:0px;z-index:9001;pointer-events: none;"></svg>

</div>
*/

        $("#barsContainer2").css("width", alturaRadar2D+"px" );

		svgLinesTouch = d3.select("#svgLinesTouchLeft")            
							.append("svg")                
							.attr("width", alturaRadar2D+"px" )
							.style("pointer-events","auto")
							.attr("height", 4000 );

}