import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
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
  constructor(private http: HttpClient) { }
  treeControl = new NestedTreeControl<Member>(node => node.recruited);
  dataSource = new MatTreeNestedDataSource<Member>();
  private subscription: Subscription;
  private mummyMoney;
  ngOnInit() {
    const source = interval(1000);
    this.subscription = source.subscribe(this.bla);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  bla = ()=> {
    this.http.get('http://localhost:3030/mummy_money').subscribe((res) => {
      this.mummyMoney = res
    });
  };
}
