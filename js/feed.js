/*
* Feed
*/

Feed = function(_base_svg, _data){
    this.base_svg = _base_svg;
    this.data = _data;
    this.initVis();
}

Feed.prototype.initVis = function () {
    let x = 870, y = 10,
        width = 300, height = 600;

    this.svg = this.base_svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", x)
        .attr("y", y)
        .style("stroke", "black")
        .style("stroke-width", ".5")
        .style("fill", "purple");
}

