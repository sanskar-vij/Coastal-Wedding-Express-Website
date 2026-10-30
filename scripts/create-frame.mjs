import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const originalFramePath = path.join(root, 'public/assets/train-window-original.jpg');

async function generateFrames() {
  const meta = await sharp(originalFramePath).metadata();
  const W = meta.width; // 819
  const H = meta.height; // 1024

  // The inner brass window opening:
  // x: 170 to 668 (width: 498)
  // y: 172 to 778 (height: 606)
  // rx: 82
  const W_IN = 498;
  const H_IN = 606;
  const X_IN = 170;
  const Y_IN = 172;
  const R_IN = 82;

  // Generate transparent window frame PNG
  const frameRaw = await sharp(originalFramePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const frameData = Buffer.from(frameRaw.data);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      if (x >= X_IN && x <= X_IN + W_IN && y >= Y_IN && y <= Y_IN + H_IN) {
        let inCorner = false;
        if (x < X_IN + R_IN && y < Y_IN + R_IN) {
          const dx = X_IN + R_IN - x;
          const dy = Y_IN + R_IN - y;
          inCorner = (dx * dx) / (R_IN * R_IN) + (dy * dy) / (R_IN * R_IN) > 1;
        } else if (x > X_IN + W_IN - R_IN && y < Y_IN + R_IN) {
          const dx = x - (X_IN + W_IN - R_IN);
          const dy = Y_IN + R_IN - y;
          inCorner = (dx * dx) / (R_IN * R_IN) + (dy * dy) / (R_IN * R_IN) > 1;
        } else if (x < X_IN + R_IN && y > Y_IN + H_IN - R_IN) {
          const dx = X_IN + R_IN - x;
          const dy = y - (Y_IN + H_IN - R_IN);
          inCorner = (dx * dx) / (R_IN * R_IN) + (dy * dy) / (R_IN * R_IN) > 1;
        } else if (x > X_IN + W_IN - R_IN && y > Y_IN + H_IN - R_IN) {
          const dx = x - (X_IN + W_IN - R_IN);
          const dy = y - (Y_IN + H_IN - R_IN);
          inCorner = (dx * dx) / (R_IN * R_IN) + (dy * dy) / (R_IN * R_IN) > 1;
        }

        if (!inCorner) {
          frameData[idx + 3] = 0; // Cut out glass area
        }
      }
    }
  }

  await sharp(frameData, { raw: { width: W, height: H, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, 'public/assets/train-window-frame.png'));

  console.log('Saved public/assets/train-window-frame.png');

  // Composite Aarav (enlarged to fill the complete window opening):
  const aaravRaw = await sharp(
    path.join(
      root,
      'public/assets/library/people__individuals__groom-portrait__psa-local-000115__main__v01.webp',
    ),
  )
    .resize(506, 616, { fit: 'cover', position: 'top' })
    .toBuffer();

  await sharp(originalFramePath)
    .composite([
      { input: aaravRaw, top: 168, left: 166 },
      { input: path.join(root, 'public/assets/train-window-frame.png'), top: 0, left: 0 },
    ])
    .webp({ quality: 94 })
    .toFile(path.join(root, 'public/assets/aarav-train-portrait.webp'));

  console.log('Saved public/assets/aarav-train-portrait.webp');

  // Composite Meera (enlarged to fill the complete window opening):
  const meeraRaw = await sharp(
    path.join(
      root,
      'public/assets/library/people__individuals__bride-portrait__psa-local-000116__main__v01.webp',
    ),
  )
    .resize(506, 616, { fit: 'cover', position: 'top' })
    .toBuffer();

  await sharp(originalFramePath)
    .composite([
      { input: meeraRaw, top: 168, left: 166 },
      { input: path.join(root, 'public/assets/train-window-frame.png'), top: 0, left: 0 },
    ])
    .webp({ quality: 94 })
    .toFile(path.join(root, 'public/assets/meera-train-portrait.webp'));

  console.log('Saved public/assets/meera-train-portrait.webp');

  const memories = [
    { id: 'memory1', src: 'public/assets/library/people__couples__couple-closeup__psa-local-000133__main__v01.webp' },
    { id: 'memory2', src: 'public/assets/library/people__couples__couple-sunset-embrace__psa-local-000134__main__v01.webp' },
    { id: 'memory3', src: 'public/assets/library/people__couples__couple-seated__psa-local-000135__main__v01.webp' },
    { id: 'memory4', src: 'public/assets/library/people__couples__couple-beach-walk__psa-local-000136__main__v01.webp' }
  ];

  for (const m of memories) {
    const raw = await sharp(path.join(root, m.src))
      .resize(506, 616, { fit: 'cover', position: 'center' })
      .toBuffer();
    await sharp(originalFramePath)
      .composite([
        { input: raw, top: 168, left: 166 },
        { input: path.join(root, 'public/assets/train-window-frame.png'), top: 0, left: 0 }
      ])
      .webp({ quality: 94 })
      .toFile(path.join(root, `public/assets/${m.id}-train-portrait.webp`));
    console.log(`Saved public/assets/${m.id}-train-portrait.webp`);
  }
}

generateFrames().catch(console.error);
