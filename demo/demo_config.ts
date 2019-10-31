// The address of your Looker instance. Required.
export const lookerHost = 'master.dev.looker.com'

// A dashboard that the user can see. Set to 0 to disable dashboard.
export const dashboardId = 2467
// A Look that the user can see. Set to 0 to disable look.
export const lookId = 0

export const filterField: string = 'users.state'
export const filterFieldValue: string = 'order_items.total_sale_price_period_change'

export const apiStateQuery = {
  model: 'snow_look',
  view: 'order_items',
  fields: ["users.state", "order_items.total_sale_price_period_change"],
  filters: {
    "order_items.previous_period_filter": "30 days",
    "order_items.count": ">60",
    "users.country": "USA"
  },
  sorts: ["order_items.total_sale_price_period_change desc"]
}

export const tempQueryResponse = [
  {"users.state":"Idaho","order_items.total_sale_price_period_change":1.169243363},
  {"users.state":"Kentucky","order_items.total_sale_price_period_change":1.117806175},
  {"users.state":"Iowa","order_items.total_sale_price_period_change":0.4246488844},
  {"users.state":"Virginia","order_items.total_sale_price_period_change":0.3239262101},
  {"users.state":"Nevada","order_items.total_sale_price_period_change":0.2445911334},
  {"users.state":"Mississippi","order_items.total_sale_price_period_change":0.1953524146},
  {"users.state":"Ohio","order_items.total_sale_price_period_change":0.1799172888},
  {"users.state":"Oregon","order_items.total_sale_price_period_change":0.1588962285},
  {"users.state":"Tennessee","order_items.total_sale_price_period_change":0.1465136745},
  {"users.state":"Washington","order_items.total_sale_price_period_change":0.1279766601},
  {"users.state":"South Carolina","order_items.total_sale_price_period_change":0.1262506449},
  {"users.state":"North Carolina","order_items.total_sale_price_period_change":0.1229464813},
  {"users.state":"New Mexico","order_items.total_sale_price_period_change":0.120185867},
  {"users.state":"Missouri","order_items.total_sale_price_period_change":0.1065178786},
  {"users.state":"Georgia","order_items.total_sale_price_period_change":0.1045837866},
  {"users.state":"Michigan","order_items.total_sale_price_period_change":0.06933353646},
  {"users.state":"West Virginia","order_items.total_sale_price_period_change":0.06531588332},
  {"users.state":"Wisconsin","order_items.total_sale_price_period_change":0.0626561708},
  {"users.state":"New York","order_items.total_sale_price_period_change":0.05852710178},
  {"users.state":"New Jersey","order_items.total_sale_price_period_change":0.04937665282},
  {"users.state":"Utah","order_items.total_sale_price_period_change":0.03736767217},
  {"users.state":"Indiana","order_items.total_sale_price_period_change":0.0353150003},
  {"users.state":"Connecticut","order_items.total_sale_price_period_change":0.02533800101},
  {"users.state":"California","order_items.total_sale_price_period_change":0.01550928614},
  {"users.state":"Arkansas","order_items.total_sale_price_period_change":0.01204755748},
  {"users.state":"Florida","order_items.total_sale_price_period_change":0.008252418163},
  {"users.state":"Texas","order_items.total_sale_price_period_change":0.008136368138},
  {"users.state":"Massachusetts","order_items.total_sale_price_period_change":-0.02005583959},
  {"users.state":"Arizona","order_items.total_sale_price_period_change":-0.02013550172},
  {"users.state":"Minnesota","order_items.total_sale_price_period_change":-0.02442619094},
  {"users.state":"Maryland","order_items.total_sale_price_period_change":-0.04995140433},
  {"users.state":"Alabama","order_items.total_sale_price_period_change":-0.06896503197},
  {"users.state":"Illinois","order_items.total_sale_price_period_change":-0.08633897146},
  {"users.state":"Pennsylvania","order_items.total_sale_price_period_change":-0.08808905963},
  {"users.state":"Colorado","order_items.total_sale_price_period_change":-0.08902632504},
  {"users.state":"Kansas","order_items.total_sale_price_period_change":-0.09955541813},
  {"users.state":"Louisiana","order_items.total_sale_price_period_change":-0.1281962762},
  {"users.state":"Nebraska","order_items.total_sale_price_period_change":-0.1962063794},
  {"users.state":"Oklahoma","order_items.total_sale_price_period_change":-0.2146354259}
]
