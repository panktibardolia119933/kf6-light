import axios from 'axios';
const apiUrl = "http://localhost:8000/api";
// const apiUrl = 'https://kf6-stage.ikit.org/api'

const token = sessionStorage.getItem('token');
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

const getCommunity = (communityId) => {
    return axios.get(`${apiUrl}/communities/${communityId}`, config);//, {mode: 'cors'});
    // return fetch;
}

const  getScaffoldLinks = async(contextId) => {
    return await getLinksFrom(contextId, 'uses');
}

const getLinksFrom = async (fromId, type) => {
    let links = await axios.get(`${apiUrl}/links/from/${fromId}`, config);
    links = links.data;
    if (type) {
        links = links.filter(function (each) {
            return each.type === type;
        });
    }
    return links
}

const getObject = (objectId) => {
    return axios.get(`${apiUrl}/objects/${objectId}`, config);
}

const createAttachment = (communityId, authorId) => {
    var newobj = {
        communityId: communityId,
        type: 'Attachment',
        title: 'an Attachment',
        authors: [authorId],
        status: 'unsaved',
        permission: 'protected',
        data: {
            version: 0
        }
    };
    return axios.post(`${apiUrl}/contributions/${communityId}`, newobj, config)
}

const getAuthor = (communityId) => {
    return axios.get(`${apiUrl}/authors/${communityId}/me`, config)
}

const uploadFile = (file, onProgress) => {
    var formData = new FormData();
    formData.append("file", file);
    return axios.post(`${apiUrl}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...config.headers
        }
    })
}

const modifyObject = (object, communityId) => {
    return axios.put(`${apiUrl}/objects/${communityId}`, object, config)
}

const postAttachmentLink = (attachId, contribId) => {
    return axios.post(`${apiUrl}/links/`,
                      {from: contribId, to: attachId, type:'attach'},
                      config)
}

export default {getCommunity, getScaffoldLinks,
                getLinksFrom, getObject, createAttachment,
                getAuthor, uploadFile, modifyObject, postAttachmentLink}
