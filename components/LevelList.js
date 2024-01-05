import { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import { checkCompleted, getCompletedWords, getLevelDataBrief, getNumLevels } from "../data/database";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCheck, faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useGameContext } from "./contexts/GameContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeContext } from "./contexts/ThemeContext";

export function LevelListHeader() {
    const insets = useSafeAreaInsets();
    const [color, setColor] = useState('#094387');
    const navigation = useNavigation();
    //#098287
    const { theme, setTheme } = useThemeContext();
    return (
        <View aria-label='LevelListHeader'
            style={{
                width: '100%',
                paddingTop: insets.top,
                height: 80 + insets.top,
                backgroundColor: theme === 'light' ? '#094387' : '#121212',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row'
            }}>
            <View style={{ height: '100%', width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={32} color={'white'} />
                </TouchableOpacity>
            </View>
            <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 32 }}>Levels</Text>
            </View>
            <View style={{ height: '100%', width: '25%' }}></View>

        </View>
    );
}

function LevelCardInfo({ id, score, minScore, completed, currentLevel }) {
    const { theme, setTheme } = useThemeContext();

    return (
        <View style={{
            flex: 1,
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <View>
                <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>Level: {id}</Text>
                <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>Score: {score}/{minScore}</Text>
            </View>
            {
                completed
                    ? <View style={{
                        borderRadius: 100,
                        borderWidth: 2,
                        borderColor: 'green',
                        padding: 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FontAwesomeIcon color="green" icon={faCheck} />
                    </View>
                    : id !== currentLevel
                        ? <View style={{
                            borderRadius: 100,
                            padding: 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FontAwesomeIcon color={theme === 'light' ? '#000' : '#fff'} size={20} icon={faLock} />
                        </View>
                        : <View style={{
                            borderRadius: 100,
                            padding: 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <></>
                        </View>
            }
        </View>
    );
}

function LevelCard({ id, score, minScore, completed, currentLevel, height }) {

    const navigation = useNavigation();
    const { gameState, gameDispatch } = useGameContext();
    const { theme, setTheme } = useThemeContext();

    function handlePress() {
        console.log('NAVIGATE TO', id);

        checkCompleted(id - 1) // check that the previous level is completed
            .then((value) => {
                if (value) { // if true
                    changeLevel(id);
                }
                else {
                    console.log('Previous level is not completed');
                }
            });
    }

    function changeLevel(level) {
        gameDispatch({ type: 'CHANGE_LEVEL', payload: level });
        navigation.navigate({ name: 'Game' });
        AsyncStorage.setItem('level', String(level));
    }

    return (
        <TouchableHighlight
            onPress={handlePress}
            style={{
                height: height,
                width: '100%',
                borderBottomWidth: 1,
                justifyContent: 'center',
                paddingLeft: 30,
                paddingRight: 30,
                backgroundColor: theme === 'light' ? '#fff' : '#2c2c2c',
                borderColor: theme === 'light' ? '#000' : '#fff'
            }}
            underlayColor={'#098287'}
        >
            <LevelCardInfo id={id} score={score} minScore={minScore} completed={completed} currentLevel={currentLevel} />
        </TouchableHighlight>
    );
}

export function LevelList() {
    // needs to know the number of completed levels + 1
    // the +1 is the current working level
    // 
    const flatListRef = useRef(null);
    const [levels, setLevels] = useState([]);
    const { theme, setTheme } = useThemeContext();
    const [currentLevel, setCurrentLevel] = useState(1);
    
    const interval = 60; // the size of the LevelCard. This value also informs snapToInterval and getItemLayout. 
    // This improves the scrolling ability of the Flatlist.

    useEffect(() => {
        // I don't suppose there'd be an error, but if there is then it won't catch or correct.
        getLevelDataBrief()
            .then((value) => {
                setLevels(value);
            });
        getNumLevels()
            .then((value) => {
                setCurrentLevel(value + 1);
                if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({ animated: true, index: value });
                }
            });
    }, []);

    // should probably be a flatlist instead of map
    return (
        <View style={{ flex: 1, width: '100%', backgroundColor: theme === 'light' ? '#fff' : '#121212' }}>
            <FlatList
                ref={flatListRef}
                data={levels}
                renderItem={({ item }) => <LevelCard id={item["id"]} score={item["score"]} minScore={item["min_score"]} completed={item["completed"]} currentLevel={currentLevel} height={interval} />}
                keyExtractor={item => item["id"]}
                style={{ width: '100%' }}
                snapToInterval={interval}
                getItemLayout={(data, index) => (
                    { length: interval, offset: interval * index, index }
                )}
            />
        </View>
    );
}