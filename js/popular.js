/*
* Popular
*/
// https://bl.ocks.org/alandunning/7008d0332cc28a826b37b3cf6e7bd998
// https://www.d3-graph-gallery.com/graph/barplot_horizontal.html

var data = (location.hostname != "localhost"? "/socialMedia_NLP": "") + "/../data/top10.json";
Popular = function(_base_svg, _data){
        let x = 10, y = 260;
        this.width = 400;
        this.height = 250;
        // this.x = 10;
        // this.y = 260;
        this.margin = {x:this.width/12, y:this.height/12}

        this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
        this.data = _data;
        this.initVis();
    }
d3.json(data, function(data) {
    Popular.prototype.initVis = function () {
        // console.log(d3)
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
        console.log(margin)

        // append the svg object to the body of the page
        var svg = this.base_svg
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .domain([0, 80])
            .range([ 0, width]);

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");


        var arr = data.map(function(d) { return d.user ; } )

        var y = d3.scaleBand()
            .range([ 0, height ])
            .domain(arr)
            .padding(.01);

        var tooltip = svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("font-size", "8px")

          //Bars

        var tooltip = d3.select("body").append("div").attr("class", "toolTip");

        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", x(0) )
            .attr("y", function(d) { return y(d.user); })
            .attr("width", function(d) { return x(d.re_count); })
            .attr("height", y.bandwidth() - 5)
            .attr("fill", "#69b3a2")
            .on("mousemove", function(d){
                tooltip
                  .style("left", d3.event.pageX - 50 + "px")
                  .style("top", d3.event.pageY - 70 + "px")
                  .style("display", "inline-block")
                  .html("<strong> "+ (d.user) + "</strong>" + "<br>" + (d.message));
            })
            .on("mouseout", function(d){ tooltip.style("display", "none");});
            
        svg.selectAll(".text")         
          .data(data)
          .enter()
          .append("text")
          .attr("class","label")
          .attr("x", (function (d) {
                return x(d.re_count) - 25;}))
          .attr("y",  (function(d) { return y(d.user) + y.bandwidth() / 2 ; } ))
          .attr("dx", ".75em")
          .text(function(d) { return d.re_count; })
          .style("fill", "white");    

        // text label for the x axis
        svg.append("text")             
            .attr("transform",
                "translate(" + (width/2 - 25) + " ," + 
                           (height + 10 + 20) + ")")
            .style("text-anchor", "middle")
            .text("Number of retweets")
            .style("fill", "#7a0099")
            .style("font-size", "10px"); 

        svg.append("text")            
            .attr("transform",
                "translate(" + (width/2) + " ," + 
                           (0 - (margin.top / 2)) + ")")
            .style("text-anchor", "middle")
            .text("Top 10 tweets most retweeted tweets during earthquake period")
            .style("text-anchor", "middle")
            .style("fill", "#7a0099")
            .style("font-size", "12px")
            .style("font-weight", "bold"); 


  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Original poster")
      .style("fill", "#7a0099")
      .style("font-size", "10px");   

        // svg.append("y axis label") 
        // .attr("x", 265 )
        // .attr("y", 240 )
        // .style("text-anchor", "middle")
        // .text("Number of retweets");
              

        this.svg = svg
    }

})
