import { Editor } from '@tiptap/core';
import React, { useEffect, useState } from 'react';
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
import { useMediaQuery } from 'react-responsive';

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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 799 });

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        const windowHeight = window.innerHeight;
        const keyboardHeight = windowHeight - viewport.height;
        setKeyboardHeight(keyboardHeight);
      }

      setIsTextMenuVisible(window.innerWidth >= 800);
    };

    if (window.visualViewport) {
      handleResize();
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

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
      {isMobile ? (
        <>
          {/* Text Menu */}
          {isTextMenuVisible && (
            <div
              className="w-full h-14 flex-col justify-start items-start inline-flex fixed z-[60] top-0 left-0"
              style={{
                position: 'fixed',
                top: 'auto',
                bottom: `${keyboardHeight + 56}px`,
              }}
            >
              <div className="self-stretch px-5 py-[16px] bg-white border-b border-t border-[#dee1e5] justify-start items-center gap-2.5 inline-flex md:px-[20px] py-[12px]">
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
                  <div className="w-[1px] h-full bg-[#EBEBEB]"></div>
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
          <div
            className="w-full h-[56px] px-5 py-[16px] bg-white border-t border-[#dee1e5] flex justify-start items-center gap-6 fixed bottom-0 left-0 z-50 md:px-[20px] py-[12px]"
            style={{
              position: 'fixed',
              bottom: `${keyboardHeight}px`,
            }}
          >
            <div className="justify-start items-center gap-6 flex">
              {isMobile && (
                <button onClick={handleTextHeightClick}>
                  <TextHeightIcon color={getTextHeightColor()} />
                </button>
              )}

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
                onClick={() => setIsModalOpen(true)}
              >
                <MapMarkerIcon />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Main Menu */}
          <div className="w-full h-[56px] px-5 py-[16px] bg-white border-t border-[#dee1e5] flex justify-start items-center gap-6 md:px-[20px] md:py-[12px]">
            <div className="justify-start items-center gap-6 flex">
              <button>
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
                onClick={() => setIsModalOpen(true)}
              >
                <MapMarkerIcon />
              </button>
            </div>
          </div>

          {/* Text Menu */}
          <div className="w-full h-14 flex-col justify-start items-start inline-flex">
            <div className="self-stretch px-5 py-[16px] bg-white border-b border-t border-[#dee1e5] justify-start items-center gap-2.5 inline-flex md:px-[20px] md:py-[12px]">
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
                <div className="w-[1px] h-full bg-[#EBEBEB]"></div>
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
        </>
      )}
      <GoogleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={handleInsertMap}
      />
    </div>
  );
};

export default MenuBar;
