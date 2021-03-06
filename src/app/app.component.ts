import { Component, OnInit } from '@angular/core';
import { interval, Subscription, generate } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Member } from './model/member';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {  
  treeControl = new NestedTreeControl<Member>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Member>();
  private subscription: Subscription;
  mummyMoney: number;
  currentWeek: number;
  average: number;
  ended = false;
  joined: number;
  eliminated: number;
  totalInvestors: number;
  totalMembers: number;
  started = false;
  constructor(private http: HttpClient) {
    this.dataSource.data = []
  }
  hasChild = (_: number, member: Member) => {
    return !!member.children && member.children.length > 0
  };
  start() {
    this.started = true;
    const source = interval(2000);
    this.subscription = source.subscribe(this.updateData);
  }
  ngOnInit() { }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  getMember = (membersDocuments, memberId) => {
    const member = membersDocuments.filter(x => x.id === memberId)[0];
    if (member.recruited.length > 0) {
      member.children = []
      member.recruited.forEach((childId) => {
        const child = this.getMember(membersDocuments, childId);
        member.children.push(child)
      })
    }
    return member;
  };
  updateData = ()=> {
    this.http.get('http://localhost:3030/timelapse').subscribe((res) => {
      this.currentWeek = res['current_week'];
      this.ended = res['program_ended'];
      if (this.ended) {
        this.subscription.unsubscribe();
      }
    })
    this.http.get('http://localhost:3030/investors').subscribe((res: number) => {
      this.totalInvestors = res
    })
    this.http.get('http://localhost:3030/members').subscribe((res: Array<any>) => {
      let sum = 0;
      let joined = 0;
      let eliminated = 0;
      res.forEach((x) => {
        if (x.id !== 0) {
          sum = sum + x.money;
          if (x['week_joined'] == this.currentWeek) {
            joined = joined + 1
          }
          if (x['week_eliminated'] == this.currentWeek) {
            eliminated = eliminated + 1
          }
        }
      });
      this.totalMembers = res.length - 1;
      this.joined = joined;
      this.eliminated = eliminated;
      this.average = sum / res.length;
      const mummy = this.getMember(res, 0)
      this.mummyMoney = mummy.money;
      this.dataSource.data = [mummy];
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll();
    })
  };
}
