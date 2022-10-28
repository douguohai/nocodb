import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import { IStorageAdapterV2, XcFile } from 'nc-plugin';
import request from 'request';
import { waitForStreamClose } from '../../utils/pluginUtils';

export default class Backblaze implements IStorageAdapterV2 {
  private s3Client: AWS.S3;
  private input: any;

  constructor(input: any) {
    this.input = input;
  }

  async fileCreate(key: string, file: XcFile): Promise<any> {
    const uploadParams: any = {
      ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
      // Configure the file stream and obtain the upload parameters
      const fileStream = fs.createReadStream(file.path);
      fileStream.on('error', (err) => {
        console.log('File Error', err);
        reject(err);
      });

      uploadParams.Body = fileStream;
      uploadParams.Key = key;

      // call S3 to retrieve upload file to specified bucket
      this.s3Client.upload(uploadParams, (err, data) => {
        if (err) {
          console.log('Error', err);
          reject(err);
        }
        if (data) {
          resolve(data.Location);
        }
      });
    });
  }

  async fileCreateByUrl(key: string, url: string): Promise<any> {
    const uploadParams: any = {
      ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
      // Configure the file stream and obtain the upload parameters
      request(
        {
          url: url,
          encoding: null,
        },
        (err, _, body) => {
          if (err) return reject(err);

          uploadParams.Body = body;
          uploadParams.Key = key;

          // call S3 to retrieve upload file to specified bucket
          this.s3Client.upload(uploadParams, (err1, data) => {
            if (err) {
              console.log('Error', err);
              reject(err1);
            }
            if (data) {
              resolve(data.Location);
            }
          });
        }
      );
    });
  }

  patchRegion(region: string): string {
    // in v0.0.1, we constructed the endpoint with `region = s3.us-west-001`
    // in v0.0.2, `region` would be `us-west-001`
    // as backblaze states Region is the 2nd part of your S3 Endpoint in documentation
    if (region.startsWith('s3.')) {
      region = region.slice(3);
    }
    return region;
  }

  public async fileDelete(_path: string): Promise<any> {
    return Promise.resolve(undefined);
  }

  public async fileRead(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.s3Client.getObject({ Key: key } as any, (err, data) => {
        if (err) {
          return reject(err);
        }
        if (!data?.Body) {
          return reject(data);
        }
        return resolve(data.Body);
      });
    });
  }

  public async init(): Promise<any> {
    const s3Options: any = {
      params: { Bucket: this.input.bucket },
      region: this.patchRegion(this.input.region),
    };

    s3Options.accessKeyId = this.input.access_key;
    s3Options.secretAccessKey = this.input.access_secret;

    s3Options.endpoint = new AWS.Endpoint(
      `s3.${s3Options.region}.backblazeb2.com`
    );

    this.s3Client = new AWS.S3(s3Options);
  }

  public async test(): Promise<boolean> {
    try {
      const tempFile = path.join(process.cwd(), 'temp.txt');
      const createStream = fs.createWriteStream(tempFile);
      await waitForStreamClose(createStream);
      await this.fileCreate('nc-test-file.txt', {
        path: tempFile,
        mimetype: '',
        originalname: 'temp.txt',
        size: '',
      });
      fs.unlinkSync(tempFile);
      return true;
    } catch (e) {
      throw e;
    }
  }
}

/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Naveen MR <oof1lab@gmail.com>
 * @author Pranav C Balan <pranavxc@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
