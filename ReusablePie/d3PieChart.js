pieChart = function (){

  //*************************************************
  // Public Variables loaded with default values
  //*************************************************
  var _width = 500;
  var _height = 500;
  var _colors = ["#B1D92D", "#1FBCFF", "#EE5A30"];
  var _transitionTime = 250;

  //**********************************************************************************
  // Private Variables meant for internal Use only
  //**********************************************************************************
  var __firstDraw = true;
  var __radius = 0;


  function chart(selection){
    selection.each(function (data, i){
      //*************************************************
      // Generate the chart here using the public variables
      //
      // Note: boundData = data bound upon the selection using datum
      //    on the exterier function call
      // Example: in this case d = dataArray
      //    var chart = VSBarChart();
      //
      //    d3.select('svg')
      //        .datum(dataArray)
      //        .call(chart);
      //
      //*************************************************
      var initialNode = d3.select(this);
      var rootNodeWrapper = initialNode.selectAll('.rootNode').data([0]);
      rootNodeWrapper.enter().append('g')
          .attr('class', 'rootNode');

      var rootNode = d3.select(this).select('.rootNode');

      //----------------------------------------------------------------------------------
      // databinds to ensure that there is only ever one of each group
      //----------------------------------------------------------------------------------
      var pieWrapperGroup = rootNode.selectAll('.baseGroup').data([0]);

      pieWrapperGroup.enter().append('g')
          .attr('class', 'baseGroup');

      __radius = Math.min(_width, _height)/2;

      var baseGroup = rootNode.select('.baseGroup');

      if(__firstDraw){
          baseGroup.attr('transform', 'translate('+ (_width/2) +','+ (_height/2) +')');
      }else{
          baseGroup.transition().duration(_transitionTime).attr('transform', 'translate('+ (_width/2) +','+ (_height/2) +')');
      }

      var arc = d3.svg.arc()
      .outerRadius(__radius - __radius*0.2);

      var pie = d3.layout.pie()
        .value(function(d) { return d.value; });

      data = sortData(data);
      drawArcs(data, baseGroup);

      __firstDraw = false;

      //**********************************************************************************
      // Internal Chart functions
      //**********************************************************************************
      function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
              return arc(i(t));
          };
      }
      function arcTweenOut(a) {
          a.startAngle = a.endAngle;
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
              return arc(i(t));
          };
      }

      function sortData(data) {
        data = data.sort(function (a, b){
          return b.value - a.value;
        });
        return data;
      }
      function drawArcs(data, baseGroup) {
        //**********************************************************************************
        // databind for both sets of arcs
        //**********************************************************************************
        var arcs = baseGroup.selectAll('.arc')
          .data(pie(data));

        //**********************************************************************************
        // Create new nodes when there is more data than nodes (Enter)
        //**********************************************************************************


        var arcEnter = arcs.enter();


        var groups = arcEnter.append('g').attr('class', 'arc');


        groups.append('path')
          .attr('d', function (d){
            var fakeD = {};
            if (__firstDraw){
              fakeD.startAngle = 0;
              fakeD.endAngle = 0;
              fakeD.value = d.value
            }else{
              fakeD.value = d.value;
              fakeD.startAngle = d.startAngle;
              fakeD.endAngle = d.startAngle
            }
            return arc(fakeD);
          })
          .each(function (d){
            var fakeD = {};
            if (__firstDraw){
              fakeD.startAngle = 0;
              fakeD.endAngle = 0;
              fakeD.value = d.value
            }else{
              fakeD.value = d.value;
              fakeD.startAngle = d.startAngle;
              fakeD.endAngle = d.startAngle
            }
            this._current = fakeD;
          })
          .style('fill', function (d, i){
            if (d.data.color){
              return d.data.color;
            }else{
              return _colors[i % _colors.length]
            }
          });




        //**********************************************************************************
        // Exit
        //**********************************************************************************
        arcs.exit()
          .attr('class', 'kill').select('path')
          .transition()
          .duration(_transitionTime)
          .attrTween('d', arcTweenOut)
          .each('end', function (){
            this.remove();
          });




        //**********************************************************************************
        // Merge (update after enter and exit)
        //**********************************************************************************


        var pieArcs = rootNode.selectAll('.arc').select('path');
        pieArcs
          .transition()
          .duration(_transitionTime)
          .attrTween('d', arcTween)
          .style('fill', function (d, i){
            if (d.data.color){
              return d.data.color;
            }else{
              return _colors[i % _colors.length]
            }
          });
      }

    });
  }

  //----------------------------------------------------------------------------------
  // Helper Functions
  //----------------------------------------------------------------------------------


  //-------------------------------------------------
  // Getters and setters for public variables
  //-------------------------------------------------
  chart.width = function (value){
      if (!arguments.length){
          return _width;
      }
      _width = value;
      return chart;
  };

  chart.height = function (value){
      if (!arguments.length){
          return _height;
      }
      _height = value;
      return chart;
  };

  chart.padding = function (paddingObj){
      if (!arguments.length){
          return _padding;
      }
      // TODO: Need additional logic
      _padding = padddingObj;
      return chart;
  };

  chart.colors = function (colorArray){
      if (!arguments.length){
          return _colors;
      }
      _colors = colorArray;
      return chart;
  };

  chart.transitions = function (time){
      if (!arguments.length){
          return _transitionTime
      }
      _transitionTime = time;
      return chart;
  };





  //**********************************************************************************
  // Final Return (allows method chaining)
  //**********************************************************************************
  return chart;
};
