import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DataFirestore, Data } from '../models/data.model';
import { Profile } from '../models/user.model';
import * as firebase from 'firebase/app';
import { Privilege, PrivilegeFirestore, Role } from '../models/permission.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<boolean> = new Subject();

  private idparam: string;
  permissionForm: FormGroup;

  roles: Observable<Role[]> = this.firestore.collection<Role>('roles').valueChanges({ idField: 'id' });
  users: Observable<Profile[]> = null;
  item: Data = null;
  permissions: Privilege[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
  ) {
    this.permissionForm = this.fb.group({
      role: ['', [Validators.required]],
      user: ['', [Validators.required]],
    });

    this.route.params.pipe(
      tap(params => {
        const { id } = params;
        this.idparam = id;
      }),
      tap(params => {
        this.users = this.firestore.collection<Profile>('users').valueChanges({ idField: 'uid' });
      }),
      tap(params => {
        const { id } = params;
        this.permissions = [];
        console.log('test')
        this.firestore.collection<PrivilegeFirestore>(`rbac/${id}/users`)
          .valueChanges({ idField: 'uid' }).pipe(
            tap(permissions => {
              console.log(permissions);
            }),
            map(permissions =>
              permissions.map((permission: PrivilegeFirestore) => ({
                ...permission,
                createdOn: permission.createdOn?.toDate(),
                resourceId: id,
              })),
              takeUntil(this.destroyed$),
            )
          ).subscribe((permissions: Privilege[]) => {
            console.log('should work', permissions);
            this.permissions = this.permissions.concat(permissions);
            console.log(this.permissions);
          });
      }),
      switchMap(params => {
        const { id } = params;
        return this.firestore.doc<DataFirestore>('data/' + id).valueChanges({ idField: 'id' }).pipe(
          map(data => ({
            ...data,
            createdOn: data.createdOn.toDate(),
          }))
        );
      }),
      takeUntil(this.destroyed$),
    ).subscribe(data => {
      this.item = data;
    });
  }

  ngOnInit(): void {
  }

  async remove(action: string, uid: string): Promise<void> {
    await this.firestore.doc(`/rbac/${this.idparam}/${action}/${uid}`).delete();
  }

  async add(event: Event): Promise<void> {
    event.preventDefault();

    const roleId = this.permissionForm.get('role').value;
    const uid = this.permissionForm.get('user').value;

    await this.firestore.doc(`/rbac/${this.idparam}/users/${uid}`).set({
      roleId,
      createdBy: uid,
      createdOn: firebase.default.firestore.FieldValue.serverTimestamp(),
      uid,
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
