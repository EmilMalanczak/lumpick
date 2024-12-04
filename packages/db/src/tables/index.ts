import { addresses } from "./addresses/addresses.table";
import { deliveries, deliveryTypeEnum } from "./deliveries/deliveries.table";
import { features, featuresTypeEnum } from "./features/features.table";
import {
  dayOfWeekEnum,
  priceTypeEnum,
  pricings,
  weekTypeEnum,
} from "./pricings/pricings.table";
import { profiles } from "./profiles/profiles.table";
import { shopComments } from "./shop-comments/shop-comments.table";
import { shopFavourites } from "./shop-favourites/shop-favourites.table";
import { shopFeatures } from "./shop-features/shop-features.table";
import { shopOwners } from "./shop-owners/shop-owners.table";
import { shops } from "./shops/shops.table";
import { users } from "./users/users.table";
import { verifyTokens } from "./verify-tokens/verify-tokens.table";

export const tables = {
  profiles,
  users,
  shops,
  features,
  shopFeatures,
  shopOwners,
  shopFavourites,
  shopComments,
  verifyTokens,
  addresses,
  deliveries,
  pricings,
};

export const enums = {
  weekTypeEnum,
  dayOfWeekEnum,
  priceTypeEnum,
  deliveryTypeEnum,
  featuresTypeEnum,
};
