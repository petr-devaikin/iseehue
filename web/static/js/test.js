define(['color', 'settings', 'palette', 'dom', 'http', 'color_border'],
    function(color, settings, Palette, dom, http, ColorBorder) {
        var palette,
            colorBorder;

        function updateTestCase() {
            if (palette.caseNumber > 0) {
                dom.test.title.text('Case #' + palette.caseNumber);
            }

            dom.test.baseColor.style({ 'background-color': colorBorder.getMinColor() });
            dom.test.nextColor.style({ 'background-color': colorBorder.getMaxColor() });
            dom.test.baseColorName.text(colorBorder.getMinName());
            dom.test.nextColorName.text(colorBorder.getMaxName());
            dom.test.hueSample.style.backgroundColor = color.getDefaultColor(colorBorder.currentHue);

            dom.test.baseColor.classed('afterSelect', false);
            dom.test.nextColor.classed('afterSelect', false);
        }

        function loadExample() {
            colorBorder = new ColorBorder(settings.hues[4], settings.hues[5]);
            colorBorder.currentHue = colorBorder.minHue + 0.8 * (colorBorder.maxHue - colorBorder.minHue);
            updateTestCase();
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

        var onBaseSelected,
            onNextSelected;

        function setRealEventHandlers() {
            onBaseSelected = function() {
                if (colorBorder !== undefined) {
                    colorBorder.updateMinBorder();
                    loadNewTestCase();
                }
            }

            onNextSelected = function() {
                if (colorBorder !== undefined) {
                    colorBorder.updateMaxBorder();
                    loadNewTestCase();
                }
            }
        }

        function clearEventHandlers() {
            onBaseSelected = function() {};
            onNextSelected = function() {};
        }

        function showLetsStart() {
            dom.test.hint
                    .interrupt()
                    .transition()
                    .duration(settings.fadePeriod)
                    .style('opacity', 0)
                    .each("end", function() {
                        this.remove();
                    });
            dom.test.letsStart
                    .interrupt()
                    .style('opacity', 0)
                    .classed('hidden', false)
                    .transition()
                    .duration(settings.fadePeriod)
                    .style('opacity', 1);
            dom.test.hideIntroductionButton.focus();
        }

        function setExampleEventHandlers() {
            onBaseSelected = function() {
                dom.test.baseColor.classed('afterSelect', true);
                dom.test.nextColor.classed('afterSelect', true);
                /*dom.test.nextColor
                    .interrupt()
                    .transition()
                    .duration(settings.fadePeriod)
                    .style('opacity', settings.fadeOpacity);*/
                showLetsStart();
                clearEventHandlers();
            }

            onNextSelected = function() {
                dom.test.baseColor.classed('afterSelect', true);
                dom.test.nextColor.classed('afterSelect', true);
                /*dom.test.baseColor
                    .interrupt()
                    .transition()
                    .duration(settings.fadePeriod)
                    .style('opacity', settings.fadeOpacity);*/
                showLetsStart();
                clearEventHandlers();
            }
        }

        function addTestEventHandlers() {
            dom.test.baseColor.on('click', function() { onBaseSelected(); });
            dom.test.nextColor.on('click', function() { onNextSelected(); });

            document.addEventListener("keydown", function(e) {
                if (e.keyCode === 37) onBaseSelected();
                else if (e.keyCode === 39) onNextSelected();
            });
        }

        function hideIntroduction() {
            dom.test.tutorial.classed("hidden", true);
        }

        function addIntroductionHandlers() {
            dom.test.hideIntroductionButton.onclick = function() {
                hideIntroduction();
                loadNewTestCase();

                setRealEventHandlers(colorBorder);
            }
        }

        return {
            initPage: function() {
                palette = new Palette(settings.hues);
                loadExample();

                setExampleEventHandlers();
                addTestEventHandlers();

                addIntroductionHandlers();
            }
        }
    }
);