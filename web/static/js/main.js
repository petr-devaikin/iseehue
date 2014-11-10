define(['color', 'settings', 'palette'], function(color, settings, Palette) {
    var baseHue,
        nextHue;

    var currentHue,
        leftBorder,
        rightBorder;

    var baseColorElement = document.getElementById("baseColor"),
        nextColorElement = document.getElementById("nextColor"),
        hueSampleElement = document.getElementById("hueSample");

    var palette = new Palette();
    var colorBorder;
    function showColorBorder() {
        colorBorder = palette.getNextColor();
        if (colorBorder === undefined) {
            console.log('-----');
            for (var i = 0; i < settings.colorCount; i++)
                console.log(palette.colors[i].getPercentage());
            return;
        }

        baseColorElement.style.backgroundColor = colorBorder.getMinColor();
        nextColorElement.style.backgroundColor = colorBorder.getMaxColor();
        hueSampleElement.style.backgroundColor = color.HSVtoStyle(colorBorder.currentHue, settings.saturation, settings.value);
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

    baseColorElement.onclick = onBaseSelected;
    nextColorElement.onclick = onNextSelected;
    
    showColorBorder();
});