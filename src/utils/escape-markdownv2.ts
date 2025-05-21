export const escapeMarkdownV2 = (text: string): string =>
  text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&') // escape all MarkdownV2 specials
