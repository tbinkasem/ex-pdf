import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs  = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew-Bold.ttf',
    italics: 'THSarabunNew-Italic.ttf',
    bolditalics: 'THSarabunNew-BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  letterObj = {
    from: 'Teera',
    to: 'Peera',
    data: 'This plugin is based on several specs, including : The HTML5 File API http: //www.w3.org/TR/FileAPI/ The (now-defunct) Directories and System extensions Latest: http: //www.w3.org/TR/2012/WD-file-system-api-20120417/ Although most of the plugin code was written when an earlier spec was current: http: //www.w3.org/TR/2011/WD-file-system-api-20110419/ It also implements the FileWriter spec : http: //dev.w3.org/2009/dap/file-system/file-writer.html'
  }

  pdfObj: any;

  constructor(public navCtrl: NavController,
    private file: File,
    private fileOpener: FileOpener,
    private plt: Platform
    ) {

  }

  createPdF(){
    var docDefinition = {
      content: [
        {text: 'REMINDER', style: 'header'},
        {text: new Date().toTimeString(), alignment: 'right'},
        
        {text: 'From', style: 'subheader' },
        {text: this.letterObj.from},

        {text: 'To', style: 'subheader'},
        this.letterObj.to,

        {text: this.letterObj.data, style: 'story', margin: [0,15,0,15]},

        {
          ul: [
            'HTML',
            'PHP',
            'MYSQL'
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0,20,0,20]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%'
        }
      },
      defaultStyle: {
        font: 'THSarabunNew'
      }
    }

    this.pdfObj = pdfMake.createPdf(docDefinition);

  }

  downloadPDF(){
    if(this.plt.is('cordova')){
      this.pdfObj.getBuffer((buffer: any)=>{
        var utf8 = new Uint8Array(buffer);
        var binaryArray = utf8.buffer;
        var blob = new Blob([binaryArray], {type: 'application/pdf'});

        this.file.writeFile(this.file.dataDirectory, 'myPDF.pdf', blob, {replace: true}).then(fileEntry =>{
          this.fileOpener.open(this.file.dataDirectory + 'myPDF.pdf', 'application/pdf');
        })
      });
    }else{
      this.pdfObj.download();
    }
  }

}
