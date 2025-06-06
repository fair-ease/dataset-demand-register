

/**
 * Generate the Turtle representation of the given query.
 */
function serialiseAsTurtle({ name, description, params, returns, concepts }) {
    // https://linkeddata.github.io/rdflib.js/doc/index.html
    const store = $rdf.graph()

    const rdf = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    const rdfs = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')
    const schema = $rdf.Namespace('http://schema.org/')
    const fno = $rdf.Namespace('https://w3id.org/function/ontology#')
    const qb = $rdf.Namespace('http://purl.org/linked-data/cube#')
    const skos = $rdf.Namespace('http://www.w3.org/2004/02/skos/core#')

    const base = $rdf.Namespace(`${name}#`)
    const query = $rdf.sym(name)

    const conceptMap = {}
    concepts.forEach(c => {
        conceptMap[c.label] = c
    })

    store.add(query, rdf('type'), schema('Offer'))
    store.add(query, rdf('type'), fno('Function'))
    store.add(query, rdfs('label'), $rdf.literal(description))
    store.add(query, schema('itemOffered'),
        $rdf.literal('https://lab.fairease.eu/dataset-demand-register'))
    params.forEach(p => {
        const param = base(`${p.name}_param`)
        store.add(query, fno('expects'), param)
        store.add(param, rdf('type'), fno('Parameter'))
        store.add(param, schema('name'), $rdf.literal(p.name))
        store.add(param, rdfs('label'), $rdf.literal(p.description))
    })
    if (returns.measures?.length > 0 || returns.dimensions?.length > 0) {
        const output = $rdf.blankNode()
        store.add(query, fno('returns'), output)
        store.add(output, rdf('type'), fno('Output'))
        store.add(output, rdf('type'), qb('DataStructureDefinition'))
        if (returns.measures?.length > 0) {
            const component = $rdf.blankNode()
            store.add(output, qb('component'), component)
            store.add(component, rdf('type'), qb('ComponentSpecification'))
            returns.measures.forEach(m => {
                const measure = base(`${m.label.replace(/[^\w]/g, '')}_prop`)
                store.add(component, qb('measure'), measure)
                store.add(measure, rdfs('label'), $rdf.literal(m.label))
                if (conceptMap[m.concept].uri) {
                    store.add(measure, qb('concept'), $rdf.sym(conceptMap[m.concept].uri))
                } else {
                    const concept = $rdf.blankNode()
                    store.add(measure, qb('concept'), concept)
                    store.add(concept, rdf('type'), skos('Concept'))
                    store.add(concept, skos('prefLabel'), $rdf.literal(conceptMap[m.concept].label))
                    store.add(concept, skos('definition'), $rdf.literal(conceptMap[m.concept].definition))

                }
                store.add(measure, rdfs('range'), $rdf.literal(m.range))
            })
        }
        if (returns.dimensions?.length > 0) {
            const component = $rdf.blankNode()
            store.add(output, qb('component'), component)
            store.add(component, rdf('type'), qb('ComponentSpecification'))
            returns.dimensions.forEach(m => {
                const dimension = base(`${m.label.replace(/[^\w]/g, '')}_prop`)
                store.add(component, qb('dimension'), dimension)
                store.add(dimension, rdfs('label'), $rdf.literal(m.label))
                if (conceptMap[m.concept].uri) {
                    store.add(dimension, qb('concept'), $rdf.sym(conceptMap[m.concept].uri))
                } else {
                    const concept = $rdf.blankNode()
                    store.add(dimension, qb('concept'), concept)
                    store.add(concept, rdf('type'), skos('Concept'))
                    store.add(concept, skos('prefLabel'), $rdf.literal(conceptMap[m.concept].label))
                    store.add(concept, skos('definition'), $rdf.literal(conceptMap[m.concept].definition))
                }
                store.add(dimension, rdfs('range'), $rdf.literal(m.range))
            })
        }
    }
    concepts.filter(c => c.uri).forEach(c => {
        const concept = $rdf.sym(c.uri)
        store.add(concept, rdf('type'), skos('Concept'))
        store.add(concept, skos('prefLabel'), $rdf.literal(c.label))
        store.add(concept, skos('definition'), $rdf.literal(c.definition))
    })

    return store.serialize(undefined, 'text/turtle')
}


/**
 * Parse the given Turtle input into a query representation.
 */
function parseTurtle(url, input) {
    const store = $rdf.graph()
    const rdf = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    const rdfs = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')
    const schema = $rdf.Namespace('http://schema.org/')
    const fno = $rdf.Namespace('https://w3id.org/function/ontology#')
    const qb = $rdf.Namespace('http://purl.org/linked-data/cube#')
    const skos = $rdf.Namespace('http://www.w3.org/2004/02/skos/core#')

    $rdf.parse(input, store, url, 'text/turtle')

    const nameNode = store.match(null, rdf('type'), fno('Function'))[0].subject
    const name = nameNode.value
    const description = store.match(nameNode, rdfs('label'), null)[0].object
    const paramNodes = store.match(nameNode, fno('expects'), null)
    const params = (paramNodes ?? [])
        .map(p => (p.object.elements ?? []).map(e => e.value))
        .flat()
        .map(p => {
            const sym = $rdf.sym(p)
            const nameFact = store.match(sym, schema('name'), null)[0]
            const name = nameFact ? nameFact.object.value : sym.id()
            const descriptionFact = store.match(sym, rdfs('label'), null)[0]
            const description = descriptionFact
                ? descriptionFact.object.value
                : ''
            return { name, description }
        })
    const returns = {
        type: 'none', // options: "none", "table", "media"
    }
    const returnsNode = store.match(nameNode, fno('returns'), null)[0].object
    if (typeof returnsNode !== 'undefined' && store.match(returnsNode, rdf('type'), qb('DataStructureDefinition'))) {
        returns.type = 'table'
        for (const componentNode of store.match(returnsNode, qb('component'), null).map(n => n.object)) {
            // row specification
            const measures = store.match(componentNode, qb('measure'), null).map(n => n.object)
            if (measures.length > 0) {
                returns.measures = []
                for (const measureNode of measures) {
                    const label = store.match(measureNode, rdfs('label'), null)[0]?.object.value
                    const concept = store.match(measureNode, qb('concept'), null)[0]?.object.value
                    const range = store.match(measureNode, rdfs('range'), null)[0]?.object.value
                    returns.measures.push({ label, concept, range })
                }
                continue
            }
            // column specification
            const dimensions = store.match(componentNode, qb('dimension'), null).map(n => n.object)
            if (dimensions.length > 0) {
                returns.dimensions = []
                for (const dimensionNode of dimensions) {
                    const label = store.match(dimensionNode, rdfs('label'), null)[0]?.object.value
                    const concept = store.match(dimensionNode, qb('concept'), null)[0]?.object.value
                    const range = store.match(dimensionNode, rdfs('range'), null)[0]?.object.value
                    returns.dimensions.push({ label, concept, range })
                }
                continue
            }
        }
    } else if (typeof returnsNode !== 'undefined' && store.match(returnsNode, rdf('type'), schema('MediaObject'))) {
        returns.type = 'media'
    } else if (typeof returnsNode !== 'undefined') {
        console.warn('unsupported query return type')
    }
    const concepts = Object.fromEntries(
        (store.match(null, rdf('type'), skos('Concept')) ?? [])
            .map(cq => {
                const cn = cq.subject
                return [
                    cn.value,
                    {
                        uri: cn.termType === 'BlankNode' ? undefined : cn.value,
                        label: store.match(cn, skos('prefLabel'), null)[0]?.object.value,
                        definition: store.match(cn, skos('definition'), null)[0]?.object.value,
                    }
                ]
            })
    )
    return {
        name,
        description,
        params,
        returns,
        concepts,
    }
}
