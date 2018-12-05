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
    console.log(response);
    var sample_ids = response.otu_ids;
    var sample_values = response.sample_values;
    var sample_labels = response.otu_labels;
    var trace = {
      x: sample_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        size: response.sample_values,
        color: response.sample_ids
      }
    };
    Plotly.newPlot("bubble", [trace]);
    
    const sorted = sample_values.sort();
    const sliced = sorted.slice(0, 10);
    var pie_data = {
    values: sliced,
    labels: sample_labels,
    type: "pie"
  };
    var layout = {
      showlegend: true,
      legend: {
        xanchor: "right"
      }
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
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
      });
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
