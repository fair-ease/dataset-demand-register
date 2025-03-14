# urn:embrc.eu:emobon:measured-values

Describes the contract that returns measurements together with associated metadata of the sample from which the measurement resulted (and also the sampling-event in which the sample was taken).

Returns, for the mandatory measurements, the mean and mean deviation, as well as max and min values, for the given/specified named observatory, summed over all sampling events and over all water events separately with the BODC names.  
Next to this, also returns a list of BODC vs googlesheet names (disregarding the NAs).

## Input parameters

*probably any of the context-fields --> TODO*

## Resulting Output

**Type:** Tabular data
- **Instance:**  Measurements

- **Variables:** 
    - measured-parameter
    - value
    - unit
    - obervatory-id
    - sampling-event
    - sampling-type
    - date
    - position-depth
    - position-location?
    - instrument type?