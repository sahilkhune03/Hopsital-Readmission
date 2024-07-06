function createAgeChart() {

    //this function takes the data of a specific column and returns an object
    //with the count of each unique value

    function getColumnData(colnum) {
        let answer = []

        for (i=0; i < data.length; i++) {
            answer.push(data[i][colnum])
        }

    let count =  answer.reduce(function (acc, curr) {
        if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
        } else {
        acc[curr] += 1;
        }
    
        return acc;
    }, {});

        return count
    }


//defining the age group labels
let ageGroups = ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100']

//defining the html id where the graph will be drawn
let ctx = document.getElementById('myChart1')

//assemble the data into objects
let ageData = [{
    x: ageGroups,
    y: Object.values(getColumnData(2)) ,
    type: 'bar',
    marker: {color: 'rgb(0,115,0)'}
}];

let layout = {
    title: 'Age Group Distribution',
    //height: 800,
    //width: 600,
    xaxis: {title: {text: 'Age Group'}},
    yaxis: {title: {text: 'Count'}}
}
//draw the graph
Plotly.newPlot(ctx, ageData, layout)

}

function createFeatureImportance() {
    //create our labels and values
    let labels = ['# of Lab Procedures', '# of Medications', 'Time in Hospital', 'Primary Diagnosis', 'Secondary Diagnosis', 'Tertiary Diagnosis']
    let values = importFeatures

    //identify html id where chart will be drawn
    let ctx = document.getElementById('myChart2')

    //assemble data into objects
    let importData = [{
        x: values.map(ele => ele * 100),
        y: labels,
        type: 'bar',
        orientation: 'h'
    }]

    let layout = {
        title: 'Features by Importance',
        //height: 800,
        //width: 800,
        xaxis: {range:[0, 100], title: {text: 'Percentage Importance'}},
        yaxis: {automargin: true},
        
    }

    //draw the graph
    Plotly.newPlot(ctx, importData, layout)

}

function createBubbleChart() {

    let labels = ['infectious and parasitic diseases', 'neoplasms', 'endocrine, nutritional, metabolic & immunity disorders', 
    'diseases of the blood and blood-forming organisms', 'mental disorders', 'diseases of the nervous system and sense organs',
    'diseases of the circulatory system', 'diseases of the respiratory system', 'diseases of the digestive system', 'diseases of the genitourinary system',
    'complications of pregnancy, childbirth and the puerperium', 'diseases of the skin and subcutaneuous tissue', 'diseases of the muscuskeletal system and connective tissue',
    'congenital anomalies', 'certain condtions originating in the perinatal period', 'symptoms, signs and ill-defined conditions', 'injury and poisoning']
    
    console.log(labels.length)
    let data = bubbleData.map(ele => ele[16] * 100)
    console.log(data.length)
    let ctx = document.getElementById('myChart3')

    let bubbleChartData = [{
        //x: labels,
        y: data,
        text: labels,
        mode: 'markers',
        marker: {
            size: data.map(ele => ele * 2),
            color: data,
            colorscale: 'Portland'
        }
    }]

    let bubbleChartLayout = {
        //height: 600,
        //width: 800,
        title: 'Diagnositc Group Readmission Percentage',
        xaxis: {automargin: true}
    }

    Plotly.newPlot(ctx, bubbleChartData, bubbleChartLayout)

    console.log(data)
}

function createPieChart() {
    var ctx = document.getElementById('resultChart');

    let pieData = [{
        values: [1,0],
        labels: ['% Likelihood Not Readmitted', '% Likelihood Readmitted'],
        type: 'pie',
        marker: {colors: ['rgb(56,75,126)', 'rgb(255,99,71)']}
    }]

    let layout = {
        //height: 800,
        //width: 600,

    }

    Plotly.newPlot(ctx, pieData, layout);
};

function updateChart(ctx, updateData) {
    // let newTitle = ''
    // if (updateData[0] > updateData[1]) {
    //     newTitle = 'This patient will likely not be readmitted'
    // }

    // else {
    //     newTitle = 'This patient will likely be readmitted'
    // };

    let update = {
        //title: newTitle,
        values: [updateData],
        marker: {colors: ['rgb(56,75,126)', 'rgb(255,99,71)']}

    }
    Plotly.restyle(ctx, update);
}

function predict() {
    
    let input = { //create a JSON object with the form data
        'num_lab_procedures': parseInt(d3.select('#numlab').node().value),
        'num_medications': parseInt(d3.select('#med').node().value),
        'time_in_hospital': parseInt(d3.select('#dayshosp').node().value),
        'diag_1': parseInt(d3.select('#diag1').node().value),
        'diag_2': parseInt(d3.select('#diag2').node().value),
        'diag_3': parseInt(d3.select('#diag3').node().value),
    }

    // declare endpoint
    let url = 'http://diabetespredictiondashboard-env.eba-ycspkapq.ca-central-1.elasticbeanstalk.com/predict'

    // create api params
    let params = {
        method: 'POST',
        headers: { "Content-Type": 'application/json'},
        body: JSON.stringify(input)
    }

    let ctx = document.getElementById('resultChart')

    // get prediction and update section
    d3.text(url, params).then(resp => JSON.parse(resp)).then(json => updateChart(ctx, json.result))

    

}

    
createPieChart();
createAgeChart();
createFeatureImportance();
createBubbleChart();
