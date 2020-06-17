import * as firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";
import { Confirm, ActionParams, Initializer } from "../../";
import { ActionName } from "../";

export enum SessionSourceName {
  SESSION_INIT = "session-init",
  SESSION_RESPONSE = "session-response",
  SESSION_UNDO = "session-undo"
}

function initFirebase() {
  if (firebase.apps.length === 0) {
    const dbName = "livecollab-4eb22";
    const config = {
      apiKey: process.env.VUE_APP_FIREBASE_WEB_API_KEY,
      authDomain: `${dbName}.firebaseapp.com`,
      databaseURL: `https://${dbName}.firebaseio.com`
    };
    firebase.initializeApp(config);
  }
}

export async function session({
  props,
  setConfirmAction,
  runAction
}: Initializer) {
  initFirebase();

  const uniqueIdentifier = `${Math.random() * 1000000}`;
  const db = firebase.database();
  // store the snapshot key of each action, to sync between the local queue and key given from firebase
  const localQueue: string[] = [];
  // get the editor ID
  const id = props.id;

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
    dbRef.push(sessionParam);
    res(false);
  };
  setConfirmAction(confirm);

  // clear the canvas since the state will be reproduced by firebase
  const clearCanvasAction: ActionParams = {
    name: ActionName.CLEAR_CANVAS,
    value: {
      source: SessionSourceName.SESSION_INIT
    },
    toConfirm: false
  };
  await runAction(clearCanvasAction);

  dbRef.on("child_added", (snapshot, prevChildKey) => {
    // there must be a snapshot key to determine the queue of the action
    if (!snapshot.key) {
      return;
    }

    const sessionParam: ActionParams = snapshot.val();
    // if the local action is ahead of the firebase action,
    // undo the local action until it matches the action of the previous key of the snapshot
    while (
      localQueue.length > 0 &&
      localQueue[localQueue.length - 1] !== prevChildKey
    ) {
      const undoAction: ActionParams = {
        name: ActionName.UNDO_HISTORY,
        value: {
          source: SessionSourceName.SESSION_UNDO
        },
        toConfirm: false
      };
      runAction(undoAction);
      localQueue.pop();
    }
    // record the key to determine that the local queue has been sync with the firebase session
    localQueue.push(snapshot.key);
    runAction(sessionParam);
  });
}
