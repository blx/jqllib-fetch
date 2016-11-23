import btoa from 'btoa'
import __fetch from 'fetch-ponyfill'
const {fetch: _fetch, Headers, Request} = __fetch()
import formurlencoded from 'form-urlencoded'

import {DateRange, JQL} from '../types'

const MP_API_JQL_URI = 'https://mixpanel.com/api/2.0/jql/'

let _headers = new Headers()
_headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')

/**
 * Sets the Mixpanel secret key to use for requests.
 * Note: jqllib is stateful; this key is shared across all usages.
 */
// str -> ()
export function setApiKey(key: string) {
    _headers.set('Authorization', `Basic ${btoa(key + ':')}`)
}

/**
 * Returns the results of running the `jql` at Mixpanel.
 * Note: the Mixpanel API limits running time to a few minutes.
 */
// str -> Promise<?>
function mpFetch<T>(jql: JQL<T>) {
    if (!_headers.has('Authorization')) { throw 'API key not set' }

    jql = `function main() { ${jql} }`

    const data = formurlencoded({
        script: jql,
        params: JSON.stringify({})
    })

    return _fetch(new Request(MP_API_JQL_URI), {
        method: 'POST',
        headers: _headers,
        body: data,
        cache: 'no-cache'
    })
    .then(r => r.json())
}
export const fetch = mpFetch
