const tf = require('@tensorflow/tfjs-node');
 
async function predictClassification(model, image) {
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat()
 
  const label = model.predict(tensor);
  
 
  return { label };
}
 
module.exports = predictClassification;