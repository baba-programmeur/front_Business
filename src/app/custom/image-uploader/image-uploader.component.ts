import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-image-uploader-component',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  file: File;
  maintainAspectRatio = true;

  constructor(public dialogRef: MatDialogRef<ImageUploaderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }


  dataURItoBlob(dataURI: string) {
    console.log(dataURI);
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpeg'
    });
  }

  onCancel() {
    this.dialogRef.close({canceled: true});
  }

  onSubmit() {
    this.dialogRef.close({canceled: false, base64: this.croppedImage, file: this.file});
  }

}
