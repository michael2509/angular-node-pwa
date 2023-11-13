import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';

  vapidPublicKey = "BAqAYADAWIdDqVw6ISqz69hzlH14yR4r8GtX-9fBqAENXOqo36kYKNV__1VXmzRxJC_jn2xniGKg2I-d84uUzt8";

  constructor(private swPush: SwPush, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.pushSubscription();
    this.swPush.notificationClicks.subscribe(data => {
      console.log(data);

    })
  }

  pushSubscription() {

    if (!this.swPush.isEnabled) {
      console.log("notif not enabled");
      return;
    }

    this.swPush.requestSubscription({
      serverPublicKey: this.vapidPublicKey
    }).then(subscription => {
      console.log(JSON.stringify(subscription));

      this.httpClient.post("http://localhost:5000/subscribe", subscription).subscribe(() => {
        console.log("subscribed to notification");
      });
    }).catch(error => console.log);
  }
}
