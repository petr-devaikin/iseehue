define(['dom', 'color', 'settings', 'lib/d3'], function(dom, color, settings, d3) {
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

    function drawCircle(radius) {
        var arc = d3.svg.arc()
            .innerRadius(radius)
            .outerRadius(radius);

        for (var i = 0; i < 360; i++) {
            dom.svg.palette
                .append("path")
                .attr("d", arc.startAngle(i / 180 * Math.PI).endAngle((i + 2) / 180 * Math.PI))
                .attr("stroke", color.getDefaultColor(i + 0.5));
        }
    }

    function drawArcs(radius, data, isMine) {
        var opacity, container;
        if (!isMine) {
            container = dom.svg.allChords;
            opacity = settings.chordMinOpacity +
                (settings.chordMaxOpacity - settings.chordMinOpacity) / data[0].answers.length;
        }
        else {
            container = dom.svg.myChords;
            opacity = 1;
        }

        for (var i = 0; i < data.length; i++) {
            var hue = data[i].hue,
                answers = data[i].answers,
                hue_name = hue.name.replace(" ", "_");
            container
                .selectAll("path." + hue_name)
                    .data(answers)
                .enter().append("path")
                    .classed(hue_name, true)
                    .attr('stroke', color.getDefaultColor(hue.value, opacity))
                    .attr("d", function(d) {
                        return arcPath(radius, radius / 2, d.left * Math.PI / 180, d.right * Math.PI / 180)
                    });
        }
    }

    function showAllPeople() {
        dom.svg.allChords.style("opacity", 1);
        dom.svg.myChords.style("opacity", 0);
    }

    function showMyResults() {
        dom.svg.allChords.style("opacity", settings.allChorsOpacity);
        dom.svg.myChords.style("opacity", settings.myChordOpacity);
    }

    function setEventHandlers() {
        dom.index.allButton.on('click', function() {
            dom.index.allButton.classed('active', true);
            dom.index.mineButton.classed('active', false);
            showAllPeople();
        });
        dom.index.mineButton.on('click', function() {
            dom.index.mineButton.classed('active', true);
            dom.index.allButton.classed('active', false);
            showMyResults();
        });
    }

    return function(data, my_data) {
        var radius = settings.circleRadius,
            cx = settings.circleRadius + settings.circleWidth,
            cy = settings.circleRadius + settings.circleWidth;

        dom.svg.svg.style("width", 2 * cx);
        dom.svg.svg.style("height", 2 * cy);

        dom.svg.palette.attr("transform", "translate("+cx+","+cy+")")
            .style('stroke-width', settings.circleWidth);
        dom.svg.chords.attr("transform", "translate("+cx+","+cy+")");

        drawCircle(radius);

        if (data.length > 0) {
            drawArcs(radius, data, false);
            if (my_data.length > 0) {
                drawArcs(radius, my_data, true);
                showMyResults();
            }
            else {
                showAllPeople();
            }
        }

        setEventHandlers();
    }
});