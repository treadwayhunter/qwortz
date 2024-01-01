// let word = checkWordArray()
// returns the word if it is valid, else returns null
// if word: 

export default function checkWordArray(wordArr) {
    for(let i = 0; i < wordArr.length; i++) {
        if(wordArr[i] === '') {
            return null;
        }
    }

    let word = wordArr.join('');
    return word;
}