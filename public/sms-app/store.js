const store = {
  db: null,
  exists:function(Db,objectStore){
      return Db.objectStoreNames.contains(objectStore);
  },
  ifNotExists:function(Db,objectStore,options){
      if(!store.exists(Db,objectStore)){
        Db.createObjectStore(objectStore, options);
      }
  },
  init: function() {
    if (store.db) { return Promise.resolve(store.db); }
    return idb.open('lin_sms', 1, function(upgradeDb) {
      store.ifNotExists(upgradeDb,'cart',{keyPath: 'id'});
      store.ifNotExists(upgradeDb,'payments',{keyPath: 'id'});
      store.ifNotExists(upgradeDb,'favorites',{keyPath: 'id'});
      store.ifNotExists(upgradeDb,'curuser',{keyPath: 'id'});
    }).then(function(db) {
      return store.db = db;
    });
  },

  objStore: function(storeName,mode) {
    return store.init().then(function(db) {
      return db.transaction(storeName, mode).objectStore(storeName);
    })
  }
};