import speech_recognition as sr

# Inicialize o reconhecedor
r = sr.Recognizer()

# Obtenha acesso ao microfone
with sr.Microphone() as source:
    print("Diga alguma coisa:")
    audio = r.listen(source)

# Faça a transcrição do áudio
text = r.recognize_google(audio,language='pt-BR')
print(text)


with open("transcription.txt", "w") as arquivo:
    arquivo.write(text)
