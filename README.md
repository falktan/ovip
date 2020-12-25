# OViP - Open Vision App
![OViP Icon](docs\images\icon_192.png)

The app is hosted on Github pages here: https://falktan.github.io/ovip/

This project aims to build a mobile app (as PWA) that provides features related to OCR and image recognition. A central design guideline is to build this as an application without backend, to avoid the need to send (possibly private) fotos to a backend server.

A detailed discussion on why this might be a good idea and what the initial scope of this project is follows.
This project was stated as a "capstone project" for a machine learning course on Udacity. What follows is pretty much the content of the "capstone proposal", which details the goal and outlines the motivation and plan to achieve it.

## Icon
The icon was purchased here ("royalty-free licence"; The author is Guilherme Schmitt on thenounproject.com):
https://thenounproject.com/term/anime/2972504/

## Introduction

When thinking about what project to work on, I discussed the topic with several friends and colleagues. I did some research on what is already available and what really adds value, already ruling out some first ideas. The present proposal is the result of careful analysis on what can work, provides real value and might even become a long-term project to be continued even after finalizing the Udacity training program. I am aware, that the machine learning portion of it and the parts on algorithmic challenges is relatively limited. However, I hope that this proposal still qualifies as a capstone project, as it shows that I understand current technologies surrounding machine learning and as it can be a valuable contribution to the open source community in particular for developers interested in the topic, that would prefer to develop mobile apps or to work with JavaScript.
Overview

I would like to build an application suitable for mobile devices that allows to conveniently interact with text obtained from a photo. Such software is already available and is called optical character recognition (OCR). However, any solutions I found have one or several of the following drawbacks
* Data needs to be sent to a backend server
  * Missing data avoidance: This allows the provider of the backend to access the photos (which is to some extend in conflict with the concept of GDPR of data avoidance (further discussed below))
  * This means that the service is only available with an internet connection (particularly annoying if you are abroad and want to scan a Wifi code)
  * Scaling: The more users use this app the more data processing power needs to be provided by the backend server
* Limited to one use case
  * Many apps are limited to OCR and only allow to copy the text to a clipboard
  * Some apps allow to open a URL, some allow to read a Wifi code, others allow you to dial a scanned number, but you need one app per use case, which is inconvenient
* Not available for mobile devices
* Not FOSS: It is desirable to build free open source software (FOSS), so that anyone can contribute, anyone can use it for free, anyone can inspect the code, no commercial interests dictate design decisions (like sending the photos to a backend server).

I would like to start filling this gap. This proposal describes the steps towards a “minimum viable product” that works without backend, is FOSS and implements a small number of first use cases.
After this project will be finished, I see many possible extensions to further improve the app.

## Domain Background

### Why avoiding backend servers is important: GDPR

An important point of GDPR [6] is the concept of data avoidance [7], stating that if possible, data should not be collected in the first place. Recently the so-called EU-US privacy shield was invalidated by the European Court of justice (Schrems II) [8], which is an important step to protect data of EU citizen. As nicely put in [8]:
> We live in a post-Snowden era and are cognizant that Facebook, Apple, Microsoft, and Google were some of the many companies feeding data to the National Security Agency for a mass surveillance program and this exchange of data was permitted by provisions under the Foreign Intelligence Surveillance Act (FISA). Through this landmark judgment, the ECJ has not only made a stronger case for data protection, but it has also, in some ways, pushed for a surveillance reform and an adequate data protection framework for countries that hope to serve a customer base in the EU. This judgement is a concrete step in the right direction for many reasons, including the fact that it pushes for surveillance reforms.

### Why FOSS matters

Even if proprietary software is already available, it is a good idea to develop an open source alternative. FOSS has been an important driver of security and data privacy and creates enormous value both for proprietary use and for end users. For instance, almost all tools used today in machine learning projects are in fact open source technology. Examples include Python, Jupyter, Scikit-Learn, PyTorch, Pandas, Numpy, Tesseract, Tesseract.js as well as Linux. A short motivating summary why FOSS matters is provided in [10]. More details and further links can be found in [11].

## Problem Statement

It happens from time to time, that one needs to transfer text from a printed source (or a screen) to a mobile phone or a laptop (see also “Overview” above). Sometimes just taking a photo is enough. Often, however, the text needs to be used further. In such a case one can use an app for optical character recognition (OCR). Most existing apps end there. I.e. they provide the text, but no convenient interface to directly use the text further. As a workaround one can just copy the text to the clipboard, open the relevant app and paste the text there. However, this it rather inconvenient in some use cases.

In addition it is desirable, to build such an app as an open source project, which is free to use, can be developed by an open source community and does not collect any data of the user or the pictures taken by the user.
Specifically, the proposed app should not suffer from any of the drawbacks mentioned in the list in the “Overview” above and it should implement the actions and design guidelines described in “Solution Statement” below.

## Datasets and Inputs

The input is simply a photo that includes some text that should be used further. For most use cases the text is just one or a couple of lines and relatively short. In many cases recognizing black text on white background is enough. In some cases, it would be useful, if also colored text can be recognized even in front of a background.
The dataset for testing and a basic verification of the features of the application can be created at an early stage of the project by simply printing out some sample text and taking photos.

## Solution Statement

I propose to build an app that can be used on mobile devices. It should allow to take photos, transform them to text (OCR) and depending on the text allow further actions. Actions should include:
* Open URL. If the text looks like a URL (e.g. it starts with “https://” or ends with “.com” or similar), it should be possible to open the URL in the default browser.
* Connect to Wifi. If the text looks like it could be Wifi credentials, it should be possible to conveniently connect to this Wifi.
* Call a phone number.
* Copy text to clipboard. This is a good fallback for any other use cases that are not covered explicitly.

Design guidelines:
* Open source
  * The project should be FOSS (Free Open Source Software)
  * MIT-License
* Data Secrecy
  * The app should per default not send any information about taken photos or recognized text to a central server.
  * If an option to send it to a central server will be added at some point, this should be an opt-in only.

## Benchmark Model

There is an app provided by Google that provides extensive features not only for text recognition, but also for other image recognition tasks, called Google Lens [9]. There is obviously no way to compete with the number of features, speed and quality of what this app offers within the scope of this project. However, the “selling point” of the proposed app is, that it is FOSS, and that it is implemented without backend, meaning that no data needs to be sent to Google or any other provider.

## Evaluation Metrics

The app should at least work on most photos of large text, black on white. This can be verified by creating about 10 to 20 photos of printed text and checking if the recognized text is identical to the printouts. The proportion of correctly identified texts can serve as an evaluation metric.
In addition, to create value beyond a plain OCR app, as a minimum requirement it should be able to recognize, if the text starts with ```www.``` or ```http://``` as an indication of a URL in most cases. It should also be able to detect if the text is a number only and is hence suitable for use as a number to call in most cases.

The focus in the proposed project is less on building a good OCR (as there are already libraries available that can be used, see below), and more on combining appropriate technology to make it available without backend and on mobile devices.

## Project Design

### App without Backend

I propose to build an app without backend. I.e. photos should not be sent to a server where they are processed. The reason for this is described above (see “Why avoiding backend servers is important”). This puts important constrains on which tools can be used.

### PWA vs Native App

There are several options how to implement an app for mobile devices. A good overview is provided in [1]. One can create native applications, use a hybrid approach, or create a progressive web app (PWA). The downside of a PWA is that it tends to be less performant and tends to have a less native look and feel. The advantage is that development, deployment and maintainability tend to be easier. In addition, support for almost all operation systems and devices is much easier to achieve. I propose to build a PWA, as ease of development and deployment are important at an early stage of a project.
I am aware that performance is also very relevant, but I hope that future advances in technology make this less of an issue. It can already be seen that hardware support for computational more demanding calculations on mobile devices is improving, which enables the possibility to run image processing tasks on mobile devices with increasing performance. A very good example of this is that PyTorch recently started supporting the Android NN-API [2, 3]. In addition, support for browser-based hardware accelerated calculations is in active development and keeps improving as can for instance be seen for GPU acceleration of Tensorflow in the browser [4, 5]. It might still take some time until this is conveniently available for PWAs on mobile devices (where e.g. the NN-API of android might be used), but I am confident, that that is something that will come soon enough.

### Video and Image Capture

Thanks to HTML5 capturing a video and taking screenshots of it is very easy [16]. This also makes it easy to create overlays of detected text on top of the photo. In addition, adding features like selecting only part of the photo are easy to add in later, if desired.

### Build on tesseract.js
Using no backend and the requirement to support mobile devices limits the number of technologies that can be used essentially to Java and JavaScript. Developing a PWA further limits this to JavaScript.
Fortunately, there is a JavaScript version of a famous open source OCR library called Tesseract available, called tesseract.js [17]. This can probably be considered the best choice out there that supports a PWA, even if the performance might not be incredibly good [13].

### Hosting

There are a couple of options how to host this app. Among the easiest are Github sites [14] and Heroku [15]. Of cause also AWS would be an option. But as the app needs no backend, Github [14] is probably the easiest option.

## Summary
Overall, I propose the following setup:
A PWA, hosted on Github-sites, building on tesseract.js for OCR and on HTML5 for video/image capturing.

## Possible Extensions

While I propose not to include further features in the scope of this capstone project, I would like to list a couple of possible extensions that are enabled based on this project:
* More actions based on the text
  * Text on a business card: add to contacts (filling in name, surname, phone number and e-mail address)
  * For an e-mail address: send e-mail
  * For an app link: open the desired app; if it is a deep link: on the specified content within that app
  * For a date: creating a calendar entry (filling in what is available, e.g. date, time, location, title, description)
  * For a photo of an actual calendar or a screen showing an opened calendar (e.g. on Outlook): same as for a date (optional: also for multiple events at once)
  * Translate text
* If there is a QR code in the picture, it should be possible to read the QR code and use actions based on this text (as a bonus, if the text is provided both as human readable text and as QR code, the QR code can be used to ensure that the text is recognized correctly, while the text can still be used to overlay the text to interact with it)
* Improve speed and detection quality
* Image processing
  * Identify plants or animals and show information about it
  * Identify famous places or persons (though, this one might be tricky without backend)
* Augmented reality (AR):
  * Overlay information about detected objects, similar as in “image processing”
  * Develop to a platform for AR applications without backend (implement basic features like object detection and tracking as a basis for AR apps)
* Any features Google Lens has currently or will come up with in the future, but without sending the photos or any other information to Google

## References
[1] https://medium.com/twodigits/native-hybrid-and-progressive-web-applications-building-a-mobile-app-today-db076642eb40, accessed 15.11.2020

[2] https://android-developers.googleblog.com/2020/11/android-neural-networks-api-13.html, accessed 15.11.2020

[3] https://medium.com/pytorch/pytorch-mobile-now-supports-android-nnapi-e2a2aeb74534, accessed 15.11.2020

[4] https://github.com/tensorflow/tfjs, accessed 15.11.2020

[5] https://github.com/tensorflow/tfjs/tree/master/tfjs-backend-webgl, accessed 15.11.2020

[6] https://en.wikipedia.org/wiki/General_Data_Protection_Regulation, accessed 15.11.2020

[7] https://edps.europa.eu/sites/edp/files/publication/18-05-31_preliminary_opinion_on_privacy_by_design_en_0.pdf, accessed 15.11.2020

[8] https://verfassungsblog.de/schrems-ii-a-brief-history-an-analysis-and-the-way-forward/, accessed 15.11.2020

[9] https://lens.google.com/, accessed 15.11.2020

[10] https://www.softwarefreedomday.org/about/why-foss, accessed 15.11.2020

[11] https://en.wikipedia.org/wiki/Free_and_open-source_software, accessed 15.11.2020

[12] https://github.com/naptha/tesseract.js, accessed 15.11.2020

[13] https://stackoverflow.com/questions/47530264/progressive-web-app-ocr-sdk-javascript, accessed 15.11.2020

[14] https://pages.github.com/, accessed 16.11.2020

[15] https://www.heroku.com/, accessed 16.11.2020

[16] https://www.html5rocks.com/en/tutorials/getusermedia/intro/, accessed 16.11.2020

[17] https://github.com/naptha/tesseract.js, accessed 16.11.2020
