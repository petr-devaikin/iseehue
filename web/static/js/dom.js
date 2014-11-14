define(['lib/domReady!', 'lib/d3'], function(doc, d3) {
    return {
        svg: {
            palette: d3.select("#results g#palette"), 
            chords: d3.select("#results g#chords"), 
        },
        test: {
            tutorial: d3.selectAll(".tutorial"),
            letsStart: doc.getElementById("letsStart"),
            hideIntroductionButton: doc.getElementById("hideIntroduction"),
            baseColorName: d3.select("#baseColorName"),
            nextColorName: d3.select("#nextColorName"),
            baseColor: doc.getElementById("baseColor"),
            nextColor: doc.getElementById("nextColor"),
            hueSample: doc.getElementById("hueSample"),
            title: d3.select("#caseTitle"),
            hint: d3.selectAll(".hint"),
        }
    }
});