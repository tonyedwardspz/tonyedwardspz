---
title: Recording Web Speech Synthesis
tag:
    - programming
omit: true
---

I usually remember that I need a recording of some synthesised speech shortly before giving each rendition of my _Beats, Rhymes and Neural Nets_ talk.

By “shortly before”, I mean I’m sitting in a hotel room, playing speech through a browser and recording it as a voice note on my phone. I then have to transfer the file to my laptop over whatever the hotel considers Wi-Fi.

It’s not a distinguished workflow.

Given I'm trying to be a little more prepared for future talks, I decided to add recording directly to the app that goes with it. Type the line, choose a voice, press Speak and download the result.

That was the idea, anyway.

The awkward bit is that the Web Speech API’s `speechSynthesis` interface doesn’t give you an audio stream. You can ask it to speak, but you can’t take its output and pass it directly to `MediaRecorder`.

My first workaround appeared to succeed. Chrome produced a playable WebM file with a sensible duration and no errors.

But it was completely silent.

## Why recording the Chrome tab didn’t work

I initially tried capturing the current tab’s audio with `getDisplayMedia()`. That seemed reasonable. The page starts the speech, the speech comes out of Chrome and Chrome records the tab.

Except that isn’t necessarily the route the audio takes.

Chrome voices commonly use the operating system’s speech engine. The page requests an utterance, but the resulting sound is produced outside the tab’s audio pipeline. Tab capture therefore records the tab perfectly while missing the voice I actually care about.

The solution was to record the operating system’s mixed audio through screen sharing, rather than recording only the Chrome tab.

## Making speech synthesis awaitable

Before dealing with capture, I needed to know when an utterance had finished.

The normal `speechSynthesis.speak()` method starts speaking and returns immediately. Wrapping the utterance events in a Promise gives the recording code a clean boundary to work with:

```
export const speakAsync = (options) => {
  const utter = createUtterance(options);

  if (!utter) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let settled = false;

    utter.onend = () => {
      if (settled) {
        return;
      }

      settled = true;
      resolve();
    };

    utter.onerror = (event) => {
      if (settled) {
        return;
      }

      settled = true;

      const reason = event?.error || 'synthesis-failed';
      const error = new Error(
        `Speech synthesis failed: ${reason}`
      );

      error.name =
        reason === 'canceled' || reason === 'interrupted'
          ? 'SpeechCancelledError'
          : 'SpeechSynthesisError';

      reject(error);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  });
};
```

The important part is that the recording flow can now do this:

```
startRecording();
await speakAsync(options);
stopRecording();
```

Cancellation and interruption get their very own error type because pressing Stop isn’t really a failed recording. Nor is replacing one utterance with another.

## Asking for system audio

The capture options now steer Chrome away from the current tab and towards an entire-screen share with system audio:

```
const buildDisplayMediaOptions = () => {
  const supported =
    typeof navigator.mediaDevices.getSupportedConstraints ===
    'function'
      ? navigator.mediaDevices.getSupportedConstraints()
      : {};

  const audio = {};

  if (supported.suppressLocalAudioPlayback) {
    audio.suppressLocalAudioPlayback = false;
  }

  if (supported.restrictOwnAudio) {
    audio.restrictOwnAudio = false;
  }

  return {
    video: true,
    audio: Object.keys(audio).length ? audio : true,
    preferCurrentTab: false,
    selfBrowserSurface: 'include',
    systemAudio: 'include',
    monitorTypeSurfaces: 'include',
  };
};
```

`suppressLocalAudioPlayback: false` allows me to keep hearing the speech while it’s recorded. `restrictOwnAudio: false` asks the browser not to remove the page’s own audio from the mix.

The remaining options are hints for Chrome’s sharing picker. They don’t let the application quietly choose a screen or enable system audio on someone’s behalf, which is probably for the best.

The user still has to select something along the lines of:

> Entire screen → Share system audio

Choose “Chrome tab” and the result may still be silence.

## Throwing away the video

Calling `getDisplayMedia()` gives me a display stream containing video and, if the correct option was selected, system audio.

I don’t need the video. Once permission has been granted, I stop and remove those tracks immediately:

```
const ensureAudioTracks = (captureStream, missingMessage) => {
  for (const track of captureStream.getVideoTracks()) {
    track.stop();
    captureStream.removeTrack(track);
  }

  const audioTracks = captureStream.getAudioTracks();

  if (!audioTracks.length) {
    stopMediaStream(captureStream);

    const error = new Error(missingMessage);
    error.name = 'TabAudioMissingError';
    throw error;
  }

  return new MediaStream(audioTracks);
};
```

Apart from doing less unnecessary work, this reduces the amount of the shared display that remains active.

The code keeps references to both the original capture stream and the audio-only stream. That matters later when capture stops, the component unmounts or the user starts a new session. Media tracks are quite happy to carry on until somebody explicitly tells them otherwise.

## Starting the recorder first

The order of operations matters.

Starting speech and then creating `MediaRecorder` risks losing the beginning of the utterance. The recorder needs to be running before `speechSynthesis.speak()` is called:

```
const session = startAudioRecording(audioStream);
activeRecordingRef.current = session;
setIsRecording(true);

await speakAsync(options);
```

When the utterance ends, I wait another 120 milliseconds before stopping the recorder:

```
await new Promise((resolve) => {
  window.setTimeout(resolve, 120);
});

const result = await session.stop();
```

That small delay isn’t decorative. The utterance’s `end` event can arrive slightly before the final audio reaches `MediaRecorder`.

## Picking a format the browser can record

The implementation also checks which MIME types are available instead of assuming every browser can create the same format:

```
const RECORDER_MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
];

export const pickRecorderMimeType = () => {
  if (
    typeof MediaRecorder === 'undefined' ||
    !MediaRecorder.isTypeSupported
  ) {
    return undefined;
  }

  return RECORDER_MIME_CANDIDATES.find((type) =>
    MediaRecorder.isTypeSupported(type)
  );
};
```

`MediaRecorder` emits chunks while it runs. I collect those chunks and turn them into a `Blob` when recording stops:

```
recorder.ondataavailable = (event) => {
  if (event.data && event.data.size > 0) {
    chunks.push(event.data);
  }
};

recorder.onstop = () => {
  const blob = new Blob(chunks, { type: mimeType });

  resolve({
    blob,
    mimeType,
    discarded: false,
  });
};

recorder.start(250);
```

The 250-millisecond timeslice encourages Chromium to flush chunks during longer utterances instead of keeping everything until the end. Depending on the selected MIME type, the download gets a `.webm`, `.m4a` or `.ogg` extension. 

## Detecting a recording full of nothing

My failed tab-capture experiment exposed another problem: checking that the Blob exists isn’t enough.

A WebM can have a header, timing information and plenty of bytes while containing no audible speech. To catch that, you need to decode each recording and calculates its root mean square amplitude:

```
export const looksSilentRecording = async (
  blob,
  rmsThreshold = 0.008
) => {
  if (!blob || blob.size < 256) {
    return true;
  }

  const Ctx = AudioContext || webkitAudioContext;
  const context = new Ctx();

  try {
    const buffer = await context.decodeAudioData(
      await blob.arrayBuffer()
    );

    let peakRms = 0;

    for (
      let channel = 0;
      channel < buffer.numberOfChannels;
      channel += 1
    ) {
      const data = buffer.getChannelData(channel);
      const step = Math.max(
        1,
        Math.floor(data.length / 40000)
      );

      let sum = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += step) {
        sum += data[i] * data[i];
        count += 1;
      }

      if (count > 0) {
        peakRms = Math.max(
          peakRms,
          Math.sqrt(sum / count)
        );
      }
    }

    return peakRms < rmsThreshold;
  } finally {
    await context.close();
  }
};
```

For long recordings, it samples at most roughly 40,000 points per channel rather than inspecting every frame.

The threshold of `0.008` isn’t a universal definition of silence, but is a guard against accepting the near-empty files produced when the wrong capture source is selected. Very quiet intentional audio could fall below it, although that’s not going to happen for this use case.

If decoding isn’t available or fails, the implementation falls back to checking whether the Blob is suspiciously small. Less accurate, but still more useful than blindly accepting everything.

## Previewing and downloading takes

Once a recording passes the silence check, `URL.createObjectURL()` gives me a local URL for it:

```
const url = URL.createObjectURL(result.blob);

const recording = {
  id: `rec-${Date.now()}-${recordingSeq++}`,
  blob: result.blob,
  url,
  mimeType: result.mimeType,
  createdAt: Date.now(),
};

setRecordings((previous) => [recording, ...previous]);
```

The same URL powers an `<audio>` preview and the download link. Nothing needs to be uploaded to a server. Blob URLs do need a little tidying up. The app revokes each URL when I discard a take and revokes anything remaining when the React component unmounts:

```
URL.revokeObjectURL(recording.url);
```

The hook also stops every media track, cancels active speech and discards unfinished recordings during cleanup.

The feature is primarily aimed at desktop Chromium browsers. Screen-audio support and sharing interfaces vary between browsers and operating systems, so I wouldn’t present this as a universal browser recording API. It’s a focused workaround for a focused problem.

It does solve my problem, though. I can now prepare the line, choose the voice, adjust its speed and pitch, and download the chosen one. . . all without reaching for my phone.

Getting the recording into Keynote is still a pain. If only it supported webm 🤦‍♂️

Still. Let's solve one hotel-room problem at a time.