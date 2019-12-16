/*
* Popular
*/
// https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998
// https://www.d3-graph-gallery.com/graph/barplot_horizontal.html

// var data = (location.hostname != "localhost"? "/socialMedia_NLP": "") + "/../data/top10.json";

Popular = function(_base_svg, _data){
    let x = 10, y = 260;
    this.width = 400;
    this.height = 250;
    this.margin = {x:this.width/12, y:this.height/12}

    this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    this.data = _data;
    this.top10data = this.data.slice(0,10);
    this.initVis();
}

Popular.prototype.initVis = function () {
    this.box = this.base_svg.append("rect")
        .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0)
            .style("stroke", "#69b3a2")
            .style("stroke-width", "1")
            .style("fill-opacity", "0");
        
    this.svg = this.base_svg.append("g")
        .attr("transform",
        "translate(" + this.margin.x + "," + this.margin.y + ")");

    // Add X axis
    var margin = {top: 30, right: 30, bottom: 40, left: 90};
    var width = 400 - margin.left - margin.right;
    var height = 250 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    this.svg = this.base_svg
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    this.xRange = d3.scaleLinear()
        .domain([0, d3.max(this.top10data, d => d.re_count)])
        .range([ 0, width]);

    this.xAxis = this.svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(this.xRange));
        
    this.xAxis.selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


    this.yRange = d3.scaleBand()
        .range([ 0, height ])
        .domain(this.top10data.map(d => d.user))
        .padding(.01);

    this.yAxis = this.svg.append("g")
        .call(d3.axisLeft(this.yRange));
    
    this.yAxis.selectAll("text")
        .attr("font-size", "7px")

    //Bars

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");

    this.makeRect = (reset) => {
        this.rectsData = this.svg.selectAll("myRect")
            .data(this.top10data);
        
        if (reset) {
            this.rects.remove()
        }
        
        this.rects = this.rectsData
            .enter()
            .append("rect")
            .attr("id", "updatable")
            .attr("x", () => this.xRange(0))
            .attr("y", d => { return this.yRange(d.user); })
            .attr("width", d => { return this.xRange(d.re_count); })
            .attr("height", this.yRange.bandwidth() - 5)
            .attr("fill", "#69b3a2")
            .on("mousemove", function(d){
                tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html("<strong> "+ (d.user) + " - " + d3.timeFormat("%A %m/%d %I:%M %p")(d.time) + "</strong>" + "<br>" + (d.message));
            })
            .on("mouseout", function(d){ tooltip.style("display", "none");});

        this.textsData = this.svg.selectAll(".text")         
            .data(this.top10data);
        
        if (reset) {
            this.texts.remove();
        }

        this.texts = this.textsData
            .enter()
            .append("text")
            .attr("id", "updatable")
            .attr("class","label")
            .attr("x", d => {return this.xRange(d.re_count) - 25;})
            .attr("y",  d => { return this.yRange(d.user) + this.yRange.bandwidth() / 2;})
            .attr("dx", ".75em")
            .text(function(d) { return d.re_count; })
            .style("fill", "white");  
    }

    this.makeRect(null);

    // text label for the x axis
    this.svg.append("text")             
        .attr("transform",
            "translate(" + (width/2 - 25) + " ," + 
                    (height + 10 + 20) + ")")
        .style("text-anchor", "middle")
        .text("Number of retweets")
        .style("fill", "#7a0099")
        .style("font-size", "10px"); 

    this.svg.append("text")            
        .attr("transform",
            "translate(" + (width/2 - 20) + " ," + 
                    (0 - (margin.top / 2)) + ")")
        .style("text-anchor", "middle")
        .text("Top 10 tweets most retweeted tweets during earthquake period")
        .style("text-anchor", "middle")
        .style("fill", "#7a0099")
        .style("font-size", "12px")
        .style("font-weight", "bold"); 


    // text label for the y axis
    this.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Original poster")
        .style("fill", "#7a0099")
        .style("font-size", "10px");                 

    // this.svg = svg
}

Popular.prototype.update = function (coord_to_time) {
    var selection = d3.event.selection;

    if (coord_to_time && selection) {    
        let l_time = coord_to_time(selection[0]), r_time = coord_to_time(selection[1]);
        
        this.top10data = []
        
        let count = 0
        this.data.some(d => {
            if (d.time >= l_time && d.time <= r_time) {
                this.top10data.push(d);
                count++;
            }
            return count == 10;
        });
    } else {
        this.top10data = this.data.slice(0,10);
    }

    this.xRange.domain([0, d3.max(this.top10data, d => d.re_count)]);
    this.yRange.domain(this.top10data.map(d => d.user));

    this.xAxis.call(d3.axisBottom(this.xRange));
    this.yAxis.call(d3.axisLeft(this.yRange))
        .selectAll("text")
        .attr("font-size", "7px")

    this.makeRect(true);
}