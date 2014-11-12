define(['dom', 'color'], function(dom, color) {
    function angleToCoords(r, angle) {
        return {
            x: r * Math.sin(angle),
            y: -r * Math.cos(angle)
        }
    }

    function arcPath(outerR, innerR, start, stop) {
        var startCoords = angleToCoords(outerR, start),
            stopCoords = angleToCoords(outerR, stop),
            c1 = angleToCoords(innerR, start),
            c2 = angleToCoords(innerR, stop);
        return "M" + startCoords.x + "," + startCoords.y +
            " C" + c1.x + "," + c1.y + " " + c2.x + "," + c2.y + " " + stopCoords.x + "," + stopCoords.y;
    }

    function drawCircle(x, y, radius) {
        var arc = d3.svg.arc()
            .innerRadius(radius)
            .outerRadius(radius);

        for (var i = 0; i < 360; i++) {
            dom.results
                .append("path")
                .classed("palette", true)
                .attr("d", arc.startAngle(i / 180 * Math.PI).endAngle((i + 2) / 180 * Math.PI))
                .attr("stroke", color.getDefaultColor(i + 0.5))
                .attr("transform", "translate(200,200)");
        }
    }

    return function(data) {
        var radius = 180;

        drawCircle(200, 200, radius);

        var opacity = 1;// / data.length;

        for (var i = 0; i < data.length; i++) {
            var hue = data[i].hue,
                answers = data[i].answers;
            dom.results
                .selectAll("path." + hue.name)
                    .data(answers)
                .enter().append("path")
                    .classed("colorArc " + hue.name, true)
                    .attr('stroke', color.getDefaultColor(hue.value, opacity))
                    .attr("d", function(d) {
                        return arcPath(radius, radius / 2, d.left * Math.PI / radius, d.right * Math.PI / radius)
                    })
                    .attr("transform", "translate(200,200)");
            console.log("color: " + hue.name + ", count: " + answers.length + "<br/>");
        }
    }
});