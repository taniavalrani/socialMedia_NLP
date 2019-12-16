/*
* Feed
*/

const BASE_LAST_LINE_Y = 40;

Feed = function(_base_svg, _data){
    let x = 870, y = 10;
    this.width = 300;
    this.height = 600;

    this.margin = 10;
    this.margintop = 50;
    this.MAX_MESSAGES_LOADED = 500;
    
    this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    this.data = _data;
    
    this.day = "mon"
    this.desplayData = this.data[this.day];

    this.activeCityFilter = null;
    this.activeCategoryFilter = null;

    this.initVis();
}

Feed.prototype.initVis = function () {
    this.rect = this.base_svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0)
        .style("stroke", "purple")
        .style("stroke-width", "1")
        .style("fill-opacity", "0");
    


    let days = ["mon", "tue", "wed", "thurs", "fri"];
    let butdata = [{x: 10, w: 50}, {x: 60, w: 50}, {x: 110, w: 50}, {x: 160, w: 50}, {x: 210, w: 50}];
    let unclicked_color = "#888ec4", clicked_color = "rgb(20, 33, 143)";

    this.daybuttons = this.base_svg.selectAll("g")
        .data(butdata)
        .enter()
        .append("g")
        .attr("transform", "translate(" + this.margin + "," + 10 + ")");
        
    this.dayRects = this.daybuttons.append("rect")
        .attr("height", this.margintop - 20)
        .attr("width", (d, i) => butdata[i].w)
        .attr("x", (d, i) => butdata[i].x)
        .attr("y", 0)
        .style("fill", (d, i) => days[i] == this.day? clicked_color: unclicked_color)
        .style("stroke", "black")
        .style("stroke-width", "1")

    this.daybuttons.append("text")
        .attr("height", this.margintop)
        .attr("width", (d, i) => butdata[i].w)
        .attr("x", (d, i) => butdata[i].x + 25)
        .attr("y", 20)
        .text((d, i) => days[i])
        .style("fill", "white")
        .style("font-size", "12px")
        .style("text-anchor", "middle");

    this.clickable = this.daybuttons.append("rect")
        .attr("height", this.margintop - 20)
        .attr("width", (d, i) => butdata[i].w)
        .attr("x", (d, i) => butdata[i].x)
        .attr("y", 0)
        .style("fill-opacity", "0")
        .on("click", (d, i) => {
            this.day = days[i];
            this.dayRects
                .style("fill", (d, i) => days[i] == this.day? clicked_color: unclicked_color);
            this.updateDayOfWeek();
        })
  

    this.svg = this.base_svg.append("svg")
        .attr("x", 10)
        .attr("y", this.margintop)
        .attr("width", this.width - 2*this.margin)
        .attr("height", this.height - 2*this.margin)

    this.divbox = this.svg.append("foreignObject")
        .attr("class", "node")
        .attr("width", this.width - 2*this.margin)
        .attr("height", this.height - this.margin - this.margintop)
        .style("fill", "blue")

    this.scrollbox = this.divbox.append("xhtml:div")
        .style("height", this.height + "px")
        .style("width", this.width - (2*this.margin-2) + "px")
        .style("overflow", "auto")
        .style("background", "#EEEEEF")
        .style("top",0 + "px")
        .style("left",0 + "px")
        .text("YInt Feed (posts containing keywords)")

    this.mastergroup = this.scrollbox.append("g");

    this.displayMessages = () => {
        this.innersvg = this.mastergroup.append("svg")
            .attr("id", "innersvg")
            .attr("width", this.width - (2*this.margin+20))
            .attr("height", 1000)
            .attr("x", 10)
            .attr("y", 10)

        this.feedgroups = this.innersvg.selectAll("g")
            .data(() => this.desplayData) 
            .enter()
            .append("g");

        // messages
        this.messages = this.feedgroups
            .append("text")
            .text(d => {return d.message})
            .attr('x', 5)
            .attr('y', 0)
            .call(wrap, (this.width - (2*this.margin+20)))
            .call(() => this.innersvg.attr("height", last_line_y))

        // account names and time
        this.message_info = this.feedgroups
            .append("text")
            .text(d => {
                return d.account + " –– " + d3.timeFormat("%A %m/%d %I:%M %p")(d.time);
            })
            .attr('x', 5)
            .attr('y', (d, i) => all_y_split[i])
            .style("fill", "#000000")
            .style("font-size", "10px");      

        this.innersvg.attr("height", last_line_y);
       
    }

    this.displayMessages()

}

Feed.prototype.applyCategoryFilter = function (category) {
    this.activeCategoryFilter = category;
    this.applyFilter(this.activeCityFilter);
}

Feed.prototype.applyFilter = function (city) {    
    if (city) {
        this.activeCityFilter = city
        this.desplayData = this.data[this.day].filter(d => {
            return d.location == city && (!this.activeCategoryFilter || d.categories.has(this.activeCategoryFilter));
        });
    } else {
        this.activeCityFilter = null
        this.desplayData = this.data[this.day];

        if (this.activeCategoryFilter) {
            this.desplayData = this.desplayData.filter(d => {
                return d.categories.has(this.activeCategoryFilter)
            })
        }
    }

    this.update();
}

Feed.prototype.update = function () {
    this.mastergroup.html("");

    last_line_y = BASE_LAST_LINE_Y;
    all_y_split = [last_line_y];

    this.displayMessages();
}

Feed.prototype.updateDayOfWeek = function() {
    this.applyFilter(this.activeCityFilter);
}


var last_line_y = BASE_LAST_LINE_Y
var all_y_split = [last_line_y];

// https://jsfiddle.net/goldrydigital/qgc2g51x/
function wrap(text, width) {
    text.each(function() {
        let text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = last_line_y//text.attr("y"),
        dy = 1.1,
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }

        last_line_y += (lineNumber+1) * 20 + 30;
        all_y_split.push(last_line_y);

    });
}
