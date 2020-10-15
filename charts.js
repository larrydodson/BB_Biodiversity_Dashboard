//BBBio, Belly Button Biodiversity
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        console.log(data)

        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        PANEL.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
        // 3. Create a variable that holds the samples array. 
        var metadata = data.metadata;
        // 4. Create a variable that filters the samples for the object with the desired sample number.
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        // 5. Create a variable that holds the first sample in the array.
        var result = resultArray[0];

        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var ids = data.samples[0].otu_ids;
        var labels = data.samples[0].otu_labels.slice(0, 10);
        var sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();

        // 7. Create the yticks for the bar chart.
        // Hint: Get the the top 10 otu_ids and map them in descending order  
        //  so the otu_ids with the most bacteria are last. 
        var OTU_top = (data.samples[0].otu_ids.slice(0, 10)).reverse();
        var OTU_id = OTU_top.map(d => "OTU " + d);
        var labels = data.samples[0].otu_labels.slice(0, 10);

        //**var yticks =

        // 8. Create the trace for the bar chart. 
        var trace = {
            x: sampleValues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'deepblue'
            },
            type: "bar",
            orientation: "h",
        };

        var barData = [trace];

        // 9. Create the layout for the bar chart. 
        var barLayout = {
            title: "Top 10 OTU Bacteria Cultures<br>(Operational Taxonomic Units)",
            yaxis: {
                tickmode: "linear",
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: {
                l: 100,
                r: 50,
                t: 100,
                b: 30
            }
        };
        // 10. Use Plotly to plot the data with the layout. 
        Plotly.newPlot("bar", barData, barLayout);



        // Building a Belly Button Bubble Chart
        // 1. Create the trace for the bubble chart.
        var trace1 = {
            x: ids,
            y: sampleValues,
            //x: samples.otu_ids,
            //y: samples.sample_values,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: ids,
                colorscale: 1,
                //size: size,
                sizeref: 0.2,
                sizemode: 'area',
            },
            text: labels
        };

        var bubbleData = [trace1]

        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
            title: "Bacteria Cultures per Sample (OTU)",
            xaxis: { title: "OTU ID" },

            height: 600,
            width: 1100
        };

        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);


        // Building a Washing Frequency Gauge Chart
        // 4. Create the trace for the gauge chart.
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)

        var trace2 = {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: `Weekly Washing Frequency<br>Scrubs per Week` },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10], tickcolor: 'darkblue' },
                bar: { color: 'black' },
                bgcolor: "white",
                borderwidth: 1,
                bordercolor: "black",
                steps: [
                    { range: [0, 2], color: "salmon" },
                    { range: [2, 4], color: "powderblue" },
                    { range: [4, 6], color: "lightsteelblue" },
                    { range: [6, 8], color: "steelblue" },
                    { range: [8, 10], color: "cadetblue" }
                ]
            }
        };

        var gaugeData = [trace2];

        // 5. Create the layout for the gauge chart.
        var gaugeLayout = {
            width: 500,
            height: 400,
            margin: { t: 20, b: 40, l: 60, r: 100 },
            paper_bgcolor: "rgba(0,0,0,0)",
            font: { color: "black", family: "Arial" }
        };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    });
}