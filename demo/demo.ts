import { LookerEmbedSDK, LookerEmbedLook, LookerEmbedDashboard } from '../src/index'
import { lookerHost, dashboardId, lookId } from './demo_config'
import { DashboardEvent, LookerEmbedFilterParams } from '../src/types'

LookerEmbedSDK.init(lookerHost, '/auth')

let gEvent: DashboardEvent
let gFilters: LookerEmbedFilterParams
let gDashboard: LookerEmbedDashboard

const setupDashboard = (dashboard: LookerEmbedDashboard) => {
  gDashboard = dashboard
  const stateFilter = document.querySelector('#state-filter')
  if (stateFilter) {
    stateFilter.addEventListener('change', (event) => {
      dashboard.updateFilters({ 'State': (event.target as HTMLSelectElement).value })
      dashboard.run()
    })
  }
}

const setupLook = (look: LookerEmbedLook) => {
  const runButton = document.querySelector('#run')
  if (runButton) {
    runButton.addEventListener('click', () => look.run())
  }
  const stateFilter = document.querySelector('#state')
  if (stateFilter) {
    stateFilter.addEventListener('change', (event) => {
      look.updateFilters({ 'users.state': (event.target as HTMLSelectElement).value })
    })
  }
}

const updateState = (selector: string, state: string) => {
  const dashboardState = document.querySelector(selector)
  if (dashboardState) {
    dashboardState.textContent = state
  }
}

const canceller = (event: any) => {
  updateState('#dashboard-state', `${event.label} clicked`)
  return { cancel: !event.modal }
}

document.addEventListener('DOMContentLoaded', function () {
  if (dashboardId) {
    LookerEmbedSDK.createDashboardWithId(dashboardId)
      .appendTo('#dashboard')
      .withClassName('looker-embed')
      .build()
      .connect()
      .then(setupDashboard)
      .catch((error: Error) => {
        console.error('Connection error', error)
      })
  } else {
    document.querySelector<HTMLDivElement>('#demo-dashboard')!.style.display = 'none'
  }

  if (lookId) {
    LookerEmbedSDK.createLookWithId(lookId)
      .appendTo('#look')
      .on('look:run:start', () => updateState('#look-state', 'Running'))
      .on('look:run:complete', () => updateState('#look-state', 'Done'))
      .withClassName('looker-embed')
      .withFilters({ 'users.state': 'California' })
      .build()
      .connect()
      .then(setupLook)
      .catch((error: Error) => {
        console.error('Connection error', error)
      })
  } else {
    document.querySelector<HTMLDivElement>('#demo-look')!.style.display = 'none'
  }
})

