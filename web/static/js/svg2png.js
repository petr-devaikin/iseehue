define(['dom', 'settings'], function(dom, settings) {
    function binaryblob(canvasdata){
        var byteString = atob(canvasdata.replace(/^data:image\/(png|jpg);base64,/, ""));
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var dataView = new DataView(ab);
        var blob = new Blob([dataView], {type: "image/png"});
        var DOMURL = self.URL || self.webkitURL || self;
        var newurl = DOMURL.createObjectURL(blob);

        dom.index.pngContainer.img.attr('src', newurl);
    }

    return function() {
        var html = dom.svg.svg
            .attr('width', 2 * (settings.circleRadius + settings.circleWidth))
            .attr('height', 2 * (settings.circleRadius + settings.circleWidth))
            .attr("version", 1.1)
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .node().parentNode.innerHTML;

        var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);

        dom.index.pngContainer.canvas
            .attr('width', 2 * (settings.circleRadius + settings.circleWidth))
            .attr('height', 2 * (settings.circleRadius + settings.circleWidth))

        var canvas = dom.index.pngContainer.canvas.node(),
            context = canvas.getContext("2d");

        var image = new Image;
        image.src = imgsrc;
        image.onload = function() {
            context.drawImage(image, 0, 0);
         
            var canvasdata = canvas.toDataURL("image/png");
            binaryblob(canvasdata);
            //dom.index.pngContainer.img.attr('src', canvasdata);
            //dom.index.shareImg.attr('content', canvasdata);
            //var pngimg = '<img src="'+canvasdata+'">'; 
            //d3.select("#pngdataurl").html(pngimg);
        }
    }
});