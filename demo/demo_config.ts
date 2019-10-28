// The address of your Looker instance. Required.
export const lookerHost = 'johnkuitheme.dev.looker.com'

// A dashboard that the user can see. Set to 0 to disable dashboard.
export const dashboardId = '24'
// A Look that the user can see. Set to 0 to disable look.
export const lookId = 0

export const apiStateQuery = {
  model: 'thelook',
  view: 'order_items',
  fields: ["users.state", "order_items.total_sale_price_period_change"],
  filters: {
    "order_items.previous_period_filter": "30 days",
    "order_items.count": ">60",
    "users.country": "USA"
  },
  sorts: ["order_items.total_sale_price_period_change desc"]
}