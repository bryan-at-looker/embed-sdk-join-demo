import { LookerEmbedSDK, LookerEmbedLook, LookerEmbedDashboard } from '../src'
import { DashboardEvent, LookerEmbedFilterParams } from '../src/types'
import {
  LookerSDK,
  IApiSettings,
  ITransport,
  IAccessToken,
  IError,
  agentTag,
  ProxySession
} from '@looker/sdk'
import { lookerHost, dashboardId, lookId, apiStateQuery, filterField, filterFieldValue, visSwap } from './demo_config'

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

LookerEmbedSDK.init(lookerHost, '/auth')

let gEvent: DashboardEvent
let gFilters: LookerEmbedFilterParams = { 'KPIs': 'Total Sale Price,Active Users' }
let gDashboard: LookerEmbedDashboard
let gSDK: LookerSDK
const gUser: any = require('./demo_user.json')

/**
 * Proxy authentication session for this Embed demo
 *
 */
class EmbedSession extends ProxySession {

  constructor (public settings: IApiSettings, transport?: ITransport) {
    super(settings, transport)
  }

  async authenticate (props: any) {
    // get the auth token from the proxy server
    const token = await getProxyToken(gUser.external_user_id)
    if (token) {
      // Assign the token, which will track its expiration time automatically
      this.activeToken.setToken(token)
    }

    if (this.isAuthenticated()) {
      // Session is authenticated
      // set CORS mode (in this scenario)
      props.mode = 'cors'

      // remove any credentials attribute that may have been set
      // because the BrowserTransport defaults to having `same-origin` for credentials
      delete props['credentials']

      // replace the headers argument with required values
      // Note: using new Headers() to construct the headers breaks CORS for the Looker API. Don't know why yet
      props.headers = {
        'Authorization': `Bearer ${token.access_token}`,
        'x-looker-appid': agentTag
      }
    }
    return props
  }
}

const session = new EmbedSession({
  base_url: `https://${lookerHost}:19999`,
  api_version: '3.1'
} as IApiSettings)
gSDK = new LookerSDK(session)

const setupDashboard = async (dashboard: LookerEmbedDashboard) => {
  gDashboard = dashboard
  const stateFilter = document.querySelector('#state-filter')
  if (stateFilter) {
    stateFilter.addEventListener('change', (event) => {
      dashboard.updateFilters({ 'State': (event.target as HTMLSelectElement).value })
      dashboard.run()
    })
  }

  await buildTrending()
  const visSwapper = document.querySelector('#vis-swap')
  if (visSwapper) {
    visSwapper.addEventListener('click', (event) => {
      if (gFilters && gFilters['KPIs'].indexOf('Active Users') > -1) {
        swapVis(visSwapper)
      }
    })
  }

  const tableSwapper = document.querySelector('#table-swap')
  if (tableSwapper) {
    tableSwapper.addEventListener('click', (event) => {
      if (gFilters && gFilters['KPIs']) {
        tableSwap(tableSwapper)
      }
    })
  }
}

const tableSwap = (tableSwapper: any) => {
  const swapTargets = ['looker_line','looker_bar', 'looker_column', 'looker_area']
  const newElements: any = {}
  const elements = (gEvent && gEvent.dashboard && gEvent.dashboard.options && gEvent.dashboard.options && gEvent.dashboard.options.elements)
    ? JSON.parse(JSON.stringify(gEvent.dashboard.options.elements))
    : {}
  if (tableSwapper.getAttribute('data-value') === '0') {
    Object.keys(elements).forEach((key: string) => {
      if (elements[key] && elements[key]['vis_config'] && elements[key]['vis_config']['type'] && swapTargets.indexOf(elements[key]['vis_config']['type']) > -1) {
        newElements[key] = elements[key]
        newElements[key]['vis_config']['type'] = 'looker_grid'
      }
    })
    tableSwapper.setAttribute('data-value','1')
    tableSwapper.classList.add('purple')
    tableSwapper.classList.remove('black')
    gDashboard.setOptions({ elements: newElements })
  } else {
    Object.keys(elements).forEach((key: string) => {
      if (elements[key] && elements[key]['vis_config'] && elements[key]['vis_config']['type'] && swapTargets.indexOf(elements[key]['vis_config']['type']) > -1) {
        if (gFilters && gFilters['KPIs'] && gFilters['KPIs'].indexOf(elements[key]['title']) > -1) {
          newElements[key] = elements[key]
        }
      }
    })
    tableSwapper.setAttribute('data-value','0')
    tableSwapper.classList.add('black')
    tableSwapper.classList.remove('purple')
  }

  if (newElements !== {}) {
    gDashboard.setOptions({ elements: newElements })
  }
}

const swapVis = (visSwapper: any) => {
  const changeVisConfig = Object.keys(visSwap)
  const original = (gEvent && gEvent.dashboard && gEvent.dashboard.options && gEvent.dashboard.options.elements && gEvent.dashboard.options.elements['178'])
    ? gEvent.dashboard.options.elements['178'].vis_config
    : {}
  let elements: any = {}
  if (visSwapper.getAttribute('data-value') === '1') {
    visSwapper.classList.add('black')
    visSwapper.classList.remove('purple')
    visSwapper.setAttribute('data-value', '0')
    elements = { '178': { vis_config: visSwap } }
  } else {
    visSwapper.classList.add('purple')
    visSwapper.classList.remove('black')
    visSwapper.setAttribute('data-value', '1')
    elements = { '178': { vis_config: {} } }
    changeVisConfig.forEach(key => {
      elements['178']['vis_config'][key] = original[key]
    })
  }
  gDashboard.setOptions({ elements })
}

const dropdownHeader = (innerHTML: string) => {
  const header = document.createElement('div')
  header.classList.add('header')
  header.innerHTML = innerHTML
  return header
}

const dropdownItem = (row: any) => {
  const item = document.createElement('div')
  item.setAttribute('data-value',row[filterField])
  item.classList.add('item')
  const options = (row[filterFieldValue] > 0) ? ['green','▲'] : (row[filterFieldValue] < 0) ? ['red','▼'] : ['black','']
  const format = Number(row[filterFieldValue]).toLocaleString(undefined,{ style: 'percent', minimumFractionDigits: 2 })
  item.innerHTML = `${row[filterField]} <font color="${options[0]}">${options[1]} ${format}</font>`
  return item
}

const loadingIcon = (loading: boolean) => {
  const loader = document.getElementById('dropdown-icon-loader')
  const icon = document.getElementById('dropdown-icon')
  if (loader && icon) {
    icon.style.display = (loading) ? 'none' : ''
    loader.style.display = (loading) ? '' : 'none'
  }
  if (loading) {
    clearDropdown()
  }
}

const clearDropdown = () => {
  const text = document.getElementById('dropdown-text')
  if (text) {
    text.innerHTML = 'Trending States'
    text.classList.add('default')
  }
}

const buildTrending = async (dateFilter: string | null = null) => {
  // Do you want to make a copy of this instead of modifying it directly?
  const queryUpdate: any = apiStateQuery
  if (dateFilter && queryUpdate && queryUpdate['filters']) {
    queryUpdate['filters']['order_items.previous_period_filter'] = dateFilter
  }
  const query: any = await gSDK.ok(gSDK.create_query(queryUpdate))
  const data: any = await gSDK.ok(gSDK.run_query({
    result_format: 'json',
    query_id: query.id
  }))
  loadingIcon(false)
  const menu = document.createElement('div')
  menu.appendChild(dropdownHeader('<h5>Top 5</h5>'))
  data.slice(0,5).forEach((row: any) => {
    menu.appendChild(dropdownItem(row))
  })
  menu.appendChild(dropdownHeader('<h5>Bottom 5</h5>'))
  data.slice(-5).forEach((row: any) => {
    menu.appendChild(dropdownItem(row))
  })

  const dropdown = document.getElementById('dropdown-menu')
  if (dropdown) {
    dropdown.innerHTML = menu.innerHTML || ''
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
  clearDropdown()
  newLayout(event.dashboard.dashboard_filters['KPIs'].split(','))
}

const newLayout = (kpis: string[]) => {
  const copyOptions = JSON.parse(JSON.stringify(gEvent.dashboard.options))
  const elements = copyOptions.elements || {}
  const layout = copyOptions.layouts[0]
  const components = (layout.dashboard_layout_components) ? layout.dashboard_layout_components : {}
  const copyLayout = Object.assign({},layout)

  const newComponents: any = []

  Object.keys(elements).forEach(key => {
    const found = components.filter((c: any) => c.dashboard_element_id.toString() === key)[0]
    if (kpis.indexOf(elements[key]['title']) > -1) {
      newComponents.push(found)
    } else {
      newComponents.push(Object.assign(found,{ row: 0, column: 0, height: 0, width: 0 }))
    }
  })
  copyLayout.dashboard_layout_components = newComponents
  const copies = Object.assign({},elements)
  Object.keys(copies).forEach(key => {
    copies[key]['title_hidden'] = (copies[key]['vis_config']['type'] !== 'single_value')
  })
  gDashboard.setOptions({ layouts: [copyLayout], elements: copies })
}

const filtersChanged = async (event: DashboardEvent) => {
  const filters = (event.dashboard.dashboard_filters) ? event.dashboard.dashboard_filters : {}
  const visSwapper = document.querySelector('#vis-swap')
  const tableSwapper = document.querySelector('#table-swap')
  // update layout to match KPI filter
  if (gEvent) {
    if (filters['KPIs']) {
      if (gFilters && filters['KPIs'] !== gFilters['KPIs']) {
        newLayout(filters['KPIs'].split(','))
        if (filters['KPIs'].indexOf('Active Users') === -1 && visSwapper) {
          visSwapper.setAttribute('data-value','1')
          visSwapper.classList.add('purple')
          visSwapper.classList.add('disabled')
          visSwapper.classList.remove('black')
        } else {
          if (visSwapper) {
            visSwapper.classList.remove('disabled')
          }
        }
        if (tableSwapper) {
          tableSwapper.setAttribute('data-value','0')
          tableSwapper.classList.add('black')
          tableSwapper.classList.remove('purple')
        }
      }
    } else {
      newLayout([''])
    }
    if (filters['Dates'] && gFilters && gFilters['Dates'] && filters['Dates'] !== gFilters['Dates']) {
      loadingIcon(true)
      await buildTrending(filters['Dates'])
      gDashboard.run()
    }
    if ((filters['State'] && gFilters['State'] && filters['State'] !== gFilters['State'] ||
        (!filters['State'] && gFilters['State']) ||
        (filters['State'] && !gFilters['State'])
    )) {
      gDashboard.run()
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
      .withFilters(gFilters)
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

interface IProxyToken {
  token: IAccessToken
}

const getProxyToken = async (externalUserId?: string) => {
  const token = await gSDK.ok(gSDK.authSession.transport.request<IProxyToken,IError>('GET',
    // TODO use the config variable for the server URL
    `http://embed.demo:8080/token${(externalUserId) ? `?external_user_id=${externalUserId}` : ''}`
  ))
  return token.token
}
