/*
 * Timeline 
 */

Timeline = function(_base_svg, _data){
    let x = 10, y = 520;
    this.width = 850;
    this.height = 90;

    this.margin = {x:40, y: 20};

    this.graph_height = this.height - 2*this.margin.y;
    this.graph_width = this.width - 2*this.margin.x;
    
    this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    this.data = _data;
    this.initVis();
}

Timeline.prototype.initVis = function () {
    
    this.base_svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0)
        .style("stroke", "black")
        .style("stroke-width", "1")
        .style("fill-opacity", "0");

    // Scales and axes
    this.svg = this.base_svg
        .append("g").attr("transform", "translate(" + this.margin.x + "," + this.margin.y + ")")
        .append("svg").attr("width", this.graph_width).attr("height", this.graph_height);

    this.yScale = d3.scaleLinear()
        .domain(d3.extent(this.data.map(d => d.number_of_tweets)))
        .range([this.graph_height, 0]);
    
    this.xScale = d3.scaleTime()
        .domain([this.data[0].time, this.data[this.data.length-1].time])
        .range([0, this.graph_width]);

    this.xAxis = d3.axisBottom(this.xScale)
        .ticks(5)
        .tickFormat(d => d3.timeFormat("%m/%d")(d))

    // SVG area path generator
    this.area = d3.area()
        .x((d) => this.xScale(d.time))
        .y0(50)
        .y1((d) => this.yScale(d.number_of_tweets));

    // Draw area by using the path generator
    this.svg.append("path")
        .datum(this.data)
        .attr("fill", "#ccc")
        .attr("d", this.area);

    this.base_svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(" + this.margin.x + "," + (this.height - this.margin.y) + ")")
        .call(this.xAxis);
}

Timeline.prototype.onBrush = function (brushed) {
    this.brush = d3.brushX()
        .extent([[0,0], [this.graph_width, this.graph_height]])
        .on("brush", brushed);

    this.brushGroup = this.svg.append("g")
        .attr("class", "brush")
        .call(this.brush)
}

Timeline.prototype.onClear = function (cleared) {
    this.svg.on("click", () => {this.brushGroup.call(this.brush.move, null); cleared();});
}