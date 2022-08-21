let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req = new XMLHttpRequest();


let data;
let values = [];

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select('svg');

let myChart = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

// Ref: https://www.freecodecamp.org/learn/data-visualization/data-visualization-with-d3/create-a-linear-scale-with-d3
       // https://www.freecodecamp.org/learn/data-visualization/data-visualization-with-d3/set-a-domain-and-a-range-on-a-scale
let generateScales = () => {
    heightScale = d3.scaleLinear()
                     .domain([0, d3.max(values, (item) => {
                        // from fcc json data: Array[1]
                        return item[1]    // https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
                    })])
                    .range([0, height - (2 * padding)])
    xScale = d3.scaleLinear()
                .domain([0, values.length - 1])
                .range([padding, width - padding])

    let datesArray = values.map((item) => {
        return new Date(item[0])    // from fcc json data: Array[0] is the date
    })

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width - padding]);

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]       // from fcc json data: Array[1] is the GDP
        })])
                    .range([height - padding, padding]);
}

let drawBars = () => {

    let tooltip = d3.select('body')
                     .append('div')
                     .attr('id', 'tooltip')
                     .attr('class', 'tooltip')
                     .style('opacity', 0)
                     .style('visibility', 'hidden')
                     .style('width', 'auto')
                     .style('height', 'auto');

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / values.length)
        .attr('height', (item) => {
            return heightScale(item[1])
        })
        .attr('x', (item, index) => {
            return xScale(index)
        })
        .attr('y', (item) => {
            return (height - padding) - heightScale(item[1])
        })
        .attr('data-date', (item) => {
            return item[0]
        })
        .attr('data-gdp', (item) => {
            return item[1]
        })
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
                .style("opacity", 0.9);
            //tooltip.attr("data-date", item[0]);

            tooltip.text(item[0]);

            document.querySelector('#tooltip').setAttribute('data-date', item[0])
            //document.querySelector('#tooltip').textContent = item[0]
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
                .duration(400)
                .style("opacity", 0);
            tooltip.attr("data-date", item[0]);
        })
}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')');

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        //.attr('transform', 'translate(' + padding + ', ' + padding + ')')
        .attr('transform', 'translate(' + padding + ', 0)');
}

req.open('GET', url, true);
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    console.log(values);
    generateScales();
    myChart();
    drawBars();
    generateAxes();
}
req.send();
