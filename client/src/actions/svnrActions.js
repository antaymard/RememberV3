
export function fetchSouvenirList(svnrs) {
  return {
    type : "FETCH_SVNRS_SUCCESS",
    payload : svnrs
  }
}
