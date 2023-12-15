class NeuralNetwork {
    constructor(inputLen, outputLen) {
        this.inputLen = inputLen
        this.outputLen = outputLen
        
        this.weights = Array.from({ length: this.outputLen }, () =>
            Array.from({ length: this.inputLen }, () => Math.random())
        )
        
        this.learningRate = 0.1
        this.points = []
    }

    propagate(inputs) {
        const output = new Array(this.outputLen)

        for (let i = 0; i < this.outputLen; i++) {
            output[i] = 0

            for (let j = 0; j < this.inputLen; j++) {
                output[i] += this.weights[i][j] * inputs[j]
            }

            output[i] = this.sigmoid(output[i])
        }

        return output
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x))
    }

    train(inputs, target) {
        const output = this.propagate(inputs)
        const errors = new Array(this.outputLen)

        for (let i = 0; i < this.outputLen; i++) {
            errors[i] = target[i] - output[i]

            for (let j = 0; j < this.inputLen; j++) {
                this.weights[i][j] += this.learningRate * errors[i] * output[i] * (1 - output[i]) * inputs[j]
            }
        }
    }
}

const trainingData = [
    { x: -0.5, y: -0.5, label: "blue" },
    { x: 0.5, y: -0.5, label: "red" },
    { x: -0.5, y: 0.5, label: "green" },
    { x: 0.5, y: 0.5, label: "purple" }
];

function train() {
    for (let i = 0; i < 10000; i++) {
        const data = trainingData[Math.floor(Math.random() * trainingData.length)]

        neuralNetwork.train([data.x, data.y], encode(data.label))
    }

    alert("Training complete");
}

function reset() {
    neuralNetwork = new NeuralNetwork(2, 4)
}


const canvas = document.getElementById("graph")
const ctx = canvas.getContext("2d")
const pointRadius = 5

let neuralNetwork = new NeuralNetwork(2, 4)

function classifyPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawAxes()

    this.points = []

    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 2 - 1
        const y = Math.random() * 2 - 1
        const output = neuralNetwork.propagate([x, y])
        const predictedLabel = decode(output)

        drawPoint(x, y, predictedLabel)

        points.push({ x, y, predictedLabel })
    }
}

function encode(label) {
    const encoding = {
        blue: [1, 0, 0, 0],
        red: [0, 1, 0, 0],
        green: [0, 0, 1, 0],
        purple: [0, 0, 0, 1]
    }

    return encoding[label]
}

function decode(output) {
    const labels = ["blue", "red", "green", "purple"]
    const maxIndex = output.indexOf(Math.max(...output))

    return labels[maxIndex]
}

function drawPoint(x, y, color) {
    ctx.beginPath()

    ctx.arc(
        ((x + 1) * canvas.width) / 2,
        canvas.height - ((y + 1) * canvas.height) / 2,
        pointRadius,
        0,
        2 * Math.PI
    )

    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
}

function drawAxes() {
    const canvasHalfWidth = canvas.width / 2
    const canvasHalfHeight = canvas.height / 2
    
    ctx.beginPath()
    ctx.fillStyle = `rgba(0,255,0,0.2)`
    ctx.fillRect(0, 0, canvasHalfWidth, canvasHalfHeight)
    ctx.fillStyle = `rgba(225,0,255,0.2)`
    ctx.fillRect(canvasHalfWidth, 0, canvasHalfWidth, canvasHalfHeight)
    ctx.fillStyle = `rgba(0,0,255,0.2)`
    ctx.fillRect(0, canvasHalfHeight, canvasHalfWidth, canvasHalfHeight)
    ctx.fillStyle = `rgba(255,0,0,0.2)`
    ctx.fillRect(canvasHalfWidth, canvasHalfHeight, canvasHalfWidth, canvasHalfHeight)
    
    ctx.moveTo(0, canvas.height / 2)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.strokeStyle = "black"
    ctx.stroke()
    ctx.closePath()
}
