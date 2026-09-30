---
title: Finance MLOps <2026 WIP>
summary: A local, end-to-end MLOps pipeline for financial-news sentiment, from ingestion and training to serving, monitoring and retraining.
date: 2026-09-23
images: []
repository: https://github.com/y2kr/finance-mlops
---

## Overview

A local MLOps project that classifies financial headlines into three sentiment classes. The focus is the lifecycle around the model: reproducible data, automated pipelines, model promotion and monitoring, rather than model complexity.

Dagster orchestrates news ingestion, weak labeling and TF-IDF training. MLflow tracks and versions models, while BentoML serves predictions. Monitoring with Evidently and NannyML can trigger retraining; challengers must pass evaluation checks before replacing the active model.

The stack runs through Docker Compose, with Postgres for data storage and Prometheus and Grafana for metrics.

## What I learned

yeah
