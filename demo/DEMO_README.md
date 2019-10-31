# Themed Application

Switched over to your UI / your application where we will be embedding Looker into and start wrapping all the functionality together

`npm install`

`npm start`

Dashboard Next - Introduction

Leaving Looks off for now (they're not as fun... yet)

### Hook up the first filter like in the embed demo
```
const filtersChanged = (event: DashboardEvent) => {
  const filters = (event.dashboard.dashboard_filters) ? event.dashboard.dashboard_filters : {}
  // check for date change
  if (gFilters && filters[dateMap[0]] && gFilters[dateMap[0]] && filters[dateMap[0]] !== gFilters[dateMap[0]]) {
    gLookQuery = buildQuery(filters)
    buildTrending();
    gDashboard.run();
  }
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