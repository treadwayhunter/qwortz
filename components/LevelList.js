import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableHighlight } from "react-native";
import { getNumLevels } from "../data/database";

function LevelCard({number}) {

    function handlePress() {
        console.log('NAVIGATE TO', number);
    }

    return (
        <TouchableHighlight onPress={handlePress} style={{height: 60, width: '100%', borderBottomWidth: 2, justifyContent: 'center', paddingLeft: 30}}>
            <Text>Level: {number}</Text>
        </TouchableHighlight>
    );
}

export function LevelList() {
    // needs to know the number of completed levels + 1
    // the +1 is the current working level
    // 

    const [levels, setLevels] = useState([]);
    
    console.log(levels);

    useEffect(() => {
        
        getNumLevels()
            .then((value) => {
                console.log('VALUE:', value);
                const levelArr = [];
                // this is all poorly generated. I'll need a query that gets all levels data

                for(let i = 1; i <= value; i++) {
                    console.log(i);
                    levelArr.push(i);
                }
                setLevels(levelArr);
            });
    }, []);

    // should probably be a flatlist instead of map
    return (
        <View style={{flex: 1, width: '100%'}}>
            {
                levels.map((level, index) => (
                    <LevelCard number={level} key={index}/>
                ))
            }
        </View>
    );
}