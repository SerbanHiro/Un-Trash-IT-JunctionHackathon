const TARGET_CLASSES = {
    trash: {
        0: "Empty Trash Bin",
        1: "Full Trash Bin"
    }
};

function getClassLabels(value) {
    if (TARGET_CLASSES.hasOwnProperty(value)) {
        return TARGET_CLASSES[value];
    } else {
        console.error("Invalid value:", value);
        return {};
    }
}

let imageLoaded = false;
$("#image-selector").change(function () {
    imageLoaded = false;
    let reader = new FileReader();

    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
        imageLoaded = true;
    };

    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});

let model;
let modelLoaded = false;
$(document).ready(async function () {
    const selectedOption = $("#prediction-type").val();
    loadModel(selectedOption);
});

const predictionTypeSelect = document.getElementById("prediction-type");
predictionTypeSelect.addEventListener("change", async function () {
    const selectedOption = predictionTypeSelect.value;
    loadModel(selectedOption);
});

function loadModel(selectedOption, fragments = null, modelSize = null, arrayLength = null) {
    modelLoaded = false;
    $('.progress-bar').show();

    if (selectedOption === undefined) {
        selectedOption = "Trash";
    }

    console.log("Loading model...");
    const currentPath = window.location.pathname;
    var defaultPath = `model/${selectedOption}/model.json`;

    if (currentPath.includes("fragmentation")) {
        defaultPath = `../model/${selectedOption}/model.json`;
    }

    tf.loadGraphModel(defaultPath)
        .then((loadedModel) => {
            model = loadedModel;
            console.log("Model loaded.");
            $('.progress-bar').hide();
            modelLoaded = true;
        })
        .catch((error) => {
            console.error("Error loading model:", error);
            $('.progress-bar').hide();
        });
}

async function renderImage(image, modelSize, selectedOption) {
    console.log("Loading image...");
    let tensor = tf.browser.fromPixels(image, 3)
        .resizeNearestNeighbor(modelSize)
        .expandDims()
        .toFloat()
        .reverse(-1);

    let predictions = await model.predict(tensor).data();
    console.log(predictions);

    let top5 = Array.from(predictions)
        .map(function (p, i) {
            return {
                probability: p,
                className: getClassLabels(selectedOption)[i]
            };
        }).sort(function (a, b) {
            return -1;
        }).slice(0, 2);

    top5.forEach(function (p, i) {
        $("#prediction-list").append(`<div>${p.className}: ${p.probability.toFixed(6) * 100}%</div>`);
        console.log(p.className);
    });
}

$("#predict-button").click(async function () {
    if (!modelLoaded) {
        alert("The model must be loaded first");
        return;
    }

    if (!imageLoaded) {
        alert("Please select an image first");
        return;
    }

    let image = $('#selected-image').get(0);
    const selectedOption = $("#prediction-type").val();
    var modelSize = [224, 224];

    renderImage(image, modelSize, selectedOption);
});
