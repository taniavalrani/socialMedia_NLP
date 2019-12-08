/*
* Popular
*/

Popular = function(_base_svg, _data){
    this.base_svg = _base_svg;
    this.data = _data;
    this.initVis();
}

Popular.prototype.initVis = function () {
    let x = 10, y = 260

    let width = 400
        height = 250

    this.svg = this.base_svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", x)
        .attr("y", y)
        .style("stroke", "black")
        .style("stroke-width", ".5")
        .style("fill", "red");
}

