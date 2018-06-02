export default function reducer(state = {
  souvenirList : [],
  fetching : false,
  fetched : false,
  error : null,
}, action) {

  // ALL THE ACTIONS HERE
  switch (action.type) {
    case "FETCHING_SVNRS" : {
      return {...state, fetching : true}
    }
    case 'FETCH_SVNRS_REJECTED' : {
      return {...state, fetching : false, error: action.payload}
    }
    case 'FETCH_SVNRS_SUCCESS' : {
      return {
        ...state,
        fetching : false,
        fetched : true,
        souvenirList : action.payload,
      }
    }
  }




  return state
}
