var baseHue = undefined;
var nextHue = undefined;

var currentHue = undefined;
var leftBorder = undefined;
var rightBorder = undefined;

window.SATURATION = 1;//0.5;
window.VALUE = 1;//0.8;
window.MIN_DIFF = 1 / 6 / 64;

window.onload = function() {
    baseHue = getBaseHue();
    nextHue = baseHue + 1 / 6;
    currentHue = baseHue + Math.random() * (nextHue - baseHue);
    document.getElementById("baseColor").style.backgroundColor =
        RGBtoStyle(HSVtoRGB(baseHue, window.SATURATION, window.VALUE));
    document.getElementById("nextColor").style.backgroundColor =
        RGBtoStyle(HSVtoRGB(nextHue, window.SATURATION, window.VALUE));
    updateSample();

    leftBorder = baseHue;
    rightBorder = nextHue;
}

document.addEventListener("keydown", onKeyDown, false);

function updateSample() {
    document.getElementById("hueSample").style.backgroundColor =
        RGBtoStyle(HSVtoRGB(currentHue, window.SATURATION, window.VALUE));
}

function onBaseSelected() {
    leftBorder = currentHue;
    setNewSampleHue();
}

function onNextSelected() {
    rightBorder = currentHue;
    setNewSampleHue();
}

function onKeyDown(e) {
    if (e.keyCode === 37)
        onBaseSelected();
    else if (e.keyCode === 39)
        onNextSelected();
}

function setNewSampleHue() {
    currentHue = (leftBorder + rightBorder) / 2;
    if (rightBorder - leftBorder < window.MIN_DIFF) {
        console.log(100 * (currentHue - baseHue) / (nextHue - baseHue));
        currentHue = (nextHue + baseHue) / 2;
    }
    updateSample();
}

function getBaseHue() {
    return parseInt(6 * Math.random()) / 6;
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
    };
}

function RGBtoStyle(rgb) {
    return "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
}