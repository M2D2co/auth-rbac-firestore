import * as firebase from 'firebase/app';

export type PrivilegeFirestore = {
  roleId: string;
  uid: string;
  createdBy: string;
  createdOn: firebase.default.firestore.Timestamp;
};

export type Privilege = {
  resourceId: string;
  uid: string;
  roleId: string;
  createdBy: string;
  createdOn: Date;
};

export type Role = {
  id?: string;
  name: string;
  admin: boolean;
  list: boolean;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}
