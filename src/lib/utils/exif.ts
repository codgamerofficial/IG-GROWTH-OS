// =============================================================================
// PujaHop Kolkata: Client-Side EXIF Metadata & GPS Geocoding Extractor
// Extracts Geotag Coordinates (Lat/Lng) & Capture Timestamp from Darshan Photos
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

export interface ExtractedExifData {
  latitude: number | null;
  longitude: number | null;
  takenAt: string | null;
  cameraMake: string | null;
  cameraModel: string | null;
  rawExif: Record<string, any>;
  hasGps: boolean;
}

/**
 * Parses EXIF data from an Image File ArrayBuffer
 */
export async function extractExifFromFile(file: File): Promise<ExtractedExifData> {
  const result: ExtractedExifData = {
    latitude: null,
    longitude: null,
    takenAt: null,
    cameraMake: null,
    cameraModel: null,
    rawExif: {},
    hasGps: false,
  };

  try {
    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    // Verify JPEG SOI marker (0xFFD8)
    if (view.getUint16(0, false) !== 0xffd8) {
      return result;
    }

    let offset = 2;
    const length = view.byteLength;

    while (offset < length) {
      if (view.getUint8(offset) !== 0xff) break;
      const marker = view.getUint8(offset + 1);

      // APP1 marker (0xFFE1) contains Exif
      if (marker === 0xe1) {
        const app1Length = view.getUint16(offset + 2, false);
        const exifHeader = view.getUint32(offset + 4, false);

        // "Exif\0\0" = 0x45786966 followed by 0x0000
        if (exifHeader === 0x45786966) {
          const tiffOffset = offset + 10;
          parseTiff(view, tiffOffset, result);
        }
        break;
      } else {
        // Skip marker
        offset += 2 + view.getUint16(offset + 2, false);
      }
    }
  } catch (err) {
    console.warn('[PujaHop EXIF] Error parsing EXIF:', err);
  }

  return result;
}

function parseTiff(view: DataView, tiffOffset: number, result: ExtractedExifData) {
  // Byte order: 0x4949 = Little Endian ('II'), 0x4D4D = Big Endian ('MM')
  const byteOrder = view.getUint16(tiffOffset, false);
  const littleEndian = byteOrder === 0x4949;

  // Verify 0x002A
  if (view.getUint16(tiffOffset + 2, littleEndian) !== 0x002a) return;

  const firstIfdOffset = view.getUint32(tiffOffset + 4, littleEndian);
  if (firstIfdOffset < 8) return;

  const ifd0Offset = tiffOffset + firstIfdOffset;
  const numEntries = view.getUint16(ifd0Offset, littleEndian);

  let gpsInfoOffset = 0;

  for (let i = 0; i < numEntries; i++) {
    const entryOffset = ifd0Offset + 2 + i * 12;
    const tag = view.getUint16(entryOffset, littleEndian);

    if (tag === 0x010f) {
      // Make
      result.cameraMake = getString(view, entryOffset, tiffOffset, littleEndian);
    } else if (tag === 0x0110) {
      // Model
      result.cameraModel = getString(view, entryOffset, tiffOffset, littleEndian);
    } else if (tag === 0x8825) {
      // GPSInfo IFD pointer
      gpsInfoOffset = tiffOffset + view.getUint32(entryOffset + 8, littleEndian);
    } else if (tag === 0x0132 || tag === 0x9003) {
      // DateTime
      result.takenAt = getString(view, entryOffset, tiffOffset, littleEndian);
    }
  }

  // Parse GPS IFD if present
  if (gpsInfoOffset > 0) {
    parseGpsIfd(view, gpsInfoOffset, tiffOffset, littleEndian, result);
  }
}

function parseGpsIfd(
  view: DataView,
  gpsOffset: number,
  tiffOffset: number,
  littleEndian: boolean,
  result: ExtractedExifData
) {
  const numEntries = view.getUint16(gpsOffset, littleEndian);
  let latRef = 'N';
  let lngRef = 'E';
  let latDms: number[] | null = null;
  let lngDms: number[] | null = null;

  for (let i = 0; i < numEntries; i++) {
    const entryOffset = gpsOffset + 2 + i * 12;
    const tag = view.getUint16(entryOffset, littleEndian);

    if (tag === 0x0001) {
      // GPSLatitudeRef ('N' or 'S')
      latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
    } else if (tag === 0x0002) {
      // GPSLatitude (3 rationals: deg, min, sec)
      latDms = getRationals(view, entryOffset, tiffOffset, littleEndian, 3);
    } else if (tag === 0x0003) {
      // GPSLongitudeRef ('E' or 'W')
      lngRef = String.fromCharCode(view.getUint8(entryOffset + 8));
    } else if (tag === 0x0004) {
      // GPSLongitude (3 rationals: deg, min, sec)
      lngDms = getRationals(view, entryOffset, tiffOffset, littleEndian, 3);
    }
  }

  if (latDms && lngDms) {
    const lat = dmsToDecimal(latDms[0], latDms[1], latDms[2], latRef);
    const lng = dmsToDecimal(lngDms[0], lngDms[1], lngDms[2], lngRef);
    if (!isNaN(lat) && !isNaN(lng)) {
      result.latitude = Number(lat.toFixed(6));
      result.longitude = Number(lng.toFixed(6));
      result.hasGps = true;
    }
  }
}

function dmsToDecimal(degrees: number, minutes: number, seconds: number, ref: string): number {
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (ref === 'S' || ref === 'W') decimal = -decimal;
  return decimal;
}

function getRationals(
  view: DataView,
  entryOffset: number,
  tiffOffset: number,
  littleEndian: boolean,
  count: number
): number[] {
  const valueOffset = tiffOffset + view.getUint32(entryOffset + 8, littleEndian);
  const rationals: number[] = [];
  for (let i = 0; i < count; i++) {
    const num = view.getUint32(valueOffset + i * 8, littleEndian);
    const den = view.getUint32(valueOffset + i * 8 + 4, littleEndian);
    rationals.push(den === 0 ? 0 : num / den);
  }
  return rationals;
}

function getString(
  view: DataView,
  entryOffset: number,
  tiffOffset: number,
  littleEndian: boolean
): string {
  const count = view.getUint32(entryOffset + 4, littleEndian);
  const valueOffset = count > 4 ? tiffOffset + view.getUint32(entryOffset + 8, littleEndian) : entryOffset + 8;
  let str = '';
  for (let i = 0; i < count - 1; i++) {
    const char = view.getUint8(valueOffset + i);
    if (char === 0) break;
    str += String.fromCharCode(char);
  }
  return str.trim();
}

/**
 * Calculates geodesic distance between two points in meters
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}
