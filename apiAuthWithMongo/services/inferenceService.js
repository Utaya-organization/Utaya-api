import tf from "@tensorflow/tfjs-node"


async function predictClassification(model, image) {
  // if (!model || !model.predict) {
  //   throw new Error('Model belum dimuat atau tidak valid');
  // }
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat()
 
  const prediction = model.predict(tensor);
 
  // const classes = ['kering', 'basah', 'berminyak'];
 
  // const classResult = tf.argMax(prediction, 1).dataSync()[0];
  // const label = classes[classResult];
  
 
  return { prediction };
}
 
export default predictClassification;