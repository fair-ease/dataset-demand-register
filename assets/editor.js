/// Query parameters
let params_seq = 0
let params = []


document.addEventListener('DOMContentLoaded', (ev) => {
    refreshTurtle()
    updateView()
})

window.addEventListener('hashchange', (ev) => {
    updateView()
})


function updateView() {
    const formTab = document.getElementById('editor-tabs-form')
    const previewTab = document.getElementById('editor-tabs-preview')
    const inputs = document.getElementById('editor-inputs')
    const output = document.getElementById('editor-output')
    if (window.location.hash === '#preview') {
        formTab.className = ''
        previewTab.className = 'selected'
        inputs.style.display = 'none'
        output.style.display = 'block'
    } else {
        formTab.className = 'selected'
        previewTab.className = ''
        inputs.style.display = 'block'
        output.style.display = 'none'
    }
}


function clearEditor() {
    document.getElementById('name').value = ''
    document.getElementById('description').value = ''
    document.getElementById('parameters').innerHTML = ''
    params_seq = 0
    params = []
    refreshTurtle()
}


/**
 * Create a new parameter for the query.
 */
function newParameter(name, description) {
    params_seq += 1
    params.push(params_seq)
    const parameter = newParameterHTML(params_seq, name, description)
    const parameters = document.getElementById('parameters')
    parameters.appendChild(parameter)
    refreshTurtle()
}


/**
 * Create the HTML elements for the new parameter.
 */
function newParameterHTML(n, name, description) {
    const parameter = document.createElement('div')
    parameter.id = `param-${n}`
    // param name
    const paramName = `param-${n}-name`
    const paramNameLabel = document.createElement('label')
    paramNameLabel.htmlFor = paramName
    paramNameLabel.innerText = 'Name:'
    const paramNameInput = document.createElement('input')
    paramNameInput.type = 'text'
    paramNameInput.id = paramName
    paramNameInput.value = name || ''
    paramNameInput.oninput = () => { refreshTurtle() }
    parameter.append(paramNameLabel)
    parameter.append(' ')
    parameter.append(paramNameInput)
    // param description
    const paramDescription = `param-${n}-description`
    const paramDescriptionLabel = document.createElement('label')
    paramDescriptionLabel.htmlFor = paramDescription
    paramDescriptionLabel.innerText = 'Description:'
    const paramDescriptionInput = document.createElement('input')
    paramDescriptionInput.type = 'text'
    paramDescriptionInput.id = paramDescription
    paramDescriptionInput.value = description || ''
    paramDescriptionInput.oninput = () => { refreshTurtle() }
    parameter.append(' ')
    parameter.append(paramDescriptionLabel)
    parameter.append(' ')
    parameter.append(paramDescriptionInput)
    // remove
    const paramRemoveButton = document.createElement('button')
    paramRemoveButton.innerText = 'remove parameter'
    paramRemoveButton.onclick = () => { removeParameter(n) }
    parameter.append(' ')
    parameter.append(paramRemoveButton)
    //
    return parameter
}

function removeParameter(n) {
    const parameter = document.getElementById(`param-${n}`)
    parameter.parentElement.removeChild(parameter)
    params = params.filter(p => p !== n)
    refreshTurtle()
}

function getParameterName(n) {
    return document.getElementById(`param-${n}-name`).value
}

function getParameterDescription(n) {
    return document.getElementById(`param-${n}-description`).value
}


/**
 * Generate the Turtle text.
 */
function generateTurtle() {
    const name = document.getElementById('name').value
    const description = document.getElementById('description').value
    const queryParams = params.map(p => ({
        name: getParameterName(p),
        description: getParameterDescription(p),
    }))

    try {
        return serialiseAsTurtle({ name, description, params: queryParams })
    } catch (e) {
        return `Error: ${e.message}`
    }
}


/**
 * Update the page's Turtle text.
 */
function refreshTurtle() {
    const generated = generateTurtle()
    // output
    const turtle = document.getElementById('turtle')
    turtle.innerText = generated
    // download
    const download = document.getElementById('download-button')
    const base64 = btoa(generated)
    download.href = `data:text/plain;charset=utf-8;base64,${base64}`
}


/**
 * Copy the Turtle ouput into the user's clipboard.
 */
function copyTurtle() {
    navigator.clipboard.writeText(generateTurtle())
}


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
            const description = descriptionFact ? descriptionFact.object.value : ''
            return { name, description }
        })

    return {
        name,
        description,
        params,
    }
}


function editorSetQuery(query) {
    try {
        params_seq = 0
        params = []
        document.getElementById('name').value = query.name
        document.getElementById('description').value = query.description
        query.params.forEach(({ name, description }) => {
            newParameter(name, description)
        })
    } catch (err) {
        console.error(err)
    }
}


function showImport() {
    const dialog = document.getElementById('editor-import')
    dialog.style.display = 'block'
}

function importQuery() {
    clearEditor()
    const content = document.getElementById('editor-import-content').value
    const query = parseTurtle('https://lab.fairease.eu/dataset-demand-register/', content)
    editorSetQuery(query)
    refreshTurtle()
    cancelImport()
}

function cancelImport() {
    document.getElementById('editor-import').style.display = 'none'
    document.getElementById('editor-import-content').value = ''
}


function showImportFromURL() {
    const dialog = document.getElementById('editor-import-url-dialog')
    dialog.style.display = 'block'
}

function cancelImportFromURL() {
    document.getElementById('editor-import-url-dialog').style.display = 'none'
    document.getElementById('editor-import-url-input').value = ''
}


async function importQueryFromURL() {
    clearEditor()
    const url = document.getElementById('editor-import-url-input').value
    try {
        const res = await fetch(url)
        const contentType = res.headers.get('content-type')
        if (typeof contentType !== 'undefined' && !contentType.match('^\\s*text/turtle\\s*(;.*)?$'))
            throw Error('unsupported content type "' + contentType + '"')
        try {
            const content = await res.text()
            const query = parseTurtle(url, content)
            editorSetQuery(query)
            refreshTurtle()
            cancelImportFromURL()
        } catch (e) {
            console.error(e)
            alert('Error: see console for details.')
        }
    } catch (e) {
        alert('Error: ' + e.message)
    }
}



/* ===== Turtle ============================================================= */


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
