// console.log('hello')

function MetaDataSample(sample) {

    // Build function to build metadata panel

    console.log(sample);

    // Use d3 to select panel with sample data id

    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    panel.html("");

    // Use 'd3.json' to grab metadata to take sample

    d3.json("samples.json").then((samplesData) => {
        //reading the data
        console.log(samplesData)
        samplesData.metadata.forEach((metadatum) => {
            if (sample.id == metadatum.id) {

                // Use `Object.entries` to add each key and value pair to the panel

                Object.entries(metadatum).forEach(([key, value]) => {
                    panel.append("h6").text(`${key}: ${value}`);

                    // Console log key and value

                    console.log(key, value)
                });
            }
        });
    }); //end of d3.js promise

}


function ChartBuild(sample) {

    // Build Bubble Chart using sample data  

    var bubbleLayout = {
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" }
    };

    var bubbleData = [{
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: "markers",
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
            colorscale: "Earth"
        }
    }];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    sample_values = sample.sample_values.slice(0, 10);
    otu_ids = sample.otu_ids.slice(0, 10);
    otu_labels = sample.otu_labels.slice(0, 10);
    var trace1 = {
        labels: otu_ids,
        hovertext: otu_labels,
        hoverinfo: "hovertext",
        values: sample_values,
        type: 'pie'
    };
    var data = [trace1];
    var layout = {
        title: "'Pie' Chart",
    };
    Plotly.newPlot("pie", data, layout);
}


function Init() {

    // Grab a reference to the dropdown select element

    var selector = d3.select("#selDataset");

    // Use sample names list to populate select options

    d3.json("/samples.json").then((samplesData) => {
        samplesData.samples.forEach((sample) => {
            selector
                .append("option")
                .text(sample.id)
                .property("value", JSON.stringify(sample));
        });
        // Use first sample from list to build initial plots

        const firstSample = samplesData.samples[0];
        ChartBuild(firstSample);
        MetaDataSample(firstSample);
    });
}

function ChangeOption(newSample) {

    // Grab data each time sample is selected

    var Sample = JSON.parse(newSample);
    ChartBuild(Sample);
    MetaDataSample(Sample);
}
// // // Initialize dashboard

Init();