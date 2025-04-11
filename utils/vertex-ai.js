const { SpeechClient } = require('@google-cloud/speech/build/src/v2/index.js');
const pkg = require('@google-cloud/speech/build/protos/protos.js');
const { google } = pkg;

const speechClientOptions = {
    apiEndpoint: 'us-central1-speech.googleapis.com',
    keyFilename: './key.json',
    projectId: 'chatdkg-project'
};

const speechClient = new SpeechClient(speechClientOptions);

async function getSpeechTranscript(audioFile = './uploads/audio.wav') {
    try {
        const audio = {
            content: audioFile?.toString('base64')
        };

        const config = {
            autoDecodingConfig:
                new google.cloud.speech.v2.AutoDetectDecodingConfig(),
            enableAutomaticPunctuation: true,
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCodes: ['en-US'],
            model: 'chirp'
        };

        const request = {
            content: audio.content,
            config: config,
            recognizer: `projects/chatdkg-project/locations/us-central1/recognizers/_`
        };

        const [response] = await speechClient.recognize(request);
        const transcription = response.results
            .map((result) => result.alternatives[0].transcript)
            .join('\n');

        return transcription;
    } catch (error) {
        console.log(error);
        throw Error(
            'Sorry, speech recognition failed due to length of the recording or the availability of the service.'
        );
    }
}

module.exports = {
    getSpeechTranscript
};
