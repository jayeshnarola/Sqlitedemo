import React from "react";
import { Platform} from "react-native";
import SQLite from "react-native-sqlite-storage";
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "expense.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;
// const createFromLocation= 1


export default class Database {

    initDB() {
        let db;
        let createFromLocation=''
        return new Promise((resolve) => {
          console.log("Plugin integrity check ...");
          SQLite.echoTest()
            .then(() => {
              console.log("Integrity check passed ...");
              console.log("Opening database ...");
              if(Platform.OS === 'ios'){
                createFromLocation = 1
              }else{
                createFromLocation = " '~/expense.db' , location: 'Library' "
              }
              SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size,
              )
                .then(DB => {
                  db = DB;
                  console.log("Database OPEN",db);
                  db.executeSql('SELECT 1 FROM categories LIMIT 1').then(() => {
                      console.log("Database is ready ... executing query ...");
                  }).catch((error) =>{
                      console.log("Received error: ", error);
                      console.log("Database not yet ready ... populating data");
                      db.transaction((tx) => {
                          tx.executeSql('CREATE TABLE IF NOT EXISTS categories (cId INTEGER PRIMARY KEY AUTOINCREMENT, cName TEXT NOT NULL, desc TEXT)');
                          tx.executeSql('CREATE TABLE IF NOT EXISTS expenses (eId INTEGER PRIMARY KEY AUTOINCREMENT,cId INTEGER NOT NULL, eName TEXT NOT NULL, desc TEXT)');
                      }).then(() => {
                          console.log("Table created successfully");
                      }).catch(error => {
                          console.log(error);
                      });
                  });
                  resolve(db);
                })
                .catch(error => {
                  console.log(error);
                });
            })
            .catch(error => {
              console.log("echoTest failed - plugin not functional");
            });
          });
      };

      closeDatabase(db) {
        if (db) {
          console.log("Closing DB");
          db.close()
            .then(status => {
              console.log("Database CLOSED");
            })
            .catch(error => {
              // this.errorCB(error);
              console.log(error);
              
            });
        } else {
          console.log("Database was not OPENED");
        }
      };

      listCategories() {
        return new Promise((resolve) => {
          const categories = [];
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT cId, cName, desc FROM categories', []).then(([tx,results]) => {
                console.log("Query completed");
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  const { cId, cName, desc } = row;
                  categories.push({
                    cId,
                    cName,
                    desc
                  });
                }
                console.log(categories);
                resolve(categories);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }


      listExpense() {
        return new Promise((resolve) => {
          const expenses = [];
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT eId, cId, eName, desc FROM expenses', []).then(([tx,results]) => {
                console.log("Query completed");
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  const { eId, cId, eName, desc } = row;
                  expenses.push({
                    eId,
                    cId,
                    eName,
                    desc
                  });
                }
                // console.log(expenses);
                resolve(expenses);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

    //   productById(id) {
    //     console.log(id);
    //     return new Promise((resolve) => {
    //       this.initDB().then((db) => {
    //         db.transaction((tx) => {
    //           tx.executeSql('SELECT * FROM Product WHERE prodId = ?', [id]).then(([tx,results]) => {
    //             console.log(results);
    //             if(results.rows.length > 0) {
    //               let row = results.rows.item(0);
    //               resolve(row);
    //             }
    //           });
    //         }).then((result) => {
    //           this.closeDatabase(db);
    //         }).catch((err) => {
    //           console.log(err);
    //         });
    //       }).catch((err) => {
    //         console.log(err);
    //       });
    //     });  
    //   }
      
    addCategory(cateogry) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO categories VALUES (?, ?, ?)',[ null, cateogry.c_name, cateogry.desc]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }
      addExpense(expense) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO expenses VALUES (?, ?, ?, ?)',[ null, expense.cId, expense.eName, expense.desc]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }


      updateCategory(cateogry) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('UPDATE categories SET cName = ?, desc = ? WHERE cId = ?', [cateogry.c_name, cateogry.desc, cateogry.cId]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      updateExpense(expense) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('UPDATE expenses SET  cId = ?, eName = ?, desc = ? WHERE eId = ?', [expense.cId, expense.eName, expense.desc, expense.eId]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      deleteCategory(id) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('DELETE FROM categories WHERE cId = ?', [id]).then(([tx, results]) => {
                console.log(results);
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      deleteExpense(id) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('DELETE FROM expenses WHERE eId = ?', [id]).then(([tx, results]) => {
                console.log(results);
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }
}