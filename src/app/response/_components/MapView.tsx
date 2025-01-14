import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import React from 'react';

const MapView: React.FC<NodeViewProps> = ({ node }) => {
  const { lat, lng, name, address } = node.attrs;

  return (
    <NodeViewWrapper style={{ border: "1px solid #ccc", padding: "10px" }}>
      <iframe
        src={`https://www.google.com/maps?q=${lat},${lng}&output=embed`}
        width="100%"
        height="180"
        style={{ border: "none" }}
        title="Google Map"
      />
      <div style={{ marginTop: "10px" }}>
        <strong>{name}</strong>
        <br />
        {address}
      </div>
    </NodeViewWrapper>
  );
};

export default MapView;
