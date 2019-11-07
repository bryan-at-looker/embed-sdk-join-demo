import { LookerEmbedSDK, LookerEmbedLook, LookerEmbedDashboard } from '../src/index'
import {
  LookerSDK,
  IApiSettings,
  ITransport,
  IAccessToken,
  IError,
  agentTag,
  ProxySession,
} from '@looker/sdk'
import { lookerHost, dashboardId, lookId, apiStateQuery, filterField, filterFieldValue } from './demo_config'
import { DashboardEvent, LookerEmbedFilterParams } from '../src/types'

LookerEmbedSDK.init(lookerHost, '/auth')

let gEvent: DashboardEvent
let gFilters: LookerEmbedFilterParams
let gDashboard: LookerEmbedDashboard
let gSDK: LookerSDK
let gUser: any = require('./demo_user.json')

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

/**
 * Proxy authentication session for this Embed demo
 *
 */
class EmbedSession extends ProxySession {

  constructor(public settings: IApiSettings, transport?: ITransport) {
    super(settings, transport)
  }

  async authenticate(props: any) {
    // get the auth token from the proxy server
    const token = await getProxyToken(gUser.external_user_id);
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

interface IProxyToken {
  token: IAccessToken
}

const getProxyToken = async (external_user_id?: string) => {
  const token = await gSDK.ok(gSDK.authSession.transport.request<IProxyToken,IError>('GET',
    // TODO use the config variable for the server URL
    `http://embed.demo:8080/token${(external_user_id)?`?external_user_id=${external_user_id}`:''}`
  ))
  return token.token
}
const dropdownHeader = (innerHTML: string) => {
  var header = document.createElement('div')
  header.classList.add('header')
  header.innerHTML = innerHTML
  return header
}

const dropdownItem = (row: any) => {
  var item = document.createElement('div')
  item.setAttribute('data-value',row[filterField])
  item.classList.add('item')
  const options = (row[filterFieldValue] > 0) ? ['green','▲'] : (row[filterFieldValue] < 0) ? ['red','▼'] : ['black','']
  const format = Number(row[filterFieldValue]).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2});
  item.innerHTML = `${row[filterField]} <font color="${options[0]}">${options[1]} ${format}</font>`
  return item
}
