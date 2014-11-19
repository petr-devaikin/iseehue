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
            window.setTimeout(function() {
                if ((colorBorder = palette.getNextColor()) === undefined) {
                    http.sendResults(palette, function(responce) {
                        window.location = settings.indexUrl;
                    });
                }
                else {
                        updateTestCase();
                        dom.test.baseColor.style('transform', 'scale(1,1)');
                        dom.test.nextColor.style('transform', 'scale(1,1)');
                        setEventHandlers(true);
                }
            }, settings.testDelay);
        }

        var onBaseSelected,
            onNextSelected;

        function setEventHandlers(real) {
            onBaseSelected = function() {
                if (colorBorder !== undefined) {
                    colorBorder.updateMinBorder();
                    selectBase();
                    if (real)
                        loadNewTestCase();
                    else
                        showLetsStart();
                }
            }

            onNextSelected = function() {
                if (colorBorder !== undefined) {
                    colorBorder.updateMaxBorder();
                    selectNext();
                    if (real)
                        loadNewTestCase();
                    else
                        showLetsStart();
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

        function selectBase() {
            dom.test.baseColor.classed('afterSelect', true);
            dom.test.nextColor.classed('afterSelect', true);
            dom.test.baseColor.style('transform', 'scale(1.2,1.2)');
            clearEventHandlers();
        }

        function selectNext() {
            dom.test.baseColor.classed('afterSelect', true);
            dom.test.nextColor.classed('afterSelect', true);
            dom.test.nextColor.style('transform', 'scale(1.2,1.2)');
            clearEventHandlers();
        }

        function setInteractionHandlers() {
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
            }
        }

        return {
            initPage: function() {
                palette = new Palette(settings.hues);
                loadExample();

                setEventHandlers();
                setInteractionHandlers();

                addIntroductionHandlers();
            }
        }
    }
);