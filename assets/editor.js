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
    paramNameLabel.for = paramName
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
    paramDescriptionLabel.for = paramDescription
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

    // https://linkeddata.github.io/rdflib.js/doc/index.html
    const store = $rdf.graph()

    // const dcat = $rdf.Namespace('http://www.w3.org/ns/dcat#')
    const rdf = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    const rdfs = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')
    const schema = $rdf.Namespace('http://schema.org/')
    // const qb = $rdf.Namespace('http://purl.org/linked-data/cube#')
    const fno = $rdf.Namespace('https://w3id.org/function/ontology#')
    // const xsd = $rdf.Namespace('http://www.w3.org/2001/XMLSchema#')

    try {
        const base = $rdf.Namespace(`${name}#`)
        const query = $rdf.sym(name)

        store.add(query, rdf('a'), schema('Offer'))
        store.add(query, rdf('a'), fno('Function'))
        store.add(query, rdfs('label'), $rdf.literal(description))
        store.add(query, schema('itemOffered'), $rdf.literal('https://lab.fairease.eu/dataset-demand-register'))
        store.add(query, fno('expects'),
            params.map(p => base(`${getParameterName(p)}_param`))
        )
        params.forEach(p => {
            const param = base(`${getParameterName(p)}_param`)
            store.add(param, rdf('a'), fno('Parameter'))
            store.add(param, schema('name'), $rdf.literal(getParameterName(p)))
            store.add(param, rdfs('label'), $rdf.literal(getParameterDescription(p)))
        })

        return store.serialize(undefined, 'text/turtle')
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


function showImport() {
    const dialog = document.getElementById('editor-import')
    dialog.style.display = 'block'
}

function importQuery() {
    try {
        params_seq = 0
        params = []

        const store = $rdf.graph()
        const rdf = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
        const rdfs = $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')
        const schema = $rdf.Namespace('http://schema.org/')
        const fno = $rdf.Namespace('https://w3id.org/function/ontology#')

        const content = document.getElementById('editor-import-content').innerText
        $rdf.parse(content, store, 'https://lab.fairease.eu/dataset-demand-register/', 'text/turtle')

        const name = store.match(null, rdf('a'), fno('Function'))[0].subject
        document.getElementById('name').value = name.value

        const description = store.match(name, rdfs('label'), null)[0].object
        document.getElementById('description').value = description.value

        const ps = store.match(name, fno('expects'), null).map(p => p.object.elements.map(e => e.value)).flat()
        for (const p of ps) {
            // try {
                const sym = $rdf.sym(p)
                const name = store.match(sym, schema('name'), null)[0].object.value
                const description = store.match(sym, rdfs('label'), null)[0].object.value
                newParameter(name, description)
            // } catch {}
        }
    } catch (err) {
        console.error(err)
    }
    refreshTurtle()
    cancelImport()
}

function cancelImport() {
    document.getElementById('editor-import').style.display = 'none'
    document.getElementById('editor-import-content').innerText = ''
}
