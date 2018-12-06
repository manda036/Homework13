function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(data => {
    var sample_metadata = d3.select("#sample-metadata");
    sample_metadata.html("");
    Object.entries(data).forEach(([key, value]) => {
      sample_metadata.append("h6").text(`${key}, ${value}`)
    });
  });
 }


function buildCharts(sample) {
  d3.json(`samples/${sample}`).then(function (response) {
    // console.log(response);
    // var finalData = [];
    // response.sample_values.forEach((data, i) => {
    //   var dataRearranged = {
    //     id: response.otu_ids[i],
    //     labels: response.otu_labels[i],
    //     values: data};
    //   finalData.push(dataRearranged);
    // });
    // console.log(finalData);
    var sample_ids = response.otu_ids;
    var sample_values = response.sample_values;
    var sample_labels = response.otu_labels;
    var trace = {
      x: sample_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        size: response.sample_values,
        color: sample_ids
      },
      text: sample_labels
    };
    Plotly.newPlot("bubble", [trace]);
    
    var slicedValues = sample_values.slice(0, 10);
    var slicedLabels = sample_labels.slice(0, 10);
    var slicedIds = sample_ids.slice(0, 10);
    var pie_data = {
    values: slicedValues,
    labels: slicedIds,
    text: slicedLabels,
    type: "pie"
  };
    var layout = {
      showlegend: true
      }
  Plotly.newPlot("pie", [pie_data], layout);
});
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
      });
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    });
  }
// Use the first sample from the list to build the initial plots
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
