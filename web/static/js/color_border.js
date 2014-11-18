define(['settings', 'color'], function(settings, color) {
    return function(baseHue, nextHue) {
        this.minId = baseHue.id;
        this.minName = baseHue.name;
        this.minHue = baseHue.value;

        this.maxId = nextHue.id;
        this.maxName = nextHue.name;
        this.maxHue = nextHue.value;
        if (this.maxHue < this.minHue)
            this.maxHue += 360;

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
            return this.maxBorder - this.minBorder < settings.hueWidth / settings.accuracy;
        }

        this.getPercentage = function() {
            return 100 * (this.currentHue - this.minHue) / (this.maxHue - this.minHue);
        }

        this.reverse = function () {
            this.isReversed = !this.isReversed;
        }

        this.getMinColor = function () {
            return color.getDefaultColor(this.isReversed ? this.maxHue : this.minHue);
        }

        this.getMaxColor = function () {
            return color.getDefaultColor(this.isReversed ? this.minHue : this.maxHue);
        }

        this.getMinName = function () {
            return this.isReversed ? this.maxName : this.minName;
        }

        this.getMaxName = function () {
            return this.isReversed ? this.minName : this.maxName;
        }
    }
});