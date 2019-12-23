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
    // this.getVersion();
    if (navigator.onLine) {
      this.onlineFlag = true;
    }
    //this.version = environment.version
    this.es.ipcRenderer.on('app_version', (event) => {
      console.log('app version');
      console.log(event);

      // console.log(event.version);
      // this.version = event.version

    });
    this.es.ipcRenderer.on('update_available', (event) => {
      console.log('avail-triggered');
      console.log(event);

    });
    this.es.ipcRenderer.on('update_downloaded', (event) => {
      console.log('downtriggered')
      // console.log(event);
    });
    this.es.ipcRenderer.on('download-progress', (event) => {
      console.log('downtriggered')
      console.log(event);
    });
  }
  proceed() {
    this.router.navigate(['/Page1'])
  }
  restart() {
   this.es.ipcRenderer.send('restart_app');
  }

}
