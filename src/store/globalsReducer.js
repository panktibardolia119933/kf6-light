import { createAction, createReducer } from '@reduxjs/toolkit';
import api from './api.js'

export const setCommunity = createAction('SET_COMMUNITY')
export const setCommunityId = createAction('SET_COMMUNITY_ID')
export const setViewId = createAction('SET_VIEW_ID')
export const setAuthor = createAction('SET_AUTHOR')
export const setView = createAction('SET_VIEW')

const initState = {
    communityId: sessionStorage.getItem('communityId'),
    viewId: sessionStorage.getItem('viewId'),
    contextId: '',
    // communityId: '5e445735d525b936837f7450',
    author: {},
    view: null,
    community: null
}

export const globalsReducer = createReducer(initState, {
    [setCommunityId]: (state, action) => {
        state.communityId = action.payload
    },
    [setViewId]: (state, action) => {
        state.communityId = action.payload
    },
    [setAuthor]: (state, action) => {
        state.author = action.payload
    },
    [setView]: (state, action) => {
        state.view = action.payload
    },
    [setCommunity]: (state, action) => {
        state.community = action.payload
        state.contextId = action.payload.rootContextId
    }
});

export const fetchAuthor = (communityId) => {
    return dispatch => {
        return api.getAuthor(communityId).then( res => {
            dispatch(setAuthor(res.data));
        })
    }
}

export const fetchView = (viewId) => {
    return dispatch => {
        return api.getObject(viewId).then( res => {
            dispatch(setView(res.data))
        })
    }
}

export const fetchCommunity = (communityId) => {
    return dispatch => {
        return api.getCommunity(communityId).then( res => {
            dispatch(setCommunity(res.data))
        })
    }
}
