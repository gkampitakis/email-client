import path from 'path';
import fs from 'fs';
import mimeTypes from 'mime-types';
import HLRU from 'hashlru';

/**
 * Attachment File
 */
export interface AttFile {
  /** You can specify different name for the file */
  name?: string;
  /** Path were file is located */
  path: string;
}

export abstract class Transporter {
  protected configuration: any;
  protected production: boolean;
  private LRU;

  constructor (configuration: any) {
    this.configuration = configuration;
    const { production, attCacheSize } = configuration;
    this.production = production;
    this.LRU = HLRU(attCacheSize);
  }

  public abstract send (message: any): Promise<any>;

  public abstract get (): any;

  protected abstract messageTransform (message: any): Record<string, any>;

  protected abstract processAttachments (files: any): Record<string, any>;

  protected getFileData (file: any): { content: Buffer; filename: string; contentType: string } {
    let filepath = file.path;
    let filename = file.name;

    if (!file.path) filepath = file;
    if (!file.name) {
      const parsePath = path.parse(filepath);
      filename = parsePath.name + parsePath.ext;
    }

    let attachment = this.LRU.get(filepath);

    if (this.production && attachment) {
      return attachment;
    }

    const result = mimeTypes.lookup(filepath),
      content = fs.readFileSync(filepath);

    attachment = {
      filename,
      content,
      contentType: result || 'unknown'
    };

    this.LRU.set(filepath, attachment);
    return attachment;
  }
}
