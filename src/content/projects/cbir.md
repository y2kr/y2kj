---
title: Content-Based Image Retrieval System <2023>
summary: Three approaches to finding visually similar images, from hand-crafted features to deep learning.
date: 2023-01-01
images:
  - src: files/imgs/cbir/cbir1.jpg
    alt: CBIR query and retrieval interface
  - src: files/imgs/cbir/cbir2.jpg
    alt: Similar-image search results
  - src: files/imgs/cbir/cbir3.jpg
    alt: CBIR model controls
  - src: files/imgs/cbir/cbir4.jpg
    alt: Retrieved image comparison
  - src: files/imgs/cbir/M3_run1.png
    alt: VGG-16 retrieval run results
  - src: files/imgs/cbir/M3_run2.png
    alt: Second VGG-16 retrieval run results
repository: https://github.com/y2kr/CBIRS
document: files/other/dissertation_final_redacted.pdf
---

Built and extended from my UNI final dissertation project. No AI was used to write the code :O A great learning experience for building ML + deep learning systems e2e. Very primative and hacky windows94 GUI with charm.

This Content-Based Image Retrieval (CBIR) system was developed to explore and compare different techniques for finding similar images based on their visual content. The system implements three retrieval models, each exploring different feature extraction techniques and methodologies.

The first and simplest model combines HSV histograms, dominant colours, Gabor features, and Haralick features. It processes each feature vector using Euclidean distance to identify similarities between images.

The second model builds on this foundation with HSV histograms, Gabor features, Haralick features, and HoG features. It was adapted from a Bag of Words approach using a linear support vector machine to learn image classes.

The third model uses the VGG-16 deep-learning architecture for feature extraction, demonstrating improved retrieval accuracy over the traditional computer-vision approaches.

The PySimpleGUI interface supports model and query-image selection along with parameter adjustment. This project expanded on concepts explored in my dissertation.
