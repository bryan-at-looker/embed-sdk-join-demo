# Themed Application

Switched over to your UI / your application where we will be embedding Looker into and start wrapping all the functionality together

`npm install`

`npm start`

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

but its not running... lets add a run event
`dashboard.run()`

But this isn't really [>>](./demo.ts?line=37)
```

```

