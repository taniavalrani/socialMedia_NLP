/*
* Feed
*/

Feed = function(_base_svg, _data){
    let x = 870, y = 10;
    this.width = 300;
    this.height = 600;
    
    this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    this.data = _data;
    this.initVis();
}

Feed.prototype.initVis = function () {
    this.svg = this.base_svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0)
        .style("stroke", "black")
        .style("stroke-width", ".5")
        .style("fill", "purple");
}

