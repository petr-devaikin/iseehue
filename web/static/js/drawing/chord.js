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

    function drawUserAnswers(answers, owner, usersCount) {
        var radius = settings.circleRadius;
        var opacity, container;

        if (owner == 'all') {
            container = dom.svg.allChords;
            opacity = settings.chordMinOpacity +
                (settings.chordMaxOpacity - settings.chordMinOpacity) / usersCount;
        }
        else if (owner == 'mine')  {
            container = dom.svg.myChords;
            opacity = 1;
        }
        else {
            container = dom.svg.anotherChords;
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
        dom.index.allButton.classed('active', true);
        dom.index.mineButton.classed('active', false);
        dom.index.anotherButton.classed('active', false);

        dom.svg.allChords.style("opacity", 1);
        dom.svg.myChords.style("opacity", 0);
        dom.svg.anotherChords.style("opacity", 0);
        dom.index.startTest.style("opacity", 0);
    }

    function showMyResults() {
        dom.index.allButton.classed('active', false);
        dom.index.mineButton.classed('active', true);
        dom.index.anotherButton.classed('active', false);

        dom.svg.allChords.style("opacity", settings.allChorsOpacity);
        dom.svg.myChords.style("opacity", settings.myChordOpacity);
        dom.svg.anotherChords.style("opacity", 0);
        dom.index.startTest.style("opacity", 1);
    }

    function showAnotherResults() {
        dom.index.allButton.classed('active', false);
        dom.index.mineButton.classed('active', false);
        dom.index.anotherButton.classed('active', true);

        dom.svg.allChords.style("opacity", settings.allChorsOpacity);
        dom.svg.myChords.style("opacity", 0);
        dom.svg.anotherChords.style("opacity", settings.myChordOpacity);
        dom.index.startTest.style("opacity", 0);
    }

    function setEventHandlers() {
        dom.index.allButton.on('click', function() {
            showAllPeople();
        });
        dom.index.mineButton.on('click', function() {
            showMyResults();
        });
        dom.index.anotherButton.on('click', function() {
            showAnotherResults();
        });
    }

    return function(data, my_data, another_data, loggedIn) {
        var cx = settings.circleRadius + settings.circleWidth,
            cy = settings.circleRadius + settings.circleWidth;

        dom.svg.svg.style("width", 2 * cx);
        dom.svg.svg.style("height", 2 * cy);

        dom.svg.palette.attr("transform", "translate("+cx+","+cy+")")
            .style('stroke-width', settings.circleWidth);
        dom.svg.chords.attr("transform", "translate("+cx+","+cy+")");

        drawCircle(settings.circleRadius);

        if (data.length > 0) {
            drawUserAnswers(data, 'all', data.length);

            if (my_data.length > 0)
                drawUserAnswers(my_data, 'mine');

            if (another_data.length > 0)
                drawUserAnswers(another_data, 'another');


            if (another_data.length > 0)
                showAnotherResults();
            else if (loggedIn)
                showMyResults();
            else
                showAllPeople();            
        }

        setEventHandlers();
    }
});