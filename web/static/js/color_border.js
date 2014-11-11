define(['settings', 'color'], function(settings, color) {
    return function(hue) {
        this.id = hue.id;
        this.name = hue.name;
        this.minHue = hue.value;
        this.maxHue = this.minHue + 1 / hues.length;
        this.minBorder = this.minHue;
        this.maxBorder = this.maxHue;
        this.currentHue = this.minHue + Math.random() * (this.maxHue - this.minHue);
        this.isReversed = false;

        this.updateMinBorder = function() {
            if (!this.isReversed)
                this.minBorder = this.currentHue;
            else
                this.maxBorder = this.currentHue;
            return this.updateCurrentHue();
        }

        this.updateMaxBorder = function() {
            if (!this.isReversed)
                this.maxBorder = this.currentHue;
            else
                this.minBorder = this.currentHue;
            return this.updateCurrentHue();
        }

        this.updateCurrentHue = function() {
            this.currentHue = (this.minBorder + this.maxBorder) / 2;
            return this.isDone();
        }

        this.isDone = function() {
            return this.maxBorder - this.minBorder < 1 / settings.accuracy / hues.length;
        }

        this.getPercentage = function() {
            return 100 * (this.currentHue - this.minHue) / (this.maxHue - this.minHue);
        }

        this.reverse = function () {
            this.isReversed = !this.isReversed;
        }

        this.getMinColor = function () {
            return color.HSVtoStyle(this.isReversed ? this.maxHue : this.minHue,
                                    settings.saturation,
                                    settings.value);
        }

        this.getMaxColor = function () {
            return color.HSVtoStyle(this.isReversed ? this.minHue : this.maxHue,
                                    settings.saturation,
                                    settings.value);
        }
    }
});