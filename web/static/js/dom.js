define(['lib/domReady!', 'lib/d3'], function(doc, d3) {
    return {
        svg: {
            svg: d3.select("#results"),
            palette: d3.select("#results g#palette"), 
            chords: d3.select("#results g#chords"),
            allChords: d3.select("#results g#chords g#all"),
            myChords: d3.select("#results g#chords g#mine"),
        },
        index: {
            allButton: d3.select("#allButton"),
            mineButton: d3.select("#mineButton"),
        },
        test: {
            tutorial: d3.selectAll(".tutorial"),
            letsStart: d3.select("#letsStart"),
            hideIntroductionButton: doc.getElementById("hideIntroduction"),
            baseColorName: d3.select("#baseColorName"),
            nextColorName: d3.select("#nextColorName"),
            baseColor: d3.select("#baseColor"),
            nextColor: d3.select("#nextColor"),
            hueSample: doc.getElementById("hueSample"),
            title: d3.select("#caseTitle"),
            hint: d3.selectAll(".hint"),
        }
    }
});