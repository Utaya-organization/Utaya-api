import * as tf from "@tensorflow/tfjs-node"
async function loadModel() {
    return tf.loadLayersModel(process.env.MODEL_URL);
}

export default loadModel;