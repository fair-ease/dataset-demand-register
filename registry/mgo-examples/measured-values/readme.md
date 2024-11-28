# urn:embrc.eu:emobon:measured-values

Returns, for the mandatory measurements, the mean and mean deviation, as well as max and min values, for the given/specified named observatory, summed over all sampling events and over all water events separately with the BODC names.  
Next to this, also returns a list of BODC vs googlesheet names (disregarding the NAs).

## ?parameters

    unsure – probably any of the context-fields

## output:

    rows: individually measured values of some parameters, in some context

    columns:

        measured-parameter

        value

        unit

        context fields:

            obervatory-id

            sampling-event

            sampling-type

            date

            position-depth

            position-location?

            instrument type?

## way to solve

    sparql template on top of 3store

## known gaps

    should be fine, qc tuning ongoing – demo present in kgap-emobon test