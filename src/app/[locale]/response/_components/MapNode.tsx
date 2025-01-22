import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MapView from './MapView'; // 위에서 작성한 MapView 컴포넌트 경로

const MapNode = Node.create({
  name: "map",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      lat: { default: 0 },
      lng: { default: 0 },
      name: { default: "" },
      address: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type='map']" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "map" }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MapView); // MapView를 Node View로 등록
  },
});

export default MapNode;
