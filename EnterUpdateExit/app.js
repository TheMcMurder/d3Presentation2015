
var data =[45, 10];

init();


//creating the svg so I can draw objects on it
var svg = d3.select("body").append("svg")
  .attr("width", 500)
  .attr("height", 5000);

//createCirclesNotBound();


var circleArray;
bindData(data);

var duration = 800;

function enter() {
  //**********************************************************************************
  // Enter: all pieces of data that do not have a node to bind to. In this case where
  // there are already three circles ('nodes') there would have to be more than 3
  // data points in our dataset to have enter run at all;
  //**********************************************************************************
  refreshArray();
  circleArray.enter()
    .append("circle")
    .attr("cx", 100)
    .attr("cy", function(d, i){
      return (i + 1)*100
    })
    .attr("r", 30)
    .attr("fill", "#78AB46")
    .transition()
    .duration(duration);

  refreshArray();
}

function update() {
  //**********************************************************************************
  // Update: Every node that is bound to data, in this case that is everything we've
  // entered and everything that has just been bound from the .data(data) bind.
  //**********************************************************************************
  refreshArray();
  circleArray
    .transition()
    .duration(duration)
    .style('fill', 'steelblue')
    .attr('r', function (d){
      return d;
    });

  refreshArray();
}

function exit() {
  //**********************************************************************************
  // Exit: Every node ('circles') that exists in your selection that you don't have
  // bound data to
  //**********************************************************************************
  refreshArray();
  circleArray.exit()
    .transition().duration(duration)
    .style("fill", "red")
    .transition().duration(duration).delay(duration)
    .attr("r", 0)
    .transition()
    .remove();

  refreshArray();

}

function changeData() {
  var random = ((Math.random() * 8) + 1);
  data = [];
  for (var i = 0; i < random; i++) {
    data.push(Math.floor((Math.random() * 45) + 10))
  }

  displayData(data);
  bindData(data);

}

function bindData(data){
  circleArray = svg.selectAll("circle")
    .data(data);
}

function removeAll() {
  svg.selectAll("circle").remove();
}

function refreshArray() {
  bindData(data);
}

function init() {
  displayData(data);
}

function displayData(data){
  document.querySelectorAll('span')[0].innerHTML = data;
}


