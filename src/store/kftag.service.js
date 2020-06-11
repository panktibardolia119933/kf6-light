import $ from 'jquery'
import api from './api.js'

//Count words inside scaffold labels
export const scaffoldWordCount = (text) => {
    const doc = '<div>' + text + '</div>';
    const jq = $(doc); //convert to jquery dom element
    let labels = jq.find('.kfSupportStartLabel')
    let numwords = 0;
    for (let i = 0; i< labels.length; i++){
        numwords += labels[i].innerHTML.split(' ').length
    }
    return numwords
}
export const postProcess = async (text, contributionId, toConnections, fromConnections, handler) => {
    const doc = '<div>' + text + '</div>';
    const jq = $(doc); //convert to jquery dom element
    const endtags = {};
    const supportLinksIds = toConnections.filter((each) => each.type === 'supports')
          .map((each) => each._id) //get only toConnections of type = supports
    let supportStarts = jq.find('.KFSupportStart')
    const supportEnds = jq.find('.KFSupportEnd')
    const toCreate = []
    const supportStartsIds = []

    for (let i = 0; i < supportEnds.length; i++) {
        const elem = supportEnds[i]
        elem.innerHTML = '';
        var id = elem.id;
        endtags[id] = elem;
    }
    for (let i = 0; i < supportStarts.length; i++) {
        const elem = supportStarts[i]
        let supportId = elem.id;
        elem.innerHTML = '';
        if (supportId.startsWith('supportid_')) {
            supportId = supportId.split('_')[1];
        }
        supportStartsIds.push(supportId)
        if (!supportLinksIds.includes(supportId)) {//Is a new supportLink
            //promise to create link
            toCreate.push(api.postLink(supportId, contributionId, 'supports').then((link) => {
                //Replace id with id of new created link
                const oldId = elem.id;
                const newId = link._id;
                elem.id = newId;
                if (endtags[oldId]) {
                    endtags[oldId].id = newId;
                }
            }))
        }
    }
    const toDeleteSupports = supportLinksIds.filter((each) => !supportStartsIds.includes(each))
          .map((each) => api.deleteLink(each)) //Select toConnections that no longer appear in the tinymce text


    const referenceLinksIds = fromConnections.filter((each) => each.type === 'references').map((each) => each._id) //get only ids of fromConnections of type=references
    const kfReferences = jq.find('.KFReferenceText') //Get references dom elements
    const kfreferenceIds = []

    for (var i = 0; i < kfReferences.length; i++) {
        const elem = kfReferences[i]
        const data = {text:$(elem).find('.KFReferenceText').html()}
        elem.innerHTML = '';
        const referenceId = elem.id;
        kfreferenceIds.push(referenceId)
        if (!referenceLinksIds.includes(referenceId)) {//Is a new supportLink
            //promise to create link
            toCreate.push(api.postLink(contributionId, referenceId, 'references', data).then((link) => {
                //Replace id with id of new created link
                const oldId = elem.id;
                const newId = link._id;
                elem.id = newId;
                if (endtags[oldId]) {
                    endtags[oldId].id = newId;
                }
            }))
        }
    }

    const toDeleteReferences = referenceLinksIds.filter((each) => !kfreferenceIds.includes(each)).map((each) => api.deleteLink(each)) //Select fromConnections that no longer appear in the tinymce text

    await Promise.all(toDeleteSupports)
    await Promise.all(toDeleteReferences)
    await Promise.all(toCreate)
    return jq
}
