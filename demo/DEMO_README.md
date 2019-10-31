# Themed Application

Switched over to your UI / your application where we will be embedding Looker into and start wrapping all the functionality together

`npm install`

`npm start`

Dashboard Next - Introduction

Leaving Looks off for now (they're not as fun... yet)

### Hook up the first filter like in the embed demo
Inside setupDashboard, we want to add our state listener
```
const stateFilter = document.querySelector('#state-filter')
if (stateFilter) {
  stateFilter.addEventListener('change', (event) => {
    dashboard.updateFilters({ 'State': (event.target as HTMLSelectElement).value })
  })
}
```

