d3.json('config.json', function(config) {
    d3.csv(config.pathUsWeeklyFoodSalesByCategory, function (data) {
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
                loadData[j]['values'].push([
                    parseInt(data[i].Epoch),
                    parseInt(data[i][loadData[j]['key']])
                ]);
            }
        }

        var epochMin = loadData[0]['values'][0][0];
        var epochMax = loadData[0]['values'][loadData[0]['values'].length - 1][0]
        var dateMinOffset = 1 / 6;
        var dateRangeMillis = epochMax - epochMin;
        var dateRangeOffsetMillis = dateRangeMillis * dateMinOffset;
        var startingPoint = epochMin + dateRangeOffsetMillis;
        for (i = 1; i < loadData[0]['values'].length; ++i) {
            if(startingPoint < loadData[0]['values'][i][0]) {
                epochMin = loadData[0]['values'][i-1][0];
                break;
            }
        }

        var chart;
        nv.addGraph(function () {
            chart = nv.models.stackedAreaWithFocusChart()
                .color(nv.utils.getColor(d3.scale.category20().range()))
                .useInteractiveGuideline(false)
                .margin({ left: 100, right: 40 })
                .x(function (d) {
                    return d[0]
                })
                .y(function (d) {
                    return d[1]
                })
                .controlOptions([])
                .duration(0);

            chart.brushExtent([
                epochMin,
                epochMax
            ]);

            chart.xAxis.tickFormat(function (d) {
                return d3.time.format('%x')(new Date(d))
            });
            chart.x2Axis.tickFormat(function (d) {
                return d3.time.format('%x')(new Date(d))
            });
            chart.yAxis.tickFormat(function(d) { return '$' + d3.format(',.0f')(d); });

            chart.legend.vers('classic');

            d3.select('#chart1')
                .datum(loadData)
                .transition().duration(0)
                .call(chart)
                .each('start', function () {
                });

            nv.utils.windowResize(chart.update);
            return chart;
        });
    });
});
