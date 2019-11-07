import { LookerEmbedSDK, LookerEmbedLook, LookerEmbedDashboard } from '../src/index'
import { lookerHost, dashboardId, lookId } from './demo_config'

LookerEmbedSDK.init(lookerHost, '/auth')

const setupDashboard = (dashboard: LookerEmbedDashboard) => {
  const runButton = document.querySelector('#run')
  if (runButton) {
    runButton.addEventListener('click', () => dashboard.run())
  }
  const stateFilter = document.querySelector('#state')
  if (stateFilter) {
    stateFilter.addEventListener('change', (event) => {
      dashboard.updateFilters({ 'State': (event.target as HTMLSelectElement).value })
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
      .on('dashboard:run:start', () => updateState('#dashboard-state', 'Running'))
      .on('dashboard:run:complete', () => updateState('#dashboard-state', 'Done'))
      .on('drillmenu:click', canceller)
      .on('drillmodal:explore', canceller)
      .on('dashboard:tile:explore', canceller)
      .on('dashboard:tile:view', canceller)
      .withClassName('looker-embed')
      .withFilters({ 'State': 'California' })
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
