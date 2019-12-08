/*
 * Timeline 
 */

Timeline = function(_base_svg, _data){
    this.base_svg = _base_svg;
    this.data = _data;
    this.initVis();
}

Timeline.prototype.initVis = function () {

    let width = 850;
        height = 90;

    let svg_margin = 10;

    let x = 10;
    let y = 520;

    let outer_svg = this.base_svg.append("svg") // is extra svg redudnant?? TODO
        .attr("width", width)
        .attr("height", height)
        .attr("x", x)
        .attr("y", y);
    
    outer_svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0)
        .style("stroke", "black")
        .style("stroke-width", ".5") 
        .style("fill", "yellow");


    this.svg = outer_svg.append("g")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

    // Scales and axes
    this.x = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(this.data, function(d) { return d.time; }));

    this.y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(this.data, function(d) { return d.num_msgs; })]);

    this.xAxis = d3.axisBottom()
        .scale(this.x);

    // SVG area path generator
    this.area = d3.area()
        .x(function(d) { return this.x(d.time); })
        .y0(height)
        .y1(function(d) { return this.y(d.num_msgs); });

    // Draw area by using the path generator
    // this.svg.append("path")
    //     .datum(this.data)
    //     .attr("fill", "#ccc")
    //     .attr("d", this.area);

    this.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + height + ")")
        .call(this.xAxis);
}

Timeline.prototype.onBrush = function (brushed) {
    this.brush = d3.brushX()
        .extent([[0,0], [width,height]])
        .on("brush", brushed);

    this.svg.append("g")
        .attr("class", "brush")
        .call(this.brush)
}

