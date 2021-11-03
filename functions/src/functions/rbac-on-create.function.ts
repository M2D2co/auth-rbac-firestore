import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// tslint:disable-next-line: variable-name
export const onDataCreate_RBAC_Create =
  functions.firestore.document('data/{resourceId}').onCreate(async (snapshot, context) => {
    const { resourceId } = context.params;
    const { createdBy } = snapshot.data();
    const value = {
      roleId: 'ADMIN',
      createdBy,
      createdOn: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().doc(`/rbac/${resourceId}/users/${createdBy}`).create(value);
  });
