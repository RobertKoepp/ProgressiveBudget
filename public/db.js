const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;
let db;
var request = indexedDB.open("budgetapp",1)
request.onupgradeneeded = function({target}) {
    const db = target.result;
    db.createObjectStore("working",{
        autoIncrement: true
    });
  };
request.onsuccess = function({target}){
    db = target.result
    if(navigator.onLine){
        lookDatabase()
    }
}
function saveDB(opject){
    const transaction = db.transaction(["working"],"readwrite")
const objectsStore=transaction.objectsStore("working")
objectsStore.add(object)
}