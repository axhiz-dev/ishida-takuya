/**
 * 最小限の ZIP ライター（無圧縮・store のみ）。
 *
 * 中身が PDF で、その PDF は画像を圧縮して持っている。
 * そこをもう一度縮めてもほとんど減らないので、圧縮は実装していない。
 * store だけなら仕様は素直で、ライブラリを足す理由がない。
 *
 * 参照した仕様は APPNOTE.TXT（PKWARE）の 4.3.6〜4.3.16。
 * ZIP64 は扱わない（4GB を超えるものはこの用途では出てこない）。
 */

/* CRC-32（IEEE 802.3）。テーブルは初回に 1 回だけ作る。 */
let table: Uint32Array | undefined;

function crcTable(): Uint32Array {
  if (table) return table;
  const next = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    next[i] = c >>> 0;
  }
  table = next;
  return next;
}

function crc32(bytes: Uint8Array<ArrayBuffer>): number {
  const t = crcTable();
  let c = 0xffffffff;
  for (const byte of bytes) c = t[(c ^ byte) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** MS-DOS 形式の日時。秒は 2 秒刻みしか持てない。 */
function dosStamp(date: Date): { time: number; date: number } {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1),
    date: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

export type ZipEntry = { name: string; data: Uint8Array<ArrayBuffer> };

/**
 * エントリをまとめて 1 つの Blob にする。
 * ファイル名は UTF-8 で書き、汎用フラグの bit 11 を立てて明示する。
 * これを立てないと、和文のファイル名が Windows で化ける。
 */
export function createZip(entries: ZipEntry[], now = new Date()): Blob {
  const stamp = dosStamp(now);
  const encoder = new TextEncoder();
  const parts: Uint8Array<ArrayBuffer>[] = [];
  const central: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const sum = crc32(entry.data);
    const size = entry.data.length;

    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); // ローカルヘッダ
    lv.setUint16(4, 20, true); // 展開に必要なバージョン
    lv.setUint16(6, 0x0800, true); // bit 11: ファイル名は UTF-8
    lv.setUint16(8, 0, true); // 0 = 無圧縮
    lv.setUint16(10, stamp.time, true);
    lv.setUint16(12, stamp.date, true);
    lv.setUint32(14, sum, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, name.length, true);
    local.set(name, 30);

    parts.push(local, entry.data);

    const dir = new Uint8Array(46 + name.length);
    const dv = new DataView(dir.buffer);
    dv.setUint32(0, 0x02014b50, true); // 中央ディレクトリ
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 20, true);
    dv.setUint16(8, 0x0800, true);
    dv.setUint16(10, 0, true);
    dv.setUint16(12, stamp.time, true);
    dv.setUint16(14, stamp.date, true);
    dv.setUint32(16, sum, true);
    dv.setUint32(20, size, true);
    dv.setUint32(24, size, true);
    dv.setUint16(28, name.length, true);
    dv.setUint32(42, offset, true); // ローカルヘッダの位置
    dir.set(name, 46);
    central.push(dir);

    offset += local.length + size;
  }

  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); // 終端レコード
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end], { type: "application/zip" });
}
