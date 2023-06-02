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

  async function handleReadMenu() {
    const podsUrls: String[] = await getPodUrlAll(session.info.webId, { fetch: session.fetch });
    const readingListUrl = 'https://coolrestaurant.solidweb.org/public/menus/my-menu1';

    const savedReadingList = await getSolidDataset(readingListUrl, { fetch: session.fetch });

    let item = getThing(savedReadingList, 'https://coolrestaurant.solidweb.org/public/menus/my-menu1#ingredient1');

    alert("Menu: " + getStringNoLocale(item, SCHEMA_INRUPT.name));
  }

  async function handleReadProfile() {
    const podsUrls: String[] = await getPodUrlAll(session.info.webId, { fetch: session.fetch });
    const readingListUrl = `${podsUrls[0]}dietary-profile/my-profile`;

    const savedReadingList = await getSolidDataset(readingListUrl, { fetch: session.fetch });

    let item = getThing(savedReadingList, `${podsUrls[0]}dietary-profile/my-profile#title`);

    alert("Profile: " + getStringNoLocale(item, SCHEMA_INRUPT.name));
  }  

  return (
    <>
      <h1>Welcome to the Solid personalized restaurant guest menu viewer</h1>
      <button onClick={() => {handleReadMenu(); handleReadProfile();}}>Read menu and profile</button>
    </>
  );
};

export default Profile;