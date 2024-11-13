# urn:embrc.eu:emobon:all-samples
## ?parameters

     

## output:

    rows:  one row per sample

        not be tempted to denormalise to level of files here – the use case is download only, that should be covered by a well organized list of materials at the level of the rocrate-metadatafile 

    columns:

        sample-uri

        context -columns assosicated to the sampling-event (see also query f/g)

## way to solve

    sparql template on top of 3store

## known gaps

    we need actual analysis creates giving us more insight on these

    and figure out how to triplise and link to all + include (or reference) download-URL in that graph to the actual needed files?

    production of ro-crates during the analysis of each sample seems to be key here (and still missing)