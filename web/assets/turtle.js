

/**
 * Generate the Turtle representation of the given query.
 */
function serialiseAsTurtle({ name, description, params, returns }) {
    // https://linkeddata.github.io/rdflib.js/doc/index.html
    const store = $rdf.graph()

    const rdf = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    const rdfs = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')
    const schema = $rdf.Namespace('http://schema.org/')
    const fno = $rdf.Namespace('https://w3id.org/function/ontology#')

    const base = $rdf.Namespace(`${name}#`)
    const query = $rdf.sym(name)

    store.add(query, rdf('type'), schema('Offer'))
    store.add(query, rdf('type'), fno('Function'))
    store.add(query, rdfs('label'), $rdf.literal(description))
    store.add(query, schema('itemOffered'),
        $rdf.literal('https://lab.fairease.eu/dataset-demand-register'))
    store.add(query, fno('expects'),
        params.map(p => base(`${p.name}_param`))
    )
    params.forEach(p => {
        const param = base(`${p.name}_param`)
        store.add(param, rdf('type'), fno('Parameter'))
        store.add(param, schema('name'), $rdf.literal(p.name))
        store.add(param, rdfs('label'), $rdf.literal(p.description))
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
