# urn:embrc.eu:emobon:observatory-overview-totals

Returns a list of observatories, with information on their names, the number of sampling events for water and sediment, the overall date coverage, and the number of samples taken.

Note: essentially same as *urn:embrc.eu:emobon:observatory-overview*,  
with some additional aggregating results on the level of the observatory

## ? parameters

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