import Dexie, { Entity } from "dexie";
import dexieCloud, { type DexieCloudTable } from 'dexie-cloud-addon';

interface IContact {
  id?: string;
  realmId: string;
  first: string;
  last: string;
}

// class Contact extends Entity<MyAppDatabase> {
//   id!: string;
//   first!: string;
//   last!: string;
// } 

class MyAppDatabase extends Dexie {
  // Declare implicit table properties.
  // (just to inform Typescript. Instantiated by Dexie in stores() method)
  contacts!: DexieCloudTable<IContact, 'id'>; // number = type of the primkey
  //...other tables goes here...

  constructor() {
    super("MyAppDatabase", {
      addons: [dexieCloud],
      cache: "immutable",
    });

    this.version(1).stores({
      contacts: "@id, first, last",
      //...other tables goes here...
    });

    // this.contacts.mapToClass(Contact);

    this.cloud.configure({
      databaseUrl:  process.env.REACT_APP_DBURL!,
      tryUseServiceWorker: true,
      requireAuth: false,
    })
  }
}

const db = new MyAppDatabase();
// this throws "unsafe memeber acces .ad on an any value"
db.contacts.add({ first: "Foo", last: "Bar" });
