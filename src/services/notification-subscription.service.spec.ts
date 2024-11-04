import { TestBed } from '@angular/core/testing';

import { NotificationSubscriptionServiceService } from './notification-subscription-service.service';

describe('NotificationSubscriptionServiceService', () => {
  let service: NotificationSubscriptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationSubscriptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
