/*
* Sentiment Graph
*/

Sentiment = function(_base_svg, _data){
    this.base_svg = _base_svg;
    this.data = _data;
    this.initVis();
}

Sentiment.prototype.initVis = function () {
    let x = 10, y = 10

    let width = 400
        height = 240

    this.svg = this.base_svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", x)
        .attr("y", y)
        .style("stroke", "black")
        .style("stroke-width", ".5")
        .style("fill", "blue");
}