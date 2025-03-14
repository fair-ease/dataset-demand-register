# MGO Examples

## Context

*to include*

## Query examples 
- [all-samples.ttl](all-samples.ttl)
- [gene-ontology-findings.ttl](gene-ontology-findings.ttl)
- [instrument-usage.ttl](instrument-usage.ttl)
- [measured-values.ttl](measured-values.ttl)
- [observatory-overview-totals.ttl](observatory-overview-totals.ttl)
- [observatory-overview.ttl](observatory-overview.ttl)
- [sop-usage.ttl](sop-usage.ttl)
- [species-read-frequency.ttl](species-read-frequency.ttl)  

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