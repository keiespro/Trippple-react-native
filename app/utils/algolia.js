import algoliasearch from 'algoliasearch/reactnative'
import algoliaSearchHelper from 'algoliasearch-helper';

const ALGOLIA_APP_ID = '4EUY1VTSEK';
const ALGOLIA_READ_KEY = 'b8bc2299cd2d7beef40707a3c152cf38';

const helper = algoliaSearchHelper(algoliasearch(ALGOLIA_APP_ID, ALGOLIA_READ_KEY), 'User', {
  hitsPerPage: 20,
  hierarchicalFacets: [{
    name: 'users',
    attributes: ['id'],
    sortBy: ['desc']
  }]
});

const geoHelper = algoliaSearchHelper(algoliasearch(ALGOLIA_APP_ID, ALGOLIA_READ_KEY), 'User', {
  hitsPerPage: 20,
  getRankingInfo: true,
});

const popularityHelper = algoliaSearchHelper(algoliasearch(ALGOLIA_APP_ID, ALGOLIA_READ_KEY), 'User_by_popularity', {
  hitsPerPage: 20,
});

const defaults = {relationshipStatus: 'single', gender: 'f', distanceInMeters: 48280, minAge: 18, maxAge: 60, coords: null}


function getGeo(coords){
  let c;
  if(coords && coords.lat && coords.lng){
    c = { geoLabel: 'aroundLatLng', geoValue: `${coords.lat.toFixed(2)},${coords.lng.toFixed(2)}` }
  }else{
    c = { geoLabel: 'aroundLatLngViaIP', geoValue: true }
  }
  return c
}


export async function fetchPotentials({relationshipStatus, gender, distanceInMeters, minAge, maxAge, coords} = defaults, page = 20){
  const c = getGeo(coords)

  try{

    const result = await helper.addFacetRefinement('relationship_status', relationshipStatus)
      .addFacetRefinement('gender', gender)
      .addNumericRefinement('age', '>=', minAge)
      .addNumericRefinement('age', '<=', maxAge)
      .setQueryParameter(c.geoLabel, c.geoValue)
      .setQueryParameter('getRankingInfo', true)
      .setQueryParameter('aroundRadius', distanceInMeters)
      .searchOnce();

    return ({matches: result.content.hits.map((h, i) => ({user: h, partner: {id: `partner${i}`}, couple: {id: `couple${i}`}}))})
  }catch(err){
    __DEV__ && console.error(err)
    return err
  }
}

function formatForBrowse(result){
  return result.content.hits.reduce((acc, hit) => {
    const sum = acc;
    sum[hit.id] = {user: hit, likedAt: null}
    return acc
  }, {})
}

export async function fetchNewestBrowse(params){
  try{

    const result = await helper
      .setQueryParameter('getRankingInfo', true)
      .setPage(params.page)
      .searchOnce();

    return formatForBrowse(result)

  }catch(err){
    __DEV__ && console.error(err)
    return err
  }
}



export async function fetchPopularBrowse(params){
  try{

    const result = await popularityHelper
      .setQueryParameter('getRankingInfo', true)
      .setPage(params.page)
      .searchOnce();

    return formatForBrowse(result)

  }catch(err){
    __DEV__ && console.error(err)
    return err
  }
}


export async function fetchNearbyBrowse(params){
  try{
    const c = getGeo(params.coords)
    const result = await geoHelper
      .setQueryParameter(c.geoLabel, c.geoValue)
      .setQueryParameter('aroundRadius', 20000)
      .setQueryParameter('aroundPrecision', 100)
      .setPage(params.page)
      .searchOnce();

    return formatForBrowse(result)
  }catch(err){
    __DEV__ && console.error(err)
    return err
  }
}
