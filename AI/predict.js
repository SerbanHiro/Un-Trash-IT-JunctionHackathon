// Mapping of target classes for predictions
const TARGET_CLASSES = {
    trash: {
        0: "Empty Trash Bin",
        1: "Full Trash Bin"
    }
};

// Function to get class labels based on a given value
function getClassLabels(value) {
    const labels = TARGET_CLASSES[value];
    if (labels) {
        return labels;
    } else {
        console.error("Invalid value:", value);
        return {};
    }
}

// Flag to track if an image is loaded
let imageLoaded = false;

// Event handler for file input change (image selection)
$("#image-selector").change(async function () {
    imageLoaded = false;
    const file = $("#image-selector").prop('files')[0];

    if (file) {
        // Read the selected image file asynchronously and update the UI
        const dataURL = await readFileAsync(file);
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
        imageLoaded = true;
    }
});

// Async function to read a file and return its data URL
function readFileAsync(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.readAsDataURL(file);
    });
}

// Variables for the loaded model and its loading status
let model;
let modelLoaded = false;

// Initialization when the document is ready
$(document).ready(async function () {
    // Get the initial prediction type value
    const selectedOption = $("#prediction-type").val();
    // Load the model asynchronously
    await loadModel(selectedOption);
});

// Event listener for prediction type selection change
const predictionTypeSelect = document.getElementById("prediction-type");
predictionTypeSelect.addEventListener("change", async function () {
    // Get the new selected prediction type and load the corresponding model
    const selectedOption = predictionTypeSelect.value;
    await loadModel(selectedOption);
});

// Async function to load a TensorFlow.js model trained by Microsoft Azure Custom Vision AI
async function loadModel(selectedOption) {
    // Reset the model loading status and show progress bar
    modelLoaded = false;
    $('.progress-bar').show();

    // Default to "Trash" if no option is provided
    if (!selectedOption) {
        selectedOption = "Trash";
    }

    // Construct the path to the model file
    const defaultPath = `../model/${selectedOption}/model.json`;

    try {
        // Load the TensorFlow.js model
        model = await tf.loadGraphModel(defaultPath);
        console.log("Model loaded.");
    } catch (error) {
        // Log and handle errors during model loading
        console.error("Error loading model:", error);
    } finally {
        // Hide the progress bar regardless of success or failure
        $('.progress-bar').hide();
        // Update the model loading status
        modelLoaded = true;
    }
}

// Async function to render an image using the loaded model
async function renderImage(image, modelSize, selectedOption) {
    console.log("Loading image...");
    // Convert the image to a TensorFlow.js tensor
    let tensor = tf.browser.fromPixels(image, 3)
        .resizeNearestNeighbor(modelSize)
        .expandDims()
        .toFloat()
        .reverse(-1);

    // Make predictions using the loaded model and log the results
    let predictions = await model.predict(tensor).data();
    console.log(predictions);

    // Process and display the top predictions
    let top5 = Array.from(predictions)
        .map((p, i) => ({
            probability: p,
            className: getClassLabels(selectedOption)[i]
        }))
        .sort((a, b) => -1)
        .slice(0, 2);

    // Display predictions in the UI and log class names
    top5.forEach((p, i) => {
        $("#prediction-list").append(`<div>${p.className}: ${p.probability.toFixed(6) * 100}%</div>`);
        console.log(p.className);
    });
}

// Event listener for the predict button click
$("#predict-button").click(async function () {
    // Check if the model and image are loaded before making predictions
    if (!modelLoaded) {
        alert("The model must be loaded first");
        return;
    }

    if (!imageLoaded) {
        alert("Please select an image first");
        return;
    } else {
		$("#prediction-list").empty();
	}

    // Get the selected image and prediction type, then render predictions
    const image = $('#selected-image').get(0);
    const selectedOption = $("#prediction-type").val();
    const modelSize = [224, 224];

    await renderImage(image, modelSize, selectedOption);
});
