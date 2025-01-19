const stripHtmlTags = (html: string | null | undefined): string => {
  if (typeof window === 'undefined') return ''; // 서버 환경 보호
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html || '';
  return tempDiv.textContent || tempDiv.innerText || '';
};

export default stripHtmlTags;
