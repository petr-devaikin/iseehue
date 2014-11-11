define(['color', 'settings', 'palette', 'dom', 'http'], function(color, settings, Palette, dom, http) {
    var palette = new Palette(hues);
    var colorBorder;
    http.sendResults(palette);
    http.loadResults(function(response) {
        console.log(response.hues);
        for (var i = 0; i < response.hues.length; i++) {
            var hue = response.hues[i].hue,
                answers = response.hues[i].answers;
            //dom.resultsElement.appendData("color: " + hue.name + ", count: " + answers.length + "<br/>");
            console.log("color: " + hue.name + ", count: " + answers.length + "<br/>");
        }
    });

    function showColorBorder() {
        colorBorder = palette.getNextColor();
        if (colorBorder === undefined) {
            http.sendResults(palette);
            return;
        }

        dom.baseColorElement.style.backgroundColor = colorBorder.getMinColor();
        dom.nextColorElement.style.backgroundColor = colorBorder.getMaxColor();
        dom.hueSampleElement.style.backgroundColor = color.HSVtoStyle(colorBorder.currentHue, settings.saturation, settings.value);
    }


    function onBaseSelected() {
        if (colorBorder !== undefined) {
            if (colorBorder.updateMinBorder())
                console.log(colorBorder.getPercentage());
            showColorBorder();
        }
    }

    function onNextSelected() {
        if (colorBorder !== undefined) {
            if (colorBorder.updateMaxBorder())
                console.log(colorBorder.getPercentage());
            showColorBorder();
        }
    }

    function onKeyDown(e) {
        if (e.keyCode === 37)
            onBaseSelected();
        else if (e.keyCode === 39)
            onNextSelected();
    }

    document.addEventListener("keydown", onKeyDown);

    dom.baseColorElement.onclick = onBaseSelected;
    dom.nextColorElement.onclick = onNextSelected;
    
    showColorBorder();
});