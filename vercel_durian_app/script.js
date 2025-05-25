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
      switch (data.result) {
        case 'raw':
          result.innerText = "ทุเรียนยังดิบอยู่ ❌";
          break;
        case 'ready':
          result.innerText = "ทุเรียนพร้อมตัด ✅";
          break;
        case 'ripe':
          result.innerText = "ทุเรียนสุกแล้ว 🍽️";
          break;
        default:
          result.innerText = "ไม่สามารถระบุได้ ⚠️";
      }
    })
    .catch(() => {
      result.innerText = "เกิดข้อผิดพลาดในการเชื่อมต่อ ❌";
    });
  }, 'image/jpeg');
}
