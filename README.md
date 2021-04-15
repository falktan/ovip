# OViP - Open Vision App
![OViP Icon](docs/images/icon_192.png)

The app is hosted on Github pages here: https://falktan.github.io/ovip/

This is a mobile app (as PWA) that provides features related to OCR and image recognition. A central design guideline is to provide this as an application without backend, to avoid the need to send (possibly private) fotos to a backend server and with the added benefit, that it also works offline.

## Sample usage

When opening the app, it allows to take a photo.

<img src="sample_usage/processing.jpg" height="400">

It then applies optical character recognition (OCR) to make the text available for usage.

<img src="sample_usage/finished.jpg" height="400">

Any text can be marked and be copied. If it is a URL also an option to directly open it in the browser is provided.

<img src="sample_usage/marked_url.jpg" height="400">

Similarily, if it is a phone number it can directly be called.

<img src="sample_usage/marked_number.jpg" height="400">

## Icon
The icon was purchased here ("royalty-free licence"; The author is Guilherme Schmitt on thenounproject.com):
https://thenounproject.com/term/anime/2972504/

## Motivation
This project was stated as a "capstone project" for a machine learning course on Udacity. A detailed motivation for this work has been provided in a [proposal document](proposal.md).

## Development

### Run local server

If you simply try to open the app from the file system, you will get an error about cors policies not supporting the `file://` protocoll. Hence, to test the app locally you need to run a local server, which simply serves the files in the `docs` folder.
There are many easy to use servers available. For instance using VS-Code, the following plugin provides a convinenent local server (also featureing dynamic reload upon changes to local files): Liveserver, ritwickdey.liveserver
