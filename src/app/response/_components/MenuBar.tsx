import { Editor } from '@tiptap/core';
import React, { useState } from 'react';
import GoogleModal from './GoogleModal';
import { supabase } from '@/utils/supabase/supabaseClient';
import MapMarkerIcon from '../_icons/MapMarkerIcon';
import ImageIcon from '../_icons/ImageIcon';
import TextHeightIcon from '../_icons/TextHeightIcon';
import BoldIcon from '../_icons/BoldIcon';
import ItalicIcon from '../_icons/ItalicIcon';
import AlignLeftIcon from '../_icons/AlignLeftIcon';
import AlignCenterIcon from '../_icons/AlignCenterIcon';
import AlignRightIcon from '../_icons/AlignRightIcon';

type Props = {
  editor: Editor | null;
};

const MenuBar: React.FC<Props> = ({ editor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextMenuVisible, setIsTextMenuVisible] = useState(false);
  const [alignment, setAlignment] = useState<string | null>(null);
  const [activeTextStyle, setActiveTextStyle] = useState<
    'bold' | 'italic' | null
  >(null);

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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  const handleTextHeightClick = () => {
    setIsTextMenuVisible((prev) => !prev);
  };

  const handleTextStyleClick = (style: 'bold' | 'italic') => {
    if (activeTextStyle === style) {
      editor?.chain().focus().unsetMark(style).run(); 
      setActiveTextStyle(null);
    } else {
      const chain = editor?.chain().focus();
      if (activeTextStyle) {
        chain?.unsetMark(activeTextStyle); 
      }
      chain?.setMark(style).run(); 
      setActiveTextStyle(style);
    }
  };

  const handleAlignmentClick = (align: string) => {
    setAlignment((prev) => (prev === align ? null : align));
    editor?.chain().focus().setTextAlign(align).run();
  };

  const getTextStyleColor = (style: string) =>
    activeTextStyle === style ? '#80BFFF' : '#45484D';

  const getAlignmentColor = (align: string) =>
    alignment === align ? '#80BFFF' : '#45484D';

  const getTextHeightColor = () => (isTextMenuVisible ? '#0582FF' : '#45484D');

  if (!editor) return null;

  return (
    <div>
      {/* Text Menu */}
      {isTextMenuVisible && (
        <div className="w-[375px] h-14 flex-col justify-start items-start inline-flex">
          <div className="self-stretch px-5 py-4 bg-white border-b border-t border-[#dee1e5] justify-start items-center gap-2.5 inline-flex">
            <div className="h-6 justify-start items-center gap-6 flex">
              <div className="h-6 justify-start items-center gap-6 flex">
                <button
                  className="w-6 h-6 flex items-center justify-center"
                  onClick={() => handleTextStyleClick('bold')}
                >
                  <BoldIcon color={getTextStyleColor('bold')} />
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center"
                  onClick={() => handleTextStyleClick('italic')}
                >
                  <ItalicIcon color={getTextStyleColor('italic')} />
                </button>
              </div>
              <div className="grow shrink basis-0 h-[0px] origin-top-left rotate-90 border border-[#eaeaea]"></div>
              <div className="justify-start items-center gap-6 flex">
                <button
                  className="w-6 h-6 flex items-center justify-center"
                  onClick={() => handleAlignmentClick('left')}
                >
                  <AlignLeftIcon color={getAlignmentColor('left')} />
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center"
                  onClick={() => handleAlignmentClick('center')}
                >
                  <AlignCenterIcon color={getAlignmentColor('center')} />
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center"
                  onClick={() => handleAlignmentClick('right')}
                >
                  <AlignRightIcon color={getAlignmentColor('right')} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Menu */}
      <div className="w-full h-[56px] px-5 py-[16px] bg-white border-t border-[#dee1e5] flex justify-start items-center gap-6">
        <div className="justify-start items-center gap-6 flex">
          <button onClick={() => handleTextHeightClick()}>
            <TextHeightIcon color={getTextHeightColor()} />
          </button>

          <label
            htmlFor="image-upload"
            className="w-6 h-6 flex items-center justify-center cursor-pointer hover:text-[#0582FF]"
          >
            <ImageIcon />
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handleImageUpload(e);
            }}
          />

          <button
            className="w-6 h-6 flex items-center justify-center hover:text-[#0582FF]"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            <MapMarkerIcon />
          </button>
        </div>
      </div>

      {/* Google Modal */}
      <GoogleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal logic
        onSelectLocation={handleInsertMap} // Callback for selecting a location
      />
    </div>

    // <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-2 flex justify-around items-center z-50">
    //   <button
    //     onClick={() => editor.chain().focus().toggleBold().run()}
    //     className={`p-1 w-10 h-10 flex items-center justify-center ${
    //       editor.isActive('bold') ? 'bg-gray-200' : ''
    //     }`}
    //     title="Bold"
    //   >
    //     <FaBold className="text-gray-500" />
    //   </button>

    //   <button
    //     onClick={() => editor.chain().focus().toggleItalic().run()}
    //     className={`p-1 w-10 h-10 flex items-center justify-center ${
    //       editor.isActive('italic') ? 'bg-gray-200' : ''
    //     }`}
    //     title="Italic"
    //   >
    //     <FaItalic className="text-gray-500" />
    //   </button>

    //   {/* Align Left */}
    //   <button
    //     onClick={() => editor.chain().focus().setTextAlign('left').run()}
    //     className={`p-1 w-10 h-10 flex items-center justify-center ${
    //       editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
    //     }`}
    //     title="Align Left"
    //   >
    //     <FaAlignLeft className="text-gray-500" />
    //   </button>

    //   {/* Align Center */}
    //   <button
    //     onClick={() => editor.chain().focus().setTextAlign('center').run()}
    //     className={`p-1 w-10 h-10 flex items-center justify-center ${
    //       editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
    //     }`}
    //     title="Align Center"
    //   >
    //     <FaAlignCenter className="text-gray-500" />
    //   </button>

    //   {/* Align Right */}
    //   <button
    //     onClick={() => editor.chain().focus().setTextAlign('right').run()}
    //     className={`p-1 w-10 h-10 flex items-center justify-center ${
    //       editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
    //     }`}
    //     title="Align Right"
    //   >
    //     <FaAlignRight className="text-gray-500" />
    //   </button>

    //   {/* Insert Image */}
    //   <div className="relative">
    //     <label
    //       htmlFor="image-upload"
    //       className="cursor-pointer flex items-center justify-center w-10 h-10"
    //       title="Upload Image"
    //     >
    //       <FaImage className="text-gray-500" />
    //     </label>
    //     <input
    //       type="file"
    //       id="image-upload"
    //       accept="image/*"
    //       onChange={handleImageUpload}
    //       className="absolute inset-0 opacity-0 cursor-pointer"
    //     />
    //   </div>

    //   <button
    //     onClick={() => setIsModalOpen(true)}
    //     className="p-2 flex items-center justify-center w-10 h-10"
    //     title="Insert Map"
    //   >
    //     <FaMapMarkerAlt className="text-gray-500"/>
    //   </button>

    //   <GoogleModal
    //     isOpen={isModalOpen}
    //     onClose={() => setIsModalOpen(false)}
    //     onSelectLocation={handleInsertMap}
    //   />

    // </div>
  );
};

export default MenuBar;
