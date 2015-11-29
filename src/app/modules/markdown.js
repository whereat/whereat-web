const markdown = {
  parse(filename) {
    return require(`../markdown/${filename}`);
  }
};
export default markdown;
