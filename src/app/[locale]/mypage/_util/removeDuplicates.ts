export function removeDuplicates<T>(array: T[], key: keyof T): T[] {
  return array.filter(
    (item, index, self) =>
      index === self.findIndex((i) => i[key] === item[key]),
  );
}
