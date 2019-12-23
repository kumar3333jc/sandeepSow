import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake'
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @ViewChild('genPDF') genPDF: ElementRef;
  applicantsList: any[] = [];
  pdfContent: any;
  filepath: any;
  token: string = "0123456789123456";
  constructor(private applicationService: ApplicationService) { }
  ngOnInit() {
    this.getresult();
  };

  getresult() {
    this.applicationService.getItem().subscribe((data) => {
      console.log('DATA======>'+data);
      this.applicantsList = data;

      this.applicantsList[0] = this.applicantsList[this.applicantsList.length - 1];
      this.applicantsList[0]= this.decryptUsingAES256(this.applicantsList[0].form_value);
      this.applicantsList[0]= JSON.parse(this.applicantsList[0])
      console.log(this.applicantsList);

    }, (error: any) => {
      swal.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Unable to retrive Data!'
      });
    })
  };
  decryptUsingAES256(data: any) {
    let _key = CryptoJS.enc.Utf8.parse(this.token);
    let _iv = CryptoJS.enc.Utf8.parse(this.token);
    const decrypted = CryptoJS.AES.decrypt(
      data, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      return decrypted
  }

  pdf() {
    const html = htmlToPdfmake(this.genPDF.nativeElement.innerHTML);
    const docDefinition = {
      content: [
        html
      ]
    };
    console.log(docDefinition)
    pdfMake.createPdf(docDefinition).download();
  }


  print() {
    const html = htmlToPdfmake(this.genPDF.nativeElement.innerHTML);
    const docDefinition = {
      content: [
        html
      ]
    };
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    console.log(pdfDocGenerator);
    const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfDocGenerator;
      document.body.appendChild(iframe);
      iframe.contentWindow.print();
  }
};


