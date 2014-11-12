define(['dom', 'color'], function(dom, color) {
    function angleToCoords(x, y, r, angle) {
        return {
            x: x + r * Math.sin(angle),
            y: y - r * Math.cos(angle)
        }
    }

    function arcPath(x, y, r, start, stop) {
        var startCoords = angleToCoords(x, y, r, start);
        var stopCoords = angleToCoords(x, y, r, stop);
        return "M" + x + "," + y + " A" + startCoords.x + "," + startCoords.y + " 0 0,1 " +
            stopCoords.x + "," + stopCoords.y;
    }

    return function(data) {
        var arc = d3.svg.arc()
            .innerRadius(180)
            .outerRadius(180)
            .startAngle(function(d) { return ((d.left <= d.right) ? d.left : (d.left - 360)) * Math.PI / 180; })
            .endAngle(function(d) { return d.right * Math.PI / 180; });

        for (var i = 0; i < data.length; i++) {
            var hue = data[i].hue,
                answers = data[i].answers;
            dom.results
                .selectAll("path." + hue.name)
                    .data(answers)
                .enter().append("path")
                    .classed("colorArc " + hue.name, true)
                    .style('stroke', color.getDefaultColor(hue.value, 0.1))
                    .attr("d", arc)
                    .attr("transform", "translate(200,200)");
            console.log("color: " + hue.name + ", count: " + answers.length + "<br/>");
        }
    }
});