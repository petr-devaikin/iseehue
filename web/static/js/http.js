define(['libs/qwest', 'settings'], function(qwest, settings) {
    return {
        sendResults: function(palette, callback) {
            var borders = [];
            for (var i = 0; i < palette.colors.length; i++) {
                console.log(palette.colors[i].getPercentage());
                borders.push({ 
                    id: palette.colors[i].minId,
                    hue: palette.colors[i].minHue,
                    value: palette.colors[i].currentHue
                });
            }
            qwest.post(settings.sendResultUrl, { borders: JSON.stringify(borders) })
                .then(callback);
        },
        loadResults: function(callback) {
            qwest.get(settings.loadResultUrl)
                .then(callback);
        }
}
});