/*
* Feed
*/

Feed = function(_base_svg, _data){
    let x = 870, y = 10;
    this.width = 300;
    this.height = 600;

    this.margin = 10;
    this.MAX_MESSAGES_LOADED = 200;
    
    this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    this.data = _data;
    this.desplayData = this.data.slice(0,this.MAX_MESSAGES_LOADED); // how many messeges to display at once (This can get pretty taxing on load)
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
    
    this.svg = this.base_svg.append("svg")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", this.width - 2*this.margin)
        .attr("height", this.height - 2*this.margin)

    this.divbox = this.svg.append("foreignObject")
        .attr("class", "node")
        .attr("width", this.width - 2*this.margin)
        .attr("height", this.height - 2*this.margin)
        .style("fill", "blue")

    this.scrollbox = this.divbox.append("xhtml:div")
        .style("height", this.height + "px")
        .style("width", this.width - (2*this.margin-2) + "px")
        .style("overflow", "auto")
        .style("background", "#EEEEEF")
        .style("top",0 + "px")
        .style("left",0 + "px")
        .text("Feed: (Top 200 Posts)")

    this.innersvg = this.svg = this.scrollbox.append("svg")
        .attr("width", this.width - (2*this.margin+20))
        .attr("height", 1000)
        .attr("x", 10)
        .attr("y", 10)

    this.displayMessages = () => {

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
            .attr('y', (d, i) => all_y_splits[i])
            .style("fill", "#000000")
            .style("font-size", "10px");      
    }

    this.displayMessages()

}

Feed.prototype.update = function (coord_to_time) {

    var selection = d3.event.selection;

    if (coord_to_time && selection) {    
        let l_time = coord_to_time(selection[0]), r_time = coord_to_time(selection[1]);
        
        this.displayData = []
        
        count = 0
        this.data.some(d => { //essentially a foreach loop that can be broken out of if return true
            if (d.time >= l_time && d.time <= r_time) {
                this.desplayData.push(d);
                count++;
            }
            return count == this.MAX_MESSAGES_LOADED || d.time > r_time; //end some loop immediately
        });
    } else {
        this.desplayData = this.data.slice(0,this.MAX_MESSAGES_LOADED);
    }

    this.messages.remove();
    this.message_info.remove();
    this.feedgroups.remove();

    this.displayMessages();
}

var last_line_y = 40
var all_y_splits = [last_line_y];

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
        all_y_splits.push(last_line_y);

    });
}
