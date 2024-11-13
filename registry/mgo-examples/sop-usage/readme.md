# urn:embrc.eu:emobon:sop-usage
## ?parameters

    optionally filter on any of the context fields?

## output:

    rows: one for each applied sop 

        → means each row is triggered by a single triple with predicate

            sosa:usedProcedure in the case of sample and 

            emobon-sequence:sop for sequencing

    columns:

        date

        obervatoryid

        sampling-event

        sop-label 

## way to solve

    sparql template on top of 3store

## known gaps

    unclear if it makes sense to combine sosa and sequencing 

         - what kind of context-columns could they be sharing?

        or should we have two queries?