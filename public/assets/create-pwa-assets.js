const sharp = require('sharp');

// Create desktop screenshot placeholder
sharp({
  create: {
    width: 1920,
    height: 1080,
    channels: 4,
    background: { r: 245, g: 245, b: 245 }
  }
})
.composite([{
  input: {
    text: {
      text: 'Llywellyn Labs Desktop View',
      rgba: true
    }
  }
}])
.png()
.toFile('screenshot-desktop.png');

// Create mobile screenshot placeholder
sharp({
  create: {
    width: 1080,
    height: 1920,
    channels: 4,
    background: { r: 245, g: 245, b: 245 }
  }
})
.composite([{
  input: {
    text: {
      text: 'Llywellyn Labs Mobile View',
      rgba: true
    }
  }
}])
.png()
.toFile('screenshot-mobile.png');

// Create maskable icons
sharp('web-app-manifest-192x192.png')
.resize(192, 192, {
  fit: 'contain',
  background: { r: 245, g: 245, b: 245, alpha: 1 }
})
.toFile('maskable-icon-192x192.png');

sharp('web-app-manifest-512x512.png')
.resize(512, 512, {
  fit: 'contain',
  background: { r: 245, g: 245, b: 245, alpha: 1 }
})
.toFile('maskable-icon-512x512.png');
