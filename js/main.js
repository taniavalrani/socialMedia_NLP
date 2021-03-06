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

const filename_prefix = (location.hostname != "localhost"? "/socialMedia_NLP": "");

const avg_senti_filename = filename_prefix + "/data/avg_senti.csv";
const ranked_retweets_filename = filename_prefix + "/data/YIntRetweetsWithTime.csv";
const yIntFiltered_filename = filename_prefix + "/data/YIntFiltered.csv";

// Note: When importing a csv, add a function within this chain, add a parameter to the execute function, and add the csv object when calling execute
d3.csv(avg_senti_filename, function(error1, avg_senti_csv) {
    
    avg_senti_csv.forEach(d => { // Format data
        d.min = parseFloat(d.min);
        d.max = parseFloat(d.max);
        d.score = parseFloat(d.score);
        d.time = d3.timeParse("%Y-%m-%d %H:%M:%S")(d.time);
        d.number_of_tweets = parseInt(d.number_of_tweets);
    });

    d3.csv(ranked_retweets_filename, function(error2, YIntRetweets) {
        
        YIntRetweets.forEach(d => {
            d.re_count = +d.re_count;
            d.time = d3.timeParse("%Y-%m-%d %H:%M:%S")(d.time);
        })

        d3.csv(yIntFiltered_filename, function(error3, YIntFiltered) {
            let tparse = d3.timeParse("%Y-%m-%d")
            let dates = [tparse("2020-04-06"), tparse("2020-04-07"), tparse("2020-04-08"), tparse("2020-04-09"), tparse("2020-04-10")];
            let days = ["mon", "tue", "wed", "thurs", "fri"]
            let YIntFilteredByDay = {mon: [], tue: [], wed: [], thurs: [], fri: []};
            
            let cur_day = 0
            YIntFiltered.forEach(d => {
                d.time = d3.timeParse("%Y-%m-%d %H:%M:%S")(d.time);
                d.categories = new Set(d.categories.split(","));

                if (cur_day < 4 && d.time >= dates[cur_day + 1]) {
                    cur_day++;
                }
                YIntFilteredByDay[days[cur_day]].push(d);
            })

            console.log(YIntFilteredByDay);

            execute(avg_senti_csv, YIntRetweets, YIntFilteredByDay);
        });
    });
});


var dummy_data = [{time: 0, num_msgs: 1}, {time: 1, num_msgs: 5}, {time: 2, num_msgs: 7}, {time: 3, num_msgs: 3}, {time: 4, num_msgs: 2}];

function execute(avg_senti_csv, YIntRetweets, YIntFiltered) {

    let timeline = new Timeline(group, avg_senti_csv);
    let popular = new Popular(group, YIntRetweets);
    let sentiment = new Sentiment(group, avg_senti_csv);
    let feed = new Feed(group, YIntFiltered);
    let map = new  Map(group, dummy_data, (city) => {feed.applyFilter(city)}, (category) => feed.applyCategoryFilter(category));


    timeline.onBrush(() => {
        sentiment.update(timeline.xScale.invert)
        popular.update(timeline.xScale.invert);
        // feed.update(timeline.xScale.invert)
    });
    timeline.onClear(() => {
        sentiment.update(null)
        popular.update(null)
        // feed.update(null);
    });

}