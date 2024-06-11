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

  // Menggunakan fungsi softmax untuk normalisasi hasil prediksi
  const softmax = (arr) => {
    const expArr = arr.map((val) => Math.exp(val));
    const sumExpArr = expArr.reduce((a, b) => a + b, 0);
    return expArr.map((val) => val / sumExpArr);
  };

  const softmaxPrediction = softmax(Array.from(predictionData)); // Normalisasi hasil prediksi

  const classes = ['normal', 'dry', 'oily'];
  const classResult = tf.argMax(prediction, 1).dataSync()[0]; // dapatkan indeks prediksi tertinggi
  const label = classes[classResult]; // dapatkan label berdasarkan indeks

  // Mengonversi hasil softmax ke persentase
  const predictionPercentages = softmaxPrediction.map((val) => val * 100);

  // Mengambil nilai tertinggi dan membulatkannya hingga dua angka di belakang koma
  const highestPrediction = Math.max(...predictionPercentages);
  const roundedHighestPrediction = highestPrediction.toFixed(2);

  return { prediction: predictionPercentages, highestPrediction: roundedHighestPrediction, label }; // kembalikan hasil prediksi dalam persen, nilai tertinggi, dan label
};
 
export default predictClassification;