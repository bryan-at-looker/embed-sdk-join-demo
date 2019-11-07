# Adding the API
Dropdown not dynamic, populate with data

[Query we want to embed](https://johnkuitheme.dev.looker.com/explore/thelook/order_items?qid=YBvxBBvdwfNnmAwrsLz7Eu&toggle=fil)

# SDK for the API

- Gives developers many supported shortcuts (login, managing tokens, types, all calls)
- CORS Compatibility
  - Previously, every Looker API call needed to be server-side / proxied
  - Opening up support for the browser to make authenticated requests

### SDK is installed

- Instantiate an EmbedSession from the SDK
- Backend request to give me a Bearer Token
- API calls as the user directly from your front end code
- Trending states, single query directly to Looker with access controls

```
const session = new EmbedSession({
  base_url: `https://${lookerHost}:19999`,
  api_version: '3.1'
} as IApiSettings)
gSDK = new LookerSDK(session)
```

### Update the dropdown

```
const buildTrending = async () => {
  var query: any = await gSDK.ok(gSDK.create_query(apiStateQuery))
  var data: any = await gSDK.ok(gSDK.run_query({
    result_format: 'json',
    query_id: query.id
  }))
  var menu = document.createElement('div')
  menu.appendChild(dropdownHeader('<h5>Top 5</h5>'))
  data.slice(0,5).forEach((row: any)=>{
    menu.appendChild(dropdownItem(row))
  })
  menu.appendChild(dropdownHeader('<h5>Bottom 5</h5>'))
  data.slice(-5).forEach((row: any)=>{
    menu.appendChild(dropdownItem(row))
  })

  var dropdown = document.getElementById('dropdown-menu')
  if (dropdown) {
    dropdown.innerHTML = menu.innerHTML || ''
  }
}
```
call buildTrending
