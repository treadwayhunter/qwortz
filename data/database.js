import * as SQLite from 'expo-sqlite';
//import * as FileSystem from 'expo-file-system';
//import Papa from 'papaparse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import levelData from '../assets/levels.json';


const db = SQLite.openDatabase('test.db'); // give real name later
/**
 * levels --- id, length, score, best score, min score
 */
function createTables() {
    console.log('called createTables');
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS levels (id INTEGER PRIMARY KEY, length int, score int, best_score int, min_score int, letter1 TEXT(1), letter1_pos INT, letter2 TEXT(1), letter2_pos INT, letter3 TEXT(1), letter3_pos INT, UNIQUE(id, letter1, letter1_pos), UNIQUE(id, letter2, letter2_pos), UNIQUE(id, letter3, letter3_pos));',
                [],
                () => {
                    console.log('Table created: levels');
                    createCompletedTable(); // this can occur async. It won't bother anything
                    resolve();
                },
                error => {
                    console.error('Error creating table: levels');
                    reject(error);
                }
            );
        });
    });
}

/**
 * completedWords --- id, word
 */
function createCompletedTable() {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS completedWords (id INTEGER, word TEXT(10), FOREIGN KEY(id) REFERENCES levels(id), UNIQUE(id, word));',
                [],
                () => {
                    console.log('completedWords table created successfully');
                },
                error => {
                    console.error('Error creating table: completedWords', error);
                    reject(error);
                }
            );
        });
    });

}

// I removed the staticLetters table... I'm so glad
export async function initdb() {

    await createTables();

    //console.log(levelData.data);
    levelData.data.forEach((row) => {
        console.log(row.id, row.length, row.minScore, row.letter1, row.letter1Pos, row.letter2, row.letter2Pos, row.letter3, row.letter3Pos);
        insertLevel(row.id, row.length, row.minScore, row.letter1, row.letter1Pos, row.letter2, row.letter2Pos, row.letter3, row.letter3Pos);
    });

}


function insertLevel(levelID, length, minScore, letter1, letter1pos, letter2, letter2pos, letter3, letter3pos) {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO levels (id, length, score, best_score, min_score, letter1, letter1_pos, letter2, letter2_pos, letter3, letter3_pos) VALUES (?, ?, 0, 0, ?, ?, ?, ?, ?, ?, ?);',
            [levelID, length, minScore, letter1, letter1pos, letter2, letter2pos, letter3, letter3pos],
            () => {
                console.log('INSERT Success levelID:', levelID);
            },
            error => {
                console.log('INSERT ERROR ID:', levelID);
            }
        );
    });
}

export function printTabledata() {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM levels;',
            [],
            (_, { rows }) => {
                console.log(JSON.stringify(rows._array));
            },
            error => { console.error('Error fetching data:', error); }
        );
    });
}

export function dropTables() {
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE IF EXISTS completedWords;',
            [],
            () => { console.log('Dropped completedWords'); },
            error => { console.error('Failed to drop completedWords') }
        );

        tx.executeSql(
            'DROP TABLE IF EXISTS levels;',
            [],
            () => { console.log('Dropped levels'); },
            error => { console.error('Failed to drop levels') }
        );
    });
    AsyncStorage.removeItem('initDB');
    AsyncStorage.removeItem('level');
}

export function getLevelData(level) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM levels WHERE id = ?;',
                [level],
                (_, { rows }) => {
                    if(rows.length === 1) {
                        resolve(rows._array[0]);
                    }
                    else {
                        resolve(null);
                    }
                },
                error => {
                    console.log('Get Level Data Error:', level);
                    reject(error);
                }
            );
        });
    });
}

export function getCompletedWords(level) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM completedWords WHERE id = ?;',
                [level],
                (_, { rows }) => {
                    if(rows.length > 0) {
                        //resolve(rows._array);
                        let list = []
                        for(let i = 0; i < rows.length; i++) {
                            list.push(rows._array[i]["word"]);
                        }
                        resolve(list);
                    }
                    else {
                        resolve([]);
                    }
                },
                error => {
                    console.log('Error getCompletedWords()', level);
                    reject(error);
                }
            );
        });
    });
}

export function insertCompletedWord(level, word) {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO completedWords (id, word) VALUES (?, ?);',
            [level, word],
            () => {
                console.log('Successfully inserted:', level, word);
            },
            error => {
                console.error('Error inserting', level, word);
            }
        );
    });
}

export function updateScore(level) {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE levels SET score = score + 1 WHERE id = ?;',
            [level],
            () => {
                console.log('Score incremented, LEVEL: ', level);
            },
            error => {
                console.error('Error updating score:', level);
            }
        );
    });
}

export function updateBestScore(level) {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE levels SET best_score = best_score + 1 WHERE id = ?;',
            [level],
            () => {
                console.log('Best Score incremented, LEVEL: ', level);
            },
            error => {
                console.error('Error updating best score:', level);
            }
        );
    });
}