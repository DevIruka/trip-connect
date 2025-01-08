import { Editor } from '@tiptap/core';
import React, { useState } from 'react';
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaImage,
  FaItalic,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import GoogleModal from './GoogleModal';

type Props = {
  editor: Editor | null;
};

const MenuBar: React.FC<Props> = ({ editor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInsertMap = (location: { name: string; address: string; lat: number; lng: number }) => {
    if (editor) {
      editor.chain().focus().insertContent(`
        <div>
          <div>
            <iframe
              src="https://www.google.com/maps?q=${location.lat},${location.lng}&output=embed"
              width="100%"
              height="250"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
          <p><strong>${location.name}</strong></p>
          <p>${location.address}</p>
        </div>
      `).run();
    }
  };

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

      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
        title="Insert Google Map"
      >
        <FaMapMarkerAlt />
      </button>

      <GoogleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={handleInsertMap}
      />

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
