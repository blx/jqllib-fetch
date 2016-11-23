# jqllib-fetch

You have a string containing a Mixpanel JQL query. You want to execute it programatically in Node.

This is a TINY wrapper around `request-promises` that sets auth headers and request format.

Just do
```typescript
import * as jqlFetch from 'jqllib-fetch'

jqlFetch.setApiKey("MIXPANEL_SECRET_KEY")

jqlFetch
    .fetch(`function main() { return Events(...)... }`)    // Returns a Bluebird promise
    .then(events => {
        // Do stuff with your list of events, or whatever your query was
    })
```

`jqllib-fetch` also plays nicely with `jqllib`, if you are using TypeScript and want typesafe queries:
```typescript
import {JQL, MPEvent} from 'jqllib'

const query: JQL<{distinctId: string, events: MPEvent[]}[]> = jqllib.groupedJql(
    ['2016-01-01', '2016-03-01'],
    ['Fantastic Event', 'Fun Event', 'Lil event']
)

jqlFetch
    .fetch(query)
    .then(groups => {
        // do stuff...
    })
```
