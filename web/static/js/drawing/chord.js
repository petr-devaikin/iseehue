define(['dom', 'color', 'settings', 'libs/d3'], function(dom, color, settings, d3) {
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

    function drawUserAnswers(answers, isMine, usersCount) {
        var radius = settings.circleRadius;
        var opacity, container;

        if (!isMine) {
            container = dom.svg.allChords;
            opacity = settings.chordMinOpacity +
                (settings.chordMaxOpacity - settings.chordMinOpacity) / usersCount;
        }
        else {
            container = dom.svg.myChords;
            opacity = 1;
        }

        container
            .selectAll('g')
                .data(answers)
            .enter().append('g')
                .selectAll("path")
                    .data(function(u) { return u.answers })
                .enter().append("path")
                    .attr('stroke', function(d) { return color.getDefaultColor(d.hue, opacity); })
                    .attr("d", function(d) {
                        return arcPath(radius, radius / 2, d.left * Math.PI / 180, d.right * Math.PI / 180)
                    });
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
        var cx = settings.circleRadius + settings.circleWidth,
            cy = settings.circleRadius + settings.circleWidth;

        dom.svg.svg.style("width", 2 * cx);
        dom.svg.svg.style("height", 2 * cy);

        dom.svg.palette.attr("transform", "translate("+cx+","+cy+")")
            .style('stroke-width', settings.circleWidth);
        dom.svg.chords.attr("transform", "translate("+cx+","+cy+")");

        drawCircle(settings.circleRadius);

        if (data.length > 0) {
            drawUserAnswers(data, false, data.length);

            if (my_data.length > 0) {
                drawUserAnswers(my_data, true);
                showMyResults();
            }
            else {
                showAllPeople();
            }
        }

        setEventHandlers();
    }
});