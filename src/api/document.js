const _baseApiURL = `${process.env.VUE_APP_API_URL}`;


async function getMetadataFromApi(id, options={}) {
    const response_metadata = await fetch(`${_baseApiURL}/collection?id=${id}`, {mode: 'cors', ...options})
    const metadata = await response_metadata.json()
    return metadata
}

async function getDocumentFromApi(id, options={}) {
    const response = await fetch(`${_baseApiURL}/document?resource=${id}&mediaType=html`, {mode: 'cors', ...options})
    const document = await response.text()
    return document
}

async function getTOCFromApi(id, options={}) {
    const response = await fetch(`${_baseApiURL}/navigation?resource=${id}&down=-1`, {mode: 'cors', ...options})
    const document = await response.json()
    return document
}

export {
    getDocumentFromApi,
    getMetadataFromApi,
    getTOCFromApi
}