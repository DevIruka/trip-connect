import { truncateText } from "@/utils/truncateText";

const stripHtmlTags = (html: string | undefined) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html!;
  return tempDiv.textContent || tempDiv.innerText || '';
};

const ResponseContent = ({ html }: { html: string | undefined }) => {
  const textContent = stripHtmlTags(html);
  const freeContent = truncateText(textContent, 20)
  return <div>{freeContent}</div>;
};
export default ResponseContent;
