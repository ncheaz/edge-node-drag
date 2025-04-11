const multer = require("multer");

const createMulterStorageObjectForAudioTranscript = (
  transcriptName = "audio.wav"
) => {
  const storage = multer.memoryStorage();
  return {
    upload: multer({
      storage,
      limits: {
        fields: 2,
        fileSize: 1e7, // 10MB
        files: 1,
      },
    }),
    transcriptName,
  };
};

module.exports = {
  createMulterStorageObjectForAudioTranscript
};
