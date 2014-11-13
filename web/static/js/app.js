requirejs.config({
    baseUrl: "{{ url_for('static', filename='js') }}",
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        d3: "http://d3js.org/d3.v3.min",
    }
    //    jquery: 'jquery-2.1.1.min'
    //},
});