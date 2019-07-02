import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) { }
  public title = 'dummy-dashboard';
  private intervalId;
  private subscription: Subscription;
  private mummyMoney;
  ngOnInit() {
    const source = interval(1000);
    const text = 'Your Text Here';
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
