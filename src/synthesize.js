const fs = require('fs');
const path = require('path');

const TextToSpeechV1 = require('ibm-watson/text-to-speech/V1');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1'); 

const { IamAuthenticator } = require('ibm-watson/auth');

const credentials = require('./apikey-ibm-cloud-tts.json');

const textToConvert = fs.readFileSync(path.join(__dirname, '../transcription.txt'), 'utf8');


const audio = fs.readFileSync(path.join(__dirname, '../audio-file.flac'));

async function synthesize() {
    const textToSpeech = new TextToSpeechV1({
        authenticator: new IamAuthenticator({
            apikey: credentials.apikey,
        }),
        serviceUrl: credentials.url,
    });

    const synthesizeParams = {
        text: textToConvert,
        accept: 'audio/wav',
        voice: 'pt-BR_IsabelaV3Voice',
    }

    await textToSpeech.synthesize(synthesizeParams)
    .then(response => {
        return textToSpeech.repairWavHeaderStream(response.result);
    })
    .then(buffer => {
        fs.writeFileSync('synthesize.wav', buffer);
    })
    .catch(err => {
        console.log('error: ', err);
    })
}

async function synthesizeAudioToText() {
    const speechToText = new SpeechToTextV1({
        authenticator: new IamAuthenticator({
            apikey: credentials.apikey,
        }),
        serviceUrl: credentials.url,
    });

    var idioma = 'pt-BR_BroadbandModel';
    var idiomaTeste = 'en-US_BroadbandModel';

    const params = {
        audio: audio,
        contentType: 'audio/wav/flac',
        model: idiomaTeste,
        timestamps: true,
        wordAlternativesThreshold: 0.9,
    };

    await speechToText.recognize(params)
    .then(response => {
        const transcription = response.result.results.map(result => result && result.alternatives[0] ? result.alternatives[0].transcript : '').join('\n');
        console
        fs.writeFileSync(path.join(__dirname, '../transcription.txt'), transcription);

        console.log(JSON.stringify(response.result, null, 2));
    })
    .catch(err => {
        console.log('error: ', err);
    });
}





module.exports = synthesize;
//module.exports = synthesizeAudioToText;