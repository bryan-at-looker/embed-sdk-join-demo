// The address of your Looker instance. Required.
export const lookerHost = 'johnkuitheme.dev.looker.com'

// A dashboard that the user can see. Set to 0 to disable dashboard.
export const dashboardId = 24
// A Look that the user can see. Set to 0 to disable look.
export const lookId = 0

export const filterField: string = 'users.state'
export const filterFieldValue: string = 'order_items.total_sale_price_period_change'

export const apiStateQuery = {
  model: 'thelook',
  view: 'order_items',
  fields: ['users.state', 'order_items.total_sale_price_period_change'],
  filters: {
    'order_items.previous_period_filter': '30 days',
    'order_items.count': '>60',
    'users.country': 'USA'
  },
  sorts: ['order_items.total_sale_price_period_change desc']
}

export const visSwap = {
  'trellis': 'row',
  'trellis_rows': 4,
  'type': 'looker_column',
  'show_x_axis_label': false,
  'color_application': {
    collection_id: '80e60a97-c02b-4a41-aa05-83522ee2144b',
    options: {steps: 5},
    palette_id: '629b455f-662e-4854-a424-4f0c9d4bbdfb'
  }
}