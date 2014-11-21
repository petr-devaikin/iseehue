define(['dom', 'settings'], function(dom, settings) {
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
            dom.index.pngContainer.img.attr('src', canvasdata);
            //dom.index.shareImg.attr('content', canvasdata);
            //var pngimg = '<img src="'+canvasdata+'">'; 
            //d3.select("#pngdataurl").html(pngimg);
        }
    }
});