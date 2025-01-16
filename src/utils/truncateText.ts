export const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return ''; // null 또는 undefined 처리
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };