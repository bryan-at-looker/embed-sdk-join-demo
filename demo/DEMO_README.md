# Themed Application

YourCompanyUI

Dashboard Next - Introduction

Leaving Looks off for now (they're not as fun... yet)

### Hook up the first filter like in the embed demo
Inside setupDashboard, we want to add our state listener [>>](./demo.ts?line=38)
```
const stateFilter = document.querySelector('#state-filter')
if (stateFilter) {
  stateFilter.addEventListener('change', (event) => {
    dashboard.updateFilters({ 'State': (event.target as HTMLSelectElement).value })
  })
}
```

but its not running on click... lets add a run event
`dashboard.run()`


### Dynamic Dashboards
- Lets have FUN
- Dense Dashboard, lets make it dynamic
- [Edit Dashboard](https://master.dev.looker.com/dashboards/2467)
- Add KPIs filter (Active Users) as the Default
- Add Filter Options in dNext
- Selective Show KPI
- Lets Code some more
  - add `.on()`
  - add filtersChanged

### Layout and vis [>>](./options.example.json)

[>>](./demo.ts?line=77)

```
.on('dashboard:run:complete', dashboardRunComplete)
```
```
const dashboardRunComplete = (event: DashboardEvent) => {
  if (!gEvent || !gEvent.dashboard) {
    gEvent = event
  }
  newLayout(event.dashboard.dashboard_filters['KPIs'].split(','))
}
```

### Logic to control the layout changes
```
const newLayout = (kpis: string[]) => {
  var copy_options = JSON.parse(JSON.stringify(gEvent.dashboard.options));
  const elements = copy_options.elements || {};
  const layout = copy_options.layouts[0];
  const components = (layout.dashboard_layout_components) ? layout.dashboard_layout_components : {};
  var copy_layout = Object.assign({},layout)
  
  var new_components: any = []
  
  Object.keys(elements).forEach(el_key=>{
    var comp_found = components.filter((c: any)=>{return c.dashboard_element_id.toString() === el_key})[0]
    if (kpis.indexOf(elements[el_key]['title']) > -1) {
      new_components.push(comp_found)
    } else {
      new_components.push(Object.assign(comp_found,{ row: 0, column: 0, height: 0, width: 0 }))
    }
  })
  copy_layout.dashboard_layout_components = new_components
  var copy_elements = Object.assign({},elements)
  Object.keys(copy_elements).forEach(el_key=>{
    copy_elements[el_key]['title_hidden'] = true
  })
  gDashboard.setOptions({ layouts: [copy_layout], elements: copy_elements})
}
```

```
.on('dashboard:filters:changed', filtersChanged )
```


```
const filtersChanged = (event: DashboardEvent) => {
  const filters = (event.dashboard.dashboard_filters) ? event.dashboard.dashboard_filters : {}
  // update layout to match KPI filter
  if (gEvent) {
    if (filters['KPIs']) {
      newLayout(filters['KPIs'].split(',') )
    } else {
      newLayout([''])
    }
  }
  gFilters = filters
}
```

