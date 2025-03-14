---
title: Specification
permalink: /docs/specification/
---

# UDAL specification

**Title:** Uniform Data Access Layer Specification  
**Version:** 1.1  
**Date:** 2025-03-14  
**Contributors:** [Marc Portier](https://orcid.org/0000-0002-9648-6484), [Jorge Mendes](https://orcid.org/0000-0002-0371-0222), [Laurian Van Maldeghem](https://orcid.org/0000-0003-0663-5907)  


# Introduction

The Uniform Data Access Layer (UDAL) Specification defines a standardized approach for machine-usable descriptions of named queries, enabling consistent data retrieval across diverse data sources. Named queries encapsulate data access logic by specifying input parameters and well-defined result structures, ensuring a uniform interface regardless of the underlying database or storage system. This specification focuses solely on the description of named queries, providing a clear and interoperable format without enforcing any particular implementation. By standardizing query descriptions, UDAL facilitates seamless integration, enhances reusability, and promotes consistency across various data-driven applications.


# Overview

prefixes:
- rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns#
- rdfs: http://www.w3.org/2000/01/rdf-schema#
- schema: http://schema.org/
- dcat: http://www.w3.org/ns/dcat#
- qb: http://purl.org/linked-data/cube#
- fno: https://w3id.org/function/ontology#
- xsd: http://www.w3.org/2001/XMLSchema#
- skos: http://www.w3.org/2004/02/skos/core#

**Registry**
[![offer-catalogue-diagram.png](diagrams/offer-catalogue-diagram.png)](diagrams/offer-catalogue-diagram.png)

**Named Query - General**
[![offer-diagram.png](diagrams/offer-diagram.png)](diagrams/offer-diagram.png)

**Named Query - Tabular data**
[![offer-diagram.png](diagrams/offer-tabular-data-diagram.png)](diagrams/offer-tabular-data-diagram.png)
