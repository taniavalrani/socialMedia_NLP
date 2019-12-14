/*
* Sentiment Graph
*/

Sentiment = function(_base_svg, _data){
    let x = 10, y = 10;
    this.width = 400;
    this.height = 240;
    
    this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    this.data = _data;
    this.initVis();
}

Sentiment.prototype.initVis = function () {
    this.svg = this.base_svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0)
        .style("stroke", "blue")
        .style("stroke-width", "1")
        .style("fill-opacity", "0");
}