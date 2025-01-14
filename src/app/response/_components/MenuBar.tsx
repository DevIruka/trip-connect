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
import { supabase } from '@/utils/supabase/supabaseClient';

type Props = {
  editor: Editor | null;
};

const MenuBar: React.FC<Props> = ({ editor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInsertMap = (location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'map',
          attrs: {
            lat: location.lat,
            lng: location.lng,
            name: location.name,
            address: location.address,
          },
        })
        .run();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      try {
        const fileName = `${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from('editor') // 버킷 이름
          .upload(`${fileName}`, file);
  
        if (error) {
          console.error('Error uploading image:', error.message);
          alert('이미지 업로드에 실패했습니다.');
          return;
        }
  
        const { data: publicUrlData } = supabase.storage
          .from('editor')
          .getPublicUrl(`${fileName}`);
  
        const imageUrl = publicUrlData.publicUrl;
  
        editor.chain().focus().setImage({ src: imageUrl }).run(); // 이미지 삽입
      } catch (err) {
        console.error('Unexpected error:', err);
        alert('이미지 업로드 중 문제가 발생했습니다.');
      } 
    }
  };

  if (!editor) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-2 flex justify-around items-center z-50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 w-10 h-10 flex items-center justify-center ${
          editor.isActive('bold') ? 'bg-gray-200' : ''
        }`}
        title="Bold"
      >
        <FaBold className="text-gray-500" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 w-10 h-10 flex items-center justify-center ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
        title="Italic"
      >
        <FaItalic className="text-gray-500" />
      </button>

      {/* Align Left */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-1 w-10 h-10 flex items-center justify-center ${
          editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
        }`}
        title="Align Left"
      >
        <FaAlignLeft className="text-gray-500" />
      </button>

      {/* Align Center */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-1 w-10 h-10 flex items-center justify-center ${
          editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
        }`}
        title="Align Center"
      >
        <FaAlignCenter className="text-gray-500" />
      </button>

      {/* Align Right */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-1 w-10 h-10 flex items-center justify-center ${
          editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
        }`}
        title="Align Right"
      >
        <FaAlignRight className="text-gray-500" />
      </button>

      {/* Insert Image */}
      <div className="relative">
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex items-center justify-center w-10 h-10"
          title="Upload Image"
        >
          <FaImage className="text-gray-500" />
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
        className="p-2 flex items-center justify-center w-10 h-10"
        title="Insert Map"
      >
        <FaMapMarkerAlt className="text-gray-500"/>
      </button>

      <GoogleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={handleInsertMap}
      />

    </div>
  );
};

export default MenuBar;
