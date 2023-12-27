import { View } from 'react-native';

// score and minScore
// a component, where the inner component is a percentage of the total component
export function ProgressBar({ score, minScore }) {

    let progress = (score / minScore) * 100;
    if (progress > 100) progress = 100;

    let progressText = `${progress}%`;

    return (
        <View style={{ height: 40, width: '80%', borderWidth: 3, borderRadius: 8, margin: 16, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: progressText, backgroundColor: 'green' }} />
        </View>
    );
}
