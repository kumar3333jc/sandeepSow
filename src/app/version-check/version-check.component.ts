import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../services/application.service';
import { ElectronService } from 'ngx-electron';


@Component({
  selector: 'app-version-check',
  templateUrl: './version-check.component.html',
  styleUrls: ['./version-check.component.css']
})
export class VersionCheckComponent implements OnInit {
  version: any;
  onlineFlag: boolean = false;

  constructor(public router: Router, private as: ApplicationService, private es: ElectronService) {
  }
  ngOnInit() {
    this.checkVersion();
    if (navigator.onLine) {
      this.onlineFlag = true;
    }
    //this.version = environment.version
    this.es.ipcRenderer.on('update_available', () => {
      console.log('avail-triggered');
      //console.log(event);
    });
    this.es.ipcRenderer.on('update_downloaded', () => {
      console.log('downtriggered')
    });
    this.es.ipcRenderer.on('download-progress', () => {
      console.log('downtriggered')
    });
  }
  proceed() {
    this.router.navigate(['/Page1'])
  }
  restart() {
    this.es.ipcRenderer.send('restart_app');
  }
  checkVersion() {
   this.as.getVersion().subscribe((data)=>{
     this.version= data.version;
   })
  }
 
}
