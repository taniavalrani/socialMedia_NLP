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
    this.desplaydata = this.data;
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
        .range([this.height, 2* this.margin.y]);
    
    this.full_domain = [this.data[0].time, this.data[this.data.length-1].time]
    this.xScale = d3.scaleTime()
        .domain(this.full_domain)
        .range([0, this.width - 2*this.margin.x]);

    this.yAxis = d3.axisLeft(this.yScale)
        .ticks(10)
        .tickSize(3, 0, 0)

    this.xAxis = d3.axisBottom(this.xScale)
        .ticks(5)
        .tickFormat(d => d3.timeFormat("%m/%d")(d))

    this.svg.append("g")
        .attr("class", "y_axis")
        .call(this.yAxis);

    this.xAxisGroup = this.svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(this.xAxis)
        .selectAll("text")	
        .attr("dy", ".80em")

    this.linegraph = 
        this.svg.append("svg")
        .attr("id", "canvas")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this.width - 2*this.margin.x)
        .attr("height", this.height)
    
        .append("path")
        .attr("id", "linegraph")
        .datum(this.data)
        .attr("d", d3.line()
            .x(d => { return this.xScale(d.time); })
            .y(d => { return this.yScale(d.score); }))
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1)
}

Sentiment.prototype.update = function (coord_to_time) {
    var selection = d3.event.selection;
    if (coord_to_time && selection) {
        
        let left = selection[0], right = selection[1];
        let new_domain = [coord_to_time(left), coord_to_time(right)];
        this.xScale.domain(new_domain);
    } else {
        this.xScale.domain(this.full_domain);
    }

    this.xAxisGroup.call(d3.axisBottom(this.xScale));
    
    this.linegraph
        .transition()
        .duration(100)
        .attr("d", d3.line()
        .x(d => { return this.xScale(d.time); })
        .y(d => { return this.yScale(d.score); }));
        
        // .on("mouseover", d => {
        //     vis.tooltip.text(d.key)
        // })
        // .on("mouseout", d => {
        //     vis.tooltip.text("")
        // });

    // this.desplaydata 

}