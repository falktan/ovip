window.onload = function() {
    const screenshotButton = document.querySelector("#screenshot-button");
    const img = document.querySelector("#screenshot-img");
    const video = document.querySelector("#video");

    const canvas = document.createElement("canvas");

    screenshotButton.onclick = video.onclick = function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      // Other browsers will fall back to image/png
      img.src = canvas.toDataURL("image/webp");
    };

    const constraints = {
      video: true,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
    });

    const worker = Tesseract.createWorker({
      logger: m => console.log(m)
    });

    (async () => {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
      console.log(text);
      await worker.terminate();
    })();
};