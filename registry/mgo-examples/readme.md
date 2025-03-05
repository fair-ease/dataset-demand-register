# MGO Examples

## Context

*to include*

## Query examples 
- [all-samples](all-samples)
- [gene-ontology-findings](gene-ontology-findings)
- [instrument-usage](instrument-usage)
- [measured-values](measured-values)
- [observatory-overview-totals](observatory-overview-totals)
- [observatory-overview](observatory-overview)
- [sop-usage](sop-usage)
- [species-read-frequency](species-read-frequency)  

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