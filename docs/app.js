window.onload = async function() {
    const video = document.querySelector("#video");
    const canvas = document.createElement("canvas");
    const backButton = document.querySelector("#back-button")

    initOcr = async () => {
      const worker = Tesseract.createWorker({});
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      return worker;
    }

    const ocrPromise = initOcr();

    function createTextOverlays(ocrResult) {
      for(let line of ocrResult.lines) {
        let $div = $('<div class="recognized-text"></div>')
        $div.css({
          "background-color": "white", 
          "opacity": "0.2", 
          "position": "absolute", 
          "left": line.baseline.x0,
          "top": line.baseline.y0,
          "width": line.bbox.x1,
          "font-size": "larger"
        });
        $div.text(line.text);
        $("body").append($div);        
      }
    }

    doOcr = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      const ocr = await ocrPromise;
      return ocr.recognize(canvas);
    }

    $(".mid-area").click(async () => {
      video.pause();
      const {data: ocrResult} = await doOcr();

      console.log(ocrResult);
      createTextOverlays(ocrResult)
    });

    backButton.onclick = () => {
      video.play();
      $(".recognized-text").remove();
    }

    const constraints = {
      video: { facingMode: "environment" }  // prefer back camera
    };

    video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
};