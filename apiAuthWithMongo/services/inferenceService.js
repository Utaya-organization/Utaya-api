import tf from "@tensorflow/tfjs-node"


const predictClassification = async (model, image) => {
  const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([299, 299]) // ubah ukuran gambar ke [299, 299]
      .toFloat() // ubah ke float
      .div(tf.scalar(255.0)) // normalisasi gambar
      .expandDims(); // tambahkan dimensi batch

  const prediction = model.predict(tensor);
  const predictionData = prediction.dataSync(); // Ambil data prediksi sebagai array

  const classes = ['normal', 'kering', 'berminyak'];
  const classResult = tf.argMax(prediction, 1).dataSync()[0]; // dapatkan indeks prediksi tertinggi
  const label = classes[classResult]; // dapatkan label berdasarkan indeks

  return { prediction: predictionData, label }; // kembalikan hasil prediksi dan label
};
 
export default predictClassification;