import * as tf from "@tensorflow/tfjs-node"
async function loadModel() {
    return tf.loadLayersModel("https://storage.googleapis.com/utaya-bucket-capstone/models/model.json");
}

export default loadModel;