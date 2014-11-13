define(['color', 'settings', 'palette', 'dom', 'http'],
    function(color, settings, Palette, dom, http) {
        return function() {
            var palette = new Palette(settings.hues),
                colorBorder;

            function showColorBorder() {
                colorBorder = palette.getNextColor();
                if (colorBorder === undefined) {
                    http.sendResults(palette, function(responce) {
                        window.location = settings.indexUrl;
                    });
                    return;
                }

                dom.baseColorElement.style.backgroundColor = colorBorder.getMinColor();
                dom.nextColorElement.style.backgroundColor = colorBorder.getMaxColor();
                dom.hueSampleElement.style.backgroundColor = color.getDefaultColor(colorBorder.currentHue);
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
        }
    }
);