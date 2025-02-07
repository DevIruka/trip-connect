const stripHtmlTags = (html: string | undefined) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html!;
  return tempDiv.textContent || tempDiv.innerText || '';
};

const ResponseContent = ({ html }: { html: string | undefined }) => {
  const textContent = stripHtmlTags(html);
  return <p className="text-[14px] w-full text-[#797C80] font-[500] ml-[6px] overflow-hidden text-ellipsis line-clamp-2">{textContent}</p>;
};
export default ResponseContent;
