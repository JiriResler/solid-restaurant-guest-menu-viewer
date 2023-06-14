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

  const [guestAllergens, setGuestAllergens] = useState(["nuts"]);

  // array of menu items
  const [displayedMenu, setDisplayedMenu] = useState([]);


  async function loadMenu() {
    function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    // await delay(1500);

    setDisplayedMenu([
      {
        label: "Spicy Chicken Wings",
        ingredients: "chicken, marinade",
        allergens: ["soybeans", "milk", "nuts"],
      },
      {
        label: "Pizza Margherita",
        ingredients: "tomatoes, mozzarella, oregano",
        allergens: ["gluten", "milk"],
      }
    ]);
  }

  function highlightAllergen(allergens, toBeHighlightedAllergen) {
    return (
      <span>
        {allergens.map(allergen => {
          if (allergens.indexOf(allergen) === (allergens.length-1)) {
            if (allergen === toBeHighlightedAllergen) {
              return <><span style={{ color: 'red' }}>{allergen}</span></>;
            } else {
              return allergen;
            }
          } else {
            if (allergen === toBeHighlightedAllergen) {
              return <><span style={{ color: 'red' }}>{allergen}</span><span>, </span></>;
            } else {
              return allergen + ", "
            }
          }
        })}
      </span>);
  }

  function guestCanEatItem(item) {
    for (let allergen of item.allergens) {
      if (allergen === guestAllergens[0]) {
        return (
          <>
            <h3 style={{ color: 'orange' }}>{item.label}</h3>
            <p>Ingredients: {item.ingredients}</p>
            <div>
              <span>Allergens: </span>
              {highlightAllergen(item.allergens, allergen)}
            </div>
            <hr />
          </>
        );
      }
    }

    return (
      <>
        <h3 style={{ color: 'green' }}>{item.label}</h3>
        <p>Ingredients: {item.ingredients}</p>
        <div>
          <span>Allergens: </span>
          <span>
            {item.allergens.join(', ')}
          </span>
        </div>
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
      <h2>Restaurant menu</h2>
      <p />
      <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
        {displayedMenu.map(item =>
          <li>
            {guestCanEatItem(item)}
          </li>)}
      </ul>
    </>
  );
};

export default Profile;