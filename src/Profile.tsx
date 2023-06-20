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
  getThing,
  getStringNoLocaleAll,
  getUrlAll
} from "@inrupt/solid-client";

import { SCHEMA_INRUPT, RDF, AS } from "@inrupt/vocab-common-rdf";


const Profile: React.FC = () => {
  const { session } = useSession();

  const [guestAllergens, setGuestAllergens] = useState(["nuts", "lupin"]);

  // array of menu items
  const [displayedMenu, setDisplayedMenu] = useState(
    {
      name: "",
      dateValid: "",
      items: []
    });


  async function loadMenu() {
    const datasetUrl = "https://coolrestaurant.solidweb.org/public/menus/my-menu1";
    const chooseWellPrefix = "https://github.com/JiriResler/solid-choose-well-ontology/blob/main/choosewell";

    const menuDataset = await getSolidDataset(datasetUrl, { fetch: session.fetch });

    const menuThing = getThing(menuDataset, `${datasetUrl}#menu1`);
    
    let newMenu = {};

    newMenu.name = getStringNoLocale(menuThing, `${chooseWellPrefix}#menuName`);

    newMenu.dateValid = getStringNoLocale(menuThing, `${chooseWellPrefix}#validOn`);

    let menuItems = [];
    
    const menuItemsUrls = getUrlAll(menuThing, `${chooseWellPrefix}#hasMenuItem`);

    for (const menuItemUrl of menuItemsUrls) {
      let menuItem = {};
      let itemThing = getThing(menuDataset, menuItemUrl);

      menuItem.label = getStringNoLocale(itemThing, `${chooseWellPrefix}#hasName`);
      menuItem.cost = getStringNoLocale(itemThing, `${chooseWellPrefix}#costs`);

      menuItem.ingredients = getStringNoLocaleAll(itemThing, `${chooseWellPrefix}#hasIngredient`);
      menuItem.allergens = getStringNoLocaleAll(itemThing, `${chooseWellPrefix}#hasAllergen`);
      menuItem.diets = getStringNoLocaleAll(itemThing, `${chooseWellPrefix}#isPartOf`);

      menuItems.push(menuItem);
    }

    newMenu.items = menuItems;

    setDisplayedMenu(newMenu);

    // setDisplayedMenu({
    //   name: "Daily menu",
    //   dateValid: "1.1.2024",
    //   items: [{
    //     label: "Spicy Chicken Wings",
    //     ingredients: ["chicken", "marinade"],
    //     allergens: ["soybeans", "milk", "nuts"],
    //     diets: [],
    //     cost: "5$"
    //   },
    //   {
    //     label: "Pizza Margherita",
    //     ingredients: ["tomatoes", "mozzarella", "oregano"],
    //     allergens: ["gluten", "milk"],
    //     diets: ["vegan", "vegetarian"],
    //     cost: "4$"
    //   }]
    // });
  }

  function highlightAllergen(allergens, toBeHighlightedAllergen) {
    return (
      <span>
        {allergens.map(allergen => {
          if (allergens.indexOf(allergen) === (allergens.length - 1)) {
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
      if (guestAllergens.includes(allergen)) {
        return (
          <>
            <h3 style={{ color: 'orange' }}>{item.label}</h3>
            <h4>{item.cost}</h4>
            <p>Ingredients: {item.ingredients}</p>
            <div>
              <span>Allergens: </span>
              {highlightAllergen(item.allergens, allergen)}
            </div>
            <p>Diets: {item.diets}</p>
            <hr />
          </>
        );
      }
    }

    return (
      <>
        <h3 style={{ color: 'green' }}>{item.label}</h3>
        <h4>{item.cost}</h4>
        <p>Ingredients: {item.ingredients}</p>
        <div>
          <span>Allergens: </span>
          <span>
            {item.allergens.join(', ')}
          </span>
        </div>
        <p>Diets: {item.diets}</p>
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

    setGuestAllergens(getStringNoLocaleAll(item, SCHEMA_INRUPT.name));
  }

  return (
    <>
      <h1>Solid personalized menu viewer</h1>
      <button onClick={() => loadProfile()}>Load profile</button>
      <br /><br />
      <p>You are allergic to: {guestAllergens.join(', ')}</p>
      <button onClick={() => loadMenu()}>Load a restaurant menu</button>
      <br /><br />
      <h2>{displayedMenu.name}</h2>
      <h3>{displayedMenu.dateValid}</h3>
      <p />
      <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
        {displayedMenu.items.map(item =>
          <li>
            {guestCanEatItem(item)}
          </li>)}
      </ul>
    </>
  );
};

export default Profile;