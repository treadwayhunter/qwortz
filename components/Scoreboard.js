import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { View, Text, FlatList } from 'react-native';

// best score, min score, score, completedWordList
export function Scoreboard({ score, bestScore, minScore, completedWordList }) {
    return (
        <View aria-label='scoreboard' style={{ flex: 1, width: '100%' }}>
            <View style={{ height: 80, width: '100%', flexDirection: 'row', paddingLeft: 20, paddingRight: 20, alignItems: 'center', justifyContent: 'space-evenly' }}>
                <View>
                    <Text style={{ fontSize: 24 }}>Best Score: {bestScore}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 24 }}>Min Score: {minScore}</Text>
                </View>
            </View>
            <View style={{ flex: 0.25, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                {bestScore >= minScore
                    ? <View style={{ borderWidth: 3, borderColor: 'green', borderRadius: 100, height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon color='green' size={24} icon={faCheck} /></View>
                    : <></>}
            </View>
            <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 40 }}>{score}</Text>
            </View>
            <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                <FlatList
                    data={completedWordList}
                    renderItem={({ item }) => <View style={{ margin: 8 }}><Text style={{ fontSize: 24 }}>{item}</Text></View>}
                    keyExtractor={item => item}
                    numColumns={2}
                    style={{ width: '100%' }}
                    contentContainerStyle={{ alignItems: 'center' }} />
            </View>
        </View>
    );
}
