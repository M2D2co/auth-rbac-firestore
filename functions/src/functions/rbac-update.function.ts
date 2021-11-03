import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// tslint:disable-next-line: variable-name
export const onCall_RBAC_Add = functions.https.onCall(async (data, context) => {
  const { resourceId, roleId, uid } = data;

  if (context.auth) {

    const adminPermission = (await admin.firestore().doc(`/rbac/${resourceId}/admin/${context.auth.uid}`).get()).data();
    if (adminPermission) {
      admin.firestore().doc(`/rbac/${resourceId}/users/${uid}`).create({
        roleId,
        createdBy: context.auth.uid,
        createdOn: admin.firestore.FieldValue.serverTimestamp(),
        uid,
      });
    } else {
      throw new functions.https.HttpsError('permission-denied', 'User does not have permissions for the requested resource.');
    }

  } else {
    throw new functions.https.HttpsError('unauthenticated', 'User does not exist or is not authenticated.');
  }
});

// tslint:disable-next-line: variable-name
export const onCall_RBAC_Remove = functions.https.onCall(async (data, context) => {
  const { resourceId, uid } = data;

  if (context.auth) {

    const adminPermission = (await admin.firestore().doc(`/rbac/${resourceId}/admin/${context.auth.uid}`).get()).data();
    if (adminPermission) {
      admin.firestore().doc(`/rbac/${resourceId}/users/${uid}`).delete();
    } else {
      throw new functions.https.HttpsError('permission-denied', 'User does not have permissions for the requested resource.');
    }

  } else {
    throw new functions.https.HttpsError('unauthenticated', 'User does not exist or is not authenticated.');
  }
});
