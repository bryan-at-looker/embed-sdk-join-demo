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

import { lookerHost, dashboardId, lookId, apiStateQuery, filterField, tempQueryResponse, filterFieldValue } from './demo_config'
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
      dashboard.run();  
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

const dashboardRunComplete = (event: DashboardEvent) => {
  if (!gEvent || !gEvent.dashboard) {
    gEvent = event
  }
  newLayout(event.dashboard.dashboard_filters['KPIs'].split(','))
}

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
      .on('dashboard:run:complete', dashboardRunComplete)
      .on('dashboard:filters:changed', filtersChanged)
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
