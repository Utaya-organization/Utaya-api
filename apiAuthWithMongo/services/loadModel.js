import tf from "@tensorflow/tfjs-node"
async function loadModel() {
    return tf.loadGraphModel("https://storage.googleapis.com/utaya-bucket-capstone/models/model.json");
}

export default loadModel;