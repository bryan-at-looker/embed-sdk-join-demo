import { LookerEmbedSDK, LookerEmbedLook, LookerEmbedDashboard } from '../src/index'

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { lookerHost, dashboardId, apiStateQuery } from './demo_config'

LookerEmbedSDK.init(lookerHost, '/auth')

const setupDashboard = (dashboard: LookerEmbedDashboard) => {
  const runButton = document.querySelector('#run')
  if (runButton) {
    runButton.addEventListener('click', () => dashboard.run())
  }
  const stateFilter = document.querySelector('#state-filter')
  if (stateFilter) {
    stateFilter.addEventListener('change', (event) => {
      dashboard.updateFilters({ 'State': (event.target as HTMLSelectElement).value });
      dashboard.run();
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
  LookerEmbedSDK.createDashboardWithId(dashboardId)
    .appendTo('#dashboard')
    .on('dashboard:run:start', () => updateState('#dashboard-state', 'Running'))
    .on('dashboard:run:complete', () => updateState('#dashboard-state', 'Done'))
    // .on('dashboard:filters:changed', runDashboard)
    .on('drillmenu:click', canceller)
    .on('drillmodal:explore', canceller)
    .on('dashboard:tile:explore', canceller)
    .on('dashboard:tile:view', canceller)
    .withClassName('looker-embed')
    .build()
    .connect()
    .then(setupDashboard)
    .catch((error: Error) => {
      console.error('Connection error', error)
    })
})
