/**
 * Here we have a simple neural network that can classify points written in JavaScript.
 * All neural networks work on the same principle. They take an input, multiply it by
 * a weight, and pass it through an activation function to produce an output.
 *
 * Basically, a neural network is nothing more than a function that takes an input
 * and produces an output. The weights are the parameters of the function.
 *
 * This simple neural network helps in understanding the basic concepts of neural networks.
 *
 * By: @GrahamTheDev, 2023-10-13
 * https://dev.to/grahamthedev/a-noob-learns-ai-my-first-neural-networkin-vanilla-jswith-no-libraries-1f92
 */
var NeuralNetwork = /** @class */ (function () {
    function NeuralNetwork() {
        this.inputNeuronCount = 2; // x and y
        this.outputNeuronCount = 4; // blue, red, green, purple

        /**
         * Weights (also known as parameters) - internal variables of the neural network.
         * We have 4 output neurons, each of which has 2 weights (one for x and one for y).
         */
        this.weights = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
        ];

        // The network will learn 10% of the error each time it trains.
        this.learningRate = 0.1;

        // Points to be classified
        this.points = [];
    }

    /**
     * Propagate the inputs through the network and return the output.
     * We are going to multiply the inputs by the weights and then
     * pass the result through the sigmoid function.
     */
    NeuralNetwork.prototype.propagate = function (inputs) {
        var output = [0, 0, 0, 0];

        for (var i = 0; i < this.outputNeuronCount; i++) {
            output[i] = 0;

            for (var j = 0; j < this.inputNeuronCount; j++) {
                output[i] += this.weights[i][j] * inputs[j];
            }

            output[i] = this.sigmoid(output[i]);
        }

        return output;
    };

    /**
     * The Sigmoid function is used to convert numbers to probabilities.
     * It works by squashing numbers to a range between 0 and 1.
     */
    NeuralNetwork.prototype.sigmoid = function (x) {
        return 1 / (1 + Math.exp(-x));
    };

    /**
     * Training works by propagating an input through the network,
     * comparing the output to the expected output, and adjusting
     * the weights accordingly.
     */
    NeuralNetwork.prototype.train = function (inputs, target) {
        var output = this.propagate(inputs);
        var errors = [0, 0, 0, 0];

        for (var i = 0; i < this.outputNeuronCount; i++) {
            errors[i] = target[i] - output[i];

            for (var j = 0; j < this.inputNeuronCount; j++) {
                this.weights[i][j] += this.learningRate * errors[i] * output[i] * (1 - output[i]) * inputs[j];
            }
        }
    };

    return NeuralNetwork;
}());

var trainingData = [
    { x: -0.5, y: -0.5, label: "blue" },
    { x: 0.5, y: -0.5, label: "red" },
    { x: -0.5, y: 0.5, label: "green" },
    { x: 0.5, y: 0.5, label: "purple" }
];

var train = function () {
    for (var i = 0; i < 10000; i++) {
        // Pick a random point from the training data
        var data = trainingData[Math.floor(Math.random() * trainingData.length)];
        neuralNetwork.train([data.x, data.y], encode(data.label));
    }

    alert("Training complete");
};

debugger;

var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");
var pointRadius = 5;
var neuralNetwork = new NeuralNetwork();

var classifyPoints = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
    neuralNetwork.points = [];
    // Generate 100 random points
    for (var i = 0; i < 100; i++) {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        /**
         * The output of the neural network is a tuple of four numbers representing
         * the probability that the input belongs to a particular class -
         * in our case blue, red, green, or purple.
         */
        var output = neuralNetwork.propagate([x, y]);
        var predictedLabel = decode(output);
        drawPoint(x, y, predictedLabel);
        neuralNetwork.points.push({ x: x, y: y, predictedLabel: predictedLabel });
    }
};

/**
 * One-hot encoding.
 *
 * Convert a label (a string representing a category) into a numerical format
 * that the neural network can understand and process. We map four possible labels
 * to a tuple of four numbers. This allows the neural network to output probabilities
 * for each class independently, making it easier to determine which class the
 * input most likely belongs to.
 */
var encode = function (label) {
    var encoding = {
        blue: [1, 0, 0, 0],
        red: [0, 1, 0, 0],
        green: [0, 0, 1, 0],
        purple: [0, 0, 0, 1]
    };

    return encoding[label];
};

/**
 * Takes the output of the neural network, which is a tuple of four numbers,
 * and converts it back into a human-readable label. The neural network outputs
 * a probability for each class. We find the index of the highest value in the
 * output tuple, which corresponds to the most likely class.
 * We then map this index back to the corresponding label.
 */
var decode = function (output) {
    var labels = ['blue', 'red', 'green', 'purple'];
    var maxIndex = output.indexOf(Math.max.apply(Math, output));

    return labels[maxIndex];
};

var drawPoint = function (x, y, color) {
    ctx.beginPath();
    ctx.arc(((x + 1) * canvas.width) / 2, canvas.height - ((y + 1) * canvas.height) / 2, pointRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
};

var drawAxes = function () {
    var canvasHalfWidth = canvas.width / 2;
    var canvasHalfHeight = canvas.height / 2;
    
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,255,0,0.2)";
    ctx.fillRect(0, 0, canvasHalfWidth, canvasHalfHeight);
    ctx.fillStyle = "rgba(225,0,255,0.2)";
    ctx.fillRect(canvasHalfWidth, 0, canvasHalfWidth, canvasHalfHeight);
    ctx.fillStyle = "rgba(0,0,255,0.2)";
    ctx.fillRect(0, canvasHalfHeight, canvasHalfWidth, canvasHalfHeight);
    ctx.fillStyle = "rgba(255,0,0,0.2)";
    ctx.fillRect(canvasHalfWidth, canvasHalfHeight, canvasHalfWidth, canvasHalfHeight);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
};
