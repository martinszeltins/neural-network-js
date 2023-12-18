"use strict";

class NeuralNetwork {
    constructor() {
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
    propagate(inputs) {
        const output = [0, 0, 0, 0];

        for (let i = 0; i < this.outputNeuronCount; i++) {
            output[i] = 0;

            for (let j = 0; j < this.inputNeuronCount; j++) {
                output[i] += this.weights[i][j] * inputs[j];
            }

            output[i] = this.sigmoid(output[i]);
        }

        return output;
    }

    /**
     * The Sigmoid function is used to convert numbers to probabilities.
     * It works by squashing numbers to a range between 0 and 1.
     */
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    /**
     * Training works by propagating an input through the network,
     * comparing the output to the expected output, and adjusting
     * the weights accordingly.
     */
    train(inputs, target) {
        const output = this.propagate(inputs);
        const errors = [0, 0, 0, 0];

        for (let i = 0; i < this.outputNeuronCount; i++) {
            errors[i] = target[i] - output[i];

            for (let j = 0; j < this.inputNeuronCount; j++) {
                this.weights[i][j] += this.learningRate * errors[i] * output[i] * (1 - output[i]) * inputs[j];
            }
        }
    }
}

const trainingData = [
    { x: -0.5, y: -0.5, label: 'blue' },
    { x: 0.5, y: -0.5, label: 'red' },
    { x: -0.5, y: 0.5, label: 'green' },
    { x: 0.5, y: 0.5, label: 'purple' }
];

const train = () => {
    debugger;
    for (let i = 0; i < 10000; i++) {
        // Pick a random point from the training data
        const data = trainingData[Math.floor(Math.random() * trainingData.length)];

        neuralNetwork.train([data.x, data.y], encode(data.label));
    }

    alert("Training complete");
};

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");
const pointRadius = 5;

let neuralNetwork = new NeuralNetwork();

console.log(JSON.stringify(neuralNetwork, null, 2));

const classifyPoints = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawAxes();

    debugger;
    neuralNetwork.points = [];

    // Generate 100 random points
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;

        /**
         * The output of the neural network is a tuple of four numbers representing
         * the probability that the input belongs to a particular class -
         * in our case blue, red, green, or purple.
         */
        const output = neuralNetwork.propagate([x, y]);
        const predictedLabel = decode(output);

        drawPoint(x, y, predictedLabel);

        neuralNetwork.points.push({ x, y, predictedLabel });
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
const encode = (label) => {
    const encoding = {
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
const decode = (output) => {
    const labels = ['blue', 'red', 'green', 'purple'];
    const maxIndex = output.indexOf(Math.max(...output));

    return labels[maxIndex];
};

const drawPoint = (x, y, color) => {
    ctx.beginPath();
    ctx.arc(((x + 1) * canvas.width) / 2, canvas.height - ((y + 1) * canvas.height) / 2, pointRadius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
};

const drawAxes = () => {
    const canvasHalfWidth = canvas.width / 2;
    const canvasHalfHeight = canvas.height / 2;
    
    ctx.beginPath();
    ctx.fillStyle = `rgba(0,255,0,0.2)`;
    ctx.fillRect(0, 0, canvasHalfWidth, canvasHalfHeight);
    ctx.fillStyle = `rgba(225,0,255,0.2)`;
    ctx.fillRect(canvasHalfWidth, 0, canvasHalfWidth, canvasHalfHeight);
    ctx.fillStyle = `rgba(0,0,255,0.2)`;
    ctx.fillRect(0, canvasHalfHeight, canvasHalfWidth, canvasHalfHeight);
    ctx.fillStyle = `rgba(255,0,0,0.2)`;
    ctx.fillRect(canvasHalfWidth, canvasHalfHeight, canvasHalfWidth, canvasHalfHeight);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
};
