export interface DataPoint {
  ts: string;
  value: number;
  q: "good" | "uncertain" | "bad";
}

export interface Tag {
  id: string;
  label: string;
  unit: string;
  points: DataPoint[];
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  tags: Tag[];
}

export interface Site {
  id: string;
  name: string;
  assets: Asset[];
}

export interface RawData {
  sites: Site[];
}

export interface AssetMetadata {
  id: string;
  name: string;
}

export interface TagInfo {
  tagId: string;
  tagName: string;
  unit: string;
  data: DataPoint[];
  assetId: string;
}

export interface FlattenedData {
  assets: AssetMetadata[];
  tagsByAsset: Record<string, TagInfo[]>;
  tagMap: Record<string, TagInfo>;
}

export interface ChartProps {
  data: DataPoint[];
  tagLabel: string;
  unit: string;
}