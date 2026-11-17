// Dependency-free PNG generation for the extension's simple bookmark symbol.
import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const tag = Buffer.from(type);
  const size = Buffer.alloc(4);
  size.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([tag, data])));
  return Buffer.concat([size, tag, data, checksum]);
}

const directory = new URL('../public/icons/', import.meta.url);
mkdirSync(directory, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const rows = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) / size;
      const v = (y + 0.5) / size;
      const radius = 0.2;
      const dx = Math.max(radius - u, 0, u - (1 - radius));
      const dy = Math.max(radius - v, 0, v - (1 - radius));
      const inside = dx * dx + dy * dy <= radius * radius;
      const bookmark = u >= 0.32 && u <= 0.68 && v >= 0.22 &&
        v <= 0.77 - Math.max(0, 0.13 * (1 - Math.abs(u - 0.5) / 0.18));
      const color = bookmark ? [228, 242, 211, 255] : [32, 106, 82, inside ? 255 : 0];
      const offset = y * (1 + size * 4) + 1 + x * 4;
      rows.set(color, offset);
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  writeFileSync(new URL(`${size}.png`, directory), Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows)),
    chunk('IEND', Buffer.alloc(0)),
  ]));
}
