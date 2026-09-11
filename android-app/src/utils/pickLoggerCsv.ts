import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

const MAX_CHARS = 8_000_000;
const TEXT_EXT = ['.csv', '.txt', '.log'];

export type PickedLoggerCsv =
  | { kind: 'csv'; name: string; text: string }
  | { kind: 'zip'; name: string };

function isZip(name: string): boolean {
  return name.toLowerCase().endsWith('.zip');
}

function isTextExport(name: string, mimeType?: string | null): boolean {
  const lower = name.toLowerCase();
  if (TEXT_EXT.some((ext) => lower.endsWith(ext))) return true;
  if (!mimeType) return false;
  return (
    mimeType.includes('csv') ||
    mimeType.includes('excel') ||
    mimeType.startsWith('text/')
  );
}

async function readAssetText(asset: DocumentPicker.DocumentPickerAsset): Promise<string> {
  const file = asset.file;
  if (file && typeof file.text === 'function') {
    return file.text();
  }
  return FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });
}

/** Pick a MyChron / Race Studio CSV. Raw file stays on device. */
export async function pickLoggerCsv(): Promise<PickedLoggerCsv | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['text/*', 'application/csv', 'application/vnd.ms-excel', '*/*'],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled || !result.assets?.[0]) return null;

  const asset = result.assets[0];
  const name = asset.name || 'session.csv';
  if (isZip(name)) return { kind: 'zip', name };

  if (!isTextExport(name, asset.mimeType)) {
    Alert.alert(
      'Need a CSV',
      'Export Race Studio 3 / MyChron as CSV (all channels). Unzip Alfano/ADA archives first.'
    );
    return null;
  }

  let text = '';
  try {
    text = await readAssetText(asset);
  } catch {
    Alert.alert('Could not read file', 'Try exporting again as CSV or plain text.');
    return null;
  }

  if (!text.trim()) {
    Alert.alert('Empty file', 'That file has no readable text.');
    return null;
  }
  if (text.length > MAX_CHARS) {
    Alert.alert('File too large', 'Export a shorter session, or fewer channels.');
    return null;
  }

  return { kind: 'csv', name, text };
}
