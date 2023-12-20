# DCAT-AP Feeds

[Read the spec](https://semiceu.github.io/LDES-DCAT-AP-feeds/index.html)

Publishing a full data dump over and over again will delegate change detection -- a fault prone process -- to data consumers.
With DCAT-AP Feeds we propose that DCAT-AP catalog maintainers publish an event source API that can help to replicate the catalog towards a harvester, and always keep it in-sync in the way that is intended by the publisher.
Therefore, this spec describes how to publish your DCAT-AP entity changes using the Activity Streams vocabulary and LDES.
It also provides a specification for harvesters to provide transparency into their harvesting progress.

This is a pilot in the SEMIC programme to study the value of Linked Data Event Streams in Europe.