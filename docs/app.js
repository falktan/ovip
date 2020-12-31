window.onload = async function() {
  const MIN_CONFIDENCE = 50;  // between 0 and 100.
  const video = document.querySelector("#video");
  const videoContainer = document.querySelector(".video-container");
  const canvas = document.createElement("canvas");
  const backButton = document.querySelector("#back-button")

  function registerServiceWorker() {
    console.log('Registering service worker.');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      })
      .catch(function(error) {
        console.log('Service worker registration failed, error:', error);
      });
    } else {
      console.log('Service Worker feature not supported');
    }
  }

  registerServiceWorker();
  
  initOcr = async () => {
    const worker = Tesseract.createWorker({});
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    return worker;
  }

  const ocrPromise = initOcr();

  function createTextOverlays(ocrResult) {
    const matches = ocrResult.lines
                    .map(line => line.words)
                    .flat()
                    .filter(match => match.confidence > MIN_CONFIDENCE);

    for(const match of matches) {
      const {x0, y0, x1, y1} = match.bbox;
      const scale = video.clientWidth / video.videoWidth;
      // the video may exceed the video-container either in x- or in y-direction
      // the video is placed so that the video and the video-container have the same center
      const overlap_x = (video.clientWidth - videoContainer.clientWidth) / 2;
      const overlap_y = (video.clientHeight - videoContainer.clientHeight) / 2;
      const left = x0 * scale - overlap_x;
      const top = y0 * scale - overlap_y;
      const width = (x1-x0) * scale
      const height = (y1-y0) * scale

      const $div = $('<div class="recognized-text"></div>')
      $div.css({
        "background-color": "white", 
        "opacity": "0.5", 
        "position": "absolute", 
        "left": `${left}px`,
        "top": `${top}px`,
        "width": `${width}px`,
        "height": `${height}px`,
        "font-size": "larger"
      });
      $div.text(match.text);
      $(".video-container").append($div);  
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