/**
 * This file can programmatically maintain achievement win conditions.
 * The achievement persistent data itself is in the database? Saying that, I might not need to have them inserted in the database the way they are.
 * The database can simply maintain whether they've been completed or not..........
 */

import { LinearGradient } from "react-native-svg";

// achievements can be done by type, but then in programmatically done in switch cases
// 
/**
 * Types
 *  word count
 *  level completions
 *      easy to keep adding more types
 */

// type == a String
// value depends on the string, but will likely always be an integer 
export default function achievementChecker(type, value) {
    if (type === 'wordCount') {
        switch (value) {
            case 10: return;
            case 25: return;
            case 100: return;
            case 500: return;
            case 1000: return;
            case 5000: return;
            case 10000: return; // 10 words per level?
            case 20000: return; // 20 words per level
            case 50000: return; // 50 words per level  
        }
    }

    if (type === 'level') {
        switch (value) {
            case 1: return;
            case 5: return;
            case 10: return;
            case 20: return;
            case 50: return;
            case 100: return;
            case 200: return;
            case 500: return;
            case 1000: return; // game complete
        }
    }
    // other achievements can be added here
}