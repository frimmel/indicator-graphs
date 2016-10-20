var tip = d3.tip().attr('class', 'd3-tip').html(function (d) { return d; });

function drawBarChart () {
    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 70},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#A6CEE3", "#1F78B4", "#B2DF8A", "#33A02C", "#FFCC00"]);

    var stack = d3.stack();

    d3.csv("data/aggi_10_18_2016.csv", type, function(error, data) {
        if (error) throw error;

        x.domain([data[0].Year - .7, parseInt(data[data.length-2].Year, 10) + 2]);
        y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
        z.domain(data.columns.slice(1));

        g.selectAll(".serie")
            .data(stack.keys(data.columns.slice(1, data.columns.length - 1))(data))
            .enter().append("g")
                .attr("class", "serie")
                .attr("fill", function(d) { return z(d.key); })
            .selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Year); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", "20px")
                .on("mouseover", function (d) {
                    var datastring = "";
                    var bardata = d.data;

                    datastring += "Year: " + bardata.Year + "</br>";
                    if (bardata.AGGI) {
                        datastring += "AGGI: " + bardata["AGGI"] + "</br>";
                    }
                    datastring += "Other: " + bardata["Other halogenated gases"] + "</br>";
                    datastring += "CFC 11 and CFC 12: " + bardata["CFC 11 and CFC 12"] + "</br>";
                    datastring += "Nitrous oxide: " + bardata["Nitrous oxide"] + "</br>";
                    datastring += "Methane: " + bardata["Methane"] + "</br>";
                    datastring += "Carbon dioxide: " + bardata["Carbon dioxide"] + "</br>";
                    tip.show(datastring)
                })
                .on("mouseout", tip.hide);

        var xAxis = d3.axisBottom(x)
            .ticks(8)
            .tickFormat(function (d) { return d.toString(); });

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(8, "s"));


        g.append("text")
            .attr("class", "axis-label axis--y-label")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (-margin.left/2 - 16) +","+(height/2)+")rotate(-90)")
            .text("Radiative Forcing");
                    
        g.append("text")
            .attr("class", "axis-label axis--y-label axis-label-small")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (-margin.left/2) +","+(height/2)+")rotate(-90)")
            .text("[watts per square mile]");

        g.append("text")
            .attr("class", "graph-title")
            .attr("text-anchor", "middle")
            .attr("transform", "translate("+ (width/2) +",20)")
            .text("Annual Greenhouse Gas Index")
                    
        var legend = g.selectAll(".legend")
            .data(data.columns.slice(1, data.columns.length - 1).reverse())
            .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 10)  + ")"; })
                .style("font", "10px sans-serif");

        legend.append("rect")
            .attr("x", 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", z);

        legend.append("text")
            .attr("x", 45)
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .text(function(d) { return d; });
    });

    function type (d, i, columns) {
        var t;
        for (i = 1, t = 0; i < columns.length - 1; ++i) {
            t += d[columns[i]] = +d[columns[i]];
        }
        d.total = t;
        return d;
    }
}
