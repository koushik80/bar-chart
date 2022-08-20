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
                        return item[1] // https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
                    })])
                    .range([0, height - (2 * padding)])
    xScale = d3.scaleLinear()
               .domain([0, values.length - 1])
               .range([padding, width - padding])

    let datesArray = values.map((item) => {
        return new Date(item[0]) // from fcc json data: Array[0] is the date
    })

    xAxisScale = d3.scaleTime()
                   .domain([d3.min(datesArray), d3.max(datesArray)])
                   .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                   .domain([0, d3.max(values, (item) => {
                       return item[1] // from fcc json data: Array[1] is the GDP
                   })])
                   .range([height - padding, padding])
}

let drawBars = () => {

}


let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')

}

req.open('GET', url, true);
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    console.log(values);
    myChart();
    generateScales();
    drawBars();
    generateAxes();
}
req.send();
