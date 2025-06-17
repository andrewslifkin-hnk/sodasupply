// Type definitions for internationalization

export interface TranslationKeys {
  footer: {
    company_name: string
    company_description: string
    shop: string
    all_products: string
    featured: string
    new_arrivals: string
    deals_discounts: string
    company: string
    about_us: string
    contact: string
    careers: string
    press: string
    support: string
    help_center: string
    shipping_info: string
    returns: string
    privacy_policy: string
    copyright: string
    language_selector: string
  }
  navigation: {
    home: string
    products: string
    club: string
    account: string
    cart: string
    orders: string
    checkout: string
  }
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    continue: string
    back: string
    next: string
    save: string
    edit: string
    delete: string
    search: string
    filter: string
    sort: string
    view_all: string
    close: string
    select: string
    current: string
    currency_symbol: string
    add_to_cart: string
    buy_now: string
    out_of_stock: string
    in_stock: string
  }
  account: {
    hi_there: string
    account_settings: string
    order_history: string
    addresses: string
    payment_methods: string
    preferences: string
    need_help: string
    need_help_description: string
    get_support: string
  }
  club: {
    supply_club: string
    your_activity: string
    faq: string
    more_about: string
    points: string
    redeem_points: string
    claim_reward: string
    back_to_club: string
  }
  cart: {
    shopping_cart: string
    empty_cart: string
    continue_shopping: string
    checkout: string
    subtotal: string
    total: string
    quantity: string
    remove: string
    update_cart: string
  }
  orders: {
    order_confirmation: string
    order_details: string
    order_status: string
    order_number: string
    order_date: string
    delivery_address: string
    payment_method: string
    track_order: string
    view_delivery_details: string
    loading_confirmation: string
    status: {
      pending: string
      processing: string
      shipped: string
      delivered: string
      cancelled: string
    }
  }
  filters: {
    clear_all_filters: string
    view_filtered_products: string
    view_all_products: string
    apply_filters: string
    price_range: string
    category: string
    brand: string
    availability: string
    size: string
    type: string
    package_type: string
    in_stock: string
    returnable: string
    electronics: string
    home_appliance: string
    voucher: string
    search_brands: string
    products_found: string
    brand_label: string
    size_label: string
    price_label: string
  }
  products: {
    product_added: string
    view_cart: string
    continue_shopping: string
    all_products: string
    featured_products: string
    new_arrivals: string
    on_sale: string
    best_sellers: string
    recommended: string
    discount_badge: string
    free_returns: string
    out_of_stock: string
    in_stock: string
    notify_me: string
    product_details: string
    ingredients: string
    nutrition: string
    reviews: string
    similar_products: string
    product_description: string
    specifications: string
    related_products: string
    price: string
    size: string
    flavor: string
    brand: string
    no_categories_found: string
    no_products_found: string
    try_adjusting_filters: string
    distributor: string
    atlas_beverages: string
    products_count: string
  }
  language: {
    english: string
    portuguese_brazil: string
    select_language: string
    language_changed: string
  }
}

// Helper type for nested translation keys
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationKey = NestedKeyOf<TranslationKeys> 