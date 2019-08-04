// Brandon Coleman
// Data Analytics Bootcamp
// 8 - 3 - 2019
// Dashboard Homework

function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var defaulturl = "/metadata";

    d3.json(`${defaulturl}/${sample}`).then(function(data) {

        Object.entries(data).forEach(
            ([key, value]) => metadata.append("div").text(`${key}: ${value}`)
        );
    });


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

    var defaulturl = "/samples";

    // @TODO: Use `d3.json` to fetch the sample data for the plots

    d3.json(`${defaulturl}/${sample}`).then(function(data) {

        var values = data.sample_values;
        var labels = data.otu_ids;
        var hoverinfo = data.otu_labels;

        var layout = {
            "margins": {
                "top": 20
            }
        };

        // @TODO: Build a Bubble Chart using the sample data

        var bubble_data = [{
            "x": labels,
            "y": values,
            "mode": "markers",
            "type": "scatter",
            "marker": {
                "color": labels,
                "size": values
            }
        }]

        Plotly.newPlot("bubble", bubble_data, layout);

        // @TODO: Build a Pie Chart
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).

        var pie_data = [{
            "values": values.slice(0, 10),
            "labels": labels.slice(0, 10),
            "hoverinfo": hoverinfo.slice(0, 10),
            "type": "pie"
        }]

        Plotly.newPlot("pie", pie_data, layout);
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

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();