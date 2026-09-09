import notificationSound from "../assets/sounds/lifeos-notification.mp3";

let audioContext = null;
let alarmInterval = null;

const notificationAudio = new Audio(notificationSound);

notificationAudio.preload = "auto";
notificationAudio.volume = 1;

export const enableSound = async () => {
  try {
    if (!audioContext) {
      audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
      )();
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    return true;
  } catch (error) {
    console.error("Unable to enable sound:", error);
    return false;
  }
};

export const playNotificationSound = async () => {
  try {
    const enabled = await enableSound();

    if (!enabled) {
      return false;
    }

    notificationAudio.pause();
    notificationAudio.currentTime = 0;

    await notificationAudio.play();

    return true;
  } catch (error) {
    console.error(
      "Custom notification sound failed:",
      error
    );

    return false;
  }
};

const createBeep = ({
  frequency = 950,
  duration = 0.8,
  volume = 0.65,
}) => {
  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "square";

  oscillator.frequency.setValueAtTime(
    frequency,
    now
  );

  gainNode.gain.setValueAtTime(
    0.0001,
    now
  );

  gainNode.gain.exponentialRampToValueAtTime(
    volume,
    now + 0.03
  );

  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    now + duration
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + duration);
};

const playAlarmBeep = () => {
  createBeep({
    frequency: 950,
    duration: 0.8,
    volume: 0.65,
  });
};

export const startAlarm = async () => {
  try {
    const enabled = await enableSound();

    if (!enabled) {
      return false;
    }

    if (alarmInterval) {
      return true;
    }

    playAlarmBeep();

    alarmInterval = setInterval(() => {
      playAlarmBeep();
    }, 1200);

    return true;
  } catch (error) {
    console.error(
      "Unable to start alarm:",
      error
    );

    return false;
  }
};

export const stopAlarm = () => {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
};