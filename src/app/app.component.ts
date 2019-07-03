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
  private mummyMoney;
  constructor(private http: HttpClient) {
    this.dataSource.data = []
  }
  hasChild = (_: number, member: Member) => {
    return !!member.children && member.children.length > 0
  };
  ngOnInit() {
    const source = interval(1000);
    this.subscription = source.subscribe(this.updateData);
  }
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
    this.http.get('http://localhost:3030/members').subscribe((res) => {
      const mummy = this.getMember(res, 0)
      this.mummyMoney = mummy.money;
      this.dataSource.data = [mummy];
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll();
    })
  };
}
