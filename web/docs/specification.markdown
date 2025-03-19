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

The **Uniform Data Access Layer (UDAL) Specification** defines a standardized approach for machine-usable descriptions of named queries, enabling consistent data retrieval across diverse data sources. Named queries encapsulate data access logic by specifying input parameters and well-defined result structures, ensuring a uniform interface regardless of the underlying database or storage system. 

This specification focuses solely on the **description** of named queries, providing a clear and interoperable format without enforcing any particular implementation. By standardizing query descriptions, UDAL facilitates seamless integration, enhances reusability, and promotes consistency across various data-driven applications.

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

### Registry
A **registry** is defined as a `schema:ProductGroup`, listing named queries through the `schema:itemListElement` property.
[![product-group-diagram.png](diagrams/product-group-diagram.png)](diagrams/product-group-diagram.png)

### Named Query  
A **Named Query** is defined as both a `schema:Product` and an `fno:Function`. Input parameters and result structures are described in a standardized way through the `fno:expects` and `fno:returns` properties, respectively.

Input parameters represent optional filters for the result. They are instances of both `fno:Parameter` and `schema:Property` and are minimally described by the following properties:

- **Name** (`schema:name`): The name of the input parameter.
- **Description** (`schema:description`): A human-readable description of the input parameter.
- **Expected Concept/Class** (`schema:rangeIncludes`): The conceptual category or class of the input parameter — that is, what the parameter's values represent. *(Note: This does not necessarily need to match any concepts or classes in the result structure.)*


The resulting output structure depends on the type of data being returned.

[![product-diagram.png](diagrams/product-diagram.png)](diagrams/product-diagram.png)


#### Tabular data results
When the expected output is **tabular data**, the result is described using `qb:DataStructureDefinition`, which defines measures and dimensions.

[![product-tabular-data-diagram.png](diagrams/product-tabular-data-diagram.png)](diagrams/product-tabular-data-diagram.png)

Measures (`qb:MeasureProperty`) represent the numerical values or aggregated data expected in each row of the result. They are minimally described by:

- **Label** (`rdfs:label`): The name of the measure.
- **Concept Representation** (`qb:concept`): What the cell values represent, being an index/key-like concept. 
- **Expected Data Type** (`rdfs:range`): The expected type of the cell values. Since measures often will represent index like concepts, the expected type is likely to be `xsd:integer`.

Dimensions (`qb:DimensionProperty`) define the categorical variables/attributes that form the columns in the result. They are minimally described by:

- **Label** (`rdfs:label`): The name of the dimension.
- **Concept Representation** (`qb:concept`): The meaning of the cell values in that column. What the cell values represent. This can be a reference to a concept or class.
- **Expected Data Type or Class** (`rdfs:range`): The expected type of the cell values. This can be a datatype or a reference to a class.

#### Media object results
When the expected output is a **media object**, the result is described using `schema:MediaObject`. This structure is used to represent files, images, videos, or any other media type. See the [schema.org documentation](https://schema.org/MediaObject) for more information.  

_(Section to be completed when examples are available)_

### Concept Descriptions
In many cases, concepts need to be explicitly defined. The following properties are expected:

- **Preferred Label** (`skos:prefLabel`): The name of the concept.
- **Definition or Scope Note** (`skos:definition` / `skos:scopeNote`): A description of the intended meaning and usage context.

