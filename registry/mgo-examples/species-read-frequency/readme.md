# urn:embrc.eu:emobon:species-read-frequency ??? (better name?)
## ?parameters

    any to allow filtering on any of the context column

    + some way to deal with higher taxonomic rank mapping

## output:

    rows: one per every identified species in the sequence

    columns:

        species-id

        read-frequency

        context

            sampling-event

                date

                selected-sampled-values (e.g. 

                location, depth

                observatoryid

                 

## way to solve

    sparql template on top of 3store

## known gaps

    needs to have sequencing data and analysis data up to triples, quite some road to go still

    attention to taxanomic rank in triplisation

    unclear how percentage relative read/frequency is obtained and can be put inside the triples? (check with Cymon)