define(['qwest', 'settings'], function(qwest, settings) {
    return {
        sendResults: function(palette) {
            console.log('-----');
            var borders = [];
            for (var i = 0; i < palette.colors.length; i++) {
                console.log(palette.colors[i].getPercentage());
                borders.push({ 
                    id: palette.colors[i].id,
                    hue: palette.colors[i].minHue,
                    value: palette.colors[i].currentHue
                });
            }
            qwest.post(sendResultUrl, { borders: JSON.stringify(borders) })
                .then(function(response) {
                    console.log('response');
                });
        },
        loadResults: function(callback) {
            qwest.get(loadResultUrl)
                .then(callback);
        }
}
});