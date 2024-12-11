import { pgTable, pgSequence, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const dayOfWeek = pgEnum("day_of_week", ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
export const deliveryType = pgEnum("delivery_type", ['general', 'shoes', 'clothes', 'accessories', 'seasonal', 'premium'])
export const priceType = pgEnum("price_type", ['weight', 'percentage', 'piece'])
export const shopFeaturesType = pgEnum("shop_features_type", ['assortment', 'payment', 'other'])
export const weekType = pgEnum("week_type", ['WEEK_1', 'WEEK_2', 'WEEK_3', 'WEEK_4'])

export const lumpickFeaturesIdSeq = pgSequence("lumpick_features_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpickProfilesIdSeq = pgSequence("lumpick_profiles_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpickUsersIdSeq = pgSequence("lumpick_users_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpickShopsIdSeq = pgSequence("lumpick_shops_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpickPricingsIdSeq = pgSequence("lumpick_pricings_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpickShopOwnersIdSeq = pgSequence("lumpick_shop_owners_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpickShopCommentsIdSeq = pgSequence("lumpick_shop_comments_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpickAddressesIdSeq = pgSequence("lumpick_addresses_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const lumpickDeliveriesIdSeq = pgSequence("lumpick_deliveries_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })


