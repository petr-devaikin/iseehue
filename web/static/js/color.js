define(['settings'], function(settings) {
    return {
        getDefaultColor: function(hue, opacity) {
            if (opacity === undefined)
                opacity = 1;
            return "hsla(" + hue + "," + settings.saturation + "%," + settings.lightness + "%," +
                opacity + ")";
        }
    }
});