import tf from "@tensorflow/tfjs-node"
async function loadModel() {
    return tf.loadGraphModel("https://storage.googleapis.com/serta-mulia-valent-bucket/model-in-prod/model.json");
}

export default loadModel;