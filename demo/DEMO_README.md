# Themed Application

YourCompanyUI

```
npm install
npm start
```

Dashboard Next - Introduction

Leaving Looks off for now (they're not as fun... yet)

### Hook up the first filter like in the embed demo
Inside setupDashboard, we want to add our state listener [>>](./demo.ts?line=32)
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
- Add KPIs filter (Total Gross Margin) as the Default
- Add Filter Options in dNext
- Selective Show KPI
- Lets Code some more
  - add `.on()`
  - add filtersChanged

### Layout and vis [>>](./options.example.json)

`.on('dashboard:filters:changed', filtersChanged )`

```
const filtersChanged = (event: DashboardEvent) => {
  const filters = (event.dashboard.dashboard_filters) ? event.dashboard.dashboard_filters : {}
  // update layout to match KPI filter
  if (gEvent) {
    if (filters[kpiFilter]) {
      newLayout(filters[kpiFilter].split(',') )
    } else {
      newLayout([''])
    }
  }

  gFilters = filters
}
```




