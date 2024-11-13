# urn:embrc.eu:emobon:instrument-usage

Note: very similar to previous
## ?parameters

    optionally filter on any of the context fields?

## output:

    rows: one for each applied instrument 

        → means each row is triggered by a single triple with predicate

            sosa:madeBySampler in the case of sample and 

    columns:

        date

        obervatoryid

        sampling-event

        device-label 

## way to solve

    sparql template on top of 3store

## known gaps

    should be ok