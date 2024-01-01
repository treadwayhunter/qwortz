/**
 * This file can programmatically maintain achievement win conditions.
 * The achievement persistent data itself is in the database? Saying that, I might not need to have them inserted in the database the way they are.
 * The database can simply maintain whether they've been completed or not..........
 */

// Achievement
//------------------
// title
// description
// win condition // condition type + number of type
// achieved or not
// date achieved

// win condition is the difficult one.
// 

// at some point, achievement data will need to be kept persistent somewhere
// 

/**
 * Types of achievements
 *  - complete levels
 *  - complete words
 *  - playing for a consecutive number of days
 *  - time frame?
 *  - time played
 *  - social stuff?
 */

// I could keep the win condition outside of the achievement itself.......

/**
 * 
 * class Achievement
 *  string title
 *  string desc
 *  bool achieved
 *  date time_achieved
 * 
 *  
 * 
 */

// number of words completed and number of levels completed can be kept in async storage... then brought to into memory during the lifetime of the game process
// for all achievements.... this is kind of lengthy to check all achievements each time an action is performed
// when an achievement is completed, a notification can be placed on the victory stack

// a separate achievement context might be easier to implement than trying to merge it with the game context
// 