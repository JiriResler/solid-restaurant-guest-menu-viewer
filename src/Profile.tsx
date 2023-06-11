import React, { useState } from 'react';
import {
  useSession,
} from "@inrupt/solid-ui-react";


const Profile: React.FC = () => {
  const { session } = useSession();

  // list of strings
  const [guestAllergens, setGuestAllergens] = useState('allergen1');

  // array of menu items
  const [displayedMenu, setDisplayedMenu] = useState([
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



  async function loadProfile() {
    // setGuestAllergens();
  }

  async function loadMenu() {

  }

  function guestCanEatItem(item) {
    for (let allergen of item.allergens) {
      if (allergen === guestAllergens) {
        return false;
      }
    }

    return true;
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
          guestCanEatItem(item) && <li>
            <h3>{item.label}</h3>
            <p><b>{item.ingredients}</b></p>
            <p>Contains: {item.allergens}</p>
            <hr />
          </li>)}
      </ul>

      {/* <>
        <h3 style={{ color: 'orange' }}>Item1</h3>
        <p><b>Ingredient1, ingredient2</b></p>
        <p>Contains: allergen1</p>
        <hr />
        <h3 style={{ color: 'green' }}>Item2</h3>
        <p><b>Ingredient2, ingredient3</b></p>
        <p>Contains: allergen2</p>
      </> */}

    </>
  );
};

export default Profile;