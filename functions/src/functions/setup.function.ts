import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// tslint:disable-next-line: variable-name
export const onCall_Setup = functions.https.onCall(async (data, context) => {
  // This function needs to be called once to create the Roles for the demo
  // The function is idempotent so calling multiple times is safe

  console.log('onCall_Setup');

  admin.firestore().doc('/roles/ADMIN').set({
    name: 'Admin',
    admin: true,
    list: true,
    create: true,
    read: true,
    update: true,
    delete: true,
  });

  admin.firestore().doc('/roles/READ').set({
    name: 'Read',
    admin: false,
    list: true,
    create: false,
    read: true,
    update: false,
    delete: false,
  });

  admin.firestore().doc('/roles/UPDATE').set({
    name: 'Update',
    admin: false,
    list: true,
    create: true,
    read: true,
    update: true,
    delete: false,
  });

  console.log('OK');

});
