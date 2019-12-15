/*
* Sentiment Graph
*/

Sentiment = function(_base_svg, _data){
    let x = 10, y = 10;
    this.width = 400;
    this.height = 240;

    this.margin = {x:this.width/12, y:this.height/12}
    
    this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    this.data = _data;
    this.initVis();
}

Sentiment.prototype.initVis = function () {
    console.log(this.data);

    this.box = this.base_svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0)
        .style("stroke", "blue")
        .style("stroke-width", "1")
        .style("fill-opacity", "0");
    
    this.svg = this.base_svg.append("g")
        .attr("transform", "translate(" + this.margin.x + "," + -this.margin.y + ")");

    this.yScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([this.height, this.margin.y + 10]);
    
    this.xScale = d3.scaleTime()
        .domain([this.data[0].time, this.data[this.data.length-1].time])
        .range([0, this.width - this.margin.x - 10]);

    this.yAxis = d3.axisLeft(this.yScale)
        .ticks(10)
        .tickSize(3, 0, 0)

    this.xAxis = d3.axisBottom(this.xScale)
        .ticks(5)
        .tickFormat(d => d3.timeFormat("%m/%d")(d))

    this.svg.append("g")
        .attr("class", "y_axis")
        .call(this.yAxis);

    this.svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis)
        .selectAll("text")	
        .attr("dy", ".80em")

    this.svg.append("path")
        .attr("class", "line")
        .datum(this.data)
        .attr("d", d3.line()
            .x(d => { return this.xScale(d.time); })
            .y(d => { return this.yScale(d.score); }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1)
    
}

