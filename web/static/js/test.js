define(['color', 'settings', 'palette', 'dom', 'http'],
    function(color, settings, Palette, dom, http) {
        var palette,
            colorBorder;

        function updateTestCase() {
            dom.baseColor.style.backgroundColor = colorBorder.getMinColor();
            dom.nextColor.style.backgroundColor = colorBorder.getMaxColor();
            dom.hueSample.style.backgroundColor = color.getDefaultColor(colorBorder.currentHue);
        }

        function loadNewTestCase() {
            if ((colorBorder = palette.getNextColor()) === undefined) {
                http.sendResults(palette, function(responce) {
                    window.location = settings.indexUrl;
                });
            }
            else
                updateTestCase();
        }

        function addTestEventHandlers() {
            function onBaseSelected() {
                if (colorBorder !== undefined) {
                    colorBorder.updateMinBorder();
                    loadNewTestCase();
                }
            }

            function onNextSelected() {
                if (colorBorder !== undefined) {
                    colorBorder.updateMaxBorder();
                    loadNewTestCase();
                }
            }

            dom.baseColor.onclick = onBaseSelected;
            dom.nextColor.onclick = onNextSelected;

            document.addEventListener("keydown", function(e) {
                if (e.keyCode === 37) onBaseSelected();
                else if (e.keyCode === 39) onNextSelected();
            });
        }

        function hideIntroduction() {
            dom.test.introduction.classList.add("hidden");
        }

        function addIntroductionHandlers() {
            dom.test.hideIntroductionButton.onclick = function() {
                hideIntroduction();
                addTestEventHandlers(colorBorder);
                loadNewTestCase();
            }
        }

        return {
            initPage: function() {
                palette = new Palette(settings.hues);
                addIntroductionHandlers();
            }
        }
    }
);