document.addEventListener('DOMContentLoaded', async ev => {
    const url = document.location.href.replace(/.html$/, '.ttl')
    const response = await fetch(url)
    const turtle = await response.text()
    const query = parseTurtle(url, turtle)
    const queryConceptURIs = Object.keys(query.concepts ?? [])
        .sort(compareConcepts(query.concepts))
    document.getElementById('query-name').innerHTML = query.name
    document.getElementById('query-description').innerHTML = query.description
    // params
    let params = '<ul>'
    query.params.forEach(p => {
        params += '<li>'
        params += p.name
        params += ': '
        params += p.description
            ? p.description
            : '<span class="query-nodescription">(no description)</span>'
        params += '</li>'
    })
    params += '</ul>'
    document.getElementById('query-params').innerHTML += params
    // returns
    let measures = '<ul>'
    measures += (query.returns.measures ?? [])
        .map(r => `<li><code class="language-plaintext">${r.label}</code> (<span title="${r.range}">${rangeName(r.range)}</span>; concept ${queryConceptURIs.indexOf(r.concept) + 1})</li>`)
        .join('\n')
    measures += '</ul>'
    let dimensions = '<ul>'
    dimensions += (query.returns.dimensions ?? [])
        .map(d => `<li><code class="language-plaintext">${d.label}</code> (<span title="${d.range}">${rangeName(d.range)}</span>; concept ${queryConceptURIs.indexOf(d.concept) + 1})</li>`)
        .join('\n')
    dimensions += '</ul>'
    let returns
        = '<div><p><b>Returns:</b></p>'
        + '<div><p>Measures:</p>' + measures + '</div>'
        + '<div><p>Dimensions:</p>' + dimensions + '</div>'
        + '</div>'
    document.getElementById('query-returns').innerHTML = returns
    // concepts
    let concepts = '<div><p><b>Concepts:</b></p><ol>'
    concepts += queryConceptURIs
        .map(c => {
            const conceptURI = typeof query.concepts[c].uri === 'undefined'
                ? ''
                : `<br />URI: <span style="font-family: monospace;">${query.concepts[c].uri}</span>`
            return `<li><i>${query.concepts[c].label}:</i> ${query.concepts[c].definition}${conceptURI}</li>`
        })
        .join('\n')
    concepts += '</ol></div>'
    document.getElementById('query-concepts').innerHTML = concepts
})


function compareConcepts(concepts) {
    return (a, b) => {
        const v1 = concepts[a].label.toLowerCase()
        const v2 = concepts[b].label.toLowerCase()
        return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
    }
}


function rangeName(uri) {
    switch (uri) {
        case 'http://www.w3.org/2001/XMLSchema#anyURI':
            return 'URI'
        case 'http://www.w3.org/2001/XMLSchema#integer':
            return 'integer'
        case 'http://www.w3.org/2001/XMLSchema#string':
            return 'string'
        case 'http://www.w3.org/2001/XMLSchema#list':
            return 'list'
        case 'http://www.w3.org/2001/XMLSchema#date':
            return 'date'
        case 'http://www.w3.org/2001/XMLSchema#dateTime':
            return 'date/time'
        case 'http://www.w3.org/2001/XMLSchema#decimal':
            return 'decimal'
        case 'http://www.w3.org/2001/XMLSchema#double':
            return 'real'
        case 'http://www.opengis.net/ont/geosparql#wktLiteral':
            return 'WKT'
        default:
            return uri
    }
}
