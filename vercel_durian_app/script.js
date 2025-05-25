// script.js
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const result = document.getElementById('result');
const context = canvas.getContext('2d');

// เปิดกล้อง
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

function capture() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);

  canvas.toBlob(blob => {
    const formData = new FormData();
    formData.append('file', blob, 'durian.jpg');

    const BACKEND_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8000/predict'
  : 'https://durian-backend-render-1.onrender.com/predict';


    fetch(BACKEND_URL, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      result.innerText = data.result === 'ripe' ? "ทุเรียนสุกแล้ว" : "ยังไม่สุก";
    });
  }, 'image/jpeg');
}
