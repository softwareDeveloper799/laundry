export var global_data = {
  url: "http://localhost/laundry/api/",
  api_key: "1",
  headers: new Headers({ 'Content-Type': 'application/json' }),

  bookingArraye: {
    "api_key": "1",
    "action": "book_appointment",
    "first_name": "John",
    "last_name": "Doe",
    "email": "traparshad@gmail.com",
    "phone": "+18898889666",
    "password": "12345678",
    "zipcode": "54481",
    "address": "7344 East William Street",
    "city": "Stevens Point",
    "state": "WI",
    "staff_id": "1",
    "booking_pickup_date_time_start": "booking_pickup_date_time_start",
    "booking_pickup_date_time_end": "booking_pickup_date_time_end",
    "booking_delivery_date_time_start": "booking_del_date_time_start",
    "booking_delivery_date_time_end": "booking_del_date_time_end",
    "user_type": "existing",
    "coupon_code": "bi",
    "payment_method": "strip",
    "sub_total": "15",
    "discount": "2",
    "tax": "7",
    "net_amount": "20",
    "partial_amount": "15",
    "transaction_id": "AS7W667878A",
    "cart_detail": [
      {
        "units_id": "1",
        "service_id":"1",
        "unit_name":"Pant(s)",
        "unit_qty": "1",
        "unit_rate": "10.00",
      }
    ]
  }

  //  localStorage.setItem('userInfo',JSON.stringify(this.dataResponse.response));
  //  localStorage.setItem('cart_detail', JSON.stringify(this.cart_detail));
  //  localStorage.setItem('total_amt', this.grandTotal);
  //  localStorage.setItem('zipCode', this.zipCode);
  //  localStorage.setItem('coupon_code', this.getCoupon);
  //  localStorage.setItem('sub_total', this.totalAmt);
  // localStorage.setItem('discount', this.couponDiscount); 
  // localStorage.setItem('tax', this.taxAmmount); 
  // localStorage.setItem('booking_pickup_date_time_start',this.selectedDate+" "+item.substring(0, 5)+":00");
  // localStorage.setItem('booking_delivery_date_time_start',this.selectedDate+" "+item.substring(0, 5)+":00");
  // localStorage.setItem('payment_type',"Pay Locally"); 
  // localStorage.setItem('transaction_id',this.trasactionId); 
}
