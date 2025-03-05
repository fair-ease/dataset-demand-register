# MGO Examples

## Context

*to include*

## Query examples 
- [all-samples](mgo-examples/all-samples)
- [gene-ontology-findings](mgo-examples/gene-ontology-findings)
- [instrument-usage](mgo-examples/instrument-usage)
- [measured-values](mgo-examples/measured-values)
- [observatory-overview-totals](mgo-examples/observatory-overview-totals)
- [observatory-overview](mgo-examples/observatory-overview)
- [sop-usage](mgo-examples/sop-usage)
- [species-read-frequency](mgo-examples/species-read-frequency)  

## Template
```turtle
@base <urn:embrc.eu:emobon:XXX> .

<>
    a schema:Offer, fno:Function ; 
    rdfs:label "XXX Offer Contract"@en;
    rdfs:comment "Description of XXX Offer Contract"@en;
    
    schema:itemOffered <https://lab.fairease.eu/dataset-demand-register> ; 

    # input parameters

    # result properties
.
```