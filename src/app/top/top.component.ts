import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  @ViewChild('fileInput', {static: false})
  fileInput: ElementRef;

  file: FormControl;

  imgList: {
    src: string|ArrayBuffer;
  }[];

  constructor(
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.file = this.builder.control('');
  }

  change($event) {
    this.imgList = [];

    Array.prototype.forEach.call(this.fileInput.nativeElement.files, (file: File) => {
      console.log(file);

      const reader = new FileReader();
      reader.onloadend = event => {
        // result の中に Data URL 化された画像データが格納される
        const { result } = event.target as FileReader;
        this.imgList.push({
          src: result
        });

      };

      // バイナリデータのまま読み込むメソッド
      reader.readAsDataURL(file);
    });
  }

  upload() {
    console.log(this.fileInput.nativeElement.files);
  }
}
