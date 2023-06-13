import React, { useState } from 'react';
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

  const [guestAllergens, setGuestAllergens] = useState("");

  // array of menu items
  const [displayedMenu, setDisplayedMenu] = useState([]);


  async function loadMenu() {
    function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    await delay(1000);

    setDisplayedMenu([
      {
        label: "Item1",
        ingredients: "ingredient1, ingredient2",
        allergens: ["allergen1"],
      },
      {
        label: "Item2",
        ingredients: "ingredient2, ingredient3",
        allergens: ["allergen2"],
      }
    ]);
  }

  function guestCanEatItem(item) {
    for (let allergen of item.allergens) {
      if (allergen === guestAllergens[0]) {
        return (
          <>
            <h3 style={{ color: 'orange' }}>{item.label}</h3>
            <p><b>{item.ingredients}</b></p>
            <p style={{ color: 'red' }}>Contains: {item.allergens}</p>
            <hr />
          </>
        );
      }
    }

    return (
      <>
        <h3 style={{ color: 'green' }}>{item.label}</h3>
        <p><b>{item.ingredients}</b></p>
        <p>Contains: {item.allergens}</p>
        <hr />
      </>
    );
  }

  async function loadProfile() {
    let userWebId: string = session.info.webId === undefined ? "" : session.info.webId;
    const podsUrls: String[] = await getPodUrlAll(userWebId, { fetch: session.fetch });
    const readingListUrl = `${podsUrls[0]}dietary-profile/my-profile`;
    const savedReadingList = await getSolidDataset(readingListUrl, { fetch: session.fetch });

    let item = getThing(savedReadingList, `${podsUrls[0]}dietary-profile/my-profile#user`);


    setGuestAllergens([getStringNoLocale(item, SCHEMA_INRUPT.name)]);
  }

  return (
    <>
      <h1>Solid personalized menu viewer</h1>
      <p>Logged in as {session.info.webId}</p>
      <button onClick={() => loadProfile()}>Load profile</button>
      <br /><br />
      <p>You are allergic to: {guestAllergens}</p>
      <button onClick={() => loadMenu()}>Load a restaurant menu</button>
      <br /><br />
      <h2>Menu</h2>
      <p />
      <ul>
        {displayedMenu.map(item =>
          <li>
            {guestCanEatItem(item)}
          </li>)}
      </ul>
    </>
  );
};

export default Profile;