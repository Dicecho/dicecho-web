export interface ImagePlugin {
  /**
   * An optional method that will upload the image to a server.
   * The method receives the File of the uploaded image, and should return the URL of the uploaded image.
   */
  uploadImage?: (
    dataUrl: File
  ) => Promise<string | ArrayBuffer> | string | ArrayBuffer;
}
