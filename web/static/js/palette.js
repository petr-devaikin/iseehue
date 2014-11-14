define(['color_border', 'settings'], function(ColorBorder, settings) {
    return function(hues) {
        this.caseNumber = 0;

        this.colors = [];
        for (var i = 0; i < hues.length; i++)
            this.colors.push(new ColorBorder(hues[i], hues[(i + 1) % hues.length]));
        this.cursor = 0;

        this.getNextColor = function () {
            var notDone = this.colors.filter(function(c) { return !c.isDone(); });
            if (notDone.length > 0) {
                this.caseNumber++;

                if (this.cursor > notDone.length - 1) {
                    this.shuffle();
                    this.cursor = 0;
                }
                notDone[this.cursor].reverse();
                return notDone[this.cursor++];
            }
            else
                return undefined;
        }

        this.shuffle = function () {
            var colors = [];
            while (this.colors.length > 0) {
                i = parseInt(this.colors.length * Math.random());
                colors.push(this.colors.splice(i, 1)[0]);
            }
            this.colors = colors;
        }
    }
});