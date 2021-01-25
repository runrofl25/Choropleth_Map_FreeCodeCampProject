// <!-- Recieved help from Florin Pop Youtuber who explains how to work on ScatterPlot Graph from this youtube channel: https://www.youtube.com/watch?v=j2UdrV8-3yw&t=4350s&ab_channel=FlorinPop
// I reccomend likeing and subscribeing he explains things really well! --> */

const tooltip = document.getElementById('tooltip');

async function run() {

  const eduResp = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json');
  const educations = await eduResp.json();

  const countiesResp = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json');
  const counties = await countiesResp.json();

  const width = 960;
  const height = 600;
  const padding = 60;

  const path = d3.geoPath();

  const data = topojson.feature(counties, counties.objects.counties).features;

  const minEdu = d3.min(educations, edu => edu.bachelorsOrHigher);
  const maxEdu = d3.max(educations, edu => edu.bachelorsOrHigher);
  const step = (maxEdu - minEdu) / 8;

  const colorsScale = d3.scaleThreshold().
  domain(d3.range(minEdu, maxEdu, step)).
  range(d3.schemePurples[9]);
  const colors = [];

  for (let i = minEdu; i <= maxEdu; i += step) {
    colors.push(colorsScale(i));
  }

  const svg = d3.select('#container').append('svg').
  attr('width', width).
  attr('height', height);

  svg.append('g').
  selectAll('path').
  data(data).
  enter().
  append('path').
  attr('class', 'county').
  attr('fill', (d) =>
  colorsScale(educations.find(edu => edu.fips === d.id).bachelorsOrHigher)).
  attr('d', path).
  attr('data-fips', d => d.id).
  attr('data-education', (d) =>
  educations.find(edu => edu.fips === d.id).bachelorsOrHigher) //impllict return
  .on('mouseover', (d, i) => {
    const { coordinates } = d.geometry;
    const [x, y] = coordinates[0][0]; // array structureing we get x and y from coordinates

    const education = educations.find(edu => edu.fips === d.id); // looks for id within fips which is then put into const value educations and set equal to education

    tooltip.classList.add('show');
    tooltip.style.left = x - 50 + 'px';
    tooltip.style.top = y - 50 + 'px';
    tooltip.setAttribute('data-education', education.bachelorsOrHigher);

    tooltip.innerHTML = `
        <p>${education.area_name} - ${education.state}</p>
        <p>${education.bachelorsOrHigher}%</p>
      `;
  }).on('mouseout', () => {
    tooltip.classList.remove('show');
  });

  // create axis
  // const xAxis = d3.axisBottom(xScale)
  // .tickFormat(d3.format('d'));
  // const yAxis = d3.axisLeft(yScale).tickFormat((month) => {
  //   const date = new Date(0);
  //   date.setUTCMonth(month);
  //   return d3.timeFormat('%B')(date); 
  // });

  //   svg.append('g')
  //     .attr('id', 'x-axis')
  //     .attr('transform', `translate(0, ${height - padding + cellHeight})`)
  //     .call(xAxis);

  //   svg.append('g')
  //     .attr('id', 'y-axis')
  //     .attr('transform', `translate(${padding}, 0)`)
  //     .call(yAxis)

  //creating a legend!
  //   const legendWidth = 200;
  //   const legendHeight = 50;

  //   const legendRectWidth = legendWidth / colors.length;
  //   const legend = d3.select('body')
  //   .append('svg')
  //   .attr('id', 'legend')
  //   .attr('width', legendWidth)
  //   .attr('height', legendHeight)
  //   .selectAll('rect')
  //   .data(colors)
  //   .enter()
  //   .append('rect')
  //   .attr('x', (_, i) => i * legendRectWidth)
  //   .attr('y', 0)
  //   .attr('width', legendRectWidth)
  //   .attr('height', legendHeight)
  //   .attr('fill', c => c)

  const legendWidth = 200;
  const legendHeight = 50;

  const legendRectWidth = legendWidth / colors.length;
  const legend = d3.select('#container').
  append('svg').
  attr('id', 'legend').
  attr('class', 'legend').
  attr('width', legendWidth).
  attr('height', legendHeight).
  selectAll('rect').
  data(colors).
  enter().
  append('rect').
  attr('x', (_, i) => i * legendRectWidth).
  attr('y', 0).
  attr('width', legendRectWidth).
  attr('height', legendHeight).
  attr('fill', c => c);

  legend.selectAll('text').
  data(colors).
  enter().
  append('text').
  attr('fill', 'black').
  attr(c => c);
}

run();