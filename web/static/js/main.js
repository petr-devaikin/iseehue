define(['http', 'drawing/chord'], function(http, drawingChord) {
    return function () {
        http.loadResults(function(response) {
            drawingChord(response.hues, response.my_hues);
        });
    }
});