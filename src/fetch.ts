import * as Promise from 'bluebird'
import * as rp from 'request-promise'

import {JQL} from 'jqllib'

const MP_API_JQL_URI = 'https://mixpanel.com/api/2.0/jql/'

let _apiKey: string = null

/**
 * Sets the Mixpanel secret key to use for requests.
 * Note: jqllib-fetch is stateful; this key is shared across all usages.
 */
export function setApiKey(key: string): void {
    _apiKey = key
}

/**
 * Returns the results of running the `jql` at Mixpanel.
 * Note: the Mixpanel API limits running time to a few minutes.
 */
export function fetch<T>(jql: JQL<T>): Promise<T> {
    if (!_apiKey) { throw 'API key not set' }

    if (!/^\s*function\s+main()/.test(jql as string)) {
        jql = `function main() { ${jql} }`
    }

    return rp.post(MP_API_JQL_URI, {
        form: {script: jql, params: JSON.stringify({})},
        headers: {'Cache-control': 'no-cache'},
        auth: {user: _apiKey}
    })
    .then(JSON.parse)
}
