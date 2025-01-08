import { Node } from "@tiptap/core";

const MapNode = Node.create({
  name: "map",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      lat: {
        default: 0,
      },
      lng: {
        default: 0,
      },
      name: {
        default: "",
      },
      address: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-type='map']",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-type": "map",
        "data-lat": HTMLAttributes.lat,
        "data-lng": HTMLAttributes.lng,
        "data-name": HTMLAttributes.name,
        "data-address": HTMLAttributes.address,
      },
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const container = document.createElement("div");
      container.setAttribute("style", "border: 1px solid #ccc; padding: 10px;");

      const map = document.createElement("iframe");
      map.src = `https://www.google.com/maps?q=${node.attrs.lat},${node.attrs.lng}&output=embed`;
      map.width = "100%";
      map.height = "250px";
      map.style.border = "none";

      const info = document.createElement("div");
      info.style.marginTop = "10px";
      info.innerHTML = `
        <strong>${node.attrs.name}</strong><br />
        ${node.attrs.address}
      `;

      container.appendChild(map);
      container.appendChild(info);

      return {
        dom: container,
      };
    };
  },
});

export default MapNode;
