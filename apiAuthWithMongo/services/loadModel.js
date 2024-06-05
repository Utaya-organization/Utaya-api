const tf = require('@tensorflow/tfjs-node');
async function loadModel() {
    return tf.loadGraphModel("../model/model.json");
}

module.exports = loadModel;