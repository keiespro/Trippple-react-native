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

const potentialsHelper = algoliaSearchHelper(algoliasearch(ALGOLIA_APP_ID, ALGOLIA_READ_KEY), 'User', {
  hitsPerPage: 50,
  hierarchicalFacets: [{
    name: 'users',
    attributes: ['id'],
    sortBy: ['desc']
  }],
  facets: ['id','relationship_status','gender','age']
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


export async function fetchPotentials({relationshipStatus, gender, distanceMiles = 25, minAge = 18, maxAge = 80, coords} = defaults, liked = [], page = 0){
  const c = getGeo(coords)
  try{
    potentialsHelper.clearRefinements();
    for(i of liked){
      potentialsHelper.addNumericRefinement('id', '!=', i)
    }
    if(gender){
      potentialsHelper.addFacetRefinement('gender', gender)

    }
    const result = await potentialsHelper.addFacetRefinement('relationship_status', relationshipStatus)
      .addNumericRefinement('age', '>=', 18)
      .addNumericRefinement('age', '<=', 80)
      .setQueryParameter(c.geoLabel, c.geoValue)
      .setQueryParameter('getRankingInfo', true)
      .setQueryParameter('aroundPrecision', 100)
      .setQueryParameter('aroundRadius', distanceMiles*1609)
      // .setPage(page)
      .searchOnce();
    return ({
      matches: result.content.hits.map((h, i) => (
        {
          user: h,
          partner: {
            id: h.partner_id || `NONE`
          },
          couple: {
            id: h.couple_id || `NONE`
          }
        }
      ))
    })
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
