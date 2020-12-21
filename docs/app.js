window.onload = function() {
    const screenshotButton = document.querySelector("#screenshot-button");
    const img = document.querySelector("#screenshot-img");
    const video = document.querySelector("#video");
    const textarea = document.querySelector("#recognized-text");
    const canvas = document.createElement("canvas");

    initOcr = async () => {
      const worker = Tesseract.createWorker({
        logger: m => console.log(m)
      });
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      return worker;
    }

    const ocrPromise = initOcr();

    doOcr = () => {
      (async () => {
        const ocr = await ocrPromise;
        const { data: { text } } = await ocr.recognize(canvas);
        textarea.innerHTML = text;
        console.log(text);
      })();  
    }

    screenshotButton.onclick = video.onclick = function () {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      // Other browsers will fall back to image/png
      img.src = canvas.toDataURL("image/webp");
      doOcr();
    };

    const constraints = {
      video: { facingMode: "environment" }  // prefer back camera
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
    });

    // await worker.terminate();
};