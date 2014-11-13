define(['lib/d3'], function(d3) {
    return {
        baseColor: document.getElementById("baseColor"),
        nextColor: document.getElementById("nextColor"),
        hueSample: document.getElementById("hueSample"),
        svg: {
            palette: d3.select("#results g#palette"), 
            chords: d3.select("#results g#chords"), 
        },
    }
});