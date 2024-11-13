# urn:embrc.eu:emobon:observatory-overview-totals

Note: essentially this is the same as the previous, plus some aggregating results on the level of the observatory
? parameters

    be able to filter on 1 partner (observatoryID), and probably also on type

## Output

    rows: one per observatory (see above)

    columns: see above, plus

        count of sampling-events

        min-max of sampling-event-dates

        count of samples (inside the events, typically for the various filtering fractions and then multiplied by 4, for the replicas)

        future → when we get the sequencing, could be useful to have also:

            count of ena-accession-numbers

## way to solve

    see above (a) + have smart aggregating / counts

## known gaps

    see above (a)

    future question needs the omics to be present (sequencing triples)