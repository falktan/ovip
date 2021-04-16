# OViP - Open Vision App
![OViP Icon](docs/images/icon_192.png)

The app is hosted on Github pages here: https://falktan.github.io/ovip/
To use the app, open this link from your mobile phone.
This app can also be installed making it offline available. Simply open the link and from the menu select "install app".

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

This project uses webpack (for an overview of how to use, see https://webpack.js.org/guides/getting-started/)

Install Node (>=14.x.x).

To install all dependencies run

```npm install```

Then to build the packaged app via webpack run

```npm run build```

This creates a dist folder with all files needed for the app.
To try the app locally run

```npm start```

This starts a local server on ```http://127.0.0.1:8080```.

## Release Process
The app is hosted on github pages. For this the build app needs to be checked into source code management in a folder ```docs```. At the same time the build app is generated using webpack. Simply making the generated code part of the repository is problematic, as it can cause merge conflicts. To avoid this the build and release process works as follows:

* Any ready to use code is merged into main
* To "release" the current version of the main branch, it is merged into the release branch
* After merging into the release branch the code is build there and the created ```dist``` folder is renamed to ```docs```. This is checked in.

That means, that the release branch is the only branch that has a ```docs```-folder. This should never cause merge conflicts, as any code comes from the same branch ```main``` and any updates to the generated code happen exclusively on the release branch.