import stripHtmlTags from '../_util/striptHtmlTags';

const ResponseContent = ({ html }: { html: string | undefined }) => {
  const textContent = stripHtmlTags(html);
  return (
    <p className="text-[14px] max-w-[315px] text-[#797C80] font-[500] ml-[6px] overflow-hidden text-ellipsis">
      {textContent}
    </p>
  );
};
export default ResponseContent;
