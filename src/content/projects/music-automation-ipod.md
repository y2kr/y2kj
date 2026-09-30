---
title: iPod Music Automation <2026, WIP>
summary: Local pipeline to automate my music organisation. Also iPod 
date: 2026-01-01
images: []
---

## Overview

A project to build a local, automated music libary, also an iPod. Hardware and software project with quality check, efficent organisation and device syncing for all my stuff. 


- [`music-auto`](https://github.com/y2kr/music-auto) manages downloads and the local library.
- [`ipod-sync`](https://github.com/y2kr/ipod-sync) copies the finished library to the iPod.

## The music pipeline

Album requests enter the pipeline through Sockseek and Soulseek. `music-download` prefers lossless results, skips albums already in the clean library, and places new downloads into an inbox.

`music-import` waits for each album folder to finish changing before processing it. Lossless files are checked with flac-detective to identify suspected transcodes. If one lossless file fails the gate, the complete album is moved to quarantine with an HTML report for manual review; files are never deleted automatically.

Albums that pass are imported into a beets-managed library, with metadata and artwork handled consistently. ReplayGain is then calculated with `rsgain`, leaving a clean library ready for playback and syncing.

The separate `ipod-sync` tool copies audio and cover files from the clean library to a Rockbox iPod using `rsync`. It checks that the device is mounted with a compatible filesystem and uses FAT-safe options to avoid unnecessary copies caused by timestamp and permission differences.

## iPod build

This is iPod territory. 

