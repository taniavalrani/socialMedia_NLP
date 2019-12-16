/*
* Map
*/

Map = function(_base_svg, _data, _mapFilter, _categoryFilter){
    let x = 420, y = 10;
    this.width = 440;
    this.height = 500;

    this.categories = ["", "damage", "water", "electricity", "chemical", "none", "people", "injuries", "earthquake", "transportation"];
    this.category = "none";

    this.mapFilter = _mapFilter;
    this.categoryFilter = _categoryFilter;

    this.base_svg = _base_svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
    this.data = _data;
    this.initVis();
}

Map.prototype.initVis = function () {
    var mapFilterFunction = this.mapFilter;
    var categoryFilterFunction = this.categoryFilter;

    this.box = this.base_svg.append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("x", 0)
        .attr("y", 0)
        .style("stroke", "green")
        .style("stroke-width", "1")
        .style("fill-opacity", "0")
        .on('click', clicked);

    this.svg = this.base_svg.append("svg")
    .attr("width", this.width)
    .attr("height", this.height)

    var width = this.width;
    var height = this.height;
    var centered;

    var color = d3v3.scale.linear()
        .domain([1, 20])
        .clamp(true)
        .range(['#fff', '#69a2a1']);

    var projection = d3v3.geo.mercatorRaw;

    var path = d3v3.geo.path()
        .projection(projection);


    var g = this.svg.append('g')
        .attr("width", this.width)
        .attr("height", this.height)

    var mapLayer = g.append('g')
        .attr("transform", "translate(15,-50)");

    // Load map data
    d3v3.json('../data/st_himark.json', function(error, mapData) {
        var features = mapData.features;

        console.log(features)

        // Draw each province as a path
        mapLayer.selectAll('path')
            .data(features)
        .enter().append('path')
            .attr('d', path)
            .attr('vector-effect', 'non-scaling-stroke')
            .style('fill', fillFn)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .on('click', clicked);

        mapLayer.selectAll("text")
        .data(features)
        .enter()
        .append("text")
        .attr('fill', 'black')
        .attr('stroke', 'black')
        .attr('vector-effect', 'non-scaling-stroke')
        .text(function(d){
            return d.properties.Nbrhood;
        })
        .attr("x", function(d){
            var loc = path.centroid(d)[0];
            if (d.properties.Nbrhood == "Southton") {loc -= 1.5}
            if (d.properties.Nbrhood == "Chapparal") {loc += 4.5}
            return loc
        })
        .attr("y", function(d){
            var loc = path.centroid(d)[1];
            if (d.properties.Nbrhood == "Southton") {loc -= 3.5}

            return loc;
        })
        .attr("text-anchor","middle")
        .attr("transform", function(d){
            if (d.properties.Nbrhood == "Wilson Forest") {return "translate(644,-124) rotate(90)"}
            else if (d.properties.Nbrhood == "Scenic Vista") {return "translate(-60,92) rotate(-15)"}
            else return "rotate(0)"
        })
        .attr('font-size','5pt');
    });


    this.filtergroup = g.append("g").attr("transform", "translate(" + 10 + "," + ((height - 10) - 120) + ")");
        

    var filter_region = this.filtergroup.append("rect")
        .attr("width", width - 20)
        .attr("height", 120)
        .attr("fill",  "#626262")
        .attr("opacity",  0.5)

    let bwidth = 80, binit = 0, bheight = 30;
    let butdata = [{x: 10, w: 50}, {x: 60, w: 50}, {x: 110, w: 50}, {x: 160, w: 50}, {x: 210, w: 50}];
    let unclicked_color = "#888ec4", clicked_color = "rgb(20, 33, 143)";

    this.buttons = this.filtergroup.selectAll("g")
        .data(this.categories)
        .enter()
        .append("g")
        .attr("transform", "translate(" + 10 + "," + 10 + ")");
        
    this.buttonRects = this.buttons.append("rect")
        .attr("height", bheight)
        .attr("width", (d, i) => bwidth)
        .attr("x", (d, i) => (i%5)*bwidth+binit)
        .attr("y", (d, i) => i <= 5? 0: bheight + 10)
        .style("fill", (d, i) => d == this.category? clicked_color: unclicked_color)
        .style("stroke", "black")
        .style("stroke-width", "1")

    this.buttons.append("text")
        .attr("height", bheight)
        .attr("width", (d, i) => bwidth)
        .attr("x", (d, i) => (i%5)*bwidth+binit + 36)
        .attr("y", (d, i) => i <= 5? 20: bheight + 30)
        .text(d => d)
        .style("fill", "white")
        .style("font-size", "12px")
        .style("text-anchor", "middle");

    this.buttonclickable = this.buttons.append("rect")
        .attr("height", bheight)
        .attr("width", (d, i) => bwidth)
        .attr("x", (d, i) => (i%5)*bwidth+binit)
        .attr("y", (d, i) => i <= 5? 0: bheight + 10)
        .style("fill-opacity", "0")
        .on("click", (d, i) => {
            this.category = this.categories[i];
            this.buttonRects
                .style("fill", (d, i) => d == this.category? clicked_color: unclicked_color);
            
            categoryFilterFunction(d == "none"? null: d);
        })
      

    function nameFn(d){
        return d && d.properties ? d.properties.Nbrhood : null;
    }

    function nameLength(d){
        var n = nameFn(d);
        var ret = n ? n.length : 0;
        if (ret > 14)
        return 14
        else
        return ret
    }

    function fillFn(d){
        return color(nameLength(d));
    }

    function mouseover(d){
        // Highlight hovered province
        d3.select(this).style('fill', '#91c29e');
    }

    function mouseout(d){
        // Reset province color
        mapLayer.selectAll('path')
        .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
    }

    function clicked(d) {
        var x, y, k;

        // Compute centroid of the selected path
        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 2;
            centered = d;
            y += 10

            mapFilterFunction(d.properties.Nbrhood);
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
            x -= 15
            y += 50

            mapFilterFunction(null)
        } 

        // Highlight the clicked province
        mapLayer.selectAll('path')
        .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});

        // Zoom
        mapLayer.transition()
        .duration(750)
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
    }
}

