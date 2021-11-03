import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import * as firebase from 'firebase/app';
import { first } from 'rxjs/operators';
import { DataFirestore } from '../models/data.model';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  private remoteSetup = this.remote.httpsCallable('onCall_Setup')

  resources = this.fs.collection<DataFirestore>('data').valueChanges({ idField: 'id' })

  constructor(
    private auth: AngularFireAuth,
    private fs: AngularFirestore,
    private remote: AngularFireFunctions,
  ) { }

  ngOnInit(): void {
  }

  async createRecord() {
    const user = await this.auth.user.pipe(first()).toPromise()
    this.fs.collection('data').add({ createdBy: user.uid, createdOn: firebase.default.firestore.FieldValue.serverTimestamp() })
  }

  async setup() {
    console.log('setup')
    await this.remoteSetup(null).toPromise()
    console.log('ok')
  }

}
