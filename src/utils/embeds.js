export const fillWithBlankFields = (embed, fieldCount) => {
  if (fieldCount % 3)
    [...Array(3 - fieldCount % 3)].forEach(() => embed.addBlankField(true));
}