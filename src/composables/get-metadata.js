import { getMetadataFromApi } from '@/api/document.js'
import store from '@/store/index.js'

const sources = [
  { name: 'databnf', ext: 'data.bnf.fr', type: 'author_link' },
  { name: 'dbpedia', ext: 'dbpedia.org', type: 'author_link' },
  { name: 'idref', ext: 'idref.fr', type: 'author_link' },
  { name: 'cataloguebnf', ext: 'catalogue.bnf.fr', type: 'author_link' },
  { name: 'wikidata', ext: 'wikidata', type: 'author_link' },
  { name: 'wikipedia', ext: 'wikipedia', type: 'author_link' },
  { name: 'thenca', ext: 'thenca', type: 'document_link' },
  { name: 'hal', ext: 'hal', type: 'document_link' },
  { name: 'benc', ext: 'koha', type: 'document_link' },
  { name: 'sudoc', ext: 'sudoc.fr', type: 'document_link' },
  { name: 'biblissima', ext: 'biblissima.fr', type: 'document_link' },
  { name: 'creativecommons', ext: 'creativecommons.org', type: 'document_link' },
  { name: 'enc', ext: 'manifest', type: 'other_link' },
  { name: 'dots', ext: 'dots', type: 'other_link' }
]

function findSource (id) {
  let i = 0
  let source = null

  do {
    source = id.toLowerCase().includes(sources[i].ext) ? sources[i] : null
    i++
  } while (i < sources.length && source === null)

  if (source) {
    console.log('findSource source.name :', source.name)
    console.log('findSource source :', source)
    return { name: source.name, type: source.type }
  }

  return null
}

export default async function fetchMetadata (source, resourceId, documentType, route) {
  const startTimefetchMetadata = new Date()
  const initial_metadata = {
    id: null,
    title: null,
    author: null,
    rights: null,
    sudoc: null,
    benc: null,
    thenca: null,
    data_bnf: null,
    dbpedia: null,
    idref: null,
    catalogue_bnf: null,
    hal: null,
    wikidata: null,
    wikipedia: null,
    iiifManifestUrl: null,
    downloadPDF: null,
    downloadXML: null
  }/* document_links: [],
      author_links: [],
      other_links: [], */
  const metadata = initial_metadata

  const getMetadata = async function () {
    console.log('fetchMetadata source : ', source)
    console.log('fetchMetadata resourceId : ', resourceId)
    console.log('fetchMetadata see TOC from store.state : ', store.state.TOC)
    console.log('fetchMetadata see TOC from store.state filtered : ', store.state.TOC.filter(item => item.identifier === resourceId))
    // console.log("fetchMetadata see TOC from store.state filtered parents: ", store.state.TOC.filter(item => item.identifier === resourceId)[0].parent)
    const startTimefetchMetadataFromDots = new Date()
    let listmetadata = {}
    if (documentType === 'Resource') {
      listmetadata = await getMetadataFromApi(resourceId, 'Resource')
    } else {
      listmetadata = await getMetadataFromApi(resourceId, 'Collection')
    }
    const endTimefetchMetadataFromDots = new Date()
    console.log('fetchMetadata metadata get time from DOTS : ', endTimefetchMetadataFromDots - startTimefetchMetadataFromDots)
    const htmlnamespace = Object.keys(listmetadata['@context']).find((k) =>
      listmetadata['@context'][k].includes('html')
    )
    console.log('listmetadata htmlnamespace :', htmlnamespace)
    console.log('listmetadata listmetadata :', listmetadata)
    console.log('listmetadata route :', route)

    const dublincore = listmetadata.dublincore ? listmetadata.dublincore : null
    const extensions = listmetadata.extensions ? listmetadata.extensions : null
    console.log('---------')
    console.log('dublincore:', dublincore)

    // if (documentType.value === "Resource") {
    metadata.identifier = listmetadata['@id'] ? listmetadata['@id'] : null

    metadata.title = listmetadata.title ? listmetadata.title : ''

    metadata.type = listmetadata['@type'] ? listmetadata['@type'] : ''

    metadata.citation = listmetadata['@id'] ? `${window.location.origin}${import.meta.env.VITE_APP_APP_ROOT_URL}${route.path}` : null

    metadata.member = listmetadata.member ? listmetadata.member : []

    if (store.state.TOC.length > 0 && store.state.TOC.filter(item => item.identifier === resourceId).length > 0) {
      if (store.state.TOC.filter(item => item.identifier === resourceId)[0].parent) {
        if (Array.isArray(store.state.TOC.filter(item => item.identifier === resourceId)[0].parent) &&
                  store.state.TOC.filter(item => item.identifier === resourceId)[0].parent.length > 0) {
          metadata.parent = store.state.TOC.filter(item => item.identifier === resourceId)[0].parent.map((p) => `${p} (${store.state.TOC.filter(item => item.identifier === p)[0].citeType})`)
        } else {
          metadata.parent = store.state.TOC.filter(item => item.identifier === resourceId)[0].parent
        }
      } else {
        metadata.parent = []
      }
      /* metadata.parent = store.state.TOC.filter(item => item.identifier === resourceId)[0].parent
                            ? [store.state.TOC.filter(item => item.identifier === resourceId)[0].parent]
                            : []
            console.log("metadata.parent", metadata.parent)
          metadata.parent = metadata.parent.length > 0
                            ? metadata.parent.map((p) => `${p} (${store.state.TOC.filter(item => item.identifier === p)[0].citeType})`)
                            : []
                            */
    }

    if (dublincore) {
      if (Array.isArray(dublincore.creator)) {
        metadata.author = []
        for (const aut of dublincore.creator) {
          metadata.author.push(aut)
        }
      } else {
        metadata.author = dublincore.creator ? [dublincore.creator] : null
      }
      metadata.date = dublincore.date ? dublincore.date : null
    }
    if (listmetadata.download) {
      if (listmetadata.download.PDF) {
        metadata.downloadPDF = listmetadata.download.PDF
      }
      if (listmetadata.download.XML) {
        const source = findSource(listmetadata.download.XML)
        if (source) {
          metadata.downloadXML = { source, url: listmetadata.download.XML }
          console.log('source found:', source, listmetadata.download.XML)
        }
        // metadata.downloadXML = listmetadata.download.XML
      }

      // 9-12metadata.page = extensions["dct:extend"] ? extensions["dct:extend"] : null
      // 9-12metadata.coverage = extensions["dct:coverage"] ? extensions["dct:coverage"] : null
      // metadata.rights = extensions["dct:rights"] ? extensions["dct:rights"] : null
      // 9-12metadata.title = extensions[htmlnamespace + ":h1"] ? extensions[htmlnamespace + ":h1"] : null
    }

    /* const dublincore = listmetadata["dublincore"];
        const extensions = listmetadata["extensions"];
        console.log("---------");
        console.log("dublincore:", dublincore); */
    try {
      metadata.iiifManifestUrl = extensions['dct:source'][0]['@id']
      // layout.imageIsAvailable.value = true
    } catch {
      metadata.iiifManifestUrl = null
      // TODO: resolve why layout undefined and uncomment
      // layout.imageIsAvailable.value = false
    }

    console.log('metadata.iiifManifestUrl:', metadata.iiifManifestUrl)
    console.log('metadata:', metadata)

    if (dublincore && extensions) {
      // reset the sources
      for (const s of sources) {
        metadata[s.name] = null
      }
      console.log('metadata after reset', metadata)

      // wikidata test 26/11/2024
      // metadata.wikidata = extensions.creator_wikidata_url ? extensions.creator_wikidata_url : null
      // metadata.rights = extensions["dct:rights"] ? extensions["dct:rights"] : extensions["dct:license"] ? extensions["dct:license"] : null

      // metadata['dublincore'] = {}
      // metadata['extensions'] = {}
      for (const keydub of Object.keys(dublincore)) {
        metadata[`dc:${keydub}`] = dublincore[keydub]
        // metadata['dublincore'][keydub] = dublincore[keydub]
      }
      /* for (let keyext of Object.keys(extensions)) {
              metadata['extensions'][keyext] = extensions[keyext]
            } */

      // benc & sudoc & thenca
      if (extensions['dct:isVersionOf']) {
        metadata['dct:isVersionOf'] = []
        for (const member of extensions['dct:isVersionOf']) {
          if (member['@id']) {
            const source = findSource(member['@id'])
            if (source) {
              metadata['dct:isVersionOf'].push({ source, url: member['@id'] })
              console.log('source found:', source, member['@id'])
            }
          }
        }
      }
      // benc & sudoc & thenca
      /* if (extensions) {
              let document_links = []
              let author_links = []
              let other_links = []
              for (const object of Object.values(extensions)) {
                for (const member of object) {
                  if (member["@id"]) {
                    const source = findSource(member["@id"]);
                    console.log("source Object.values(extensions):", source);
                    if (source && source.type === "document_link") {
                      document_links.push({'source': source.name, 'url': member["@id"]})
                      metadata["document_links"] = document_links
                      console.log("source document_links found:", metadata["document_links"]);
                    } else if (source && source.type === "author_link") {
                      author_links.push({'source': source.name, 'url': member["@id"]})
                      metadata["author_links"] = author_links
                      console.log("source author_links found:", metadata["author_links"]);
                    } else if (source && source.type === "other_link"){
                      other_links.push({'source': source.name, 'url': member["@id"]})
                      metadata["other_links"] = other_links
                      console.log("source other_links found:", metadata["other_links"]);
                    }
                  }
                }
              }
            } */
      // license
      if (extensions['dct:license']) {
        const source = findSource(extensions['dct:license'])
        if (source) {
          metadata['dct:license'] = { source, url: extensions['dct:license'] }
          console.log('source found:', source, extensions['dct:license'])
        }
      }
      // use rights instead of license if present
      if (extensions['dct:rights']) {
        const source = findSource(extensions['dct:rights'])
        if (source) {
          metadata['dct:rights'] = extensions['dct:rights']
          console.log('source found:', source, extensions['dct:rights'])
        }
      }

      // publisher
      if (extensions['dct:publisher']) {
        metadata['dct:publisher'] = extensions['dct:publisher']
      }

      // creators
      if (Array.isArray(extensions['dct:creator'])) {
        metadata['dct:creator'] = []
        for (const aut of extensions['dct:creator']) {
          if (aut['@id']) {
            // find the source name from its extension
            const source = findSource(aut['@id'])
            if (source) {
              metadata['dct:creator'].push({ source, url: aut['@id'] })
              console.log('source found:', source, aut['@id'])
            }
          }
        }
      }
    }
    /* } else {
          console.log("getMetadata this is a collection !!!!!!!!!")
          //reset to null
          Object.keys(metadata).forEach(key => {
            Object.assign(metadata, { [key]: null })
          });
          console.log("getMetadata this is a collection updated metadata", metadata)
        } */
    // return metadata
  }
  await getMetadata()
  const endTimefetchMetadata = new Date()
  console.log('fetchMetadata metadata TimeBuild Meta : ', endTimefetchMetadata - startTimefetchMetadata)
  return metadata
}
