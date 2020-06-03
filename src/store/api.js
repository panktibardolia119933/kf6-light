import axios from 'axios';
// const apiUrl = "http://localhost:8000/api";
const apiUrl = 'https://kf6-stage.ikit.org/api'

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

export default {getCommunity, getScaffoldLinks, getLinksFrom, getObject}
