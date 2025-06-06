/// Query parameters
let params_seq = 0
let params = []
let measures_seq = 0
let measures = []
let dimensions_seq = 0
let dimensions = []
let concepts_seq = 0
let concepts = []


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
    document.getElementById('editor-result-measures').innerHTML = ''
    document.getElementById('editor-result-dimensions').innerHTML = ''
    document.getElementById('editor-concepts').innerHTML = ''
    params_seq = 0
    params = []
    measures_seq = 0
    measures = []
    dimensions_seq = 0
    dimensions = []
    concepts_seq = 0
    concepts = []
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
    const paramName = `param-${n}-label`
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
    return document.getElementById(`param-${n}-label`).value.trim()
}

function getParameterDescription(n) {
    return document.getElementById(`param-${n}-description`).value.trim()
}


/**
 * Create a new measure for the query.
 */
function newMeasure(name, type, concept) {
    measures_seq += 1
    measures.push(measures_seq)
    const measureElem = newMeasureHTML(measures_seq, name, type, concept)
    const measuresElem = document.getElementById('editor-result-measures')
    measuresElem.appendChild(measureElem)
    refreshTurtle()
}

/**
 * Create the HTML elements for the new measure.
 */
function newMeasureHTML(n, name, type, concept) {
    const measure = document.createElement('tr')
    measure.id = `measure-${n}`
    // measure name
    const measureName = `measure-${n}-label`
    const measureNameInput = document.createElement('input')
    measureNameInput.type = 'text'
    measureNameInput.id = measureName
    measureNameInput.value = name || ''
    measureNameInput.oninput = () => { refreshTurtle() }
    measure.append(td(measureNameInput))
    // measure type
    const measureType = `measure-${n}-range`
    const measureTypeInput = document.createElement('input')
    measureTypeInput.type = 'text'
    measureTypeInput.id = measureType
    measureTypeInput.value = type || ''
    measureTypeInput.oninput = () => { refreshTurtle() }
    measure.append(td(measureTypeInput))
    // measure concept
    const measureConcept = `measure-${n}-concept`
    const measureConceptInput = document.createElement('input')
    measureConceptInput.type = 'text'
    measureConceptInput.id = measureConcept
    measureConceptInput.value = concept || ''
    measureConceptInput.oninput = () => { refreshTurtle() }
    measure.append(td(measureConceptInput))
    // remove
    const measureRemoveButton = document.createElement('button')
    measureRemoveButton.innerText = 'remove'
    measureRemoveButton.onclick = () => { removeMeasure(n) }
    measure.append(td(measureRemoveButton))
    //
    return measure
}

function removeMeasure(n) {
    const measure = document.getElementById(`measure-${n}`)
    measure.parentElement.removeChild(measure)
    measures = measures.filter(p => p !== n)
    refreshTurtle()
}

function getMeasureName(n) {
    return document.getElementById(`measure-${n}-label`).value.trim()
}

function getMeasureRange(n) {
    return document.getElementById(`measure-${n}-range`).value.trim()
}

function getMeasureConcept(n) {
    return document.getElementById(`measure-${n}-concept`).value.trim()
}


/**
 * Create a new dimension for the query.
 */
function newDimension(name, type, concept) {
    dimensions_seq += 1
    dimensions.push(dimensions_seq)
    const dimensionElem = newDimensionHTML(dimensions_seq, name, type, concept)
    const dimensionsElem = document.getElementById('editor-result-dimensions')
    dimensionsElem.appendChild(dimensionElem)
    refreshTurtle()
}

/**
 * Create the HTML elements for the new dimension.
 */
function newDimensionHTML(n, name, type, concept) {
    const dimension = document.createElement('tr')
    dimension.id = `dimension-${n}`
    // dimension name
    const dimensionName = `dimension-${n}-label`
    const dimensionNameInput = document.createElement('input')
    dimensionNameInput.type = 'text'
    dimensionNameInput.id = dimensionName
    dimensionNameInput.value = name || ''
    dimensionNameInput.oninput = () => { refreshTurtle() }
    dimension.append(td(dimensionNameInput))
    // dimension type
    const dimensionType = `dimension-${n}-range`
    const dimensionTypeInput = document.createElement('input')
    dimensionTypeInput.type = 'text'
    dimensionTypeInput.id = dimensionType
    dimensionTypeInput.value = type || ''
    dimensionTypeInput.oninput = () => { refreshTurtle() }
    dimension.append(td(dimensionTypeInput))
    // dimension concept
    const dimensionConcept = `dimension-${n}-concept`
    const dimensionConceptInput = document.createElement('input')
    dimensionConceptInput.type = 'text'
    dimensionConceptInput.id = dimensionConcept
    dimensionConceptInput.value = concept || ''
    dimensionConceptInput.oninput = () => { refreshTurtle() }
    dimension.append(td(dimensionConceptInput))
    // remove
    const dimensionRemoveButton = document.createElement('button')
    dimensionRemoveButton.innerText = 'remove'
    dimensionRemoveButton.onclick = () => { removeDimension(n) }
    dimension.append(td(dimensionRemoveButton))
    //
    return dimension
}

function removeDimension(n) {
    const dimension = document.getElementById(`dimension-${n}`)
    dimension.parentElement.removeChild(dimension)
    dimensions = dimensions.filter(p => p !== n)
    refreshTurtle()
}

function getDimensionLabel(n) {
    return document.getElementById(`dimension-${n}-label`).value.trim()
}

function getDimensionRange(n) {
    return document.getElementById(`dimension-${n}-range`).value.trim()
}

function getDimensionConcept(n) {
    return document.getElementById(`dimension-${n}-concept`).value.trim()
}


/**
 * Create a new dimension for the query.
 */
function newConcept(name, definition, uri) {
    concepts_seq += 1
    concepts.push(concepts_seq)
    const conceptElem = newConceptHTML(concepts_seq, name, definition, uri)
    const conceptsElem = document.getElementById('editor-concepts')
    conceptsElem.appendChild(conceptElem)
    refreshTurtle()
}


/**
 * Create the HTML elements for the new concept.
 */
function newConceptHTML(n, name, definition, uri) {
    const concept = document.createElement('tr')
    concept.id = `concept-${n}`
    // concept name
    const conceptName = `concept-${n}-label`
    const conceptNameInput = document.createElement('input')
    conceptNameInput.type = 'text'
    conceptNameInput.id = conceptName
    conceptNameInput.value = name || ''
    conceptNameInput.oninput = () => { refreshTurtle() }
    concept.append(td(conceptNameInput))
    // concept definition
    const conceptDefinition = `concept-${n}-definition`
    const conceptDefinitionInput = document.createElement('input')
    conceptDefinitionInput.type = 'text'
    conceptDefinitionInput.id = conceptDefinition
    conceptDefinitionInput.value = definition || ''
    conceptDefinitionInput.oninput = () => { refreshTurtle() }
    concept.append(td(conceptDefinitionInput))
    // concept uri
    const conceptURI = `concept-${n}-uri`
    const conceptURIInput = document.createElement('input')
    conceptURIInput.type = 'text'
    conceptURIInput.id = conceptURI
    conceptURIInput.value = uri || ''
    conceptURIInput.oninput = () => { refreshTurtle() }
    concept.append(td(conceptURIInput))
    // remove
    const conceptRemoveButton = document.createElement('button')
    conceptRemoveButton.innerText = 'remove'
    conceptRemoveButton.onclick = () => { removeConcept(n) }
    concept.append(td(conceptRemoveButton))
    //
    return concept
}

function removeConcept(n) {
    const concept = document.getElementById(`concept-${n}`)
    concept.parentElement.removeChild(concept)
    concepts = concepts.filter(p => p !== n)
    refreshTurtle()
}

function getConceptLabel(n) {
    return document.getElementById(`concept-${n}-label`).value.trim()
}

function getConceptDefinition(n) {
    return document.getElementById(`concept-${n}-definition`).value.trim()
}

function getConceptURI(n) {
    return document.getElementById(`concept-${n}-uri`).value.trim()
}


function td(child) {
    const elem = document.createElement('td')
    elem.append(child)
    return elem
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
    const queryConcepts = concepts.map(c => ({
        label: getConceptLabel(c),
        definition: getConceptDefinition(c),
        uri: getConceptURI(c),
    }))
    const unknownConcepts = []
    function validateConcept(label) {
        if (queryConcepts.findIndex(c => c.label === label) === -1) {
            unknownConcepts.push(label)
        }
        return label
    }
    const queryMeasures = measures.map(m => ({
        label: getMeasureName(m),
        concept: validateConcept(getMeasureConcept(m)),
        range: getMeasureRange(m),
    }))
    const queryDimensions = dimensions.map(d => ({
        label: getDimensionLabel(d),
        concept: validateConcept(getDimensionConcept(d)),
        range: getDimensionRange(d),
    }))

    if (unknownConcepts.length > 0) {
        return `Error: the following concepts are not defined: ${unknownConcepts.join(', ')}`
    }

    try {
        return serialiseAsTurtle({
            name,
            description,
            params: queryParams,
            returns: {
                measures: queryMeasures,
                dimensions: queryDimensions,
            },
            concepts: queryConcepts
        })
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


function editorSetQuery(query) {
    try {
        params_seq = 0
        params = []
        const conceptRefs = Object.keys(query.concepts ?? [])
        document.getElementById('name').value = query.name
        document.getElementById('description').value = query.description
        query.params?.forEach(({ name, description }) => {
            newParameter(name, description)
        })
        conceptRefs.forEach(conceptId => {
            const concept = query.concepts[conceptId]
            newConcept(concept.label, concept.definition, concept.uri)
        })
        query.returns.measures?.forEach(({ label, range, concept }) => {
            newMeasure(label, range, query.concepts[concept].label)
        })
        query.returns.dimensions?.forEach(({ label, range, concept }) => {
            newDimension(label, range, query.concepts[concept].label)
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
