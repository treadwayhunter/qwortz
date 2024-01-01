
//import dictionary from '../../assets/dictionary.json';
import dictionary from '../assets/dictionary.json';

export default function validateWord(word) {
    if (dictionary[word]) {
        return true;
    }
    else {
        return false;
    }
}