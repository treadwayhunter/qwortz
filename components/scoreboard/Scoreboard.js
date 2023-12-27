import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { View, Text, FlatList } from 'react-native';
import { ProgressBar } from './ProgressBar';

// best score, min score, score, completedWordList
export function Scoreboard({ score, bestScore, minScore, completedWordList }) {
    return (
        <View aria-label='scoreboard' style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            <View style={{ height: 80, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24 }}>Best</Text>
                    <Text style={{ fontSize: 24 }}>{bestScore}</Text>
                </View>
                <View style={{ height: '100%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24 }}>Pass</Text>
                    <Text style={{ fontSize: 24 }}>{minScore}</Text>
                </View>
            </View>
            <ProgressBar score={score} minScore={minScore} />
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
