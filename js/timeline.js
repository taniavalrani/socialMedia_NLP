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


    this.makeTooltipText = (total_tweets) => (total_tweets? total_tweets: "All") + " tweets selected";
    
    this.tooltip = this.base_svg.append("text")
        .style("text-anchor", "middle")
        .text(this.makeTooltipText(null))
        .attr("x", this.graph_width / 2 + 30)
        .attr("y", 15)
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        // .style("fill", "#7a0099")
        .style("font-size", "12px")

    this.easyTimeFormat = d3.timeFormat("%A %I:%M %p")

    this.leftdate = this.base_svg.append("text")
        .style("text-anchor", "middle")
        .text("")
        .attr("y", 30)
        .style("text-anchor", "right")
        .style("font-size", "10px")

    this.rightdate = this.base_svg.append("text")
        .style("text-anchor", "left")
        .text("")
        .attr("y", 30)
        .style("font-size", "10px")
}

Timeline.prototype.handleToolTip = function () {
    let selection = d3.event.selection;
    if (selection) {
        let coord_to_time =  this.xScale.invert;
        let left = coord_to_time(selection[0]), right = coord_to_time(selection[1]);

        let sum = 0;
        this.data.some(d => {
            if (d.time > right)
                return true;
            if (d.time >= left)
                sum += d.number_of_tweets;
        });
        this.tooltip.text(this.makeTooltipText(sum));

        this.leftdate.text(this.easyTimeFormat(left))
            .attr("x", selection[0]-5);

        this.rightdate.text(this.easyTimeFormat(right))
            .attr("x", selection[1]+43);
    } else {
        this.tooltip.text(this.makeTooltipText(null));
        this.leftdate.text("");
        this.rightdate.text("");
    }
}

Timeline.prototype.onBrush = function (brushed) {
    this.brush = d3.brushX()
        .extent([[0,0], [this.graph_width, this.graph_height]])
        .on("brush", () => {brushed(); this.handleToolTip()});

    this.brushGroup = this.svg.append("g")
        .attr("class", "brush")
        .call(this.brush)
}

Timeline.prototype.onClear = function (cleared) {
    this.svg.on("click", () => {
        this.brushGroup.call(this.brush.move, null);
        this.tooltip.text(this.makeTooltipText(null));
        this.leftdate.text("");
        this.rightdate.text("");
        cleared();
    });
}