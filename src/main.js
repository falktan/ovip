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
    await worker.loadLanguage('eng+deu');
    await worker.initialize('eng+deu');

    return worker;
  }

  const ocrPromise = initOcr();

  function createTextOverlays(matches) {
    for(const match of matches) {
      const {x0, y0, x1, y1} = match.bbox;
      const {top: crossTop, left: crossLeft, bottom: crossBottom, right: crossRight} = crosshair.getBoundingClientRect();
      const {top: contTop, left: contLeft, bottom: contBottom, right: contRight} = videoContainer.getBoundingClientRect();
      const {scale} = getScale();

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
    const {top: crossTop, left: crossLeft, bottom: crossBottom, right: crossRight} = crosshair.getBoundingClientRect();
    const crossWidth = crossRight - crossLeft;
    const crossHeight = crossBottom - crossTop;
    const {scale, videoTop, videoLeft} = getScale();

    const sourceTop = (crossTop - videoTop) / scale;
    const sourceLeft = (crossLeft - videoLeft) / scale;
    const sourceWidth = crossWidth / scale;
    const sourceHeight = crossHeight / scale;
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

  /**
   * @returns
   * - scale: the factor by which the video is scaled to fit in the display
   * - videoTop: the top of the video in viewport coordinates, if it was not cropped
   * - videoLeft: the left of the video in viewport coordinates, if it was not cropped
   */
  function getScale() {
    const {top: contTop, left: contLeft, bottom: contBottom, right: contRight} = videoContainer.getBoundingClientRect();
    const contWidth = contRight - contLeft;
    const contHeight = contBottom - contTop;
    const contMidX = (contLeft + contRight) / 2;
    const contMidY = (contTop + contBottom) / 2;
    // video and video-container have the same center
    // the video either exceeds the container in horizontal OR vertical direction
    let scale, videoTop, videoLeft;
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const containerAspectRatio = contWidth / contHeight

    const exceedsHorizontally = videoAspectRatio > containerAspectRatio;

    if(exceedsHorizontally) {
      scale = contHeight / video.videoHeight;
      videoTop = contTop;
      videoLeft = contMidX - scale * video.videoWidth / 2;
    } else {
      scale = contWidth / video.videoWidth;
      videoTop = contMidY - scale * video.videoHeight / 2;
      videoLeft = contLeft;
    }

    return {scale, videoTop, videoLeft};
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
    $(usageHint).text('Aim at text you want to use and touch the screen. For long lines landscape orientation works better.');
    $(backButton).hide();
    state="video"
  }

  $(backButton).on("click", () => {
    reset();
  });

  const constraints = {
    video: {
      facingMode: "environment",  // prefer back camera
      // Some number larger than any expected resolution. Needed to get high resolutions.
      // Without this a default bad resolution would be used. See: https://stackoverflow.com/a/48546227/8195190
      width: 99999,
      height: 99999
    }
  };

  video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);

  reset();
};