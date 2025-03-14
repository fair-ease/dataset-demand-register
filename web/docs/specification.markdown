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
[![product-group-diagram.png](diagrams/product-group-diagram.png)](diagrams/product-group-diagram.png)

A registry is typed as a schema:ProductGroup, listing the named queries through the schema: itemListElement property. 

**Named Query - General**  
Named query represents a uniform way to describe  
specifying input parameters and well-defined result structures

[![product-diagram.png](diagrams/product-diagram.png)](diagrams/product-diagram.png)





**Named Query - Tabular data**
[![product-tabular-data-diagram.png](diagrams/product-tabular-data-diagram.png)](diagrams/product-tabular-data-diagram.png)

When expected outputs is tabular data
it is described as a qb:datastructuredefinition
with measures and dimensions.  

Measure represents the expected rows in the result
they are minimaly described through 3 properties:
- name of the row (rdfs:label)
- what the cell values represent --> for the measure this is likely always going to be a concept similar to an Index-like concept
- expected type of cell values  --> for the measure this is likely to always be of datatype xsd:integer ...

Dimensions represent the expected columns in the result. They are minimaly described through 3 properties:
- name of the column (rdfs:label)
- what the cell values represent (qb:concept) **
- expected type of cell values in that column, this can be datatype or a reference to a class (rdfs:range)

** Description of concepts:  
Often concepts will need to be defined specifically;
expected properties for this are: 
- skos:prefLabel, for the name of the concept 
- skos:definition / skos:scopeNote, for the intended meaning and usage context

**Named Query - Unstructured data - Media object**

