# urn:embrc.eu:emobon:observatory-overview-totals

Describes the contract that returns all EMO-BON observatories & associated metadata, together with additional aggregating results on the level of the observatory, such as the count of sampling events, the min-max of sampling-event-dates, the count of samples, *and the count of ena-accession-numbers*.

## Input parameters

*Need be able to filter on observatoryID, type* --> TODO 

## Resulting Output

**Type:** Tabular data
- **Instance:**  Observatory

- **Variables:** 
    - Name
    - Partner (~ Observatory ID) 
    - Type
    - Country
    - Geographic Location
    - Marine region
    - Habitat info: broader biome 
    - Habitat info: local biome
    - Habitat info: env material (?)

    - number of sampling-events
    - earliest sampling-event date
    - latest sampling-event date
    - number of samples
    - *number of ena-accession-numbers --> TODO*