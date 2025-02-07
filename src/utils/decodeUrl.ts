export const decodeUrl = (encodedString: string) => {
  try {
    return decodeURIComponent(encodedString);
  } catch (error) {
    console.error('Error decoding URL:', error);
    return null;
  }
};
