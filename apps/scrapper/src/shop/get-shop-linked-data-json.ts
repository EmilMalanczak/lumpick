import type { Page } from "puppeteer";

type Business = {
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
};

type Address = {
  address: string;
  lat: string;
  lng: string;
};

type ContactPoint = {
  "@type": string;
  contactType: string;
  telephone: string;
  email: string;
};

type GeoCoordinates = {
  "@type": string;
  latitude: string;
  longitude: string;
};

type AggregateRating = {
  "@type": string;
  ratingValue: string;
  reviewCount: string;
  bestRating: string;
};

export const getShopLinkedDataJson = async (page: Page): Promise<Business> => {
  const shopLinkedData = await page.evaluate(() => {
    const scriptElements = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    );
    const scriptContent = scriptElements.find((script, index) => index === 1);

    return scriptContent?.textContent ? scriptContent.textContent : "{}";
  });

  const shopLinkedDataJson = (await JSON.parse(shopLinkedData)) as Business;

  return shopLinkedDataJson;
};
