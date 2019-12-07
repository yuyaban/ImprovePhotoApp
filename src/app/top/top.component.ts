import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { FileApiService } from '../services/file-api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { resolve } from 'q';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  @ViewChild('fileInput', {static: false})
  fileInput: ElementRef;

  file: FormControl;
  imageBlobUrl: SafeUrl = '';

  imgList: {
    src: string|ArrayBuffer;
  }[];

  constructor(
    private builder: FormBuilder,
    private fileApiService: FileApiService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.file = this.builder.control('');
  }

  async change($event) {
    this.imgList = [];

    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });

    Array.prototype.forEach.call(this.fileInput.nativeElement.files, async (file: File) => {
      console.log(file);

      const reader = new FileReader();
      reader.onloadend = async event => {
        // result の中に Data URL 化された画像データが格納される
        const { result } = event.target as FileReader;
        this.imgList.push({
          src: result
        });

        this.fileApiService.postImage(file)
        .subscribe((val) => {
          this.createImageFromBlob(val);
        },
        () => {
          console.log('POST - getThumbnail - observable is now completed.');
        });

        // console.log('return:' + image);
        // const url = window.URL.createObjectURL(image);
        // console.log('url' + url);
        // this.imageBlobUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        // console.log('imageBlobUrl' + this.imageBlobUrl);
      };

      // バイナリデータのまま読み込むメソッド
      reader.readAsDataURL(file);
    });
  }

  upload() {
      Array.prototype.forEach.call(this.fileInput.nativeElement.files, (file: File) => {
        console.log('upload file:' + file);
        const reader = new FileReader();
        const data = {
          operation: file.name,
          base64Image: reader.readAsBinaryString(file)
        };
        this.fileApiService.postImage(file)
        .subscribe((val) => {
          this.createImageFromBlob(val);
        },
        response => {
          console.log('POST - getThumbnail - in error', response);
        },
        () => {
          console.log('POST - getThumbnail - observable is now completed.');
        });
        console.log('success');
      });
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageBlobUrl = reader.result;
      console.log(this.imageBlobUrl);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
