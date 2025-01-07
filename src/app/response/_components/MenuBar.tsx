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
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
    <div className="mb-4 flex gap-2 overflow-x-auto items-center scrollbar-hide">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 w-8 h-8 border rounded flex items-center justify-center ${
          editor.isActive('bold') ? 'bg-blue-200' : 'bg-gray-100'
        } hover:bg-gray-200`}
        title="Bold"
      >
        <FaBold />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 w-8 h-8 border rounded flex items-center justify-center ${
          editor.isActive('italic') ? 'bg-blue-200' : 'bg-gray-100'
        } hover:bg-gray-200`}
        title="Italic"
      >
        <FaItalic />
      </button>

      {/* Align Left */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-1 w-8 h-8 border rounded flex items-center justify-center ${
          editor.isActive({ textAlign: 'left' }) ? 'bg-blue-200' : 'bg-gray-100'
        } hover:bg-gray-200`}
        title="Align-Left"
      >
        <FaAlignLeft />
      </button>

      {/* Align Center */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-1 w-8 h-8 border rounded flex items-center justify-center ${
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
        className={`p-1 w-8 h-8 border rounded flex items-center justify-center ${
          editor.isActive({ textAlign: 'right' })
            ? 'bg-blue-200'
            : 'bg-gray-100'
        } hover:bg-gray-200`}
        title="Align-Right"
      >
        <FaAlignRight />
      </button>

      {/* Insert Image */}
      <div className="relative">
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex items-center justify-center p-1 border rounded bg-gray-100 hover:bg-gray-200 w-full h-full"
          title="Upload Image"
        >
          <FaImage />
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
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
        className="p-1 w-24 border rounded bg-gray-100 hover:bg-gray-200"
        title="Font Family"
      >
        Font
      </button>
    </div>
  );
};

export default MenuBar;
