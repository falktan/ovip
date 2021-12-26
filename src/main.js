import './main.css';

import $ from 'jquery';
import tesseract from 'tesseract.js';
import textFit from 'textfit';

window.onload = async function() {
  const MIN_CONFIDENCE = 25;  // between 0 and 100.
  const video = document.querySelector("#video");
  const videoContainer = document.querySelector(".video-container");
  const crosshair = document.querySelector("#crosshair");
  const canvas = document.createElement("canvas");
  const usageHint = document.querySelector("#usage-hint");
  const backButton = document.querySelector("#back-button");
  let state="video"  // video | processing | finished

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js')
      .catch(function(error) {
        console.log('Service worker registration failed, error:', error);
      });
    } else {
      console.log('Service Worker feature not supported');
    }
  }

  registerServiceWorker();

  async function initOcr() {
    const worker = tesseract.createWorker({});
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    return worker;
  }

  const ocrPromise = initOcr();

  function createTextOverlays(matches) {
    for(const match of matches) {
      const {x0, y0, x1, y1} = match.bbox;
      const {top: crossTop, left: crossLeft, bottom: crossBottom, right: crossRight} = crosshair.getBoundingClientRect();
      const {top: contTop, left: contLeft, bottom: contBottom, right: contRight} = videoContainer.getBoundingClientRect();
      const scale = video.clientWidth / video.videoWidth;

      const left = crossLeft - contLeft + x0 * scale;
      const top = crossTop - contTop + y0 * scale;
      const width = (x1-x0) * scale
      const height = (y1-y0) * scale

      const $div = $('<div class="recognized-text"></div>')
      $div.css({
        "background-color": "white",
        "opacity": "0.9",
        "position": "absolute",
        "left": `${left}px`,
        "top": `${top}px`,
        "width": `${width}px`,
        "height": `${height}px`,
        "font-size": "larger",
        "white-space": "pre"  // keep trailing whitespace
      });
      // add a space so that words do not stick together if
      // text from severals divs is selected
      $div.text($.trim(match.text) + ' ');
      $(videoContainer).append($div);
    }

    textFit($('.recognized-text'));
  }

  async function doOcr() {
    const scale = video.clientWidth / video.videoWidth;
    const {top: vTop, left: vLeft, bottom: vBottom, right: vRight} = video.getBoundingClientRect();
    const {top: cTop, left: cLeft, bottom: cBottom, right: cRight} = crosshair.getBoundingClientRect();

    const sourceTop = (cTop - vTop) / scale;
    const sourceLeft = (cLeft - vLeft) / scale;
    const sourceWidth = (cRight - cLeft) / scale;
    const sourceHeight = (cBottom - cTop) / scale;
    const destWidth = sourceWidth;
    const destHeight = sourceHeight;
    const destLeft = 0;
    const destTop = 0;

    canvas.width = destWidth;
    canvas.height = destHeight;

    canvas.getContext("2d").drawImage(video, sourceLeft, sourceTop, sourceWidth, sourceHeight,
      destLeft, destTop, destWidth, destHeight);

    const ocr = await ocrPromise;
    return ocr.recognize(canvas);
  }

  $(".video-container").on("click", async () => {
    if(state != "video") {
      return;
    }

    video.pause();
    $(usageHint).text('Processing image...');
    state="processing"  // video | processing | finished
    const {data: ocrResult} = await doOcr();

    const matches = ocrResult.lines.filter(match => match.confidence > MIN_CONFIDENCE)

    createTextOverlays(matches);

    if(matches.length > 0) {
      $(usageHint).text('You can now mark text');
    } else {
      $(usageHint).text('No text recognized. Please click "Back" and try again.');
    }

    $(backButton).show();
    state="finished"
  });

  function reset() {
    video.play();
    $(".recognized-text").remove();
    $(usageHint).text('Aim at text you want to use and touch the screen.');
    $(backButton).hide();
    state="video"
  }

  $(backButton).on("click", () => {
    reset();
  });

  const constraints = {
    video: { facingMode: "environment" }  // prefer back camera
  };

  video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);

  reset();
};