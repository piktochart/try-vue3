import * as firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";
import { Confirm, ActionParams, Initializer, CoreActionName } from "../../";
import { ActionName, SourceName } from "../";
import { onBeforeMount } from "vue";

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
  // action sources to confirm
  const sourceToConfirm = {
    [SourceName.USER_CLICK_CREATE]: true,
    [SourceName.USER_MOVED_ITEM]: true,
    [SourceName.USER_HISTORY_UNDO]: true,
    [SourceName.USER_HISTORY_REDO]: true
  };

  const dbRef = db.ref(`editor/${id}`);
  const confirm: Confirm = (params, res) => {
    if (params.value.source in sourceToConfirm) {
      const sessionParam: ActionParams = {
        ...params,
        value: {
          ...params.value,
          source: SourceName.SESSION_RESPONSE,
          uniqueIdentifier
        }
      };
      const uniqueKey = dbRef.push(sessionParam);
      if (uniqueKey.key) {
        localQueue.push(uniqueKey.key);
      }
    }
    res(true);
  };
  setConfirmAction(confirm);

  // clear the canvas in the beginning, since the state will be reproduced by firebase
  onBeforeMount(() => {
    const clearCanvasAction: ActionParams = {
      name: ActionName.CLEAR_CANVAS,
      value: {
        source: SessionSourceName.SESSION_INIT
      }
    };
    runAction(clearCanvasAction);
  });

  dbRef.on("child_added", (snapshot, prevChildKey) => {
    // there must be a snapshot key to determine the queue of the action
    if (!snapshot.key) {
      return;
    }

    const sessionParam: ActionParams = snapshot.val();
    // if the session param is from the user itself, stop the process as it's already run locally
    if (sessionParam.value.uniqueIdentifier === uniqueIdentifier) {
      return;
    }
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
        }
      };
      runAction(undoAction);
      localQueue.pop();
    }
    // record the key to determine that the local queue has been sync with the firebase session
    localQueue.push(snapshot.key);
    runAction(sessionParam);
  });
}
