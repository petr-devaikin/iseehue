define(['color', 'settings', 'palette', 'dom', 'http', 'drawing/overall'],
    function(color, settings, Palette, dom, http, dOverall) {
        var palette = new Palette(hues);
        var colorBorder;
        //http.sendResults(palette);
        http.loadResults(function(response) {
            console.log(response.hues);
            dOverall(response.hues);
        });

        function showColorBorder() {
            colorBorder = palette.getNextColor();
            if (colorBorder === undefined) {
                http.sendResults(palette);
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
);