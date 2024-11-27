# urn:embrc.eu:emobon:observatory-overview

Returns a list of observatories, with information on their names, country, location (lat, long and mrgid), and any habitat info.

## ? parameters

    ad hoc possible, but not essential as the full list is <20 rows

    maybe some stuff to filter output

## output

    rows:  one row per observatory

        (note: observatory != partner, there typically are multiple observatories per partner, one for each type)

        BPNS == the partner, it also is used in the obervatoryID though (uh!)

    columns: uri, name, observatory-id (partner), type, country, location (lat, long and mrgid), and any habitat info

## way to solve

    sparql templated query to the 3store / kgap testible

    related ttl ifiles are produced in various locations {partner-logsheets-repo} → **/{type} / observatory / {ID} 

## known gaps in LOD publishing flow

    correct usage of vocabularies due

        better QC to handle current template failures

    can we test? we should be able to check easily for the number of observatories in total / per type even