export class StringUtils {
  static charCodeSum(str: string): number {
    return str.split('').reduce((carry, char, index) => {
      return carry + str.charCodeAt(index);
    }, 0);
  }
}
