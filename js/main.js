// Daniel Cetlin (dcetli01)

var margin = {top: 20, right: 10, bottom: 10, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

var y = d3.scaleLinear()
        .range([height, 0]);
	
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var group = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

group.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0)
    .style("stroke", "black")
    .style("stroke-width", ".5")
    .style("fill", "white");

dummy_data = [{time: 0, num_msgs: 1}, {time: 1, num_msgs: 5}, {time: 2, num_msgs: 7}, {time: 3, num_msgs: 3}, {time: 4, num_msgs: 2}]

let timeline = new Timeline(group, dummy_data);
let popular = new Popular(group, dummy_data);
let sentiment = new Sentiment(group, dummy_data);
let map = new  Map(group, dummy_data);
let feed = new Feed(group, dummy_data);




timeline.onBrush(() => {});
