import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Commenting api.service to use custom api service so that we will be able to make custom queries as API.service always regenerate
// import { APIService, Restaurant } from '../API.service';

// Custom API Service File
import { APIService, Restaurant } from '../custom-api.service';

/** Subscription type will be inferred from this library */
import { ZenObservable } from 'zen-observable-ts';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent implements OnInit, OnDestroy {

  public createForm: FormGroup;
 /* declare restaurants variable */
 public restaurants: Array<Restaurant> = [];
/** Declare subscription variable */
private subscription: ZenObservable.Subscription | null = null;

  constructor(private api: APIService, private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  public onCreate(restaurant: Restaurant) {
    this.api
      .CreateRestaurant(restaurant)
      .then(() => {
        console.log('item created!');
        this.createForm.reset();
      })
      .catch((e) => {
        console.log('error creating restaurant...', e);
      });
  }
  ngOnInit(): void {

      /* subscribe to new restaurants being created */
  this.subscription = this.api.OnCreateRestaurantListener.subscribe(
    (event: any) => {
      const newRestaurant = event.value.data.onCreateRestaurant;
      this.restaurants = [newRestaurant, ...this.restaurants];
    }
  );

        /* fetch restaurants when app loads */
        this.api.ListRestaurants().then((event) => {
          this.restaurants = event.items as Restaurant[];
        });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }
}
