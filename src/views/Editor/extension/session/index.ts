import * as firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";
import { Confirm, ActionParams, ActionName } from "../../";

export const enum SessionSourceName {
  SESSION_INIT = "session-init",
  SESSION_RESPONSE = "session-response"
}

function initFirebase() {
  if (firebase.apps.length === 0) {
    const dbName = "livecollab-4eb22";
    const config = {
      apiKey: process.env.FIREBASE_WEB_API_KEY,
      authDomain: `${dbName}.firebaseapp.com`,
      databaseURL: `https://${dbName}.firebaseio.com`
    };
    firebase.initializeApp(config);
  }
}

export function session() {
  initFirebase();
  const uniqueIdentifier = `${Math.random() * 1000000}`;
  const db = firebase.database();

  const init = async (vm: any) => {
    const id = vm.id;

    const dbRef = db.ref(`editor/${id}`);
    const confirm: Confirm = (params, res) => {
      const sessionParam: ActionParams = {
        ...params,
        value: {
          ...params.value,
          source: SessionSourceName.SESSION_RESPONSE,
          uniqueIdentifier
        },
        toConfirm: false
      };
      dbRef.push(sessionParam, err => {
        if (err) {
          console.error("your changes are not saved yet!", err);
        }
      });
      res();
    };
    vm.confirm = confirm;

    // clear the canvas since the state will be reproduced by firebase
    const clearCanvasAction: ActionParams = {
      name: ActionName.CLEAR_CANVAS,
      value: {
        source: SessionSourceName.SESSION_INIT
      },
      toConfirm: false
    };
    await vm.runAction(clearCanvasAction);

    dbRef.on("child_added", snapshot => {
      const sessionParam: ActionParams = snapshot.val();
      if (sessionParam.value.uniqueIdentifier !== uniqueIdentifier) {
        vm.runAction(sessionParam);
      }
    });
  };

  return {
    init
  };
}
