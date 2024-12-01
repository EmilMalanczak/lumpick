import { pgTable, pgSequence, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const dayOfWeek = pgEnum("day_of_week", ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
export const deliveryType = pgEnum("delivery_type", ['general', 'shoes', 'clothes', 'accessories', 'seasonal', 'premium'])
export const priceType = pgEnum("price_type", ['weight', 'percentage', 'piece'])
export const shopFeaturesType = pgEnum("shop_features_type", ['assortment', 'payment', 'other'])
export const weekType = pgEnum("week_type", ['WEEK_1', 'WEEK_2', 'WEEK_3', 'WEEK_4'])

export const lumpikFeaturesIdSeq = pgSequence("lumpik_features_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpikProfilesIdSeq = pgSequence("lumpik_profiles_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpikUsersIdSeq = pgSequence("lumpik_users_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpikShopsIdSeq = pgSequence("lumpik_shops_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpikPricingsIdSeq = pgSequence("lumpik_pricings_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpikShopOwnersIdSeq = pgSequence("lumpik_shop_owners_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpikShopCommentsIdSeq = pgSequence("lumpik_shop_comments_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpikAddressesIdSeq = pgSequence("lumpik_addresses_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpikDeliveriesIdSeq = pgSequence("lumpik_deliveries_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })


