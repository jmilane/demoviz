function multiBarDateXaxisDollarsYaxis(config, path, callback) {
    d3.csv(config[path], function (data) {
        var loadData = [];
        var columnNames = Object.keys(data[0])
        for (var i = 1; i < columnNames.length; ++i) {
            var stackItem = {};
            stackItem['key'] = columnNames[i];
            stackItem['values'] = [];
            loadData.push(stackItem);
        }

        for (i = 0; i < data.length; ++i) {
            for (var j = 0; j < loadData.length; ++j) {
                var value = {};
                value['x'] = data[i].Date;
                value['y'] = parseInt(data[i][loadData[j]['key']])
                loadData[j]['values'].push(value);
            }
        }

        nv.addGraph({
            generate: function () {
                var width = nv.utils.windowSize().width,
                    height = nv.utils.windowSize().height * 0.88;

                var chart = nv.models.multiBarChart()
                    .margin({ left: 100, right: 40 })
                    .width(width)
                    .height(height)
                    .stacked(false);

                chart.yAxis.tickFormat(function (d) {
                    return '$' + d3.format(',.0f')(d);
                });

                chart.dispatch.on('renderEnd', function () {
                });

                var svg = d3.select('#chart1').datum(loadData);
                svg.transition().duration(0).call(chart);
                return chart;
            },
            callback: function (graph) {
                nv.utils.windowResize(function () {
                    var width = nv.utils.windowSize().width;
                    var height = nv.utils.windowSize().height * 0.88;
                    graph.width(width).height(height);

                    d3.select('#chart1')
                        .attr('width', width)
                        .attr('height', height)
                        .transition().duration(0)
                        .call(graph);
                });
            }
        });

        callback();
    });
}
