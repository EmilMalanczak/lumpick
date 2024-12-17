export type ScrapWorkerResult = ScrappedShop;
export type ScrapWorkerData = {
  url: string;
};

export type ShopMetadata = {
  "@context": string;
  "@type": string;
  "@id": string;
  name: string;
  legalName: string;
  description: string;
  logo: string[];
  url: string;
  telephone: string;
  email: string;
  openingHours: string[];
  photo: string[];
  image: string[];
  hasMap: string;
  sameAs: string[];
  address: Address;
  contactPoint: ContactPoint;
  geo: GeoCoordinates;
  aggregateRating: AggregateRating;
  slug: string;
};

export type Address = {
  address: string;
  lat: string;
  lng: string;
};

export type ContactPoint = {
  "@type": string;
  contactType: string;
  telephone: string;
  email: string;
};

export type GeoCoordinates = {
  "@type": string;
  latitude: string;
  longitude: string;
};

export type AggregateRating = {
  "@type": string;
  ratingValue: string;
  reviewCount: string;
  bestRating: string;
};

export type WorkHours = {
  day: string;
  closed?: boolean;
  from: string | null;
  to: string | null;
};

export type ShopPrice = {
  day: string;
  price: string;
};

export type ScrappedShop = {
  metadata: ShopMetadata;
  relations: string[];
  url: string;
  prices: ShopPrice[];
  deliveries: string[];
  hours: WorkHours[];
  stock: string[];
  additionalTreats: string[];
};
