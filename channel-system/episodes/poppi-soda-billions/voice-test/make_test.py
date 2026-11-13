import json, subprocess, urllib.request, os, sys
os.chdir(sys.argv[1])
V = {"george":"JBFqnCBsd6RMkjVDRZzb","brian":"nPczCjzI2devNBz1zQrb","daniel":"onwK4e9ZLuTAKqWW03F9"}
BENNY, SODA = "TX3LPaxmHKxFdv7VOQHJ", "IKne3meq5aSn9XLyUdCD"  # Liam, Charlie
N = ["2018. One spotlight on a television stage. Allison Ellsworth is pitching her vinegar soda to five investors... and she is nine months pregnant.",
     "In the one lit chair: Rohan Oza. He is about to offer her four hundred thousand dollars."]
SK1 = [(SODA,"Psst. Don't get too attached to me.")]
N2 = ["We know what they don't. One day, a cola giant will pay one point nine five billion dollars for this drink."]
SK2 = [(BENNY,"Two billion dollars? For vinegar?"),(SODA,"Same soda. Keep watching."),(BENNY,"Is she okay up there?"),(SODA,"She's fine. I'm the one sweating.")]
def tts(vid, text, out):
    if os.path.exists(out): return
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128",
        data=json.dumps({"text":text,"model_id":"eleven_multilingual_v2"}).encode(),
        headers={"xi-api-key":"proxy-injected","Content-Type":"application/json"})
    open(out,"wb").write(urllib.request.urlopen(req).read())
skit = []
for i,(v,t) in enumerate(SK1+SK2): tts(v,t,f"sk{i}.mp3"); skit.append(f"sk{i}.mp3")
for name,vid in V.items():
    parts = []
    for i,t in enumerate(N): tts(vid,t,f"{name}_n{i}.mp3"); parts.append(f"{name}_n{i}.mp3")
    parts.append(skit[0])
    tts(vid,N2[0],f"{name}_n2.mp3"); parts.append(f"{name}_n2.mp3")
    parts += skit[1:]
    args=[]; 
    for p in parts: args += ["-i",p]
    n=len(parts)
    f="".join(f"[{i}:a]aresample=44100,aformat=channel_layouts=mono,apad=pad_dur=0.35[a{i}];" for i in range(n))+"".join(f"[a{i}]" for i in range(n))+f"concat=n={n}:v=0:a=1[o]"
    subprocess.run(["ffmpeg","-y","-loglevel","error",*args,"-filter_complex",f,"-map","[o]","-b:a","128k",f"voice_test_{name}.mp3"],check=True)
    print("made", name)
