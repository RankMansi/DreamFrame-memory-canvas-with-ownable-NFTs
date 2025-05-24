const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const mkdirp = require('mkdirp');

// Path to save models
const MODEL_DIR = path.join(__dirname, '../public/models');

// Base URL for face-api.js models
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// List of model files to download
const MODEL_FILES = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1'
];

// Function to download a file
const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
        console.log(`Downloaded: ${dest}`);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function downloadModels() {
  try {
    // Create models directory if it doesn't exist
    await mkdirp(MODEL_DIR);
    
    // Download each model file
    for (const file of MODEL_FILES) {
      await downloadFile(
        `${BASE_URL}/${file}`,
        path.join(MODEL_DIR, file)
      );
    }
    
    console.log('All face-api.js models downloaded successfully!');
  } catch (error) {
    console.error('Error downloading models:', error);
  }
}

downloadModels(); 