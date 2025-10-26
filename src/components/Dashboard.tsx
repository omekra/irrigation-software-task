import React, { useState, useEffect } from "react";
import TimeSeriesChart from "./TimeSeriesChart";
import sites from "../assets/data.json";
import type { DataPoint, RawData, TagInfo } from "../interfaces";
import { useFlattenedData } from "../helpers/common";

const Dashboard: React.FC = () => {
  const jsonData: RawData = sites as RawData;
  const { assets, tagsByAsset, tagMap } = useFlattenedData(jsonData);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(
    assets[0]?.id || ""
  );
  const [selectedTagId, setSelectedTagId] = useState<string>("");

  // Effect to auto-select the first tag when a new asset is chosen
  useEffect(() => {
    const availableTags = tagsByAsset[selectedAssetId];
    if (selectedAssetId && availableTags && availableTags.length > 0) {
      // Set the first tag of the newly selected asset as default
      setSelectedTagId(availableTags[0].tagId);
    } else {
      setSelectedTagId("");
    }
  }, [selectedAssetId, tagsByAsset]);

  // Data and Metadata for the currently selected tag (safely accessed)
  const currentTagInfo: TagInfo | null = tagMap[selectedTagId] || null;
  const currentData: DataPoint[] = currentTagInfo ? currentTagInfo.data : [];

  return (
    <div className="p-5 font-sans max-w-[1200px] mx-auto">
      <h1>Murray Irrigation Time Series Monitor</h1>
      <p>
        Select an asset and a tag to view its operational trend and quality
        labels.
      </p>

      <hr />

      <div className="flex gap-5 mb-5 flex-wrap">
        {/* 1. Asset Selection */}
        <div>
          <label htmlFor="asset-select">Select Asset:</label>
          <br />
          <select
            id="asset-select"
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="p-2 text-base rounded border border-gray-300 mr-2 min-w-[250px]"
          >
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Tag Selection (Dependent on Asset) */}
        {selectedAssetId && tagsByAsset[selectedAssetId]?.length > 0 && (
          <div>
            <label htmlFor="tag-select">Select Data Tag:</label>
            <br />
            <select
              id="tag-select"
              value={selectedTagId}
              onChange={(e) => setSelectedTagId(e.target.value)}
              className="p-2 text-base rounded border border-gray-300 mr-2 min-w-[250px]"
            >
              {tagsByAsset[selectedAssetId].map((tag) => (
                <option key={tag.tagId} value={tag.tagId}>
                  {tag.tagName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <hr />

      {/* --- Time Series Chart Component --- */}
      {currentTagInfo && currentData.length > 0 ? (
        <div>
          <h2>
            {currentTagInfo.tagName} Trend (Unit: {currentTagInfo.unit})
          </h2>
          <TimeSeriesChart
            data={currentData}
            tagLabel={currentTagInfo.tagName}
            unit={currentTagInfo.unit}
          />
        </div>
      ) : (
        <p>Please select an Asset and a Tag to view data.</p>
      )}
    </div>
  );
};

export default Dashboard;
