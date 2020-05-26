import axios from 'axios';
const apiUrl = "http://localhost:8000/api";

const getCommunity = (communityId) => {
    return axios.get(`${apiUrl}/communities/${communityId}`);//, {mode: 'cors'});
    // return fetch;
}

const  getScaffoldLinks = async(contextId) => {
    return await getLinksFrom(contextId, 'uses');
}

const getLinksFrom = async (fromId, type) => {
    let links = await axios.get(`${apiUrl}/links/from/${fromId}`);
    links = links.data;
    if (type) {
        links = links.filter(function (each) {
            return each.type === type;
        });
    }
    return links
}

const getObject = (objectId) => {
    return axios.get(`${apiUrl}/objects/${objectId}`);
}

export default {getCommunity, getScaffoldLinks, getLinksFrom, getObject}
