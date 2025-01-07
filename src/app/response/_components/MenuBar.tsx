import { Editor } from '@tiptap/core';
import React from 'react';
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaImage,
  FaItalic,
} from 'react-icons/fa';

type Props = {
  editor: Editor | null;
};

const MenuBar: React.FC<Props> = ({ editor }) => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          editor!.chain().focus().setImage({ src: reader.result }).run();
        }
      };

      reader.readAsDataURL(file);
    }
  };

  if (!editor) return null;

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-4 py-2 border rounded ${
          editor.isActive('bold') ? 'bg-blue-200' : 'bg-gray-100'
        } hover:bg-gray-200`}
        title="Bold"
      >
        <FaBold />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-4 py-2 border rounded ${
          editor.isActive('italic') ? 'bg-blue-200' : 'bg-gray-100'
        } hover:bg-gray-200`}
        title="Italic"
      >
        <FaItalic />
      </button>

      <button
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        className={`px-4 py-2 border rounded ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-blue-200'
            : 'bg-gray-100'
        } hover:bg-gray-200`}
      >
        H1
      </button>

      {/* Align Left */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`px-4 py-2 border rounded ${
          editor.isActive({ textAlign: 'left' }) ? 'bg-blue-200' : 'bg-gray-100'
        } hover:bg-gray-200`}
        title="Align-Left"
      >
        <FaAlignLeft />
      </button>

      {/* Align Center */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`px-4 py-2 border rounded ${
          editor.isActive({ textAlign: 'center' })
            ? 'bg-blue-200'
            : 'bg-gray-100'
        } hover:bg-gray-200`}
        title="Align-Center"
      >
        <FaAlignCenter />
      </button>

      {/* Align Right */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`px-4 py-2 border rounded ${
          editor.isActive({ textAlign: 'right' })
            ? 'bg-blue-200'
            : 'bg-gray-100'
        } hover:bg-gray-200`}
        title="Align-Right"
      >
        <FaAlignRight />
      </button>

      {/* Insert Image */}
      <div>
        <label
          htmlFor="image-upload"
          className="cursor-pointer p-2 border rounded bg-gray-100 hover:bg-gray-200"
          title="Upload Image"
        >
          <FaImage />
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Font Family */}
      <button
        onClick={() => {
          const font = prompt('Enter font family (e.g., Arial)');
          if (font) {
            editor.chain().focus().setFontFamily(font).run();
          }
        }}
        className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
      >
        Font Family
      </button>
    </div>
  );
};

export default MenuBar;
