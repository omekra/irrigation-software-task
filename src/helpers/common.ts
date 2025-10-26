import { useMemo } from "react";
import type { FlattenedData, RawData, TagInfo } from "../interfaces";

export const useFlattenedData = (jsonData: RawData): FlattenedData => {
  const metadata: FlattenedData = useMemo(() => {
    const result: FlattenedData = {
      assets: [],
      tagsByAsset: {},
      tagMap: {},
    };

    jsonData.sites.forEach((site) => {
      site.assets.forEach((asset) => {
        // 1. Store Asset Metadata
        const assetKey = `${site.id}:${asset.id}`;
        result.assets.push({
          id: assetKey,
          name: `${site.name} - ${asset.name}`,
        });
        result.tagsByAsset[assetKey] = [];

        asset.tags.forEach((tag) => {
          // 2. Store Tag Metadata and Data
          const tagKey = tag.id;
          const tagInfo: TagInfo = {
            tagId: tag.id,
            tagName: tag.label,
            unit: tag.unit,
            // Ensure data points are chronologically sorted
            data: [...tag.points].sort(
              (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime()
            ),
            assetId: assetKey,
          };

          result.tagsByAsset[assetKey].push(tagInfo);
          result.tagMap[tagKey] = tagInfo;
        });
      });
    });

    return result;
  }, [jsonData]);

  return metadata;
};