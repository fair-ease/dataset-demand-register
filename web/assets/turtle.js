

/**
 * Generate the Turtle representation of the given query.
 */
function serialiseAsTurtle({ name, description, params }) {
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

    $rdf.parse(input, store, url, 'text/turtle')

    const nameNode = store.match(null, rdf('type'), fno('Function'))[0].subject
    const name = nameNode.value
    const description = store.match(nameNode, rdfs('label'), null)[0].object
    const params = store.match(nameNode, fno('expects'), null)
        .map(p => p.object.elements.map(e => e.value))
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

    return {
        name,
        description,
        params,
    }
}
