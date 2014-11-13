define(['lib/d3'], function(d3) {
    return {
        baseColorElement: document.getElementById("baseColor"),
        nextColorElement: document.getElementById("nextColor"),
        hueSampleElement: document.getElementById("hueSample"),
        svg: {
            palette: d3.select("#results g#palette"), 
            chords: d3.select("#results g#chords"), 
        },
    }
});