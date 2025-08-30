declare module "pdf2pic" {
  export interface ConvertOptions {
    density?: number;
    saveFilename?: string;
    savePath?: string;
    format?: "png" | "jpg" | "jpeg";
    width?: number;
    height?: number;
    quality?: number;
  }

  export interface ConvertResult {
    name: string;
    size: string;
    filesize: number;
    path?: string;
    page: number;
  }

  export interface Converter {
    bulk(pages: number): Promise<ConvertResult[]>;
    convert(page: number): Promise<ConvertResult>;
  }

  export const pdf2pic: {
    fromPath(path: string, options?: ConvertOptions): Converter;
    fromBuffer(buffer: Buffer, options?: ConvertOptions): Converter;
  };
}
