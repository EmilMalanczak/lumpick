import { addressesSchema } from "./src/tables/addresses/addresses.schema";
import { deliveriesSchema } from "./src/tables/deliveries/deliveries.schema";
import { featuresSchema } from "./src/tables/features/features.schema";
import { pricingsSchema } from "./src/tables/pricings/pricings.schema";
import { profilesSchema } from "./src/tables/profiles/profiles.schema";
import { shopCommentsSchema } from "./src/tables/shop-comments/shop-comments.schema";
import { shopFavouritesSchema } from "./src/tables/shop-favourites/shop-favourites.schema";
import { shopFeaturesSchema } from "./src/tables/shop-features/shop-features.schema";
import { shopOwnersSchema } from "./src/tables/shop-owners/shop-owners.schema";
import { shopsSchema } from "./src/tables/shops/shops.schema";
import { usersSchema } from "./src/tables/users/users.schema";
import { verifyTokensSchema } from "./src/tables/verify-tokens/verify-tokens.schema";

export const schemas = {
  verifyTokens: verifyTokensSchema,
  profiles: profilesSchema,
  users: usersSchema,
  shops: shopsSchema,
  features: featuresSchema,
  shopFeatures: shopFeaturesSchema,
  shopOwners: shopOwnersSchema,
  shopFavourites: shopFavouritesSchema,
  shopComments: shopCommentsSchema,
  addresses: addressesSchema,
  deliveries: deliveriesSchema,
  pricings: pricingsSchema,
};
