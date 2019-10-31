# Adding the API
Dropdown not dynamic, populate with data

[Query we want to embed](https://johnkuitheme.dev.looker.com/explore/thelook/order_items?qid=YBvxBBvdwfNnmAwrsLz7Eu&toggle=fil)

### install SDK
_to do_
* `npm install @looker/sdk`
* code for Auth
* code for API query
* code for API query
* Mention CORS

### Update the dropdown

```
const dropdownHeader = (innerHTML: string) => {
  var header = document.createElement('div')
  header.classList.add('header')
  header.innerHTML = innerHTML
  return header
}

const dropdownItem = (row: any) => {
  var item = document.createElement('div')
  item.setAttribute('data-value',row[filterField])
  item.classList.add('item')
  const options = (row[filterFieldValue] > 0) ? ['green','▲'] : (row[filterFieldValue] < 0) ? ['red','▼'] : ['black','']
  const format = Number(row[filterFieldValue]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
  item.innerHTML = `${row[filterField]} <font color="${options[0]}">${options[1]} ${format}</font>`
  return item
}

const buildTrending = async (data: any) => {
  // use temp data for now
  data = tempQueryResponse; 
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
