export default class {
    constructor(params) {
        this.params = params;
    }

  /**
   * @function setTitle - Set browser title
   * @param title
   */
  setTitle(title) {
        document.title = title;
    }

  /**
   * @function getHtml - Get page HTML
   * @return {Promise<string>}
   */
  async getHtml() {
        return "";
    }
}
