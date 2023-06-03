import React from 'react';

import {
  useSession,
} from "@inrupt/solid-ui-react";

import {
  addUrl,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getPodUrlAll,
  getSolidDataset,
  getThingAll,
  getStringNoLocale,
  removeThing,
  saveSolidDatasetAt,
  setThing,
  SolidDataset,
  getThing
} from "@inrupt/solid-client";

import { SCHEMA_INRUPT, RDF, AS } from "@inrupt/vocab-common-rdf";


const Profile: React.FC = () => {
  const { session } = useSession();

  async function showPersonalizedMenu() {
    // menu
    const readingListUrl = 'https://coolrestaurant.solidweb.org/public/menus/my-menu1';

    const savedReadingList = await getSolidDataset(readingListUrl, { fetch: session.fetch });

    let item1 = getThing(savedReadingList, 'https://coolrestaurant.solidweb.org/public/menus/my-menu1#item1');

    let item2 = getThing(savedReadingList, 'https://coolrestaurant.solidweb.org/public/menus/my-menu1#item2');

    // alert(item1.url + getStringNoLocale(item1, SCHEMA_INRUPT.name) + item2.url + getStringNoLocale(item2, SCHEMA_INRUPT.name));

    // profile
    const podsUrls: String[] = await getPodUrlAll(session.info.webId, { fetch: session.fetch });

    const readingListUrl2 = `${podsUrls[0]}dietary-profile/my-profile`;

    const savedReadingList2 = await getSolidDataset(readingListUrl2, { fetch: session.fetch });

    let item3 = getThing(savedReadingList2, `${podsUrls[0]}dietary-profile/my-profile#user`);

    // alert("Profile: " + getStringNoLocale(item3, SCHEMA_INRUPT.name));

    let menuItem1Allergen = getStringNoLocale(item1, SCHEMA_INRUPT.name);
    let menuItem2Allergen = getStringNoLocale(item2, SCHEMA_INRUPT.name);

    let userAllergen = getStringNoLocale(item3, SCHEMA_INRUPT.name);

    let canUserEatItem1: boolean = userAllergen !== menuItem1Allergen;
    let canUserEatItem2: boolean = userAllergen !== menuItem2Allergen;
    
    alert("canUserEatItem1: " + canUserEatItem1 + " canUserEatItem2: " + canUserEatItem2);
  } 

  return (
    <>
      <h1>Welcome to the Solid personalized restaurant guest menu viewer</h1>
      <p>Logged in: {session.info.webId}</p>
      <button onClick={() => {showPersonalizedMenu();}}>Show personalized menu</button>
    </>
  );
};

export default Profile;