document.addEventListener('DOMContentLoaded', async ev => {
    const url = document.location.href.replace(/.html$/, '.ttl')
    const response = await fetch(url)
    const turtle = await response.text()
    const query = parseTurtle(url, turtle)
    document.getElementById('query-name').innerHTML = query.name
    document.getElementById('query-description').innerHTML = query.description
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
})
