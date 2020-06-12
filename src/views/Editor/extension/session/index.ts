import * as firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";
import { Confirm, ActionParams } from "../../";

export const enum SessionSourceName {
  SESSION_RESPONSE = "session-response"
}

export function session() {
  const dbName = "livecollab-4eb22";
  const uniqueIdentifier = `${Math.random() * 1000000}`;

  const config = {
    apiKey: process.env.VUE_APP_FIREBASE_WEB_API_KEY,
    authDomain: `${dbName}.firebaseapp.com`,
    databaseURL: `https://${dbName}.firebaseio.com`
  };
  firebase.initializeApp(config);

  const db = firebase.database();

  const init = (vm: any) => {
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
