import axios from 'axios';
const apiUrl = "http://localhost:8000/api";
// const apiUrl = 'https://kf6-stage.ikit.org/api'

const token = sessionStorage.getItem('token');
const config = {
    headers: { Authorization: `Bearer ${token}` }
};

//Contribution
const postContribution = (communityId, obj) => {
    return axios.post(`${apiUrl}/contributions/${communityId}`, obj, config);//, {mode: 'cors'});
}

//Community
const getCommunity = (communityId) => {
    return axios.get(`${apiUrl}/communities/${communityId}`, config);//, {mode: 'cors'});
}

//Links
const getLinks = async (objectId, direction, type) => {
    let links = await axios.get(`${apiUrl}/links/${direction}/${objectId}`, config);
    links = links.data;
    if (type) {
        links = links.filter(function (each) {
            return each.type === type;
        });
    }
    return links
}

const postLink = async (fromId, toId, type, data) => {
    return (await axios.post(`${apiUrl}/links`, {from: fromId, to: toId, type:type, data:data}, config)).data
}

const deleteLink = async (linkId) => {
    return (await axios.delete(`${apiUrl}/links/${linkId}`, config).data)
}

//Object
const getObject = (objectId) => {
    return axios.get(`${apiUrl}/objects/${objectId}`, config);
}

const putObject = async (object, communityId, objectId) => {
    return (await axios.put(`${apiUrl}/objects/${communityId}/${objectId}`, object, config)).data
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
    console.log("Get Author")
    return axios.get(`${apiUrl}/authors/${communityId}/me`, config)
}

const uploadFile = (file, onProgress) => {
    var formData = new FormData();
    formData.append("file", file);
    return axios.post(`${apiUrl}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...config.headers
        },
        onUploadProgress: onProgress,
    })
}

export default {postContribution, getCommunity,
                getLinks, getObject, createAttachment,
                getAuthor, uploadFile, putObject,
                postLink, deleteLink
               }
