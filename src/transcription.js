const path = require('path');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

audio = path.join(__dirname, '../synthesizeTextoParaVoz.wav');
console.log('audio:', audio);

const fs = require('fs');
const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

const credentials = require('./apikey-ibm-cloud-stt.json');

async function transcription() {

    speechToText().then(() => {
        console.log('Processamento Finalizado');
    }).catch((e) => { console.log('erro:', e) });

  }
    async function speechToText() {
        const speechToText = new SpeechToTextV1({
            authenticator: new IamAuthenticator({
              apikey: credentials.apikey,
            }),
            serviceUrl: credentials.url,
          });
          
          var idioma = 'pt-BR_BroadbandModel';
          var idiomaTeste = 'en-US_BroadbandModel';


          const params = {
            objectMode: false,
            contentType: 'audio/wav',
            model: idioma,
            keywords: ['roteiro', 'argumento', 'guião'],
            keywordsThreshold: 0.5,
            maxAlternatives: 3,
          };
          
          // Create the stream.
          const recognizeStream = speechToText.recognizeUsingWebSocket(params);
          
          // Pipe in the audio.
          fs.createReadStream(audio).pipe(recognizeStream);
          
          /*
           * Uncomment the following two lines of code ONLY if `objectMode` is `false`.
           *
           * WHEN USED TOGETHER, the two lines pipe the final transcript to the named
           * file and produce it on the console.
           *
           * WHEN USED ALONE, the following line pipes just the final transcript to
           * the named file but produces numeric values rather than strings on the
           * console.
           */
          recognizeStream.pipe(fs.createWriteStream('transcriptionAudioParaTextoGerado.txt'));
          
          /*
           * WHEN USED ALONE, the following line produces just the final transcript
           * on the console.
           */
          recognizeStream.setEncoding('utf8');
          
          // Listen for events.
          recognizeStream.on('data', function(event) { onEvent('Data:', event); });
          recognizeStream.on('error', function(event) { onEvent('Error:', event); });
          recognizeStream.on('close', function(event) { onEvent('Close:', event); });        
    }

    
    // Display events on the console.
    function onEvent(name, event) {
        console.log(name, JSON.stringify(event, null, 2));
    };



module.exports = transcription;