import { Component, OnInit } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { MAction } from 'src/app/app.models';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['.././users.component.css']
})



export class UserReportComponent implements OnInit {
  data: MAction[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.load();
  }


  private load() {
    this.userService.getReport().subscribe((data) => {
      this.data = data as MAction[];
    })
  }

}
