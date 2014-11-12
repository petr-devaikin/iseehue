define(['d3'], function(d3) {
    return {
        baseColorElement: document.getElementById("baseColor"),
        nextColorElement: document.getElementById("nextColor"),
        hueSampleElement: document.getElementById("hueSample"),
        results: d3.select("#results"), 
    }
});