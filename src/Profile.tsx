import React, { useState } from 'react';
import {
  useSession,
} from "@inrupt/solid-ui-react";


const Profile: React.FC = () => {
  const { session } = useSession();

  // list of strings
  const [guestAllergens, setGuestAllergens] = useState([]);

  const [profileLoaded, setProfileLoaded] = useState(false);

  const [menuLoaded, setMenuLoaded] = useState(false);

  async function loadProfile() {
    setGuestAllergens(['al1']);
    setProfileLoaded(true);
  }

  return (
    <>
      <h1>Solid personalized menu viewer</h1>
      <p>Logged in as {session.info.webId}</p>
      <button onClick={() => loadProfile()}>Load profile</button>
      <br /><br />
      <p>You are allergic to: {guestAllergens}</p>
      <button onClick={() => setMenuLoaded(true)}>Load a restaurant menu</button>
      {menuLoaded &&
        <>
          <br /><br />
          <h2>Menu</h2>
          <p />
          <h3 style={{color: 'orange'}}>Item1</h3>
          <p><b>Ingredient1, ingredient2</b></p>
          <p>Contains: <p style={{color: 'red'}}>allergen1</p></p>
          <hr />
          <h3 style={{color: 'green'}}>Item2</h3>
          <p><b>Ingredient2, ingredient3</b></p>
          <p>Contains: allergen2</p>
        </>
      }

    </>
  );
};

export default Profile;