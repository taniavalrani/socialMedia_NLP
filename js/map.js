/*
* Map
*/

Map = function(_base_svg, _data){
    let x = 420, y = 10;
    this.width = 440;
    this.height = 500;
    
    this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    this.data = _data;
    this.initVis();
}

Map.prototype.initVis = function () {
    this.svg = this.base_svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0)
        .style("stroke", "green")
        .style("stroke-width", "1")
        .style("fill-opacity", "0");
}

